import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { SortBaseDto } from 'src/core/dto/sort-base.dto';

export class QueryBaseDto extends SortBaseDto {
  @ApiProperty({
    description: 'Max number of items that queries',
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Target page of items that queries',
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Text string that queries', required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
