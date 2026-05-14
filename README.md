# Playwright Test Framework with Page Object Model

A comprehensive Playwright testing framework built with TypeScript using the Page Object Model (POM) design pattern.

## Project Structure

```
src/
├── pages/
│   ├── BasePage.ts                    # Base class for all page objects
│   ├── LoginPage.ts                   # Login page object
│   ├── DashboardPage.ts               # Dashboard page object
│   ├── AddressQualificationPage.ts    # Address qualification page
│   ├── SpeedSelectionPage.ts          # Speed plan selection page
│   ├── InstallationPage.ts            # Installation scheduling page
│   ├── OrderReviewPage.ts             # Order review page
│   ├── AccountPaymentPage.ts          # Account & payment page
│   └── PaymentPage.ts                 # Payment processing page
├── tests/
│   ├── auth.spec.ts                   # Authentication test cases
│   └── fiber-buyflow.spec.ts          # Fiber internet buy flow tests
└── utils/
    ├── testData.ts                    # General test data and utilities
    └── fiberTestData.ts               # Fiber buy flow specific data
```

## Features

- ✅ Page Object Model pattern for maintainable tests
- ✅ TypeScript support with strong typing
- ✅ Multiple browser support (Chromium, Firefox, WebKit)
- ✅ Mobile device testing
- ✅ Screenshots and video recording on failures
- ✅ HTML test reports
- ✅ Path aliases for cleaner imports
- ✅ Reusable utility functions

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

### Configuration

Update `playwright.config.ts` to set your base URL:

```typescript
use: {
  baseURL: 'https://your-app-url.com',
  ...
}
```

Update page locators in `src/pages/` to match your application's HTML selectors.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (with browser visible)
```bash
npm run test:headed
```

### Run tests in UI mode (interactive mode)
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests on specific browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### View test report
```bash
npm run test:report
```

### Generate test code (Codegen)
```bash
npm run codegen
```

## Example Test Flows

### Authentication Tests
- Login/logout functionality
- Invalid credential handling
- Remember me functionality

### Fiber Internet Buy Flow
Complete end-to-end purchase flow including:
- Address qualification and availability check
- Speed plan selection (Up to 500 Mbps)
- Installation date/time scheduling
- Contact information entry
- Order review and confirmation
- Account creation and payment setup
- Credit card payment processing

#### Fiber Buy Flow Test Commands
```bash
npm run test:fiber          # Run all fiber buy flow tests
npm run test:fiber:full     # Run complete end-to-end flow
npm run test:fiber:address  # Test address qualification only
npm run test:fiber:speed    # Test speed selection only
npm run test:fiber:contact  # Test contact information only
```

#### Fiber Buy Flow Page Objects
- `AddressQualificationPage` - Address entry and availability checking
- `SpeedSelectionPage` - Speed plan selection and pricing
- `InstallationPage` - Installation scheduling and contact info
- `OrderReviewPage` - Order review and confirmation
- `AccountPaymentPage` - Account creation and payment setup
- `PaymentPage` - Credit card payment processing

## Project Components

### BasePage
Base class that all page objects inherit from. Provides common methods:
- `goto()` - Navigate to URL
- `click()` - Click element
- `fill()` - Fill input field
- `getText()` - Get element text
- `waitForElement()` - Wait for element
- `isVisible()` - Check element visibility
- `takeScreenshot()` - Capture screenshot

### Page Objects
Each page object extends `BasePage` and defines:
- **Locators** - Element selectors as private properties
- **Methods** - Page-specific actions and assertions

Example:
```typescript
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly loginButton: Locator;

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.click(this.loginButton);
  }
}
```

### Test Cases
Tests use page objects for interactions:

```typescript
test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.navigateToLoginPage();
  await loginPage.login('user@example.com', 'password123');
  expect(await dashboardPage.isUserLoggedIn()).toBeTruthy();
});
```

## Best Practices

1. **Locator Strategy**
   - Use test IDs: `data-testid="element-id"`
   - Use semantic selectors: `role="button"`
   - Avoid CSS classes that frequently change

2. **Method Naming**
   - Action methods: `login()`, `fillForm()`
   - Getter methods: `getUsername()`, `getErrorMessage()`
   - Assertion methods: `isDisplayed()`, `isEnabled()`

3. **Wait Strategies**
   - Use `waitForElement()` for element visibility
   - Use `waitForPageLoad()` for network stability
   - Avoid hardcoded `sleep()` calls

4. **Test Organization**
   - Use `test.describe()` for test grouping
   - Use `test.beforeEach()` for common setup
   - Follow AAA pattern: Arrange, Act, Assert

## Example: Creating a New Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  private readonly productList: Locator;
  private readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productList = page.locator('[data-testid="product-list"]');
    this.addToCartButton = page.locator('[data-testid="add-to-cart"]');
  }

  async navigateToProducts(): Promise<void> {
    await this.goto('/products');
    await this.waitForPageLoad();
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.click(this.addToCartButton);
  }
}
```

## Troubleshooting

**Tests timing out:** Increase timeout in `playwright.config.ts`
**Locators not found:** Use Playwright Inspector to verify selectors
**Tests flaky:** Use `waitForElement()` instead of immediate assertions

## CI/CD Integration

The framework is ready for CI/CD integration. Set the `CI` environment variable:

```bash
CI=true npm test
```

This will:
- Run tests serially
- Set retries to 2
- Use minimal workers

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)

## License

MIT
