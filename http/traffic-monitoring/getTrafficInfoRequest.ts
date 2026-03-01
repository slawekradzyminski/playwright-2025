import type { APIRequestContext, APIResponse } from '@playwright/test';
import { authHeaders } from '../shared/headers';

const TRAFFIC_INFO_ENDPOINT = '/api/traffic/info';

export const getTrafficInfoRequest = (
  request: APIRequestContext,
  jwtToken: string,
): Promise<APIResponse> =>
  request.get(TRAFFIC_INFO_ENDPOINT, {
    headers: authHeaders(jwtToken),
  });
