import { APIRequestContext } from '@playwright/test';
import type { ChatSystemPromptDto, ToolSystemPromptDto, UserEditDto } from '../types/user';
import { API_BASE_URL } from '../config/constants';
import { getBearerAuthHeaders, getJsonAuthHeaders } from './requestHeaders';

export const USERS_ENDPOINT = '/users';

export const getCurrentUser = async (request: APIRequestContext, jwtToken: string) => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/me`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const getUserByUsername = async (
  request: APIRequestContext,
  jwtToken: string,
  username: string
) => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/${username}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const updateUser = async (
  request: APIRequestContext,
  jwtToken: string,
  username: string,
  payload: UserEditDto
) => {
  return await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${username}`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};

export const deleteUser = async (
  request: APIRequestContext,
  jwtToken: string,
  username: string
) => {
  return await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${username}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const getChatSystemPrompt = async (request: APIRequestContext, jwtToken: string) => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/chat-system-prompt`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const updateChatSystemPrompt = async (
  request: APIRequestContext,
  jwtToken: string,
  payload: ChatSystemPromptDto
) => {
  return await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/chat-system-prompt`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};

export const getToolSystemPrompt = async (request: APIRequestContext, jwtToken: string) => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/tool-system-prompt`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const updateToolSystemPrompt = async (
  request: APIRequestContext,
  jwtToken: string,
  payload: ToolSystemPromptDto
) => {
  return await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/tool-system-prompt`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};

export const logoutUser = async (request: APIRequestContext, jwtToken: string) => {
  return await request.post(`${API_BASE_URL}${USERS_ENDPOINT}/logout`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};
