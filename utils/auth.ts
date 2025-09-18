import { expect } from '@playwright/test';

import { APIResponse } from "@playwright/test";
import { LoginResponseDto } from "../types/auth";

// Reusable JWT validator (base64url.header.payload.signature)
export const JWT_B64URL_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export const validateLoginResponse = async (response: APIResponse) => {
  const responseBody: LoginResponseDto = await response.json();
  expect(responseBody.token).toBeDefined();
  expect(responseBody.token).toMatch(JWT_B64URL_REGEX);
  expect(responseBody.username).toBeDefined();
  expect(responseBody.email).toBeDefined();
  expect(responseBody.firstName).toBeDefined();
  expect(responseBody.lastName).toBeDefined();
  expect(responseBody.roles).toBeDefined();
  expect(Array.isArray(responseBody.roles)).toBe(true);
};