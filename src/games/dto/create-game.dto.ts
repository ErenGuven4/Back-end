import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}
