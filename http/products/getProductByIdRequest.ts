import type { APIRequestContext, APIResponse } from '@playwright/test';
import { authHeaders } from '../shared/headers';

const PRODUCTS_ENDPOINT = '/api/products';

export const getProductByIdRequest = (
  request: APIRequestContext,
  jwtToken: string,
  id: number,
): Promise<APIResponse> =>
  request.get(`${PRODUCTS_ENDPOINT}/${id}`, {
    headers: authHeaders(jwtToken),
  });
