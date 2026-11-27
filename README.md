# dtorh.click

Sitio de **dtorh™**, estudio digital (Barranquilla, Colombia).
Publicado con **Cloudflare Pages** (proyecto `dtorh-sitio`), conectado a este repositorio.

- **Publicar = hacer push a `main`.** Cloudflare lo publica solo en ~1 minuto (plan gratis: 500 publicaciones/mes).
- Las páginas se generan con `python3 build.py` (inicio y `/laboratorio/`). Correrlo antes de hacer commit.
- Estilos: `assets/dtorh.css` · comportamiento: `assets/dtorh.js` · mapa del inicio: `assets/mapa.js`.
- `_redirects`: `/trabajos/` → `/laboratorio/`; `/cartas/pescaye/` → `desarrollador.click/dtorhdemo/pescaye/` (27-nov-2026: las demos viven en el taller, desarrollador.click).
- `_routes.json` (27-nov-2026): `/carta/`, `/cartas/`, `/assets/`, `/fonts/`, `/img/` e íconos NO pasan por `functions/_middleware.js`: esos pedidos son gratis e ilimitados y no gastan los 100.000 diarios que el plan gratis comparte con el Worker del Cazador y el agente. Esas carpetas solo pueden tener archivos públicos.
- Cartas: `python3 herramientas-carta/armar.py <slug> --taller ../conoce-tu-equipo` genera la demo en el taller.
- Vista previa siempre disponible en https://dtorh-sitio.pages.dev

Recursos de terceros: Lenis (MIT), Open Peeps (CC0), Inter Tight (OFL).
