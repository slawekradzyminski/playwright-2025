import { test, expect } from '../../fixtures/auth.fixtures';
import type { CreateQrDto } from '../../types/qr';
import { createQrCode } from '../../http/postQrCreate';
import { API_BASE_URL } from '../../constants/config';

test.describe('/qr/create API tests', () => {
  test('should successfully generate QR code - 200', async ({ request, authToken }) => {
    // given
    const qrData: CreateQrDto = {
      text: 'https://playwright.dev'
    };

    // when
    const response = await createQrCode(request, authToken, qrData);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    
    const imageBuffer = await response.body();
    expect(imageBuffer.length).toBeGreaterThan(0);
    
    // Verify it's a valid PNG by checking PNG signature
    const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    expect(imageBuffer.subarray(0, 8)).toEqual(pngSignature);
  });

  test('should return 400 for invalid input (empty text) - 400', async ({ request, authToken }) => {
    // given
    const qrData: CreateQrDto = {
      text: ''
    };

    // when
    const response = await createQrCode(request, authToken, qrData);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return 400 for missing text field - 400', async ({ request, authToken }) => {
    // given
    const invalidData = {};

    // when
    const response = await request.post(`${API_BASE_URL}/qr/create`, {
      data: invalidData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'image/png'
      }
    });

    // then
    expect(response.status()).toBe(400);
  });

  test('should return 401 for invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.jwt.token';
    const qrData: CreateQrDto = {
      text: 'https://example.com'
    };

    // when
    const response = await createQrCode(request, invalidToken, qrData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return 401 for missing token - 401', async ({ request }) => {
    // given
    const qrData: CreateQrDto = {
      text: 'https://example.com'
    };

    // when
    const response = await request.post(`${API_BASE_URL}/qr/create`, {
      data: qrData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'image/png'
      }
    });

    // then
    expect(response.status()).toBe(401);
  });
}); 