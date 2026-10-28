// datos.dtorh.click -> sirve la carpeta /datos del mismo sitio.
// Lo que no exista dentro de /datos (fuentes, favicon) se sirve desde la raíz.
export async function onRequest(ctx) {
  const url = new URL(ctx.request.url);
  if (!url.hostname.startsWith('datos.')) return ctx.next();
  if (url.pathname.startsWith('/datos/')) return ctx.next();
  const dentro = new URL(url);
  dentro.pathname = '/datos' + url.pathname;
  const r = await ctx.env.ASSETS.fetch(new Request(dentro, ctx.request));
  if (r.status !== 404) return r;
  return ctx.next();
}
