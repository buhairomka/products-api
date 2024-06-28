import {Test, TestingModule} from '@nestjs/testing';
import {BadRequestException, INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import {DataSource, Repository} from "typeorm";
import {Category} from "../src/products/entities/category.entity";
import {Product} from "../src/products/entities/product.entity";

describe('ProductsController (e2e)', () => {
    let app: INestApplication;

    let categoryRep: Repository<Category>
    let productRep: Repository<Product>
    let createdProduct: Product;
    let productToSend: () => {
        price: number;
        name: string;
        description: string;
        categoryId: undefined
    } = () => ({
        name: 'Laptop',
        description: 'Very cool gaming laptop',
        price: 1500,
        categoryId: undefined
    });
    let testCategory: Category;
    let authToken;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe())
        await app.init();

        const dataSource = app.get<DataSource>(DataSource)
        // dataSource = moduleFixture.get<DataSource>(DataSource);

        // Створення тестової категорії
        let category = new Category();
        category.name = 'TestCategory';
        categoryRep = dataSource.getRepository<Category>(Category)
        productRep = dataSource.getRepository<Product>(Product)
        testCategory = await categoryRep.save(category);


        const authRes = await request(app.getHttpServer())
            .get('/auth/token')
            .expect(200)
        authToken = authRes.body.token
    });

    describe('POST /products', () => {
        it('should return 401 if unauthorized', async () => {
            await request(app.getHttpServer())
                .post('/products')
                .send({
                    name: '',
                    description: '',
                    price: -100,
                    categoryId: 'invalid'
                })
                .expect(401);
        })

        it('should return 401 if unauthorized, in case not valid token', async () => {
            await request(app.getHttpServer())
                .post(`/products`)
                .set('Token','beliberdablablablablablatokensupergood')
                .expect(401);
        })

        it('should create a new product', async () => {
            const response = await request(app.getHttpServer())
                .post('/products')
                .set('Token', `${authToken}`)
                .send(Object.assign(productToSend(), {categoryId: testCategory.id}))
                .expect(201);

            createdProduct = response.body
            const readonlyProduct = productToSend()
            expect(response.body)
                .toEqual({
                    id: expect.any(Number),
                    name: readonlyProduct.name,
                    description: readonlyProduct.description,
                    price: readonlyProduct.price,
                    category: expect.objectContaining({
                        id: testCategory.id,
                        name: testCategory.name
                    }),
                });
        });

        it('should return 400 if category does not exist', async () => {
            await request(app.getHttpServer())
                .post('/products')
                .set('Token', `${authToken}`)
                .send({
                    name: 'Laptop',
                    description: 'Very cool gaming laptop',
                    price: 1500,
                    categoryId: 999 // non-existing category
                })
                .expect(400, {
                        message: 'Category with id 999 does not exists in db',
                        error: 'Bad Request',
                        statusCode: 400
                    }
                );
        });

        it('should return 409 if product already exists', async () => {
            // Assuming the product already exists
            await request(app.getHttpServer())
                .post('/products')
                .set('Token', `${authToken}`)
                .send(Object.assign(productToSend(), {categoryId: testCategory.id}))
                .expect(409, {
                    statusCode: 409,
                    message: `A product with name '${createdProduct.name}' and category id #${testCategory.id} already exists in db`,
                    error: 'Conflict'
                });
        });

        it('should return 400 for validation errors', async () => {
            await request(app.getHttpServer())
                .post('/products')
                .set('Token', `${authToken}`)
                .send({
                    name: '',
                    description: '',
                    price: -100,
                    categoryId: 'invalid'
                })
                .expect(400, {
                    message: [
                        'name should not be empty',
                        'description should not be empty',
                        'price must be a positive number',
                        'categoryId must be a positive number',
                        'categoryId must be a number conforming to the specified constraints'
                    ],
                    error: 'Bad Request',
                    statusCode: 400
                });
        });
    });

    describe('GET /products/:id', () => {

        it('should return 401 if unauthorized', async () => {
            await request(app.getHttpServer())
                .get(`/products/${createdProduct.id}`)
                .expect(401);
        })

        it('should return a product', async () => {
            const response = await request(app.getHttpServer())
                .get(`/products/${createdProduct.id}`)
                .set('Token', `${authToken}`)
                .expect(200);

            expect(response.body)
                .toEqual(createdProduct);
        });

        it('should return 404 if product is not found', async () => {
            await request(app.getHttpServer())
                .get('/products/999')
                .set('Token', `${authToken}`)
                .expect(404, {
                    statusCode: 404,
                    message: `Product with id #999 not found`,
                    error: 'Not Found'
                });
        });

        it('should return 400 if id is not a number', async () => {
            await request(app.getHttpServer())
                .get('/products/invalid')
                .set('Token', `${authToken}`)
                .expect(400, {
                    statusCode: 400,
                    message: 'Validation failed (numeric string is expected)',
                    error: 'Bad Request'
                });
        });
    });


    describe('GET /products', () => {

        it('should return 401 if unauthorized', async () => {
            await request(app.getHttpServer())
                .get(`/products`)
                .expect(401);
        })

        it('should return an array of products', async () => {
            const response = await request(app.getHttpServer())
                .get('/products')
                .set('Token', `${authToken}`)
                .expect(200);

            // expect(response.body).toContain(createdProduct);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining(createdProduct)
            ]))
        });
    });


    describe('PATCH /products/:id', () => {

        it('should return 401 if unauthorized', async () => {
            await request(app.getHttpServer())
                .patch(`/products/1`)
                .expect(401);
        })

        it('should update a product', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/products/${createdProduct.id}`)
                .set('Token', `${authToken}`)
                .send({
                    name: 'Updated Laptop',
                    description: 'Updated description',
                    price: 2000,
                })
                .expect(200);

            expect(response.body).toEqual({
                id: createdProduct.id,
                name: 'Updated Laptop',
                description: 'Updated description',
                price: 2000,
                category: createdProduct.category,
            });
        });

        it('should return 404 if product is not found', async () => {
            await request(app.getHttpServer())
                .patch('/products/999999')
                .set('Token', `${authToken}`)
                .send({
                    name: 'Updated Laptop',
                    description: 'Updated description',
                    price: 2000,
                    categoryId: testCategory.id
                })
                .expect(404, {
                    statusCode: 404,
                    message: 'Product with id 999999 not found',
                    error: 'Not Found'
                });
        });

        it('should return 400 if category does not exists in db', async () => {
            await request(app.getHttpServer())
                .patch(`/products/${createdProduct.id}`)
                .set('Token', `${authToken}`)
                .send({categoryId: 1847628341})
                .expect(400, new BadRequestException(`Category with id ${1847628341} not found`).getResponse())
        });

        it('should return 400 for validation errors', async () => {
            await request(app.getHttpServer())
                .patch('/products/1')
                .set('Token', `${authToken}`)
                .send({
                    name: true,
                    description: true,
                    price: -2000,
                    categoryId: 'invalid'
                })
                .expect(400, {
                        message: [
                            'name must be a string',
                            'description must be a string',
                            'price must be a positive number',
                            'categoryId must be a positive number',
                            'categoryId must be a number conforming to the specified constraints'
                        ],
                        error: 'Bad Request',
                        statusCode: 400
                    }
                );
        });
    });


    describe('DELETE /products/:id', () => {

        it('should return 401 if unauthorized', async () => {
            await request(app.getHttpServer())
                .delete(`/products/1`)
                .expect(401);
        })

        it('should delete a product', async () => {
            await request(app.getHttpServer())
                .delete(`/products/${createdProduct.id}`)
                .set('Token', `${authToken}`)
                .expect(204);
        });

        it('should return 404 if product is not found', async () => {
            await request(app.getHttpServer())
                .delete('/products/999')
                .set('Token', `${authToken}`)
                .expect(404, {
                    statusCode: 404,
                    message: 'Product with ID 999 not found',
                    error: 'Not Found'
                });
        });

        it('should return 400 if id is not a number', async () => {
            await request(app.getHttpServer())
                .delete('/products/invalid')
                .set('Token', `${authToken}`)
                .expect(400, {
                    statusCode: 400,
                    message: 'Validation failed (numeric string is expected)',
                    error: 'Bad Request'
                });
        });
    });

    afterAll(async () => {
        try {
            await productRep.delete(createdProduct.id)
            await categoryRep.delete(testCategory.id)
        } catch (e) {
            console.log(e)
        }

        await app.close()
    })
});
