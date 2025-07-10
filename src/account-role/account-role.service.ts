import { Injectable } from '@nestjs/common';
import { CreateAccountRoleDto } from './dto/create-account-role.dto';
import { UpdateAccountRoleDto } from './dto/update-account-role.dto';
import { baseSelect, BaseService } from 'src/core/base.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountRoleService extends BaseService {
  defaultSelect: Prisma.AccountRoleSelect = {
    ...baseSelect,
    roleId: true,
    role: true,
    account: true,
    accountId: true,
  };
  defaultSearchFields?: string[] | undefined;

  constructor(private readonly prisma: PrismaService) {
    super(prisma.accountRole);
  }
}
