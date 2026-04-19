import { expect, test } from '@playwright/test';
import {
  GOOGLE_MOCK_USERNAME,
  GOOGLE_MOCK_PASSWORD,
  GITHUB_MOCK_USERNAME,
  GITHUB_MOCK_PASSWORD,
} from '../../config/sso';
import { SOCIAL } from '../../config/tags';
import { socialKeycloakClient } from '../../httpclients/socialKeycloakClient';

test.describe('Social login mock realm API tests', {
  tag: [SOCIAL],
}, () => {
  test('should obtain an id token from the Google mock realm', async ({ request }) => {
    const idToken = await socialKeycloakClient.getIdToken(request, 'google', {
      username: GOOGLE_MOCK_USERNAME,
      password: GOOGLE_MOCK_PASSWORD,
    });

    expect(idToken).toBeTruthy();
    expect(idToken.split('.')).toHaveLength(3);
  });

  test('should obtain an id token from the GitHub mock realm', async ({ request }) => {
    const idToken = await socialKeycloakClient.getIdToken(request, 'github', {
      username: GITHUB_MOCK_USERNAME,
      password: GITHUB_MOCK_PASSWORD,
    });

    expect(idToken).toBeTruthy();
    expect(idToken.split('.')).toHaveLength(3);
  });
});
