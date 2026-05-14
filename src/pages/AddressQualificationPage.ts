import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Address Qualification Page Object
 * Handles address entry and availability checking
 */
export class AddressQualificationPage extends BasePage {
  // Locators
  private readonly addressInput: Locator;
  private readonly unitInput: Locator;
  private readonly checkAvailabilityButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addressInput = page.locator('input[id*="o2check"], input[name*="dwfrm_addressChecker_o2check"]');
    this.unitInput = page.locator('input[id*="o2UnitNumber"], input[name*="dwfrm_addressChecker_unitNumber"]');
    this.checkAvailabilityButton = page.locator('[id*="adresscheck-submit"], button:has-text("Check availability")');
  }

  /**
   * Enter address and check availability
   */
  async enterAddressAndCheckAvailability(address: string): Promise<void> {
    await this.fill(this.addressInput, address);
    await this.click(this.checkAvailabilityButton);
    await this.waitForPageLoad();
  }

   /**
   * Enter address,unitand check availability
   */
  async enterAddressUnitAndCheckAvailability(address: string , unit: string): Promise<void> {
    await this.fill(this.addressInput, address);
    await this.fill(this.unitInput, unit);
    await this.page.waitForTimeout(2000); // Wait for unit input to be processed
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);
    await this.click(this.checkAvailabilityButton);
    await this.waitForPageLoad();
  }
  /**
   * Check if address input is visible
   */
  async isAddressInputVisible(): Promise<boolean> {
    return await this.isVisible(this.addressInput);
  }

  /**
   * Check if check availability button is enabled
   */
  async isCheckAvailabilityEnabled(): Promise<boolean> {
    return await this.checkAvailabilityButton.isEnabled();
  }
}
