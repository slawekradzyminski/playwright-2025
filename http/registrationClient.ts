import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "../config/constants";
import { UserRegisterDto } from "../types/auth";

const SIGNUP_ENDPOINT = '/users/signup';

export const attemptRegistration = async (request: APIRequestContext, registerData: UserRegisterDto): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${SIGNUP_ENDPOINT}`, {
    data: registerData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

