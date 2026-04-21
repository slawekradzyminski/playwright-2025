import type { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { buildAuthHeaders, buildJsonHeaders } from './httpUtils';
import type { RefreshTokenRequestDto } from '../types/auth';
import type { ChatSystemPromptDto, ToolSystemPromptDto } from '../types/systemPrompt';

export const USERS_ME_ENDPOINT = '/api/v1/users/me';
export const USERS_ENDPOINT = '/api/v1/users';
export const USERS_REFRESH_ENDPOINT = '/api/v1/users/refresh';
export const USERS_LOGOUT_ENDPOINT = '/api/v1/users/logout';
export const USERS_ME_EMAIL_EVENTS_ENDPOINT = '/api/v1/users/me/email-events';
export const USERS_CHAT_SYSTEM_PROMPT_ENDPOINT = '/api/v1/users/chat-system-prompt';
export const USERS_TOOL_SYSTEM_PROMPT_ENDPOINT = '/api/v1/users/tool-system-prompt';

export class UsersClient {
  constructor(private readonly request: APIRequestContext) {}

  async getMe(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${USERS_ME_ENDPOINT}`, {
      headers: buildAuthHeaders(token)
    });
  }

  async getUserByUsername(username: string, token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${USERS_ENDPOINT}/${username}`, {
      headers: buildAuthHeaders(token)
    });
  }

  async getUsers(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${USERS_ENDPOINT}`, {
      headers: buildAuthHeaders(token)
    });
  }

  async refresh(refreshTokenRequest: RefreshTokenRequestDto): Promise<APIResponse> {
    return this.request.post(`${APP_BASE_URL}${USERS_REFRESH_ENDPOINT}`, {
      data: refreshTokenRequest,
      headers: buildJsonHeaders()
    });
  }

  async logout(token?: string): Promise<APIResponse> {
    return this.request.post(`${APP_BASE_URL}${USERS_LOGOUT_ENDPOINT}`, {
      headers: buildAuthHeaders(token)
    });
  }

  async getMyEmailEvents(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${USERS_ME_EMAIL_EVENTS_ENDPOINT}`, {
      headers: buildAuthHeaders(token)
    });
  }

  async getChatSystemPrompt(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${USERS_CHAT_SYSTEM_PROMPT_ENDPOINT}`, {
      headers: buildAuthHeaders(token)
    });
  }

  async updateChatSystemPrompt(prompt: ChatSystemPromptDto, token?: string): Promise<APIResponse> {
    return this.request.put(`${APP_BASE_URL}${USERS_CHAT_SYSTEM_PROMPT_ENDPOINT}`, {
      data: prompt,
      headers: buildJsonHeaders(token)
    });
  }

  async getToolSystemPrompt(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${USERS_TOOL_SYSTEM_PROMPT_ENDPOINT}`, {
      headers: buildAuthHeaders(token)
    });
  }

  async updateToolSystemPrompt(prompt: ToolSystemPromptDto, token?: string): Promise<APIResponse> {
    return this.request.put(`${APP_BASE_URL}${USERS_TOOL_SYSTEM_PROMPT_ENDPOINT}`, {
      data: prompt,
      headers: buildJsonHeaders(token)
    });
  }
}
