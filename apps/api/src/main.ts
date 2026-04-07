ï»¿import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app    = await NestFactory.create(AppModule, { logger: ['error','warn','log'] });
  const logger = new Logger('Bootstrap');

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
    transformOptions: { enableImplicitConversion: true },
  }));

  // Swagger â chá» dev
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Querencia API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const doc = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, doc);
    logger.log('Swagger: http://localhost:3001/api/docs');
  }

  const port = process.env.PORT_API ?? 3001;
  await app.listen(port);
  logger.log(`API running on port ${port}`);
}
bootstrap();
