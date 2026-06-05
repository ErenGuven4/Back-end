// Ana modül: Tüm alt modülleri birbirine bağlar.
// Uygulamanın "kök" modülüdür — NestJS buradan başlar.

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsModule } from './words/words.module';
import { ProgressModule } from './progress/progress.module';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { GameSessionsModule } from './game-sessions/game-sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Supabase (PostgreSQL) bağlantısı — .env'den okunur
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') || '5432'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        ssl: config.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Geliştirme ortamında tablolar otomatik oluşur
      }),
    }),

    WordsModule,
    ProgressModule,
    AuthModule,
    GamesModule,
    GameSessionsModule,
  ],
})
export class AppModule {}
