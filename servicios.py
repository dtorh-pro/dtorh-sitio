# Páginas de servicio, "Cómo trabajamos", sitemap e IndexNow. Lo ejecuta build.py al final
# (usa head, nav, FOOTER, SCRIPTS, SPRITE, I, wa, form de build.py).
# Regla: todo lo que se afirma aquí sale del portafolio aprobado (00-estrategia/portafolio-y-tarifas.md).
# Sin precios en la web: "Cotiza gratis" (decisión de David, 31-oct-2026).
import json, datetime

HOY = datetime.date.today().isoformat()
BASE = 'https://dtorh.click'
ORG_ID = BASE + '/#org'
ZONAS = ['Barranquilla', 'Santa Marta', 'Cartagena', 'Colombia']

def ld(*objs):
    return ''.join('<script type="application/ld+json">' + json.dumps(o, ensure_ascii=False, separators=(',', ':')) + '</script>\n' for o in objs)

def migas(items):
    return {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': BASE + u} for i, (n, u) in enumerate(items)]}

def faq_ld(faqs):
    return {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faqs]}

SERVICIOS = [
  dict(slug='arranque-360', id='360', icono='rayo', nombre='Arranque 360',
    titulo='Arranque 360: Google, web, WhatsApp y redes en 14 días',
    desc='Ficha de Google, página web con catálogo, WhatsApp Business, redes y reseñas para tu negocio, montados de una vez en 14 días. Pago único.',
    h1='Todo lo que tu negocio necesita en internet, montado de una vez.',
    lead='Para el negocio al que le falta más de una pieza: que lo encuentren en Google, que vean qué vende y que le escriban. En 14 días, con pago único y todo a tu nombre.',
    plazo='14 días', tipo='Presencia digital para negocios',
    para=['Tienes local o vendes en tu ciudad y casi nadie te encuentra buscando en Google.', 'Te falta más de una cosa: la ficha de Google, una página propia, el catálogo de WhatsApp o tus redes en orden.', 'Quieres resolverlo una sola vez, sin pagar mensualidades.'],
    incluye=['Página web propia con catálogo, botón de WhatsApp, mapa y horario', 'Ficha de Google Business completa, con fotos y horario', 'Apple Maps, Waze y Bing', 'WhatsApp Business con catálogo, respuestas automáticas y QR para el local', 'Formulario de clientes conectado a una hoja, con aviso', 'Instagram y Facebook en orden, 10 plantillas y calendario de 30 días', 'Sistema de reseñas con QR y guion para responderlas', 'Reporte de entrega y una ronda de ajustes'],
    faqs=[('¿Qué diferencia hay entre el Arranque 360 y contratar las piezas por separado?', 'El Arranque 360 junta todas las piezas en un solo montaje y un solo plazo de 14 días. Si a tu negocio le falta solo una o dos cosas, te cotizamos solo esas: no tienes que tomar el paquete completo.'),
          ('¿Hay que pagar mensualidad?', 'No. Es un pago único: 50 % para empezar y 50 % al entregar. La web queda alojada sin costo y todo queda a tu nombre. El dominio no está incluido: lo compras tú directamente con el proveedor, a tu nombre y a su precio. Si después quieres que la mantengamos al día, hay un plan mensual opcional que se cotiza aparte.'),
          ('¿Desde cuándo cuentan los 14 días?', 'Desde que confirmamos el anticipo y tenemos tu material: fotos, lista de productos con precios y la verificación que pida Google (un código o un video corto del local).'),
          ('¿Y si no funciona lo que me entregan?', 'Si en el plazo acordado no está funcionando lo que te entregamos, te devolvemos el anticipo completo.')]),
  dict(slug='perfil-de-empresa-google', id='google', icono='pin', nombre='Google completo',
    titulo='Ficha de Google para tu negocio, completa y verificada',
    desc='Creamos o reclamamos la ficha de Google de tu negocio y la dejamos completa: fotos, horario, servicios y WhatsApp. También Apple Maps, Waze y Bing. En 7 días.',
    h1='Que al buscarte en Google y en el mapa aparezcas completo.',
    lead='Creamos o reclamamos tu perfil de empresa en Google y lo dejamos completo, para que quien te busque vea dirección, horario, fotos y cómo escribirte. Lista en 7 días.',
    plazo='7 días', tipo='Perfil de empresa en Google',
    para=['Buscas tu negocio en Google o en Maps y no apareces, o aparece una ficha vieja que no creaste tú.', 'Tu ficha existe pero le faltan fotos, horario o el botón para escribirte.', 'Quieres estar también en Apple Maps, Waze y Bing sin hacerlo uno por uno.'],
    incluye=['Ficha de Google Business creada o reclamada, verificada y completa', 'Fotos, horario, categorías, servicios y botón de WhatsApp', 'Apple Maps, Waze y Bing', 'Enlace y QR para pedir reseñas, con guion para responderlas'],
    faqs=[('¿Necesito un local para tener ficha en Google?', 'No necesariamente. Google permite fichas de negocios que atienden a domicilio o en una zona, sin mostrar la dirección. Revisamos contigo cuál aplica a tu caso.'),
          ('¿Cuánto tarda la verificación de Google?', 'Depende de Google: puede pedir un video del negocio, una llamada, un correo o una carta, y sus tiempos no los controlamos. Nosotros dejamos todo listo y te acompañamos en el paso que te pida.'),
          ('Alguien ya creó una ficha de mi negocio. ¿Se puede recuperar?', 'Sí. Se pide la propiedad de la ficha a Google y, cuando la aprueba, queda a tu nombre.'),
          ('¿Me prometen salir de primeros en Google?', 'No. Nadie puede prometer eso con honestidad. Lo que sí hacemos es dejar tu ficha completa y verificada, que es lo que Google usa para mostrar negocios cercanos.')]),
  dict(slug='pagina-web-con-catalogo', id='web', icono='web', nombre='Web con catálogo',
    titulo='Página web con catálogo para negocios, con pago único',
    desc='Página web propia para celular con hasta 30 productos, botón de WhatsApp, mapa y horario. Alojamiento sin mensualidad a tu nombre. Lista en 10 días.',
    h1='Una página propia donde ven qué vendes y te escriben de una.',
    lead='Tu página web, hecha para celular, con tu catálogo, tus precios y un botón de WhatsApp. Lista en 10 días, a tu nombre y con pago único.',
    plazo='10 días', tipo='Diseño de página web',
    para=['Vendes por Instagram o WhatsApp y te toca mandar fotos y precios a cada persona.', 'Al buscar tu negocio en Google no sale una página tuya.', 'Quieres una web sencilla y rápida, sin pagar todos los meses.'],
    incluye=['Página web adaptada a celular con hasta 30 productos o servicios', 'Botón de WhatsApp, mapa, horario y redes', 'Te ayudamos a escoger y conectar tu dominio (tunegocio.com o .co)', 'Alojamiento gratuito en una cuenta a tu nombre: sin mensualidad y sin depender de nosotros'],
    faqs=[('¿Tengo que pagar algo todos los meses?', 'No. El alojamiento de la web no tiene costo y queda en una cuenta a tu nombre. El dominio no está incluido: lo compras tú directamente con el proveedor, a tu nombre y a su precio (un .com suele salir más barato que un .co), y lo renuevas cada año con él. Si quieres que nosotros lo mantengamos al día, hay un plan mensual opcional que se cotiza aparte.'),
          ('¿La página sirve para cobrar en línea?', 'Esta web muestra tu catálogo y lleva el pedido a tu WhatsApp. Si necesitas cobrar en línea con tarjeta o PSE, lo cotizamos aparte.'),
          ('¿Qué tengo que enviar?', 'Fotos de tus productos, la lista con precios (puede ser una foto de tu menú) y tus datos. Todo se envía desde un enlace, por partes y desde el celular.'),
          ('Ya tengo una web vieja. ¿Me sirve este servicio?', 'Si ya tienes web, no te vendemos otra: revisamos si conviene mejorarla con Web más rápida.')]),
  dict(slug='whatsapp-business-catalogo', id='whatsapp', icono='chat', nombre='WhatsApp que vende',
    titulo='WhatsApp Business con catálogo para tu negocio',
    desc='Tu WhatsApp Business con catálogo de fotos y precios, mensajes de bienvenida y ausencia, respuestas rápidas y QR para el mostrador. Listo en 5 días.',
    h1='Que vean tus productos y precios sin preguntar, y reciban una respuesta enseguida.',
    lead='Dejamos tu WhatsApp Business ordenado: catálogo con fotos y precios, mensajes automáticos y un QR para tu mostrador. Listo en 5 días.',
    plazo='5 días', tipo='Configuración de WhatsApp Business',
    para=['Te escriben “¿precio?” todo el día y respondes lo mismo una y otra vez.', 'Se te quedan mensajes sin contestar mientras atiendes.', 'Tu catálogo está en fotos sueltas y no en WhatsApp.'],
    incluye=['WhatsApp Business con perfil, horario y dirección', 'Catálogo con fotos y precios', 'Mensajes de bienvenida, ausencia y respuestas rápidas', 'Enlace directo y QR impreso para el mostrador'],
    faqs=[('¿Tengo que cambiar de número?', 'No necesariamente. Se puede pasar tu número actual a WhatsApp Business. Antes de hacerlo lo revisamos contigo para que no pierdas tus conversaciones.'),
          ('¿Esto es un bot de inteligencia artificial?', 'No. Usamos la aplicación gratuita WhatsApp Business: mensajes automáticos de bienvenida y ausencia, respuestas rápidas y catálogo. Tú sigues respondiendo como siempre, pero más rápido.'),
          ('¿Cuántos productos caben en el catálogo?', 'Cargamos los que nos envíes en tu lista con precios. Si son muchos, los organizamos por categorías.'),
          ('¿Sirve si no tengo página web?', 'Sí. El catálogo vive dentro de WhatsApp. Si además quieres página web, la cotizamos junto.')]),
  dict(slug='mejorar-pagina-web', id='webaldia', icono='ajustes', nombre='Web más rápida',
    titulo='Mejorar tu página web: rápida en celular y lista para Google',
    desc='Arreglamos tu web actual: velocidad en celular, WhatsApp y contacto visibles, descripción para Google y SEO básico, con medición antes y después. En 7 días.',
    h1='Arreglamos la web que ya tienes para que cargue rápido y te escriban.',
    lead='Si tu web ya existe pero es lenta, no muestra cómo contactarte o Google no la entiende, la ponemos al día y te mostramos la medición antes y después. Lista en 7 días.',
    plazo='7 días', tipo='Optimización de páginas web',
    para=['Tu web tarda en abrir en el celular.', 'No tiene botón de WhatsApp o tus datos no se ven a primera vista.', 'Al buscarte en Google aparece sin descripción o mal presentada.'],
    incluye=['Mejoras de velocidad en celular', 'Botón de WhatsApp y datos de contacto visibles', 'Descripción para Google y ajustes básicos de SEO', 'Medición antes y después con Google PageSpeed'],
    faqs=[('¿Cómo saben que mi web está lenta?', 'La medimos con Google PageSpeed, la herramienta oficial de Google, en versión celular. Te mostramos el resultado antes de empezar y después de terminar.'),
          ('¿Necesitan las claves de mi web?', 'Sí, el acceso al lugar donde está tu web. Te decimos exactamente cuál y lo devuelves o lo cambias al terminar.'),
          ('¿Y si mi web no tiene arreglo?', 'Si después de revisarla conviene más hacerla de nuevo, te lo decimos con la medición en la mano y tú decides.')]),
  dict(slug='instagram-facebook-negocio', id='redes', icono='redes', nombre='Redes en orden',
    titulo='Instagram y Facebook para tu negocio, en orden',
    desc='Tu Instagram y Facebook diciendo qué vendes, dónde quedas y cómo comprar: bio, destacados, página, 10 plantillas y calendario de 30 días. En 7 días.',
    h1='Que tu Instagram y tu Facebook digan qué vendes, dónde quedas y cómo comprar.',
    lead='Ordenamos tus redes para que quien llegue entienda en segundos qué ofreces y cómo pedirte. Te dejamos plantillas y un calendario para que publicar no sea un problema. Listo en 7 días.',
    plazo='7 días', tipo='Gestión de redes sociales para negocios',
    para=['Tu bio no dice qué vendes ni cómo comprar.', 'No tienes página de Facebook o está abandonada.', 'Quieres publicar con constancia pero no sabes qué ni cuándo.'],
    incluye=['Instagram de empresa con bio, destacados y enlace', 'Página de Facebook lista', '10 plantillas editables para publicar', 'Calendario de los primeros 30 días'],
    faqs=[('¿Ustedes publican por mí todos los meses?', 'No. Dejamos tus perfiles en orden, las plantillas y el calendario del primer mes para que tú publiques. No es un servicio mensual.'),
          ('¿Me consiguen seguidores?', 'No compramos ni prometemos seguidores. Ordenamos tus perfiles para que quien ya llega entienda qué vendes y te escriba.'),
          ('¿En qué programa quedan las plantillas?', 'En una herramienta gratuita de diseño, editables desde el celular.')]),
]

def paso(n, t, d):
    return f'<li><span class="sv-n">{n}</span><div><b>{t}</b><p>{d}</p></div></li>'

PASOS = [('Pides tus 3 hallazgos gratis', 'Nos cuentas qué vendes y revisamos cómo te ve hoy un cliente en internet: Google, Maps, tu web y tus redes.'),
         ('Te mostramos qué te falta', 'Recibes una propuesta privada con lo que encontramos, su prueba y solo los servicios que necesitas.'),
         ('Aceptas y nos envías tu material', 'Desde el mismo enlace: fotos, lista de productos y horario, por partes y desde el celular.'),
         ('Montamos en el plazo acordado', 'Te avisamos cada avance. El plazo corre desde que tenemos el anticipo y tu material.'),
         ('Te entregamos todo a tu nombre', 'Recibes los accesos y un reporte de entrega. Pagas el 50 % restante al entregar.')]

def faqs_html(faqs):
    return ''.join(f'<details class="sv-faq"><summary>{q}</summary><p>{a}</p></details>' for q, a in faqs)

def otros(actual):
    return ''.join(f'<a class="sv-otro" href="/servicios/{s["slug"]}/">{I(s["icono"])}<span><b>{s["nombre"]}</b><small>{s["plazo"]}</small></span></a>' for s in SERVICIOS if s['slug'] != actual)

def cuerpo_servicio(s):
    url = f'/servicios/{s["slug"]}/'
    return f'''<body class="tono-claro sv">
<a class="saltar" href="#contenido">Saltar al contenido</a>
{SPRITE}
{nav('serv')}
<main id="contenido">
<section class="sec sv-hero" data-tono="claro">
  <div class="wrap sv-wrap">
    <div class="sv-migas" role="navigation" aria-label="Estás en"><a href="/">Inicio</a> › <a href="/servicios/">Servicios</a> › <span>{s["nombre"]}</span></div>
    <span class="brace">{s["nombre"]} · listo en {s["plazo"]}</span>
    <h1>{s["h1"]}</h1>
    <p class="lead">{s["lead"]}</p>
    <div class="sv-cta"><a class="btn lime" href="{form('servicio-' + s['id'], necesita=s['id'])}">{I('reporte')}Cotiza gratis con tus 3 hallazgos</a><a class="btn ghost" href="{wa('Hola, quiero información de ' + s['nombre'] + ' de dtorh')}" target="_blank" rel="noopener">{I('whatsapp')}Escríbenos</a></div>
  </div>
</section>
<section class="sv-bloque"><div class="wrap sv-wrap">
  <h2>¿Es para tu negocio?</h2>
  <ul class="sv-lista">{''.join(f'<li>{I("check")}{x}</li>' for x in s["para"])}</ul>
</div></section>
<section class="sv-bloque"><div class="wrap sv-wrap">
  <h2>Qué incluye</h2>
  <ul class="sv-lista sv-inc">{''.join(f'<li>{I("check")}{x}</li>' for x in s["incluye"])}</ul>
  <div class="sv-datos"><span>{I('reloj')}Listo en {s["plazo"]}</span><span>{I('moneda')}Pago único: 50 % al empezar y 50 % al entregar</span><span>{I('escudo')}Si no funciona en el plazo, te devolvemos el anticipo</span><span>{I('llave')}Todo queda a tu nombre</span></div>
</div></section>
<section class="sv-bloque"><div class="wrap sv-wrap">
  <h2>Cómo trabajamos</h2>
  <ol class="sv-pasos">{''.join(paso(i + 1, t, d) for i, (t, d) in enumerate(PASOS))}</ol>
  <p class="sv-nota">Trabajamos en remoto con negocios de Barranquilla, Santa Marta, Cartagena y el resto de Colombia. <a href="/como-trabajamos/">Ver el proceso completo</a></p>
</div></section>
<section class="sv-bloque"><div class="wrap sv-wrap">
  <h2>Preguntas frecuentes</h2>
  {faqs_html(s["faqs"])}
</div></section>
<section class="sv-bloque sv-final"><div class="wrap sv-wrap">
  <h2>Primero te mostramos qué te falta. Gratis.</h2>
  <p class="lead">Revisamos cómo te ve hoy un cliente en internet y te enviamos 3 hallazgos con su prueba. Si te sirve, te cotizamos solo lo que necesitas.</p>
  <div class="sv-cta"><a class="btn lime" href="{form('servicio-' + s['id'] + '-final', necesita=s['id'])}">{I('reporte')}Pedir mis 3 hallazgos gratis</a></div>
  <h3 class="sv-otros-t">Otros servicios</h3>
  <div class="sv-otros">{otros(s["slug"])}</div>
</div></section>
</main>
{FOOTER}
{SCRIPTS}
</body>
</html>
'''

def ld_servicio(s):
    url = f'{BASE}/servicios/{s["slug"]}/'
    return ld({'@context': 'https://schema.org', '@type': 'Service', '@id': url + '#servicio', 'name': s['nombre'], 'serviceType': s['tipo'], 'description': s['desc'], 'url': url,
               'provider': {'@type': 'Organization', '@id': ORG_ID, 'name': 'dtorh', 'url': BASE + '/'}, 'areaServed': [{'@type': 'City', 'name': z} if z != 'Colombia' else {'@type': 'Country', 'name': z} for z in ZONAS],
               'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': s['nombre'], 'itemListElement': [{'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': x}} for x in s['incluye']]}},
              faq_ld(s['faqs']), migas([('Inicio', '/'), ('Servicios', '/servicios/'), (s['nombre'], f'/servicios/{s["slug"]}/')]))

PAGINAS = [('/', '1.0'), ('/servicios/', '0.9'), ('/como-trabajamos/', '0.8'), ('/laboratorio/', '0.6'), ('/privacidad/', '0.2')]
for s in SERVICIOS:
    os.makedirs(f'servicios/{s["slug"]}', exist_ok=True)
    html = head(s['titulo'] + ' | dtorh', s['desc'], f'{BASE}/servicios/{s["slug"]}/', ld_servicio(s)) + cuerpo_servicio(s)
    open(f'servicios/{s["slug"]}/index.html', 'w').write(html)
    PAGINAS.append((f'/servicios/{s["slug"]}/', '0.9'))

# ── /servicios/ (índice) ──
HUB = f'''<body class="tono-claro sv">
<a class="saltar" href="#contenido">Saltar al contenido</a>
{SPRITE}
{nav('serv')}
<main id="contenido">
<section class="sec sv-hero" data-tono="claro"><div class="wrap sv-wrap">
  <div class="sv-migas" role="navigation" aria-label="Estás en"><a href="/">Inicio</a> › <span>Servicios</span></div>
  <span class="brace">Servicios de dtorh</span>
  <h1>Solo lo que a tu negocio le falta en internet.</h1>
  <p class="lead">Ficha de Google, página web con catálogo, WhatsApp Business y redes. Por piezas o todo junto en el Arranque 360. Pago único y todo a tu nombre.</p>
  <div class="sv-cta"><a class="btn lime" href="{form('servicios')}">{I('reporte')}Cotiza gratis con tus 3 hallazgos</a></div>
</div></section>
<section class="sv-bloque"><div class="wrap sv-wrap"><div class="sv-grid">
{''.join(f'<a class="sv-card" href="/servicios/{s["slug"]}/"><span class="sv-ic">{I(s["icono"])}</span><h2 class="sv-card-t">{s["nombre"]}</h2><p>{s["lead"]}</p><small>Listo en {s["plazo"]} →</small></a>' for s in SERVICIOS)}
</div>
<p class="sv-nota">¿No sabes cuál necesitas? <a href="{form('servicios-nosabe')}">Pide tus 3 hallazgos gratis</a> y te decimos qué te falta, con pruebas.</p>
</div></section>
</main>
{FOOTER}
{SCRIPTS}
</body>
</html>
'''
os.makedirs('servicios', exist_ok=True)
open('servicios/index.html', 'w').write(head('Servicios de presencia digital para negocios | dtorh', 'Ficha de Google, página web con catálogo, WhatsApp Business y redes para negocios en Barranquilla y Colombia. Por piezas o todo junto, con pago único.', BASE + '/servicios/',
  ld({'@context': 'https://schema.org', '@type': 'ItemList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'url': f'{BASE}/servicios/{s["slug"]}/', 'name': s['nombre']} for i, s in enumerate(SERVICIOS)]}, migas([('Inicio', '/'), ('Servicios', '/servicios/')]))) + HUB)

# ── /como-trabajamos/ ──
FAQ_CT = [('¿Atienden solo en Barranquilla?', 'No. dtorh está en Barranquilla, pero trabajamos en remoto con negocios de toda Colombia: el diagnóstico, la propuesta, el envío de material y la entrega se hacen por internet y WhatsApp.'),
          ('¿Cuánto cuesta?', 'Depende de lo que le falte a tu negocio. Primero te enviamos tus 3 hallazgos gratis y luego una propuesta con precio fijo por escrito. Pagas 50 % al empezar y 50 % al entregar. La mensualidad solo existe si después eliges el plan opcional de mantenimiento.'),
          ('¿Qué pasa si no entregan a tiempo?', 'Si en el plazo acordado no está funcionando lo que te entregamos, te devolvemos el anticipo completo. El plazo corre desde que tenemos el anticipo y tu material.'),
          ('¿A nombre de quién quedan las cuentas?', 'A tu nombre: ficha de Google, dominio, perfiles y contenidos. Al terminar te entregamos los accesos.')]
CT = f'''<body class="tono-claro sv">
<a class="saltar" href="#contenido">Saltar al contenido</a>
{SPRITE}
{nav('pro')}
<main id="contenido">
<section class="sec sv-hero" data-tono="claro"><div class="wrap sv-wrap">
  <div class="sv-migas" role="navigation" aria-label="Estás en"><a href="/">Inicio</a> › <span>Cómo trabajamos</span></div>
  <span class="brace">Cómo trabajamos</span>
  <h1>Primero te mostramos qué te falta. Después lo montamos.</h1>
  <p class="lead">Somos un estudio digital de Barranquilla. Trabajamos con negocios pequeños y emprendedores de la Costa y de toda Colombia, en remoto, con precio fijo y pago único.</p>
  <div class="sv-cta"><a class="btn lime" href="{form('como-trabajamos')}">{I('reporte')}Pedir mis 3 hallazgos gratis</a></div>
</div></section>
<section class="sv-bloque"><div class="wrap sv-wrap">
  <h2>El proceso, paso a paso</h2>
  <ol class="sv-pasos">{''.join(paso(i + 1, t, d) for i, (t, d) in enumerate(PASOS))}</ol>
</div></section>
<section class="sv-bloque"><div class="wrap sv-wrap">
  <h2>Lo que vas a tener</h2>
  <div class="sv-datos"><span>{I('reporte')}Diagnóstico gratis con pruebas</span><span>{I('hoja')}Precio fijo por escrito</span><span>{I('moneda')}50 % al empezar, 50 % al entregar</span><span>{I('escudo')}Garantía de devolución del anticipo</span><span>{I('llave')}Todo a tu nombre</span><span>{I('web')}Alojamiento de la web sin costo</span></div>
</div></section>
<section class="sv-bloque"><div class="wrap sv-wrap">
  <h2>Servicios</h2>
  <div class="sv-otros">{otros('')}</div>
</div></section>
<section class="sv-bloque"><div class="wrap sv-wrap">
  <h2>Preguntas frecuentes</h2>
  {faqs_html(FAQ_CT)}
</div></section>
</main>
{FOOTER}
{SCRIPTS}
</body>
</html>
'''
os.makedirs('como-trabajamos', exist_ok=True)
open('como-trabajamos/index.html', 'w').write(head('Cómo trabajamos: diagnóstico gratis y precio fijo | dtorh', 'Estudio digital en Barranquilla para negocios de toda Colombia: 3 hallazgos gratis, precio fijo por escrito, 50 % al empezar y 50 % al entregar, con garantía.', BASE + '/como-trabajamos/',
  ld(faq_ld(FAQ_CT), migas([('Inicio', '/'), ('Cómo trabajamos', '/como-trabajamos/')]))) + CT)

# ── sitemap con fecha de hoy ──
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
import hashlib
try: LM = json.load(open('lastmod.json'))
except Exception: LM = {}
for u, pr in PAGINAS:
    f = (u.strip('/') + '/index.html') if u != '/' else 'index.html'
    try: hsh = hashlib.sha1(open(f, 'rb').read()).hexdigest()
    except Exception: hsh = ''
    if LM.get(u, {}).get('h') != hsh: LM[u] = {'h': hsh, 'f': HOY}
    sm.append(f'  <url><loc>{BASE}{u}</loc><lastmod>{LM[u]["f"]}</lastmod><priority>{pr}</priority></url>')
json.dump(LM, open('lastmod.json', 'w'), indent=1)
sm.append('</urlset>')
open('sitemap.xml', 'w').write('\n'.join(sm) + '\n')
print('servicios ok', len(SERVICIOS), 'páginas; sitemap', len(PAGINAS), 'URL')
