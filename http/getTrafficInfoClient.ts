import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";
import { jsonHeaders } from "./httpCommon";

const TRAFFIC_INFO_ENDPOINT = "/api/traffic/info";

export const attemptGetTrafficInfo = async (
  request: APIRequestContext,
  token?: string
): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${TRAFFIC_INFO_ENDPOINT}`, {
    headers: jsonHeaders(token),
  });
};
