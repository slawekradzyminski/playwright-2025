import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../config/constants";

const REFRESH_ENDPOINT = '/users/refresh';

export const refreshToken = async (request: APIRequestContext, token: string) => {
  return await request.get(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const refreshTokenWithoutAuth = async (request: APIRequestContext) => {
  return await request.get(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

