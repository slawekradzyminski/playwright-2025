import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { RefreshTokenRequestDto } from '../../../types/auth';
import { jsonHeaders } from './headers';

const REFRESH_ENDPOINT = '/users/refresh';

export const refreshRequest = (
  request: APIRequestContext,
  data: RefreshTokenRequestDto,
): Promise<APIResponse> =>
  request.post(REFRESH_ENDPOINT, {
    data,
    headers: jsonHeaders,
  });
