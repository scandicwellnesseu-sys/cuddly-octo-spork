import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Globala pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger dokumentation
  const config = new DocumentBuilder()
    .setTitle('AI Product Description Generator PRO')
    .setDescription('API för att generera SEO-optimerade produkttexter med AI')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autentisering')
    .addTag('users', 'Användarhantering')
    .addTag('organizations', 'Organisationer')
    .addTag('ai', 'AI-generering')
    .addTag('seo', 'SEO-analys')
    .addTag('keywords', 'Nyckelordsmotor')
    .addTag('brand-voice', 'Varumärkesröst')
    .addTag('billing', 'Betalning & Krediter')
    .addTag('integrations', 'E-handelsintegrationer')
    .addTag('trends', 'Trendanalys')
    .addTag('analytics', 'Statistik')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 AI Product Description Generator PRO API`);
  console.log(`📍 Lyssnar på port ${port}`);
  console.log(`📚 Swagger dokumentation: http://localhost:${port}/api/docs`);
}

bootstrap();
