import { User } from './../core/decorator/user.decorator';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { baseSelect, BaseService } from 'src/core/base.service';
import {
  Account,
  AccountRole,
  Permission,
  Prisma,
  Role,
  RolePermission,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { ROLES } from 'src/core/constant';

@Injectable()
export class AccountService extends BaseService {
  defaultSelect: Prisma.AccountSelect = {
    ...baseSelect,
    email: true,
    username: true,
    user: {
      select: {
        firstName: true,
        lastName: true,
        middleName: true,
        startDate: true,
        endDate: true,
      },
    },
    accountRoles: {
      select: {
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
  };
  defaultSearchFields?: string[] = ['usename', 'email'];

  constructor(private readonly prisma: PrismaService) {
    super(prisma.account);
  }

  private async validate(dto: CreateAccountDto | UpdateAccountDto) {
    if (dto.email) {
      const account = await this.prisma.account.findUnique({
        where: {
          email: dto.email,
        },
        select: {
          email: true,
          user: true,
          username: true,
        },
      });

      if (account) {
        throw new ConflictException(
          `The account with email: ${dto.email} already exists. Choose another one`,
        );
      }
    }

    // Validate username
    if (dto.username) {
      const account = await this.prisma.account.findUnique({
        where: {
          username: dto.username,
        },
      });

      if (account) {
        throw new ConflictException(
          `The account with username: ${dto.username} already exists. Choose another one`,
        );
      }
    }
  }

  override async create(dto: CreateAccountDto): Promise<Account> {
    await this.validate(dto as CreateAccountDto);

    if (dto.accountRoles && dto.accountRoles.length > 0) {
      for (const pa of dto.accountRoles) {
        const role = await this.prisma.role.findUnique({
          where: { id: pa.roleId },
        });
        if (!role) {
          throw new BadRequestException(
            `The role with id: ${pa.roleId} does not exist or has been removed`,
          );
        }
      }
    }

    const account = await this.prisma.account.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: await hash(dto.password),
        ...(dto.accountRoles && {
          accountRoles: {
            createMany: {
              data: dto.accountRoles,
            },
          },
        }),
      },
      select: this.defaultSelect,
    });

    let user = await this.prisma.user.findUnique({
      where: { accountId: account.id },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          middleName: dto.middleName,
          startDate: dto.startDate,
          endDate: dto.endDate,
          account: { connect: { id: account.id } },
        },
      });
    }

    return account;
  }

  override async update(id: string, dto: UpdateAccountDto): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id },

      select: this.defaultSelect,
    });
    if (!account) {
      throw new BadRequestException(
        `The account with ID: ${id} does not exist or has been removed`,
      );
    }

    if (dto.accountRoles && dto.accountRoles.length > 0) {
      for (const pa of dto.accountRoles) {
        const role = await this.prisma.role.findUnique({
          where: { id: pa.roleId },
        });
        if (!role) {
          throw new BadRequestException(
            `The role with id: ${pa.roleId} does not exist or has been removed`,
          );
        }
      }
    }

    if (!dto.accountRoles) {
      await this.prisma.accountRole.deleteMany({
        where: { accountId: id },
      });
    }

    let { password } = dto;
    if (password) {
      password = await hash(password);
    }

    return await this.prisma.account.update({
      where: { id },
      data: {
        username: dto.username,
        email: dto.email,
        password: password,
        user: {
          update: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            middleName: dto.middleName,
            startDate: dto.startDate,
            endDate: dto.endDate,
          },
        },
        ...(dto.accountRoles && {
          accountRoles: {
            deleteMany: {},
            createMany: {
              data: dto.accountRoles,
            },
          },
        }),
      },
    });
  }

  async findOneByEmail(email: string) {
    const account = await this.prisma.account.findUnique({
      where: {
        email,
      },
      select: { ...this.defaultSelect, password: true },
    });

    return account;
  }

  async isAdmin(
    account: Account & {
      accountRoles: AccountRole &
        {
          role: Role & {
            rolePermissions: RolePermission & { permission: Permission }[];
          };
        }[];
    },
  ): Promise<boolean> {
    const { accountRoles } = account;
    if (accountRoles && accountRoles?.length) {
      for (const accountRole of accountRoles) {
        const { role } = accountRole;
        const { rolePermissions } = role;
        for (const rfp of rolePermissions) {
          if (rfp.permission.key === ROLES.CORE_ADMIN) return true;
        }
      }
    }

    return false;
  }
}
