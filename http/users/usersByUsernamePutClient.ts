import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import type { UserEditDto } from '../../types/auth';

const USERS_ENDPOINT = '/users';

export const updateUserByUsername = async (
  request: APIRequestContext,
  token: string,
  username: string,
  payload: UserEditDto,
): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${encodeURIComponent(username)}`, {
    data: payload,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const updateUserByUsernameWithoutAuth = async (
  request: APIRequestContext,
  username: string,
  payload: UserEditDto,
): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${encodeURIComponent(username)}`, {
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
