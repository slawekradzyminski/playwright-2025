# Admin Page Test Cases

## Dashboard Access & Overview
- Scenario: Admin user can open the dashboard from the header navigation
  - Given the admin user is authenticated and lands on `FRONTEND_URL/`
  - When they click the `desktop-menu-admin` navigation item
  - Then the app redirects to `/admin` with `admin-dashboard-title` visible
  - And the header still displays the admin full name within `username-profile-link`

- Scenario: Dashboard metric cards surface counts and deep links
  - Given the admin dashboard data has finished loading
  - When the metric tiles render inside `admin-dashboard-metrics`
  - Then each card exposes a positive count via `admin-dashboard-products-count`, `admin-dashboard-orders-count`, `admin-dashboard-pending-count`, and `admin-dashboard-revenue-amount`
  - And clicking `admin-dashboard-products-link`, `admin-dashboard-orders-link`, or `admin-dashboard-pending-link` navigates to their respective admin sub-pages

- Scenario: Recent orders widget lists the latest orders with status pills
  - Given the admin dashboard is displayed
  - When the recent orders section populates `admin-dashboard-orders-list`
  - Then the top five orders appear with their identifiers, dates, totals, and badges such as `admin-dashboard-order-status-6`
  - And the `admin-dashboard-view-all-orders` link routes to `/admin/orders`

## Product Management
- Scenario: Product list table shows catalog data with edit and delete controls
  - Given the admin visits `/admin/products`
  - When the page renders `admin-product-list-table`
  - Then each row (for example `admin-product-row-1`) exposes name, price, stock, category, an `admin-product-edit-{id}` link, and an `admin-product-delete-{id}` button
  - And the `admin-product-list-add-new` link opens `/admin/products/new`

- Scenario: Add product form enforces mandatory fields
  - Given the admin opens `/admin/products/new`
  - When they submit `product-submit-button` without filling required inputs
  - Then validation copy appears in `product-name-error`, `product-price-error`, `product-stock-error`, and `product-category-error`
  - And the form stays on the page awaiting corrected input

- Scenario: Admin can create a product and see it reflected in counts
  - Given the admin is on `/admin/products/new` with unique product data ready
  - When they populate `product-name-input`, `product-description-input`, `product-price-input`, `product-stock-input`, `product-category-input`, and optionally `product-image-input`, then submit `product-submit-button`
  - Then returning to `/admin/products` shows a new row in `admin-product-list-table` with the provided name
  - And the dashboard `admin-dashboard-products-count` increases by one compared to its pre-creation value

- Scenario: Deleting a product removes it from the catalog
  - Given the admin views `/admin/products`
  - When they trigger `admin-product-delete-{id}` and accept the confirmation dialog
  - Then the corresponding row disappears from `admin-product-list-table`
  - And the dashboard `admin-dashboard-products-count` decreases by one after the deletion

## Order Management
- Scenario: Orders list shows all orders with management actions
  - Given the admin navigates to `/admin/orders`
  - When the page renders `admin-order-list-table`
  - Then each row (e.g., `admin-order-row-3`) exposes the order id, customer, date, total, status badge (`admin-order-status-3`), and a `admin-order-details-3` link

- Scenario: Admin can filter orders by status
  - Given the admin is on `/admin/orders`
  - When they select `Pending` within `admin-order-list-status-filter`
  - Then only rows with a `PENDING` badge remain inside `admin-order-list-table`
  - And the pagination controls `admin-order-list-prev-page` and `admin-order-list-next-page` stay disabled when the filtered result fits on one page

- Scenario: Admin can open detailed view for an order
  - Given the admin is reviewing `/admin/orders`
  - When they click `admin-order-details-{id}`
  - Then the app navigates to `/orders/{id}` and renders `order-details-title`, `order-details-items-section`, and `order-details-shipping-section`
  - And the status pill `order-details-status` reflects the order’s current state

- Scenario: Admin updates an order status and sees confirmation feedback
  - Given the admin is on `/orders/{id}` for a pending order
  - When they choose a new value in `order-details-status-select` and activate `order-details-update-status-button`
  - Then the status badge `order-details-status` updates to the selected value
  - And a toast within `toast-viewport` appears with the “Status Updated” message confirming the change
