// 1) www.dtorh.click y dtorh-sitio.pages.dev → dtorh.click (una sola dirección para Google: evita contenido duplicado).
//    Las vistas previas (<rama>.dtorh-sitio.pages.dev) se sirven, pero con noindex.
// 2) Archivos internos del repositorio (generadores, notas): no se publican aunque estén en la carpeta.
// 3) datos.dtorh.click -> sirve la carpeta /datos del mismo sitio.
//    Lo que no exista dentro de /datos se sirve desde la raíz solo si es un recurso (fuentes, íconos, estilos);
//    cualquier otra página se redirige a dtorh.click para no duplicar el sitio en el subdominio.
const INTERNOS = /^\/(build\.py|servicios\.py|README\.md|lastmod\.json)$|\.(py|md)$/i;
const RECURSO = /^\/(assets|fonts|img)\/|^\/(favicon[\w.-]*|apple-touch-icon\.png|icon-512\.png|og\.jpg|robots\.txt)$/;

async function noEncontrado(ctx, url) {
  const r = await ctx.env.ASSETS.fetch(new URL('/404.html', url));
  return new Response(r.body, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
}

export async function onRequest(ctx) {
  const url = new URL(ctx.request.url);
  if (url.hostname === 'www.dtorh.click' || url.hostname === 'dtorh-sitio.pages.dev') {
    return Response.redirect('https://dtorh.click' + url.pathname + url.search, 301);
  }
  if (INTERNOS.test(url.pathname)) return noEncontrado(ctx, url);
  if (url.hostname.endsWith('.dtorh-sitio.pages.dev')) {
    const r = await ctx.next();
    const n = new Response(r.body, r);
    n.headers.set('X-Robots-Tag', 'noindex');
    return n;
  }
  if (!url.hostname.startsWith('datos.')) return ctx.next();
  if (url.pathname.startsWith('/datos/')) return ctx.next();
  const dentro = new URL(url);
  dentro.pathname = '/datos' + url.pathname;
  const r = await ctx.env.ASSETS.fetch(new Request(dentro, ctx.request));
  if (r.status !== 404) return r;
  if (RECURSO.test(url.pathname)) return ctx.next();
  return Response.redirect('https://dtorh.click' + url.pathname + url.search, 301);
}
