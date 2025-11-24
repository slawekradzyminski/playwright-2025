import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "../config/constants";
import type { SystemPromptDto } from "../types/auth";

const SYSTEM_PROMPT_ENDPOINT = '/users/system-prompt';

export const updateSystemPrompt = async (
  request: APIRequestContext, 
  body: SystemPromptDto, 
  token?: string
): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.put(`${API_BASE_URL}${SYSTEM_PROMPT_ENDPOINT}`, {
    headers,
    data: body,
  });
};

