import type { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import type { CreateQrDto } from '../types/qr';

export const QR_CREATE_ENDPOINT = '/api/v1/qr/create';

export class QrClient {
  constructor(private readonly request: APIRequestContext) {}

  async createQr(createQrData: CreateQrDto, token?: string): Promise<APIResponse> {
    return this.request.post(`${APP_BASE_URL}${QR_CREATE_ENDPOINT}`, {
      data: createQrData,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
  }
}
