Das Designsystem für Alex' Bewerbungs-Website und das gedruckte Schweizer Dossier. Die Regeln und Rollen sind fest. Die Werte (Farbe, Schrift, Grösse, Layout) sind Varianten, die sich frei kombinieren lassen. Jede Kombination muss alle Regeln erfüllen.

> Eine Schrift, ein Schnitt, klare Grössen. Hierarchie entsteht aus Grösse, Farbe und Raum, nie aus Fett, Versalien oder einer zweiten Familie.

Stand 24.09.2026, nach den Entscheiden D1–D8 und F1–F4 (`ENTSCHEIDE.md` im Übergabepaket). Verbindlich ist `DESIGN.md` im Repo; dieses System zeigt dieselben Regeln und den Katalog.

## Regel 1 · Eine Schriftfamilie

- Setze genau eine Familie in Regular 400, Stil normal. Deklariere `font-family` einmal auf dem Wurzelelement; Überschriften erben mit `font: inherit` und setzen nur ein Grössen-Token.
- Eine Superfamilie zählt als zwei Familien (Serif + Sans), eine Mono als weitere Familie. Daten und Daten­spalten laufen in `font-variant-numeric: tabular-nums` derselben Familie.
- Nicht erlaubt: fett oder halbfett (auch nicht für Organisationen, Schlüssel-Skills, den Betreff im Brief), kursiv, Kapitälchen, `text-transform`, Laufweite als Betonung, eine zweite Familie für Daten oder Labels.
- Erlaubt für Nebensächliches: `color-text-muted`, `color-text-faint`, Raum und Haarlinien in `color-border`.

## Regel 2 · Von gross nach klein

| Stufe | Rolle | Token | Bildschirm (375 → 1440 px) | Druck |
| --- | --- | --- | --- | --- |
| 1 | Name | `screen-h1` / `--font-size-h1` | 40 → 48 px | 24 pt |
| 2 | Abschnittstitel, auch Seitenleiste | `screen-h2` | 26 → 30 px | 13 pt |
| 2–3 | Claim (H2 ≥ Claim ≥ H3) | `screen-claim` | 22 → 24 px | 12 pt |
| 3 | Rolle, Abschluss, Zertifikat, USP-Titel, Jahr im Zeitstrahl | `screen-role` | 21 px | 11 pt |
| 4 | Untertitel, Zielrolle, Headline (eine Grösse) | `screen-subtitle` | 18 px | 10 pt |
| 5 | Text: Absätze, Highlights, Kompetenzen, Kontakt | `screen-body` | 17 px | 9 pt |
| 6 | Meta: Legende, Fusszeile, Seitenzahl | `screen-small` | 16 px | 7.5 pt |

- **Skala:** Von einer Stufe zur nächsttieferen wird die Grösse nie grösser, bei 375, 768 und 1440 px und im Druck.
- **Reihenfolge:** Innerhalb eines Blocks (Kopf, Abschnitt, Eintrag, Gruppe) nimmt die Grösse in DOM-Reihenfolge nie zu. Also: kein Datum über der Rolle, keine Zielrolle über dem Namen, die Legende schliesst ihren Block, Seitenzahl und Kopfzeile stehen unten.
- **Decke:** Kein Element ist grösser als der Titel seines Abschnitts, nichts grösser als der Name.
- **Verhältnis (neu):** Der Name ist höchstens 3 × so gross wie der Text, der Abschnittstitel höchstens 1.8 ×. Das verhindert den übergrossen Display-Look. `cv-ruhig` hält 2.8 × und 1.8 × am Bildschirm, 2.7 × und 1.4 × im Druck.

Beispiel Station, richtig: Rolle 11 pt → «Musterbank AG, Zürich · 03.2019 – heute» 10 pt → Zusammenfassung 9 pt in `color-text-muted` → Highlights 9 pt. Falsch: Datum 7.5 pt über der Rolle.

## Was diesen Look verhindert

Diese Muster lassen eine Seite sofort generiert wirken. Keines davon ist erlaubt, auch nicht «nur für die Vorschau»:

- Ein Serif-Display in 70–100 px über kleinem Grotesk-Text. Der Name bleibt bei höchstens 48 px am Bildschirm und 24 pt im Druck.
- Versal-Labels in Mono mit weiter Laufweite über jedem Abschnitt («KOMPETENZEN»). Ein Abschnitt beginnt mit seinem Titel in `screen-h2`, sonst nichts.
- Riesige Kennzahlen als Schmuck. Eine Zahl steht im Satz, mit Einheit, Zeitraum und Basis, in der Grösse ihres Blocks.
- Nummerierte Abschnitte (01 / 02 / 03), wo es keine Reihenfolge gibt; Eyebrows, die nichts klassifizieren.
- Karten mit farbigem Rand links, Verläufe, Emoji, Pfeil- und Häkchen-Zeichen im Text.
- Alles mittig, überall gleich grosse Radien, viel Leerraum ohne Grund.

## Varianten

Vier Achsen, frei kombinierbar. Die Details stehen im Abschnitt «Varianten» dieses Systems und im Repo unter `design/catalog/`.

- **Farbe** – acht Themes in diesem System. Am Bildschirm nutzt die Website immer Granat (Papier oder Abend, D5); die Farbe einer Version gilt für Druck, PDF und Blattansicht.
- **Schrift** – zehn Familien, jede nur in Regular 400. Die Voreinstellung dieses Systems ist `text` (Instrument Sans); der gewählte Entwurf aus Runde 3 legt sie endgültig fest (F2).
- **Grösse** – `cv-ruhig`, oben beschrieben. `cv-heute` und `cv-eine-schrift` bleiben für bestehende Versionen, bis PR 2 sie ablöst.
- **Layout** – `cv` (eine Spalte), `1a` (Seitenleiste), `1b` (Kopfband), `1c` (eine Spalte mit Zeitstrahl). Layouts sind Code und nutzen nur Rollen-Tokens, nie feste Werte.

## Auswahl für Besucher

Neben der Sprachwahl bekommt die Website drei Wahlen. Alle gelten nur am Bildschirm; Druck und PDF nutzen immer `design` der Version.

- **Version** (Haupt-CV und Rollenversionen): wechselt Inhalt, Layout und die Blatt-Farbe laut `design` der Version.
- **Schrift / Font**: eine der zehn Familien. Ein externes Script setzt `data-font` auf `<html>` und speichert die Wahl in `localStorage` (in try/catch); CSS ordnet `[data-font=…]` den Wert `--font-text` zu. Ohne Script gilt die Standardschrift. Geladen wird nur die gewählte Datei.
- **Grösse / Size**: «Normal» oder «Gross». Setzt `data-size` auf `<html>`; `html[data-size=gross] { font-size: 112.5% }`. Weil alle Bildschirmgrössen in rem stehen, bleiben Verhältnisse und Regel 2 erhalten, und Browser-Einstellungen der Besucher wirken weiter.
- Steuerelemente: Klickfläche mindestens 44 × 44 px, per Tastatur bedienbar, sichtbarer Fokus in `color-focus`, beschriftet mit Wörtern, nicht mit Symbolen.

Die Komponente **Musterblatt** zeigt das alles an fiktiven Daten (Robin Muster).

## Farbe

| Rolle | Tokens | Regel |
| --- | --- | --- |
| Flächen | `color-bg`, `color-surface`, `color-surface-sunk` | Jede Textrolle erreicht auf jeder Fläche mindestens 4.5:1, in allen acht Themes. Darum darf jedes Layout jeden Text auf jede Fläche setzen. |
| Text | `color-text`, `color-text-muted`, `color-text-faint` | Drei Stufen, mehr nicht. `color-text-faint` ist die Untergrenze. |
| Akzent | `color-accent`, `color-accent-strong`, `color-accent-soft`, `color-on-accent` | Genau eine laute Farbe pro Blatt. `color-accent-soft` nie als Textfarbe. |
| Linien | `color-border`, `color-border-strong` | Das System trennt mit Linien; Schatten nur für schwebende Ebenen. |
| Fokus | `color-focus` | 2 px Linie, 2 px Abstand, mindestens 3:1 auf allen Flächen. |
| Stufen | `color-accent` gefüllt, `color-level-empty` als Ring | Stufenformen mindestens 3:1; nie Farbe allein, immer mit Wort in der Legende. |
| Nur Bildschirm | `data-1` … `data-3`, `level-1` … `level-4`, `positive`, `attention` | Diagramme und Status auf der Website, nur mit Granat. Im Druck erscheinen keine interaktiven Elemente. |

Beide Granat-Sätze sind entworfen, nicht invertiert: Im Abend-Satz ist `color-on-accent` der Grund, nicht Weiss.

## Typografie

- Setze den Namen in `screen-h1`, Abschnittstitel in `screen-h2`, Rollen in `screen-role`, Organisation und Zeitraum in `screen-subtitle`, allen Fliesstext in `screen-body`, Meta in `screen-small`. Im Druck gelten die `print-`-Stile.
- Zeilenlänge im Fliesstext höchstens `content-max-width` (etwa 65 Zeichen). Überschriften mit `text-wrap: balance`.
- Zeilenhöhen ohne Einheit: 1.1 für den Namen, 1.2–1.35 für Titel, 1.6 für Text.
- Zeiträume als `03.2019 – heute` mit Tabellenziffern, in `color-text-muted`, auf der Zeile der Organisation hinter der Rolle.
- Unterscheide Stufe 4 und 5 über Farbe und Raum, nicht über Gewicht: Organisation in `color-text`, Zeitraum in `color-text-muted`, danach `space-2` Abstand.
- Lange deutsche Wörter trennen mit `hyphens: auto` und `lang="de"`; URLs mit `overflow-wrap: anywhere`.

## Dossier-Konformität (Schweiz)

Die Inhaltsstruktur folgt der CV-Checkliste der ICT-Standortbestimmung. Die Webseite darf die Reihenfolge für die Erzählung umstellen; das gedruckte Dossier hält sie ein.

| Block | Regel |
| --- | --- |
| Adresse | Vorname Nachname, Strasse Nr., PLZ Ort, Mobile, E-Mail. |
| Persönliche Daten | Geburtsdatum, Nationalität, Aufenthaltsstatus (nur bei ausländischer Nationalität), Zivilstand, Kinder mit Geburtsjahr. Web zeigt nur Nationalität, Wohnort, Mobilität. |
| Porträt | Professionelles Foto auf Seite 1; der Blick geht zur Seitenmitte. Solange keines vorliegt, ein schraffierter Platzhalter mit Monogramm, nie ein Stockfoto. |
| Kurzprofil | Hard- und Soft-Skills getrennt, je drei bis vier kurze Zeilen, darunter die Stichworte für Recruiting-Software. |
| Berufliche Tätigkeiten | Rolle in `print-role`, danach Arbeitgeber, Ort und `MM.JJJJ – MM.JJJJ` in `print-subtitle`, rund drei Tätigkeiten in Stichworten. Absteigend, aktuelle Stelle zuerst. |
| Lücken | Ab einem Monat erklärt, als eigener Eintrag: «Weiterbildung» oder «berufliche Neuorientierung». |
| Weiterbildung / Zertifikate | `JJJJ Kurs, Institution (Dauer), Ort`, absteigend, getrennt von der Ausbildung. |
| Ausbildung | `MM.JJJJ – MM.JJJJ`, Abschluss, Institution, absteigend. |
| Sprachen | Grundkenntnisse · Gute Kenntnisse · Fliessend · Muttersprache. GER-Niveau nur mit Zertifikat. |
| Weitere Kenntnisse | Engagement, Vereine, Interessen. |

Ein CV hat höchstens vier A4-Seiten, ein Anschreiben genau eine. Highlights, Kompetenz- und Sprachzeilen werden nie getrennt.

## Inhalt und Sprache

Zweisprachig, Deutsch und Englisch, beide Originale.

- Rollen und Titel in der Sprache, in der sie geführt wurden.
- Aktiv und in der ersten Person: «Ich habe den Rollout in vier Ländern geführt.»
- Jede Zahl mit Bezugsgrösse: «Durchlaufzeit von 22 auf 13 Tage gesenkt», nicht «−41 %».
- Zahlenformat: deutsch `14,2 Mio.` und `1 240`, englisch `14.2 M` und `1,240`; Währung mit Code voran: `CHF 3,2 Mio.`
- Zeitangaben: `09.2016 – 06.2018`, englisch `09/2016 – 06/2018`, laufend `– heute` / `– now`.
- Fälle nach STAR: Situation, Aufgabe, Vorgehen, Resultat.
- Keine Superlative ohne Beleg. Schwächen aus der Selbstanalyse bleiben privat.
- Zeichen: Buchstaben, Ziffern und die Satzzeichen der Schrift. Pfeile, ≥ ≤, ● ○, Häkchen, Sterne und Emoji sind kein Text: schreibe ein Wort («mindestens», «zurück») oder zeichne eine CSS-Form.

## Kompetenzmodell

Vier Brillen: Fachkompetenz, Methodenkompetenz, Technologie, Sozial- und Selbstkompetenz (mit Beleg statt Jahren).

Vier Stufen, keine halben: 1 Grundkenntnisse · 2 Erste Erfahrung · 3 Erfahren · 4 Spezialist. Dargestellt als vier gezeichnete Punkte (gefüllt `color-accent`, leer als Ring in `color-level-empty`) plus Wort. Die Legende steht am Ende des Kompetenzblocks in `screen-small`.

## Raster und Raum

- Eine Spalte von höchstens 1120 px, mindestens `space-3` Seitenrand auf jedem Viewport; kein horizontales Scrollen bei 375, 768 und 1440 px.
- Innerhalb eines Eintrags `space-1` bis `space-3`, zwischen Einträgen `space-4`, Titel zu Inhalt `space-5`, zwischen Abschnitten `space-section`. Kompakt statt luftig.
- Geschwister mit `gap`, nie mit Einzelabständen. `min-width: 0` auf Grid- und Flex-Kindern.
- Nicht alles ist eine Karte. Rand, Fläche, Radius und Schatten nach Rolle, nicht pauschal.

## Muster

- **Erklärte Lücke:** schraffiertes Feld im Zeitstrahl (45°, `color-border-strong`), mit einem Wort beschriftet. Unerklärt erscheint sie in `attention` (nur Bildschirm).
- **Beleg-Chip:** Pille mit Farbquadrat der Entität; springt zur Stelle und lässt sie kurz in `color-accent-soft` aufleuchten. Ein Richtungshinweis ist eine CSS-Form, kein Pfeilzeichen.
- **Fit-Check:** Präferenz als gezeichnete Marke vor jeder Option (gefüllt «ideal», Ring «passt», gestrichelter Ring «eher nicht»), Ergebnis als Segmentbalken plus Satz.
- **Zeugnis-Vorlage:** gestrichelter Rahmen, Etikett «Vorlage», Platzhalter in eckigen Klammern. Nie erfundene Zitate.

## Bewegung

- 120 ms für Hover und Zustände, 220 ms für Ein- und Ausblenden; `ease-out`, kein Federn.
- Nur `transform` und `opacity`. Die Seite ist im Ruhezustand vollständig lesbar.
- `prefers-reduced-motion: reduce` schaltet alles ab.

## Diagramme (nur Bildschirm)

- Form nach Aufgabe: Grösse → Balken, Anteil → ein geteilter Balken, Verlauf → Linie, eine Aussage → eine Zahl im Satz.
- Eine Achse, Beschriftung direkt an der Marke, Achsen in `data-grid` und `color-text-faint`, Werte in `color-text`. Text trägt nie die Serienfarbe.
- Jedes Diagramm hat einen Tooltip und ist per Tastatur erreichbar.

## Maschinenlesbarkeit

Die Seite schreibt ein `schema.org/Person`-Objekt als JSON-LD (Rolle, Arbeitgeber, Sprachen, Kenntnisse der Stufen 3 und 4, Ausbildung, Zertifikate), ohne Kontaktdaten.

## Schutzregeln (feste Zahlen)

- Kontrast: Text mindestens 4.5:1 in jedem Theme; Fokus und Stufenformen mindestens 3:1.
- Grösse: Bildschirmtext mindestens 16 px, auch Meta; Drucktext mindestens 9 pt, Meta mindestens 7.5 pt.
- Ziele: mindestens 44 × 44 px, alles per Tastatur erreichbar.
- Netz: Schriften selbst gehostet über `@fontsource`, keine Anfragen an Drittanbieter, kein Inline-Script. (Die Vorschauen dieses Systems laden Schriften von Google Fonts, nur zur Ansicht.)
- Druck: das PDF bettet genau eine Schrift ein (`pdffonts`).

## Ikonografie und Assets

Kein Icon-Satz. Zustände werden benannt, nicht bebildert. Wo ein Zeichen nötig ist, eine SVG- oder CSS-Form mit 1.5 px Strich, Farbe aus einem `color-`-Token. Noch keine Assets; der Name steht als reine Typografie, bis Porträt oder Zertifikatslogos als Dateien vorliegen.
