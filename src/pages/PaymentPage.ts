import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Payment Page Object
 * Handles credit card payment processing
 */
export class PaymentPage extends BasePage {
  // Locators
  private readonly creditCardButton: Locator;
  private readonly creditCardAgreeCheckbox: Locator;
  private readonly paymentIframe: Locator;
  private readonly successMessage: Locator;
   private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.creditCardButton = page.locator('//a[@id="pay"]');
    this.creditCardAgreeCheckbox = page.locator('label[for*="ACHOptOutCheckbox"]');
    this.paymentIframe = page.locator('iframe[id*="z_hppm_iframe"]');
    this.successMessage = page.locator('//*[contains(text(), "Thanks for choosing Quantum Fiber")]');
    this.submitButton = page.locator('//a[contains(text(), "submit")]');
  }

  /**
   * Select credit card payment method
   */
  async selectCreditCard(): Promise<void> {
    await this.click(this.creditCardButton);
  }

  /**
   * Agree to credit card terms
   */
  async agreeToCreditCardTerms(): Promise<void> {
    await this.click(this.creditCardAgreeCheckbox);
  }

  /**
   * Fill credit card details in iframe
   */
  async fillCreditCardDetails(cardNumber: string, CVV: string): Promise<void> {
    // Switch to payment iframe
    const frame = this.paymentIframe.contentFrame();
    if (!frame) throw new Error('Payment iframe not found');

    // Navigate through form fields using keyboard
    //await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');

    // Enter card number
    await this.page.keyboard.type(cardNumber);

    // Navigate to expiry month
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('ArrowDown'); // Select month

    // Navigate to expiry year
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('ArrowDown'); // Select year
    await this.page.keyboard.press('ArrowDown'); // Select year

    // Enter expiry year
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.type(CVV);

    // Navigate through remaining fields
    for (let i = 0; i < 11; i++) {
      await this.page.keyboard.press('Tab');
    }

    await this.page.keyboard.press('Enter'); // Submit payment

  }

  /**
   * Check if payment was successful
   */
  async isPaymentSuccessful(): Promise<boolean> {
    return await this.isVisible(this.successMessage);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  /**
   * Wait for payment processing
   */
  async waitForPaymentProcessing(): Promise<void> {
    await this.page.waitForTimeout(5000); // Wait 5 seconds as in the flow
  }
}
