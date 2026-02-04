import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import { getJsonAuthHeaders } from './requestHeaders';

export const EMAIL_ENDPOINT = '/email';

export interface EmailRequestDto {
  to?: string;
  subject: string;
  message: string;
}

export const sendEmail = async (
  request: APIRequestContext,
  jwtToken: string,
  payload: EmailRequestDto
) => {
  return await request.post(`${API_BASE_URL}${EMAIL_ENDPOINT}`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};
