import { APIRequestContext } from '@playwright/test';
import type { ForgotPasswordRequestDto, ResetPasswordRequestDto } from '../types/auth';
import { API_BASE_URL } from '../config/constants';

export const FORGOT_PASSWORD_ENDPOINT = '/users/password/forgot';
export const RESET_PASSWORD_ENDPOINT = '/users/password/reset';

export const requestPasswordReset = async (
  request: APIRequestContext,
  payload: ForgotPasswordRequestDto
) => {
  return await request.post(`${API_BASE_URL}${FORGOT_PASSWORD_ENDPOINT}`, {
    data: payload,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const resetPassword = async (
  request: APIRequestContext,
  payload: ResetPasswordRequestDto
) => {
  return await request.post(`${API_BASE_URL}${RESET_PASSWORD_ENDPOINT}`, {
    data: payload,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
