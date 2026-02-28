import { test, expect } from '../fixtures/auth.fixture';
import type { ErrorResponse } from '../../types/common';
import type { TrafficInfoDto } from '../../types/traffic';
import { getTrafficInfoRequest } from './http/getTrafficInfoRequest';

test.describe('/api/traffic/info API tests', () => {
  test('should return traffic websocket information for authenticated user - 200', async ({
    request,
    clientAuth,
  }) => {
    // when
    const response = await getTrafficInfoRequest(request, clientAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as TrafficInfoDto;
    expect(typeof responseBody.webSocketEndpoint).toBe('string');
    expect(responseBody.webSocketEndpoint.length).toBeGreaterThan(0);
    expect(typeof responseBody.topic).toBe('string');
    expect(responseBody.topic.length).toBeGreaterThan(0);
    expect(typeof responseBody.description).toBe('string');
    expect(responseBody.description.length).toBeGreaterThan(0);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.get('/api/traffic/info');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });
});
