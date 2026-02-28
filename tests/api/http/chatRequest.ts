import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ChatRequestDto } from '../../../types/ollama';
import { authHeaders, jsonHeaders } from './headers';

const CHAT_ENDPOINT = '/api/ollama/chat';

export const chatRequest = (
  request: APIRequestContext,
  jwtToken: string,
  data: ChatRequestDto,
): Promise<APIResponse> =>
  request.post(CHAT_ENDPOINT, {
    data,
    headers: {
      ...jsonHeaders,
      ...authHeaders(jwtToken),
    },
  });
