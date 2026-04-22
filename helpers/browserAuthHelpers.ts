import { randomUUID } from 'node:crypto';
import type { Page } from '@playwright/test';

interface BrowserAuthState {
  token: string;
  refreshToken: string;
}

export const injectBrowserAuth = async (page: Page, authState: BrowserAuthState): Promise<void> => {
  await page.addInitScript(
    (state) => {
      window.localStorage.setItem('token', state.token);
      window.localStorage.setItem('refreshToken', state.refreshToken);
      window.localStorage.setItem('clientSessionId', state.clientSessionId);
    },
    {
      token: authState.token,
      refreshToken: authState.refreshToken,
      clientSessionId: randomUUID()
    }
  );
};
