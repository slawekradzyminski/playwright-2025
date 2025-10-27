import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../config/constants";
import { LoginDto } from "../types/auth";

const SIGNIN_ENDPOINT = '/users/signin';

export const attemptLogin = async (request: APIRequestContext, loginData: LoginDto) => {
  return await request.post(`${API_BASE_URL}${SIGNIN_ENDPOINT}`, {
    data: loginData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};