#!/usr/bin/env node
// Usage: node scripts/screenshot.mjs --site <built dir> --out <dir> [--page <path>]...
// Full-page screenshots for review without a local web server: 375, 768 and 1440 px (light),
// 390 px (light and dark, the design hand-off width) and 1440 px (dark). `--page` selects
// pages by path relative to the site (default: index.html).

import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';

const { values } = parseArgs({
  options: { site: { type: 'string' }, out: { type: 'string' }, page: { type: 'string', multiple: true } },
});
if (!values.site || !values.out) {
  console.error('Usage: node scripts/screenshot.mjs --site <built dir> --out <dir> [--page <path>]...');
  process.exit(2);
}

const pages = values.page ?? ['index.html'];
await mkdir(values.out, { recursive: true });
const browser = await chromium.launch();
const shots = [
  [375, 'light'],
  [390, 'light'],
  [390, 'dark'],
  [768, 'light'],
  [1440, 'light'],
  [1440, 'dark'],
];
for (const path of pages) {
  const url = pathToFileURL(resolve(values.site, path)).href;
  const name = path.replace(/\/?index\.html$/, '').replaceAll('/', '-') || 'cv';
  for (const [width, colorScheme] of shots) {
    // Reduced motion: captures show the rest state (the entry moment would catch the header
    // mid-fade).
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme, reducedMotion: 'reduce' });
    await page.goto(url);
    const file = join(values.out, `${name}-${width}-${colorScheme}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
    await page.close();
  }
}
await browser.close();
