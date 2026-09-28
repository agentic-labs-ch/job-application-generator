import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, normalize, relative } from 'node:path';
import { loadDocument, parseYaml, validateDocument } from '../../scripts/lib/validate.mjs';
import { build } from '../../scripts/build.mjs';
import { mergeProfile, pdfName } from '../../scripts/lib/profiles.mjs';
import { onlyEntryScript } from './helpers.mjs';

const PROFILE = 'tests/fixtures/profiles/robin-lead.yaml';
const ARTICLE = 'tests/fixtures/pages/robin-notes.yaml';
const fixture = async (file) => parseYaml(await readFile(file, 'utf8')).data;
const profile = await fixture(PROFILE);
const article = await fixture(ARTICLE);

async function expectError(doc, file, mutate, pattern) {
  const data = structuredClone(doc);
  mutate(data);
  const { errors } = await validateDocument(data, file);
  assert.ok(errors.some((e) => pattern.test(e)), `expected ${pattern}, got: ${JSON.stringify(errors)}`);
}

async function htmlFiles(dir, prefix = '') {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await htmlFiles(join(dir, entry.name), rel)));
    else if (entry.name.endsWith('.html')) out.push(rel);
  }
  return out.sort();
}

// Every relative href and src in the built site must point to a file that exists. PDFs
// (pdf/<name>.pdf) are printed by pages.yml after the checks (scripts/pdf.mjs --linked): the link
// holds when it names, in data-pdf, a page that exists and whose PDF has that name.
async function assertLinksResolve(outDir) {
  const workflow = await readFile('.github/workflows/pages.yml', 'utf8');
  assert.ok(workflow.includes('node scripts/pdf.mjs --site dist --out dist/pdf --linked'), 'pages.yml prints the linked PDFs');
  for (const file of await htmlFiles(outDir)) {
    const page = await readFile(join(outDir, file), 'utf8');
    for (const [tag, href] of page.matchAll(/<[^>]*(?:href|src)="([^"#:]+)"[^>]*>/g)) {
      const target = normalize(join(dirname(join(outDir, file)), href));
      const pdf = relative(outDir, target).match(/^pdf\/([a-z0-9-]+\.pdf)$/);
      if (pdf) {
        const source = tag.match(/data-pdf="([^"]+)"/)?.[1];
        assert.ok(source, `${file}: ${href} names no page to print`);
        assert.equal(pdfName(source), pdf[1], `${file}: ${href} is printed from ${source}`);
        await assert.doesNotReject(stat(join(outDir, source)), `${file}: no page ${source} for ${href}`);
        continue;
      }
      await assert.doesNotReject(stat(target), `${file} links to missing ${href}`);
    }
  }
}

test('fixture profile and article are valid', async () => {
  assert.deepEqual((await loadDocument(PROFILE)).errors, []);
  assert.deepEqual((await loadDocument(ARTICLE)).errors, []);
});

test('profile: facts stay with the base dataset', async () => {
  await expectError(profile, PROFILE, (p) => { p.experience[0].id = 'no-such-job'; }, /not an experience id/);
  await expectError(profile, PROFILE, (p) => { p.experience[0].role = 'CEO'; }, /additional properties "role"/);
  await expectError(profile, PROFILE, (p) => { p.experience[0].start = '2020-01'; }, /additional properties "start"/);
  await expectError(profile, PROFILE, (p) => { p.experience[1].projects[0].end = '2021-01'; }, /base projects' number and dates/);
  await expectError(profile, PROFILE, (p) => { p.experience.push({ id: p.experience[0].id }); }, /duplicate entry/);
});

test('profile: every skill has a level and evidence from the base', async () => {
  await expectError(profile, PROFILE, (p) => { p.skills[0].items[0].evidence = ['made-up']; }, /unknown id "made-up"/);
  await expectError(profile, PROFILE, (p) => { delete p.skills[0].items[0].evidence; }, /required property 'evidence'/);
  await expectError(profile, PROFILE, (p) => { delete p.skills[0].items[0].level; }, /required property 'level'/);
  await expectError(profile, PROFILE, (p) => { delete p.letter; }, /unknown id "letter"/);
  await expectError(profile, PROFILE, (p) => { p.skills = p.skills.filter((g) => g.area !== 'personal'); }, /missing competency area\(s\): personal/);
  await expectError(profile, PROFILE, (p) => { p.skills[0].area = 'other'; }, /allowed values/);
});

test('profile: shape, languages and word limits', async () => {
  await expectError(profile, PROFILE, (p) => { p.usp.pop(); }, /must NOT have fewer than 3 items/);
  await expectError(profile, PROFILE, (p) => { p.id = 'assets'; }, /reserved/);
  await expectError(profile, PROFILE, (p) => { p.languages = ['de']; }, /not in the base meta.languages: de/);
  await expectError(profile, PROFILE, (p) => { p.headline = { de: 'A', en: 'B' }; }, /language not in meta.languages: de/);
  await expectError(profile, PROFILE, (p) => { p.summary = 'word '.repeat(131); }, /\/summary: 131 words/);
  await expectError(profile, PROFILE, (p) => { p.claim = 'word '.repeat(31); }, /\/claim: 31 words/);
  await expectError(profile, PROFILE, (p) => { p.letter.desire.push('word '.repeat(400)); }, /\/letter: body has \d+ words/);
  await expectError(profile, PROFILE, (p) => { p.letter.date = '2026-02-30'; }, /not a calendar date/);
  await expectError(profile, PROFILE, (p) => { p.job.url = 'javascript:alert(1)'; }, /url/i);
  await expectError(profile, PROFILE, (p) => { p.private_notes = 'x'; }, /additional properties "private_notes"/);
});

test('profile: a role version may bring its own photo', async () => {
  const photo = { src: 'portrait-2.jpg', alt: { en: 'Portrait' }, width: 480, height: 600 };
  const { errors } = await validateDocument({ ...structuredClone(profile), photo }, PROFILE);
  assert.deepEqual(errors, []);
  await expectError(profile, PROFILE, (d) => { d.photo = { ...photo, src: 'Portrait 2.jpg' }; }, /must match pattern/);
  const base = parseYaml(await readFile('data/cv.example.yaml', 'utf8')).data;
  const merged = mergeProfile(base, { ...profile, photo });
  assert.equal(merged.profile.photo.src, 'portrait-2.jpg');
  assert.equal(merged.profile.name, base.profile.name, 'everything else stays with the base');
  assert.equal(mergeProfile(base, profile).profile, base.profile, 'without a photo the base profile is used');
});

test('profile: base must be a dataset inside the repository', async () => {
  await expectError(profile, PROFILE, (p) => { p.base = '../../../../outside.yaml'; }, /inside the repository/);
  await expectError(profile, PROFILE, (p) => { p.base = '/etc/cv.yaml'; }, /must match pattern/);
  await expectError(profile, PROFILE, (p) => { p.base = '../../../data/missing.yaml'; }, /cannot read/);
});

test('article: tables and links are checked', async () => {
  await expectError(article, ARTICLE, (a) => { a.sections[0].blocks[1].table.rows[0].pop(); }, /2 cells, expected 3/);
  await expectError(article, ARTICLE, (a) => { a.sections[1].blocks[0].links[0].url = 'https://example.com/'; }, /exactly one of "page" or "url"/);
  await expectError(article, ARTICLE, (a) => { a.sections[1].blocks[0].links[0] = { label: 'x' }; }, /exactly one of "page" or "url"/);
  await expectError(article, ARTICLE, (a) => { a.sections[1].blocks[0].links[0].page = 'Bad Page'; }, /must match pattern/);
  await expectError(article, ARTICLE, (a) => { a.sections[0].blocks.push({ html: '<b>x</b>' }); }, /must match/);
});

test('build: role version, cover letter and article pages with working links', async () => {
  const { outDir, files } = await build({
    data: 'data/cv.example.yaml',
    profiles: 'tests/fixtures/profiles',
    pages: 'tests/fixtures/pages',
    out: '.cache/test-build/profiles',
  });
  for (const file of ['robin-lead/index.html', 'robin-lead/cover-letter/index.html', 'robin-notes/index.html']) {
    assert.ok(files.includes(file), `${file} is built`);
  }
  await assertLinksResolve(outDir);

  const main = await readFile(join(outDir, 'index.html'), 'utf8');
  const cv = await readFile(join(outDir, 'robin-lead/index.html'), 'utf8');
  const letter = await readFile(join(outDir, 'robin-lead/cover-letter/index.html'), 'utf8');
  const notes = await readFile(join(outDir, 'robin-notes/index.html'), 'utf8');
  assert.ok(!main.includes('noindex'), 'the main CV stays indexable');
  assert.ok(!main.includes('robin-lead'), 'the main CV does not link to role versions');
  for (const page of [cv, letter, notes]) {
    assert.ok(page.includes('<meta name="robots" content="noindex">'), 'tailored pages are noindex');
    assert.ok(onlyEntryScript(page) && !page.includes('<!--'), 'only the entry script, no comments');
    assert.ok(!/\bevidence\b|lumen-labs-lead,|level_proposed/.test(page), 'evidence is never rendered');
  }
  assert.ok(cv.includes('I turn invented monitoring problems'), 'claim');
  assert.ok(cv.includes('Leads an invented team'), 'tailored experience summary');
  assert.ok(cv.includes('Led the fictional migration of an imaginary ticketing system.'), 'tailored project');
  assert.ok(cv.includes('Wrote the internal handbook'), 'base highlights kept where not tailored');
  assert.ok(cv.includes('id="cv-languages"'), 'languages are part of the competency profile');
  assert.ok(cv.includes('Self-assessment on four levels'), 'legend');
  // Competency board: categories as rows, only the levels that occur as columns, key chips.
  const columns = [...cv.matchAll(/<th scope="col" role="columnheader">([^<]+)<\/th>/g)].map((m) => m[1]);
  assert.deepEqual(columns, ['Category', 'Specialist', 'Experienced', 'Some experience']);
  assert.ok(cv.includes('<li class="chip is-key">Imaginary platform design'), 'key skills are highlighted');
  assert.ok(cv.includes('<span class="visually-hidden"> (relevant for the role)</span>'), 'not colour only');
  const top = [...cv.matchAll(/<li class="top-skill">\s*<span class="top-skill-name">([^<]+)/g)].map((m) => m[1]);
  assert.deepEqual(top, ['Imaginary platform design', 'Mentoring'], 'key skills, highest level first');
  // Timeline: the years of the period at the role's level; the exact period under the
  // organisation, in every entry the same structure.
  assert.ok(cv.includes('<span class="timeline-span" aria-hidden="true">2018 – 2022</span>'), 'years of the period');
  assert.ok(/<span class="entry-period"><span class="entry-ref"><span class="entry-code">W2<\/span> · <\/span><time datetime="2018-09">09\/2018<\/time> – <time datetime="2022-03">03\/2022<\/time><\/span>/.test(cv));
  // Cross references: the top ten link to their evidence (owner 2026-09-26)
  const topTen = cv.slice(cv.indexOf('<ol class="top-skills">'), cv.indexOf('</ol>', cv.indexOf('<ol class="top-skills">')));
  assert.match(topTen, /<a class="ref" href="#cv-lumen-labs-lead" aria-label="W1: Lumen Labs \(fictional\)">W1<\/a>/);
  // Rule 2: the target role under the name; in every entry the title comes first and the period
  // follows on the organisation's line.
  assert.ok(/<h1>[^<]+<\/h1>\s*<p class="target-role">Application: Fictional Platform Lead<\/p>/.test(cv), 'target role under the name');
  const entries = [...cv.matchAll(/<li class="entry" id="cv-[^"]+">\s*([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  assert.ok(entries.length > 0);
  for (const entry of entries) {
    assert.match(entry, /^<h3 class="entry-title">/, 'title first in every entry');
    assert.ok(!entry.includes('entry-dates'), 'no date line above the title');
  }
  // The legend opens the competency block (owner 2026-09-26: the scale before the skills).
  const skills = cv.slice(cv.indexOf('id="skills"'), cv.indexOf('id="cv-languages"'));
  assert.ok(skills.indexOf('skill-legend') < skills.indexOf('top-skill') && skills.indexOf('skill-legend') < skills.indexOf('skill-board'), 'legend before the skills');
  const sideLegend = cv.indexOf('class="side-legend"');
  assert.ok(sideLegend > 0 && sideLegend < cv.indexOf('class="side-group"'), 'print sidebar: legend before the groups');
  // Print sidebar (layout 1a): the competency groups with dots, no ids and no links, since it
  // repeats facts shown on screen and stays hidden there.
  const side = cv.match(/<aside class="print-side">([\s\S]*?)<\/aside>/)?.[1];
  assert.ok(side, 'role versions carry the print sidebar');
  assert.ok(!/\sid=|<a\s/.test(side), 'no ids and no links in the print sidebar');
  assert.ok(side.includes('class="level-dots"') && side.includes('Imaginary platform design'), 'skills with dots');
  assert.ok(!main.includes('print-side'), 'the main CV prints without a sidebar');
  assert.ok(main.includes('<div class="skill-legend">'), 'the main CV explains the dot scale');
  assert.ok(cv.includes('href="cover-letter/index.html"'), 'CV links to the letter');
  assert.ok(letter.includes('<time datetime="2026-09-23">23 September 2026</time>'), 'letter date');
  assert.ok(letter.includes('aria-current="page"'), 'current document is marked');
  assert.ok(notes.includes('href="../robin-lead/cover-letter/index.html"'), 'page references resolve');
});

test('build: omit leaves base sections out of a role version only', async () => {
  const data = structuredClone(profile);
  data.omit = ['certifications'];
  const { mkdir, writeFile, rm } = await import('node:fs/promises');
  const YAML = (await import('yaml')).default;
  const dir = '.cache/test-build/omit-profiles';
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  delete data.letter;
  data.skills.forEach((g) => g.items.forEach((i) => { i.evidence = i.evidence.filter((e) => e !== 'letter'); if (!i.evidence.length) i.evidence = ['lumen-labs-lead']; }));
  data.base = '../../../data/cv.example.yaml';
  await writeFile(join(dir, 'robin-lead.yaml'), YAML.stringify(data));
  const { outDir } = await build({ data: 'data/cv.example.yaml', profiles: dir, out: '.cache/test-build/omit-out' });
  const version = await readFile(join(outDir, 'robin-lead/index.html'), 'utf8');
  const main = await readFile(join(outDir, 'index.html'), 'utf8');
  assert.ok(!version.includes('id="certifications"'), 'certifications left out of the role version');
  assert.ok(!version.includes('Placeholder Cloud Foundations'));
  assert.ok(main.includes('id="certifications"'), 'the main CV keeps them');
  await expectError(profile, PROFILE, (p) => { p.omit = ['experience']; }, /allowed values/);
});

test('build: rejects unknown page references and mismatched bases', async () => {
  const { mkdir, writeFile, rm } = await import('node:fs/promises');
  const dir = '.cache/test-build/bad-pages';
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  const bad = structuredClone(article);
  bad.base = '../../../data/cv.example.yaml';
  bad.sections[1].blocks[0].links[0].page = 'nowhere';
  const YAML = (await import('yaml')).default;
  await writeFile(join(dir, 'bad.yaml'), YAML.stringify(bad));
  await assert.rejects(
    build({ data: 'data/cv.example.yaml', pages: dir, out: '.cache/test-build/bad-out' }),
    /unknown page reference "nowhere"/,
  );
  await assert.rejects(
    build({ data: 'tests/fixtures/cv.long-text.yaml', pages: 'tests/fixtures/pages', out: '.cache/test-build/bad-out' }),
    /but the build uses/,
  );
});

test('real role versions and pages are valid and build with working links', async () => {
  const { outDir, files } = await build({
    data: 'data/cv.yaml',
    profiles: 'data/profiles',
    pages: 'data/pages',
    out: '.cache/test-build/cv-all',
  });
  assert.ok(files.includes('index.html') && files.includes('en/index.html'));
  await assertLinksResolve(outDir);
  // Role versions show their own photo where they have one, else the base photo.
  const base = parseYaml(await readFile('data/cv.yaml', 'utf8')).data;
  for (const name of (await readdir('data/profiles')).filter((n) => n.endsWith('.yaml'))) {
    const doc = parseYaml(await readFile(join('data/profiles', name), 'utf8')).data;
    const page = await readFile(join(outDir, doc.id, 'index.html'), 'utf8');
    const src = (doc.photo ?? base.profile.photo).src;
    assert.ok(page.includes(`class="portrait" src="../assets/${src}"`), `${doc.id}: header shows ${src}`);
    assert.ok(page.includes(`class="side-portrait" src="../assets/${src}"`), `${doc.id}: print sidebar shows ${src}`);
  }
  for (const file of files.filter((f) => f.endsWith('.html'))) {
    const page = await readFile(join(outDir, file), 'utf8');
    assert.ok(onlyEntryScript(page) && !page.includes('<!--'), `${file}: only the entry script, no comments`);
    assert.ok(!/owner to (add|decide)|pending owner review/i.test(page), `${file}: notes are never rendered`);
    assert.ok(!page.includes('ß'), `${file}: Swiss spelling (ss)`);
  }
});
