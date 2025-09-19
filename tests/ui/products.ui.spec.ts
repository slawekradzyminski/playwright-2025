import { test, expect } from "../../fixtures/uiAuth";
import { ProductsPage } from "../../pages/productsPage";
import { randomProduct } from "../../generators/productGenerator";
import { createProduct } from "../../http/createProductClient";

test.describe("Products UI tests", () => {
  let productsPage: ProductsPage;
  let productName: string;

  test.beforeEach(async ({ uiAuthAdmin, request }) => {
    productsPage = new ProductsPage(uiAuthAdmin.page);
    const { token } = uiAuthAdmin;
    const product = randomProduct();
    await createProduct(request, product, token);
    productName = product.name;
    await productsPage.goto();
  });

  test("should add product to cart and verify all changes", async ({ uiAuthAdmin }) => {
    // given
    await productsPage.searchProduct(productName);
    
    // when
    await productsPage.addProductToCartByName(productName);
    
    // then
    await expect(productsPage.page.getByTestId('cart-item-count')).toHaveText("1");
    await productsPage.expectProductInCart(productName);
    await productsPage.toast.verifySuccessMessage(`1 × ${productName} added to your cart`);
  });
});
