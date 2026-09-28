#!/usr/bin/env node
// Usage: node scripts/build.mjs --data <file.yaml> [--profiles <dir>] [--pages <dir>]
//        [--applications <dir>] --out <dir>
// Writes only allowlisted files: <out>/assets/site.css, assets/entry.js, the self-hosted fonts in
// <out>/assets/fonts/ (FONT_FILES), the portrait, <out>/index.html for the first language in
// meta.languages and <out>/<lang>/index.html for each further language. Role versions
// (--profiles), text pages (--pages) and applications (--applications) add <out>/<id>/… pages
// (see docs/profiles.md and docs/applications.md).

import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { loadCv } from './lib/validate.mjs';
import { loadDocuments, mergeApplication, mergeProfile, pageLanguages, pdfName, relativeHref, rootPrefix, sitePaths } from './lib/profiles.mjs';
import { renderApplicationPage, renderArticlePage, renderLetterPage, renderPage, renderProfilePage } from '../site/templates.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Self-hosted font files (SIL OFL 1.1), each one family in 400: Instrument Sans for every page
// (site/fonts.css); Source Serif 4 and Schibsted Grotesk for applications of the Branchen
// Finanz & Öffentlich and Beratung & Sales (BRANCHEN in site/templates.mjs, owner 2026-09-27).
export const FONT_FILES = [
  ['@fontsource/instrument-sans', 'instrument-sans-latin-400-normal.woff2'],
  ['@fontsource/source-serif-4', 'source-serif-4-latin-400-normal.woff2'],
  ['@fontsource/schibsted-grotesk', 'schibsted-grotesk-latin-400-normal.woff2'],
];

// Image metadata (camera, location, editing history) is a publication surface: refuse it.
export function assertNoImageMetadata(buffer, name) {
  const markers = ['Exif\0\0', 'http://ns.adobe.com/xap/', 'Photoshop 3.0'];
  const found = markers.filter((m) => buffer.includes(Buffer.from(m, 'latin1')));
  if (found.length) {
    throw new Error(`${name} contains metadata (${found.join(', ')}); strip it before publishing`);
  }
}

// Renders role versions, cover letters, text pages and applications. Returns [{ file, html }].
function renderExtraPages(cv, profiles, articles, applications) {
  const paths = sitePaths(cv, profiles, articles, applications);
  const pages = [];
  const alternatesOf = (ref, lang, file) =>
    Object.entries(paths.get(ref))
      .filter(([other]) => other !== lang)
      .map(([other, path]) => ({ lang: other, href: relativeHref(file, path) }));

  for (const version of profiles) {
    const merged = mergeProfile(cv, version);
    for (const lang of pageLanguages(cv, version)) {
      const cvFile = paths.get(version.id)[lang];
      const letterFile = version.letter ? paths.get(`${version.id}/letter`)[lang] : undefined;
      for (const [file, render] of [
        [cvFile, renderProfilePage],
        ...(letterFile ? [[letterFile, renderLetterPage]] : []),
      ]) {
        const root = rootPrefix(file);
        const ref = file === cvFile ? version.id : `${version.id}/letter`;
        pages.push({
          file,
          html: render(merged, version, {
            lang,
            root,
            alternates: alternatesOf(ref, lang, file),
            dossierLinks: {
              cv: relativeHref(file, cvFile),
              letter: letterFile && relativeHref(file, letterFile),
            },
            // The A4 dossier of the role version (pages.yml prints it: scripts/pdf.mjs --linked)
            pdf: file === cvFile ? { href: `${root}pdf/${pdfName(file)}`, page: file } : undefined,
          }),
        });
      }
    }
  }

  for (const article of articles) {
    for (const lang of pageLanguages(cv, article)) {
      const file = paths.get(article.id)[lang];
      const resolvePage = (ref) => {
        const target = paths.get(ref);
        if (!target) throw new Error(`${article.id}: unknown page reference "${ref}"`);
        return relativeHref(file, target[lang] ?? Object.values(target)[0]);
      };
      pages.push({
        file,
        html: renderArticlePage(cv, article, {
          lang,
          root: rootPrefix(file),
          alternates: alternatesOf(article.id, lang, file),
          resolvePage,
        }),
      });
    }
  }

  for (const app of applications) {
    const file = paths.get(app.id)[app.language];
    pages.push({ file, html: renderApplicationPage(mergeApplication(cv, app), app, { root: rootPrefix(file) }) });
  }
  return pages;
}

export async function build({ data, out, profiles: profilesDir, pages: pagesDir, applications: applicationsDir }) {
  const outDir = resolve(root, out);
  const rel = relative(root, outDir);
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) {
    throw new Error(`Output directory must be inside the project: ${out}`);
  }

  const { data: cv, errors } = await loadCv(resolve(root, data));
  if (errors.length > 0) {
    const err = new Error(`Validation failed for ${data}:\n  ${errors.join('\n  ')}`);
    err.validationErrors = errors;
    throw err;
  }

  const extra = { profile: [], article: [], application: [] };
  const docErrors = [];
  for (const [kind, dir] of [['profile', profilesDir], ['article', pagesDir], ['application', applicationsDir]]) {
    if (!dir) continue;
    const { docs, errors: e } = await loadDocuments(resolve(root, dir), kind, resolve(root, data));
    extra[kind] = docs;
    docErrors.push(...e);
  }
  const ids = new Set();
  for (const doc of [...extra.profile, ...extra.article, ...extra.application]) {
    if (ids.has(doc.id)) docErrors.push(`duplicate page id "${doc.id}" in ${[profilesDir, pagesDir, applicationsDir].filter(Boolean).join(' / ')}`);
    ids.add(doc.id);
  }
  if (docErrors.length > 0) {
    const err = new Error(`Validation failed:\n  ${docErrors.join('\n  ')}`);
    err.validationErrors = docErrors;
    throw err;
  }

  const css = [
    await readFile(join(root, 'site/fonts.css'), 'utf8'),
    await readFile(join(root, 'design/tokens.css'), 'utf8'),
    await readFile(join(root, 'site/styles.css'), 'utf8'),
  ].join('\n');

  const [defaultLang, ...otherLangs] = cv.meta.languages;
  const pathOf = (lang) => (lang === defaultLang ? 'index.html' : `${lang}/index.html`);
  const pages = cv.meta.languages.map((lang) => {
    const prefix = lang === defaultLang ? '' : '../';
    return {
      file: pathOf(lang),
      html: renderPage(cv, {
        lang,
        assetPrefix: prefix,
        cssHref: `${prefix}assets/site.css`,
        scriptHref: `${prefix}assets/entry.js`,
        pdf: { href: `${prefix}pdf/${pdfName(pathOf(lang))}`, page: pathOf(lang) },
        alternates: cv.meta.languages
          .filter((other) => other !== lang)
          .map((other) => ({ lang: other, href: `${prefix}${pathOf(other)}` })),
      }),
    };
  });

  pages.push(...renderExtraPages(cv, extra.profile, extra.article, extra.application));

  await rm(outDir, { recursive: true, force: true });
  await mkdir(join(outDir, 'assets/fonts'), { recursive: true });
  for (const lang of otherLangs) await mkdir(join(outDir, lang), { recursive: true });
  for (const page of pages) {
    await mkdir(dirname(join(outDir, page.file)), { recursive: true });
    await writeFile(join(outDir, page.file), page.html);
  }
  await writeFile(join(outDir, 'assets/site.css'), css);
  const extraFiles = [];
  // Entry moment: a static, content-free script copied as is (tested byte for byte).
  await copyFile(join(root, 'site/entry.js'), join(outDir, 'assets/entry.js'));
  // Portraits: the base photo and the own photos of role versions and applications, all next to
  // the dataset.
  const photos = new Set(
    [cv.profile.photo, ...extra.profile.map((p) => p.photo), ...extra.application.map((a) => a.photo)]
      .filter(Boolean)
      .map((p) => p.src),
  );
  for (const src of photos) {
    const buffer = await readFile(join(dirname(resolve(root, data)), src));
    assertNoImageMetadata(buffer, src);
    await writeFile(join(outDir, 'assets', basename(src)), buffer);
    extraFiles.push(`assets/${basename(src)}`);
  }
  const fontFiles = [];
  for (const [pkg, file] of FONT_FILES) {
    await copyFile(join(root, 'node_modules', pkg, 'files', file), join(outDir, 'assets/fonts', file));
    fontFiles.push(`assets/fonts/${file}`);
  }
  return {
    outDir,
    files: ['assets/entry.js', 'assets/site.css', ...extraFiles, ...fontFiles, ...pages.map((p) => p.file)].sort(),
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: {
      data: { type: 'string' },
      profiles: { type: 'string' },
      pages: { type: 'string' },
      applications: { type: 'string' },
      out: { type: 'string' },
    },
  });
  if (!values.data || !values.out) {
    console.error('Usage: node scripts/build.mjs --data <file.yaml> [--profiles <dir>] [--pages <dir>] [--applications <dir>] --out <dir>');
    process.exit(2);
  }
  try {
    const { outDir, files } = await build(values);
    console.log(`Built ${files.length} files into ${relative(root, outDir)}/`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
