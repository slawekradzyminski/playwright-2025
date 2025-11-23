import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../../config/constants";

const USERS_ENDPOINT = '/users';

export const getUsers = async (request: APIRequestContext, token: string) => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getUsersWithoutAuth = async (request: APIRequestContext) => {
  return await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

