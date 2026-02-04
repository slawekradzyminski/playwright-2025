import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { getCart } from '../../../http/cartClient';
import type { CartDto } from '../../../types/cart';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/cart GET API tests', () => {
  test('should return current user cart - 200', async ({ request, authenticatedUser }) => {
    // given
    // when
    const response = await getCart(request, authenticatedUser.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    expect(responseBody.username).toBe(authenticatedUser.user.username);
    expect(Array.isArray(responseBody.items)).toBe(true);
  });

  test('should return unauthorized for cart request without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/api/cart`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});
