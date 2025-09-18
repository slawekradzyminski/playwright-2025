import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";
import { jsonHeaders } from "./httpCommon";

const USERS_ENDPOINT = '/users';

export const attemptGetAllUsers = async (request: APIRequestContext, token?: string): Promise<APIResponse> => {
  const headers = jsonHeaders(token);

  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`, {
    headers
  });   
};

