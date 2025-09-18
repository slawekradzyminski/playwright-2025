import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";
import { LoginDto } from "../types/auth";

const SIGNIN_ENDPOINT = '/users/signin';

export const attemptLogin = async (request: APIRequestContext, loginData: LoginDto): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${SIGNIN_ENDPOINT}`, {
    data: loginData,
    headers: { 'Content-Type': 'application/json' },
  });
};

// Use this to send deliberately malformed JSON bodies (e.g., for 400 validation tests)
export const attemptLoginRaw = async (request: APIRequestContext, rawJson: string): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${SIGNIN_ENDPOINT}`, {
    headers: { 'Content-Type': 'application/json' },
    data: rawJson,
  });
};