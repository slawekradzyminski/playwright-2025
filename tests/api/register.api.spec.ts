import { test, expect } from '@playwright/test';
import { RegisterDto, Role } from '../../types/auth';
import { API_BASE_URL } from '../../constants/config';
import { getRandomUser } from '../../generators/userGenerator';

const SIGNUP_ENDPOINT = '/users/signup';

test.describe('/users/signup API tests', () => {
  test('should successfully register a new user - 201', async ({ request }) => {
    // given
    const registerData: RegisterDto = getRandomUser();

    // when
    const response = await request.post(`${API_BASE_URL}${SIGNUP_ENDPOINT}`, {
      data: registerData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(201);
    const responseText = await response.text();
    expect(responseText).toBe('');
  });

  // TODO: add test for http 400 invalid username
  
});


