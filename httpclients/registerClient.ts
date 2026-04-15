import { APIRequestContext, APIResponse } from "@playwright/test";
import { APP_BASE_URL } from "../config/constants";
import { RegisterDto } from "../types/auth";

export const SIGNUP_ENDPOINT = '/api/v1/users/signup';

export const registerClient = {
    async postRegister(request: APIRequestContext, registerData: RegisterDto): Promise<APIResponse> {
        return await request.post(`${APP_BASE_URL}${SIGNUP_ENDPOINT}`, {
            data: registerData,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};