import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTHORIZATION = 'skip-authorization';
export const SkipAuthorization = () => SetMetadata(SKIP_AUTHORIZATION, true);
