import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Account & Payment Information Page Object
 * Handles account creation and payment setup
 */
export class AccountPaymentPage extends BasePage {
  // Locators
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly continuityPlanAgreement: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[id*="fname"]');
    this.lastNameInput = page.locator('input[id*="lname"]');
    this.continuityPlanAgreement = page.locator('label[for*="ContinuityPlanCheckbox"]');
    this.continueButton = page.locator('[id*="checkout-continue-btn"], button:has-text("Continue")');
  }

  /**
   * Enter account information and agree to continuity plan
   */
  async enterAccountInfoAndAgree(firstName: string, lastName: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.click(this.continuityPlanAgreement);
  }

  /**
   * Continue to next step
   */
  async continue(): Promise<void> {
    await this.click(this.continueButton);
    await this.waitForPageLoad();
  }

  /**
   * Check if continue button is enabled
   */
  async isContinueEnabled(): Promise<boolean> {
    return await this.continueButton.isEnabled();
  }
}
