import {
  Controller, Get, Post, Patch,
  Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { GameSessionsService } from './game-sessions.service';
import { CreateGameSessionDto } from './dto/create-game-session.dto';
import { EndGameSessionDto } from './dto/end-game-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/game-sessions')
@UseGuards(JwtAuthGuard)
export class GameSessionsController {
  constructor(private readonly gameSessionsService: GameSessionsService) {}

  // POST /api/game-sessions — Yeni oturum başlat (playerId + gameId)
  @Post()
  async create(@Body() dto: CreateGameSessionDto) {
    const session = await this.gameSessionsService.create(dto);
    return { success: true, session };
  }

  // PATCH /api/game-sessions/:id/end — Oturumu bitir, skoru kaydet
  @Patch(':id/end')
  async endSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EndGameSessionDto,
  ) {
    const session = await this.gameSessionsService.endSession(id, dto);
    return { success: true, session };
  }

  // GET /api/game-sessions — Tüm oturumları listele
  @Get()
  async findAll() {
    const sessions = await this.gameSessionsService.findAll();
    return { success: true, count: sessions.length, sessions };
  }

  // GET /api/game-sessions/player/:playerId — Oyuncuya ait oturumlar
  @Get('player/:playerId')
  async findByPlayer(@Param('playerId', ParseIntPipe) playerId: number) {
    const sessions = await this.gameSessionsService.findByPlayer(playerId);
    return { success: true, count: sessions.length, sessions };
  }
}
