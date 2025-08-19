import { APIRequestContext, APIResponse } from "@playwright/test";
import { UserRegisterDto } from "../types/user";
import { API_BASE_URL } from "./costants";

const SIGNUP_ENDPOINT = '/users/signup';

export const signup = async (request: APIRequestContext, userData: UserRegisterDto): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${SIGNUP_ENDPOINT}`, {
    data: userData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

