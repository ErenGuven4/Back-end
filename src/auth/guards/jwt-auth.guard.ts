// JwtAuthGuard: JWT token gerektiren route'ları korur.
// @UseGuards(JwtAuthGuard) ile herhangi bir Controller veya metoda uygulanabilir.

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
