# Handoff 2026-09-28: Stil-Rezepte, Platzhalter, vierte Bewerbung

Vom Designer an den Code-Agent. Er antwortet auf die vier Punkte in «LIESMICH-DESIGNER.md» (Designer-Paket Public Repo, 2026-09-28). Alles in diesem Ordner enthält nur Musterdaten (Alex Muster, erfundene Firmen) und darf in die Positivliste.

## 1. Platzhalter-Porträts: `platzhalter/`

- **Dateien:** `portrait.jpg` und `portrait-2.jpg`, 480 × 600 px, JPEG. Sie haben nur den JFIF-Kopf, kein EXIF und kein XMP.
- **Motiv:** eine ruhige, flache Illustration ohne Gesicht, keine echte Person und kein Stockfoto. Mit Python/PIL gezeichnet.
- **Varianten:** Variante 1 ist warm-greige und für helle Seiten gedacht. Variante 2 ist kühl-grau mit etwas näherem Ausschnitt.
- **Auf dunklen Seiten** wirken beide als helles Bild, das ist gewollt; sie bleiben auch auf Schwarz gut sichtbar.
- **Einbau:** Ersetzt die provisorische Silhouette unter `data/portrait.jpg` und `data/portrait-2.jpg`.

## 2. Vierte Bewerbung (Mensch & Kreativ) und Beispiel Automobile

**Neue Bewerbung (erfunden):**

| Feld | Wert |
|---|---|
| Firma | Kolibri People AG (HR-Software) |
| Ort | Winterthur |
| Stelle | Product Owner HR-Plattform 80–100 % |
| Berufsfamilie | B · Kunde & Produkt |
| Branche / Rezept | `mensch-kreativ` |
| `paper` | `#fbf7f1` |
| `ink` | `#2b211b` (14.7:1) |
| `accent` | `#b4462a` (5.1:1 auf Papier, Weiss darauf 5.5:1) |
| `marks` | `#e07a5f` `#f2cc8f` `#81b29a` (nur Dekor) |

Den Inhalt schreibst du aus Alex' Daten. Die Referenzseite nutzt vorerst die Rollenversion `product-manager` und einen klar markierten Platzhalter statt Brief.

**Beispiel Automobile:**
- **Branche:** `tech-produkt` (IT-Rolle bei einem Fahrzeug-Importeur).
- **Rezept:** ausdrücklich `technische-daten`, also das schwarze Datenblatt mit Newsreader.
- **Brand:**
  - `paper` `#000000`
  - `ink` `#ffffff`
  - `accent` `#5b8def` (6.5:1 auf Schwarz, nur für Linie, Fokus und Marker)

Das neutrale Blau ersetzt bewusst das Blau des echten Vorbilds.

**Demo-Person:** Alex bleibt die Demo-Person, Robin bleibt die kleine Person des Design-Systems. Einverstanden.

## 3. Stil-Rezepte: `REZEPTE.md` und `referenz/`

- **Spezifikation:** `REZEPTE.md` beschreibt alle fünf Rezepte:
  - Satz, Layout pro Breite
  - Skill-Darstellung, Bewegung
  - Farbrollen aus dem `brand`-Block
- **Referenzseiten:** `referenz/<rezept>/index.html` sind die fertigen, geprüften Seiten mit Alex' Daten und den erfundenen Firmenfarben. Screenshots dazu liegen unter `referenz/screenshots/`.
- **Modellvorschlag:** Die Schrift gehört zum Rezept. `BRANCHEN` nennt pro Branche nur noch das Standard-Rezept. Eine Bewerbung kann mit `rezept:` ein anderes wählen.
- **Neue Schriften:** Figtree (`mensch-kreativ`) und Newsreader (`technische-daten`), beide `@fontsource`, nur `latin-400-normal`.
- **Reihenfolge der Umsetzung:**
  1. `finanz-oeffentlich`, `beratung-sales` und `tech-produkt`, weil es dafür schon Daten gibt.
  2. Danach `mensch-kreativ` und `technische-daten`.
  3. Pro Rezept jeweils zuerst Layout und Skill-Darstellung, dann die Bewegung.
- **Prüfungen:** Jede Rezept-Seite muss deine Prüfungen bestehen. Die Referenzen tun es schon:
  - eine Schrift, nur 400
  - Text ≥ 16 px, Klickflächen ≥ 44 px
  - kein seitliches Scrollen von 320 bis 1440 px

  Neu ist dazu die Grössenregel pro Block. Sie gilt auch für SVG-Text.

## 4. Abschnitt für `DESIGN.md`: `DESIGN-abschnitt.md`

Englisch wie `DESIGN.md`. Einsetzen unter «Company colours (applications)». Er enthält:
- die festen Regeln (eine Schrift, 16 px, 44 px, 4.5:1, Bewegung)
- die fünf Rezepte als Tabelle
- die Anleitung für den `brand`-Block mit Beispiel
- die Regeln zu Musterdaten und Bildern

Die dortige Tabelle der drei Musterfirmen kann danach weg.

## Offen für den Owner

- Gefallen ihm die fünf Rezepte als Standard?
- Soll `technische-daten` ein Rezept für alle werden oder nur eine Option bleiben?
