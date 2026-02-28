import type { APIRequestContext, APIResponse } from '@playwright/test';
import { authHeaders } from './headers';

const USERS_ENDPOINT = '/users';

export const getByUsernameRequest = (
  request: APIRequestContext,
  jwtToken: string,
  username: string,
): Promise<APIResponse> =>
  request.get(`${USERS_ENDPOINT}/${username}`, {
    headers: authHeaders(jwtToken),
  });
