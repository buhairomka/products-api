import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Category} from "./category.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
@Unique('product_unique',['name','category'])
export class Product {
    @PrimaryGeneratedColumn({type:'int',primaryKeyConstraintName:'product_pkey'})
    @ApiProperty({example:1})
    id: number;

    @Column({type:'text'})
    @ApiProperty({example:'Laptop'})

    name: string;

    @Column({type:'text'})
    @ApiProperty({example:'Very cool gaming laptop'})
    description: string;

    @Column({type: "decimal"})
    @ApiProperty({example:'1500'})
    price: number;

    @ManyToOne(() => Category, category => category.products,{nullable:false})
    @ApiProperty({type:Category})
    @JoinColumn({ name: "category_id" })
    category: Category;
}