/* FIT Snack Market · tienda en línea · dtorh™
   Datos: datos.js (catálogo del negocio, nov-2026). Movimiento firma: la bolsa se llena al bajar. */
(function(){
'use strict';
var D = window.FIT_DATA || {items:[],granel:{nueces:[],especias:[]}};
var WA = '573011637788';
var IMG = '/fit-snack-market/img/';
var HOME = '/fit-snack-market/', CATP = '/fit-snack-market/catalogo/';
var APERTURA = true; // true cuando la tienda abra: muestra abierto/cerrado según el horario
var IS_CAT = !!document.getElementById('results');
var IS_HOME = document.body.classList.contains('home');
var ILL = window.FIT_ILL || {};
var KEY = 'fitsm-bolsa-v2', KEYF = 'fitsm-datos-v1';
var doc = document, root = doc.documentElement;
var $ = function(s,r){return (r||doc).querySelector(s);};
var $$ = function(s,r){return Array.prototype.slice.call((r||doc).querySelectorAll(s));};
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var fmt = function(n){ var s=String(Math.round(n)); return '$'+s.replace(/\B(?=(\d{3})+(?!\d))/g,'.'); };
var norm = function(s){ return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase(); };
var esc = function(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); };
var store = {
  get:function(k,d){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } },
  set:function(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
};
function hh(){ var t=$('#top'); return t?t.offsetHeight:64; }

/* ---------- catálogo ---------- */
var CATS = [
  {id:'cremas',n:'Cremas y granolas',s:'Para untar y desayunar',bg:'#F1E6C8',fg:'#3E4E2B'},
  {id:'pan',n:'Panadería',s:'Panes y galletas Spiga',bg:'#C9A16A',fg:'#2E3A21'},
  {id:'snacks',n:'Snacks y barras',s:'Antojos sin culpa',bg:'#96A26E',fg:'#1F2916'},
  {id:'arepas',n:'Arepas y deditos',s:'Antojos caseros',bg:'#FFFDF7',fg:'#3E4E2B'},
  {id:'lacteos',n:'Lácteos y kéfir',s:'San Martín y bebidas vegetales',bg:'#EEF0E0',fg:'#3E4E2B'},
  {id:'cafe',n:'Café y bebidas',s:'Barra de café y despensa',bg:'#E9DDBE',fg:'#3E4E2B'},
  {id:'bienestar',n:'Bienestar y suplementos',s:'Suplementos y nutrición',bg:'#B5BC8F',fg:'#1F2916'},
  {id:'granel',n:'Frutos secos y especias',s:'A granel, por gramo',bg:'#526539',fg:'#FAF6ED'}
];
var CAT = {}; CATS.forEach(function(c){CAT[c.id]=c;});
var OCC = [
  {id:'desayuno',n:'Desayuno',why:'para arrancar el día: cremas, granolas, panes y yogures.'},
  {id:'antojo',n:'Antojo sin culpa',why:'para el antojo dulce de la tarde.'},
  {id:'entreno',n:'Después de entrenar',why:'con proteína o para recargar después del ejercicio.'},
  {id:'llevar',n:'Para llevar',why:'que caben en el bolso: oficina, universidad o paseo.'},
  {id:'cocina',n:'Cocina natural',why:'para cocinar en casa con ingredientes naturales.'},
  {id:'descanso',n:'Descansar mejor',why:'para la noche: suplementos y bebidas para descansar.'},
  {id:'menos',n:'Menos azúcar',why:'endulzados con stevia, yacón o monk fruit, o sin dulce.'}
];
var OC = {}; OCC.forEach(function(o){OC[o.id]=o;});
var ITEMS = D.items.filter(function(it){return !it.x;}).map(function(it,i){
  it.i=i;
  it.h = norm([it.n,it.b,it.s,it.z,(CAT[it.c]||{}).n,(it.t||[]).map(function(t){return (OC[t]||{}).n;}).join(' ')].join(' '));
  return it;
});
var BYID = {}; ITEMS.forEach(function(it){BYID[it.id]=it;});
var GRANEL = [];
['nueces','especias'].forEach(function(k){ (D.granel[k]||[]).forEach(function(g){ GRANEL.push({id:'g-'+norm(g[0]).replace(/[^a-z0-9]+/g,'-'),n:g[0],pg:g[1],col:g[2],k:k,step:k==='nueces'?50:25}); }); });
var GBY = {}; GRANEL.forEach(function(g){GBY[g.id]=g;});

/* ilustraciones (sólidas, sin brillos) */
var NUT = {
  'Almendra':'<path d="M20 3c8 6 11 18 6 28-3 5-9 5-12 0C9 21 12 9 20 3Z" fill="#C79A63"/><path d="M20 8c-2 7-2 15 0 22" stroke="#A97845" stroke-width="1.4" fill="none"/>',
  'Marañón':'<path d="M29 6c7 6 6 19-3 25-8 6-19 3-21-5 4 3 11 3 16-1 6-5 8-12 8-19Z" fill="#E6CFA0"/><path d="M29 9c3 7 1 14-5 18" stroke="#CDAE76" stroke-width="1.4" fill="none"/>',
  'Nuez nogal':'<path d="M7 20c0-8 6-14 13-14s13 6 13 14-6 14-13 14S7 28 7 20Z" fill="#9B6B3E"/><path d="M20 7v26M13 13c3 2 3 5 0 7s0 5 3 7M27 13c-3 2-3 5 0 7s0 5-3 7" stroke="#6E4628" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  'Pistacho':'<ellipse cx="20" cy="20" rx="11" ry="15" fill="#DCCDA2" transform="rotate(-25 20 20)"/><ellipse cx="22" cy="18" rx="6" ry="10" fill="#8FAE4A" transform="rotate(-25 22 18)"/>',
  'Arándanos':'<path d="M8 21c0-7 5-12 12-12s12 5 12 12-5 11-12 11S8 28 8 21Z" fill="#7B2E3B"/><path d="M17 11l3 3 3-3" stroke="#5A1F2A" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  'Semilla de calabaza':'<path d="M20 4c7 5 9 13 6 22-2 6-10 6-12 0-3-9-1-17 6-22Z" fill="#5E7D32"/><path d="M20 8v22" stroke="#4A6427" stroke-width="1.4"/>',
  'Maní con sal':'<path d="M14 6c5-3 11 0 11 6 0 3-2 5-2 8s3 5 3 9c0 6-7 9-12 6-4-2-5-7-3-10 1-2 2-3 2-5 0-3-4-5-4-9 0-2 2-4 5-5Z" fill="#C98E55"/><path d="M15 12h6M14 27h7" stroke="#A86F3C" stroke-width="1.4" stroke-linecap="round"/>',
  'Semilla de girasol':'<ellipse cx="20" cy="20" rx="7" ry="14" fill="#3F3B36" transform="rotate(20 20 20)"/><path d="M17 8l6 24" stroke="#D9D3C4" stroke-width="1.4"/>',
  'Chía':'<circle cx="14" cy="16" r="4" fill="#4B4A44"/><circle cx="25" cy="14" r="3.4" fill="#6F6A5E"/><circle cx="20" cy="25" r="4.2" fill="#4B4A44"/><circle cx="29" cy="25" r="3" fill="#6F6A5E"/>',
  'Linaza':'<ellipse cx="15" cy="17" rx="3.5" ry="6" fill="#8B5A2B" transform="rotate(-30 15 17)"/><ellipse cx="26" cy="15" rx="3.5" ry="6" fill="#A06A35" transform="rotate(20 26 15)"/><ellipse cx="21" cy="27" rx="3.5" ry="6" fill="#8B5A2B" transform="rotate(80 21 27)"/>'
};
function nutSvg(name,col){
  var p = NUT[name] || ('<circle cx="20" cy="20" r="11" fill="'+(col||'#C9A16A')+'"/><circle cx="14" cy="27" r="5" fill="'+(col||'#C9A16A')+'"/><circle cx="28" cy="13" r="4" fill="'+(col||'#C9A16A')+'"/>');
  return '<svg viewBox="0 0 40 40" aria-hidden="true">'+p+'</svg>';
}
var ICON = {
  cup:'<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3.5c0 1 1 1.5 1 2.5M11.5 3.5c0 1 1 1.5 1 2.5"/>',
  bottle:'<path d="M10 2.5h4v3l1.6 2.4c.3.5.4 1 .4 1.6V20a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 20V9.5c0-.6.1-1.1.4-1.6L10 5.5v-3Z"/><path d="M8 12h8"/>',
  jar:'<rect x="6" y="7" width="12" height="14" rx="2.5"/><path d="M7.5 3.5h9V7h-9z"/><path d="M9 13h6"/>',
  arepa:'<circle cx="12" cy="12" r="8"/><path d="M8.5 10.5h.01M14 9h.01M15.5 13.5h.01M10.5 15h.01"/>',
  finger:'<rect x="4" y="9" width="16" height="6" rx="3" transform="rotate(-20 12 12)"/><path d="M8 13.5 9 9.8M12 12.2l1-3.7"/>',
  bar:'<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 8v8M11 8v8M15 8v8"/>',
  bag:'<path d="M5 8h14l-1.1 11.1a2 2 0 0 1-2 1.9H8.1a2 2 0 0 1-2-1.9L5 8Z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/>'
};
function iconFor(it){
  var n=norm(it.n);
  if(/cafe|capuchino/.test(n)) return 'cup';
  if(/kefir|agua|soda|canada/.test(n)) return 'bottle';
  if(/arepa/.test(n)) return 'arepa';
  if(/dedito/.test(n)) return 'finger';
  if(/cubes/.test(n)) return 'bar';
  if(it.c==='bienestar') return 'jar';
  return 'bag';
}
function ph(it){ return '<span class="ph tp" data-c="'+esc(it.c)+'"><svg viewBox="0 0 24 24">'+ICON[iconFor(it)]+'</svg><span class="pt-n">'+esc(it.n)+'</span><span class="pt-b">'+esc([it.b,it.z].filter(Boolean).join(' · '))+'</span></span>'; }
function src(it,cut,big){ return IMG+it.img+(big?'':'-400')+'.webp'; }
function pic(it,lazy,mode){
  if(!it.img) return ph(it);
  var big=mode==='big';
  return '<img src="'+src(it,0,big)+'" srcset="'+src(it,0,false)+' 400w, '+src(it,0,true)+' 800w" sizes="'+(big?'(max-width:760px) 100vw, 440px':'(max-width:560px) 46vw, 260px')+'" width="400" height="400" alt="'+esc(it.n+(it.b?' '+it.b:''))+'"'+(lazy===false?'':' loading="lazy" decoding="async"')+'>';
}

/* ---------- bolsa (carrito) ---------- */
var bag = store.get(KEY,{}); // {id:{q}} y {'gb-...':{gb:[[nombre,g,pg]],tot}}
Object.keys(bag).forEach(function(k){ if(k.indexOf('gb-')!==0 && !BYID[k]) delete bag[k]; });
function bagLines(){
  return Object.keys(bag).map(function(k){
    var v=bag[k];
    if(v.gb) return {k:k,gb:v.gb,q:1,tot:v.tot,n:'Bolsa a granel',sub:v.gb.map(function(l){return l[0]+' '+l[1]+' g';}).join(', ')};
    var it=BYID[k]; return {k:k,it:it,q:v.q,tot:it.p*v.q,n:it.n,sub:[it.b,it.z].filter(Boolean).join(' · ')};
  });
}
function bagCount(){ return bagLines().reduce(function(a,l){return a+l.q;},0); }
function bagTotal(){ return bagLines().reduce(function(a,l){return a+l.tot;},0); }
function qty(id){ return bag[id]?bag[id].q:0; }
function setQ(id,q,src){
  var before=qty(id);
  q=Math.max(0,Math.min(99,q|0));
  if(q===0) delete bag[id]; else bag[id]={q:q};
  store.set(KEY,bag);
  syncCtl(id); syncBag();
  if(q>before && !drawerOpen){ fly(src,BYID[id]); toast('Agregado: '+BYID[id].n, true); }
}
function ctl(id){
  var q=qty(id);
  if(!q) return '<button class="add" type="button" data-add="'+id+'" aria-label="Agregar '+esc(BYID[id].n)+'"><svg class="ic" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><span class="t">Agregar</span></button>';
  return '<span class="stp"><button type="button" data-dec="'+id+'" aria-label="Quitar uno">−</button><output aria-live="polite">'+q+'</output><button type="button" data-inc="'+id+'" aria-label="Agregar uno">+</button></span>';
}
function syncCtl(id){ $$('[data-ctl="'+id+'"]').forEach(function(n){ n.innerHTML=ctl(id); }); }
function syncBag(){
  var c=bagCount(), t=bagTotal();
  var n=$('#bagN'); if(n){ n.textContent=c; n.classList.remove('bump'); void n.offsetWidth; if(c) n.classList.add('bump'); }
  $('#mbN').textContent=c; $('#mbS').textContent=c===1?'1 producto':c+' productos'; $('#mbT').textContent=fmt(t)+' →';
  $('#mbar').classList.toggle('on', c>0 && !drawerOpen);
  if(drawerOpen && view==='bag') renderBag();
  if(drawerOpen && view==='form') renderFormTotals();
}

/* ---------- utilidades de interfaz ---------- */
var toastT;
function toast(msg,withBag){
  var t=$('#toast'); t.innerHTML='<span>'+esc(msg)+'</span>'+(withBag?'<button type="button" data-openbag>Ver bolsa</button>':'');
  t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(function(){t.classList.remove('on');},2600);
}
function fly(srcEl,it){
  if(reduce || !srcEl || !window.gsap) return;
  var from=srcEl.closest('.card,.mini,.res,.sheet,.b-side'); var img=from&&from.querySelector('img');
  var r=(img||srcEl).getBoundingClientRect();
  var target=$('#mbar').classList.contains('on')&&innerWidth<=900?$('#mbN'):$('#bagN');
  if(!target) return; var tr=target.getBoundingClientRect(); if(!tr.width) target=$('#openBag'), tr=target.getBoundingClientRect();
  var f=doc.createElement('div'); f.className='fly';
  f.innerHTML = it&&it.img ? '<img src="'+src(it,0,false)+'" alt="">' : (it&&it.n?ph(it):'');
  doc.body.appendChild(f);
  var sx=r.left+r.width/2-28, sy=r.top+r.height/2-28, ex=tr.left+tr.width/2-28, ey=tr.top+tr.height/2-28;
  gsap.set(f,{x:sx,y:sy});
  gsap.to(f,{duration:.75,ease:'power2.in',keyframes:{x:[sx,(sx+ex)/2,ex],y:[sy,Math.min(sy,ey)-80,ey],scale:[1,.9,.35],opacity:[1,1,.2]},onComplete:function(){f.remove();}});
}
function waLink(text){ return 'https://wa.me/'+WA+'?text='+encodeURIComponent(text); }

/* ---------- desplazamiento ---------- */
var lenis=null;
function go(target,extra){
  var el=typeof target==='string'?doc.querySelector(target):target; if(!el) return;
  var off=-(hh()+(extra==null?12:extra));
  if(lenis){ lenis.scrollTo(el,{offset:off,duration:1.1}); }
  else { var y=el.getBoundingClientRect().top+pageYOffset+off; scrollTo({top:y,behavior:reduce?'auto':'smooth'}); }
}

/* ---------- estado de la tienda (hora de Barranquilla) ---------- */
var DAYS=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
function bogota(){
  try{
    var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Bogota',weekday:'short',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date());
    var o={}; p.forEach(function(x){o[x.type]=x.value;});
    return {d:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(o.weekday),m:(+o.hour%24)*60+(+o.minute)};
  }catch(e){ var n=new Date(); return {d:n.getDay(),m:n.getHours()*60+n.getMinutes()}; }
}
function hoursOf(d){ return {o:510,c:d===0?1080:1230}; }
function hm(m){ var h=Math.floor(m/60), mi=m%60, ap=h>=12?'p. m.':'a. m.'; h=h%12||12; return h+(mi?':'+String(mi).padStart(2,'0'):'')+' '+ap; }
function storeState(){
  if(!APERTURA) return {open:true,soon:true,t:'Apertura muy pronto',s:'C.C. Miramar Plaza, local 211'};
  var b=bogota(), h=hoursOf(b.d);
  if(b.m>=h.o && b.m<h.c){ var left=h.c-b.m; return {open:true,t:'Abierto ahora',s:left<=60?'cierra en '+left+' min':'hasta las '+hm(h.c)}; }
  if(b.m<h.o) return {open:false,t:'Cerrado',s:'abre hoy a las '+hm(h.o)};
  return {open:false,t:'Cerrado',s:'abre mañana a las '+hm(hoursOf((b.d+1)%7).o)};
}
function paintStatus(){
  var s=storeState();
  ['#heroStatus','#visitStatus'].forEach(function(sel){ var el=$(sel); if(!el) return; el.classList.toggle('closed',!s.open); el.classList.toggle('soon',!!s.soon); el.innerHTML='<i></i><span>'+s.t+' <small>· '+s.s+'</small></span>'; });
  var b=bogota(), ul=$('#hours');
  if(ul){ ul.innerHTML=[1,2,3,4,5,6,0].map(function(d){ var h=hoursOf(d); return '<li'+(d===b.d?' class="today"':'')+'><span>'+DAYS[d]+'</span><b>'+hm(h.o)+' – '+hm(h.c)+'</b></li>'; }).join(''); }
}

/* ---------- HERO: la bolsa que se llena ---------- */
var HERO = [
  {id:'chocolate-284-g',s:[16,14],e:[38,60],w:21,r:[-8,-14]},
  {id:'kefir-sandia-y-fresa-220-ml',s:[46,8],e:[55,58],w:18,r:[4,8]},
  {id:'granola-clasica-de-vainilla-300-g',s:[80,14],e:[63,56],w:21,r:[8,12]},
  {id:'arepa-cocinada-de-queso',s:[10,41],e:[42,54],w:18,r:[-6,-10]},
  {id:'yogurt-griego-vainilla-150-g',s:[86,41],e:[59,51],w:18,r:[6,-5]},
  {id:'mani-smooth',s:[48,33],e:[49,48],w:17,r:[2,4]},
  {id:'pistachio-cubes',s:[30,55],e:[36,50],w:15,r:[-12,-6]},
  {id:'capuchino',s:[70,58],e:[66,50],w:15,r:[10,6]}
];
var NUT_G=50;
function buildHero(){
  var wrap=$('#drops'); if(!wrap) return;
  var small=innerWidth<=900;
  wrap.innerHTML=HERO.map(function(h,i){
    if(small && (i===6||i===7)) return '';
    if(h.id){ var it=BYID[h.id]; if(!it) return '';
      return '<div class="drop pt" data-i="'+i+'" style="left:'+(h.s[0]-h.w/2)+'%;top:calc('+h.s[1]+'% - '+(h.w*0.45)+'%);width:'+h.w+'%"><div class="pop"><div class="tile"><img src="'+src(it,0,false)+'" width="400" height="400" alt="" fetchpriority="'+(i<5?'high':'auto')+'"></div><span class="tag">'+fmt(it.p)+'</span></div></div>';
    }
    return '<div class="drop nut" data-i="'+i+'" style="left:'+(h.s[0]-h.w/2)+'%;top:calc('+h.s[1]+'% - '+(h.w*0.45)+'%);width:'+h.w+'%;aspect-ratio:1"><div class="pop">'+nutSvg(h.g)+'</div></div>';
  }).join('');
}
function heroValue(h){ if(h.id) return BYID[h.id].p; var g=GRANEL.filter(function(x){return x.n===h.g;})[0]; return g?g.pg*NUT_G:0; }
function paintTicket(landed){
  var n=0,g=0,t=0;
  landed.forEach(function(h){ if(h.id) n++; else g+=NUT_G; t+=heroValue(h); });
  $('#tkTotal').textContent=fmt(t);
  $('#tkCount').textContent=(n===1?'1 producto':n+' productos')+(g?' · '+g+' g a granel':'');
  $('#ticket').classList.toggle('done',landed.length>=$$('#drops .drop').length);
}
function heroMotion(){
  var stage=$('#stage'), drops=$$('#drops .drop');
  if(!drops.length) return;
  if(window.gsap){
    var words=null;
    if(window.SplitText && !reduce){ try{ words=new SplitText('#h1',{type:'words',mask:'words'}).words; }catch(e){} }
    if(!reduce){
      if(words) gsap.from(words,{yPercent:110,duration:1,ease:'power4.out',stagger:.07,delay:.1});
      gsap.from($$('#drops .pop'),{opacity:0,scale:.6,y:-40,duration:.9,ease:'power3.out',stagger:{each:.05,from:'random'},delay:.3});
      gsap.from(['.bagb','.bagf','#ticket'],{opacity:0,y:30,duration:.9,ease:'power3.out',stagger:.08,delay:.2});
    }
  }
  if(reduce || !window.gsap || !window.ScrollTrigger){ paintTicket([]); return; }
  var tl=gsap.timeline({defaults:{ease:'power2.in'}});
  var marks=[];
  drops.forEach(function(el,k){
    var h=HERO[+el.dataset.i], at=k*0.42;
    tl.fromTo(el,{x:0,y:0,rotation:h.r[0],scale:1},{
      x:function(){return (h.e[0]-h.s[0])/100*stage.offsetWidth;},
      y:function(){return (h.e[1]-h.s[1])/100*stage.offsetHeight;},
      rotation:h.r[1],scale:.86,duration:1},at);
    marks.push({t:at+1,h:h});
  });
  tl.to({},{duration:.5});
  var last=-1;
  ScrollTrigger.create({trigger:'#hero',start:function(){return 'top '+hh()+'px';},end:'bottom bottom',scrub:.7,animation:tl,invalidateOnRefresh:true,
    onUpdate:function(st){
      var t=tl.time(), landed=marks.filter(function(m){return t>=m.t-.02;}).map(function(m){return m.h;});
      if(landed.length!==last){ last=landed.length; paintTicket(landed); }
      $('#hint').style.opacity=st.progress>.03?0:1;
    }});
  paintTicket([]);
}

/* ---------- JARDÍN (portada): logo + rama que crece + frutos secos que flotan ---------- */
var NUTS=[['Almendra',6,18,13],['Nuez nogal',80,8,14],['Pistacho',90,44,11],['Marañón',2,58,13],['Arándanos',22,90,10],['Semilla de calabaza',74,86,10],['Maní con sal',44,2,10],['Anís estrellado',94,74,9],['Canela en astilla',16,40,8]];
var LEAF='<path d="M0 0C14-17 52-21 72-5c4 3 4 9 0 12C52 24 14 18 0 0Z" fill="#7E9B4E" stroke="#2E3A21" stroke-width="2.2" stroke-linejoin="round"/><path d="M6 1C28 2 50 3 66 3" fill="none" stroke="#2E3A21" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>';
var LEAF2=LEAF.replace('#7E9B4E','#96A26E');
var garden=null;
function buildGarden(){
  var stem=$('#gStem'); if(!stem) return;
  var L=stem.getTotalLength(), h='', k=0;
  for(var t=.05;t<=.99;t+=.058){
    var p=stem.getPointAtLength(L*t), q=stem.getPointAtLength(Math.min(L,L*t+2)), ang=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI, side=(k%2?1:-1), sc=(1.2-.55*t);
    h+='<g transform="translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+') rotate('+(ang+side*58).toFixed(1)+')"><g class="lf" data-t="'+t.toFixed(3)+'" data-s="'+sc.toFixed(2)+'" transform="scale('+sc.toFixed(2)+')">'+(k%3?LEAF:LEAF2)+'</g></g>';
    k++;
  }
  $('#gLeaves').innerHTML=h;
  $('#gNuts').innerHTML=NUTS.map(function(n,i){ return '<span class="gn2" style="left:'+n[1]+'%;top:'+n[2]+'%;width:'+n[3]+'%"><span class="fl" style="animation-delay:-'+(i*1.3)+'s;animation-duration:'+(6+i%4)+'s">'+(ILL[n[0]]||'')+'</span></span>'; }).join('');
  $('#bfHero').innerHTML=ILL.mariposa||'';
  garden={stem:stem,L:L};
}
function gardenMotion(){
  if(!garden) return;
  var L=garden.L, stem=garden.stem, start=.5;
  stem.style.strokeDasharray=L;
  var leaves=$$('#gLeaves .lf'), nuts=$$('#gNuts .gn2');
  if(reduce || !window.gsap || !window.ScrollTrigger){ stem.style.strokeDashoffset=0; return; }
  if(window.SplitText){ try{ var w=new SplitText('#h1',{type:'words'}).words; gsap.from(w,{opacity:0,y:24,duration:.9,ease:'power3.out',stagger:.07,delay:.1}); }catch(e){} }
  gsap.from('.g-disc',{scale:.86,opacity:0,duration:1.1,ease:'power3.out',delay:.15});
  gsap.from(nuts,{opacity:0,scale:.5,duration:.9,ease:'power3.out',stagger:.06,delay:.4});
  var mm=gsap.matchMedia();
  mm.add('(min-width:901px)',function(){
    stem.style.strokeDashoffset=L*(1-start);
    var early=leaves.filter(function(l){return +l.dataset.t<=start;}), late=leaves.filter(function(l){return +l.dataset.t>start;});
    gsap.from(early,{scale:0,transformOrigin:'0% 50%',duration:.9,ease:'power3.out',stagger:.07,delay:.3});
    gsap.set(late,{scale:0,transformOrigin:'0% 50%'});
    var tl=gsap.timeline({defaults:{ease:'none'}});
    tl.to(stem,{strokeDashoffset:0,duration:1},0);
    late.forEach(function(l){ var t=+l.dataset.t; tl.to(l,{scale:+l.dataset.s,duration:.14,ease:'power2.out'},(t-start)/(1-start)*.88); });
    nuts.forEach(function(n,i){ tl.to(n,{yPercent:(i%2?-1:1)*(40+i*8),xPercent:(i%3-1)*30,duration:1},0); });
    tl.to('.g-disc',{rotation:-6,scale:1.03,duration:1},0);
    tl.fromTo('#bfHero',{xPercent:0,yPercent:0},{xPercent:260,yPercent:-330,rotation:10,duration:1,ease:'sine.inOut'},0);
    var st=ScrollTrigger.create({trigger:'#hero',start:function(){return 'top '+hh()+'px';},end:'bottom bottom',scrub:.6,animation:tl,onUpdate:function(s){ $('#hint').style.opacity=s.progress>.03?0:1; }});
    return function(){ st.kill(); tl.kill(); gsap.set(leaves,{clearProps:'all'}); };
  });
  mm.add('(max-width:900px)',function(){
    var start=.55;
    stem.style.strokeDashoffset=L;
    var early=leaves.filter(function(l){return +l.dataset.t<=start;}), late=leaves.filter(function(l){return +l.dataset.t>start;});
    gsap.to(stem,{strokeDashoffset:L*(1-start),duration:1.6,ease:'power2.out',delay:.3});
    gsap.from(early,{scale:0,transformOrigin:'0% 50%',duration:.7,ease:'power3.out',stagger:.08,delay:.5});
    gsap.set(late,{scale:0,transformOrigin:'0% 50%'});
    var tl=gsap.timeline({defaults:{ease:'none'}});
    tl.fromTo(stem,{strokeDashoffset:L*(1-start)},{strokeDashoffset:0,duration:1,immediateRender:false},0);
    late.forEach(function(l){ var t=+l.dataset.t; tl.to(l,{scale:+l.dataset.s,duration:.15,ease:'power2.out'},(t-start)/(1-start)*.8); });
    nuts.forEach(function(n,i){ tl.to(n,{yPercent:(i%2?-1:1)*(30+i*6),xPercent:(i%3-1)*25,rotation:(i%2?-20:20),duration:1},0); });
    tl.to('.g-disc',{rotation:-8,scale:.96,duration:1},0);
    tl.fromTo('#bfHero',{xPercent:0,yPercent:0},{xPercent:420,yPercent:-520,rotation:12,duration:1,ease:'sine.inOut'},0);
    var st=ScrollTrigger.create({trigger:'#gArt',start:'top 20%',end:'bottom top',scrub:.5,animation:tl});
    return function(){ st.kill(); tl.kill(); };
  });
}
/* mariposa guía: se posa en cada sección */
function butterflyGuide(){
  if(!window.gsap || !window.ScrollTrigger || reduce || !ILL.mariposa) return;
  var bf=doc.createElement('span'); bf.className='bf bf-guide'; bf.innerHTML=ILL.mariposa; bf.setAttribute('aria-hidden','true');
  var cur=null;
  function moveTo(t){
    if(cur===t) return;
    var src=cur?bf.getBoundingClientRect():(($('#bfHero')||t).getBoundingClientRect());
    t.appendChild(bf); var dst=bf.getBoundingClientRect(); cur=t;
    bf.classList.add('flying');
    gsap.fromTo(bf,{x:src.left-dst.left,y:src.top-dst.top,rotation:-10},{x:0,y:0,rotation:0,duration:1.1,ease:'power2.inOut',onComplete:function(){bf.classList.remove('flying');}});
  }
  $$('[data-perch]').forEach(function(t){
    var sec=t.closest('section')||t;
    ScrollTrigger.create({trigger:sec,start:'top 65%',end:'bottom 35%',onEnter:function(){moveTo(t);},onEnterBack:function(){moveTo(t);}});
  });
}

/* ---------- PASILLOS ---------- */
function buildAisles(){
  var tr=$('#aTrack'); if(!tr) return;
  tr.innerHTML=CATS.map(function(c,i){
    var its=ITEMS.filter(function(x){return x.c===c.id;});
    var picsH;
    if(c.id==='granel'){ picsH='<span class="gx">'+['Almendra','Nuez nogal','Pistacho','Marañón','Arándanos','Semilla de calabaza'].map(function(n){return '<i>'+(ILL[n]||'')+'</i>';}).join('')+'</span>'; }
    else { var a=its.filter(function(x){return x.img;}); picsH=[a[0],a[Math.floor(a.length/2)],a[a.length-1]].filter(Boolean).map(function(x){return '<img src="'+src(x,0,false)+'" width="400" height="400" alt="" loading="lazy" decoding="async">';}).join(''); }
    var n=c.id==='granel'?GRANEL.length:its.length;
    var min=c.id==='granel'?Math.min.apply(null,GRANEL.map(function(g){return g.pg;})):Math.min.apply(null,its.map(function(x){return x.p;}));
    return '<a class="a-card" href="'+CATP+(c.id==='granel'?'#granel':'?c='+c.id)+'" data-cat="'+c.id+'" style="background:'+c.bg+';color:'+c.fg+';--goc:'+c.bg+'">'+
      '<span class="no">'+String(i+1).padStart(2,'0')+' / 08</span><span class="a-ic">'+(ILL[c.id]||'')+'</span><h3>'+esc(c.n)+'</h3><p class="sub">'+esc(c.s)+'</p>'+
      '<div class="pics">'+picsH+'</div>'+
      '<div class="ft"><span><b>'+n+' productos</b><small>desde '+fmt(min)+(c.id==='granel'?' el gramo':'')+'</small></span><span class="go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span></div></a>';
  }).join('');
}
function aislesMotion(){
  var sec=$('#pasillos'), tr=$('#aTrack'); if(!sec||!tr) return;
  var setBar=function(p){ $('#aRail').style.transform='scaleX('+p+')'; $('#aCount').textContent=(Math.min(7,Math.floor(p*8))+1)+' / 8'; };
  if(!window.gsap || !window.ScrollTrigger || reduce){ sec.classList.add('native'); tr.addEventListener('scroll',function(){ setBar(tr.scrollLeft/Math.max(1,tr.scrollWidth-tr.clientWidth)); },{passive:true}); return; }
  var dist=function(){ return Math.max(0,tr.scrollWidth-innerWidth); };
  var setH=function(){ sec.style.height=(innerHeight-hh()+dist())+'px'; };
  setH();
  gsap.to(tr,{x:function(){return -dist();},ease:'none',scrollTrigger:{trigger:sec,start:function(){return 'top '+hh()+'px';},end:function(){return '+='+dist();},scrub:.5,invalidateOnRefresh:true,onRefreshInit:setH,onUpdate:function(st){ setBar(st.progress); }}});
}

/* ---------- tarjetas ---------- */
function cardH(it,k){
  var badge = it.b==='FIT Snack Market'?'<span class="badge">De la casa</span>':'';
  return '<article class="card reveal" style="transition-delay:'+((k||0)%4*60)+'ms">'+
    '<button class="open" type="button" data-open="'+it.id+'" aria-label="Ver '+esc(it.n)+'">'+
    '<span class="pic" data-c="'+it.c+'">'+badge+pic(it)+'</span>'+
    '<span class="body"><span class="br">'+esc(it.b||it.s||'')+'</span><span class="nm">'+hl(it.n)+'</span><span class="sz">'+esc(it.z||it.s||'')+'</span></span></button>'+
    (IS_HOME ? '<div class="row np"><button class="more" type="button" data-open="'+it.id+'">Ver producto <span aria-hidden="true">→</span></button></div></article>' : '<div class="row"><span class="pr">'+fmt(it.p)+'</span><span data-ctl="'+it.id+'">'+ctl(it.id)+'</span></div></article>');
}
function miniH(it){
  return '<div class="mini"><button class="open" type="button" data-open="'+it.id+'" style="all:unset;cursor:pointer;display:block"><span class="pic" data-c="'+it.c+'" style="display:block">'+pic(it)+'</span></button><div class="i"><b>'+esc(it.n)+'</b><div class="rw"><strong>'+fmt(it.p)+'</strong><span data-ctl-mini="'+it.id+'">'+(qty(it.id)?'<span class="add" style="background:var(--leaf)" aria-label="En tu bolsa">✓</span>':'<button class="add" type="button" data-add="'+it.id+'" aria-label="Agregar '+esc(it.n)+'"><svg class="ic" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>')+'</span></div></div></div>';
}
var hlRe=null;
function hl(s){ s=esc(s); if(!hlRe) return s; return s.replace(hlRe,'<mark>$1</mark>'); }

/* ---------- PARA TI ---------- */
var goal=null, seed=1;
function rnd(s){ return function(){ s=(s*9301+49297)%233280; return s/233280; }; }
function pickFor(tag,n,sd){
  var r=rnd(sd), pool=ITEMS.filter(function(x){return x.t.indexOf(tag)>-1;}).map(function(x){return {x:x,k:r()+(x.img?0:.9)};}).sort(function(a,b){return a.k-b.k;}).map(function(o){return o.x;});
  var out=[],brands={};
  pool.forEach(function(x){ if(out.length<n && !brands[x.b||x.s]){ brands[x.b||x.s]=1; out.push(x);} });
  pool.forEach(function(x){ if(out.length<n && out.indexOf(x)<0) out.push(x); });
  return out;
}
function defaultGoal(){ var m=bogota().m/60; if(m>=5&&m<10.5) return 'desayuno'; if(m>=10.5&&m<14) return 'llevar'; if(m>=14&&m<18) return 'antojo'; if(m>=18&&m<20) return 'entreno'; return 'descanso'; }
function buildGoals(){
  $('#goals').innerHTML=OCC.map(function(o){return '<button class="chip" type="button" data-goal="'+o.id+'" aria-pressed="false">'+esc(o.n)+'</button>';}).join('');
  setGoal(defaultGoal(),true);
}
function setGoal(id,auto){
  goal=id; $$('#goals .chip').forEach(function(b){ b.setAttribute('aria-pressed',b.dataset.goal===id?'true':'false'); });
  var o=OC[id], total=ITEMS.filter(function(x){return x.t.indexOf(id)>-1;}).length;
  var b=bogota();
  $('#why').innerHTML=(auto?'Son las <b>'+hm(b.m)+'</b> en Barranquilla: ':'')+'ideas '+esc(o.why)+' <b>'+total+'</b> productos en total.';
  var keep=hlRe; hlRe=null; $('#picks').innerHTML=pickFor(id,4,seed+id.length*7).map(cardH).join(''); hlRe=keep;
  $('#seeAll').textContent='Ver los '+total;
  $('#seeAll').dataset.occ=id;
  observeReveal($('#picks'));
  var gb=$('#goals [data-goal="'+id+'"]'); if(gb && !auto){ var g=$('#goals'); g.scrollTo({left:gb.offsetLeft-g.clientWidth/2+gb.offsetWidth/2,behavior:'smooth'}); }
}

/* ---------- CATÁLOGO ---------- */
var S={c:'all',q:'',sort:'cat',occ:null};
var SYN={'sin azucar':'menos','azucar':'menos','dulce':'antojo','proteina':'entreno','gym':'entreno','gimnasio':'entreno','dormir':'descanso','sueno':'descanso','yogur':'yogurt','vegetal':'leche','fit':''};
function hasTok(h,t){ return t.length<=3 ? (' '+h).indexOf(' '+t)>-1 : h.indexOf(t)>-1; }
function matches(it,q){
  var qq=norm(q).trim(); if(!qq) return true;
  var whole=SYN[qq]; if(whole && OC[whole]) return it.t.indexOf(whole)>-1;
  if(qq.indexOf('sin azucar')>-1){ if(it.t.indexOf('menos')<0) return false; qq=qq.replace('sin azucar',' ').trim(); if(!qq) return true; }
  return qq.split(/\s+/).every(function(t){
    if(hasTok(it.h,t)) return true;
    var s=SYN[t]; if(s===undefined) return false; if(s==='') return true;
    return OC[s]?it.t.indexOf(s)>-1:hasTok(it.h,s);
  });
}
function gMatches(g,q){ if(!q) return false; var h=norm(g.n+' granel '+(g.k==='nueces'?'frutos secos semillas nueces':'especias aromaticas')); return norm(q).trim().split(/\s+/).every(function(t){return h.indexOf(t)>-1;}); }
function filtered(){
  var arr=ITEMS.filter(function(it){ return (S.c==='all'||it.c===S.c) && (!S.occ||it.t.indexOf(S.occ)>-1) && matches(it,S.q); });
  if(S.sort==='asc') arr.sort(function(a,b){return a.p-b.p;});
  else if(S.sort==='desc') arr.sort(function(a,b){return b.p-a.p;});
  else if(S.sort==='az') arr.sort(function(a,b){return a.n.localeCompare(b.n,'es');});
  return arr;
}
function buildTabs(){
  var t=$('#tabs');
  var h='<button class="tab" role="tab" type="button" data-tab="all" aria-selected="true">Todo <small>'+ITEMS.length+'</small></button>';
  CATS.forEach(function(c){ var n=c.id==='granel'?GRANEL.length:ITEMS.filter(function(x){return x.c===c.id;}).length; h+='<button class="tab" role="tab" type="button" data-tab="'+c.id+'" aria-selected="false">'+esc(c.id==='granel'?'A granel':c.n)+' <small>'+n+'</small></button>'; });
  t.insertAdjacentHTML('beforeend',h);
  $('#occ').innerHTML=OCC.map(function(o){return '<button class="chip" type="button" data-occ-f="'+o.id+'" aria-pressed="false">'+esc(o.n)+'</button>';}).join('');
}
function fBadge(){ var n=(S.q?1:0)+(S.occ?1:0)+(S.sort!=='cat'?1:0), b=$('#fBadge'); if(b){ b.textContent=n; b.hidden=!n; } }
function occCounts(){
  $$('#occ .chip').forEach(function(b){
    var o=b.dataset.occF, n=ITEMS.filter(function(x){return (S.c==='all'||x.c===S.c) && x.t.indexOf(o)>-1;}).length;
    b.disabled=!n && S.occ!==o; b.innerHTML=esc(OC[o].n)+' <small>'+n+'</small>';
  });
}
function moveInd(){
  var sel=$('#tabs [aria-selected="true"]'), ind=$('#ind'); if(!sel||!ind) return;
  ind.style.width=sel.offsetWidth+'px'; ind.style.transform='translateX('+sel.offsetLeft+'px)';
}
function renderCatalog(animate){
  var run=function(){
    var arr=filtered(), q=S.q.trim();
    hlRe=null;
    if(q){ var toks=q.split(/\s+/).filter(function(t){return t.length>1;}).map(function(t){return t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}); if(toks.length) try{ hlRe=new RegExp('('+toks.join('|')+')','gi'); }catch(e){} }
    var gm=GRANEL.filter(function(g){return gMatches(g,q);});
    var html='';
    if(gm.length && (S.c==='all')){
      html+='<div class="grp"><div class="grp-h"><h3>A granel</h3><small>precio por gramo</small></div><div class="grid">'+gm.map(function(g){
        return '<article class="card reveal"><button class="open" type="button" data-gjump="'+g.id+'"><span class="pic"><span class="gtile">'+(ILL[g.n]||'')+'</span></span><span class="body"><span class="br">A granel</span><span class="nm">'+hl(g.n)+'</span><span class="sz">'+fmt(g.pg)+' el gramo</span></span></button><div class="row"><span class="pr">'+fmt(g.pg*100)+' <small>/100 g</small></span><button class="add" type="button" data-gjump="'+g.id+'"><span class="t">Elegir</span><svg class="ic" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button></div></article>';
      }).join('')+'</div></div>';
    }
    if(!arr.length && !gm.length && !q){
      html='<div class="empty"><h3>Sin productos para «'+esc(S.occ?OC[S.occ].n:'este filtro')+'» en '+esc((CAT[S.c]||{}).n||'este pasillo')+'</h3><p>Prueba en todo el catálogo o con otra ocasión.</p><button class="btn" type="button" data-allcat>Ver en todo el catálogo</button> <button class="btn ghost" type="button" data-reset>Quitar filtros</button></div>';
    } else if(!arr.length && !gm.length){
      html='<div class="empty"><h3>No encontramos “'+esc(q)+'”</h3><p>Puede que lo tengan en la tienda. Pregunta y te responden por WhatsApp.</p><a class="btn" target="_blank" rel="noopener" href="'+waLink('Hola FIT Snack Market, ¿tienen '+(q||'este producto')+'?')+'">Preguntar por WhatsApp</a> <button class="btn ghost" type="button" data-reset>Ver todo el catálogo</button></div>';
    } else if(S.sort==='cat' && !q){
      var groups=[];
      if(S.c==='all'){ CATS.forEach(function(c){ var g=arr.filter(function(x){return x.c===c.id;}); if(g.length) groups.push({t:c.n,s:c.s,a:g}); }); }
      else { var subs=[]; arr.forEach(function(x){ if(subs.indexOf(x.s)<0) subs.push(x.s); }); subs.forEach(function(s){ groups.push({t:s,a:arr.filter(function(x){return x.s===s;})}); }); }
      html+=groups.map(function(g){ return '<div class="grp"><div class="grp-h"><h3>'+esc(g.t)+'</h3><small>'+g.a.length+(g.a.length===1?' producto':' productos')+'</small></div><div class="grid">'+g.a.map(cardH).join('')+'</div></div>'; }).join('');
    } else {
      html+='<div class="grid">'+arr.map(cardH).join('')+'</div>';
    }
    $('#results').innerHTML=html; occCounts(); fBadge();
    var label=(S.c==='all'?'todo el catálogo':(CAT[S.c]||{}).n)+(S.occ?' · '+OC[S.occ].n.toLowerCase():'');
    var any=S.q||S.occ||S.c!=='all'||S.sort!=='cat';
    $('#note').innerHTML='<span><b>'+(arr.length+gm.length)+'</b> '+((arr.length+gm.length)===1?'resultado':'resultados')+' en '+esc(label)+(q?' para “'+esc(q)+'”':'')+'</span>'+(any?'<button class="linkb" type="button" data-reset>Quitar filtros</button>':'');
    observeReveal($('#results'));
    syncUrl();
    refreshST();
  };
  if(animate && doc.startViewTransition && !reduce) doc.startViewTransition(run); else run();
}
function setCat(c,scroll){
  if(!IS_CAT){ location.href=CATP+(c==='granel'?'#granel':(c&&c!=='all'?'?c='+c:'')); return; }
  if(c==='granel'){ go('#granel'); return; }
  S.c=c; $$('#tabs .tab').forEach(function(b){ b.setAttribute('aria-selected',b.dataset.tab===c?'true':'false'); });
  moveInd();
  var sel=$('#tabs [aria-selected="true"]'), t=$('#tabs'); if(sel) t.scrollTo({left:sel.offsetLeft-t.clientWidth/2+sel.offsetWidth/2,behavior:'smooth'});
  renderCatalog(true);
  if(scroll) go('#catBar',-4);
}
function setOcc(o,scroll){
  S.occ=S.occ===o?null:o;
  $$('#occ .chip').forEach(function(b){ b.setAttribute('aria-pressed',b.dataset.occF===S.occ?'true':'false'); });
  renderCatalog(true);
  if(scroll) go('#catBar',-4);
}
function resetCat(){
  S={c:'all',q:'',sort:'cat',occ:null}; $('#q').value=''; $('#qClr').hidden=true; $('#sort').value='cat';
  $$('#occ .chip').forEach(function(b){b.setAttribute('aria-pressed','false');});
  $$('#tabs .tab').forEach(function(b){ b.setAttribute('aria-selected',b.dataset.tab==='all'?'true':'false'); }); moveInd();
  renderCatalog(true);
}
var urlT;
function syncUrl(){
  clearTimeout(urlT); urlT=setTimeout(function(){
    try{ var u=new URL(location.href); ['c','q','o'].forEach(function(k){u.searchParams.delete(k);});
      if(S.c!=='all') u.searchParams.set('c',S.c); if(S.q) u.searchParams.set('q',S.q); if(S.occ) u.searchParams.set('o',S.occ);
      history.replaceState(null,'',u.pathname+u.search+u.hash); }catch(e){}
  },300);
}

/* ---------- reveal ---------- */
var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{rootMargin:'0px 0px -6% 0px'}) : null;
function observeReveal(scope){ $$('.reveal:not(.in)',scope).forEach(function(el){ if(io && !reduce) io.observe(el); else el.classList.add('in'); }); }

/* ---------- FICHA DE PRODUCTO ---------- */
var IDEA={cremas:'Úntala en pan, arepa o pancakes, o mézclala con yogurt y fruta.',pan:'Para el desayuno o la merienda; acompáñalo con una crema para untar.',snacks:'Cabe en el bolso: para la oficina, la universidad o después de entrenar.',arepas:'Para el desayuno o la merienda. Pregunta en la tienda cómo prepararla.',lacteos:'Combínalo con granola o fruta para un desayuno rápido.',cafe:'',bienestar:'Lee la etiqueta antes de consumirlo y, si tienes una condición de salud, consulta a tu médico.'};
function related(it,n,excl){
  excl=excl||{};
  return ITEMS.filter(function(x){return x.id!==it.id && !excl[x.id] && x.img;}).map(function(x){
    var sc=x.t.filter(function(t){return it.t.indexOf(t)>-1;}).length*2+(x.c!==it.c?1.5:0)+(x.b!==it.b?.5:0)+((x.i*7+it.i)%5)/10; return {x:x,sc:sc};
  }).sort(function(a,b){return b.sc-a.sc;}).slice(0,n).map(function(o){return o.x;});
}
var sheetQ=1, sheetId=null, lastFocus=null;
function openSheet(id){
  var it=BYID[id]; if(!it) return; sheetId=id; sheetQ=qty(id)||1;
  var c=CAT[it.c]||{}, idea=it.c==='cafe'?(it.s==='Cafetería'?'Se prepara al momento en la barra de café de la tienda.':it.s==='Despensa'?'Para darle sabor a tus comidas en casa.':'Bien fría, para acompañar tu snack.'):IDEA[it.c];
  var desc=(it.s||c.n)+(it.b?' de '+it.b:'')+(it.z?', presentación de '+it.z:'')+'. '+(idea||'');
  var tags=it.t.map(function(t){return '<span>'+esc(OC[t].n)+'</span>';}).join('');
  var sh=$('#sheet');
  sh.innerHTML='<span class="grab" aria-hidden="true"></span><div class="sp" data-c="'+it.c+'"><div class="spi">'+pic(it,false,'big')+'</div>'+(it.sf?'<div class="vw" role="group" aria-label="Vista de la imagen"><button type="button" data-vw="cut" aria-pressed="true">Producto</button><button type="button" data-vw="foto" aria-pressed="false">Foto de la marca</button></div>':'')+'</div><div class="si"><button class="x" type="button" data-close aria-label="Cerrar">×</button>'+
    '<span class="eyebrow">'+esc(it.b||c.n)+'</span><h3 id="shT">'+esc(it.n)+'</h3><p class="meta">'+esc([it.z,it.s].filter(Boolean).join(' · '))+'</p>'+
    '<p class="price">'+fmt(it.p)+'</p>'+
    '<div class="buy"><span class="stp"><button type="button" data-sq="-1" aria-label="Menos">−</button><output id="shQ">'+sheetQ+'</output><button type="button" data-sq="1" aria-label="Más">+</button></span><button class="btn" type="button" id="shAdd">'+(qty(id)?'Actualizar bolsa':'Agregar')+' · <span class="tnum" id="shT2">'+fmt(it.p*sheetQ)+'</span></button></div>'+
    (tags?'<div><p class="fine" style="margin-bottom:.4rem">Ideal para</p><div class="tags">'+tags+'</div></div>':'')+
    '<p class="desc">'+esc(desc)+'</p>'+
    '<a class="ask" target="_blank" rel="noopener" href="'+waLink('Hola FIT Snack Market, tengo una pregunta sobre '+it.n+(it.b?' ('+it.b+')':'')+'.')+'"><svg class="ic" viewBox="0 0 24 24"><path d="M4.5 19.5l1.2-3.6a8 8 0 1 1 2.9 2.6l-4.1 1Z"/></svg><span><b>¿Tienes una duda de este producto?</b><small>Pregunta por WhatsApp: ingredientes, disponibilidad, sabores.</small></span></a>'+
    '<div class="ups"><h4>Combínalo con</h4><div class="row">'+related(it,6).map(miniH).join('')+'</div></div></div>';
  openLayer('sheet');
  try{ var u=new URL(location.href); u.searchParams.set('p',id); history.replaceState(null,'',u.pathname+u.search+u.hash);}catch(e){}
}
function sheetSync(){ var it=BYID[sheetId]; $('#shQ').textContent=sheetQ; $('#shT2').textContent=fmt(it.p*sheetQ); }

/* ---------- capas (diálogos) ---------- */
var layer=null, drawerOpen=false, view='bag';
function openLayer(name){
  if(layer && layer!==name) closeLayer(true);
  lastFocus=lastFocus||doc.activeElement;
  layer=name;
  var el=name==='sheet'?$('#sheet'):name==='drawer'?$('#drawer'):$('#finder');
  el.classList.add('on'); el.setAttribute('aria-hidden','false');
  $('#scrim').classList.add('on');
  doc.body.classList.add('lock'); if(lenis) lenis.stop();
  if(name==='drawer'){ drawerOpen=true; $('#mbar').classList.remove('on'); }
  setTimeout(function(){ var f=name==='finder'?$('#fq'):el.querySelector('button,a,input'); if(f) f.focus({preventScroll:true}); },60);
}
function closeLayer(keep){
  if(!layer) return;
  var el=layer==='sheet'?$('#sheet'):layer==='drawer'?$('#drawer'):$('#finder');
  el.classList.remove('on'); el.setAttribute('aria-hidden','true');
  if(layer==='drawer'){ drawerOpen=false; }
  if(layer==='sheet'){ try{ var u=new URL(location.href); u.searchParams.delete('p'); history.replaceState(null,'',u.pathname+u.search+u.hash);}catch(e){} }
  layer=null;
  if(!keep){
    $('#scrim').classList.remove('on'); doc.body.classList.remove('lock'); if(lenis) lenis.start();
    syncBag();
    if(lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true}); lastFocus=null;
  }
}
function trap(e){
  if(!layer || e.key!=='Tab') return;
  var el=layer==='sheet'?$('#sheet'):layer==='drawer'?$('#drawer'):$('#finder');
  var f=$$('button:not([disabled]),a[href],input,select,textarea',el).filter(function(n){return n.offsetParent!==null;});
  if(!f.length) return; var a=f[0], z=f[f.length-1];
  if(e.shiftKey && doc.activeElement===a){ e.preventDefault(); z.focus(); } else if(!e.shiftKey && doc.activeElement===z){ e.preventDefault(); a.focus(); }
}

/* ---------- BOLSA Y PEDIDO ---------- */
function thumb(l){ if(l.gb){ var g=GRANEL.filter(function(x){return x.n===l.gb[0][0];})[0]; return '<span class="gth">'+(ILL[l.gb[0][0]]||ILL.granel)+'</span>'; } return pic(l.it); }
function renderBag(){
  view='bag'; $('#dT').textContent='Tu bolsa'; $('#dBack').hidden=true;
  var L=bagLines(), body=$('#dBody'), foot=$('#dFoot');
  if(!L.length){
    var ideas=pickFor(defaultGoal(),6,seed);
    body.innerHTML='<div class="d-empty"><svg class="ic" viewBox="0 0 24 24" style="width:64px;height:64px;stroke-width:1.2">'+ICON.bag+'</svg><h3>Tu bolsa está vacía</h3><p>Agrega productos del catálogo o arma tu bolsa a granel.</p></div><div class="ups"><h4>Ideas para empezar</h4><div class="row">'+ideas.map(miniH).join('')+'</div></div>';
    foot.innerHTML='<button class="btn block" type="button" data-close data-goto="#catalogo">Ver el catálogo</button>';
    return;
  }
  var inBag={}; L.forEach(function(l){ if(l.it) inBag[l.it.id]=1; });
  var base=L.filter(function(l){return l.it;}).map(function(l){return l.it;})[0];
  var ups=base?related(base,6,inBag):pickFor('antojo',6,seed);
  body.innerHTML=L.map(function(l){
    return '<div class="ln"><span class="th">'+thumb(l)+'</span><span><b>'+esc(l.n)+'</b><small>'+esc(l.sub)+'</small></span><span class="r"><strong>'+fmt(l.tot)+'</strong>'+
      (l.gb?'<button class="linkb" type="button" data-rm="'+l.k+'">Quitar</button>':'<span class="stp"><button type="button" data-dec="'+l.k+'" aria-label="Quitar uno">−</button><output>'+l.q+'</output><button type="button" data-inc="'+l.k+'" aria-label="Agregar uno">+</button></span>')+'</span></div>';
  }).join('')+(ups.length?'<div class="ups"><h4>Combínalo con</h4><div class="row">'+ups.map(miniH).join('')+'</div></div>':'');
  foot.innerHTML='<div class="tot"><span>Subtotal · '+bagCount()+(bagCount()===1?' producto':' productos')+'</span><b>'+fmt(bagTotal())+'</b></div><button class="btn block" type="button" id="toForm">Finalizar pedido <span class="arr" aria-hidden="true">→</span></button><p class="fine" style="margin-top:.6rem;text-align:center">El domicilio y el total final te los confirman por WhatsApp.</p>';
}
var F=store.get(KEYF,{name:'',mode:'dom',addr:'',hood:'',when:'asap',pay:'',note:''});
function slots(){
  var b=bogota(), h=hoursOf(b.d), out=[['asap','Lo antes posible']];
  var start=Math.max(h.o,Math.ceil((b.m+60)/30)*30);
  for(var m=start;m<=h.c-30;m+=60) out.push(['hoy-'+m,'Hoy, '+hm(m)]);
  out.push(['manana-am','Mañana en la mañana'],['manana-pm','Mañana en la tarde']);
  return out;
}
function renderForm(){
  view='form'; $('#dT').textContent='Finalizar pedido'; $('#dBack').hidden=false;
  var sl=slots(); if(!sl.some(function(s){return s[0]===F.when;})) F.when='asap';
  var pays=['Nequi','Bre-B','Transferencia','Efectivo','Tarjeta'];
  $('#dBody').innerHTML='<form class="fm" id="fm" novalidate>'+
    '<label>Tu nombre<input id="fName" autocomplete="name" placeholder="Ej. Ana Martínez" value="'+esc(F.name)+'" required></label>'+
    '<div><p style="font-weight:600;font-size:.9rem;color:var(--olive-deep);margin-bottom:.35rem">¿Cómo lo quieres?</p><div class="seg" role="radiogroup" aria-label="Entrega"><button type="button" role="radio" data-mode="dom" aria-checked="'+(F.mode==='dom')+'"><b>Domicilio</b><small>Barranquilla · valor según barrio</small></button><button type="button" role="radio" data-mode="pick" aria-checked="'+(F.mode==='pick')+'"><b>Recoger en tienda</b><small>C.C. Miramar Plaza · local 211</small></button></div></div>'+
    '<div id="addrBox" '+(F.mode==='dom'?'':'hidden')+' class="fm"><label>Dirección<input id="fAddr" autocomplete="street-address" placeholder="Ej. Calle 84 # 45-20, apto 302" value="'+esc(F.addr)+'"></label><label>Barrio<input id="fHood" placeholder="Ej. El Prado" value="'+esc(F.hood)+'"></label></div>'+
    '<label>¿Para cuándo?<select id="fWhen">'+sl.map(function(s){return '<option value="'+s[0]+'"'+(s[0]===F.when?' selected':'')+'>'+esc(s[1])+'</option>';}).join('')+'</select></label>'+
    '<div><p style="font-weight:600;font-size:.9rem;color:var(--olive-deep);margin-bottom:.35rem">Medio de pago que prefieres <em style="font-style:normal;font-weight:500;color:var(--muted)">(opcional)</em></p><div class="pays" role="radiogroup" aria-label="Medio de pago">'+pays.map(function(p){return '<button type="button" role="radio" data-pay="'+p+'" aria-checked="'+(F.pay===p)+'">'+p+'</button>';}).join('')+'</div><p class="fine" style="margin-top:.4rem">La tienda te confirma los medios disponibles al responder.</p></div>'+
    '<label>Nota <em>(opcional)</em><textarea id="fNote" placeholder="Ej. sin hielo, es para regalo, timbre dañado…">'+esc(F.note)+'</textarea></label>'+
    '<p class="err" id="fErr" role="alert"></p></form>';
  renderFormTotals();
}
function renderFormTotals(){
  $('#dFoot').innerHTML='<div class="tot"><span>Total de productos</span><b>'+fmt(bagTotal())+'</b></div><button class="btn block" type="button" id="sendWa"><svg class="ic" viewBox="0 0 24 24"><path d="M4.5 19.5l1.2-3.6a8 8 0 1 1 2.9 2.6l-4.1 1Z"/></svg>Enviar pedido por WhatsApp</button><p class="fine" style="margin-top:.6rem;text-align:center">Tus datos solo viajan en el mensaje y se recuerdan en este celular para tu próximo pedido.</p>';
}
function readForm(){
  F.name=$('#fName').value.trim(); F.addr=($('#fAddr')||{}).value||''; F.hood=($('#fHood')||{}).value||''; F.when=$('#fWhen').value; F.note=$('#fNote').value.trim();
  F.addr=F.addr.trim(); F.hood=F.hood.trim(); store.set(KEYF,F);
}
function sendOrder(){
  readForm();
  var err=[]; $$('#fm .bad').forEach(function(n){n.classList.remove('bad');});
  if(F.name.length<2){ err.push('tu nombre'); $('#fName').classList.add('bad'); }
  if(F.mode==='dom'){ if(F.addr.length<5){ err.push('la dirección'); $('#fAddr').classList.add('bad'); } if(F.hood.length<3){ err.push('el barrio'); $('#fHood').classList.add('bad'); } }
  if(err.length){ $('#fErr').textContent='Falta '+err.join(', ').replace(/, ([^,]*)$/,' y $1')+'.'; var b=$('#fm .bad'); if(b) b.focus(); return; }
  var L=bagLines(), code='FIT-'+String(Date.now()).slice(-5);
  var whenTxt=(slots().filter(function(s){return s[0]===F.when;})[0]||[0,'Lo antes posible'])[1];
  var msg='Hola FIT Snack Market, quiero hacer este pedido ('+code+'):\n\n'+
    L.map(function(l){ return l.gb ? '• Bolsa a granel: '+l.sub+' = '+fmt(l.tot) : '• '+l.q+' x '+l.n+(l.it.b?' ('+l.it.b+(l.it.z?', '+l.it.z:'')+')':(l.it.z?' ('+l.it.z+')':''))+' = '+fmt(l.tot); }).join('\n')+
    '\n\nTotal productos: '+fmt(bagTotal())+
    '\nEntrega: '+(F.mode==='dom'?'Domicilio a '+F.addr+', barrio '+F.hood:'Recojo en la tienda (C.C. Miramar Plaza, local 211)')+
    '\nCuándo: '+whenTxt+
    (F.pay?'\nPago: '+F.pay:'')+
    '\nNombre: '+F.name+
    (F.note?'\nNota: '+F.note:'')+
    '\n\n¿Me confirman disponibilidad'+(F.mode==='dom'?' y el valor del domicilio':'')+'? Gracias.';
  var url=waLink(msg);
  window.open(url,'_blank','noopener');
  view='done'; $('#dT').textContent='Pedido listo'; $('#dBack').hidden=true;
  $('#dBody').innerHTML='<div class="done" id="doneBox"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="36"/><path d="M24 41l11 11 22-24"/></svg><h3>¡Tu pedido va en camino a WhatsApp!</h3><p>Pedido <b>'+code+'</b>. Si WhatsApp no se abrió, tócalo de nuevo abajo. La tienda te responde con la confirmación'+(F.mode==='dom'?' y el valor del domicilio':'')+'.</p><div class="ctas"><a class="btn" href="'+url+'" target="_blank" rel="noopener">Abrir WhatsApp</a></div></div>';
  $('#dFoot').innerHTML='<button class="btn ghost block" type="button" id="clearBag">Vaciar la bolsa y seguir comprando</button>';
  requestAnimationFrame(function(){ var d=$('#doneBox'); if(d) d.classList.add('in'); });
}

/* ---------- GRANEL ---------- */
var gsel={}, gorder=[], gtab='nueces';
function renderBulk(){
  $('#bList').innerHTML=GRANEL.filter(function(g){return g.k===gtab;}).map(function(g){
    var q=gsel[g.id]||0;
    return '<div class="b-it'+(q?' on':'')+'" id="'+g.id+'"><span class="sw">'+(ILL[g.n]||'')+'</span><span class="tx"><b>'+esc(g.n)+'</b><small>'+fmt(g.pg)+' el gramo · '+(g.step*2)+' g = '+fmt(g.pg*g.step*2)+'</small></span><span class="stp"><button type="button" data-gd="'+g.id+'" aria-label="Menos '+esc(g.n)+'"'+(q?'':' disabled style="opacity:.35"')+'>−</button><output>'+(q?q+' g':'0 g')+'</output><button type="button" data-gi="'+g.id+'" aria-label="Más '+esc(g.n)+'">+</button></span></div>';
  }).join('');
}
function paintSack(){
  var tot=0, grams=0, L=[];
  gorder.forEach(function(id){ var q=gsel[id]; if(!q) return; var g=GBY[id]; tot+=q*g.pg; grams+=q; L.push(g); });
  var cap=Math.max(1000,grams), H=194, y=234, s='';
  gorder.forEach(function(id){ var q=gsel[id]; if(!q) return; var g=GBY[id], h=q/cap*H; y-=h; s+='<rect class="lay" x="0" y="'+y.toFixed(1)+'" width="200" height="'+(h+.6).toFixed(1)+'" fill="'+g.col+'"/>'; });
  $('#sackLayers').innerHTML=s; $('#sackEmpty').style.display=grams?'none':'';
  $('#bGrams').textContent=grams?grams+' g en tu bolsa':'Tu bolsa está vacía';
  $('#bTotal').textContent=fmt(tot);
  $('#bLines').innerHTML=gorder.filter(function(id){return gsel[id];}).map(function(id){ var g=GBY[id]; return '<li><span><i style="background:'+g.col+'"></i>'+esc(g.n)+' '+gsel[id]+' g</span><span>'+fmt(gsel[id]*g.pg)+'</span></li>'; }).join('');
  $('#bAdd').disabled=!grams;
  $('#bAdd').innerHTML=grams?'Agregar a mi pedido · '+fmt(tot):'Agregar a mi pedido';
}
function gStep(id,dir){
  var g=GBY[id]; var q=Math.max(0,Math.min(2000,(gsel[id]||0)+dir*g.step));
  if(q && gorder.indexOf(id)<0) gorder.push(id);
  if(!q){ delete gsel[id]; gorder=gorder.filter(function(x){return x!==id;}); } else gsel[id]=q;
  renderBulk(); paintSack();
  var b=$('#'+id+' [data-g'+(dir>0?'i':'d')+']'); if(b) b.focus({preventScroll:true});
}
function addBulk(src){
  var ids=gorder.filter(function(id){return gsel[id];}); if(!ids.length) return;
  var gb=ids.map(function(id){return [GBY[id].n,gsel[id],GBY[id].pg];});
  var tot=gb.reduce(function(a,l){return a+l[1]*l[2];},0);
  bag['gb-'+Date.now()]={gb:gb,tot:tot}; store.set(KEY,bag);
  fly(src,{n:'granel',c:'granel'}); toast('Bolsa a granel agregada',true);
  gsel={}; gorder=[]; renderBulk(); paintSack(); syncBag();
}
function jumpGranel(id){
  var g=GBY[id]; if(!g) return; closeLayer();
  if(!IS_CAT){ location.href=CATP+'?g='+id+'#granel'; return; }
  if(g.k!==gtab){ gtab=g.k; $$('[data-bt]').forEach(function(b){b.setAttribute('aria-selected',b.dataset.bt===gtab?'true':'false');}); renderBulk(); }
  go('#granel');
  setTimeout(function(){ var el=$('#'+id); if(el){ el.classList.remove('hl-flash'); void el.offsetWidth; el.classList.add('hl-flash'); } },700);
}

/* ---------- BUSCADOR ---------- */
var fSel=-1, fRes=[];
var SUG=['Granola','Kéfir','Proteína','Almendra','Sin azúcar','Café','Colágeno','Yogurt griego','Pan','Pistacho'];
function renderFind(){
  var q=$('#fq').value.trim(), box=$('#fr'); fSel=-1;
  if(!q){
    fRes=[];
    box.innerHTML='<p class="lbl">Prueba con</p><div class="fi-sug">'+SUG.map(function(s){return '<button class="chip" type="button" data-sug="'+esc(s)+'">'+esc(s)+'</button>';}).join('')+'</div><p class="lbl">Pasillos</p><div class="fi-sug">'+CATS.map(function(c){return '<button class="chip" type="button" data-cat="'+c.id+'">'+esc(c.n)+'</button>';}).join('')+'</div>';
    return;
  }
  hlRe=null; var toks=q.split(/\s+/).filter(function(t){return t.length>1;}).map(function(t){return t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}); if(toks.length) try{hlRe=new RegExp('('+toks.join('|')+')','gi');}catch(e){}
  var nq=norm(q);
  var a=ITEMS.filter(function(it){return matches(it,q);}).map(function(it){ var n=norm(it.n); return {it:it,sc:(n.indexOf(nq)===0?3:n.indexOf(nq)>-1?2:norm(it.b||'').indexOf(nq)>-1?1.5:1)}; }).sort(function(x,y){return y.sc-x.sc||x.it.p-y.it.p;}).slice(0,12).map(function(o){return o.it;});
  var g=GRANEL.filter(function(x){return gMatches(x,q);}).slice(0,4);
  fRes=g.map(function(x){return {g:x};}).concat(a.map(function(x){return {it:x};}));
  if(!fRes.length){ box.innerHTML='<div class="fi-none"><p>No encontramos “'+esc(q)+'” en el catálogo.</p><a class="btn sm" target="_blank" rel="noopener" href="'+waLink('Hola FIT Snack Market, ¿tienen '+q+'?')+'">¿Lo tienen? Preguntar por WhatsApp</a></div>'; return; }
  box.innerHTML='<p class="lbl">'+fRes.length+(fRes.length===1?' resultado':' resultados')+'</p>'+fRes.map(function(r,i){
    if(r.g) return '<div class="res" role="option" id="fr'+i+'" aria-selected="false" data-gjump="'+r.g.id+'"><span class="th gth">'+(ILL[r.g.n]||'')+'</span><span><b>'+hl(r.g.n)+'</b><small>A granel · '+fmt(r.g.pg)+' el gramo</small></span><span class="pr">'+fmt(r.g.pg*100)+'<br><small>100 g</small></span></div>';
    var it=r.it; return '<div class="res" role="option" id="fr'+i+'" aria-selected="false" data-open="'+it.id+'"><span class="th">'+pic(it)+'</span><span><b>'+hl(it.n)+'</b><small>'+esc([it.b,it.z].filter(Boolean).join(' · ')||(CAT[it.c]||{}).n)+'</small></span><span class="pr">'+fmt(it.p)+'</span></div>';
  }).join('')+'<p class="lbl" style="padding-top:1rem"><button class="linkb" type="button" data-seeq="'+esc(q)+'">Ver todos en el catálogo</button></p>';
}
function moveSel(d){
  var rows=$$('#fr .res'); if(!rows.length) return;
  fSel=(fSel+d+rows.length)%rows.length;
  rows.forEach(function(r,i){ r.setAttribute('aria-selected',i===fSel?'true':'false'); });
  rows[fSel].scrollIntoView({block:'nearest'}); $('#fq').setAttribute('aria-activedescendant',rows[fSel].id);
}

/* ---------- eventos ---------- */
doc.addEventListener('click',function(e){
  var t=e.target, el;
  if((el=t.closest('[data-add]'))){ e.preventDefault(); var id=el.dataset.add; setQ(id,qty(id)+1,el); $$('[data-ctl-mini="'+id+'"]').forEach(function(n){n.innerHTML='<span class="add" style="background:var(--leaf)" aria-label="En tu bolsa">✓</span>';}); return; }
  if((el=t.closest('[data-inc]'))){ setQ(el.dataset.inc,qty(el.dataset.inc)+1); return; }
  if((el=t.closest('[data-dec]'))){ setQ(el.dataset.dec,qty(el.dataset.dec)-1); return; }
  if((el=t.closest('[data-rm]'))){ delete bag[el.dataset.rm]; store.set(KEY,bag); syncBag(); return; }
  if((el=t.closest('[data-open]'))){ e.preventDefault(); if(layer==='finder') closeLayer(true); openSheet(el.dataset.open); return; }
  if((el=t.closest('[data-gjump]'))){ e.preventDefault(); jumpGranel(el.dataset.gjump); return; }
  if((el=t.closest('[data-vw]'))){ var it2=BYID[sheetId]; $('#sheet .spi').innerHTML=pic(it2,false,el.dataset.vw==='foto'?'foto':'big'); $$('[data-vw]').forEach(function(b){b.setAttribute('aria-pressed',b===el?'true':'false');}); return; }
  if((el=t.closest('[data-sq]'))){ sheetQ=Math.max(1,Math.min(99,sheetQ+(+el.dataset.sq))); sheetSync(); return; }
  if(t.closest('#shAdd')){ var was=qty(sheetId); setQ(sheetId,sheetQ,t.closest('#shAdd')); if(sheetQ<=was) toast('Bolsa actualizada',true); closeLayer(); return; }
  if(t.closest('[data-openbag]') || t.closest('#openBag') || t.closest('#mbarBtn')){ $('#toast').classList.remove('on'); renderBag(); openLayer('drawer'); return; }
  if(t.closest('#toForm')){ renderForm(); $('#dBody').scrollTop=0; return; }
  if(t.closest('#dBack')){ readForm(); renderBag(); return; }
  if((el=t.closest('[data-mode]'))){ F.mode=el.dataset.mode; $$('[data-mode]').forEach(function(b){b.setAttribute('aria-checked',b===el?'true':'false');}); $('#addrBox').hidden=F.mode!=='dom'; store.set(KEYF,F); return; }
  if((el=t.closest('[data-pay]'))){ F.pay=F.pay===el.dataset.pay?'':el.dataset.pay; $$('[data-pay]').forEach(function(b){b.setAttribute('aria-checked',b.dataset.pay===F.pay?'true':'false');}); store.set(KEYF,F); return; }
  if(t.closest('#sendWa')){ sendOrder(); return; }
  if(t.closest('#clearBag')){ bag={}; store.set(KEY,bag); $$('[data-ctl]').forEach(function(n){n.innerHTML=ctl(n.dataset.ctl);}); syncBag(); closeLayer(); return; }
  if((el=t.closest('[data-close]'))){ var goto=el.dataset.goto; closeLayer(); if(goto) setTimeout(function(){go(goto);},80); return; }
  if(t.closest('#scrim')){ closeLayer(); return; }
  if(t.closest('#openFind')){ openFinder(); return; }
  if((el=t.closest('[data-sug]'))){ $('#fq').value=el.dataset.sug; renderFind(); $('#fq').focus(); return; }
  if((el=t.closest('[data-seeq]'))){ var q=el.dataset.seeq; closeLayer(); if(!IS_CAT){ location.href=CATP+'?q='+encodeURIComponent(q); return; } S.q=q; $('#q').value=q; $('#qClr').hidden=false; setCat('all',true); return; }
  if((el=t.closest('[data-cat]'))){ e.preventDefault(); var c=el.dataset.cat; if(layer) closeLayer(); setCat(c,true); return; }
  if((el=t.closest('[data-tab]'))){ setCat(el.dataset.tab,false); return; }
  if((el=t.closest('[data-occ-f]'))){ setOcc(el.dataset.occF,false); return; }
  if((el=t.closest('#seeAll'))){ e.preventDefault(); if(!IS_CAT){ location.href=CATP+'?o='+el.dataset.occ; return; } S.occ=null; setOcc(el.dataset.occ,true); return; }
  if((el=t.closest('[data-goal]'))){ e.preventDefault(); setGoal(el.dataset.goal); if(el.tagName==='A') go('#para-ti'); return; }
  if(t.closest('#reroll')){ seed+=13; setGoal(goal); return; }
  if(t.closest('[data-reset]')){ resetCat(); return; }
  if(t.closest('[data-allcat]')){ setCat('all',false); return; }
  if((el=t.closest('#fToggle'))){ var p=$('#fPanel'), op=p.hidden; p.hidden=!op; el.setAttribute('aria-expanded',op?'true':'false'); if(op) setTimeout(function(){ $('#q').focus({preventScroll:true}); },50); refreshST(); return; }
  if((el=t.closest('[data-bt]'))){ gtab=el.dataset.bt; $$('[data-bt]').forEach(function(b){b.setAttribute('aria-selected',b===el?'true':'false');}); renderBulk(); return; }
  if((el=t.closest('[data-gi]'))){ gStep(el.dataset.gi,1); return; }
  if((el=t.closest('[data-gd]'))){ gStep(el.dataset.gd,-1); return; }
  if(t.closest('#bAdd')){ addBulk(t.closest('#bAdd')); return; }
  if((el=t.closest('[data-wa]'))){ el.href=waLink(el.dataset.wa); return; }
  if((el=t.closest('a[href^="#"]'))){ var h=el.getAttribute('href'); if(h.length>1 && doc.querySelector(h)){ e.preventDefault(); if(layer) closeLayer(); go(h==='#inicio'?doc.body:h, h==='#catalogo'?-60:12); } }
});
doc.addEventListener('keydown',function(e){
  var typing=/INPUT|TEXTAREA|SELECT/.test((doc.activeElement||{}).tagName);
  if(e.key==='Escape' && layer){ e.preventDefault(); closeLayer(); return; }
  if(((e.key==='/' && !typing) || ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k')) && layer!=='finder'){ e.preventDefault(); openFinder(); return; }
  if(layer==='finder'){
    if(e.key==='ArrowDown'){ e.preventDefault(); moveSel(1); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); moveSel(-1); }
    else if(e.key==='Enter'){ var rows=$$('#fr .res'); var r=rows[fSel>=0?fSel:0]; if(r){ e.preventDefault(); r.click(); } }
  }
  trap(e);
});
function openFinder(){ openLayer('finder'); $('#fq').value=''; renderFind(); }

/* ---------- arranque ---------- */
function init(){
  paintStatus(); setInterval(paintStatus,60000);
  if($('#drops')) buildHero();
  if($('#gArt')) buildGarden();
  if($('#aTrack')) buildAisles();
  if($('#goals')) buildGoals();
  var kg=$('#kGrid'); if(kg){ kg.innerHTML=['arepa-cocinada-de-queso','arepa-cocinada-de-chicharron','deditos-de-mozzarella','deditos-de-yuca-origen','cafe-de-especialidad','capuchino-de-especialidad'].map(function(id){return BYID[id];}).filter(Boolean).map(cardH).join(''); }
  var cp=$('#cbPics'); if(cp){ cp.innerHTML=['chocolate-284-g','kefir-sandia-y-fresa-220-ml','granola-clasica-de-vainilla-300-g','iso-whey-proteina-952-g','crema-de-almendras','pistachio-cubes'].map(function(id){var it=BYID[id]; return it?'<img src="'+src(it,0,false)+'" width="400" height="400" alt="" loading="lazy">':'';}).join(''); }
  if(IS_CAT){
    buildTabs(); renderBulk(); paintSack();
    try{ var u=new URL(location.href), c=u.searchParams.get('c'), q=u.searchParams.get('q'), o=u.searchParams.get('o'), g=u.searchParams.get('g');
      if(c && CAT[c] && c!=='granel'){ S.c=c; $$('#tabs .tab').forEach(function(b){b.setAttribute('aria-selected',b.dataset.tab===c?'true':'false');}); }
      if(q){ S.q=q; $('#q').value=q; $('#qClr').hidden=false; }
      if(o && OC[o]){ S.occ=o; $$('#occ .chip').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.occF===o?'true':'false');}); }
      if(g && GBY[g]) setTimeout(function(){ jumpGranel(g); },600);
    }catch(e){}
    renderCatalog(false); requestAnimationFrame(moveInd);
    var qT; $('#q').addEventListener('input',function(){ var v=this.value; $('#qClr').hidden=!v; clearTimeout(qT); qT=setTimeout(function(){ S.q=v; renderCatalog(false); },140); });
    $('#qClr').addEventListener('click',function(){ $('#q').value=''; this.hidden=true; S.q=''; renderCatalog(true); $('#q').focus(); });
    $('#sort').addEventListener('change',function(){ S.sort=this.value; renderCatalog(true); });
    if(location.hash==='#granel') setTimeout(function(){ go('#granel'); },300);
  }
  try{ var pp=new URL(location.href).searchParams.get('p'); if(pp && BYID[pp]) setTimeout(function(){openSheet(pp);},400); }catch(e){}
  syncBag();
  var fT; $('#fq').addEventListener('input',function(){ clearTimeout(fT); fT=setTimeout(renderFind,90); });
  $$('[data-wa]').forEach(function(a){ a.href=waLink(a.dataset.wa); });
  observeReveal(doc);
  addEventListener('resize',function(){ if(IS_CAT) moveInd(); navPill(); },{passive:true});
  var top=$('#top'), prog=$('#prog'), cb=$('#catBar');
  var onScroll=function(){
    var y=pageYOffset, max=root.scrollHeight-innerHeight;
    top.classList.toggle('scrolled',y>8);
    prog.style.transform='scaleX('+(max>0?y/max:0)+')';
    if(cb) cb.classList.toggle('stuck',cb.getBoundingClientRect().top<=hh()+1);
  };
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  var links=$$('#nav a[href^="#"]'), secs=links.map(function(a){return $(a.getAttribute('href'));});
  var cur=$('#nav a.on');
  function navPill(){ var p=$('#nav .pill'); if(!p) return; if(!cur){ p.style.opacity=0; return; } p.style.opacity=1; p.style.width=cur.offsetWidth+'px'; p.style.transform='translateX('+cur.offsetLeft+'px)'; }
  navPill();
  if(io && links.length){ var nio=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ var i=secs.indexOf(en.target); links.forEach(function(a,k){a.classList.toggle('on',k===i);}); cur=links[i]; navPill(); } }); },{rootMargin:'-45% 0px -50% 0px'}); secs.forEach(function(s){ if(s) nio.observe(s); }); }
  motion();
}
var stT; function refreshST(){ if(!window.ScrollTrigger) return; clearTimeout(stT); stT=setTimeout(function(){ ScrollTrigger.refresh(); },180); }
function motion(){
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger); if(window.SplitText) gsap.registerPlugin(SplitText);
    var fine=matchMedia('(pointer:fine)').matches;
    if(window.Lenis && fine && !reduce){
      try{ lenis=new Lenis({lerp:.1,smoothWheel:true,syncTouch:false,autoRaf:false}); lenis.on('scroll',ScrollTrigger.update); gsap.ticker.add(function(t){lenis.raf(t*1000);}); gsap.ticker.lagSmoothing(0); }catch(e){ lenis=null; }
    }
    if($('#drops')) heroMotion(); if($('#gArt')) gardenMotion(); aislesMotion(); if(IS_HOME) butterflyGuide();
    if(!reduce){
      // títulos que se arman por palabras
      if(window.SplitText) $$('[data-split]').forEach(function(h){ try{ var sp=new SplitText(h,{type:'words'}); gsap.from(sp.words,{opacity:0,y:26,duration:.8,ease:'power3.out',stagger:.05,scrollTrigger:{trigger:h,start:'top 88%',once:true}}); }catch(e){} });
      // cómo pedir: las tarjetas se apilan
      var st=$$('#stack .st');
      st.forEach(function(card,i){ var nx=st[i+1]; if(!nx) return; gsap.to(card,{scale:.94,ease:'none',scrollTrigger:{trigger:nx,start:'top 85%',end:'top 30%',scrub:true}}); });
    }
    if(doc.fonts && doc.fonts.ready) doc.fonts.ready.then(refreshST);
    addEventListener('load',refreshST);
  } else { paintTicket([]); }
}
if(doc.readyState==='loading') doc.addEventListener('DOMContentLoaded',init); else init();
})();
