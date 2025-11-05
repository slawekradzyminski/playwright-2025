import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';

const USERS_ENDPOINT = '/users';

export const deleteUserByUsername = async (
  request: APIRequestContext,
  token: string,
  username: string,
): Promise<APIResponse> => {
  return await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${encodeURIComponent(username)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteUserByUsernameWithoutAuth = async (
  request: APIRequestContext,
  username: string,
): Promise<APIResponse> => {
  return await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${encodeURIComponent(username)}`);
};
