import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";
import type { CreateQrDto } from "../types/qr";

const CREATE_QR_ENDPOINT = '/qr/create';

export const attemptCreateQrCode = async (
  request: APIRequestContext,
  body: CreateQrDto,
  token?: string
): Promise<APIResponse> => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return await request.post(`${API_BASE_URL}${CREATE_QR_ENDPOINT}`, {
    data: body,
    headers
  });
};
