import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ProductUpdateDto } from '../../../types/product';
import { authHeaders, jsonHeaders } from './headers';

const PRODUCTS_ENDPOINT = '/api/products';

export const updateProductRequest = (
  request: APIRequestContext,
  jwtToken: string,
  id: number,
  data: ProductUpdateDto,
): Promise<APIResponse> =>
  request.put(`${PRODUCTS_ENDPOINT}/${id}`, {
    data,
    headers: {
      ...jsonHeaders,
      ...authHeaders(jwtToken),
    },
  });
