import { APIRequestContext, APIResponse } from "@playwright/test";
import { APP_BASE_URL } from "../config/constants";
import { QrCreateRequestDto } from "../types/qr";
import { loggedApiCall } from "../utils/apiLogger";

export const QR_CREATE_ENDPOINT = '/api/v1/qr/create';

export const qrClient = {
    async createQrCode(request: APIRequestContext, body: QrCreateRequestDto, token?: string): Promise<APIResponse> {
        const url = `${APP_BASE_URL}${QR_CREATE_ENDPOINT}`;
        return loggedApiCall(
            { method: 'POST', url, body },
            () => request.post(url, {
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            }),
        );
    }
};