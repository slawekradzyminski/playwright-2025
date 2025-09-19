# Products Page - Happy Path Test Cases

## Overview
This document outlines comprehensive happy path test cases for the Products page (`/products`) based on exploration using Playwright MCP. The Products page allows users to browse, search, filter, sort products and manage their shopping cart.

## Page Structure & Components

### Main Components
- **Navigation Header**: Standard logged-in navigation with cart icon
- **Categories Sidebar**: Filter products by category
- **Product List Controls**: Search bar and sort dropdown
- **Product Grid**: Grid layout displaying product cards
- **Product Cards**: Individual product information with cart controls

### Key Data-TestId Selectors
- `products-title`: Main page heading
- `product-search`: Search input field
- `clear-search`: Clear search button
- `product-sort`: Sort dropdown
- `products-category-{category}`: Category filter buttons
- `product-item`: Individual product cards
- `product-name`: Product name heading
- `product-price`: Product price
- `product-category`: Product category
- `product-description`: Product description
- `product-add-button`: Add to cart / Update cart button
- `product-remove-button`: Remove from cart button
- `product-quantity-controls`: Quantity adjustment controls
- `product-increase-quantity`: Increase quantity button
- `product-decrease-quantity`: Decrease quantity button
- `product-quantity-value`: Current quantity display
- `product-card-cart-quantity`: "X in cart" text
- `cart-item-count`: Cart badge count
- `toast-title`: Toast notification title
- `toast-description`: Toast notification message

## Test Cases

### 1. Page Load & Display

#### TC001: Products page loads successfully
**Given** user is logged in
**When** user navigates to `/products`
**Then** 
- Products page title is displayed
- Product grid loads with multiple products
- Categories sidebar is visible with all categories
- Search bar and sort controls are visible
- Each product card shows: image, name, price, category, description, quantity controls, and action buttons

**Data-TestIds Used**: `products-title`, `product-item`, `product-name`, `product-price`, `product-category`, `product-description`

#### TC002: Product cards display correct information
**Given** products page is loaded
**When** viewing product cards
**Then** each product card displays:
- Product image
- Product name
- Price in correct format ($X.XX)
- Category
- Description
- Quantity controls (-, quantity, +)
- Add to Cart button (for products not in cart)
- Remove/Update Cart buttons (for products in cart)

**Data-TestIds Used**: `product-item`, `product-name`, `product-price`, `product-category`, `product-description`, `product-quantity-controls`

### 2. Product Search

#### TC003: Search products by name
**Given** products page is loaded
**When** user types "iPhone" in the search field
**Then** 
- Only products containing "iPhone" in the name are displayed
- Clear search button (✕) appears
- Product count updates to show filtered results

**Data-TestIds Used**: `product-search`, `clear-search`, `product-item`

#### TC004: Clear search results
**Given** search results are displayed
**When** user clicks the clear search button (✕)
**Then** 
- Search field is cleared
- All products are displayed again
- Clear search button disappears

**Data-TestIds Used**: `clear-search`, `product-search`, `product-item`

#### TC005: Search with no results
**Given** products page is loaded
**When** user searches for a non-existent product "xyz123"
**Then** 
- No products are displayed
- Appropriate "no results" message is shown

**Data-TestIds Used**: `product-search`, `product-item`

### 3. Category Filtering

#### TC006: Filter products by category
**Given** products page is loaded
**When** user clicks on "Electronics" category
**Then** 
- Only Electronics products are displayed
- Page heading changes to "Electronics Products"
- Electronics category button is highlighted/active
- Product count reflects filtered results

**Data-TestIds Used**: `products-category-electronics`, `product-list-title`, `product-item`

#### TC007: Switch between categories
**Given** user has filtered by "Electronics"
**When** user clicks on "Books" category
**Then** 
- Only Books products are displayed
- Page heading changes to "Books Products"
- Books category button becomes active
- Electronics category button becomes inactive

**Data-TestIds Used**: `products-category-books`, `products-category-electronics`, `product-list-title`

#### TC008: Return to all products
**Given** user has filtered by a specific category
**When** user clicks "All Products" category
**Then** 
- All products are displayed regardless of category
- Page heading changes to "All Products"
- All Products category button is active

**Data-TestIds Used**: `products-category-all`, `product-list-title`, `product-item`

### 4. Product Sorting

#### TC009: Sort products by price (low to high)
**Given** products page is loaded
**When** user selects "Price (Low to High)" from sort dropdown
**Then** 
- Products are reordered by price ascending
- Sort dropdown shows selected option
- First product has the lowest price

**Data-TestIds Used**: `product-sort`, `product-item`, `product-price`

#### TC010: Sort products by price (high to low)
**Given** products page is loaded
**When** user selects "Price (High to Low)" from sort dropdown
**Then** 
- Products are reordered by price descending
- First product has the highest price

**Data-TestIds Used**: `product-sort`, `product-item`, `product-price`

#### TC011: Sort products by name (A-Z)
**Given** products page is loaded
**When** user selects "Name (A-Z)" from sort dropdown
**Then** 
- Products are sorted alphabetically by name
- First product name starts with letter closest to 'A'

**Data-TestIds Used**: `product-sort`, `product-item`, `product-name`

#### TC012: Sort products by name (Z-A)
**Given** products page is loaded
**When** user selects "Name (Z-A)" from sort dropdown
**Then** 
- Products are sorted reverse alphabetically by name
- First product name starts with letter closest to 'Z'

**Data-TestIds Used**: `product-sort`, `product-item`, `product-name`

### 5. Add to Cart Functionality

#### TC013: Add product to cart (first time)
**Given** product is not in cart
**When** user clicks "Add to Cart" button on a product
**Then** 
- Cart icon count increases by 1
- Product card shows "1 in cart" text
- Product buttons change to "Remove" and "Update Cart"
- Success toast appears: "Added to cart" with "1 × [Product Name] added to your cart"

**Data-TestIds Used**: `product-add-button`, `cart-item-count`, `product-card-cart-quantity`, `product-remove-button`, `toast-title`, `toast-description`

#### TC014: Add multiple products to cart
**Given** user has products in cart
**When** user adds another different product to cart
**Then** 
- Cart icon count increases by 1
- New product shows cart indicators
- Previous products remain in cart state
- Success toast appears for new product

**Data-TestIds Used**: `product-add-button`, `cart-item-count`, `product-card-cart-quantity`, `toast-title`, `toast-description`

### 6. Quantity Management

#### TC015: Increase product quantity before adding to cart
**Given** product is not in cart
**When** user clicks "+" button to increase quantity to 3
**And** clicks "Add to Cart"
**Then** 
- Cart count increases by 3
- Product shows "1 in cart" (quantity in cart, not selected quantity)
- Toast shows "3 × [Product Name] added to your cart"

**Data-TestIds Used**: `product-increase-quantity`, `product-quantity-value`, `product-add-button`, `cart-item-count`, `toast-description`

#### TC016: Adjust quantity for product already in cart
**Given** product is already in cart (showing "1 in cart")
**When** user increases quantity to 2 using "+" button
**And** clicks "Update Cart"
**Then** 
- Cart count increases by 1 (from 1 to 2 for this product)
- Product shows "2 in cart"
- Success toast: "Cart updated" with "[Product Name] quantity set to 2"

**Data-TestIds Used**: `product-increase-quantity`, `product-quantity-value`, `product-add-button`, `cart-item-count`, `product-card-cart-quantity`, `toast-title`, `toast-description`

#### TC017: Decrease product quantity in cart
**Given** product has quantity 2 in cart
**When** user decreases quantity to 1 using "-" button
**And** clicks "Update Cart"
**Then** 
- Cart count decreases by 1
- Product shows "1 in cart"
- Success toast: "Cart updated" with quantity change message

**Data-TestIds Used**: `product-decrease-quantity`, `product-quantity-value`, `product-add-button`, `cart-item-count`, `product-card-cart-quantity`, `toast-title`, `toast-description`

### 7. Remove from Cart

#### TC018: Remove product from cart
**Given** product is in cart
**When** user clicks "Remove" button
**Then** 
- Cart count decreases by the product's quantity
- Product buttons change back to "Add to Cart"
- "X in cart" text disappears
- Success toast appears confirming removal

**Data-TestIds Used**: `product-remove-button`, `cart-item-count`, `product-add-button`, `product-card-cart-quantity`, `toast-title`, `toast-description`

### 8. Product Navigation

#### TC019: Navigate to product details
**Given** products page is loaded
**When** user clicks on a product card
**Then** 
- User navigates to product details page `/products/{id}`
- Product details page displays:
  - "← Back to Products" link
  - Product image
  - Product name as h1
  - Price
  - Description section
  - Category section
  - Availability section (stock count)
  - Quantity controls
  - Add to Cart button

**Data-TestIds Used**: `product-item`

#### TC020: Return from product details to products list
**Given** user is on product details page
**When** user clicks "← Back to Products" link
**Then** 
- User returns to products page (`/products`)
- Previous filters/search/sort state is maintained

### 9. Combined Functionality

#### TC021: Search and filter combination
**Given** products page is loaded
**When** user selects "Electronics" category
**And** searches for "Samsung"
**Then** 
- Only Electronics products containing "Samsung" are displayed
- Both category filter and search are active
- Clear search maintains category filter

**Data-TestIds Used**: `products-category-electronics`, `product-search`, `product-item`

#### TC022: Sort filtered results
**Given** user has filtered products by category
**When** user changes sort to "Price (Low to High)"
**Then** 
- Filtered products are sorted by price
- Category filter remains active
- Sort dropdown shows selected option

**Data-TestIds Used**: `products-category-electronics`, `product-sort`, `product-item`, `product-price`

#### TC023: Cart persistence across page interactions
**Given** user has products in cart
**When** user performs various actions (search, filter, sort)
**Then** 
- Cart count remains accurate
- Products maintain their cart status ("X in cart", Remove/Update buttons)
- Cart functionality continues to work correctly

**Data-TestIds Used**: `cart-item-count`, `product-card-cart-quantity`, `product-remove-button`, `product-add-button`

### 10. Toast Notifications

#### TC024: Toast notification behavior
**Given** any cart action is performed
**When** toast notification appears
**Then** 
- Toast has appropriate title ("Added to cart", "Cart updated", etc.)
- Toast has descriptive message
- Toast can be closed with "×" button
- Toast auto-dismisses after timeout

**Data-TestIds Used**: `toast-title`, `toast-description`, `toast-close`

## Test Data Requirements

### Product Categories Available
- All Products
- Audio
- Books  
- Computers
- Electronics
- Gaming
- Home & Kitchen
- Sports & Outdoors
- Tools & Hardware
- Wearables

### Sort Options Available
- Name (A-Z)
- Name (Z-A)  
- Price (Low to High)
- Price (High to Low)

### Sample Products for Testing
- iPhone 13 Pro ($999.99, Electronics)
- Samsung Galaxy S21 ($799.99, Electronics)
- Clean Code ($44.99, Books)
- Apple Watch Series 7 ($399.99, Wearables)
- Sony WH-1000XM4 ($349.99, Audio)

## Notes for Test Implementation

1. **Authentication**: All tests require user to be logged in via `uiAuthAdmin` fixture
2. **Test Isolation**: Each test should start with a clean cart state or account for existing items
3. **Dynamic Content**: Product list may vary, use flexible selectors and data-driven approaches
4. **Toast Timing**: Allow adequate wait time for toast notifications to appear and disappear
5. **State Management**: Cart state persists across page interactions within the same session
6. **Error Handling**: Some product images may fail to load (500 errors) but functionality remains intact

## Page Object Model Structure

The ProductsPage POM should include:
- Navigation methods for categories, search, sort
- Cart interaction methods (add, remove, update quantities)
- Product selection and navigation methods
- Toast verification methods
- State verification methods (cart count, product status)

This comprehensive test suite ensures thorough coverage of the Products page functionality while maintaining focus on happy path scenarios that represent typical user workflows.
