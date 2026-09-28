import { defineConfig, devices } from '@playwright/test';

// The owner's audience reads German first; the language redirect has its own tests.
const locale = 'de-CH';
// Phase A acceptance on the phone (docs/brief.md): Safari's engine and Chrome on Android. The
// language redirect runs in all three browsers.
const phone = /mobile\.spec\.mjs/;
const phoneAndLanguage = /(mobile|language)\.spec\.mjs/;

export default defineConfig({
  testDir: 'tests/e2e',
  globalSetup: './tests/e2e/global-setup.mjs',
  outputDir: 'test-results',
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', testIgnore: phone, use: { ...devices['Desktop Chrome'], locale } },
    { name: 'iPhone', testMatch: phoneAndLanguage, use: { ...devices['iPhone 13'], locale } },
    { name: 'Pixel', testMatch: phoneAndLanguage, use: { ...devices['Pixel 7'], locale } },
  ],
});
