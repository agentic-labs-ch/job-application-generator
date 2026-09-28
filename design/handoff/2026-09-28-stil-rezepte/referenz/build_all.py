"""Build the reference pages of the style recipes with sample data (Alex Muster) and apply the
application's brand colours. Run from the scratchpad: python3 fpub/build_all.py [recipe ...]"""
import json, subprocess, sys, pathlib, re

ROOT = pathlib.Path(__file__).parent


def lum(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= .03928 else ((x + .055) / 1.055) ** 2.4 for x in c]
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]


def cr(a, b):
    a, b = lum(a), lum(b)
    return (max(a, b) + .05) / (min(a, b) + .05)


def mix(a, b, t):
    a, b = a.lstrip('#'), b.lstrip('#')
    return '#' + ''.join(f"{round(int(a[i:i+2],16)*(1-t)+int(b[i:i+2],16)*t):02x}" for i in (0, 2, 4))


def on(fill):
    return '#000000' if cr('#000000', fill) >= cr('#ffffff', fill) else '#ffffff'


def text_accent(acc, grounds, ink):
    t = 0
    c = acc
    while any(cr(c, g) < 4.5 for g in grounds) and t < 1:
        t += .05
        c = mix(acc, ink, t)
    return c


PATCH = {
    'finanz-oeffentlich': lambda b: [('--red:#0b5d6b', f"--red:{b['accent']}")],
    'beratung-sales': lambda b: [
        ('--acc:#ff9f1c;--acc-t:#c26bff', f"--acc:{b['accent']};--acc-t:{text_accent(b['accent'], ['#000000', '#0d0d0d'], '#ffffff')}"),
        ('.btn-primary{background:var(--acc);border-color:var(--acc);color:#fff}', f".btn-primary{{background:var(--acc);border-color:var(--acc);color:{on(b['accent'])}}}"),
        ('background:var(--acc);color:#fff;', f"background:var(--acc);color:{on(b['accent'])};"),
    ],
    'tech-produkt': lambda b: [
        ('--accent:#3b4bc8; --accent-dk:#005a9e;', f"--accent:{b['accent']}; --accent-dk:{mix(b['accent'], '#000000', .12)};"),
        ('--tint:#eff6fc', f"--tint:{mix(b['accent'], '#ffffff', .92)}"),
    ],
    'technische-daten': lambda b: [('--blue:#0078d6', f"--blue:{b['accent']}")],
}

BRAND_DEFAULT = {'technische-daten': {'paper': '#000000', 'ink': '#ffffff', 'accent': '#5b8def'}}

for key in (sys.argv[1:] or PATCH):
    data = ROOT / 'data' / f'{key}.json'
    d = json.loads(data.read_text())
    if not d.get('brand'):
        d['brand'] = BRAND_DEFAULT[key]
        data.write_text(json.dumps(d, ensure_ascii=False, indent=1))
    subprocess.run([sys.executable, str(ROOT / key / 'build.py')], check=True, cwd=ROOT.parent)
    out = ROOT / key / 'index.html'
    html = out.read_text()
    for old, new in PATCH[key](d['brand']):
        if old not in html:
            sys.exit(f'{key}: pattern not found: {old}')
        html = html.replace(old, new)
    out.write_text(html)
    print(key, 'ok', len(html))
