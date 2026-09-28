# Applications

An application is the CV and motivation letter for one job ad, on one page, in the order of
the CV guide (`docs/cv-guide.md`) and in the company's colours. It lives in
`data/applications/<id>.yaml`, next to the base dataset, and renders to `/<id>/` in the ad's
language. The page is `noindex` and is not linked from the main CV; send it as a direct link.
Its bar has a PDF download: the desktop view on one long page, like the HTML, printed by
`pages.yml` into `pdf/<id>.pdf` (so the file name must be the id). HTML first: make other PDFs
only on request (`npm run pdf`, A4 sheets).

Everything in the file is public once it is merged into `main`, except `note`, `evidence`,
`job.requirements` and `brand.source`. Those are never rendered, but they are not
confidential either. The rules in `docs/source-of-truth.md` apply unchanged: an application
selects and words approved facts and never changes employers, titles or dates (the validator
keeps those with the base).

## Workflow

1. Save the job ad. Write its requirements into `job.requirements`, each marked `must` or
   `plus`, with the base entries that prove it (`evidence`) and a `gap` note where the proof
   is missing or partial. The validator refuses a must-requirement with no evidence and no
   gap.
2. Choose the three key strengths and the highlights that answer the must-requirements. Use
   `compact` for positions older than about four years.
3. Write the profile (at most 110 words), the strengths (at most 45 words each) and the
   letter (AIDA, body at most 350 words). Use the language of the ad.
4. Take the company's colours from its website or the ad (`brand`). The build derives every
   other colour and checks the contrast (`DESIGN.md`, "Company colours").
5. `npm run check`, then look at the page at 375 and 1440 px and in print.

## Format

```yaml
kind: application
base: ../cv.yaml                 # the base CV dataset, relative to this file
id: example-company-role         # URL slug; unique across profiles, pages and applications
language: de                     # the ad's language (one of the base meta.languages)
photo: { src: portrait-2.jpg, alt: "…", width: 480, height: 600 }   # optional own portrait
job:
  title: "Role (m/w/d)"
  company: Example AG
  location: Zürich                 # optional
  reference: R0001                 # optional, shown in the application bar and letter subject
  url: https://example.com/job     # link to the ad (application bar)
  published: 2026-09-01            # optional
  requirements:                    # the keyword analysis, never rendered (min. 3)
    - text: "Five years in IT strategy"
      weight: must                 # must | plus
      evidence: [bkb, globex]   # base ids (experience, education, certificates,
                                   # activities, languages); [] is a gap
    - text: "Tech M&A"
      weight: plus
      evidence: []
      gap: "Not evidenced; not claimed."   # required when evidence is empty
brand:                             # company colours (DESIGN.md, "Company colours")
  source: "Where the colours come from"    # never rendered
  paper: "#000000"                 # page ground
  ink: "#ffffff"                   # text, at least 7:1 on the paper
  accent: "#ff9f1c"                # marks; text in the accent is moved to 4.5:1 if needed
  accentText: "#be82ff"            # optional own colour for accent text (at least 4.5:1)
  marks: ["#e4572e", "#2a9d8f"]    # optional decorative colours (1–4), e.g. a logo's colours
target: "Role"                     # "Bewerbung als …" above the name
headline: "Positioning · in one line"
claim: "One sentence (max. 30 words)"    # optional, beside the profile
profile: "Kurzprofil (max. 110 words)"
strengths:                         # exactly three
  - title: "Strength"
    text: "Proof in one or two sentences (max. 45 words)"
    evidence: [bkb]
experience:                        # optional tailoring; every base position is shown
  - id: bkb
    summary: "One sentence"        # optional
    highlights: ["…"]              # optional, 1–5, replaces the base highlights
    projects: [{ start: 2019-10, end: 2020-10, description: "…" }]   # base number and dates
  - id: bzb
    compact: true                  # date, role and employer only
education:                         # optional: replace the short sentence of an entry
  - { id: beispiel-hochschule-msc, summary: "…" }
knowledge:                         # "Weitere Kenntnisse": keywords, no levels (max. 5 groups)
  - { name: "Cloud", items: ["Microsoft Azure", "Terraform"], evidence: [globex] }
interests: "A selection of the base interests"   # optional
omit: [certifications, interests]  # optional
letter:                            # same fields as a profile's letter (docs/profiles.md)
  date: 2026-09-24
  place: Zürich
  recipient: ["Example AG", "Recruiting", "Street 1", "8000 Zürich"]
  subject: "Bewerbung als …"
  salutation: "Sehr geehrte Damen und Herren"
  attention: ["…"]
  interest: ["…"]
  desire: ["Was ich mitbringe:", { points: ["…", "…"] }]
  action: ["…"]
  closing: "Freundliche Grüsse"
  enclosures: "Arbeitszeugnisse, Diplome"
note: "Open points for the owner (never rendered)"
```

## Page

The sections appear in this order:

1. Application bar: the job, the company, the reference and a link to the ad.
2. Header: photo, target role, name and headline. There are no contact details in the header.
3. Profil: the claim and the Kurzprofil.
4. Kernkompetenzen: the three key strengths. Their top rules take the brand's marks.
5. Berufserfahrung: the timeline, where compact positions show only date, role and employer.
6. Weiterbildung & Zertifikate.
7. Ausbildung.
8. Sprachen.
9. Weitere Kenntnisse.
10. Kontakt: e-mail, LinkedIn, place of residence and interests.
11. Motivationsschreiben: the letter with its sender, recipient, place and date, subject,
    body and enclosures.

The section navigation lists Profil, Kernkompetenzen, Berufserfahrung, Ausbildung, Kontakt and
Motivationsschreiben.

On paper the page prints as one A4 document in the company's colours. From page 2 on, each
sheet has a running head (name, application, target role) and a page number. The letter
starts on its own sheet.
