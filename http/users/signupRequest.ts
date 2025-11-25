import { APIRequestContext, APIResponse } from "@playwright/test";
import type { UserRegisterDto } from "../../types/auth";
import { API_BASE_URL } from "../../config/constants";

const SIGNUP_ENDPOINT = '/users/signup';

export const attemptSignup = async (request: APIRequestContext, userData: UserRegisterDto): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${SIGNUP_ENDPOINT}`, {
    data: userData,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

