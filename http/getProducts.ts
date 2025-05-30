import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../constants/config";

export const getProducts = (request: APIRequestContext, token: string) => {
    return request.get(`${API_BASE_URL}/api/products`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
} 