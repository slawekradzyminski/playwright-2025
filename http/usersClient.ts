import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "./costants";

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
