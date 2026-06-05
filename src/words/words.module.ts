// Words Module: Kelime ve seviye ile ilgili tüm bileşenleri bir araya toplar.
// NestJS'in modüler mimarisinin örneği — her özellik kendi modülünde.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { Word, Level } from './word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Word, Level])],
  controllers: [WordsController],
  providers: [WordsService],
  exports: [WordsService],
})
export class WordsModule {}
