

import { test } from '@playwright/test';
import { fiberTestData } from '@utils/fiberTestData';

test.use({ storageState: undefined }); // ✅ disables storage for this file

test('Authenticate Salesforce', async ({ page }) => {
  await page.goto(fiberTestData.SalesforceUrl);

  console.log('👉 Login manually (with OTP once)');
  console.log('📝 Using Test Case ID:', fiberTestData.TestCaseId);

  await page.waitForURL('**/lightning/**', { timeout: 120000 });

  await page.context().storageState({
    path: 'sf-profile/auth.json',
  });
});
