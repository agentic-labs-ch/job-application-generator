#!/usr/bin/env python3
"""Baut fpub/technische-daten/index.html aus fpub/data/technische-daten.json.

Konzept «Technische Daten»: schwarzer Grund, weisse Schrift, Newsreader 400,
feine Linien, Skills als Rundinstrumente. Alle Inhalte kommen aus der JSON.
"""
import base64, io, json, math, pathlib, re
from decimal import Decimal, ROUND_HALF_UP
from html import escape
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
D = json.loads((ROOT / "data" / "technische-daten.json").read_text(encoding="utf-8"))

LEVELS = {1: "Grundkenntnisse", 2: "Erste Erfahrung", 3: "Erfahren", 4: "Spezialist"}
MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
          "September", "Oktober", "November", "Dezember"]


def e(s):
    return escape(str(s), quote=True)


def font_uri():
    b = (ROOT / "fonts" / "newsreader-latin-400-normal.woff2").read_bytes()
    return "data:font/woff2;base64," + base64.b64encode(b).decode()


def photo_uri():
    im = Image.open(ROOT / D["photo"]).convert("RGB")
    if im.width > 600:
        im = im.resize((600, round(im.height * 600 / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=82, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode(), im.size


def year(ym):
    return ym.split("-")[0] if ym else ""


def mon(ym):
    if not ym:
        return ""
    y, m = ym.split("-")
    return f"{m}.{y}"


def years(a, b):
    ya, yb = year(a), year(b)
    return ya if ya == yb else f"{ya} – {yb}"


def de_num(x):
    return str(x).replace(".", ",")


def mean1(vals):
    m = Decimal(sum(vals)) / Decimal(len(vals))
    return m.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)


def split_top(s):
    """Trennt an Kommas/Semikolons ausserhalb von Klammern."""
    out, cur, depth = [], "", 0
    for ch in s:
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        if ch in ",;" and depth == 0:
            if cur.strip():
                out.append(cur.strip())
            cur = ""
        else:
            cur += ch
    if cur.strip():
        out.append(cur.strip())
    return out


def de_date(iso):
    y, m, d = iso.split("-")
    return f"{int(d)}. {MONTHS[int(m) - 1]} {y}"


# ---------------------------------------------------------------- Instrument
CX, CY, R = 90, 96, 66
W, H = 180, 170


def pt(angle, r):
    a = math.radians(angle)
    return CX + r * math.cos(a), CY + r * math.sin(a)


def gauge_svg(value):
    sx, sy = pt(135, R)
    ex, ey = pt(405, R)
    arc = f"M{sx:.2f} {sy:.2f}A{R} {R} 0 1 1 {ex:.2f} {ey:.2f}"
    off = 100 - float(value) / 4 * 100
    ticks, labels = [], []
    for v in range(1, 5):
        ang = 135 + 67.5 * v
        x1, y1 = pt(ang, R + 4)
        x2, y2 = pt(ang, R + 11)
        ticks.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}"/>')
        lx, ly = pt(ang, R + 22)
        labels.append(f'<text class="g-tick" x="{lx:.2f}" y="{ly:.2f}">{v}</text>')
    # Startmarke (0) ohne Beschriftung, als Beginn der Skala
    x1, y1 = pt(135, R + 4)
    x2, y2 = pt(135, R + 11)
    ticks.insert(0, f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}"/>')
    return (
        f'<svg class="g-svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" aria-hidden="true" focusable="false">'
        f'<path class="g-track" d="{arc}" pathLength="100"/>'
        f'<path class="g-fill" d="{arc}" pathLength="100" style="--off:{off:.2f}"/>'
        f'<g class="g-ticks">{"".join(ticks)}</g>'
        f'<text class="g-num" x="{CX}" y="{CY + 15}" data-v="{value}">{de_num(value)}</text>'
        f'<text class="g-of" x="{CX}" y="{CY + 46}">von 4</text>'
        f'{"".join(labels)}'
        f"</svg>"
    )


def seg(level):
    return ('<span class="seg" aria-hidden="true">'
            + "".join(f'<i class="{"on" if i <= level else ""}"></i>' for i in range(1, 5))
            + "</span>")


def skills_html():
    btns, panels = [], []
    for i, g in enumerate(D["skills"]):
        vals = [it["level"] for it in g["items"]]
        m = mean1(vals)
        gid = g["id"]
        btns.append(
            f'<li><button class="gauge" type="button" id="b-{gid}" aria-expanded="true" aria-controls="p-{gid}" style="--i:{i}">'
            f'{gauge_svg(m)}'
            f'<span class="g-name">{e(g["name"])}</span>'
            f'<span class="sr">, Mittelwert {de_num(m)} von 4, {len(vals)} Kompetenzen</span>'
            f"</button></li>"
        )
        rows = []
        for it in g["items"]:
            key = '<span class="sk-key">Schlüsselkompetenz</span>' if it.get("key") else ""
            rows.append(
                f'<li class="sk"><span class="sk-a"><span class="sk-name">{e(it["name"])}</span>{key}</span>'
                f'<span class="sk-b"><span class="sk-lvl">{LEVELS[it["level"]]}</span>{seg(it["level"])}'
                f'<span class="sr"> (Stufe {it["level"]} von 4)</span></span></li>'
            )
        panels.append(
            f'<div class="panel" id="p-{gid}" role="region" aria-labelledby="h-{gid}">'
            f'<h3 id="h-{gid}">{e(g["name"])}</h3>'
            f'<p class="panel-meta">Mittelwert {de_num(m)} von 4 · {len(vals)} Kompetenzen</p>'
            f'<ul class="sk-list">{"".join(rows)}</ul></div>'
        )
    return (f'<ul class="gauges" role="list">{"".join(btns)}</ul>'
            f'<div class="panels">{"".join(panels)}</div>')


# ---------------------------------------------------------------- Erfahrung
def experience_html():
    out = []
    for n, x in enumerate(D["experience"]):
        hl = x.get("highlights") or []
        body = []
        if x.get("summary"):
            body.append(f'<p class="st-sum">{e(x["summary"])}</p>')
        if x.get("projects"):
            pr = "".join(
                f'<li class="pj"><span class="pj-y num">{mon(p["start"])} – {mon(p["end"])}</span>'
                f'<span class="pj-d">{e(p["description"])}</span></li>'
                for p in x["projects"])
            body.append(f'<ul class="pj-list" aria-label="Projekte">{pr}</ul>')
        if hl:
            lis = "".join(f"<li>{e(h)}</li>" for h in hl)
            if x.get("summary") and len(hl) > 1:
                op = " open" if n == 0 else ""
                body.append(
                    f'<details class="st-more"{op}><summary><span>Aufgaben und Ergebnisse</span>'
                    f'<span class="cnt">{len(hl)}</span><span class="pm" aria-hidden="true"></span></summary>'
                    f'<ul class="hl">{lis}</ul></details>')
            else:
                body.append(f'<ul class="hl hl-plain">{lis}</ul>')
        out.append(
            f'<li class="st">'
            f'<p class="st-y num">{years(x["start"], x["end"])}</p>'
            f'<div class="st-what"><h3 class="st-role">{e(x["role"])}</h3>'
            f'<p class="st-org">{e(x["organization"])} · {e(x["location"])}<span class="st-m"> · {mon(x["start"])} – {mon(x["end"])}</span></p>'
            f'{"".join(body)}</div></li>')
    return f'<ol class="stations" role="list">{"".join(out)}</ol>'


def education_html():
    rows = []
    for x in D["education"]:
        s = f'<p class="ed-sum">{e(x["summary"])}</p>' if x.get("summary") else ""
        rows.append(
            f'<li class="row"><span class="row-k num">{years(x["start"], x["end"])}</span>'
            f'<div class="row-v"><h3 class="ed-deg">{e(x["degree"])}</h3>'
            f'<p class="ed-org">{e(x["institution"])} · {e(x["location"])}</p>{s}</div></li>')
    return f'<ul class="rows" role="list">{"".join(rows)}</ul>'


def languages_html():
    rows = "".join(
        f'<tr><th scope="row">{e(l["name"])}</th><td class="lv">{e(l["level"])}</td>'
        f'<td class="dt">{e(l.get("detail") or "")}</td></tr>' for l in D["languages"])
    return ('<table class="lang"><caption class="sr">Sprachen mit Stufe und Detail</caption>'
            '<thead><tr><th scope="col">Sprache</th><th scope="col">Stufe</th><th scope="col">Detail</th></tr></thead>'
            f"<tbody>{rows}</tbody></table>")


def interests_html():
    items = split_top(D["interests"])
    return '<ul class="int" role="list">' + "".join(f"<li>{e(i)}</li>" for i in items) + "</ul>"


def contact_html():
    li = D["linkedin"]
    li_short = re.sub(r"^https?://(www\.)?", "", li)
    return (
        '<ul class="rows" role="list">'
        f'<li class="row"><span class="row-k">E-Mail</span><div class="row-v"><a class="tl" href="mailto:{e(D["email"])}">{e(D["email"])}</a></div></li>'
        f'<li class="row"><span class="row-k">LinkedIn</span><div class="row-v"><a class="tl" href="{e(li)}" rel="noopener">{e(li_short)}</a></div></li>'
        f'<li class="row"><span class="row-k">Ort</span><div class="row-v"><p>{e(D["location"])}</p></div></li>'
        "</ul>")


# ---------------------------------------------------------------- Brief
def letter_html():
    L = D["letter"]

    def para(items):
        out = []
        for it in items:
            if isinstance(it, str):
                out.append(f"<p>{e(it)}</p>")
            elif isinstance(it, dict) and it.get("points"):
                lis = []
                for p in it["points"]:
                    head, sep, rest = p.partition(": ")
                    if sep and len(head) <= 60:
                        lis.append(f'<li><span class="pt-h">{e(head)}</span><span class="pt-t">{e(rest)}</span></li>')
                    else:
                        lis.append(f"<li>{e(p)}</li>")
                out.append(f'<ul class="points">{"".join(lis)}</ul>')
        return "".join(out)

    rec = "".join(f"<span>{e(r)}</span>" for r in L["recipient"])
    return (
        '<article class="letter" aria-labelledby="l-subj">'
        f'<div class="l-head"><p class="l-rec">{rec}</p>'
        f'<p class="l-date">{e(L["place"])}, <time datetime="{e(L["date"])}">{de_date(L["date"])}</time></p></div>'
        f'<div class="l-body"><h2 id="l-subj" class="l-subj">{e(L["subject"])}</h2>'
        f'<p class="l-sal">{e(L["salutation"])},</p>'
        f'{para(L["attention"])}{para(L["interest"])}{para(L["desire"])}{para(L["action"])}'
        f'<p class="l-close">{e(L["closing"])}</p><p class="l-name">{e(D["name"])}</p>'
        f'<p class="l-enc"><span>Beilagen</span> {e(L["enclosures"])}</p>'
        '<p class="l-back"><a class="btn" href="#lebenslauf" data-view="lebenslauf">Zum Lebenslauf</a></p>'
        "</div></article>")


# ---------------------------------------------------------------- Seite
def scale_note():
    return " · ".join(f"{k}\u00a0{v.replace(' ', chr(160))}" for k, v in LEVELS.items())


def job_note():
    j = D["job"]
    t = re.sub(r"\s*\(m/w/d\)\s*", "", j["title"]).strip()
    t = re.sub(r"(\d)\s*%", "\\1\u00a0%", t)
    parts = ["Bewerbung", t, j["company"], j.get("location")]
    if j.get("reference"):
        parts.append(j["reference"])
    return " · ".join(e(p) for p in parts if p)


def build():
    photo, (pw, ph) = photo_uri()
    css = (HERE / "style.css").read_text(encoding="utf-8").replace("__FONT__", font_uri())
    js = (HERE / "app.js").read_text(encoding="utf-8")
    strengths = "".join(
        f'<li class="str"><h3>{e(s["title"])}</h3><p>{e(s["text"])}</p></li>' for s in D["strengths"])
    li = D["linkedin"]
    html = f"""<!doctype html>
<html lang="{e(D['lang'])}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(D['name'])} · Bewerbung {e(D['target'])} · {e(D['job']['company'])}</title>
<meta name="description" content="{e(D['headline'])}">
<meta name="color-scheme" content="dark">
<script>document.documentElement.classList.add('js')</script>
<style>{css}</style>
</head>
<body>
<a class="skip" href="#main">Zum Inhalt</a>
<div class="bar">
  <p class="bar-name">{e(D['name'])}</p>
  <div class="tabs" role="tablist" aria-label="Ansicht">
    <a class="tab" role="tab" id="t-lebenslauf" href="#lebenslauf" data-view="lebenslauf" aria-controls="lebenslauf" aria-selected="true">Lebenslauf</a>
    <a class="tab" role="tab" id="t-anschreiben" href="#anschreiben" data-view="anschreiben" aria-controls="anschreiben" aria-selected="false">Anschreiben</a>
  </div>
</div>
<main id="main">
<p class="wrap note">{job_note()}</p>

<div class="view" id="lebenslauf" role="tabpanel" aria-labelledby="t-lebenslauf">
  <section class="wrap hero" aria-labelledby="name">
    <figure class="hero-img"><img src="{photo}" width="{pw}" height="{ph}" alt="Porträt von {e(D['name'])}"></figure>
    <div class="hero-txt">
      <p class="claim">{e(D['claim'])}</p>
      <h1 id="name">{e(D['name'])}</h1>
      <p class="headline">{e(D['headline'])}</p>
      <p class="actions">
        <a class="btn" href="#" data-print>PDF</a>
        <a class="btn" href="mailto:{e(D['email'])}">E-Mail</a>
        <a class="btn" href="{e(li)}" rel="noopener">LinkedIn</a>
      </p>
    </div>
  </section>

  <section class="wrap sec" aria-labelledby="s-str">
    <h2 id="s-str" class="sec-h">Stärken</h2>
    <ul class="strengths" role="list">{strengths}</ul>
  </section>

  <section class="wrap sec split" aria-labelledby="s-prof">
    <h2 id="s-prof" class="sec-h">Profil</h2>
    <div class="split-v"><p class="profile">{e(D['profile'])}</p></div>
  </section>

  <section class="wrap sec" aria-labelledby="s-sk">
    <div class="sec-head"><h2 id="s-sk" class="sec-h">Kompetenzen</h2>
    <p class="sec-note">Mittelwert je Bereich auf der Skala {scale_note()}. Instrument wählen für die Einzelwerte.</p></div>
    {skills_html()}
  </section>

  <section class="wrap sec" aria-labelledby="s-exp">
    <h2 id="s-exp" class="sec-h">Erfahrung</h2>
    {experience_html()}
  </section>

  <section class="wrap sec split" aria-labelledby="s-edu">
    <h2 id="s-edu" class="sec-h">Ausbildung</h2>
    <div class="split-v">{education_html()}</div>
  </section>

  <section class="wrap sec split" aria-labelledby="s-lang">
    <h2 id="s-lang" class="sec-h">Sprachen</h2>
    <div class="split-v">{languages_html()}</div>
  </section>

  <section class="wrap sec split" aria-labelledby="s-int">
    <h2 id="s-int" class="sec-h">Interessen</h2>
    <div class="split-v">{interests_html()}</div>
  </section>

  <section class="wrap sec split" aria-labelledby="s-con">
    <h2 id="s-con" class="sec-h">Kontakt</h2>
    <div class="split-v">{contact_html()}</div>
  </section>
</div>

<div class="view" id="anschreiben" role="tabpanel" aria-labelledby="t-anschreiben">
  <div class="wrap">{letter_html()}</div>
</div>
</main>
<footer class="wrap foot"><p>{e(D['name'])} · {e(D['location'])}</p></footer>
<script>{js}</script>
</body>
</html>
"""
    (HERE / "index.html").write_text(html, encoding="utf-8")
    print("ok", len(html) // 1024, "KB")


if __name__ == "__main__":
    build()
