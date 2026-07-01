import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 500000, // 2 minutes for test timeout
  expect: {
    timeout: 60000, // 30 seconds for expect assertions
  },
  use: {
    baseURL: 'https://ctl-fiber--test2.sandbox.my.salesforce.com',
    storageState: 'sf-profile/auth.json', // ✅ reuse session
    headless: false, // Run in headed mode for better visibility during development
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1920, height: 1080 }, // Full HD resolution to fit most screens
    navigationTimeout: 120000, // 2 minutes for page navigation
    actionTimeout: 60000, // 30 seconds for actions
  },
     
  projects: [

    
    {
      name: 'setup',
      testMatch: /auth\.setup\.spec\.ts/,
    },
    {
      name: 'tests',
      testIgnore: /auth\.setup\.spec\.ts/,
      use: {
        storageState: 'sf-profile/auth.json', // ✅ only applied to real tests
      },
      dependencies: ['setup'], // ✅ runs setup first
    },
  

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
 
});
