import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";

const WHOAMI_ENDPOINT = '/users/me';

export const attemptWhoAmI = async (request: APIRequestContext, token?: string): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.get(`${API_BASE_URL}${WHOAMI_ENDPOINT}`, {
    headers
  });   
};

