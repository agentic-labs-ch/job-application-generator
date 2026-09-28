# Section for DESIGN.md: «Design and the public repo»

(Designer, 2026-09-28. Paste below «Company colours (applications)» and replace that section's table, which the recipes now cover.)

## Design and the public repo

The generator is public: anyone can make their own CV and applications with it. The design rules below hold for every page it builds, whoever's data it shows.

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
