import {Product} from "./product.entity";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    @ApiProperty({example:1})
    id: number;

    @Column()
    @ApiProperty({example:'Laptops'})
    name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}