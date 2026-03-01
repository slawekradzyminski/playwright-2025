import type { Locator } from '@playwright/test';

export const getCartCount = async (cartItemCount: Locator): Promise<number> => {
  if ((await cartItemCount.count()) === 0) {
    return 0;
  }

  const value = Number.parseInt((await cartItemCount.first().innerText()).trim(), 10);
  return Number.isNaN(value) ? 0 : value;
};
