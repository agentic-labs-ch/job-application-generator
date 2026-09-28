# Design-Migration: Design-System «CV Creator» ins Repo (PR 2)

Stand 2026-09-26, Schritt 1 des Auftrags: nur Analyse, am Code ist nichts geändert.

Grundlagen:

- Brief vom 26.09.2026 (liegt in PR 2 als `docs/brief.md` bei).
- Übergabe `design/handoff/2026-09-26-cv-creator/` mit `tokens.json` Version 3. Die Prüfsummen von `tokens.json`, `README.md` und `varianten.md` stimmen mit `HANDOFF.md` überein.
- Repo-Stand: `main` bei `9dc9b3e`.

Wörter wie «System» meinen das Design-System, «Repo» den Code auf `main`.

## Kurzfassung

- **Die Token-Werte passen fast überall.** Granat hell und dunkel sind im System und im Repo gleich, bis auf `color-text-faint`. Das System hat dort #6e645b und löst damit das Kontrastproblem besser als das Repo (#756b62). Brief-Punkt 4 (#786e65) ist damit überholt.
- **Die Unterschiede liegen in Schrift, Grösse, Reihenfolge und festen Farbwerten.**
  - Schrift: drei Familien statt einer, 500 und 600 statt nur 400.
  - Grösse: Skala `cv-heute` statt `cv-ruhig`.
  - Reihenfolge: Zielrolle über dem Namen, Datum über der Rolle, Legende unter dem Titel.
  - Farbe: Druckfarben 1b und 1c fest im CSS, zusammen 37 feste Farbwerte in `site/*.css`.
- **Mobile heute:**
  - Kein horizontales Scrollen, alle Ziele 44 px, Text ab 16 px, axe ohne Befund.
  - Der erste Bildschirm verfehlt die Abnahme. Auf dem iPhone SE (320 px) fehlt beim Haupt-CV und bei den Bewerbungen sogar der Name.
  - Einen Weg zum PDF haben nur die Bewerbungen, weder der Haupt-CV noch die Rollenversionen.
  - Bei 200 % Zoom läuft der Zeitraum in Mono über den Rand.
- **Chromium mobil und WebKit (iPhone) zeigen dieselben Befunde.**
- **Das grösste Risiko ist der Druck.** Mit den `cv-ruhig`-Werten halten alle PDFs ihre Seitenzahl, aber die Reserve schrumpft. Bei den Bewerbungen ist Seite 3 dann zu 88–90 % voll.
- **Acht Einsprüche (Abschnitt 5).** Zu entscheiden sind vor allem:
  - Zeitstrahl mit Periode statt Startjahr.
  - Eintrittsmoment.
  - Schlüssel-Chips, die ohne Linie links nur noch über Farbe unterscheidbar wären.
  - Firmenfarben am Bildschirm.
  - Dossier-Regeln gegen die Inhaltsentscheide.
- **Zwölf neue Entscheide (Abschnitt 7.2),** vor Phase A vor allem zum PDF-Link, zur Definition von «200 % Zoom» und zur Vorschau.

## 1. Abgleich Design-System gegen Repo

### 1.1 Regeln

| Regel | System | Repo heute | Betroffene Dateien |
|---|---|---|---|
| Regel 1: eine Familie | Instrument Sans, nur 400, `font-family` einmal auf der Wurzel, Titel mit `font: inherit` | Drei Familien: Instrument Serif (Name, H2, Rollen, Jahre, Claim, Unterschrift), Instrument Sans 400/500/600, IBM Plex Mono 400/500 (Daten, Ort, Zielrolle, Labels, Sprachschalter). Sechs Schriftdateien | `site/fonts.css`, `design/tokens.css`, `site/styles.css` (27 Verweise auf Serif oder Mono), `scripts/build.mjs` (`FONT_FILES`), `package.json`, `tests/unit/design-preview.test.mjs` |
| Keine Betonung durch Gewicht, Kursiv, Versalien, Laufweite | Verboten | 500 für Buttons, Abschnittsnavigation, Zielrolle, Sprachschalter und Tabellenköpfe. 600 für Organisation, Gruppentitel (`h3`), Brief-Betreff, Absender, `dt` und Tabellen (15 Regeln). Laufweite an 8 Stellen (H1, H2, Rolle, Claim, Sprachschalter). Keine Kursiven, keine Versalien | `site/styles.css` |
| Skala | `cv-ruhig`: Name 40→48, H2 26→30, Claim 22→24, Rolle 21, Untertitel 18, Text 17, Meta 16 px | `cv-heute`: Name 50→104, H2 32→52, Claim 23→36, Rolle 22→28, Headline 18→21, Text 16,5, Meta 16 px | `design/tokens.css`, `site/styles.css` |
| Verhältnis zum Text | Name höchstens 3 ×, H2 höchstens 1,8 × | Bei 375 px 3,0 × und 1,9 ×, bei 1440 px 6,3 × und 3,2 × | wie oben |
| Regel 2: Reihenfolge im Block | Name → Zielrolle → Headline → Kontakt. Rolle → «Organisation, Ort · Zeitraum» → Zusammenfassung → Highlights. Legende am Ende. Kopfzeile und Seitenzahl unten | Zielrolle (16 px) über dem Namen. Datum (16 px) über der Rolle, in jeder Station und jedem Eintrag. Legende unter dem Titel. Laufender Kopf oben (Druck) | `site/templates.mjs` (`header`, `timeline`, `education`, `certifications`, `activities`, `skillLegend`, `applicationHeader`), `site/styles.css` |
| Zeitraum | Auf der Zeile der Organisation, `color-text-muted`, Tabellenziffern | Eigene Zeile in Mono (`.timeline-range`, `.entry-dates`) | `site/templates.mjs`, `site/styles.css` |
| Farbe | Acht Themes als Tokens. Website am Bildschirm immer Granat (D5). Die Farbe einer Version gilt für Druck, PDF und Blatt | Granat hell und dunkel als Tokens. Petrol (1b) und Indigo (1c) fest im Druckblock. Tanne, Ocker, Marine und Graphit fehlen. Die Farbe hängt am Layout | `design/tokens.css`, `site/styles.css` (Zeilen 1625–1675, 2357–2402), `schema/profile.schema.json` |
| Keine Farbwerte ausserhalb der Tokens | Nur Rollen-Tokens | 37 feste Werte: 26 in `site/styles.css` (`@page` 1b/1c, Druckfarben 1b/1c, `#fff`) und 11 in `site/paper.css` (Pult, Leiste, Schatten) | `site/styles.css`, `site/paper.css` |
| Stufenpunkte | Gefüllt `color-accent`, Ring `color-level-empty` (= `color-text-faint`), mindestens 3:1, immer mit Wort | Ring in `line-strong`: 1,55:1 hell, 1,69:1 dunkel. Rollenversionen zeigen Balken, deren leere Segmente (`data-grid`) nur 1,2:1 erreichen | `site/styles.css`, `site/templates.mjs` (`topSkills`, `levelBar`) |
| Kein farbiger Rand links | Verboten | Claim mit 3-px-Linie links. Schlüssel-Chips mit 3-px-Linie links: heute ihr einziges Merkmal ausser Farbe | `site/styles.css` (`.claim`, `.chip.is-key`, `.key-note`) |
| Abschnittstitel | Nur der Titel in `screen-h2`, Abschnittslinie in `color-accent` (Musterblatt) | H2 in Serif, graue Linie über dem Abschnitt | `site/styles.css` |
| Silbentrennung | `hyphens: auto` mit `lang`, `overflow-wrap: anywhere` nur für URLs | Kein `hyphens`. `overflow-wrap: anywhere` auf `body`: jedes Wort darf an beliebiger Stelle brechen | `site/styles.css` (Zeile 40) |
| Zeilenhöhen | 1,1 Name, 1,2–1,35 Titel, 1,6 Text (auch im Druck) | 0,95 Name, 1,04–1,15 Titel, 1,64 Text, im Druck 1,45 | `design/tokens.css`, `site/styles.css` |
| Abstände | `space-5` 40, `space-6` 56, `space-section` 48→80 px | 48, 64 und 64→112 px (Bewerbungen schon 48→80) | `design/tokens.css`, `site/styles.css` |
| Zeilenlänge | `content-max-width` 42rem ist das Mass des Fliesstexts | Gleicher Name, andere Bedeutung: im Repo ist `--content-max-width` die Seitenbreite (44rem, ab 1024 px 70rem). Der Text wird mit 64ch/68ch begrenzt | `design/tokens.css`, `site/styles.css` |
| Bewegung | 120 ms für Zustände, 220 ms für Einblenden, `ease-out`, nur `transform` und `opacity` | Eintrittsmoment: Name per `clip-path` in 700 ms, Einblenden in 480 ms | `site/styles.css` (Zeilen 744–788), `site/entry.js` |
| Druckgrössen | 24 / 13 / 12 / 11 / 10 / 9 / 7,5 pt | Name 40, H2 16,5, Claim 14, Rolle 12, Headline 10, Text 9, Meta 7,5 pt. Zielrolle 8,25 pt, USP-Text in 1c 8,25 pt (unter 9 pt). Brief: Betreff 10,5 pt halbfett, Unterschrift 15 pt Serif | `site/styles.css` (`@media print`) |
| PDF mit genau einer Schrift | Geprüft mit `pdffonts` | Jedes PDF bettet 4–5 Schriftdateien aus 3 Familien ein (gemessen, Abschnitt 4.1) | Test fehlt |
| Porträt | 4:5, `radius-md`, am Handy 88 px breit (Musterblatt) | 128 × 160 px über dem Namen | `site/styles.css` (`.portrait`) |
| Zielrolle | Stufe 4 (18 px), `color-accent`, unter dem Namen | Mono 16 px in 500, über dem Namen | `site/templates.mjs`, `site/styles.css` (`.target-role`) |
| Organisation | Stufe 4 (18 px), `color-text`, 400 | Text 16,5 px in 600 | `site/styles.css` (`.entry-org`) |
| Legende | Am Ende des Kompetenzblocks, `screen-small`, `color-text-faint` | Unter dem Titel, `color-text-muted` | `site/templates.mjs` (`skillLegend`), `site/styles.css` |
| Zeichen | Keine Pfeile, kein ≥, keine Häkchen | «←» in der Papierleiste, «≥» auf der Coaching-Seite (Inhalt) | `site/templates.mjs` (Zeile 607), `data/pages/coaching.yaml` (Zeile 140) |
| JSON-LD | Die Seite schreibt `schema.org/Person` | Fehlt (Brief: später) | – |
| Besucherwahl | Version, Schrift, Grösse. Alle Bildschirmgrössen in rem | Fehlt (Brief: später). Grössen in rem ✓ | – |
| Test-Bar | Kommt nicht vor | Auf dem Haupt-CV (Brief: entfernen) | `site/templates.mjs` (`layoutBar`), `scripts/build.mjs` (`layoutLinks`), `site/styles.css` (`.layout-bar`) |
| Farbe und Layout pro Version | `design.color`, `design.type` | Nur `layout` (1a/1b/1c). Die Farbe folgt aus dem Layout | `schema/profile.schema.json`, `data/profiles/*.yaml` |
| Quelle der Werte | `tokens.json` v3 | `design/tokens.css` von Hand nach Granat v2. `DESIGN.md` sagt «Repo ist kanonisch» | `design/`, `DESIGN.md` |
| Schutzregeln | Kontrast für jede Textrolle auf jeder Fläche, 16 px, 44 px, kein Inline-Script, Schriften selbst gehostet | Alle erfüllt. Ausnahme: `ink-faint` erreicht auf `surface-sunk` nur 4,21:1. Keine Seite setzt es heute so ein, axe ist ohne Befund | `design/tokens.css` |

### 1.2 Farbwerte

Die Werte von Granat hell und dunkel sind im System und im Repo gleich. Das gilt für Flächen, Text, Akzent, Linien, Fokus, `data-*`, `positive`, `attention`, `level-1` bis `level-4` und die Schatten. Abweichungen:

| Token | System v3 | Repo | Kontrast (bg / sunk) |
|---|---|---|---|
| `color-text-faint` hell | `#6e645b` | `#756b62` | System 5,18 / 4,67; Repo 4,67 / **4,21** |
| `color-text-faint` Indigo (1c) | `#666c77` | `#6a707b` (Druck) | System 5,01 / 4,66; Repo 4,73 / **4,40** |
| `color-level-empty` | neu, = `color-text-faint` | Ring in `line-strong` | 4,67 statt **1,55** |
| Petrol (1b) | – | alle Werte, die der Druck setzt, gleich | – |
| Tanne, Ocker, Marine, Graphit | neu | fehlen | – |

Ich habe alle acht Themes nachgerechnet. Text, `text-muted`, `text-faint` und Akzent erreichen auf allen drei Flächen mindestens 4,66:1. `on-accent` erreicht mindestens 5,73:1, Fokus und leere Stufenpunkte mindestens 4,66:1. Die Angaben des Systems stimmen.

### 1.3 Zuordnung der Token-Namen

Das Repo führt die System-Namen schon heute als Aliase, etwa `--color-bg: var(--surface-page)`. Es fehlen nur `--color-on-accent` und `--color-level-empty`. Mit PR 2 kehrt sich die Richtung um. Die System-Namen tragen die Werte, die alten Namen werden Aliase und fallen weg, sobald kein Code sie mehr nutzt.

| Repo heute | System | Hinweis |
|---|---|---|
| `--surface-page` | `--color-bg` | |
| `--surface-raised` | `--color-surface` | |
| `--surface-sunk` | `--color-surface-sunk` | |
| `--ink` | `--color-text` | |
| `--ink-muted` | `--color-text-muted` | |
| `--ink-faint` | `--color-text-faint` | neuer Wert, siehe 1.2 |
| `--line` | `--color-border` | |
| `--line-strong` | `--color-border-strong` | |
| `--brand` | `--color-accent` | |
| `--brand-strong` | `--color-accent-strong` | |
| `--brand-soft` | `--color-accent-soft` | |
| `--brand-ink` | `--color-on-accent` | |
| `--focus` | `--color-focus` | |
| – | `--color-level-empty` | neu |
| `--surface-inverse`, `--ink-inverse` | – | nur `brand.mjs` setzt sie, kein CSS nutzt sie: entfallen |
| `--data-1` … `--data-3`, `--data-grid`, `--data-mute`, `--positive`, `--positive-soft`, `--attention`, `--level-1` … `--level-4`, `--shadow-raise`, `--shadow-pop` | gleiche Namen | |
| – | `--opacity-disabled`, `--opacity-mute` | neu, heute ohne Verwendung |
| `--brand-mark`, `--brand-stripe`, `--mark-1` … `--mark-4` | – | nur Bewerbungen (`brand.mjs`), bleiben als Erweiterung des Repos |
| `--font-display`, `--font-heading`, `--font-sans`, `--font-body` | `--font-text` | eine Familie |
| `--font-mono` | – | entfällt, Daten mit `tabular-nums` (Instrument Sans hat `tnum`) |
| – | `--font-<familie>` (10) | geladen wird in PR 2 nur Instrument Sans |
| `--font-size-h1`, `-h2`, `-claim`, `-role`, `-body`, `-small` | gleiche Namen | neue Werte, am Bildschirm als `clamp()` laut `HANDOFF.md` |
| `--font-size-headline` | `--font-size-headline` = `--font-size-subtitle` | 18 px; `--font-size-target` ebenso |
| `--font-size-h3` (17 px, Brief-Betreff) | – | entfällt. Vorschlag: Betreff in `--font-size-role` (Stufe 3) |
| `--line-height-body` 1,64 | 1,6 (`screen-body`) | |
| `--space-1` … `--space-4` | gleich (4 / 8 / 16 / 24 px) | |
| `--space-5` 48 px | `--space-5` 40 px | |
| `--space-6` 64 px | `--space-6` 56 px | |
| `--space-section` 64→112 px | `--space-section` 48→80 px | im System als `clamp(48px, 6vw, 80px)` beschrieben |
| `--content-max-width` (Seitenbreite) | neu `--page-max-width` (70rem = 1120 px, nur Repo) | `--content-max-width` wird 42rem (Textmass) |
| `--radius`, `--radius-md`, `--radius-lg`, `--radius-pill` | gleich | |
| `--touch-target-min`, `--date-column`, `--duration-*`, `--easing-standard` | – | bleiben im Repo. Das System nennt 120/220 ms und `ease-out` ohne eigene Tokens |

## 2. Mobile-Befund heute

### 2.1 Methode

- Build von `main` (`9dc9b3e`), geöffnet über `file://`, reduzierte Bewegung (Ruhezustand).
- Gemessen wurden alle CV-Seiten: Haupt-CV DE und EN, vier Rollenversionen, das Beispiel Automobile-Anschreiben, drei Bewerbungen und zwei Textseiten.
- Engines:
  - Chromium 141 mobil: Pixel-7-Kennung, Touch, DPR 2,625.
  - WebKit 26.0: iPhone-13-Kennung, Touch, DPR 3.
  - Beide aus Playwright 1.56.1. WebKit wurde dafür in dieser Sitzung nachinstalliert.
- Sichtbare Höhe nach Abzug der Browserleisten, wie die iPhone-Profile von Playwright: 320 × 450 (iPhone SE, geschätzt), 375 × 629, 390 × 664 und 430 × 740 px.
- Grenzen der Messung:
  - Playwright-WebKit unter Linux ist nicht Safari auf dem iPhone. Schriftglättung, Silbentrennung und die dynamischen Leisten weichen ab.
  - Chromium mit Emulation ist nicht Chrome auf Android.
  - Die Prüfung auf dem eigenen Handy bleibt Alex' Schritt (Brief).

### 2.2 Screenshots: erster Bildschirm

Oben ist jeweils WebKit (iPhone), unten Chromium (Android), links 320 px, rechts 430 px. Die Bewerbung ignoriert hell und dunkel (feste Firmenfarben), darum gibt es sie nur einmal.

*(Screenshot not included in the public repository.)*

*(Screenshot not included in the public repository.)*

*(Screenshot not included in the public repository.)*

*(Screenshot not included in the public repository.)*

*(Screenshot not included in the public repository.)*

Die ganzen Seiten liegen nicht im Repo, um es klein zu halten. Es sind 48 Aufnahmen: 3 Seiten, 4 Breiten, hell und dunkel, 2 Engines. Dazu kommen die 1440-px-Referenzen. Alles ist in der Sitzung als ZIP übergeben. Wiederholbar aus `9dc9b3e`, siehe Abschnitt 3.

### 2.3 Befund gegen die «Abnahme Phase A»

| Kriterium | Heute | Erfüllt |
|---|---|---|
| Kein horizontales Scrollen bei 320, 375, 390, 430 px | Kein Überlauf in allen 120 Messungen | ja |
| … auch mit 200 % Zoom | **Seitenzoom** (CSS-Breite halbiert: 160, 187, 195, 215 px): Überlauf in 84 von 120 Messungen. **200 % Textgrösse:** Überlauf bei 320 px auf allen 12 CV-Seiten, ab 375 px keiner. Ursache ist der Zeitraum in Mono mit `nowrap` (`.timeline-range`), bei 160 px auch Stufenwort und Sprachniveau (`nowrap`) | nein |
| Name 40 px, höchstens zwei Zeilen | 50 px Instrument Serif: bei 320 px zwei Zeilen, ab 375 px eine | nein (Grösse) |
| Weitere Grössen nach `cv-ruhig`, Text mindestens 16 px | Kleinster Text 16 px, aber Skala `cv-heute` | teilweise |
| Erster Bildschirm: Name, Zielrolle bzw. Headline, Ort, Weg zu PDF und Kontakt | siehe Tabelle unten | nein |
| Zeitraum auf der Zeile der Organisation | In allen Stationen und Einträgen eine eigene Zeile über der Rolle | nein |
| Deutsche Wörter trennen sauber | Kein `hyphens`. Bei 100 % bricht kein Wort mitten im Wort, alle 1182 Umbrüche liegen an vorhandenen Bindestrichen. Bei 200 % Textgrösse gibt es 362 Brüche mitten im Wort, ohne Trennstrich («Berufserfahr\|ung», «De\|utsch», «Mus\|ter») | nein (bei Zoom) |
| URLs und E-Mail brechen um | Ja. Die LinkedIn-Adresse bricht bei 320 px am Bindestrich | ja |
| Ziele mindestens 44 × 44 px | Keine Verstösse, alle Seiten, Breiten und Engines | ja |
| Navigation verdeckt nichts, Sprung landet unter dem Titel | Unter 1024 px ist die Navigation nicht sticky. Nach dem Sprung steht der Titel 65 px unter der Oberkante (Bewerbungen 49 px), sichtbar und frei | ja |
| Stufenpunkte und Wort auf einer Zeile | Nie getrennt. Aber: Beim Haupt-CV rutscht die Stufe bei 320 px in 20 von 33 Zeilen unter den Namen (bei 430 px: 6), ein unruhiger Wechsel. Leere Punkte 1,55:1, leere Balken 1,2:1 | ja, mit Mängeln |
| Porträt scharf, nicht grösser als nötig | Scharf (Datei 480 px, am iPhone 128 × 3 = 384 px nötig). Mit 128 × 160 px grösser als im System (88 px). Hell und dunkel ohne Befund | teilweise |
| Kontrast hell und dunkel | axe (WCAG 2.2 AA inkl. Kontrast): keine Verstösse in 48 Läufen (3 Seiten, 4 Breiten, hell und dunkel, 2 Engines) | ja |
| Geprüft in WebKit und Chromium mobil | Heute testet Playwright nur «Desktop Chrome». Einmalig gemessen: beide Engines zeigen dieselben Befunde, die Höhen weichen um höchstens 30 px ab | nein (Projekte fehlen) |

**Erster Bildschirm** (✓ sichtbar, ✗ nicht sichtbar, – kommt auf der Seite nicht vor; gleich in beiden Engines):

| Seite | Breite | Name | Zielrolle bzw. Headline | Ort | Kontakt | PDF |
|---|---|---|---|---|---|---|
| Haupt-CV | 320 | ✗ | ✗ | ✗ | ✗ | ✗ |
| | 375 | ✓ | ✓ | ✗ | ✗ | ✗ |
| | 390 | ✓ | ✓ | ✓ | ✗ | ✗ |
| | 430 | ✓ | ✓ | ✓ | ✓ | ✗ |
| Rollenversion (IT BSM, PM, ICT) | 320 | ✓ | Zielrolle ✓, Headline ✗ | ✗ | ✗ | ✗ |
| | 375–430 | ✓ | ✓ | ✓ | ✓ | ✗ |
| Beispiel Automobile (mit Bewerbungsleiste) | 320 | ✗ | ✗ | ✗ | ✗ | ✗ |
| | 375 | ✓ | ✓ | ✗ | ✗ | ✗ |
| | 390 | ✓ | ✓ | ✓ | ✗ | ✗ |
| | 430 | ✓ | ✓ | ✓ | ✓ | ✗ |
| Bewerbung (Globex Consulting, Beispielbank) | 320 | ✗ | ✗ | – | ✗ | ✓ |
| | 375–390 | ✓ | ✓ | – | ✗ | ✓ |
| | 430 | ✓ | ✓ | – | ✓ | ✓ |

Microsoft zeigt bei 320 px zusätzlich die Zielrolle. Der Kontakt der Bewerbungen kommt über den Link «Kontakt» in der Abschnittsnavigation. Der CV-Leitfaden verbietet Kontaktdaten im Kopf von Bewerbungen.

Warum der Platz fehlt (Haupt-CV, 375 × 629 px, WebKit):

| Block | Position |
|---|---|
| Test-Bar | 0–202 px |
| Abstand | 202–250 px |
| Sprachschalter, eigene Zeile | 250–295 px |
| Porträt | 311–471 px |
| Name | 487–534 px |
| Headline | 550–600 px |
| Ort | 616–642 px |
| Kontakt | 666–711 px |

Bei Bewerbungen belegt die Bewerbungsleiste 148–205 px, weil der Titel in Mono auf 3–4 Zeilen umbricht und die Knöpfe bei 320 px untereinander stehen.

**Schätzung nach der Umstellung** (in Phase A mit Tests zu belegen):

- Der Name misst in Instrument Sans 40 px 340 px Breite. Bei 320 px sind das zwei Zeilen, ab 375 px knapp eine.
- Angenommene Änderungen:
  - Test-Bar entfernt.
  - Porträt 88 × 110 px, Sprachschalter in derselben Zeile.
  - Kopfabstand 24 px.
  - Knopf «PDF» neben E-Mail und LinkedIn.
- Platz bis und mit Kontakt und PDF bei 320 × 450 px:
  - Haupt-CV: etwa 385 px, passt.
  - Rollenversion: etwa 440 px mit zweizeiliger Zielrolle, passt knapp.
  - Bewerbung: passt nur, wenn die Leiste am Handy auf eine Zeile Titel und eine Zeile Knöpfe schrumpft.

Weitere Beobachtungen:

- Die Papieransichten verkleinern das Blatt am Handy auf 42 %. Der Drucktext ist dann etwa 5 px gross. Das ist so gewollt (Vorschau des Drucks per Direktlink) und nicht Teil von Phase A.
- Nur in Chromium: Die Hervorhebung des aktuellen Abschnitts (`scroll-target-group`) markiert auch auf der nicht klebenden Mobile-Navigation «Profil». Harmlos.
- Auf älteren iPhones fehlt der Gedankenstrich vor den Highlights. `content: "–" / ""` braucht laut MDN iOS 17.4, ältere Safari verwerfen die ganze Deklaration (siehe 4.4).
- Der Gedankenstrich wirkt in Aufnahmen mit 1 × grau. Bei 3 × ist er Granat-Rot. Das ist Kantenglättung, kein Fehler.

## 3. Was die Umstellung sichtbar ändert

**Alle Seiten**

- Eine Schrift: Instrument Sans 400. Die Serif-Titel und die Mono-Daten verschwinden, ebenso jedes Halbfett (Organisation, Gruppentitel, Knöpfe).
- Grössen: Name 50–104 → 40–48 px, H2 32–52 → 26–30, Rolle 22–28 → 21, Text 16,5 → 17, Headline 18–21 → 18.
- Der Zeitraum steht auf der Zeile der Organisation, zum Beispiel «Beispiel Kantonalbank (BKB), Zürich · 12.2023 – 02.2026». Die Jahre der Station bleiben in Rollengrösse (Einspruch 1).
- Die Abstände werden enger: zwischen Abschnitten 64–112 → 48–80 px, `space-5` 48 → 40 und `space-6` 64 → 56 px.
- Abschnittstitel mit Linie in Akzentfarbe statt grauer Linie über dem Abschnitt (Entscheid F).
- Leere Stufenpunkte werden deutlich dunkler, `ink-faint` etwas dunkler.
- Porträt am Handy 88 statt 128 px, der Sprachschalter steht neben dem Porträt.
- Eintrittsmoment: Einspruch 2.

**Haupt-CV (DE, EN)**

- Die Test-Bar fällt weg. Die drei Papieransichten bleiben per Direktlink erreichbar (`/<id>/papier/`).
- Die Legende steht am Ende der Kompetenzen.
- Stufenzeilen am Handy einheitlich: Name, darunter Punkte und Wort.
- Knopf «PDF» im Kopf (Entscheid A).

**Rollenversionen (IT Business Service Manager, Beispiel Automobile, Product Manager, ICT-Architekt; DE und EN)**

- «Bewerbung als …» steht unter dem Namen, in 18 px und Akzentfarbe statt Mono 16 px über dem Namen.
- Claim in 22–24 px ohne Linie links (heute 23–36 px Serif mit Linie).
- USP-Titel in Rollengrösse.
- Top 10 mit Punkten statt Balken. Schlüssel-Chips mit einer kleinen Marke statt der Linie links (Entscheid E, Einspruch 3).
- Beispiel Automobile-Anschreiben: Betreff und Unterschrift ohne Halbfett und Serif, Ort und Datum ohne Mono.

**Bewerbungen (Globex Consulting DE, Beispielbank EN, Microsoft EN)**

- Die Firmenfarben bleiben gleich, nur die Token-Namen im `style`-Attribut ändern sich.
- Kernkompetenzen, Kontakt und Weitere Kenntnisse ohne Halbfett. Labels in `color-text-muted`.
- Brief: Absender, Betreff und Unterschrift ohne Halbfett und Serif.
- Die Bewerbungsleiste wird am Handy kompakter und bekommt einen Link «Kontakt» (Entscheid G).
- Das PDF in einem Stück ist die Desktop-Ansicht und ändert sich mit.

**Druck und PDF**

- Name 40 → 24 pt, H2 16,5 → 13, Claim 14 → 12, Rolle 12 → 11 pt.
- Organisation 9 pt halbfett → 10 pt regular. Zielrolle 8,25 pt Mono → 10 pt.
- Textzeilen 1,45 → 1,6. Zum Umfang siehe 4.1.
- Eine eingebettete Schrift statt 4–5.
- Kopfzeile und Seitenzahl stehen unten statt oben.
- 1b und 1c nehmen ihre Farben aus den Tokens. Einziger sichtbarer Unterschied: `text-faint` in Indigo #6a707b → #666c77.
- Layout 1c: die drei USP-Aussagen stehen vor der Profil-Zusammenfassung (System) statt danach.

**1440-px-Referenz für Phase B.** Die Vollseiten-Aufnahmen vorher sind in der Sitzung übergeben (ZIP):

- Haupt-CV DE (hell und dunkel) und EN.
- Rollenversionen: IT Business Service Manager DE (hell und dunkel) und EN, Product Manager DE und EN, ICT-Architekt DE und EN, Beispiel Automobile mit Anschreiben.
- Die drei Bewerbungen und die drei Papieransichten.

Wiederholbar aus `9dc9b3e`:

```sh
git worktree add ../vorher 9dc9b3e && cd ../vorher
npm ci && npm run build
node scripts/screenshot.mjs --site dist --out ../vorher-bilder --page index.html
```

Weitere Seiten mit `--page`. Das Skript nimmt 1440 px hell und dunkel auf.

## 4. Risiken

### 4.1 PDF-Seitenzahlen

Heute und mit einer Probe gemessen: A4 aus den Druckstilen, Chromium 141, Füllung der letzten Seite. Bei Bewerbungen zählt Seite 3, denn der Brief beginnt auf einem eigenen Blatt.

Die Probe setzt nur die Druckwerte von `cv-ruhig`, eine Familie in 400 und Textzeilen 1,6, ohne die übrigen Layoutänderungen.

| PDF | Heute | Füllung | Probe `cv-ruhig` |
|---|---|---|---|
| Haupt-CV DE / EN | 4 / 4 (Limit) | 45 % / 46 % | 4 (61 %) / 4 (50 %) |
| IT Business Service Manager DE / EN | 3 / 3 | 80 % / 68 % | 3 (83 %) / 3 (81 %) |
| Product Manager DE / EN | 3 / 3 | 38 % / 45 % | 3 (60 %) / 3 (48 %) |
| ICT-Architekt DE / EN | 4 / 4 | 55 % / 75 % | 4 (56 %) / 4 (56 %) |
| Beispiel Automobile | 4 | 53 % | 4 (54 %) |
| Beispiel Automobile Anschreiben | 1 (genau 1 verlangt) | 84 % | 1 bei 10 pt / 1,36 wie heute; **2** bei 10 pt / 1,6; 1 (knapp) bei 9 pt / 1,6 |
| Globex Consulting, Beispielbank, Microsoft | 4 (3 + Brief) | S. 3: 86 %, 87 %, 85 % | S. 3: 89 %, 90 %, 88 % |

- Alle Seitenzahlen halten, aber die Reserve schrumpft.
- Die Bewerbungen sind am knappsten. Ihre kurzen Abschnitte ziehen als Ganzes auf das nächste Blatt (`break-inside: avoid`). Passt einer nicht mehr auf Seite 3, rutscht der Brief auf Seite 5, und der Test «höchstens 4 Seiten» wird rot.
- Die Umstellung spart auch Platz: Der Zeitraum auf der Zeile der Organisation spart in 1a und 1b eine Zeile pro Station.
- Gegenmittel, falls es nicht reicht, in dieser Reihenfolge:
  1. Abstände im Druck.
  2. `break-inside` nur für Zeilen statt ganzer Abschnitte.
  3. Zeilenhöhe 1,45 für Listen als dokumentierte Abweichung.
- Das Anschreiben ist heute 10 pt mit Zeilenhöhe 1,36. Mit den Textzeilen des Systems (1,6) wird es bei 10 pt zwei Seiten lang; gemessen am Beispiel Automobile-Anschreiben. Es bleibt eine Seite, wenn der Brief `print-body` übernimmt (9 pt, 1,6; knapp) oder 1,36 als dokumentierte Abweichung behält (Entscheid L).
- `pages.yml` druckt heute nur die drei Rollenversionen mit Layout und die drei Bewerbungen. Ein PDF-Link auf Haupt-CV und Rollenversionen (Entscheid A) braucht neue Druckschritte in `pages.yml` und im Linktest (`tests/unit/profiles.test.mjs`).

### 4.2 Tests mit festen Werten

| Test | Prüft heute | Mit PR 2 |
|---|---|---|
| `tests/e2e/desktop.spec.mjs` Zeile 38 | Datum über der Rolle bei 375 px | umdrehen: Zeitraum auf der Zeile der Organisation (Phase A) |
| `tests/e2e/desktop.spec.mjs` Zeilen 23–28 | Datumsspalte höchstens 176 px, Zeitraum einzeilig neben den Jahren (1440 px) | an die neue Station anpassen (Phase B) |
| `tests/unit/profiles.test.mjs` Zeile 158 | «dates first in every entry» | umdrehen (Phase A) |
| `tests/unit/design-preview.test.mjs` Zeile 20 | sechs eingebettete Schriften | eine (Phase A) |
| `tests/unit/applications.test.mjs` Zeilen 71, 77, 111, 112 | Token-Namen `--surface-*` von `brand.mjs` und im `style`-Attribut | neue Namen (Phase A, im selben Commit wie die Tokens) |
| `tests/e2e/desktop.spec.mjs` Zeile 77, `tests/e2e/layout.spec.mjs` Zeile 170 | lesen `--surface-page` | `--color-bg` |
| `tests/unit/profiles.test.mjs` Zeile 151, `tests/unit/timeline.test.mjs` | Jahre der Station («2018 – 2022», «Seit 2023») | bleiben, falls Einspruch 1 angenommen wird |
| `tests/e2e/helpers.mjs` | Breiten 375, 768, 1440; nur Chromium | 320, 390 und 430 dazu, Projekte «iPhone» und «Pixel» |
| `tests/e2e/layout.spec.mjs` Zeilen 100, 158 | 1 Seite pro Brief, höchstens 4 Seiten pro CV | bleiben; Risiko 4.1 |
| neu: `pdffonts` | – | Die Coaching-Seite enthält «≥». Das Zeichen fehlt in Instrument Sans (lateinischer Satz), im Druck käme eine Ersatzschrift dazu. Test auf CVs, Briefe und Bewerbungen beschränken oder den Inhalt ändern (Entscheid K) |

Dazu CI: `check.yml` und `pages.yml` installieren nur Chromium. Mit den Projekten «iPhone» und «Pixel» brauchen beide `npx playwright install --with-deps chromium webkit`. Auch `pages.yml` braucht das, weil es `npm run check` ausführt.

### 4.3 Firmenfarben der Bewerbungen

- **`brand.mjs` muss die neuen Namen schreiben.** Heute setzt es `--surface-page`, `--ink`, `--brand` usw. im `style`-Attribut von `<html>`. Das wirkt, weil `--color-bg: var(--surface-page)` gilt. Werden die System-Namen primär und die alten Namen zu Aliasen (`--surface-page: var(--color-bg)`), kommen die Firmenfarben nicht mehr an, und die Seite fällt auf Granat zurück. Das muss im selben Commit wie die Tokens geschehen, mit den Tests aus 4.2.
- Die Werte ändern sich nicht. Die Mindestkontraste von `brand.mjs` (Text 7, `muted` 5,5, `faint` 4,6, Akzent 4,5, Marken 3) liegen über den Regeln des Systems. `color-level-empty` folgt als Alias von `color-text-faint` automatisch der Firmenfarbe.
- Das `style`-Attribut schlägt weiterhin alle Theme-Bereiche, auch dunkel.
- **Build:** `scripts/build.mjs` verlangt genau einen `@media print {`-Block im gesamten CSS. Aus ihm entsteht `assets/paper.css` für die Papieransichten. Schreibt `scripts/tokens.mjs` eigene Druckthemes in einen weiteren `@media print`-Block, bricht der Build. Die Themes müssen deshalb als Attribut-Bereiche kommen, zum Beispiel `[data-sheet="petrol"]`.

### 4.4 WebKit (iPhone)

| Thema | Befund | Folge für Phase A |
|---|---|---|
| Silbentrennung | `hyphens` gibt es ohne Präfix erst ab iOS 17, davor nur `-webkit-hyphens` (MDN). Safari trennt Deutsch nur für `de`; `de-CH` kennt es nicht. Chrome Android trennt Deutsch ab Version 87. Playwright-WebKit unter Linux nutzt eigene Wörterbücher | Beide Schreibweisen setzen, `lang="de"` behalten, auf dem Gerät prüfen |
| `position: sticky` | Nur ab 1024 px (Desktop) in Gebrauch. Unterstützt ab iOS 13, kein `overflow` auf Vorfahren | kein Risiko am Handy; auf dem iPad quer (1024 px) greift es |
| `100vh` / `dvh` | Nirgends in Gebrauch | so lassen; falls nötig `svh`/`dvh` (ab iOS 15.4) |
| `text-size-adjust` | `-webkit-text-size-adjust: 100%` ist gesetzt, dazu ohne Präfix. Verhindert, dass iOS im Querformat die Schrift vergrössert | so lassen, nie `none` |
| Gedankenstrich der Highlights | `content: "–" / ""` braucht iOS 17.4, ältere Safari verwerfen die Deklaration | Ersatz-Deklaration davor |
| Weiteres | `text-wrap: balance` ab iOS 17.5, `color-mix()` ab 16.2 (Unterstreichung fällt sonst auf die Textfarbe zurück), `:has()` ab 15.4 (nur Desktop) | kein Handlungsbedarf |

## 5. Einspruch

Hier verlangt das System etwas, das Regeln oder Entscheiden im Repo widerspricht. Vorschläge in 7.2.

1. **Zeitstrahl: Periode statt Startjahr.**
   - System: «Startjahr in Rollengrösse neben der Rolle» (`varianten.md`, Musterblatt: «2019»).
   - Alex, 24.09.2026 abends: Jede Station zeigt die Jahre ihres Zeitraums, zum Beispiel «2021 – 2023» oder «Seit 2023». Ein Startjahr allein las sich wie eine Marke auf einer Achse.
   - Der Entscheid ist jünger als der Stand des Systems (24.09., 12:12 UTC).
   - Vorschlag: Periode behalten, in Rollengrösse, als Abweichung.
2. **Eintrittsmoment.**
   - System: nur `transform` und `opacity`, Einblenden in 220 ms.
   - Repo (Alex, 23.09.): Name per `clip-path` von links in 700 ms, Einblenden in 480 ms.
   - Vorschlag: den Moment behalten (einmal pro Besucher), aber nach System umsetzen: nur Einblenden, 220 ms.
3. **Schlüssel-Chips: nie nur Farbe.**
   - Das System verbietet farbige Ränder links.
   - Die 3-px-Linie ist heute das einzige Merkmal der Schlüssel-Kompetenzen ausser Farbe. Die Repo-Regel verlangt «nie nur Farbe». Entfällt nur die Linie, verletzt das diese Regel.
   - Vorschlag: ein kleines gefülltes Quadrat in `color-accent` als CSS-Form vor dem Namen, erklärt in der Legende. Füllung und verstecktes Wort bleiben.
4. **Firmenfarben am Bildschirm.**
   - D5 sagt: Website am Bildschirm immer Granat.
   - Der Brief erlaubt Firmenfarben bei Bewerbungen, am Bildschirm wie heute. Microsofts vier Logofarben widersprechen zudem «genau eine laute Farbe pro Blatt».
   - Vorschlag: Der Brief gilt (Alex, 26.09.), beides als Abweichung festhalten.
5. **Dossier-Regeln gegen Inhaltsentscheide.** Laut Brief gehen Alex' Inhaltsentscheide vor. Keiner davon ändert sich in PR 2; alle kommen mit Status in `DESIGN.md` unter «Abweichungen vom Design-System».
   - Lücke 03–06.2021 nicht erklärt; das System verlangt eine Erklärung ab einem Monat.
   - Keine Zertifikate in Rollenversionen und Bewerbungen.
   - Zeitraum ab 03.2026 weggelassen.
   - Adresse, Geburtsdatum, Nationalität und Mobilität nicht auf der Website. Alex entscheidet selbst, keine neuen Fakten.
   - Hard- und Soft-Skills im Kurzprofil nicht getrennt.
6. **Kontakt im Kopf der Bewerbungen.**
   - Das Musterblatt setzt den Kontakt in den Kopf.
   - Der CV-Leitfaden (Alex) verbietet Kontaktdaten im Kopf von Bewerbungen und setzt den Kontakt ans Ende.
   - Vorschlag: Der Leitfaden gilt. Für den «Weg zu Kontakt» kommt ein Link in die Bewerbungsleiste (Entscheid G).
7. **JSON-LD.**
   - Das System schreibt JSON-LD.
   - Das Repo verbietet Inline-Scripts (getestet), und der Brief verschiebt JSON-LD auf später.
   - Vorschlag: nicht in PR 2.
8. **Quelle der Wahrheit.**
   - Die README des Systems sagt noch «Verbindlich ist `DESIGN.md`». Den Satz ersetzt Alex im Design-System.
   - `docs/source-of-truth.md` nennt `design/tokens.css` als kanonische Tokens. Nach PR 2 entsteht diese Datei aus `design/tokens.json`. Die Datei darf in PR 2 nicht geändert werden; bis zum eigenen Auftrag widersprechen sich die Dokumente.
   - `DESIGN.md` («Values in `design/tokens.css` are canonical») und `CLAUDE.md` (Dateiliste) passt PR 2 an.

## 6. Plan für Phase A und B

Branch `design/pr2-einzelschrift`, ein PR gegen `main` als Entwurf, kein Merge ohne Alex' Freigabe. Jeder Commit ist einzeln grün (`npm run check`).

**Phase A: Mobile (320–767 px)**

| Commit | Inhalt | Dateien |
|---|---|---|
| A1 Grundlagen | Brief, Übergabe unverändert, Entscheide D1–D8 und F1–F4 (rekonstruiert, markiert) mit Stand v3 und Prüfsumme | `docs/brief.md`, `design/handoff/2026-09-26-cv-creator/`, `docs/design-decisions.md`, `CLAUDE.md` |
| A2 Tokens | `tokens.json` kopieren. `scripts/tokens.mjs` erzeugt `tokens.css`: Granat hell und dunkel in den drei Bereichen wie heute, die übrigen Themes als `[data-sheet]`, Bildschirmgrössen als `clamp()` laut `HANDOFF.md`, Druckgrössen, alte Namen als Aliase. `brand.mjs` schreibt die neuen Namen. Test «`tokens.css` entspricht `tokens.json`» schon hier | `design/tokens.json`, `design/tokens.css`, `scripts/tokens.mjs`, `scripts/lib/brand.mjs`, `package.json`, `tests/unit/` |
| A3 Eine Schrift | Nur Instrument Sans 400, Serif und Mono entfernen, keine Laufweite, kein Halbfett, `tabular-nums` für Daten | `site/fonts.css`, `scripts/build.mjs`, `package.json`, `package-lock.json`, `site/styles.css`, `tests/unit/design-preview.test.mjs` |
| A4 Reihenfolge | Zielrolle unter den Namen, Zeitraum auf die Zeile der Organisation, Legende ans Ende, Test-Bar entfernen (Papieransichten bleiben), «←» durch ein Wort ersetzen | `site/templates.mjs`, `scripts/build.mjs`, `site/styles.css`, `tests/` |
| A5 Kopf | Porträt 88 px, Sprachschalter daneben, Abstände nach System, PDF-Knopf (Entscheid A), kompakte Bewerbungsleiste mit «Kontakt» (Entscheid G) | `site/templates.mjs`, `site/styles.css`, `.github/workflows/pages.yml`, `tests/` |
| A6 Inhalt am Handy | `hyphens` mit Präfix, `overflow-wrap: anywhere` nur für URLs, Zeitraum darf bei kleinster Breite umbrechen, Stufenzeilen einheitlich, Punkte statt Balken, Chip-Marke, Claim ohne Linie, Abschnittslinie, Ersatz für den Gedankenstrich | `site/styles.css`, `site/templates.mjs`, `site/paper.css` |
| A7 Bewegung | Eintrittsmoment nach System (Einspruch 2) | `site/styles.css`, `tests/e2e/desktop.spec.mjs` |
| A8 Tests | Projekte «iPhone» (WebKit) und «Pixel» (Chromium). Breiten 320, 375, 390, 430. 200 % Zoom nach Entscheid B. Prüfungen für den ersten Bildschirm, den Zeitraum und die Stufenzeile. CI installiert WebKit | `playwright.config.mjs`, `tests/e2e/`, `.github/workflows/check.yml`, `.github/workflows/pages.yml` |
| A9 Abschluss | Screenshots nachher (320, 375, 390, 430), Vorschau (Entscheid H), `STATUS.md` | `STATUS.md` |

Die Basis-CSS ist die Mobile-Ansicht. Alles für breitere Bildschirme steht in `min-width`-Regeln und bleibt in Phase A so, wie es heute aussieht, nur mit neuen Tokens. Danach halte ich an, bis Alex Mobile abgenommen hat.

**Phase B: Tablet, Desktop, Druck**

| Commit | Inhalt | Dateien |
|---|---|---|
| B1 Raster | 768, 1024, 1440 px nur über `min-width`: Seitenbreite höchstens 1120 px (`--page-max-width`), Fliesstext 42rem, Name 48 px, Station am Desktop. Bei 320–430 px unverändert gegenüber Phase A (Screenshot-Vergleich) | `site/styles.css`, `tests/e2e/desktop.spec.mjs` |
| B2 Druck | Stile `print-*`, Fusszeile statt Kopfzeile, 1b und 1c über `data-sheet`, Farbe pro Version im Schema (Entscheid I), `paper.css` ohne feste Farben, Seitenzahlen prüfen (4.1) | `site/styles.css`, `site/paper.css`, `site/templates.mjs`, `schema/profile.schema.json`, `data/profiles/*.yaml` (nur das Feld für die Farbe), `scripts/lib/validate.mjs` |
| B3 `DESIGN.md` | Kürzen auf Begründungen, dazu die Tabelle «Abweichungen vom Design-System» (`offen` / `freigegeben`) | `DESIGN.md` |
| B4 Tests | Eine Schrift im PDF (`pdffonts`). Keine Farbwerte in `site/*.css` ausserhalb der Tokens; Firmenfarben liegen in YAML und `brand.mjs`, nicht im CSS. Regel 2 bei 375 und 1440 px am Haupt-CV und einer Rollenversion; ein Block ist der kleinste Container (Kopf, Eintrag, Gruppe), sonst meldet jeder neue Eintrag einen Anstieg | `tests/` |
| B5 Abschluss | `npm run check` grün, `STATUS.md` nachführen, auch die überholten Aussagen (drei Familien, «mono dates stay», Test-Bar, CV-Typografie in `DESIGN.md`) | `STATUS.md` |

Nicht angefasst werden:

- `data/cv.yaml`
- `/bewerbung/` (`static/`)
- `docs/source-of-truth.md`
- Besucherwahl und JSON-LD
- Inhalte in `data/`, ausser dem Farbfeld (B2) und einer Textänderung, falls Alex Entscheid K so trifft.

## 7. Offene Entscheide

### 7.1 Aus dem Brief (nicht Teil von PR 2)

1. **JSON-LD.** Empfehlung: eigener PR nach PR 2.
   - Genau ein Block `application/ld+json`, ohne Kontaktdaten (wie im System).
   - Ein Test erlaubt nur diesen einen Block.
   - Inhalt aus `data/cv.yaml`: Rolle, Arbeitgeber, Sprachen, Kenntnisse der Stufen 3 und 4, Ausbildung. AZ-305 nur, wenn das Zertifikat noch gilt.
2. **Faktenwidersprüche.** Alex entscheidet, Agenten ändern nichts. Empfohlen ist die Regel des CV-Leitfadens: Zeugnis und Diplom gewinnen.
   - MSc-Ende: Datum laut Diplom (03.2020), wenn die Station den Abschluss meint. Sonst 07.2019 als Studienende behalten.
   - Helix-Ende und Globex Consulting-Start: laut Arbeitszeugnis. `/bewerbung/` danach angleichen, falls Alex das will.
   - Zahl der Zielarchitekturen bei Globex Consulting: weglassen, bis ein Zeugnis eine Zahl nennt.
   - swiss IT Services: Schreibweise und Ort laut Handelsregister oder Zeugnis.
   - Aussagen aus Arbeitszeugnissen in den `note`-Feldern: einzeln freigeben oder streichen, bevor weitere Bewerbungen entstehen.
3. **Neue Reihenfolge für Haupt-CV und Rollenversionen.** Empfehlung: erst nach PR 2 entscheiden, weil Phase B Inhalt und Reihenfolge nicht ändern darf.
   - Rollenversionen: Erfahrung vor die Kompetenzen. Leitfaden und System-Layout sind sich hier einig.
   - Kontakt im Kopf lassen, wegen der Abnahme für den ersten Bildschirm.
   - Haupt-CV wie heute.
4. **`ink-faint`.** Empfehlung: mit `tokens.json` v3 erledigt. Das System hat jetzt #6e645b (5,18:1 auf `color-bg`, 4,67:1 auf `surface-sunk`). Der Stand im Brief (#786e65) ist überholt, ein Designer-Review braucht es dafür nicht mehr.

### 7.2 Neu, für PR 2 zu entscheiden

A bis H und J braucht es vor Phase A, I, K und L vor dem Druckteil.

| | Frage | Empfehlung |
|---|---|---|
| A | Welches PDF verlinken Haupt-CV und Rollenversionen im ersten Bildschirm? | Das A4-Dossier aus den Druckstilen (DE und EN), Knopf «PDF» neben E-Mail und LinkedIn. `pages.yml` druckt es beim Deploy, das ist die stehende Ausnahme in `CLAUDE.md`. Dateiname nach Leitfaden, zum Beispiel `Alex-Muster_Lebenslauf.pdf`. Die neue Druckgestaltung kommt erst nach Phase B; auf `main` gelangt das PDF ohnehin erst mit dem ganzen PR |
| B | Was heisst «200 % Zoom» am Handy? | Zwei Prüfungen. Erstens 200 % Textgrösse bei 320–430 px: kein horizontales Scrollen, saubere Trennung. Zweitens Seitenzoom 200 % (CSS-Breite 160–215 px, wie «aA» in Safari): kein horizontales Scrollen, Umbruch im Wort erlaubt, weil der Name bei 160 px breiter ist als die Spalte |
| C | Station: Periode oder Startjahr? | Periode (Einspruch 1) |
| D | Eintrittsmoment | Nach System: nur Einblenden, 220 ms (Einspruch 2) |
| E | Kompetenzprofil der Rollenversionen | Top 10 und Board bleiben (Inhalt aus Alex' Artefakt). Balken werden Punkte wie im System. Schlüssel-Chips mit Quadrat statt Linie (Einspruch 3) |
| F | Linien | Claim ohne Linie links, Abschnittstitel mit Linie in Akzentfarbe (Musterblatt) |
| G | «Weg zu Kontakt» bei Bewerbungen | Link «Kontakt» in der Bewerbungsleiste neben «PDF herunterladen» |
| H | Vorschau für Phase A | Echte Daten gehören laut Repo-Entscheid nicht in claude.ai-Artefakte. Darum Screenshots der echten Seiten, dazu eine Vorschau mit fiktiven Daten (Robin Muster) als privates Artefakt, damit Alex auf dem eigenen iPhone tippen und zoomen kann |
| I | Farbe pro Version | Feld `color` neben `layout`, eingeführt in Phase B. Werte wie heute: Product Manager Petrol, ICT-Architekt Indigo, sonst Granat |
| J | WebKit in CI und in der Cloud-Umgebung | Ja: `npx playwright install --with-deps chromium webkit` in `check.yml` und `pages.yml` (etwa eine Minute mehr). Ins Setup-Skript der Umgebung gehören WebKit und `poppler-utils` (für `pdffonts`) |
| K | «≥» auf der Coaching-Seite | Text ändern zu «Fit mindestens 70 %» (Inhalt, Alex entscheidet). Sonst den `pdffonts`-Test auf CVs, Briefe und Bewerbungen beschränken |
| L | Anschreiben im Druck: `print-body` (9 pt, 1,6) oder heute (10 pt, 1,36)? | 10 pt mit 1,36 behalten, als Abweichung. Mit 9 pt und 1,6 ist das Beispiel Automobile-Anschreiben schon zu 98 % voll; ein Brief mit den erlaubten 350 Wörtern passt dann nicht mehr sicher auf eine Seite (4.1). Entschieden wird vor dem Druckteil, nicht vor Phase A |
