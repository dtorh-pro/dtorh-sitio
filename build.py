# Genera index.html y laboratorio/index.html a partir de piezas compartidas.
import re, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

P = lambda cx,cy,r: f'<circle class="p" cx="{cx}" cy="{cy}" r="{r}" style="fill:var(--ac,#7e3dff);stroke:none"/>'
ICONOS = {
 'buscar':   '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/>'+P(10.5,10.5,2.2),
 'pin':      '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/>'+P(12,10,2.4),
 'tienda':   '<path d="M4.5 9.5 6 4.5h12l1.5 5"/><path d="M4.5 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"/><path d="M6 12.5V20h12v-7.5"/><path d="M10 20v-4h4v4"/>'+P(12,7,1.6),
 'chat':     '<path d="M20 11.5a7.5 7.5 0 0 1-11.2 6.5L4 19.5l1.5-4.3A7.5 7.5 0 1 1 20 11.5z"/>'+P(12.5,11.5,1.6),
 'catalogo': '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2" style="fill:var(--ac,#7e3dff);stroke:var(--ac,#7e3dff)"/>',
 'qr':       '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><rect x="8" y="8" width="3.4" height="3.4" rx=".8"/><rect x="12.6" y="12.6" width="3.4" height="3.4" rx=".8"/>'+P(14.3,9.7,1.7),
 'estrella': '<path d="m12 3.8 2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z"/>'+P(12,12.4,1.9),
 'hoja':     '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4"/>'+P(17.5,16,1.8),
 'calendario':'<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'+P(15.5,15,1.8),
 'plantillas':'<rect x="7.5" y="3.5" width="12.5" height="12.5" rx="2.5"/><path d="M4 8v9.5A2.5 2.5 0 0 0 6.5 20H16"/>'+P(13.75,9.75,2.1),
 'rayo':     '<path d="M13 3.5 6 13.5h5.5l-1 7 7.5-10.5h-5.5z"/>'+P(19,19,1.7),
 'escudo':   '<path d="M12 3.5 19 6v5.5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>'+P(19,6,1.7),
 'reloj':    '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>'+P(12,12,1.6),
 'camara':   '<path d="M4 8.5a2 2 0 0 1 2-2h2l1.5-2h5l1.5 2h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.6"/>'+P(12,13,1.5),
 'lista':    '<path d="M10 7h10M10 12h10M10 17h6"/><circle cx="5.5" cy="12" r="1.3"/><circle cx="5.5" cy="17" r="1.3"/>'+P(5.5,7,1.7),
 'llave':    '<circle cx="8" cy="15" r="4"/><path d="m11 12 8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>'+P(8,15,1.5),
 'reporte':  '<rect x="4.5" y="3.5" width="15" height="17" rx="2.5"/><path d="M8.5 16v-3M12 16V9.5M15.5 16v-5"/>'+P(15.5,7.5,1.5),
 'ruta':     '<circle cx="6" cy="18" r="2.2"/><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>'+P(18,6,2.3),
 'cliente':  '<circle cx="12" cy="8.5" r="3.8"/><path d="M5 20a7 7 0 0 1 14 0"/>'+P(18.5,5.5,1.9),
 'web':      '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 9h17M8 13h8M8 16h5"/>'+P(6.5,7,.9),
 'redes':    '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.8"/>'+P(16.8,7.2,1.3),
 'directorio':'<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19v13H7.5A2.5 2.5 0 0 0 5 19.5z"/><path d="M5 19.5A2.5 2.5 0 0 0 7.5 22H19v-5"/>'+P(12,10.5,2),
 'mapa':     '<path d="M9 5 4 7v12l5-2 6 2 5-2V5l-5 2z"/><path d="M9 5v12M15 7v12"/>'+P(15,11,1.8),
 'moneda':   '<circle cx="12" cy="12" r="8"/><path d="M14.6 9.4c-.5-.8-1.5-1.3-2.6-1.3-1.5 0-2.6.8-2.6 1.9 0 2.7 5.4 1.5 5.4 4 0 1.1-1.2 1.9-2.8 1.9-1.1 0-2.1-.5-2.6-1.3M12 6.6v1.5M12 16v1.5"/>',
 'ajustes':  '<path d="M5 7h8M17 7h2M5 17h2M11 17h8"/><circle cx="15" cy="7" r="2"/>'+P(9,17,2.1),
 'correo':   '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7 7.5 6 7.5-6"/>'+P(18.5,6,1.8),
 'check':    '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 'flecha':   '<path d="M5 12h14M13 6l6 6-6 6"/>',
 'mas':      '<path d="M12 5v14M5 12h14"/>',
 'pregunta': '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 0 1 4.8 1c0 1.6-2.4 2-2.4 3.5"/>'+P(12,17,1.3),
 'instagram':'<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" style="fill:var(--ac,#7e3dff);stroke:none"/>',
 'facebook': '<path d="M14 20.5v-7h2.6l.4-3H14V8.8c0-.9.3-1.5 1.6-1.5H17V4.7c-.3 0-1.2-.2-2.3-.2-2.3 0-3.8 1.4-3.8 3.9v2.1H8.3v3H11v7"/>',
 'telefono': '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M10.5 18h3"/>'+P(12,6,.9),
 'whatsapp': '<path style="fill:currentColor;stroke:none" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.13c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.23.85.86-3.15-.2-.32a8.16 8.16 0 01-1.25-4.36c0-4.54 3.7-8.23 8.24-8.23 4.54 0 8.23 3.7 8.23 8.24 0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/>',
}
SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' + ''.join(f'<symbol id="i-{k}" viewBox="0 0 24 24">{v}</symbol>' for k,v in ICONOS.items()) + '</defs></svg>'
def I(n, cls='ic', extra=''):
    return f'<svg class="{cls}" aria-hidden="true"{extra}><use href="#i-{n}"/></svg>'

IG = 'https://www.instagram.com/dtorh.click/'
FB = 'https://www.facebook.com/dtorh.click/'
WA = 'https://wa.me/573024135572?text='
def wa(t):
    from urllib.parse import quote
    return WA + quote(t)

FORM = 'https://datos.dtorh.click/'
def form(ref, **kw):
    from urllib.parse import urlencode
    return FORM + '?' + urlencode(dict(kw, ref=ref))

import hashlib
def V(ruta):
    return hashlib.sha1(open(ruta,'rb').read()).hexdigest()[:8]

def head(titulo, desc, url, extra=''):
    return f'''<!DOCTYPE html>
<html lang="es-CO" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titulo}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="dtorh™">
<meta property="og:locale" content="es_CO">
<meta property="og:image" content="https://dtorh.click/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b0d1a">
<meta name="facebook-domain-verification" content="ghpkvj3cz5f3zkrufb8k3a1q03miha">
<link rel="canonical" href="{url}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/inter-tight-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-tight-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/dtorh.css?v={V("assets/dtorh.css")}">
{extra}<script>
  document.documentElement.className+=" js";
  try{{var t=localStorage.getItem('dtorh-tema');if(t)document.documentElement.setAttribute('data-theme',t);}}catch(e){{}}
</script>
</head>
'''

def nav(actual=''):
    def l(href, txt, key):
        cur = ' aria-current="page"' if key == actual else ''
        return f'<a href="{href}"{cur}>{txt}</a>'
    return f'''<div class="progreso" aria-hidden="true"></div>
<nav id="nav" class="sobre-oscuro" aria-label="Principal">
  <div class="bar">
    <a class="mark" href="/#top" aria-label="dtorh, inicio">dtorh<i>™</i></a>
    <div class="links" id="links">
      <span class="ind" id="ind"></span>
      {l('/servicios/','Servicios','serv')}
      {l('/#arranque','Precio','pre')}
      {l('/como-trabajamos/','Cómo funciona','pro')}
      {l('/laboratorio/','Laboratorio','lab')}
      {l('/#preguntas','Preguntas','faq')}
    </div>
    <div class="derecha">
      <button class="tema" id="tema" type="button" aria-label="Cambiar entre tema claro y oscuro">
        <svg class="sol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/></svg>
        <svg class="luna" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.2A8.2 8.2 0 019.8 4 8.4 8.4 0 1020 14.2z"/></svg>
      </button>
      <button class="menu-btn" id="menuBtn" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="hoja">
        <svg class="h" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg>
        <svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
      <a class="btn lime sm" href="{wa('Hola, vengo de la página de dtorh')}" target="_blank" rel="noopener">Hablemos</a>
    </div>
  </div>
</nav>
<div class="hoja" id="hoja">
  <a href="/servicios/">{I('mapa')}Servicios</a>
  <a href="/#arranque">{I('moneda')}Precio</a>
  <a href="/#proceso">{I('ruta')}Cómo funciona</a>
  <a href="/laboratorio/">{I('catalogo')}Laboratorio</a>
  <a href="/#preguntas">{I('pregunta')}Preguntas</a>
  <div class="hoja-redes"><a href="{IG}" target="_blank" rel="noopener" aria-label="Instagram de dtorh">{I('instagram')}Instagram</a><a href="{FB}" target="_blank" rel="noopener" aria-label="Facebook de dtorh">{I('facebook')}Facebook</a></div>
  <a class="btn lime" href="{wa('Hola, vengo de la página de dtorh')}" target="_blank" rel="noopener">{I('whatsapp')}Hablemos por WhatsApp</a>
</div>
'''

FOOTER = f'''<footer>
  <div class="wrap">
    <div class="cols">
      <span class="mark">dtorh<i>™</i></span>
      <a href="/servicios/">{I('mapa')}Servicios</a>
      <a href="/como-trabajamos/">{I('ruta')}Cómo trabajamos</a>
      <a href="/laboratorio/">{I('catalogo')}Laboratorio</a>
      <a href="https://wa.me/573024135572" target="_blank" rel="noopener">{I('whatsapp')}+57 302 413 5572</a>
      <a href="mailto:dtorh.ofc@gmail.com">{I('correo')}dtorh.ofc@gmail.com</a>
      <a href="{IG}" target="_blank" rel="noopener" aria-label="Instagram de dtorh">{I('instagram')}@dtorh.click</a>
      <a href="{FB}" target="_blank" rel="noopener" aria-label="Facebook de dtorh">{I('facebook')}/dtorh.click</a>
    </div>
    <div class="pie-serv"><a href="/servicios/arranque-360/">Arranque 360</a><a href="/servicios/perfil-de-empresa-google/">Google completo</a><a href="/servicios/pagina-web-con-catalogo/">Web con catálogo</a><a href="/servicios/whatsapp-business-catalogo/">WhatsApp que vende</a><a href="/servicios/mejorar-pagina-web/">Web más rápida</a><a href="/servicios/instagram-facebook-negocio/">Redes en orden</a></div>
    <p class="fine">{{ Los datos que nos compartas se usan solo para contactarte y preparar una propuesta. Puedes pedir que los eliminemos cuando quieras escribiendo a dtorh.ofc@gmail.com. Ley 1581 de 2012. <a href="/privacidad/">Privacidad y cookies</a> }}</p>
    <div class="base"><span>© <span id="anio">2026</span> dtorh™ · Estudio digital · Barranquilla, Colombia</span><a href="#top">Volver arriba ↑</a></div>
  </div>
</footer>

<div class="float">
  <a class="btn lime" href="{form('flotante')}">{I('reporte')}Pedir mis 3 hallazgos gratis</a>
</div>
<button class="guia" id="guia" type="button" aria-label="Bajar a la siguiente sección"><span class="raton"></span><span class="dedo"></span><b>Baja para descubrir</b></button>
'''

SCRIPTS = ('<script src="/assets/lenis.min.js?v=1.3.26" defer></script>\n'
  + '<script src="/assets/dtorh.js?v=' + V('assets/dtorh.js') + '" defer></script>\n'
  + '<script src="/assets/medir.js?v=' + V('assets/medir.js') + '" defer></script>\n'
  + '<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{"token": "c61f2bddfe9c47a0b9a67eb3e39e592b"}\'></script>\n')

LD = '''<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Organization","@id":"https://dtorh.click/#org","name":"dtorh","alternateName":"dtorh estudio digital","url":"https://dtorh.click/","image":"https://dtorh.click/og.jpg","logo":"https://dtorh.click/icon-512.png","description":"Estudio digital en Barranquilla: ficha de Google y Maps, página web con catálogo, WhatsApp Business y redes para negocios pequeños, montados en 14 días, con pago único.","telephone":"+57 302 413 5572","email":"dtorh.ofc@gmail.com","address":{"@type":"PostalAddress","addressLocality":"Barranquilla","addressRegion":"Atlántico","addressCountry":"CO"},"areaServed":[{"@type":"City","name":"Barranquilla"},{"@type":"City","name":"Santa Marta"},{"@type":"City","name":"Cartagena"},{"@type":"Country","name":"Colombia"}],"knowsLanguage":"es","sameAs":["https://www.instagram.com/dtorh.click/","https://www.facebook.com/dtorh.click/"],"hasOfferCatalog":{"@type":"OfferCatalog","name":"Servicios de dtorh","itemListElement":[{"@type":"Offer","itemOffered":{"@type":"Service","name":"Arranque 360","url":"https://dtorh.click/servicios/arranque-360/"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Google completo","url":"https://dtorh.click/servicios/perfil-de-empresa-google/"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Web con catálogo","url":"https://dtorh.click/servicios/pagina-web-con-catalogo/"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"WhatsApp que vende","url":"https://dtorh.click/servicios/whatsapp-business-catalogo/"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Web más rápida","url":"https://dtorh.click/servicios/mejorar-pagina-web/"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Redes en orden","url":"https://dtorh.click/servicios/instagram-facebook-negocio/"}}]}}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","@id":"https://dtorh.click/#web","url":"https://dtorh.click/","name":"dtorh","inLanguage":"es-CO","publisher":{"@id":"https://dtorh.click/#org"}}
</script>
'''

def avatar(nombre, color, cls=''):
    return f'<span class="avatar {cls}" style="--fondo:{color}"><img src="/img/personas/{nombre}.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" width="850" height="1200"></span>'

def persona(nombre, alt=''):
    a = f' alt="{alt}"' if alt else ' alt="" aria-hidden="true"'
    return f'<img src="/img/personas/{nombre}.svg"{a} loading="lazy" decoding="async" width="850" height="1200">'

# ======================= INICIO =======================
HOME = f'''<body class="tono-noche">
<a class="saltar" href="#contenido">Saltar al contenido</a>
{SPRITE}
{nav()}
<main id="contenido">

<!-- 1 · HERO: mapa digital -->
<section class="hero" id="top" data-tono="noche">
  <div class="capa-mapa" aria-hidden="true"><canvas id="mapa"></canvas></div>
  <div class="velo" aria-hidden="true"></div>
  <div class="wrap" id="heroTxt">
    <span class="brace rv">dtorh™ · Estudio digital · Barranquilla</span>
    <h1><span><i>Tu negocio existe.</i></span><span><i><em>En internet, no.</em></i></span></h1>
    <p class="lead rv">Montamos en 14 días lo que hace falta para que <b>te encuentren en Google y te escriban por WhatsApp</b>. Nosotros hacemos toda la parte técnica; tú sigues atendiendo tu negocio.</p>
    <form class="buscador rv" id="buscador">
      {I('buscar')}
      <input id="q" type="text" autocomplete="off" enterkeyhint="send" placeholder="¿Qué vendes? Ej: postres, ropa, repuestos…" aria-label="¿Qué vendes?">
      <button type="submit" aria-label="Empezar: pedir mis 3 hallazgos gratis"><span>Empezar</span>{I('flecha')}</button>
    </form>
    <div class="chips rv">
      <a class="chip" href="{form('hero')}">Quiero mis 3 hallazgos gratis</a>
      <a class="chip" href="{form('hero-google', necesita='google')}">Que me encuentren en Google</a>
      <a class="chip" href="{form('hero-apertura', apertura='pronto')}">Voy a abrir un negocio</a>
    </div>
    <div class="sellos rv">
      <span>{I('reloj')}Listo en 14 días</span>
      <span>{I('moneda')}Pago único</span>
      <span>{I('escudo')}Garantía de devolución</span>
    </div>
  </div>
  <div class="leyenda" aria-hidden="true">
    <span><s class="s1"></s>Negocio que aparece</span>
    <span><s class="s2"></s>Negocio que existe, pero nadie ve</span>
    <span><s class="s3"></s>Cliente buscando</span>
  </div>
  <div class="contador" aria-hidden="true"><b id="cuenta">0</b>clientes llegaron a un negocio visible</div>
</section>

<!-- 2 · PROBLEMA -->
<section class="sec" id="problema" data-tono="claro">
  <div class="wrap prob">
    <div>
      <span class="brace rv" data-parada="izq">El problema</span>
      <h2 class="rv">Alguien busca lo que vendes. <em>Aparece otro.</em></h2>
      <p class="lead rv">No sales en Google. El WhatsApp no tiene catálogo. Las redes no dicen ni qué vendes ni dónde quedas.</p>
      <p class="remate rv">Nada de eso se arregla publicando más seguido.</p>
      <div class="hallazgos">
        <div class="hz rv"><span class="ico">{I('mapa')}</span><div><small>Hallazgo 01 · Google y Maps</small><b>Te buscan y no apareces</b></div><span class="estado">Falta</span></div>
        <div class="hz rv"><span class="ico">{I('chat')}</span><div><small>Hallazgo 02 · WhatsApp</small><b>Preguntan precios y nadie responde a tiempo</b></div><span class="estado">Falta</span></div>
        <div class="hz rv"><span class="ico">{I('redes')}</span><div><small>Hallazgo 03 · Redes</small><b>El perfil no dice qué vendes ni dónde</b></div><span class="estado">Falta</span></div>
      </div>
    </div>
    <div class="escena rv" aria-hidden="true">
      <div class="esc-av" data-par=".08">{avatar('cliente_busca','#e3f1ff')}<span class="globo">{I('buscar')}“postres cerca de mí”</span></div>
      <div class="telefono" data-par="-.12">
        <div class="pantalla">
          <div class="g-top"><div class="g-barra">{I('buscar')}postres cerca de mí</div><div class="g-tabs"><b>Todo</b><span>Maps</span><span>Imágenes</span></div></div>
          <div class="g-mapa"><i style="left:22%;top:38%"></i><i style="left:58%;top:26%"></i><i style="left:74%;top:60%"></i></div>
          <div class="g-res"><b>Dulce Tentación</b><span><em>★ 4,7</em> · Repostería · Abierto</span></div>
          <div class="g-res"><b>Pastelería La 72</b><span><em>★ 4,5</em> · Postres · Abierto</span></div>
          <div class="g-res tu">Tu negocio no aparece</div>
          <div class="g-res"><b>Delicias del Prado</b><span><em>★ 4,8</em> · Repostería</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 3 · QUÉ MONTAMOS: el celular cambia con el scroll -->
<section class="relato" id="soluciones" data-tono="suave" data-paso="0">
  <div class="fijo">
    <div class="tinte" aria-hidden="true"></div>
    <div class="wrap">
      <div>
        <span class="brace" data-parada="der">Qué montamos</span>
        <div class="marcador"><span class="barras"><i></i><i></i><i></i></span><span>Tres cosas, un solo montaje</span></div>
        <div class="pasos-txt">
          <div class="ptxt on" data-p="0" style="--ac:var(--cyan)">
            <span class="cat"><span class="ico">{I('mapa')}</span>Presencia</span>
            <h3>Que te encuentren</h3>
            <p class="lead">Que al buscarte aparezcas con dirección, horario, fotos y un botón para escribirte.</p>
            <ul class="lista"><li>{I('pin')}Ficha de Google Business completa</li><li>{I('ruta')}Apple Maps, Waze y Bing</li><li>{I('web')}Página web propia con tu catálogo</li></ul>
            <a class="btn ghost" href="{form('servicio-presencia', necesita='google,web')}">Quiero aparecer <span class="ar">→</span></a>
            <p class="detalle">Detalle: <a href="/servicios/perfil-de-empresa-google/">ficha de Google</a> · <a href="/servicios/pagina-web-con-catalogo/">página web con catálogo</a></p>
          </div>
          <div class="ptxt" data-p="1">
            <span class="cat"><span class="ico">{I('chat')}</span>Contacto</span>
            <h3>Que te escriban y sepan qué comprar</h3>
            <p class="lead">Que vean precios sin preguntar y reciban una respuesta enseguida, aunque estés atendiendo.</p>
            <ul class="lista"><li>{I('catalogo')}WhatsApp Business con catálogo</li><li>{I('rayo')}Respuestas automáticas</li><li>{I('qr')}QR para el mostrador</li></ul>
            <a class="btn ghost" href="{form('servicio-contacto', necesita='whatsapp,redes')}">Ordenar mi WhatsApp <span class="ar">→</span></a>
            <p class="detalle">Detalle: <a href="/servicios/whatsapp-business-catalogo/">WhatsApp Business</a> · <a href="/servicios/instagram-facebook-negocio/">Instagram y Facebook</a></p>
          </div>
          <div class="ptxt" data-p="2" style="--ac:var(--lime-2)">
            <span class="cat"><span class="ico">{I('rayo')}</span>Sistemas</span>
            <h3>Que no dependa de tu memoria</h3>
            <p class="lead">Lo que hoy anotas en un papel queda guardado y te avisa solo.</p>
            <ul class="lista"><li>{I('hoja')}Clientes ordenados en una hoja, con aviso</li><li>{I('estrella')}Reseñas en Google con un QR</li><li>{I('chat')}Guion para responderlas</li></ul>
            <a class="btn ghost" href="{form('servicio-sistemas', necesita='whatsapp,resenas')}">Ver qué se automatiza <span class="ar">→</span></a>
            <p class="detalle">Detalle: <a href="/servicios/arranque-360/">Arranque 360, todo junto</a></p>
          </div>
        </div>
      </div>
      <div class="vitrina" aria-hidden="true">
        <span class="orbita"></span>
        <div class="telefono">
          <div class="pantalla">
            <div class="pant on" data-p="0">
              <div class="m-mapa"><span class="m-pin"></span></div>
              <div class="m-ficha">
                <h5>Tu negocio</h5>
                <div class="est"><em>★★★★★</em> 4,9 · Repostería · <span class="ab">Abierto</span></div>
                <div class="m-acc"><span><i>{I('ruta')}</i>Cómo llegar</span><span><i>{I('telefono')}</i>Llamar</span><span><i>{I('chat')}</i>WhatsApp</span><span><i>{I('web')}</i>Sitio web</span></div>
                <div class="m-fotos"><i></i><i></i><i></i></div>
              </div>
            </div>
            <div class="pant" data-p="1">
              <div class="w-top"><i>TN</i><div><b>Tu negocio</b><small>Cuenta de empresa</small></div></div>
              <div class="w-chat">
                <div class="w-msg yo">Hola, ¿qué precios manejan?<small>10:24</small></div>
                <span class="w-auto">Respuesta automática</span>
                <div class="w-msg">¡Hola! Aquí está nuestro catálogo con precios 👇<div class="w-cat"><span><i></i>Torta 3 leches</span><span><i></i>Postre de limón</span></div><small>10:24</small></div>
                <div class="w-msg yo">Quiero la de 3 leches 🙌<small>10:25</small></div>
                <div class="w-msg">¡Listo! Te la tenemos para hoy a las 4 p. m. ✅<small>10:26</small></div>
                <div class="w-msg yo">Perfecto, ¿aceptan Nequi?<small>10:26</small></div>
              </div>
            </div>
            <div class="pant" data-p="2">
              <div class="s-top"><b>Clientes</b><small>Se llena sola desde el formulario</small></div>
              <div class="s-notif"><span class="ico">{I('cliente')}</span><div><b>Nuevo cliente registrado</b>Laura M. · hace 1 min</div></div>
              <div class="s-tabla"><div><span>Nombre</span><span>Interés</span><span>Hora</span></div><div class="nueva"><span>Laura M.</span><span>Pedido</span><span>10:31</span></div><div><span>Andrés P.</span><span>Precios</span><span>09:58</span></div><div><span>Karen R.</span><span>Domicilio</span><span>09:12</span></div></div>
              <div class="s-resena"><em>★★★★★</em><span>“Atención rapidísima” · nueva reseña</span></div>
            </div>
          </div>
        </div>
        <div class="flota f1" data-p="0"><span class="ico" style="--ac:var(--cyan)">{I('pin')}</span><div><b>Apareces en Maps</b><small>Con fotos y horario</small></div></div>
        <div class="flota f2" data-p="0"><span class="ico">{I('ruta')}</span><div><b>Te piden la ruta</b><small>Waze · Apple Maps</small></div></div>
        <div class="flota f1" data-p="1"><span class="ico">{I('rayo')}</span><div><b>Respondió solo</b><small>A las 10:24 a. m.</small></div></div>
        <div class="flota f2" data-p="1"><span class="ico">{I('qr')}</span><div><b>QR en el mostrador</b><small>Escanean y escriben</small></div></div>
        <div class="flota f1" data-p="2"><span class="ico" style="--ac:var(--lime-2)">{I('hoja')}</span><div><b>Llegó a tu hoja</b><small>Con aviso al correo</small></div></div>
        <div class="flota f2" data-p="2"><span class="ico" style="--ac:#e7a20a">{I('estrella')}</span><div><b>Nueva reseña</b><small>Desde el QR</small></div></div>
      </div>
    </div>
  </div>
</section>

<!-- 4 · OFERTA -->
<section class="sec" id="arranque" data-tono="claro">
  <div class="wrap">
    <div class="cab">
      <span class="brace rv" data-parada="izq">Arranque 360</span>
      <h2 class="rv">Todo montado de una vez. <em>Pagas una sola vez.</em></h2>
      <p class="lead rv">Un solo paquete con principio y fin. Te lo entregamos funcionando y queda a tu nombre.</p>
    </div>
    <div class="oferta-wrap">
      <div class="oferta">
        <div class="incluye rv">
          <div class="grupos">
            <div class="grupo" style="--c:var(--cyan)"><h3 class="gt"><s></s>Que te encuentren</h3>
              <ul class="lista"><li>{I('web')}Página web con catálogo</li><li>{I('pin')}Google Business y Maps</li><li>{I('ruta')}Apple Maps, Waze y Bing</li><li>{I('directorio')}Directorios locales</li></ul></div>
            <div class="grupo" style="--c:var(--lime)"><h3 class="gt"><s></s>Que te escriban</h3>
              <ul class="lista"><li>{I('catalogo')}WhatsApp Business con catálogo</li><li>{I('rayo')}Respuestas automáticas</li><li>{I('qr')}QR impreso para el local</li><li>{I('hoja')}Formulario conectado a una hoja</li></ul></div>
            <div class="grupo" style="--c:var(--lime-2)"><h3 class="gt"><s></s>Redes</h3>
              <ul class="lista"><li>{I('redes')}Instagram y Facebook montados</li><li>{I('plantillas')}10 plantillas editables</li><li>{I('calendario')}Calendario de los primeros 30 días</li></ul></div>
            <div class="grupo" style="--c:var(--azul)"><h3 class="gt"><s></s>Reputación y cierre</h3>
              <ul class="lista"><li>{I('estrella')}Sistema de reseñas con QR</li><li>{I('chat')}Guion para responderlas</li><li>{I('reporte')}Reporte de entrega</li><li>{I('ajustes')}Una ronda de ajustes</li></ul></div>
          </div>
          <div class="pie"><span><b>15 entregables</b></span><span><b>14 días</b> desde que nos mandas lo necesario</span><span><b>1 solo pago</b> por el montaje</span></div>
        </div>
        <div class="precio rv">
          <span class="tag">Cotización gratis · según lo que te falta</span>
          <div class="monto" style="font-size:clamp(34px,4vw,48px)">Pagas solo lo que te falta</div>
          <p class="antes">Primero revisamos tu negocio y te mandamos 3 hallazgos. Con eso te cotizamos el paquete completo o solo las piezas que necesitas.</p>
          <ul>
            <li>{I('reporte')}Diagnóstico de 3 hallazgos sin costo</li>
            <li>{I('moneda')}Precio fijo y por escrito antes de empezar</li>
            <li>{I('moneda')}50% para empezar, 50% al entregar</li>
            <li>{I('escudo')}Alojamiento de la web gratis y a tu nombre (el dominio lo pagas tú, a su precio)</li>
          </ul>
          <div class="garantia">{I('escudo')}<span><b>Garantía</b>Si a los 14 días de recibir tus fotos, tu lista de productos y la verificación de Google no está publicada tu ficha ni funcionando tu catálogo de WhatsApp, te devolvemos el anticipo completo.</span></div>
          <a class="btn lime" href="{form('precio')}">Cotiza gratis con tus 3 hallazgos <span class="ar">→</span></a>
          <p class="letra">¿Prefieres hablar primero? <a href="{wa('Hola, quiero cotizar con dtorh')}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 5 · PROCESO (bloque oscuro) -->
<section class="sec oscura proceso" id="proceso" data-tono="noche">
  <div class="wrap">
    <div class="cab">
      <span class="brace rv" data-parada="der">Cómo funciona</span>
      <h2 class="rv">Primero te mostramos qué estás perdiendo. <em>Después hablamos de plata.</em></h2>
    </div>
    <ol class="pasos">
      <li class="paso rv">
        <div class="num"><span>Gratis · por WhatsApp</span><b>01</b></div>
        <h3>Te mandamos 3 hallazgos</h3>
        <p>Revisamos cómo te ve hoy un cliente en Google, WhatsApp y redes. Tres cosas que estás perdiendo, cada una con su captura.</p>
        <div class="ilus" aria-hidden="true">
          <div class="vx reporte" data-par="-.04">
            <div class="vx-cab">{I('reporte')}<b>Tus 3 hallazgos</b><span>PDF · 3 capturas</span></div>
            <div class="vx-fila">{I('mapa')}<span>No apareces en Maps</span><em>Falta</em></div>
            <div class="vx-fila">{I('chat')}<span>WhatsApp sin catálogo</span><em>Falta</em></div>
            <div class="vx-fila">{I('redes')}<span>Perfil sin dirección</span><em>Falta</em></div>
          </div>
          <span class="vx-badge" data-par=".1">{I('buscar')}</span>
        </div>
      </li>
      <li class="paso rv">
        <div class="num"><span>Lo único que haces tú</span><b>02</b></div>
        <h3>Nos mandas tres cosas</h3>
        <p>La verificación que pida Google, entre 8 y 15 fotos, y la lista de productos con precios. Nada de reuniones largas.</p>
        <div class="ilus" aria-hidden="true">
          <div class="vx tres" data-par="-.04">
            <div class="vx-item" style="--ac:var(--cyan)"><span class="ico">{I('llave')}</span><span><b>Código de Google</b><small>La verificación que pida Google</small></span>{I('check','ic ok')}</div>
            <div class="vx-item"><span class="ico">{I('camara')}</span><span><b>8 a 15 fotos</b><small>Del local y los productos</small></span>{I('check','ic ok')}</div>
            <div class="vx-item" style="--ac:var(--lime-2)"><span class="ico">{I('lista')}</span><span><b>Productos y precios</b><small>Una lista sencilla</small></span>{I('check','ic ok')}</div>
          </div>
        </div>
      </li>
      <li class="paso rv">
        <div class="num"><span>14 días después</span><b>03</b></div>
        <h3>Recibes todo funcionando</h3>
        <p>Con un reporte de lo que quedó montado, los próximos 3 pasos y una ronda de ajustes incluida.</p>
        <div class="ilus" aria-hidden="true">
          <div class="vx listo" data-par="-.04">
            <span class="anillo a1"></span><span class="anillo a2"></span>
            <span class="pin-g">{I('pin')}</span>
            <span class="vx-chip c1">{I('estrella')}4,9 · 27 reseñas</span>
            <span class="vx-chip c2">{I('chat')}Nuevo mensaje</span>
            <span class="vx-chip c3">{I('check')}Ficha publicada</span>
          </div>
        </div>
      </li>
    </ol>
  </div>
</section>

<!-- 6 · TRABAJOS -->
<section class="sec trab" id="laboratorio" data-tono="claro">
  <div class="wrap trab-grid">
    <div>
      <span class="brace rv" data-parada="izq">Laboratorio</span>
      <h2 class="rv">Lo que estamos construyendo.</h2>
      <p class="lead rv">Proyectos en obra, a la vista: qué necesita cada negocio, qué le estamos montando y en qué etapa va.</p>
      <a class="btn lime rv" href="/laboratorio/">Entrar al laboratorio <span class="ar">→</span></a>
    </div>
    <div class="armado rv" aria-hidden="true">
      <div class="am-web" data-par="-.05">
        <div class="am-barra"><i></i><i></i><i></i><span>{I('pin','ic mini')}tu-negocio.com</span></div>
        <div class="am-cuerpo">
          <div class="am-nav"><b></b><span></span><span></span><span></span><em></em></div>
          <div class="am-hero"><div><b></b><b class="c"></b><span></span><em></em></div><span class="am-foto">{I('tienda')}</span></div>
          <div class="am-grid">
            <span><i style="--t:#e3f1ff">{I('catalogo')}</i><b></b><small></small></span>
            <span><i style="--t:#efe7ff">{I('camara')}</i><b></b><small></small></span>
            <span><i style="--t:#fbe4ff">{I('estrella')}</i><b></b><small></small></span>
          </div>
        </div>
      </div>
      <div class="am-movil" data-par=".1">
        <div class="am-chat"><span class="yo"></span><span class="el"><i></i></span><span class="yo c"></span></div>
        <em>{I('whatsapp')}</em>
      </div>
      <span class="am-tile t1" data-par=".16" style="--ac:var(--cyan)">{I('pin')}</span>
      <span class="am-tile t2" data-par=".22">{I('rayo')}</span>
      <span class="am-tile t3" data-par=".12" style="--ac:#e7a20a">{I('estrella')}</span>
      <span class="am-estado" data-par=".08"><s></s>En obra · listo en 14 días</span>
    </div>
  </div>
</section>

<!-- 7 · PRUEBA -->
<section class="sec" id="prueba" data-tono="claro" style="padding-top:0">
  <div class="wrap">
    <div class="card rv">
      <div class="prueba-grid">
        <div>
          <span class="brace">Prueba, no promesa</span>
          <h2>Esto no es un ejemplo. <em>Está funcionando.</em></h2>
          <p class="lead" style="margin-top:20px;max-width:52ch">Un formulario que se llena desde el celular. Los datos llegan ordenados a una hoja y el aviso, al instante. Si se cae la conexión, se envía por WhatsApp.</p>
          <div class="mets">
            <div class="met"><b>1 día</b><span>de montaje</span></div>
            <div class="met"><b>$0</b><span>al mes</span></div>
            <div class="met"><b>3 min</b><span>en llenarlo</span></div>
          </div>
          <a class="link" href="{form('prueba')}" target="_blank" rel="noopener">Ver el formulario <span class="ar">→</span></a>
        </div>
        <div class="formu" aria-hidden="true" data-par="-.05">
          <label>Nombre<span class="c">Laura Martínez</span></label>
          <label>¿Qué te interesa?<span class="c">Pedido para el sábado</span></label>
          <label>WhatsApp<span class="c">300 000 0000</span></label>
          <span class="ok">{I('check')}Enviado · llegó a la hoja</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 8 · PREGUNTAS -->
<section class="sec" id="preguntas" data-tono="suave">
  <div class="wrap">
    <div class="cab">
      <span class="brace rv" data-parada="der">Preguntas</span>
      <h2 class="rv">Lo que nos preguntan antes de empezar.</h2>
    </div>
    <div class="faq">
      <div class="qa rv">{I('moneda')}<h3>¿Tengo que pagar cada mes?</h3><p>No. El Arranque 360 se paga una vez y lo que montamos queda a tu nombre, aunque no volvamos a trabajar juntos. Si después quieres que lo mantengamos al día (cambios de precios, revisiones y reseñas), hay un plan mensual opcional que se cotiza aparte.</p></div>
      <div class="qa rv">{I('redes')}<h3>¿Ustedes manejan mis redes?</h3><p>No. Te dejamos las cuentas listas, 10 plantillas y el calendario de los primeros 30 días. Publicas tú o quien tú digas.</p></div>
      <div class="qa rv">{I('reloj')}<h3>¿Cuánto tiempo me toca dedicarle?</h3><p>Casi nada. Nos mandas tres cosas: la verificación que pida Google (un código o un video corto del local), las fotos y la lista de productos con precios. El resto lo hacemos nosotros.</p></div>
      <div class="qa rv">{I('tienda')}<h3>Todavía no he abierto. ¿Sirve?</h3><p>Sí. Dejamos todo montado antes de abrir. Solo la ficha de Google espera a que tengas la dirección del local, porque Google lo exige.</p></div>
      <div class="qa rv">{I('pregunta')}<h3>¿Hacen publicidad pagada o logos?</h3><p>No. Tampoco vendemos seguidores. Nos dedicamos a que te encuentren y te puedan escribir, y lo hacemos completo.</p></div>
      <div class="qa rv">{I('escudo')}<h3>¿Y si no quedo conforme?</h3><p>Incluye una ronda de ajustes. Y si a los 14 días no están tu ficha de Google y tu catálogo de WhatsApp, te devolvemos el anticipo.</p></div>
    </div>
  </div>
</section>

<!-- 8b · REDES -->
<section class="sec oscura redes" id="redes" data-tono="noche">
  <div class="wrap">
    <div class="cab">
      <span class="brace rv" data-parada="der">@dtorh.click</span>
      <h2 class="rv">Estamos donde están tus clientes. <em>Síguenos.</em></h2>
      <p class="lead rv">En Instagram y Facebook, como dtorh.click. Síguenos, comenta o escríbenos por mensaje directo: te respondemos ahí mismo.</p>
    </div>
    <div class="red-grid">
      <div class="red-card ig rv">
        <span class="brillo" aria-hidden="true"></span>
        <div class="red-portada" aria-hidden="true"><span class="calles"></span><span class="pin p1">{I('pin')}</span><span class="pin p2">{I('pin')}</span><span class="pin p3">{I('pin')}</span></div>
        <div class="red-top">
          <span class="anillo" aria-hidden="true"><span class="cara">dtorh<i>™</i></span></span>
          <div class="red-id"><b>@dtorh.click</b><small>{I('instagram')}Instagram</small></div>
        </div>
        <div class="red-acciones">
          <a href="https://ig.me/m/dtorh.click" target="_blank" rel="noopener">{I('chat')}<span>Mándanos un mensaje directo</span><span class="ar">↗</span></a>
          <a href="{IG}" target="_blank" rel="noopener">{I('instagram')}<span>Ver el perfil</span><span class="ar">↗</span></a>
        </div>
        <a class="red-cta" href="{IG}" target="_blank" rel="noopener"><span>Seguir en Instagram</span><span class="ar">↗</span></a>
      </div>
      <div class="red-card fb rv">
        <span class="brillo" aria-hidden="true"></span>
        <div class="red-portada" aria-hidden="true"><span class="calles"></span><span class="pin p1">{I('pin')}</span><span class="pin p2">{I('pin')}</span><span class="pin p3">{I('pin')}</span></div>
        <div class="red-top">
          <span class="anillo fb-anillo" aria-hidden="true"><span class="cara">dtorh<i>™</i></span></span>
          <div class="red-id"><b>dtorh.click</b><small>{I('facebook')}Facebook</small></div>
        </div>
        <div class="red-acciones">
          <a href="https://m.me/dtorh.click" target="_blank" rel="noopener">{I('chat')}<span>Escríbenos por Messenger</span><span class="ar">↗</span></a>
          <a href="{FB}" target="_blank" rel="noopener">{I('facebook')}<span>Ver la página</span><span class="ar">↗</span></a>
        </div>
        <a class="red-cta" href="{FB}" target="_blank" rel="noopener"><span>Seguir la página</span><span class="ar">↗</span></a>
      </div>
    </div>
  </div>
</section>

<!-- 9 · CIERRE -->
<section class="end" id="contacto" data-tono="claro">
  <div class="mapita" aria-hidden="true"></div>
  <div class="wrap">
    <div class="enlace rv" aria-hidden="true">
      <div class="lado">{avatar('duena_senala','#efe7ff')}<small>Tu negocio</small></div>
      <div class="via"><span class="punteo"></span><span class="nodo n1">{I('pin')}</span><span class="nodo n2">{I('chat')}</span><span class="nodo n3">{I('estrella')}</span><span class="viajero"></span></div>
      <div class="lado">{avatar('cliente_feliz','#e3f1ff')}<small>Tu próximo cliente</small></div>
    </div>
    <span class="brace rv" data-parada="der">Siguiente paso</span>
    <h2 class="rv">Cuéntanos qué vendes. Te mostramos qué le falta.</h2>
    <p class="lead rv">Tres minutos de preguntas desde el celular. Te mandamos tus 3 hallazgos por WhatsApp, sin compromiso.</p>
    <div class="hcta rv"><a class="btn lime" href="{form('cierre')}">{I('reporte')}Pedir mis 3 hallazgos</a></div>
    <p class="contacto-alt rv">¿Prefieres hablar directo? <a href="{wa('Hola, vengo de la página de dtorh')}" target="_blank" rel="noopener">WhatsApp</a> o <a href="mailto:dtorh.ofc@gmail.com">dtorh.ofc@gmail.com</a></p>
  </div>
</section>

</main>
{FOOTER}
{SCRIPTS}<script src="/assets/mapa.js?v=5" defer></script>
</body>
</html>
'''

home = head('Google, página web y WhatsApp para tu negocio | dtorh™ Barranquilla',
 'Estudio digital en Barranquilla: ficha de Google y Maps, página web con catálogo, WhatsApp Business y redes para tu negocio, en 14 días y con pago único.',
 'https://dtorh.click/', LD) + HOME
open('index.html','w').write(home)

# ======================= LABORATORIO =======================
OBRA = f'''<div class="obra" aria-hidden="true">
      <div class="ob-marco">
        <div class="ob-barra"><i></i><i></i><i></i><b>{I('pin','ic mini')}tu-negocio.com</b></div>
        <div class="ob-lienzo">
          <span class="ob-b b1"></span>
          <span class="ob-b b2"></span><span class="ob-b b2b"></span>
          <span class="ob-b b3">{I('tienda')}</span>
          <span class="ob-b b4">{I('catalogo')}</span><span class="ob-b b5">{I('camara')}</span><span class="ob-b b6">{I('estrella')}</span>
          <span class="ob-b b7"></span>
        </div>
      </div>
      <span class="cota cx"><i></i>1280 px<i></i></span>
      <span class="cota cy"><i></i>pantalla<i></i></span>
      <span class="ob-tag t1">{{ catálogo }}</span>
      <span class="ob-tag t2">{{ botón WhatsApp }}</span>
      <span class="ob-tag t3">{{ ficha en Maps }}</span>
      <span class="ob-cursor"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z"/></svg></span>
      <span class="ob-estado"><s></s>Construyendo · etapa 3 de 4</span>
    </div>'''

LABP = f'''<body class="tono-claro">
<a class="saltar" href="#contenido">Saltar al contenido</a>
{SPRITE}
{nav('lab')}
<main id="contenido">
<section class="t-hero lab-hero" id="top" data-nav="oscuro">
  <div class="plano" aria-hidden="true"></div>
  <div class="wrap lab-grid">
    <div>
      <span class="brace rv">Laboratorio dtorh™</span>
      <h1><span><i>Proyectos en obra,</i></span><span><i><em>a la vista.</em></i></span></h1>
      <p class="lead rv">Aquí ves lo que estamos construyendo para cada negocio: qué necesita, qué le estamos montando y en qué etapa va. Sin maquillaje.</p>
      <div class="etapas-ley rv"><span><s class="e1"></s>Diagnóstico</span><span><s class="e2"></s>Diseño</span><span><s class="e3"></s>Desarrollo</span><span><s class="e4"></s>Lanzamiento</span></div>
    </div>
    {OBRA}
  </div>
</section>
<section class="t-body" data-tono="claro">
  <div class="wrap">
    <div class="t-filtros rv" id="tFiltros" role="group" aria-label="Filtrar proyectos"></div>
    <div class="t-grid" id="tGrid"></div>
  </div>
</section>
</main>
{FOOTER}
{SCRIPTS}<script>
/* ---- laboratorio: para agregar un proyecto, sumar un objeto a esta lista ----
   etapa: 0 Diagnóstico · 1 Diseño · 2 Desarrollo · 3 Lanzamiento · 4 En línea */
var PROYECTOS = [
  {{
    nombre: 'Fit Snack Market',
    tipo: 'Tienda en línea',
    rubro: 'Frutos secos y snacks artesanales',
    ciudad: 'Barranquilla',
    etapa: 2,
    resumen: 'Tienda para vender por WhatsApp: catálogo con filtros, arma tu propio mix y pago en tres pasos. La estamos terminando antes de su apertura.',
    piezas: ['Tienda en línea', 'Pedido por WhatsApp', 'Pagos Nequi y PSE', 'Hecha para celular'],
    url: '/fit-snack-market/'
  }},
  {{
    nombre: 'dtorh™ Carta',
    tipo: 'Carta digital',
    rubro: 'Restaurantes, comidas rápidas y cafés',
    ciudad: 'Barranquilla',
    etapa: 3,
    resumen: 'Carta para pedir desde el celular con un QR, con fotos de cada plato: te ayuda a elegir, sugiere lo que combina y manda el pedido listo al WhatsApp del restaurante. Tres identidades de muestra: gourmet, comida rápida y café.',
    piezas: ['Pedido por WhatsApp', 'Pago con Bre-B, Nequi y Daviplata', 'QR por mesa', 'Domicilio por barrio'],
    url: '/carta/'
  }},
  {{
    nombre: 'Cuál',
    tipo: 'Comparador de equipos',
    rubro: 'Celulares y tecnología en Colombia',
    ciudad: 'Colombia',
    etapa: 3,
    resumen: 'Comparador gratis en su propia plataforma, cual.click: dos celulares frente a frente, ronda por ronda, con veredicto según el uso y el precio de hoy en tiendas oficiales y almacenes de cadena. No vende equipos; las tiendas pueden tenerlo con su marca.',
    piezas: ['Precios reales cada dos días', 'Veredicto con IA', '14 equipos 2024–2026', 'Hecho para celular y computador'],
    url: 'https://cual.click/'
  }}
];
var ETAPAS = ['Diagnóstico','Diseño','Desarrollo','Lanzamiento'];
addEventListener('DOMContentLoaded', function(){{
  var tGrid = document.getElementById('tGrid'), tFil = document.getElementById('tFiltros'), actual = 'Todos';
  var tipos = ['Todos'].concat(PROYECTOS.map(function(x){{ return x.tipo; }}).filter(function(v,i,a){{ return a.indexOf(v) === i; }}));
  function estado(x){{ return x.etapa >= 4 ? 'En línea' : 'En ' + ETAPAS[x.etapa].toLowerCase(); }}
  function pintar(){{
    tFil.innerHTML = tipos.length < 3 ? '' : tipos.map(function(tp){{
      var n = tp === 'Todos' ? PROYECTOS.length : PROYECTOS.filter(function(x){{ return x.tipo === tp; }}).length;
      return '<button type="button" data-t="' + tp + '" aria-pressed="' + (tp === actual) + '">' + tp + '<i>' + n + '</i></button>';
    }}).join('');
    tGrid.innerHTML = PROYECTOS.filter(function(x){{ return actual === 'Todos' || x.tipo === actual; }}).map(function(x){{
      var barra = ETAPAS.map(function(e,i){{ return '<li class="' + (i < x.etapa ? 'hecha' : i === x.etapa ? 'ahora' : '') + '"><i></i><span>' + e + '</span></li>'; }}).join('');
      return '<a class="t-card" href="' + x.url + '" target="_blank" rel="noopener">' +
        '<div class="t-shot" data-w="1280"><span class="t-estado' + (x.etapa >= 4 ? ' vivo' : ' en-obra') + '"><s></s>' + estado(x) + '</span>' +
        '<span class="t-marca-agua">Vista previa del avance</span>' +
        '<iframe src="' + x.url + '" title="Avance de ' + x.nombre + '" loading="lazy" tabindex="-1" aria-hidden="true"></iframe></div>' +
        '<div class="t-txt"><span class="t-meta">' + x.tipo + ' · ' + x.rubro + ' · ' + x.ciudad + '</span>' +
        '<h3>' + x.nombre + '</h3><p>' + x.resumen + '</p>' +
        '<ol class="t-etapas" aria-label="Etapa: ' + estado(x) + '">' + barra + '</ol>' +
        '<ul class="t-hizo">' + x.piezas.map(function(h){{ return '<li>' + h + '</li>'; }}).join('') + '</ul>' +
        '<span class="t-ver">' + (x.etapa >= 4 ? 'Ver sitio' : 'Ver el avance') + ' ↗</span></div></a>';
    }}).join('') +
    '<a class="t-card t-next" href="{form('laboratorio')}">' +
      '<span class="mas">{I('mas').replace("'", "")}</span><h3>Tu negocio puede ser el siguiente proyecto</h3>' +
      '<p>Cuéntanos qué vendes. Te mostramos 3 cosas que le faltan en internet antes de pedirte nada.</p><span class="t-ver">Pedir mis 3 hallazgos →</span>' +
      '<span class="t-mapita" aria-hidden="true"><i></i><i></i><i></i><i class="tu">{I('pin').replace("'", "")}</i></span></a>';
    if (window.dtorhEscalar) window.dtorhEscalar();
  }}
  tFil.addEventListener('click', function(e){{ var b = e.target.closest('[data-t]'); if (!b) return; actual = b.getAttribute('data-t'); pintar(); }});
  pintar();
  if ('ResizeObserver' in window) new ResizeObserver(function(){{ window.dtorhEscalar && window.dtorhEscalar(); }}).observe(tGrid);
}});
</script>
</body>
</html>
'''
trab = head('Laboratorio: proyectos web en obra para negocios | dtorh™', 'Proyectos en obra de dtorh, a la vista: qué necesita cada negocio, qué le estamos montando y en qué etapa va. Estudio digital en Barranquilla.', 'https://dtorh.click/laboratorio/') + LABP
os.makedirs('laboratorio', exist_ok=True)
open('laboratorio/index.html','w').write(trab)
PRIV = f'''<body class="tono-claro">
<a class="saltar" href="#contenido">Saltar al contenido</a>
{SPRITE}
{nav()}
<main id="contenido">
<section class="sec legal" data-tono="claro">
  <div class="wrap" style="max-width:760px">
    <span class="brace">Privacidad y cookies</span>
    <h1 style="font-size:clamp(34px,5vw,56px);margin:14px 0 26px">Cómo cuidamos tus datos.</h1>
    <p class="lead">Actualizado el 9 de noviembre de 2026. Aplica a dtorh.click, datos.dtorh.click y a los mensajes que nos envíes por WhatsApp, Instagram o Facebook.</p>
    <h2>Quién es el responsable</h2>
    <p>dtorh, estudio digital de Barranquilla, Colombia. Contacto: <a href="mailto:dtorh.ofc@gmail.com">dtorh.ofc@gmail.com</a> · WhatsApp +57 302 413 5572.</p>
    <h2>Qué datos recogemos y para qué</h2>
    <ul>
      <li><b>Formulario de los 3 hallazgos:</b> tu nombre, tu WhatsApp, el nombre y los datos públicos de tu negocio y lo que nos cuentes. Los usamos solo para preparar tus hallazgos, contactarte y, si quieres, hacerte una propuesta. Se registran en el sistema de dtorh (alojado en Cloudflare) y en una hoja privada de Google como respaldo.</li>
      <li><b>Si aceptas una propuesta:</b> tu nombre, documento, celular y correo para el acuerdo y la cuenta de cobro, y el material que nos envíes (fotos, productos, horario), que se guarda en el Google Drive de dtorh. Los pagos en línea los procesa Wompi (Bancolombia): dtorh nunca ve los datos de tu tarjeta.</li>
      <li><b>Mensajes por WhatsApp, Instagram o Facebook</b> (también cuando comentas una publicación con la palabra clave y te escribimos por mensaje privado): te responde primero un <b>asistente con inteligencia artificial</b> de dtorh, que siempre se presenta como tal, y una persona del equipo cuando lo pides o hace falta. Guardamos el texto de la conversación (los últimos 60 mensajes), tu nombre de perfil y lo que nos cuentes de tu negocio, para responderte, darte seguimiento y, si quieres, prepararte una propuesta. No usamos tus mensajes para nada más.</li>
      <li><b>Conteo de visitas sin cookies (Cloudflare Web Analytics):</b> cuenta cuántas personas visitan cada página y desde qué tipo de dispositivo, de forma anónima. No usa cookies ni te identifica.</li>
      <li><b>Medición con cookies de Meta (píxel):</b> solo si aceptas en el aviso. Sirve para saber qué publicaciones y anuncios nos traen clientes y para mostrar anuncios de dtorh a personas parecidas. Si no aceptas, no se carga nada de Meta en tu visita.</li>
    </ul>
    <p>No vendemos ni compartimos tus datos con terceros para que te contacten.</p>
    <h2>Quién procesa tus datos por nosotros</h2>
    <p>Para prestar el servicio usamos proveedores que guardan o procesan datos por encargo de dtorh: <b>Cloudflare</b> (alojamiento del sitio y del sistema), <b>Google</b> (hoja de respaldo, Drive, y consultas de Maps y velocidad web), <b>Groq</b> y <b>Tavily</b> (inteligencia artificial y búsqueda: reciben los datos públicos de tu negocio y tu nombre para redactar el diagnóstico; Groq también recibe el texto de tus mensajes para redactar la respuesta del asistente), <b>Meta</b> (solo si aceptas sus cookies) y <b>Wompi</b> (pagos). Varios de ellos tienen servidores fuera de Colombia, principalmente en Estados Unidos; al enviarnos tus datos autorizas esa transferencia para estas finalidades.</p>
    <h2>Tus derechos (Ley 1581 de 2012)</h2>
    <p>Puedes conocer, actualizar, corregir o pedir que borremos tus datos, y retirar tu autorización en cualquier momento. Escríbenos a <a href="mailto:dtorh.ofc@gmail.com">dtorh.ofc@gmail.com</a> Respondemos las consultas en máximo 10 días hábiles y los reclamos en máximo 15 días hábiles (artículos 14 y 15 de la Ley 1581). Si no quedas conforme, puedes acudir a la Superintendencia de Industria y Comercio.</p>
    <h2 id="eliminar-datos">Cómo pedir que borremos tus datos</h2>
    <ol>
      <li>Escríbenos a <a href="mailto:dtorh.ofc@gmail.com">dtorh.ofc@gmail.com</a> o por el mismo chat de WhatsApp, Instagram o Facebook: "Quiero que borren mis datos". Dinos tu nombre y el número o usuario con el que nos escribiste.</li>
      <li>Borramos la conversación, tu ficha de contacto y lo que nos hayas enviado, en máximo 15 días hábiles, y te confirmamos por el mismo medio.</li>
      <li>Solo guardamos lo que la ley nos obliga a conservar (por ejemplo, cuentas de cobro de un servicio que ya pagaste).</li>
    </ol>
    <p>Los mensajes también quedan en tu propia app de WhatsApp, Instagram o Facebook: esos los borras tú desde la app.</p>
    <h2>Cookies</h2>
    <p>Guardamos tu decisión sobre las cookies durante un año. Puedes cambiarla cuando quieras:</p>
    <p><button class="btn ghost" type="button" data-cookies>Cambiar mi decisión sobre cookies</button></p>
  </div>
</section>
</main>
{FOOTER}
{SCRIPTS}
</body>
</html>
'''
priv = head('Privacidad y cookies — dtorh™', 'Cómo trata dtorh tus datos: formulario, mensajes y cookies de Meta con tu consentimiento. Ley 1581 de 2012.', 'https://dtorh.click/privacidad/') + PRIV
os.makedirs('privacidad', exist_ok=True)
open('privacidad/index.html','w').write(priv)
print('ok', len(home), len(trab), len(priv))

# ======================= SERVICIOS, CÓMO TRABAJAMOS Y SITEMAP =======================
exec(open('servicios.py').read())

# ── versiones de los recursos en las páginas que no se generan aquí (404 y formulario) ──
import re as _re
for _f in ('404.html', 'datos/index.html'):
    _t = open(_f).read()
    _t = _re.sub(r'/assets/dtorh\.css\?v=[\w]+', '/assets/dtorh.css?v=' + V('assets/dtorh.css'), _t)
    _t = _re.sub(r'/assets/medir\.js\?v=[\w]+', '/assets/medir.js?v=' + V('assets/medir.js'), _t)
    open(_f, 'w').write(_t)
