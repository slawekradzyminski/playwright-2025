import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './baseApiClient';

export const LOCAL_EMAIL_OUTBOX_ENDPOINT = '/api/v1/local/email/outbox';

export class LocalEmailOutboxClient extends BaseApiClient {
  async getOutbox(): Promise<APIResponse> {
    return this.get(LOCAL_EMAIL_OUTBOX_ENDPOINT);
  }

  async clearOutbox(): Promise<APIResponse> {
    return this.delete(LOCAL_EMAIL_OUTBOX_ENDPOINT);
  }
}
