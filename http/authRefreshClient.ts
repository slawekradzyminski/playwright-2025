import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "./costants";

const REFRESH_ENDPOINT = '/users/refresh';

export const refreshToken = async (request: APIRequestContext, token: string): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const refreshTokenWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
