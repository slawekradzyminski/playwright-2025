# TC-PROD-005: Search Clear Functionality and Return to All Products

**Test Case ID:** TC-PROD-005  
**Title:** Verify Clear Search Button Removes Search and Shows All Products  
**Priority:** Medium  
**Test Type:** Functional  
**Category:** Search Functionality  

## Prerequisites
- User must be logged in and on Products page
- A search must be active with search term entered
- Clear search button must be visible
- Search results must be currently displayed

## Test Steps
1. Navigate to Products page
2. Enter "iPhone" in search field to activate search
3. Verify search results are displayed
4. Verify clear search button is visible
5. Click the clear search button
6. Verify search input field is cleared
7. Verify clear search button becomes hidden
8. Verify page heading returns to "All Products"
9. Verify all products are displayed again
10. Count total products to ensure all are shown
11. Verify page layout returns to original state

## Expected Results
- Clear button successfully clears the search input
- Clear button becomes hidden after clearing search
- Page heading changes back to "All Products"
- All products are displayed again (same count as initial load)
- Search input field is empty
- Page layout returns to original state
- Clear action completes immediately
- No residual search filtering remains active

## Things to Watch Out For
- Clear button not hiding after clearing search
- Search input not being properly cleared
- Products not returning to full list after clear
- Page heading not updating correctly
- Performance issues when returning to full product list
- Clear button not responding to clicks 