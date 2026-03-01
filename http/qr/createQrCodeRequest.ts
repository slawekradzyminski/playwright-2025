import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { CreateQrDto } from '../../types/qr';
import { authHeaders, jsonHeaders } from '../shared/headers';

const CREATE_QR_ENDPOINT = '/qr/create';

export const createQrCodeRequest = (
  request: APIRequestContext,
  jwtToken: string,
  data: CreateQrDto,
): Promise<APIResponse> =>
  request.post(CREATE_QR_ENDPOINT, {
    data,
    headers: {
      ...jsonHeaders,
      ...authHeaders(jwtToken),
    },
  });
