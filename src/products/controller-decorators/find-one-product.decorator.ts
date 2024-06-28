import {applyDecorators, BadRequestException, Get, NotFoundException, ParseIntPipe} from "@nestjs/common";
import {ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse} from "@nestjs/swagger";
import {Product} from "../entities/product.entity";

export function FindOneProductDecorator() {
    return applyDecorators(
        Get(':id'),
        ApiOkResponse({description: 'Returns a product by id.', type: Product}),
        ApiNotFoundResponse({
            description: 'There is no product with such id', schema: {
                example: new NotFoundException({
                    "message": "Product with id #1 not found",
                    "error": "Not Found",
                    "statusCode": 404
                }).getResponse()
            }
        }),
        ApiBadRequestResponse({description:'Id is not number',schema:{example:new BadRequestException("Validation failed (numeric string is expected)").getResponse()}})
    )
}