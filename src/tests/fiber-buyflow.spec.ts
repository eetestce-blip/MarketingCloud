import { test, expect } from '@playwright/test';
import { request } from '@playwright/test';
import { AddressQualificationPage } from '@pages/AddressQualificationPage';
import { SalesforceLoginPage } from '@pages/SalesforceLoginPage';
import { SpeedSelectionPage } from '@pages/SpeedSelectionPage';
import { InstallationPage } from '@pages/InstallationPage';
import { OrderReviewPage } from '@pages/OrderReviewPage';
import { AccountPaymentPage } from '@pages/AccountPaymentPage';
import { PaymentPage } from '@pages/PaymentPage';

import { generateUniqueFiberEmail, generateUniqueName, fiberTestData } from '@utils/fiberTestData';



/**
 * Fiber Internet Buy Flow Tests
 * Complete end-to-end purchase flow for fiber internet service
 * 
 * Run with specific Test Case ID in PowerShell:
 *   $env:TEST_CASE_ID='TC-1'; npx playwright test src/tests/fiber-buyflow.spec.ts
 * 
 * Or run with scenario name (legacy):
 *   $env:FIBER_SCENARIO='default'; npx playwright test src/tests/fiber-buyflow.spec.ts
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
    const salesforceLoginPage = new SalesforceLoginPage(page);
    
    // Generate unique test data
    const uniqueEmail = generateUniqueFiberEmail();
    const uniqueFirstName = generateUniqueName('TestUser');
    const uniqueLastName = generateUniqueName('NeelamDoNotUse');
  
    // Step 1: Navigate to QFCC and address qualification
    const testData = {
      ...fiberTestData,
      email: uniqueEmail,
      firstName: uniqueFirstName,
      lastName: uniqueLastName,
    };

    console.log('Test Data (Test Case ID):', fiberTestData.TestCaseId);
    console.log('Test Data:', testData);
    
    await page.goto(testData.StorefrontUrl);
    await addressPage.waitForPageLoad();

    if (await testData.Unit === '') {

    // Verify address input is available
    expect(await addressPage.isAddressInputVisible()).toBeTruthy();

    // Step 2: Enter address and check availability
    await addressPage.enterAddressAndCheckAvailability(testData.TestAddress);
    await page.waitForURL(/.*smartNidSpeeds/); // Wait for URL to change to speed selection
    } else {
    
    // Verify address unit is available
    expect(await addressPage.isAddressInputVisible()).toBeTruthy();
    
    // Enter unit and check availability
    await addressPage.enterAddressUnitAndCheckAvailability(testData.TestAddress, testData.Unit);
    await page.waitForURL(/.*smartNidSpeeds/); // Wait for URL to change to speed selection
    }

    // Step 3: Select speed plan
    expect(await speedPage.areSpeedTilesVisible()).toBeTruthy();
    await speedPage.selectSpeedPlan(testData.SelectedSpeed);

    // Verify price
    const price = await speedPage.getSelectedPrice();
    expect(price).toBe(testData.ExpectedPrice);

    // Continue to installation
    await speedPage.continue();
     await page.waitForURL(/.*install/); // Wait for URL to change to speed selection

    // Wait for page transition

    // Step 4: Installation date/time selection
    expect(await installationPage.isAppointmentVisible()).toBeTruthy();    
    await page.waitForSelector('span#select2-timeSlot-container', { state: 'visible', timeout: 10000 }); // Wait for SA time to be visible

    // Verify SA date
    expect(await installationPage.isSaTimeVisible()).toBeTruthy();    
    

    // Enter contact information and agree to terms
    await installationPage.enterContactInfoAndAgree(uniqueEmail, testData.MobileNo);
    await page.waitForTimeout(5000);
    await installationPage.clickAgeCheckbox();
    await page.waitForTimeout(5000);
    expect(await installationPage.isContinueEnabled()).toBeTruthy();

    // Continue to order review
    await installationPage.continue();
    await page.waitForURL(/.*review/); // Wait for URL to change to order review

    // Step 5: Order review
    expect(await orderReviewPage.doesOrderContainText(testData.SelectedSpeed)).toBeTruthy();

    // Continue to account & payment
    await orderReviewPage.continue();
    await page.waitForURL(/.*submit/); // Wait for URL to change to payment

    // Step 6: Account & payment information
    await accountPaymentPage.enterAccountInfoAndAgree(testData.FirstName, testData.LastName);
    expect(await accountPaymentPage.isContinueEnabled()).toBeTruthy();

    // Continue to payment
    await accountPaymentPage.continue();
    await page.waitForSelector('text=Account & Payment Information', { state: 'visible', timeout: 20000 }); // Wait for processing message

    // Select credit card payment
    await page.waitForTimeout(5000);
    await paymentPage.selectCreditCard();
    await page.waitForTimeout(5000);

    // Agree to credit card terms
    await paymentPage.agreeToCreditCardTerms();
    await page.waitForTimeout(5000);
   

    // Fill credit card details
    await paymentPage.fillCreditCardDetails(
      testData.CreditCardNumber,
      testData.CVV
    );
   await page.waitForSelector('text=Thanks for choosing Quantum Fiber', { state: 'visible', timeout: 20000 }); // Wait for processing message

    // Verify successful completion
    expect(await paymentPage.isPaymentSuccessful()).toBeTruthy();
    const successMessage = await paymentPage.getSuccessMessage();
    expect(successMessage).toContain('Thanks for choosing Quantum Fiber');


   // Validate Salesforce record creation after buy flow completion
          await salesforceLoginPage.goto(testData.SalesforceUrl);
          await page.waitForURL(/.*lightning/); // Wait for URL to indicate Salesforce has loaded
          console.log('✅ SalesforceLogin complete');   

          const cookies = await page.context().cookies();
          const sid = cookies.find(c => c.name === 'sid');
          console.log('Session ID:', sid?.value);

    
          // SOQL Query to verify account creation in Salesforce          
      
              const apiContext = await request.newContext({
                baseURL: 'https://ctl-fiber--test3.sandbox.my.salesforce.com',
                extraHTTPHeaders: {
                  Authorization: `Bearer ${sid?.value}`  // 
                },
                ignoreHTTPSErrors: true
              });
              
              let resultBody;
              let attempts = 0;
              const maxAttempts = 18; // prevent infinite loop
              const delayMs = 3000;   // wait 3 sec between retries

              while (attempts < maxAttempts) {
                const query = encodeURIComponent(
                  `SELECT Id, AccountName__c, SmartNID_Enabled__c, AccountStatus__c,
                          Primary_Contact_Username__c, Service_Address__c,
                          Primary_Contact_SMS_Number__c, FirstName__c, LastName__c,
                          Next_Renewal_Date__c
                  FROM Account
                  WHERE Email__c = '${uniqueEmail}'`
                );

                const response = await apiContext.get(
                  `/services/data/v54.0/query?q=${query}`
                );

                resultBody = await response.json();

                console.log(`query ${query} , Attempt ${attempts + 1}, records found:`, resultBody.records?.length || 0);

                // ✅ Exit loop if records found
                if (resultBody.records && resultBody.records.length > 0) {
                  break;
                }

                // ⏳ Wait before retry
                await new Promise(resolve => setTimeout(resolve, delayMs));

                attempts++;
              }

              // ✅ After loop
              if (!resultBody.records || resultBody.records.length === 0) {
                throw new Error('No records found after retries');
              }

              else {
              console.log('✅ Account Id:', resultBody.records[0].Id); 
              console.log('✅ Account Name:', resultBody.records[0].AccountName__c); 
              console.log('✅ Account Status:', resultBody.records[0].AccountStatus__c); 
              console.log('✅ Primary Contact Username:', resultBody.records[0].Primary_Contact_Username__c); 
              console.log('✅ Service Address:', resultBody.records[0].Service_Address__c); 
              console.log('✅ Primary Contact SMS Number:', resultBody.records[0].Primary_Contact_SMS_Number__c);               
              console.log('✅ First Name:', resultBody.records[0].FirstName__c); 
              console.log('✅ Last Name:', resultBody.records[0].LastName__c);   
              console.log('✅ Next Renewal Date:', resultBody.records[0].Next_Renewal_Date__c);             
         
              // Log the records returned by the query              
                await page.goto(`${testData.SalesforceUrl}/lightning/r/Account/${resultBody.records[0].Id}/view`);
               

                // ✅ Verify page loaded
                await page.getByRole('tab', { name: resultBody.records[0].AccountName__c }).waitFor({ state: 'visible', timeout: 10000 });

                // Validate Marketing Cloud API integration by checking for triggered events after buy flow completion
              await page.goto(testData.MailinatorUrl);
              console.log('✅ Navigated to Mailinator complete');       
              // Check for email in Mailinator
              await page.fill('#search', uniqueEmail);
              await page.getByRole('button', { name: 'GO' }).click();
              await page.getByText('Your Quantum Fiber order confirmation').waitFor({ state: 'detached', timeout: 60000 }); // Wait for email to arrive
              console.log('✅ Order confirmation email received in Mailinator');
              }
            
  });
  

 });



