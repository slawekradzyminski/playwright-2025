import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import {
  MOCK_BROKER_CLIENT_ID,
  MOCK_BROKER_CLIENT_SECRET,
  GOOGLE_MOCK_AUTHORITY,
  GITHUB_MOCK_AUTHORITY,
} from '../config/sso';

export type SocialProvider = 'google' | 'github';

type PasswordGrantCredentials = {
  username: string;
  password: string;
};

type KeycloakTokenResponse = {
  id_token: string;
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
};

const authorityForProvider = (provider: SocialProvider): string =>
  provider === 'google' ? GOOGLE_MOCK_AUTHORITY : GITHUB_MOCK_AUTHORITY;

export const socialKeycloakClient = {
  async postPasswordGrant(
    request: APIRequestContext,
    provider: SocialProvider,
    credentials: PasswordGrantCredentials,
  ): Promise<APIResponse> {
    const url = `${authorityForProvider(provider)}/protocol/openid-connect/token`;
    return request.post(url, {
      form: {
        grant_type: 'password',
        client_id: MOCK_BROKER_CLIENT_ID,
        client_secret: MOCK_BROKER_CLIENT_SECRET,
        username: credentials.username,
        password: credentials.password,
        scope: 'openid profile email',
      },
    });
  },

  async getIdToken(
    request: APIRequestContext,
    provider: SocialProvider,
    credentials: PasswordGrantCredentials,
  ): Promise<string> {
    const response = await this.postPasswordGrant(request, provider, credentials);
    expect(response.status(), await response.text()).toBe(200);
    const body = (await response.json()) as KeycloakTokenResponse;
    expect(body.id_token).toBeTruthy();
    return body.id_token;
  },
};
