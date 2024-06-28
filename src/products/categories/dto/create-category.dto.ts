import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCategoryDto{
    @ApiProperty({
        description: 'Name of the category',
        example: 'Laptops'
    })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

}
