// Role versions, text pages and applications next to a base CV dataset (see docs/profiles.md
// and docs/applications.md): loading, merging a version into its base, and the URL layout of
// every generated page.

import { readdir } from 'node:fs/promises';
import { join, posix, resolve } from 'node:path';
import { loadDocument } from './validate.mjs';

const LETTER_SLUGS = { de: 'anschreiben', en: 'cover-letter' };

// Loads every .yaml file in `dir` as a document of `kind` whose base is `basePath`.
export async function loadDocuments(dir, kind, basePath) {
  const names = (await readdir(dir)).filter((n) => /\.ya?ml$/.test(n)).sort();
  const docs = [];
  const errors = [];
  for (const name of names) {
    const file = join(dir, name);
    const doc = await loadDocument(file);
    if (doc.errors.length) {
      errors.push(`${file}:\n    ${doc.errors.join('\n    ')}`);
    } else if (doc.kind !== kind) {
      errors.push(`${file}: expected kind "${kind}", found "${doc.kind}"`);
    } else if (doc.base.path !== resolve(basePath)) {
      errors.push(`${file}: base is ${doc.base.path}, but the build uses ${resolve(basePath)}`);
    } else {
      docs.push(doc.data);
    }
  }
  return { docs, errors };
}

// The base dataset with a version's experience tailoring applied. Facts (organisation, role,
// dates, location) always come from the base; only texts are replaced, and the version may
// bring its own photo.
export function mergeProfile(cv, version) {
  const tailoring = new Map((version.experience ?? []).map((e) => [e.id, e]));
  return {
    ...cv,
    profile: version.photo ? { ...cv.profile, photo: version.photo } : cv.profile,
    experience: (cv.experience ?? []).map((job) => {
      const t = tailoring.get(job.id);
      if (!t) return job;
      return {
        ...job,
        summary: t.summary ?? job.summary,
        highlights: t.highlights ?? job.highlights,
        projects: t.projects ?? job.projects,
      };
    }),
  };
}

// The base dataset with an application's tailoring applied: experience texts (or `compact`
// for older positions), education sentences and the photo. Facts (organisation, role, dates,
// location) always come from the base.
export function mergeApplication(cv, app) {
  const merged = mergeProfile(cv, app);
  const compact = new Set((app.experience ?? []).filter((e) => e.compact).map((e) => e.id));
  const schools = new Map((app.education ?? []).map((e) => [e.id, e]));
  return {
    ...merged,
    experience: merged.experience.map((job) =>
      compact.has(job.id)
        ? { id: job.id, organization: job.organization, location: job.location, role: job.role, start: job.start, end: job.end, tags: job.tags, compact: true }
        : job,
    ),
    education: (cv.education ?? []).map((e) => (schools.has(e.id) ? { ...e, summary: schools.get(e.id).summary } : e)),
  };
}

// Page languages of a document: its own list in base order, or all base languages. An
// application has exactly one language, the language of its job ad.
export function pageLanguages(cv, doc) {
  const own = doc?.language ? [doc.language] : doc?.languages;
  return cv.meta.languages.filter((l) => !own || own.includes(l));
}

// Output paths ("index.html" style, relative to the site root) of every page, by reference:
// "cv", "<profile id>", "<profile id>/letter", "<article id>", "<application id>"
// -> { lang: path }.
export function sitePaths(cv, profiles, articles, applications = []) {
  const paths = new Map();
  const add = (ref, dir, languages, leaf = () => '') => {
    const [first] = languages;
    paths.set(
      ref,
      Object.fromEntries(
        languages.map((lang) => {
          const parts = [dir, lang === first ? '' : lang, leaf(lang)].filter(Boolean);
          return [lang, [...parts, 'index.html'].join('/')];
        }),
      ),
    );
  };
  add('cv', '', cv.meta.languages);
  for (const p of profiles) {
    add(p.id, p.id, pageLanguages(cv, p));
    if (p.letter) add(`${p.id}/letter`, p.id, pageLanguages(cv, p), (lang) => LETTER_SLUGS[lang]);
  }
  for (const a of articles) add(a.id, a.id, pageLanguages(cv, a));
  for (const a of applications) add(a.id, a.id, pageLanguages(cv, a));
  return paths;
}

// Relative href from one output file to another (both relative to the site root).
export function relativeHref(fromFile, toFile) {
  return posix.relative(posix.dirname(fromFile), toFile);
}

// Prefix from an output file to the site root, e.g. "../../" (empty at the root).
export function rootPrefix(file) {
  return '../'.repeat(file.split('/').length - 1);
}

// File name of the PDF printed from a page of the site (scripts/pdf.mjs): "index.html" ->
// "cv.pdf", "en/index.html" -> "en.pdf", "ict-architect/en/index.html" -> "ict-architect-en.pdf".
export function pdfName(path) {
  return `${path.replace(/\/?index\.html$/, '').replaceAll('/', '-') || 'cv'}.pdf`;
}
