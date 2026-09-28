// Company colours of one application (DESIGN.md, "Company colours"). An application names a
// few base colours (paper, ink, accent, optional accent text colour and decorative marks); the
// Granat colour tokens of that page are derived from them here and checked against WCAG AA
// before anything is built. Type, spacing, components and layout stay those of the design
// system: only colours change from one application to the next.

const HEX = /^#[0-9a-f]{6}$/i;

// Contrast minimums (WCAG 2.2): body text gets extra headroom so that muted and faint text can
// be derived from it; text in the accent colour and all secondary text need AA (4.5:1);
// graphical marks that carry meaning (timeline dot, claim rule) need 3:1.
export const MIN_CONTRAST = { ink: 7, text: 4.5, muted: 5.5, faint: 4.6, mark: 3 };

export function parseHex(hex) {
  if (!HEX.test(hex)) throw new Error(`not a #rrggbb colour: ${JSON.stringify(hex)}`);
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

export function toHex(rgb) {
  return `#${rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('')}`;
}

// Relative luminance (WCAG 2.x).
export function luminance(hex) {
  const [r, g, b] = parseHex(hex).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Mixes two colours in sRGB: t = 0 gives `a`, t = 1 gives `b`.
export function mix(a, b, t) {
  const [x, y] = [parseHex(a), parseHex(b)];
  return toHex(x.map((c, i) => c + (y[i] - c) * t));
}

const passes = (color, grounds, min) => grounds.every((g) => contrast(color, g) >= min);

// The first colour on the way from `from` to `to` (1 % steps) that reaches `min` against every
// ground; `to` is the ink, so the way always ends at the best contrast available.
function towards(from, to, grounds, min) {
  for (let step = 0; step <= 100; step += 1) {
    const color = mix(from, to, step / 100);
    if (passes(color, grounds, min)) return color;
  }
  return undefined;
}

// The colour closest to `to` on the way from `from` that still reaches `min`: used for muted
// and faint text, which should be as quiet as the contrast rule allows.
function quietest(from, to, grounds, min) {
  let best;
  for (let step = 0; step <= 100; step += 1) {
    const color = mix(from, to, step / 100);
    if (!passes(color, grounds, min)) break;
    best = color;
  }
  return best;
}

// Derives the page's colour tokens from the application's `brand` block. Returns
// { tokens, scheme, marks, errors }; with errors the page must not be built.
export function brandTokens(brand) {
  const errors = [];
  const colors = [brand.paper, brand.ink, brand.accent, brand.accentText, ...(brand.marks ?? [])].filter(Boolean);
  for (const c of colors) {
    if (!HEX.test(c)) errors.push(`brand colour ${JSON.stringify(c)} is not #rrggbb`);
  }
  if (errors.length) return { errors };

  const { paper, ink, accent } = brand;
  const dark = luminance(paper) < luminance(ink);
  const inkContrast = contrast(ink, paper);
  if (inkContrast < MIN_CONTRAST.ink) {
    errors.push(`ink ${ink} on paper ${paper} is ${inkContrast.toFixed(2)}:1 (min. ${MIN_CONTRAST.ink}:1)`);
    return { errors };
  }

  // Surfaces: raised (letter sheet, cards) and sunk (application bar) stay close to the paper.
  const raised = dark ? mix(paper, ink, 0.07) : mix(paper, '#ffffff', 0.6);
  const sunk = mix(paper, ink, dark ? 0.04 : 0.05);
  const grounds = [paper, raised, sunk];

  const muted = quietest(ink, paper, grounds, MIN_CONTRAST.muted);
  const faint = quietest(ink, paper, grounds, MIN_CONTRAST.faint);
  if (!muted || !faint) {
    errors.push(`ink ${ink} leaves no room for muted text on paper ${paper} (min. ${MIN_CONTRAST.muted}:1 on every surface)`);
    return { errors };
  }

  // Accent text (links, target role): the given accent text colour or the accent itself when it
  // reaches AA, else the accent moved towards the ink until it does.
  let text = brand.accentText ?? accent;
  if (brand.accentText && !passes(text, grounds, MIN_CONTRAST.text)) {
    errors.push(`accentText ${text} reaches only ${contrast(text, paper).toFixed(2)}:1 on the paper (min. ${MIN_CONTRAST.text}:1)`);
  } else if (!passes(text, grounds, MIN_CONTRAST.text)) {
    text = towards(accent, ink, grounds, MIN_CONTRAST.text);
  }
  // Marks that carry meaning use the accent itself when it reaches 3:1.
  const mark = passes(accent, [paper], MIN_CONTRAST.mark) ? accent : towards(accent, ink, [paper], MIN_CONTRAST.mark);
  if (!text || !mark) errors.push(`the accent ${accent} cannot reach ${MIN_CONTRAST.text}:1 on the paper, even moved to the ink`);
  if (errors.length) return { errors };
  // Text on an accent fill (primary button): paper or ink, whichever reads better.
  const onAccent = contrast(paper, text) >= contrast(ink, text) ? paper : ink;
  if (contrast(onAccent, text) < MIN_CONTRAST.text) {
    errors.push(`no text colour reaches ${MIN_CONTRAST.text}:1 on the accent ${text}`);
    return { errors };
  }

  const soft = mix(paper, mark, dark ? 0.2 : 0.1);
  const marks = brand.marks?.length ? brand.marks : [mark];
  const stripe = marks
    .map((c, i) => `${c} ${((i * 100) / marks.length).toFixed(2)}% ${(((i + 1) * 100) / marks.length).toFixed(2)}%`)
    .join(', ');
  // Design-system names (design/tokens.json); tokens.css maps the old project names onto them.
  const tokens = {
    'color-scheme': dark ? 'dark' : 'light',
    '--color-bg': paper,
    '--color-surface': raised,
    '--color-surface-sunk': sunk,
    '--color-text': ink,
    '--color-text-muted': muted,
    '--color-text-faint': faint,
    '--color-border': mix(paper, ink, dark ? 0.2 : 0.14),
    '--color-border-strong': mix(paper, ink, dark ? 0.34 : 0.3),
    '--color-accent': text,
    '--color-accent-strong': mix(text, ink, 0.3),
    '--color-accent-soft': soft,
    '--color-on-accent': onAccent,
    '--color-focus': text,
    '--brand-mark': mark,
    '--brand-stripe': `linear-gradient(90deg, ${stripe})`,
    '--level-1': mix(paper, mark, 0.3),
    '--level-2': mix(paper, mark, 0.55),
    '--level-3': mix(paper, mark, 0.8),
    // Series of the career band: the mark, muted text and a darker (or lighter) mark; all at
    // least 3:1 on the paper.
    '--data-1': mark,
    '--data-2': muted,
    '--data-3': passes(mix(mark, ink, 0.5), [paper], MIN_CONTRAST.mark) ? mix(mark, ink, 0.5) : ink,
    '--shadow-raise': 'none',
    '--shadow-pop': 'none',
  };
  marks.forEach((c, i) => {
    tokens[`--mark-${i + 1}`] = c;
  });
  return { tokens, scheme: tokens['color-scheme'], marks, errors };
}

// Declarations for the `style` attribute of <html>: they override the Granat colour tokens of
// every theme scope (light, dark, forced, sheet) on this page only.
export function brandStyle(tokens) {
  return Object.entries(tokens)
    .map(([name, value]) => `${name}: ${value}`)
    .join('; ');
}
