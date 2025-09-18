import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";

const DELETE_USER_ENDPOINT = '/users';

export const deleteUser = async (request: APIRequestContext, username: string, token: string): Promise<APIResponse> => {
  return await request.delete(`${API_BASE_URL}${DELETE_USER_ENDPOINT}/${username}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};
