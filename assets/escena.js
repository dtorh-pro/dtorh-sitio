/* dtorh™ · escena del inicio con GSAP (ScrollTrigger + SplitText, licencia gratuita de GSAP)
   1. Hero cinematográfico: el titular se desarma, el mapa hace zoom y aparece tu negocio, invisible.
   2. Títulos de sección que se arman por palabras.
   Sin GSAP, sin JavaScript o con menos movimiento, el inicio queda igual al aprobado. */
(function(){
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
  if (!g || !ST) return;
  g.registerPlugin(ST); if (Split) g.registerPlugin(Split);
  ST.config({ ignoreMobileResize: true });

  /* scroll suave de dtorh.js (Lenis) sincronizado con ScrollTrigger */
  if (window.dtorhLenis){ window.dtorhLenis.on('scroll', ST.update); }

  var raiz = document.documentElement;
  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function(){
    raiz.classList.add('cine');

    /* ---------- 1 · hero: tres tiempos que no se pisan ----------
       a) sale el bloque de texto completo (al cargar queda igual al aprobado; no se parte el titular)
       b) el mapa se acerca y cae el pin de "tu negocio"
       c) aparece la frase. La guía muestra el avance y, al tocarla, recorre la escena. */
    var hero = document.querySelector('.hero'), txt = document.getElementById('heroTxt');
    var guia = document.getElementById('guia'), st = null, paso = null, ultimo = '';
    var pintarGuia = function(){};   /* se reemplaza cuando la guía está lista */
    if (hero && txt){
      var focoB = hero.querySelector('.foco-txt b');
      var focoPal = Split && focoB ? Split.create(focoB, { type: 'words', mask: 'words' }).words : [focoB];
      var corto = innerWidth < 700;
      var tl = g.timeline({ defaults: { ease: 'none' } });
      tl.fromTo(txt, { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }, { y: corto ? -40 : -70, scale: .94, opacity: 0, filter: 'blur(6px)', ease: 'power1.in', duration: .3, immediateRender: false }, 0)
        .fromTo(hero.querySelectorAll('.leyenda, .contador'), { opacity: 1 }, { opacity: 0, duration: .12, immediateRender: false }, 0)
        .to(hero.querySelector('.capa-mapa'), { scale: corto ? 1.55 : 1.8, duration: 1 }, 0)
        .fromTo(hero.querySelector('.foco-pin'), { scale: 0, y: -90, opacity: 0 }, { scale: 1, y: 0, opacity: 1, ease: 'expo.out', duration: .2 }, .34)
        .fromTo(hero.querySelector('.foco-anillo'), { scale: .3, opacity: 0 }, { scale: 1, opacity: 1, ease: 'power2.out', duration: .25 }, .38)
        .set(focoB, { opacity: 1 }, .5)
        .fromTo(focoPal, { yPercent: 110 }, { yPercent: 0, stagger: .04, ease: 'power3.out', duration: .22 }, .5)
        .fromTo(hero.querySelector('.foco-txt span'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .16 }, .7)
        .to({}, { duration: .14 });
      st = ScrollTriggerCrear(tl);
      g.to(hero.querySelector('.foco-anillo'), { rotate: 360, duration: 40, repeat: -1, ease: 'none' });
    }
    /* la escena cuenta como "en curso" desde que el visitante empieza a bajar */
    function marcar(self){
      var en = self.isActive && self.progress > .01;
      raiz.classList.toggle('en-escena', en); if (guia) guia.classList.toggle('en-escena', en);
    }
    function ScrollTriggerCrear(tl){
      return ST.create({
        animation: tl, trigger: hero, start: 'top top', end: innerWidth < 700 ? '+=100%' : '+=120%',
        pin: true, scrub: .6, anticipatePin: 1,
        onToggle: function(self){ marcar(self); },
        onUpdate: function(self){ marcar(self); pintarGuia(self.progress); }
      });
    }

    /* guía interactiva: avance de la escena, mensajes por tiempo y recorrido al tocarla */
    if (guia){
      guia.insertAdjacentHTML('beforeend', '<span class="guia-paso" aria-hidden="true"></span><span class="flechas" aria-hidden="true"><i></i><i></i><i></i></span><span class="avance" aria-hidden="true"></span>');
      paso = guia.querySelector('.guia-paso');
      pintarGuia = function(p){
        guia.style.setProperty('--g', p.toFixed(3));
        var t = p < .32 ? 'Mira lo que ve un cliente' : p < .68 ? 'Este es tu negocio hoy' : 'Sigue: así lo hacemos visible';
        if (t !== ultimo){ paso.textContent = t; ultimo = t; }
      };
      pintarGuia(0);
      guia.addEventListener('click', function(e){
        if (!st) return;
        var y = window.dtorhLenis ? window.dtorhLenis.scroll : scrollY;
        if (y < st.end - 4){
          e.stopImmediatePropagation();
          if (window.dtorhLenis) window.dtorhLenis.scrollTo(st.end + 2, { duration: 2.8, easing: function(t){ return t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2; } });
          else scrollTo({ top: st.end + 2, behavior: 'smooth' });
        }
      }, true);
    }

    /* ---------- 1b · páginas internas: el encabezado oscuro se despide al bajar ---------- */
    var th = document.querySelector('.t-hero > .wrap');
    if (th){
      g.fromTo(th, { y: 0, opacity: 1 }, { y: -60, opacity: 0, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: th.parentNode, start: 'top top', end: 'bottom top', scrub: .5 } });
    }

    /* ---------- 2 · títulos que se arman por palabras ---------- */
    if (Split){
      document.querySelectorAll('main h2.rv').forEach(function(h){
        if (h.closest('.hero')) return;
        h.classList.remove('rv'); h.classList.add('in');
        var visto = false;
        Split.create(h, { type: 'lines,words', mask: 'lines', linesClass: 'parte-linea', autoSplit: true, onSplit: function(self){
          if (visto) return;   /* ya se armó: al cambiar el tamaño solo se reacomoda */
          return g.from(self.words, {
            yPercent: 110, duration: .9, ease: 'power4.out', stagger: .045,
            scrollTrigger: { trigger: h, start: 'top 86%', once: true, onEnter: function(){ visto = true; } }
          });
        } });
      });
    }

    /* ---------- 3 · Arranque 360: el paquete se arma al entrar ---------- */
    var arr = document.getElementById('arranque');
    if (arr){
      /* solo movimiento, nunca opacidad: si la animación no corre, todo queda visible y en su lugar */
      var t3 = g.timeline({ scrollTrigger: { trigger: arr.querySelector('.oferta'), start: 'top 85%', once: true } });
      t3.from(arr.querySelectorAll('.grupo li'), { y: 10, duration: .5, stagger: .03, ease: 'power3.out', clearProps: 'transform' })
        .from(arr.querySelectorAll('.precio > *'), { y: 14, duration: .5, stagger: .05, ease: 'power3.out', clearProps: 'transform' }, .1);
    }

    /* ---------- 4 · Cómo funciona: cada paso muestra su flujo mientras está a la vista ---------- */
    var f1 = document.querySelector('.flujo1'), f2 = document.querySelector('.flujo2'), f3 = document.querySelector('.flujo3');
    function enVista(el, tl){ ST.create({ trigger: el, start: 'top 85%', end: 'bottom 10%', onToggle: function(s){ s.isActive ? tl.play() : tl.pause(); } }); }
    if (f1){
      var tf1 = g.timeline({ paused: true, repeat: -1, repeatDelay: 2.2 });
      tf1.fromTo(f1.querySelectorAll('.vx-fila'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: .35, stagger: .12, ease: 'power3.out' })
         .fromTo(f1.querySelector('.vx-scan'), { top: 0, opacity: 0 }, { opacity: 1, duration: .1 }, 0)
         .to(f1.querySelector('.vx-scan'), { y: function(){ return f1.offsetHeight - 2; }, duration: 1.1, ease: 'power1.inOut' }, 0)
         .to(f1.querySelector('.vx-scan'), { opacity: 0, duration: .2 })
         .fromTo(f1.querySelectorAll('.vx-fila em'), { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: .3, stagger: .22, ease: 'expo.out' }, .6)
         .set(f1.querySelector('.vx-scan'), { y: 0 });
      enVista(f1, tf1);
    }
    if (f2){
      var n2 = f2.querySelector('.vx-n'), barra = f2.querySelector('.vx-barra i'), oks = f2.querySelectorAll('.ok');
      var tf2 = g.timeline({ paused: true, repeat: -1, repeatDelay: 2.4 });
      tf2.fromTo(f2.querySelectorAll('.vx-item'), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: .45, stagger: .15, ease: 'power3.out' })
         .set(oks, { scale: 0 }, 0).set(barra, { scaleX: 0 }, 0).call(function(){ n2.textContent = '0'; }, null, 0);
      [0, 1, 2].forEach(function(i){
        tf2.to(oks[i], { scale: 1, duration: .35, ease: 'expo.out' }, .7 + i * .45)
           .to(barra, { scaleX: (i + 1) / 3, duration: .35, ease: 'power2.out' }, .7 + i * .45)
           .call(function(){ n2.textContent = String(i + 1); }, null, .7 + i * .45);
      });
      enVista(f2, tf2);
    }
    if (f3){
      var tf3 = g.timeline({ paused: true, repeat: -1, repeatDelay: 1.8 });
      tf3.fromTo(f3.querySelector('.pin-g'), { y: -36, opacity: 0 }, { y: 0, opacity: 1, duration: .55, ease: 'expo.out' })
         .fromTo(f3.querySelectorAll('.anillo'), { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, stagger: .1, ease: 'power3.out' }, .2)
         .fromTo(f3.querySelector('.vx-onda'), { scale: 1, opacity: .7 }, { scale: 3, opacity: 0, duration: 1.2, ease: 'power2.out' }, .4)
         .fromTo(f3.querySelector('.vx-chip.c3'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .4, ease: 'power3.out' }, .7)
         .fromTo(f3.querySelector('.vx-chip.c2'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .4, ease: 'power3.out' }, 1.15)
         .fromTo(f3.querySelector('.vx-chip.c1'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .4, ease: 'power3.out' }, 1.6)
         .fromTo(f3.querySelector('.vx-onda'), { scale: 1, opacity: .5 }, { scale: 3, opacity: 0, duration: 1.2, ease: 'power2.out' }, 2.2);
      enVista(f3, tf3);
    }

    /* ---------- 5 · cierre: las opciones entran una tras otra ---------- */
    var tc = document.querySelector('.tipo-cierre');
    if (tc) g.from(tc.querySelectorAll('a'), { opacity: 0, y: 10, duration: .45, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: tc, start: 'top 92%', once: true } });

    /* los tamaños cambian cuando cargan fuentes e imágenes */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ ST.refresh(); });
    addEventListener('load', function(){ ST.refresh(); });

    return function(){ raiz.classList.remove('cine'); };
  });
})();
