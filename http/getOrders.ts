import { APIRequestContext } from "@playwright/test";
import { API_URL } from "../config/constants";
import { OrderStatus } from "../types/order";

const ORDERS_ENDPOINT = '/api/orders';

export interface GetOrdersParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
}

export function getOrders(request: APIRequestContext, token: string, params?: GetOrdersParams) {
    const url = new URL(`${API_URL}${ORDERS_ENDPOINT}`);
    
    if (params?.page !== undefined) {
        url.searchParams.append('page', params.page.toString());
    }
    if (params?.size !== undefined) {
        url.searchParams.append('size', params.size.toString());
    }
    if (params?.status) {
        url.searchParams.append('status', params.status);
    }

    return request.get(url.toString(), {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
} 