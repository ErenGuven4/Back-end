import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word, Level } from './word.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WordsService implements OnModuleInit {
  constructor(
    @InjectRepository(Word)
    private wordsRepo: Repository<Word>,
    @InjectRepository(Level)
    private levelsRepo: Repository<Level>,
  ) {}

  // Uygulama başlarken DB boşsa words.json'dan seed eder
  async onModuleInit() {
    const count = await this.wordsRepo.count();
    if (count === 0) {
      const dataPath = path.join(process.cwd(), 'data', 'words.json');
      if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath, 'utf-8');
        const db = JSON.parse(raw);
        if (db.levels?.length) {
          await this.levelsRepo.save(db.levels);
        }
        if (db.words?.length) {
          await this.wordsRepo.save(db.words);
        }
        console.log(`[SEED] ${db.words?.length ?? 0} kelime ve ${db.levels?.length ?? 0} seviye Supabase'e yüklendi.`);
      }
    }
  }

  async findAll(level?: number): Promise<Word[]> {
    if (level !== undefined && !isNaN(level)) {
      if (level === 5) {
        const all = await this.wordsRepo.find();
        const shuffled = all.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 8);
      }
      return this.wordsRepo.findBy({ level });
    }
    return this.wordsRepo.find();
  }

  async findOne(id: string): Promise<Word> {
    const word = await this.wordsRepo.findOneBy({ id });
    if (!word) {
      throw new NotFoundException(`"${id}" ID'li kelime bulunamadı`);
    }
    return word;
  }

  async findAllLevels(): Promise<Level[]> {
    return this.levelsRepo.find({ order: { id: 'ASC' } });
  }
}
