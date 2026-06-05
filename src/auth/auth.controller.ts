// Auth Controller: Kayıt, giriş, çıkış, profil ve admin endpoint'leri.
// Ders notlarındaki AuthController'ın tam karşılığı.

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(Player)
    private playersRepo: Repository<Player>,
  ) {}

  // POST /api/auth/register → Yeni oyuncu kaydı
  // Açık endpoint — giriş yapmadan kullanılabilir
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const player = await this.authService.register(dto);
    return { success: true, player };
  }

  // POST /api/auth/login → Giriş yap, token al
  // LocalAuthGuard: önce şifreyi doğrular, ardından login() çağrılır
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200) // Varsayılan 201 yerine 200 dön
  async login(@Request() req) {
    const tokens = await this.authService.login(req.user);
    return { success: true, ...tokens };
  }

  // GET /api/auth/profile → Kendi profil bilgilerini getir (JWT zorunlu)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // req.user, JwtStrategy.validate()'dan gelen Player nesnesidir
    const { password, refreshToken, ...safeUser } = req.user;
    return { success: true, player: safeUser };
  }

  // POST /api/auth/logout → Çıkış yap (refresh token geçersiz olur)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return { success: true, message: 'Başarıyla çıkış yapıldı' };
  }

  // POST /api/auth/refresh → Yeni access token al
  // Guard YOK — access token süresi dolmuş olabilir; body'den playerId + refreshToken alınır
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: { playerId: number; refreshToken: string }) {
    return this.authService.refreshTokens(body.playerId, body.refreshToken);
  }

  // -------------------------------------------------------
  // ADMIN endpoint'leri — sadece 'admin' rolü erişebilir
  // -------------------------------------------------------

  // GET /api/auth/admin/users → Tüm kayıtlı oyuncuları listele
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/users')
  async getAllPlayers() {
    const players = await this.playersRepo.find();
    const safe = players.map(({ password, refreshToken, ...p }) => p);
    return { success: true, count: safe.length, players: safe };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/users/:id')
  async deletePlayer(@Param('id', ParseIntPipe) id: number) {
    await this.playersRepo.delete(id);
    return { success: true, message: `${id} ID'li oyuncu silindi` };
  }
}
