import { test, expect } from '../../fixtures/auth.fixture';
import type { ErrorResponse } from '../../../types/common';
import type { CreateQrDto } from '../../../types/qr';
import { createQrCodeRequest } from '../../../http/qr/createQrCodeRequest';

test.describe('/qr/create API tests', () => {
  test('should generate QR code for authenticated user - 200', async ({
    request,
    clientAuth,
  }) => {
    // given
    const payload: CreateQrDto = { text: 'https://example.com/qr-test' };

    // when
    const response = await createQrCodeRequest(request, clientAuth.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const responseBuffer = await response.body();
    expect(responseBuffer.length).toBeGreaterThan(0);
  });

  test('should return validation error for empty text - 400', async ({
    request,
    clientAuth,
  }) => {
    // when
    const response = await createQrCodeRequest(request, clientAuth.jwtToken, { text: '' });

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.post('/qr/create', {
      data: { text: 'https://example.com' },
    });

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });
});
