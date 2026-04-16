import { APIRequestContext, APIResponse } from "@playwright/test";
import { APP_BASE_URL } from "../config/constants";
import { RegisterDto } from "../types/auth";
import { loggedApiCall } from "../utils/apiLogger";

export const SIGNUP_ENDPOINT = '/api/v1/users/signup';

export const registerClient = {
    async postRegister(request: APIRequestContext, registerData: RegisterDto): Promise<APIResponse> {
        const url = `${APP_BASE_URL}${SIGNUP_ENDPOINT}`;
        return loggedApiCall(
            { method: 'POST', url, body: { ...registerData, password: '***' } },
            () => request.post(url, { data: registerData, headers: { 'Content-Type': 'application/json' } }),
        );
    }
};