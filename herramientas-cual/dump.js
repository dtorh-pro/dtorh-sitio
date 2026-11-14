const fs=require('fs');const s=fs.readFileSync('/home/claude/dtorh-sitio/cual/index.html','utf8');
function grab(start){const i=s.indexOf(start);let j=s.indexOf('\n];',i);return s.slice(i,j+3);}
const code='function fmt(n){return n.toLocaleString("es-CO")} function cop(n){return "$"+fmt(n)}\n'+grab('var EQUIPOS = [')+'\n'+grab('var RONDAS = [')+'\n;module.exports={EQUIPOS,RONDAS}';
fs.writeFileSync('/tmp/eq.js',code);const {EQUIPOS,RONDAS}=require('/tmp/eq.js');
const out={eq:EQUIPOS.map(e=>({id:e.id,n:e.n,m:e.m,img:e.img,precio:e.precio})),pares:{}};
for(const A of EQUIPOS)for(const B of EQUIPOS){if(A===B)continue;
 const filas=RONDAS.filter(r=>r.k!=='precio').map(r=>{let sa=r.s(A),sb=r.s(B);const d=(sa==null||sb==null)?0:sa-sb;const g=Math.abs(d)<3?null:(d>0?'a':'b');
  return {k:r.k,n:r.n,va:r.v(A),vb:r.v(B),g,claro:g?r.claro(g==='a'?A:B,g==='a'?B:A).replace(/<\/?b>/g,''):'Aquí están parejos.'}});
 out.pares[A.id+'|'+B.id]=filas;}
fs.writeFileSync('datos.json',JSON.stringify(out));console.log(EQUIPOS.length,Object.keys(out.pares).length);
