import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";

const GET_USER_BY_USERNAME_ENDPOINT = '/users';

export const getUserByUsername = async (request: APIRequestContext, username: string, token: string): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${GET_USER_BY_USERNAME_ENDPOINT}/${username}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};
