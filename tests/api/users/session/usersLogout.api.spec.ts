import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../../config/constants';
import { logoutUser } from '../../../../http/userProfileClient';
import { test } from '../../../fixtures/auth.fixture';

test.describe('/users/logout API tests', () => {
  test('should logout authenticated user - 200', async ({ request, clientAuth }) => {
    // given
    // when
    const response = await logoutUser(request, clientAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    expect(await response.text()).toBe('');
  });

  test('should return unauthorized for logout without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.post(`${API_BASE_URL}/users/logout`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});
