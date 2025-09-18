import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../config/constants";

export const attemptTokenRefresh = async (request: APIRequestContext, token: string) => {
  return await request.get(`${API_BASE_URL}/users/refresh`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};