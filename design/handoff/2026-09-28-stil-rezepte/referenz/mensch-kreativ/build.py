#!/usr/bin/env python3
"""Build fpub/mensch-kreativ/index.html from fpub/data/mensch-kreativ.json.

Stil-Rezept «mensch-kreativ», Konzept «Porträt»: warm, persönlich, wie ein
Magazin-Porträt. Figtree 400, Papier/Tinte/Terrakotta, Marken nur als Dekor.
Alle Inhalte kommen aus der JSON; dieses Skript ordnet sie nur an.
Aufruf: python3 fpub/mensch-kreativ/build.py
"""
import base64, datetime, html, io, json, pathlib, re

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
D = json.loads((ROOT / "data" / "mensch-kreativ.json").read_text())

e = lambda s: html.escape(str(s), quote=True)

# ---------------------------------------------------------------- assets
FONT = base64.b64encode((ROOT / "fonts" / "figtree-latin-400-normal.woff2").read_bytes()).decode()


def portrait_uri():
    from PIL import Image
    im = Image.open(ROOT / D["photo"]).convert("RGB")
    if im.width > 600:
        im = im.resize((600, round(im.height * 600 / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=82, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


# ---------------------------------------------------------------- colours
def mix(a, b, t):
    a, b = a.lstrip("#"), b.lstrip("#")
    return "#" + "".join(f"{round(int(a[i:i+2],16)*(1-t)+int(b[i:i+2],16)*t):02x}" for i in (0, 2, 4))


B = D["brand"]
PAPER, INK, ACC = B["paper"], B["ink"], B["accent"]
M1, M2, M3 = B["marks"]            # Terrakotta hell, Sand, Salbei: nur Dekor
SURF = "#f3ece2"                   # Fläche
META = "#6b594d"                   # warmes Meta-Grau
T1, T2, T3 = mix(M1, PAPER, .78), mix(M2, PAPER, .60), mix(M3, PAPER, .72)   # Chip-Tönungen
LINE = mix(M1, PAPER, .45)         # weiche Pfadlinie (Dekor)

# ---------------------------------------------------------------- helpers
LEVEL = {4: "Spezialist", 3: "Erfahren", 2: "Erste Erfahrung", 1: "Grundkenntnisse"}
LTINT = {4: T1, 3: T2, 2: T3, 1: SURF}
CHIPFS = {4: 19, 3: 18, 2: 17, 1: 16}
MONTH = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
         "September", "Oktober", "November", "Dezember"]


def my(s):
    y, m = s.split("-")[:2]
    return f"{m}.{y}"


def period(a, b):
    t = f"{my(a)}\u00a0– {my(b)}" if b else f"seit\u00a0{my(a)}"
    return f'<span class="nw">{t}</span>'


def split_top(s):
    """Split at commas/semicolons outside parentheses."""
    out, depth, cur = [], 0, ""
    for ch in s:
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        if ch in ",;" and depth == 0:
            out.append(cur.strip()); cur = ""
        else:
            cur += ch
    if cur.strip():
        out.append(cur.strip())
    return out


# ---------------------------------------------------------------- sections
job = D["job"]
note_parts = [job.get("title"), job.get("company"), job.get("location"), job.get("reference")]
NOTE = " · ".join(re.sub(r"(\d+[–-]\d+ ?%)", lambda m: f'<span class="nw">{m.group(1)}</span>', e(x)) for x in note_parts if x)
LI = D["linkedin"]


def header():
    return f"""
<p class="note wrap"><span class="vh">Bewerbung: </span><span aria-hidden="true">Bewerbung · </span>{NOTE}</p>
<header class="hero wrap">
  <div class="hero-pic">
    <span class="blob" aria-hidden="true"></span>
    <span class="dot dot-a" aria-hidden="true"></span>
    <img class="pic" src="{portrait_uri()}" width="480" height="600" alt="Porträt von {e(D['name'])}">
  </div>
  <div class="hero-txt">
    <h1>{e(D['name'])}</h1>
    <p class="target">{e(D['target'])}</p>
    <p class="headline">{e(D['headline'])}</p>
    <p class="loc">{e(D['location'])}</p>
    <div class="btns">
      <a class="btn btn-main" href="#">PDF</a>
      <a class="btn" href="mailto:{e(D['email'])}">E-Mail</a>
      <a class="btn" href="{e(LI)}" rel="noopener">LinkedIn</a>
    </div>
  </div>
</header>"""


def about():
    return f"""
<section class="sec about side wrap" aria-labelledby="h-about">
  <h2 id="h-about"><span class="hd" aria-hidden="true"></span>Über mich</h2>
  <p class="claim">{e(D['claim'])}</p>
  <p class="profile">{e(D['profile'])}</p>
</section>"""


def strengths():
    cols = [M1, M2, M3]
    cards = "".join(f"""
    <li class="card"><span class="pt" style="background:{cols[i % 3]}" aria-hidden="true"></span>
      <h3>{e(s['title'])}</h3><p>{e(s['text'])}</p></li>""" for i, s in enumerate(D["strengths"]))
    return f"""
<section class="sec wrap" aria-labelledby="h-str">
  <h2 id="h-str"><span class="hd" aria-hidden="true"></span>Was mir wichtig ist</h2>
  <ul class="cards" role="list">{cards}
  </ul>
</section>"""


def chip(it, i, show_level):
    k = it.get("key")
    lvl = it["level"]
    inner = ""
    if k:
        inner += '<span class="kd" aria-hidden="true"></span>'
    lv = f'<span class="cl"> · {LEVEL[lvl]}</span>' if show_level else ""
    inner += f'<span class="ct"><span class="cn">{e(it["name"])}</span>{lv}</span>'
    if k:
        inner += '<span class="vh"> (Schlüsselkompetenz)</span>'
    return f'<li class="chip l{lvl}" style="--i:{i}">{inner}</li>'


def skills():
    allitems = [it for g in D["skills"] for it in g["items"]]
    # nach Stufe
    by_level = ""
    n = 0
    for lvl in (4, 3, 2, 1):
        its = [it for it in allitems if it["level"] == lvl]
        if not its:
            continue
        its.sort(key=lambda x: not x.get("key"))
        chips = ""
        for it in its:
            chips += chip(it, n, False); n += 1
        by_level += f"""
      <div class="lvl l{lvl}">
        <h3>{LEVEL[lvl]}</h3>
        <p class="lsub">Stufe {lvl} von 4 · {len(its)} {'Kompetenz' if len(its) == 1 else 'Kompetenzen'}</p>
        <ul class="chips" role="list">{chips}</ul>
      </div>"""
    # nach Thema
    by_theme = ""
    n = 0
    for g in D["skills"]:
        its = sorted(g["items"], key=lambda x: -x["level"])
        chips = ""
        for it in its:
            chips += chip(it, n, True); n += 1
        by_theme += f"""
      <div class="lvl theme">
        <h3>{e(g['name'])}</h3>
        <ul class="chips" role="list">{chips}</ul>
      </div>"""
    printlist = "".join(
        f"<li>{e(g['name'])}: " + "; ".join(f"{e(it['name'])} ({LEVEL[it['level']]}{', Schlüsselkompetenz' if it.get('key') else ''})" for it in g["items"]) + "</li>"
        for g in D["skills"])
    return f"""
<section class="sec skills wrap" id="skills" aria-labelledby="h-sk">
  <h2 id="h-sk"><span class="hd" aria-hidden="true"></span>Worin ich stark bin</h2>
  <div class="sk-ctl">
    <div class="tog" role="group" aria-label="Ansicht der Kompetenzen">
      <button type="button" class="tb" data-view="level" aria-pressed="true">nach Stufe</button>
      <button type="button" class="tb" data-view="theme" aria-pressed="false">nach Thema</button>
    </div>
    <p class="legend"><span class="kd" aria-hidden="true"></span>Schlüsselkompetenz für diese Stelle</p>
  </div>
  <div class="views" aria-live="polite">
    <div class="view" data-view="level">{by_level}
    </div>
    <div class="view" data-view="theme" hidden>{by_theme}
    </div>
  </div>
  <ul class="print-skills">{printlist}</ul>
</section>"""


def station(x, idx):
    open_ = idx < 2
    hl = x.get("highlights") or []
    body = ""
    if x.get("summary"):
        body += f'<p class="sum">{e(x["summary"])}</p>'
        rest = hl
    elif open_:
        rest = hl
    else:
        rest = hl[1:] if len(hl) > 1 else []
        if hl:
            body += f'<p class="sum">{e(hl[0])}</p>'
    if x.get("projects"):
        body += '<ul class="proj" role="list">' + "".join(
            f'<li><p class="pd">{period(p["start"], p.get("end"))}</p><p>{e(p["description"])}</p></li>'
            for p in x["projects"]) + "</ul>"
    lis = "".join(f"<li>{e(h)}</li>" for h in rest)
    if lis:
        if open_:
            body += f'<ul class="hl">{lis}</ul>'
        elif len(rest) == 1 and x.get("projects"):
            body += f'<p class="sum">{e(rest[0])}</p>'
        else:
            body += f'<details><summary>Mehr<span class="vh"> zu {e(x["organization"])}</span></summary><ul class="hl">{lis}</ul></details>'
    cur = " now" if idx == 0 else ""
    return f"""
    <li class="st{cur}"><span class="mk" aria-hidden="true"></span>
      <h3>{e(x['role'])}</h3>
      <p class="org">{e(x['organization'])}</p>
      <p class="when">{period(x['start'], x.get('end'))} · {e(x['location'])}</p>
      {body}
    </li>"""


def path():
    items = "".join(station(x, i) for i, x in enumerate(D["experience"]))
    return f"""
<section class="sec way side wrap" id="weg" aria-labelledby="h-way">
  <h2 id="h-way"><span class="hd" aria-hidden="true"></span>Mein Weg</h2>
  <div class="path">
    <span class="rail" aria-hidden="true"><span class="rail-fill"></span></span>
    <ol class="stations" role="list">{items}
    </ol>
  </div>
</section>"""


def more():
    cols = [M1, M2, M3]
    ints = "".join(f'<li class="ic"><span class="pt" style="background:{cols[i % 3]}" aria-hidden="true"></span>{e(t)}</li>'
                   for i, t in enumerate(split_top(D["interests"])))
    langs = "".join(f"""
        <li class="lang"><p class="ln">{e(l['name'])}</p><p class="ll">{e(l['level'])}</p>{f'<p class="ld">{e(l["detail"])}</p>' if l.get('detail') else ''}</li>"""
                    for l in D["languages"])
    edu = "".join(f"""
        <li class="edu"><p class="ed">{e(x['degree'])}</p><p class="ei">{e(x['institution'])}, {e(x['location'])} · {period(x['start'], x.get('end'))}</p>{f'<p class="es">{e(x["summary"])}</p>' if x.get('summary') else ''}</li>"""
                  for x in D["education"])
    return f"""
<section class="sec more wrap" aria-labelledby="h-more">
  <h2 id="h-more"><span class="hd" aria-hidden="true"></span>Mehr als Arbeit</h2>
  <div class="more-grid">
    <div class="m-int">
      <h3>Interessen</h3>
      <ul class="ichips" role="list">{ints}</ul>
    </div>
    <div class="m-side">
      <div class="m-lang">
        <h3>Sprachen</h3>
        <ul class="langs" role="list">{langs}
        </ul>
      </div>
      <div class="m-edu">
        <h3>Ausbildung</h3>
        <ul class="edus" role="list">{edu}
        </ul>
      </div>
    </div>
  </div>
</section>"""


def letter():
    L = D.get("letter")
    today = datetime.date.today()
    city = D["location"].split(",")[0].strip()
    date = f"{city}, {today.day}. {MONTH[today.month-1]} {today.year}"
    subject = f"Bewerbung als {D['target']}"
    if L and L.get("body"):
        paras = "".join(f"<p>{e(p)}</p>" for p in (L["body"] if isinstance(L["body"], list) else str(L["body"]).split("\n\n")))
    else:
        paras = ('<p class="placeholder"><span class="ph-tag">Beispieltext:</span> Hier steht das Anschreiben. '
                 'Der Generator füllt es aus dem Feld <code>letter</code> der Bewerbung.</p>')
    return f"""
<section class="sec side wrap" id="brief" aria-labelledby="h-let">
  <h2 id="h-let"><span class="hd" aria-hidden="true"></span><span>Motivations&shy;schreiben</span></h2>
  <article class="sheet">
    <p class="rcpt">{e(job['company'])}<br>{e(job['location'])}</p>
    <p class="date">{e(date)}</p>
    <p class="subj">{e(subject)}</p>
    {paras}
    <p class="greet">Freundliche Grüsse</p>
    <p class="sig">{e(D['name'])}</p>
  </article>
</section>"""


def contact():
    return f"""
<section class="sec wrap" aria-labelledby="h-ct">
  <div class="contact">
    <span class="cblob" aria-hidden="true"></span>
    <h2 id="h-ct">Ich freue mich auf ein Gespräch</h2>
    <p class="cmail">{e(D['email'])}</p>
    <div class="btns">
      <a class="btn btn-main" href="mailto:{e(D['email'])}">E-Mail schreiben</a>
      <a class="btn" href="{e(LI)}" rel="noopener">LinkedIn</a>
    </div>
  </div>
</section>"""


# ---------------------------------------------------------------- css / js
CSS = f"""
@font-face{{font-family:"Figtree";src:url(data:font/woff2;base64,{FONT}) format("woff2");font-weight:400;font-style:normal;font-display:swap}}
:root{{--paper:{PAPER};--ink:{INK};--surf:{SURF};--acc:{ACC};--meta:{META};
--m1:{M1};--m2:{M2};--m3:{M3};--t1:{T1};--t2:{T2};--t3:{T3};--line:{LINE};
--r:16px;--gut:16px;--ease:cubic-bezier(.2,.7,.2,1)}}
*,*::before,*::after{{box-sizing:border-box}}
html{{-webkit-text-size-adjust:100%;overflow-x:clip}}
body{{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.6 "Figtree",ui-sans-serif,system-ui,sans-serif;overflow-x:clip}}
h1,h2,h3,p,ul,ol,figure{{margin:0}}
h1,h2,h3{{font-weight:400}}
ul,ol{{padding:0;list-style:none}}
button,summary{{font:inherit;color:inherit}}
code{{font:inherit;background:var(--t2);border-radius:6px;padding:0 .3em}}
a{{color:var(--acc)}}
:focus-visible{{outline:2px solid var(--acc);outline-offset:3px;border-radius:6px}}
.nw{{white-space:nowrap}}
.vh{{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}}
.wrap{{width:100%;max-width:1152px;margin-inline:auto;padding-inline:var(--gut)}}

/* Kopfvermerk */
.note{{font-size:16px;color:var(--meta);padding-top:18px;padding-bottom:18px;line-height:1.5}}

/* Kopf */
.hero{{display:grid;gap:36px;padding-bottom:24px}}
.hero-pic{{position:relative;isolation:isolate;padding:0 0 0 0}}
.pic{{display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;border-radius:var(--r);position:relative;z-index:1;background:var(--surf)}}
.hero-pic{{margin-top:18px}}
.blob{{position:absolute;z-index:0;width:70%;aspect-ratio:1;border-radius:50%;background:var(--m2);right:-12px;top:-18px}}
.dot{{position:absolute;z-index:2;border-radius:50%}}
.dot-a{{width:52px;height:52px;background:var(--m3);left:-10px;bottom:28px}}
.hero-txt{{display:flex;flex-direction:column}}
h1{{font-size:46px;line-height:1.05;letter-spacing:-.01em}}
.target{{font-size:23px;line-height:1.3;color:var(--acc);margin-top:14px}}
.headline{{font-size:18px;line-height:1.45;margin-top:10px}}
.loc{{font-size:17px;color:var(--meta);margin-top:6px}}
.btns{{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}}
.btn{{display:inline-flex;align-items:center;justify-content:center;min-height:48px;min-width:48px;padding:0 22px;border-radius:999px;
  font-size:17px;text-decoration:none;color:var(--ink);background:var(--paper);border:2px solid var(--meta);transition:transform .3s var(--ease)}}
.btn:hover{{transform:translateY(-2px)}}
.btn-main{{background:var(--acc);border-color:var(--acc);color:#fff}}

/* Abschnitte */
.sec{{padding-top:72px}}
h2{{font-size:32px;line-height:1.15;hyphens:manual;margin-bottom:28px;display:flex;align-items:flex-start;gap:14px}}
.hd{{flex:none;width:14px;height:14px;border-radius:50%;background:var(--m1);margin-top:calc(.575em - 7px)}}
h3{{font-size:22px;line-height:1.3}}

/* Über mich */
.about .claim{{font-size:24px;line-height:1.4;max-width:30em}}
.about .profile{{font-size:18px;max-width:34em;margin-top:22px}}

/* Stärken */
.cards{{display:grid;gap:14px}}
.card{{background:var(--surf);border-radius:var(--r);padding:24px 22px 26px}}
.card .pt{{display:block;width:18px;height:18px;border-radius:50%;margin-bottom:16px}}
.card p{{margin-top:8px}}

/* Skills */
.sk-ctl{{display:flex;flex-wrap:wrap;align-items:center;gap:14px 24px;margin-bottom:12px}}
.tog{{display:inline-flex;background:var(--surf);border-radius:999px;padding:4px;gap:4px}}
.tb{{min-height:44px;padding:0 20px;border-radius:999px;border:2px solid transparent;background:transparent;cursor:pointer;font-size:17px;transition:background-color .3s,color .3s}}
.tb[aria-pressed="true"]{{background:var(--acc);color:#fff}}
.tb[aria-pressed="false"]{{border-color:var(--meta)}}
.legend{{font-size:16px;color:var(--meta);display:flex;align-items:center;gap:8px}}
.kd{{display:inline-block;flex:none;width:9px;height:9px;border-radius:50%;background:var(--acc)}}
.chip .kd{{margin-top:calc(.675em - 4.5px)}}
.lvl{{padding-top:28px}}
.lvl h3{{font-size:22px}}
.lsub{{color:var(--meta);margin-top:2px}}
.lvl.l4 .lsub{{font-size:19px}}.lvl.l3 .lsub{{font-size:18px}}.lvl.l2 .lsub{{font-size:17px}}.lvl.l1 .lsub{{font-size:16px}}
.chips{{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}}
.chip{{display:inline-flex;align-items:flex-start;gap:9px;border-radius:22px;padding:7px 16px;line-height:1.35;background:var(--surf)}}
.chip.l4{{background:var(--t1)}}.chip.l3{{background:var(--t2)}}.chip.l2{{background:var(--t3)}}
.lvl.l4 .chip{{font-size:19px}}.lvl.l3 .chip{{font-size:18px}}.lvl.l2 .chip{{font-size:17px}}.lvl.l1 .chip{{font-size:16px}}
.theme .chip{{font-size:17px}}
.cl{{color:var(--meta);white-space:nowrap}}
.print-skills{{display:none}}
.views{{transition:opacity .3s var(--ease)}}
.views.swap{{opacity:0}}

/* Mein Weg */
.path{{position:relative;padding-left:40px}}
.rail{{position:absolute;left:8px;top:10px;bottom:10px;width:4px;border-radius:4px;background:var(--surf)}}
.rail-fill{{position:absolute;inset:0;border-radius:4px;background:var(--line);transform-origin:top}}
.st{{position:relative;max-width:42rem;padding-bottom:44px}}
.st:last-child{{padding-bottom:0}}
.mk{{position:absolute;left:-40px;top:6px;width:20px;height:20px;border-radius:50%;background:var(--paper);border:3px solid var(--meta)}}
.st.now .mk{{background:var(--acc);border-color:var(--acc);box-shadow:0 0 0 6px var(--t1)}}
.st h3{{font-size:22px}}
.org{{font-size:18px;margin-top:4px}}
.when{{color:var(--meta);margin-top:2px}}
.sum{{margin-top:12px}}
.hl{{margin-top:12px;padding-left:0}}
.hl li{{position:relative;padding-left:22px;margin-top:8px}}
.hl li::before{{content:"";position:absolute;left:2px;top:.65em;width:8px;height:8px;border-radius:50%;background:var(--m1)}}
.proj{{margin-top:14px;display:grid;gap:10px}}
.proj li{{background:var(--surf);border-radius:var(--r);padding:14px 18px;margin-left:12px}}
.pd{{color:var(--meta)}}
details{{margin-top:8px}}
summary{{display:inline-flex;align-items:center;gap:10px;min-height:44px;min-width:44px;padding:0 18px;border-radius:999px;background:var(--surf);cursor:pointer;list-style:none;color:var(--acc)}}
summary::-webkit-details-marker{{display:none}}
summary::after{{content:"";width:8px;height:8px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:translateY(-2px) rotate(45deg);transition:transform .3s}}
details[open] summary::after{{transform:translateY(2px) rotate(-135deg)}}

/* Mehr als Arbeit */
.more-grid{{display:grid;gap:44px}}
.more h3{{margin-bottom:16px}}
.ichips{{display:flex;flex-wrap:wrap;gap:10px}}
.ic{{display:inline-flex;align-items:flex-start;gap:12px;font-size:19px;line-height:1.35;background:var(--surf);border-radius:26px;padding:12px 22px 12px 16px}}
.ic .pt{{flex:none;width:14px;height:14px;border-radius:50%;margin-top:calc(.675em - 7px)}}
.m-side{{display:grid;gap:44px}}
.langs,.edus{{display:grid;gap:10px}}
.lang{{background:var(--surf);border-radius:var(--r);padding:14px 18px;display:grid;grid-template-columns:1fr auto;column-gap:14px}}
.ln{{font-size:19px}}
.ll{{font-size:17px;color:var(--meta);align-self:center;text-align:right}}
.ld{{grid-column:1/-1;font-size:17px;margin-top:2px}}
.edu{{padding:4px 0 10px}}
.edu+.edu{{border-top:0}}
.ed{{font-size:19px}}
.ei{{color:var(--meta)}}
.es{{margin-top:4px}}

/* Brief */
.sheet{{background:var(--surf);border-radius:var(--r);padding:28px 22px;font-size:18px;max-width:46rem}}
.sheet p+p{{margin-top:16px}}
.subj{{color:var(--acc)}}
.placeholder{{border:2px dashed var(--meta);border-radius:12px;padding:14px 16px;background:var(--paper)}}
.ph-tag{{color:var(--acc)}}
.greet{{margin-top:28px!important}}

/* Kontakt */
.contact{{position:relative;overflow:hidden;isolation:isolate;background:var(--t2);border-radius:24px;padding:40px 22px 34px;margin-bottom:72px}}
.contact h2{{display:block;margin-bottom:12px;max-width:14em}}
.cmail{{font-size:18px;overflow-wrap:anywhere}}
.cblob{{position:absolute;z-index:-1;width:240px;height:240px;border-radius:50%;background:var(--m1);opacity:.35;right:-80px;bottom:-110px}}
.contact .btn:not(.btn-main){{background:var(--paper)}}

@media (min-width:640px){{
  :root{{--gut:32px}}
  .cards{{grid-template-columns:1fr 1fr}}
  .card:last-child:nth-child(odd){{grid-column:1/-1}}
  .hero{{grid-template-columns:44% 1fr;gap:40px;align-items:center}}
  h1{{font-size:52px}}
}}
@media (min-width:1024px){{
  :root{{--gut:40px}}
  .note{{padding-top:28px;padding-bottom:36px}}
  .hero{{grid-template-columns:40% 1fr;gap:72px;align-items:center;padding-bottom:40px}}
  h1{{font-size:80px}}
  .target{{font-size:28px;margin-top:20px}}
  .headline{{font-size:20px}}
  .loc{{font-size:18px}}
  .sec{{padding-top:112px}}
  h2{{font-size:40px;margin-bottom:36px}}
  .about .claim{{font-size:26px}}
  .cards{{grid-template-columns:repeat(3,1fr);gap:18px}}
  .card:last-child:nth-child(odd){{grid-column:auto}}
  .blob{{width:82%;right:-56px;top:-34px}}
  .dot-a{{width:64px;height:64px;left:-22px;bottom:44px}}
  .card{{padding:30px 28px 32px}}
  .path{{padding-left:56px}}
  .mk{{left:-56px}}
  .rail{{left:8px}}
  .more-grid{{grid-template-columns:1fr 1fr;gap:64px;align-items:start}}
  .sheet{{padding:48px 56px}}
  .contact{{padding:56px 56px 52px;margin-bottom:112px}}
  .cblob{{width:380px;height:380px;right:-90px;bottom:-150px}}
  .side{{display:grid;grid-template-columns:280px minmax(0,1fr);column-gap:48px;align-items:start}}
  .side>h2{{position:sticky;top:40px;margin-bottom:0;padding-top:0}}
  .about.side .claim,.about.side .profile{{grid-column:2}}
  .about.side .claim{{margin-top:6px}}
  .about.side>h2{{grid-row:1/span 2}}
  .m-int{{background:var(--t2);border-radius:24px;padding:32px 30px 34px;position:sticky;top:40px}}
  .ic{{background:var(--paper)}}
}}

/* Bewegung: Startzustände nur mit JS */
html.js .pic{{opacity:0;transform:scale(.96);transition:opacity .6s var(--ease),transform .6s var(--ease)}}
html.js .blob,html.js .dot{{opacity:0;transform:scale(.9);transition:opacity .6s var(--ease) .1s,transform .6s var(--ease) .1s}}
html.js.ready .pic,html.js.ready .blob,html.js.ready .dot{{opacity:1;transform:none}}
html.js .skills .chip{{opacity:0;transform:translateY(8px);transition:opacity .4s var(--ease),transform .4s var(--ease);transition-delay:calc(var(--i) * 20ms)}}
html.js .skills.in .chip{{opacity:1;transform:none}}
html.js .rail-fill{{transform:scaleY(var(--p,0))}}
@media (prefers-reduced-motion:reduce){{
  *,*::before,*::after{{transition:none!important;animation:none!important}}
  html.js .pic,html.js .blob,html.js .dot,html.js .skills .chip{{opacity:1;transform:none}}
  html.js .rail-fill{{transform:none}}
  .btn:hover{{transform:none}}
}}

@media print{{
  @page{{margin:16mm}}
  :root{{--acc:#000;--meta:#000;--ink:#000}}
  body{{background:#fff;color:#000;font-size:11pt}}
  .wrap{{max-width:none;padding:0}}
  .btns,.tog,.legend,.views,.blob,.dot,.hd,.rail,.mk,.cblob,summary{{display:none!important}}
  .hero{{grid-template-columns:1fr;gap:12px}}
  .hero-pic{{max-width:120px}}
  .pic{{opacity:1!important;transform:none!important}}
  h1{{font-size:26pt}}
  h2{{font-size:17pt;margin-bottom:8pt}}
  .sec{{padding-top:18pt}}
  .card,.proj li,.lang,.sheet,.contact,.placeholder{{background:none!important;border-radius:0;padding:0}}
  .cards,.more-grid,.m-side{{grid-template-columns:1fr!important;gap:10pt}}
  .print-skills{{display:block;list-style:disc;padding-left:1.2em}}
  .print-skills li+li{{margin-top:4pt}}
  .hl{{list-style:disc;padding-left:1.2em}}.hl li{{padding-left:0}}.hl li::before{{display:none}}
  .path{{padding-left:0}}
  details>*{{display:block}}
  .ichips{{display:block}}.ic{{display:inline;background:none;padding:0}}.ic+.ic::before{{content:", "}}.ic .pt{{display:none}}
  .contact{{margin:0}}
  *{{box-shadow:none!important;transition:none!important}}
}}
"""

JS = """
(function(){
  var d=document.documentElement;
  var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.add('ready')})});
  var sk=document.getElementById('skills');
  if('IntersectionObserver' in window&&!rm){
    var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){sk.classList.add('in');io.disconnect()}})},{threshold:.12});
    io.observe(sk);
  } else sk.classList.add('in');
  /* Umschalter */
  var views=sk.querySelector('.views'), btns=sk.querySelectorAll('.tb');
  function show(v){
    btns.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.view===v))});
    sk.querySelectorAll('.view').forEach(function(x){x.hidden=x.dataset.view!==v});
  }
  btns.forEach(function(b){b.addEventListener('click',function(){
    if(b.getAttribute('aria-pressed')==='true')return;
    var v=b.dataset.view;
    if(rm){show(v);return}
    views.classList.add('swap');
    setTimeout(function(){
      sk.classList.remove('in'); show(v);
      void views.offsetWidth;
      views.classList.remove('swap');
      requestAnimationFrame(function(){sk.classList.add('in')});
    },300);
  })});
  /* Pfadlinie an Scroll-Fortschritt gebunden */
  var path=document.querySelector('.path'), fill=path.querySelector('.rail-fill'), mx=0;
  function upd(){
    var r=path.getBoundingClientRect(), vh=innerHeight;
    var p=Math.min(1,Math.max(0,(vh*.72-r.top)/r.height));
    if(p>mx){mx=p;fill.style.setProperty('--p',mx.toFixed(4))}
  }
  if(rm){fill.style.setProperty('--p','1')}else{addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd()}
})();
"""

PAGE = f"""<!doctype html>
<html lang="{e(D['lang'])}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(D['name'])} · {e(D['target'])}</title>
<meta name="description" content="Bewerbung von {e(D['name'])} als {e(job['title'])} bei {e(job['company'])}">
<script>document.documentElement.classList.add('js')</script>
<style>{CSS}</style>
</head>
<body>
{header()}
<main>
{about()}
{strengths()}
{skills()}
{path()}
{more()}
{letter()}
{contact()}
</main>
<script>{JS}</script>
</body>
</html>
"""

(HERE / "index.html").write_text(PAGE)
print("ok", len(PAGE))
