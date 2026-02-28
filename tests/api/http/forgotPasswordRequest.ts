import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ForgotPasswordRequestDto } from '../../../types/auth';
import { jsonHeaders } from './headers';

const FORGOT_PASSWORD_ENDPOINT = '/users/password/forgot';

export const forgotPasswordRequest = (
  request: APIRequestContext,
  data: ForgotPasswordRequestDto,
): Promise<APIResponse> =>
  request.post(FORGOT_PASSWORD_ENDPOINT, {
    data,
    headers: jsonHeaders,
  });
