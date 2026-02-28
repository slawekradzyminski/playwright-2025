import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ChatRequestDto } from '../../../types/ollama';
import { authHeaders, jsonHeaders } from './headers';

const CHAT_WITH_TOOLS_ENDPOINT = '/api/ollama/chat/tools';

export const chatWithToolsRequest = (
  request: APIRequestContext,
  jwtToken: string,
  data: ChatRequestDto,
): Promise<APIResponse> =>
  request.post(CHAT_WITH_TOOLS_ENDPOINT, {
    data,
    headers: {
      ...jsonHeaders,
      ...authHeaders(jwtToken),
    },
  });
