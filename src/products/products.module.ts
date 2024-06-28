import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import { CategoriesService } from './categories/categories.service';
import {Category} from "./entities/category.entity";
import {CategoriesController} from "./categories/categories.controller";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports:[
      AuthModule,
      TypeOrmModule.forFeature([Product,Category])
  ],
  controllers: [ProductsController,CategoriesController],
  providers: [ProductsService, CategoriesService],
})
export class ProductsModule {}
