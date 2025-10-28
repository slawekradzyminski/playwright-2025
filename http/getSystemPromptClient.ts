import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const SYSTEM_PROMPT_ENDPOINT = '/users';

export const getSystemPrompt = async (
  request: APIRequestContext,
  username: string,
  token?: string
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.get(`${API_BASE_URL}${SYSTEM_PROMPT_ENDPOINT}/${username}/system-prompt`, {
    headers
  });
};
