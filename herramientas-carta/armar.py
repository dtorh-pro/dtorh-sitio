#!/usr/bin/env python3
"""armar.py · dtorh™ Carta
Toma clientes/<slug>.json y publica en el sitio:
  cartas/<slug>/index.html           carta digital (un solo archivo, el motor de /carta/)
  cartas/<slug>/imprimir/index.html  carta imprimible (A4, "Guardar como PDF") con QR
  cartas/<slug>/mesas/index.html     QR por mesa para recortar (modo mesa)
  cartas/<slug>/qr.svg               QR general

Uso: python3 herramientas-carta/armar.py pescaye [--mesas 12]
     Demo en el taller (27-nov-2026): python3 herramientas-carta/armar.py pescaye --taller ../conoce-tu-equipo
       → publica en <taller>/dtorhdemo/<slug>/ con la dirección https://desarrollador.click/dtorhdemo/<slug>/
Requiere segno (QR, licencia BSD, sin dependencias): pip install segno
"""
import argparse, html, json, os, re, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
MOTOR = os.path.join(RAIZ, 'carta', 'index.html')
DOMINIO = 'https://dtorh.click'

try:
    import segno
except ImportError:
    segno = None


def qr_svg(url, color='#1d3a2a', escala=6):
    if not segno:
        sys.exit('Falta segno para los QR: pip install segno')
    q = segno.make(url, error='m')
    s = q.svg_inline(scale=escala, dark=color, light=None, border=2)
    return s


def esc(t):
    return html.escape(str(t or ''), quote=True)


def fmt(n):
    return '$ ' + '{:,}'.format(int(n)).replace(',', '.')


def carta_digital(R, url):
    m = open(MOTOR, encoding='utf-8').read()
    ini = m.index('<script>\n/* dtorh™ Carta — datos')
    fin = m.index('</script>', ini) + len('</script>')
    datos = {k: v for k, v in R.items() if not k.startswith('_') and k != 'propuesta'}
    m = m[:ini] + '<script>\nwindow.CARTAS = {};\nwindow.CARTAS[%s] = %s;\n</script>' % (json.dumps(R['slug']), json.dumps(datos, ensure_ascii=False)) + m[fin:]
    conf = re.search(r'<script>window\.CARTA_CTA = .*?</script>', m).group(0)
    ajustes = 'window.CARTA_SLUG = %s; window.CARTA_FOTOS = "fotos/";' % json.dumps(R['slug'])
    if R.get('propuesta'):
        ajustes += ' window.CARTA_PROPUESTA = %s;' % json.dumps(R['propuesta'], ensure_ascii=False)
    m = m.replace(conf, '<script>' + ajustes + '</script>')
    m = re.sub(r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="%s">' % url, m)
    m = re.sub(r'<title>.*?</title>', '<title>%s · Carta</title>' % esc(R['nombre']), m)
    desc = 'Carta de %s: pide por WhatsApp y paga con Bre-B, Nequi o tarjeta.' % R['nombre']
    m = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % esc(desc), m)
    if R.get('propuesta') and '<meta name="robots"' not in m:
        m = m.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex">')
    return m


CSS_IMPRIMIR = """
@page { size: A4; margin: 12mm 13mm; }
:root { --papel:#f3ead9; --tinta:#1d3a2a; --marca:#e4622b; --ola:#3ba7a6; }
* { box-sizing: border-box; }
body { margin: 0; background: #d9d4c8; color: var(--tinta); font: 400 10.6pt/1.42 "Jost", "Segoe UI", sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.barra { position: sticky; top: 0; z-index: 2; display: flex; gap: 12px; align-items: center; justify-content: center; flex-wrap: wrap; padding: 10px 16px; background: #10231a; color: #e9efe9; font: 500 14px system-ui, sans-serif; }
.barra button { font: 600 14px system-ui, sans-serif; padding: 8px 16px; border: 0; border-radius: 999px; background: #c8f25a; color: #0f1412; cursor: pointer; }
.hoja { width: 210mm; min-height: 297mm; margin: 18px auto; padding: 12mm 13mm; background: var(--papel); box-shadow: 0 10px 40px rgba(0,0,0,.18); }
@media print { body { background: none; } .barra { display: none; } .hoja { margin: 0; width: auto; min-height: auto; padding: 0; box-shadow: none; background: none; } html { background: var(--papel); } }
.cab { text-align: center; padding-bottom: 6mm; border-bottom: 2.5pt solid var(--tinta); margin-bottom: 6mm; }
.cab .sub { font-size: 8.5pt; letter-spacing: .3em; text-transform: uppercase; }
.cab h1 { font: 700 54pt/.9 "Caveat", cursive; color: var(--marca); margin: 2mm 0 1mm; transform: rotate(-2deg); }
.cab .lema { font-style: italic; }
.cols { column-count: 2; column-gap: 9mm; }
.sec { break-inside: avoid-column; margin-bottom: 6mm; }
.sec h2 { font: 400 17pt/1 "Anton", Impact, sans-serif; text-transform: uppercase; letter-spacing: .02em; text-align: center; padding: 2.2mm 0 1.6mm; border-block: 2pt solid var(--tinta); margin: 0 0 1.5mm; }
.sec .et { text-align: center; font-size: 7.5pt; letter-spacing: .26em; text-transform: uppercase; margin-bottom: 2mm; }
.sec .intro { font-style: italic; font-size: 9pt; margin-bottom: 2.5mm; }
.it { break-inside: avoid; padding: 1.8mm 0 2mm; border-bottom: .6pt dashed #b9ab8d; }
.it:last-child { border-bottom: 0; }
.fila { display: flex; gap: 3mm; align-items: baseline; justify-content: space-between; }
.nom { font: 400 11.5pt/1.1 "Anton", Impact, sans-serif; text-transform: uppercase; letter-spacing: .01em; }
.pre { flex: none; background: var(--tinta); color: var(--papel); font: 400 10pt/1 "Anton", Impact, sans-serif; padding: 1.2mm 1.6mm 1mm; }
.lem { font-style: italic; font-size: 9pt; }
.per { font: 700 11pt/1 "Caveat", cursive; color: var(--marca); }
.des { font-size: 9pt; }
.pie { break-inside: avoid; display: grid; grid-template-columns: 30mm 1fr; gap: 6mm; align-items: center; margin-top: 4mm; padding-top: 5mm; border-top: 2.5pt solid var(--tinta); }
.pie svg { width: 30mm; height: 30mm; display: block; }
.pie b { font: 400 13pt "Anton", Impact, sans-serif; text-transform: uppercase; }
.pie p { margin: 1mm 0; font-size: 9pt; }
.legal { font-size: 7.5pt; color: #4f5f52; margin-top: 3mm; text-align: center; }
.mesas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6mm; }
.mesa { break-inside: avoid; border: 1.6pt dashed var(--tinta); padding: 5mm 4mm; text-align: center; background: #fbf6ec; }
.mesa .n { font: 400 22pt/1 "Anton", Impact, sans-serif; text-transform: uppercase; }
.mesa svg { width: 38mm; height: 38mm; display: block; margin: 3mm auto; }
.mesa .r { font: 700 18pt/1 "Caveat", cursive; color: var(--marca); }
.mesa small { display: block; font-size: 7.5pt; }
"""

FUENTES = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@700&family=Jost:ital,wght@0,400;0,600;1,400&display=swap">'


def colores_css(R):
    c = R.get('colores', {})
    return ':root{--marca:%s;--tinta:%s;--ola:%s}' % (c.get('acento', '#e4622b'), c.get('tinta', '#1d3a2a'), c.get('ola', '#3ba7a6'))


def pagina(R, titulo, cuerpo, barra):
    return ('<!doctype html><html lang="es-CO"><head><meta charset="utf-8"><meta name="robots" content="noindex">'
            '<meta name="viewport" content="width=device-width, initial-scale=1"><title>%s</title>%s<style>%s%s</style></head>'
            '<body><div class="barra">%s <button type="button" onclick="print()">Imprimir o guardar en PDF</button></div>%s</body></html>'
            % (esc(titulo), FUENTES, CSS_IMPRIMIR, colores_css(R), barra, cuerpo))


def pagos_txt(R):
    n = [p['nombre'].replace('Tarjeta al recibir', 'tarjeta') for p in R.get('pagos', [])]
    return ', '.join(n[:-1]) + ' o ' + n[-1] if len(n) > 1 else (n[0] if n else 'el medio que prefieras')


def carta_imprimible(R, url):
    secs = []
    for c in R['categorias']:
        items = []
        for p in c['productos']:
            items.append('<div class="it"><div class="fila"><span class="nom">%s</span><span class="pre">%s</span></div>%s%s%s</div>' % (
                esc(p['nombre']), fmt(p['precio']),
                '<div class="lem">%s</div>' % esc(p['lema']) if p.get('lema') else '',
                '<div class="per">%s</div>' % esc(p.get('paraTxt') or 'Para %s personas' % p['personas']) if p.get('personas', 1) > 1 else '',
                '<div class="des">%s</div>' % esc(p['desc']) if p.get('desc') else ''))
        secs.append('<section class="sec"><h2>%s</h2>%s%s%s</section>' % (
            esc(c['nombre']), '<div class="et">%s</div>' % esc(c['etiqueta']) if c.get('etiqueta') else '',
            '<div class="intro">%s</div>' % esc(c['intro']) if c.get('intro') else '', ''.join(items)))
    contacto = []
    if R.get('whatsapp'):
        contacto.append('WhatsApp ' + esc(R['whatsapp']))
    if R.get('instagram'):
        contacto.append('@' + esc(R['instagram']))
    cuerpo = ('<main class="hoja"><header class="cab"><div class="sub">%s</div><h1>%s</h1><div class="lema">%s</div></header>'
              '<div class="cols">%s</div>'
              '<footer class="pie">%s<div><b>Pide desde tu celular</b><p>Escanea el código: ves la carta completa, armas tu pedido y le llega listo a nuestro WhatsApp. Pagas con %s.</p><p>%s</p><p>%s</p></div></footer>'
              '<p class="legal">%s %s</p></main>') % (
        esc(R.get('subtitulo')), esc(R['nombre']), esc(R.get('lema')), ''.join(secs), qr_svg(url, R.get('colores', {}).get('tinta', '#1d3a2a'), 4),
        esc(pagos_txt(R)), esc(url.replace('https://', '')), ' · '.join(contacto),
        esc(R.get('notaPrecios') or 'Precios en pesos colombianos, con impuestos incluidos.'), esc(R.get('direccion')))
    return pagina(R, R['nombre'] + ' · Carta para imprimir', cuerpo, 'Carta impresa de <b>%s</b> · Sale de los mismos datos de la carta digital' % esc(R['nombre']))


def mesas(R, url, n):
    tarjetas = ''.join('<div class="mesa"><div class="n">Mesa %d</div>%s<div class="r">Pide desde aquí</div><small>Escanea con la cámara · %s</small></div>' % (
        i, qr_svg('%s#mesa-%d' % (url, i), R.get('colores', {}).get('tinta', '#1d3a2a'), 4), esc(R['nombre'])) for i in range(1, n + 1))
    cuerpo = '<main class="hoja"><div class="mesas">%s</div></main>' % tarjetas
    return pagina(R, R['nombre'] + ' · QR de mesas', cuerpo, 'QR de mesas de <b>%s</b> · Imprime, recorta y pega en cada mesa' % esc(R['nombre']))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('slug')
    ap.add_argument('--mesas', type=int, default=12)
    ap.add_argument('--taller', help='carpeta del repositorio del taller (desarrollador.click): la demo va a dtorhdemo/<slug>/')
    a = ap.parse_args()
    ruta = os.path.join(AQUI, 'clientes', a.slug + '.json')
    R = json.load(open(ruta, encoding='utf-8'))
    if R.get('_revisar'):
        print('Ojo, hay puntos por revisar en el JSON:', *R['_revisar'], sep='\n  ')
    if a.taller:
        url = 'https://desarrollador.click/dtorhdemo/%s/' % R['slug']
        dest = os.path.join(os.path.abspath(a.taller), 'dtorhdemo', R['slug'])
    else:
        url = '%s/cartas/%s/' % (DOMINIO, R['slug'])
        dest = os.path.join(RAIZ, 'cartas', R['slug'])
    for sub in ('', 'imprimir', 'mesas'):
        os.makedirs(os.path.join(dest, sub), exist_ok=True)
    escribir = lambda p, t: open(os.path.join(dest, p), 'w', encoding='utf-8').write(t)
    escribir('index.html', carta_digital(R, url))
    escribir('imprimir/index.html', carta_imprimible(R, url))
    escribir('mesas/index.html', mesas(R, url, a.mesas))
    escribir('qr.svg', '<?xml version="1.0" encoding="utf-8"?>\n' + qr_svg(url, R.get('colores', {}).get('tinta', '#1d3a2a'), 8))
    print('Listo →', url)
    print('  imprimir:', url + 'imprimir/')
    print('  mesas:   ', url + 'mesas/')


if __name__ == '__main__':
    main()
