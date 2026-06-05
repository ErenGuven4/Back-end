import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { Player } from './player.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Player)
    private playersRepo: Repository<Player>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<Omit<Player, 'password' | 'refreshToken'>> {
    const existing = await this.playersRepo.findOneBy({ username: dto.username });
    if (existing) {
      throw new ConflictException('Bu kullanıcı adı zaten alınmış');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const player = this.playersRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: 'player',
    });
    const saved = await this.playersRepo.save(player);

    const { password, refreshToken, ...safePlayer } = saved as any;
    return safePlayer;
  }

  async validatePlayer(username: string, password: string): Promise<Player> {
    const player = await this.playersRepo.findOneBy({ username });
    if (!player) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    const isMatch = await bcrypt.compare(password, player.password);
    if (!isMatch) {
      throw new UnauthorizedException('Şifre yanlış');
    }

    return player;
  }

  async login(player: Player) {
    const payload = { sub: player.id, username: player.username, role: player.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.playersRepo.update(player.id, { refreshToken: hashedRefresh });

    return { accessToken, refreshToken };
  }

  async logout(playerId: number): Promise<void> {
    await this.playersRepo.update(playerId, { refreshToken: null });
  }

  async refreshTokens(playerId: number, refreshToken: string) {
    const player = await this.playersRepo.findOneBy({ id: playerId });
    if (!player || !player.refreshToken) {
      throw new UnauthorizedException('Erişim reddedildi');
    }

    const isMatch = await bcrypt.compare(refreshToken, player.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Refresh token geçersiz');
    }

    return this.login(player);
  }
}
