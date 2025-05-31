# TC-PROD-008: Sort Functionality Verification

**Test Case ID:** TC-PROD-008  
**Title:** Verify Sort Dropdown Functions and Orders Products Correctly  
**Priority:** Medium  
**Test Type:** Functional  
**Category:** Sorting  

## Prerequisites
- User must be logged in and on Products page
- Sort dropdown must be visible and functional
- Multiple products must be available for sorting
- Products must have different prices and names for sorting comparison

## Test Steps
1. Navigate to Products page
2. Locate the sort dropdown control
3. Click on the sort dropdown to open options
4. Verify available sort options are displayed
5. Select "Price: Low to High" option
6. Verify products are sorted by price in ascending order
7. Select "Price: High to Low" option
8. Verify products are sorted by price in descending order
9. Select "Name: A to Z" option (if available)
10. Verify products are sorted alphabetically
11. Test sorting with different category filters active
12. Verify sort selection persists during category changes

## Expected Results
- Sort dropdown opens and displays available options
- Price sorting (low to high) arranges products correctly
- Price sorting (high to low) arranges products correctly
- Alphabetical sorting works properly
- Sort selection is visually indicated in dropdown
- Sorting works correctly with category filters
- Sort operation completes within 2 seconds
- Product layout remains consistent during sorting

## Things to Watch Out For
- Incorrect sort order implementation
- Sort dropdown not opening or closing properly
- Sorting breaking when combined with category filters
- Performance issues with large product sets
- Sort selection not being visually indicated
- Sorting not persisting across page interactions 