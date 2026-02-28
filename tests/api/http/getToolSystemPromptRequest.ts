import type { APIRequestContext, APIResponse } from '@playwright/test';
import { authHeaders } from './headers';

const TOOL_SYSTEM_PROMPT_ENDPOINT = '/users/tool-system-prompt';

export const getToolSystemPromptRequest = (
  request: APIRequestContext,
  jwtToken: string,
): Promise<APIResponse> =>
  request.get(TOOL_SYSTEM_PROMPT_ENDPOINT, {
    headers: authHeaders(jwtToken),
  });
