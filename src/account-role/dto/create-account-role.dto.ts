import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBaseDto } from 'src/core/dto/crete-base.dto';

export class CreateAccountRoleDto extends CreateBaseDto {
  @ApiProperty({ description: 'ID of account', required: true })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ description: 'ID of role', required: true })
  @IsString()
  @IsNotEmpty()
  roleId: string;
}
