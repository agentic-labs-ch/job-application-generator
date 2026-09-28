# Übergabe: Design-System «CV Creator» (intern «Granat»)

- Exportiert: 2026-09-26 von Alex (mit Claude)
- Quelle: Design-System-Artefakt «CV Creator», Version `1790418500-edf6`, letzte Änderung 2026-09-24 («Umbau nach D1–D8»)
- `tokens.json`: `version: 3`, sha256 `84cf5ec7506e89db33aa7de28f8a98609813cee95342f729277318fa4df5bb93`
- `README.md`: sha256 `53f14f267b12bbe7a24f0479b712f4a1cc22b1f3c072a99f048be1dd67d37430`
- `varianten.md`: sha256 `fa1d05b1e47c2cd1c4052a9a2feb2fb3e0dbf42957b9a8e84b93ec3b883f6026`

Alle Dateien sind unverändert aus dem Design-System übernommen. Nur diese Datei (`HANDOFF.md`) ist neu.

## Inhalt

| Datei | Zweck |
|---|---|
| `tokens.json` | Tokens: 8 Farbthemes (`light`, `dark`, `petrol`, `indigo`, `tanne`, `ocker`, `marine`, `graphit`), Typo `cv-ruhig` (Bildschirm und Druck), 10 Schriftfamilien, Abstände, Radien, Schatten, Deckkraft. Format: Listen `{name, value, usage}`, kein DTCG. Nach `design/tokens.json` kopieren. |
| `README.md` | Regeln (Regel 1 und 2, Farbe, Typografie, Dossier, Raster, Muster, Schutzregeln) |
| `varianten.md` | Themes, Schriften, Skalen im Vergleich, Layouts `cv`/`1a`/`1b`/`1c`, Versionen heute |
| `components/Musterblatt/` | Referenzblatt mit fiktiven Daten: README und Vorschau |
| `components/Cover/` | Titelbild des Systems (nur Referenz) |
| `design-system.json` | Index des Artefakts (nur Referenz, nicht für das Repo) |

## Hinweise für die Umsetzung

- **Bildschirmgrössen am Handy:** In `tokens.json` stehen für `screen-*` nur die Desktop-Werte (z. B. `screen-h1` 3rem = 48 px). Die fliessenden Werte von 375 bis 1440 px stehen nur in `components/Musterblatt/preview.html` als `clamp()`. Sie gelten als verbindlich:
  - `--font-size-h1: clamp(2.5rem, 2.3239rem + 0.7512vw, 3rem)` (40 → 48 px)
  - `--font-size-h2: clamp(1.625rem, 1.537rem + 0.3756vw, 1.875rem)` (26 → 30 px)
  - `--font-size-claim: clamp(1.375rem, 1.331rem + 0.1878vw, 1.5rem)` (22 → 24 px)
  - `role` 1.3125rem, `subtitle` 1.125rem, `body` 1.0625rem, `small` 1rem (fest)
- **Druckgrössen** stehen in px (32 px = 24 pt, 17.33 px = 13 pt, 12 px = 9 pt, 10 px = 7.5 pt).
- **Breakpoints:** Das Musterblatt nutzt Container-Queries (bis 560 px eine Spalte, ab 720 px mehrspaltig). Im Repo gelten 768 und 1024 px. Das Design-System legt keine Breakpoint-Tokens fest, daher bleiben die Werte des Repos.
- **Schriftdateien:** `type.fonts` ist leer. Schriften kommen weiter selbst gehostet aus `@fontsource` (für PR 2 nur Instrument Sans 400).
- **Nicht übernehmen:** Google-Fonts-Links, Inline-Script und `onsubmit` in den Vorschauen. Sie dienen nur zur Ansicht im Design-System.
- **Token-Namen:** Das Repo nutzt andere Namen (z. B. `surface-page`, `ink-faint`). Die alten Namen bleiben als Aliase, bis kein Code sie mehr nutzt.

## Fehlt in dieser Übergabe

- `ENTSCHEIDE.md` (D1–D8, F1–F4) aus dem Übergabepaket bzw. «CV Generator». Konnte nicht exportiert werden. Belegt sind nur:
  - D5: Website am Bildschirm immer Granat (Papier/Abend)
  - F2: endgültige Schrift, laut Brief Instrument Sans
- `design/catalog/`, auf den README und Musterblatt verweisen (z. B. `design/catalog/scale/cv-ruhig.json`). Existiert weder im Repo noch im Design-System.
