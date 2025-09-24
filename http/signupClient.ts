import { APIRequestContext } from "@playwright/test";
import { UserRegisterDto } from "../types/auth";
import { API_BASE_URL } from "../config/constants";

const SIGNUP_ENDPOINT = '/users/signup';

export const attemptSignup = async (request: APIRequestContext, signupData: UserRegisterDto) => {
  return await request.post(`${API_BASE_URL}${SIGNUP_ENDPOINT}`, {
    data: signupData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
