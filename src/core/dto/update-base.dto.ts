import { PartialType } from '@nestjs/swagger';
import { CreateBaseDto } from './crete-base.dto';

export class UpdateBaseDto extends PartialType(CreateBaseDto) {}
