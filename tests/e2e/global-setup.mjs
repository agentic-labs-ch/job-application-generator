import { build } from '../../scripts/build.mjs';

// Builds are written to .cache/ (gitignored); pages are opened via file:// (no server).
export default async function globalSetup() {
  await build({
    data: 'data/cv.example.yaml',
    profiles: 'tests/fixtures/profiles',
    pages: 'tests/fixtures/pages',
    applications: 'tests/fixtures/applications',
    out: '.cache/e2e/example',
  });
  await build({ data: 'tests/fixtures/cv.long-text.yaml', out: '.cache/e2e/long-text' });
  await build({
    data: 'data/cv.yaml',
    profiles: 'data/profiles',
    pages: 'data/pages',
    applications: 'data/applications',
    out: '.cache/e2e/cv',
  });
}
