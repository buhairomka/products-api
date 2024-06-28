import {Body, Controller, Get, Post} from '@nestjs/common';
import {ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CategoriesService} from "./categories.service";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {Category} from "../entities/category.entity";
import {CreateCategoryDecorator} from "./decorators/create-category.decorator";
import {FindAllCategoriesDecorator} from "./decorators/find-all-categories.decorator";

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {
    }

    @CreateCategoryDecorator()
    create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.create(createCategoryDto);
    }

    @FindAllCategoriesDecorator()
    findAll() {
        return this.categoriesService.findAll();
    }

}