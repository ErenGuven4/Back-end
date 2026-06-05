import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepo: Repository<Game>,
  ) {}

  async create(dto: CreateGameDto): Promise<Game> {
    const game = this.gamesRepo.create(dto);
    return this.gamesRepo.save(game);
  }

  async findAll(): Promise<Game[]> {
    return this.gamesRepo.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepo.findOneBy({ id });
    if (!game) throw new NotFoundException(`${id} ID'li oyun bulunamadı`);
    return game;
  }

  async update(id: number, dto: Partial<CreateGameDto>): Promise<Game> {
    await this.findOne(id);
    await this.gamesRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.gamesRepo.update(id, { isActive: false });
  }
}
