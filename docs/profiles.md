# Role versions, cover letters and articles

Applications for a specific job ad (CV and motivation letter on one page, in the company's
colours) have their own format: see `docs/applications.md`. The content rules for every CV are
in `docs/cv-guide.md`.

`data/cv.yaml` stays the master dataset. Tailored pages are small files next to it. Each one
names its base dataset and is validated against it (`npm run validate`). Everything in these
files is public once merged into `main`, except `note` and `evidence` (never rendered, but not
confidential either). Rules from `docs/source-of-truth.md` apply unchanged.

| File | Kind | URL (DE / EN) |
|---|---|---|
| `data/profiles/<id>.yaml` | `profile`: tailored CV (+ optional cover letter) | `/<id>/`, `/<id>/en/` |
| same file, `letter:` block | cover letter | `/<id>/anschreiben/`, `/<id>/en/cover-letter/` |
| `data/pages/<id>.yaml` | `article`: text page (analysis, coaching notes) | `/<id>/`, `/<id>/en/` |

Tailored pages are not linked from the main CV and carry `noindex`; they are meant to be sent
as a direct link.

## Text values

A text is either one plain string (used for every page language) or an object with exactly
the page languages, e.g. `{ de: "…", en: "…" }`. German texts use Swiss spelling (`ss`, never
`ß`). A profile or article with `languages: [de]` renders German only; plain strings are
enough there.

## Profile (`kind: profile`)

```yaml
kind: profile
base: ../cv.yaml              # path to the base CV dataset, relative to this file
id: ict-architect             # URL slug; not "assets", "en" or "de"; unique across profiles/pages
languages: [de, en]           # optional, subset of the base meta.languages (default: all)
omit: [certifications]        # optional: base sections left out (certifications, activities, interests)
photo: { src: portrait-2.jpg, alt: { de: "…", en: "…" }, width: 480, height: 600 }
                              # optional own portrait (file next to the base dataset, no metadata)
target: { de: ICT-Architekt, en: ICT Architect }   # role this version targets (title, meta)
headline: { de: "…", en: "…" }                     # positioning line under the name
claim: { de: "…", en: "…" }                        # USP in one sentence (max. 30 words)
summary: { de: "…", en: "…" }                      # Kurzprofil, 50–130 words per language
usp:                                               # exactly three statements
  - title: { de: Wofür ich stehe, en: What I stand for }
    text: { de: "…", en: "…" }
  - title: { de: Zusammenarbeit mit mir, en: Working with me }
    text: { de: "…", en: "…" }
  - title: { de: Was Sie erwarten können, en: What you can expect }
    text: { de: "…", en: "…" }
experience:                   # optional tailoring; every base position is always shown
  - id: bkb                   # a base experience id
    summary: { de: "…", en: "…" }       # optional: one sentence, role-relevant focus
    highlights:                          # optional: replaces the base highlights
      - { de: "…", en: "…" }
    projects:                            # optional: same number and dates as the base projects
      - { start: 2019-10, end: 2020-10, description: { de: "…", en: "…" } }
skills:                       # competency profile; replaces the base skill groups on this page
  - id: ita-architecture      # unique within the file
    area: domain              # domain | technology | method | personal (all but domain required)
    name: { de: Architektur, en: Architecture }
    items:
      - name: Enterprise Architecture          # string or { de, en }
        level: 4                               # 1 Grundkenntnisse, 2 Erste Erfahrung, 3 Erfahren, 4 Spezialist
        level_proposed: true                   # self-assessment proposal until the owner confirms
        key: true                              # relevant for the role: highlighted; the first ten
                                               # (highest level first) form the top list
        evidence: [bkb, beispiel-hochschule-bsc]              # base ids (experience, education, certifications,
                                               # activities) or "letter"; never rendered
job:                          # optional: the job ad this page answers
  title: "IT Business Service Manager 100% (m/w/d)"
  company: Example AG
  location: Zürich
  url: https://example.com/job
  published: 2026-09-09
letter:                       # optional: cover letter (AIDA), same header as the CV
  date: 2026-09-23
  place: Zürich
  recipient: ["Example AG", "Personalabteilung", "Beispielstrasse 1", "8000 Zürich"]
  subject: "Bewerbung als …"
  salutation: "Sehr geehrte Damen und Herren"
  attention: ["…"]            # A: opening that earns attention (no "hiermit bewerbe ich mich")
  interest: ["…"]             # I: why this company and role; what connects me to the challenge
  desire:                     # D: proof: evidence that matches the requirements
    - "…"
    - points: ["…", "…"]      # optional bullet list
  action: ["…"]               # A: call to action
  closing: "Freundliche Grüsse"
  enclosures: "Lebenslauf, Arbeitszeugnisse, Diplome"
note: "…"                     # optional, never rendered
```

Rules enforced by the validator:

- `base` resolves to a valid CV dataset inside the repository; `languages` is a subset of its
  `meta.languages`; every text has exactly the page languages.
- Experience ids exist in the base; `projects` keep the base count and dates.
- Every skill has a `level` and at least one `evidence` id that exists in the base (or
  `letter` when the file has a letter). Areas `technology`, `method` and `personal` are required.
- `usp` has exactly three entries. `summary` has at most 130 words, `claim` at most 30 words,
  the letter body (attention to action) at most 350 words per language (one A4 page).

Page structure (tailored CV): header with photo, the target role ("Bewerbung als …" from
`target`) above the name and the headline, then Profil (claim, summary, USP), Kompetenzen
(legend, the ten key skills as bars, the board of categories × levels, then Sprachen from the
base), Berufserfahrung, Ausbildung, Zertifizierungen, Engagement and Interessen (each unless
omitted).

Print (A4, `DESIGN.md` "Print"): a sidebar with photo, contact, the competency groups
as rows with dots, Sprachen and Interessen beside the main column with target role, name,
headline, claim, Profil, Berufserfahrung and Ausbildung (then Engagement and Zertifizierungen
if not omitted). The USP statements, the top ten and the board are screen-only.

## Article (`kind: article`)

```yaml
kind: article
base: ../cv.yaml
id: coaching
languages: [de]
title: "…"
lead: "…"                     # intro paragraph
sections:
  - heading: "…"
    blocks:
      - "A paragraph."
      - list: ["…", "…"]                        # bullet list
      - steps: ["…", "…"]                       # numbered list
      - table:                                  # small tables; stacked on narrow screens
          columns: ["Anforderung", "Nachweis", "Stufe"]
          rows:
            - ["…", "…", "…"]
      - links:                                  # internal pages or external URLs
          - { label: "Lebenslauf ICT-Architekt", page: ict-architect }
          - { label: "Anschreiben Beispiel Automobile", page: beispiel-automobile/letter }
          - { label: "Inserat", url: "https://…" }
note: "…"
```

`page` values: `cv` (main CV), a profile id, `<profile id>/letter`, or an article id.
