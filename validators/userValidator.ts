import { expect } from '@playwright/test';
import type { UserResponseDto } from '../types/users';

export const validateUsersArray = (users: UserResponseDto[]) => {
  expect(Array.isArray(users)).toBe(true);
  expect(users.length).toBeGreaterThan(0);
  
  users.forEach((user, index) => {
    expect(user, `User at index ${index}`).toMatchObject({
      id: expect.any(Number),
      username: expect.any(String),
      email: expect.any(String),
      roles: expect.any(Array),
      firstName: expect.any(String),
      lastName: expect.any(String),
    });
    
    expect(user.id).toBeGreaterThan(0);
    expect(user.username.length).toBeGreaterThan(0);
    expect(user.email).toContain('@');
    expect(user.roles.length).toBeGreaterThan(0);
    expect(user.firstName.length).toBeGreaterThan(0);
    expect(user.lastName.length).toBeGreaterThan(0);
  });
};

export const validateSingleUser = (user: UserResponseDto) => {
  expect(user).toMatchObject({
    id: expect.any(Number),
    username: expect.any(String),
    email: expect.any(String),
    roles: expect.any(Array),
    firstName: expect.any(String),
    lastName: expect.any(String),
  });
  
  expect(user.id).toBeGreaterThan(0);
  expect(user.username.length).toBeGreaterThan(0);
  expect(user.email).toContain('@');
  expect(user.roles.length).toBeGreaterThan(0);
  expect(user.firstName.length).toBeGreaterThan(0);
  expect(user.lastName.length).toBeGreaterThan(0);
}; 