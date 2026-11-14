import json, re, html, unicodedata, os, shutil
D=json.load(open('datos.json')); F=json.load(open('/home/claude/dtorh-sitio/cual/fichas.json'))
EQ=D['eq']; E={e['id']:e for e in EQ}; ORD=[e['id'] for e in EQ]
ML={'ip18pm':'1RWHeMs','ip18p':'2rWVHpN','ip17pm':'2UTkbN5','ip17p':'2nXW4uf','ip17':'2uuU9GU','ip16':'28aCFpo','s26u':'1P7njEd','s25u':'1oUGwKG','s25':'19Wbmhz','a57':'2VJe9vF','x17t':'1MSRdS8','rn15p':'1mKGkH7','rn17':'2LWcbVN','px8p':'1bqzymo','e70f':'1W2Aqxa','e60f':'1hAtoYv','reno16f':'2vbyvUB','oa6':'2mTmSad','honx8d':'2g5tXLd'}
MARCA={'Google':'Google ','Apple':'','Samsung':'Samsung ','Xiaomi':'Xiaomi ','Motorola':'Motorola ','Huawei':'Huawei ','OPPO':'OPPO ','vivo':'vivo ','Honor':'Honor '}
def full(e): n=e['n']; return n if n.lower().startswith(e['m'].lower()) or e['m']=='Apple' and n.startswith('iPhone') else MARCA.get(e['m'],e['m']+' ')+n
def slug(t): t=unicodedata.normalize('NFKD',t).encode('ascii','ignore').decode().lower(); return re.sub(r'[^a-z0-9]+','-',t).strip('-')
SL={i:slug(full(E[i])) for i in ORD}
assert len(set(SL.values()))==len(SL)
h=html.escape
OUT='/home/claude/dtorh-sitio/cual/comparar'
if os.path.exists(OUT): shutil.rmtree(OUT)
os.makedirs(OUT)
CSS=open('estilo.css').read()
def page(title,desc,canon,og,body,ld):
    return f'''<!DOCTYPE html><html lang="es-CO"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{h(title)}</title><meta name="description" content="{h(desc)}"><link rel="canonical" href="{canon}"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website"><meta property="og:site_name" content="Cuál"><meta property="og:locale" content="es_CO"><meta property="og:title" content="{h(title)}"><meta property="og:description" content="{h(desc)}"><meta property="og:url" content="{canon}"><meta property="og:image" content="{og}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="/fonts/manrope.woff2" as="font" type="font/woff2" crossorigin>
<script type="application/ld+json">{json.dumps(ld,ensure_ascii=False)}</script><style>{CSS}</style></head><body>
<header class="top"><a class="logo" href="/" aria-label="Cuál, inicio"><i></i><span>cuál<small>.click</small></span></a><a class="ir" href="/">Comparar otros</a></header>
<main>{body}</main>
<footer class="pie"><span>Cuál es un producto de <a href="https://dtorh.click/">dtorh™</a>. No vendemos equipos. Datos de fichas técnicas públicas revisadas por dtorh; puntajes propios de referencia.</span>
<span class="redes"><a href="https://www.instagram.com/cual.click/" rel="me">Instagram</a> · <a href="https://www.facebook.com/cual.click" rel="me">Facebook</a> · <a href="https://www.youtube.com/@cualclick" rel="me">YouTube</a> · <a href="/comparar/">Todas las comparaciones</a></span></footer>
</body></html>'''
BASE='https://cual.click'
urls=[]
JS='''<script>
(function(){var ids=[%s];function cop(n){return '$'+n.toLocaleString('es-CO')}
fetch('https://motor-dtorh.dtorh-ofc.workers.dev/cual/precios').then(function(r){return r.ok?r.json():null}).then(function(j){if(!j||!j.precios)return;
ids.forEach(function(id){var d=j.precios[id],el=document.getElementById('p-'+id);if(!el||!d||!d.min)return;var t=(d.tiendas||[]).filter(function(x){return x.precio===d.min})[0];
el.innerHTML='Desde <b>'+cop(d.min)+'</b>'+(t?' hoy en '+t.tienda.replace(/[<>&]/g,'')+(t.tipo==='externo'?' (vendedor externo: revisa garantía)':''):'')+(d.cap?' · '+d.cap.replace(/[<>&]/g,''):'')})}).catch(function(){})})();
</script>'''
for i,a in enumerate(ORD):
    for b in ORD[i+1:]:
        A,B=E[a],E[b]; fil=D['pares'][a+'|'+b]
        ga=sum(1 for f in fil if f['g']=='a'); gb=sum(1 for f in fil if f['g']=='b')
        g=A if ga>gb else B if gb>ga else None
        fa,fb=full(A),full(B)
        url=f"/comparar/{SL[a]}-vs-{SL[b]}/"; canon=BASE+url; urls.append(url)
        title=f"{A['n']} vs {B['n']}: ¿cuál conviene comprar? · Cuál"
        res=(f"Gana el {g['n']} {max(ga,gb)} a {min(ga,gb)}" if g else f"Empatan {ga} a {gb}")
        desc=f"{fa} vs {fb} en Colombia: pantalla, potencia, cámara, batería, carga y peso, ronda por ronda. {res}. Mira el precio de hoy en almacenes y operadores."
        filas=''.join(f'''<tr><th scope="row">{h(f['n'])}</th><td class="{'w' if f['g']=='a' else ''}">{h(str(f['va']))}</td><td class="{'w' if f['g']=='b' else ''}">{h(str(f['vb']))}</td><td>{h(f['claro'])}</td></tr>''' for f in fil)
        fic=''; fa_,fb_=F.get(a,{}),F.get(b,{})
        for sec in fa_:
            keys=[k for k in fa_[sec]]+[k for k in fb_.get(sec,{}) if k not in fa_[sec]]
            rows=''.join(f'<tr><th scope="row">{h(k)}</th><td>{h(str(fa_[sec].get(k,"—")))}</td><td>{h(str(fb_.get(sec,{}).get(k,"—")))}</td></tr>' for k in keys)
            fic+=f'<h3>{h(sec)}</h3><div class="tw"><table><thead><tr><th scope="col">{h(sec)}</th><th scope="col">{h(A["n"])}</th><th scope="col">{h(B["n"])}</th></tr></thead><tbody>{rows}</tbody></table></div>'
        def tarjeta(e):
            ml=f'<a class="ml" href="https://meli.la/{ML[e["id"]]}" rel="nofollow sponsored noopener" target="_blank">Ver en Mercado Libre · tienda oficial ↗</a>' if e['id'] in ML else ''
            return f'''<figure class="eq"><img src="/{e['img']}" alt="{h(full(e))}, frente y espalda" width="400" height="400" loading="eager"><figcaption><small>{h(e['m'])}</small><b>{h(e['n'])}</b><span class="pr" id="p-{e['id']}">Precio de hoy en el comparador</span>{ml}</figcaption></figure>'''
        hay_ml=a in ML or b in ML
        body=f'''<nav class="migas" aria-label="Ruta"><a href="/">Cuál</a> › <a href="/comparar/">Comparaciones</a> › <span>{h(A['n'])} vs {h(B['n'])}</span></nav>
<h1>{h(A['n'])} <em>vs</em> {h(B['n'])}</h1>
<p class="lead">{h(res)} en {len(fil)} rondas técnicas, con todas las rondas valiendo lo mismo. Si te importan más las fotos, los juegos o la batería, el resultado puede cambiar: pruébalo en el comparador.</p>
<div class="duo">{tarjeta(A)}<span class="vs">{ga}<small>vs</small>{gb}</span>{tarjeta(B)}</div>
<a class="cta" href="/?a={a}&amp;b={b}">Comparar en vivo, con mi uso y el precio de hoy</a>
{'<p class="afil">Los botones de Mercado Libre son enlaces de afiliado: Cuál puede recibir una comisión si compras. A ti no te cuesta más.</p>' if hay_ml else ''}
<h2>Ronda por ronda</h2><div class="tw"><table class="rd"><thead><tr><th scope="col">Ronda</th><th scope="col">{h(A['n'])}</th><th scope="col">{h(B['n'])}</th><th scope="col">Qué significa</th></tr></thead><tbody>{filas}</tbody></table></div>
<h2>Ficha técnica lado a lado</h2>{fic}
<p class="nota">Versión Latam que se vende en Colombia. Los precios cambian todos los días: el valor de arriba se lee en vivo del motor de Cuál; confírmalo en la tienda antes de comprar.</p>'''
        ld={"@context":"https://schema.org","@graph":[{"@type":"WebPage","name":title,"url":canon,"description":desc,"inLanguage":"es-CO","isPartOf":{"@type":"WebSite","name":"Cuál","url":BASE+"/"}},
            {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Cuál","item":BASE+"/"},{"@type":"ListItem","position":2,"name":"Comparaciones","item":BASE+"/comparar/"},{"@type":"ListItem","position":3,"name":f"{A['n']} vs {B['n']}","item":canon}]}]}
        os.makedirs(OUT+url.replace('/comparar',''),exist_ok=True)
        open(OUT+url.replace('/comparar','')+'index.html','w').write(page(title,desc,canon,f"{BASE}/og/{a}-{b}.jpg",body+JS%(f"'{a}','{b}'"),ld))
# índice
grupos=''
for a in ORD:
    li=''.join(f'<li><a href="/comparar/{SL[x]}-vs-{SL[y]}/">{h(E[a]["n"])} vs {h(E[o]["n"])}</a></li>' for o in ORD if o!=a for x,y in [tuple(sorted([a,o],key=ORD.index))])
    grupos+=f'<section><h2>{h(full(E[a]))}</h2><ul>{li}</ul></section>'
title='Comparaciones de celulares en Colombia: todos los versus · Cuál'
desc=f'{len(urls)} comparaciones de celulares lado a lado: iPhone, Samsung Galaxy, Xiaomi, Motorola, Huawei, OPPO, vivo y Honor. Ficha técnica, ganador por ronda y precio de hoy.'
ld={"@context":"https://schema.org","@type":"CollectionPage","name":title,"url":BASE+"/comparar/","inLanguage":"es-CO"}
open(OUT+'/index.html','w').write(page(title,desc,BASE+'/comparar/',BASE+'/og/portada.jpg',f'<nav class="migas"><a href="/">Cuál</a> › <span>Comparaciones</span></nav><h1>Todas las comparaciones</h1><p class="lead">Elige un versus y mira quién gana ronda por ronda. Para comparar con tu uso y el precio de hoy, usa el <a href="/">comparador en vivo</a>.</p><div class="idx">{grupos}</div>',ld))
urls=['/comparar/']+urls
sm='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://cual.click/</loc><lastmod>2026-11-14</lastmod></url>\n'+''.join(f'  <url><loc>{BASE}{u}</loc><lastmod>2026-11-14</lastmod></url>\n' for u in urls)+'</urlset>\n'
open('/home/claude/dtorh-sitio/cual/sitemap.xml','w').write(sm)
print(len(urls))
