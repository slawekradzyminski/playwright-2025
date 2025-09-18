import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";
import type { UserEditDto } from "../types/auth";

const UPDATE_USER_ENDPOINT = '/users';

export const updateUser = async (request: APIRequestContext, username: string, userData: UserEditDto, token: string): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${UPDATE_USER_ENDPOINT}/${username}`, {
    data: userData,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};
