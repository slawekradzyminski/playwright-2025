import { Page, expect } from "@playwright/test";

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async expectToBeOnPage(url: string) {
        await expect(this.page).toHaveURL(url);
    }

    async expectToLeavePage(url: string) {
        await expect(this.page).not.toHaveURL(url);
    }

}