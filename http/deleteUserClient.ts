import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";
import { jsonHeaders } from "./httpCommon";

const USER_BY_USERNAME_ENDPOINT = (username: string) => `/users/${encodeURIComponent(username)}`;

export const attemptDeleteUser = async (
  request: APIRequestContext,
  username: string,
  token?: string
): Promise<APIResponse> => {
  return await request.delete(`${API_BASE_URL}${USER_BY_USERNAME_ENDPOINT(username)}`, {
    headers: jsonHeaders(token),
  });
};
