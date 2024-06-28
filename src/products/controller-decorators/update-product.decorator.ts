import {applyDecorators, BadRequestException, NotFoundException, Patch} from "@nestjs/common";
import {ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOkResponse, PartialType} from "@nestjs/swagger";
import {Product} from "../entities/product.entity";
import {UpdateProductDto} from "../dto/update-product.dto";

export function UpdateProductDecorator() {
    return applyDecorators(
        Patch(':id'),
        ApiOkResponse({type: PartialType(Product)}),
        ApiNotFoundResponse({
            description: "Not found product with given id",
            schema: {
                example: new NotFoundException('Product with id ${productId} not found').getResponse()
            }
        }),
        ApiBadRequestResponse({
            description: "Category with given id does not exists in db or id validation failed",
            content: {
                'application/json': {
                    examples: {
                        'Example 1': {value:new BadRequestException('Category with id ${categoryId} not found').getResponse()},
                        'Example 2': {value:new BadRequestException("Validation failed (numeric string is expected)").getResponse()}
                    }
                }
            },
        }),
        ApiBody({type: UpdateProductDto}),
    )
}