import type { APIRequestContext, APIResponse } from '@playwright/test';
import { authHeaders } from './headers';

const USERS_ENDPOINT = '/users';

export const deleteRequest = (
  request: APIRequestContext,
  jwtToken: string,
  username: string,
): Promise<APIResponse> =>
  request.delete(`${USERS_ENDPOINT}/${username}`, {
    headers: authHeaders(jwtToken),
  });
