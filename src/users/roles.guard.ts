import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, IS_PUBLIC_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true; // 如果接口标记为 Public，就直接放行

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有角色限制，所有认证用户都可以访问
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    // 如果没有用户信息（未认证），拒绝访问
    if (!user) return false;

    // 检查用户角色是否在要求的角色列表中
    return requiredRoles.includes(user.role);
  }
}
