#!/usr/bin/env node
// Usage: node scripts/validate.mjs <file.yaml | directory> [...]
// Validates CV datasets, role versions (kind: profile), text pages (kind: article) and
// applications (kind: application).
// A directory argument validates every .yaml file in it (not recursive).
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { loadDocument } from './lib/validate.mjs';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/validate.mjs <file.yaml | directory> [...]');
  process.exit(2);
}

const files = [];
for (const arg of args) {
  if ((await stat(arg)).isDirectory()) {
    const names = (await readdir(arg)).filter((n) => /\.ya?ml$/.test(n)).sort();
    files.push(...names.map((n) => join(arg, n)));
  } else {
    files.push(arg);
  }
}

let failed = false;
for (const file of files) {
  const { errors } = await loadDocument(file);
  if (errors.length > 0) {
    failed = true;
    console.error(`✗ ${file}`);
    for (const e of errors) console.error(`  ${e}`);
  } else {
    console.log(`✓ ${file}`);
  }
}
process.exit(failed ? 1 : 0);
