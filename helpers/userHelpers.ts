import { expect } from '@playwright/test';
import type { UserRegisterDto, UserResponseDto } from '../types/auth';

type UserProfileExpectation = Pick<UserResponseDto, 'username' | 'email' | 'firstName' | 'lastName' | 'roles'>;

export const expectUserProfile = (responseBody: UserResponseDto, expectedProfile: UserProfileExpectation): void => {
  expect(responseBody.id).toEqual(expect.any(Number));
  expect(responseBody.username).toBe(expectedProfile.username);
  expect(responseBody.email).toBe(expectedProfile.email);
  expect(responseBody.firstName).toBe(expectedProfile.firstName);
  expect(responseBody.lastName).toBe(expectedProfile.lastName);
  expect(responseBody.roles).toEqual(expectedProfile.roles);
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
