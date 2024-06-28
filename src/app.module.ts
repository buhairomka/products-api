import {Module} from '@nestjs/common';
import {ProductsModule} from './products/products.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import typeorm from './dataSource'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            expandVariables: true,
            isGlobal: true,
            load: [typeorm]
        }),
        ProductsModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => (configService.get("typeorm")),
            inject: [ConfigService]
        }),

    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
