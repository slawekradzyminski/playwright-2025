import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import type { UserEditDto } from '../types/user';

const UPDATE_USER_ENDPOINT = '/users';

export const updateUser = async (
  request: APIRequestContext,
  username: string,
  userData: UserEditDto,
  token?: string
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.put(`${API_BASE_URL}${UPDATE_USER_ENDPOINT}/${username}`, {
    data: userData,
    headers
  });
};
