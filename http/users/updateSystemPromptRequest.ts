import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../../config/constants";

const SYSTEM_PROMPT_ENDPOINT = '/users/system-prompt';

export const updateSystemPrompt = async (request: APIRequestContext, token: string, systemPrompt: string) => {
  return await request.put(`${API_BASE_URL}${SYSTEM_PROMPT_ENDPOINT}`, {
    data: { systemPrompt },
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const updateSystemPromptWithoutAuth = async (request: APIRequestContext, systemPrompt: string) => {
  return await request.put(`${API_BASE_URL}${SYSTEM_PROMPT_ENDPOINT}`, {
    data: { systemPrompt },
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

