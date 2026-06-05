// RegisterDto: POST /api/auth/register isteğinin body'sini doğrular.
// class-validator dekoratörleri ile her alan otomatik kontrol edilir.

import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Kullanıcı adı en az 3 karakter olmalıdır' })
  username: string;

  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  password: string;
}
