---
name: cv-doppelungen-pruefen
description: Finds information that a CV, role version or application says more than once (same or similar sentences, skills repeated as interests, languages or activities, near-identical skills). Use after content changes in data/ and before a PR, or when the owner asks to remove duplicates. Runs scripts/check-duplicates.mjs and judges each finding.
---

# Check for double information (cv-doppelungen-pruefen)

Owner rule (2026-09-26): a CV brings each piece of information once, in the place where it
belongs. docs/cv-guide.md: "Say each thing once. The profile, the strengths and the letter pick
different proof where they can."

## Run

1. `npm run check:duplicates` (scripts/check-duplicates.mjs). It checks every dataset, role
   version and application per language, on the content the page shows (tailored highlights
   replace the base's):
   - similar skill names across groups,
   - skills against interests, languages and activities,
   - same or similar sentences (profile, summaries, highlights, projects, USPs, strengths,
     letter).
2. `npm run validate`: exact duplicates between skills and interests are errors there.

## Judge each finding

- **Real double:** the same fact in two places of the same page. Keep it where the CV guide puts
  it (profile: the strongest proof; strengths: proof for a must-requirement; experience: the
  detail; letter: different proof where possible) and propose to remove or change the other.
- **On purpose:** a letter may repeat the strongest proof of the CV in its own words; a role
  version's summary may reuse the main CV's opening. Name it and let the owner decide.
- **Similar, not the same:** different facts that share words (two Azure skills). No change.

## Report

For the owner, in German, one line per finding:

`Seite (Datei, Sprache) · Stelle A · Stelle B · echt / gewollt / nur ähnlich · Vorschlag`

Content changes need the owner's approval; propose wording, never change facts yourself.
