import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Player } from '../auth/player.entity';
import { Game } from '../games/game.entity';

@Entity('game_sessions')
export class GameSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, { eager: true, onDelete: 'CASCADE' })
  player: Player;

  @ManyToOne(() => Game, (g) => g.sessions, { eager: true, onDelete: 'CASCADE' })
  game: Game;

  @Column({ type: 'int', default: 0 })
  score: number;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  endedAt: Date;
}
