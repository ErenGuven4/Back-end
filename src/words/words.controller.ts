// Words Controller: /api/words ve /api/levels adreslerinden gelen HTTP isteklerini karşılar.
// Ders notlarındaki "Controller katmanı" — sadece isteği alır, service'e iletir, yanıt döner.

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { WordsService } from './words.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api') // Tüm route'lar /api altında
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  // GET /api/words          → Tüm kelimeleri getirir
  // GET /api/words?level=3  → 3. seviyeye ait kelimeleri getirir
  // @UseGuards(JwtAuthGuard) → JWT token zorunlu (korumalı endpoint)
  @UseGuards(JwtAuthGuard)
  @Get('words')
  async findAll(@Query('level') level?: string) {
    const levelNum = level !== undefined ? parseInt(level) : undefined;
    const words = await this.wordsService.findAll(levelNum);
    return {
      success: true,
      count: words.length,
      words,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('words/:id')
  async findOne(@Param('id') id: string) {
    const word = await this.wordsService.findOne(id);
    return {
      success: true,
      word,
    };
  }

  @Get('levels')
  async findAllLevels() {
    const levels = await this.wordsService.findAllLevels();
    return {
      success: true,
      levels,
    };
  }
}
