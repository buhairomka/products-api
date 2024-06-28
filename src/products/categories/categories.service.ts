import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "../entities/category.entity";
import {Repository} from "typeorm";
import {CreateCategoryDto} from "./dto/create-category.dto";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) {
    }

    async create({name}:CreateCategoryDto){
        const category:Category = new Category()
        category.name = name
        return this.categoriesRepository.save(category);

    }

    async findOne(id: number) {
        return await this.categoriesRepository.findOneBy({id})
    }

    async findAll(){
        return await this.categoriesRepository.find()
    }
}
