import {applyDecorators, Get} from "@nestjs/common";
import {ApiOkResponse} from "@nestjs/swagger";
import {Category} from "../../entities/category.entity";

export function FindAllCategoriesDecorator(){
    return applyDecorators(
        Get(),
        ApiOkResponse({type:Category,isArray:true}),
    )
}