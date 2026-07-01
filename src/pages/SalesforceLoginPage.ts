import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { authenticator } from 'otplib';
import { chromium } from '@playwright/test';


/**
 * Salesforce Login Page Object
 * Handles Salesforce login for test setup
 */
export class SalesforceLoginPage extends BasePage {
  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly otpInput: Locator;
  private readonly submitButton: Locator;
  

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[id="username"]');
    this.passwordInput = page.locator('input[id="password"]');
    this.loginButton = page.locator('input[id="Login"]');
    this.otpInput = this.page.locator('input[name="tc"]');
    this.submitButton = this.page.locator('input[id="save"]');
  }

  async goto(url: string): Promise<void> {
    await super.goto(url);
  }





  /**
   * Enter username and password and click login
   */
  
async enterCredentialsAndLogin(
  username: string,
  password: string,
  secret: string
): Promise<void> {

  await this.fill(this.usernameInput, username);
  await this.fill(this.passwordInput, password);
  await this.click(this.loginButton);

  await this.waitForElement(this.otpInput, 10000);
  


    authenticator.options = {
      step: 30,
      window: 1, // allows ±30s tolerance
    };

  // ✅ normalize secret
  const cleanedSecret = secret.replace(/\s+/g, '').toUpperCase();

  // ✅ generate token just-in-time
  const otpToken = authenticator.generate(cleanedSecret);

  console.log('OTP:', otpToken); // debug

  // ✅ minimize delay between fill and submit
  await this.fill(this.otpInput, otpToken);
  await this.click(this.submitButton);

  await this.waitForPageLoad();
}






  
}
