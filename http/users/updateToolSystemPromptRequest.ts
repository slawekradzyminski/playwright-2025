import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ToolSystemPromptDto } from '../../types/prompt';
import { authHeaders, jsonHeaders } from '../shared/headers';

const TOOL_SYSTEM_PROMPT_ENDPOINT = '/users/tool-system-prompt';

export const updateToolSystemPromptRequest = (
  request: APIRequestContext,
  jwtToken: string,
  data: ToolSystemPromptDto,
): Promise<APIResponse> =>
  request.put(TOOL_SYSTEM_PROMPT_ENDPOINT, {
    data,
    headers: {
      ...jsonHeaders,
      ...authHeaders(jwtToken),
    },
  });
