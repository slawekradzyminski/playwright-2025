import { test, expect } from '../../fixtures/apiAuthFixture';
import { qrClient } from '../../httpclients/qrClient';

test.describe('/api/v1/qr API tests', () => {
  test('should successfully generate new qr - 200', async ({ request, auth }) => {
    // given
    const qrRequestBody = {
        text: 'Test QR code text'
    }

    // when
    const response = await qrClient.createQrCode(request, qrRequestBody, auth.token);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');

    // Validate that the response body is a valid PNG image by checking the PNG signature
    const imageBuffer = await response.body();
      expect(imageBuffer.length).toBeGreaterThan(0);
      expect([...imageBuffer.subarray(0, 8)]).toEqual([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
      ]);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // when
    const response = await qrClient.createQrCode(request, { text: 'Test QR code text' });

    // then
    expect(response.status()).toBe(401);
  });

    test('should return unauthorized error if fake token provided - 401', async ({ request }) => {
    // when
    const response = await qrClient.createQrCode(request, { text: 'Test QR code text' }, 'fakeToken');

    // then
    expect(response.status()).toBe(401);
  });

}); 