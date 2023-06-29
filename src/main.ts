import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup the swagger documentation.
  const options = new DocumentBuilder()
    .setTitle('MultiversX Transaction Tracker API')
    .setDescription(
      'API for tracking transactions on the MultiversX Blockchain',
    )
    .setVersion('1.0')
    .addTag('default')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
