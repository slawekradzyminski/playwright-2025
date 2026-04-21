import { type APIResponse, expect } from '@playwright/test';
import { API_ERROR_MESSAGES } from '../httpclients/baseApiClient';

export async function expectJsonResponse<T>(response: APIResponse, expectedStatus: number): Promise<T> {
  expect(response.status()).toBe(expectedStatus);

  return response.json() as Promise<T>;
}

export async function expectErrorMessage(
  response: APIResponse,
  expectedStatus: number,
  message: string
): Promise<void> {
  const responseBody = await expectJsonResponse<{ message: string }>(response, expectedStatus);

  expect(responseBody.message).toBe(message);
}

export async function expectUnauthorized(response: APIResponse): Promise<void> {
  await expectErrorMessage(response, 401, API_ERROR_MESSAGES.unauthorized);
}

export async function expectInvalidToken(response: APIResponse): Promise<void> {
  await expectErrorMessage(response, 401, API_ERROR_MESSAGES.invalidOrExpiredToken);
}
