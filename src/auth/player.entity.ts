import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, type: 'text' })
  @Exclude()
  refreshToken: string | null;

  @Column({ default: 'player' })
  role: string;

  @Column({ default: 0 })
  level: number;

  @CreateDateColumn()
  createdAt: Date;
}
