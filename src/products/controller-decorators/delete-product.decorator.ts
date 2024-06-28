import {applyDecorators, BadRequestException, Delete, HttpException, NotFoundException} from "@nestjs/common";
import {ApiBadRequestResponse, ApiNoContentResponse, ApiNotFoundResponse} from "@nestjs/swagger";

export function DeleteProductDecorator(){
    return applyDecorators(
        Delete(':id'),
        ApiNoContentResponse({
            description: 'Product deleted with such id',
            schema: {example: new HttpException('Product with id #${id} deleted',204)}
        }),
        ApiNotFoundResponse({
            description: 'There is no product with given id to delete',
            schema: {example: new NotFoundException('Product with id ${id} not found').getResponse()}
        }),
        ApiBadRequestResponse({description:'Not valid id',schema:{example:new BadRequestException("Validation failed (numeric string is expected)").getResponse()}})
    )
}