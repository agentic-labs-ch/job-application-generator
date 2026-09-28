Das Designsystem für Alex' Bewerbungs-Website und das gedruckte Schweizer Dossier. Die Regeln und Rollen sind fest. Die Werte (Farbe, Schrift, Grösse, Layout) sind Varianten, die sich frei kombinieren lassen. Jede Kombination muss alle Regeln erfüllen.

> Eine Schrift, ein Schnitt, klare Grössen. Hierarchie entsteht aus Grösse, Farbe und Raum, nie aus Fett, Versalien oder einer zweiten Familie.

Stand 26.09.2026: Entscheide D1–D8 und F1–F4, dazu die Umsetzung am Handy aus PR 2 (Phase A), von Alex am 26.09.2026 geprüft. **Dieses System ist die verbindliche Design-Quelle; das Repo `job-application-generator` folgt ihm.** Das Repo übernimmt jeden Export unverändert unter `design/handoff/<datum>-cv-creator/` und hält Abweichungen in `DESIGN.md` mit Status fest. Die Entscheide stehen im Repo unter `docs/design-decisions.md`.

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
- **Reihenfolge:** Innerhalb eines Blocks (Kopf, Abschnitt, Eintrag, Gruppe) nimmt die Grösse in DOM-Reihenfolge nie zu. Also: kein Datum über der Rolle, keine Zielrolle über dem Namen, Seitenzahl und Kopfzeile stehen unten. Eine Legende schliesst ihren Block (Werdegang, Diagramme).
- **Ausnahme Kompetenz-Legende (26.09.2026):** Die Legende der vier Stufen ist ein eigener Block **vor** den Kompetenz-Gruppen, direkt unter dem Abschnittstitel, auch in der Seitenleiste und vor den Top 10 der Rollenversionen. Sie ist Meta (16 px) vor Gruppentiteln (18 px); das ist gewollt, weil man die Skala kennen muss, bevor man die Punkte liest.
- **Eintrag:** Titel 21 px → «Organisation, Ort» 18 px → Zeitraum 17 px → Text 17 px. Der Zeitraum steht in Textgrösse, damit die Grösse nach ihm nicht wieder zunimmt.
- **Decke:** Kein Element ist grösser als der Titel seines Abschnitts, nichts grösser als der Name.
- **Verhältnis (neu):** Der Name ist höchstens 3 × so gross wie der Text, der Abschnittstitel höchstens 1.8 ×. Das verhindert den übergrossen Display-Look. `cv-ruhig` hält 2.8 × und 1.8 × am Bildschirm, 2.7 × und 1.4 × im Druck.

Beispiel Station am Bildschirm, richtig: Rolle 21 px → «Musterbank AG, Zürich» 18 px → «03.2019 – heute» 17 px in `color-text-muted` auf eigener Zeile → Zusammenfassung 17 px in `color-text-muted` → Highlights 17 px. Im Druck vorerst: Rolle 11 pt → «Musterbank AG, Zürich · 03.2019 – heute» 10 pt → Text 9 pt. Falsch: Datum 7.5 pt über der Rolle.

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
- Steuerelemente: Klickfläche mindestens 44 × 44 px, per Tastatur bedienbar, sichtbarer Fokus in `color-focus`, beschriftet mit Wörtern, nicht mit Symbolen. Sichtbar ist eine **Pille von 36 px** in einer Klickfläche von 44 × 44 px (Komponente **Knopf**).

Die Komponente **Musterblatt** zeigt das alles an fiktiven Daten (Robin Muster).

## Bildschirm-Komponenten (Stand Phase A, Handy)

Geprüft am iPhone (WebKit) bei 320, 375 und 430 px, hell und dunkel. Tablet und Desktop folgen (Phase B); was dort gilt, steht bei jeder Komponente.

### Knopf

- Sichtbare Pille 36 px hoch, Schrift `screen-small` (16 px), Innenabstand 10 px, `radius-pill`.
- Die Linie der Standardknöpfe ist Schmuck (`color-border-strong`, rund 1.6:1). Erkennbar wird der Knopf durch seine Beschriftung, die mindestens 4.5:1 hat; deshalb gilt die 3:1-Regel für Linien hier nicht.
- Die Klickfläche ist 44 × 44 px: ein transparenter Rand von 4 px gehört dazu. Fläche und Linie werden nur innen gemalt (`background-clip: padding-box`, Linie als `inset`-Schatten von 1 px).
- Knöpfe stehen ohne Lücke nebeneinander; die transparenten Ränder ergeben 8 px Abstand.
- Der erste Kontaktknopf ist gefüllt: `color-accent`, Schrift `color-on-accent`, Hover `color-accent-strong`. Alle übrigen: `color-surface`, Linie `color-border-strong`, Hover-Linie `color-text-faint`.
- In der Bewerbungsleiste ist das aktuelle Dokument gefüllt mit `color-text`, Schrift `color-bg`. Unter 768 px lässt die Leiste das aktuelle Dokument weg, damit die Knöpfe in eine Zeile passen.
- Eingesetzt für Kontakt, PDF, Sprache und Bewerbungsleiste.

### Abschnittsnavigation

- Links in `screen-small` (16 px), `color-text-muted`, Hover `color-text` auf `color-surface-sunk`. Keine Lücken zwischen den Links, Innenabstand 8 px, je 44 px Klickfläche. Oben und unten eine Haarlinie `color-border`.
- **Unter 768 px eine einzige Zeile, die man seitwärts wischt** (ohne sichtbaren Scrollbalken). Die Seite selbst scrollt nie seitwärts; der angeschnittene letzte Link zeigt, dass mehr folgt. Links beginnt die Zeile bündig mit dem Text, rechts hat sie keinen Innenabstand, damit fast immer ein Link angeschnitten ist.
- Ab 768 px mehrzeilig. Ab 1024 px bleibt sie beim Scrollen oben stehen (`position: sticky`) und verdeckt nie Inhalt seitlich.
- Nicht fixiert unter 1024 px, damit sie nie fokussierten Inhalt verdeckt.

### Kopf am Handy

1. Porträt (88 px; unter 360 px 64 px), in derselben Zeile rechts der Sprachknopf
2. Name (`screen-h1`, 40 px)
3. Zielrolle bzw. Headline (`screen-subtitle`, 18 px, `color-text-muted`)
4. Ort (`screen-body`, 17 px, `color-text-muted`)
5. Knöpfe: Kontakt (der erste gefüllt), PDF

- Ohne Porträt bekommt der Sprachknopf eine eigene Zeile. Ab 768 px steht er in einer eigenen Zeile über dem Kopf.
- Unter 360 px entfällt das Porträt unter einer Bewerbungsleiste. Der erste Bildschirm zeigt dann Name, Rolle, Ort, PDF und Kontakt.

### Werdegang (Zeitband)

- Eine Liste ohne Zwischentitel: zuerst die Stellen, darunter die Ausbildung, jeweils die älteste zuerst.
- Eine Zeitachse für alle Zeilen: vom Januar des ersten Jahres bis zum Januar nach dem letzten Jahr. Kein Balken wird abgeschnitten; ein offener Zeitraum läuft bis zum Achsenende.
- Nur Einträge aus den Daten. Lücken und die Zeit ausserhalb bleiben leer und unbeschriftet (das Muster «Erklärte Lücke» gilt nur, wo die Daten einen Lücken-Eintrag haben).
- Zeile am Handy: Name (`screen-body`, 17 px) und Zeitraum (`screen-small`, 16 px, `color-text-muted`, nur Jahre: «2012 – 2015») in einer Zeile; darunter der Balken, 10 px hoch, `radius-pill`, auf einer Haarlinie `color-border` über die ganze Breite.
- Ab 768 px: Name und Zeitraum mit Monaten links (16rem), der Balken rechts.
- Jede Zeile ist ein Link zu ihrem Eintrag, mindestens 44 px hoch; Hover unterstreicht den Namen, Fokus in `color-focus`.
- Farben: `data-1` Architektur & Beratung, `data-2` Entwicklung, `data-3` Ausbildung. Die Farbe steht nie allein: Die Legende mit Wörtern schliesst den Block, und jede Zeile trägt die Art zusätzlich als verstecktes Wort für Screenreader.
- Achse: eine Linie `color-border-strong`, Jahreszahlen in `screen-small`, `color-text-faint`, Tabellenziffern; am Handy jedes vierte Jahr, ab 768 px jedes zweite. Ab 768 px entfällt das zweite sichtbare Jahr, weil das erste linksbündig steht und sonst mit ihm zusammenstösst.
- Unter der Achse ein Satz («Arbeit und Ausbildung, 2012 – 2022.») und die Legende, 16 px, `color-text-faint`.
- Platz: Haupt-CV nach dem Profil, Rollenversionen nach den Kompetenzen, Bewerbungen nach den Kernkompetenzen, immer vor der Berufserfahrung.
- Druck: vorerst ausgeblendet. Er kommt im Druckteil dazu, im Rahmen von höchstens vier Seiten.

### Einträge

Eine Struktur für Berufserfahrung, Ausbildung, Zertifikate und Engagement:

1. Titel (Rolle, Abschluss, Zertifikat) in `screen-role`, 21 px
2. «Organisation, Ort» in `screen-subtitle`, 18 px, `color-text`
3. Zeitraum auf eigener Zeile in `screen-body`, 17 px, `color-text-muted`, Tabellenziffern; jedes Datum bleibt ganz (nur Zoom darf am Strich umbrechen)

- Projekte: Text, darunter der Zeitraum in derselben Art.
- Im Zeitstrahl (`cv`, `1c`) stehen die Jahre der Station in Rollengrösse, `color-text-muted`, über dem Titel (gleiche Grösse, also Regel 2 erfüllt).
- Engagement auf Textebene: Tätigkeit in `screen-body`, `color-text`, ohne Titel; Organisation in `screen-body`, `color-text-muted`; Zeitraum wie oben.
- Druck: vorerst Organisation und Zeitraum in einer Zeile mit «·», bis zum Druckteil.

### Querverweise (Kürzel und Quellen)

Wo Kompetenzen Quellen haben (Haupt-CV und Rollenversionen), sind Einträge und Kompetenzen sichtbar und verlinkt miteinander verbunden. Bewerbungen zeigen keine Kürzel.

- **Kürzel pro Eintrag** in `color-accent`, Tabellenziffern, nummeriert in der Reihenfolge der Anzeige: Deutsch B1 … Berufserfahrung, A1 … Ausbildung, Z1 … Zertifikate; Englisch W1 … Work experience, E1 … Education, C1 … Certificate.
- **Ort des Kürzels:** vor dem Zeitraum, in dessen Zeile und Grösse («B1 · 03.2019 – heute»), und im Werdegang vor dem Namen.
- **An der Kompetenz:** nach dem Stufenwort die Quellen als Links, sortiert nach Kürzel (B vor A vor Z, dann nach Nummer). `screen-small` (16 px), `color-accent`, 1 px unterstrichen mit 3 px Abstand, Hover `color-accent-strong`. Am Handy rechtsbündig in der Zeile der Stufe.
- **Klickfläche:** jeder Link 44 × 44 px, ohne dass die Zeile höher wird (negativer Rand oben und unten innerhalb des Zeilenabstands, −9 px).
- **Legende:** am Ende der Kompetenz-Legende eine Zeile «Quellen: B Berufserfahrung · A Ausbildung · Z Zertifikat»; jedes Paar aus Kürzel und Wort bricht nicht um.
- **Screenreader:** vor den Links ein verstecktes «Quellen:», jeder Link heisst «B1: Organisation» (bei Ausbildung und Zertifikat der Titel).
- **Druck:** vorerst ausgeblendet (Kürzel, Quellen und die Quellen-Zeile der Legende), bis zum Druckteil; sonst hätte der Haupt-CV fünf Seiten.
- Das ist das Muster «Beleg-Chip» in seiner Textform: ein unterstrichenes Kürzel statt einer Pille.

### Sprachen

- Name links (darf umbrechen), Stufe rechts in `color-text-muted` auf derselben Grundlinie (bricht nie um); Haarlinien `color-border` zwischen den Zeilen.
- Darunter optional eine Zeile, wie die Sprache gebraucht wird: `screen-small`, 16 px, `color-text-muted`. Der Text kommt aus den Daten.
- Ab 1024 px zweispaltig.

### Reihenfolge im Haupt-CV (Bildschirm)

Profil · Werdegang · Berufserfahrung · Kompetenzen · Interessen · Zertifikate · Ausbildung · Sprachen · Engagement. Wichtiges zuerst; Interessen bekommen mehr Gewicht. Rollenversionen und Bewerbungen bleiben vorerst in ihrer Reihenfolge; das gedruckte Dossier hält die Checkliste ein (siehe unten).

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

- Setze den Namen in `screen-h1`, Abschnittstitel in `screen-h2`, Rollen in `screen-role`, «Organisation, Ort» in `screen-subtitle`, den Zeitraum in `screen-body` (`color-text-muted`), allen Fliesstext in `screen-body`, Meta in `screen-small`. Im Druck gelten die `print-`-Stile.
- Zeilenlänge im Fliesstext höchstens `content-max-width` (etwa 65 Zeichen). Überschriften mit `text-wrap: balance`.
- Zeilenhöhen ohne Einheit: 1.1 für den Namen, 1.2–1.35 für Titel, 1.6 für Text.
- Zeiträume als `03.2019 – heute` mit Tabellenziffern, in `color-text-muted`. Am Bildschirm auf eigener Zeile unter «Organisation, Ort»; im Druck vorerst auf der Zeile der Organisation nach «·».
- Unterscheide Organisation und Zeitraum über Farbe und Raum, nicht über Gewicht: Organisation in `color-text`, Zeitraum in `color-text-muted`, danach `space-2` Abstand.
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
| Lücken | Empfehlung der Checkliste: ab einem Monat erklärt, als eigener Eintrag («Weiterbildung», «berufliche Neuorientierung»). Ob eine Lücke erklärt wird, entscheidet Alex; das System zeichnet nur, was in den Daten steht. |
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

Vier Stufen, keine halben: 1 Grundkenntnisse · 2 Erste Erfahrung · 3 Erfahren · 4 Spezialist. Dargestellt als vier gezeichnete Punkte (gefüllt `color-accent`, leer als Ring in `color-level-empty`) plus Wort. Jede Kompetenz hat eine Stufe; keine Gruppe bleibt ohne Selbsteinschätzung.

Die Legende steht **vor** den Gruppen (Ausnahme zu Regel 2, siehe dort): «Selbsteinschätzung in vier Stufen:» und die vier Stufen mit Punkten und Wort in einer Zeile, die umbricht; `screen-small`, `color-text-faint`, danach `space-4` Abstand.

## Raster und Raum

- Eine Spalte von höchstens 1120 px, mindestens `space-3` Seitenrand auf jedem Viewport; die Seite scrollt nie seitwärts, bei 320, 375, 768 und 1440 px. Einzige Ausnahme: die Abschnittsnavigation unter 768 px scrollt in sich.
- Innerhalb eines Eintrags `space-1` bis `space-3`, zwischen Einträgen `space-4`, Titel zu Inhalt `space-5`, zwischen Abschnitten `space-section`. Kompakt statt luftig.
- Geschwister mit `gap`, nie mit Einzelabständen. `min-width: 0` auf Grid- und Flex-Kindern.
- Nicht alles ist eine Karte. Rand, Fläche, Radius und Schatten nach Rolle, nicht pauschal.

## Muster

- **Erklärte Lücke:** schraffiertes Feld im Zeitstrahl (45°, `color-border-strong`), mit einem Wort beschriftet, nur wenn die Daten einen Lücken-Eintrag haben. Eine unerklärte Lücke bleibt leer und wird nie markiert.
- **Beleg-Chip:** Pille mit Farbquadrat der Entität; springt zur Stelle und lässt sie kurz in `color-accent-soft` aufleuchten. Ein Richtungshinweis ist eine CSS-Form, kein Pfeilzeichen. Im CV gilt die Textform (siehe «Querverweise»).
- **Fit-Check:** Präferenz als gezeichnete Marke vor jeder Option (gefüllt «ideal», Ring «passt», gestrichelter Ring «eher nicht»), Ergebnis als Segmentbalken plus Satz.
- **Zeugnis-Vorlage:** gestrichelter Rahmen, Etikett «Vorlage», Platzhalter in eckigen Klammern. Nie erfundene Zitate.

## Bewegung

- 120 ms für Hover und Zustände, 220 ms für Ein- und Ausblenden; `ease-out`, kein Federn.
- Nur `transform` und `opacity`. Die Seite ist im Ruhezustand vollständig lesbar.
- `prefers-reduced-motion: reduce` schaltet alles ab.

## Diagramme (nur Bildschirm)

- Form nach Aufgabe: Grösse → Balken, Anteil → ein geteilter Balken, Verlauf → Linie, eine Aussage → eine Zahl im Satz.
- Eine Achse, Beschriftung direkt an der Marke, Achsen in `data-grid` und `color-text-faint`, Werte in `color-text`. Text trägt nie die Serienfarbe.
- Jedes Diagramm zeigt seine Werte als Text an der Marke oder in einem Tooltip und ist per Tastatur erreichbar. Das Zeitband zeigt sie als Text in jeder Zeile.

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
