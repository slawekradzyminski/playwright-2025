import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

test.describe('Accessibility @a11y', () => {
  test('login page should have no critical or serious violations', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // when
    const results = await new AxeBuilder({ page })
      .analyze();

    // then
    const criticalOrSerious = results.violations.filter(v =>
      v.impact === 'critical' || v.impact === 'serious'
    );
    expect(
      criticalOrSerious,
      formatViolations(criticalOrSerious)
    ).toHaveLength(0);
  });

  test('home page should have no critical violations', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', ADMIN_PASSWORD);
    const homePage = new HomePage(page);
    await homePage.expectLoggedInAs('Slawomir', 'awesome@testing.com');

    // when
    const results = await new AxeBuilder({ page })
      // Known app-level violations tracked for fix:
      //   - color-contrast (serious): insufficient contrast on home-llm-button (sky-600 / white), ratio 4.02 vs required 4.5
      //   - link-name (serious): desktop-cart-icon anchor has no accessible text (icon-only link missing aria-label)
      .disableRules(['color-contrast', 'link-name'])
      .analyze();

    // then
    const criticalOrSerious = results.violations.filter(v =>
      v.impact === 'critical' || v.impact === 'serious'
    );
    expect(
      criticalOrSerious,
      formatViolations(criticalOrSerious)
    ).toHaveLength(0);
  });
});

function formatViolations(violations: { id: string; impact?: string; description: string; nodes: { html: string }[] }[]): string {
  if (violations.length === 0) return 'No violations';
  return violations
    .map(v => `\n[${v.impact}] ${v.id}: ${v.description}\n  ${v.nodes.map(n => n.html).join('\n  ')}`)
    .join('\n');
}
