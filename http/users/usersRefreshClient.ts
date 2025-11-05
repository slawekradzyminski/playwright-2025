import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';

const USERS_REFRESH_ENDPOINT = '/users/refresh';

export const refreshToken = async (
  request: APIRequestContext,
  token: string,
): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_REFRESH_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const refreshTokenWithoutAuth = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_REFRESH_ENDPOINT}`);
};
