Ein ganzer Lebenslauf mit fiktiven Daten (Robin Muster), am Stand der Website nach PR 2, Phase A (Handy), an dem sich jede Kombination aus Breite, Version, Farbe, Layout, Schrift und Grösse prüfen lässt.

**Wofür:** Entwürfe vergleichen, bevor eine Kombination in `design` einer Version landet. Voreingestellt ist die Handy-Breite 375 px; so sieht das Blatt aus wie die Website am iPhone. Die Werkzeugleiste gibt es nur hier im Designsystem.

**Was der Verbraucher liefert:** Inhalte als Daten (`data/cv.yaml`, `data/profiles/*.yaml`), `design` der Version und die Rollen-Tokens. Das Blatt setzt keine eigenen Werte, nur Rollen: `--font-size-*` aus der Skala, `color-*` und `data-*` aus dem Theme, `space-*`, `radius-*`.

**Aufbau (Haupt-CV, Bildschirm):**
- Kopf: Porträt und Sprachknopf in einer Zeile → Name → Headline → Ort → Knöpfe (siehe **Knopf**).
- **Abschnittsnavigation**, unter 768 px eine Zeile zum Wischen.
- Profil (Claim ohne Linie, dann Text) · **Werdegang** · Berufserfahrung · Kompetenzen · Interessen · Zertifikate · Ausbildung · Sprachen · Engagement · Fusszeile.
- Eintrag: Titel (21 px) → «Organisation, Ort» (18 px) → Zeitraum auf eigener Zeile (17 px, `color-text-muted`) → Zusammenfassung → Highlights. Im Zeitstrahl (`cv`, `1c`) stehen die Jahre in Rollengrösse über dem Titel; der aktuelle Punkt ist gefüllt.
- Kompetenzen: Titel → Legende der vier Stufen und der Quellen → Gruppen mit Zeilen (Name, darunter Punkte, Wort und rechtsbündig die Quellen-Links).
- Querverweise: Kürzel B1 … B3, A1, A2, Z1 vor jedem Zeitraum und im Werdegang vor dem Namen; die Quellen an den Kompetenzen springen zum Eintrag. Die Quellen sind fiktiv.
- Sprachen: Name und Stufe in einer Zeile, darunter optional, wie die Sprache gebraucht wird (16 px, `color-text-muted`).
- Engagement: Tätigkeit (17 px) → Organisation (17 px, `color-text-muted`) → Zeitraum.

**Layouts ab 768 px:** `1a` setzt Kompetenzen, Interessen und Sprachen in eine Seitenleiste in `color-surface-sunk`, `1b` in eine schmale Spalte rechts unter einem Kopfband. In beiden bleibt das Zeitband in der Handy-Form, weil die Hauptspalte schmal ist. Tablet und Desktop sind noch nicht abgenommen (Phase B).

**Richtig:**
- Die Farbe am Blatt mit `data-theme` setzen, die Schrift mit `--font-<familie>`, die Grösse über die Wurzel (`data-size`).
- Stufenpunkte und Farbfelder als CSS-Formen zeichnen, immer mit dem Wort daneben.

**Falsch:**
- Eine zweite Familie für Datum oder Labels, fett für die Organisation, Versalien für Abschnittstitel.
- Das Datum über die Rolle stellen (ausser den Jahren im Zeitstrahl, die gleich gross sind wie die Rolle).
- Den Namen grösser als `--font-size-h1` setzen, weil das Blatt «leer wirkt».
