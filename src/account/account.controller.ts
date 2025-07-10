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
import { AccountService } from './account.service';
import { CreateAccountDto, FindUserByEmailDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Swagger } from 'src/core/common/decorator/swagger/swagger.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { QueryAccountDto } from './dto/query-account.dto';
import { Permission } from 'src/core/decorator/permission.decorator';
import { PERMISSIONS } from 'src/core/constant';

@Swagger('Account')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'Create a new account' })
  @Post()
  create(@Body() dto: CreateAccountDto) {
    return this.accountService.create(dto);
  }

  @ApiOperation({ summary: 'Get user from email' })
  @Post('email')
  findOneByEmail(@Body() data: FindUserByEmailDto) {
    return this.accountService.findOneByEmail(data.email);
  }

  // @Permission({ AND: [PERMISSIONS.ROLE] })
  @ApiOperation({ summary: 'Get all accounts' })
  @Get()
  findAll(@Query() query: QueryAccountDto) {
    return this.accountService.findAll(query);
  }

  @ApiOperation({ summary: 'Get an account by its ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an account by its ID' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete an account by its ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
