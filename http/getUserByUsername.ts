import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../constants/config";

export const getUserByUsername = (request: APIRequestContext, token: string, username: string) => {
    return request.get(`${API_BASE_URL}/users/${username}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
} 