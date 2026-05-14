import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Installation Date/Time Selection Page Object
 * Handles appointment scheduling
 */
export class InstallationPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly mobileInput: Locator;
  private readonly subscriberAgreement: Locator;
  private readonly ageCheckbox: Locator;
  private readonly continueButton: Locator;
  private readonly appointmentDateTime: Locator;
   private readonly saTime: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('//input[@type="email" and @id="email" and @name="dwfrm_appointment_email"]');
    this.mobileInput = page.locator('//input[@type="tel" and @id="phone" and @name="dwfrm_appointment_phone"]');
    this.subscriberAgreement = page.locator('//label[@id="qf-mobileMessage"]');
   // this.ageCheckbox = page.locator('//input[@type="checkbox" and @id="checkage" and @name="dwfrm_appointment_ageCheckbox"]');
    this.ageCheckbox = page.locator('//label[@class="custom-control-label"]');
    this.continueButton = page.locator('//button[@id="adresscheck-submit" and @type="submit" and contains(@class, "qf-btn-primary-action")]');
    this.appointmentDateTime = page.locator('//input[@type="text" and @readonly="readonly" and contains(@class, "form-control") and @placeholder="Finding appointments…"]');
    this.saTime = page.locator('//span[@class="select2-selection__rendered" and @id="select2-timeSlot-container"]');
  }

  /**
   * Enter contact information and agree to terms
   */
  async enterContactInfoAndAgree(email: string, mobile: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.mobileInput, mobile);
    await this.click(this.subscriberAgreement);
  }

   /**
   * Enter contact information and agree to terms
   */
  async clickAgeCheckbox(): Promise<void> {
   
     await this.page.locator('//label[@for="checkage"]').first().click();
    
  }

  /**
   * Continue to next step
   */
  async continue(): Promise<void> {
    await this.click(this.continueButton);
    await this.waitForPageLoad();
  }

  /**
   * Get SA date text
   */
  async getSaDate(): Promise<string> {
    return await this.getText(this.saTime);
  }

  /**
   * Check if appointment date/time is visible
   */
  async isAppointmentVisible(): Promise<boolean> {
    return await this.isVisible(this.appointmentDateTime);
  }

    /**
   * Check if SA date is visible
   */
  async isSaTimeVisible(): Promise<boolean> {
    return await this.isVisible(this.saTime);
  }

  /**
   * Check if continue button is enabled
   */
  async isContinueEnabled(): Promise<boolean> {
    return await this.continueButton.isEnabled();
  }
}
