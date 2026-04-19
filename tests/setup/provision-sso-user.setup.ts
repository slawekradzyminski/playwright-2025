import { test as setup, expect } from '@playwright/test';
import { SSO_USERNAME, SSO_PASSWORD } from '../../config/sso';
import { keycloakClient } from '../../httpclients/keycloakClient';
import { ssoClient } from '../../httpclients/ssoClient';

setup('provision SSO user for parallel safety', async ({ request }) => {
  const idToken = await keycloakClient.getIdToken(request, {
    username: SSO_USERNAME,
    password: SSO_PASSWORD,
  });

  const response = await ssoClient.postSsoExchange(request, { idToken });
  expect(response.status()).toBe(200);
});
