import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import { getJsonAuthHeaders } from './requestHeaders';

export const QR_CREATE_ENDPOINT = '/qr/create';

export const createQrCode = async (
  request: APIRequestContext,
  jwtToken: string,
  text: string
) => {
  return await request.post(`${API_BASE_URL}${QR_CREATE_ENDPOINT}`, {
    data: { text },
    headers: getJsonAuthHeaders(jwtToken)
  });
};
