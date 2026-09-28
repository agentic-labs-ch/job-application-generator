import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { assertNoImageMetadata, build, FONT_FILES } from '../../scripts/build.mjs';
import { onlyEntryScript } from './helpers.mjs';

const SENTINEL = 'SYNTHETIC-SENTINEL-4b1d-NOT-FOR-PUBLICATION';
const FONT_PATHS = FONT_FILES.map(([, file]) => `assets/fonts/${file}`).sort();
const ALLOWED_FILES = [...FONT_PATHS, 'assets/entry.js', 'assets/site.css', 'index.html'].sort();


async function listFiles(dir, prefix = '') {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await listFiles(join(dir, entry.name), rel)));
    else out.push(rel);
  }
  return out.sort();
}

// Text output (HTML, CSS) is scanned; font files must be byte-identical to the packages,
// so no data can travel inside them.
async function readAll(dir) {
  const files = await listFiles(dir);
  const textFiles = files.filter((f) => /\.(html|css|js)$/.test(f));
  if (files.includes('assets/entry.js')) {
    const built = await readFile(join(dir, 'assets/entry.js'));
    assert.ok(built.equals(await readFile('site/entry.js')), 'entry.js is an unmodified copy');
  }
  const contents = await Promise.all(textFiles.map((f) => readFile(join(dir, f), 'utf8')));
  for (const [pkg, file] of FONT_FILES) {
    if (!files.includes(`assets/fonts/${file}`)) continue;
    const built = await readFile(join(dir, 'assets/fonts', file));
    const source = await readFile(join('node_modules', pkg, 'files', file));
    assert.ok(built.equals(source), `${file} is an unmodified copy`);
  }
  const images = files.filter((f) => /^assets\/[^/]+\.(jpg|jpeg|png|webp)$/.test(f));
  for (const image of images) {
    assert.doesNotThrow(() => assertNoImageMetadata(readFileSync(join(dir, image)), image));
  }
  assert.deepEqual(
    files.filter((f) => !textFiles.includes(f) && !images.includes(f)),
    FONT_PATHS.filter((f) => files.includes(f)),
    'only allowlisted font and image files besides HTML and CSS',
  );
  return { files, text: contents.join('\n') };
}

test('example build writes only allowlisted files, no inline scripts or comments', async () => {
  const { outDir } = await build({ data: 'data/cv.example.yaml', out: '.cache/test-build/example' });
  const { files, text } = await readAll(outDir);
  assert.deepEqual(files, ALLOWED_FILES);
  const page = await readFile(join(outDir, 'index.html'), 'utf8');
  assert.ok(onlyEntryScript(page), 'only the external entry script');
  assert.ok(!page.includes('<!--'), 'no HTML comments');
  assert.ok(!text.includes(SENTINEL));
});

test('sentinel in YAML comments never reaches the output', async () => {
  const fixture = 'tests/fixtures/cv.sentinel-comment.yaml';
  assert.ok((await readFile(fixture, 'utf8')).includes(SENTINEL), 'fixture contains sentinel');
  const { outDir } = await build({ data: fixture, out: '.cache/test-build/sentinel' });
  const { files, text } = await readAll(outDir);
  assert.deepEqual(files, ALLOWED_FILES);
  assert.ok(text.includes('Sam Placeholder'), 'public content was rendered');
  assert.ok(!text.includes(SENTINEL), 'sentinel must not appear in output');
  assert.ok(!text.includes('4b1d'), 'no fragment of the sentinel either');
});

test('sentinel in an unknown field fails validation and builds nothing', async () => {
  const out = '.cache/test-build/unknown-field';
  await assert.rejects(
    build({ data: 'tests/fixtures/cv.sentinel-unknown-field.yaml', out }),
    (err) => {
      assert.match(err.message, /additional properties "private_notes"/);
      assert.ok(!err.message.includes(SENTINEL), 'error message does not echo the value');
      return true;
    },
  );
  await assert.rejects(stat(out), { code: 'ENOENT' });
});

test('real dataset builds one page per language, without notes or tags', async () => {
  const { outDir, files } = await build({ data: 'data/cv.yaml', out: '.cache/test-build/cv' });
  assert.deepEqual(
    files,
    [...FONT_PATHS, 'assets/portrait.jpg', 'assets/entry.js', 'assets/site.css', 'en/index.html', 'index.html'].sort(),
  );
  assert.deepEqual(await listFiles(outDir), files);
  await readAll(outDir);
  const de = await readFile(join(outDir, 'index.html'), 'utf8');
  const en = await readFile(join(outDir, 'en/index.html'), 'utf8');
  assert.match(de, /<html lang="de"[ >]/);
  assert.match(en, /<html lang="en"[ >]/);
  // Running head of printed pages 2 and later (read by @page in site/styles.css)
  assert.ok(de.includes('style="--running-head: &quot;Alex Muster · Lebenslauf&quot;"'), 'DE running head');
  assert.ok(en.includes('style="--running-head: &quot;Alex Muster · CV&quot;"'), 'EN running head');
  assert.ok(de.includes('href="en/index.html" hreflang="en"'), 'DE page links to EN');
  assert.ok(en.includes('href="../index.html" hreflang="de"'), 'EN page links to DE');
  assert.ok(en.includes('href="../assets/site.css"'));
  for (const page of [de, en]) {
    assert.ok(onlyEntryScript(page), 'only the external entry script');
    assert.ok(!page.includes('<!--'), 'no HTML comments');
    assert.ok(!/owner to (add|decide)|pending owner review/i.test(page), 'notes are never rendered');
    assert.ok(!/data-tags|\btags\b/.test(page), 'tags are never rendered');
    assert.ok(!page.includes(SENTINEL));
  }
});

test('portrait is published without metadata and with alt text in both languages', async () => {
  const { outDir } = await build({ data: 'data/cv.yaml', out: '.cache/test-build/cv-photo' });
  const de = await readFile(join(outDir, 'index.html'), 'utf8');
  const en = await readFile(join(outDir, 'en/index.html'), 'utf8');
  assert.match(de, /<img class="portrait" src="assets\/portrait\.jpg" alt="Porträt von [^"]+" width="480" height="600">/);
  assert.match(en, /<img class="portrait" src="\.\.\/assets\/portrait\.jpg" alt="Portrait of [^"]+"/);
  const image = await readFile(join(outDir, 'assets/portrait.jpg'));
  assert.doesNotThrow(() => assertNoImageMetadata(image, 'portrait.jpg'));
});

test('image metadata is refused', () => {
  assert.throws(() => assertNoImageMetadata(Buffer.from('\xff\xd8\xff\xe1..Exif\0\0MM', 'latin1'), 'x.jpg'), /metadata/);
  assert.throws(() => assertNoImageMetadata(Buffer.from('<x:xmpmeta xmlns:x="http://ns.adobe.com/xap/1.0/">', 'latin1'), 'x.jpg'), /metadata/);
});

test('refuses to write outside the project', async () => {
  await assert.rejects(build({ data: 'data/cv.example.yaml', out: '../outside' }), /inside the project/);
  await assert.rejects(build({ data: 'data/cv.example.yaml', out: '.' }), /inside the project/);
});
