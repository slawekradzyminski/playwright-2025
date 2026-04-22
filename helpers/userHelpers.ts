import { expect } from '@playwright/test';
import type { UserRegisterDto, UserResponseDto } from '../types/auth';

type ExpectedUserProfile = Pick<UserResponseDto, 'username' | 'email' | 'firstName' | 'lastName' | 'roles'>;

export const expectUserProfile = (responseBody: UserResponseDto, expectedUser: ExpectedUserProfile): void => {
  expect(responseBody.id).toEqual(expect.any(Number));
  expect(responseBody.username).toBe(expectedUser.username);
  expect(responseBody.email).toBe(expectedUser.email);
  expect(responseBody.firstName).toBe(expectedUser.firstName);
  expect(responseBody.lastName).toBe(expectedUser.lastName);
  expect(responseBody.roles).toEqual(expectedUser.roles);
};

export const expectValidUserResponse = (responseBody: UserResponseDto, expectedUser: UserRegisterDto): void => {
  expectUserProfile(responseBody, {
    username: expectedUser.username,
    email: expectedUser.email,
    firstName: expectedUser.firstName,
    lastName: expectedUser.lastName,
    roles: ['ROLE_CLIENT']
  });
};
