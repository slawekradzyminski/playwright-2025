import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { SSO_PASSWORD, SSO_USERNAME } from '../config/sso';
import { keycloakClient } from '../httpclients/keycloakClient';
import { ssoClient } from '../httpclients/ssoClient';
import type { LoginResponseWithRefreshToken } from '../types/auth';

type SsoAuthenticatedUser = {
  username: string;
  token: string;
  refreshToken: string;
};

export const createSsoAuthenticatedUser = async (
  request: APIRequestContext,
): Promise<SsoAuthenticatedUser> => {
  const idToken = await keycloakClient.getIdToken(request, {
    username: SSO_USERNAME,
    password: SSO_PASSWORD,
  });

  const exchangeResponse = await ssoClient.postSsoExchange(request, { idToken });
  expect(exchangeResponse.status(), await exchangeResponse.text()).toBe(200);
  const exchangeBody = await exchangeResponse.json() as LoginResponseWithRefreshToken;

  return {
    username: exchangeBody.username,
    token: exchangeBody.token,
    refreshToken: exchangeBody.refreshToken,
  };
};

export type { SsoAuthenticatedUser };
