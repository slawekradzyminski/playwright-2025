import type { APIResponse } from '@playwright/test';
import type { CreateQrDto } from '../types/qr';
import { BaseApiClient } from './baseApiClient';

export const QR_CREATE_ENDPOINT = '/api/v1/qr/create';

export class QrClient extends BaseApiClient {
  async createQr(createQrData: CreateQrDto, token?: string): Promise<APIResponse> {
    return this.postJson(QR_CREATE_ENDPOINT, createQrData, token);
  }
}
