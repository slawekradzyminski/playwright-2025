import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { SSO_AUTHORITY, SSO_CLIENT_ID } from '../config/sso';

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

export const keycloakClient = {
  async postPasswordGrant(
    request: APIRequestContext,
    credentials: PasswordGrantCredentials,
  ): Promise<APIResponse> {
    const url = `${SSO_AUTHORITY}/protocol/openid-connect/token`;
    return request.post(url, {
      form: {
        grant_type: 'password',
        client_id: SSO_CLIENT_ID,
        username: credentials.username,
        password: credentials.password,
        scope: 'openid profile email',
      },
    });
  },

  async getIdToken(
    request: APIRequestContext,
    credentials: PasswordGrantCredentials,
  ): Promise<string> {
    const response = await this.postPasswordGrant(request, credentials);
    expect(response.status(), await response.text()).toBe(200);
    const body = await response.json() as KeycloakTokenResponse;
    expect(body.id_token).toBeTruthy();
    return body.id_token;
  },
};
