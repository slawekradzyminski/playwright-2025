import { APIRequestContext, APIResponse } from "@playwright/test";
import { APP_BASE_URL } from "../config/constants";
import { LoginDto } from "../types/auth";

export const SIGNIN_ENDPOINT = '/api/v1/users/signin';

export const loginClient = {
    async postLogin(request: APIRequestContext, loginData: LoginDto): Promise<APIResponse> {
        return await request.post(`${APP_BASE_URL}${SIGNIN_ENDPOINT}`, {
            data: loginData,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};