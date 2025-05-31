import { test, expect } from '../../fixtures/auth.fixture';
import type { UserResponseDto } from '../../types/user';
import { validateUserResponseDto } from '../../validators/userValidator';
import { getUsers } from '../../http/getUsers';

test.describe('/users API tests', () => {
  test('should successfully retrieve all users with valid authentication - 200', async ({ request, authToken }) => {
    // when
    const response = await getUsers(request, authToken);

    // then
    expect(response.status()).toBe(200);
    
    const responseBody: UserResponseDto[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    responseBody.forEach(user => {
      validateUserResponseDto(user);
    });
  });

  test('should return unauthorized error without authentication token - 401', async ({ request }) => {
    // when
    const response = await getUsers(request, '');

    // then
    expect(response.status()).toBe(401);
  });
}); 