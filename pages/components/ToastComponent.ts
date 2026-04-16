import { Locator, type Page, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ToastComponent extends BasePage {

    readonly page: Page;
    readonly toastMessage: Locator;
    readonly toastTitle: Locator

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.toastMessage = page.getByTestId('toast-description');
        this.toastTitle = page.getByTestId('toast-title');
    }

    async expectErrorToastMessageToHaveText(expectedText: string) {
        await expect(this.toastTitle).toHaveText('Error');
        await expect(this.toastMessage).toHaveText(expectedText);
    }

}
