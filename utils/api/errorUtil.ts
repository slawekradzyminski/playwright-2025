import { expect } from '@playwright/test';

type GenericErrorResponse = Record<string, unknown>;

export const expectAnyNonEmptyErrorMessage = (responseBody: GenericErrorResponse): void => {
  const hasAnyErrorMessage = Object.values(responseBody).some(
    (value) => typeof value === 'string' && value.length > 0,
  );

  expect(hasAnyErrorMessage).toBe(true);
};
