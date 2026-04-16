import { test, expect } from '../../fixtures/uiAuthFixture';
import { LlmPage } from '../../pages/LlmPage';
import { HomePage } from '../../pages/HomePage';

test.describe('Home page tests', () => {
    test('should open llm page via button', async ({ uiAuth }) => {
        // given
        const { page } = uiAuth;
        const homePage = new HomePage(page);
        const llmPage = new LlmPage(page);
        await homePage.goto();

        // when
        await homePage.clickHomeLlmButton();

        // then
        await llmPage.expectToBeOnPage(LlmPage.url);
        await expect(llmPage.llmTitle).toBeVisible();
    });

}); 
