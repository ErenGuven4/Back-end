// Local Strategy: POST /api/auth/login'de kullanıcı adı + şifre doğrulaması.
// Ders notlarındaki LocalStrategy'nin tam karşılığı.

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // usernameField: request body'deki hangi alan kullanıcı adı olarak kullanılacak
    super({ usernameField: 'username' });
  }

  // Passport bu metodu otomatik çağırır — başarısız olursa AuthService exception fırlatır.
  async validate(username: string, password: string) {
    const player = await this.authService.validatePlayer(username, password);
    return player; // req.user'a atanır
  }
}
