import { test, expect } from '../../fixtures/uiAuthFixture';
import { CartPage } from '../../pages/CartPage';
import { resetCart, addToCart } from '../helpers/cartHelper';

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
});
