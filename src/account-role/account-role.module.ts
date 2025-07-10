import { Module } from '@nestjs/common';
import { AccountRoleService } from './account-role.service';
import { AccountRoleController } from './account-role.controller';

@Module({
  controllers: [AccountRoleController],
  providers: [AccountRoleService],
})
export class AccountRoleModule {}
