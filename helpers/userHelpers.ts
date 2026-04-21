import { expect } from '@playwright/test';
import type { UserRegisterDto, UserResponseDto } from '../types/auth';

export const expectValidUserResponse = (responseBody: UserResponseDto, expectedUser: UserRegisterDto): void => {
  expect(responseBody.id).toEqual(expect.any(Number));
  expect(responseBody.username).toBe(expectedUser.username);
  expect(responseBody.email).toBe(expectedUser.email);
  expect(responseBody.firstName).toBe(expectedUser.firstName);
  expect(responseBody.lastName).toBe(expectedUser.lastName);
  expect(responseBody.roles).toEqual(['ROLE_CLIENT']);
};
