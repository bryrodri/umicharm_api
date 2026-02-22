import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos (usando el decorador @Roles)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene el decorador @Roles, se permite el acceso por defecto
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtener la información del usuario del token
    // La información del token (payload) está en req.user gracias al JwtAuthGuard previo
    const { user } = context.switchToHttp().getRequest();
    // 3. Comparar el rol del usuario con los roles requeridos
    return requiredRoles.some((role) => user.role_name === role);
  }
}