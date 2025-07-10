import { PartialType } from '@nestjs/swagger';
import { CreateAccountRoleDto } from './create-account-role.dto';

export class UpdateAccountRoleDto extends PartialType(CreateAccountRoleDto) {}
