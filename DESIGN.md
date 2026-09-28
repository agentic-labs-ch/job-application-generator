# Design

The design source is the owner's design system **CV Creator** (internally "Granat"): its rules are
the README of the current export in `design/handoff/<date>/`, its values `design/tokens.json`,
from which `npm run tokens` generates `design/tokens.css`. What was decided and what deviates is
in `docs/design-decisions.md`. This file holds what the repo adds on top: the screen rules, how
the components, motion and print are built, the company colours of applications, and the list
of deviations from the system. A new design round reaches the repo only through a new export
and a pull request (`docs/brief.md`).

## Principles

- Mobile first: design at 375 px, enhance with `min-width` breakpoints (768 px tablet, 1024 px
  desktop). The same page renders from phone to desktop; there is no separate desktop site.
- Calm, readable, personal. Content before decoration.
- Granat: "warmth with an edge". Warm greige ground, one loud colour (Granat red), straight
  edges, hairlines instead of shadows, one typeface in Regular 400 (design system rule 1).
- Smooth transitions, never required to understand content. One entry moment in the header,
  once per visitor; the rest of the page is static (see Motion).

## Rules

- Body text at least 16 px; line length about 60–75 characters on wide screens.
- Touch targets at least 44 × 44 px.
- Visible focus styles; everything reachable by keyboard.
- Respect `prefers-reduced-motion`: disable non-essential animation.
- No horizontal scrolling at any tested width; long words and URLs must wrap.
- Colour contrast checked for text and interactive elements (WCAG AA via axe, light and dark).

## Tokens and type

`design/tokens.css` is generated from `design/tokens.json` (`scripts/tokens.mjs`, checked by a
unit test); never edit it by hand. It holds the colour tokens (`--color-*`: Papier as the
default, Abend for dark screens), the type family and sizes (`--font-text`, `--font-size-*`,
`--line-height-*`, screen sizes as `clamp()` from 375 to 1440 px, print sizes as `--print-*`),
spacing, radii, opacity, and a few repo tokens the system has no token for (44 px touch target,
motion durations and easing). Dark mode uses three scopes: bare `:root` (light),
`prefers-color-scheme: dark` guarded by `:root:not([data-theme="light"])`, and
`:root[data-theme="dark"]`. The other colour themes of the system (Petrol, Indigo, …) are
generated as sheet colours inside the print block (`data-sheet`) for the print part; the screen
always shows Granat (D5).

One typeface per page in weight 400 (F2: Instrument Sans). Hierarchy comes from size, colour
and space, never from weight, capitals or a second family; within a block the size never
increases in reading order (rule 2). The levels, from the type scale `cv-ruhig`: name (`h1`),
section title (`h2`), entry title (`h3`: role, degree, certificate, activity, USP title),
subtitle (organisation and place, competency group), text, and `small` (16 px: buttons,
period lines, meta). Applications of the Branchen Finanz & Öffentlich and Beratung & Sales use
Source Serif 4 and Schibsted Grotesk instead (`BRANCHEN` in `site/templates.mjs`). Every font is
self-hosted from `@fontsource` (SIL OFL 1.1, only `latin-400-normal`), copied to `assets/fonts/`
by the build; the site makes no third-party requests.

Every entry has one structure (owner 2026-09-26): title, then "organisation, place", then the
period on a line of its own (muted, table figures). Positions, projects, education,
certificates and activities use it, on screen and in print.

## Deviations from the design system

Owner decisions win over the system's dossier rules (`docs/brief.md`). Recorded here so the
next export can take them up; the decisions themselves are in `docs/design-decisions.md`.

| System | Repo | Why |
|---|---|---|
| Legend closes the competency block (rule 2) | Legend opens it, compact in one line | Owner 2026-09-26 |
| Timeline shows the start year | Each station shows its period ("2021 – 2023", "Seit 2023") | Decision C: a start year alone read like a mark on an axis |
| Target role never above the name | Applications: the target role stands above the name visually (below it in the DOM) | Designer's refresh 2026-09-27 |
| Letter at the text size | Print: letter 10 pt, line height 1.36 | Decision L |
| Dossier shows certificates | Role versions and applications leave them out (`omit`) | Owner 2026-09-23 |
| Gaps explained | The gap 03–06.2021 and the time from 03.2026 stay empty, without a label | Owner 2026-09-26 |
| No career band, no cross references | Career band before the experience; codes (B1, A1, Z1) and skill sources as links | Owner 2026-09-26, new; not in the system yet; both hidden in print until the print part |
| Interactive page (filters, tooltips, counters) | Static page; one small script (language by browser, entry moment) | The script is external, content-free and tested byte for byte |
| JSON-LD `schema.org/Person` | Not added | Own assignment (brief); the site ships no inline scripts |

## Components

- Timeline (`.timeline` in `site/styles.css`, `timeline()` in `site/templates.mjs`): experience.
  A rail with one dot per station (the current one filled); each station has its own date
  column (`--date-column`: 11 rem = 176 px from 768 px, 28 mm on paper). It shows the years of
  the whole period at the role's size, so years and role read as one row (`2019 – 2021`;
  `Seit 2023` / `Since 2023` while it runs; one year when start and end fall in the same year),
  and the exact period on the period line of the entry. The years are hidden from
  screen readers, which read the exact period once. Projects as raised cards with a hairline border.
  Why (owner, 2026-09-24): a start year alone read like a mark on an axis. On a rail that runs
  from today into the past, the space below "2023" held the station of 2023–2026, while the
  eye read it as the time between 2023 and the next mark, 2021. Each station now names its
  own period, so the rail is a list of periods, not a scale.
- Skill list: Granat four-step scale (Grundkenntnisse, Erste Erfahrung, Erfahren, Spezialist),
  four dots (accent filled, faint ring) and a word; the level is never colour only. The scale
  legend (dots and words) opens the block; each skill links to its sources (codes B1, A1, Z1).
- Dates (Granat v2): DE `09.2016 – 06.2018`, EN `09/2016 – 06/2018`, current `heute` / `now`.
  Station years: `2016 – 2018` with an en dash and spaces, like the exact period.
- Language list, entry lists: rows separated by `line` hairlines, no cards.
- Contact and PDF: 36 px pill buttons with 16 px text inside a 44 px click area; the first
  link is the primary (filled accent) action.
- Portrait: 4:5, `radius-md`, hairline border; left of the name so the gaze points into the
  page (above the name on narrow screens).
- Headline separator: `·` stays with the preceding word (no-break space), so a line never
  starts with `·`.

### Role versions, cover letters and text pages (see `docs/profiles.md`)

- Claim: claim size, no rule (decision F); section titles carry a rule in the accent colour.
- USP statements: three rows separated by hairlines; title left and text right from 768 px.
- Target role: "Bewerbung als …" / "Application: …" from the profile's `target`, subtitle
  level under the name (screen and print).
- Competency profile (role versions): the scale legend and the explanation of highlighted
  chips, then the ten most important skills for the role (`key: true`, highest level first)
  with dots and the level word, two columns from 1024 px; below, a board with the categories
  as rows and only the levels that occur as columns. Each skill is a chip in its level's
  column; key skills carry a small filled square and a visually hidden word (decision E; never
  weight or colour only).
  Below 768 px the board stacks per category with level labels. Languages follow with word
  levels.
- Application bar (`.dossier-nav`): sunk strip above the header with the job title and pill
  links to CV, cover letter, job ad, PDF and contact; the current document is an inverted pill
  (`aria-current="page"`).
- Cover letter: the CV header is the letterhead (brand consistency); recipient block, place
  and date, subject, points with a short accent dash, name as signature, enclosures last. One
  template renders the letter page and the application's letter section (`letterArticle`).
- Text pages: smaller display title (h2 size), muted lead, bullet and numbered lists, rows of
  full-width text links. Tables stack into label/value rows below 768 px (labels via
  `data-label`, explicit ARIA table roles keep the semantics) and are real tables above.

### Applications (one page per job ad, see `docs/applications.md`)

- One flow from top to bottom, in the order of the CV guide (`docs/cv-guide.md`): header
  (photo, target role, name, headline; no contact details), Profil (claim beside the
  Kurzprofil), Kernkompetenzen, Berufserfahrung, Weiterbildung & Zertifikate, Ausbildung,
  Sprachen, Weitere Kenntnisse, Kontakt, and the Motivationsschreiben as the last section.
  The CV typography applies unchanged.
- Key strengths: three items with a 3 px rule on top in the brand's mark colours (the first
  three marks, or the accent), the title at the H3 level, the proof as text. Stacked below
  1024 px, three in a row from 1024 px and on paper.
- Compact positions (older stations): date column, role and organisation only.
- Weitere Kenntnisse and Kontakt: rows of label (subtitle level) and value (text), hairlines
  between them, label column `--date-column` from 768 px (aligned with the timeline's date
  column).
  Links in the contact rows show their address, on screen and on paper.
- Motivation letter: the letter sheet of the cover-letter pages (surface-raised, hairline,
  54 rem wide from 1024 px) with the sender above the recipient.
- Brand stripe: a 4 px band at the very top of the page in the brand's marks (equal
  segments) or the accent; decorative (`aria-hidden`).
- Section rhythm on screen: `--space-section` 48–80 px instead of 64–112 px, so the long
  page reads as one document.

### Desktop (from 1024 px)

- Page wrap 1120 px (Granat). Header: 240 px portrait left of the name; headline up to 30 ch.
- Section navigation sticks to the top (`scroll-padding-top` keeps anchored sections below it);
  where supported (`scroll-target-group`, Chromium 140+) the current section is highlighted.
- Profile: claim beside the Kurzprofil, the three USP statements in one row.
- Timeline and entry lists use the 176 px date column (`--date-column`, see Components).
- Cover letter: shown as a sheet (surface-raised, hairline border) in a 54 rem wrap.
- Tablet (768–1023 px) keeps the single reading column with two-column skill groups.

### Motion

- One entry moment instead of a reveal on every block (owner decision 2026-09-23): the page
  header fades in once per browser, on the first page a visitor opens. Opacity only, 220 ms
  (`--duration-base`, decision D), portrait and name first, then target role and headline
  (60 ms later), then place and links (120 ms). Nothing moves, the layout never changes.
  Everything below the header is static.
- `site/entry.js` (external, content-free, tested byte for byte) sets `data-entry` on the root
  element before the first paint (loaded without `defer`) and remembers the visit with one
  `localStorage` flag, so later pages and visits start at rest (no replay, no flash). The same
  script opens the English version for browsers whose first language is not German (owner
  2026-09-26); a choice made with the language switch is remembered and never overruled. Without
  the script or storage, with `prefers-reduced-motion: reduce` and in print the header is at
  rest. axe checks run on the rest state. There are no key figures, so there is no count-up.
- Why: a fade-up reveal on every block, meta joined with middle dots and mono date labels are
  traits of generated pages. The site drops the per-block reveal and joins organisation and
  place with a comma instead of a middle dot.

### Print (A4)

- `@page` A4 with 14–18 mm margins. Print uses the CV typography in pt (text 9 pt, meta
  7.5 pt, H3 12 pt, H2 16.5 pt; letter 10 pt); the screen rules for 16 px text and 44 px
  targets do not apply on paper.
- Breaks follow `@page` and `break-inside: avoid` per station, entry, skill and language row;
  never fixed pages. From page 2 on, CVs carry a running head in meta (name · CV, from the
  `--running-head` custom property on `<html>`) and the page number (`@page` margin boxes).
- Full measure on paper (no `ch` line limits); projects stay cards (hairline, 6 px radius);
  skill rows show the dots only, the legend under the title names the levels (the level is
  still shape, not colour).
- Papier colours: the Abend tokens apply to `screen` only (`tokens.css`). The sheet colours of
  the design system (`data-sheet`, generated into the print block) wait for the print part
  (`docs/design-decisions.md`, decision I: colour per version).
- Navigation, skip link, language switch and application bar are hidden; contact links print
  their address (`.print-only`) instead of the label.
- Main CV: one column, the timeline with its date column and rail, competency groups in two
  columns.
- Role versions (named page `dossier`): A 65 mm sidebar in
  `surface-sunk` from edge to edge of every sheet (a fixed strip in the page area, `@page`
  margin boxes in the margins), the rest in `surface-page`. Sidebar: portrait (4:5,
  `radius-md`), contact (meta label, text value; addresses as text), the dot legend one level
  per line, the competency groups as rows with dots, languages, interests. Main column: target
  role, name, headline, claim, profile, experience and education as stations separated by
  hairlines (no rail, no year column). The sidebar is a print-only copy of facts shown in the
  header and the competency profile on screen (no ids, no links); USP statements, top ten and
  board are screen-only.
- Removed 2026-09-28 (owner): the print layouts "1b" (dark, petrol) and "1c" (cool white,
  indigo) and the paper view `<id>/papier/` with its layout bar. They were built on 2026-09-23
  as a comparison for the test bar, which went on 2026-09-26; nothing linked to them since.
  The print part after phase B chooses the print colours anew from the design system's export.
- Applications: one document in the company's colours (named page `application`, the paper
  colour on the whole sheet, running head and page number from page 2). The CV runs in one
  column with the three key strengths in a row; short sections (strengths, certificates,
  education, languages, keywords, contact) move to the next sheet as a whole; the
  motivation letter starts on its own sheet
  and its section title is left to screen readers, so the sheet reads as a letter. At most
  four A4 pages (tested).
- Cover letter: one page (tested; body at most 350 words), compact letterhead with an 18 mm
  portrait, recipient block in the right-hand window position (Swiss letter, about 106 mm from
  the left edge), then place and date, subject, body.
- `npm run pdf` prints every page of `dist/` to `.cache/pdf/` with Chromium.
- One-piece PDF (owner 2026-09-24): `node scripts/pdf.mjs --one-piece` exports the desktop
  view as it is on screen (1440 px wide = 1080 pt, screen styles, the company's colours) on
  one single page as long as the page, no page breaks, links kept. Bars, section navigation,
  skip link and language switch are left out (`[data-export="hide"]` for anything else).
  Pages longer than 19,200 px are scaled down to stay within what PDF viewers open. Each
  application page links its one-piece PDF (`pdf/<id>.pdf`, printed by `pages.yml`; the
  download is named after the CV guide, e.g.
  `Alex-Muster_Bewerbung_Globex Consulting_Technology-Strategy-Manager.pdf`).

## Company colours (applications)

Owner, 2026-09-24: an application takes the colours of the company it goes to (Globex Consulting:
black ground, violet accents, white text; Beispielbank: mostly black with a little red; Microsoft: the
four logo colours, used sparingly). These colours depend on the job ad, so they live in each
application's `brand` block (`data/applications/*.yaml`), not in `design/tokens.css`. The
design system stays: type, spacing, components, CV typography and layout are Granat on every
page.

Rules (implemented in `scripts/lib/brand.mjs`, checked by the validator and by axe):

- The brand gives `paper`, `ink` and `accent`, optionally `accentText` and up to four
  decorative `marks`. Everything else is derived from them: surfaces raised and sunk, muted
  and faint text, hairlines, accent soft, hover, focus.
- Contrast minimums, against the paper and both surfaces: ink at least 7:1; muted text 5.5:1
  and faint text 4.6:1 (both chosen as quiet as these allow); accent text at least 4.5:1 (the
  accent is moved towards the ink until it passes, unless `accentText` is given and passes);
  marks that carry meaning (timeline dot, claim rule) at least 3:1; text on an accent fill
  at least 4.5:1 (paper or ink, whichever reads better). A brand that cannot pass is refused
  at validation time.
- `marks` are decorative only: the page stripe and the rules of the three key strengths.
  They never colour text and never carry meaning on their own (Nimbus Software's yellow reaches
  only 1.7:1 on white).
- No logos, logo shapes or trademarks (no Globex Consulting ">", no Beispielbank keys, no Microsoft squares),
  and no fonts of the company.
- The colours are fixed for the page: the page does not follow the reader's light/dark
  setting (a style attribute on the root element overrides every theme scope of
  `tokens.css`), and print uses the same paper colour on every sheet.

| Application | Paper | Ink | Accent (text) | Marks |
|---|---|---|---|---|
| Globex Consulting | `#000000` | `#ffffff` | `#ff9f1c` | – |
| Beispielbank Karten | `#ffffff` | `#000000` | `#0b5d6b` | – |
| Nimbus Software | `#ffffff` | `#242424` | `#3b4bc8` | `#e4572e` `#2a9d8f` `#2b7bb9` `#e9c46a` |

## Design and the public repo

The generator is public: anyone can make their own CV and applications with it. The design rules below hold for every page it builds, whoever's data it shows (designer, 2026-09-28; spec in `design/handoff/2026-09-28-stil-rezepte/`).

Status 2026-09-28: the fixed rules and the `brand` block are implemented. The five style recipes, `rezept:`, Figtree and Newsreader, and the licence file next to the fonts are the target; they are built recipe by recipe. Until then an application gets its Branche's typeface and the shared application layout.

### Fixed rules

- **One typeface per CV.**
  - Each page uses exactly one family, in weight 400 only: headings, text, buttons, form controls and SVG labels.
  - No bold, no italic, no `text-transform: uppercase`, no letter-spacing as emphasis.
  - Hierarchy comes from size, colour, space and lines.
  - Which family a page uses depends on its style recipe (below). Two families on one page never happen.
- **Size only goes down.** Within a block, the font size never increases in reading order. The note above the name (target role, company, reference) is therefore a block of its own.
- **Readable and touchable.**
  - Text at least 16 px on screen, including captions, axis labels and legends.
  - Touch targets at least 44 × 44 px, with a visible 2 px focus outline.
  - No horizontal scrolling from 320 to 1440 px.
- **Contrast.**
  - Text at least 4.5:1 on its ground.
  - Graphics, focus rings and the outlines of controls at least 3:1.
  - Checked by axe (WCAG 2.2 AA) and by the brand validator.
- **Colour never alone.** A skill level is always also written as a word: 1 Basic, 2 Some experience, 3 Experienced, 4 Specialist (German: Grundkenntnisse, Erste Erfahrung, Erfahren, Spezialist).
- **Motion.**
  - Only `opacity`, `transform` and, in SVG, `stroke-dashoffset`; 600 ms at most.
  - Start states apply only under `html.js`, so everything is visible without the script.
  - `prefers-reduced-motion: reduce` shows the end state at once; print has no motion.
- **No facts invented by the design.** A key figure appears only if the number is in the data word for word.

### Style recipes

A recipe decides how an application page looks and moves: layout, skill display, motion and typeface. The Branche of the application picks the default recipe; an application can pick another with `rezept:`. The specification and a reference page for each recipe are in `design/handoff/2026-09-28-stil-rezepte/`.

| Recipe | Name | Default for | Typeface | Skills shown as | Motion |
|---|---|---|---|---|---|
| `finanz-oeffentlich` | Bank dossier | Finanz & Öffentlich | Source Serif 4 | Rating table: one mark per skill on the 1–4 scale | Calm fade-in; marks slide into place |
| `beratung-sales` | Pitch | Beratung & Sales | Schibsted Grotesk | Evidence matrix: which skill is proven at which station | Scroll progress line, dots appear row by row, figures count up |
| `tech-produkt` | Product dashboard | Tech & Produkt | Instrument Sans | Four-segment bars, filterable by category | Bars grow, figures count up, filter cross-fades |
| `mensch-kreativ` | Portrait | Mensch & Kreativ | Figtree | Chips grouped by level, toggle «by level / by topic» | Portrait floats in, chips appear staggered, path line draws on scroll |
| `technische-daten` | Technical data | – (on request) | Newsreader | Round gauges per skill group, tap for the single skills | Gauges sweep to their value, tabs cross-fade |

All typefaces are self-hosted from `@fontsource` (SIL OFL 1.1, licence file next to the fonts); only `latin-400-normal` is shipped. A page loads only the one file it uses.

### Your company colour: the `brand` block

An application takes the colours of the company it goes to. Set them in the application's `brand` block (`data/applications/<id>.yaml`, format in `docs/applications.md`):

```yaml
brand:
  source: Careers page of the company, seen 2026-10-01   # where the colours come from
  paper: "#ffffff"      # page ground
  ink: "#1f1f1f"        # text; at least 7:1 on the paper
  accent: "#0b5d6b"     # lines, marks, buttons, links
  accentText: "#0b5d6b" # optional: accent for text, if the accent itself is too light
  marks: ["#e4572e", "#2a9d8f"]   # optional, up to four, decorative only
```

- Take the colours from the company's own careers page, and use them sparingly. No logos, logo shapes, trademarks or the company's own fonts.
- The generator derives everything else from these values: surfaces, muted text, hairlines and focus. It raises accent text to 4.5:1 by itself and refuses a brand that cannot pass.
- `marks` never colour text and never carry meaning on their own. They decorate stripes, rules, dots and tints; a yellow mark can have as little as 1.7:1 on white.
- The page keeps these colours in light and dark mode and in print.

### Sample data and images

- The demo person is Alex Muster, and every company is fictional. The design system's own sample person is Robin Muster.
- Portraits in the repo are neutral illustrations (`data/portrait.jpg`, `data/portrait-2.jpg`), never a real person or a stock photo, and have no metadata.
- Design hand-offs that go into the repo contain sample data only. Hand-offs with real data travel as a separate private file and never enter an approved folder.
- Files, CSS classes, recipes and tokens are named after the style or the Branche, never after a company.

## Hand-off with the designer

The designer exports the system to `design/handoff/<date>/` (README, tokens.json, HANDOFF.md
with checksums); the repo follows the export, never a design tool directly, and there is no
automatic sync in either direction. Real CV data is never put into artifacts or previews: the
designer sees the fictional dataset (Robin Muster, `data/cv.example.yaml`) and screenshots.
