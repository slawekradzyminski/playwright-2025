import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "../config/constants";

const USERS_ENDPOINT = '/users';

export const getUsers = async (request: APIRequestContext, token: string): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getUsersWithoutAuth = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`);
};

