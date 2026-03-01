import type { APIRequestContext, APIResponse } from '@playwright/test';

const OUTBOX_ENDPOINT = '/local/email/outbox';

export const clearOutboxRequest = (request: APIRequestContext): Promise<APIResponse> =>
  request.delete(OUTBOX_ENDPOINT);
