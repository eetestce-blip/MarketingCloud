/**
 * Global Configuration Properties
 * Centralized URLs, credentials, and environment-specific settings
 */

export const globalProperties = {
  // Salesforce Configuration
  salesforce: {
    url: process.env.SALESFORCE_URL || 'https://ctl-fiber--test3.sandbox.lightning.force.com/',
    apiUrl: process.env.SALESFORCE_API_URL || 'https://ctl-fiber--test3.sandbox.my.salesforce.com',
    username: process.env.SALESFORCE_USERNAME || 'qfaccelq@quantumfiber.com.test2',
    password: process.env.SALESFORCE_PASSWORD || 'Ff37@2026',
    otpSecret: process.env.SALESFORCE_OTP_SECRET || 'UZ0RY5ZtXJjU7/ra8q3DYPt1W36FoY6L53z8PRJHOAIIlBT1yXv1MvyQ9wUqMMZv',
    apiVersion: 'v54.0',
  },

  // QFCC Configuration
  storefront: {
    url: process.env.STOREFRONT_URL || 'https://storefront:QFCC2021@bgtm-035.dx.commercecloud.salesforce.com/on/demandware.store/Sites-QFCC-Site/default/AddressChecker-Show',
  },

  // Mailinator Configuration
  mailinator: {
    url: process.env.MAILINATOR_URL || 'https://www.mailinator.com/',
  },

  // Test Environment Configuration
  environment: {
    headless: process.env.HEADLESS === 'true',
    timeout: parseInt(process.env.TEST_TIMEOUT || '500000', 10),
    retries: parseInt(process.env.TEST_RETRIES || '0', 10),
  },

  // Browser Configuration
  browser: {
    viewport: {
      width: 1920,
      height: 1080,
    },
    navigationTimeout: 120000,
    actionTimeout: 60000,
  },

  // Playwright Reporter Configuration
  reporter: {
    outputPath: process.env.REPORT_PATH || 'playwright-report/',
  },
};

/**
 * Get Salesforce API context configuration
 */
export function getSalesforceApiConfig(sessionId: string) {
  return {
    baseURL: globalProperties.salesforce.apiUrl,
    extraHTTPHeaders: {
      Authorization: `Bearer ${sessionId}`,
    },
    ignoreHTTPSErrors: true,
  };
}

/**
 * Get Salesforce SOQL query endpoint
 */
export function getSalesforceQueryEndpoint(): string {
  return `/services/data/${globalProperties.salesforce.apiVersion}/query`;
}
