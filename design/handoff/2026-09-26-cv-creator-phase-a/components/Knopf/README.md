Eine sichtbare Pille von 36 px in einer Klickfläche von 44 × 44 px, für Kontakt, PDF, Sprache und die Bewerbungsleiste.

**Aufbau:** Schrift `screen-small` (16 px), Innenabstand 10 px, `radius-pill`. Ein transparenter Rand von 4 px gehört zur Klickfläche; Fläche und Linie werden nur innen gemalt (`background-clip: padding-box`, Linie als `inset`-Schatten von 1 px). So bleibt die Klickfläche 44 px, sichtbar sind 36 px.

**Kontrast:** Die Linie der Standardknöpfe ist Schmuck (rund 1.6:1). Erkennbar wird der Knopf durch die Beschriftung (mindestens 4.5:1), darum gilt die 3:1-Regel für Linien hier nicht.

**Varianten:**
- **Hauptknopf** (der erste Kontaktknopf): `color-accent`, Schrift `color-on-accent`; Hover `color-accent-strong`.
- **Standard:** `color-surface`, Linie `color-border-strong`, Schrift `color-text`; Hover-Linie `color-text-faint`.
- **Aktuell** (Bewerbungsleiste, `aria-current="page"`): gefüllt mit `color-text`, Schrift `color-bg`.

**Reihe:** Knöpfe stehen ohne `gap` nebeneinander; die transparenten Ränder ergeben 8 px Abstand. Die Liste rückt um −4 px ein, damit die sichtbare Pille bündig mit dem Text darüber steht.

**Bewerbungsleiste:** Fläche `color-surface-sunk`, unten eine Haarlinie `color-border`. Unter 768 px lässt sie das gerade offene Dokument weg, damit die Knöpfe in eine Zeile passen; der Stellentitel erscheint erst ab 768 px (die Zielrolle unter dem Namen wiederholt ihn).

**Was der Verbraucher liefert:** Beschriftung als Wort («E-Mail», «PDF», «English»), nie ein Symbol; `hreflang`/`lang` am Sprachknopf.

**Richtig:**
- Sichtbarer Fokus: 2 px `color-focus`, 2 px Abstand.
- Genau ein Hauptknopf pro Gruppe.

**Falsch:**
- Die Pille auf 44 px aufblasen oder die Klickfläche auf 36 px schrumpfen.
- Fett, Versalien oder ein Pfeilzeichen im Knopf.
