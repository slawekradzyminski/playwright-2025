import type { APIRequestContext, APIResponse } from '@playwright/test';
import { authHeaders } from './headers';

const ME_ENDPOINT = '/users/me';

export const meRequest = (request: APIRequestContext, jwtToken: string): Promise<APIResponse> =>
  request.get(ME_ENDPOINT, {
    headers: authHeaders(jwtToken),
  });
