Das Zeitband: alle Stellen und Ausbildungen auf einer gemeinsamen Zeitachse, jede Zeile ein Link zu ihrem Eintrag.

**Inhalt:** eine Liste ohne Zwischentitel, zuerst die Stellen, darunter die Ausbildung, jeweils die älteste zuerst. Nur Einträge aus den Daten; Lücken und die Zeit ausserhalb bleiben leer und unbeschriftet.

**Achse:** vom Januar des ersten Jahres bis zum Januar nach dem letzten Jahr, für alle Zeilen gleich. Kein Balken wird abgeschnitten; ein offener Zeitraum läuft bis zum Achsenende. Eine Linie `color-border-strong`, Jahreszahlen in `screen-small`, `color-text-faint`, Tabellenziffern; unter 768 px jedes vierte Jahr, ab 768 px jedes zweite; ab 768 px entfällt das zweite sichtbare Jahr, damit es nicht mit dem linksbündigen ersten zusammenstösst.

**Zeile:**
- Unter 768 px: Name (`screen-body`, 17 px) und Zeitraum (`screen-small`, 16 px, `color-text-muted`, nur Jahre, z. B. «2014 – 2016», «seit 2019») in einer Zeile; darunter der Balken über die ganze Breite.
- Ab 768 px: Name und Zeitraum mit Monaten links in einer Spalte von 16rem, der Balken rechts.
- Balken 10 px hoch, `radius-pill`, mindestens 4 px breit, auf einer Haarlinie `color-border`.
- Jede Zeile ist ein Link, mindestens 44 px hoch; Hover unterstreicht den Namen, Fokus in `color-focus`.

**Kürzel:** Wo der CV Querverweise zeigt (Haupt-CV, Rollenversionen), steht vor dem Namen das Kürzel des Eintrags in `color-accent` («B1 Musterbank AG»). Bewerbungen zeigen keine Kürzel.

**Farbe:** `data-1` Architektur & Beratung, `data-2` Entwicklung, `data-3` Ausbildung. Die Farbe steht nie allein: jede Zeile trägt die Art als verstecktes Wort («Entwicklung: …»), und die Legende mit Wörtern schliesst den Block. Die Serienfarbe färbt nie Text.

**Legende:** ein Satz («Arbeit und Ausbildung, 2011 – 2026.») und die Arten mit einem runden Farbfeld von 12 px, `screen-small`, `color-text-faint`.

**Platz:** Haupt-CV nach dem Profil; Rollenversionen nach den Kompetenzen; Bewerbungen nach den Kernkompetenzen; immer vor der Berufserfahrung. Im Druck vorerst ausgeblendet.

**Was der Verbraucher liefert:** Einträge mit Start, Ende (oder offen), Name und Art. Im Repo kommt die Art aus den Tags (architecture, consulting oder presales ergibt Architektur & Beratung, sonst Entwicklung; Ausbildung aus dem Abschnitt).

**Falsch:** eine erfundene Lücke oder «Weiterbildung» einzeichnen, die nicht in den Daten steht; eine unerklärte Lücke markieren; Balken ohne Legende; Werte nur im Tooltip.
