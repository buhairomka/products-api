import {
    Body,
    ConflictException,
    Controller,
    HttpException,
    NotFoundException,
    Param,
    ParseIntPipe
} from '@nestjs/common';
import {ProductsService} from './products.service';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {ApiTags} from "@nestjs/swagger";
import {CreateProductDecorator} from "./controller-decorators/create-product.decorator";
import {FindAllProductsDecorator} from "./controller-decorators/find-all-products.decorator";
import {FindOneProductDecorator} from "./controller-decorators/find-one-product.decorator";
import {UpdateProductDecorator} from "./controller-decorators/update-product.decorator";
import {DeleteProductDecorator} from "./controller-decorators/delete-product.decorator";
import {Auth} from "../auth/auth.decorator";

@ApiTags('Products')
@Controller('products')
@Auth()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {
    }

    @CreateProductDecorator()
    async create(@Body() createProductDto: CreateProductDto) {
        const {name, categoryId} = createProductDto
        const isProductExist = await this.productsService.isExistProduct(name, categoryId)
        if (isProductExist) throw new ConflictException(`A product with name '${name}' and category id #${categoryId} already exists in db`)
        return await this.productsService.create(createProductDto);

    }

    @FindAllProductsDecorator()
    findAll() {
        return this.productsService.findAll();
    }

    @FindOneProductDecorator()
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const res = await this.productsService.findOne(+id)
        if (res === null) {
            throw new NotFoundException(`Product with id #${id} not found`)
        } else return res
    }

    @UpdateProductDecorator()
    update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(+id, updateProductDto);
    }


    @DeleteProductDecorator()
    async remove(@Param('id', ParseIntPipe) id: number) {
        const result = await this.productsService.remove(+id);
        if (result.affected === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        throw new HttpException(null,204)

    }
}
