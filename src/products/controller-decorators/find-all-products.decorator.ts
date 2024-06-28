import {applyDecorators, Get} from "@nestjs/common";
import {ApiOkResponse} from "@nestjs/swagger";
import {Product} from "../entities/product.entity";

export function FindAllProductsDecorator() {
    return applyDecorators(
        Get(),
        ApiOkResponse({description: 'The product has been successfully created.', type: Product, isArray: true})
    )

}