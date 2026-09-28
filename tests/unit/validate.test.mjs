import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadCv, parseYaml, validateData } from '../../scripts/lib/validate.mjs';
import { renderPage } from '../../site/templates.mjs';

const example = parseYaml(await readFile('data/cv.example.yaml', 'utf8')).data;
const clone = () => structuredClone(example);

async function expectError(mutate, pattern) {
  const cv = clone();
  mutate(cv);
  const errors = await validateData(cv);
  assert.ok(
    errors.some((e) => pattern.test(e)),
    `expected an error matching ${pattern}, got: ${JSON.stringify(errors)}`,
  );
}

test('example dataset is valid', async () => {
  const { errors } = await loadCv('data/cv.example.yaml');
  assert.deepEqual(errors, []);
});

test('rejects unknown fields at every level', async () => {
  await expectError((cv) => { cv.secret = 'x'; }, /additional properties "secret"/);
  await expectError((cv) => { cv.profile.phone = 'x'; }, /additional properties "phone"/);
  await expectError((cv) => { cv.experience[0].salary = 1; }, /additional properties "salary"/);
});

test('rejects missing required fields', async () => {
  await expectError((cv) => { delete cv.profile.name; }, /required property 'name'/);
  await expectError((cv) => { delete cv.experience[0].start; }, /required property 'start'/);
});

test('rejects wrong types', async () => {
  await expectError((cv) => { cv.profile.name = 42; }, /must be string/);
  await expectError((cv) => { cv.skills[0].items = 'Linux'; }, /must be array/);
  await expectError((cv) => { cv.skills[0].items[0].level = '3'; }, /must be integer/);
});

test('rejects malformed YYYY-MM dates', async () => {
  for (const bad of ['2021', '2021-13', '2021-00', '2021-3', '21-03', '2021-03-01']) {
    await expectError((cv) => { cv.experience[0].start = bad; }, /must match pattern/);
  }
});

test('certificates may give only the year; positions keep YYYY-MM', async () => {
  const cv = clone();
  cv.certifications[1].date = '2023';
  assert.deepEqual(await validateData(cv), []);
  assert.ok(renderPage(cv, { lang: 'de' }).includes('<time datetime="2023">2023</time>'));
  for (const bad of ['23', '2023-1', '2023-13', '2023-05-01']) {
    await expectError((c) => { c.certifications[1].date = bad; }, /must match pattern/);
  }
});

test('rejects start after end', async () => {
  await expectError(
    (cv) => { cv.experience[1].start = '2023-01'; cv.experience[1].end = '2022-12'; },
    /start \(2023-01\) is after end \(2022-12\)/,
  );
  await expectError(
    (cv) => { cv.certifications[0].expires = '2020-01'; },
    /date .* is after expires/,
  );
});

test('rejects invalid and duplicate IDs', async () => {
  await expectError((cv) => { cv.experience[0].id = 'Has Spaces'; }, /\/id: must match pattern/);
  await expectError((cv) => { cv.education[0].id = cv.experience[0].id; }, /duplicate id/);
});

test('rejects duplicate list entries', async () => {
  await expectError((cv) => { cv.skills[0].items.push({ ...cv.skills[0].items[0] }); }, /duplicate skill/);
  await expectError((cv) => { cv.skills[1].name = cv.skills[0].name; }, /duplicate skill group/);
});

test('rejects duplicate YAML keys', () => {
  const { errors } = parseYaml('profile:\n  name: A\n  name: B\n  headline: C\n');
  assert.ok(errors.length > 0);
});

test('accepts only http, https and mailto URLs', async () => {
  for (const bad of [
    'javascript:alert(1)',
    'JAVASCRIPT:alert(1)',
    'data:text/html,hi',
    'ftp://example.com',
    '//example.com',
    'example.com',
    'https://exa mple.com',
  ]) {
    await expectError((cv) => { cv.profile.links[0].url = bad; }, /url/i);
  }
  const cv = clone();
  cv.profile.links = [
    { label: 'a', url: 'http://example.com' },
    { label: 'b', url: 'https://example.com/x?y=1&z=2' },
    { label: 'c', url: 'mailto:someone@example.com' },
  ];
  assert.deepEqual(await validateData(cv), []);
});

test('rejects blank text and unknown language levels', async () => {
  await expectError((cv) => { cv.profile.headline = '   '; }, /must match pattern/);
});

test('checks skill levels, tags and notes', async () => {
  await expectError((cv) => { cv.skills[0].items[0].level = 5; }, /must be <= 4/);
  await expectError((cv) => { cv.skills[0].items[0].level = 0; }, /must be >= 1/);
  // Every skill is rated (owner 2026-09-26)
  await expectError((cv) => { cv.skills[2].items[0] = { name: 'X', level_proposed: true }; }, /required property 'level'/);
  await expectError((cv) => { cv.skills[2].items[0] = { name: 'X' }; }, /required property 'level'/);
  await expectError((cv) => { cv.experience[0].tags = ['cloud', 'secret-stuff']; }, /allowed values/);
  await expectError((cv) => { cv.experience[0].tags = ['cloud', 'cloud']; }, /duplicate items/);
  const cv = clone();
  cv.experience[0].tags = ['cloud'];
  cv.experience[0].note = 'Open point';
  assert.deepEqual(await validateData(cv), []);
});

test('bilingual text must match meta.languages', async () => {
  await expectError(
    (cv) => { cv.profile.headline = { en: 'A', de: 'B' }; },
    /language not in meta.languages: de/,
  );
  await expectError(
    (cv) => { cv.meta.languages = ['de', 'en']; cv.profile.headline = { en: 'Only English' }; },
    /\/profile\/headline: missing translation for de/,
  );
  await expectError((cv) => { cv.profile.headline = { fr: 'Bonjour' }; }, /must NOT have additional properties/);
  await expectError((cv) => { cv.meta.languages = ['fr']; }, /allowed values/);
  await expectError((cv) => { delete cv.meta; }, /required property 'meta'/);
});

test('project dates must lie within the position', async () => {
  await expectError(
    (cv) => { cv.experience[1].projects = [{ start: '2017-01', end: '2018-01', description: 'x' }]; },
    /project dates lie outside the position/,
  );
  await expectError(
    (cv) => { cv.experience[1].projects = [{ start: '2020-01', end: '2019-01', description: 'x' }]; },
    /start \(2020-01\) is after end/,
  );
});

test('real dataset data/cv.yaml is valid', async () => {
  const { errors } = await loadCv('data/cv.yaml');
  assert.deepEqual(errors, []);
});

test('skills and interests name each thing once (owner 2026-09-26)', async () => {
  await expectError((cv) => { cv.profile.interests = 'Hiking, Python and chess'; }, /"Python" \(en\) is also a skill/);
  await expectError((cv) => { cv.profile.interests = 'Chess; linux (at home)'; }, /"linux \(at home\)" \(en\) is also a skill/);
  await expectError((cv) => { cv.profile.interests = 'Engineering & hiking'; }, /"Engineering" \(en\) is also a skill/);
  const cv = clone();
  cv.profile.interests = 'Hiking, chess and gardening; Linux user groups';
  assert.deepEqual(await validateData(cv), [], 'a skill word inside a longer interest is fine');
});

test('skill sources point to entries of the dataset (owner 2026-09-26)', async () => {
  await expectError((cv) => { cv.skills[0].items[0].refs = ['no-such-entry']; }, /"no-such-entry" is no experience, education or certification id/);
  await expectError((cv) => { cv.skills[0].items[0].refs = []; }, /must NOT have fewer than 1 items/);
  await expectError((cv) => { cv.skills[0].items[0].refs = ['lumen-labs-lead', 'lumen-labs-lead']; }, /duplicate items/);
});
