import {applyDecorators, BadRequestException, Post} from "@nestjs/common";
import {ApiBadRequestResponse, ApiCreatedResponse} from "@nestjs/swagger";
import {Category} from "../../entities/category.entity";

export function CreateCategoryDecorator(){
    return applyDecorators(
        Post(),
        ApiCreatedResponse({
            description: 'The category has been successfully created.',
            type: Category,
        }),
        ApiBadRequestResponse({
            description:'Name validation error',
            schema:{
                example:new BadRequestException([
                    "name must be a string",
                    "name should not be empty"
                ]).getResponse()
            }
        })
    )
}
