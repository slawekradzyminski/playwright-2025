import { injectBrowserAuth } from '../helpers/browserAuthHelpers';
import { test as adminApiTest } from './adminApiFixture';

export const test = adminApiTest.extend({
  page: async ({ page, adminApiUser }, use) => {
    await injectBrowserAuth(page, adminApiUser);

    await use(page);
  }
});

export { expect } from '@playwright/test';
