# Design-Entscheide

Die Entscheide hinter dem Design-System «CV Creator» (intern «Granat») und die Entscheide,
mit denen PR 2 es ins Repo übernimmt. Die Regeln selbst stehen im System
(`design/handoff/2026-09-26-cv-creator-phase-a/README.md`); dieses Dokument hält fest, was
entschieden wurde und was davon umgesetzt ist.

## Umgesetzter Stand

| | |
|---|---|
| Design-System | «CV Creator», Version 21 (`1790441535-5595`), letzte Änderung 2026-09-26 («Punkt 11 Querverweise») |
| Export | `design/handoff/2026-09-26-cv-creator-phase-a/` (unverändert), exportiert 2026-09-26; Vorgänger `design/handoff/2026-09-26-cv-creator/` (Version `1790418500-edf6`) |
| Tokens | `design/tokens.json`, `version: 3`, sha256 `84cf5ec7506e89db33aa7de28f8a98609813cee95342f729277318fa4df5bb93` |
| Im Repo seit | PR 2, Phase A (Branch `design/pr2-einzelschrift`), Stand 2026-09-26 |

Eine neue Design-Runde gilt im Repo erst nach dem nächsten Export nach `design/handoff/<datum>/`
und einem PR.

## D1–D8 und F1–F4

Die Vorlage `ENTSCHEIDE.md` lag der Übergabe nicht bei. Belegt sind nur D5, D6, F2 und F3; die
übrigen sind aus `README.md`, `varianten.md` und `tokens.json` des Systems **rekonstruiert**.
Die Nummern der rekonstruierten Entscheide können von der Vorlage abweichen.

| Nr. | Entscheid | Quelle |
|---|---|---|
| D1 | Eine Schriftfamilie, nur Regular 400. Hierarchie aus Grösse, Farbe und Raum, nie aus Fett, Versalien oder einer zweiten Familie | rekonstruiert (README, Regel 1) |
| D2 | Grössenskala `cv-ruhig`: Name höchstens 3 × Text, Abschnittstitel höchstens 1,8 × | rekonstruiert (README, Regel 2; `varianten.md`) |
| D3 | Reihenfolge nach Regel 2: in einem Block nimmt die Grösse nie zu (kein Datum über der Rolle, keine Zielrolle über dem Namen, Legende am Ende) | rekonstruiert (README, Regel 2) |
| D4 | Acht Farbthemes (Granat Papier und Abend, Petrol, Indigo, Tanne, Ocker, Marine, Graphit); eine Farbe pro Version | rekonstruiert (`varianten.md`) |
| D5 | Die Website zeigt am Bildschirm immer Granat (Papier oder Abend); die Farbe einer Version gilt für Druck, PDF und Blatt | belegt (`HANDOFF.md`) |
| D6 | Ring der leeren Stufenpunkte in `color-text-faint` (`color-level-empty`) | belegt (`tokens.json`) |
| D7 | Vier Layouts: `cv`, `1a`, `1b`, `1c`; Layouts nutzen nur Rollen-Tokens | rekonstruiert (`varianten.md`) |
| D8 | Zehn Schriftfamilien als Varianten, jede nur in 400, selbst gehostet | rekonstruiert (`varianten.md`) |
| F1 | Grösse «Gross» als Besucherwahl: Wurzel 112,5 %, alle Bildschirmgrössen in rem | rekonstruiert (README, «Auswahl für Besucher») |
| F2 | Endgültige Schrift: Instrument Sans | belegt (`HANDOFF.md`, Brief) |
| F3 | Schriftwahl am Bildschirm; Druck und PDF nutzen die Schrift der Version | belegt (`tokens.json`) |
| F4 | Versionswahl am Bildschirm über die Navigation | rekonstruiert (README, Musterblatt) |

F1, F3 und F4 (Besucherwahl) sind laut Brief ein eigener Auftrag und nicht Teil von PR 2.

## Entscheide für PR 2 (Alex, 2026-09-26)

Aus dem Brief: Das System ist die verbindliche Design-Quelle, das Repo folgt. Schrift Instrument
Sans. Test-Bar entfernen. Mobile zuerst (Phase A), dann Tablet und Desktop (Phase B), dann Druck.
Inhaltsentscheide gehen vor den Dossier-Regeln des Systems.

Aus `docs/design-migration.md`, Abschnitt 7.2, alle nach Empfehlung:

| | Entscheid |
|---|---|
| A | Knopf «PDF» im Kopf von Haupt-CV und Rollenversionen; er verlinkt das A4-Dossier, das `pages.yml` beim Veröffentlichen druckt |
| B | «200 % Zoom» am Handy: doppelte Textgrösse bei 320–430 px und Seitenzoom (160–215 CSS-px). Beim Seitenzoom darf ein Wort ohne Trennstrich umbrechen |
| C | Zeitstrahl zeigt die Periode der Station («2021 – 2023», «Seit 2023»), nicht das Startjahr (Abweichung vom System) |
| D | Eintrittsmoment nach System: nur Einblenden, 220 ms |
| E | Rollenversionen: Top 10 und Board bleiben; Stufen als Punkte statt Balken; Schlüssel-Chips mit einem kleinen Quadrat statt der Linie links |
| F | Claim ohne Linie links; Abschnittstitel mit Linie in Akzentfarbe |
| G | Bewerbungen: Link «Kontakt» in der Bewerbungsleiste |
| H | Vorschau: Screenshots der echten Seiten und eine fiktive Vorschau (Robin Muster) als privates Artefakt |
| I | Farbe pro Version als eigenes Feld neben `layout` (Druckteil) |
| J | WebKit («iPhone») und Chromium mobil («Pixel») in den Browser-Tests und in der CI |
| K | «≥» auf der Coaching-Seite wird «mindestens» (Text entscheidet Alex) |
| L | Anschreiben im Druck bleibt 10 pt mit Zeilenhöhe 1,36 (Abweichung vom System) |

Neu dazu (Alex, 2026-09-26):

- **Werdegang als Zeitband** in jedem CV (Haupt-CV, Rollenversionen, Bewerbungen), nach Profil,
  Top-Kompetenzen bzw. Kernkompetenzen und vor der Berufserfahrung, am Bildschirm und im Druck.
  Nur Daten aus `data/cv.yaml`: Die Lücke 03–06.2021 und die Zeit ab 03.2026 bleiben leer, ohne
  Beschriftung.
- **Sprache nach Browser:** Wer den Haupt-CV oder eine Rollenversion in Deutsch öffnet und im
  Browser nicht Deutsch als erste Sprache hat, landet auf der englischen Fassung. Eine Wahl über
  den Sprachschalter wird gemerkt und nie überstimmt; Suchmaschinen werden nicht weitergeleitet.

## Rückmeldungen zu Phase A (Alex, 2026-09-26, am Handy)

Umgesetzt auf `design/pr2-einzelschrift`:

| Thema | Entscheid | Verhältnis zum System |
|---|---|---|
| Zeitband | Eine Liste ohne Zwischentitel: zuerst die Stellen, darunter die Ausbildung, je älteste zuerst. Eine Zeitachse über alle Einträge, damit kein Balken abgeschnitten wird. Am Handy zeigt jede Zeile die Jahre («2012 – 2015»), ab 768 px die Monate; die Art (Architektur & Beratung, Entwicklung, Ausbildung) steht als Farbe und als verstecktes Wort für Screenreader | – |
| Reihenfolge Haupt-CV | Wichtiges zuerst (Leitfaden): Profil, Werdegang, Berufserfahrung, Kompetenzen, Interessen, dann Zertifikate, Ausbildung, Sprachen, Engagement | – |
| Knöpfe | Kontakt, PDF, Sprache und Bewerbungsleiste: sichtbare Pille 36 px, Schrift 16 px (`small`); die Klickfläche bleibt 44 × 44 px | Klickfläche nach System |
| Inhaltsverzeichnis | Schrift 16 px, ohne Lücken zwischen den Links; am Handy eine Zeile, die man seitwärts wischt (die Seite selbst scrollt nie seitwärts); ab 768 px mehrzeilig | – |
| Einträge | Eine Struktur überall: Titel, dann «Organisation, Ort», darunter der Zeitraum auf einer eigenen Zeile (16 px, gedämpft, Tabellenziffern). Gilt für Berufserfahrung, Projekte, Ausbildung, Zertifikate und Engagement. Ersetzt «Zeitraum auf der Zeile der Organisation» aus der Abnahme Phase A. Im Druck vorerst auf einer Zeile mit «·» (Seitenzahlen), bis zum Druckteil | Regel 2 eingehalten |
| Legende der Selbsteinschätzung | Vor den Kompetenzen statt danach, kompakt in einer Zeile, die umbricht | **Abweichung** von Regel 2 («die Legende schliesst ihren Block») |
| Engagement | Auf Textebene wie die Abschnitte daneben: Tätigkeit 17 px, Organisation gedämpft, Zeitraum wie überall | – |
| Interessen | Im Haupt-CV direkt nach den Kompetenzen (sie werden ein grosser Teil des CV) | – |
| Kompetenzen und Interessen | Die Validierung verbietet dasselbe in beiden (`scripts/lib/validate.mjs`); jede Kompetenz braucht eine Stufe (Schema) | – |
| Sprachen | Pro Sprache eine optionale Zeile, wie die Sprache gebraucht wird (`detail`). Texte für Deutsch, Persisch und Englisch nach Alex' Angaben, von Alex freigegeben (2026-09-26) | – |
| Querverweise | Sichtbar und verlinkt (Alex, 2026-09-26): Jede Stelle, jeder Abschluss und jedes Zertifikat trägt ein Kürzel in Akzentfarbe (B1, A1, Z1; englisch W1, E1, C1) vor dem Zeitraum und im Werdegang. Jede Kompetenz verlinkt auf ihre Quellen (Haupt-CV: `refs` in `data/cv.yaml`, Rollenversionen: `evidence` der Top 10); die Legende nennt die Buchstaben. Jeder Link hat 44 px Klickfläche, ohne die Zeile zu erhöhen. Die Zuordnung im Haupt-CV ist ein Vorschlag aus den Belegen der Rollenversionen und den Texten der Stellen, **zur Freigabe**; sechs Kompetenzen haben noch keine Quelle. Im Druck vorerst ausgeblendet (sonst 5 Seiten Haupt-CV), bis zum Druckteil | Neu, noch nicht im System |
| Prüf-Skills | `.claude/skills/cv-quellen-pruefen` (Regeln aus Leitfaden und Quellen) und `.claude/skills/cv-doppelungen-pruefen` mit `npm run check:duplicates` (gleiche oder ähnliche Angaben pro Seite) | – |

Offen, Vorschläge an Alex:

- Profiltext lebendiger, ohne Fettdruck: Aufbau und Stichworte zum Charakter (Inhalt, Freigabe).
- Querverweise: Quellen für Terraform, Linux, Azure OpenAI, Tableau/SPSS/RapidMiner, Python und
  JavaScript/Node.js (wo angewendet?); Freigabe der vorgeschlagenen Zuordnung.
- Reihenfolge der Rollenversionen und Bewerbungen: Alex offen; Empfehlung: vorerst lassen (die
  Stelle entscheidet, was oben steht; Kompetenzen beantworten dort die Muss-Anforderungen).

## Export Phase A (2026-09-26, Version 21)

Das System hat die Übergabe aus Phase A (Punkte 1–9) und den Nachtrag Querverweise (Punkt 11)
übernommen: `design/handoff/2026-09-26-cv-creator-phase-a/`, unverändert, alle Prüfsummen aus
`HANDOFF.md` stimmen; `tokens.json` ist dieselbe Datei (Version 3). Abgleich der Website mit
der Tabelle «Entscheide» in `HANDOFF.md`:

| Nr. | Entscheid im System | Im Repo |
|---|---|---|
| 1 | Zeitraum in Textgrösse: Titel 21 → «Organisation, Ort» 18 → Zeitraum 17 (`color-text-muted`) → Text 17; Regel 2 ohne Ausnahme. Das Kürzel vor dem Zeitraum steht in dessen Grösse (17 px), die Quellen-Links an den Kompetenzen bleiben 16 px | `.entry-period`, `.project-period` in `font-size-body`; neuer Browsertest «Regel 2» pro Eintrag (`tests/e2e/mobile.spec.mjs`) |
| 2 | Achse ab 768 px ohne das zweite sichtbare Jahr | `.career-tick:nth-child(3)` ab 768 px ausgeblendet |
| 3 | Abschnittsnavigation unter 768 px: links bündig mit dem Text, rechts ohne Innenabstand | umgesetzt. Geprüft bei 320/375/390/430 px mit den echten Titeln (WebKit und Chromium): immer bündig, kein seitliches Scrollen der Seite, ein Link angeschnitten, ausser bei 430 px in Chromium auf fünf deutschen Seiten, wo ein Link zufällig 1 px vor dem Rand endet (das System verlangt «fast immer») |
| 4 | Linie der Standardknöpfe bleibt | unverändert |
| 5 | Diagramme zeigen Werte als Text; das Zeitband braucht keinen Tooltip | unverändert |
| 6 | Neue Reihenfolge gilt nur am Bildschirm; das Dossier hält die Checkliste ein | für den Druckteil vorgemerkt |
| 7 | Unerklärte Lücken werden nie markiert | unverändert |
| 8 | `data-1` gleich wie der Akzent | unverändert |
| 9 | Hauptknopf in `color-on-accent` | Der Knopf nennt jetzt `color-on-accent` direkt; `--brand-ink` war schon ein Alias darauf. Bewerbungen überschreiben nur `color-on-accent` (`scripts/lib/brand.mjs`) |

Dazu nach dem System: der Satz unter dem Zeitband heisst «Arbeit und Ausbildung, …» (vorher
«Beruf und Ausbildung»).

Offen:

- Farbvorschläge für Petrol (`data-*` von `dark`) und Abend (`data-2` heller): bis das Zeitband
  in den Druck kommt (Alex, 2026-09-26). Tokens bleiben Version 3.
- «Fluent (C2)» bei den Sprachen (Hinweis im Export): laut Dossier-Regel gehört eine GER-Stufe
  nur mit Zertifikat in den CV. Betrifft nur das fiktive Beispiel (`data/cv.example.yaml`, Robin
  Muster); `data/cv.yaml` nennt keine GER-Stufen.

## Bewerbungen aufgefrischt und Desktop-Review (2026-09-27)

Die drei Bewerbungen (Beispielbank, Globex Consulting, Microsoft) folgen der Auffrischung des Designers (Artefakt
«Bewerbungen aufgefrischt»): gleiches HTML, gleiche Firmenfarben, dazu eine Stilschicht für
Bewerbungen (am Ende von `site/styles.css`, unverändert übernommen, nur die Spalten von `#about`
gelten jetzt nur mit Claim) und eine Schrift pro Branche (`branche` in der Bewerbung, `BRANCHEN`
in `site/templates.mjs`): Finanz & Öffentlich Source Serif 4, Beratung & Sales Schibsted Grotesk,
Tech & Produkt Instrument Sans. Regel 1 gilt pro Seite. Abweichung zum System: die Zielrolle steht
optisch über dem Namen (im DOM darunter).

Desktop-Review (768, 1024, 1440 px; Code-Review eines zweiten Agenten, Messungen im Browser):

| Befund | Änderung |
|---|---|
| Fliesstext lief bis etwa 95 Zeichen pro Zeile: `64ch`/`68ch` messen die Ziffer 0, die in diesen Schriften viel breiter ist als ein Durchschnittsbuchstabe | Lesemass `--measure: 32em` (etwa 65–70 Zeichen) für Profil, Highlights, Listen, Stärken, Kontakt, Kenntnisse, Ausbildungs- und Engagementtext, Projektkästen |
| Ausbildung, Zertifikate und Engagement standen ab 1024 px 30 px links von den Titeln der Berufserfahrung | Einzug rechnet die Schiene (30 px) mit |
| Name bei 1024 px 45 statt 48 px (Brief, Phase B) | ab 1024 px am Bildschirm 48 px; Druck unverändert |
| Toter Regelblock (Briefbreite) | entfernt |

Geprüft: Handy (320, 390, 430 px, WebKit und Chromium, 11 Seiten) pixelgleich wie vorher; Druck
auf allen 13 Seiten im Layout gleich (Lage und Grösse jedes Elements), Seitenzahlen gleich.
Offen für den Designer: Stufenpunkte und -wort der Kompetenzen stehen am Desktop nicht bündig
(die Zahl der Quellen-Links verschiebt sie); Jahreszahlen der Achse bei 768 px eng (Entscheid 2).

## Vier Bewerbungen, vier Designs (2026-09-27)

Der Owner lässt die vier Bewerbungen des Designers veröffentlichen und die alten Versionen von
Pages löschen. Die Seiten sind von Hand gemacht (je eigenes Layout, eigene Skill-Darstellung,
eigene Animation, genau eine Schrift) und liegen wie `/bewerbung/` unverändert in `static/`:

| Adresse | Seite | Schrift |
|---|---|---|
| `/beispielbank-senior-cloud-architect/` | «Bankdossier» | Source Serif 4 |
| `/nimbus-customer-success-account-manager/` | «Produkt-Dashboard» | Instrument Sans |
| `/globex-technology-strategy-manager/` | «Pitch» | Schibsted Grotesk |
| `/beispiel-automobile/` (Lebenslauf und Anschreiben als Umschalter) | «Technische Daten» | Newsreader |
| `/bewerbungen/` | Übersicht | Instrument Sans |

- `/beispiel-automobile/anschreiben/` leitet auf `../#anschreiben` weiter; Coaching und Stichwortanalysen
  verlinken weiter dorthin.
- `pages.yml` löscht das PDF jeder Seite, die eine statische Seite ersetzt. Die neuen Seiten
  verlinken kein PDF.
- Geändert an den Dateien des Designers: `noindex` wie bei den generierten Seiten; die Übersicht
  lädt Instrument Sans selbst gehostet statt von Google Fonts. Sonst unverändert.
- Der Generator baut und prüft die Bewerbungen aus `data/applications/` weiter; nur das Deployment
  ersetzt sie. Die Designs folgen nicht dem Designsystem-Grundsatz «eine Struktur für alle
  Lebensläufe»; das ist eine bewusste Owner-Entscheidung für diese vier Seiten.

