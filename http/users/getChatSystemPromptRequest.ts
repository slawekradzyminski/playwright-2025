import type { APIRequestContext, APIResponse } from '@playwright/test';
import { authHeaders } from '../shared/headers';

const CHAT_SYSTEM_PROMPT_ENDPOINT = '/users/chat-system-prompt';

export const getChatSystemPromptRequest = (
  request: APIRequestContext,
  jwtToken: string,
): Promise<APIResponse> =>
  request.get(CHAT_SYSTEM_PROMPT_ENDPOINT, {
    headers: authHeaders(jwtToken),
  });
