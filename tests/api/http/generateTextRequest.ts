import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { StreamedRequestDto } from '../../../types/ollama';
import { authHeaders, jsonHeaders } from './headers';

const GENERATE_ENDPOINT = '/api/ollama/generate';

export const generateTextRequest = (
  request: APIRequestContext,
  jwtToken: string,
  data: StreamedRequestDto,
): Promise<APIResponse> =>
  request.post(GENERATE_ENDPOINT, {
    data,
    headers: {
      ...jsonHeaders,
      ...authHeaders(jwtToken),
    },
  });
