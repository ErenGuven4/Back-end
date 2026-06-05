// Uygulamanın başlangıç noktası.
// NestJS uygulamasını ayağa kaldırır, global middleware ve interceptor'ları tanımlar.

import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: React Native (Expo) uygulamasının farklı IP/port'tan istek atabilmesini sağlar.
  app.enableCors();

  // GlobalValidationPipe: Gelen DTO'ları class-validator kurallarına göre otomatik doğrular.
  // whitelist: true → DTO'da tanımlı olmayan alanları siler (ekstra veri temizleme).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // ClassSerializerInterceptor: @Exclude() ile işaretlenen alanları (örn: password)
  // JSON yanıtına dahil etmez.
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log('');
  console.log('🐝 ================================================');
  console.log('   Heceleme Uygulaması Backend (NestJS)');
  console.log('🐝 ================================================');
  console.log(`   Sunucu çalışıyor: http://localhost:${port}`);
  console.log(`   API adresi:       http://localhost:${port}/api`);
  console.log('🐝 ================================================');
  console.log('');
}

bootstrap();
