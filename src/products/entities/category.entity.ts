import {Product} from "./product.entity";
import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
@Index('name_unique',['name'],{unique:true})
export class Category {
    @PrimaryGeneratedColumn({primaryKeyConstraintName:'category_pkey'})
    @ApiProperty({example:1})
    id: number;

    @Column()
    @ApiProperty({example:'Laptops'})
    name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}