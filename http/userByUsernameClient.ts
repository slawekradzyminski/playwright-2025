import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const USER_BY_USERNAME_ENDPOINT = '/users';

export const getUserByUsername = async (
  request: APIRequestContext,
  username: string,
  token?: string
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.get(`${API_BASE_URL}${USER_BY_USERNAME_ENDPOINT}/${username}`, {
    headers
  });
};
