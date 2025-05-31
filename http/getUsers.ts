import { APIRequestContext } from "@playwright/test";
import { API_URL } from "../config/constants";

const USERS_ENDPOINT = '/users';

export function getUsers(request: APIRequestContext, token: string) {
    return request.get(`${API_URL}${USERS_ENDPOINT}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
} 