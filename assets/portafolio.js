/* dtorh™ · Arranque 360 adaptable: el paquete cambia según cómo atiende el negocio
   (local, a domicilio o solo en línea). Funciona sin animaciones; si GSAP está, las usa. */
(function(){
  'use strict';
  var datos = document.getElementById('variantes'), caja = document.getElementById('grupos');
  var opc = document.querySelector('.tipo-opc');
  if (!datos || !caja || !opc) return;
  var V = JSON.parse(datos.textContent);
  var botones = [].slice.call(opc.querySelectorAll('button[data-tipo]'));
  var ind = opc.querySelector('.tipo-ind'), nota = document.getElementById('tipoNota');
  var nEnt = document.getElementById('nEnt'), gar = document.getElementById('garTxt'), cta = document.getElementById('ctaPrecio');
  var COLORES = ['var(--cyan)', 'var(--lime)', 'var(--lime-2)', 'var(--azul)'];
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var g = window.gsap, actual = 'local';

  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }
  function html(tipo){
    return V[tipo].grupos.map(function(gr, i){
      return '<div class="grupo" style="--c:' + COLORES[i] + '"><h3 class="gt"><s></s>' + esc(gr[0]) + '</h3><ul class="lista">' +
        gr[1].map(function(it){ return '<li><svg class="ic" aria-hidden="true"><use href="#i-' + it[0] + '"/></svg>' + esc(it[1]) + '</li>'; }).join('') + '</ul></div>';
    }).join('');
  }
  function moverIndicador(b){
    if (!ind || !b) return;
    ind.style.width = b.offsetWidth + 'px';
    ind.style.transform = 'translateX(' + b.offsetLeft + 'px)';
  }
  function contar(desde, hasta){
    if (!nEnt) return;
    if (!g || quieto){ nEnt.textContent = hasta; return; }
    var o = { n: desde };
    g.to(o, { n: hasta, duration: .5, ease: 'power2.out', onUpdate: function(){ nEnt.textContent = Math.round(o.n); } });
  }
  function elegir(tipo){
    if (tipo === actual || !V[tipo]) return;
    var antes = V[actual].n; actual = tipo;
    botones.forEach(function(b){ b.setAttribute('aria-checked', b.dataset.tipo === tipo ? 'true' : 'false'); });
    moverIndicador(botones.filter(function(b){ return b.dataset.tipo === tipo; })[0]);
    if (nota){ nota.textContent = V[tipo].nota; nota.classList.toggle('ver', !!V[tipo].nota); }
    if (gar) gar.textContent = V[tipo].garantia;
    if (cta) cta.href = cta.href.replace(/tipo=[a-z]+/, 'tipo=' + tipo);
    contar(antes, V[tipo].n);
    if (!g || quieto){ caja.innerHTML = html(tipo); return; }
    var viejos = caja.querySelectorAll('li');
    g.to(viejos, { opacity: 0, y: -6, duration: .16, stagger: .012, ease: 'power1.in', onComplete: function(){
      caja.innerHTML = html(tipo);
      g.from(caja.querySelectorAll('.gt'), { opacity: 0, duration: .3 });
      g.from(caja.querySelectorAll('li'), { opacity: 0, y: 10, duration: .38, stagger: .03, ease: 'power3.out' });
    } });
  }
  botones.forEach(function(b){
    b.addEventListener('click', function(){ elegir(b.dataset.tipo); });
    b.addEventListener('keydown', function(e){
      var i = botones.indexOf(b), n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
      if (n === null) return; e.preventDefault();
      var sig = botones[(n + botones.length) % botones.length]; sig.focus(); elegir(sig.dataset.tipo);
    });
  });
  /* el tipo también llega por la dirección: dtorh.click/?tipo=enlinea#arranque */
  var q = (location.search.match(/[?&]tipo=(local|domicilio|enlinea)/) || [])[1];
  requestAnimationFrame(function(){ moverIndicador(botones[0]); if (q) elegir(q); });
  addEventListener('resize', function(){ moverIndicador(botones.filter(function(b){ return b.dataset.tipo === actual; })[0]); });
})();
