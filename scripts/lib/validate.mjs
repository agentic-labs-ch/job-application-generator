// Loads and validates a CV dataset: YAML parsing, JSON Schema, then cross-field rules
// that JSON Schema cannot express (unique IDs, start <= end, allowed URL schemes).
// Role versions (`kind: profile`), text pages (`kind: article`) and applications
// (`kind: application`) are validated against their base dataset (see docs/profiles.md and
// docs/applications.md).

import { readFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { safeUrl } from './html.mjs';
import { brandTokens } from './brand.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const SCHEMAS = {
  cv: 'cv.schema.json',
  profile: 'profile.schema.json',
  article: 'article.schema.json',
  application: 'application.schema.json',
};

let validators;
async function getValidator(kind = 'cv') {
  if (!validators) {
    const ajv = new Ajv({ allErrors: true, strict: true });
    addFormats(ajv);
    for (const file of Object.values(SCHEMAS)) {
      ajv.addSchema(JSON.parse(await readFile(resolve(root, 'schema', file), 'utf8')));
    }
    validators = Object.fromEntries(
      Object.entries(SCHEMAS).map(([k, file]) => [k, ajv.getSchema(`https://example.invalid/schema/${file}`)]),
    );
  }
  return validators[kind];
}

export function parseYaml(text) {
  // Core schema: no YAML 1.1 date/boolean surprises. Duplicate keys are an error.
  const doc = YAML.parseDocument(text, { schema: 'core', uniqueKeys: true, merge: false });
  if (doc.errors.length > 0) {
    return { data: undefined, errors: doc.errors.map((e) => `YAML: ${e.message}`) };
  }
  return { data: doc.toJS({ maxAliasCount: 0 }), errors: [] };
}

const DATED_SECTIONS = [
  ['experience', 'start', 'end'],
  ['education', 'start', 'end'],
  ['certifications', 'date', 'expires'],
  ['activities', 'start', 'end'],
];
const ID_SECTIONS = ['experience', 'education', 'certifications', 'skills', 'languages', 'activities'];
const TEXT_LANGS = new Set(['de', 'en']);

// A bilingual text object is any plain object whose keys are all language codes.
function isTextObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0 &&
    Object.keys(value).every((k) => TEXT_LANGS.has(k))
  );
}

function textKey(value) {
  return JSON.stringify(value).toLowerCase();
}

function checkTextLanguages(value, languages, where, errors) {
  if (isTextObject(value)) {
    const missing = languages.filter((l) => !(l in value));
    const extra = Object.keys(value).filter((l) => !languages.includes(l));
    if (missing.length) errors.push(`${where}: missing translation for ${missing.join(', ')}`);
    if (extra.length) errors.push(`${where}: language not in meta.languages: ${extra.join(', ')}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => checkTextLanguages(v, languages, `${where}/${i}`, errors));
  } else if (value !== null && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (where === '' && k === 'meta') continue;
      checkTextLanguages(v, languages, `${where}/${k}`, errors);
    }
  }
}

// Skills and interests name each thing once (owner 2026-09-26: the two overlap a lot). The
// interests are one text per language; its items are the parts between commas, semicolons,
// "und"/"and" and "&" outside brackets, compared without case, brackets and punctuation.
function comparable(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^\p{L}\p{N}+#]+/gu, ' ')
    .trim();
}

export function interestItems(text) {
  const items = [];
  let depth = 0;
  let current = '';
  for (const ch of String(text ?? '')) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if ((ch === ',' || ch === ';') && depth === 0) {
      items.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  items.push(current);
  const parts = items.flatMap((item) => [item, ...item.replace(/\([^)]*\)/g, ' ').split(/\s+(?:und|and|&)\s+/)]);
  return [...new Set(parts.map((item) => item.trim().replace(/[.:]$/, '')).filter(Boolean))];
}

function interestSkillErrors(data, errors) {
  const interests = data.profile?.interests;
  if (!interests || !data.skills?.length) return;
  for (const lang of data.meta.languages) {
    const skills = new Map();
    data.skills.forEach((group, i) => {
      skills.set(comparable(textFor(group.name, lang)), `/skills/${i}/name`);
      group.items.forEach((item, j) => skills.set(comparable(textFor(item.name, lang)), `/skills/${i}/items/${j}/name`));
    });
    for (const item of interestItems(textFor(interests, lang))) {
      const where = skills.get(comparable(item));
      if (where) errors.push(`/profile/interests: "${item}" (${lang}) is also a skill (${where}); name it once`);
    }
  }
}

function crossFieldErrors(data) {
  const errors = [];

  const seen = new Map();
  for (const section of ID_SECTIONS) {
    (data[section] ?? []).forEach((item, index) => {
      const where = `/${section}/${index}`;
      if (seen.has(item.id)) {
        errors.push(`${where}/id: duplicate id "${item.id}" (first used at ${seen.get(item.id)})`);
      } else {
        seen.set(item.id, where);
      }
    });
  }

  const checkRange = (where, item, fromKey, toKey) => {
    if (item[fromKey] && item[toKey] && item[fromKey] > item[toKey]) {
      errors.push(`${where}: ${fromKey} (${item[fromKey]}) is after ${toKey} (${item[toKey]})`);
    }
  };
  for (const [section, fromKey, toKey] of DATED_SECTIONS) {
    (data[section] ?? []).forEach((item, index) => {
      checkRange(`/${section}/${index}`, item, fromKey, toKey);
    });
  }
  (data.experience ?? []).forEach((job, i) => {
    (job.projects ?? []).forEach((p, j) => {
      const where = `/experience/${i}/projects/${j}`;
      checkRange(where, p, 'start', 'end');
      if (p.start < job.start || (job.end && (p.end ?? p.start) > job.end)) {
        errors.push(`${where}: project dates lie outside the position (${job.start} – ${job.end ?? 'present'})`);
      }
    });
  });

  checkTextLanguages(data, data.meta.languages, '', errors);

  const urls = [];
  (data.profile?.links ?? []).forEach((l, i) => urls.push([`/profile/links/${i}/url`, l.url]));
  (data.certifications ?? []).forEach((c, i) => {
    if (c.url) urls.push([`/certifications/${i}/url`, c.url]);
  });
  for (const [where, url] of urls) {
    try {
      safeUrl(url);
    } catch (err) {
      errors.push(`${where}: ${err.message}`);
    }
  }

  const skillNames = new Set();
  (data.skills ?? []).forEach((group, index) => {
    const key = textKey(group.name);
    if (skillNames.has(key)) errors.push(`/skills/${index}/name: duplicate skill group`);
    skillNames.add(key);
    const itemNames = new Set();
    group.items.forEach((item, j) => {
      const itemKey = textKey(item.name);
      if (itemNames.has(itemKey)) errors.push(`/skills/${index}/items/${j}/name: duplicate skill`);
      itemNames.add(itemKey);
      if (item.level_proposed !== undefined && item.level === undefined) {
        errors.push(`/skills/${index}/items/${j}: level_proposed without level`);
      }
    });
  });

  interestSkillErrors(data, errors);

  // Skill sources point to entries of the dataset (cross references, owner 2026-09-26)
  const sources = new Set(['experience', 'education', 'certifications'].flatMap((s) => (data[s] ?? []).map((e) => e.id)));
  (data.skills ?? []).forEach((group, i) => {
    group.items.forEach((item, j) => {
      for (const ref of item.refs ?? []) {
        if (!sources.has(ref)) errors.push(`/skills/${i}/items/${j}/refs: "${ref}" is no experience, education or certification id`);
      }
    });
  });

  return errors;
}

function schemaErrors(validator, data) {
  if (validator(data)) return [];
  return validator.errors.map((e) => {
    const extra = e.params?.additionalProperty ? ` "${e.params.additionalProperty}"` : '';
    return `${e.instancePath || '/'}: ${e.message}${extra}`;
  });
}

export async function validateData(data) {
  const errors = schemaErrors(await getValidator('cv'), data);
  return errors.length ? errors : crossFieldErrors(data);
}

export async function loadCv(path) {
  const text = await readFile(path, 'utf8');
  const { data, errors } = parseYaml(text);
  if (errors.length > 0) return { data: undefined, errors };
  const validationErrors = await validateData(data);
  return { data: validationErrors.length ? undefined : data, errors: validationErrors };
}

// ---------------------------------------------------------------------------------------
// Role versions (kind: profile), text pages (kind: article) and applications
// (kind: application)

// Ids that would collide with generated paths (language folders, assets).
export const RESERVED_IDS = new Set(['assets', 'de', 'en', 'anschreiben', 'cover-letter', 'cv']);
const REQUIRED_AREAS = ['technology', 'method', 'personal'];
const LIMITS = { summary: 130, claim: 30, letter: 350, profile: 110, strength: 45 };

// Resolves a text for one language (plain strings are shared by all languages).
export function textFor(value, lang) {
  if (value === undefined || value === null) return undefined;
  return typeof value === 'string' ? value : value[lang];
}

function wordCount(text) {
  return (text ?? '').split(/\s+/).filter(Boolean).length;
}

function isValidDate(value) {
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function letterBlocks(letter) {
  return ['attention', 'interest', 'desire', 'action'].flatMap((part) => letter[part] ?? []);
}

function letterWords(letter, lang) {
  return letterBlocks(letter).reduce(
    (sum, block) =>
      sum + (block.points ? block.points.reduce((n, p) => n + wordCount(textFor(p, lang)), 0) : wordCount(textFor(block, lang))),
    0,
  );
}

// Loads the base dataset named by `base` (relative to the document), which must stay inside
// the repository.
async function loadBase(docPath, base, errors) {
  const basePath = resolve(dirname(docPath), base);
  const rel = relative(root, basePath);
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) {
    errors.push(`/base: must point to a dataset inside the repository`);
    return undefined;
  }
  let cv;
  try {
    ({ data: cv } = await loadCv(basePath));
  } catch (err) {
    errors.push(`/base: cannot read ${base} (${err.code ?? err.message})`);
    return undefined;
  }
  if (!cv) {
    errors.push(`/base: ${base} is not a valid CV dataset (run the validator on it)`);
    return undefined;
  }
  return { path: basePath, data: cv };
}

function commonErrors(doc, base, errors) {
  if (RESERVED_IDS.has(doc.id)) errors.push(`/id: "${doc.id}" is reserved`);
  const languages = doc.languages ?? base.meta.languages;
  const extra = languages.filter((l) => !base.meta.languages.includes(l));
  if (extra.length) errors.push(`/languages: not in the base meta.languages: ${extra.join(', ')}`);
  checkTextLanguages(doc, languages, '', errors);
  return languages;
}

function baseIds(cv) {
  return new Set(
    ['experience', 'education', 'certifications', 'activities'].flatMap((s) => (cv[s] ?? []).map((e) => e.id)),
  );
}

// Experience tailoring (profiles and applications): base ids only, once each; projects keep
// the base number and dates.
function experienceErrors(doc, cv, errors) {
  const positions = new Map((cv.experience ?? []).map((e) => [e.id, e]));
  const seen = new Set();
  (doc.experience ?? []).forEach((entry, i) => {
    const where = `/experience/${i}`;
    const job = positions.get(entry.id);
    if (!job) {
      errors.push(`${where}/id: "${entry.id}" is not an experience id in the base dataset`);
      return;
    }
    if (seen.has(entry.id)) errors.push(`${where}/id: duplicate entry for "${entry.id}"`);
    seen.add(entry.id);
    if (entry.projects) {
      const baseProjects = job.projects ?? [];
      const same =
        entry.projects.length === baseProjects.length &&
        entry.projects.every((p, j) => p.start === baseProjects[j].start && p.end === baseProjects[j].end);
      if (!same) errors.push(`${where}/projects: must keep the base projects' number and dates (only descriptions change)`);
    }
  });
}

function profileErrors(profile, cv) {
  const errors = [];
  const languages = commonErrors(profile, cv, errors);

  experienceErrors(profile, cv, errors);

  const evidenceIds = baseIds(cv);
  if (profile.letter) evidenceIds.add('letter');
  const groupIds = new Set();
  (profile.skills ?? []).forEach((group, i) => {
    const where = `/skills/${i}`;
    if (groupIds.has(group.id)) errors.push(`${where}/id: duplicate skill group id "${group.id}"`);
    groupIds.add(group.id);
    const names = new Set();
    group.items.forEach((item, j) => {
      const key = textKey(item.name);
      if (names.has(key)) errors.push(`${where}/items/${j}/name: duplicate skill`);
      names.add(key);
      for (const id of item.evidence) {
        if (!evidenceIds.has(id)) errors.push(`${where}/items/${j}/evidence: unknown id "${id}"`);
      }
    });
  });
  const areas = new Set((profile.skills ?? []).map((g) => g.area));
  const missing = REQUIRED_AREAS.filter((a) => !areas.has(a));
  if (missing.length) errors.push(`/skills: missing competency area(s): ${missing.join(', ')}`);

  for (const lang of languages) {
    const summary = wordCount(textFor(profile.summary, lang));
    if (summary > LIMITS.summary) errors.push(`/summary: ${summary} words in "${lang}" (max. ${LIMITS.summary})`);
    const claim = wordCount(textFor(profile.claim, lang));
    if (claim > LIMITS.claim) errors.push(`/claim: ${claim} words in "${lang}" (max. ${LIMITS.claim})`);
    if (profile.letter) {
      const words = letterWords(profile.letter, lang);
      if (words > LIMITS.letter) errors.push(`/letter: body has ${words} words in "${lang}" (max. ${LIMITS.letter})`);
    }
  }
  if (profile.letter && !isValidDate(profile.letter.date)) errors.push(`/letter/date: not a calendar date`);
  if (profile.job?.published && !isValidDate(profile.job.published)) errors.push(`/job/published: not a calendar date`);
  if (profile.job?.url) {
    try {
      safeUrl(profile.job.url);
    } catch (err) {
      errors.push(`/job/url: ${err.message}`);
    }
  }
  return errors;
}

// Applications (docs/applications.md): one page language; facts stay with the base; the three
// strengths, the keywords and the ad's requirements name base entries; must-requirements
// without evidence are declared gaps; the company colours pass the contrast rules.
function applicationErrors(app, cv) {
  const errors = [];
  if (RESERVED_IDS.has(app.id)) errors.push(`/id: "${app.id}" is reserved`);
  if (!cv.meta.languages.includes(app.language)) {
    errors.push(`/language: "${app.language}" is not in the base meta.languages`);
  }
  checkTextLanguages(app, [app.language], '', errors);

  experienceErrors(app, cv, errors);
  (app.experience ?? []).forEach((entry, i) => {
    if (entry.compact && (entry.summary || entry.highlights || entry.projects)) {
      errors.push(`/experience/${i}: a compact position shows date, role and organisation only (no summary, highlights or projects)`);
    }
  });
  const schools = new Set((cv.education ?? []).map((e) => e.id));
  const seenSchools = new Set();
  (app.education ?? []).forEach((entry, i) => {
    if (!schools.has(entry.id)) errors.push(`/education/${i}/id: "${entry.id}" is not an education id in the base dataset`);
    if (seenSchools.has(entry.id)) errors.push(`/education/${i}/id: duplicate entry for "${entry.id}"`);
    seenSchools.add(entry.id);
  });

  // Evidence may also name a base language (e.g. a required language).
  const ids = new Set([...baseIds(cv), ...(cv.languages ?? []).map((l) => l.id)]);
  const checkEvidence = (list, where) => {
    for (const id of list) if (!ids.has(id)) errors.push(`${where}: unknown id "${id}"`);
  };
  app.strengths.forEach((s, i) => checkEvidence(s.evidence, `/strengths/${i}/evidence`));
  (app.knowledge ?? []).forEach((g, i) => checkEvidence(g.evidence, `/knowledge/${i}/evidence`));
  app.job.requirements.forEach((r, i) => {
    checkEvidence(r.evidence, `/job/requirements/${i}/evidence`);
    if (!r.evidence.length && !r.gap) {
      errors.push(`/job/requirements/${i}: no evidence; name the gap in "gap" (the page must not claim it)`);
    }
  });

  const lang = app.language;
  const limit = (value, max, where) => {
    const words = wordCount(textFor(value, lang));
    if (words > max) errors.push(`${where}: ${words} words (max. ${max})`);
  };
  limit(app.profile, LIMITS.profile, '/profile');
  if (app.claim) limit(app.claim, LIMITS.claim, '/claim');
  app.strengths.forEach((s, i) => limit(s.text, LIMITS.strength, `/strengths/${i}/text`));
  const letter = letterWords(app.letter, lang);
  if (letter > LIMITS.letter) errors.push(`/letter: body has ${letter} words (max. ${LIMITS.letter})`);
  if (!isValidDate(app.letter.date)) errors.push(`/letter/date: not a calendar date`);
  if (app.job.published && !isValidDate(app.job.published)) errors.push(`/job/published: not a calendar date`);
  try {
    safeUrl(app.job.url);
  } catch (err) {
    errors.push(`/job/url: ${err.message}`);
  }

  for (const e of brandTokens(app.brand).errors) errors.push(`/brand: ${e}`);
  return errors;
}

function articleErrors(article, cv) {
  const errors = [];
  commonErrors(article, cv, errors);
  article.sections.forEach((section, i) => {
    section.blocks.forEach((block, j) => {
      const where = `/sections/${i}/blocks/${j}`;
      if (block?.table) {
        const width = block.table.columns.length;
        block.table.rows.forEach((row, r) => {
          if (row.length !== width) errors.push(`${where}/table/rows/${r}: ${row.length} cells, expected ${width}`);
        });
      }
      if (block?.links) {
        block.links.forEach((link, k) => {
          if (('page' in link) === ('url' in link)) {
            errors.push(`${where}/links/${k}: needs exactly one of "page" or "url"`);
          } else if (link.url) {
            try {
              safeUrl(link.url);
            } catch (err) {
              errors.push(`${where}/links/${k}/url: ${err.message}`);
            }
          }
        });
      }
    });
  });
  return errors;
}

// Validates any YAML document: a CV dataset (no `kind`), a profile, an article or an
// application.
// Returns { kind, data, base, errors }; `data` is undefined when there are errors.
export async function loadDocument(path) {
  const text = await readFile(path, 'utf8');
  const { data, errors: yamlErrors } = parseYaml(text);
  if (yamlErrors.length) return { kind: undefined, data: undefined, errors: yamlErrors };
  return validateDocument(data, path);
}

// Same as loadDocument for parsed data; `path` locates the document (its `base` is relative
// to it).
export async function validateDocument(data, path) {
  const kind = data && typeof data === 'object' && 'kind' in data ? data.kind : 'cv';
  if (kind === 'cv') {
    const errors = await validateData(data);
    return { kind, data: errors.length ? undefined : data, errors };
  }
  const checks = { profile: profileErrors, article: articleErrors, application: applicationErrors };
  if (!checks[kind]) {
    return { kind, data: undefined, errors: [`/kind: unknown kind ${JSON.stringify(kind)} (profile, article or application)`] };
  }
  const errors = schemaErrors(await getValidator(kind), data);
  if (errors.length) return { kind, data: undefined, errors };
  const base = await loadBase(resolve(path), data.base, errors);
  if (base) errors.push(...checks[kind](data, base.data));
  return { kind, data: errors.length ? undefined : data, base, errors };
}
