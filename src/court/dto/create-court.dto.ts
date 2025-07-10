import { CreateBaseDto } from 'src/core/dto/crete-base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCourtDto extends CreateBaseDto {
  @ApiProperty({ description: 'Name of the court', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Location of the court', required: false })
  @IsString()
  @IsOptional()
  location?: string;
}
