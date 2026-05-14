import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Order Review Page Object
 * Handles order review and confirmation
 */
export class OrderReviewPage extends BasePage {
  // Locators
  private readonly continueButton: Locator;
  private readonly orderDetails: (text: string) => Locator;

  constructor(page: Page) {
    super(page);
    this.continueButton = page.locator('[id*="order-review__continue"]');
    this.orderDetails = (text: string) =>
      page.locator(`//img[contains(@alt, "${text}") and contains(@title, "${text}")]`);
  }

  /**
   * Continue to next step
   */
  async continue(): Promise<void> {
    await this.click(this.continueButton);
    await this.waitForPageLoad();
  }

  /**
   * Check if order contains specific text
   */
  async doesOrderContainText(text: string): Promise<boolean> {
    return await this.orderDetails(text).isVisible();
  }

  /**
   * Get order details text
   */
  async getOrderDetails(text: string): Promise<string> {
    return (await this.orderDetails(text).getAttribute('alt')) ?? '';
  }
}
