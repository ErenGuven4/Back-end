// RolesGuard: Rol tabanlı yetkilendirme.
// @Roles('admin') decorator'ı ile işaretlenen route'lara sadece admin erişebilir.

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Route'a hangi roller gerekli diye bak
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // Rol kısıtı yoksa herkese izin ver
    if (!requiredRoles) return true;

    // req.user'dan gelen kullanıcının rolünü kontrol et
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role);
  }
}
