import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'Email to login', required: true })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password to login', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}
