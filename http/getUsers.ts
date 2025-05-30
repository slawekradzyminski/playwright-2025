import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../constants/config";

export const getUsers = (request: APIRequestContext, token: string) => {
    return request.get(`${API_BASE_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
} 