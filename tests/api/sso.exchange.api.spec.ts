import { expect, test } from '@playwright/test';
import { SSO_PASSWORD, SSO_USERNAME } from '../../config/sso';
import { keycloakClient } from '../../httpclients/keycloakClient';
import { ssoClient } from '../../httpclients/ssoClient';
import type { LoginResponseWithRefreshToken } from '../../types/auth';

test.describe('/api/v1/users/sso/exchange API tests', () => {
  test('should exchange an id token for a login response - 200', async ({ request }) => {
    // given
    const idToken = await keycloakClient.getIdToken(request, {
      username: SSO_USERNAME,
      password: SSO_PASSWORD,
    });

    // when
    const response = await ssoClient.postSsoExchange(request, { idToken });

    // then
    expect(response.status()).toBe(200);
    const responseBody: LoginResponseWithRefreshToken = await response.json();
    expect(responseBody.token).toEqual(expect.any(String));
    expect(responseBody.refreshToken).toEqual(expect.any(String));
    expect(responseBody.token.length).toBeGreaterThan(0);
    expect(responseBody.refreshToken.length).toBeGreaterThan(0);
    expect(responseBody.username).toEqual(expect.any(String));
    expect(responseBody.email).toEqual(expect.any(String));
    expect(responseBody.firstName).toEqual(expect.any(String));
    expect(responseBody.lastName).toEqual(expect.any(String));
    expect(Array.isArray(responseBody.roles)).toBe(true);
  });
});
