import { APIRequestContext, APIResponse } from "@playwright/test";
import { LoginDto } from "../types/auth";
import { API_BASE_URL } from "./costants";

const SIGNIN_ENDPOINT = '/users/signin';

export const login = async (request: APIRequestContext, loginData: LoginDto): Promise<APIResponse> => {
    return await request.post(`${API_BASE_URL}${SIGNIN_ENDPOINT}`, {
    data: loginData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};