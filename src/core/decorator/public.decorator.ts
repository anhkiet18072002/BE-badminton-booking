import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { KEYS } from '../constant/base.constant';

export const Public = () =>
  applyDecorators(ApiSecurity('public'), SetMetadata(KEYS.PUBLIC, true));
