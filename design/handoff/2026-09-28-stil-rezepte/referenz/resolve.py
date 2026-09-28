import yaml, json, pathlib, datetime
R=pathlib.Path('data')  # Musterdaten des Repos
cv=yaml.safe_load((R/'cv.yaml').read_text())
def tr(x,l):
    if isinstance(x,dict) and set(x)<= {'de','en'} and x: return x.get(l) or x.get('en')
    if isinstance(x,dict): return {k:tr(v,l) for k,v in x.items()}
    if isinstance(x,list): return [tr(v,l) for v in x]
    if isinstance(x,(datetime.date,)): return x.isoformat()
    return x
def ym(v):
    if v is None: return None
    if isinstance(v,datetime.date): return v.strftime('%Y-%m')
    return str(v)
SKILLSEL={'finanz-oeffentlich':['skills-cloud','skills-architecture','skills-security','skills-methods'],
 'tech-produkt':['skills-cloud','skills-data-ai','skills-architecture','skills-soft','skills-methods'],
 'beratung-sales':['skills-architecture','skills-cloud','skills-soft','skills-methods','skills-data-ai']}
def build(key,path,lang=None):
    a=yaml.safe_load((R/path).read_text()); l=lang or a.get('language','de')
    base={e['id']:e for e in cv['experience']}
    exps=[]
    for o in a.get('experience',[{'id':e['id']} for e in cv['experience']]):
        e=dict(base[o['id']]); e.update({k:v for k,v in o.items()})
        e['start']=ym(e.get('start')); e['end']=ym(e.get('end'))
        for p in e.get('projects',[]) or []: p['start']=ym(p.get('start')); p['end']=ym(p.get('end'))
        e.pop('note',None); e.pop('tags',None)
        exps.append(tr(e,l))
    edu=[]
    for e in cv['education']:
        e=dict(e); e['start']=ym(e['start']); e['end']=ym(e['end']); e.pop('tags',None); e.pop('note',None); edu.append(tr(e,l))
    if 'skills' in a:
        skills=[{'id':g['id'],'name':tr(g['name'],l),'items':[{'name':tr(i['name'],l),'level':i['level'],'key':i.get('key',False),'refs':[r for r in i.get('evidence',[]) if r not in('letter','az-305')]} for i in g['items']]} for g in a['skills']]
    else:
        gs={g['id']:g for g in cv['skills']}
        skills=[{'id':gid,'name':tr(gs[gid]['name'],l),'items':[{'name':tr(i['name'],l),'level':i['level'],'refs':[r for r in i.get('refs',[]) if r!='az-305']} for i in gs[gid]['items']]} for gid in SKILLSEL[key]]
    p=cv['profile']
    d={'key':key,'lang':l,'name':p['name'],
       'target':tr(a.get('target'),l),'headline':tr(a.get('headline'),l) or tr(p['headline'],l),
       'claim':tr(a.get('claim'),l),'profile':tr(a.get('profile') or a.get('summary'),l) or tr(p['summary'],l),
       'strengths':tr(a.get('strengths') or a.get('usp'),l),
       'location':tr(p['location'],l),'email':[x['url'] for x in p['links'] if x['url'].startswith('mailto:')][0][7:],'linkedin':[x['url'] for x in p['links'] if not x['url'].startswith('mailto:')][0],
       'job':{k:v for k,v in (a.get('job') or {}).items() if k in('title','company','location','reference')},
       'brand':{k:v for k,v in (a.get('brand') or {}).items() if k!='source'},
       'photo':(a.get('photo') or p['photo'])['src'],
       'experience':exps,'education':edu,'skills':skills,
       'knowledge':a.get('knowledge'),
       'languages':[tr({k:v for k,v in x.items() if k!='id'},l) for x in cv['languages']],
       'interests':a.get('interests') or tr(p['interests'],l),
       'letter':tr(a.get('letter'),l)}
    if d['letter'] and d['letter'].get('date'): d['letter']['date']=str(d['letter']['date'])
    return d
out=pathlib.Path('design/handoff/2026-09-28-stil-rezepte/referenz/data'); out.mkdir(exist_ok=True)
for k,pth,l in [('finanz-oeffentlich','applications/beispielbank-senior-cloud-architect.yaml',None),('tech-produkt','applications/nimbus-customer-success-account-manager.yaml',None),('beratung-sales','applications/globex-technology-strategy-manager.yaml',None),('technische-daten','profiles/beispiel-automobile.yaml','de'),('mensch-kreativ','profiles/product-manager.yaml','de')]:
    d=build(k,pth,l)
    if k=='mensch-kreativ':
        d['target']='Product Owner HR-Plattform'
        d['job']={'title':'Product Owner HR-Plattform 80–100 %','company':'Kolibri People AG','location':'Winterthur'}
        d['brand']={'paper':'#fbf7f1','ink':'#2b211b','accent':'#b4462a','marks':['#e07a5f','#f2cc8f','#81b29a']}
        d['letter']=None
    t=json.dumps(d,ensure_ascii=False,indent=1,default=str)
    (out/f'{k}.json').write_text(t)
    print(k,d['lang'],d['photo'],len(d['experience']),[len(g['items']) for g in d['skills']],bool(d['letter']),d['brand'])
