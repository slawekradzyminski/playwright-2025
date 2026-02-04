import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import { getBearerAuthHeaders } from './requestHeaders';

export const USERS_ENDPOINT = '/users';

export const getUsers = async (request: APIRequestContext, jwtToken: string) => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};
