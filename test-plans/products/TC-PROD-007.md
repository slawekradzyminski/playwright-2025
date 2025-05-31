# TC-PROD-007: Multiple Category Filter Testing

**Test Case ID:** TC-PROD-007  
**Title:** Verify All Category Filters Work Correctly and Show Appropriate Products  
**Priority:** High  
**Test Type:** Functional  
**Category:** Category Filtering  

## Prerequisites
- User must be logged in and on Products page
- Test data must include products in all available categories
- All category buttons must be visible and functional
- Products must be properly categorized in the database

## Test Steps
1. Navigate to Products page
2. Click "Audio" category and verify results show only Audio products
3. Click "Books" category and verify results show only Books products
4. Click "Computers" category and verify results show only Computer products
5. Click "Gaming" category and verify results show only Gaming products
6. Click "Home & Kitchen" category and verify results show only Home & Kitchen products
7. Click "Wearables" category and verify results show only Wearables products
8. Click "All Products" and verify all products are shown again
9. Verify page headings update correctly for each category
10. Check that product counts are reasonable for each category
11. Verify no products appear in wrong categories

## Expected Results
- Each category filter shows only products from that category
- Page headings update correctly (e.g., "Audio Products", "Books Products")
- Product counts are logical and consistent
- "All Products" shows the complete product catalog
- No cross-contamination between categories
- Filtering performance is consistent across all categories
- Category selection is visually indicated
- All category transitions are smooth and responsive

## Things to Watch Out For
- Products appearing in wrong categories
- Empty categories when products should exist
- Inconsistent filtering behavior between categories
- Page headings not updating correctly
- Performance degradation with certain categories
- Category buttons not showing active state 