import { APIRequestContext, APIResponse } from "@playwright/test";
import { APP_BASE_URL } from "../config/constants";

export const USERS_ME_ENDPOINT = '/api/v1/users/me';

export const usersMeClient = {
    async getUserMe(request: APIRequestContext, token: string): Promise<APIResponse> {
        return await request.get(`${APP_BASE_URL}${USERS_ME_ENDPOINT}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }
};