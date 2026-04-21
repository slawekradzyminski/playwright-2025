import { QrClient } from '../../../httpclients/qrClient';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import type { CreateQrDto } from '../../../types/qr';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

test.describe('POST /api/v1/qr/create API tests', () => {
  let qrClient: QrClient;

  test.beforeEach(async ({ request }) => {
    qrClient = new QrClient(request);
  });

  test('should generate QR code as PNG image - 200', async ({ authenticatedUser }) => {
    // given
    const createQrData: CreateQrDto = {
      text: 'https://awesome-testing.com'
    };

    // when
    const response = await qrClient.createQr(createQrData, authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');

    const responseBody = await response.body();
    expect(responseBody.length).toBeGreaterThan(0);
    expect(responseBody.subarray(0, PNG_SIGNATURE.length)).toEqual(PNG_SIGNATURE);
  });

  test('should return validation error when text is empty - 400', async ({ authenticatedUser }) => {
    // given
    const createQrData: CreateQrDto = {
      text: ''
    };

    // when
    const response = await qrClient.createQr(createQrData, authenticatedUser.token);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.text).toBe('Text is required');
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given
    const createQrData: CreateQrDto = {
      text: 'https://awesome-testing.com'
    };

    // when
    const response = await qrClient.createQr(createQrData);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given
    const createQrData: CreateQrDto = {
      text: 'https://awesome-testing.com'
    };

    // when
    const response = await qrClient.createQr(createQrData, 'invalid-token');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});
