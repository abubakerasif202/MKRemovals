import { defineConfig } from '@playwright/test';

/**
 * Production-build browser tests. They run against `vite preview` of the built `dist/`.
 * All /api/quote traffic is mocked inside the tests: no real enquiry is ever sent.
 * Set PW_CHANNEL=chrome to use an installed Chrome instead of Playwright's bundled Chromium.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    channel: process.env.PW_CHANNEL || undefined,
  },
  webServer: {
    command: 'npx vite preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
