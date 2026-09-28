#!/usr/bin/env python3
"""Build fpub/finanz-oeffentlich/index.html ("Bankdossier") from fpub/data/finanz-oeffentlich.json.

All content comes from the JSON. Only section labels and UI words are written here.
"""
import base64, io, json, pathlib, datetime
from html import escape
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
D = json.loads((ROOT / 'data' / 'finanz-oeffentlich.json').read_text(encoding='utf-8'))

import re
def nobr(s):  # keep number ranges like 80–100% together
    return re.sub(r'(\d+–\d+%?)', r'<span class="nw">\1</span>', s)

def e(s):
    return escape(str(s), quote=True)

# ---------- assets ----------
font_b64 = base64.b64encode((ROOT / 'fonts' / 'source-serif-4-latin-400-normal.woff2').read_bytes()).decode()
img = Image.open(ROOT / D['photo']).convert('RGB')
if img.width > 600:
    img = img.resize((600, round(img.height * 600 / img.width)), Image.LANCZOS)
buf = io.BytesIO(); img.save(buf, 'JPEG', quality=82, optimize=True)
photo_b64 = base64.b64encode(buf.getvalue()).decode()

# ---------- helpers ----------
LEVELS = {1: 'Basic', 2: 'Some experience', 3: 'Experienced', 4: 'Specialist'}
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
          'September', 'October', 'November', 'December']

def mm(ym):  # "2023-12" -> "12.2023"
    if not ym:
        return 'today'
    y, m = ym.split('-')[:2]
    return f'{m}.{y}'

def span(a, b):
    return f'{mm(a)} – {mm(b)}'

def span_br(a, b):  # two-line register date
    return f'<span class="d1">{mm(a)}&#160;–</span> <span class="d2">{mm(b)}</span>'

names = {x['id']: x['organization'] for x in D['experience']}
names.update({x['id']: x['institution'] for x in D['education']})

def ext_link(href, text, cls='tl'):
    return f'<a class="{cls}" href="{e(href)}">{text}</a>'

li_short = D['linkedin'].replace('https://www.', '').replace('https://', '')
job = D['job']

# ---------- header note ----------
note_parts = ['Application', e(D['target']), e(job['company'])]
if job.get('reference'):
    note_parts.append('Ref.&#8201;' + e(job['reference']))
note = ' <span class="sep" aria-hidden="true">·</span> '.join(note_parts)

buttons = (
    '<div class="btns">'
    '<a class="btn" href="#" data-print>PDF</a>'
    f'<a class="btn" href="mailto:{e(D["email"])}">Email</a>'
    f'<a class="btn" href="{e(D["linkedin"])}">LinkedIn</a>'
    '</div>'
)

# ---------- strengths ----------
def strengths():
    out = []
    for s in D['strengths']:
        ev = ' · '.join(e(names[i]) for i in s.get('evidence', []) if i in names)
        out.append(
            '<li class="str">'
            f'<h3>{e(s["title"])}</h3>'
            f'<p>{e(s["text"])}</p>'
            + (f'<p class="ev"><span class="vh">Evidence: </span>{ev}</p>' if ev else '')
            + '</li>')
    return '<ul class="strs" role="list">' + ''.join(out) + '</ul>'

# ---------- skills rating table ----------
def skills():
    head = ('<thead><tr><th scope="col" class="c-sk">Skill</th>'
            + ''.join(f'<th scope="col" class="c-lv"><span class="lf">{LEVELS[i]}</span>'
                      f'<span class="ln" aria-hidden="true">{i}</span></th>' for i in range(1, 5))
            + '</tr></thead>')
    bodies = []
    for g in D['skills']:
        rows = [f'<tr class="grp"><th colspan="5" scope="colgroup">{e(g["name"])}</th></tr>']
        for it in g['items']:
            lv = int(it['level'])
            cells = []
            for i in range(1, 5):
                if i < lv:
                    cells.append('<td class="t"></td>')
                elif i == lv:
                    cells.append('<td class="t e"><span class="mk"></span></td>')
                else:
                    cells.append('<td></td>')
            rows.append(
                f'<tr class="sk"><th scope="row"><span class="nm">{e(it["name"])}</span>'
                f'<span class="lv"><span class="vh">: </span>{LEVELS[lv]}</span></th>'
                + ''.join(cells) + '</tr>')
        bodies.append('<tbody>' + ''.join(rows) + '</tbody>')
    legend = ('<p class="legend" aria-hidden="true">'
              + ' <span class="sep">·</span> '.join(f'{i}&#8201;{LEVELS[i]}' for i in range(1, 5))
              + '</p>')
    table = ('<table class="rt">'
             '<caption class="vh">Skills rated on a four-step scale: 1 Basic, 2 Some experience, 3 Experienced, 4 Specialist</caption>'
             + head + ''.join(bodies) + '</table>')
    also = ''
    if D.get('knowledge'):
        rows = ''.join(f'<div class="also-r"><dt>{e(k["name"])}</dt><dd>{" · ".join(e(x) for x in k["items"])}</dd></div>'
                       for k in D['knowledge'])
        also = f'<div class="also"><p class="also-h">Also:</p><dl>{rows}</dl></div>'
    return legend + table + also

# ---------- experience register ----------
def experience():
    out = []
    for i, x in enumerate(D['experience']):
        org = f'{e(x["organization"])}, {e(x["location"])}'
        cls = 'reg' + (' reg-c' if x.get('compact') else '') + (' act' if i == 0 else '')
        if x.get('compact'):
            out.append(
                f'<li class="{cls}"><div class="rb"><p class="rc"><span class="role">{e(x["role"])}</span>'
                f'<span class="rcs" aria-hidden="true"> · </span><span class="org">{org}</span></p></div>'
                f'<p class="dt">{span(x["start"], x["end"])}</p></li>')
            continue
        body = [f'<h3>{e(x["role"])}</h3>', f'<p class="org">{org}</p>']
        dt = f'<p class="dt">{span_br(x["start"], x["end"])}</p>'
        if x.get('summary'):
            body.append(f'<p class="sum">{e(x["summary"])}</p>')
        if x.get('projects'):
            pr = ''.join(f'<li class="prj"><p class="pd">{span(p["start"], p["end"])}</p>'
                         f'<p class="pt">{e(p["description"])}</p></li>' for p in x['projects'])
            body.append(f'<ul class="prjs" role="list">{pr}</ul>')
        if x.get('highlights'):
            body.append('<ul class="hl" role="list">' + ''.join(f'<li>{e(h)}</li>' for h in x['highlights']) + '</ul>')
        out.append(f'<li class="{cls}"><div class="rb">{"".join(body)}</div>{dt}</li>')
    return '<ol class="regs" role="list" reversed>' + ''.join(out) + '</ol>'

# ---------- facts ----------
def facts():
    contact = (
        '<section class="fb" aria-labelledby="h-con"><h2 id="h-con">Contact</h2>'
        f'<p class="loc">{e(D["location"])}</p>'
        f'<p>{ext_link("mailto:" + D["email"], e(D["email"]))}</p>'
        f'<p>{ext_link(D["linkedin"], e(li_short))}</p></section>')
    langs = ''.join(f'<div class="kv"><dt>{e(l["name"])}</dt><dd>{e(l["level"])}</dd></div>' for l in D['languages'])
    langs = f'<section class="fb" aria-labelledby="h-lan"><h2 id="h-lan">Languages</h2><dl class="kvs">{langs}</dl></section>'
    edu = ''.join(
        f'<li><p class="deg">{e(x["degree"])}</p><p class="ins">{e(x["institution"])}, {e(x["location"])}</p>'
        f'<p class="yr">{span(x["start"], x["end"])}</p></li>' for x in D['education'])
    edu = f'<section class="fb" aria-labelledby="h-edu"><h2 id="h-edu">Education</h2><ul class="edu" role="list">{edu}</ul></section>'
    intr = f'<section class="fb" aria-labelledby="h-int"><h2 id="h-int">Interests</h2><p>{e(D["interests"])}</p></section>'
    return contact + langs + edu + intr

# ---------- letter ----------
def letter():
    L = D['letter']
    dte = datetime.date.fromisoformat(L['date'])
    date_s = f'{e(L["place"])}, {dte.day} {MONTHS[dte.month - 1]} {dte.year}'
    paras = []
    for key in ('attention', 'interest', 'desire', 'action'):
        for p in L.get(key) or []:
            if isinstance(p, dict) and p.get('points'):
                paras.append('<ul class="pts" role="list">' + ''.join(f'<li>{e(x)}</li>' for x in p['points']) + '</ul>')
            elif isinstance(p, str):
                paras.append(f'<p>{e(p)}</p>')
    sender = (f'<address class="snd"><span>{e(D["name"])}</span><span>{e(D["location"])}</span>'
              f'<span>{ext_link("mailto:" + D["email"], e(D["email"]))}</span>'
              f'<span>{ext_link(D["linkedin"], e(li_short))}</span></address>')
    rcp = '<p class="rcp">' + '<br>'.join(e(x) for x in L['recipient']) + '</p>'
    return (
        '<article class="sheet" aria-labelledby="l-subj">'
        f'{sender}{rcp}'
        f'<p class="ld"><time datetime="{e(L["date"])}">{date_s}</time></p>'
        f'<h3 class="subj" id="l-subj">{nobr(e(L["subject"]))}</h3>'
        f'<p>{e(L["salutation"])},</p>'
        + ''.join(paras) +
        f'<p class="cl">{e(L["closing"])}</p>'
        f'<p class="sig">{e(D["name"])}</p>'
        f'<p class="enc"><span class="enc-l">Enclosures</span> {e(L["enclosures"])}</p>'
        '</article>')

CSS = r"""
@font-face{font-family:"Source Serif 4";src:url(data:font/woff2;base64,__FONT__) format("woff2");font-weight:400;font-style:normal;font-display:swap}
:root{--paper:#ffffff;--ink:#000000;--meta:#595959;--line:#d9d9d9;--track:#8c8c8c;--red:#0b5d6b;--wash:#f5f5f5;--gut:16px}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font-family:"Source Serif 4",Georgia,serif;font-weight:400;font-size:17px;line-height:1.45;font-variant-numeric:lining-nums tabular-nums;font-kerning:normal;border-top:3px solid var(--red)}
h1,h2,h3,p,ul,ol,dl,dd,figure{margin:0;padding:0}
h1,h2,h3{font-weight:400}
ul,ol{list-style:none}
button,input{font:inherit}
a{color:inherit;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;text-decoration-color:var(--ink)}
a:hover{text-decoration-color:var(--red);text-decoration-thickness:2px}
a:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.vh{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
address{font-style:normal}
.wrap{max-width:1200px;margin:0 auto;padding:0 var(--gut)}

/* note bar */
.note{border-bottom:1px solid var(--line)}
.note p{font-size:16px;color:var(--meta);padding:10px 0 11px}
.note .sep{padding:0 .15em}

/* header */
.hd{display:grid;grid-template-columns:72px minmax(0,1fr);column-gap:16px;padding:20px 0 0;align-items:start}
.ph{background:#ececec url(data:image/jpeg;base64,__PHOTO__) center 22%/cover no-repeat;border-radius:4px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hd .ph{width:72px;height:90px}
.hd h1{font-size:30px;line-height:1.1;letter-spacing:-.005em;margin-top:-2px}
.hd .hl1{font-size:17px;color:var(--meta);margin-top:6px}
.btns{grid-column:1/-1;display:flex;gap:8px;margin-top:18px}
.btn{flex:1 1 0;display:inline-flex;align-items:center;justify-content:center;min-height:44px;min-width:44px;padding:0 18px;border:1px solid var(--ink);border-radius:0;text-decoration:none;font-size:17px;background:var(--paper)}
.btn:hover{background:var(--wash);text-decoration:underline;text-decoration-color:var(--red);text-decoration-thickness:2px}
.btn:focus-visible{outline:2px solid var(--ink);outline-offset:2px}

/* layout */
.dossier{display:block}
.side .ph{display:none}
.sec{padding:28px 0 30px;border-top:1px solid var(--line)}
.hd + .sec{margin-top:24px}
.sec > h2{font-size:24px;line-height:1.2;margin-bottom:14px;display:flex;gap:.55em;align-items:baseline}
.sec > h2 .no{color:var(--meta)}

/* profile */
.claim{font-size:21px;line-height:1.35;max-width:32em;margin-bottom:12px}
.prof{max-width:38em}

/* strengths */
.strs{display:grid;gap:22px}
.str{border-top:2px solid var(--red);padding-top:12px}
.str h3{font-size:19px;line-height:1.25;margin-bottom:6px}
.str .ev{color:var(--meta);font-size:16px;margin-top:8px}

/* rating table */
.legend{font-size:16px;color:var(--meta);margin-bottom:10px}
.legend .sep{padding:0 .1em}
.rt{width:100%;border-collapse:collapse;font-size:16px;line-height:1.35}
.rt,.rt thead,.rt tbody{display:block}
.rt tr{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.rt thead .c-sk{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.rt thead th{font-weight:400;color:var(--meta);text-align:center;padding:4px 0 6px;border-bottom:1px solid var(--ink)}
.rt .lf{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rt tr.grp th{grid-column:1/-1;text-align:left;font-weight:400;padding:5px 8px 6px;background:var(--wash);border-bottom:1px solid var(--line)}
.rt tbody + tbody tr.grp th{border-top:14px solid var(--paper)}
.rt tr.sk th{grid-column:1/-1;text-align:left;font-weight:400;display:flex;justify-content:space-between;gap:12px;padding:9px 0 2px}
.rt tr.sk .lv{color:var(--meta);white-space:nowrap}
.rt td{position:relative;height:26px;padding:0}
.rt tr.sk{border-bottom:1px solid var(--line)}
.rt tr.sk td:nth-child(2){margin-left:0}
.rt td.t::before{content:"";position:absolute;left:0;right:0;top:50%;border-top:1px solid var(--track)}
.rt td.e::before{right:50%}
.rt td::after{content:"";position:absolute;left:50%;top:50%;height:9px;margin-top:-4px;border-left:1px solid var(--line)}
.mk{position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;background:var(--red);z-index:1}
.also{margin-top:22px;font-size:16px}
.also-h{color:var(--meta);margin-bottom:4px}
.also-r{padding:6px 0;border-top:1px solid var(--line)}
.also-r:last-child{border-bottom:1px solid var(--line)}
.also dt{color:var(--meta)}

/* experience register */
.regs{border-top:1px solid var(--ink)}
.reg{display:flex;flex-direction:column;padding:16px 0 18px;border-bottom:1px solid var(--line);position:relative}
.reg h3{font-size:19px;line-height:1.25}
.reg .org{margin-top:2px}
.reg .dt{font-size:16px;color:var(--meta);order:0;margin-bottom:6px}
.reg .rb{order:1}
.reg .sum{margin-top:8px;max-width:38em}
.hl{margin-top:8px;max-width:38em}
.hl li,.pts li{position:relative;padding-left:1.1em}
.hl li + li{margin-top:3px}
.hl li::before,.pts li::before{content:"–";position:absolute;left:0;color:var(--meta)}
.prjs{margin-top:10px;border-left:1px solid var(--line);padding-left:14px}
.prj + .prj{margin-top:10px}
.prj .pd{font-size:16px;color:var(--meta)}
.reg-c{padding:12px 0 13px}
.reg-c .rc{display:flex;flex-wrap:wrap;column-gap:0}
.reg-c .rcs{display:none}
.reg-c .org{display:block;width:100%;margin-top:0}
.act .dt{color:var(--ink)}
.act .dt::before{content:"";display:inline-block;width:8px;height:8px;background:var(--red);margin-right:8px;vertical-align:1px}

/* facts */
.side{padding:4px 0 8px}
.facts{display:grid;gap:0}
.fb{padding:20px 0 22px;border-top:1px solid var(--line);font-size:16px}
.fb h2{font-size:17px;line-height:1.3;margin-bottom:8px}
.fb .tl{display:inline-flex;align-items:center;min-height:44px;overflow-wrap:anywhere}
.fb .loc{margin-bottom:2px}
.kvs .kv{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid var(--line)}
.kvs .kv:first-child{border-top:1px solid var(--line)}
.kvs dd{color:var(--meta)}
.edu li + li{margin-top:12px}
.edu .ins,.edu .yr{color:var(--meta)}

/* letter */
.letter{background:var(--wash);border-top:1px solid var(--line);padding:30px 0 40px;margin-top:8px}
.letter > .wrap > h2{font-size:24px;line-height:1.2;margin-bottom:16px;display:flex;gap:.55em;align-items:baseline}
.letter h2 .no{color:var(--meta)}
.sheet{background:var(--paper);border:1px solid var(--line);padding:28px 20px 32px;max-width:720px;display:flex;flex-direction:column}
.sheet p + p,.sheet ul + p,.sheet p + ul{margin-top:12px}
.snd{display:flex;flex-direction:column;font-size:16px;color:var(--meta);align-self:flex-end;text-align:right;margin-bottom:28px}
.snd .tl{display:inline-flex;align-items:center;min-height:44px;color:var(--ink);overflow-wrap:anywhere}
.snd span:first-child{color:var(--ink)}
.sheet .rcp{margin:0 0 24px}
.sheet .ld{align-self:flex-end;text-align:right;margin:0 0 24px}
.subj{font-size:17px;line-height:1.45;border-bottom:1px solid var(--ink);padding-bottom:10px;margin-bottom:18px;align-self:stretch}
.sheet p{max-width:36em}
.pts{max-width:36em}
.pts li + li{margin-top:8px}
.sheet .cl{margin-top:22px}
.sheet .sig{margin-top:36px}
.sheet .enc{margin-top:26px;padding-top:10px;border-top:1px solid var(--line);font-size:16px;color:var(--meta)}
.enc-l{color:var(--ink);margin-right:.4em}
@media (max-width:599px){.sheet{margin:0 calc(-1 * var(--gut));border-left:0;border-right:0;padding:24px var(--gut) 28px}}
.nw{white-space:nowrap}
.foot{padding:18px 0 28px;font-size:16px;color:var(--meta)}

/* motion (only with JS, only when allowed) */
@media (prefers-reduced-motion: no-preference){
  html.js .rv{opacity:0;transform:translateY(8px);transition:opacity 300ms ease-out,transform 300ms ease-out}
  html.js .rv.in{opacity:1;transform:none}
  html.js .rt .mk{opacity:0}
  html.js .rt.go .mk{opacity:1;transition:transform 400ms cubic-bezier(.2,.7,.2,1),opacity 120ms linear}
}

/* >= 600: register gets its date column */
@media (min-width:600px){
  :root{--gut:32px}
  .reg{display:grid;grid-template-columns:7rem minmax(0,1fr);column-gap:24px}
  .reg .dt{grid-column:1;grid-row:1;margin:3px 0 0}
  .reg .rb{grid-column:2;grid-row:1}
  .reg .d1,.reg .d2{display:block}
  .reg-c .dt{margin-top:0}
  .act .dt::before{position:absolute;left:-16px;top:25px;margin:0}
  .prj{display:grid;grid-template-columns:8.6rem minmax(0,1fr);column-gap:14px}
  .sheet{padding:44px 48px 48px}
  .strs{grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
}

/* >= 768: tablet */
@media (min-width:768px){
  .hd{grid-template-columns:96px minmax(0,1fr);column-gap:24px;padding-top:28px}
  .hd .ph{width:96px;height:120px}
  .hd h1{font-size:38px}
  .hd .hl1{font-size:19px}
  .btns{grid-column:2;margin-top:16px}
  .btn{flex:0 0 auto;min-width:112px}
  .facts{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:32px}
  .legend{display:none}
  .rt{display:table;font-size:16px}
  .rt thead{display:table-header-group}
  .rt tbody{display:table-row-group}
  .rt tr{display:table-row}
  .rt thead .c-sk{position:static;width:auto;height:auto;overflow:visible;clip:auto;text-align:left}
  .rt .lf{position:static;width:auto;height:auto;overflow:visible;clip:auto;white-space:normal}
  .rt .ln{display:none}
  .rt thead th{vertical-align:bottom;padding:0 4px 8px;line-height:1.25}
  .rt thead th.c-sk{padding-left:0}
  .rt thead th.c-lv{width:13%}
  .rt tr.grp th{display:table-cell;padding:5px 8px 6px}
  .rt tr.sk th{display:table-cell;padding:8px 16px 8px 0;vertical-align:middle}
  .rt tr.sk .lv{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
  .rt tr.sk td{height:auto;border-bottom:1px solid var(--line)}
  .rt tr.sk th{border-bottom:1px solid var(--line)}
}
@media (min-width:600px) and (max-width:767px){
  .strs{grid-template-columns:1fr}
}

/* >= 1024: dossier, two columns */
@media (min-width:1024px){
  .dossier{display:grid;grid-template-columns:minmax(232px,280px) minmax(0,720px);column-gap:clamp(40px,5vw,80px);align-items:start}
  .main{grid-column:2;grid-row:1}
  .side{grid-column:1;grid-row:1;position:sticky;top:0;padding:28px 0 24px}
  .side .ph{display:block;width:144px;height:180px;margin-bottom:22px}
  .hd{display:block;padding-top:28px}
  .hd .ph{display:none}
  .hd h1{font-size:44px}
  .btns{margin-top:18px}
  .facts{display:block}
  .fb{padding:14px 0 16px}
  .fb:first-child{border-top:1px solid var(--ink)}
  .fb .tl{min-height:44px}
  .edu li + li{margin-top:8px}
  .letter .wrap{display:grid;grid-template-columns:minmax(232px,280px) minmax(0,720px);column-gap:clamp(40px,5vw,80px)}
  .letter > .wrap > h2{grid-column:1;align-self:start;padding-top:2px}
  .letter .sheet{grid-column:2}
  .letter{padding:44px 0 56px}
  .foot .wrap{display:grid;grid-template-columns:minmax(232px,280px) minmax(0,720px);column-gap:clamp(40px,5vw,80px)}
  .foot p{grid-column:2}
}

@media print{
  @page{margin:16mm}
  body{border-top:0;font-size:11pt;color:#000;background:#fff}
  .btns,.side .ph{display:none!important}
  .rv,.rt .mk{opacity:1!important;transform:none!important;transition:none!important}
  .dossier,.letter .wrap,.foot .wrap{display:block!important}
  .side{position:static!important}
  .hd{display:grid!important;grid-template-columns:72px 1fr!important}
  .hd .ph{display:block!important;width:72px;height:90px}
  .letter{background:#fff;padding:0}
  .sheet{border:0;padding:0;max-width:none;break-before:page}
  a{text-decoration:none}
  .reg-c,.fb,.rt tr,.also-r{break-inside:avoid-page}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .sec > h2,.rt tr.grp{break-after:avoid-page}
  :root{--red:#000;--meta:#404040}
  .str .ev{break-before:avoid-page}
}
"""

JS = r"""
(function(){
  var d=document, h=d.documentElement;
  var p=d.querySelector('[data-print]');
  if(p) p.addEventListener('click',function(ev){ev.preventDefault();window.print();});
  var side=d.querySelector('.side');
  function stick(){ if(!side) return; if(innerWidth<1024){side.style.top='';return;}
    side.style.top=Math.min(0, innerHeight-side.offsetHeight)+'px'; }
  stick(); addEventListener('resize',stick);
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!('IntersectionObserver' in window)){h.classList.remove('js');return;}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
  },{rootMargin:'0px 0px -8% 0px',threshold:0.01});
  d.querySelectorAll('.rv').forEach(function(el){io.observe(el);});
  var t=d.querySelector('.rt');
  if(t){
    var to=new IntersectionObserver(function(es){
      es.forEach(function(en){
        if(!en.isIntersecting) return; to.disconnect();
        var marks=t.querySelectorAll('.mk');
        marks.forEach(function(m){
          var row=m.closest('tr'), first=row.querySelector('td');
          var dx=m.getBoundingClientRect().left-first.getBoundingClientRect().left;
          m.style.transform='translateX('+(-dx)+'px)';
        });
        t.getBoundingClientRect();
        requestAnimationFrame(function(){requestAnimationFrame(function(){
          t.classList.add('go');
          marks.forEach(function(m){m.style.transform='';});
        });});
      });
    },{threshold:0.15});
    to.observe(t);
  }
})();
"""

def page():
    L = D['letter']
    css = CSS.replace('__FONT__', font_b64).replace('__PHOTO__', photo_b64)
    title = f'{D["name"]} · {D["target"]} · {job["company"]}'
    return f"""<!doctype html>
<html lang="{e(D['lang'])}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<script>document.documentElement.classList.add('js')</script>
<style>{css}</style>
</head>
<body>
<header class="note"><div class="wrap"><p>{note}</p></div></header>
<div class="wrap dossier">
<main class="main" id="main">
<div class="hd">
<div class="ph" role="img" aria-label="Portrait of {e(D['name'])}"></div>
<div class="hdt"><h1>{e(D['name'])}</h1><p class="hl1">{e(D['headline'])}</p></div>
{buttons}
</div>
<section class="sec rv" aria-labelledby="h-pro"><h2 id="h-pro"><span class="no">1</span><span>Profile</span></h2>
<p class="claim">{e(D['claim'])}</p><p class="prof">{e(D['profile'])}</p></section>
<section class="sec rv" aria-labelledby="h-str"><h2 id="h-str"><span class="no">2</span><span>Core strengths</span></h2>{strengths()}</section>
<section class="sec rv" aria-labelledby="h-sk"><h2 id="h-sk"><span class="no">3</span><span>Skills</span></h2>{skills()}</section>
<section class="sec rv" aria-labelledby="h-exp"><h2 id="h-exp"><span class="no">4</span><span>Experience</span></h2>{experience()}</section>
</main>
<aside class="side" aria-label="Facts">
<div class="ph" aria-hidden="true"></div>
<div class="facts">{facts()}</div>
</aside>
</div>
<section class="letter" aria-labelledby="h-let"><div class="wrap">
<h2 id="h-let"><span class="no">5</span><span>Letter of motivation</span></h2>
<div class="rv">{letter()}</div>
</div></section>
<footer class="foot"><div class="wrap"><p>{e(D['name'])} · {e(D['location'])}</p></div></footer>
<script>{JS}</script>
</body>
</html>
"""

(HERE / 'index.html').write_text(page(), encoding='utf-8')
print('ok', (HERE / 'index.html').stat().st_size, 'bytes')
