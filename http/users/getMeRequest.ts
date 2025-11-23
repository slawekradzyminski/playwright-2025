import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../../config/constants";

const ME_ENDPOINT = '/users/me';

export const getMe = async (request: APIRequestContext, token: string) => {
  return await request.get(`${API_BASE_URL}${ME_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getMeWithoutAuth = async (request: APIRequestContext) => {
  return await request.get(`${API_BASE_URL}${ME_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

