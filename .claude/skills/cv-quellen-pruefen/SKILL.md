---
name: cv-quellen-pruefen
description: Checks CV, role version, application or letter content against the owner's sources (docs/cv-guide.md with the course material, docs/source-of-truth.md, docs/applications.md, docs/profiles.md). Use before and after writing or changing content in data/, and when the owner asks whether the rules were applied. Reports findings; changes no facts.
---

# Check that the sources were applied (cv-quellen-pruefen)

The owner built this project on a CV guide and course material (docs/cv-guide.md, docs/cv-guide/).
Every CV, role version, application and letter must follow them. This skill checks one document
or the whole dataset and reports what does not follow the rules. It never adds, removes or
rewrites facts: facts need the owner's approval (CLAUDE.md, docs/source-of-truth.md).

## Read first

1. `docs/cv-guide.md`: order of the CV, what goes where, entries, skills, letter (AIDA, one A4
   page, at most 350 words), the checklist "Before sending".
2. `docs/source-of-truth.md`: approval and privacy rules (no private data by default).
3. `docs/applications.md` or `docs/profiles.md` for the document type.
4. `docs/design-decisions.md`: owner decisions that override the design system (order of the main
   CV, entry structure, legend first, cross references).

## Check

For each rule, look at the data (`data/cv.yaml`, `data/profiles/*.yaml`,
`data/applications/*.yaml`) and at the built page (`npm run build`, then `dist/`):

- **Order:** important first. Main CV: profile, career, experience, skills, interests, then
  certificates, education, languages, activities. Applications: profile, three strengths, career,
  experience, then the rest, contact and letter at the end (docs/cv-guide.md, section 2).
- **Profile:** three to five sentences, at most 110 words, degree, years and fields, strongest
  proof, hard and soft skills.
- **Entries:** newest first; title, "organisation, place", period `MM.YYYY – MM.YYYY`; results
  before duties; one idea per point; numbers only as the references give them.
- **Skills:** every skill rated (schema); sources (`refs`, `evidence`) point to real entries;
  list the skills without a source for the owner (a skill should match the experience).
- **Languages:** levels from the guide (Grundkenntnisse, Gute Kenntnisse, Fliessend,
  Muttersprache); CEFR only with a certificate.
- **Applications and letters:** the job ad is the start; every must-requirement is answered by
  profile, strengths or letter; letter body at most 350 words on one page; Swiss business letter
  form; AIDA; no "Hiermit bewerbe ich mich"; what I bring, not what I want to learn.
- **Say each thing once:** run the skill `cv-doppelungen-pruefen`.
- **Privacy:** no address, phone, date of birth or other private data unless the owner approved
  it for that page.
- **Spelling:** Swiss spelling (ss, never ß).

Run `npm run validate` and `npm run check:duplicates` as part of the check.

## Report

A short list for the owner, in German, one line per finding:

`Regel (Quelle, Abschnitt) · Stelle (Datei und Pfad) · Befund · Vorschlag`

Sort by importance: rule breaks in published content first, then open proposals. Say which
findings need the owner's decision (facts, private data, wording) and which are mechanical.
Do not fix facts yourself; mechanical fixes (order, format) only in a branch with a PR.
