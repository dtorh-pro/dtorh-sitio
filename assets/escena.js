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

    /* ---------- 1 · hero ---------- */
    var hero = document.querySelector('.hero'), h1 = hero && hero.querySelector('h1');
    if (hero && h1){
      var letras = Split ? Split.create(h1, { type: 'words,chars' }).chars : [h1];
      g.set(letras, { opacity: 1 });
      var focoB = hero.querySelector('.foco-txt b');
      var focoLetras = Split && focoB ? Split.create(focoB, { type: 'words,chars', mask: 'words' }).chars : [focoB];
      var corto = innerWidth < 700;
      var tl = g.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: hero, start: 'top top', end: corto ? '+=95%' : '+=120%', pin: true, scrub: .6, anticipatePin: 1 }
      });
      tl.to(letras, { yPercent: -110, opacity: 0, rotate: function(i){ return (i % 2 ? 1 : -1) * 6; }, stagger: { each: .012 }, ease: 'power2.in', duration: .45 }, 0)
        .fromTo(hero.querySelectorAll('.brace, .lead, .buscador, .chips, .sellos'), { y: 0, opacity: 1 }, { y: -50, opacity: 0, stagger: .035, duration: .3, immediateRender: false }, 0)
        .fromTo(hero.querySelectorAll('.leyenda, .contador'), { opacity: 1 }, { opacity: 0, duration: .15, immediateRender: false }, 0)
        .to(hero.querySelector('.capa-mapa'), { scale: corto ? 1.6 : 1.85, duration: 1 }, 0)
        .fromTo(hero.querySelector('.foco-pin'), { scale: 0, y: -90, opacity: 0 }, { scale: 1, y: 0, opacity: 1, ease: 'back.out(2.2)', duration: .25 }, .42)
        .fromTo(hero.querySelector('.foco-anillo'), { scale: .3, opacity: 0 }, { scale: 1, opacity: 1, ease: 'power2.out', duration: .3 }, .47)
        .set(focoB, { opacity: 1 }, .58)
        .fromTo(focoLetras, { yPercent: 105 }, { yPercent: 0, stagger: .008, ease: 'power3.out', duration: .25 }, .58)
        .fromTo(hero.querySelector('.foco-txt span'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .18 }, .78)
        .to({}, { duration: .12 });
      /* el pin "late" al ritmo del mapa cuando la escena queda quieta */
      g.to(hero.querySelector('.foco-anillo'), { rotate: 360, duration: 40, repeat: -1, ease: 'none' });
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

    /* los tamaños cambian cuando cargan fuentes e imágenes */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ ST.refresh(); });
    addEventListener('load', function(){ ST.refresh(); });

    return function(){ raiz.classList.remove('cine'); };
  });
})();
