import type { APIRequestContext, APIResponse } from '@playwright/test';
import { authHeaders } from './headers';

const LOGOUT_ENDPOINT = '/users/logout';

export const logoutRequest = (
  request: APIRequestContext,
  jwtToken: string,
): Promise<APIResponse> =>
  request.post(LOGOUT_ENDPOINT, {
    headers: authHeaders(jwtToken),
  });
