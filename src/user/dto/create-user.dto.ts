import { CreateBaseDto } from 'src/core/dto/crete-base.dto';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '@prisma/client';

export class CreateUserDto extends CreateBaseDto {
  @ApiProperty({ description: 'First name of the role', required: true })
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

  @ApiProperty({ description: 'Start date of the account', required: true })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date of the account', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: 'Booking court', required: false })
  @IsOptional()
  bookings?: Booking[];
}
