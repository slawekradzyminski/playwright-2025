import { APIRequestContext } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { API_BASE_URL } from '../config/constants';
import { JSON_HEADERS } from './requestHeaders';

export const SIGNUP_ENDPOINT = '/users/signup';

export const attemptSignup = async (
  request: APIRequestContext,
  registerData: UserRegisterDto
) => {
  return await request.post(`${API_BASE_URL}${SIGNUP_ENDPOINT}`, {
    data: registerData,
    headers: JSON_HEADERS
  });
};
