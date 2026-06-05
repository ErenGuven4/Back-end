import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('words')
export class Word {
  @PrimaryColumn()
  id: string;

  @Column()
  word: string;

  @Column('text', { array: true })
  syllables: string[];

  @Column()
  level: number;

  @Column({ nullable: true })
  emoji: string;
}

@Entity('levels')
export class Level {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  requiredScore: number;
}
