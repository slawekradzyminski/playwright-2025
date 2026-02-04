import { APIRequestContext } from "@playwright/test";
import type { LoginDto } from "../types/auth";
import { API_BASE_URL } from "../config/constants";

export const SIGNIN_ENDPOINT = '/users/signin';

export const attemptLogin = async (request: APIRequestContext,  loginData: LoginDto) => {
    return await request.post(`${API_BASE_URL}${SIGNIN_ENDPOINT}`, {
        data: loginData,
        headers: {
          'Content-Type': 'application/json'
        }
      });
}
