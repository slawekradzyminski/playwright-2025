import { APIRequestContext, APIResponse } from "@playwright/test";
import { SSO_BACKEND_BASE_URL } from "../config/sso";
import type { SsoExchangeDto } from "../types/auth";
import { loggedApiCall } from "../utils/apiLogger";

export const SSO_EXCHANGE_ENDPOINT = '/api/v1/users/sso/exchange';

export const ssoClient = {
    async postSsoExchange(request: APIRequestContext, ssoData: SsoExchangeDto): Promise<APIResponse> {
        const url = `${SSO_BACKEND_BASE_URL}${SSO_EXCHANGE_ENDPOINT}`;
        return loggedApiCall(
            { method: 'POST', url, body: { idToken: '***' } },
            () => request.post(url, { data: ssoData, headers: { 'Content-Type': 'application/json' } }),
        );
    }
};
