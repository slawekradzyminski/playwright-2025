import { APIRequestContext, APIResponse } from "@playwright/test";
import type { UserEditDto } from "../../types/auth";
import { API_BASE_URL } from "../../config/constants";

const USERS_ENDPOINT = '/users';

export const updateUser = async (
  request: APIRequestContext,
  username: string,
  userData: UserEditDto,
  token?: string
): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${username}`, {
    headers,
    data: userData,
  });
};

