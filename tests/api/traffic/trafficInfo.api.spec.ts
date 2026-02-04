import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { getTrafficInfo } from '../../../http/trafficClient';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/traffic/info GET API tests', () => {
  test('should return traffic info for authenticated request - 200', async ({
    request,
    authenticatedUser
  }) => {
    // given
    // when
    const response = await getTrafficInfo(request, authenticatedUser.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      webSocketEndpoint: '/ws-traffic',
      topic: '/topic/traffic',
      description:
        'Connect to the WebSocket endpoint and subscribe to the topic to receive real-time HTTP traffic events'
    });
  });

  test('should return unauthorized for traffic info request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/api/traffic/info`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});
