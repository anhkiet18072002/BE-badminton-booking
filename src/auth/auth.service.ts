import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as argon from 'argon2';
import { AccountService } from 'src/account/account.service';
import { SignInDto } from 'src/auth/dto/signin.dto';
import { baseSelect } from 'src/core/base.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  private defaultSelect: Prisma.AccountSelect = {
    ...baseSelect,
    accountRoles: {
      select: {
        ...baseSelect,
        role: {
          select: {
            key: true,
            name: true,
            description: true,
            rolePermissions: {
              select: {
                permission: true,
              },
            },
          },
        },
      },
    },
    email: true,

    username: true,
  };

  constructor(
    readonly prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private accountService: AccountService,
  ) {}

  async validate(dto: SignInDto) {
    const account = await this.accountService.findOneByEmail(dto.email);
    if (!account) {
      throw new UnauthorizedException(
        'Wrong email or password. Try again or click Forgot password to reset it.',
      );
    }

    try {
      const isMatched = await argon.verify(account.password, dto.password);
      if (!isMatched) {
        throw new UnauthorizedException(
          'Wrong email or password. Try again or click Forgot password to reset it.',
        );
      }
    } catch (err) {
      throw new UnauthorizedException(
        'Wrong email or password. Try again or click Forgot password to reset it.',
      );
    }

    const accessToken = await this.getJwtToken(account.email, account.id);
    const expiration =
      Number(this.config.get('JWT_ACCESS_TOKEN_EXP_IN_SECOND')) || 86400;

    return {
      account: { ...account, password: undefined },
      token: { access: accessToken, expiration },
    };
  }

  async verify(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: {
        id: accountId,
      },
      select: this.defaultSelect,
    });

    return { account: { ...account, password: undefined } };
  }

  private async getJwtToken(email: string, accountId: string): Promise<string> {
    const payload = {
      sub: accountId,
      email,
    };

    const jwtTokenSecret = this.config.get('JWT_ACCESS_TOKEN_SECRET');
    const jwtTokenExp = `${this.config.get('JWT_ACCESS_TOKEN_EXP_IN_SECOND') || 86400}s`;

    return this.jwt.signAsync(payload, {
      expiresIn: jwtTokenExp,
      secret: jwtTokenSecret,
    });
  }
}
