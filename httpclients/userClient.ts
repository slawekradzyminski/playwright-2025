import type { APIRequestContext, APIResponse } from '@playwright/test';
import type {
  ChatSystemPromptDto,
  ToolSystemPromptDto,
  UserEditDto
} from '../types/auth';

const USERS_ENDPOINT = '/api/v1/users';
const ME_ENDPOINT = `${USERS_ENDPOINT}/me`;
const CHAT_SYSTEM_PROMPT_ENDPOINT = `${USERS_ENDPOINT}/chat-system-prompt`;
const TOOL_SYSTEM_PROMPT_ENDPOINT = `${USERS_ENDPOINT}/tool-system-prompt`;

export class UserClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  getMe(token?: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${ME_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  getUsers(token?: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${USERS_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  getUserByUsername(username: string, token?: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${USERS_ENDPOINT}/${username}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  updateUserByUsername(username: string, payload: UserEditDto, token?: string): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}${USERS_ENDPOINT}/${username}`, {
      data: payload,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  deleteUser(username: string, token?: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${USERS_ENDPOINT}/${username}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  getChatSystemPrompt(token?: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${CHAT_SYSTEM_PROMPT_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  updateChatSystemPrompt(payload: ChatSystemPromptDto, token?: string): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}${CHAT_SYSTEM_PROMPT_ENDPOINT}`, {
      data: payload,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  getToolSystemPrompt(token?: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${TOOL_SYSTEM_PROMPT_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  updateToolSystemPrompt(payload: ToolSystemPromptDto, token?: string): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}${TOOL_SYSTEM_PROMPT_ENDPOINT}`, {
      data: payload,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }
}
