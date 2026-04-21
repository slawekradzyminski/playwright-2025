import type { APIResponse } from '@playwright/test';
import type { RefreshTokenRequestDto } from '../types/auth';
import type { ChatSystemPromptDto, ToolSystemPromptDto } from '../types/systemPrompt';
import { BaseApiClient } from './baseApiClient';

export const USERS_ME_ENDPOINT = '/api/v1/users/me';
export const USERS_ENDPOINT = '/api/v1/users';
export const USERS_REFRESH_ENDPOINT = '/api/v1/users/refresh';
export const USERS_LOGOUT_ENDPOINT = '/api/v1/users/logout';
export const USERS_ME_EMAIL_EVENTS_ENDPOINT = '/api/v1/users/me/email-events';
export const USERS_CHAT_SYSTEM_PROMPT_ENDPOINT = '/api/v1/users/chat-system-prompt';
export const USERS_TOOL_SYSTEM_PROMPT_ENDPOINT = '/api/v1/users/tool-system-prompt';

export class UsersClient extends BaseApiClient {
  async getMe(token?: string): Promise<APIResponse> {
    return this.get(USERS_ME_ENDPOINT, token);
  }

  async getUserByUsername(username: string, token?: string): Promise<APIResponse> {
    return this.get(`${USERS_ENDPOINT}/${username}`, token);
  }

  async getUsers(token?: string): Promise<APIResponse> {
    return this.get(USERS_ENDPOINT, token);
  }

  async refresh(refreshTokenRequest: RefreshTokenRequestDto): Promise<APIResponse> {
    return this.postJson(USERS_REFRESH_ENDPOINT, refreshTokenRequest);
  }

  async logout(token?: string): Promise<APIResponse> {
    return this.postJson(USERS_LOGOUT_ENDPOINT, undefined, token);
  }

  async getMyEmailEvents(token?: string): Promise<APIResponse> {
    return this.get(USERS_ME_EMAIL_EVENTS_ENDPOINT, token);
  }

  async getChatSystemPrompt(token?: string): Promise<APIResponse> {
    return this.get(USERS_CHAT_SYSTEM_PROMPT_ENDPOINT, token);
  }

  async updateChatSystemPrompt(prompt: ChatSystemPromptDto, token?: string): Promise<APIResponse> {
    return this.putJson(USERS_CHAT_SYSTEM_PROMPT_ENDPOINT, prompt, token);
  }

  async getToolSystemPrompt(token?: string): Promise<APIResponse> {
    return this.get(USERS_TOOL_SYSTEM_PROMPT_ENDPOINT, token);
  }

  async updateToolSystemPrompt(prompt: ToolSystemPromptDto, token?: string): Promise<APIResponse> {
    return this.putJson(USERS_TOOL_SYSTEM_PROMPT_ENDPOINT, prompt, token);
  }
}
