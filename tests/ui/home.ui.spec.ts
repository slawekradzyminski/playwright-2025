import { test, expect } from '../../fixtures/uiAuthFixture';
import { toolSystemPromptClient } from '../../httpclients/toolSystemPromptClient';
import { LlmPage } from '../../pages/LlmPage';
import { HomePage } from '../../pages/HomePage';

test.describe('Home page tests', () => {
    test('should open llm page via button', async ({ page, uiAuth }) => {
        // given
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
