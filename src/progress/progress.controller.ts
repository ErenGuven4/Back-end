// Progress Controller: /api/progress adresinden gelen HTTP isteklerini yönetir.
// Tüm endpoint'ler JWT ile korunur — kullanıcı giriş yapmadan erişemez.

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ResetProgressDto } from './dto/reset-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // GET /api/progress/leaderboard → Tüm oyuncuları skora göre sıralı getirir
  // NOT: Bu route /api/progress/:userId'den önce tanımlanmalı (prefix önceliği)
  @UseGuards(JwtAuthGuard)
  @Get('leaderboard')
  async getLeaderboard() {
    const leaderboard = await this.progressService.getLeaderboard();
    return { success: true, leaderboard };
  }

  // GET /api/progress?userId=Ali → Kullanıcının ilerleme verisini getirir
  @UseGuards(JwtAuthGuard)
  @Get()
  async getProgress(@Query('userId') userId: string = 'default') {
    const progress = await this.progressService.getProgress(userId);
    return { success: true, progress };
  }

  // POST /api/progress → Cevap veya bölüm tamamlandığında ilerlemeyi günceller
  @UseGuards(JwtAuthGuard)
  @Post()
  async updateProgress(@Body() dto: UpdateProgressDto) {
    const progress = await this.progressService.updateProgress(dto);
    return { success: true, message: 'İlerleme güncellendi!', progress };
  }

  // POST /api/progress/reset → Kullanıcının ilerlemesini sıfırlar
  @UseGuards(JwtAuthGuard)
  @Post('reset')
  async resetProgress(@Body() dto: ResetProgressDto) {
    const progress = await this.progressService.resetProgress(dto);
    return { success: true, message: 'İlerleme sıfırlandı!', progress };
  }
}
