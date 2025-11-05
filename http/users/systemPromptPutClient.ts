import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import type { SystemPromptDto } from '../../types/auth';

const SYSTEM_PROMPT_ENDPOINT = '/users/system-prompt';

export const updateSystemPrompt = async (
  request: APIRequestContext,
  token: string,
  payload: SystemPromptDto,
): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${SYSTEM_PROMPT_ENDPOINT}`, {
    data: payload,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const updateSystemPromptWithoutAuth = async (
  request: APIRequestContext,
  payload: SystemPromptDto,
): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${SYSTEM_PROMPT_ENDPOINT}`, {
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
