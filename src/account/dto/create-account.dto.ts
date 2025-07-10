import { AccountRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateBaseDto } from 'src/core/dto/crete-base.dto';

export class CreateAccountDto extends CreateBaseDto {
  @ApiProperty({ description: 'Email of the account', required: true })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password of the account', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Username of the account', required: true })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'First name of the account', required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of the account', required: true })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Middle name of the account', required: false })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ description: 'Start date of the staff', required: true })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date of the staff', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: 'List role of account', required: false })
  @IsOptional()
  accountRoles?: AccountRole[];
}

export class FindUserByEmailDto {
  @ApiProperty({ description: 'Email of the user', required: true })
  @IsString()
  @IsNotEmpty()
  email: string;
}
