// Roles Decorator: Route'lara hangi rolün erişebileceğini belirtmek için kullanılır.
// Kullanım: @Roles('admin') — sadece admin rolündekiler erişebilir.

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
