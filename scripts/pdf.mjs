#!/usr/bin/env node
// Usage: node scripts/pdf.mjs --site <built dir> --out <dir> [--one-piece] [--page <path>]...
//        node scripts/pdf.mjs --site <built dir> --out <dir> --linked
// Prints pages of a built site to PDFs with Chromium. Default: A4 pages from the print styles,
// light colours. `--one-piece`: the desktop view of the page as it is on screen (1440 px wide,
// screen styles, the page's own colours), on one single PDF page as long as the page, without
// page breaks (owner 2026-09-24; applications on GitHub Pages). Default: every HTML page of
// the site. `--linked`: every page that a download link of the site names (data-pdf, with
// data-pdf-mode "a4" or "one-piece"), for pages.yml. Output files are named after the page path;
// PDFs are build output and never committed (*.pdf ignored). HTML comes first: PDFs only on
// request or for published links.

import { mkdir, readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';
import { pdfName } from './lib/profiles.mjs';

export { pdfName };

async function htmlFiles(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full, base)));
    else if (entry.name.endsWith('.html')) out.push(relative(base, full));
  }
  return out.sort();
}

// Pages named by the download links of a built site: [{ page, onePiece }], each page once.
export async function linkedPdfs(site) {
  const found = new Map();
  for (const file of await htmlFiles(resolve(site))) {
    const text = await readFile(join(resolve(site), file), 'utf8');
    for (const [, page, mode] of text.matchAll(/data-pdf="([^"]+)" data-pdf-mode="(a4|one-piece)"/g)) {
      if (found.has(page) && found.get(page) !== mode) throw new Error(`${page}: linked as ${found.get(page)} and ${mode}`);
      found.set(page, mode);
    }
  }
  return [...found].sort().map(([page, mode]) => ({ page, onePiece: mode === 'one-piece' }));
}

// One-piece export: screen width of the desktop view, and what only serves navigation on
// screen is left out (bars, section navigation, skip link, language switch).
export const ONE_PIECE_WIDTH = 1440;
const ONE_PIECE_HIDE = '.skip-link, .section-nav, .lang-switch, .dossier-nav, [data-export="hide"]';
// Longest page PDF viewers accept (Acrobat: 200 in = 19200 CSS px); longer pages are scaled.
const MAX_PAGE_PX = 19200;

// Prints an open page as one PDF page of the width `width` and the page's full height.
export async function printOnePiece(page, file, { width = ONE_PIECE_WIDTH, hide = ONE_PIECE_HIDE } = {}) {
  await page.setViewportSize({ width, height: 900 });
  await page.addStyleTag({ content: `${hide} { display: none !important; }` });
  // Lazy images load before measuring; fonts too, so the height is final.
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager';
    await Promise.all([...document.images].map((img) => (img.complete ? null : img.decode().catch(() => null))));
    await document.fonts.ready;
  });
  const height = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  const scale = Math.min(1, MAX_PAGE_PX / height);
  // The page size comes from the PDF call alone: no margins, no A4 from the print styles.
  await page.addStyleTag({ content: '@page { size: auto; margin: 0 !important; }' });
  return page.pdf({
    path: file,
    width: `${Math.floor(width * scale)}px`,
    // +1 px: rounding must never push the last line onto a second page.
    height: `${Math.ceil(height * scale) + 1}px`,
    scale,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
}

export async function printPdfs({ site, out, pages, onePiece = false }) {
  const list = pages?.length ? pages : await htmlFiles(resolve(site));
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const path of list) {
      const page = await browser.newPage({ reducedMotion: 'reduce' });
      await page.emulateMedia({ media: onePiece ? 'screen' : 'print', colorScheme: 'light' });
      await page.goto(pathToFileURL(resolve(site, path)).href);
      await page.evaluate(() => document.fonts.ready);
      const file = join(out, pdfName(path));
      const buffer = onePiece
        ? await printOnePiece(page, file)
        : await page.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true });
      const pageCount = (buffer.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
      results.push({ path, file, pages: pageCount });
      await page.close();
    }
  } finally {
    await browser.close();
  }
  return results;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const { values } = parseArgs({
    options: {
      site: { type: 'string' },
      out: { type: 'string' },
      page: { type: 'string', multiple: true },
      'one-piece': { type: 'boolean' },
      linked: { type: 'boolean' },
    },
  });
  if (!values.site || !values.out) {
    console.error('Usage: node scripts/pdf.mjs --site <built dir> --out <dir> [--one-piece] [--page <path>]... | --linked');
    process.exit(2);
  }
  const runs = values.linked
    ? (await linkedPdfs(values.site)).reduce((acc, { page, onePiece }) => (acc[onePiece ? 1 : 0].push(page), acc), [[], []])
        .map((pages, i) => ({ pages, onePiece: i === 1 }))
        .filter((r) => r.pages.length)
    : [{ pages: values.page, onePiece: values['one-piece'] }];
  for (const run of runs) {
    for (const r of await printPdfs({ site: values.site, out: values.out, ...run })) {
      console.log(`${r.file} (${r.pages} page${r.pages === 1 ? '' : 's'})`);
    }
  }
}
