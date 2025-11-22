import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../config/constants";

const REFRESH_ENDPOINT = '/users/refresh';
const ME_ENDPOINT = '/users/me';
const SYSTEM_PROMPT_ENDPOINT = '/users/system-prompt';

export const refreshToken = async (request: APIRequestContext, token: string) => {
  return await request.get(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const refreshTokenWithoutAuth = async (request: APIRequestContext) => {
  return await request.get(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getMe = async (request: APIRequestContext, token: string) => {
  return await request.get(`${API_BASE_URL}${ME_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getMeWithoutAuth = async (request: APIRequestContext) => {
  return await request.get(`${API_BASE_URL}${ME_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

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

