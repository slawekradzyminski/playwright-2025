async page => {
  const artifactRoot = '/Users/admin/IdeaProjects/playwright-2025/artifacts/register-exploration-2026-04-14';
  const invalidUser = {
    username: 'abc',
    email: 'not-an-email',
    password: 'short',
    firstName: 'Al',
    lastName: 'Li'
  };
  let actions;

  await page.screencast.start({
    path: `${artifactRoot}/videos/04-invalid-field-validation.webm`,
    size: { width: 1280, height: 720 }
  });

  try {
    actions = await page.screencast.showActions({
      position: 'top-right',
      duration: 1200,
      fontSize: 16
    });

    await page.screencast.showChapter('Case 04: invalid field validation', {
      description: 'Submit syntactically invalid values and verify client-side length and format messages.',
      duration: 1800
    });

    await page.goto('http://localhost:8081/register');
    await page.screencast.showOverlay(`
      <div style="position:absolute;left:16px;bottom:16px;padding:10px 12px;background:rgba(0,0,0,.78);color:white;border-radius:6px;font:14px Arial;">
        Invalid data: short username, bad email, short names, short password
      </div>
    `, { duration: 1800 });

    await page.screenshot({ path: `${artifactRoot}/screenshots/04-before.png`, fullPage: true });
    await page.getByTestId('register-username-input').fill(invalidUser.username);
    await page.getByTestId('register-email-input').fill(invalidUser.email);
    await page.getByTestId('register-password-input').fill(invalidUser.password);
    await page.getByTestId('register-firstname-input').fill(invalidUser.firstName);
    await page.getByTestId('register-lastname-input').fill(invalidUser.lastName);
    await page.getByTestId('register-submit-button').click();

    await page.waitForTimeout(500);
    const bodyText = await page.locator('body').innerText();
    const expectedMessages = [
      'Username must be at least 4 characters',
      'Invalid email format',
      'Password must be at least 8 characters',
      'First name must be at least 4 characters',
      'Last name must be at least 4 characters'
    ];
    const missing = expectedMessages.filter(message => !bodyText.includes(message));
    if (missing.length) {
      throw new Error(`Missing validation messages: ${missing.join(', ')}. Body text: ${bodyText}`);
    }
    if (!page.url().endsWith('/register')) {
      throw new Error(`Expected to remain on /register, got ${page.url()}`);
    }

    await page.screencast.showChapter('Case 04 result', {
      description: 'Format and minimum-length validation messages are visible and no navigation occurred.',
      duration: 1800
    });
    await page.screenshot({ path: `${artifactRoot}/screenshots/04-after.png`, fullPage: true });

    return {
      caseId: '04-invalid-field-validation',
      status: 'passed',
      finalUrl: page.url(),
      invalidUser,
      expectedMessages
    };
  } finally {
    if (actions)
      await actions.dispose();
    await page.screencast.stop();
  }
}
