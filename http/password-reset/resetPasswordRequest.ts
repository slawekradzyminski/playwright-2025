import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ResetPasswordRequestDto } from '../../types/auth';
import { jsonHeaders } from '../shared/headers';

const RESET_PASSWORD_ENDPOINT = '/users/password/reset';

export const resetPasswordRequest = (
  request: APIRequestContext,
  data: ResetPasswordRequestDto,
): Promise<APIResponse> =>
  request.post(RESET_PASSWORD_ENDPOINT, {
    data,
    headers: jsonHeaders,
  });
