# Products Page UI Test Plan

## Overview
The Products page is a key feature of the application that allows authenticated users to browse, search, filter, and add products to their cart. The page includes:
- Category sidebar with 16 product categories
- Search functionality
- Sort functionality (Name A-Z, Name Z-A, Price Low to High, Price High to Low)
- Product grid display with product cards
- Quantity controls and add to cart functionality
- Cart badge updates

## Test IDs Identified
### Navigation
- `desktop-menu-products` - Products link in header
- `desktop-cart-icon` - Cart icon with badge

### Page Structure
- `products-page` - Main container
- `products-title` - Page heading
- `products-layout` - Main layout container
- `products-sidebar` - Category sidebar
- `products-content` - Product grid area

### Categories
- `products-categories-title` - "Categories" heading
- `products-categories-list` - Category list
- `products-category-all` - All Products button
- `products-category-{category}` - Individual category buttons (audio, beauty, books, computers, electronics, gaming, garden, health, home-&-kitchen, kids, movies, shoes, sports, tools, wearables)

### Search & Sort
- `product-search` - Search input field
- `clear-search` - Clear search button (appears when search has text)
- `product-sort` - Sort dropdown
- `product-list-title` - Title showing current category/filter

### Product Cards
- `product-item` - Product card container
- `product-image` - Product image
- `product-name` - Product title
- `product-price` - Product price
- `product-category` - Product category badge
- `product-description` - Product description
- `product-quantity-value` - Quantity display
- `product-decrease-quantity` - Decrease quantity button
- `product-increase-quantity` - Increase quantity button
- `product-add-button` - Add to cart button
- After adding to cart: `product-buttons` contains "Remove from cart" and "Update Cart" buttons

## Proposed Test Cases

### Test Suite: Products Page UI Tests

#### 1. Category Filtering
**Test: should display all products by default**
- **Given:** authenticated user is on products page
- **Then:** "All Products" category is active
- **And:** products from multiple categories are displayed

**Test: should filter products when Electronics category is selected**
- **Given:** authenticated user is on products page
- **When:** user clicks "Electronics" category button
- **Then:** page title shows "Electronics Products"
- **And:** only electronics products are displayed
- **And:** "Electronics" category button is active

**Test: should reset filter when All Products is clicked**
- **Given:** authenticated user has filtered products by category
- **When:** user clicks "All Products" button
- **Then:** page title shows "All Products"
- **And:** products from all categories are displayed
- **And:** "All Products" category button is active

#### 2. Search Functionality
**Test: should filter products when searching**
- **Given:** authenticated user is on products page
- **When:** user types "iPhone" in search field
- **Then:** only products matching "iPhone" are displayed
- **And:** clear search button is visible

**Test: should clear search when clear button is clicked**
- **Given:** authenticated user has searched for products
- **And:** clear search button is visible
- **When:** user clicks clear search button
- **Then:** search field is empty
- **And:** all products are displayed again

**Test: should show no results for non-existent product**
- **Given:** authenticated user is on products page
- **When:** user types "nonexistentproduct123" in search field
- **Then:** no products are displayed
- **Or:** empty state message is shown

#### 3. Sort Functionality
**Test: should sort products by name ascending**
- **Given:** authenticated user is on products page
- **When:** user selects "Name (A-Z)" from sort dropdown
- **Then:** products are sorted alphabetically by name

**Test: should sort products by price low to high**
- **Given:** authenticated user is on products page
- **When:** user selects "Price (Low to High)" from sort dropdown
- **Then:** products are sorted by price ascending

**Test: should sort products by price high to low**
- **Given:** authenticated user is on products page
- **When:** user selects "Price (High to Low)" from sort dropdown
- **Then:** products are sorted by price descending

#### 4. Quantity Controls
**Test: should increase product quantity when plus button is clicked**
- **Given:** authenticated user is on products page
- **And:** product quantity is 1
- **When:** user clicks increase quantity button
- **Then:** product quantity displays 2

**Test: should decrease product quantity when minus button is clicked**
- **Given:** authenticated user is on products page
- **And:** product quantity is 2
- **When:** user clicks decrease quantity button
- **Then:** product quantity displays 1

**Test: should not decrease quantity below 1**
- **Given:** authenticated user is on products page
- **And:** product quantity is 1
- **When:** user clicks decrease quantity button
- **Then:** product quantity remains 1

#### 5. Add to Cart Functionality
**Test: should add product to cart with default quantity**
- **Given:** authenticated user is on products page
- **When:** user clicks "Add to Cart" button for a product
- **Then:** success toast message is displayed
- **And:** cart badge shows updated quantity
- **And:** product card shows "Remove from cart" and "Update Cart" buttons

**Test: should add product to cart with custom quantity**
- **Given:** authenticated user is on products page
- **When:** user increases product quantity to 3
- **And:** user clicks "Add to Cart" button
- **Then:** success toast shows "3 × [Product Name] added to your cart"
- **And:** cart badge updates correctly
- **And:** product shows "3 in cart" text

**Test: should update cart badge when multiple products are added**
- **Given:** authenticated user is on products page
- **When:** user adds 2 units of first product
- **And:** user adds 1 unit of second product
- **Then:** cart badge shows total of 3 items

#### 6. Combined Functionality
**Test: should maintain search when sorting**
- **Given:** authenticated user has searched for products
- **When:** user changes sort order
- **Then:** search filter is maintained
- **And:** results are sorted as expected

**Test: should clear search when category is selected**
- **Given:** authenticated user has searched for products
- **When:** user selects a category
- **Then:** search is cleared
- **And:** category filter is applied

## Notes
- All tests should use `authenticatedUIAdmin` or `authenticatedUIClient` fixtures
- Product data is dynamic, so tests should be flexible about specific product names
- Focus on core user flows rather than edge cases (assuming unit test coverage)
- Cart functionality details (remove, update) should be tested in dedicated cart page tests

