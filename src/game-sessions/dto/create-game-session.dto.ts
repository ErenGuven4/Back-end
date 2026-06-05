import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateGameSessionDto {
  @IsNumber()
  @IsNotEmpty()
  playerId: number;

  @IsNumber()
  @IsNotEmpty()
  gameId: number;
}
