// JWT Strategy: Korumalı endpoint'lere gelen Bearer token'ı doğrular.
// Ders notlarındaki JwtStrategy'nin tam karşılığı.

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Player)
    private playersRepo: Repository<Player>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; username: string; role: string }) {
    const player = await this.playersRepo.findOneBy({ id: payload.sub });
    if (!player) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }
    return player;
  }
}
