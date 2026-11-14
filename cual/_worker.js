// Cuál (cual.click) · Cloudflare Pages en modo avanzado. Sirve los archivos tal cual y, cuando el enlace trae ?a=&b=
// (el que se comparte por WhatsApp), cambia las etiquetas Open Graph para que la vista previa muestre la imagen de esos
// dos equipos (og/<a>-<b>.jpg, generadas por dtorh). Sin datos de nadie, sin servicios externos. Generado por og/gen.py.
const NOMBRES = {"ip18pm": "iPhone 18 Pro Max", "ip18p": "iPhone 18 Pro", "ip17pm": "iPhone 17 Pro Max", "ip17": "iPhone 17", "ip16": "iPhone 16", "s26u": "Galaxy S26 Ultra", "s25u": "Galaxy S25 Ultra", "s25": "Galaxy S25", "a56": "Galaxy A56", "x17t": "Xiaomi 17T", "rn15p": "Redmi Note 15 Pro 5G", "rn14": "Redmi Note 14", "px8p": "POCO X8 Pro", "e70f": "Motorola Edge 70 Fusion", "g56": "Moto G56", "ip17p": "iPhone 17 Pro", "a57": "Galaxy A57", "rn17": "Redmi Note 17 5G", "reno16f": "OPPO Reno 16F", "oa6": "OPPO A6 5G", "vv70fe": "vivo V70 FE", "hon600s": "Honor 600 Smart", "honx8d": "Honor X8d", "hn15m": "Huawei nova 15 Max", "e60f": "Motorola Edge 60 Fusion", "px7p": "POCO X7 Pro"};
const SEGURIDAD = {"X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "Permissions-Policy": "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()", "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://i.ytimg.com; frame-src https://www.youtube-nocookie.com; connect-src 'self' https://cloudflareinsights.com https://motor-dtorh.dtorh-ofc.workers.dev; frame-ancestors 'self' https://dtorh.click https://*.dtorh-sitio.pages.dev; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests"};
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const res = await env.ASSETS.fetch(req);
    if (url.pathname !== '/' && url.pathname !== '/index.html') return res;
    if (!(res.headers.get('content-type') || '').includes('text/html')) return res;
    const h = new Headers(res.headers);
    for (const k in SEGURIDAD) if (!h.has(k)) h.set(k, SEGURIDAD[k]);
    const a = url.searchParams.get('a'), b = url.searchParams.get('b');
    if (!(NOMBRES[a] && NOMBRES[b] && a !== b)) return new Response(res.body, { status: res.status, headers: h });
    const titulo = NOMBRES[a] + ' vs ' + NOMBRES[b] + ' · Cuál';
    const desc = 'Compáralos ronda por ronda y mira cuál te conviene, con precios de hoy en Colombia. Gratis, sin vender equipos.';
    const img = 'https://cual.click/og/' + a + '-' + b + '.jpg', enlace = 'https://cual.click/?a=' + a + '&b=' + b;
    const poner = (v) => ({ element(e) { e.setAttribute('content', v); } });
    h.set('Cache-Control', 'public, max-age=300');
    return new HTMLRewriter()
      .on('meta[property="og:title"]', poner(titulo)).on('meta[name="twitter:title"]', poner(titulo))
      .on('meta[property="og:description"]', poner(desc))
      .on('meta[property="og:image"]', poner(img)).on('meta[name="twitter:image"]', poner(img))
      .on('meta[property="og:image:alt"]', poner(NOMBRES[a] + ' frente a ' + NOMBRES[b]))
      .on('meta[property="og:url"]', poner(enlace))
      .on('title', { element(e) { e.setInnerContent(esc(titulo)); } })
      .transform(new Response(res.body, { status: res.status, headers: h }));
  },
};
