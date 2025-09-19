import { test, expect } from "../../fixtures/uiAuth";
import { ProductsPage } from "../../pages/productsPage";

test.describe("Products UI tests", () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ uiAuth }) => {
    productsPage = new ProductsPage(uiAuth.page);
    await productsPage.goto();
  });

  test("should add product to cart and verify all changes", async ({ uiAuth }) => {
    // given
    const productName = "iPhone 13 Pro";
    
    // when
    await productsPage.addProductToCartByName(productName);
    
    // then
    await expect(productsPage.page.getByTestId('cart-item-count')).toHaveText("1");
    await productsPage.expectProductInCart(productName);
    await productsPage.expectToastMessage(`1 × ${productName} added to your cart`);
  });
});
