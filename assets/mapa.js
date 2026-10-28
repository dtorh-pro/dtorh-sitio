/* =====================================================================
   dtorh® — Mapa digital del hero
   Una ciudad en cuadrícula (al estilo de Barranquilla, con el Magdalena).
   ○ Negocios que existen pero nadie ve  ·  ● Negocios que aparecen
   • Clientes que salen a buscar y llegan solo a los negocios visibles.
   ===================================================================== */
(function(){
  var cv = document.getElementById('mapa'); if (!cv || !cv.getContext) return;
  var hero = cv.closest('.hero'), ctx = cv.getContext('2d');
  /* el mapa siempre se mueve; si el sistema pide menos movimiento, va más calmado */
  var quieto = false, calma = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cuenta = document.getElementById('cuenta');

  var BG = '#0b0d1a', MANZANA = '#141729', MANZANA_2 = '#171a2f', PARQUE = '#11201e', RIO = '#0d1a2e';
  var VIOLETA = '126,61,255', CIAN = '36,174,255', MAGENTA = '192,74,255';
  var RUBROS = ['Panadería','Barbería','Ferretería','Tienda de ropa','Cafetería','Repostería','Salón de uñas','Taller','Papelería','Comidas rápidas','Óptica','Floristería','Veterinaria','Droguería'];

  var W, H, dpr, capa, ANG = -0.21, C = Math.cos(ANG), S = Math.sin(ANG), D;
  var us = [], vs = [], negocios = [], clientes = [], efectos = [], etiquetas = [];
  var raton = {x:-9999, y:-9999, a:0, dentro:false};
  var visible = true, raf = 0, antes = 0, nace = 0, aparece = 0, llegadas = 0;
  function r(a,b){ return a + Math.random()*(b-a); }
  function P(u,v){ return [W/2 + u*C - v*S, H/2 + u*S + v*C]; }
  function rioX(y){ return W*.875 + Math.sin(y/H*Math.PI*1.1 + .4)*W*.045; }
  /* detrás del texto todo se atenúa: el mensaje siempre se lee */
  function mascara(x,y){
    var ex = (x - W/2) / Math.min(W*.36, 480), ey = (y - H*.5) / (H*.4), q = Math.sqrt(ex*ex + ey*ey);
    return q < 1 ? .12 + .55*q*q : 1;
  }

  function armar(){
    dpr = Math.min(window.devicePixelRatio || 1, W > 1600 ? 1.5 : 2);
    var b = cv.getBoundingClientRect(); W = Math.max(320, b.width); H = Math.max(400, b.height);
    cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr);
    D = Math.hypot(W,H)*.62;
    us = []; vs = [];
    var u, v, paso = W < 700 ? [44,78] : [58,104];
    for (u = -D; u < D; u += r(paso[0],paso[1])) us.push({p:u, mayor:Math.random() < .16});
    for (v = -D; v < D; v += r(paso[0],paso[1])) vs.push({p:v, mayor:Math.random() < .16});

    /* ---- capa fija: manzanas, parques, río y nombres de vías ---- */
    capa = document.createElement('canvas'); capa.width = cv.width; capa.height = cv.height;
    var k = capa.getContext('2d'); k.setTransform(dpr,0,0,dpr,0,0);
    k.fillStyle = BG; k.fillRect(0,0,W,H);
    var i, j, esquinas = [];
    for (i = 0; i < us.length-1; i++) for (j = 0; j < vs.length-1; j++){
      var a = us[i], a2 = us[i+1], c = vs[j], c2 = vs[j+1];
      var g1 = a.mayor ? 7 : 3.5, g2 = a2.mayor ? 7 : 3.5, g3 = c.mayor ? 7 : 3.5, g4 = c2.mayor ? 7 : 3.5;
      var p1 = P(a.p+g1, c.p+g3), p2 = P(a2.p-g2, c.p+g3), p3 = P(a2.p-g2, c2.p-g4), p4 = P(a.p+g1, c2.p-g4);
      var cx = (p1[0]+p3[0])/2, cy = (p1[1]+p3[1])/2;
      if (cx < -80 || cx > W+80 || cy < -80 || cy > H+80) continue;
      if (cx > rioX(cy) - 26) continue;
      var t = Math.random();
      k.fillStyle = t < .06 ? PARQUE : t < .3 ? MANZANA_2 : MANZANA;
      k.beginPath(); k.moveTo(p1[0],p1[1]); k.lineTo(p2[0],p2[1]); k.lineTo(p3[0],p3[1]); k.lineTo(p4[0],p4[1]); k.closePath(); k.fill();
      if (t >= .06) esquinas.push({i:i, j:j, cx:cx, cy:cy});
    }
    /* el río */
    k.fillStyle = RIO; k.beginPath(); k.moveTo(W+10,-10);
    for (var y = -10; y <= H+10; y += 10) k.lineTo(rioX(y) + 6, y);
    k.lineTo(W+10,H+10); k.closePath(); k.fill();
    k.strokeStyle = 'rgba(120,170,255,.12)'; k.lineWidth = 1; k.beginPath();
    for (y = -10; y <= H+10; y += 10) k.lineTo(rioX(y) + 6, y); k.stroke();
    /* ejes de las vías principales */
    k.strokeStyle = 'rgba(255,255,255,.05)'; k.lineWidth = 1; k.setLineDash([6,8]);
    us.forEach(function(a){ if (!a.mayor) return; var p = P(a.p,-D), q = P(a.p,D); k.beginPath(); k.moveTo(p[0],p[1]); k.lineTo(q[0],q[1]); k.stroke(); });
    vs.forEach(function(c){ if (!c.mayor) return; var p = P(-D,c.p), q = P(D,c.p); k.beginPath(); k.moveTo(p[0],p[1]); k.lineTo(q[0],q[1]); k.stroke(); });
    k.setLineDash([]);
    /* nombres */
    k.font = '600 10px "Inter Tight", system-ui, sans-serif'; k.fillStyle = 'rgba(255,255,255,.2)';
    var nombresV = ['CALLE 72','CALLE 84','CALLE 53','CALLE 76','CALLE 98'], nombresU = ['CARRERA 46','CARRERA 54','CARRERA 43','CARRERA 51B','CARRERA 38'];
    var iv = 0, iu = 0;
    vs.forEach(function(c){ if (!c.mayor || iv >= nombresV.length) return; var p = P(-W*.38, c.p - 5); if (p[1] < 20 || p[1] > H-20) return; k.save(); k.translate(p[0],p[1]); k.rotate(ANG); k.fillText(nombresV[iv++],0,0); k.restore(); });
    us.forEach(function(a){ if (!a.mayor || iu >= nombresU.length) return; var p = P(a.p + 5, -H*.3); if (p[0] < 20 || p[0] > rioX(p[1]) - 40) return; k.save(); k.translate(p[0],p[1]); k.rotate(ANG + Math.PI/2); k.fillText(nombresU[iu++],0,0); k.restore(); });
    k.save(); k.translate(rioX(H*.62) + 30, H*.62); k.rotate(Math.PI/2 - .12); k.fillStyle = 'rgba(140,180,255,.2)'; k.font = '600 10px "Inter Tight", system-ui, sans-serif'; k.fillText('R Í O   M A G D A L E N A', 0, 0); k.restore();
    k.save(); k.translate(rioX(H*.3) - 20, H*.3); k.rotate(Math.PI/2 - .08); k.fillStyle = 'rgba(255,255,255,.18)'; k.fillText('VÍA 40', 0, 0); k.restore();

    /* ---- negocios: al borde de las manzanas, mirando a la calle ---- */
    negocios = []; clientes = []; efectos = []; etiquetas = [];
    var n = Math.max(26, Math.min(W < 700 ? 40 : 95, Math.round(W*H/11000)));
    esquinas.sort(function(){ return Math.random() - .5; });
    for (i = 0; i < esquinas.length && negocios.length < n; i++){
      var e = esquinas[i], ua = us[e.i].p, ub = us[e.i+1].p, va = vs[e.j].p, vb = vs[e.j+1].p;
      var lado = Math.floor(Math.random()*4), uu, vv, su, sv;
      if (lado === 0){ uu = r(ua+14, ub-14); vv = va + 9; su = uu; sv = va; }
      else if (lado === 1){ uu = r(ua+14, ub-14); vv = vb - 9; su = uu; sv = vb; }
      else if (lado === 2){ uu = ua + 9; vv = r(va+14, vb-14); su = ua; sv = vv; }
      else { uu = ub - 9; vv = r(va+14, vb-14); su = ub; sv = vv; }
      var pt = P(uu,vv);
      if (pt[0] < 16 || pt[0] > W-16 || pt[1] < 70 || pt[1] > H-16) continue;
      negocios.push({x:pt[0], y:pt[1], u:su, v:sv, m:mascara(pt[0],pt[1]), vis:false, t:0, brillo:0, rubro:RUBROS[negocios.length % RUBROS.length], foco:0});
    }
    /* de entrada, solo algunos aparecen */
    negocios.forEach(function(b){ if (Math.random() < .2){ b.vis = true; b.t = 1; } });
    if (quieto){
      negocios.forEach(function(b){ if (Math.random() < .35){ b.vis = true; b.t = 1; } });
      for (i = 0; i < 10; i++) nuevoCliente(true);
    }
  }

  function aparecer(b, conEtiqueta){
    if (!b || b.vis) return;
    b.vis = true; b.t = 0;
    efectos.push({x:b.x, y:b.y - 10, r:4, a:1, c:VIOLETA, m:b.m});
    if (conEtiqueta && b.m > .9 && etiquetas.length < 3) etiquetas.push({b:b, txt:b.rubro, vida:2.8});
  }

  function nuevoCliente(fijo){
    var vis = negocios.filter(function(b){ return b.vis && b.t > .6; });
    if (!vis.length) return;
    /* sale de una esquina cualquiera y busca un negocio visible cercano */
    var i = Math.floor(r(1, us.length-1)), j = Math.floor(r(1, vs.length-1));
    var su = us[i].p, sv = vs[j].p, ini = P(su,sv);
    if (ini[0] < 0 || ini[0] > W || ini[1] < 0 || ini[1] > H || ini[0] > rioX(ini[1]) - 10) return;
    var mejor = null, md = 1e9;
    vis.forEach(function(b){ var d = Math.abs(b.u - su) + Math.abs(b.v - sv); if (d < md && d > 60){ md = d; mejor = b; } });
    if (!mejor || md > 900) return;
    /* recorrido por las calles: primero a lo largo de una, luego de la otra */
    var pts = Math.random() < .5
      ? [[su,sv],[mejor.u,sv],[mejor.u,mejor.v]]
      : [[su,sv],[su,mejor.v],[mejor.u,mejor.v]];
    pts = pts.map(function(q){ return P(q[0],q[1]); });
    pts.push([mejor.x, mejor.y]);
    var largos = [0], tot = 0;
    for (var k = 1; k < pts.length; k++){ tot += Math.hypot(pts[k][0]-pts[k-1][0], pts[k][1]-pts[k-1][1]); largos.push(tot); }
    var c = {pts:pts, largos:largos, tot:tot, s:fijo ? r(.3,.8)*tot : 0, vel:r(42,72), meta:mejor, busca:fijo ? 0 : .9, fin:0};
    clientes.push(c);
    if (!fijo) efectos.push({x:ini[0], y:ini[1], r:3, a:.7, c:'255,255,255', radar:true, m:mascara(ini[0],ini[1])});
  }

  function puntoEn(c, s){
    for (var k = 1; k < c.largos.length; k++) if (s <= c.largos[k]){
      var t = (s - c.largos[k-1]) / Math.max(1, c.largos[k] - c.largos[k-1]);
      return [c.pts[k-1][0] + (c.pts[k][0]-c.pts[k-1][0])*t, c.pts[k-1][1] + (c.pts[k][1]-c.pts[k-1][1])*t, k];
    }
    var u = c.pts[c.pts.length-1]; return [u[0],u[1],c.pts.length-1];
  }

  function pin(x, y, t, m, brillo){
    var s = t < 1 ? (1 - Math.pow(1 - t, 3)) * (1 + Math.sin(t*Math.PI)*.35) : 1;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = m;
    if (brillo > 0){ ctx.fillStyle = 'rgba(' + MAGENTA + ',' + (.25*brillo) + ')'; ctx.beginPath(); ctx.arc(0,-11,15,0,6.283); ctx.fill(); }
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(0,1,4,1.6,0,0,6.283); ctx.fill();
    ctx.fillStyle = brillo > .3 ? '#a974ff' : '#7e3dff';
    ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(-3,-5,-7.5,-7,-7.5,-11.5); ctx.arc(0,-11.5,7.5,Math.PI,0); ctx.bezierCurveTo(7.5,-7,3,-5,0,0); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0,-11.5,2.8,0,6.283); ctx.fill();
    ctx.restore();
  }

  function cuadro(t){
    var dt = Math.min((t - antes)/1000 || 0, .05); antes = t; if (calma) dt *= .55;
    var i, b, c, e;
    ctx.setTransform(1,0,0,1,0,0); ctx.drawImage(capa,0,0); ctx.setTransform(dpr,0,0,dpr,0,0);

    /* corriente del río */
    ctx.strokeStyle = 'rgba(120,170,255,.07)'; ctx.lineWidth = 1; ctx.setLineDash([14,22]); ctx.lineDashOffset = -t/60;
    for (var f = 0; f < 4; f++){ ctx.beginPath(); for (var y = -10; y <= H+10; y += 14) ctx.lineTo(rioX(y) + 20 + f*16, y); ctx.stroke(); }
    ctx.setLineDash([]);

    /* lupa del cursor: donde pasa dtorh, los negocios aparecen */
    raton.a += ((raton.dentro ? 1 : 0) - raton.a) * Math.min(1, dt*6);
    if (raton.a > .02){
      ctx.strokeStyle = 'rgba(255,255,255,' + (.28*raton.a) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(raton.x, raton.y, 92, 0, 6.283); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,' + (.035*raton.a) + ')'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,' + (.4*raton.a) + ')';
      ctx.beginPath(); ctx.moveTo(raton.x-6,raton.y); ctx.lineTo(raton.x+6,raton.y); ctx.moveTo(raton.x,raton.y-6); ctx.lineTo(raton.x,raton.y+6); ctx.stroke();
    }

    /* ritmo: negocios que aparecen y clientes que salen */
    aparece -= dt; nace -= dt;
    var nVis = 0; for (i = 0; i < negocios.length; i++) if (negocios[i].vis) nVis++;
    if (aparece <= 0){
      aparece = r(.8, 1.5);
      if (nVis < negocios.length*.72){ var ocultos = negocios.filter(function(x){ return !x.vis; }); aparecer(ocultos[Math.floor(Math.random()*ocultos.length)], true); }
      else { var vv = negocios.filter(function(x){ return x.vis && x.t >= 1; }); var q = vv[Math.floor(Math.random()*vv.length)]; if (q){ q.vis = false; } }
    }
    var tope = W < 700 ? 12 : 26;
    if (nace <= 0 && clientes.length < tope){ nace = r(.22,.5); nuevoCliente(); }

    /* recorridos de los clientes */
    for (i = clientes.length-1; i >= 0; i--){
      c = clientes[i];
      if (c.busca > 0){ c.busca -= dt; }
      else if (c.s < c.tot){ c.s = Math.min(c.tot, c.s + c.vel*dt); }
      else {
        c.fin += dt;
        if (c.fin === dt){ /* llegó */
          llegadas++; if (cuenta) cuenta.textContent = llegadas;
          c.meta.foco = 1;
          efectos.push({x:c.meta.x, y:c.meta.y-11, r:6, a:1, c:MAGENTA, m:c.meta.m});
          efectos.push({x:c.meta.x+10, y:c.meta.y-24, txt:'+1 cliente', a:1, vy:-16, m:c.meta.m});
        }
        if (c.fin > .6){ clientes.splice(i,1); continue; }
      }
      var pos = puntoEn(c, c.s), m = mascara(pos[0],pos[1]);
      var al = c.fin > 0 ? 1 - c.fin/.6 : 1;
      /* el trazo de la ruta */
      ctx.strokeStyle = 'rgba(' + CIAN + ',' + (.62*m*al) + ')'; ctx.lineWidth = 2; ctx.setLineDash([4,5]);
      ctx.beginPath(); ctx.moveTo(c.pts[0][0], c.pts[0][1]);
      for (var k = 1; k < pos[2]; k++) ctx.lineTo(c.pts[k][0], c.pts[k][1]);
      ctx.lineTo(pos[0], pos[1]); ctx.stroke(); ctx.setLineDash([]);
      /* el cliente */
      ctx.fillStyle = 'rgba(' + CIAN + ',' + (.22*m*al) + ')'; ctx.beginPath(); ctx.arc(pos[0],pos[1],8.5,0,6.283); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,' + (.95*m*al) + ')'; ctx.beginPath(); ctx.arc(pos[0],pos[1],3.2,0,6.283); ctx.fill();
    }

    /* negocios */
    for (i = 0; i < negocios.length; i++){
      b = negocios[i];
      if (raton.a > .5){
        var d = Math.hypot(b.x - raton.x, b.y - raton.y);
        if (d < 92 && !b.vis){ b.hover = (b.hover || 0) + dt; if (b.hover > .18) aparecer(b, true); } else b.hover = 0;
      }
      if (b.vis){ b.t = Math.min(1, b.t + dt*1.6); }
      else if (b.t > 0){ b.t = Math.max(0, b.t - dt*1.2); }
      b.foco = Math.max(0, b.foco - dt*1.4);
      if (b.vis || b.t > 0){
        if (b.vis) pin(b.x, b.y, b.t, b.m, b.foco);
        else { ctx.globalAlpha = b.t*b.m; pin(b.x, b.y, 1, b.t*b.m, 0); ctx.globalAlpha = 1; }
      }
      if (!b.vis){
        ctx.strokeStyle = 'rgba(255,255,255,' + (.34*b.m*(1-b.t)) + ')'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(b.x, b.y-4, 3.6, 0, 6.283); ctx.stroke();
      }
    }

    /* ondas, radares y textos */
    for (i = efectos.length-1; i >= 0; i--){
      e = efectos[i];
      if (e.txt){
        e.a -= dt*.8; e.y += e.vy*dt; if (e.a <= 0){ efectos.splice(i,1); continue; }
        ctx.font = '600 11px "Inter Tight", system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,' + (e.a*e.m) + ')'; ctx.fillText(e.txt, e.x, e.y); continue;
      }
      e.r += dt*(e.radar ? 90 : 46); e.a -= dt*(e.radar ? 1.1 : .9);
      if (e.a <= 0){ efectos.splice(i,1); continue; }
      ctx.strokeStyle = 'rgba(' + e.c + ',' + (e.a*.55*e.m) + ')'; ctx.lineWidth = e.radar ? 1 : 1.4;
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.283); ctx.stroke();
    }
    for (i = etiquetas.length-1; i >= 0; i--){
      var et = etiquetas[i]; et.vida -= dt; if (et.vida <= 0){ etiquetas.splice(i,1); continue; }
      var a = Math.min(1, et.vida/.5, (2.8 - et.vida)/.3);
      ctx.font = '500 11.5px "Inter Tight", system-ui, sans-serif';
      var w = ctx.measureText(et.txt).width + 34, x = et.b.x + 13, yy = et.b.y - 30;
      if (x + w > W - 8) x = et.b.x - 13 - w;
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(20,22,42,.92)'; ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 1;
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, yy, w, 24, 8); else ctx.rect(x, yy, w, 24); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2bb673'; ctx.beginPath(); ctx.arc(x+12, yy+12, 3.2, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(et.txt, x+22, yy+16.2);
      ctx.globalAlpha = 1;
    }
    raf = (visible && !document.hidden && !quieto) ? requestAnimationFrame(cuadro) : 0;
  }
  function andar(){ if (capa && !raf && visible && !document.hidden && !quieto){ antes = performance.now(); raf = requestAnimationFrame(cuadro); } }

  function iniciar(){ armar(); if (quieto) cuadro(performance.now()); else andar(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(iniciar); else iniciar();

  var rt, ancho = innerWidth;
  addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(function(){
    /* en celular la barra del navegador cambia el alto: solo se rehace si cambia el ancho */
    if (Math.abs(innerWidth - ancho) > 30 || !document.documentElement.classList.contains('tactil')){ ancho = innerWidth; armar(); if (quieto) cuadro(performance.now()); }
  }, 200); });
  document.addEventListener('visibilitychange', andar);
  if ('IntersectionObserver' in window) new IntersectionObserver(function(en){ visible = en[0].isIntersecting; andar(); }).observe(hero);
  function aMapa(e){ var b = cv.getBoundingClientRect(); return [ (e.clientX - b.left) * (W / b.width), (e.clientY - b.top) * (H / b.height) ]; }
  hero.addEventListener('pointermove', function(e){ if (e.pointerType !== 'mouse') return; var p = aMapa(e); raton.x = p[0]; raton.y = p[1]; raton.dentro = !e.target.closest('form,.chips,a,button'); });
  hero.addEventListener('pointerleave', function(){ raton.dentro = false; });
  hero.addEventListener('click', function(e){
    if (e.target.closest('form,button,a,input,.chips')) return;
    var p = aMapa(e), mejor = null, md = 110;
    negocios.forEach(function(b){ if (b.vis) return; var d = Math.hypot(b.x-p[0], b.y-p[1]); if (d < md){ md = d; mejor = b; } });
    if (mejor) aparecer(mejor, true);
    efectos.push({x:p[0], y:p[1], r:4, a:.8, c:'255,255,255', radar:true, m:1});
  });
})();
