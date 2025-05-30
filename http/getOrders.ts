import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../constants/config";

export const getOrders = (request: APIRequestContext, token: string) => {
    return request.get(`${API_BASE_URL}/api/orders`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
} 