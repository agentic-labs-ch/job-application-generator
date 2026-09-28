import pathlib, sys
from playwright.sync_api import sync_playwright
R=pathlib.Path(__file__).parent
KEYS=['finanz-oeffentlich','beratung-sales','tech-produkt','mensch-kreativ','technische-daten']
JS='''()=>{const f=new Set(),w=new Set();let min=99,small=0;for(const e of document.querySelectorAll('body *')){const c=getComputedStyle(e);if(c.display=='none'||c.visibility=='hidden')continue;const r=e.getBoundingClientRect();if(!r.width)continue;if([...e.childNodes].some(t=>t.nodeType==3&&t.textContent.trim())){f.add(c.fontFamily.split(',')[0]);w.add(c.fontWeight);min=Math.min(min,parseFloat(c.fontSize))}}
for(const a of document.querySelectorAll('a[href],button,summary,[role=tab]')){const r=a.getBoundingClientRect();if(r.width&&(r.width<43.5||r.height<43.5)&&getComputedStyle(a).visibility!='hidden'&&!a.classList.contains('skip')&&!a.classList.contains('skip-link'))small++}
return {fam:[...f],w:[...w],min,small,sw:document.documentElement.scrollWidth,iw:innerWidth}}'''
with sync_playwright() as p:
    b=p.chromium.launch()
    for k in KEYS:
        for w in [320,375,768,1440]:
            pg=b.new_page(viewport={'width':w,'height':900}); pg.goto((R/k/'index.html').as_uri()); pg.wait_for_timeout(800)
            h=pg.evaluate('document.body.scrollHeight')
            for y in range(0,h,600): pg.evaluate(f'scrollTo(0,{y})'); pg.wait_for_timeout(60)
            pg.evaluate('scrollTo(0,0)'); pg.wait_for_timeout(900)
            r=pg.evaluate(JS); print(k,w,r)
            if w in (375,1440): pg.screenshot(path=str(R/k/f'ref-{w}.png'),full_page=True)
            pg.close()
    b.close()
