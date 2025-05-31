# TC-PROD-004: Product Search Functionality with Results Display

**Test Case ID:** TC-PROD-004  
**Title:** Verify Product Search Returns Relevant Results and Shows Clear Button  
**Priority:** High  
**Test Type:** Functional  
**Category:** Search Functionality  

## Prerequisites
- User must be logged in and on Products page
- Products page must be fully loaded
- Search input field must be visible and functional
- Test data must include products with "iPhone" in the name
- Clear search button should be initially hidden

## Test Steps
1. Navigate to Products page
2. Locate the search input field
3. Verify clear search button is not visible initially
4. Click in the search input field
5. Type "iPhone" in the search field
6. Wait for search results to appear
7. Verify clear search button becomes visible
8. Count the number of search results
9. Verify all results contain "iPhone" in product name
10. Check that non-matching products are filtered out
11. Verify search is case-insensitive
12. Verify search results maintain proper product layout

## Expected Results
- Search input accepts text input correctly
- Clear search button appears after entering search term
- Search results display only products matching "iPhone"
- Search is case-insensitive (finds iPhone, iphone, IPHONE)
- At least one product result is returned
- Non-matching products are hidden from view
- Product layout remains consistent in search results
- Search completes within 1 second of typing
- Clear button is properly styled and positioned

## Things to Watch Out For
- Search not working with special characters
- Case-sensitive search when it should be case-insensitive
- Clear button not appearing or functioning
- Search results including irrelevant products
- Performance issues with large product catalogs
- Search breaking page layout or styling 