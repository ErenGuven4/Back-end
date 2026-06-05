import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameSession } from './game-session.entity';
import { Game } from '../games/game.entity';
import { Player } from '../auth/player.entity';
import { CreateGameSessionDto } from './dto/create-game-session.dto';
import { EndGameSessionDto } from './dto/end-game-session.dto';

@Injectable()
export class GameSessionsService {
  constructor(
    @InjectRepository(GameSession)
    private sessionsRepo: Repository<GameSession>,
    @InjectRepository(Game)
    private gamesRepo: Repository<Game>,
    @InjectRepository(Player)
    private playersRepo: Repository<Player>,
  ) {}

  // Yeni oturum başlat — player + game ilişkisi kurulur (ManyToOne)
  async create(dto: CreateGameSessionDto): Promise<GameSession> {
    const player = await this.playersRepo.findOneBy({ id: dto.playerId });
    if (!player) throw new NotFoundException(`${dto.playerId} ID'li oyuncu bulunamadı`);

    const game = await this.gamesRepo.findOneBy({ id: dto.gameId });
    if (!game) throw new NotFoundException(`${dto.gameId} ID'li oyun bulunamadı`);

    const session = this.sessionsRepo.create({ player, game });
    return this.sessionsRepo.save(session);
  }

  // Oturumu bitir — skor ve bitiş zamanı kaydedilir
  async endSession(id: number, dto: EndGameSessionDto): Promise<GameSession> {
    const session = await this.sessionsRepo.findOneBy({ id });
    if (!session) throw new NotFoundException(`${id} ID'li oturum bulunamadı`);

    session.score = dto.score;
    session.endedAt = new Date();
    return this.sessionsRepo.save(session);
  }

  async findAll(): Promise<GameSession[]> {
    return this.sessionsRepo.find();
  }

  async findByPlayer(playerId: number): Promise<GameSession[]> {
    return this.sessionsRepo.find({
      where: { player: { id: playerId } },
    });
  }
}
