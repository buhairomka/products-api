import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {Product} from "./entities/product.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CategoriesService} from "./categories/categories.service";
import {Category} from "./entities/category.entity";

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private productsRep: Repository<Product>,
        private categoryService: CategoriesService
    ) {
    }

    async create(createProductDto: CreateProductDto) {
        const category = await this.categoryService.findOne(createProductDto.categoryId)
        if (!category) throw new BadRequestException(`Category with id ${createProductDto.categoryId} does not exists in db`);

        const product: Product = new Product();
        product.name = createProductDto.name;
        product.description = createProductDto.description;
        product.price = createProductDto.price;
        product.category = category;

        return this.productsRep.save(product);
    }

    findAll() {
        return this.productsRep
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .select([
                "product.id",
                "product.name",
                "category.id",
                "category.name"
            ])
            .getMany();
        // return this.productsRep.find({loadRelationIds:true});
    }

    findOne(id: number) {
        return this.productsRep.findOneBy({
            id,
        })
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const category = await this.categoryService.findOne(updateProductDto.categoryId);
        if (!category) throw new BadRequestException(`Category with id ${updateProductDto.categoryId} not found`);

        const productExists: boolean = await this.productsRep.existsBy({id});
        if (!productExists) throw new NotFoundException(`Product with id ${id} not found`);

        const product: Product = new Product();
        product.name = updateProductDto.name;
        product.description = updateProductDto.description;
        product.price = updateProductDto.price;
        product.category = category;
        product.id = id;
        return this.productsRep.save(product);
    }

    remove(id: number) {
        return this.productsRep.delete(id)
    }

    isExistProduct(name:string, category:number) {

        return this.productsRep.findOneBy({
            name:name,
            category:{id:category}
        });
    }
}
