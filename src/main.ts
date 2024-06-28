import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";
//
// import {randomBytes} from 'node:crypto'
// import {sign} from 'jsonwebtoken'
// const jwt = require('jsonwebtoken');
// // Заголовок
// const header = {
//   alg: 'RSA-OAEP',
//   enc: 'A256GCM'
// };
//
// // Корисна навантаження
// const payload = {
//   sub: 'user123',
//   exp: Math.floor(Date.now() / 1000) + 3600 // Токен дійсний 1 годину
// };
//
// // Вектор ініціалізації (IV)
//
// const iv = randomBytes(12).toString('base64url');
//
// // Секретний ключ (для RSA-OAEP)
// const privateKey = `secret`
//
// // Створення JWE токена
// const token = sign(payload, privateKey, { header, iv });
//
// console.log('JWE Token:', token);
//

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
      .setTitle('Products API')
      .setDescription('The products API description')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(3000);
}
bootstrap();


