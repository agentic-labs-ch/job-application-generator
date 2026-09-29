# CLAUDE.md

CV and job application generator: a YAML dataset in `data/` becomes a responsive, mobile-first
static website with role versions, cover letters, applications and A4 PDFs.

## Boundaries

- This repository is synchronised automatically from a private repository. Do not change files
  here to fix the generator: every sync overwrites them. Report the change as an issue instead.
- In your own copy (template or fork), `data/` holds your CV. Anything in a public repository
  or on GitHub Pages is public: no address, phone or date of birth unless the owner wants them
  online.
- Design: `DESIGN.md` and `design/`. Never edit `design/tokens.css` by hand: `npm run tokens`
  generates it from `design/tokens.json`.
- Before writing CV, application or letter content, read `docs/cv-guide.md` and, for the
  industry, `docs/cv-guide/branchen/`. Every application starts from a job ad
  (`docs/applications.md`).
- Tests use fictional data only (`data/cv.example.yaml`, `tests/fixtures/`).
- Never put credentials or API keys in the repository.
- Default output is HTML; make PDFs (`scripts/pdf.mjs`) when a document is sent.
- Run `npm run check` before pushing.

## File map

| Path | Purpose |
|---|---|
| `SETUP.md` | Own copy: download, own repository, install, publish; prompt for a coding agent |
| `data/cv.yaml` | Main CV dataset (sample person Alex Muster) |
| `data/profiles/`, `data/pages/`, `data/applications/` | Role versions (+ cover letter), text pages, applications (formats in `docs/profiles.md`, `docs/applications.md`) |
| `data/cv.example.yaml`, `tests/fixtures/` | Small fictional dataset (Robin Muster) for tests and design samples |
| `schema/*.schema.json` | Validation of every data file (cross-field rules in `scripts/lib/validate.mjs`, colours in `scripts/lib/brand.mjs`) |
| `docs/cv-guide.md`, `docs/cv-guide/branchen/` | CV guide and rules by industry, with sources |
| `DESIGN.md`, `design/` | Design system "Granat": rules, tokens, hand-offs |
| `site/`, `scripts/` | Templates, styles, fonts; build, validate, PDF, screenshots |
| `tests/` | Unit tests and Playwright checks |
| `.github/workflows/` | `check.yml` (checks), `pages.yml` (deploy `dist/` to GitHub Pages from `main`) |
