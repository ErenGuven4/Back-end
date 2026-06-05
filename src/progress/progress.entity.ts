import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: string;

  @Column('int', { array: true, default: [] })
  completedLevels: number[];

  @Column({ default: 1 })
  currentLevel: number;

  @Column({ default: 0 })
  score: number;

  @Column('text', { array: true, default: [] })
  completedWords: string[];

  @CreateDateColumn()
  createdAt: Date;
}
