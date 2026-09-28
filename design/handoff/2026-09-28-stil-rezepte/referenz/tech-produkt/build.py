#!/usr/bin/env python3
"""Build fpub/tech-produkt/index.html from fpub/data/tech-produkt.json.

Concept "Product dashboard": bento tiles, figures and charts first.
All content comes from the JSON; this script only arranges it.
"""
import base64, datetime, html, io, json, pathlib, re

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
D = json.loads((ROOT / "data" / "tech-produkt.json").read_text())
RAW = (ROOT / "data" / "tech-produkt.json").read_text()

e = lambda s: html.escape(str(s), quote=True)

# ---------------------------------------------------------------- assets
FONT = base64.b64encode((ROOT / "fonts" / "instrument-sans-latin-400-normal.woff2").read_bytes()).decode()

def portrait_uri():
    from PIL import Image
    im = Image.open(ROOT / D["photo"]).convert("RGB")
    if im.width > 600:
        im = im.resize((600, round(im.height * 600 / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=82, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

# ---------------------------------------------------------------- helpers
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

def ym(s):
    y, m = s.split("-")[:2]
    return int(y), int(m)

def fmt_ym(s):
    y, m = ym(s)
    return f"{MONTHS[m-1]} {y}"

def span(a, b):
    return f"{fmt_ym(a)} – {fmt_ym(b)}"

def yfrac(s, end=False):
    y, m = ym(s)
    return y + (m - (0 if end else 1)) / 12

LEVELS = {1: "Basic", 2: "Some experience", 3: "Experienced", 4: "Specialist"}
MARKS = D["brand"]["marks"]  # red, green, blue, yellow (decor + category key only)
CAT_COLOR = {
    "skills-cloud": MARKS[2],
    "skills-data-ai": MARKS[1],
    "skills-architecture": MARKS[0],
    "skills-soft": MARKS[3],
    "skills-methods": "#737373",
}
ORG = {x["id"]: x["organization"] for x in D["experience"]}
ORG.update({x["id"]: x["institution"] for x in D["education"]})

def short(oid):
    m = re.search(r"\(([A-Z]{2,})\)", ORG[oid])
    return m.group(1) if m else ORG[oid]

def nbh(t):
    """Keep short compounds like C-level on one line (non-breaking hyphen, same text)."""
    return re.sub(r"\b(\w-\w+)", r'<span class="nw">\1</span>', e(t))

def must(phrase):
    """Key figures may only use numbers that stand verbatim in the JSON."""
    assert phrase in RAW, f"figure source not found in JSON: {phrase!r}"
    return phrase

# ---------------------------------------------------------------- key figures
KPIS = [
    # (display, count-to, prefix/suffix format, label, source org id, verbatim JSON phrase)
    ("1,000+", 1000, "+", "Servers migrated to Azure, worldwide", "globex", must("1,000+ servers")),
    ("50+", 50, "+", "Countries in the same migration", "globex", must("50+ countries")),
    ("12", 12, "", "People in the project team I led", "globex", must("team of up to 12")),
    ("6+", 6, "+", "Years in IT consulting and architecture", None, must("over six years in IT consulting and enterprise architecture")),
]

def kpi_html():
    out = []
    for i, (disp, n, suf, label, src, _) in enumerate(KPIS):
        pre = "Up to " if disp == "12" else ""
        srcline = f"{e(ORG[src])}" if src else "Profile"
        out.append(f'''
<article class="tile kpi c3 t3 m1" aria-label="{e(pre + disp)} {e(label)}">
  <span class="sq" style="background:{MARKS[i]}" aria-hidden="true"></span>
  <p class="kpi-n"><span class="sr">{e(pre + disp)}</span><span aria-hidden="true" class="cnt" data-to="{n}" data-suf="{suf}">{e(disp)}</span></p>
  <p class="kpi-l">{e(label)}</p>
  <p class="kpi-s">{srcline}</p>
</article>''')
    return "".join(out)

# ---------------------------------------------------------------- strengths
def strengths_html():
    out = []
    for i, s in enumerate(D["strengths"][:3]):
        ev = " ".join(
            f'<a class="ev" href="#exp-{e(r)}">{e(short(r))}</a>' for r in s.get("evidence", []) if r in ORG
        )
        out.append(f'''
<article class="tile strength c4 t6 m2">
  <span class="topbar" style="background:{MARKS[i]}" aria-hidden="true"></span>
  <h3>{nbh(s["title"])}</h3>
  <p>{e(s["text"])}</p>
  <p class="evline"><span class="meta">Evidence</span><span class="evlinks">{ev}</span></p>
</article>''')
    return "".join(out)

# ---------------------------------------------------------------- skills
def seg_bar(level, row):
    segs = []
    for k in range(4):
        on = k < level
        d = min(row * 30 + k * 30, 450)
        segs.append(f'<span class="seg{" on" if on else ""}" style="--d:{d}ms"></span>')
    return f'<span class="bar" aria-hidden="true">{"".join(segs)}</span>'

def skills_html():
    total = sum(len(g["items"]) for g in D["skills"])
    pills = [f'<button type="button" class="pill f" data-f="all" aria-pressed="true">All <span class="cnt-s">{total}</span></button>']
    groups = []
    for g in D["skills"]:
        col = CAT_COLOR.get(g["id"], "#737373")
        pills.append(
            f'<button type="button" class="pill f" data-f="{e(g["id"])}" aria-pressed="false">'
            f'<span class="sq s" style="background:{col}" aria-hidden="true"></span>{e(g["name"])} '
            f'<span class="cnt-s">{len(g["items"])}</span></button>'
        )
        items = sorted(g["items"], key=lambda x: -x["level"])  # stable: JSON order within a level
        rows = []
        for r, it in enumerate(items):
            lv = it["level"]
            rows.append(f'''
      <li class="srow">
        <span class="sname">{e(it["name"])}</span>
        <span class="sval">{seg_bar(lv, r)}<span class="lvl">{e(LEVELS[lv])}</span></span>
      </li>''')
        groups.append(f'''
    <section class="sgroup" data-g="{e(g["id"])}" aria-label="{e(g["name"])}">
      <h3 class="ghead"><span class="sq" style="background:{col}" aria-hidden="true"></span>{e(g["name"])}</h3>
      <ul class="slist">{"".join(rows)}
      </ul>
    </section>''')
    know = ""
    if D.get("knowledge"):
        blocks = []
        for i, k in enumerate(D["knowledge"]):
            chips = "".join(f'<li class="chip">{e(x)}</li>' for x in k["items"])
            blocks.append(f'<div class="kgroup"><h4>{e(k["name"])}</h4><ul class="chips">{chips}</ul></div>')
        know = f'''
  <aside class="focus" aria-labelledby="focus-h">
    <h3 id="focus-h">Focus for this role</h3>
    {"".join(blocks)}
  </aside>'''
    legend = " · ".join(f'<span class="nw">{n} {e(LEVELS[n])}</span>' for n in (4, 3, 2, 1))
    return f'''
<section class="tile skills c12 t6 m2" id="skills" aria-labelledby="skills-h">
  <div class="tile-head"><h2 id="skills-h">Skills</h2><p class="meta">{total} skills in {len(D["skills"])} categories, each rated from 1 to 4</p></div>
  <div class="skills-body">
    <div class="skills-main">
      <div class="filters" role="group" aria-label="Filter skills by category">{"".join(pills)}</div>
      <div class="sgroups" aria-live="polite">{"".join(groups)}
      </div>
      <p class="legend meta">Scale: {legend}</p>
    </div>{know}
  </div>
</section>'''

# ---------------------------------------------------------------- timeline
Y0, Y1 = 2009, 2027  # axis covers 2009 up to the end of 2026

def pct(v):
    return round((v - Y0) / (Y1 - Y0) * 100, 3)

def gantt_html():
    rows = []
    def row(kind, key, href, label, sub, a, b, i):
        x0, x1 = pct(yfrac(a)), pct(yfrac(b, end=True))
        return f'''
    <a class="g-row {kind}" href="{href}">
      <span class="g-label"><span class="g-org">{e(label)}</span><span class="g-date">{e(sub)}</span></span>
      <span class="g-track"><span class="g-bar" style="left:{x0}%;width:{round(x1-x0,3)}%;--d:{min(i*40,400)}ms"></span></span>
    </a>'''
    i = 0
    rows.append('<p class="g-group"><span>Work</span></p>')
    for x in D["experience"]:
        rows.append(row("w", x["id"], f'#exp-{x["id"]}', x["organization"], span(x["start"], x["end"]), x["start"], x["end"], i)); i += 1
    rows.append('<p class="g-group"><span>Education</span></p>')
    for x in D["education"]:
        rows.append(row("ed", x["id"], "#education", x["institution"], x["location"] + " · " + span(x["start"], x["end"]), x["start"], x["end"], i)); i += 1
    ticks = []
    for y in range(Y0, Y1):
        cls = "tk" + (" l3" if (y - Y0) % 3 == 0 else "") + (" l2" if (y - Y0) % 2 == 0 else "")
        ticks.append(f'<span class="{cls}" style="left:{pct(y)}%"><span class="tk-l">{y}</span></span>')
    return f'''
  <div class="gantt">
    <div class="g-axis" aria-hidden="true">{"".join(ticks)}</div>
    <div class="g-rows">{"".join(rows)}
    </div>
  </div>
  <p class="g-key meta"><span class="key w" aria-hidden="true"></span>Work <span class="key ed" aria-hidden="true"></span>Education <span class="g-hint">Select a row to open its details.</span></p>'''

def stations_html():
    out = []
    for n, x in enumerate(D["experience"]):
        compact = x.get("compact")
        body = []
        if x.get("summary") and not compact:
            body.append(f'<p class="st-sum">{e(x["summary"])}</p>')
        right = []
        if x.get("projects"):
            ps = "".join(
                f'<li><span class="meta">{e(span(p["start"], p["end"]))}</span>{e(p["description"])}</li>' for p in x["projects"]
            )
            right.append(f'<h4>Projects</h4><ul class="plist">{ps}</ul>')
        if x.get("highlights"):
            hs = "".join(f"<li>{e(h)}</li>" for h in x["highlights"])
            right.append(f'<h4>Highlights</h4><ul class="hlist">{hs}</ul>')
        body.append(f'<div class="st-hl">{"".join(right)}</div>')
        out.append(f'''
  <details class="st{" compact" if compact else ""}" id="exp-{e(x["id"])}"{" open" if n == 0 else ""}>
    <summary>
      <span class="st-role">{e(x["role"])}</span>
      <span class="st-meta">{e(x["organization"])} · {e(x["location"])}<br><span class="nw">{e(span(x["start"], x["end"]))}</span></span>
      <span class="pm" aria-hidden="true"></span>
    </summary>
    <div class="st-body">{"".join(body)}</div>
  </details>''')
    return "".join(out)

# ---------------------------------------------------------------- row 6
def education_html():
    items = []
    for x in D["education"]:
        s = f'<p class="ed-sum">{e(x["summary"])}</p>' if x.get("summary") else ""
        items.append(f'''
    <li>
      <p class="ed-deg">{e(x["degree"])}</p>
      <p class="meta">{e(x["institution"])} · {e(x["location"])}<br>{e(span(x["start"], x["end"]))}</p>
      {s}
    </li>''')
    return f'''
<section class="tile c5 t6 m2" id="education" aria-labelledby="edu-h">
  <div class="tile-head"><h2 id="edu-h">Education</h2></div>
  <ul class="edlist">{"".join(items)}
  </ul>
</section>'''

def languages_html():
    items = []
    for x in D["languages"]:
        d = f'<p class="meta">{e(x["detail"])}</p>' if x.get("detail") else ""
        items.append(f'<li><p class="lg"><span>{e(x["name"])}</span><span class="lv">{e(x["level"])}</span></p>{d}</li>')
    return f'''
<section class="tile c4 t3 m2" aria-labelledby="lang-h">
  <div class="tile-head"><h2 id="lang-h">Languages</h2></div>
  <ul class="langs">{"".join(items)}</ul>
</section>'''

def contact_html():
    return f'''
<section class="tile c3 t3 m2 stack" aria-labelledby="int-h">
  <div class="tile-head"><h2 id="int-h">Interests</h2></div>
  <p class="interests">{e(D["interests"])}</p>
  <div class="tile-head sub"><h2 id="contact-h">Contact</h2></div>
  <ul class="contact">
    <li class="meta">{e(D["location"])}</li>
    <li><a class="lnk" href="mailto:{e(D["email"])}">{e(D["email"])}</a></li>
    <li><a class="lnk" href="{e(D["linkedin"])}" rel="noopener">LinkedIn profile</a></li>
  </ul>
</section>'''

# ---------------------------------------------------------------- letter
def letter_html():
    L = D["letter"]
    y, m, dd = L["date"].split("-")
    date = f"{int(dd)} {datetime.date(2000, int(m), 1).strftime('%B')} {y}"
    paras = []
    for part in ("attention", "interest", "desire", "action"):
        for p in L.get(part, []):
            if isinstance(p, dict) and p.get("points"):
                lis = "".join(
                    f'<li><span class="lsq" style="background:{MARKS[i % 4]}" aria-hidden="true"></span>{e(t)}</li>'
                    for i, t in enumerate(p["points"])
                )
                paras.append(f'<ul class="points">{lis}</ul>')
            elif isinstance(p, str):
                paras.append(f"<p>{e(p)}</p>")
    rec = "<br>".join(e(r) for r in L["recipient"])
    stripe = "".join(f'<span style="background:{c}"></span>' for c in MARKS)
    return f'''
<section class="tile letter c12 t6 m2" id="letter" aria-labelledby="letter-h">
  <div class="stripe" aria-hidden="true">{stripe}</div>
  <div class="letter-in">
    <h2 id="letter-h">{e(L["subject"])}</h2>
    <div class="l-meta">
      <p class="meta">{rec}</p>
      <p class="meta">{e(L["place"])}, {e(date)}</p>
    </div>
    <div class="l-body">
      <p>{e(L["salutation"])},</p>
      {"".join(paras)}
      <p class="l-close">{e(L["closing"])}<br>{e(D["name"])}</p>
      <p class="meta">Enclosures: {e(L["enclosures"])}</p>
    </div>
  </div>
</section>'''

# ---------------------------------------------------------------- page
def page():
    J = D["job"]
    note = " · ".join(x for x in ["Application", J["title"], J["company"], ("Ref. " + J["reference"]) if J.get("reference") else None] if x)
    photo = portrait_uri()
    css = (HERE / "style.css").read_text() if False else CSS
    return f'''<!doctype html>
<html lang="{e(D["lang"])}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(D["name"])} · {e(J["title"])} · {e(J["company"])}</title>
<meta name="description" content="{e(D["claim"])}">
<script>document.documentElement.classList.add('js')</script>
<style>
@font-face{{font-family:"Instrument Sans";src:url(data:font/woff2;base64,{FONT}) format("woff2");font-weight:400;font-style:normal;font-display:swap}}
{css}
</style>
</head>
<body>
<header class="top wrap">
  <p class="note">{e(note)}</p>
  <nav class="actions" aria-label="Documents and contact">
    <a class="pill" href="#" data-print>PDF</a>
    <a class="pill" href="mailto:{e(D["email"])}">Email</a>
    <a class="pill" href="{e(D["linkedin"])}" rel="noopener">LinkedIn</a>
  </nav>
</header>
<main class="grid wrap">
  <section class="tile hero c8 t4 m2" aria-labelledby="name">
    <div class="hero-head"><span class="sq" style="background:{MARKS[2]}" aria-hidden="true"></span><p>{e(J["title"])} · <span class="nw">{e(J["company"])} · {e(J["location"])}</span></p></div>
    <div class="hero-main">
      <h1 id="name">{e(D["name"])}</h1>
      <p class="headline">{e(D["headline"])}</p>
      <p class="claim">{e(D["claim"])}</p>
      <p class="profile">{e(D["profile"])}</p>
      <p class="cta"><a class="btn primary" href="#letter">Read the cover letter</a><a class="btn" href="#experience">See experience</a></p>
    </div>
  </section>
  <figure class="tile portrait c4 t2 m2">
    <img src="{photo}" alt="Portrait of {e(D["name"])}" width="480" height="600">
  </figure>
  <h2 class="sr">Key figures</h2>
  {kpi_html()}
  <h2 class="sr">Strengths</h2>
  {strengths_html()}
  {skills_html()}
  <section class="tile exp c12 t6 m2" id="experience" aria-labelledby="exp-h">
    <div class="tile-head"><h2 id="exp-h">Experience</h2><p class="meta">{Y0}–{Y1-1}, {len(D["experience"])} positions, {len(D["education"])} qualifications</p></div>
    {gantt_html()}
    <div class="stations">{stations_html()}
    </div>
  </section>
  {education_html()}
  {languages_html()}
  {contact_html()}
  {letter_html()}
</main>
<footer class="foot wrap"><p class="meta">{e(D["name"])} · {e(D["location"])}</p></footer>
<script>{JS}</script>
</body>
</html>
'''

CSS = r"""
:root{
  --bg:#f3f3f3; --tile:#ffffff; --line:#e1e1e1; --ink:#242424; --meta:#5f5f5f;
  --accent:#3b4bc8; --accent-dk:#005a9e; --ctl:#8a8a8a; --tint:#eff6fc;
  --gap:12px; --pad:20px; --r:8px;
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth;scroll-padding-top:16px}
body{margin:0;background:var(--bg);color:var(--ink);font:400 17px/1.55 "Instrument Sans",ui-sans-serif,system-ui,sans-serif;font-synthesis:none;overflow-wrap:break-word}
h1,h2,h3,h4,p,ul,figure{margin:0}
h1,h2,h3,h4{font-weight:400}
ul{padding:0;list-style:none}
button,input{font:inherit;color:inherit}
a{color:var(--accent);text-underline-offset:3px;text-decoration-thickness:1px}
a:hover{text-decoration-thickness:2px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}
.sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;margin:-1px;padding:0;border:0}
.meta{color:var(--meta);font-size:16px}
.wrap{max-width:1232px;margin-inline:auto;padding-inline:16px}

/* ---------- header note ---------- */
.top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;padding-top:12px;padding-bottom:12px}
.note{font-size:16px;color:var(--meta);flex:1 1 20rem}
.actions{display:flex;gap:8px;flex-wrap:wrap}
.pill{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border:1px solid var(--ctl);border-radius:999px;background:var(--tile);color:var(--ink);text-decoration:none;font-size:16px;line-height:1.2;cursor:pointer}
a.pill:hover,.pill:hover{border-color:var(--ink);text-decoration:none}

/* ---------- grid ---------- */
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--gap);padding-bottom:16px}
.tile{position:relative;background:var(--tile);border:1px solid var(--line);border-radius:var(--r);padding:var(--pad);min-width:0}
.m1{grid-column:span 1}.m2{grid-column:span 2}
@media (min-width:768px){
  :root{--gap:16px;--pad:24px}
  .grid{grid-template-columns:repeat(6,minmax(0,1fr))}
  .t2{grid-column:span 2}.t3{grid-column:span 3}.t4{grid-column:span 4}.t6{grid-column:span 6}
}
@media (min-width:1024px){
  :root{--pad:28px}
  .grid{grid-template-columns:repeat(12,minmax(0,1fr))}
  .c3{grid-column:span 3}.c4{grid-column:span 4}.c5{grid-column:span 5}.c8{grid-column:span 8}.c12{grid-column:span 12}
}
@media (hover:hover) and (prefers-reduced-motion:no-preference){
  .tile{transition:transform .2s ease-out}
  .tile:hover{transform:translateY(-2px)}
}
.tile-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 16px;padding-bottom:16px;margin-bottom:20px;border-bottom:1px solid var(--line)}
.tile-head h2{font-size:22px;line-height:1.25}
.sq{display:inline-block;width:10px;height:10px;flex:none}

/* ---------- hero ---------- */
.hero{display:flex;flex-direction:column;gap:20px}
.hero-head{display:flex;align-items:center;gap:10px;padding-bottom:14px;border-bottom:1px solid var(--line)}
.hero-head p{font-size:16px;color:var(--meta)}
.hero-main{display:flex;flex-direction:column;gap:14px}
h1{font-size:clamp(40px,7vw,60px);line-height:1.02;letter-spacing:-.02em}
.headline{font-size:20px;line-height:1.35;color:var(--accent)}
.claim{font-size:20px;line-height:1.4;max-width:36rem}
.profile{font-size:17px;color:var(--meta);max-width:42rem}
.cta{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.btn{display:inline-flex;align-items:center;min-height:44px;padding:0 20px;border-radius:4px;border:1px solid var(--accent);color:var(--accent);text-decoration:none;font-size:17px}
.btn.primary{background:var(--accent);color:#fff}
.btn:hover{text-decoration:underline}
.btn.primary:hover{background:var(--accent-dk);border-color:var(--accent-dk)}
.portrait{padding:0;overflow:hidden;aspect-ratio:1/1}
.portrait img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 12%}
@media (min-width:768px){.portrait{aspect-ratio:auto;min-height:100%}}

/* ---------- key figures ---------- */
.kpi{display:flex;flex-direction:column;gap:6px;padding-top:18px}
.kpi .sq{margin-bottom:10px}
.kpi-n{font-size:clamp(34px,9vw,56px);line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.kpi-l{font-size:16px;line-height:1.4;margin-top:6px}
.kpi-s{font-size:16px;color:var(--meta);margin-top:auto;padding-top:8px}
@media (max-width:767px){.kpi{padding:16px}}
@media (min-width:1024px){.kpi-n{font-size:56px}.kpi-l{font-size:17px}}

/* ---------- strengths ---------- */
.strength{display:flex;flex-direction:column;gap:12px;padding-top:calc(var(--pad) + 4px);overflow:hidden}
.topbar{position:absolute;left:0;right:0;top:0;height:4px}
.nw{white-space:nowrap}
.strength h3{text-wrap:balance;font-size:20px;line-height:1.3}
.strength p{font-size:17px}
.evline{margin-top:auto;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:start;column-gap:16px;padding-top:4px;border-top:1px solid var(--line)}
.evline>.meta{line-height:44px}
.evlinks{display:flex;flex-wrap:wrap;column-gap:16px}
.evline .meta{margin-right:4px}
.ev{display:inline-flex;align-items:center;justify-content:center;min-height:44px;min-width:44px;font-size:16px}
.strength .evline{font-size:16px}

/* ---------- skills ---------- */
.skills-body{display:grid;gap:28px}
@media (min-width:1024px){.skills-body{grid-template-columns:minmax(0,1fr) 300px;gap:40px}}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.f .cnt-s{color:var(--meta)}
.f[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#fff}
.f[aria-pressed="true"] .cnt-s{color:#fff}
.f .sq.s{width:10px;height:10px}
.sgroups{display:grid;gap:24px;transition:opacity .15s ease-out}
.sgroups.swap{opacity:0}
.ghead{display:flex;align-items:center;gap:10px;font-size:18px;padding-bottom:8px}
.slist{border-top:1px solid var(--line)}
.srow{display:grid;grid-template-columns:minmax(0,1fr);gap:6px;padding:10px 0;border-bottom:1px solid var(--line)}
.sname{font-size:17px;line-height:1.35}
.sval{display:flex;align-items:center;gap:12px}
.bar{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;width:132px;flex:none;height:12px}
.seg{background:var(--line);display:block}
.seg.on{background:var(--accent);transform-origin:left center}
.lvl{font-size:16px;color:var(--meta)}
@media (min-width:600px){
  .srow{grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:16px;padding:9px 0;min-height:48px}
  .sval{width:292px}
  .bar{width:148px}
}
.legend{margin-top:16px}
.focus{border-top:1px solid var(--line);padding-top:20px;display:flex;flex-direction:column;gap:18px}
@media (min-width:1024px){.focus{border-top:0;border-left:1px solid var(--line);padding:4px 0 0 28px}}
.focus h3{font-size:18px}
.kgroup h4{font-size:17px;margin-bottom:8px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{font-size:16px;line-height:1.3;padding:5px 10px;border-radius:4px;background:var(--tint);color:var(--ink)}
html.js .srow .seg.on{transform:scaleX(0)}
html.js .srow.in .seg.on{transform:scaleX(1);transition:transform .4s cubic-bezier(.2,.7,.2,1) var(--d)}

/* ---------- experience ---------- */
.gantt{position:relative;--lab:0px;margin-bottom:8px}
.g-axis{position:absolute;top:0;bottom:0;left:var(--lab);right:0;pointer-events:none}
.tk{position:absolute;top:0;bottom:0;border-left:1px solid var(--line)}
.tk-l{position:absolute;top:0;left:6px;font-size:16px;color:var(--meta);line-height:1;display:none}
.tk.l3 .tk-l{display:block}
.g-rows{position:relative;padding-top:30px}
.g-group{font-size:16px;color:var(--meta);padding:10px 0 4px;position:relative}
.g-group span{background:var(--tile);padding-right:8px}
.g-row{display:grid;grid-template-columns:minmax(0,1fr);gap:4px;min-height:44px;padding:6px 0;color:var(--ink);text-decoration:none;position:relative;border-radius:4px}
.g-label{display:flex;flex-wrap:wrap;column-gap:10px;font-size:16px;line-height:1.3;background:var(--tile)}
.g-row .g-label{justify-self:start;padding-right:8px}
.g-date{color:var(--meta)}
.g-track{position:relative;height:18px}
.g-bar{position:absolute;top:0;bottom:0;border-radius:3px;background:var(--accent);transform-origin:left center;min-width:6px}
.ed .g-bar{background:var(--meta)}
.g-row:hover .g-org{text-decoration:underline;text-underline-offset:3px}
.g-row:hover .g-bar{background:var(--accent-dk)}
.ed.g-row:hover .g-bar{background:var(--ink)}
html.js .g-bar{transform:scaleX(0)}
html.js .gantt.in .g-bar{transform:scaleX(1);transition:transform .5s cubic-bezier(.2,.7,.2,1) var(--d)}
.g-key{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin:12px 0 24px}
.key{display:inline-block;width:18px;height:10px;border-radius:2px;background:var(--accent)}
.key.ed{background:var(--meta);margin-left:12px}
.g-hint{flex-basis:100%}
@media (min-width:768px){.g-hint{flex-basis:auto;margin-left:12px}}
@media (max-width:767px){.tk{bottom:auto;height:26px}.tk:not(.l3){display:none}.g-track{background:var(--bg);border-radius:3px}.g-label{flex-direction:column}}
@media (min-width:768px){
  .gantt{--lab:250px}
  .g-row{grid-template-columns:var(--lab) minmax(0,1fr);align-items:center;gap:0;min-height:52px}
  .g-label{flex-direction:column;padding-right:16px}
  .g-track{height:20px}
}
@media (min-width:1024px){
  .gantt{--lab:300px}
  .tk.l3:not(.l2) .tk-l{display:none}
  .tk.l2 .tk-l{display:block}
  .tk-l{left:5px}
}
.stations{border-top:1px solid var(--line)}
.st{border-bottom:1px solid var(--line)}
.st summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:minmax(0,1fr) 44px;column-gap:12px;align-items:center;min-height:44px;padding:14px 0}
.st summary::-webkit-details-marker{display:none}
.st-role{font-size:19px;line-height:1.3;grid-column:1}
.st-meta{font-size:16px;color:var(--meta);grid-column:1}
.pm{grid-column:2;grid-row:1/span 2;justify-self:end;width:36px;height:36px;border:1px solid var(--ctl);border-radius:50%;position:relative}
.pm::before,.pm::after{content:"";position:absolute;left:50%;top:50%;width:14px;height:2px;background:var(--ink);transform:translate(-50%,-50%)}
.pm::after{transform:translate(-50%,-50%) rotate(90deg);transition:transform .2s ease-out}
.st[open] .pm::after{transform:translate(-50%,-50%) rotate(0deg)}
.st summary:hover .st-role{color:var(--accent)}
.st-body{display:grid;gap:16px;padding:0 0 22px}
.st-sum{font-size:17px;max-width:40rem}
.st-hl h4{font-size:16px;color:var(--meta);margin-bottom:6px}
.st-hl h4:not(:first-child){margin-top:14px}
.hlist li,.plist li{position:relative;padding-left:20px;font-size:17px;max-width:44rem}
.hlist li+li,.plist li+li{margin-top:6px}
.hlist li::before,.plist li::before{content:"";position:absolute;left:2px;top:.62em;width:6px;height:6px;background:var(--accent)}
.plist .meta{display:block}
@media (min-width:1024px){
  .st-body{grid-template-columns:minmax(0,4fr) minmax(0,7fr);gap:40px}
  .st.compact .st-body,.st:not(:has(.st-sum)) .st-body{grid-template-columns:minmax(0,1fr)}
  .st summary{grid-template-columns:minmax(0,4fr) minmax(0,7fr) 44px;column-gap:40px}
  .st-meta{grid-column:2;grid-row:1}
  .pm{grid-column:3;grid-row:1}
}

/* ---------- row 6 ---------- */
.edlist li+li{margin-top:18px;padding-top:18px;border-top:1px solid var(--line)}
.ed-deg{font-size:18px;line-height:1.35;margin-bottom:4px}
.ed-sum{font-size:16px;margin-top:6px}
.langs li+li{margin-top:12px;padding-top:12px;border-top:1px solid var(--line)}
.lg{display:flex;justify-content:space-between;gap:12px;align-items:baseline;font-size:17px}
.lv{font-size:16px;color:var(--accent);background:var(--tint);padding:1px 8px;border-radius:4px;flex:none}
.interests{font-size:17px}
.tile-head.sub{margin-top:24px}
.contact li+li{margin-top:0}
.contact .meta{margin-bottom:4px}
.lnk{display:inline-flex;align-items:center;min-height:44px;font-size:16px;word-break:break-all}

/* ---------- letter ---------- */
.letter{padding:0;overflow:hidden}
.stripe{display:grid;grid-template-columns:repeat(4,1fr);height:4px}
.letter-in{padding:calc(var(--pad) + 8px) var(--pad) calc(var(--pad) + 8px)}
@media (min-width:1024px){.letter-in{padding:48px 56px 56px}}
.letter h2{text-wrap:balance;font-size:22px;line-height:1.35;max-width:42rem;margin-bottom:20px}
.l-meta{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 32px;max-width:42rem;padding-bottom:20px;margin-bottom:24px;border-bottom:1px solid var(--line)}
.l-body{max-width:42rem;display:flex;flex-direction:column;gap:16px;font-size:17px;line-height:1.65}
.points{display:flex;flex-direction:column;gap:12px}
.points li{position:relative;padding-left:24px}
.lsq{position:absolute;left:0;top:.55em;width:10px;height:10px}
.l-close{margin-top:8px}
.foot{padding-bottom:32px}

/* ---------- motion off ---------- */
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{transition:none!important;animation:none!important}
  html.js .srow .seg.on,html.js .g-bar{transform:none!important}
}

/* ---------- print ---------- */
@media print{
  @page{margin:16mm}
  :root{--bg:#fff;--ink:#000;--meta:#000;--accent:#000;--tint:#fff;--line:#999}
  body{background:#fff;color:#000;font-size:11pt}
  .actions,.cta,.filters,.pm,.g-key,.portrait,.sq,.topbar,.stripe,.lsq{display:none!important}
  .grid{display:block}
  .tile{border:0;border-radius:0;padding:0;margin:0 0 14pt;transform:none!important;break-inside:auto}
  .kpi{display:block;border-bottom:1px solid #999;padding-bottom:6pt}
  .kpi-n{font-size:20pt}
  html.js .srow .seg.on,html.js .g-bar{transform:none!important}
  .seg.on{background:#000!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}
  .g-bar{background:#000!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}
  .sgroup[hidden]{display:block!important}
  details.st > .st-body{display:grid!important}
  .skills-body,.st-body,.st summary{grid-template-columns:1fr!important}
  a{color:#000}
  .letter{break-before:page}
  .letter-in{padding:0}
}
"""

JS = r"""
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
    es.forEach(function(en){ if(en.isIntersecting){ show(en.target); io.unobserve(en.target); } });
  }, {rootMargin:'0px 0px -8% 0px'}) : null;
  function watch(el){ if(io && !reduce) io.observe(el); else show(el); }
  function show(el){
    el.classList.add('in');
    if(el.classList.contains('kpi')) count(el);
  }
  // (2) key figures count up; the end value is already in the HTML
  function count(tile){
    var n = tile.querySelector('.cnt'); if(!n || reduce) return;
    var to = +n.dataset.to, suf = n.dataset.suf || '', t0 = null, dur = 600, fin = n.textContent;
    function fmt(v){ return v.toLocaleString('en-US'); }
    function step(t){
      if(t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - p, 3);
      n.textContent = fmt(Math.round(to * ease)) + suf;
      if(p < 1) requestAnimationFrame(step); else n.textContent = fin;
    }
    n.textContent = '0' + suf;
    requestAnimationFrame(step);
  }
  document.querySelectorAll('.srow, .gantt, .kpi').forEach(watch);

  // skill filter
  var btns = document.querySelectorAll('.filters .f');
  var groups = document.querySelectorAll('.sgroup');
  var box = document.querySelector('.sgroups');
  function apply(f){
    groups.forEach(function(g){ g.hidden = !(f === 'all' || g.dataset.g === f); });
    groups.forEach(function(g){ if(!g.hidden) g.querySelectorAll('.srow:not(.in)').forEach(watch); });
  }
  btns.forEach(function(b){
    b.addEventListener('click', function(){
      if(b.getAttribute('aria-pressed') === 'true') return;
      btns.forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var f = b.dataset.f;
      if(reduce){ apply(f); return; }
      box.classList.add('swap');
      setTimeout(function(){ apply(f); box.classList.remove('swap'); }, 160);
    });
  });

  // timeline rows and evidence links open the matching station
  function openHash(h){
    if(!h || h.indexOf('#exp-') !== 0) return;
    var d = document.getElementById(h.slice(1)); if(d && d.tagName === 'DETAILS') d.open = true;
  }
  document.addEventListener('click', function(ev){
    var a = ev.target.closest && ev.target.closest('a[href^="#exp-"]'); if(a) openHash(a.getAttribute('href'));
  });
  openHash(location.hash);
  var pdf = document.querySelector('[data-print]');
  if(pdf) pdf.addEventListener('click', function(ev){ ev.preventDefault(); window.print(); });
})();
"""

if __name__ == "__main__":
    out = HERE / "index.html"
    out.write_text(page())
    print(out, round(out.stat().st_size / 1024), "KB")
