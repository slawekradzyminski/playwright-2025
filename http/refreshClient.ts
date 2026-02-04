import { APIRequestContext } from '@playwright/test';
import type { RefreshTokenRequestDto } from '../types/auth';
import { API_BASE_URL } from '../config/constants';

export const REFRESH_ENDPOINT = '/users/refresh';

export const attemptRefreshToken = async (
  request: APIRequestContext,
  payload: RefreshTokenRequestDto
) => {
  return await request.post(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
    data: payload,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
