import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  Account,
  AccountRole,
  Permission,
  Role,
  RolePermission,
} from '@prisma/client';
import { AccountService } from 'src/account/account.service';
import { KEYS } from 'src/core/constant';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accountService: AccountService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(KEYS.PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const {
      account,
    }: {
      account: Account & {
        accountRoles: AccountRole &
          {
            role: Role & {
              rolePermissions: RolePermission & { permission: Permission }[];
            };
          }[];
      };
    } = user;

    // Check if admin
    const isAdmin = await this.accountService.isAdmin(account);
    if (isAdmin) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<{
      AND?: string[];
      OR?: string[];
    }>(KEYS.PERMISSION, [context.getHandler(), context.getClass()]);

    const { accountRoles } = account;
    const permissions: string[] = [];

    // Loop through account's roles
    accountRoles?.map((accountRole) => {
      const { role } = accountRole;
      const { rolePermissions } = role;
      rolePermissions?.map((rolePermission) => {
        const { permission } = rolePermission;
        if (!permissions.includes(permission.key)) {
          permissions.push(permission.key);
        }
      });
    });

    if (requiredPermissions?.AND) {
      return requiredPermissions?.AND.every((permission) =>
        permissions.includes(permission),
      );
    } else if (requiredPermissions?.OR) {
      return requiredPermissions?.OR.some((permission) =>
        permissions.includes(permission),
      );
    }

    return false;
  }
}
