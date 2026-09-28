# Brief: Personal Portfolio (CV-Generator)

- Slug / Repo: `job-application-generator`
- Typ: persönliches Bewerbungs-Portfolio mit CV-Generator
- Ergebnis: statische, mobile-first CV-Website mit Rollenversionen, Bewerbungen (CV + Motivationsschreiben pro Stelle) und PDFs auf Wunsch; ausgeliefert über GitHub Pages
- Sprachen: Deutsch und Englisch, beide Originale
- Stand: 2026-09-26 · Brief von: Alex Muster

> Wenn kein ⟦ ⟧ mehr in der Datei steht, ist der Brief fertig. Private Daten gehören nicht hierher; Fakten stehen in `data/cv.yaml`.

## Aufgabe

- **Die eine Aufgabe:** Eine Person aus Recruiting oder Fachbereich versteht in unter einer Minute, wer Alex ist, was er kann und warum er zur Stelle passt, und kann das Dossier sofort als PDF weitergeben.
- **Zielgruppen:** Recruiter und Hiring Manager in der Schweiz (Banken, Beratung, Tech, Industrie); Personalvermittler; Recruiting-Software (Stichworte im Text).
- **Wichtigste Aktionen:** Profil lesen, PDF herunterladen, Kontakt aufnehmen. Rollenversionen und Bewerbungen erreicht der Empfänger über einen direkten Link, nicht über die Navigation.
- **Ausgaben:**
  - Haupt-CV DE/EN (öffentlich, indexiert)
  - Rollenversionen mit Anschreiben und Papieransicht (`noindex`, nicht verlinkt)
  - Bewerbungen `kind: application` pro Stelleninserat, in Firmenfarben (`noindex`, nicht verlinkt)
  - Textseiten (Coaching, Stichwortanalysen)
  - PDFs nur auf Wunsch oder beim Deploy für die Download-Links
- **Was es nicht tun soll:** kein SaaS, kein Login, keine Uploads, keine Live-KI, kein automatischer Design-Sync.

## Private Daten

- Alex entscheidet selbst, welche privaten Angaben (z. B. Adresse, Telefon, Geburtsdatum) veröffentlicht werden, und prüft das vor der Veröffentlichung. Agenten entfernen oder verstecken keine privaten Angaben, die Alex freigegeben hat, und fügen keine neuen hinzu.
- `/bewerbung/` bleibt vorerst unverändert online. Alex entscheidet am Schluss über Inhalt und Zukunft der Seite.
- `docs/source-of-truth.md` schliesst diese Angaben heute standardmässig aus. Das bleibt als Grundregel bestehen; Alex' Freigabe ist die Ausnahme. Eine Anpassung des Vertrags ist ein eigener Auftrag und nicht Teil von PR 2.

## Quellen (verbindlich)

| Sache | Verbindliche Quelle | Hinweis |
|---|---|---|
| Fakten über Alex | `data/cv.yaml` (freigegeben 22.09.2026) | Änderungen nur mit ausdrücklicher Freigabe |
| Regeln für Inhalte | `docs/cv-guide.md`, `docs/applications.md`, `docs/profiles.md` | CV-Checkliste der ICT-Standortbestimmung |
| Design-Regeln und -Werte | Design-System **CV Creator** (intern «Granat»), Stand 24.09.2026, `tokens.json` Version 3 | Das Design-System ist die Quelle, das Repo folgt. Im Design-System wird «Verbindlich ist `DESIGN.md`» durch «Das Repo folgt diesem System» ersetzt. |
| Umgesetzter Stand | `design/tokens.json` (unveränderter Export) + Eintrag in `docs/design-decisions.md` mit Datum und Version | Eine neue Design-Runde gilt im Repo erst nach dem nächsten Export und einem PR |
| Design-Entscheide | `docs/design-decisions.md` (neu, aus D1–D8 und F1–F4) | Vorlage: `ENTSCHEIDE.md` aus dem Übergabepaket. Fehlt sie, rekonstruiert der Agent die Entscheide und markiert sie als «rekonstruiert» |
| Entwürfe | Claude Design «CV Generator» bzw. Nachfolger, Export nach `design/handoff/<datum>/` | Umgesetzt wird nur, was unter `design/handoff/` liegt |
| Stelleninserate | `data/applications/*.yaml` → `job` | jede Bewerbung beginnt mit einem Inserat |

**Vorrang bei Konflikten:** Freigegebene Inhaltsentscheide von Alex (z. B. keine Zertifikate in Rollenversionen und Bewerbungen, Lücke 03–06.2021 nicht erklärt, Zeitraum ab 03.2026 weggelassen) gehen vor den Dossier-Regeln des Design-Systems. Jede solche Abweichung steht in `DESIGN.md` unter «Abweichungen vom Design-System».

## Design (aus dem Design-System)

- Eine Schriftfamilie, Regular 400; Hierarchie aus Grösse, Farbe und Raum, nie aus Fett, Versalien oder zweiter Familie.
- Grössenskala `cv-ruhig`: Name 40→48 px (Druck 24 pt), Abschnitt 26→30 px (13 pt), Text 17 px (9 pt), Meta 16 px (7.5 pt).
- Farbe pro Version: Granat (Website immer Granat Papier/Abend), Petrol, Indigo, Tanne, Ocker, Marine, Graphit.
- Firmenfarben nur bei Bewerbungen, nur aus `data/applications/*.yaml`, mit Kontrastprüfung (`scripts/lib/brand.mjs`). Sie sind die einzige Ausnahme von «keine Farbwerte ausserhalb der Tokens».
- Layouts: `cv`, `1a`, `1b`, `1c`.
- Schrift: Instrument Sans (F2). Eine andere der zehn Familien wäre ein eigener PR nach Sichtung der Screenshots.
- Besucherwahl am Bildschirm (Version, Schrift, Grösse): später, eigener Auftrag.
- Test-Bar auf dem Haupt-CV: wird mit PR 2 entfernt. Die Papieransichten bleiben per Direktlink erreichbar.

## Reihenfolge: Mobile zuerst, dann Desktop

Der CV wird oft auf dem Handy geöffnet (Link aus Mail, LinkedIn, Inserat) und oft am Desktop gelesen. Beides muss stimmen, aber in dieser Reihenfolge:

1. **Phase A – Mobile (320–767 px).** PR 2 wird zuerst auf dem Handy fertig und abgenommen. Die Basis-CSS ist die Mobile-Ansicht; Desktop kommt nur über `min-width`-Regeln dazu.
2. **Phase B – Tablet und Desktop (768 und 1024–1440 px).** Erst nach der Abnahme von Phase A. Desktop baut auf der Mobile-Ansicht auf und ändert nur Raster, Spalten und Abstände, nie Inhalt oder Reihenfolge.
3. **Druck/PDF** zum Schluss, nach Phase B.

**Abnahme Phase A (Mobile ist «fertig», wenn):**

- Kein horizontales Scrollen bei 320, 375, 390 und 430 px, auch mit 200 % Zoom.
- Name 40 px und höchstens zwei Zeilen; alles Weitere nach `cv-ruhig`, Text mindestens 16 px.
- Beim ersten Bildschirm ohne Scrollen sichtbar: Name, Zielrolle bzw. Headline, Ort und der Weg zu PDF und Kontakt.
- Zeitraum auf der Zeile der Organisation; lange deutsche Wörter trennen sauber (`hyphens: auto`, `lang`), URLs und E-Mail brechen um.
- Alle Ziele mindestens 44 × 44 px; Abschnittsnavigation verdeckt keinen Inhalt, Sprung zu Abschnitten landet unter dem Titel.
- Kompetenzen: Stufenpunkte und Wort bleiben auf einer Zeile, auch bei langen Namen.
- Porträt scharf und nicht grösser als nötig; hell und dunkel geprüft.
- Geprüft in **Safari auf iPhone (WebKit)** und **Chrome auf Android**, nicht nur in Desktop-Chrome mit schmalem Fenster. Heute testet Playwright nur mit «Desktop Chrome»; Phase A ergänzt die Projekte «iPhone» (WebKit) und «Pixel» (Chromium mobil).
- Alex prüft auf seinem eigenen Handy per Vorschau-Link oder Screenshots, bevor Phase B beginnt.

**Abnahme Phase B (Desktop):** 1024 und 1440 px, Seitenbreite höchstens 1120 px, Zeilenlänge im Fliesstext etwa 65 Zeichen, Name 48 px, Mobile unverändert (Screenshot-Vergleich).

## Qualität

- `npm run check` grün (Validierung, Build, Unit-Tests, Playwright 375/768/1440, axe hell/dunkel, Zoom, Druck).
- Neue Prüfungen mit der Umstellung: nur eine Schriftfamilie im PDF (`pdffonts`), keine Farbwerte in `site/*.css` ausserhalb der Tokens (Firmenfarben aus den Daten ausgenommen), `tokens.css` entspricht `tokens.json`, Regel 2 (Grösse nimmt nie zu).
- PDF-Umfang: CV höchstens 4 Seiten, Anschreiben genau 1 Seite.

## Entschieden (Alex, 26.09.2026)

1. Das Design-System «CV Creator» ist die verbindliche Design-Quelle; das Repo folgt.
2. Schrift: Instrument Sans (F2).
3. `/bewerbung/`: bleibt vorerst unverändert; Alex entscheidet am Schluss.
4. Private Angaben: Alex entscheidet und prüft selbst (siehe «Private Daten»).
5. Test-Bar: entfernen.
6. Besucherwahl: später.
7. JSON-LD (`schema.org/Person`): später, eigener Auftrag.
8. Reihenfolge: Mobile zuerst (Phase A), dann Desktop (Phase B), dann Druck.

## Offen, nicht Teil von PR 2

1. JSON-LD umsetzen (eigener Auftrag).
2. Faktenwidersprüche (Alex entscheidet, Agenten ändern nichts):
   - MSc-Ende: 07.2019 (`cv.yaml`) oder 03.2020 (Diplom)
   - Helix-Ende: 09.2019 oder 10.2019
   - Globex Consulting, Anzahl Zielarchitekturen: 40+ / 50+ / 60+ / 100+ (bis dahin weggelassen)
   - Globex Consulting-Start: 07.2021 (`cv.yaml`) oder 06.2021 (`/bewerbung/`)
   - swiss IT Services: Schreibweise und Ort (Beispieldorf)
   - Aussagen aus Arbeitszeugnissen in den `note`-Feldern der drei Bewerbungen: freigeben oder streichen
3. Neue Reihenfolge der Bewerbungen (Profil, drei Stärken, Erfahrung, Kontakt am Schluss) auch für Haupt-CV und Rollenversionen übernehmen oder nicht.
4. Designer-Review: `ink-faint` (`#756b62` im Repo, `#786e65` im System).
