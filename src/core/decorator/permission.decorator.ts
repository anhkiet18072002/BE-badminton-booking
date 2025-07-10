import { SetMetadata } from '@nestjs/common';
import { KEYS } from 'src/core/constant';

export const Permission = (permissions: { AND?: string[]; OR?: string[] }) =>
  SetMetadata(KEYS.PERMISSION, permissions);
