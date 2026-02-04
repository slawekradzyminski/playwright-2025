import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import { getBearerAuthHeaders } from './requestHeaders';

export const TRAFFIC_INFO_ENDPOINT = '/api/traffic/info';

export const getTrafficInfo = async (request: APIRequestContext, jwtToken: string) => {
  return await request.get(`${API_BASE_URL}${TRAFFIC_INFO_ENDPOINT}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};
