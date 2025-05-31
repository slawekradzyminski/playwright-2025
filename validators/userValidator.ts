import { expect } from '@playwright/test';
import type { UserResponseDto } from '../types/user';

export function validateUserResponseDto(user: any): asserts user is UserResponseDto {
  expect(typeof user.id).toBe('number');
  expect(typeof user.username).toBe('string');
  expect(typeof user.email).toBe('string');
  expect(Array.isArray(user.roles)).toBe(true);
  expect(typeof user.firstName).toBe('string');
  expect(typeof user.lastName).toBe('string');
  
  user.roles.forEach((role: any) => {
    expect(typeof role).toBe('string');
  });
} 