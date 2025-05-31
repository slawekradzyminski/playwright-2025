import { test, expect } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import { RegisterDto } from '../../types/auth';
import { Role } from '../../types/auth';

const USERS_SIGNUP = '/users/signup';

test.describe('/users/signup API tests', () => {
  test('should successfully register a new user - 201', async ({ request }) => {
    // given
    const registerData: RegisterDto = {
      username: 'johndoedasasdsad',
      email: 'john.doedasdasdsad@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Boyd',
      roles: [Role.ROLE_CLIENT]
    };

    // when
    const response = await request.post(`${API_BASE_URL}${USERS_SIGNUP}`, {
      data: registerData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(201);
    const responseBody = await response.text();
    expect(responseBody).toEqual('');
  });
});