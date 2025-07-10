import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SortBaseDto {
  @ApiProperty({ description: 'Sort result by desc|asc' })
  @IsString()
  @IsOptional()
  sort?: string;
}
