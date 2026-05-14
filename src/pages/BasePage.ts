import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object class that all pages inherit from
 * Provides common methods for page interaction
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Click on an element
   */
  async click(locator: Locator | string): Promise<void> {
    if (typeof locator === 'string') {
      await this.page.click(locator);
    } else {
      await locator.click();
    }
  }

  /**
   * Fill text in an input field
   */
  async fill(locator: Locator | string, text: string): Promise<void> {
    if (typeof locator === 'string') {
      await this.page.fill(locator, text);
    } else {
      await locator.fill(text);
    }
  }

  /**
   * Get text content of an element
   */
  async getText(locator: Locator | string): Promise<string> {
    if (typeof locator === 'string') {
      return await this.page.textContent(locator) || '';
    } else {
      return await locator.textContent() || '';
    }
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(locator: Locator | string, timeout = 5000): Promise<void> {
    if (typeof locator === 'string') {
      await this.page.waitForSelector(locator, { timeout });
    } else {
      await locator.waitFor({ state: 'visible', timeout });
    }
  }

  /**
   * Check if an element is visible
   */
  async isVisible(locator: Locator | string): Promise<boolean> {
    if (typeof locator === 'string') {
      return await this.page.isVisible(locator);
    } else {
      return await locator.isVisible();
    }
  }

  /**
   * Press a key
   */
  async press(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
