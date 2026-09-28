import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findDuplicates, checkDuplicates } from '../../scripts/check-duplicates.mjs';

// Owner 2026-09-26: say each thing once. Fictional statements only.
test('finds similar sentences, skills repeated as interests and languages, similar skills', () => {
  const found = findDuplicates([
    { where: '/a', kind: 'sentence', text: 'Replaced a fictional nightly batch job with an event-driven pipeline.' },
    { where: '/b', kind: 'sentence', text: 'Replaced the fictional nightly batch job with an event driven pipeline for the team.' },
    { where: '/c', kind: 'sentence', text: 'Organised a monthly meetup for an invented local community.' },
    { where: '/s1', kind: 'skill', text: 'Imaginary platform design' },
    { where: '/s2', kind: 'skill', text: 'Platform design (imaginary)' },
    { where: '/s3', kind: 'skill', text: 'Esperanto' },
    { where: '/i', kind: 'interest', text: 'Imaginary platform design' },
    { where: '/l', kind: 'language', text: 'Esperanto' },
  ]);
  const rules = found.map((f) => `${f.rule}: ${f.a.where} ${f.b.where}`);
  assert.ok(rules.includes('similar sentences: /a /b'));
  assert.ok(!rules.some((r) => r.includes('/c')), 'a different sentence is no finding');
  assert.ok(rules.includes('similar skills: /s1 /s2'));
  assert.ok(rules.includes('skill and interest: /s1 /i'));
  assert.ok(rules.includes('language listed as a skill: /s3 /l'));
});

test('abbreviations do not end a sentence; the example dataset is free of doubles', async () => {
  const found = findDuplicates([
    { where: '/a', kind: 'sentence', text: 'Led an invented team of eight incl. budget and schedule for a fictional platform.' },
    { where: '/b', kind: 'sentence', text: 'Wrote the internal handbook for an imaginary incident process.' },
  ]);
  assert.deepEqual(found, []);
  const report = await checkDuplicates({ data: 'data/cv.example.yaml', profiles: 'tests/fixtures/profiles', applications: 'tests/fixtures/applications' });
  const main = report.find((r) => r.file === 'data/cv.example.yaml');
  assert.deepEqual(main.findings, [], 'the fictional main CV says each thing once');
});
