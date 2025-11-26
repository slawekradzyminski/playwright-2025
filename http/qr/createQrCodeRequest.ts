import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import type { CreateQrDto } from '../../types/qr';

const QR_CREATE_ENDPOINT = '/qr/create';

export const createQrCode = async (
  request: APIRequestContext,
  qrData: CreateQrDto,
  token?: string
): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.post(`${API_BASE_URL}${QR_CREATE_ENDPOINT}`, {
    data: qrData,
    headers
  });
};
