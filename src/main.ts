import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const swaggerOptions = new DocumentBuilder()
    .setTitle('API Kasandra - hiring challenge')
    .setDescription('API desenvolvida para o desafio da Kanastra.')
    .setVersion('1.0')
    .addServer(process.env.SWAGGER_URL, 'Local')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions, {
    include: [],
  });
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(3000);
}
bootstrap();
