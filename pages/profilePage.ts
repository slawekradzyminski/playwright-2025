import { expect, type Locator, type Page } from '@playwright/test';
import { formatMoney } from '../helpers/productHelpers';
import {
  USERS_CHAT_SYSTEM_PROMPT_ENDPOINT,
  USERS_ENDPOINT,
  USERS_TOOL_SYSTEM_PROMPT_ENDPOINT
} from '../httpclients/usersClient';
import type { UserEditDto, UserRegisterDto } from '../types/auth';
import type { OrderDto, OrderStatus } from '../types/order';
import { BasePage } from './basePage';
import { LoggedInHeaderComponent } from './components/loggedInHeaderComponent';

export class ProfilePage extends BasePage {
  static readonly url = '/profile';

  readonly header: LoggedInHeaderComponent;

  private readonly pageContainer: Locator;
  private readonly title: Locator;
  private readonly userSection: Locator;
  private readonly userTitle: Locator;
  private readonly emailInput: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly saveChangesButton: Locator;
  private readonly promptInput: Locator;
  private readonly promptSubmitButton: Locator;
  private readonly toolPromptInput: Locator;
  private readonly toolPromptSubmitButton: Locator;
  private readonly ordersSection: Locator;
  private readonly ordersFilter: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedInHeaderComponent(page);
    this.pageContainer = page.getByTestId('profile-page');
    this.title = page.getByTestId('profile-title');
    this.userSection = page.getByTestId('profile-user-section');
    this.userTitle = page.getByTestId('profile-user-title');
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.saveChangesButton = this.userSection.getByRole('button', { name: 'Save Changes' });
    this.promptInput = page.getByTestId('profile-prompt-input');
    this.promptSubmitButton = page.getByTestId('profile-prompt-submit');
    this.toolPromptInput = page.getByTestId('profile-tool-prompt-input');
    this.toolPromptSubmitButton = page.getByTestId('profile-tool-prompt-submit');
    this.ordersSection = page.getByTestId('profile-orders-section');
    this.ordersFilter = page.getByRole('combobox', { name: 'Filter by status:' });
  }

  async open(): Promise<void> {
    await this.page.goto(ProfilePage.url);
  }

  async savePersonalInformation(username: string, user: UserEditDto): Promise<void> {
    await this.emailInput.fill(user.email);

    if (user.firstName !== undefined) {
      await this.firstNameInput.fill(user.firstName);
    }

    if (user.lastName !== undefined) {
      await this.lastNameInput.fill(user.lastName);
    }

    const responsePromise = this.page.waitForResponse(
      (response) => response.request().method() === 'PUT' && response.url().endsWith(`${USERS_ENDPOINT}/${username}`)
    );

    await this.saveChangesButton.click();
    await responsePromise;
  }

  async saveChatSystemPrompt(prompt: string): Promise<void> {
    await this.promptInput.fill(prompt);

    const responsePromise = this.page.waitForResponse(
      (response) => response.request().method() === 'PUT' && response.url().endsWith(USERS_CHAT_SYSTEM_PROMPT_ENDPOINT)
    );

    await this.promptSubmitButton.click();
    await responsePromise;
  }

  async saveToolSystemPrompt(prompt: string): Promise<void> {
    await this.toolPromptInput.fill(prompt);

    const responsePromise = this.page.waitForResponse(
      (response) => response.request().method() === 'PUT' && response.url().endsWith(USERS_TOOL_SYSTEM_PROMPT_ENDPOINT)
    );

    await this.toolPromptSubmitButton.click();
    await responsePromise;
  }

  async selectOrderStatus(status: OrderStatus | 'ALL'): Promise<void> {
    const label = status === 'ALL' ? 'All Orders' : `${status[0]}${status.slice(1).toLowerCase()}`;
    await this.ordersFilter.selectOption({ label });
  }

  async assertThatProfileWorkspaceIsVisible(user: UserRegisterDto): Promise<void> {
    await expect(this.pageContainer).toBeVisible();
    await expect(this.title).toHaveText('Profile');
    await expect(this.pageContainer).toContainText(`${user.firstName} ${user.lastName}`);
    await expect(this.pageContainer).toContainText(user.email);
    await expect(this.userTitle).toHaveText('Personal Information');
    await expect(this.promptInput).toBeVisible();
    await expect(this.promptSubmitButton).toHaveText('Save Prompt');
    await expect(this.toolPromptInput).toBeVisible();
    await expect(this.toolPromptSubmitButton).toHaveText('Save Tool Prompt');
    await expect(this.ordersSection).toContainText('Your Orders');
    await expect(this.ordersFilter).toBeVisible();
  }

  async assertThatPersonalInformationIsVisible(
    user: Pick<UserRegisterDto, 'email' | 'firstName' | 'lastName'>
  ): Promise<void> {
    await expect(this.emailInput).toHaveValue(user.email);
    await expect(this.firstNameInput).toHaveValue(user.firstName);
    await expect(this.lastNameInput).toHaveValue(user.lastName);
  }

  async assertThatNoOrdersMessageIsVisible(): Promise<void> {
    await expect(this.ordersSection).toContainText("You don't have any orders yet.");
  }

  async assertThatOrderIsVisible(order: OrderDto): Promise<void> {
    await expect(this.ordersSection).toContainText(`Order #${order.id}`);
    await expect(this.ordersSection).toContainText(order.status);
    await expect(this.ordersSection).toContainText(formatMoney(order.totalAmount));
    await expect(this.ordersSection).toContainText(`${order.items.length} items`);
    await expect(this.ordersSection.getByRole('link', { name: 'View Details →' })).toHaveAttribute(
      'href',
      `/orders/${order.id}`
    );
  }

  async assertThatOrderIsNotVisible(order: OrderDto): Promise<void> {
    await expect(this.ordersSection).not.toContainText(`Order #${order.id}`);
  }
}
