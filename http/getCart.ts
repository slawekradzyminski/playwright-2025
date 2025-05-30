import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../constants/config";

export const getCart = (request: APIRequestContext, token: string) => {
    return request.get(`${API_BASE_URL}/api/cart`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
} 