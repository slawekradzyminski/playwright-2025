import type { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { buildAuthHeaders } from './httpUtils';

export const OLLAMA_TOOL_DEFINITIONS_ENDPOINT = '/api/v1/ollama/chat/tools/definitions';

export class OllamaClient {
  constructor(private readonly request: APIRequestContext) {}

  async getToolDefinitions(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${OLLAMA_TOOL_DEFINITIONS_ENDPOINT}`, {
      headers: buildAuthHeaders(token)
    });
  }
}
