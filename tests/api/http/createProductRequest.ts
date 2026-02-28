import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ProductCreateDto } from '../../../types/product';
import { authHeaders, jsonHeaders } from './headers';

const PRODUCTS_ENDPOINT = '/api/products';

export const createProductRequest = (
  request: APIRequestContext,
  jwtToken: string,
  data: ProductCreateDto,
): Promise<APIResponse> =>
  request.post(PRODUCTS_ENDPOINT, {
    data,
    headers: {
      ...jsonHeaders,
      ...authHeaders(jwtToken),
    },
  });
