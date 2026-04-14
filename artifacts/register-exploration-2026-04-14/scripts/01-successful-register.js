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
    path: `${artifactRoot}/videos/01-successful-register.webm`,
    size: { width: 1280, height: 720 }
  });

  try {
    actions = await page.screencast.showActions({
      position: 'top-right',
      duration: 1200,
      fontSize: 16
    });

    await page.screencast.showChapter('Case 01: successful register', {
      description: 'Fill the registration form with unique valid data and verify redirect to login.',
      duration: 1800
    });

    await page.goto('http://localhost:8081/register');
    await page.screenshot({ path: `${artifactRoot}/screenshots/01-before.png`, fullPage: true });

    await page.screencast.showOverlay(`
      <div style="position:absolute;left:16px;bottom:16px;padding:10px 12px;background:rgba(0,0,0,.78);color:white;border-radius:6px;font:14px Arial;">
        Valid unique user: ${user.username}
      </div>
    `, { duration: 1800 });

    await page.getByTestId('register-username-input').fill(user.username);
    await page.getByTestId('register-email-input').fill(user.email);
    await page.getByTestId('register-password-input').fill(user.password);
    await page.getByTestId('register-firstname-input').fill(user.firstName);
    await page.getByTestId('register-lastname-input').fill(user.lastName);

    await page.screenshot({ path: `${artifactRoot}/screenshots/01-filled.png`, fullPage: true });
    await page.getByTestId('register-submit-button').click();
    await page.waitForURL('**/login', { timeout: 10000 });
    await page.getByTestId('toast-title').waitFor({ timeout: 5000 });

    const toastTitle = await page.getByTestId('toast-title').textContent();
    const toastDescription = await page.getByTestId('toast-description').textContent();
    if (toastTitle !== 'Success') {
      throw new Error(`Expected success toast title, got ${toastTitle}`);
    }
    if (!toastDescription?.includes('Registration successful')) {
      throw new Error(`Expected registration success message, got ${toastDescription}`);
    }

    await page.screencast.showChapter('Case 01 result', {
      description: 'Registration succeeded, the app redirected to login, and the success toast is visible.',
      duration: 1800
    });
    await page.screenshot({ path: `${artifactRoot}/screenshots/01-after.png`, fullPage: true });

    return {
      caseId: '01-successful-register',
      status: 'passed',
      finalUrl: page.url(),
      user,
      toast: { title: toastTitle, description: toastDescription }
    };
  } finally {
    if (actions)
      await actions.dispose();
    await page.screencast.stop();
  }
}
