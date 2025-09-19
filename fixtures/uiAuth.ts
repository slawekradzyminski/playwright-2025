import { test as base, Page } from '@playwright/test';
import { randomClient, randomAdmin } from '../generators/userGenerator';
import { attemptSignup } from '../http/signupClient';
import { attemptLogin } from '../http/loginClient';
import { UserRegisterDto } from '../types/auth';
import { FRONTEND_URL } from '../config/constants';

export interface UiAuthFixtures {
  uiAuth: {
    page: Page;
    user: UserRegisterDto;
    token: string;
  };
  uiAuthAdmin: {
    page: Page;
    user: UserRegisterDto;
    token: string;
  };
}

export const test = base.extend<UiAuthFixtures>({
  uiAuth: async ({ page, request }, use) => {
    // given
    const user = randomClient();
    await attemptSignup(request, user);
    const loginResponse = await attemptLogin(request, user);
    const token = (await loginResponse.json()).token;

    // when
    await page.goto(FRONTEND_URL);
    await page.evaluate((tokenValue) => {
      localStorage.setItem('token', tokenValue);
    }, token);
    await page.goto(`${FRONTEND_URL}/`);

    // then
    await use({
      page,
      user,
      token
    });
  },

  uiAuthAdmin: async ({ page, request }, use) => {
    // given
    const user = randomAdmin();
    await attemptSignup(request, user);
    const loginResponse = await attemptLogin(request, user);
    const token = (await loginResponse.json()).token;

    // when
    await page.goto(FRONTEND_URL);
    await page.evaluate((tokenValue) => {
      localStorage.setItem('token', tokenValue);
    }, token);
    await page.goto(`${FRONTEND_URL}/`);

    // then
    await use({
      page,
      user,
      token
    });
  }
});

export { expect } from '@playwright/test';
