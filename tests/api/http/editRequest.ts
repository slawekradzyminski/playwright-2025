import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { UserEditDto } from '../../../types/user';
import { authHeaders, jsonHeaders } from './headers';

const USERS_ENDPOINT = '/users';

export const editRequest = (
  request: APIRequestContext,
  jwtToken: string,
  username: string,
  data: UserEditDto,
): Promise<APIResponse> =>
  request.put(`${USERS_ENDPOINT}/${username}`, {
    data,
    headers: {
      ...jsonHeaders,
      ...authHeaders(jwtToken),
    },
  });
