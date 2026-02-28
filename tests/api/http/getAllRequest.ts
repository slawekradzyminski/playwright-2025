import type { APIRequestContext, APIResponse } from '@playwright/test';
import { authHeaders } from './headers';

const GET_ALL_USERS_ENDPOINT = '/users';

export const getAllRequest = (
  request: APIRequestContext,
  jwtToken: string,
): Promise<APIResponse> =>
  request.get(GET_ALL_USERS_ENDPOINT, {
    headers: authHeaders(jwtToken),
  });
