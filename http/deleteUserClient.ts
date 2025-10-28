import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const DELETE_USER_ENDPOINT = '/users';

export const deleteUser = async (request: APIRequestContext, username: string, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.delete(`${API_BASE_URL}${DELETE_USER_ENDPOINT}/${username}`, {
    headers
  });
};
