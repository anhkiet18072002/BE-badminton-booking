import { RolePermission } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateBaseDto } from 'src/core/dto/crete-base.dto';

export class CreateRoleDto extends CreateBaseDto {
  @ApiProperty({ description: 'Name of the role', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Key of the role', required: true })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Description of the role', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Set permission for role',
    required: false,
  })
  @IsOptional()
  rolePermissions?: RolePermission[];
}
