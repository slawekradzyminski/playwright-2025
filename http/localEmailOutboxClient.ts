import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

export const LOCAL_EMAIL_OUTBOX_ENDPOINT = '/local/email/outbox';

export const getLocalEmailOutbox = async (request: APIRequestContext) => {
  return await request.get(`${API_BASE_URL}${LOCAL_EMAIL_OUTBOX_ENDPOINT}`);
};

export const clearLocalEmailOutbox = async (request: APIRequestContext) => {
  return await request.delete(`${API_BASE_URL}${LOCAL_EMAIL_OUTBOX_ENDPOINT}`);
};
