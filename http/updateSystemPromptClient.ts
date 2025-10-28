import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import type { SystemPromptDto } from '../types/user';

const SYSTEM_PROMPT_ENDPOINT = '/users';

export const updateSystemPrompt = async (
  request: APIRequestContext,
  username: string,
  systemPrompt: SystemPromptDto,
  token?: string
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.put(`${API_BASE_URL}${SYSTEM_PROMPT_ENDPOINT}/${username}/system-prompt`, {
    data: systemPrompt,
    headers
  });
};
