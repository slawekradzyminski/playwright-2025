import { APP_BASE_URL } from '../../config/constants';
import { SSO_USERNAME } from '../../config/sso';
import { SSO, UI } from '../../config/tags';
import { expect, test } from '../../fixtures/uiSsoAuthFixture';

test.describe('SSO authenticated fixture tests', {
  tag: [UI, SSO],
}, () => {
  test('should start the UI already authenticated with SSO-backed app tokens', async ({ ssoAuth }) => {
    await ssoAuth.page.goto(`${APP_BASE_URL}/`);

    await expect(ssoAuth.page).toHaveURL(`${APP_BASE_URL}/`);
    await expect.poll(async () => ssoAuth.page.evaluate(() => localStorage.getItem('token'))).toBe(ssoAuth.token);
    await expect.poll(async () => ssoAuth.page.evaluate(() => localStorage.getItem('refreshToken'))).toBe(ssoAuth.refreshToken);
    expect(ssoAuth.username).toBe(SSO_USERNAME);
  });
});
