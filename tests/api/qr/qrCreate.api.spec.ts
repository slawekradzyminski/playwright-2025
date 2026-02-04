import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { createQrCode } from '../../../http/qrClient';
import { test } from '../../fixtures/auth.fixture';

test.describe('/qr/create POST API tests', () => {
  test('should generate qr code image - 200', async ({ request, clientAuth }) => {
    // given
    const qrText = 'https://example.com/product/1';

    // when
    const response = await createQrCode(request, clientAuth.jwtToken, qrText);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const responseBody = await response.body();
    expect(responseBody.length).toBeGreaterThan(100);
  });

  test('should return validation error for empty text - 400', async ({ request, clientAuth }) => {
    // given
    // when
    const response = await createQrCode(request, clientAuth.jwtToken, '');

    // then
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ text: 'Text is required' });
  });

  test('should return unauthorized for qr generation without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.post(`${API_BASE_URL}/qr/create`, {
      data: { text: 'https://example.com' }
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});
