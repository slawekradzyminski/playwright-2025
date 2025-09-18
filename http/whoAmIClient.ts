import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";
import { jsonHeaders } from "./httpCommon";

const WHOAMI_ENDPOINT = '/users/me';

export const attemptWhoAmI = async (request: APIRequestContext, token?: string): Promise<APIResponse> => {
  const headers = jsonHeaders(token);

  return await request.get(`${API_BASE_URL}${WHOAMI_ENDPOINT}`, { headers });
};

