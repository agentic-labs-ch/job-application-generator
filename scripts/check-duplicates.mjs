#!/usr/bin/env node
// Usage: node scripts/check-duplicates.mjs [--data data/cv.yaml] [--profiles data/profiles]
//          [--applications data/applications] [--strict]
// Lists information that a CV says more than once (owner 2026-09-26: no double or near-double
// statements; docs/cv-guide.md: "Say each thing once"). Checked per document and language:
// skill names across groups, skills against interests, languages and activities, and similar
// sentences in the profile, summaries, highlights, projects, strengths, USPs and letters.
// Exact duplicates between skills and interests already fail validation; this report is for a
// person or the agent skill `cv-doppelungen-pruefen` to judge. Exit code 0, or 1 with --strict
// when anything is found.

import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { interestItems, loadCv, loadDocument, textFor } from './lib/validate.mjs';
import { mergeApplication, mergeProfile } from './lib/profiles.mjs';

const STOP = new Set(
  'und oder mit für von vom zum zur der die das den dem des ein eine einer eines einem im in an am auf aus bei bis als auch sowie über unter nach vor ich wir sie es ist sind wurde werden and or with for from the a an of in on at to by as is are was were my our into over'.split(' '),
);

function tokens(text) {
  return new Set(
    String(text ?? '')
      .toLowerCase()
      .replace(/\([^)]*\)/g, ' ')
      .split(/[^\p{L}\p{N}+#]+/u)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const w of a) if (b.has(w)) shared += 1;
  return shared / (a.size + b.size - shared);
}

const same = (a, b) => [...tokens(a)].join(' ') === [...tokens(b)].join(' ') && tokens(a).size > 0;

// Sentences of a text (long texts only; single words are handled by the name checks). A full
// stop after an abbreviation ("inkl.", "z. B.", "incl.") does not end a sentence.
const SENTENCE_END = /(?<=(?<!\b(?:inkl|incl|bzw|ca|etc|vs|Nr|Dr|u\. ?a|z\. ?B|e\.g|i\.e))[.!?])\s+(?=\p{Lu})/u;
function sentences(text) {
  return String(text ?? '')
    .split(SENTENCE_END)
    .map((s) => s.trim())
    .filter((s) => tokens(s).size >= 4);
}

// Every statement of a CV dataset in one language: [{ where, kind, text }]
function cvStatements(cv, lang) {
  const out = [];
  const add = (where, kind, value) => {
    const text = textFor(value, lang);
    if (text) out.push({ where, kind, text });
  };
  add('/profile/summary', 'sentence', cv.profile?.summary);
  (cv.experience ?? []).forEach((e, i) => {
    add(`/experience/${i}/summary`, 'sentence', e.summary);
    (e.highlights ?? []).forEach((h, j) => add(`/experience/${i}/highlights/${j}`, 'sentence', h));
    (e.projects ?? []).forEach((p, j) => add(`/experience/${i}/projects/${j}`, 'sentence', p.description));
  });
  (cv.education ?? []).forEach((e, i) => add(`/education/${i}/summary`, 'sentence', e.summary));
  (cv.skills ?? []).forEach((g, i) => g.items.forEach((s, j) => add(`/skills/${i}/items/${j}`, 'skill', s.name)));
  (cv.languages ?? []).forEach((l, i) => add(`/languages/${i}`, 'language', l.name));
  (cv.activities ?? []).forEach((a, i) => add(`/activities/${i}`, 'activity', a.description));
  for (const item of interestItems(textFor(cv.profile?.interests, lang))) out.push({ where: '/profile/interests', kind: 'interest', text: item });
  return out;
}

// Texts a role version or an application adds on top of the (tailored) CV: profile, claim,
// USPs or strengths, and the letter
function documentStatements(doc, lang) {
  const out = [];
  const add = (where, value) => {
    const text = textFor(value, lang);
    if (text) out.push({ where, kind: 'sentence', text });
  };
  add('/claim', doc.claim);
  add('/summary', doc.summary);
  add('/profile', doc.profile);
  (doc.usp ?? []).forEach((u, i) => add(`/usp/${i}/text`, u.text));
  (doc.strengths ?? []).forEach((s, i) => add(`/strengths/${i}/text`, s.text));
  const letter = doc.letter ?? {};
  for (const part of ['attention', 'interest', 'desire', 'action']) {
    (letter[part] ?? []).forEach((block, i) => {
      if (typeof block === 'string' || (block && !block.points)) add(`/letter/${part}/${i}`, block);
      else (block?.points ?? []).forEach((p, j) => add(`/letter/${part}/${i}/points/${j}`, p));
    });
  }
  return out;
}

// Pairs of statements that say the same thing (or nearly)
export function findDuplicates(statements) {
  const findings = [];
  const sents = statements.flatMap((s) => (s.kind === 'sentence' ? sentences(s.text).map((text) => ({ ...s, text })) : []));
  for (let i = 0; i < sents.length; i += 1) {
    for (let j = i + 1; j < sents.length; j += 1) {
      const [a, b] = [sents[i], sents[j]];
      if (a.where === b.where) continue;
      const score = jaccard(tokens(a.text), tokens(b.text));
      if (score >= 0.6) findings.push({ rule: score === 1 ? 'same sentence' : 'similar sentences', a, b, score });
    }
  }
  const names = statements.filter((s) => s.kind !== 'sentence');
  const pairs = [
    ['skill', 'skill', 'similar skills'],
    ['skill', 'interest', 'skill and interest'],
    ['skill', 'language', 'language listed as a skill'],
    ['activity', 'interest', 'activity and interest'],
  ];
  for (const [ka, kb, rule] of pairs) {
    const as = names.filter((s) => s.kind === ka);
    const bs = names.filter((s) => s.kind === kb);
    as.forEach((a, i) => {
      bs.forEach((b, j) => {
        if (ka === kb && j <= i) return;
        const [ta, tb] = [tokens(a.text), tokens(b.text)];
        const contained = ta.size && tb.size && ([...ta].every((w) => tb.has(w)) || [...tb].every((w) => ta.has(w)));
        const score = jaccard(ta, tb);
        if (same(a.text, b.text) || score >= 0.5 || (contained && Math.min(ta.size, tb.size) >= 1 && ka !== kb)) {
          findings.push({ rule, a, b, score: Math.round(score * 100) / 100 });
        }
      });
    });
  }
  return findings;
}

export async function checkDuplicates({ data = 'data/cv.yaml', profiles = 'data/profiles', applications = 'data/applications' } = {}) {
  const { data: cv, errors } = await loadCv(resolve(data));
  if (errors.length) throw new Error(`Invalid ${data}:\n  ${errors.join('\n  ')}`);
  const report = [];
  for (const lang of cv.meta.languages) {
    report.push({ file: data, lang, findings: findDuplicates(cvStatements(cv, lang)) });
  }
  for (const dir of [profiles, applications].filter(Boolean)) {
    let names = [];
    try {
      names = (await readdir(dir)).filter((n) => /\.ya?ml$/.test(n)).sort();
    } catch {
      continue; // no such directory
    }
    for (const name of names) {
      const file = join(dir, name);
      const doc = await loadDocument(file);
      if (doc.errors.length) throw new Error(`Invalid ${file}:\n  ${doc.errors.join('\n  ')}`);
      const langs = doc.data.language ? [doc.data.language] : doc.data.languages ?? cv.meta.languages;
      // What the page shows: the CV as tailored by the document (its highlights replace the
      // base's), plus the document's own texts
      const tailored = doc.kind === 'application' ? mergeApplication(cv, doc.data) : doc.kind === 'profile' ? mergeProfile(cv, doc.data) : null;
      if (!tailored) continue; // text pages carry no CV
      for (const lang of langs) {
        const page = [...documentStatements(doc.data, lang), ...cvStatements(tailored, lang).map((s) => ({ ...s, where: `cv${s.where}` }))];
        report.push({ file, lang, findings: findDuplicates(page) });
      }
    }
  }
  return report;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: { data: { type: 'string' }, profiles: { type: 'string' }, applications: { type: 'string' }, strict: { type: 'boolean' } },
  });
  const report = await checkDuplicates({ ...values });
  let count = 0;
  for (const { file, lang, findings } of report) {
    if (!findings.length) continue;
    console.log(`${file} (${lang})`);
    for (const f of findings) {
      count += 1;
      console.log(`  ${f.rule}${f.score && f.score < 1 ? ` (${f.score})` : ''}:`);
      console.log(`    ${f.a.where}: ${f.a.text}`);
      console.log(`    ${f.b.where}: ${f.b.text}`);
    }
  }
  console.log(count ? `${count} finding(s): say each thing once, or keep both on purpose.` : 'No double statements found.');
  process.exit(values.strict && count ? 1 : 0);
}
