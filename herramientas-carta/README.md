# Herramientas de dtorh™ Carta

Esta carpeta no se publica: el middleware la responde con 404.

| Archivo | Qué hace |
|---|---|
| `espejo.py` | Lee la carta actual del restaurante (fotos, PDF o texto) con Groq y deja `clientes/<slug>.json` |
| `armar.py` | Con `clientes/<slug>.json` publica la carta en `cartas/<slug>/`, más la versión para imprimir y los QR de las mesas |
| `clientes/` | Un JSON por restaurante (demo o cliente). Es la fuente de verdad de su carta |

El motor es `carta/index.html`, la demo pública con los temas Velada, Brasa, Mañana y Caribe. `armar.py` lo copia con los datos de un solo restaurante. Un cambio al motor se publica en todas las cartas la próxima vez que se corra `armar.py` para cada cliente.

## Demo para un prospecto (unos 20 minutos)

1. Conseguir la carta: el PDF de su web, capturas de su Instagram o fotos que manden.
2. Leerla:
   ```
   export GROQ_API_KEY=...   # la misma clave gratis del Cazador
   python3 herramientas-carta/espejo.py <slug> --nombre "Nombre" carta.pdf --tema caribe
   ```
   - El PDF de imagen necesita `pdftoppm` (Poppler). Sin Poppler, se pasan capturas.
   - Modelo: `meta-llama/llama-4-scout-17b-16e-instruct`, con máximo 5 páginas por llamada.
3. Revisar `clientes/<slug>.json`. Hay que mirar la lista `_revisar`, los precios, los nombres y los dibujos (`ilus`). Luego se ajustan marca, lema, colores, sedes y lo "recomendado". Lo recomendado se saca solo de reseñas públicas, nunca se inventa.
4. Publicar:
   ```
   python3 herramientas-carta/armar.py <slug>
   git add cartas/<slug> herramientas-carta/clientes/<slug>.json && git commit && git push
   ```
5. Enviar el enlace `dtorh.click/cartas/<slug>/`. La barra de arriba dice que es una demo, cuenta qué datos son de ejemplo y trae el botón "Activar mi carta", que abre el WhatsApp del estudio.

## Campos nuevos (motor 2.1.0)

- `tema: "caribe"`: papel crema, tinta verde, olas y tablillas. Sirve para comida de mar y cocina costeña.
- `ilustrado: true`: pone dibujos de línea en lugar de fotos. Con `conFoto: ["id"]` se usan fotos reales solo en esos platos.
- `ilus` en cada plato: `pez`, `camaron`, `sopa`, `arroz`, `pan`, `bebida`, `bandeja`, `patacon`, `croqueta`, `nino` o `plato`.
- `colores.tinta`, `colores.ola` y `colores.ola2`: los colores de los dibujos.
- `lema` y `paraTxt` en el plato. `intro` en la sección.
- `sello` en el restaurante, por ejemplo `"pesca|artesanal"`. También `causa` y `notaPrecios`.
- `textos.popular`: el nombre de la etiqueta "Lo más pedido", por ejemplo "Recomendado en reseñas".
- `propuesta: {url, texto, nota}`: la barra de demo para el prospecto. Al activar al cliente se borra y se cambia `licencia`.

## Al activar un cliente

Se borra `propuesta` y se ponen su `whatsapp` (con el 57 adelante), sus `pagos` reales, sus `zonas`, su `horario` y `licencia.vence`. Después se corre `armar.py` otra vez.
