import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "./costants";
import { SystemPromptDto } from "../types/user";

const USERS_ENDPOINT = '/users';
const USERS_ME_ENDPOINT = '/users/me';

export const getUsers = async (request: APIRequestContext, token: string): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getUsersWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getCurrentUser = async (request: APIRequestContext, token: string): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ME_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getCurrentUserWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ME_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getUserByUsername = async (request: APIRequestContext, token: string, username: string): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/${username}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getUserByUsernameWithoutToken = async (request: APIRequestContext, username: string): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/${username}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const deleteUserByUsername = async (request: APIRequestContext, token: string, username: string): Promise<APIResponse> => {
  return await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${username}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getSystemPromptForUser = async (request: APIRequestContext, token: string, username: string): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/${username}/system-prompt`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getSystemPromptForUserWithoutToken = async (request: APIRequestContext, username: string): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/${username}/system-prompt`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const updateSystemPromptForUser = async (request: APIRequestContext, token: string, username: string, systemPrompt: SystemPromptDto): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${username}/system-prompt`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: systemPrompt
  });
};

export const updateSystemPromptForUserWithoutToken = async (request: APIRequestContext, username: string, systemPrompt: SystemPromptDto): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${username}/system-prompt`, {
    headers: {
      'Content-Type': 'application/json'
    },
    data: systemPrompt
  });
};
