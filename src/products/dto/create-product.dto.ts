import {IsNotEmpty, IsString, IsNumber, IsPositive} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        description: 'Name of the product',
        example: 'Laptop'
    })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'Description of the product',
        example: 'A high-end gaming laptop'
    })
    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @ApiProperty({
        description: 'Price of the product',
        example: 1500
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    readonly price: number;

    @ApiProperty({
        description: 'ID of the category',
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    readonly categoryId: number;
}
