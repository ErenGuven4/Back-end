import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class EndGameSessionDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  score: number;
}
