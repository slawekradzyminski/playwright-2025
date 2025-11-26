import { test, expect } from '../../fixtures/uiAuthFixture';
import { CartPage } from '../../pages/CartPage';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';
import { resetCart, addToCart } from '../helpers/cartHelper';
import { getProductById } from '../../http/products/getProductByIdRequest';
import type { ProductDto } from '../../types/products';

test.describe('Cart Page', () => {
    let cartPage: CartPage;
    let authToken: string;

    test.beforeEach(async ({ page, request, clientUiAuth }) => {
        cartPage = new CartPage(page);
        authToken = clientUiAuth.token;
        await resetCart(request, authToken);
    });

    test('should display empty cart message initially', async () => {
        // given
        await cartPage.goto();

        // then
        await expect(cartPage.cartEmpty).toBeVisible();
        await expect(cartPage.getCartItemRows()).toHaveCount(0);
        await expect(cartPage.cartSummaryItemsCount).toBeHidden();
    });

    test('should display items added to cart', async ({ request }) => {
        // given
        await addToCart(request, 1, authToken, 1);
        await addToCart(request, 2, authToken, 2);

        // when
        await cartPage.goto();

        // then
        await expect(cartPage.getCartItemRows()).toHaveCount(2);
        await expect(cartPage.cartSummaryItemsCount).toContainText('3');
    });

    test('should increment and decrement item quantity', async ({ request }) => {
        // given
        await addToCart(request, 1, authToken, 1);
        await cartPage.goto();

        // when
        await cartPage.increaseQuantity(1);

        // then
        await expect(cartPage.getCartItemQuantity(1)).toHaveText('2');

        // when
        await cartPage.decreaseQuantity(1);

        // then
        await expect(cartPage.getCartItemQuantity(1)).toHaveText('1');
    });

    test('should remove item from cart', async ({ request }) => {
        // given
        await addToCart(request, 1, authToken, 1);
        await cartPage.goto();

        // when
        await cartPage.removeItem(1);

        // then
        await expect(cartPage.getCartItemRows()).toHaveCount(0);
        await expect(cartPage.cartEmpty).toBeVisible();
    });

    test('should clear cart', async ({ page, request }) => {
        // given
        await addToCart(request, 1, authToken, 1);
        await addToCart(request, 2, authToken, 1);
        await cartPage.goto();

        // when
        page.on('dialog', dialog => dialog.accept());
        await cartPage.clearCart();

        // then
        await expect(cartPage.getCartItemRows()).toHaveCount(0);
        await expect(cartPage.cartEmpty).toBeVisible();
    });

    test('should update total price when quantity changes', async ({ request }) => {
        // given
        const productId = 1;
        const productResponse = await getProductById(request, productId, authToken);
        const product: ProductDto = await productResponse.json();
        const unitPrice = product.price;
        const formattedUnitPrice = `$${unitPrice.toFixed(2)}`;
        const formattedDoublePrice = `$${(unitPrice * 2).toFixed(2)}`;

        await addToCart(request, productId, authToken, 1);
        await cartPage.goto();

        // then
        await expect(cartPage.getCartItemTotal(productId)).toHaveText(formattedUnitPrice);
        await expect(cartPage.cartSummaryTotalPrice).toHaveText(formattedUnitPrice);

        // when
        await cartPage.increaseQuantity(productId);
        await cartPage.updateQuantity(productId);

        // then
        await expect(cartPage.getCartItemQuantity(productId)).toHaveText('2');
        await expect(cartPage.getCartItemTotal(productId)).toHaveText(formattedDoublePrice);
        await expect(cartPage.cartSummaryTotalPrice).toHaveText(formattedDoublePrice);
    });

    test('should navigate to product details when clicking product name', async ({ page, request }) => {
        // given
        const productId = 1;
        const productResponse = await getProductById(request, productId, authToken);
        const product: ProductDto = await productResponse.json();

        await addToCart(request, productId, authToken, 1);
        await cartPage.goto();

        // when
        await cartPage.getCartItemName(productId).click();

        // then
        const productDetailsPage = new ProductDetailsPage(page);
        await expect(productDetailsPage.productName).toHaveText(product.name);
        await expect(page).toHaveURL(new RegExp(`/products/${productId}`));
    });
});
