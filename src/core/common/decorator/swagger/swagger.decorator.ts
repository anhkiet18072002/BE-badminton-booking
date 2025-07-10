import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const Swagger = (tagName: string, isPublic: boolean = false) => {
  if (isPublic) {
  }

  return applyDecorators(
    ApiTags(tagName),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized Access' }),
    ApiBadRequestResponse({ description: 'Bad Request' }),
    ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
  );
};
