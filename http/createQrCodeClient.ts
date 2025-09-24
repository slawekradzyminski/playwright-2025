import { APIRequestContext } from "@playwright/test";
import { CreateQrDto } from "../types/auth";
import { API_BASE_URL } from "../config/constants";

const CREATE_QR_ENDPOINT = '/qr/create';

export const createQrCode = async (request: APIRequestContext, qrData: CreateQrDto, token: string) => {
  return await request.post(`${API_BASE_URL}${CREATE_QR_ENDPOINT}`, {
    data: qrData,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'image/png',
      'Authorization': `Bearer ${token}`
    }
  });
};
