import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Speed Selection Page Object
 * Handles speed plan selection
 */
export class SpeedSelectionPage extends BasePage {
  // Locators
  private readonly speedTiles: Locator;
  private readonly continueButton: Locator;
  private readonly priceDisplay: Locator;

  constructor(page: Page) {
    super(page);
    this.speedTiles = page.locator('[data-pname*="Fiber Internet"]');
    this.continueButton = page.locator('[id*="plp__continue"]'); ;
    this.priceDisplay = page.locator('[class*="qf-tile__price-amount"]' , { hasText: "50" });
  }

  /**
   * Select speed plan by text
   */
  async selectSpeedPlan(speedText: string): Promise<void> {
    const speedTile = this.speedTiles.filter({ hasText: speedText }).first();
    await this.click(speedTile);
  }

  /**
   * Get price for selected plan
   */
  async getSelectedPrice(): Promise<string> {
    return await this.getText(this.priceDisplay);
  }

  /**
   * Continue to next step
   */
  async continue(): Promise<void> {
    await this.click(this.continueButton);
    await this.waitForPageLoad();
  }

  /**
   * Check if speed tiles are visible
   */
  async areSpeedTilesVisible(): Promise<boolean> {
    return await this.isVisible(this.speedTiles.first());
  }
}
