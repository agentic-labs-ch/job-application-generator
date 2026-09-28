Das Inhaltsverzeichnis unter dem Kopf: Links zu den Abschnitten, unter 768 px eine einzige Zeile zum Wischen.

**Aufbau:** Links in `screen-small` (16 px), `color-text-muted`, ohne Lücken dazwischen, Innenabstand 8 px, je mindestens 44 × 44 px Klickfläche. Oben und unten eine Haarlinie `color-border`. Hover: `color-text` auf `color-surface-sunk`, `radius-pill`.

**Verhalten:**
- **Unter 768 px:** eine Zeile, die in sich seitwärts scrollt (`overflow-x: auto`, Scrollbalken ausgeblendet). Die Seite selbst scrollt nie seitwärts. Der angeschnittene letzte Link zeigt, dass mehr folgt; links beginnt die Zeile bündig mit dem Text, rechts ohne Innenabstand, damit fast immer ein Link angeschnitten ist.
- **Ab 768 px:** mehrzeilig.
- **Ab 1024 px:** bleibt beim Scrollen oben stehen (`position: sticky`, Fläche `color-bg`).
- Darunter nicht fixiert, damit sie nie fokussierten Inhalt verdeckt.

**Was der Verbraucher liefert:** die Abschnitte in der Reihenfolge der Seite, mit ihren Titeln als Linktext; `aria-label` für die Navigation.

**Richtig:** dieselben Wörter wie die Abschnittstitel; Sprungziele landen unter dem Titel.

**Falsch:** Nummern oder Versalien vor den Links; ein Scrollbalken, der die Seite breiter macht; fixiert am Handy.
