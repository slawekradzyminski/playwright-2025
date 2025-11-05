import { APIRequestContext } from "@playwright/test";
import { attemptLogin } from "../http/loginClient";
import type { LoginDto, LoginResponseDto } from "../types/auth";

export const getAuthToken = async (request: APIRequestContext, username: string = 'admin', password: string = 'admin'): Promise<string> => {
  const loginData: LoginDto = { username, password };
  const response = await attemptLogin(request, loginData);
  const responseBody: LoginResponseDto = await response.json();
  return responseBody.token;
};

