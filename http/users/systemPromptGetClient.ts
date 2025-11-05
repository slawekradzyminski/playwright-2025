import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';

const SYSTEM_PROMPT_ENDPOINT = '/users/system-prompt';

export const getSystemPrompt = async (
  request: APIRequestContext,
  token: string,
): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${SYSTEM_PROMPT_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getSystemPromptWithoutAuth = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${SYSTEM_PROMPT_ENDPOINT}`);
};
