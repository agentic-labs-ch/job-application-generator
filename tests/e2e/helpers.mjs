import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import YAML from 'yaml';

export const WIDTHS = [375, 768, 1440];

// Pages: 'example', 'long-text', 'cv' (German default) and 'cv/en' (English).
export const PAGES = ['example', 'long-text', 'cv', 'cv/en'];

const LETTER_SLUGS = { de: 'anschreiben', en: 'cover-letter' };

// Role versions, cover letters, text pages and applications of a built site, read from the
// data files at collection time (global setup builds them): e.g. 'cv/beispiel-automobile/anschreiben'.
function extraPages(site, baseLanguages, dirs) {
  const pages = { profile: [], letter: [], article: [], application: [] };
  for (const dir of dirs) {
    for (const name of readdirSync(dir).filter((n) => /\.ya?ml$/.test(n)).sort()) {
      const doc = YAML.parse(readFileSync(join(dir, name), 'utf8'));
      if (doc.kind === 'application') {
        pages.application.push(`${site}/${doc.id}`);
        continue;
      }
      const languages = baseLanguages.filter((l) => !doc.languages || doc.languages.includes(l));
      languages.forEach((lang, i) => {
        const base = i === 0 ? `${site}/${doc.id}` : `${site}/${doc.id}/${lang}`;
        if (doc.kind === 'article') pages.article.push(base);
        if (doc.kind === 'profile') pages.profile.push(base);
        if (doc.kind === 'profile' && doc.letter) pages.letter.push(`${base}/${LETTER_SLUGS[lang]}`);
      });
    }
  }
  return pages;
}

export const EXAMPLE_EXTRA = extraPages('example', ['en'], ['tests/fixtures/profiles', 'tests/fixtures/pages', 'tests/fixtures/applications']);
export const CV_EXTRA = extraPages('cv', ['de', 'en'], ['data/profiles', 'data/pages', 'data/applications']);
export const EXTRA_PAGES = [EXAMPLE_EXTRA, CV_EXTRA].flatMap((p) => [...p.profile, ...p.letter, ...p.article, ...p.application]);
export const APPLICATIONS = [...EXAMPLE_EXTRA.application, ...CV_EXTRA.application];
export const LETTERS = [...EXAMPLE_EXTRA.letter, ...CV_EXTRA.letter];

export function pageUrl(name) {
  return pathToFileURL(resolve(`.cache/e2e/${name}/index.html`)).href;
}

// Elements past the right edge of the page. Content that a box inside the page clips or scrolls
// (the section navigation on phones scrolls sideways within its bar) is not page overflow.
export async function horizontalOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const clippedInside = (el) => {
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        if (getComputedStyle(a).overflowX !== 'visible') return a.getBoundingClientRect().right <= doc.clientWidth + 0.5;
      }
      return false;
    };
    const offenders = [...document.querySelectorAll('body *')]
      .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 0.5 && !clippedInside(el))
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${el.className}`);
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offenders };
  });
}
