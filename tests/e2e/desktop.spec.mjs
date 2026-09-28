import { test, expect } from '@playwright/test';
import { pageUrl, CV_EXTRA, EXAMPLE_EXTRA } from './helpers.mjs';

const CV_PAGES = ['example', 'cv', EXAMPLE_EXTRA.profile[0], CV_EXTRA.profile[0], EXAMPLE_EXTRA.application[0], CV_EXTRA.application[0]].filter(Boolean);
const APPLICATION_PAGES = [EXAMPLE_EXTRA.application[0], CV_EXTRA.application[0]].filter(Boolean);
const ROLE_PAGES = [EXAMPLE_EXTRA.profile[0], CV_EXTRA.profile[0]].filter(Boolean);

async function settle(page) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

// Desktop (from 1024 px): wide page, dates beside the timeline entries, sticky section nav.
for (const name of CV_PAGES) {
  test(`${name}: desktop layout uses the width at 1440px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(pageUrl(name));
    const main = await page.locator('main').boundingBox();
    expect(main.width).toBeGreaterThan(1000);
    const item = page.locator('.timeline-item').first();
    const when = await item.locator('.timeline-when').boundingBox();
    const title = await item.locator('.entry-title').boundingBox();
    expect(when.x + when.width).toBeLessThanOrEqual(title.x);
    expect(Math.abs(when.y - title.y)).toBeLessThan(title.height);
    expect(when.width).toBeLessThanOrEqual(176); // --date-column: 11rem
    // One structure in every entry (owner 2026-09-26): role, "organisation, place", then the
    // exact period on a line of its own (rule 2: the date never precedes the role).
    const org = await item.locator('.entry-org').boundingBox();
    const period = await item.locator('.entry-period').boundingBox();
    expect(org.y).toBeGreaterThan(title.y);
    expect(period.y).toBeGreaterThan(org.y + 1);
    expect(period.y + period.height).toBeLessThanOrEqual(org.y + org.height + 1);
    expect(period.height).toBeLessThan(30);
  });

  test(`${name}: mobile keeps one column at 375px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(pageUrl(name));
    const item = page.locator('.timeline-item').first();
    const when = await item.locator('.timeline-when').boundingBox();
    const title = await item.locator('.entry-title').boundingBox();
    expect(when.y + when.height).toBeLessThanOrEqual(title.y + 1);
  });
}

for (const name of ROLE_PAGES) {
  test(`${name}: desktop shows the three USP statements in one row`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(pageUrl(name));
    const tops = await page.locator('.usp-list > li').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(tops).toHaveLength(3);
    expect(new Set(tops).size).toBe(1);
  });

  test(`${name}: competency board has a row per category and stacks on mobile`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(pageUrl(name));
    const rows = page.locator('.skill-board tbody tr');
    expect(await rows.count()).toBeGreaterThan(1);
    const cells = await rows.first().locator('th, td').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(cells).size).toBe(1); // one table row
    expect(await page.locator('.top-skill').count()).toBeLessThanOrEqual(10);
    await page.setViewportSize({ width: 375, height: 800 });
    const stacked = await rows.first().locator('th, td:not(.is-empty)').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(stacked).size).toBe(stacked.length); // one below the other
  });
}

// Applications: the three key strengths in one row on desktop, stacked on mobile; the page
// wears the company's paper colour; contact details close the CV instead of opening it.
for (const name of APPLICATION_PAGES) {
  test(`${name}: key strengths in a row at 1440px, stacked at 375px; contact at the end`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(pageUrl(name));
    const tops = await page.locator('.strength').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(tops).toHaveLength(3);
    expect(new Set(tops).size).toBe(1);
    const paper = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim());
    const body = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(paper.slice(i, i + 2), 16));
    expect(body).toBe(`rgb(${r}, ${g}, ${b})`);
    await expect(page.locator('.site-header a[href^="mailto:"]')).toHaveCount(0);
    const contact = await page.locator('#contact').boundingBox();
    const experience = await page.locator('#experience').boundingBox();
    const letter = await page.locator('#motivation').boundingBox();
    expect(experience.y).toBeLessThan(contact.y);
    expect(contact.y).toBeLessThan(letter.y);
    await page.setViewportSize({ width: 375, height: 800 });
    const stacked = await page.locator('.strength').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(stacked).size).toBe(3);
  });
}

test('cv: section navigation stays on top at 1440px and anchors land below it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(pageUrl('cv'));
  await page.locator('.section-nav a[href="#experience"]').click();
  await settle(page);
  const nav = await page.locator('.section-nav').boundingBox();
  const heading = await page.locator('#experience-title').boundingBox();
  expect(nav.y).toBeLessThanOrEqual(1);
  expect(heading.y).toBeGreaterThanOrEqual(nav.y + nav.height);
});

test('cv: section navigation scrolls away on mobile (not sticky)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(pageUrl('cv'));
  await page.evaluate(() => window.scrollTo({ top: 2000, behavior: 'instant' }));
  await settle(page);
  const nav = await page.locator('.section-nav').boundingBox();
  expect(nav.y + nav.height).toBeLessThan(0);
});

// Entry moment (site/entry.js, DESIGN.md "Motion"): only the header animates, once per browser.
// Elements that run a CSS animation right now (computed, so independent of timing).
async function animated(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter((el) => getComputedStyle(el).animationName !== 'none')
      .map((el) => ({ header: el.closest('.site-header') !== null, name: getComputedStyle(el).animationName })),
  );
}

for (const name of [...CV_PAGES, CV_EXTRA.letter[0], CV_EXTRA.article[0]].filter(Boolean)) {
  test(`${name}: the header enters on the first page of a visit, nothing else animates`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(pageUrl(name));
    expect(await page.evaluate(() => document.documentElement.hasAttribute('data-entry'))).toBe(true);
    // The moment never changes the layout: the page keeps its normal flow and full width.
    expect(await page.evaluate(() => [getComputedStyle(document.documentElement).display, document.body.getBoundingClientRect().x])).toEqual(['block', 0]);
    const moving = await animated(page);
    expect(moving.some((m) => m.name === 'entry-fade')).toBe(true); // the header fades in
    expect(moving.every((m) => m.header)).toBe(true);
    // At rest afterwards: no clip, full opacity.
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    expect(await page.locator('.site-header h1').evaluate((el) => getComputedStyle(el).clipPath)).toBe('none');
    expect(await page.locator('.site-header h1').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
    // Later pages and visits start at rest.
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.hasAttribute('data-entry'))).toBe(false);
    expect(await animated(page)).toEqual([]);
  });
}

test('entry moment is off with reduced motion and in print', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(pageUrl('cv'));
  expect(await animated(page)).toEqual([]);
  await page.evaluate(() => localStorage.clear());
  await page.emulateMedia({ reducedMotion: 'no-preference', media: 'print' });
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.hasAttribute('data-entry'))).toBe(true);
  expect(await animated(page)).toEqual([]);
});
