/* dtorh™ · menú "mapa de rutas" y navegación inteligente (todas las páginas del estudio)
   - El menú se abre en círculo desde el botón; las rutas entran una tras otra.
   - En computador, cada ruta muestra una vista previa de su destino.
   - En la barra, la píldora marca la sección en la que estás y sigue al cursor. */
(function(){
  'use strict';
  var d = document, body = d.body, raiz = d.documentElement;
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mb = d.getElementById('menuBtn'), hoja = d.getElementById('hoja');

  /* ---------- 1 · origen del círculo: el botón ---------- */
  if (mb && hoja){
    mb.addEventListener('click', function(){
      var r = mb.getBoundingClientRect();
      hoja.style.setProperty('--ox', (r.left + r.width / 2) + 'px');
      hoja.style.setProperty('--oy', (r.top + r.height / 2) + 'px');
    }, true);
  }

  /* ---------- 2 · vista previa del destino ---------- */
  var rutas = hoja ? [].slice.call(hoja.querySelectorAll('.mm-a')) : [];
  var vista = hoja && hoja.querySelector('.mm-vista');
  function mostrar(a){
    if (!vista || !a) return;
    rutas.forEach(function(x){ x.classList.toggle('ver', x === a); });
    vista.querySelector('.mm-vi').innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-' + a.dataset.ico + '"/></svg>';
    vista.querySelector('.mm-vt').textContent = a.querySelector('.mm-txt').textContent;
    vista.querySelector('.mm-vd').textContent = a.querySelector('.mm-d').textContent;
    vista.classList.remove('cambia'); void vista.offsetWidth; vista.classList.add('cambia');
  }
  rutas.forEach(function(a){
    a.addEventListener('mouseenter', function(){ mostrar(a); });
    a.addEventListener('focus', function(){ mostrar(a); });
  });

  /* ---------- 3 · al abrir: rutas que entran, foco atrapado, Esc cierra (lo maneja dtorh.js) ---------- */
  var g = window.gsap, abierto = false;
  function alAbrir(){
    var actual = hoja.querySelector('.mm-a[aria-current="page"]') || rutas[0];
    mostrar(actual); rutas.forEach(function(x){ x.classList.remove('ver'); });
    if (g && !quieto){
      g.fromTo(hoja.querySelectorAll('.mm-t'), { yPercent: 105 }, { yPercent: 0, duration: .6, stagger: .04, ease: 'expo.out', delay: .14, overwrite: true });
      g.fromTo(hoja.querySelectorAll('.mm-n'), { opacity: 0 }, { opacity: 1, duration: .4, stagger: .04, delay: .2, overwrite: true });
      g.fromTo(hoja.querySelectorAll('.mm-vista, .mm-pie'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .45, stagger: .06, ease: 'power3.out', delay: .28, overwrite: true });
    }
  }
  if (hoja) new MutationObserver(function(){
    var ab = body.classList.contains('menu-abierto');
    if (ab && !abierto) alAbrir();
    abierto = ab;
  }).observe(body, { attributes: true, attributeFilter: ['class'] });
  d.addEventListener('keydown', function(e){
    if (!abierto || e.key !== 'Tab') return;
    var foc = [mb].concat([].slice.call(hoja.querySelectorAll('a[href]')));
    var i = foc.indexOf(d.activeElement);
    if (e.shiftKey && i <= 0){ e.preventDefault(); foc[foc.length - 1].focus(); }
    else if (!e.shiftKey && i === foc.length - 1){ e.preventDefault(); foc[0].focus(); }
  });

  /* ---------- 3b · enlaces rápidos ----------
     - "Inicio" estando en el inicio: cierra el menú y sube, sin recargar.
     - Precarga la página de destino al acercar el cursor o tocar (en todos los navegadores). */
  rutas.forEach(function(a){
    a.addEventListener('click', function(e){
      var u = new URL(a.href, location.href);
      if (u.pathname === location.pathname && !u.hash){
        e.preventDefault(); if (mb && abierto) mb.click();
        if (window.dtorhLenis) window.dtorhLenis.scrollTo(0, { duration: .8 }); else scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
  var hechas = {};
  function precargar(e){
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var u = new URL(a.href, location.href);
    if (u.origin !== location.origin || u.pathname === location.pathname || hechas[u.pathname]) return;
    hechas[u.pathname] = 1;
    var l = d.createElement('link'); l.rel = 'prefetch'; l.href = u.pathname; d.head.appendChild(l);
  }
  d.addEventListener('pointerover', precargar, { passive: true });
  d.addEventListener('touchstart', precargar, { passive: true });
  d.addEventListener('focusin', precargar);

  /* ---------- 4 · la píldora de la barra: marca dónde estás ---------- */
  var links = d.getElementById('links'), ind = d.getElementById('ind');
  if (!links || !ind) return;
  var aLinks = [].slice.call(links.querySelectorAll('a')), activo = links.querySelector('a[aria-current="page"]');
  function pildora(a){
    if (!a){ ind.style.opacity = '0'; return; }
    ind.style.width = a.offsetWidth + 'px';
    ind.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    ind.style.opacity = '1';
  }
  function fijar(a){ activo = a; aLinks.forEach(function(x){ x.classList.toggle('activo', x === a); }); pildora(a); }
  links.addEventListener('mouseleave', function(){ setTimeout(function(){ pildora(activo); }, 0); });
  addEventListener('resize', function(){ pildora(activo); });
  if (activo) requestAnimationFrame(function(){ pildora(activo); });

  /* en el inicio: la sección a la vista enciende su enlace */
  var MAPA = { soluciones: '/servicios/', arranque: '/#arranque', proceso: '/como-trabajamos/', laboratorio: '/laboratorio/', preguntas: '/#preguntas' };
  var secs = Object.keys(MAPA).map(function(id){ return d.getElementById(id); }).filter(Boolean);
  if (!secs.length || !('IntersectionObserver' in window)) return;
  var visibles = {};
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ visibles[e.target.id] = e.isIntersecting; });
    var id = secs.map(function(s){ return s.id; }).filter(function(k){ return visibles[k]; })[0];
    var a = id ? aLinks.filter(function(x){ return x.getAttribute('href') === MAPA[id]; })[0] : null;
    if (a !== activo) fijar(a || null);
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(function(s){ io.observe(s); });
})();
