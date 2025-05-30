import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../constants/config";
import { CreateQrDto } from "../types/qr";

export const createQrCode = (request: APIRequestContext, token: string, qrData: CreateQrDto) => {
    return request.post(`${API_BASE_URL}/qr/create`, {
        data: qrData,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'image/png'
        }
    })
} 