// DTO (Data Transfer Object): POST /api/progress isteğinin body'sini doğrular.
// class-validator dekoratörleri ile gelen veri otomatik kontrol edilir.

import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class UpdateProgressDto {
  @IsString()
  userId: string; // Hangi kullanıcının ilerlemesi güncelleniyor?

  @IsOptional()
  @IsString()
  wordId?: string; // Doğru/yanlış cevaplanan kelimenin ID'si

  @IsOptional()
  @IsBoolean()
  correct?: boolean; // Cevap doğru muydu?

  @IsOptional()
  @IsNumber()
  levelId?: number; // Tamamlanan bölüm (varsa)
}
