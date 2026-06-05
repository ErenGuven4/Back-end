import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgress } from './progress.entity';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ResetProgressDto } from './dto/reset-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private progressRepo: Repository<UserProgress>,
  ) {}

  private async getOrCreate(userId: string): Promise<UserProgress> {
    let user = await this.progressRepo.findOneBy({ userId });
    if (!user) {
      user = this.progressRepo.create({
        userId,
        completedLevels: [],
        currentLevel: 1,
        score: 0,
        completedWords: [],
      });
      await this.progressRepo.save(user);
      console.log(`[YENİ KULLANICI] Profil oluşturuldu: "${userId}"`);
    }
    return user;
  }

  async getProgress(userId: string): Promise<UserProgress> {
    const user = await this.getOrCreate(userId);
    console.log(`[İLERLEME YÜKLENDİ] "${userId}" → Seviye: ${user.currentLevel} | Skor: ${user.score}⭐`);
    return user;
  }

  async updateProgress(dto: UpdateProgressDto): Promise<UserProgress> {
    const { userId, wordId, correct, levelId } = dto;
    const user = await this.getOrCreate(userId);

    if (correct && wordId) {
      user.score += 10;
      if (!user.completedWords.includes(wordId)) {
        user.completedWords = [...user.completedWords, wordId];
      }
      console.log(`[DOĞRU CEVAP] "${userId}" → ${wordId} | Skor: ${user.score}⭐`);
    } else if (!correct && wordId) {
      console.log(`[YANLIŞ CEVAP] "${userId}" → ${wordId} | Skor: ${user.score}⭐`);
    }

    if (levelId !== undefined && !user.completedLevels.includes(levelId)) {
      user.completedLevels = [...user.completedLevels, levelId];
      if (levelId >= user.currentLevel) {
        user.currentLevel = Math.min(levelId + 1, 5);
      }
      console.log(`[SEVİYE TAMAMLANDI] "${userId}" → ${levelId}. seviye bitti! Yeni: ${user.currentLevel}`);
    }

    return this.progressRepo.save(user);
  }

  async resetProgress(dto: ResetProgressDto): Promise<UserProgress> {
    const { userId } = dto;
    let user = await this.progressRepo.findOneBy({ userId });
    if (!user) {
      user = this.progressRepo.create({ userId });
    }
    user.completedLevels = [];
    user.currentLevel = 1;
    user.score = 0;
    user.completedWords = [];
    console.log(`[SIFIRLAMA] "${userId}" ilerlemesini sıfırladı 🔄`);
    return this.progressRepo.save(user);
  }

  async getLeaderboard() {
    const users = await this.progressRepo.find();
    return users
      .map((u) => ({
        userId: u.userId,
        score: u.score || 0,
        currentLevel: u.currentLevel || 1,
        completedWordsCount: u.completedWords ? u.completedWords.length : 0,
      }))
      .sort((a, b) => b.score - a.score);
  }

  async getAllUsers(): Promise<UserProgress[]> {
    return this.progressRepo.find({ order: { createdAt: 'DESC' } });
  }
}
