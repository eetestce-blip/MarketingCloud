/**
 * Fiber Internet Buy Flow Test Data and Utilities
 */

export const fiberTestData = {
  // Address qualification
  testAddress: '5211 W 4TH AVE,LAKEWOOD,CO 80226,USA',
  unit: 'UNIT B',

  // Speed selection
  selectedSpeed: '500 mbps',
  expectedPrice: '50',

  // Contact information
  email: 'accelqauto+06052026195011X@Mailinator.com',
  mobile: '9633574116',

  // Account information
  firstName: 'KelseyAIXsJ',
  lastName: 'roDUONeelamDoNotUse',

  // Payment information
  creditCardNumber: '5454 5454 5454 5454',
  CVV: '234',

  // URLs
  storefrontUrl: 'https://storefront:QFCC2021@bgtm-035.dx.commercecloud.salesforce.com/on/demandware.store/Sites-QFCC-Site/default/AddressChecker-Show'
};

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
