import {ConflictException, INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import * as request from "supertest";
import {CreateCategoryDto} from "../src/products/categories/dto/create-category.dto";
import {Category} from "../src/products/entities/category.entity";
import {DataSource, Repository} from "typeorm";

describe('CategoriesController (e2e)', () => {
    let app: INestApplication;
    let createdCategory: Category;
    let categoryRep: Repository<Category>


    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe())
        await app.init();

        const dataSource = app.get<DataSource>(DataSource)
        categoryRep = dataSource.getRepository<Category>(Category)

    })

    describe('POST /categories',  () => {
        it('should create a new category', async () => {
            const response = await request(app.getHttpServer())
                .post('/categories')
                .send({name: 'TestingCategoriesCategory'} as CreateCategoryDto)
                .expect(201);

            createdCategory = response.body
            expect(response.body)
                .toEqual({
                    id: expect.any(Number),
                    name: createdCategory.name
                });
        });


        it('should return 409 if category with given name already exists', async () => {
            // Assuming the category already exists
            const response = await request(app.getHttpServer())
                .post('/categories')
                .send({name: createdCategory.name} as CreateCategoryDto)
                .expect(409, new ConflictException(`A category with name '${createdCategory.name}' already exists in db`).getResponse())

        });

        it('should return 400 for validation errors', async () => {
            await request(app.getHttpServer())
                .post('/categories')
                .send({
                    name: true,
                })
                .expect(400, {
                    message: [
                        "name must be a string"
                    ],
                    error: 'Bad Request',
                    statusCode: 400
                });
        });
    });
    describe('GET /categories', ()=>{
        it('should return an array of categories', async () => {
            const response = await request(app.getHttpServer())
                .get('/categories')
                .expect(200);

            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining(createdCategory)
            ]))
        });

    })

    afterAll(async () => {
        try {
            await categoryRep.delete(createdCategory.id)
        } catch (e) {
            console.log(e)
        }
        await app.close()
    })
})