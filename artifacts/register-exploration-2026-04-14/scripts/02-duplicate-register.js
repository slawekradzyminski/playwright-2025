async page => {
  const artifactRoot = '/Users/admin/IdeaProjects/playwright-2025/artifacts/register-exploration-2026-04-14';
  const user = {
    username: 'regaudit_20260414_success_a7k9',
    email: 'regaudit.success.a7k9@example.com',
    password: 'ClientPass123!',
    firstName: 'Audit',
    lastName: 'Success'
  };
  let actions;

  await page.screencast.start({
    path: `${artifactRoot}/videos/02-duplicate-register.webm`,
    size: { width: 1280, height: 720 }
  });

  try {
    actions = await page.screencast.showActions({
      position: 'top-right',
      duration: 1200,
      fontSize: 16
    });

    await page.screencast.showChapter('Case 02: duplicate register', {
      description: 'Submit an already registered username and email and verify the failure stays on register.',
      duration: 1800
    });

    await page.goto('http://localhost:8081/register');
    await page.screenshot({ path: `${artifactRoot}/screenshots/02-before.png`, fullPage: true });

    await page.screencast.showOverlay(`
      <div style="position:absolute;left:16px;bottom:16px;padding:10px 12px;background:rgba(120,0,0,.82);color:white;border-radius:6px;font:14px Arial;">
        Duplicate user attempt: ${user.username}
      </div>
    `, { duration: 1800 });

    await page.getByTestId('register-username-input').fill(user.username);
    await page.getByTestId('register-email-input').fill(user.email);
    await page.getByTestId('register-password-input').fill(user.password);
    await page.getByTestId('register-firstname-input').fill(user.firstName);
    await page.getByTestId('register-lastname-input').fill(user.lastName);
    await page.getByTestId('register-submit-button').click();

    await page.waitForURL('**/register', { timeout: 10000 });
    await page.getByTestId('toast-title').waitFor({ timeout: 5000 });
    const bodyText = await page.locator('body').innerText();
    const toastTitle = await page.getByTestId('toast-title').textContent();
    const toastDescription = await page.getByTestId('toast-description').textContent();

    const duplicateMessageVisible = bodyText.includes('Username already exists') || bodyText.includes('Email is already in use');
    if (!duplicateMessageVisible) {
      throw new Error(`Expected duplicate registration message. Body text: ${bodyText}`);
    }

    await page.screencast.showChapter('Case 02 result', {
      description: 'Duplicate registration was rejected and the user remained on the register page.',
      duration: 1800
    });
    await page.screenshot({ path: `${artifactRoot}/screenshots/02-after.png`, fullPage: true });

    return {
      caseId: '02-duplicate-register',
      status: 'passed',
      finalUrl: page.url(),
      toast: { title: toastTitle, description: toastDescription },
      duplicateMessageVisible
    };
  } finally {
    if (actions)
      await actions.dispose();
    await page.screencast.stop();
  }
}
