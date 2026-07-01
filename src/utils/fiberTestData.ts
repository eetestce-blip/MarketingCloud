/**
 * Fiber Internet Buy Flow Test Data and Utilities
 */

import { getFiberTestCaseByScenario, getFiberTestCaseById, getFiberTestCases, type FiberTestCase } from './excelDataReader';
import { globalProperties } from '@config/globalProperties';

/**
 * Get test data by Test Case ID or scenario name
 * Priority: Environment variable TEST_CASE_ID > Fallback to first test case
 */
export function getFiberTestData(): FiberTestCase {
  const testCaseId = process.env.TEST_CASE_ID || process.env.FIBER_TEST_CASE_ID;
  const scenario = process.env.FIBER_SCENARIO;

  let excelData: FiberTestCase | undefined;

  // Priority: Test Case ID from environment variable
  if (testCaseId) {
    excelData = getFiberTestCaseById(testCaseId);
    if (!excelData) {
      throw new Error(
        `Test Case ID "${testCaseId}" not found in Excel file. ` +
        `Available Test Case IDs: ${getFiberTestCases().map(tc => tc.TestCaseId).join(', ')}`
      );
    }
  }
  // Fallback: Scenario name
  else if (scenario) {
    excelData = getFiberTestCaseByScenario(scenario);
    if (!excelData) {
      throw new Error(
        `Scenario "${scenario}" not found in Excel file. ` +
        `Available scenarios: ${getFiberTestCases().map(tc => tc.Scenario).join(', ')}`
      );
    }
  }
  // Fallback: First test case
  else {
    excelData = getFiberTestCases()[0];
  }

  // Merge Excel data with global properties to ensure URLs and credentials are always current
  return {
    ...excelData,
    StorefrontUrl: globalProperties.storefront.url,
    SalesforceUrl: globalProperties.salesforce.url,
    MailinatorUrl: globalProperties.mailinator.url,
    SalesforceUsername: globalProperties.salesforce.username,
    SalesforcePassword: globalProperties.salesforce.password,
    OTPSecret: globalProperties.salesforce.otpSecret,
  };
}

export const fiberTestData: FiberTestCase = getFiberTestData();

/**
 * Generate unique email for testing
 */
export function generateUniqueFiberEmail(): string {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  return `accelqauto+${timestamp}X@Mailinator.com`;
}

/**
 * Generate unique name for testing
 */
export function generateUniqueName(prefix: string): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return `${prefix}${random}`;
}
