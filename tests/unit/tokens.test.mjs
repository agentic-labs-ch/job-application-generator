import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { generate, renderTokens } from '../../scripts/tokens.mjs';

// design/tokens.json is the design system's export, unchanged (docs/design-decisions.md);
// design/tokens.css is generated from it and never edited by hand.
test('tokens.css is generated from tokens.json', async () => {
  assert.equal(await readFile('design/tokens.css', 'utf8'), await generate(), 'run npm run tokens');
});

test('tokens.json is the exported version 3, unchanged', async () => {
  const json = await readFile('design/tokens.json');
  assert.equal(createHash('sha256').update(json).digest('hex'), '84cf5ec7506e89db33aa7de28f8a98609813cee95342f729277318fa4df5bb93');
  assert.ok(json.equals(await readFile('design/handoff/2026-09-26-cv-creator-phase-a/tokens.json')), 'same file as in the latest hand-off');
});

test('screen sizes run from 375 to 1440 px and end at the exported desktop value', async () => {
  const css = await generate();
  assert.match(css, /--font-size-h1: clamp\(2\.5rem, 2\.3239rem \+ 0\.7512vw, 3rem\);/);
  assert.match(css, /--font-size-h2: clamp\(1\.625rem, 1\.537rem \+ 0\.3756vw, 1\.875rem\);/);
  assert.match(css, /--font-size-body: 1\.0625rem;/);
  const json = JSON.parse(await readFile('design/tokens.json', 'utf8'));
  json.type.groups[0].styles[0].fontSize = '4rem';
  assert.throws(() => renderTokens(json), /does not end at 4rem/);
});

test('the website stays Granat on screen: other themes only in print (D5)', async () => {
  const css = await generate();
  const print = css.slice(css.indexOf('@media print {'));
  for (const id of ['petrol', 'indigo', 'tanne', 'ocker', 'marine', 'graphit']) {
    assert.ok(print.includes(`:root[data-sheet="${id}"]`), `${id} in the print block`);
    assert.ok(!css.slice(0, css.indexOf('@media print {')).includes(`data-sheet="${id}"`), `${id} not on screen`);
  }
});
