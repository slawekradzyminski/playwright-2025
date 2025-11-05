import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';

const USERS_ME_ENDPOINT = '/users/me';

export const getCurrentUserProfile = async (
  request: APIRequestContext,
  token: string,
): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ME_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCurrentUserProfileWithoutAuth = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ME_ENDPOINT}`);
};
