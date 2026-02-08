import { SetMetadata } from '@nestjs/common';

// Definimos la clave que usará el guard para buscar los datos
export const ROLES_KEY = 'roles';

// Decorador que acepta un array de strings (roles)
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);