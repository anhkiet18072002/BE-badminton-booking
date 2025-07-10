import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AccountRoleService } from './account-role.service';
import { CreateAccountRoleDto } from './dto/create-account-role.dto';
import { UpdateAccountRoleDto } from './dto/update-account-role.dto';
import { Swagger } from 'src/core/common/decorator/swagger/swagger.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { QueryAccountRoleDto } from './dto/query-account.dto';

@Swagger('account-role')
@Controller('account-role')
export class AccountRoleController {
  constructor(private readonly accountRoleService: AccountRoleService) {}

  @ApiOperation({ summary: 'Create a new account role' })
  @Post()
  create(@Body() createAccountRoleDto: CreateAccountRoleDto) {
    return this.accountRoleService.create(createAccountRoleDto);
  }

  @ApiOperation({ summary: 'Get all acount role' })
  @Get()
  findAll(@Query() query: QueryAccountRoleDto) {
    return this.accountRoleService.findAll(query);
  }

  @ApiOperation({ summary: 'Get acount role by its ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountRoleService.findOne(id);
  }

  @ApiOperation({ summary: 'Update acount role by its ID' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountRoleDto: UpdateAccountRoleDto,
  ) {
    return this.accountRoleService.update(id, updateAccountRoleDto);
  }

  @ApiOperation({ summary: 'Delete acount role by its ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountRoleService.remove(id);
  }
}
