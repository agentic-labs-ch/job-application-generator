import { test, expect } from '@playwright/test';
import { WIDTHS, PAGES, EXTRA_PAGES, LETTERS, APPLICATIONS, EXAMPLE_EXTRA, CV_EXTRA, pageUrl, horizontalOverflow } from './helpers.mjs';

for (const fixture of [...PAGES, ...EXTRA_PAGES]) {
  for (const width of WIDTHS) {
    test(`${fixture}: no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pageUrl(fixture));
      const o = await horizontalOverflow(page);
      expect(o.scrollWidth, `overflowing: ${o.offenders.join(', ')}`).toBeLessThanOrEqual(o.clientWidth);
      expect(o.offenders).toEqual([]);
    });
  }
}

// The language switch never covers the header: on phones it shares the portrait's row, from
// 768 px (and without a portrait) it has a row of its own.
for (const fixture of ['cv', 'cv/en', ...CV_EXTRA.profile]) {
  for (const width of [320, ...WIDTHS, 1024]) {
    test(`${fixture}: language switch clear of the header at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pageUrl(fixture));
      const covered = await page.evaluate(() => {
        const s = document.querySelector('.site-header .lang-switch a')?.getBoundingClientRect();
        if (!s) return [];
        const boxes = (el) => {
          if (el.tagName === 'IMG') return [el.getBoundingClientRect()];
          const range = document.createRange();
          range.selectNodeContents(el);
          return [...range.getClientRects()];
        };
        return [...document.querySelectorAll('.site-header .header-text > *, .site-header .portrait')]
          .filter((el) => boxes(el).some((b) => b.width > 0 && b.left < s.right && s.left < b.right && b.top < s.bottom && s.top < b.bottom))
          .map((el) => `${el.tagName.toLowerCase()}.${el.className}`);
      });
      expect(covered).toEqual([]);
    });
  }
}

// 200 % zoom is emulated by halving the CSS viewport (1280 px → 640 px, 750 px → 375 px ×2
// is covered above). 320 px corresponds to WCAG reflow (1280 px at 400 %).
for (const [label, width] of [['200% of 1280px', 640], ['200% of 750px', 375], ['reflow 320px', 320]]) {
  for (const fixture of [...PAGES, ...EXTRA_PAGES]) {
    test(`${fixture}: zoom ${label} keeps content in viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(pageUrl(fixture));
      const o = await horizontalOverflow(page);
      expect(o.scrollWidth, `overflowing: ${o.offenders.join(', ')}`).toBeLessThanOrEqual(o.clientWidth);
      await expect(page.locator('h1')).toBeVisible();
    });
  }
}

test('real browser zoom (deviceScaleFactor 2) at 375px keeps layout', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 800 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(pageUrl('example'));
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const o = await horizontalOverflow(page);
  expect(o.scrollWidth, `overflowing: ${o.offenders.join(', ')}`).toBeLessThanOrEqual(o.clientWidth);
  await context.close();
});

for (const width of WIDTHS) {
  for (const name of ['example', 'cv', ...EXTRA_PAGES.filter(() => width !== 768)]) {
  test(`${name}: body text is at least 16px at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(pageUrl(name));
    const sizes = await page.evaluate(() =>
      [...document.querySelectorAll('body, p, li, a, span, time')].map((el) => ({
        tag: el.tagName.toLowerCase(),
        size: parseFloat(getComputedStyle(el).fontSize),
      })),
    );
    const small = sizes.filter((s) => s.size < 16);
    expect(small).toEqual([]);
  });

  test(`${name}: touch targets are at least 44x44px at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(pageUrl(name));
    // Skip link is only visible on focus; measure it focused.
    await page.keyboard.press('Tab');
    // Links not rendered at this width are no targets (on phones the application bar leaves out
    // the document being read).
    const targets = await page.evaluate(() =>
      [...document.querySelectorAll('a[href], button, input, select, textarea')].filter((el) => el.getClientRects().length).map((el) => {
        const r = el.getBoundingClientRect();
        return { text: el.textContent.trim().slice(0, 40), w: r.width, h: r.height };
      }),
    );
    expect(targets.length).toBeGreaterThan(0);
    const tooSmall = targets.filter((t) => t.w < 44 || t.h < 44);
    expect(tooSmall).toEqual([]);
  });
  }
}

test('language switch navigates between DE and EN pages', async ({ page }) => {
  await page.goto(pageUrl('cv'));
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h2#experience-title')).toHaveText('Experience');
  await page.getByRole('link', { name: 'Deutsch' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('h2#experience-title')).toHaveText('Berufserfahrung');
});

test('line length stays readable on wide screens', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(pageUrl('example'));
  const width = await page.locator('.summary').evaluate((el) => el.getBoundingClientRect().width);
  const fontSize = await page.locator('.summary').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  // Roughly 0.5em per character for system sans-serif fonts: stay under ~90 characters.
  expect(width / (fontSize * 0.5)).toBeLessThan(90 * 1.05);
});

// Print: a cover letter fits on one A4 page; role versions stay a short dossier.
for (const name of LETTERS) {
  test(`${name}: prints on one A4 page`, async ({ page }) => {
    await page.goto(pageUrl(name));
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
    expect(pages).toBe(1);
  });
}

// Role versions print with the sidebar (DESIGN.md, "Print"): the sidebar copy exists for paper
// only and sits left of the main column; the screen-only competency profile is not printed.
for (const name of [...EXAMPLE_EXTRA.profile, ...CV_EXTRA.profile]) {
  test(`${name}: prints with the sidebar that the screen hides`, async ({ page }) => {
    await page.goto(pageUrl(name));
    await expect(page.locator('.print-side')).toBeHidden();
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.print-side')).toBeVisible();
    await expect(page.locator('#skills')).toBeHidden();
    const side = await page.locator('.print-side').boundingBox();
    const main = await page.locator('main').boundingBox();
    expect(side.x + side.width).toBeLessThanOrEqual(main.x + 1);
  });
}

for (const name of EXTRA_PAGES.filter((p) => !LETTERS.includes(p))) {
  test(`${name}: prints on at most four A4 pages without navigation`, async ({ page }) => {
    await page.goto(pageUrl(name));
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.section-nav')).toBeHidden();
    await expect(page.locator('.skip-link')).toBeHidden();
    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
    expect(pages).toBeLessThanOrEqual(4);
  });
}

// Applications print as one document in the company's colours: the CV first, then the
// motivation letter on its own sheet (docs/applications.md).
for (const name of APPLICATIONS) {
  test(`${name}: prints the letter on its own sheet after the CV`, async ({ page }) => {
    await page.goto(pageUrl(name));
    await page.emulateMedia({ media: 'print' });
    expect(await page.locator('#motivation').evaluate((el) => getComputedStyle(el).breakBefore)).toBe('page');
    await expect(page.locator('.dossier-nav')).toBeHidden();
    const paper = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim());
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(paper.slice(i, i + 2), 16));
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(`rgb(${r}, ${g}, ${b})`);
  });
}
