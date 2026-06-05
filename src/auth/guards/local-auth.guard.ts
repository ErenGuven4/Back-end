// LocalAuthGuard: Login endpoint'inde kullanıcı adı + şifre doğrulamasını tetikler.
// Bu guard devreye girince LocalStrategy.validate() otomatik çalışır.

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
