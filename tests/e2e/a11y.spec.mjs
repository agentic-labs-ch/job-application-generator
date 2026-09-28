import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { WIDTHS, EXTRA_PAGES, EXAMPLE_EXTRA, CV_EXTRA, pageUrl } from './helpers.mjs';

// Role versions, letters and text pages: axe at the narrowest and widest width.
for (const name of ['example', 'cv', 'cv/en', ...EXTRA_PAGES]) {
for (const colorScheme of ['light', 'dark']) {
  for (const width of EXTRA_PAGES.includes(name) ? [375, 1440] : WIDTHS) {
    test(`${name}: axe (WCAG 2 A/AA incl. contrast), ${colorScheme}, ${width}px`, async ({ page }) => {
      // axe checks the rest state: the entry moment (opacity/clip-path) is off under reduced
      // motion, so header text is not measured mid-fade.
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pageUrl(name));
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      const summary = results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`);
      expect(summary).toEqual([]);
    });
  }
}
}

const KEYBOARD_PAGES = [
  'example',
  'cv',
  ...[EXAMPLE_EXTRA, CV_EXTRA].flatMap((p) => [p.profile[0], p.letter[0], p.article[0], p.application[0]]),
].filter(Boolean);

for (const name of KEYBOARD_PAGES) {
test(`${name}: keyboard: skip link first, every link reachable with visible focus`, async ({ page }) => {
  // Reduced motion so focus scrolling is instant and positions can be measured directly.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(pageUrl(name));

  // Every rendered link (on phones the application bar leaves out the document being read)
  const expected = await page.evaluate(() => [...document.querySelectorAll('a[href]')].filter((el) => el.getClientRects().length).length);
  const visited = [];
  for (let i = 0; i < expected; i += 1) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        text: el.textContent.trim(),
        href: el.getAttribute('href'),
        // Position among all links: two links may share an href (e.g. name and "main CV").
        index: [...document.querySelectorAll('a[href]')].indexOf(el),
        outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2,
        inViewport: r.bottom > 0 && r.top < window.innerHeight && r.width > 0,
      };
    });
    expect(info.outline, `visible focus on "${info.text}"`).toBe(true);
    expect(info.inViewport, `"${info.text}" scrolled into view`).toBe(true);
    visited.push(info);
  }
  expect(visited[0].href).toBe('#main');
  expect(new Set(visited.map((v) => v.index)).size).toBe(expected);

  // Activating the skip link moves focus to main content.
  await page.reload();
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});
}

test('prefers-reduced-motion disables transitions and smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(pageUrl('example'));
  const motion = await page.evaluate(() => ({
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
    durations: [...document.querySelectorAll('*')]
      .flatMap((el) => {
        const s = getComputedStyle(el);
        return [...s.transitionDuration.split(','), ...s.animationDuration.split(',')];
      })
      .map((d) => parseFloat(d))
      .filter((d) => d > 0),
  }));
  expect(motion.scroll).toBe('auto');
  expect(motion.durations).toEqual([]);
});

test('without reduced-motion preference, transitions are enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(pageUrl('example'));
  const scroll = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  const duration = await page.locator('.button').first().evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(scroll).toBe('smooth');
  expect(duration).not.toBe('0s');
});
