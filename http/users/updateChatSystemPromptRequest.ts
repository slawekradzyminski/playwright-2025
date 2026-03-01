import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ChatSystemPromptDto } from '../../types/prompt';
import { authHeaders, jsonHeaders } from '../shared/headers';

const CHAT_SYSTEM_PROMPT_ENDPOINT = '/users/chat-system-prompt';

export const updateChatSystemPromptRequest = (
  request: APIRequestContext,
  jwtToken: string,
  data: ChatSystemPromptDto,
): Promise<APIResponse> =>
  request.put(CHAT_SYSTEM_PROMPT_ENDPOINT, {
    data,
    headers: {
      ...jsonHeaders,
      ...authHeaders(jwtToken),
    },
  });
