import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { CV_EXTRA, pageUrl, horizontalOverflow } from './helpers.mjs';

// Phase A acceptance of the owner's brief (docs/brief.md, "Abnahme Phase A"), run in the
// projects "iPhone" (WebKit) and "Pixel" (Chromium mobile) of playwright.config.mjs. Visible
// heights: Playwright's iPhone profiles with the browser bars (320 px: iPhone SE, estimated).
const SCREENS = [
  { width: 320, height: 450 },
  { width: 375, height: 629 },
  { width: 390, height: 664 },
  { width: 430, height: 740 },
];
const CVS = ['cv', 'cv/en', ...CV_EXTRA.profile, ...CV_EXTRA.application];

async function open(page, name, screen) {
  await page.setViewportSize(screen);
  await page.goto(pageUrl(name));
  await page.evaluate(() => document.fonts.ready);
}

// Elements whose box ends within the first screen, before any scrolling.
function firstScreen(height) {
  const visible = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom <= height + 0.5 && getComputedStyle(el).visibility !== 'hidden';
  };
  const q = (s) => [...document.querySelectorAll(s)].find((el) => el.getBoundingClientRect().width > 0);
  return {
    name: visible(q('.site-header h1')),
    role: visible(q('.site-header .target-role')) || visible(q('.site-header .headline')),
    place: q('.site-header .location') ? visible(q('.site-header .location')) : true,
    pdf: visible(q('a[data-pdf]')),
    contact: visible(q('.site-header a[href^="mailto:"], .dossier-nav a[href="#contact"]')),
  };
}

test.describe.configure({ mode: 'parallel' });

for (const name of CVS) {
  for (const screen of SCREENS) {
    test(`${name}: phase A at ${screen.width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, name, screen);

      // No horizontal scrolling
      let o = await horizontalOverflow(page);
      expect(o.scrollWidth, `overflowing: ${o.offenders.join(', ')}`).toBeLessThanOrEqual(o.clientWidth);

      // Name 40 px (the clamp reaches 40.4 px at 430 px), at most two lines; nothing smaller than 16 px
      const name40 = await page.locator('.site-header h1').evaluate((el) => {
        const r = document.createRange();
        r.selectNodeContents(el);
        return { size: parseFloat(getComputedStyle(el).fontSize), lines: new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size };
      });
      expect(name40.size).toBeGreaterThanOrEqual(40);
      expect(name40.size).toBeLessThan(41);
      expect(name40.lines).toBeLessThanOrEqual(2);
      const small = await page.evaluate(() =>
        [...document.querySelectorAll('body *')]
          .filter((el) => el.getBoundingClientRect().width > 1 && [...el.childNodes].some((c) => c.nodeType === 3 && c.data.trim()))
          .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
          .map((el) => `${el.tagName.toLowerCase()}.${el.className}`),
      );
      expect(small).toEqual([]);

      // First screen: name, target role or headline, place, the way to PDF and contact
      expect(await page.evaluate(firstScreen, screen.height)).toEqual({ name: true, role: true, place: true, pdf: true, contact: true });

      // One structure in every entry (owner 2026-09-26, replaces "period on the organisation's
      // line"): the period on a line of its own under "organisation, place" (projects: under
      // their text), whole on one line. Dots and word of a level on one line.
      const periods = await page.locator('.entry-period, .project-period').evaluateAll((els) =>
        els.filter((el) => {
          const r = document.createRange();
          r.selectNodeContents(el);
          const lines = new Set([...r.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top))).size;
          const placed = el.classList.contains('project-period') || el.parentElement.classList.contains('entry-org');
          return !placed || getComputedStyle(el).display !== 'block' || lines !== 1;
        }).map((el) => el.textContent.trim()),
      );
      expect(periods).toEqual([]);

      // Rule 2 (design system, decision 1 of 2026-09-26): in an entry the size never grows,
      // title → "organisation, place" → period → text (21 → 18 → 17 → 17)
      const growing = await page.locator('main .entry-org:has(.entry-period)').evaluateAll((els) =>
        els.filter((org) => {
          const size = (el) => el && parseFloat(getComputedStyle(el).fontSize);
          const title = org.parentElement.querySelector(':scope > .entry-title, :scope > * > .entry-title');
          const text = org.nextElementSibling;
          const sizes = [size(title), size(org), size(org.querySelector('.entry-period')), size(text)].filter(Boolean);
          return sizes.some((s, i) => i && s > sizes[i - 1] + 0.01);
        }).map((org) => org.textContent.trim().slice(0, 40)),
      );
      expect(growing).toEqual([]);
      const split = await page.locator('main .skill-level').evaluateAll((els) =>
        els.filter((el) => {
          const dots = el.querySelector('.level-dots')?.getBoundingClientRect();
          const word = el.querySelector('.level-label')?.getBoundingClientRect();
          return dots && word && word.width > 0 && !(dots.top < word.bottom && word.top < dots.bottom);
        }).length,
      );
      expect(split).toBe(0);

      // Targets at least 44 × 44 px
      const tooSmall = await page.evaluate(() =>
        [...document.querySelectorAll('a[href], button')]
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ el, r }) => r.width > 1 && !el.classList.contains('skip-link') && (r.width < 44 || r.height < 44))
          .map(({ el }) => el.textContent.trim().slice(0, 30)),
      );
      expect(tooSmall).toEqual([]);

      // Portrait sharp and no larger than needed
      const portrait = await page.locator('.site-header .portrait').evaluate((img) => ({ w: img.getBoundingClientRect().width, natural: img.naturalWidth, dpr: devicePixelRatio }));
      expect(portrait.w).toBeLessThanOrEqual(88);
      expect(portrait.natural).toBeGreaterThanOrEqual(portrait.w * portrait.dpr);

      // Long German words hyphenate (hyphens: auto with lang)
      expect(await page.evaluate(() => {
        const s = getComputedStyle(document.body);
        return s.hyphens || s.webkitHyphens;
      })).toBe('auto');

      // A jump from the section navigation lands with the title visible and not covered
      const link = page.locator('.section-nav a').nth(1);
      const href = await link.getAttribute('href');
      await link.click();
      const jump = await page.evaluate((h) => {
        const t = document.querySelector(`${h}-title`);
        const b = t.getBoundingClientRect();
        const hit = document.elementFromPoint(Math.min(b.left + 10, innerWidth - 1), b.top + b.height / 2);
        return { visible: b.top >= 0 && b.bottom <= innerHeight, covered: !(hit && (hit === t || t.contains(hit))) };
      }, href);
      expect(jump).toEqual({ visible: true, covered: false });

      // 200 % zoom (decision B): twice the text size, and page zoom (half the CSS width)
      await page.goto(pageUrl(name));
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      o = await horizontalOverflow(page);
      expect(o.scrollWidth, `200 % text, overflowing: ${o.offenders.join(', ')}`).toBeLessThanOrEqual(o.clientWidth);
      await page.setViewportSize({ width: Math.floor(screen.width / 2), height: Math.floor(screen.height / 2) });
      await page.goto(pageUrl(name));
      o = await horizontalOverflow(page);
      expect(o.scrollWidth, `200 % page zoom, overflowing: ${o.offenders.join(', ')}`).toBeLessThanOrEqual(o.clientWidth);
    });
  }
}

// Contrast and WCAG A/AA rules, light and dark, at the narrowest and widest phone
for (const name of ['cv', CV_EXTRA.profile[0], CV_EXTRA.application[0]]) {
  for (const colorScheme of ['light', 'dark']) {
    for (const width of [320, 430]) {
      test(`${name}: axe on the phone, ${colorScheme}, ${width}px`, async ({ page }) => {
        await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
        await open(page, name, SCREENS.find((s) => s.width === width));
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
      });
    }
  }
}
