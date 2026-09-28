import { test, expect, devices } from '@playwright/test';
import { pageUrl } from './helpers.mjs';

// Language by browser (owner 2026-09-26, site/entry.js): a German page with an English version
// opens the English one when the browser's first language is not German. A choice made with the
// language switch wins; search engines are not redirected. Pages open over file://.
const HUMAN = devices['Desktop Chrome'].userAgent;

async function visit(browser, name, { locale, userAgent = HUMAN } = {}) {
  const context = await browser.newContext({ locale, userAgent, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(pageUrl(name));
  await page.waitForLoadState('load');
  return { context, page };
}

for (const [locale, lang] of [['en-US', 'en'], ['fr-CH', 'en'], ['de-CH', 'de'], ['de', 'de']]) {
  test(`main CV: a ${locale} browser reads the ${lang === 'de' ? 'German' : 'English'} version`, async ({ browser }) => {
    const { context, page } = await visit(browser, 'cv', { locale });
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    if (lang === 'en') expect(page.url()).toMatch(/\/cv\/en\/index\.html$/);
    await context.close();
  });
}

test('a choice made with the language switch is remembered', async ({ browser }) => {
  const { context, page } = await visit(browser, 'cv', { locale: 'en-US' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('link', { name: 'Deutsch' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await page.goto(pageUrl('cv'));
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await context.close();
});

test('search engines are not redirected', async ({ browser }) => {
  const googlebot = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
  const { context, page } = await visit(browser, 'cv', { locale: 'en-US', userAgent: googlebot });
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await context.close();
});

test('role versions follow the browser; one-language pages stay', async ({ browser }) => {
  const { context, page } = await visit(browser, 'cv/ict-architect', { locale: 'en-US' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(page.url()).toMatch(/\/ict-architect\/en\/index\.html$/);
  for (const name of ['cv/globex-technology-strategy-manager', 'cv/beispiel-automobile/anschreiben', 'cv/coaching']) {
    await page.goto(pageUrl(name));
    await expect(page.locator('html'), name).toHaveAttribute('lang', 'de');
  }
  await context.close();
});
