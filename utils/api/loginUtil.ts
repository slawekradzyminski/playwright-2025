import { expect } from '@playwright/test';
import type { LoginDto, LoginResponseDto } from '../../types/auth';
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const expectedSuccessKeys = [
  'token',
  'refreshToken',
  'username',
  'email',
  'firstName',
  'lastName',
  'roles',
] as const;

export const validateCorrectLoginResponse = (
  responseBody: LoginResponseDto,
  loginData: LoginDto,
): void => {
  expect(Object.keys(responseBody).sort()).toEqual([...expectedSuccessKeys].sort());
  expect(responseBody.token).toBeTruthy();
  expect(responseBody.token).toMatch(jwtRegex);
  expect(responseBody.refreshToken).toBeTruthy();
  expect(typeof responseBody.refreshToken).toBe('string');
  expect(responseBody.username).toBe(loginData.username);
  expect(responseBody.email).toMatch(emailRegex);
  expect(typeof responseBody.firstName).toBe('string');
  expect(responseBody.firstName.length).toBeGreaterThan(0);
  expect(typeof responseBody.lastName).toBe('string');
  expect(responseBody.lastName.length).toBeGreaterThan(0);
  expect(Array.isArray(responseBody.roles)).toBe(true);
  expect(responseBody.roles.length).toBeGreaterThan(0);
  for (const role of responseBody.roles) {
    expect(typeof role).toBe('string');
    expect(role).toMatch(/^ROLE_(ADMIN|CLIENT)$/);
  }
};
