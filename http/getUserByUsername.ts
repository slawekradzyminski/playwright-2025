import { APIRequestContext } from "@playwright/test";
import { API_URL } from "../config/constants";

const USERS_ENDPOINT = '/users';

export function getUserByUsername(request: APIRequestContext, token: string, username: string) {
    return request.get(`${API_URL}${USERS_ENDPOINT}/${username}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
} 