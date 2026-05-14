import { test, expect } from '@playwright/test';
import { AddressQualificationPage } from '@pages/AddressQualificationPage';
import { SpeedSelectionPage } from '@pages/SpeedSelectionPage';
import { InstallationPage } from '@pages/InstallationPage';
import { OrderReviewPage } from '@pages/OrderReviewPage';
import { AccountPaymentPage } from '@pages/AccountPaymentPage';
import { PaymentPage } from '@pages/PaymentPage';
import { fiberTestData, generateUniqueFiberEmail, generateUniqueName } from '@utils/fiberTestData';

/**
 * Fiber Internet Buy Flow Tests
 * Complete end-to-end purchase flow for fiber internet service
 */
test.describe('Fiber Internet Buy Flow', () => {
  test('should complete full fiber internet purchase flow', async ({ page }) => {
    // Initialize page objects
    const addressPage = new AddressQualificationPage(page);
    const speedPage = new SpeedSelectionPage(page);
    const installationPage = new InstallationPage(page);
    const orderReviewPage = new OrderReviewPage(page);
    const accountPaymentPage = new AccountPaymentPage(page);
    const paymentPage = new PaymentPage(page);

    // Generate unique test data
    const uniqueEmail = generateUniqueFiberEmail();
    const uniqueFirstName = generateUniqueName('TestUser');
    const uniqueLastName = generateUniqueName('Auto');

    // Step 1: Navigate to storefront and address qualification
    await page.goto(fiberTestData.storefrontUrl);
    await addressPage.waitForPageLoad();

    if (await fiberTestData.unit=='') {

    // Verify address input is available
    expect(await addressPage.isAddressInputVisible()).toBeTruthy();

    // Step 2: Enter address and check availability
    await addressPage.enterAddressAndCheckAvailability(fiberTestData.testAddress);
    await page.waitForTimeout(20000); // Wait for page transition
    } else {
    
    // Verify address unit is available
    expect(await addressPage.isAddressInputVisible()).toBeTruthy();
    
    // Enter unit and check availability
    await addressPage.enterAddressUnitAndCheckAvailability(fiberTestData.testAddress, fiberTestData.unit);
    await page.waitForTimeout(20000); // Wait for page transition
    }

    // Step 3: Select speed plan
    expect(await speedPage.areSpeedTilesVisible()).toBeTruthy();
    await speedPage.selectSpeedPlan(fiberTestData.selectedSpeed);

    // Verify price
    const price = await speedPage.getSelectedPrice();
    expect(price).toBe(fiberTestData.expectedPrice);

    // Continue to installation
    await speedPage.continue();
    await page.waitForTimeout(20000); // Wait for page transition

    // Wait for page transition

    // Step 4: Installation date/time selection
    expect(await installationPage.isAppointmentVisible()).toBeTruthy();    
    await page.waitForTimeout(20000); // Wait for page transition

    // Verify SA date
    expect(await installationPage.isSaTimeVisible()).toBeTruthy();    
    

    // Enter contact information and agree to terms
    await installationPage.enterContactInfoAndAgree(uniqueEmail, fiberTestData.mobile);
    await page.waitForTimeout(5000); // Wait for page transition
    await installationPage.clickAgeCheckbox();
    await page.waitForTimeout(5000); // Wait for page transition
    expect(await installationPage.isContinueEnabled()).toBeTruthy();

    // Continue to order review
    await installationPage.continue();
    await page.waitForTimeout(20000); // Wait for page transition

    // Step 5: Order review
    expect(await orderReviewPage.doesOrderContainText(fiberTestData.selectedSpeed)).toBeTruthy();

    // Continue to account & payment
    await orderReviewPage.continue();

    // Step 6: Account & payment information
    await accountPaymentPage.enterAccountInfoAndAgree(uniqueFirstName, uniqueLastName);
    expect(await accountPaymentPage.isContinueEnabled()).toBeTruthy();

    // Continue to payment
    await accountPaymentPage.continue();
    //await page.waitForTimeout(10000);
    

    // Select credit card payment
    await paymentPage.selectCreditCard();
    await page.waitForTimeout(5000);

    // Agree to credit card terms
    await paymentPage.agreeToCreditCardTerms();
    await page.waitForTimeout(5000);
   

    // Fill credit card details
    await paymentPage.fillCreditCardDetails(
      fiberTestData.creditCardNumber,
      fiberTestData.CVV
    );
   await page.waitForTimeout(30000);

    // Verify successful completion
    expect(await paymentPage.isPaymentSuccessful()).toBeTruthy();
    const successMessage = await paymentPage.getSuccessMessage();
    expect(successMessage).toContain('Thanks for choosing Quantum Fiber');
  });

  test('should validate address qualification step', async ({ page }) => {
    const addressPage = new AddressQualificationPage(page);

    await page.goto(fiberTestData.storefrontUrl);
    await addressPage.waitForPageLoad();

    // Verify page elements
    expect(await addressPage.isAddressInputVisible()).toBeTruthy();
    expect(await addressPage.isCheckAvailabilityEnabled()).toBeFalsy(); // Should be disabled initially

    // Enter address
    await addressPage.fill('input[placeholder*="street address"]', fiberTestData.testAddress);
    expect(await addressPage.isCheckAvailabilityEnabled()).toBeTruthy();
  });

  test('should validate speed selection step', async ({ page }) => {
    const addressPage = new AddressQualificationPage(page);
    const speedPage = new SpeedSelectionPage(page);

    await page.goto(fiberTestData.storefrontUrl);
    await addressPage.waitForPageLoad();

    // Complete address step
    await addressPage.enterAddressAndCheckAvailability(fiberTestData.testAddress);

    // Verify speed selection page
    expect(await speedPage.areSpeedTilesVisible()).toBeTruthy();

    // Select speed and verify price display
    await speedPage.selectSpeedPlan(fiberTestData.selectedSpeed);
    const price = await speedPage.getSelectedPrice();
    expect(price).toBe(fiberTestData.expectedPrice);
  });

  test('should validate contact information step', async ({ page }) => {
    const addressPage = new AddressQualificationPage(page);
    const speedPage = new SpeedSelectionPage(page);
    const installationPage = new InstallationPage(page);

    await page.goto(fiberTestData.storefrontUrl);
    await addressPage.waitForPageLoad();

    // Complete previous steps
    await addressPage.enterAddressAndCheckAvailability(fiberTestData.testAddress);
    await speedPage.selectSpeedPlan(fiberTestData.selectedSpeed);
    await speedPage.continue();

    // Verify installation page
    expect(await installationPage.isAppointmentVisible()).toBeTruthy();

    // Test contact information entry
    const testEmail = generateUniqueFiberEmail();
    await installationPage.enterContactInfoAndAgree(testEmail, fiberTestData.mobile);
    expect(await installationPage.isContinueEnabled()).toBeTruthy();
  });
});
