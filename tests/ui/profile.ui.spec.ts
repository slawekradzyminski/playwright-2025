import { randomUUID } from 'node:crypto';
import { expect, test } from '../../fixtures/authenticatedUiUserFixture';
import { expectJsonResponse } from '../../helpers/apiAssertions';
import { givenPendingOrderWithProduct } from '../../helpers/orderHelpers';
import { getSeededProduct } from '../../helpers/productHelpers';
import { CartClient } from '../../httpclients/cartClient';
import { OrdersClient } from '../../httpclients/ordersClient';
import { ProductsClient } from '../../httpclients/productsClient';
import { UsersClient } from '../../httpclients/usersClient';
import { ProfilePage } from '../../pages/profilePage';
import type { UserResponseDto } from '../../types/auth';
import type { ChatSystemPromptDto, ToolSystemPromptDto } from '../../types/systemPrompt';

test.describe('Profile UI tests', () => {
  let cartClient: CartClient;
  let ordersClient: OrdersClient;
  let productsClient: ProductsClient;
  let profilePage: ProfilePage;
  let usersClient: UsersClient;

  test.beforeEach(async ({ page, request }) => {
    cartClient = new CartClient(request);
    ordersClient = new OrdersClient(request);
    productsClient = new ProductsClient(request);
    profilePage = new ProfilePage(page);
    usersClient = new UsersClient(request);
  });

  test('should display profile workspace with empty order history', async ({ authenticatedUiUser }) => {
    // given

    // when
    await profilePage.open();

    // then
    await profilePage.assertThatUrlIs(ProfilePage.url);
    await profilePage.assertThatProfileWorkspaceIsVisible(authenticatedUiUser.userData);
    await profilePage.assertThatPersonalInformationIsVisible(authenticatedUiUser.userData);
    await profilePage.assertThatNoOrdersMessageIsVisible();
  });

  test('should save personal information from profile workspace', async ({ authenticatedUiUser }) => {
    // given
    const updatedProfile = {
      email: `profile.${randomUUID()}@example.com`,
      firstName: `Name${randomUUID().slice(0, 8)}`,
      lastName: `User${randomUUID().slice(0, 8)}`
    };
    await profilePage.open();
    await profilePage.assertThatProfileWorkspaceIsVisible(authenticatedUiUser.userData);

    // when
    await profilePage.savePersonalInformation(authenticatedUiUser.userData.username, updatedProfile);

    // then
    await profilePage.assertThatUrlIs(ProfilePage.url);
    const meResponse = await usersClient.getMe(authenticatedUiUser.token);
    const me = await expectJsonResponse<UserResponseDto>(meResponse, 200);
    await profilePage.assertThatPersonalInformationIsVisible({
      email: me.email,
      firstName: me.firstName,
      lastName: me.lastName
    });
  });

  test('should save chat and tool prompts from profile workspace', async ({ authenticatedUiUser }) => {
    // given
    const chatPrompt = `chat prompt ${randomUUID()}`;
    const toolPrompt = `tool prompt ${randomUUID()}`;
    await profilePage.open();
    await profilePage.assertThatProfileWorkspaceIsVisible(authenticatedUiUser.userData);

    // when
    await profilePage.saveChatSystemPrompt(chatPrompt);
    await profilePage.saveToolSystemPrompt(toolPrompt);

    // then
    const chatPromptResponse = await usersClient.getChatSystemPrompt(authenticatedUiUser.token);
    const savedChatPrompt = await expectJsonResponse<ChatSystemPromptDto>(chatPromptResponse, 200);
    const toolPromptResponse = await usersClient.getToolSystemPrompt(authenticatedUiUser.token);
    const savedToolPrompt = await expectJsonResponse<ToolSystemPromptDto>(toolPromptResponse, 200);

    await profilePage.assertThatUrlIs(ProfilePage.url);
    await profilePage.assertThatProfileWorkspaceIsVisible(authenticatedUiUser.userData);
    expect(savedChatPrompt.chatSystemPrompt).toBe(chatPrompt);
    expect(savedToolPrompt.toolSystemPrompt).toBe(toolPrompt);
  });

  test('should display recent order in profile order history and filter by pending status', async ({
    authenticatedUiUser
  }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    const order = await givenPendingOrderWithProduct(
      cartClient,
      ordersClient,
      authenticatedUiUser.token,
      product.id,
      2
    );

    // when
    await profilePage.open();
    await profilePage.selectOrderStatus('PENDING');

    // then
    await profilePage.assertThatUrlIs(ProfilePage.url);
    await profilePage.assertThatOrderIsVisible(order);
  });
});
