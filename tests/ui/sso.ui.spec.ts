import { expect, test } from '@playwright/test';
import { APP_BASE_URL } from '../../config/constants';
import { MOCK_SSO_ID_TOKEN, SSO_CALLBACK_PATH } from '../../config/sso';
import { SSO, UI } from '../../config/tags';

test.describe('SSO UI tests', {
  tag: [UI, SSO],
}, () => {
  test('should exchange the SSO id token on the callback route', async ({ page }) => {
    // given
    const expectedResponse = {
      token: 'test-sso-token',
      refreshToken: 'test-sso-refresh-token',
      username: 'sso-user',
      email: 'sso-user@example.com',
      firstName: 'SSO',
      lastName: 'User',
      roles: ['ROLE_CLIENT'],
    };

    await page.addInitScript(() => {
      sessionStorage.setItem('ssoState', 'sso-state');
      sessionStorage.setItem('ssoCodeVerifier', 'sso-code-verifier');
    });

    await page.route('**/protocol/openid-connect/token', async route => {
      const requestBody = route.request().postData() ?? '';
      expect(requestBody).toContain('grant_type=authorization_code');
      expect(requestBody).toContain('code=code-123');
      expect(requestBody).toContain('code_verifier=sso-code-verifier');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id_token: MOCK_SSO_ID_TOKEN }),
      });
    });

    await page.route('**/api/v1/**', async route => {
      const request = route.request();
      const url = request.url();
      if (url.includes('/api/v1/users/sso/exchange')) {
        const requestBody = request.postDataJSON();
        expect(requestBody).toEqual({ idToken: MOCK_SSO_ID_TOKEN });
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(expectedResponse),
        });
        return;
      }

      if (url.includes('/api/v1/users/me')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            username: expectedResponse.username,
            email: expectedResponse.email,
            firstName: expectedResponse.firstName,
            lastName: expectedResponse.lastName,
            roles: expectedResponse.roles,
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // when
    const exchangeResponse = page.waitForResponse(response =>
      response.url().includes('/api/v1/users/sso/exchange') && response.status() === 200,
    );
    await page.goto(`${APP_BASE_URL}${SSO_CALLBACK_PATH}?code=code-123&state=sso-state`);
    await exchangeResponse;
    await expect(page).toHaveURL(`${APP_BASE_URL}/`);

    // then
    await expect(page.evaluate(() => localStorage.getItem('token'))).resolves.toBe(expectedResponse.token);
    await expect(page.evaluate(() => localStorage.getItem('refreshToken'))).resolves.toBe(expectedResponse.refreshToken);
  });
});
