import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // POST /api/games — Yeni oyun ekle (sadece admin)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateGameDto) {
    const game = await this.gamesService.create(dto);
    return { success: true, game };
  }

  // GET /api/games — Tüm aktif oyunları listele
  @Get()
  async findAll() {
    const games = await this.gamesService.findAll();
    return { success: true, count: games.length, games };
  }

  // GET /api/games/:id — Tek oyun getir
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const game = await this.gamesService.findOne(id);
    return { success: true, game };
  }

  // PATCH /api/games/:id — Oyun güncelle (sadece admin)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateGameDto>,
  ) {
    const game = await this.gamesService.update(id, dto);
    return { success: true, game };
  }

  // DELETE /api/games/:id — Oyunu pasife al (sadece admin)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.gamesService.remove(id);
    return { success: true, message: `${id} ID'li oyun silindi` };
  }
}
