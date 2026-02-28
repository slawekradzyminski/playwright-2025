import type { APIRequestContext, APIResponse } from '@playwright/test';
import { authHeaders } from './headers';

const PRODUCTS_ENDPOINT = '/api/products';

export const getAllProductsRequest = (
  request: APIRequestContext,
  jwtToken: string,
): Promise<APIResponse> =>
  request.get(PRODUCTS_ENDPOINT, {
    headers: authHeaders(jwtToken),
  });
