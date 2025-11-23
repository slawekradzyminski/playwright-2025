import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../../config/constants";

const SYSTEM_PROMPT_ENDPOINT = '/users/system-prompt';

export const getSystemPrompt = async (request: APIRequestContext, token: string) => {
  return await request.get(`${API_BASE_URL}${SYSTEM_PROMPT_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getSystemPromptWithoutAuth = async (request: APIRequestContext) => {
  return await request.get(`${API_BASE_URL}${SYSTEM_PROMPT_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

