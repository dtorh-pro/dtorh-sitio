#!/usr/bin/env python3
"""Espejo · dtorh™ Carta
Convierte la carta actual de un restaurante (fotos, PDF o texto) en el archivo de datos
de dtorh™ Carta. Con ese archivo, armar.py publica la demo del prospecto.

Lee la carta con Groq (modelo con visión meta-llama/llama-4-scout-17b-16e-instruct,
máximo 5 imágenes por llamada) usando la clave de la variable GROQ_API_KEY.
No usa créditos de Claude. Solo usa la biblioteca estándar de Python
(y pdftoppm de Poppler, si la carta viene en PDF de imagen).

Uso:
  python3 espejo.py pescaye --nombre "Pescayé" carta.pdf
  python3 espejo.py fogon --nombre "Fogón" foto1.jpg foto2.jpg --tema brasa
  python3 espejo.py casa-x --nombre "Casa X" --texto carta.txt
  python3 espejo.py pescaye --nombre "Pescayé" --respuesta lectura.json   (sin llamar a Groq)

Sale: clientes/<slug>.json  (revísalo antes de armar: precios, nombres y la lista "revisar").
"""
import argparse, base64, datetime, json, mimetypes, os, re, shutil, subprocess, sys, tempfile, unicodedata, urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
MODELO = os.environ.get('GROQ_MODELO', 'meta-llama/llama-4-scout-17b-16e-instruct')
GROQ = os.environ.get('GROQ_BASE', 'https://api.groq.com/openai/v1') + '/chat/completions'
WA_ESTUDIO = '573024135572'

INSTRUCCION = """Eres un transcriptor de cartas de restaurantes de Colombia.
Lee las imágenes de la carta y devuelve SOLO un JSON con esta forma:
{"categorias":[{"nombre":"...","etiqueta":"subtítulo de la sección o vacío","intro":"texto introductorio de la sección o vacío",
"productos":[{"nombre":"...","lema":"frase corta en cursiva o vacío","desc":"descripción completa tal cual","precio":25000,"personas":1,"para":"texto de personas tal cual o vacío"}]}]}
Reglas:
- Copia los textos tal como aparecen (con tildes), sin inventar ni resumir. Si un plato no tiene descripción, desc vacío.
- precio es un número entero en pesos: "25000", "25.000", "25 mil" y "$25,000" son 25000. Si no ves precio, pon 0.
- Respeta el orden de la carta. Si una sección continúa en otra página, usa el mismo nombre.
- Ignora logos, redes, códigos QR y frases de marca que no sean platos.
- personas: si dice "(6-7 personas)" pon 6 y para "6–7 personas"; si no dice, 1."""

ILUS_REGLAS = [
    (r'\bsopa|caldo|sancocho|crema de', 'sopa'),
    (r'\barroz|paella|caldero', 'arroz'),
    (r'camar[oó]n|gamba|langostino', 'camaron'),
    (r'burger|hamburguesa|perro|s[aá]ndwich|sandwich|pan\b|wrap', 'pan'),
    (r'patac[oó]n|tost[oó]n', 'patacon'),
    (r'croqueta|carima[ñn]ola|empanada|bu[ñn]uelo', 'croqueta'),
    (r'infantil|kids|ni[ñn]o', 'nino'),
    (r'bandeja|picada|para compartir|mesa ', 'bandeja'),
    (r'cerveza|gaseosa|\bagua|jugo|limonada|soda|ginger|vino\b|pellegrino|\bt[eé] (helado|fr[ií]o|caliente)|caf[eé]|\bdry\b|bebida|malteada|michelada', 'bebida'),
    (r'pescado|mojarra|r[oó]balo|lebranche|pargo|corvina|filete|ceviche|pesca|bagre|sierra|at[uú]n|salm[oó]n', 'pez'),
]


def slug(t):
    t = unicodedata.normalize('NFD', t).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:40] or 'item'


def precio(v):
    if isinstance(v, (int, float)):
        return int(round(v))
    s = str(v or '').lower().replace('mil', '000')
    d = re.sub(r'\D', '', s)
    return int(d) if d else 0


def imagenes_de(rutas):
    """Devuelve rutas de imágenes; los PDF se pasan a PNG página por página."""
    salida, tmp = [], None
    for r in rutas:
        if r.lower().endswith('.pdf'):
            if not shutil.which('pdftoppm'):
                sys.exit('La carta es PDF y no encuentro pdftoppm (Poppler). Instálalo o manda capturas de cada página.')
            tmp = tmp or tempfile.mkdtemp(prefix='espejo-')
            base = os.path.join(tmp, slug(os.path.basename(r)))
            subprocess.run(['pdftoppm', '-r', '110', '-png', r, base], check=True)
            salida += sorted(os.path.join(tmp, f) for f in os.listdir(tmp) if f.startswith(os.path.basename(base)))
        else:
            salida.append(r)
    return salida


def groq(contenido):
    clave = os.environ.get('GROQ_API_KEY')
    if not clave:
        sys.exit('Falta GROQ_API_KEY en el entorno (la misma clave gratis que usa el Cazador).')
    cuerpo = {'model': MODELO, 'temperature': 0, 'max_completion_tokens': 8000,
              'response_format': {'type': 'json_object'},
              'messages': [{'role': 'system', 'content': INSTRUCCION}, {'role': 'user', 'content': contenido}]}
    req = urllib.request.Request(GROQ, data=json.dumps(cuerpo).encode(), headers={'Authorization': 'Bearer ' + clave, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=180) as r:
        datos = json.load(r)
    return json.loads(datos['choices'][0]['message']['content'])


def leer_con_groq(imagenes, texto):
    if texto:
        return groq('Esta es la carta en texto:\n\n' + texto)
    total = {'categorias': []}
    for i in range(0, len(imagenes), 5):
        lote = imagenes[i:i + 5]
        partes = [{'type': 'text', 'text': 'Páginas %d a %d de la carta.' % (i + 1, i + len(lote))}]
        for ruta in lote:
            tipo = mimetypes.guess_type(ruta)[0] or 'image/png'
            with open(ruta, 'rb') as f:
                partes.append({'type': 'image_url', 'image_url': {'url': 'data:%s;base64,%s' % (tipo, base64.b64encode(f.read()).decode())}})
        print('Leyendo páginas %d-%d con Groq…' % (i + 1, i + len(lote)))
        unir(total, groq(partes))
    return total


def unir(total, nuevo):
    for c in nuevo.get('categorias', []):
        previa = next((x for x in total['categorias'] if slug(x['nombre']) == slug(c.get('nombre', ''))), None)
        if previa:
            previa['productos'] += c.get('productos', [])
        else:
            total['categorias'].append(c)


def ilus_de(nombre, desc, categoria, personas=1):
    if personas > 1:
        return 'bandeja'
    for patron, tipo in ILUS_REGLAS:
        if re.search(patron, nombre.lower()):
            return tipo
    for patron, tipo in ILUS_REGLAS:
        if re.search(patron, categoria.lower()):
            return tipo
    for patron, tipo in ILUS_REGLAS:
        if tipo != 'bebida' and re.search(patron, (desc or '').lower()):
            return tipo
    return 'plato'


def normalizar(lectura, args):
    usados, revisar, cats = set(), [], []
    for c in lectura.get('categorias', []):
        cid = slug(c.get('nombre', 'seccion'))
        while cid in usados:
            cid += '-2'
        usados.add(cid)
        prods = []
        for p in c.get('productos', []):
            nombre = (p.get('nombre') or '').strip()
            if not nombre:
                continue
            pid = slug(nombre)
            while pid in usados:
                pid += '-2'
            usados.add(pid)
            item = {'id': pid, 'nombre': nombre, 'desc': (p.get('desc') or '').strip(), 'precio': precio(p.get('precio'))}
            if p.get('lema'):
                item['lema'] = p['lema'].strip()
            per = int(p.get('personas') or 1)
            if per > 1:
                item['personas'] = per
                item['tags'] = ['compartir']
                if p.get('para'):
                    item['paraTxt'] = p['para']
            item['ilus'] = ilus_de(nombre, item['desc'], c.get('nombre', ''), per)
            if item['precio'] <= 0:
                revisar.append('Sin precio: ' + nombre)
            elif item['precio'] < 1000 or item['precio'] > 2000000:
                revisar.append('Precio raro (%s): %s' % (item['precio'], nombre))
            prods.append(item)
        if prods:
            cat = {'id': cid, 'nombre': c['nombre'].strip(), 'icono': 'plato', 'productos': prods}
            if c.get('etiqueta'):
                cat['etiqueta'] = c['etiqueta'].strip()
            if c.get('intro'):
                cat['intro'] = c['intro'].strip()
            cats.append(cat)
    return cats, revisar


def base_restaurante(args, cats, revisar):
    hoy = datetime.date.today()
    vence = (hoy + datetime.timedelta(days=21)).isoformat()
    abre = [['12:00', '21:00']]
    msg = 'Hola, vi la demo de la carta digital de %s y quiero activarla' % args.nombre
    return {
        'slug': args.slug, 'tema': args.tema, 'nombre': args.nombre,
        'lema': '', 'subtitulo': 'Barranquilla', 'hero': '', 'ilustrado': True,
        'textos': {'destacados': 'Lo más pedido', 'promo': 'Hoy'},
        'prefijo': re.sub(r'[^A-Z]', '', unicodedata.normalize('NFD', args.nombre).upper())[:3] or 'PED',
        'colores': {'acento': '#e4622b', 'tinta': '#1d3a2a', 'ola': '#3ba7a6', 'ola2': '#2f7fb0'},
        'whatsapp': '', 'instagram': '', 'direccion': '', 'tiempo': '40–60 min',
        'licencia': {'plan': 'Demo', 'vence': vence},
        'horario': {str(d): abre for d in range(7)},
        'modos': ['domicilio', 'recoger', 'mesa'], 'reservas': True,
        'minimo': 30000, 'domicilioGratisDesde': 0,
        'zonas': [{'id': 'norte', 'nombre': 'Norte (ejemplo)', 'costo': 6000}, {'id': 'centro', 'nombre': 'Centro (ejemplo)', 'costo': 7000}],
        'pagos': [
            {'id': 'breb', 'nombre': 'Bre-B', 'detalle': 'Transferencia inmediata desde cualquier banco o billetera', 'llave': 'de ejemplo'},
            {'id': 'nequi', 'nombre': 'Nequi', 'detalle': 'Envía al número', 'numero': '300 000 0000 (ejemplo)'},
            {'id': 'datafono', 'nombre': 'Tarjeta al recibir', 'detalle': 'El domiciliario lleva datáfono', 'soloEntrega': True}],
        'promos': [], 'sugerir': [],
        'asistente': {'antojos': []},
        'categorias': cats,
        'propuesta': {'url': 'https://wa.me/%s?text=%s' % (WA_ESTUDIO, urllib.request.quote(msg)), 'texto': 'Activar mi carta',
                      'nota': 'Platos y precios tomados de su carta. Horario, zonas de domicilio y medios de pago son de ejemplo y se ajustan con ustedes.'},
        '_revisar': revisar,
        '_espejo': {'fecha': hoy.isoformat(), 'modelo': MODELO if not args.respuesta else 'respuesta manual', 'fuente': [os.path.basename(x) for x in args.archivos] or ([os.path.basename(args.texto)] if args.texto else [])},
    }


def main():
    ap = argparse.ArgumentParser(description='Espejo: carta actual → datos de dtorh™ Carta')
    ap.add_argument('slug')
    ap.add_argument('archivos', nargs='*', help='fotos o PDF de la carta')
    ap.add_argument('--nombre', required=True)
    ap.add_argument('--tema', default='caribe', choices=['velada', 'brasa', 'manana', 'caribe'])
    ap.add_argument('--texto', help='archivo .txt con la carta escrita')
    ap.add_argument('--respuesta', help='JSON ya leído (no llama a Groq; útil para pruebas o correcciones)')
    ap.add_argument('--salida', default=os.path.join(AQUI, 'clientes'))
    args = ap.parse_args()
    args.slug = slug(args.slug)
    if args.respuesta:
        with open(args.respuesta, encoding='utf-8') as f:
            lectura = json.load(f)
    else:
        if not args.archivos and not args.texto:
            ap.error('Pasa fotos/PDF de la carta, --texto o --respuesta')
        texto = open(args.texto, encoding='utf-8').read() if args.texto else ''
        lectura = leer_con_groq(imagenes_de(args.archivos), texto)
    cats, revisar = normalizar(lectura, args)
    if not cats:
        sys.exit('No salió ningún plato. Revisa que las imágenes se lean bien.')
    os.makedirs(args.salida, exist_ok=True)
    destino = os.path.join(args.salida, args.slug + '.json')
    if os.path.exists(destino):
        destino = destino.replace('.json', '.nuevo.json')
        print('Ya existía el cliente: dejé la lectura nueva aparte para no pisar ajustes →', destino)
    with open(destino, 'w', encoding='utf-8') as f:
        json.dump(base_restaurante(args, cats, revisar), f, ensure_ascii=False, indent=2)
    n = sum(len(c['productos']) for c in cats)
    print('Listo: %d secciones, %d platos → %s' % (len(cats), n, destino))
    for r in revisar:
        print('  REVISAR:', r)


if __name__ == '__main__':
    main()
