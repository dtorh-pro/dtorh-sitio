/* =====================================================================
   dtorh® — comportamiento compartido
   Scroll suave (Lenis en mouse/trackpad, nativo en táctil), parallax,
   ruta entre bloques, cambio de fondo por sección y guía de scroll.
   ===================================================================== */
(function(){
  var raiz = document.documentElement, body = document.body;
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tactil = matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window && !matchMedia('(pointer: fine)').matches);
  if (tactil) raiz.classList.add('tactil');
  var TEL = '573024135572';
  var vh = innerHeight;

  /* ---------- scroll suave ---------- */
  var lenis = null;
  if (!quieto && window.Lenis){
    lenis = new Lenis({ lerp: .095, smoothWheel: true, syncTouch: false, wheelMultiplier: 1, autoRaf: true });
  }
  function irA(dest, extra){
    var el = typeof dest === 'string' ? document.querySelector(dest) : dest;
    if (!el && dest !== 0) return;
    if (lenis) lenis.scrollTo(el || 0, Object.assign({ offset: -76, duration: 1.4 }, extra || {}));
    else if (el) el.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth' }); else scrollTo(0,0);
  }
  /* enlaces a secciones de esta misma página */
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href*="#"]'); if (!a) return;
    var url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    var el = url.hash === '#top' ? document.body : document.querySelector(url.hash);
    if (!el) return;
    e.preventDefault(); menu(false);
    irA(url.hash === '#top' ? 0 : el);
    history.replaceState(null, '', url.hash === '#top' ? location.pathname : url.hash);
  });

  /* ---------- tema ---------- */
  var tema = document.getElementById('tema');
  if (tema) tema.addEventListener('click', function(){
    var n = raiz.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    raiz.setAttribute('data-theme', n);
    try{ localStorage.setItem('dtorh-tema', n); }catch(e){}
  });

  /* ---------- menú de celular ---------- */
  var nav = document.getElementById('nav'), mb = document.getElementById('menuBtn'), hoja = document.getElementById('hoja');
  function menu(abrir){
    if (!mb) return;
    body.classList.toggle('menu-abierto', abrir);
    mb.setAttribute('aria-expanded', abrir);
    mb.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    if (abrir){ nav.classList.add('isla'); nav.classList.remove('oculta'); if (lenis) lenis.stop(); }
    else if (lenis) lenis.start();
    pedir();
  }
  if (mb){
    mb.addEventListener('click', function(){ menu(!body.classList.contains('menu-abierto')); });
    addEventListener('keydown', function(e){ if (e.key === 'Escape') menu(false); });
  }

  /* ---------- indicador del menú ---------- */
  var links = document.getElementById('links'), ind = document.getElementById('ind');
  if (links) {
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('mouseenter', function(){ ind.style.width = a.offsetWidth + 'px'; ind.style.transform = 'translateX(' + a.offsetLeft + 'px)'; ind.style.opacity = '1'; });
    });
    links.addEventListener('mouseleave', function(){ ind.style.opacity = '0'; });
  }

  /* ---------- WhatsApp desde el buscador y los atajos ---------- */
  /* ---------- el buscador del hero lleva al formulario con lo que escribieron ---------- */
  var form = document.getElementById('buscador'), campo = document.getElementById('q');
  if (form){
    form.addEventListener('submit', function(e){
      e.preventDefault(); var v = campo.value.trim();
      location.href = 'https://datos.dtorh.click/?ref=hero-buscador' + (v ? '&vende=' + encodeURIComponent(v.slice(0,140)) : '');
    });
    if (!quieto){
      var ej = ['postres','ropa','repuestos','uñas y cejas','comida rápida','muebles','asesorías'], ie = 0, ic = 0, borrando = false;
      var base = innerWidth < 560 ? '¿Qué vendes? ' : '¿Qué vendes? Ej: ';
      (function teclear(){
        if (document.activeElement === campo || campo.value){ campo.placeholder = '¿Qué vendes?'; return setTimeout(teclear, 1200); }
        var w = ej[ie]; ic += borrando ? -1 : 1;
        campo.placeholder = base + w.slice(0, ic) + (ic < w.length || borrando ? '|' : '');
        var espera = borrando ? 38 : 85;
        if (!borrando && ic === w.length){ borrando = true; espera = 1600; }
        else if (borrando && ic === 0){ borrando = false; ie = (ie+1) % ej.length; espera = 300; }
        setTimeout(teclear, espera);
      })();
    }
  }

  /* ---------- aparición ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(en){
    en.forEach(function(x){
      if (!x.isIntersecting) return;
      var t = x.target, hs = t.parentNode.querySelectorAll(':scope > .rv');
      setTimeout(function(){ t.classList.add('in'); }, Math.min([].indexOf.call(hs,t),5)*90);
      io.unobserve(t);
    });
  }, {threshold:.12, rootMargin:'0px 0px -6% 0px'}) : null;
  window.dtorhAparecer = function(){ document.querySelectorAll('.rv:not(.in)').forEach(function(e){ io ? io.observe(e) : e.classList.add('in'); }); };
  window.dtorhAparecer();
  document.querySelectorAll('.hero .rv, .t-hero .rv').forEach(function(e,i){ setTimeout(function(){ e.classList.add('in'); }, 350 + i*110); });

  /* ---------- vistas previas escaladas ---------- */
  window.dtorhEscalar = function(){
    document.querySelectorAll('[data-w]').forEach(function(p){
      var w = +p.getAttribute('data-w'), f = p.clientWidth / w, fr = p.querySelector('iframe');
      if (!fr || !f) return;
      fr.style.width = w + 'px'; fr.style.height = (p.clientHeight / f) + 'px'; fr.style.transform = 'scale(' + f + ')';
    });
  };
  window.dtorhEscalar();

  /* ---------- ruta: la línea que une los bloques ---------- */
  var main = document.getElementById('contenido'), ruta = null, rutaViva = null, paradas = [], muestras = [], largo = 0;
  function armarRuta(){
    var ps = [].slice.call(document.querySelectorAll('[data-parada]'));
    if (!main || ps.length < 2 || innerWidth <= 700){ if (ruta) ruta.style.display = 'none'; return; }
    if (ruta) ruta.style.height = '0px';
    var mb2 = main.getBoundingClientRect(), top0 = mb2.top + scrollY, W = main.clientWidth;
    var margen = Math.max(18, (W - 1200)/2 + 14);
    var pts = ps.map(function(el, i){
      /* dentro de un bloque fijo (sticky) se mide el bloque, no el título que se mueve con el scroll */
      var fijo = el.closest('.relato'), b = (fijo || el).getBoundingClientRect();
      var lado = el.getAttribute('data-parada') === 'der' ? W - margen : margen;
      return [lado, b.top + scrollY - top0 + (fijo ? 60 : 10)];
    });
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    /* baja por el margen y solo cruza de lado en el espacio entre bloques */
    for (var i = 1; i < pts.length; i++){
      var a = pts[i-1], b = pts[i];
      if (a[0] === b[0]){ d += ' L' + b[0] + ' ' + b[1]; continue; }
      var y1 = Math.max(a[1] + 40, b[1] - 140), y2 = b[1] - 40;
      d += ' L' + a[0] + ' ' + y1 + ' C' + a[0] + ' ' + (y1 + (y2-y1)*.6) + ',' + b[0] + ' ' + (y1 + (y2-y1)*.4) + ',' + b[0] + ' ' + y2 + ' L' + b[0] + ' ' + b[1];
    }
    if (!ruta){
      ruta = document.createElementNS('http://www.w3.org/2000/svg','svg'); ruta.setAttribute('class','ruta'); ruta.setAttribute('aria-hidden','true');
      ruta.innerHTML = '<defs><linearGradient id="gRuta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#24aeff"/><stop offset=".5" stop-color="#7e3dff"/><stop offset="1" stop-color="#c04aff"/></linearGradient></defs><path class="fondo"/><path class="viva"/>';
      main.insertBefore(ruta, main.firstChild);
    }
    ruta.style.display = ''; ruta.style.height = '0px';
    ruta.setAttribute('height', main.scrollHeight); ruta.setAttribute('width', W); ruta.style.height = main.scrollHeight + 'px';
    ruta.querySelector('.fondo').setAttribute('d', d);
    rutaViva = ruta.querySelector('.viva'); rutaViva.setAttribute('d', d);
    ruta.querySelector('#gRuta').setAttribute('gradientUnits','userSpaceOnUse'); ruta.querySelector('#gRuta').setAttribute('y2', main.scrollHeight);
    largo = rutaViva.getTotalLength(); rutaViva.style.strokeDasharray = largo; rutaViva.style.strokeDashoffset = largo;
    muestras = []; for (var s = 0; s <= largo; s += 12){ var q = rutaViva.getPointAtLength(s); muestras.push([s, q.y]); }
    paradas.forEach(function(p){ p.el.remove(); }); paradas = [];
    pts.forEach(function(p){ var el = document.createElement('span'); el.className = 'parada'; el.style.left = p[0] + 'px'; el.style.top = p[1] + 'px'; main.appendChild(el); paradas.push({el:el, y:p[1]}); });
    pedir();
  }

  /* ---------- lo que se actualiza con el scroll ---------- */
  var barra = document.querySelector('.progreso');
  var heroTxt = document.getElementById('heroTxt'), heroMapa = document.querySelector('.hero .capa-mapa');
  var pars = [].slice.call(document.querySelectorAll('[data-par]'));
  var secciones = [].slice.call(document.querySelectorAll('[data-tono]')), navs = [].slice.call(document.querySelectorAll('[data-nav="oscuro"]'));
  var relato = document.querySelector('.relato');
  var flot = document.querySelector('.float'), guia = document.getElementById('guia');
  var ultimoY = scrollY, pend = false, quietoDesde = performance.now(), toque = 0;

  function pedir(){ if (!pend){ pend = true; requestAnimationFrame(pintar); } }
  function pintar(){
    pend = false;
    var y = lenis ? lenis.scroll : scrollY, alto = document.documentElement.scrollHeight - vh;
    if (barra) barra.style.transform = 'scaleX(' + (alto > 0 ? Math.min(1, y/alto) : 0) + ')';

    /* nav: isla al bajar, se esconde al bajar rápido y vuelve al subir */
    var abierto = body.classList.contains('menu-abierto');
    nav.classList.toggle('isla', y > 30 || abierto);
    if (!abierto){ if (y > ultimoY + 4 && y > vh*.9) nav.classList.add('oculta'); else if (y < ultimoY - 4) nav.classList.remove('oculta'); }
    ultimoY = y;

    /* hero: el texto sube más rápido que el mapa (profundidad) */
    if (heroTxt && y < vh*1.2 && !quieto){
      heroTxt.style.transform = 'translate3d(0,' + (y*.32) + 'px,0)';
      heroTxt.style.opacity = Math.max(0, 1 - y/(vh*.75));
      if (heroMapa) heroMapa.style.transform = 'translate3d(0,' + (y*.5) + 'px,0) scale(' + (1 + y/vh*.06) + ')';
    }

    /* parallax de ilustraciones, celulares y tarjetas */
    if (!quieto) pars.forEach(function(el){
      var p = el.parentElement.getBoundingClientRect();
      if (p.bottom < -200 || p.top > vh + 200) return;
      var s = +el.getAttribute('data-par'), c = p.top + p.height/2 - vh/2;
      el.style.transform = 'translate3d(0,' + (c * -s).toFixed(1) + 'px,0)';
    });

    /* fondo de la página y color del menú según el bloque a la vista */
    var mitad = vh*.5, tono = null, navOscuro = false;
    secciones.forEach(function(s){
      var b = s.getBoundingClientRect();
      if (b.top <= mitad && b.bottom > mitad) tono = s.getAttribute('data-tono');
      if (b.top <= 40 && b.bottom > 40 && s.getAttribute('data-tono') === 'noche') navOscuro = true;
    });
    navs.forEach(function(s){ var b = s.getBoundingClientRect(); if (b.top <= 40 && b.bottom > 40) navOscuro = true; });
    if (tono){ body.classList.remove('tono-noche','tono-suave','tono-claro'); body.classList.add('tono-' + tono); }
    nav.classList.toggle('sobre-oscuro', navOscuro);

    /* qué montamos: el celular cambia de pantalla */
    if (relato){
      var rb = relato.getBoundingClientRect(), rec = rb.height - vh;
      var p = Math.min(.999, Math.max(0, -rb.top / rec)), paso = Math.floor(p*3);
      if (relato.getAttribute('data-paso') !== String(paso)){
        relato.setAttribute('data-paso', paso);
        relato.querySelectorAll('[data-p]').forEach(function(el){ el.classList.toggle('on', +el.getAttribute('data-p') === paso); });
      }
      relato.querySelectorAll('.barras i').forEach(function(b, i){ b.style.setProperty('--p', Math.min(1, Math.max(0, p*3 - i))); });
    }

    /* ruta */
    if (rutaViva && muestras.length){
      var meta = y - (main.getBoundingClientRect().top + y) + vh*.62, lo = 0, hi = muestras.length - 1;
      while (lo < hi){ var mid = (lo + hi) >> 1; if (muestras[mid][1] < meta) lo = mid + 1; else hi = mid; }
      rutaViva.style.strokeDashoffset = Math.max(0, largo - muestras[lo][0]);
      paradas.forEach(function(p){ p.el.classList.toggle('llego', p.y < meta); });
    }

    /* botón flotante en celular */
    if (flot){
      var enHero = heroTxt ? y < vh*.7 : y < 200, alFinal = y > alto - vh*1.1;
      var precio = document.getElementById('arranque'), enPrecio = false;
      if (precio){ var pb = precio.getBoundingClientRect(); enPrecio = pb.top < vh*.6 && pb.bottom > vh*.4; }
      flot.classList.toggle('ver', !enHero && !alFinal && !enPrecio && !abierto);
    }
    guiaEstado(y, alto);
  }

  /* ---------- guía de scroll: aparece cuando hace falta ---------- */
  function guiaEstado(y, alto){
    if (!guia) return;
    var ahora = performance.now();
    var arriba = y < 40, quieta = ahora - quietoDesde > 9000 && y < alto - vh*1.2 && y > vh;
    var largo2 = alto > vh*1.4, mostrar = largo2 && ((arriba && ahora > 1600) || quieta);
    if (flot && flot.classList.contains('ver')) mostrar = mostrar && !tactil;
    guia.classList.toggle('ver', mostrar && !body.classList.contains('menu-abierto'));
    guia.classList.toggle('clara', !arriba);
    var txt = guia.querySelector('b');
    if (txt) txt.textContent = arriba ? (tactil ? 'Desliza para descubrir' : 'Baja para descubrir') : 'Sigue bajando, falta lo mejor';
  }
  if (guia){
    guia.addEventListener('click', function(){
      var y = lenis ? lenis.scroll : scrollY;
      var sig = secciones.filter(function(s){ return s.getBoundingClientRect().top > 90; })[0];
      if (sig) irA(sig); else if (lenis) lenis.scrollTo(y + vh*.85); else scrollTo({top: y + vh*.85, behavior:'smooth'});
    });
    setTimeout(pedir, 1700);
    setInterval(function(){
      pedir();
      if ((lenis ? lenis.scroll : scrollY) < 40 && performance.now() - quietoDesde > 7000 && guia.classList.contains('ver')){
        guia.classList.remove('insiste'); void guia.offsetWidth; guia.classList.add('insiste'); quietoDesde = performance.now() - 3000;
      }
    }, 1500);
  }

  function alMover(){ quietoDesde = performance.now(); pedir(); }
  if (lenis) lenis.on('scroll', alMover);
  addEventListener('scroll', alMover, {passive:true});
  var rt; addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(function(){ vh = innerHeight; window.dtorhEscalar(); armarRuta(); pedir(); }, 160); });
  if ('ResizeObserver' in window && main) new ResizeObserver(function(){ clearTimeout(rt); rt = setTimeout(function(){ armarRuta(); }, 200); }).observe(main);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function(){ armarRuta(); pedir(); });
  addEventListener('load', function(){ armarRuta(); pedir(); });
  pintar();

  var an = document.getElementById('anio'); if (an) an.textContent = new Date().getFullYear();
})();

/* ===== tarjetas de redes: relieve que sigue el cursor ===== */
(function(){
  var cards = document.querySelectorAll('.red-card'); if (!cards.length) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  cards.forEach(function(c){
    c.addEventListener('pointermove', function(e){
      var b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      c.style.setProperty('--ry', ((x - .5) * 10).toFixed(2) + 'deg');
      c.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg');
      c.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      c.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    });
    c.addEventListener('pointerleave', function(){ c.style.setProperty('--rx','0deg'); c.style.setProperty('--ry','0deg'); });
  });
})();
