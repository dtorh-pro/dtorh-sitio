/* =====================================================================
   dtorh® — Medición con consentimiento (Meta Pixel)
   · El píxel solo se carga si la persona acepta. Sin respuesta, no se mide.
   · La decisión se guarda en una cookie de .dtorh.click: vale para
     dtorh.click y datos.dtorh.click, se pregunta una sola vez.
   · window.dtorhEvento('Lead') envía un evento solo si hubo consentimiento.
   ===================================================================== */
(function(){
  var PIXEL = '1072942692461291', NOMBRE = 'dtorh_cookies';
  var enDominio = /(^|\.)dtorh\.click$/.test(location.hostname);

  function leer(){ var m = document.cookie.match(new RegExp('(?:^|; )' + NOMBRE + '=([^;]*)')); return m ? m[1] : null; }
  function guardar(v){
    document.cookie = NOMBRE + '=' + v + '; path=/; max-age=31536000; SameSite=Lax' + (enDominio ? '; domain=.dtorh.click; Secure' : '');
  }

  var cargado = false;
  function cargar(){
    if (cargado) return; cargado = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');
  }

  window.dtorhEvento = function(nombre, datos){
    if (leer() !== 'si') return;
    cargar();
    try{ window.fbq('track', nombre, datos || {}); }catch(e){}
  };

  /* clics a WhatsApp = intención de contacto */
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href*="wa.me/"],a[href*="m.me/"],a[href*="ig.me/"]');
    if (a) window.dtorhEvento('Contact', { content_name: a.href.indexOf('wa.me') > -1 ? 'WhatsApp' : 'Mensaje directo' });
  }, true);

  /* aviso: aparece solo si la persona aún no ha decidido */
  function aviso(){
    var css = document.createElement('style');
    css.textContent =
      '.dt-aviso{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:200;max-width:520px;margin:0 auto;' +
      'background:#0b0d1a;color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:16px 16px 14px;box-shadow:0 24px 60px -20px rgba(0,0,0,.6);' +
      'font:400 14px/1.5 "Inter Tight",system-ui,sans-serif;letter-spacing:-.01em;animation:dtA .5s cubic-bezier(.22,1,.3,1)}' +
      '.dt-aviso p{margin:0 0 12px;color:rgba(255,255,255,.82)}.dt-aviso a{color:#b28bff}' +
      '.dt-aviso .b{display:flex;gap:8px}.dt-aviso button{flex:1;min-height:44px;border-radius:12px;font:500 15px "Inter Tight",system-ui,sans-serif;cursor:pointer;border:1px solid rgba(255,255,255,.2);background:transparent;color:#fff}' +
      '.dt-aviso button.si{background:#7e3dff;border-color:#7e3dff}' +
      'html.con-aviso .float{bottom:calc(150px + env(safe-area-inset-bottom,0px))!important}html.con-aviso .barra{padding-bottom:150px!important}' +
      '@keyframes dtA{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}';
    document.head.appendChild(css);
    var d = document.createElement('div');
    d.className = 'dt-aviso'; d.setAttribute('role','dialog'); d.setAttribute('aria-label','Aviso de cookies');
    d.innerHTML = '<p>Usamos cookies de Meta solo para saber qué publicaciones y anuncios nos traen clientes. ¿Nos dejas medir tu visita? <a href="https://dtorh.click/privacidad/">Más información</a></p>' +
      '<div class="b"><button type="button" class="no">No, gracias</button><button type="button" class="si">Acepto</button></div>';
    document.body.appendChild(d);
    document.documentElement.classList.add('con-aviso');
    function cerrar(v){ guardar(v); d.remove(); document.documentElement.classList.remove('con-aviso'); if (v === 'si') cargar(); }
    d.querySelector('.si').onclick = function(){ cerrar('si'); };
    d.querySelector('.no').onclick = function(){ cerrar('no'); };
  }

  /* permite cambiar de opinión desde la página de privacidad */
  window.dtorhCookies = function(){ guardar(''); document.cookie = NOMBRE + '=; path=/; max-age=0' + (enDominio ? '; domain=.dtorh.click' : ''); location.reload(); };

  function iniciar(){
    var v = leer();
    if (v === 'si') cargar();
    else if (v !== 'no') aviso();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
