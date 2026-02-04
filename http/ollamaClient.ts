import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import { getBearerAuthHeaders, getJsonAuthHeaders } from './requestHeaders';

export const OLLAMA_ENDPOINT = '/api/ollama';

export const generateWithOllama = async (
  request: APIRequestContext,
  jwtToken: string,
  payload: { model: string; prompt: string; think?: boolean }
) => {
  return await request.post(`${API_BASE_URL}${OLLAMA_ENDPOINT}/generate`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};

export const chatWithOllama = async (
  request: APIRequestContext,
  jwtToken: string,
  payload: { model: string; messages: Array<{ role: string; content?: string }>; think?: boolean }
) => {
  return await request.post(`${API_BASE_URL}${OLLAMA_ENDPOINT}/chat`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};

export const getOllamaToolDefinitions = async (request: APIRequestContext, jwtToken: string) => {
  return await request.get(`${API_BASE_URL}${OLLAMA_ENDPOINT}/chat/tools/definitions`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const chatWithOllamaTools = async (
  request: APIRequestContext,
  jwtToken: string,
  payload: {
    model: string;
    messages: Array<{ role: string; content?: string }>;
    tools?: unknown[];
    think?: boolean;
  }
) => {
  return await request.post(`${API_BASE_URL}${OLLAMA_ENDPOINT}/chat/tools`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};
