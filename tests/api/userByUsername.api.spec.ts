import { test, expect } from '../../fixtures/auth.fixture';
import type { UserResponseDto } from '../../types/user';
import { validateUserResponseDto } from '../../validators/userValidator';
import { getUserByUsername } from '../../http/getUserByUsername';

test.describe('/users/{username} API tests', () => {
  test('should successfully retrieve user by username with valid authentication - 200', async ({ request, authToken, userDetails }) => {
    // when
    const response = await getUserByUsername(request, authToken, userDetails.username);

    // then
    expect(response.status()).toBe(200);
    
    const responseBody: UserResponseDto = await response.json();
    validateUserResponseDto(responseBody);
    expect(responseBody.username).toBe(userDetails.username);
  });

  test('should return unauthorized error without authentication token - 401', async ({ request, userDetails }) => {
    // when
    const response = await getUserByUsername(request, '', userDetails.username);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found error for non-existent username - 404', async ({ request, authToken }) => {
    // when
    const response = await getUserByUsername(request, authToken, 'nonexistentuser123');

    // then
    expect(response.status()).toBe(404);
  });
}); 