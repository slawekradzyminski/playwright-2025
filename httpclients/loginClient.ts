import { APIRequestContext, APIResponse } from "@playwright/test";
import { APP_BASE_URL } from "../config/constants";
import { LoginDto } from "../types/auth";
import { loggedApiCall } from "../utils/apiLogger";

export const SIGNIN_ENDPOINT = '/api/v1/users/signin';

export const loginClient = {
    async postLogin(request: APIRequestContext, loginData: LoginDto): Promise<APIResponse> {
        const url = `${APP_BASE_URL}${SIGNIN_ENDPOINT}`;
        return loggedApiCall(
            { method: 'POST', url, body: { ...loginData, password: '***' } },
            () => request.post(url, { data: loginData, headers: { 'Content-Type': 'application/json' } }),
        );
    }
};