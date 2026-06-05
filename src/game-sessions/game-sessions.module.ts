import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSessionsService } from './game-sessions.service';
import { GameSessionsController } from './game-sessions.controller';
import { GameSession } from './game-session.entity';
import { Game } from '../games/game.entity';
import { Player } from '../auth/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameSession, Game, Player])],
  providers: [GameSessionsService],
  controllers: [GameSessionsController],
  exports: [GameSessionsService],
})
export class GameSessionsModule {}
