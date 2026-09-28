Ein Blatt Lebenslauf mit fiktiven Daten (Robin Muster), an dem sich jede Kombination aus Version, Farbe, Layout, Schrift und Grösse prüfen lässt.

**Wofür:** Entwürfe vergleichen, bevor eine Kombination in `design` einer Version landet, und die Besucherwahlen «Schrift» und «Grösse» zeigen. Die Werkzeugleiste mit Version, Farbe und Layout gibt es nur hier im Designsystem. Auf der Website wählen Besucher die Version über die Navigation, dazu Sprache, Schrift und Grösse.

**Was der Verbraucher liefert:** Inhalte als Daten (`data/cv.yaml`, `data/profiles/*.yaml`), `design` der Version und die Rollen-Tokens. Das Blatt setzt keine eigenen Werte, nur Rollen: `--font-size-*` aus der Skala, `color-*` aus dem Theme, `space-*`, `radius-*`.

**Aufbau nach Regel 2:**
- Kopf: Name → Zielrolle → Headline → Kontakt. Die Zielrolle steht unter dem Namen, nie darüber.
- Station: Jahr (nur `cv` und `1c`, Rollengrösse) und Rolle → Organisation, Ort · Zeitraum → Zusammenfassung → Highlights.
- Kompetenzen: Titel → Gruppe → Zeilen mit Stufenpunkten und Wort → Legende am Schluss.
- Fusszeile mit Seitenzahl unten.

**Richtig:**
- Die Farbe am Blatt mit `data-theme` setzen, die Schrift mit einer Variable `--font-<familie>`, die Grösse über die Wurzel (`data-size`).
- Stufenpunkte als CSS-Formen zeichnen, immer mit dem Wort daneben.

**Falsch:**
- Eine zweite Familie für Datum oder Labels, fett für die Organisation, Versalien für Abschnittstitel.
- Das Datum über die Rolle stellen oder die Legende unter den Abschnittstitel.
- Den Namen grösser als `--font-size-h1` setzen, weil das Blatt «leer wirkt». Leerraum wird mit `space-*` verkleinert, nicht mit grösserer Schrift gefüllt.
