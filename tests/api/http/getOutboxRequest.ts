import type { APIRequestContext, APIResponse } from '@playwright/test';

const OUTBOX_ENDPOINT = '/local/email/outbox';

export const getOutboxRequest = (request: APIRequestContext): Promise<APIResponse> =>
  request.get(OUTBOX_ENDPOINT);
