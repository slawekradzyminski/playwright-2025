import type { TestDetails } from '@playwright/test';

export const API_TEST_DETAILS: TestDetails = {
  tag: '@api',
  annotation: {
    type: 'description',
    description: 'API tests validate HTTP contracts, auth rules, status codes, and response payloads.',
  },
};

export const UI_TEST_DETAILS: TestDetails = {
  tag: '@ui',
  annotation: {
    type: 'description',
    description: 'UI tests validate browser workflows, page navigation, form behavior, and visible user outcomes.',
  },
};
