# Playwright POM Framework - Development Instructions

## Project Overview

This is a Playwright test automation framework with TypeScript and Page Object Model pattern. The framework is designed for maintainability, scalability, and ease of use.

## Development Workflow

### Adding New Tests

1. Create a new test file in `src/tests/` directory
2. Import necessary page objects
3. Use page object methods for interactions
4. Follow the AAA pattern (Arrange, Act, Assert)

### Creating New Page Objects

1. Create a new file in `src/pages/` directory
2. Extend `BasePage` class
3. Define locators as private Locator properties
4. Implement page-specific methods
5. Add JSDoc comments for clarity

### Key Directories

- `src/pages/` - Page Object classes (BasePage, LoginPage, DashboardPage, Fiber Buy Flow pages)
- `src/tests/` - Test specifications (auth.spec.ts, fiber-buyflow.spec.ts)
- `src/utils/` - Shared utilities and test data (testData.ts, fiberTestData.ts)
- `playwright-report/` - Generated test reports
- `test-results/` - Test execution results

## Commands

- `npm install` - Install dependencies
- `npm test` - Run all tests
- `npm run test:headed` - Run tests with visible browser
- `npm run test:ui` - Interactive test mode
- `npm run test:debug` - Debug mode with inspector
- `npm run test:report` - View HTML report
- `npm run codegen` - Generate test code

## Configuration Files

- `playwright.config.ts` - Playwright configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts

## Best Practices

- Keep locators in page objects, not in tests
- Use page object methods for interactions
- Add meaningful assertions
- Use data-testid attributes when possible
- Wait for elements explicitly
- Group related tests with describe blocks

## Extending the Framework

To add new features:

1. Update `BasePage` for common functionality
2. Create new page objects as needed
3. Add utilities to `src/utils/`
4. Update configuration files if needed
5. Run tests to verify changes
