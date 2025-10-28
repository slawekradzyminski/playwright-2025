import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const REFRESH_ENDPOINT = '/users/refresh';

export const refreshToken = async (request: APIRequestContext, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.get(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
    headers
  });
};
