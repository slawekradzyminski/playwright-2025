import { APIRequestContext, APIResponse } from "@playwright/test";
import { APP_BASE_URL } from "../config/constants";
import { loggedApiCall } from "../utils/apiLogger";

export const USERS_ME_ENDPOINT = '/api/v1/users/me';

export const usersMeClient = {
    async getUserMe(request: APIRequestContext, token?: string): Promise<APIResponse> {
        const url = `${APP_BASE_URL}${USERS_ME_ENDPOINT}`;
        return loggedApiCall(
            { method: 'GET', url },
            () => request.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            }),
        );
    }
};