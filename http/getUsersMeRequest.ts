import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const USERS_ME_ENDPOINT = '/users/me';

export const getCurrentUser = async (request: APIRequestContext, token?: string): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.get(`${API_BASE_URL}${USERS_ME_ENDPOINT}`, {
    headers
  });
};
