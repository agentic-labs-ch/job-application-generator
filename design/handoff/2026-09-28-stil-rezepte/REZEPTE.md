# Stil-Rezepte (Designer, 2026-09-28)

Ein Stil-Rezept legt fest, wie eine Bewerbungsseite **aussieht und sich bewegt**. Was auf der Seite steht, kommt aus den Daten (Berufsfamilie, Rollenversion, Bewerbung). Wer ein Rezept wählt, bekommt dieses Design mit den eigenen Daten und der eigenen Firmenfarbe.

Referenz für jedes Rezept ist die fertige Seite in `referenz/<rezept>/index.html`. Sie ist mit den Musterdaten von Alex Muster gebaut und geprüft. Die Seiten sind eigenständige Entwürfe mit inline CSS und JS. Sie zeigen das Ziel, nicht den Code für `site/`. Übernimm Aufbau, Masse, Farbrollen, Skill-Darstellung und Bewegung in die Templates und in `site/styles.css`.

## Modell: Branche → Rezept → Schrift

| Rezept (Schlüssel) | Name | Standard für Branche | Schrift (einzige der Seite) | Referenzdaten |
|---|---|---|---|---|
| `finanz-oeffentlich` | Bankdossier | Finanz & Öffentlich | Source Serif 4 | Beispielbank Karten AG |
| `beratung-sales` | Pitch | Beratung & Sales | Schibsted Grotesk | Globex Consulting |
| `tech-produkt` | Produkt-Dashboard | Tech & Produkt | Instrument Sans | Nimbus Software |
| `mensch-kreativ` | Porträt | Mensch & Kreativ | Figtree (neu) | Kolibri People AG (neu) |
| `technische-daten` | Technische Daten | – (nur auf Wunsch) | Newsreader (neu) | Beispiel Automobile |

Das Modell dahinter:
- Die **Schrift gehört zum Rezept**, nicht zur Branche. `BRANCHEN` in `site/templates.mjs` nennt pro Branche nur noch das Standard-Rezept. Die Schrift steht im Rezept.
- Eine Bewerbung darf das Rezept ausdrücklich wählen (`rezept: technische-daten`). Sonst gilt das Standard-Rezept ihrer Branche.
- Die Rezepte heissen wie die Branchen. Das fünfte, `technische-daten`, heisst nach seinem Stil, weil es keiner Branche gehört.
- Neue Schriften: Figtree und Newsreader, beide `@fontsource`, OFL, nur `latin-400-normal`.

## Für alle Rezepte gleich

- **Eine Schrift pro Seite**, nur Gewicht 400. Knöpfe, Formularelemente und SVG-Text erben sie (`font: inherit`). Keine Kursive, kein `uppercase`, keine gesperrte Laufweite als Betonung.
- **Grösse von gross nach klein:** Innerhalb eines Blocks nimmt die Schriftgrösse in DOM-Reihenfolge nie zu. Der Kopfvermerk (Zielstelle, Firma, Referenz) ist deshalb ein eigener Block über dem Namen.
- **Mindestwerte:**
  - Text ≥ 16 px, auch Legenden, Achsen und SVG-Text.
  - Klickflächen ≥ 44 × 44 px.
  - Text ≥ 4.5:1; Grafik, Fokus und Linien von Bedienelementen ≥ 3:1.
  - Kein seitliches Scrollen von 320 bis 1440 px.
- **Farbe nie allein:** Jede Stufe steht auch als Wort. Stufen: 1 Grundkenntnisse/Basic, 2 Erste Erfahrung/Some experience, 3 Erfahren/Experienced, 4 Spezialist/Specialist.
- **Bewegung:**
  - Nur `opacity`, `transform` und bei SVG `stroke-dashoffset`, höchstens 600 ms.
  - Startzustände nur unter `html.js`: Ohne Script ist alles sichtbar.
  - `prefers-reduced-motion: reduce` zeigt sofort den Endzustand. Im Druck gibt es keine Bewegung.
  - Das ist eine Ausnahme von der Regel «ein Eintrittsmoment» der Hauptseite: Bewerbungsseiten dürfen die Bewegung ihres Rezepts zeigen.
- **Firmenfarbe:** Jedes Rezept nutzt die Rollen aus dem `brand`-Block (Tabelle unten). Die Seite folgt nicht dem Hell/Dunkel des Lesers; die Farben stehen fest.
- **Druck:** eine Spalte, schwarz auf weiss, ohne Knöpfe; die Skills als einfache Liste mit Stufe.
- **Fakten:** Kennzahlen nur, wenn die Zahl wörtlich in den Daten steht. Die Referenz-Builds brechen sonst ab (`must(...)`).

## 1. `finanz-oeffentlich`: Bankdossier

Wirkung: seriös, kompakt, präzise wie ein Dokument einer Privatbank.

- **Satz:** Fliesstext 17 px mit Zeilenhöhe 1.45, alle Ziffern tabellarisch (`tabular-nums`). Hierarchie: Name 44/38/30 px, Abschnitt 24, Claim 21, Rollen 19.
- **Layout:**
  - Handy: kompakter Kopf (Porträt 72 × 90 links neben Name und Headline), Knöpfe als Rechtecke mit 1-px-Rand, Abschnitte durch Haarlinien getrennt.
  - 768 px: eine Spalte, Faktenblöcke zweispaltig.
  - Ab 1024 px:
    - links eine Faktenspalte (~280 px): Porträt, Kontakt, Sprachen, Ausbildung, Interessen. Sie scrollt mit, bis ihr Ende erreicht ist, dann bleibt sie stehen.
    - rechts die Hauptspalte (max. 720 px) mit nummerierten Abschnitten 1–5.
- **Erfahrung als Register:** feste Datumsspalte links (7rem, «12.2023 – 02.2026»), rechts Rolle, Firma, Summary und Highlights. Kompakte Stationen sind einzeilig, Projekte eingerückt mit eigenem Zeitraum. Die neueste Station trägt ein kleines Quadrat in der Akzentfarbe.
- **Skills als Ratingtabelle:**
  - Aufbau: echte `<table>` mit den Spalten Skill | 1 | 2 | 3 | 4 und einem `<tbody>` pro Kategorie.
  - Marke: pro Zeile eine Marke (12-px-Quadrat, Akzent) in der Spalte der Stufe. Davor eine graue Linie ab Spalte 1, Striche markieren die Stufen.
  - Stufe als Text: verborgen in der Zeilenüberschrift.
  - Handy: Legende «1 … · 4 …» darüber, der Skill-Name in eigener Zeile, die Stufe als graues Wort rechts.
  - `knowledge` steht als kompakte Zeilen «Also:» darunter.
- **Brief:** Schweizer Geschäftsbrief auf einem weissen Blatt über einer hellgrauen Fläche: Absender rechts, Empfänger links in Fensterposition, Ort und Datum, Betreff, Text.
- **Bewegung** (sehr ruhig): Abschnitte blenden 8 px von unten ein (300 ms). Die Marken gleiten einmal von links an ihren Platz (400 ms).
- **Farbrollen:** `paper`, `ink`; Meta #595959; Haarlinie #d9d9d9; Fläche #f5f5f5. `accent` als 3-px-Strich oben, Marken, Oberlinie der Stärken und Hover-Unterstreichung, nie als Text.

## 2. `beratung-sales`: Pitch

Wirkung: sich selbst verkaufen wie in einer Beratungs-Präsentation. Jede Sektion ist eine «Folie»: erst die Aussage, dann der Beleg.

- **Satz:** Name 40/56 px, Aussagen 28/36 px, Fliesstext 17 px, Folienzähler «02 Kennzahlen … / 08».
- **Aufbau:** eine Spalte (max. ~1100 px, Text max. 40rem), acht Folien:
  1. Hero: Zielstelle, Name, Claim, Porträt; Hauptknopf «Gespräch vereinbaren» (mailto).
  2. Belege in Zahlen: drei grosse Kennzahlen (bis 64 px), je mit Linie in der Akzentfarbe, Beschriftung und Quelle (Station und Zeitraum).
  3. Drei Stärken als Karten.
     - Handy: Karussell mit scroll-snap; die nächste Karte schaut 24 px hervor; Knöpfe Zurück/Weiter und «1 / 3».
     - Ab 900 px: drei Spalten.
     - Jede Karte trägt «Belegt bei …».
  4. Profil.
  5. Kompetenzen.
  6. Erfahrung als «Fälle»: die zwei neuesten ausführlich, ältere kompakt, mit Linie und Punkt links.
  7. Ausbildung, Sprachen, Interessen zweispaltig.
  8. Motivationsschreiben mit nummerierten Punkten und Abschluss «Gespräch vereinbaren».
- **Skills als Belegmatrix:**
  - Aufbau: Zeilen = Skills mit mindestens einem Beleg (`refs`), nach Anzahl Belege sortiert, höchstens 14. Spalten = Stationen 1–7, darüber eine Legende mit vollen Namen und Jahren.
  - Punkte: belegt = Punkt in der Akzentfarbe (14 px), nicht belegt = kleiner grauer Punkt. Am Zeilenende steht die Stufe als Wort.
  - Handy: Name über der Punktzeile, Spalten ≥ 32 px, die Kopfzeile mit den Nummern bleibt stehen.
  - Der Rest steht als Liste «Weitere Kompetenzen» darunter.
  - Screenreader: «…, belegt bei A, B».
- **Bewegung:**
  - Scroll-Fortschritt: 3-px-Linie oben (Handy), ab 900 px senkrecht links.
  - Folien gleiten 16 px ein.
  - Die Matrix-Punkte erscheinen zeilenweise (scale).
  - Die Kennzahlen zählen hoch; der Endwert steht im HTML.
- **Farbrollen:**
  - `paper` Schwarz, `ink` Weiss; Meta #a3a3a3; Karten #0d0d0d; Haarlinie #2a2a2a.
  - `accent` für Flächen, Linien und Punkte; `accentText` für Text in der Akzentfarbe.
  - Text auf dem Akzent-Knopf: Papier oder Tinte, je nachdem, was besser lesbar ist (bei Globex-Orange: Schwarz).

## 3. `tech-produkt`: Produkt-Dashboard

Wirkung: modern und sachlich wie eine gut gemachte Produktoberfläche; Zahlen und Diagramme stehen vorne.

- **Layout:** Kacheln (Bento):
  - Kacheln weiss, 1-px-Rand, Radius 8 px, auf hellgrauem Grund.
  - Desktop: 12-Spalten-Raster, max. 1200 px.
  - Reihe 1: Hero (8 Spalten) und Porträt (4 Spalten).
  - Reihe 2: vier Kennzahlen.
  - Reihe 3: drei Stärken mit 4-px-Oberbalken in den Marken.
  - Dann Skills, Werdegang, Ausbildung | Sprachen | Interessen + Kontakt und zuletzt der Brief mit Markenstreifen.
  - 768 px: 6 Spalten. Handy: eine Spalte, Kennzahlen 2 × 2.
- **Skills als Balkendiagramm mit Filter:**
  - Filter-Pillen «All» und je Kategorie mit Anzahl (aria-pressed, 44 px).
  - Pro Skill: Name, ein Balken aus 4 Segmenten (gefüllt in `accent`, leer hellgrau) und die Stufe als Wort.
  - Kategorien mit einem Farbquadrat aus `marks` (die fünfte Kategorie grau). Innerhalb einer Kategorie absteigend nach Stufe.
  - Seitenspalte «Focus for this role» mit den `knowledge`-Chips.
- **Werdegang:** Zeitleiste über die Jahre, eine Zeile pro Station und Ausbildung. Ein Klick auf eine Zeile öffnet die passende Station in der Liste darunter (`<details>`, die erste offen).
- **Bewegung:**
  - Segmente und Balken der Zeitleiste wachsen (scaleX, um 30 ms versetzt).
  - Die Kennzahlen zählen hoch.
  - Beim Filtern blenden die Zeilen um (150 ms).
  - Kacheln heben sich bei Hover um 2 px, nur mit `(hover:hover)`.
- **Farbrollen:**
  - `accent` für Links, Segmente, aktive Filter und Hauptknopf, dazu eine Tönung des Akzents für Stufen-Chips.
  - `marks` nur als Dekor: Quadrate, Oberbalken und Markenstreifen, nie Text.

## 4. `mensch-kreativ`: Porträt (neu)

Wirkung: warm, persönlich, menschlich, wie ein Magazin-Porträt. Es bleibt ein Schweizer CV: Fakten und Daten zuerst.

- **Satz:** Name 46/52/80 px, Überschriften 32/40, Claim 24–26, Profil 18, Fliesstext 17 px mit Zeilenhöhe 1.6. Runde Ecken 16 px, weiche Flächen statt Haarlinien.
- **Aufbau:**
  1. Kopfvermerk.
  2. Grosses Porträt (4:5, abgerundet) auf einer runden Form in einer Marke (Dekor); daneben Name, Zielstelle in der Akzentfarbe, Headline, Ort und Pillen-Knöpfe. Zweispaltig ab 640 px.
  3. «Über mich»: Claim als Einstieg, darunter das Profil.
  4. «Was mir wichtig ist»: drei Karten mit Farbpunkt.
  5. «Worin ich stark bin»: die Skills.
  6. «Mein Weg»: Pfad mit runden Markern; der Marker der neuesten Station ist gefüllt. Die zwei neuesten Stationen sind offen, ältere öffnen sich mit «Mehr».
  7. «Mehr als Arbeit»: Interessen als Chips, dazu Sprachen und Ausbildung.
  8. Motivationsschreiben als Blatt auf der Fläche.
  9. Kontaktkarte «Ich freue mich auf ein Gespräch».
  - Desktop: Die Überschriften stehen links und bleiben beim Scrollen stehen, der Text läuft rechts.
- **Skills als Stufen-Gruppen mit Chips:**
  - Gruppen je Stufe (Spezialist, Erfahren, …; leere weglassen), je mit der Zeile «Stufe X von 4 · N Kompetenzen».
  - Die Chip-Grösse nimmt mit der Stufe ab (19 → 18 → 17 → 16 px); Regel 2 hält, weil die Reihenfolge absteigt.
  - Die Tönung der Chips wechselt pro Stufe.
  - Schlüsselkompetenzen (`key`) stehen zuerst, mit Punkt, Legende und verborgenem Text.
  - Umschalter «nach Stufe | nach Thema» (aria-pressed); nach Thema steht die Stufe als Wort im Chip.
- **Bewegung:**
  - Das Porträt schwebt von scale .96 ein, die runde Form folgt 100 ms später.
  - Die Chips erscheinen um 20 ms versetzt und blenden beim Umschalten um.
  - Die Linie von «Mein Weg» zeichnet sich beim Scrollen (scaleY).
- **Farbrollen:**
  - `paper`, `ink`; Fläche #f3ece2; Meta warm #6b594d (6.2:1).
  - `accent` für Zielstelle, Hauptknopf, gefüllten Marker und Schlüssel-Punkt.
  - `marks` für Formen, Punkte und Tönungen der Chips, nie für Text.

## 5. `technische-daten`: Technische Daten (optional)

Wirkung: ruhig und edel. Schwarzer Grund, weisse Serifenschrift, eckige Formen, feine Linien, wie ein Datenblatt.

- **Aufbau:**
  - Oben eine Leiste mit dem Namen und dem Umschalter «Lebenslauf | Anschreiben»: zwei Tabs, Zustand in der URL (`#anschreiben`), Pfeiltasten. Ohne JS stehen beide Ansichten untereinander.
  - Hero wie ein Zitat-Block: Porträt, eine senkrechte 1-px-Linie in der Akzentfarbe, der Claim gross (28/38 px), darunter Name, Headline und Knöpfe. Die Knöpfe sind eckig mit 1-px-Rand und bei Hover invertiert.
  - Darauf folgen die Stärken (drei Spalten mit Oberlinie), das Profil und die Kompetenzen.
  - Erfahrung als Datenblatt: grosse Jahreszahlen links, die beim Scrollen stehen bleiben, Highlights in `<details>`.
  - Ausbildung, Sprachen, Interessen und Kontakt als Datenzeilen.
- **Skills als Rundinstrumente:**
  - Pro Gruppe ein 270°-Bogen mit den Teilstrichen 1–4, gefüllt bis zum Mittelwert. In der Mitte steht die Zahl mit deutschem Komma, darunter «von 4» und der Gruppenname.
  - Raster: Handy 2 Spalten, Tablet 3, Desktop 6.
  - Jedes Instrument ist ein Knopf (aria-expanded) und öffnet die Liste der Gruppe: Stufe als Wort, eine 4-teilige Linie und «Schlüsselkompetenz». Die erste Gruppe ist offen.
- **Bewegung:** Die Instrumente schwenken auf ihren Wert (stroke-dashoffset, 600 ms, versetzt), die Zahl zählt mit. Der Tab-Wechsel blendet über. Porträt und Claim blenden beim Laden ein.
- **Farbrollen:** `paper` Schwarz, `ink` Weiss; Meta #a8a8a8; Fläche #111; Haarlinie #333. `accent` nur für die senkrechte Linie, den Fokus, das aktive Instrument und die Marker im Brief.

## Wie die Referenzen gebaut sind

`referenz/resolve.py` liest die Musterdaten aus `data/` und schreibt `referenz/data/<rezept>.json`. Danach setzt `referenz/build_all.py` jede Seite zusammen und die Farben aus dem `brand`-Block ein, und `referenz/shots.py` macht die Prüfungen und Screenshots.

Zum Neubauen brauchen die Skripte zusätzlich:
- `referenz/fonts/` mit den fünf woff2-Dateien aus `@fontsource`
- die Porträts aus `platzhalter/` in `referenz/`

Die Skripte sind Werkzeug des Designers, kein Teil des Generators.

Geprüft bei 320, 375, 768 und 1440 px (alle fünf):
- nur eine Schrift, nur Gewicht 400
- kleinste Schrift ≥ 16 px
- keine Klickfläche unter 44 px
- kein seitliches Scrollen
- keine externen Anfragen
