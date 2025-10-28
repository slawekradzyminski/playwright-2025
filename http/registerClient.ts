import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../config/constants";
import { UserRegisterDto } from "../types/auth";

const SIGNUP_ENDPOINT = '/users/signup';

export const attemptRegistration = async (request: APIRequestContext, userData: UserRegisterDto) => {
  return await request.post(`${API_BASE_URL}${SIGNUP_ENDPOINT}`, {
    data: userData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

