import type { APIRequestContext, APIResponse } from '@playwright/test';
import { authHeaders } from './headers';

const PRODUCTS_ENDPOINT = '/api/products';

export const deleteProductRequest = (
  request: APIRequestContext,
  jwtToken: string,
  id: number,
): Promise<APIResponse> =>
  request.delete(`${PRODUCTS_ENDPOINT}/${id}`, {
    headers: authHeaders(jwtToken),
  });
