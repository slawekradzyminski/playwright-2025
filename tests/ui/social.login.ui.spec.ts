import { expect, test } from '@playwright/test';
import { APP_BASE_URL } from '../../config/constants';
import { SSO_CALLBACK_PATH, MOCK_SSO_ID_TOKEN } from '../../config/sso';
import { SOCIAL, UI } from '../../config/tags';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Social login UI tests (mocked)', {
  tag: [UI, SOCIAL],
}, () => {
  test('should redirect to Keycloak with kc_idp_hint=google when clicking Google button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    let capturedUrl = '';
    await page.route('**/realms/awesome-testing/protocol/openid-connect/auth**', async route => {
      capturedUrl = route.request().url();
      await route.abort();
    });

    await loginPage.clickGoogleButton();
    await expect.poll(() => capturedUrl).toBeTruthy();

    const url = new URL(capturedUrl);
    expect(url.searchParams.get('kc_idp_hint')).toBe('google');
    expect(url.searchParams.get('client_id')).toBeTruthy();
    expect(url.searchParams.get('code_challenge')).toBeTruthy();
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('response_type')).toBe('code');
  });

  test('should redirect to Keycloak with kc_idp_hint=github when clicking GitHub button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    let capturedUrl = '';
    await page.route('**/realms/awesome-testing/protocol/openid-connect/auth**', async route => {
      capturedUrl = route.request().url();
      await route.abort();
    });

    await loginPage.clickGitHubButton();
    await expect.poll(() => capturedUrl).toBeTruthy();

    const url = new URL(capturedUrl);
    expect(url.searchParams.get('kc_idp_hint')).toBe('github');
    expect(url.searchParams.get('client_id')).toBeTruthy();
    expect(url.searchParams.get('code_challenge')).toBeTruthy();
  });

  test('should complete social login callback with mocked exchange', async ({ page }) => {
    const expectedResponse = {
      token: 'test-social-token',
      refreshToken: 'test-social-refresh-token',
      username: 'google-user',
      email: 'google-user@gmail.com',
      firstName: 'Google',
      lastName: 'User',
      roles: ['ROLE_CLIENT'],
    };

    await page.addInitScript(() => {
      sessionStorage.setItem('ssoState', 'social-state');
      sessionStorage.setItem('ssoCodeVerifier', 'social-code-verifier');
    });

    await page.route('**/protocol/openid-connect/token', async route => {
      const requestBody = route.request().postData() ?? '';
      expect(requestBody).toContain('grant_type=authorization_code');
      expect(requestBody).toContain('code=social-code-123');
      expect(requestBody).toContain('code_verifier=social-code-verifier');
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

    const exchangeResponse = page.waitForResponse(response =>
      response.url().includes('/api/v1/users/sso/exchange') && response.status() === 200,
    );
    await page.goto(`${APP_BASE_URL}${SSO_CALLBACK_PATH}?code=social-code-123&state=social-state`);
    await exchangeResponse;
    await expect(page).toHaveURL(`${APP_BASE_URL}/`);

    await expect(page.evaluate(() => localStorage.getItem('token'))).resolves.toBe(expectedResponse.token);
    await expect(page.evaluate(() => localStorage.getItem('refreshToken'))).resolves.toBe(expectedResponse.refreshToken);
  });
});
