import {Body, ConflictException, Controller, Get, Post} from '@nestjs/common';
import {ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CategoriesService} from "./categories.service";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {Category} from "../entities/category.entity";
import {CreateCategoryDecorator} from "./decorators/create-category.decorator";
import {FindAllCategoriesDecorator} from "./decorators/find-all-categories.decorator";
import {Auth} from "../../auth/auth.decorator";

@ApiTags('Categories')
@Controller('categories')
@Auth()
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {
    }

    @CreateCategoryDecorator()
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        const isCategoryExist = await this.categoriesService.isExistCategory(createCategoryDto.name)
        if (isCategoryExist) throw new ConflictException(`A category with name '${createCategoryDto.name}' already exists in db`)
        return this.categoriesService.create(createCategoryDto);
    }

    @FindAllCategoriesDecorator()
    findAll() {
        return this.categoriesService.findAll();
    }

}
