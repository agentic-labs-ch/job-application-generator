import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { loadDocument, parseYaml, validateDocument } from '../../scripts/lib/validate.mjs';
import { build } from '../../scripts/build.mjs';
import { brandTokens, contrast, MIN_CONTRAST } from '../../scripts/lib/brand.mjs';
import { APPLICATION_SECTIONS, applicationPdfName } from '../../site/templates.mjs';
import { ONE_PIECE_WIDTH, printPdfs } from '../../scripts/pdf.mjs';
import { onlyEntryScript } from './helpers.mjs';

const APP = 'tests/fixtures/applications/robin-application.yaml';
const app = parseYaml(await readFile(APP, 'utf8')).data;

async function expectError(mutate, pattern) {
  const data = structuredClone(app);
  mutate(data);
  const { errors } = await validateDocument(data, APP);
  assert.ok(errors.some((e) => pattern.test(e)), `expected ${pattern}, got: ${JSON.stringify(errors)}`);
}

test('fixture application is valid', async () => {
  assert.deepEqual((await loadDocument(APP)).errors, []);
});

test('application: facts stay with the base dataset', async () => {
  await expectError((a) => { a.experience[0].id = 'no-such-job'; }, /not an experience id/);
  await expectError((a) => { a.experience[0].role = 'CEO'; }, /additional properties "role"/);
  await expectError((a) => { a.experience[1].highlights = ['Invented']; }, /compact position/);
  await expectError((a) => { a.education[0].id = 'no-such-school'; }, /not an education id/);
  await expectError((a) => { a.experience[0].highlights = ['a', 'b', 'c', 'd', 'e', 'f']; }, /must NOT have more than 5 items/);
});

test('application: the job ad decides, and gaps are declared', async () => {
  await expectError((a) => { delete a.job; }, /required property 'job'/);
  await expectError((a) => { a.job.requirements = a.job.requirements.slice(0, 2); }, /must NOT have fewer than 3 items/);
  await expectError((a) => { delete a.job.requirements[2].gap; }, /requirements\/2: no evidence; name the gap/);
  await expectError((a) => { a.job.requirements[0].evidence = ['made-up']; }, /unknown id "made-up"/);
  await expectError((a) => { a.strengths[0].evidence = ['made-up']; }, /strengths\/0\/evidence: unknown id "made-up"/);
  await expectError((a) => { a.knowledge[0].evidence = ['made-up']; }, /knowledge\/0\/evidence: unknown id "made-up"/);
});

test('application: exactly three strengths, one language, word limits', async () => {
  await expectError((a) => { a.strengths.pop(); }, /must NOT have fewer than 3 items/);
  await expectError((a) => { a.strengths.push(a.strengths[0]); }, /must NOT have more than 3 items/);
  await expectError((a) => { a.language = 'de'; }, /"de" is not in the base meta.languages/);
  await expectError((a) => { a.headline = { de: 'A', en: 'B' }; }, /language not in meta.languages: de/);
  await expectError((a) => { a.profile = 'word '.repeat(111); }, /\/profile: 111 words/);
  await expectError((a) => { a.strengths[1].text = 'word '.repeat(46); }, /strengths\/1\/text: 46 words/);
  await expectError((a) => { a.letter.desire.push('word '.repeat(400)); }, /\/letter: body has \d+ words/);
  await expectError((a) => { a.id = 'assets'; }, /reserved/);
});

test('application: company colours must pass the contrast rules', async () => {
  await expectError((a) => { a.brand.paper = 'black'; }, /must match pattern/);
  await expectError((a) => { a.brand.ink = '#3b4a5c'; }, /brand: ink #3b4a5c on paper #0d1b2a is .*:1 \(min\. 7:1\)/);
  await expectError((a) => { a.brand.accentText = '#1e3a8a'; }, /brand: accentText #1e3a8a reaches only/);
  await expectError((a) => { a.brand.marks = ['#111111', '#222222', '#333333', '#444444', '#555555']; }, /must NOT have more than 4 items/);
});

test('brand: derived tokens reach WCAG AA on every surface', () => {
  const brands = [
    { paper: '#000000', ink: '#ffffff', accent: '#ff9f1c' },
    { paper: '#ffffff', ink: '#000000', accent: '#0b5d6b' },
    { paper: '#ffffff', ink: '#242424', accent: '#3b4bc8', marks: ['#e4572e', '#2a9d8f', '#2b7bb9', '#e9c46a'] },
    { paper: '#f6f2ee', ink: '#241f1b', accent: '#ffcc00' },
  ];
  for (const brand of brands) {
    const { tokens, errors } = brandTokens(brand);
    assert.deepEqual(errors, []);
    for (const ground of ['--color-bg', '--color-surface', '--color-surface-sunk']) {
      assert.ok(contrast(tokens['--color-text-muted'], tokens[ground]) >= MIN_CONTRAST.muted, `muted on ${ground}`);
      assert.ok(contrast(tokens['--color-text-faint'], tokens[ground]) >= MIN_CONTRAST.faint, `faint on ${ground}`);
      assert.ok(contrast(tokens['--color-accent'], tokens[ground]) >= MIN_CONTRAST.text, `accent text on ${ground}`);
    }
    assert.ok(contrast(tokens['--color-on-accent'], tokens['--color-accent']) >= MIN_CONTRAST.text, 'text on the accent fill');
    assert.ok(contrast(tokens['--brand-mark'], tokens['--color-bg']) >= MIN_CONTRAST.mark, 'marks');
  }
  // A light accent on light paper is moved towards the ink for text, the marks keep 3:1.
  const yellow = brandTokens({ paper: '#ffffff', ink: '#111111', accent: '#ffcc00' }).tokens;
  assert.notEqual(yellow['--color-accent'], '#ffcc00');
  assert.ok(contrast(yellow['--brand-mark'], '#ffffff') >= 3);
});

test('build: application page follows the CV guide order, with the letter last', async () => {
  const { outDir, files } = await build({
    data: 'data/cv.example.yaml',
    applications: 'tests/fixtures/applications',
    out: '.cache/test-build/applications',
  });
  assert.ok(files.includes('robin-application/index.html'));
  const page = await readFile(join(outDir, 'robin-application/index.html'), 'utf8');
  const main = await readFile(join(outDir, 'index.html'), 'utf8');

  // Sections in the order of docs/cv-guide.md; contact and letter at the end.
  const order = [...page.matchAll(/<section id="([a-z]+)" class="section"/g)].map((m) => m[1]);
  assert.deepEqual(order, APPLICATION_SECTIONS);
  // No contact details in the header: they close the CV.
  const header = page.match(/<header class="site-header">([\s\S]*?)<\/header>/)[1];
  assert.ok(!header.includes('mailto:') && !header.includes('link-list'), 'no contact links in the header');
  assert.ok(header.includes('<p class="target-role">Application: Fictional Observability Lead</p>'));
  assert.ok(page.includes('href="mailto:robin.muster@example.com"'), 'contact at the end');
  // The key strengths, compact older positions and the keywords.
  assert.equal([...page.matchAll(/<li class="strength">/g)].length, 3);
  const compact = page.match(/<li class="timeline-item is-compact" id="cv-north-point-intern">([\s\S]*?)<\/li>/)?.[1];
  assert.ok(compact, 'older positions can be compact');
  assert.ok(compact.includes('Engineering Intern') && !/highlights|projects|entry-summary/.test(compact), 'date, role and organisation only');
  assert.ok(page.includes('<dd>Linux, Automation, Observability</dd>'));
  assert.ok(page.includes('Invented thesis on imaginary monitoring.'), 'tailored education sentence');
  // Company colours on this page only, as a style attribute; the main CV keeps Granat.
  assert.match(page, /<html lang="en" style="color-scheme: dark; --color-bg: #0d1b2a;[^"]*--brand-stripe: linear-gradient\(90deg, #e63946 /);
  assert.ok(!main.includes('--color-bg'), 'the main CV is not themed');
  // Letter: sender, recipient, subject, and never the analysis behind the page.
  assert.ok(page.includes('<p class="letter-sender"><span class="letter-sender-name">Robin Muster</span>'));
  assert.ok(page.includes('<h3 id="letter-subject" class="letter-subject">Application as Fictional Observability Lead 100%</h3>'));
  for (const hidden of ['requirements', 'Certification in a made-up observability product', 'No such certificate', 'Invented colours for tests', 'Fictional test data', 'lumen-labs-lead,']) {
    assert.ok(!page.includes(hidden), `${hidden} is never rendered`);
  }
  assert.ok(page.includes('<meta name="robots" content="noindex">'));
  assert.ok(onlyEntryScript(page) && !page.includes('<!--'));
  assert.ok(!main.includes('robin-application'), 'the main CV does not link to applications');
});

test('real applications are valid, one language each, and name the job ad', async () => {
  const names = (await readdir('data/applications')).filter((n) => n.endsWith('.yaml'));
  assert.ok(names.length >= 1);
  const { outDir, files } = await build({
    data: 'data/cv.yaml',
    profiles: 'data/profiles',
    pages: 'data/pages',
    applications: 'data/applications',
    out: '.cache/test-build/cv-applications',
  });
  for (const name of names) {
    const file = join('data/applications', name);
    assert.deepEqual((await loadDocument(file)).errors, [], file);
    const doc = parseYaml(await readFile(file, 'utf8')).data;
    const page = await readFile(join(outDir, doc.id, 'index.html'), 'utf8');
    assert.ok(page.startsWith(`<!doctype html>\n<html lang="${doc.language}"`), `${doc.id}: page language`);
    assert.ok(page.includes(doc.job.company), `${doc.id}: names the company`);
    assert.ok(!page.includes('ß'), `${doc.id}: Swiss spelling (ss)`);
    assert.ok(!/owner review|gaps not claimed/i.test(page), `${doc.id}: notes are never rendered`);
    // pages.yml prints data/applications/<file>.yaml to pdf/<file>.pdf: the link holds when the
    // id is the file name.
    assert.equal(`${doc.id}.yaml`, name, `${file}: id must equal the file name`);
    assert.ok(page.includes(`href="../pdf/${doc.id}.pdf" download="`), `${doc.id}: PDF link`);
    assert.ok(page.includes(`data-pdf="${doc.id}/index.html" data-pdf-mode="one-piece"`), `${doc.id}: printed as one piece`);
  }
  // pages.yml prints every linked PDF; the application's link names its page as one piece.
  const pages = await readFile('.github/workflows/pages.yml', 'utf8');
  assert.ok(pages.includes('node scripts/pdf.mjs --site dist --out dist/pdf --linked'));
  // The CV guide's course material (docs/cv-guide/) is for the owner only: never published.
  assert.ok(!files.some((f) => f.endsWith('.pdf') || f.startsWith('docs/')), 'no course material in the site');
  const workflow = await readFile('.github/workflows/pages.yml', 'utf8');
  assert.ok(!workflow.includes('docs/'), 'pages.yml publishes nothing from docs/');
});

test('application PDF: file name after the CV guide, one piece like the desktop view', async () => {
  assert.equal(
    applicationPdfName('Alex Muster', 'Bewerbung', 'Beispielbank Karten AG', 'Senior Cloud Architect 80–100%'),
    'Alex-Muster_Bewerbung_Beispielbank-Karten-AG_Senior-Cloud-Architect-80-100.pdf',
  );
  const { outDir } = await build({
    data: 'data/cv.example.yaml',
    applications: 'tests/fixtures/applications',
    out: '.cache/test-build/applications-pdf',
  });
  const [result] = await printPdfs({ site: outDir, out: join(outDir, 'pdf'), pages: ['robin-application/index.html'], onePiece: true });
  assert.equal(result.pages, 1, 'one single page');
  const pdf = (await readFile(result.file)).toString('latin1');
  const box = pdf.match(/\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/);
  assert.ok(box, 'media box');
  assert.equal(Math.round(Number(box[1])), ONE_PIECE_WIDTH * 0.75, 'desktop width (1440 px = 1080 pt)');
  assert.ok(Number(box[2]) > 2000, 'as long as the page, not A4');
});
