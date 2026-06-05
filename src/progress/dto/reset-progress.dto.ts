import { IsString } from 'class-validator';

export class ResetProgressDto {
  @IsString()
  userId: string; // Hangi kullanıcının ilerlemesi sıfırlanacak?
}
