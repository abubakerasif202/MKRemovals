import { defineConfig, devices } from '@playwright/test';

/**
 * Production-build browser tests. They run against `vite preview` of the built `dist/`.
 * All /api/quote traffic is mocked inside the tests: no real enquiry is ever sent.
 *
 * Projects cover the three engines (Chromium, Firefox, WebKit/Safari) plus iPhone and Android emulation.
 *   npx playwright test --project=chromium --project=firefox --project=webkit
 *   npx playwright test --project=iphone --project=android --grep "quote|menu|inventory|hero|bright|dark panels|closing"
 * Set PW_CHANNEL=chrome to run the chromium projects on an installed Chrome instead of bundled Chromium.
 */
const channel = process.env.PW_CHANNEL || undefined;

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'iphone', use: { ...devices['iPhone 13'] } },
    { name: 'android', use: { ...devices['Pixel 7'], channel } },
  ],
  webServer: {
    command: 'npx vite preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
