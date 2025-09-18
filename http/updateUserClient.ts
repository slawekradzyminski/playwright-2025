import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";
import type { UserEditDto } from "../types/user";
import { jsonHeaders } from "./httpCommon";

const USER_BY_USERNAME_ENDPOINT = (username: string) => `/users/${encodeURIComponent(username)}`;

export const attemptUpdateUser = async (
  request: APIRequestContext,
  username: string,
  payload: UserEditDto,
  token?: string
): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${USER_BY_USERNAME_ENDPOINT(username)}`, {
    headers: jsonHeaders(token),
    data: payload,
  });
};
