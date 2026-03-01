import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { UserRegisterDto } from '../../types/user';
import { jsonHeaders } from '../shared/headers';

const SIGNUP_ENDPOINT = '/users/signup';

export const signupRequest = (
  request: APIRequestContext,
  data: UserRegisterDto,
): Promise<APIResponse> =>
  request.post(SIGNUP_ENDPOINT, {
    data,
    headers: jsonHeaders,
  });
