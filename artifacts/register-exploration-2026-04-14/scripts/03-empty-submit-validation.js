async page => {
  const artifactRoot = '/Users/admin/IdeaProjects/playwright-2025/artifacts/register-exploration-2026-04-14';
  let actions;

  await page.screencast.start({
    path: `${artifactRoot}/videos/03-empty-submit-validation.webm`,
    size: { width: 1280, height: 720 }
  });

  try {
    actions = await page.screencast.showActions({
      position: 'top-right',
      duration: 1200,
      fontSize: 16
    });

    await page.screencast.showChapter('Case 03: empty submit validation', {
      description: 'Submit the empty registration form and verify client-side required-field validation.',
      duration: 1800
    });

    await page.goto('http://localhost:8081/register');
    await page.screenshot({ path: `${artifactRoot}/screenshots/03-before.png`, fullPage: true });
    await page.getByTestId('register-submit-button').click();

    await page.waitForTimeout(500);
    const bodyText = await page.locator('body').innerText();
    const expectedMessages = [
      'Username is required',
      'Email is required',
      'Password is required',
      'First name is required',
      'Last name is required'
    ];
    const missing = expectedMessages.filter(message => !bodyText.includes(message));
    if (missing.length) {
      throw new Error(`Missing validation messages: ${missing.join(', ')}. Body text: ${bodyText}`);
    }
    if (!page.url().endsWith('/register')) {
      throw new Error(`Expected to remain on /register, got ${page.url()}`);
    }

    await page.screencast.showChapter('Case 03 result', {
      description: 'Required-field validation messages are visible and no navigation occurred.',
      duration: 1800
    });
    await page.screenshot({ path: `${artifactRoot}/screenshots/03-after.png`, fullPage: true });

    return {
      caseId: '03-empty-submit-validation',
      status: 'passed',
      finalUrl: page.url(),
      expectedMessages
    };
  } finally {
    if (actions)
      await actions.dispose();
    await page.screencast.stop();
  }
}
