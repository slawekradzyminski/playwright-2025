import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { EmailDto } from '../../../types/email';
import { authHeaders, jsonHeaders } from './headers';

const SEND_EMAIL_ENDPOINT = '/email';

export const sendEmailRequest = (
  request: APIRequestContext,
  jwtToken: string,
  data: EmailDto,
): Promise<APIResponse> =>
  request.post(SEND_EMAIL_ENDPOINT, {
    data,
    headers: {
      ...jsonHeaders,
      ...authHeaders(jwtToken),
    },
  });
