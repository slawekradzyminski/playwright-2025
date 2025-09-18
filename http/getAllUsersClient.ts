import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";

const USERS_ENDPOINT = '/users';

export const attemptGetAllUsers = async (request: APIRequestContext, token?: string): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`, {
    headers
  });   
};

