# UI Test Implementation Plan

This plan covers every view exposed by `AppRoutes` and the main tabbed UIs (LLM), records what already has Playwright coverage, and defines the next actionable task for each missing test. Views are ordered from the simplest (top) to the most complex (bottom) so that the hardest flows are deferred until last. Status codes:

- `DONE` – automated coverage exists (see notes)
- `TODO` – coverage missing or partial; notes describe the next verifiable behaviour to implement
- `LATE` – intentionally deferred complex scenarios to finish after everything else (typically streaming/real-time)

Page objects should live under `pages/` and specs under `tests/ui/`, following the `featureName.ui.spec.ts` convention from `.cursor/rules/ui-test-rules.mdc`.

---

## Completed Views

| Order | View / Route | Status | Coverage / Next Step |
| --- | --- | --- | --- |
| 1 | `Login` – `GET /login` | DONE | Covered by existing Playwright login spec in `tests/ui/login.ui.spec.ts` using a `LoginPage` page object. Verifies happy-path login, invalid credentials toast, required fields, and redirect to `/`. |
| 2 | `Register` – `GET /register` | DONE | Covered by existing registration spec in `tests/ui/register.ui.spec.ts` using a `RegisterPage` page object. Verifies successful signup, validation errors (password mismatch, invalid email, required fields) and navigation back to login. |
| 3 | `Home` – `GET /` (authenticated) | DONE | Covered by `tests/ui/home.ui.spec.ts` using `uiAuthFixture.ts`. Verifies welcome banner, logged-in navigation (header links, cart/profile actions), CTA cards routing (Products, Users, Profile, Traffic, LLM, QR, Email), and enforces redirect-to-login when the auth token disappears. |
| 4 | `Products list` – `GET /products` | DONE | Covered by `tests/ui/products.ui.spec.ts` using `productsPage` page object. Verifies product grid/list rendering, empty state, basic pagination/sorting if present, and that clicking a product navigates to `/products/:id`. Cross-check with backend seed data where possible. |
| 5 | `Product details` – `GET /products/:id` | DONE | Covered by `tests/ui/product-details.ui.spec.ts` using `productDetailsPage` page object. Verifies product details rendering, quantity selection, and add to cart integration (cart badge increments, cart page reflects item). Includes 404 handling if user manually navigates to a non-existent `id`. |

> Update the notes above with exact filenames once you settle on final spec names.

---

## Remaining Views (TODO / LATE)

| Order | View / Route | Status | Coverage / Next Step |
| --- | --- | --- | --- |
| 6 | `Cart` – `GET /cart` | TODO | Add `CartPage` object and `cart.spec.ts`. Seed cart via UI (or directly via API + page refresh) and verify line items, per-item totals, grand total, and empty-state behaviour. Cover increment/decrement/removal actions and their impact on totals. |
| 7 | `Checkout` – `GET /checkout` | TODO | Add `CheckoutPage` object and `checkout.spec.ts`. Starting from a non-empty cart, walk through address form, validation errors, and successful order creation. Assert redirect to order details or profile order list and cart being cleared afterwards. |
| 8 | `Order details` – `GET /orders/:id` | TODO | Add `OrderDetailsPage` object and `order-details.spec.ts`. As a normal user: create an order, then visit `/orders/:id`; verify items, status badge, totals, shipping address. Assert cancel button exists only for `PENDING` orders and updates UI state after cancellation. |
| 9 | `Profile` – `GET /profile` | TODO | Create `ProfilePage` object and `profile.spec.ts`. Cover two concerns: (1) editing basic profile data (first/last name etc.) and (2) managing system prompt (max-length validation, error display, persistence). Also verify the embedded order history section (pagination, status badges, click-through to `/orders/:id`). |
| 10 | `Email` – `GET /email` | TODO | Add `EmailPage` object and `email.spec.ts`. Validate basic send-email happy path (using an existing user from backend), required field validation, and failure toast when backend returns an error. Include slow-delivery note from UI if visible. |
| 11 | `QR Code` – `GET /qr` | TODO | Add `QrCodePage` object and `qr.spec.ts`. Verify form inputs, generation trigger, and that a QR image is rendered with configurable content. Optionally, assert that regenerating with new text updates the rendered code (e.g. via `alt` text or pixel changes). |
| 12 | `Traffic Monitor` – `GET /traffic` | TODO | Add `TrafficMonitorPage` object and `traffic.spec.ts`. Focus first on deterministic UI behaviour: loading state, error state (e.g. if backend offline), “Authentication required” message when token missing, and empty-state message when there are no events. As a second phase, drive some HTTP traffic (e.g. hit `/api/products`) and assert at least one row appears with method/path/status, then verify the Clear button empties the table. |
| 13 | `Users (admin)` – `GET /users` | TODO | Add `UsersPage` object and `users-admin.spec.ts`. Using an admin authenticated fixture: verify table of users, pagination, and role display. Assert that client users cannot reach this view (expect forbidden or redirect). Cover navigation to `/users/:username/edit` via an Edit action. |
| 14 | `Edit user (admin)` – `GET /users/:username/edit` | TODO | In `edit-user-admin.spec.ts`: as admin, load an existing user, assert prefilled fields, submit changes, and verify success toast plus updated data when returning to `/users`. Include negative path: attempt to load a non-existent username and assert “User not found” surface or redirect behaviour. |
| 15 | `Admin dashboard` – `GET /admin` | TODO | Add `AdminDashboardPage` object and `admin-dashboard.spec.ts`. Verify that only admins can load this page, key summary metrics/cards render correctly (orders, products, users), and each “View more”/CTA links to the corresponding admin page. |
| 16 | `Admin products` – `GET /admin/products` | TODO | In `admin-products.spec.ts`: assert that admin-only listing works, with correct columns and filters. Cover navigation to create (`/admin/products/new`) and edit (`/admin/products/edit/:id`) flows, and that delete actions reflect immediately in the list. |
| 17 | `Admin create product` – `GET /admin/products/new` | TODO | Add coverage in `admin-product-form.spec.ts`. For create mode: validate required fields, happy-path creation, and redirect/back behaviour (e.g. back to admin product list). Ensure invalid data (negative price, empty name) is rejected with field-level errors. |
| 18 | `Admin edit product` – `GET /admin/products/edit/:id` | TODO | In the same `admin-product-form.spec.ts`: open page in edit mode, assert fields are pre-populated from backend, modify some values, and confirm that both UI and API reflect changes afterwards. Include 404 behaviour if product ID doesn’t exist. |
| 19 | `Admin orders` – `GET /admin/orders` | TODO | Add `AdminOrdersPage` object and `admin-orders.spec.ts`. Verify paginated order listing, status filters, and that clicking an order navigates to `/orders/:id`. Combine with `OrderDetails` tests to cover updating status via admin controls. |
| 20 | `Navigation & logout` (shared layout) | TODO | Create `navigation.spec.ts` using a small `Navigation` helper object. As a logged-in user, verify top nav shows the right menu items (including admin menu when role includes `ADMIN`), cart badge count, profile menu, and logout behaviour (token cleared, redirected to `/login`, protected routes blocked). |
| 21 | `LLM – Chat tab` – `/llm` (`value="chat"`) | LATE | Add `llm-chat.spec.ts` once SSE/streaming strategy is stable. Focus on deterministic pieces: system prompt fetched (or default), user prompt entry, “thinking” indicator if present, streaming messages appended in order, and error behaviour (401 forcing redirect to `/login`). You may want to stub or heavily control upstream responses to keep assertions stable. |
| 22 | `LLM – Generate tab` – `/llm` (`value="generate"`) | LATE | Add `llm-generate.spec.ts` after Chat is stabilised. Cover toggling between Chat/Generate tabs, generating content from a template input, streaming updates into the output area, and completion/“done” state. As with Chat, prefer a deterministic test setup (fixed prompt & mocked or canned backend responses). |

---

## Notes / Future Refinements

- Once each spec is stabilised, update the `DONE` section with the exact spec path (e.g. `e2e/tests/home.spec.ts`) and key scenarios.
- For complex, data-heavy flows (orders, admin management), prefer using backend APIs to seed initial state where that keeps the UI scenario simple and deterministic.
- As with `api-implementation-plan.md`, keep this file as the single source of truth for UI coverage – new routes or major UI flows should always be appended here with `TODO` status first.
