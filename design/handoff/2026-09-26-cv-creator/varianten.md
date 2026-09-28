# Varianten

Jede Achse wird für sich geprüft: Kontrast an der Farbe, Reihenfolge und Schwellen an der Grösse, Regel 1 an der Schrift, Regel 2 am Layout. Was nur die Kombination zeigt (Überlauf, Seitenzahl, PDF-Schriften), prüft das Repo für die Kombinationen, die es nutzt.

## Farbe · acht Themes

| Theme | Katalog | Einsatz | Charakter |
| --- | --- | --- | --- |
| Granat · Papier | `granat` light / print | Website hell, Haupt-CV, 1a | Tiefes Rot mit Braunanteil auf warmem Greige. |
| Granat · Abend | `granat` dark | Website dunkel | Derselbe Ton, eigene Stufen für den dunklen Grund. |
| Petrol · dunkles Blatt | `abend-petrol` print | Product Manager, 1b | Dunkles Blatt mit Petrol-Akzent. |
| Indigo · kühl | `kuehl-indigo` print | ICT Architect, 1c | Kühles Papier, Blau-Violett. |
| Tanne | `tanne` (neu) | frei | Tannengrün, ruhig, naturnah: Energie, Verwaltung, Nachhaltigkeit. |
| Ocker | `ocker` (neu) | frei | Erdiges Ocker-Braun, warm und handfest: Industrie, Mittelstand. |
| Marine | `marine` (neu) | frei | Gedecktes Marineblau, klassisch: Banken, Versicherungen, öffentliche Hand. |
| Graphit | `graphit` (neu) | frei | Ohne Buntfarbe, für konservative Empfänger und Schwarzweiss-Druck. |

Die vier neuen Paletten haben im Katalog auch einen dunklen Satz; am Bildschirm werden sie laut D5 nicht genutzt. Alle Sätze bestehen die Kontrastprüfung: jede Textrolle auf jeder Fläche mindestens 4.5:1, `color-on-accent` auf `color-accent` mindestens 4.5:1, Fokus mindestens 3:1.

Wähle die Farbe nach dem Empfänger, nicht nach Geschmack: eine Farbe pro Version, festgehalten in `design.color`.

## Schrift · zehn Familien

| Familie | Art | Eignung |
| --- | --- | --- |
| Instrument Sans | Grotesk | im Repo vorhanden, Voreinstellung dieses Systems |
| IBM Plex Sans | Grotesk, technisch | IT- und Architekturrollen |
| Source Sans 3 | humanistisch, schmal | dichte Dossiers, viele Stationen |
| Atkinson Hyperlegible | auf Lesbarkeit gebaut | Besucher mit Sehschwäche, grosse Schriftwahl |
| Public Sans | neutral | Behörden, öffentliche Hand |
| Hanken Grotesk | Grotesk, kompakt | moderne Produktrollen |
| Source Serif 4 | Serif | Beratung, Text mit Gewicht |
| Literata | Buch-Serif | lange Profiltexte |
| Newsreader | Zeitungs-Serif | redaktioneller Auftritt |
| Zilla Slab | Slab-Serif | eigenständig, eher für Anschreiben als für dichte CVs |

Jede Familie nur in Regular 400, eine Datei pro Subset (`@fontsource/<familie>`, OFL-1.1). Serif-Familien sind erlaubt, solange sie die einzige Familie sind.

## Grösse · Skalen

| Rolle | `cv-heute` (live) | `cv-eine-schrift` | `cv-ruhig` (neu) |
| --- | --- | --- | --- |
| Name, Bildschirm 1440 | 104 px | 104 px | 48 px |
| Abschnitt, Bildschirm 1440 | 52 px | 52 px | 30 px |
| Rolle | 28 px | 28 px | 21 px |
| Untertitel | 16.5 px | 19 px | 18 px |
| Text | 16.5 px | 16.5 px | 17 px |
| Name, Druck | 40 pt | 40 pt | 24 pt |
| Abschnitt, Druck | 16.5 pt | 16.5 pt | 13 pt |
| Text, Druck | 9 pt | 9 pt | 9 pt |
| Regel 2 | verletzt | erfüllt | erfüllt |
| Name ÷ Text (1440) | 6.3 × | 6.3 × | 2.8 × |

`cv-ruhig` ist die Skala für neue Entwürfe. Die Besucherwahl «Gross» multipliziert alle Bildschirmgrössen mit 1.125.

## Layout · vier Grundformen

Reihenfolge nach Regel 2, also schon mit den Änderungen aus `rule2Changes`.

- **cv – eine Spalte.** Kopf (Name, Headline, Ort, Links), Profil, Erfahrung als Zeitstrahl (Startjahr in Rollengrösse neben der Rolle), Ausbildung, Zertifikate, Tätigkeiten, Kompetenzen in zwei Spalten, Sprachen, Interessen.
- **1a – Seitenleiste.** Leiste 65 mm in `color-surface-sunk` mit Porträt, Kontakt, Kompetenzen, Sprachen, Interessen; Hauptspalte mit Kopf (Name, darunter Zielrolle, Headline), Profil, Erfahrung, Ausbildung, Tätigkeiten, Zertifikate.
- **1b – Kopfband.** Band in `color-surface` mit Porträt, Kopf und Kontakt; darunter Hauptspalte und eine 52-mm-Spalte mit Kompetenzen, Sprachen, Interessen. Das dunkle Blatt kommt von der Farbe, nicht vom Layout.
- **1c – eine Spalte mit Zeitstrahl.** Kopf mit Porträt rechts; USP vor der Profilzusammenfassung; Stationen dürfen auf der nächsten Seite weiterlaufen, Highlights nie.

In allen Layouts: Zeitraum auf der Zeile der Organisation hinter der Rolle, Zielrolle unter dem Namen, Legende am Ende der Kompetenzen, Seitenzahl unten.

## Versionen heute

| Version | Farbe | Layout |
| --- | --- | --- |
| Haupt-CV | Granat | cv |
| IT Business Service Manager | Granat | 1a |
| Beispiel Automobile | Granat | 1a |
| Product Manager | Petrol | 1b |
| ICT Architect | Indigo | 1c |

Die Schrift aller Versionen ist heute `instrument-drei` (verletzt Regel 1) und die Grösse `cv-heute`. Mit PR 2 bekommen alle Versionen eine Einzelschrift und `cv-ruhig`.
