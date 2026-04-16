import { APIRequestContext, APIResponse } from "@playwright/test";
import { APP_BASE_URL } from "../config/constants";
import { CreateProductRequest } from "../types/products";
import { loggedApiCall } from "../utils/apiLogger";

export const PRODUCTS_ENDPOINT = '/api/v1/products';

export const productsClient = {
    async createProduct(request: APIRequestContext, product: CreateProductRequest, token?: string): Promise<APIResponse> {
        const url = `${APP_BASE_URL}${PRODUCTS_ENDPOINT}`;
        return loggedApiCall(
            { method: 'POST', url, body: product },
            () => request.post(url, {
                data: product,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            }),
        );
    }
};