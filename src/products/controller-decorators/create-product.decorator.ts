import {applyDecorators, BadRequestException, ConflictException, HttpStatus, Post} from "@nestjs/common";
import {ApiConflictResponse, ApiCreatedResponse, ApiResponse} from "@nestjs/swagger";
import {Product} from "../entities/product.entity";

export function CreateProductDecorator() {
    return applyDecorators(
        Post(),
        ApiCreatedResponse({description: 'The product has been successfully created.', type: Product}),
        ApiConflictResponse({
            description: 'The product already exists.',
            schema: {
                example: new ConflictException("A product with name 'Laptop' and category id #1 already exists in db").getResponse()
            }
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Category does not exists or validation failed',
            content: {
                'application/json': {
                    examples: {
                        'Example 1': {
                            value: new BadRequestException('Category with id ${createProductDto.categoryId} does not exists in db').getResponse()
                        },
                        'Example 2': {
                            value: new BadRequestException([
                                "name must be a string",
                                "description must be a string",
                                "description should not be empty",
                                "price must be a positive number",
                                "categoryId must be a positive number",
                                "categoryId must be a number conforming to the specified constraints"
                            ]).getResponse()
                        },
                    },
                },
            },
        })
    )
}