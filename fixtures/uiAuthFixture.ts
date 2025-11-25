import { test as base } from '@playwright/test';
import type { APIRequestContext, Page } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import type { AuthFixture } from '../types/fixtures';
import { generateClientUser, generateAdminUser } from '../generators/userGenerator';
import { HomePage } from '../pages/HomePage';
import { createAuthFixture } from './createAuthFixture';

interface UiAuthFixtures {
  clientUiAuth: AuthFixture;
  adminUiAuth: AuthFixture;
}

type FixtureBuilder = (
  args: { page: Page; request: APIRequestContext },
  use: (fixture: AuthFixture) => Promise<void>
) => Promise<void>;

const buildUiAuthFixture = (userGenerator: () => UserRegisterDto): FixtureBuilder => {
  return async ({ page, request }, use) => {
    const authFixture = await createAuthFixture(request, userGenerator);

    await page.addInitScript(
      ({ tokenKey, tokenValue }) => {
        globalThis.localStorage.setItem(tokenKey, tokenValue);
      },
      { tokenKey: 'token', tokenValue: authFixture.token }
    );

    await page.goto(HomePage.URL);
    await use(authFixture);
  };
};

export const test = base.extend<UiAuthFixtures>({
  clientUiAuth: buildUiAuthFixture(generateClientUser),
  adminUiAuth: buildUiAuthFixture(generateAdminUser)
});

export { expect } from '@playwright/test';
