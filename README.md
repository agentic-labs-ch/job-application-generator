# job-application-generator

A small generator for CVs and job applications. You write your CV once as a YAML file; it
renders a responsive, mobile-first website (German and English), role versions of the CV,
cover letters, applications for one job ad in the company's colours, and A4 PDFs.

*Ein kleiner Generator für Lebensläufe und Bewerbungen: Lebenslauf einmal als YAML-Datei
schreiben, daraus Website, Rollenversionen, Anschreiben, Bewerbungen und PDFs erzeugen.*

Free to use, change and share, for any purpose, with no attribution needed: [CC0 1.0](LICENSE).

## What is in here

- **Generator** (`scripts/`, `site/`, `schema/`): validates the data and renders static HTML.
  No server, no tracking, no external requests; fonts are self-hosted.
- **Sample data** (`data/`): the fictional person *Alex Muster* with a main CV, four role
  versions, keyword analyses, a coaching page and four applications to fictional companies,
  one per industry group (Beispielbank Karten AG, Globex Consulting, Nimbus Software, Kolibri
  People AG). `data/cv.example.yaml` holds
  a second, smaller fictional person, *Robin Muster*, used by the design system and the tests.
- **CV guide** (`docs/cv-guide.md`) and **rules by industry** (`docs/cv-guide/branchen/`):
  what goes into a CV and a motivation letter, keywords, section order and action verbs for
  four industry groups, with sources.
- **Design system "Granat"** (`DESIGN.md`, `design/`): tokens, components and the design
  decisions behind them (one typeface per page, at least 16 px text, 44 px targets, contrast
  4.5:1).
- **Checks** (`tests/`): unit tests and browser checks (Playwright: phone and desktop widths,
  no horizontal scroll, touch targets, axe accessibility rules, 200 % zoom, print page counts).

## Make your own

1. Click **Use this template** on GitHub (or fork), then clone your copy.
2. Install Node 22+ and run `npm ci`.
3. Replace the sample data in `data/` with your own: `data/cv.yaml` first (format in the schema
   `schema/cv.schema.json` and in `docs/profiles.md`, `docs/applications.md`). Replace
   `data/portrait.jpg` with your photo, or remove the `photo` block.
4. `npm run build` renders `dist/`; open `dist/index.html`. `npm run check` validates, builds
   and runs all tests.
5. Publish with GitHub Pages: in your repository settings, set Pages to "GitHub Actions". The
   workflow `.github/workflows/pages.yml` deploys every push to `main`.

Your data is public as soon as it is in a public repository or on GitHub Pages. Keep private
details (address, phone, date of birth) out unless you want them online.

## Commands

```sh
npm ci                  # install from the lockfile
npm run validate        # validate all data files
npm run build           # render dist/ (main CV, role versions, letters, pages, applications)
npm run build:example   # render dist-example/ from the small fictional dataset
npm run pdf             # print the pages of dist/ to A4 PDFs in .cache/pdf/
npm test                # unit tests and browser checks
npm run check           # all of the above
```

## About this repository

This repository is published automatically from a private repository, where the generator is
developed with real data. Every change there reaches this repository as one commit, with all
personal data replaced by the sample person and fictional companies. Changes made directly
here would be overwritten by the next sync, so please open an **issue** for bugs and ideas.

Third-party parts keep their own licences: the fonts (SIL Open Font License, installed from
npm via `@fontsource`) and the npm packages in `package.json`. Sources cited in the CV guide
and the industry rules belong to their authors.
