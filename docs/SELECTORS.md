# Playwright Selectors And Locators

## Main Idea

In modern Playwright, prefer locators over raw selectors.

Playwright docs describe locators as the central piece of auto-waiting and retryability. A locator is not just a string selector. It is a way to find an element at the moment Playwright needs to act or assert.

Good tests should locate elements the way a user understands the page:

```ts
await page.getByRole('button', { name: 'Sign in' }).click();
```

Weak tests often locate elements the way the frontend happens to be implemented today:

```ts
await page.locator('.btn-primary:nth-child(2)').click();
```

The first version is tied to behavior. The second version is tied to CSS structure.

## Recommended Locator Priority

Use this order in real tests:

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByAltText`
6. `getByTitle`
7. `getByTestId`
8. CSS locator
9. XPath locator

This is not a hard law. It is a maintainability rule.

The official docs recommend prioritizing user-facing attributes and explicit contracts. `getByRole` is usually the best first choice because it follows accessible UI semantics.

## `getByRole`

Use for buttons, links, headings, lists, checkboxes, radios, tabs, dialogs, and many other accessible elements.

Example from this repository:

```ts
await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
await page.getByRole('button', { name: 'Sign in' }).click();
```

Why it is good:

- matches how users and assistive technologies understand the UI
- checks accessible name indirectly
- avoids fragile CSS details
- gives readable test code

Good:

```ts
await page.getByRole('button', { name: 'Register' }).click();
```

Weak:

```ts
await page.locator('button:nth-of-type(2)').click();
```

## `getByLabel`

Use for form controls with labels:

```ts
await page.getByLabel('Username').fill('admin');
await page.getByLabel('Password').fill('secret');
```

This is often more expressive than `getByRole('textbox', { name: ... })` for forms.

If `getByLabel` does not work, it may reveal an accessibility problem in the application markup.

## `getByPlaceholder`

Use when the placeholder is the visible user cue:

```ts
await page.getByPlaceholder('Search products').fill('keyboard');
```

Do not overuse placeholders as labels. A placeholder disappears when the user types, so it is not always a good accessibility substitute for a label.

## `getByText`

Use for visible text that is stable and meaningful:

```ts
await expect(page.getByText('Invalid username/password supplied')).toBeVisible();
```

Good use cases:

- toast messages
- validation errors
- static labels
- confirmation messages

Risky use cases:

- marketing copy that changes often
- translated text
- repeated text that appears in many places
- partial text that matches too much

When text appears in a specific region, scope it:

```ts
const form = page.getByRole('form', { name: 'Login' });
await expect(form.getByText('Password is required')).toBeVisible();
```

## `getByAltText`

Use for meaningful images:

```ts
await expect(page.getByAltText('Company logo')).toBeVisible();
```

This is useful when the image has semantic meaning. Decorative images should often be ignored by tests.

## `getByTitle`

Use when the title attribute is the intended contract:

```ts
await page.getByTitle('Delete product').click();
```

Do not use `title` as a workaround for missing accessible names. Prefer role, label, or text if possible.

## `getByTestId`

Use test ids when user-facing locators are not stable or not specific enough:

```ts
await page.getByTestId('product-card').click();
```

Test ids are resilient because copy or role changes do not break them. But they are not user-facing, so they can miss accessibility regressions.

Good use cases:

- repeated cards
- complex widgets
- icon-only buttons with unstable labels
- elements with dynamic text
- places where product copy changes frequently

Bad use cases:

- replacing all user-facing locators by default
- hiding missing labels or poor accessibility
- creating test ids that mirror CSS names, for example `red-button-left`

Better test id names:

```text
login-submit
register-form
product-card
cart-item
checkout-total
```

Weak test id names:

```text
button1
blue-box
left-column-div
test123
```

## CSS Locators

CSS is available:

```ts
await page.locator('.login-form button[type="submit"]').click();
```

Use CSS when:

- there is no accessible/user-facing locator
- the element is technical and not user-facing
- you are scoping inside a stable component root
- you need a temporary locator during exploration

Avoid CSS when it depends on:

- generated classes
- layout position
- framework internals
- deeply nested DOM

Very fragile:

```ts
await page.locator('div > div > div:nth-child(3) button').click();
```

## XPath

XPath works, but should usually be the last option.

```ts
await page.locator('//button[text()="Sign in"]').click();
```

Reasons to avoid it:

- often less readable
- easy to couple to DOM structure
- harder for many frontend developers to maintain
- usually unnecessary in Playwright

Use XPath only when the application structure forces it and other locators are not practical.

## Chaining Locators

Chaining narrows the search.

Example:

```ts
const product = page
  .getByRole('listitem')
  .filter({ has: page.getByRole('heading', { name: 'Product 2' }) });

await product.getByRole('button', { name: 'Add to cart' }).click();
await expect(product).toHaveCount(1);
```

This is better than searching the whole page for "Add to cart" when multiple products have that button.

## Filtering Locators

Use `filter` when there are repeated structures:

```ts
await page
  .getByRole('listitem')
  .filter({ hasText: 'Product 2' })
  .getByRole('button', { name: 'Add to cart' })
  .click();
```

Use `has` when the child element is more specific:

```ts
await page
  .getByRole('listitem')
  .filter({ has: page.getByRole('heading', { name: 'Product 2' }) })
  .getByRole('button', { name: 'Add to cart' })
  .click();
```

Prefer `has` when text alone could match too much.

## Strictness

Playwright locators are strict for actions. If a click locator matches multiple elements, Playwright fails instead of guessing.

This is good.

A strictness failure tells you the test is ambiguous.

Bad fix:

```ts
await page.getByRole('button').first().click();
```

Better fix:

```ts
await page.getByRole('button', { name: 'Sign in' }).click();
```

Use `.first()` only when the first match is truly the user-facing contract, not as a way to silence a bad locator.

## Assertions With Locators

Use web-first assertions:

```ts
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
await expect(page.getByRole('listitem')).toHaveCount(3);
await expect(page.getByText('Order confirmed')).toBeVisible();
```

These assertions retry until the condition is met or timeout expires.

Avoid manual polling and fixed sleeps:

```ts
await page.waitForTimeout(3000);
expect(await page.locator('.toast').textContent()).toBe('Saved');
```

Better:

```ts
await expect(page.getByText('Saved')).toBeVisible();
```

## Selector Review Checklist

Before accepting a selector, ask:

- Would a user understand this element by this name?
- Is the locator stable if CSS classes change?
- Does it match exactly one element?
- Does it reveal accessibility issues instead of hiding them?
- Is the locator scoped to the right region?
- Will a copy change break this test for a good reason or a bad reason?
- Would another engineer understand the test without opening DevTools?

## Examples From This Repository

Good:

```ts
await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
await page.getByRole('button', { name: 'Sign in' }).click();
```

Why:

- readable
- user-facing
- stable enough
- helps verify accessible labels

Possible alternative:

```ts
await page.getByLabel('Username').fill(credentials.username);
await page.getByLabel('Password').fill(credentials.password);
await page.getByRole('button', { name: 'Sign in' }).click();
```

This may be even clearer if the form fields are correctly labeled.

## Practical Rule

Start with the locator a user would use to describe the element.

Move toward technical selectors only when user-facing locators are not enough.

## Sources

- Playwright locators documentation: https://playwright.dev/docs/locators

