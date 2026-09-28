#!/usr/bin/env python3
"""Build fpub/beratung-sales/index.html from fpub/data/beratung-sales.json.

Konzept «Pitch»: die Bewerbung als Beratungs-Präsentation. Jede Sektion ist
eine Folie: eine Aussage, dann der Beleg. Alle Inhalte stammen aus der JSON.
"""
import base64, io, json, pathlib, re, urllib.parse
from html import escape
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
D = json.loads((ROOT / "data" / "beratung-sales.json").read_text(encoding="utf-8"))
RAW = json.dumps(D, ensure_ascii=False)


def e(s):
    return escape(str(s), quote=True)


# ---------- Assets ----------
FONT = base64.b64encode((ROOT / "fonts" / "schibsted-grotesk-latin-400-normal.woff2").read_bytes()).decode()
im = Image.open(ROOT / D["photo"]).convert("RGB")
if im.width > 600:
    im = im.resize((600, round(im.height * 600 / im.width)), Image.LANCZOS)
buf = io.BytesIO()
im.save(buf, "JPEG", quality=82, optimize=True, progressive=True)
PHOTO = base64.b64encode(buf.getvalue()).decode()

# ---------- Helpers ----------
MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
          "September", "Oktober", "November", "Dezember"]
LEVEL = {1: "Grundkenntnisse", 2: "Erste Erfahrung", 3: "Erfahren", 4: "Spezialist"}


def ym(s):
    if not s:
        return "heute"
    y, m = s.split("-")[:2]
    return f"{m}.{y}"


def span(a, b):
    return f"{ym(a)} – {ym(b)}"


def years(a, b):
    ya, yb = a[:4], (b or "")[:4]
    return ya if ya == yb else f"{ya}–{yb}"


def long_date(s):
    y, m, d = s.split("-")
    return f"{int(d)}. {MONTHS[int(m) - 1]} {y}"


EXP = {x["id"]: x for x in D["experience"]}
EDU = {x["id"]: x for x in D["education"]}
job = D["job"]
email = D["email"]
subject = D["letter"]["subject"]
mail_cta = f"mailto:{email}?subject=" + urllib.parse.quote(subject)

# Stations for the evidence matrix, newest first. Master and bachelor form one column.
STATIONS = [
    {"ids": ["bkb"]}, {"ids": ["globex"]}, {"ids": ["initech"]}, {"ids": ["helix"]},
    {"ids": ["example-it-services"]}, {"ids": ["bzb"]}, {"ids": ["beispiel-hochschule-msc", "beispiel-hochschule-bsc"]},
]
for st in STATIONS:
    first = st["ids"][0]
    if first in EXP:
        x = EXP[first]
        st["name"] = x["organization"]
        st["years"] = years(x["start"], x["end"])
    else:
        xs = [EDU[i] for i in st["ids"]]
        st["name"] = xs[0]["institution"]
        st["sub"] = ", ".join(x["degree"].split(" ")[0] for x in xs)
        st["years"] = years(min(x["start"] for x in xs), max(x["end"] for x in xs))


def station_names(refs):
    out = []
    for st in STATIONS:
        if any(r in st["ids"] for r in refs):
            out.append(st["name"])
    return out


def org_name(i):
    return EXP[i]["organization"] if i in EXP else EDU[i]["institution"]


# ---------- Key figures: only literal numbers from the JSON ----------
acc = EXP["globex"]
acc_text = " ".join(acc["highlights"])
FIG = []
for pattern, value, plus, label in [
    (r"über 1000 Servern", 1000, True, "Server in der globalen Cloud-Transformation auf Azure"),
    (r"über 50 Ländern", 50, True, "Länder, über die sich diese Migration erstreckte"),
    (r"bis zu 12 Personen", 12, False, "Personen im Projektteam, maximal, mit Termin- und Budgetverantwortung"),
]:
    assert re.search(pattern, acc_text), pattern  # must stand verbatim in the data
    FIG.append({"value": value, "plus": plus, "label": label,
                "src": acc['organization'], "when": span(acc['start'], acc['end'])})

# ---------- Matrix rows ----------
all_items = []
order = 0
for g in D["skills"]:
    for it in g["items"]:
        all_items.append({**it, "order": order})
        order += 1
with_refs = [x for x in all_items if x["refs"]]
with_refs.sort(key=lambda x: (-len(station_names(x["refs"])), -x["level"], x["order"]))
MAXROWS = 14
rows = with_refs[:MAXROWS]
rest = sorted(with_refs[MAXROWS:] + [x for x in all_items if not x["refs"]], key=lambda x: (-x["level"], x["order"]))

# ---------- HTML parts ----------
TOTAL = 8


def tracker(n, label):
    return (f'<div class="tracker" aria-hidden="false"><span class="tn">{n:02d}</span>'
            f'<span class="tl">{e(label)}</span><span class="tr">/ {TOTAL:02d}</span></div>')


buttons = f'''
<div class="actions">
  <a class="btn btn-primary" href="{e(mail_cta)}">Gespräch vereinbaren</a>
  <a class="btn" href="#">PDF</a>
  <a class="btn" href="mailto:{e(email)}">E-Mail</a>
  <a class="btn" href="{e(D['linkedin'])}" rel="noopener">LinkedIn</a>
</div>'''

hero = f'''
<header class="hero wrap reveal" id="top">
  <div class="slidehead"><span class="target">{e(D['target'])}</span><span class="where">{e(job['company'])} · {e(job['location'])}</span></div>
  <div class="hero-grid">
    <img class="portrait" src="data:image/jpeg;base64,{PHOTO}" alt="Porträt von {e(D['name'])}" width="480" height="600">
    <div class="hero-text">
      <h1>{e(D['name'])}</h1>
      <p class="claim">{e(D['claim'])}</p>
    </div>
    {buttons}
  </div>
</header>'''

fig_html = "".join(f'''
    <div class="fig">
      <p class="num" aria-label="{'über ' if f['plus'] else ''}{f['value']}"><span class="count" data-to="{f['value']}">{f['value']}</span>{'<span class="plus">+</span>' if f['plus'] else ''}</p>
      <span class="rule" aria-hidden="true"></span>
      <p class="figlabel">{e(f['label'])}</p>
      <p class="figsrc">{e(f['src'])}<span class="nw">{e(f['when'])}</span></p>
    </div>''' for f in FIG)

s_figures = f'''
<section class="slide wrap reveal" aria-labelledby="h-fig">
  {tracker(2, 'Kennzahlen')}
  <h2 id="h-fig">Belege in Zahlen</h2>
  <div class="figs" data-counters>{fig_html}
  </div>
</section>'''

cards = "".join(f'''
      <article class="card" role="group" aria-roledescription="Folie" aria-label="{i + 1} von {len(D['strengths'])}">
        <h3>{e(s['title'])}</h3>
        <p>{e(s['text'])}</p>
        <p class="evidence">Belegt bei {e(', '.join(org_name(x) for x in s['evidence']))}</p>
      </article>''' for i, s in enumerate(D["strengths"]))

s_strengths = f'''
<section class="slide wrap reveal" aria-labelledby="h-str">
  {tracker(3, 'Stärken')}
  <h2 id="h-str">Drei Stärken, jede mit Beleg</h2>
  <div class="carousel" data-carousel>
    <div class="track" tabindex="0" aria-label="Stärken, horizontal blätterbar">{cards}
    </div>
    <div class="car-ctrl">
      <p class="car-count" aria-live="polite"><span data-cur>1</span> / {len(D['strengths'])}</p>
      <button type="button" class="btn btn-sq" data-prev aria-label="Vorherige Stärke">Zurück</button>
      <button type="button" class="btn btn-sq" data-next aria-label="Nächste Stärke">Weiter</button>
    </div>
  </div>
</section>'''

s_profile = f'''
<section class="slide wrap reveal" aria-labelledby="h-pro">
  {tracker(4, 'Profil')}
  <h2 id="h-pro" class="statement">{e(D['headline'])}</h2>
  <p class="lead">{e(D['profile'])}</p>
</section>'''

# Matrix
legend = "".join(
    f'<li><span class="ln">{i + 1}</span><span class="lname">{e(st["name"])}'
    f'{" (" + e(st["sub"]) + ")" if st.get("sub") else ""}</span><span class="ly">{e(st["years"])}</span></li>'
    for i, st in enumerate(STATIONS))

head_cells = "".join(
    f'<span class="mh" role="columnheader"><span aria-hidden="true">{i + 1}</span>'
    f'<span class="sr">{e(st["name"])}</span></span>' for i, st in enumerate(STATIONS))

mrows = []
for r_i, it in enumerate(rows):
    names = station_names(it["refs"])
    cells = []
    for c_i, st in enumerate(STATIONS):
        hit = any(r in st["ids"] for r in it["refs"])
        cells.append(
            f'<span class="mc" role="cell" style="--c:{c_i}"><span class="dot{" on" if hit else ""}" aria-hidden="true"></span>'
            f'<span class="sr">{"belegt" if hit else "nicht belegt"}</span></span>')
    mrows.append(
        f'<div class="mr" role="row" style="--r:{r_i}">'
        f'<span class="mname" role="rowheader">{e(it["name"])}<span class="sr">, belegt bei {e(", ".join(names))}</span></span>'
        + "".join(cells) +
        f'<span class="mlevel" role="cell">{LEVEL[it["level"]]}</span></div>')

rest_txt = "".join(f'<li>{e(x["name"])} <span class="lv">{LEVEL[x["level"]]}</span></li>' for x in rest)

s_matrix = f'''
<section class="slide wrap reveal" aria-labelledby="h-mat">
  {tracker(5, 'Kompetenzen')}
  <h2 id="h-mat">Welche Kompetenz ist wo belegt?</h2>
  <div class="mat-intro">
    <ol class="legend" aria-label="Stationen, neueste zuerst">{legend}</ol>
    <p class="key"><span class="dot on" aria-hidden="true"></span>belegt <span class="dot" aria-hidden="true"></span>nicht belegt</p>
  </div>
  <div class="matrix" role="table" aria-label="Belegmatrix: Kompetenzen und Stationen" aria-rowcount="{len(rows) + 1}">
    <div class="mr mhead" role="row">
      <span class="mh mh-name" role="columnheader">Kompetenz</span>{head_cells}<span class="mh mh-level" role="columnheader">Stufe</span>
    </div>
    {''.join(mrows)}
  </div>
  <div class="more"><h3>Weitere Kompetenzen</h3><ul class="more-list">{rest_txt}</ul></div>
</section>'''


# Experience as cases
def case(x, i, detailed):
    parts = [f'<h3>{e(x["organization"])}</h3>',
             f'<p class="role">{e(x["role"])}</p>',
             f'<p class="when">{span(x["start"], x["end"])} · {e(x["location"])}</p>']
    body = []
    if x.get("summary"):
        body.append(f'<p class="summary">{e(x["summary"])}</p>')
    if x.get("projects"):
        body.append('<ul class="projects">' + "".join(
            f'<li><span class="pwhen">{span(p["start"], p["end"])}</span> {e(p["description"])}</li>'
            for p in x["projects"]) + "</ul>")
    if x.get("highlights"):
        body.append('<ul class="hl">' + "".join(f"<li>{e(h)}</li>" for h in x["highlights"]) + "</ul>")
    cls = "case detailed" if detailed else ("case compact" if x.get("compact") else "case older")
    return (f'<article class="{cls}"><div class="case-head">{"".join(parts)}</div>'
            f'<div class="case-body">{"".join(body)}</div></article>')


cases = "".join(case(x, i, i < 2) for i, x in enumerate(D["experience"]))
s_exp = f'''
<section class="slide wrap reveal" aria-labelledby="h-exp">
  {tracker(6, 'Erfahrung')}
  <h2 id="h-exp">Fälle aus Bank, Beratung und Technologie</h2>
  <div class="cases">{cases}</div>
</section>'''

edu_html = "".join(
    f'<li><h4>{e(x["degree"])}</h4><p>{e(x["institution"])}, {e(x["location"])}</p>'
    f'<p class="when">{span(x["start"], x["end"])}</p>'
    + (f'<p class="small">{e(x["summary"])}</p>' if x.get("summary") else "") + "</li>"
    for x in D["education"])
lang_html = "".join(
    f'<li><p><span class="lname2">{e(x["name"])}</span> <span class="llev">{e(x["level"])}</span></p>'
    + (f'<p class="small">{e(x["detail"])}</p>' if x.get("detail") else "") + "</li>"
    for x in D["languages"])

s_edu = f'''
<section class="slide wrap reveal" aria-labelledby="h-edu">
  {tracker(7, 'Ausbildung')}
  <h2 id="h-edu">Ausbildung, Sprachen, Interessen</h2>
  <div class="two">
    <div><h3>Ausbildung</h3><ul class="plain edu">{edu_html}</ul></div>
    <div>
      <h3>Sprachen</h3><ul class="plain langs">{lang_html}</ul>
      <h3 class="h3-gap">Interessen</h3><p class="small">{e(D['interests'])}</p>
    </div>
  </div>
</section>'''

# Letter
L = D["letter"]


def paras(xs):
    out = []
    for x in xs:
        if isinstance(x, str):
            out.append(f"<p>{e(x)}</p>")
        elif isinstance(x, dict) and "points" in x:
            lis = []
            for n, p in enumerate(x["points"], 1):
                if ":" in p:
                    t, rest_ = p.split(":", 1)
                    inner = f'<span class="pt">{e(t)}:</span>{e(rest_)}'
                else:
                    inner = e(p)
                lis.append(f'<li><span class="pn" aria-hidden="true">{n:02d}</span><p>{inner}</p></li>')
            out.append('<ol class="points">' + "".join(lis) + "</ol>")
    return "".join(out)


s_letter = f'''
<section class="slide wrap reveal letter" aria-labelledby="h-let">
  {tracker(8, 'Motivationsschreiben')}
  <div class="letter-head">
    <address class="recipient">{'<br>'.join(e(x) for x in L['recipient'])}</address>
    <p class="ldate">{e(L['place'])}, {long_date(L['date'])}</p>
  </div>
  <div class="letter-body">
    <h2 id="h-let" class="subject">{e(L['subject'])}</h2>
    <p>{e(L['salutation'])}</p>
    {paras(L['attention'])}
    {paras(L['interest'])}
    {paras(L['desire'])}
    {paras(L['action'])}
    <p class="closing">{e(L['closing'])}</p>
    <p class="sig">{e(D['name'])}</p>
    <p class="encl">Beilagen: {e(L['enclosures'])}</p>
  </div>
</section>'''

s_cta = f'''
<section class="cta wrap reveal" aria-labelledby="h-cta" id="kontakt">
  <h2 id="h-cta">Gespräch vereinbaren</h2>
  <p class="cta-sub">{e(D['name'])} · {e(D['location'])}</p>
  <div class="actions">
    <a class="btn btn-primary" href="{e(mail_cta)}">Gespräch vereinbaren</a>
    <a class="btn" href="mailto:{e(email)}">{e(email)}</a>
    <a class="btn" href="{e(D['linkedin'])}" rel="noopener">LinkedIn</a>
    <a class="btn" href="#">PDF</a>
  </div>
</section>'''

note = f"Bewerbung · {D['target']} · {job['company']} · Ref. {job['reference']}"

CSS = r"""
@font-face{font-family:"Schibsted Grotesk";src:url(data:font/woff2;base64,__FONT__) format("woff2");font-weight:400;font-style:normal;font-display:swap}
:root{--bg:#000;--ink:#fff;--meta:#a3a3a3;--line:#2a2a2a;--acc:#ff9f1c;--acc-t:#c26bff;--card:#0d0d0d;--g:16px;
  --f:"Schibsted Grotesk",ui-sans-serif,system-ui,sans-serif}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:400 17px/1.55 var(--f);font-kerning:normal}
h1,h2,h3,h4,p,ol,ul,address{margin:0;font-weight:400;font-style:normal}
ul,ol{padding:0;list-style:none}
a{color:inherit}
button{font:inherit;color:inherit}
:focus-visible{outline:2px solid var(--ink);outline-offset:3px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.wrap{max-width:calc(1100px + 2*var(--g));margin:0 auto;padding-left:var(--g);padding-right:var(--g)}
.skip{position:absolute;left:8px;top:-60px;background:var(--acc);color:#fff;padding:12px 16px;z-index:10;min-height:44px}
.skip:focus{top:8px}

/* progress */
.progress{position:fixed;left:0;top:0;height:3px;width:100%;background:var(--acc);transform-origin:0 0;transform:scaleX(0);z-index:5;pointer-events:none}
@media (min-width:900px){.progress{width:3px;height:100vh;transform:scaleY(0)}}
html:not(.js) .progress{display:none}

.note{font-size:16px;color:var(--meta);border-bottom:1px solid var(--line);padding:18px 0 14px;line-height:1.4}

/* buttons */
.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:32px}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;min-width:48px;padding:0 20px;border:1px solid var(--ink);background:transparent;color:var(--ink);text-decoration:none;font-size:17px;line-height:1.2;cursor:pointer;transition:background-color .2s,color .2s}
.btn:hover{background:var(--ink);color:#000}
.btn-primary{background:var(--acc);border-color:var(--acc);color:#fff}
.btn-primary:hover{background:#fff;border-color:#fff;color:#000}
.hero .actions .btn-primary{flex:1 1 100%}

/* hero */
.hero{padding-top:32px;padding-bottom:40px}
.slidehead{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 16px;font-size:16px;padding-bottom:14px;border-bottom:1px solid var(--line);margin-bottom:28px}
.target{color:var(--acc-t)}
.where{color:var(--meta)}
.portrait{display:block;width:96px;height:96px;object-fit:cover;object-position:50% 12%;background:#111;margin-bottom:24px}
h1{font-size:40px;line-height:1.05;letter-spacing:-0.01em}
.claim{font-size:28px;line-height:1.2;margin-top:20px;max-width:24ch;letter-spacing:-0.005em;text-wrap:pretty}
@media (min-width:600px){.hero .actions .btn-primary{flex:0 0 auto}}
@media (min-width:768px){
  :root{--g:32px}
  .hero-grid{display:grid;grid-template-columns:minmax(0,1fr) 240px;column-gap:40px;align-items:start}
  .portrait{grid-column:2;grid-row:1;width:240px;height:240px;margin:0}
  .hero-text{grid-column:1;grid-row:1}
  .hero-grid .actions{grid-column:1/-1;grid-row:2}
}
@media (min-width:1100px){
  :root{--g:48px}
  .hero{padding-top:40px;padding-bottom:24px}
  .hero-grid{grid-template-columns:minmax(0,1fr) 340px;column-gap:64px}
  .portrait{width:340px;height:340px;grid-row:1/3}
  .hero-grid .actions{grid-column:1;align-self:start}
  h1{font-size:56px}
  .claim{font-size:36px;margin-top:28px}
  .slidehead{margin-bottom:56px}
}

/* slides */
.slide{padding-top:72px;padding-bottom:8px}
.tracker{display:flex;align-items:baseline;gap:12px;font-size:16px;line-height:1.4;padding-bottom:14px;border-bottom:1px solid var(--line);position:relative}
.tracker::after{content:"";position:absolute;left:0;bottom:-1px;width:48px;height:2px;background:var(--acc)}
.tn{color:var(--acc-t)}
.tl{color:var(--ink);flex:1}
.tr{color:var(--meta)}
h2{font-size:28px;line-height:1.15;margin-top:28px;max-width:32ch;letter-spacing:-0.005em;text-wrap:balance}
p,li{text-wrap:pretty}
.statement{max-width:none}
.lead{margin-top:24px;max-width:37rem}
@media (min-width:1100px){
  .slide{padding-top:120px}
  h2{font-size:36px;margin-top:36px}
}

/* figures */
.figs{display:grid;gap:40px;margin-top:40px}
.fig .num{font-size:56px;line-height:1;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
.plus{color:var(--acc-t)}
.rule{display:block;height:2px;background:var(--acc);margin:18px 0 16px;transform-origin:0 50%}
.figlabel{max-width:26ch}
.nw{white-space:nowrap;display:block}
.figsrc{font-size:16px;color:var(--meta);margin-top:8px}
@media (min-width:768px){.figs{grid-template-columns:repeat(3,1fr);gap:32px}}
@media (min-width:1100px){.figs{margin-top:56px;gap:48px}.fig .num{font-size:64px}}

/* carousel */
.carousel{margin-top:32px}
.track{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;padding-bottom:2px}
.track::-webkit-scrollbar{display:none}
.card{flex:0 0 calc(100% - 36px);max-width:520px;scroll-snap-align:start;background:var(--card);border:1px solid var(--line);border-top:3px solid var(--acc);padding:24px 20px 24px;display:flex;flex-direction:column}
.card h3{font-size:22px;line-height:1.2;margin-bottom:14px}
.card p{max-width:37rem}
.evidence{color:var(--meta);font-size:16px;margin-top:auto;padding-top:18px}
.car-ctrl{display:flex;align-items:center;gap:8px;margin-top:16px}
.car-count{flex:1;color:var(--meta);font-size:16px;font-variant-numeric:tabular-nums}
.btn-sq{min-width:44px;min-height:44px;padding:0 16px;font-size:16px}
.btn-sq[aria-disabled="true"]{border-color:var(--line);color:var(--meta);cursor:default}
.btn-sq[aria-disabled="true"]:hover{background:transparent;color:var(--meta)}
html:not(.js) .car-ctrl{display:none}
@media (min-width:900px){
  .track{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;overflow:visible}
  .card{max-width:none;padding:28px 24px}
  .car-ctrl{display:none}
}

/* matrix */
.mat-intro{margin-top:28px;display:grid;gap:16px}
.legend{display:grid;grid-template-columns:1fr;gap:6px 24px;font-size:16px;line-height:1.35}
.legend li{display:grid;grid-template-columns:28px 1fr auto;gap:8px;align-items:baseline}
.ln{color:var(--acc-t);font-variant-numeric:tabular-nums}
.ly{color:var(--meta);font-variant-numeric:tabular-nums}
.key{font-size:16px;color:var(--meta);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.key .dot{margin-left:8px}.key .dot:first-child{margin-left:0}
.dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--meta);flex:none}
.dot.on{width:14px;height:14px;background:var(--acc)}
.matrix{margin-top:28px;border-top:1px solid var(--line)}
.mr{display:grid;grid-template-columns:repeat(7,minmax(32px,1fr));align-items:center;border-bottom:1px solid var(--line);padding:12px 0 8px;column-gap:0}
.mname{grid-column:1/6;grid-row:1;padding-right:8px;line-height:1.3}
.mlevel{grid-column:6/8;grid-row:1;text-align:right;color:var(--meta);font-size:16px;line-height:1.3;align-self:start;padding-top:2px}
.mc{grid-row:2;display:flex;align-items:center;justify-content:center;height:36px}
.mhead{position:sticky;top:3px;background:var(--bg);z-index:2;padding:8px 0}
.mh{font-size:16px;color:var(--meta);text-align:center;grid-row:1}
.mh-name,.mh-level{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.mr:not(.mhead):hover{background:var(--card)}
.more{margin-top:40px}
.more h3{font-size:19px;margin-bottom:14px}
.more-list{display:grid;gap:8px 32px}
.more-list li{padding-bottom:8px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:16px;align-items:baseline}
.lv{color:var(--meta);flex:none}
@media (min-width:768px){.more-list{grid-template-columns:1fr 1fr}}
@media (min-width:1100px){.more-list{grid-template-columns:1fr 1fr 1fr}}
@media (min-width:600px){.legend{grid-template-columns:1fr 1fr}}
@media (min-width:768px){
  .mr{grid-template-columns:minmax(0,1fr) repeat(7,56px) 120px;padding:0;min-height:52px}
  .mname,.mlevel,.mc,.mh{grid-row:auto;grid-column:auto}
  .mname{padding:12px 16px 12px 0}
  .mlevel{padding:0 0 0 16px;text-align:left;align-self:center}
  .mc{height:52px}
  .mh-name,.mh-level{position:static;width:auto;height:auto;overflow:visible;clip:auto;text-align:left}
  .mh-level{padding-left:16px}
  .mhead{top:0;min-height:44px}
}
@media (min-width:900px){.mhead{top:0}}
@media (min-width:1100px){
  .mat-intro{margin-top:40px;gap:20px}
  .legend{grid-template-columns:1fr 1fr;column-gap:64px}
  .legend li{grid-template-columns:32px 1fr auto}
  .mr{grid-template-columns:minmax(0,1fr) repeat(7,72px) 140px}
}

/* cases */
.cases{margin-top:40px;border-left:1px solid var(--line);padding-left:20px;display:grid;gap:48px}
.case{position:relative;max-width:1000px}
.case::before{content:"";position:absolute;left:-26px;top:10px;width:11px;height:11px;border-radius:50%;background:var(--acc)}
.case.compact::before,.case.older::before{width:7px;height:7px;left:-24px;background:var(--meta)}
.case h3{font-size:24px;line-height:1.2}
.role{font-size:19px;line-height:1.35;margin-top:6px}
.when{color:var(--acc-t);margin-top:6px}
.summary{margin-top:16px;max-width:37rem}
.hl,.projects{margin-top:16px;display:grid;gap:10px;max-width:37rem}
.hl li,.projects li{position:relative;padding-left:22px}
.hl li::before,.projects li::before{content:"";position:absolute;left:0;top:.62em;width:8px;height:2px;background:var(--acc)}
.pwhen{color:var(--meta)}
.case.older h3,.case.compact h3{font-size:20px}
.case.older .role,.case.compact .role{font-size:17px}
.case.compact .hl{gap:6px}
.case.compact .hl li,.case.older .hl li{color:var(--meta)}
@media (min-width:768px){.cases{padding-left:32px}.case::before{left:-38px}.case.compact::before,.case.older::before{left:-36px}}
@media (min-width:1100px){
  .cases{gap:64px;margin-top:56px}
  .case{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px}
  .case .case-body > :first-child{margin-top:0}
  .case.detailed h3{font-size:28px}
}

/* education */
.two{display:grid;gap:48px;margin-top:40px}
.two h3{font-size:22px;padding-bottom:12px;border-bottom:1px solid var(--line);margin-bottom:20px}
.h3-gap{margin-top:40px}
.plain{display:grid;gap:22px}
.edu h4{font-size:19px;line-height:1.3}
.edu .when{margin-top:2px}
.small{color:var(--meta);max-width:37rem}
.edu .small{margin-top:4px}
.llev{color:var(--acc-t)}
@media (min-width:768px){.two{grid-template-columns:1fr 1fr;gap:48px}}
@media (min-width:1100px){.two{gap:80px;margin-top:56px}}

/* letter */
.letter-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px 40px;margin-top:32px;color:var(--meta);font-style:normal}
.recipient{font-style:normal}
.letter-body{max-width:37rem;margin-top:40px}
.subject{font-size:26px;line-height:1.2;margin:0 0 32px;max-width:none}
.letter-body > p{margin-top:16px}
.letter-body > p:first-of-type{margin-top:0}
.points{counter-reset:none;display:grid;gap:22px;margin:24px 0 8px;border-top:1px solid var(--line);padding-top:24px}
.points li{display:grid;grid-template-columns:48px 1fr;gap:8px;align-items:start}
.pn{font-size:26px;line-height:1;color:var(--acc-t);font-variant-numeric:tabular-nums;padding-top:2px}
.pt{color:var(--ink)}
.closing{margin-top:32px!important}
.sig{margin-top:4px!important}
.encl{color:var(--meta);font-size:16px;margin-top:24px!important}
@media (min-width:1100px){
  .letter{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);column-gap:48px;align-items:start}
  .letter .tracker{grid-column:1/-1}
  .letter-head{flex-direction:column;justify-content:flex-start;position:sticky;top:40px;margin-top:56px}
  .letter-body{margin-top:56px;max-width:37rem}
  .subject{font-size:32px}
  .pn{font-size:32px}
  .points li{grid-template-columns:64px 1fr}
}

/* cta */
.cta{padding-top:96px;padding-bottom:96px}
.cta h2{font-size:36px;margin-top:0;padding-top:40px;border-top:3px solid var(--acc);max-width:none}
.cta-sub{color:var(--meta);margin-top:12px}
.cta .btn-primary{flex:1 1 100%}
@media (min-width:600px){.cta .btn-primary{flex:0 0 auto}}
@media (min-width:1100px){.cta{padding-top:140px;padding-bottom:140px}.cta h2{font-size:56px}}
.foot{border-top:1px solid var(--line);color:var(--meta);font-size:16px;padding:18px 0 28px}

/* motion (only with JS) */
html.js .reveal{opacity:0;transform:translateY(16px);transition:opacity .55s ease-out,transform .55s cubic-bezier(.2,.7,.2,1)}
html.js .reveal.in{opacity:1;transform:none}
html.js .rule{transform:scaleX(0);transition:transform .6s cubic-bezier(.2,.7,.2,1) .15s}
html.js .in .rule{transform:scaleX(1)}
html.js .matrix .dot{transform:scale(0);transition:transform .3s cubic-bezier(.3,1.4,.5,1);transition-delay:calc(var(--r,0)*35ms + var(--c,0)*12ms)}
html.js .matrix.in .dot{transform:scale(1)}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  html.js .reveal,html.js .rule,html.js .matrix .dot{opacity:1;transform:none;transition:none}
  .progress{display:none}
}

@media print{
  @page{margin:16mm}
  body{background:#fff;color:#000;font-size:11pt}
  .progress,.actions,.car-ctrl,.skip{display:none!important}
  html.js .reveal,html.js .rule,html.js .matrix .dot{opacity:1!important;transform:none!important;transition:none!important}
  .wrap{max-width:none;padding:0}
  .note,.slidehead,.tracker,.matrix,.mr,.two h3,.cases,.points{border-color:#999!important}
  .tracker::after{display:none}
  .note,.target,.tn,.tr,.tl,.where,.ln,.ly,.when,.pwhen,.llev,.plus,.pn,.small,.more,.evidence,.figsrc,.mlevel,.mh,.letter-head,.encl,.cta-sub,.points p,.case .hl li,.foot{color:#000!important}
  .hero-grid,.two,.figs,.track,.case.detailed,.mat-intro{display:block!important}
  .portrait{width:30mm;height:30mm;order:0;margin-bottom:6mm}
  .card{background:#fff;border:1px solid #999;border-top:2px solid #000;margin-bottom:4mm;break-inside:avoid}
  .dot{background:#999!important}.dot.on{background:#000!important}
  .rule{background:#000}
  .case::before,.hl li::before,.projects li::before{background:#000!important}
  .mhead{position:static}
  .slide,.hero,.cta{padding-top:10mm}
  h1{font-size:28pt}.claim{font-size:16pt}h2,.cta h2{font-size:16pt}.fig .num{font-size:28pt}
  .fig{margin-bottom:5mm}
  .letter{break-before:page}
  .cta h2{border-color:#000}
}
""".replace("__FONT__", FONT)

JS = r"""
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // progress bar
  var bar = document.querySelector('.progress');
  var mq = window.matchMedia('(min-width: 900px)');
  var ticking = false;
  function prog(){
    ticking = false;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    bar.style.transform = mq.matches ? 'scaleY(' + p + ')' : 'scaleX(' + p + ')';
  }
  if (bar){
    window.addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(prog); } }, {passive:true});
    window.addEventListener('resize', prog);
    prog();
  }
  // counters
  function count(el){
    var to = +el.getAttribute('data-to');
    if (reduce || !to) return;
    var t0 = null, dur = 600, done = false;
    window.addEventListener('beforeprint', function(){ done = true; el.textContent = to; });
    function step(t){
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur), v = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * v);
      if (k < 1 && !done) requestAnimationFrame(step); else el.textContent = to;
    }
    requestAnimationFrame(step);
  }
  window.addEventListener('beforeprint', function(){
    [].forEach.call(document.querySelectorAll('.count'), function(c){ c.textContent = c.getAttribute('data-to'); });
    [].forEach.call(document.querySelectorAll('.reveal, .matrix'), function(el){ el.classList.add('in'); });
  });
  // reveal
  var items = [].slice.call(document.querySelectorAll('.reveal, .matrix'));
  function show(el){
    el.classList.add('in');
    if (el.hasAttribute('data-counted')) return;
    var cs = el.querySelectorAll('.count');
    if (cs.length){ el.setAttribute('data-counted',''); [].forEach.call(cs, count); }
  }
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){ if (en.isIntersecting){ show(en.target); io.unobserve(en.target); } });
    }, {rootMargin:'0px 0px -8% 0px', threshold:0.08});
    items.forEach(function(el){ io.observe(el); });
  } else { items.forEach(function(el){ el.classList.add('in'); }); }
  // carousel
  [].forEach.call(document.querySelectorAll('[data-carousel]'), function(c){
    var track = c.querySelector('.track'), cards = track.children;
    var cur = c.querySelector('[data-cur]'), prev = c.querySelector('[data-prev]'), next = c.querySelector('[data-next]');
    function step(){ return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth; }
    function idx(){ return Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / step()))); }
    function upd(){
      var i = idx();
      cur.textContent = i + 1;
      prev.setAttribute('aria-disabled', i === 0 ? 'true' : 'false');
      next.setAttribute('aria-disabled', i === cards.length - 1 ? 'true' : 'false');
    }
    function go(d){
      var i = Math.max(0, Math.min(cards.length - 1, idx() + d));
      track.scrollTo({left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth'});
    }
    prev.addEventListener('click', function(){ go(-1); });
    next.addEventListener('click', function(){ go(1); });
    track.addEventListener('scroll', function(){ requestAnimationFrame(upd); }, {passive:true});
    track.addEventListener('keydown', function(ev){
      if (ev.key === 'ArrowRight'){ ev.preventDefault(); go(1); }
      if (ev.key === 'ArrowLeft'){ ev.preventDefault(); go(-1); }
    });
    upd();
  });
})();
"""

html = f'''<!doctype html>
<html lang="{e(D['lang'])}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(D['name'])} · {e(D['target'])} · {e(job['company'])}</title>
<meta name="description" content="{e(D['claim'])}">
<meta name="color-scheme" content="dark">
<script>document.documentElement.classList.add('js')</script>
<style>{CSS}</style>
</head>
<body>
<a class="skip btn" href="#main">Zum Inhalt</a>
<div class="progress" aria-hidden="true"></div>
<div class="wrap"><p class="note">{e(note)}</p></div>
<main id="main">
{hero}
{s_figures}
{s_strengths}
{s_profile}
{s_matrix}
{s_exp}
{s_edu}
{s_letter}
{s_cta}
</main>
<footer class="wrap"><p class="foot">{e(D['name'])} · {e(D['location'])}</p></footer>
<script>{JS}</script>
</body>
</html>
'''

(HERE / "index.html").write_text(html, encoding="utf-8")
print("ok", len(html) // 1024, "KB,", len(rows), "matrix rows,", len(rest), "further")
