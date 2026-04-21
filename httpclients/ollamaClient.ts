import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './baseApiClient';

export const OLLAMA_TOOL_DEFINITIONS_ENDPOINT = '/api/v1/ollama/chat/tools/definitions';

export class OllamaClient extends BaseApiClient {
  async getToolDefinitions(token?: string): Promise<APIResponse> {
    return this.get(OLLAMA_TOOL_DEFINITIONS_ENDPOINT, token);
  }
}
