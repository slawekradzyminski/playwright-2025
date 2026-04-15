import { APIRequestContext, APIResponse } from "@playwright/test";
import { APP_BASE_URL } from "../config/constants";
import { QrCreateRequestDto } from "../types/qr";

export const QR_CREATE_ENDPOINT = '/api/v1/qr/create';

export const qrClient = {
    async createQrCode(request: APIRequestContext, body: QrCreateRequestDto, token?: string): Promise<APIResponse> {
        return await request.post(`${APP_BASE_URL}${QR_CREATE_ENDPOINT}`, {
            data: body,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });
    }
};