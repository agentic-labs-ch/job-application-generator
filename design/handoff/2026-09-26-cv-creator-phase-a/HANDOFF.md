# Übergabe: Design-System «CV Creator» (intern «Granat»), Stand Phase A

- Exportiert: 2026-09-26 von Alex (mit Claude)
- Quelle: Design-System-Artefakt «CV Creator», Version 21 (`1790441535-5595`), letzte Änderung 2026-09-26 («Punkt 11 Querverweise»)
- Vorgänger: Export `2026-09-26-cv-creator` (Version `1790418500-edf6`)
- Grundlage der Änderungen: `UEBERGABE.md` aus dem Repo (PR 18, Branch `design/pr2-einzelschrift`), Punkte 1–9, dazu `NACHTRAG-querverweise.md` (Punkt 11)
- **Tokens unverändert:** `tokens.json` Version 3, sha256 `84cf5ec7506e89db33aa7de28f8a98609813cee95342f729277318fa4df5bb93` (identisch mit dem Vorgänger)

Ordnername: Der Vorgänger liegt schon unter `design/handoff/2026-09-26-cv-creator/`. Dieser Export heisst deshalb `2026-09-26-cv-creator-phase-a`.

## Prüfsummen (sha256)

| Datei | sha256 |
|---|---|
| `tokens.json` | `84cf5ec7506e89db33aa7de28f8a98609813cee95342f729277318fa4df5bb93` (unverändert) |
| `README.md` | `feac69fd8b7b15cf52de45d3db5b3813e55637da30fb1deebfc9ca35324101f3` |
| `varianten.md` | `89adb0543dc16e4e5b1d39622200aa8880ae9e5a2301cec0026df4bb4fece593` |
| `components/Musterblatt/README.md` | `42aed6e584278afb7a0a2e1971771c02fec95309e79b1deaa72ea83b3d6b6889` |
| `components/Musterblatt/preview.html` | `05eba0cacfd404e40b43a3783dd8c16dbc725880b1875afa44e2c3ccfd3d483a` |
| `components/Knopf/README.md` | `55f1bf0221f923c9d46dd841edb62fb83f33dfac617d37334ac226bdf1fafd9b` (neu) |
| `components/Knopf/preview.html` | `c7544cd01c2ba60843a6465fb9c65370937b33719917e2e63da050f5927479c6` (neu) |
| `components/Abschnittsnavigation/README.md` | `875e23034484b0e3d9c11b97b8efccc99c02f0ab404f9d8826202e421d21b814` (neu) |
| `components/Abschnittsnavigation/preview.html` | `5b6fcddeb6ece85680991a70acb5e0684a9c349d7cdddd6d588077578bc05803` (neu) |
| `components/Werdegang/README.md` | `19cda4307de4f7ebabec7268f4ef2c9b83dc1c4c376c88db5dd47e5152448e01` (neu) |
| `components/Werdegang/preview.html` | `964e6a1c58f8670dff2c8685f56dd8502148a3b686e7d88fc49ddf449e5e32dd` (neu) |
| `components/Cover/preview.html` | `67564225518f36ab7b4acece1099c8a61c356c7a68b250ca94caa20ffcee0646` (unverändert) |

## Änderungsliste

| Punkt (UEBERGABE) | Wo im System | Änderung |
|---|---|---|
| — | README, Einleitung | Das System ist die verbindliche Quelle, das Repo folgt («Verbindlich ist `DESIGN.md`» ersetzt). Entscheide im Repo unter `docs/design-decisions.md`. |
| 1 Knöpfe | README «Auswahl für Besucher», «Bildschirm-Komponenten › Knopf»; neue Komponente **Knopf** | 36-px-Pille in 44 × 44 px Klickfläche, Varianten Haupt/Standard/Aktuell, Bewerbungsleiste am Handy ohne aktuelles Dokument |
| 2 Abschnittsnavigation | README «Bildschirm-Komponenten», «Raster und Raum»; neue Komponente **Abschnittsnavigation** | unter 768 px eine Zeile zum Wischen; die Seite scrollt nie seitwärts (einzige Ausnahme im Raster festgehalten) |
| 3 Kopf am Handy | README «Kopf am Handy»; Musterblatt | Porträt + Sprachknopf, Name, Headline, Ort, Knöpfe; 64 px unter 360 px; Porträt entfällt unter 360 px unter einer Bewerbungsleiste |
| 4 Werdegang | README «Werdegang (Zeitband)», Muster «Erklärte Lücke»; neue Komponente **Werdegang** | eine Achse, Stellen dann Ausbildung, älteste zuerst, Legende am Schluss, Platz je Ausgabe, im Druck vorerst aus |
| 5 Einträge | README Regel 2, «Typografie», «Einträge»; varianten.md | Titel → «Organisation, Ort» → Zeitraum auf eigener Zeile, **17 px** (Entscheid 1 unten); Druck vorerst mit «·» |
| 6 Kompetenzen | README Regel 2 (Ausnahme), «Kompetenzmodell»; varianten.md | Legende vor den Gruppen, kompakt; jede Kompetenz hat eine Stufe |
| 7 Engagement | README «Einträge» | Tätigkeit 17 px, Organisation 17 px muted, Zeitraum wie überall |
| 8 Sprachen | README «Sprachen» | optionale Zeile, wie die Sprache gebraucht wird |
| 9 Reihenfolge | README «Reihenfolge im Haupt-CV»; varianten.md Layout `cv` | Profil · Werdegang · Berufserfahrung · Kompetenzen · Interessen · Zertifikate · Ausbildung · Sprachen · Engagement (Bildschirm) |
| 10 | README, varianten.md «Versionen heute» | Stand PR 2 (Entwurf) nachgeführt |
| 11 Querverweise | README «Querverweise», Muster «Beleg-Chip»; Werdegang; Musterblatt | Kürzel B/A/Z (englisch W/E/C) vor dem Zeitraum und im Werdegang vor dem Namen; Quellen-Links an den Kompetenzen (16 px, rechtsbündig, 44 × 44 px ohne höhere Zeile); Quellen-Zeile in der Legende; Screenreader «Quellen:» und «B1: Organisation»; im Druck vorerst aus; nur Haupt-CV und Rollenversionen |
| — | Musterblatt | neu aufgebaut am Stand Phase A: Breiten 320/375/430/768/1120, voreingestellt 375 px |

## Farbprüfung Zeitband (`data-1` … `data-3`)

Geprüft: Balken und Farbfeld gegen `color-bg` und `color-surface` (mindestens 3:1), Text der Legende (`color-text-faint`) gegen `color-bg` (mindestens 4.5:1). Die `data-*`-Tokens haben nur Werte für `light` und `dark`. Die übrigen sechs Themes erben die Werte von `light`.

| Theme | `data-1` | `data-2` | `data-3` | Legende | Ergebnis |
|---|---|---|---|---|---|
| Granat · Papier (`light`) | 6.03 | 3.88 | 6.14 | 5.18 | besteht |
| Granat · Abend (`dark`) | 5.37 | 5.49 | 4.42 | 5.59 | besteht, siehe Hinweis 2 |
| Petrol (`petrol`) | **2.63** | 4.09 | **2.59** | 5.59 | **reicht nicht** |
| Indigo | 6.37 | 4.10 | 6.49 | 5.01 | besteht |
| Tanne | 6.13 | 3.95 | 6.24 | 5.27 | besteht |
| Ocker | 6.07 | 3.91 | 6.18 | 5.50 | besteht |
| Marine | 6.25 | 4.02 | 6.36 | 5.29 | besteht |
| Graphit | 6.21 | 4.00 | 6.32 | 5.59 | besteht |

Kontrast gegen `color-bg`; gegen `color-surface` liegen alle Werte in derselben Klasse (Petrol 2.42 und 2.37).

**Vorschläge (nicht umgesetzt, Tokens bleiben Version 3):**

1. **Petrol:** Das dunkle Blatt erbt die hellen Werte. Vorschlag: Petrol bekommt die Werte von `dark`, also `data-1` `#d96c7b` (5.37:1), `data-2` `#16a18e` (5.49:1), `data-3` `#7275d8` (4.42:1). Heute betrifft das nichts Sichtbares: Die Website zeigt am Bildschirm immer Granat, und im Druck ist das Zeitband ausgeblendet. Es wird wichtig, sobald das Zeitband in den Druck kommt.
2. **Abend (`dark`):** `data-1` und `data-2` sind gleich hell (1.02:1 untereinander). Menschen mit Rot-Grün-Schwäche unterscheiden Architektur & Beratung und Entwicklung dann kaum. Die Legende und die versteckten Wörter tragen die Bedeutung zwar mit, trotzdem schlage ich ein helleres Petrol für `data-2` vor: `#5fd0bd` (9.46:1 zum Grund, 1.76:1 zu `data-1`, 2.14:1 zu `data-3`).
3. **Papier (`light`):** `data-1` und `data-3` sind ebenfalls gleich hell (1.02:1). Rot und Indigo unterscheiden sich im Farbton stark genug für den Bildschirm. Im Schwarzweiss-Druck (Graphit) wären sie gleich. Das gehört zum Druckteil.

## Entscheide (Alex, 26.09.2026) und was das Repo daraus ändert

| Nr. | Entscheid | Im System | Im Repo zu ändern |
|---|---|---|---|
| 1 | Zeitraum in Textgrösse: Titel 21 → «Organisation, Ort» 18 → Zeitraum **17 px** (`color-text-muted`) → Text 17. Regel 2 ohne Ausnahme. | README Regel 2, «Einträge», «Typografie» | `.entry-period`, `.project-period`: `font-size: var(--font-size-body)`, `line-height: var(--line-height-body)`. Regel-2-Test anpassen. |
| 2 | Achse ab 768 px: das zweite sichtbare Jahr entfällt. | README «Werdegang», Komponente Werdegang | In `@media (min-width: 768px)`: `.career-tick:nth-child(3) { display: none; }` |
| 3 | Abschnittsnavigation unter 768 px: links bündig mit dem Text, rechts ohne Innenabstand. | README, Komponente Abschnittsnavigation | `.section-nav ul { padding-inline-end: 0; }` unter 768 px; bei 320/375/390/430 px mit echten Titeln prüfen, ob ein Link angeschnitten ist. |
| 4 | Linie der Standardknöpfe bleibt (`color-border-strong`); sie ist Schmuck, die Beschriftung macht den Knopf erkennbar. Von Claude entschieden, weil Alex es nicht beurteilen kann. | README «Knopf», Komponente Knopf | nichts |
| 5 | Diagramme zeigen ihre Werte als Text an der Marke oder in einem Tooltip; das Zeitband braucht keinen Tooltip. | README «Diagramme» | nichts |
| 6 | Die neue Reihenfolge gilt nur am Bildschirm; das gedruckte Dossier hält die Checkliste ein. | README, varianten.md | im Druckteil beachten |
| 7 | Unerklärte Lücken werden nie markiert; «Erklärte Lücke» nur, wenn die Daten einen Lücken-Eintrag haben. Die Dossier-Regel ist eine Empfehlung. | README «Muster», «Dossier» | nichts |
| 8 | `data-1` bleibt gleich wie der Akzent (Architektur & Beratung ist die Hauptlinie). | — | nichts |
| 9 | Hauptknopf: das System nennt `color-on-accent`. | README «Knopf» | prüfen, dass `--brand-ink` im Haupt-CV `color-on-accent` entspricht und nur Bewerbungen es überschreiben |

Hinweis zu Punkt 11: Das Kürzel vor dem Zeitraum steht in der Grösse des Zeitraums, nach Entscheid 1 also 17 px (der Nachtrag nennt noch 16 px). Die Quellen-Links an den Kompetenzen bleiben 16 px.

Punkte 5–9 hat Claude mit seinen Vorschlägen entschieden; Alex kann jeden davon ändern.

Offen, nur für Alex (Inhalt): «Fluent (C2)» in den Sprachen. Nach der Dossier-Regel gehört eine GER-Stufe nur mit Zertifikat in den CV.

Offen für den Druckteil: die Farbvorschläge für Petrol und Abend oben.

## Hinweise für die Umsetzung

- Die Vorschauen laden Instrument Sans von Google Fonts und nutzen ein kleines Inline-Script (nur Musterblatt, Werkzeugleiste). Beides dient nur zur Ansicht und wird nicht übernommen.
- Die Vorschauen simulieren 768 px mit Container-Queries. Im Repo gelten weiter Media-Queries bei 768 und 1024 px.
- Die Werte für `--font-size-*` (clamp) stehen wie im Vorgänger in jeder Vorschau; `tokens.json` hält nur die Werte bei 1440 px.
