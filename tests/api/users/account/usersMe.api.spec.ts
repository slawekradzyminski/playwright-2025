import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../../config/constants';
import { getCurrentUser } from '../../../../http/userProfileClient';
import type { UserResponseDto } from '../../../../types/auth';
import { test } from '../../../fixtures/auth.fixture';

test.describe('/users/me API tests', () => {
  test('should return current user for authenticated request - 200', async ({
    request,
    clientAuth
  }) => {
    // given
    // when
    const response = await getCurrentUser(request, clientAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto = await response.json();
    expect(responseBody.username).toBe(clientAuth.user.username);
  });

  test('should return unauthorized for current user request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/users/me`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});
