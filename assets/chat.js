/* =====================================================================
   dtorh™ — chat con el asistente del estudio
   El mismo agente que atiende WhatsApp, Instagram y Messenger (Worker motor-dtorh, ruta /chat).
   Sin cookies: un id al azar en este navegador para seguir la conversación.
   Superficies sólidas, un solo color de marca, una animación por elemento.
   ===================================================================== */
(function(){
  if (window.dtorhChat) return;
  var API = 'https://motor-dtorh.dtorh-ofc.workers.dev/chat';
  var WA = 'https://wa.me/573024135572?text=' + encodeURIComponent('Hola, vengo del chat de la página de dtorh');
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CSS = ''
  + '.dc-boton{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:99;height:54px;padding:0 18px 0 14px;border-radius:9999px;border:0;cursor:pointer;display:flex;align-items:center;gap:10px;background:var(--lime,#7e3dff);color:#fff;font:600 14px/1 "Inter Tight",system-ui,sans-serif;letter-spacing:-.01em;box-shadow:0 16px 34px -14px rgba(60,20,160,.8);transition:transform .35s var(--ease,ease),opacity .3s ease}'
  + '.dc-boton:hover{transform:translateY(-2px)}.dc-boton:focus-visible{outline:3px solid var(--cyan,#24aeff);outline-offset:3px}'
  + '.dc-boton .dc-ll{font:700 18px/1 ui-monospace,Menlo,monospace;opacity:.75}.dc-boton b{font-weight:600}'
  + '.dc-boton i{width:8px;height:8px;border-radius:50%;background:#2bb673;box-shadow:0 0 0 3px rgba(255,255,255,.25)}'
  + '.dc-abierto .dc-boton{opacity:0;pointer-events:none}'
  + '.dc-panel{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:100;width:min(390px,calc(100vw - 36px));height:min(600px,calc(100vh - 110px));display:flex;flex-direction:column;'
  + 'background:var(--card,#fff);color:var(--ink,#14151c);border:1px solid var(--hair,#e6e4ee);border-radius:22px;box-shadow:0 30px 70px -30px rgba(20,10,60,.55);overflow:hidden;'
  + 'transform-origin:100% 100%;opacity:0;transform:scale(.92) translateY(10px);pointer-events:none;transition:opacity .28s ease,transform .38s var(--ease,ease);font:15px/1.45 "Inter Tight",system-ui,sans-serif}'
  + '.dc-abierto .dc-panel{opacity:1;transform:none;pointer-events:auto}'
  + '.dc-cab{display:flex;align-items:center;gap:12px;padding:14px 14px 12px 16px;border-bottom:1px solid var(--hair,#e6e4ee)}'
  + '.dc-av{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:var(--lime,#7e3dff);color:#fff;font:700 15px/1 ui-monospace,Menlo,monospace;flex:none}'
  + '.dc-cab h2{margin:0;font-size:15px;font-weight:600;letter-spacing:-.01em}.dc-cab p{margin:1px 0 0;font-size:12.5px;color:var(--ash,#5d5e6b)}'
  + '.dc-cab p i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#2bb673;margin-right:6px;vertical-align:1px}'
  + '.dc-x{margin-left:auto;width:36px;height:36px;border-radius:10px;border:1px solid var(--hair,#e6e4ee);background:transparent;color:inherit;cursor:pointer;font-size:20px;line-height:1}'
  + '.dc-hilo{flex:1;overflow-y:auto;padding:14px 14px 6px;overscroll-behavior:contain;scroll-behavior:smooth}'
  + '.dc-m{display:flex;margin:0 0 8px}.dc-m.c{justify-content:flex-end}'
  + '.dc-m p{margin:0;max-width:84%;padding:9px 12px;border-radius:16px;white-space:pre-wrap;word-wrap:break-word;font-size:14.5px}'
  + '.dc-m.a p{background:var(--canvas-2,#f6f5fb);border:1px solid var(--hair,#e6e4ee);border-bottom-left-radius:6px}'
  + '.dc-m.c p{background:var(--lime,#7e3dff);color:#fff;border-bottom-right-radius:6px}'
  + '.dc-m.nuevo p{animation:dcEntra .32s var(--ease,ease) both}'
  + '.dc-m a{color:inherit;text-decoration:underline;text-underline-offset:2px;word-break:break-all}'
  + '.dc-esc p{display:flex;gap:4px;align-items:center;padding:13px 14px}.dc-esc i{width:6px;height:6px;border-radius:50%;background:var(--ash,#5d5e6b);animation:dcPunto 1s infinite ease-in-out}.dc-esc i:nth-child(2){animation-delay:.15s}.dc-esc i:nth-child(3){animation-delay:.3s}'
  + '.dc-sug{display:flex;gap:8px;flex-wrap:wrap;padding:4px 14px 10px}'
  + '.dc-sug button{border:1px solid var(--hair,#e6e4ee);background:var(--card,#fff);color:var(--ink,#14151c);border-radius:9999px;padding:8px 12px;font:500 13px/1.2 "Inter Tight",system-ui,sans-serif;cursor:pointer}'
  + '.dc-sug button:hover{border-color:var(--lime,#7e3dff);color:var(--lime,#7e3dff)}'
  + '.dc-form{display:flex;gap:8px;align-items:flex-end;padding:10px 12px;border-top:1px solid var(--hair,#e6e4ee)}'
  + '.dc-form textarea{flex:1;resize:none;max-height:120px;min-height:44px;border:1px solid var(--hair,#e6e4ee);border-radius:14px;padding:11px 12px;background:var(--canvas-2,#f6f5fb);color:var(--ink,#14151c);font:16px/1.35 "Inter Tight",system-ui,sans-serif}'
  + '.dc-form textarea:focus{outline:2px solid var(--lime,#7e3dff);outline-offset:0;border-color:transparent}'
  + '.dc-env{width:44px;height:44px;border-radius:14px;border:0;background:var(--lime,#7e3dff);color:#fff;cursor:pointer;display:grid;place-items:center;flex:none}.dc-env:disabled{opacity:.45;cursor:default}'
  + '.dc-pie{padding:0 14px 10px;font-size:11.5px;color:var(--ash,#5d5e6b)}.dc-pie a{color:inherit}'
  + '@keyframes dcEntra{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}'
  + '@keyframes dcPunto{0%,80%,100%{opacity:.25}40%{opacity:1}}'
  + '@media(max-width:700px){.dc-boton{bottom:calc(82px + env(safe-area-inset-bottom,0px));right:14px;height:50px;padding:0 14px}.dc-boton b{display:none}'
  + '.dc-panel{right:0;left:0;bottom:0;width:100%;height:100%;height:100dvh;border-radius:0;border:0;transform-origin:50% 100%;transform:translateY(24px)}'
  + '.dc-cab{padding-top:calc(14px + env(safe-area-inset-top,0px))}.dc-form{padding-bottom:calc(10px + env(safe-area-inset-bottom,0px))}}'
  + '@media(prefers-reduced-motion:reduce){.dc-panel,.dc-boton{transition:none}.dc-m.nuevo p,.dc-esc i{animation:none}}';

  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  function nuevoId(){ var a = new Uint8Array(16); crypto.getRandomValues(a); return Array.prototype.map.call(a, function(b){ return ('0' + b.toString(16)).slice(-2); }).join(''); }
  var id = '';
  try { id = localStorage.getItem('dtorh-chat') || ''; if (!/^[a-f0-9]{32}$/.test(id)) { id = nuevoId(); localStorage.setItem('dtorh-chat', id); } } catch (e) { id = nuevoId(); }

  var boton = document.createElement('button');
  boton.type = 'button'; boton.className = 'dc-boton'; boton.setAttribute('aria-haspopup', 'dialog'); boton.setAttribute('aria-controls', 'dc-panel');
  boton.innerHTML = '<span class="dc-ll" aria-hidden="true">{ }</span><b>Pregúntale al estudio</b><i aria-hidden="true"></i><span class="sr" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Abrir el chat con el asistente de dtorh</span>';
  var panel = document.createElement('section');
  panel.className = 'dc-panel'; panel.id = 'dc-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Chat con el asistente de dtorh'); panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = '<div class="dc-cab"><div class="dc-av" aria-hidden="true">{ }</div><div><h2>Asistente de dtorh™</h2><p><i aria-hidden="true"></i>IA del estudio · responde en segundos</p></div><button type="button" class="dc-x" aria-label="Cerrar el chat">×</button></div>'
    + '<div class="dc-hilo" aria-live="polite" data-lenis-prevent></div>'
    + '<div class="dc-sug"></div>'
    + '<form class="dc-form"><label for="dc-txt" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Escribe tu mensaje</label><textarea id="dc-txt" rows="1" maxlength="800" placeholder="Escribe aquí…" enterkeyhint="send"></textarea><input type="text" name="sitio_web" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true"><button class="dc-env" type="submit" aria-label="Enviar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>'
    + '<p class="dc-pie">Te atiende un asistente con IA; una persona del equipo cuando lo pidas. <a href="/privacidad/">Privacidad</a> · <a href="' + WA + '" target="_blank" rel="noopener">Seguir por WhatsApp</a></p>';
  document.body.appendChild(boton); document.body.appendChild(panel);

  var hilo = panel.querySelector('.dc-hilo'), sug = panel.querySelector('.dc-sug'), form = panel.querySelector('.dc-form'), txt = panel.querySelector('textarea'), env = panel.querySelector('.dc-env');
  var msgs = [], vistos = 0, cargado = false, ocupado = false, sondeo = null;
  var SUG = ['¿Cuánto cuesta una página con catálogo?', 'Quiero que me encuentren en Google', 'Vendo solo por Instagram, ¿qué me sirve?'];

  function esc(t){ return String(t).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function enlazar(t){ return esc(t).replace(/(https:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/\b(dtorh\.click\/[\w\-\/#]*)/g, function(m, u, i, s){ return /href="|>https:\/\//.test(s.slice(Math.max(0, i - 9), i)) ? m : '<a href="https://' + u + '" target="_blank" rel="noopener">' + u + '</a>'; }); }
  function pintar(espera){
    var h = '';
    if (!msgs.length) h += '<div class="dc-m a"><p>Hola, soy el asistente con IA de dtorh™. Cuéntame de tu negocio o pregúntame lo que necesites: precios, tiempos o qué te conviene.</p></div>';
    msgs.forEach(function(m, i){ h += '<div class="dc-m ' + (m.r === 'c' ? 'c' : 'a') + (i >= vistos && !quieto ? ' nuevo' : '') + '"><p>' + enlazar(m.t) + '</p></div>'; });
    if (espera) h += '<div class="dc-m a dc-esc" aria-label="El asistente está escribiendo"><p><i></i><i></i><i></i></p></div>';
    hilo.innerHTML = h; vistos = msgs.length;
    sug.innerHTML = msgs.length ? '' : SUG.map(function(s){ return '<button type="button">' + esc(s) + '</button>'; }).join('');
    hilo.scrollTop = hilo.scrollHeight;
  }
  function leer(j){ if (j && j.msgs) msgs = j.msgs; if (j && j.espera) programarSondeo(); }
  function programarSondeo(){ if (sondeo) return; sondeo = setInterval(function(){ if (!document.documentElement.classList.contains('dc-abierto')) return; fetch(API + '?id=' + id, {cache:'no-store'}).then(function(r){ return r.json(); }).then(function(j){ if (j.msgs && j.msgs.length !== msgs.length){ msgs = j.msgs; pintar(); } if (!j.espera){ clearInterval(sondeo); sondeo = null; } }).catch(function(){}); }, 10000); }
  function cargar(){ if (cargado) return; cargado = true; fetch(API + '?id=' + id, {cache:'no-store'}).then(function(r){ return r.json(); }).then(function(j){ leer(j); vistos = msgs.length; pintar(); }).catch(function(){ pintar(); }); }
  function enviar(t){
    t = String(t || '').trim(); if (!t || ocupado) return;
    ocupado = true; env.disabled = true; txt.value = ''; ajustar();
    msgs = msgs.concat([{r:'c', t:t}]); pintar(true);
    var trampa = form.querySelector('[name=sitio_web]').value;
    fetch(API, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id:id, texto:t, sitio_web:trampa})})
      .then(function(r){ return r.json().then(function(j){ return {ok:r.ok, j:j}; }); })
      .then(function(x){
        if (x.j && x.j.apagado) { msgs.push({r:'a', t:'El chat está en pausa. Escríbenos por WhatsApp y te atendemos de una: ' + WA}); pintar(); return; }
        if (!x.ok) { msgs.push({r:'a', t:(x.j && x.j.error) || 'No pude enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.'}); pintar(); return; }
        var antes = msgs.length; leer(x.j); pintar();
        if (msgs.length <= antes) setTimeout(function(){ fetch(API + '?id=' + id, {cache:'no-store'}).then(function(r){ return r.json(); }).then(function(j){ leer(j); pintar(); }); }, 3500);
      })
      .catch(function(){ msgs.push({r:'a', t:'Se cayó la conexión. Intenta de nuevo o escríbenos por WhatsApp: ' + WA}); pintar(); })
      .then(function(){ ocupado = false; env.disabled = false; });
  }
  function ajustar(){ txt.style.height = 'auto'; txt.style.height = Math.min(120, txt.scrollHeight) + 'px'; }
  function abrir(){ document.documentElement.classList.add('dc-abierto'); panel.setAttribute('aria-hidden', 'false'); boton.setAttribute('aria-expanded', 'true'); cargar(); if (window.dtorhLenis) window.dtorhLenis.stop(); setTimeout(function(){ if (!matchMedia('(pointer: coarse)').matches) txt.focus(); }, 200); }
  function cerrar(){ document.documentElement.classList.remove('dc-abierto'); panel.setAttribute('aria-hidden', 'true'); boton.setAttribute('aria-expanded', 'false'); if (window.dtorhLenis) window.dtorhLenis.start(); boton.focus(); }
  boton.addEventListener('click', abrir);
  panel.querySelector('.dc-x').addEventListener('click', cerrar);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && document.documentElement.classList.contains('dc-abierto')) cerrar(); });
  form.addEventListener('submit', function(e){ e.preventDefault(); enviar(txt.value); });
  txt.addEventListener('input', ajustar);
  txt.addEventListener('keydown', function(e){ if (e.key === 'Enter' && !e.shiftKey && !matchMedia('(pointer: coarse)').matches){ e.preventDefault(); enviar(txt.value); } });
  sug.addEventListener('click', function(e){ var b = e.target.closest('button'); if (b) enviar(b.textContent); });
  hilo.addEventListener('wheel', function(e){ e.stopPropagation(); }, {passive:true});
  /* cualquier enlace del sitio con data-chat abre el chat */
  document.addEventListener('click', function(e){ var a = e.target.closest && e.target.closest('[data-chat]'); if (a){ e.preventDefault(); abrir(); } });
  window.dtorhChat = { abrir: abrir, cerrar: cerrar };
})();
