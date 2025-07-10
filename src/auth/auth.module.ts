import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthStrategy, LocalStrategy } from 'src/auth/strategies';
import { AccountService } from 'src/account/account.service';
import { AccountRoleService } from 'src/account-role/account-role.service';
import { RoleService } from 'src/role/role.service';

@Module({
  controllers: [AuthController],
  providers: [
    AccountRoleService,
    AccountService,
    AuthService,
    JwtAuthStrategy,
    JwtService,
    LocalStrategy,
    RoleService,
  ],
})
export class AuthModule {}
