import type { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';

export const LOCAL_EMAIL_OUTBOX_ENDPOINT = '/api/v1/local/email/outbox';

export class LocalEmailOutboxClient {
  constructor(private readonly request: APIRequestContext) {}

  async getOutbox(): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${LOCAL_EMAIL_OUTBOX_ENDPOINT}`);
  }

  async clearOutbox(): Promise<APIResponse> {
    return this.request.delete(`${APP_BASE_URL}${LOCAL_EMAIL_OUTBOX_ENDPOINT}`);
  }
}
