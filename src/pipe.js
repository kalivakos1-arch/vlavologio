// ===== Σωληνόγραμμα VRF / VRF HR =====
var PS = (function(){ try{ return JSON.parse(localStorage.getItem("vl_pipe")||"null"); }catch(e){ return null; } })() || {sys:"daikin_hp", out:"10", A:"20", H:"5", Hpos:"up", h2:"3", bsm:"multi", hbc:"3", units:[{m:"63",s:"",b:"8"},{m:"40",s:"6",b:"6"},{m:"40",s:"",b:"7"}]};
function pSave(){ try{ localStorage.setItem("vl_pipe", JSON.stringify(PS)); }catch(e){} }
function pNum(v){ var n=parseFloat(String(v||"").replace(",",".")); return isNaN(n)?0:n; }
function pPick(tbl, x){ var lt=tbl.lt, rows=tbl.rows||tbl; for(var i=0;i<rows.length;i++){ if(lt ? x<rows[i][0] : x<=rows[i][0]) return rows[i]; } return rows[rows.length-1]; }
function pIdx(D, m){ m=+m; return D.idx ? (D.idx[m]!=null?D.idx[m]:m) : m; }
function pML(D,m){ return D.mLab ? D.mLab(m) : (D.brand==="Daikin"?"κλάση ":"P")+m; }
function pSL(D,m){ return D.sLab ? D.sLab(m) : D.mLab ? pFmt(+m) : (D.brand==="Daikin"?"":"P")+m; }
function pInd(D,u,ix){ return D.ind ? pPick(D.ind, D.indByIdx ? ix : +u.m).slice(1) : (D.indTxt||['—','—']); }
function pFix(D){ var chg = PS.outSys && PS.outSys!==PS.sys;
  if(D.outInput){ if(!(pNum(PS.out)>0) || chg) PS.out = D.outDef; } else if(D.outs.map(String).indexOf(String(PS.out))<0 || chg) PS.out = String(D.outs[Math.min(1,D.outs.length-1)]);
  if(chg){ var dm = D.kw ? [5.6,3.6,2.8] : D.brand==="Toshiba" ? [18,12,9] : D.brand==="Hitachi" ? [2,1.5,1] : [63,40,40];
    PS.units.forEach(function(u,i){ u.m = String(dm[i%3]); }); }
  PS.outSys = PS.sys;
  var ms = D.models.map(String); PS.units.forEach(function(u){ if(ms.indexOf(String(u.m))<0){ var v=pNum(u.m), b=ms[0]; ms.forEach(function(x){ if(Math.abs(+x-v) < Math.abs(+b-v)) b=x; }); u.m = b; } }); }
function pFmt(n){ return (Math.round(n*100)/100).toString().replace(".",","); }
function pCap(sz, mx){ // μην ξεπερνάς την κύρια διατομή
  return sz.map(function(v,i){ return (mx && mx[i] && parseFloat(v)>parseFloat(mx[i])) ? mx[i] : v; });
}
function pipeForm(){
  if(!PIPE[PS.sys]) PS.sys="daikin_hp"; var D = PIPE[PS.sys];
  pFix(D);
  var o = function(v,l,s){ return '<option value="'+esc(v)+'"'+(String(s)===String(v)?' selected':'')+'>'+esc(l)+'</option>'; };
  var h = '<div class="pcalcw"><div class="lbl">🧭 Σωληνόγραμμα</div>';
  h += '<label class="small">Σειρά<select id="pp_sys" class="ppv">'+Object.keys(PIPE).map(function(k){ return o(k, PIPE[k].name, PS.sys); }).join("")+'</select></label>';
  h += '<div class="row2"><label class="small">Εξωτερική'+(D.outInput?' – ψυκτική απόδοση (kW)<input id="pp_out" class="ppv" inputmode="decimal" value="'+esc(PS.out)+'">':'<select id="pp_out" class="ppv">'+D.outs.map(function(x){ return o(x, D.outLab(x), PS.out); }).join("")+'</select>')+'</label>';
  if(D.kind==="hr") h += '<label class="small">BS<select id="pp_bsm" class="ppv">'+o("multi","Ένα multi BS κοντά στην εξωτερική",PS.bsm)+o("single","BS1Q σε κάθε εσωτερική (γραμμή refnet)",PS.bsm)+'</select></label>';
  h += '</div>';
  var star = D.kind==="bc" || (D.kind==="hr" && PS.bsm==="multi");
  h += '<div class="row2"><label class="small">'+(star?(D.kind==="bc"?'Μήκος εξωτερική → BC (m)':'Μήκος εξωτερική → BS (m)'):'Μήκος εξωτερική → 1η διακλάδωση (m)')+'<input id="pp_A" class="ppv" inputmode="decimal" value="'+esc(PS.A)+'"></label>'+
       '<label class="small">Υψομετρική εξωτ.–εσωτ. (m)<input id="pp_H" class="ppv" inputmode="decimal" value="'+esc(PS.H)+'"></label></div>';
  h += '<div class="row2"><label class="small">Η εξωτερική είναι<select id="pp_Hpos" class="ppv">'+o("up","πιο ψηλά από τις εσωτερικές",PS.Hpos)+o("down","πιο χαμηλά από τις εσωτερικές",PS.Hpos)+'</select></label>'+
       '<label class="small">Μέγ. υψομετρική μεταξύ εσωτερικών (m)<input id="pp_h2" class="ppv" inputmode="decimal" value="'+esc(PS.h2)+'"></label></div>';
  if(D.kind==="bc") h += '<label class="small">Μέγ. υψομετρική εσωτερικής – BC (m)<input id="pp_hbc" class="ppv" inputmode="decimal" value="'+esc(PS.hbc)+'"></label>';
  h += '<div class="lbl" style="margin-top:8px">Εσωτερικές '+(star?'(κάθε μία στη δική της έξοδο)':'(με τη σειρά πάνω στη γραμμή)')+'</div>';
  h += '<div class="pptbl">';
  PS.units.forEach(function(u,i){
    var n = PS.units.length, segOn = !star && i>0 && i<n-1;
    h += '<div class="pprow"><b>'+(i+1)+'</b>'+
      '<label class="small">Μέγεθος<select class="ppv" data-pu="'+i+'" data-pk="m">'+D.models.map(function(m){ return o(m, pML(D,m), u.m); }).join("")+'</select></label>'+
      (star?'':'<label class="small">Γραμμή από προηγ. διακλάδωση (m)<input class="ppv" data-pu="'+i+'" data-pk="s" inputmode="decimal" value="'+esc(segOn?u.s:"")+'"'+(segOn?'':' disabled placeholder="—"')+'></label>')+
      '<label class="small">'+(star?(D.kind==="bc"?'BC → μονάδα (m)':'BS → μονάδα (m)'):'Διακλάδωση → μονάδα (m)')+'<input class="ppv" data-pu="'+i+'" data-pk="b" inputmode="decimal" value="'+esc(u.b)+'"></label>'+
      (n>2?'<button class="mini" data-pdel="'+i+'" aria-label="Αφαίρεση">✕</button>':'')+'</div>';
  });
  h += '</div><button class="mini" id="pp_add">+ εσωτερική</button>';
  h += '<div class="small" style="margin-top:6px">ℹ️ '+esc(D.idxNote)+(D.indNote?' '+esc(D.indNote):'')+'</div>';
  h += '<label class="small">Πρόσθετα kg φρέον (CF εσωτερικών, πίνακας ⓑ, BC κ.λπ. – αν τα ζητά το manual)<input id="pp_xkg" class="ppv" inputmode="decimal" value="'+esc(PS.xkg||"")+'" placeholder="0"></label>';
  h += '<div id="pp_out_box"></div><div class="small" style="margin-top:6px">Πηγή: '+esc(D.src)+'</div></div>';
  return h;
}
function pSvgLine(D, segs, units, hr){
  var n=units.length, W=Math.max(360, 170+n*130), Hh=hr?230:200, s='';
  s+='<svg class="ppsvg" viewBox="0 0 '+W+' '+Hh+'" width="'+W+'" height="'+Hh+'" xmlns="http://www.w3.org/2000/svg" font-size="11" font-family="system-ui,sans-serif">';
  s+='<rect x="6" y="40" width="70" height="44" rx="6" class="ppbox"/><text x="41" y="60" text-anchor="middle" class="pptx">Εξωτ.</text><text x="41" y="75" text-anchor="middle" class="pptx">'+esc(D.kw?D.outLab(PS.out):D.outLab(PS.out).split(" ")[0])+'</text>';
  var xj = function(k){ return 140+k*130; }, y=62;
  segs.forEach(function(g,k){ var x1 = k===0?76:xj(k-1), x2 = xj(k);
    s+='<line x1="'+x1+'" y1="'+y+'" x2="'+x2+'" y2="'+y+'" class="ppln"/>';
    s+='<text x="'+((x1+x2)/2)+'" y="'+(y-18)+'" text-anchor="middle" class="ppsz">'+esc(g.sz.join(" / "))+'</text>';
    s+='<text x="'+((x1+x2)/2)+'" y="'+(y-6)+'" text-anchor="middle" class="pplen">'+(g.L?pFmt(g.L)+' m':'')+'</text>';
    s+='<circle cx="'+x2+'" cy="'+y+'" r="5" class="ppj"/><text x="'+x2+'" y="'+(y+20)+'" text-anchor="middle" class="ppkit">'+esc(g.kit)+'</text>';
  });
  units.forEach(function(u,k){ var top=y+28, bot= hr?186:160;
    var xx = k===n-1 ? xj(n-1)-20 : xj(k);
    if(k===n-1) s+='<line x1="'+xj(n-2)+'" y1="'+y+'" x2="'+xx+'" y2="'+y+'" class="ppln"/>';
    s+='<line x1="'+xx+'" y1="'+(k===n-1?y:top)+'" x2="'+xx+'" y2="'+bot+'" class="ppln2"/>';
    s+='<text x="'+(xx+4)+'" y="'+(top+24)+'" class="ppsz">'+esc(u.sz.join(" / "))+'</text>';
    s+='<text x="'+(xx+4)+'" y="'+(top+37)+'" class="pplen">'+(u.L?pFmt(u.L)+' m':'')+'</text>';
    if(hr) s+='<text x="'+(xx+4)+'" y="'+(top+52)+'" class="ppkit">'+esc(u.bs)+' → '+esc(u.sz2.join(" / "))+'</text>';
    s+='<rect x="'+(xx-30)+'" y="'+bot+'" width="60" height="30" rx="5" class="ppbox"/><text x="'+xx+'" y="'+(bot+19)+'" text-anchor="middle" class="pptx">'+(k+1)+': '+esc(u.lab)+'</text>';
  });
  return s+'</svg>';
}
function pSvgStar(D, A, units, box){
  var n=units.length, W=Math.max(360, 30+n*96), Hh=270, s='', bx=10, bw=W-20;
  s+='<svg class="ppsvg" viewBox="0 0 '+W+' '+Hh+'" width="'+W+'" height="'+Hh+'" xmlns="http://www.w3.org/2000/svg" font-size="11" font-family="system-ui,sans-serif">';
  s+='<rect x="10" y="8" width="96" height="34" rx="6" class="ppbox"/><text x="58" y="30" text-anchor="middle" class="pptx">'+esc(D.kw?D.outLab(PS.out):D.outLab(PS.out).split(" ")[0])+'</text>';
  s+='<line x1="58" y1="42" x2="58" y2="86" class="ppln"/><text x="66" y="58" class="ppsz">'+esc(A.sz.join(" / "))+'</text><text x="66" y="72" class="pplen">'+(A.L?pFmt(A.L)+' m':'')+'</text>';
  s+='<rect x="'+bx+'" y="86" width="'+bw+'" height="30" rx="6" class="ppbox2"/><text x="'+(bx+bw/2)+'" y="105" text-anchor="middle" class="pptx">'+esc(box)+'</text>';
  units.forEach(function(u,k){ var x = 50+k*96;
    s+='<line x1="'+x+'" y1="116" x2="'+x+'" y2="226" class="ppln2"/>';
    s+='<text x="'+(x+4)+'" y="132" class="ppkit">'+esc(u.port)+'</text>';
    s+='<text x="'+(x+4)+'" y="152" class="ppsz">'+esc(u.sz[0])+'</text><text x="'+(x+4)+'" y="166" class="ppsz">'+esc(u.sz[1])+'</text>';
    s+='<text x="'+(x+4)+'" y="182" class="pplen">'+(u.L?pFmt(u.L)+' m':'')+'</text>';
    s+='<rect x="'+(x-38)+'" y="226" width="76" height="30" rx="5" class="ppbox"/><text x="'+x+'" y="245" text-anchor="middle" class="pptx">'+(k+1)+': '+esc(u.lab)+'</text>';
  });
  return s+'</svg>';
}
function pipeCalc(){
  var box = document.getElementById("pp_out_box"); if(!box) return;
  var D = PIPE[PS.sys], out = pNum(PS.out), U = PS.units, n = U.length, msg = [], ok = [], rows = [];
  var lab = function(m){ return pSL(D,m); };
  var idx = U.map(function(u){ return pIdx(D,u.m); }), tot = idx.reduce(function(a,b){return a+b;},0);
  var main = pPick(D.main, out).slice(1);
  var A = pNum(PS.A), H = pNum(PS.H), h2 = pNum(PS.h2), L = D.lim;
  var html = '<div class="small" style="margin:6px 0">Σύνολο εσωτερικών: <b>'+pFmt(tot)+'</b>'+(D.kw?' kW':D.brand==="Toshiba"?' HP':D.idx?' (δείκτης)':'')+((D.kw&&(D.outInput||D.outKW))||D.brand==="Toshiba"?' · εξωτερική '+esc(D.outLab(PS.out))+' · αναλογία '+Math.round(tot/(D.outKW?D.outKW(out):out)*100)+'%':'')+' · '+n+' μονάδες</div>';
  var hr = D.kind==="hr", star = D.kind==="bc" || (hr && PS.bsm==="multi"), runs = [], bsL = [], farC = 0;
  if(!star){
    // γραμμή: διακλάδωση k (0..n-2) εξυπηρετεί μονάδες k..n-1
    var segs = [], far = 0, afterMax = 0, total = A, run = 0;
    for(var k=0;k<n-1;k++){
      var down = idx.slice(k).reduce(function(a,b){return a+b;},0);
      var sz = k===0 ? main : pCap(pPick(D.branch, down).slice(1), main);
      var kit = k===0 ? (D.firstSame ? pPick(D.joint, down)[1] : pPick(D.first, out)[1]) : pPick(D.joint, down)[1];
      var Ls = k===0 ? A : pNum(U[k].s); if(k>0){ run += Ls; total += Ls; }
      segs.push({sz:sz, kit:kit, L:Ls, down:down}); runs.push([sz[0], Ls]); if(PCHG[PS.sys] && PCHG[PS.sys].jEq) runs.push([sz[0], PCHG[PS.sys].jEq]);
      rows.push([k===0?'Εξωτερική → 1η διακλάδωση':'Διακλάδωση '+k+' → '+(k+1), (k===0?'—':pFmt(down)), sz.join(" / "), kit, Ls]);
    }
    var minAfter = 1e9; var us = U.map(function(u,i){ var j = Math.min(i, n-2), b = pNum(u.b), base = 0;
      for(var q=1;q<=j;q++) base += pNum(U[q].s);
      total += b; far = Math.max(far, A+base+b); afterMax = Math.max(afterMax, base+b); minAfter = Math.min(minAfter, base+b);
      var sz = hr ? pPick(D.branch, idx[i]).slice(1) : pInd(D,u,idx[i]);
      var o = {lab:lab(u.m), sz:sz, L:b};
      if(hr){ o.bs = pPick(D.bs1, idx[i])[1]; o.sz2 = pInd(D,u,idx[i]); }
      runs.push([sz[0], b]); if(hr) bsL.push(o.bs);
      rows.push(['Διακλάδωση '+(j+1)+' → μονάδα '+(i+1)+(hr?' (3 σωλήνες ως το '+o.bs+', μετά 2)':''), pFmt(idx[i]), sz.join(" / ")+(hr?' → '+o.sz2.join(" / "):''), hr?o.bs:'—', b]);
      return o;
    });
    farC = far; html += '<div class="ppscroll">'+pSvgLine(D, segs, us, hr)+'</div>';
    html += pTable(D, rows, hr?['Υγρό','Αναρρόφηση','Υψ./χαμ.']:null);
    if(L){ pChk(msg, ok, far, L.L1, 'Πιο μακρινή εσωτερική από την εξωτερική (πραγματικό)', 'Ισοδύναμο ≤ '+L.L1eq+' m – πρόσθεσε τις καμπύλες.');
      var afL = (L.afterH && H > L.afterH[0]) ? L.afterH[1] : L.after;
      if(L.dL) pChk(msg, ok, afterMax-minAfter, L.dL, 'Διαφορά πιο μακρινής – πλησιέστερης εσωτερικής από την 1η διακλάδωση');
      if(afL==null){} else if(afterMax > afL) msg.push('⚠️ Μετά την 1η διακλάδωση: '+pFmt(afterMax)+' m > '+afL+' m'+(afL!==L.after?' (υψομετρική > '+L.afterH[0]+' m)':'')+'. '+(D.after90||'')); else ok.push('Μετά την 1η διακλάδωση: '+pFmt(afterMax)+' m ≤ '+afL+' m');
      if(L.indMax){ var bm = Math.max.apply(null, U.map(function(u){ return pNum(u.b); })); pChk(msg, ok, bm, L.indMax, 'Διακλάδωση → εσωτερική (μέγιστο)'); }
      if(L.total) pChk(msg, ok, total, L.total, 'Συνολικό μήκος σωληνώσεων'); }
    if(D.upAt && (D.upMain?A:far) >= D.upAt){ var mu = D.mainUp ? pPick(D.mainUp,out) : null; msg.push('⚠️ '+D.upNote+(!mu?'':mu.length>2?' Κύρια: υγρό '+mu[1]+' / αέριο '+mu[2]+' mm.':' Υγρό κύριας: '+mu[1]+' mm.')); }
    if(D.mainUpME && D.mainUpME[out] && far >= D.mainUpME[out][0]) msg.push('⚠️ PUHY-P'+out+': με πιο μακρινή εσωτερική ≥ '+D.mainUpME[out][0]+' m, υγρό κύριας (A) '+D.mainUpME[out][1]+' mm.');
  } else if(D.kind==="hr"){
    var ports = 0, pu = U.map(function(u,i){ var p = idx[i] > D.port.max ? 2 : 1, st = ports+1; ports += p; return {p:p, st:st}; });
    var bsm = null; D.bsm.forEach(function(b){ if(!bsm && b[1]>=ports && b[2]>=tot) bsm=b; });
    var Aobj = {sz:main, L:A}, far = 0, mx = 0, total = A;
    var us = U.map(function(u,i){ var b=pNum(u.b); total+=b; far=Math.max(far,A+b); mx=Math.max(mx,b);
      var sz = pPick(D.ind, +u.m).slice(1); runs.push([sz[0], b]);
      rows.push(['BS θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1):pu[i].st)+' → μονάδα '+(i+1), pFmt(idx[i]), sz.join(" / "), pu[i].p===2?'2 θύρες μαζί':'1 θύρα', b]);
      if(idx[i] > D.port.two) msg.push('⛔ Μονάδα '+(i+1)+': δείκτης '+pFmt(idx[i])+' > '+D.port.two+' – δεν συνδέεται σε multi BS.');
      return {lab:lab(u.m), sz:['Υ '+sz[0],'Α '+sz[1]], L:b, port:'θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1):pu[i].st)}; });
    runs.push([main[0], A]); if(bsm) bsL.push(bsm[0]); farC = far;
    rows.unshift(['Εξωτερική → BS (3 σωλήνες)', pFmt(tot), main.join(" / "), bsm?bsm[0]:'—', A]);
    html += '<div class="ppscroll">'+pSvgStar(D, Aobj, us, bsm?bsm[0]+' ('+ports+' θύρες)':'Χρειάζονται >1 BS')+'</div>';
    html += pTable(D, rows, ['Υγρό','Αναρρόφηση','Υψ./χαμ.']);
    if(!bsm) msg.push('⛔ '+ports+' θύρες / δείκτης '+pFmt(tot)+': δεν χωράνε σε ένα multi BS (ως 16 θύρες και 750). Το εργαλείο δεν σχεδιάζει ακόμα πολλά BS.');
    else ok.push(bsm[0]+': '+ports+'/'+bsm[1]+' θύρες, δείκτης '+pFmt(tot)+' ≤ '+bsm[2]+' · ως '+D.port.units+' εσωτερικές ανά θύρα, ≤'+D.port.max+' ανά θύρα (≤'+D.port.two+' με 2 θύρες μαζί)');
    pChk(msg, ok, far, L.L1, 'Πιο μακρινή εσωτερική από την εξωτερική (πραγματικό)', 'Ισοδύναμο ≤ '+L.L1eq+' m.');
    if(mx > L.after) msg.push('⚠️ BS → μονάδα '+pFmt(mx)+' m > '+L.after+' m. '+D.after90); else ok.push('BS → πιο μακρινή μονάδα: '+pFmt(mx)+' m ≤ '+L.after+' m');
    pChk(msg, ok, total, L.total, 'Συνολικό μήκος σωληνώσεων');
    if(far >= D.upAt) msg.push('⚠️ '+D.upNote+' Υγρό κύριας: '+pPick(D.mainUp,out)[1]+' mm.');
  } else {
    var ports = 0, big = false, pu = U.map(function(u){ var p = +u.m >= 200 ? 2 : 1; if(+u.m>=200) big=true; var st = ports+1; ports += p; return {p:p, st:st}; });
    var bc = null; D.bc.forEach(function(b){ if(!bc && b[1]>=ports) bc=b; });
    var far = 0, mx = 0;
    var us = U.map(function(u,i){ var b=pNum(u.b); far=Math.max(far,A+b); mx=Math.max(mx,b);
      var sz = pPick(D.ind, +u.m).slice(1); runs.push([sz[0], b]);
      rows.push(['BC θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1)+' (CMY-R160-J1)':pu[i].st)+' → μονάδα '+(i+1), 'P'+u.m, sz.join(" / "), pu[i].p===2?'2 θύρες + CMY-R160-J1':'1 θύρα', b]);
      return {lab:lab(u.m), sz:['Υ '+sz[0],'Α '+sz[1]], L:b, port:'θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1):pu[i].st)}; });
    runs.push([main[0], A, 'hp']); farC = far;
    rows.unshift(['Εξωτερική → BC (υψηλή / χαμηλή)', 'P'+pFmt(tot), main.join(" / "), bc?bc[0]:'—', A]);
    html += '<div class="ppscroll">'+pSvgStar(D, {sz:['Υψ '+main[0],'Χαμ '+main[1]], L:A}, us, bc?bc[0]+' ('+ports+' θύρες)':'>16 θύρες')+'</div>';
    html += pTable(D, rows, ['Υψηλή/Υγρό','Χαμηλή/Αέριο']);
    if(!bc) msg.push('⛔ '+ports+' θύρες: ξεπερνά ένα BC (16 θύρες). Χρειάζεται main + sub BC – δεν το σχεδιάζει ακόμα το εργαλείο.');
    else ok.push(bc[0]+': '+ports+'/'+bc[1]+' θύρες. Έλεγξε και τη μέγιστη δυναμικότητα του BC στο manual του.');
    pChk(msg, ok, A, L.A, 'Εξωτερική → BC');
    pChk(msg, ok, far, L.L1, 'Πιο μακρινή εσωτερική από την εξωτερική (πραγματικό)', 'Ισοδύναμο ≤ '+L.L1eq+' m.');
    var bcl = big ? L.bcFar : 60;
    if(mx > bcl) msg.push('⛔ BC → πιο μακρινή εσωτερική '+pFmt(mx)+' m > '+bcl+' m'+(big?' (με P200/P250 το όριο είναι 40 m)':'')+'.');
    else if(mx > L.bcFar) msg.push('⚠️ BC → πιο μακρινή '+pFmt(mx)+' m: πάνω από 40 m επιτρέπεται ως 60 m μόνο χωρίς P200/P250.');
    else ok.push('BC → πιο μακρινή εσωτερική: '+pFmt(mx)+' m ≤ '+L.bcFar+' m');
    var hbcL = big ? L.hbc200 : L.hbc; pChk(msg, ok, pNum(PS.hbc), hbcL, 'Υψομετρική εσωτερικής – BC'+(big?' (με P200/P250: 10 m)':''));
  }
  // υψομετρικές
  if(L){ var hl = PS.Hpos==="up" ? L.Hup : L.Hdown; pChk(msg, ok, H, hl, 'Υψομετρική εξωτ.–εσωτ. (εξωτερική '+(PS.Hpos==="up"?'πάνω':'κάτω')+')', D.hNote||'');
    var h2l = (D.kind==="bc" && U.some(function(u){return +u.m>=200;})) ? L.h2_200 : L.h2;
    if(h2l==null){} else if(h2 > h2l){ if(L.h2max && h2 <= L.h2max) msg.push('⚠️ Υψομετρική μεταξύ εσωτερικών '+pFmt(h2)+' m > '+h2l+' m. '+(D.h2Note||'Ως '+L.h2max+' m μόνο υπό τους όρους του manual (π.χ. μόνο εσωτερικές VRV DX, >20HP).')); else msg.push('⛔ Υψομετρική μεταξύ εσωτερικών '+pFmt(h2)+' m > '+(L.h2max||h2l)+' m.'); }
    else ok.push('Υψομετρική μεταξύ εσωτερικών: '+pFmt(h2)+' m ≤ '+h2l+' m');
  }
  if(!L && D.limNote) msg.push('ℹ️ '+D.limNote);
  else if(D.limNote) html += '<div class="small">ℹ️ '+esc(D.limNote)+'</div>';
  html += msg.map(function(m){ return '<div class="pver'+(m[0]==='⛔'?' bad':'')+'">'+esc(m)+'</div>'; }).join("");
  html += ok.length ? '<div class="pver good">✅ '+ok.map(esc).join('<br>✅ ')+'</div>' : '';
  html += pCharge(D, runs, {out:out, tot:tot, n:n, far:farC, idx:idx, bs:bsL});
  html += '<div class="small">Οι διατομές σε mm (εξωτερική διάμετρος). Τα μήκη είναι πραγματικά: για ισοδύναμο μήκος πρόσθεσε καμπύλες και κιτ διακλάδωσης όπως λέει το manual.</div>';
  box.innerHTML = html;
}
function pChk(msg, ok, v, lim, txt, extra){ if(lim==null) return; if(v > lim) msg.push('⛔ '+txt+': '+pFmt(v)+' m > '+lim+' m. '+(extra||'')); else ok.push(txt+': '+pFmt(v)+' m ≤ '+lim+' m'); }
function pTable(D, rows, cols){
  return '<div class="ppscroll"><table class="pptab"><tr><th>Τμήμα</th><th>Δυναμικότητα κάτω</th><th>Διατομές ('+esc((cols||D.pipes).join(" / "))+')</th><th>Κιτ / μονάδα</th><th>m</th></tr>'+
    rows.map(function(r){ return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td><b>'+esc(r[2])+'</b></td><td>'+esc(r[3])+'</td><td>'+(r[4]?pFmt(r[4]):'')+'</td></tr>'; }).join("")+'</table></div>';
}
document.addEventListener("change", function(e){ var t=e.target; if(!t.classList || !t.classList.contains("ppv")) return; pUpd(t, true); });
document.addEventListener("input", function(e){ var t=e.target; if(!t.classList || !t.classList.contains("ppv") || t.tagName==="SELECT") return; pUpd(t, false); });
function pUpd(t, re){
  if(t.dataset.pu!=null){ PS.units[+t.dataset.pu][t.dataset.pk] = t.value; }
  else { var k = t.id.replace("pp_",""); PS[k] = t.value; if(k==="sys"||k==="bsm"){ pFix(PIPE[PS.sys]); pSave(); pRerender(); return; } }
  pSave(); pipeCalc();
}
function pRerender(){ var w = document.getElementById("pp_out_box"); if(!w) return; var c = w.closest(".pcalcw"); if(!c) return; var d=document.createElement("div"); d.innerHTML=pipeForm(); c.replaceWith(d.firstChild); pipeCalc(); }
document.addEventListener("click", function(e){
  var a = e.target.closest("#pp_add"), d = e.target.closest("[data-pdel]");
  if(a){ var last = PS.units[PS.units.length-1]; PS.units.push({m:last?last.m:"40", s:"5", b:"6"}); pSave(); pRerender(); }
  else if(d){ PS.units.splice(+d.dataset.pdel,1); pSave(); pRerender(); }
});
// ===== Συμπληρωματικό φρέον (επίσημοι τύποι manuals) =====
var PCHG = {
 daikin_hp:{f:{22.2:.37,19.1:.26,15.9:.18,12.7:.12,9.5:.059,6.4:.022}, src:"Daikin 4P546220-1F, «To determine the additional refrigerant amount»", round:1,
  extra:function(c){ var r=[], h=c.out, cr=c.tot/(h*25)*100, col=h<=8?0:h<=14?1:2;
    var A = c.far<=30 ? (cr<=105?[0,.5,null]:[.5,1,null])[col] : (cr<=70?[0,.5,null]:cr<=85?[.3,.5,1]:cr<=105?[.7,1,1.5]:[1.2,1.5,2])[col];
    if(A==null) r.push(["A (μήκος ≤ 30 m, 16–20 HP)", null, "Ο πίνακας του manual δεν δίνει τιμή – δες το manual."]); else r.push(["A (μήκος "+(c.far<=30?"≤":">")+" 30 m, αναλογία "+Math.round(cr)+"%)", A]);
    if(h===8){ r.push(["C (8 HP, "+c.n+" εσωτερικές)", (cr>=100 && c.n>=4) ? +(c.n*0.1).toFixed(1) : 0]); }
    else r.push(["C", null, "Για "+h+" HP το C εφαρμόζεται με αναλογία ≥ 100% και ≥ "+(h/2)+" εσωτερικές: τιμή από το manual."]);
    r.push(["B (μόνο RYYQ)", null, "Αν η εξωτερική είναι RYYQ"+h+"U, πρόσθεσε "+({8:1.4,10:1.4,12:1.4,14:1.7,16:1.2,18:2.0,20:2.0}[h])+" kg. Για RXYQ: 0."]);
    return r; }, max:"Το συνολικό φορτίο του συστήματος πρέπει να είναι < 100 kg."},
 daikin_hr:{f:{22.2:.37,19.1:.26,15.9:.18,12.7:.12,9.5:.059,6.4:.022}, mul:1.04, src:"Daikin 4P546222-1D, «To determine the additional refrigerant amount»", round:1,
  extra:function(c){ var r=[], cr=c.tot/(c.out*25)*100;
    r.push(["A (αναλογία "+Math.round(cr)+"%)", cr>100?0.5:0]);
    r.push(["B (REYQ"+c.out+"U)", {8:0,10:0,12:0,14:1.3,16:1.4,18:4.7,20:4.8}[c.out]]);
    var bsC={BS1Q10A:.05,BS1Q16A:.1,BS1Q25A:.2,BS4Q14AV1B:.3,BS6Q14AV1B:.4,BS8Q14AV1B:.5,BS10Q14AV1B:.7,BS12Q14AV1B:.8,BS16Q14AV1B:1.1}, s=0;
    c.bs.forEach(function(b){ s+=bsC[b]||0; }); r.push(["C (BS: "+(c.bs.join(", ")||"—")+")", +s.toFixed(2)]);
    return r; }, max:"Το συνολικό φορτίο του συστήματος πρέπει να είναι < 100 kg."},
 me_y:{f:function(c){ return c.far<=30.5 ? {19.05:.29,15.88:.2,12.7:.12,9.52:.06,6.35:.024} : {19.05:.26,15.88:.18,12.7:.11,9.52:.054,6.35:.021}; },
  src:"Mitsubishi Electric data book MEE15K022 / installation manual PUHY-P-YLM, «Calculation of additional refrigerant charge»", round:1, up:true,
  fNote:function(c){ return "Συντελεστές για πιο μακρινή εσωτερική "+(c.far<=30.5?"≤":">")+" 30,5 m."; },
  extra:function(c){ var t=c.tot, a = t<=80?2:t<=160?2.5:t<=330?3:t<=390?3.5:t<=480?4.5:t<=630?5:t<=710?6:8;
    return [["Ποσότητα για τις εσωτερικές (σύνολο P"+t+")", a],["Ποσότητα μοντέλου εξωτερικής (P"+c.out+")", 0]]; },
  max:"Σε ορισμένες εσωτερικές (π.χ. PEFY-VMA3, PLFY-EP) το manual ζητά επιπλέον kg ανά μονάδα – γράψ' τα στο πεδίο «Πρόσθετα kg»."},
 me_r2:{f:function(c){ return c.far<=30.5 ? {liq:{15.88:.2,12.7:.12,9.52:.06,6.35:.024}, hp:{28.58:.36,22.2:.23,19.05:.16,15.88:.11}} : {liq:{15.88:.18,12.7:.11,9.52:.054,6.35:.021}, hp:{28.58:.33,22.2:.21,19.05:.14,15.88:.1}}; },
  src:"Mitsubishi Electric PURY-P-Y(S)LM-A1 service handbook / installation manual, «The amount of refrigerant to be added»", round:1, up:true,
  fNote:function(c){ return "Συντελεστές για πιο μακρινή εσωτερική "+(c.far<=30.5?"≤":">")+" 30,5 m. Η σωλήνα εξωτερική → BC μετράει με τη διατομή της υψηλής πίεσης."; },
  extra:function(c){ var t=c.tot, a = t<=80?2:t<=160?2.5:t<=330?3:t<=390?3.5:t<=480?4.5:t<=630?5:t<=710?6:8;
    return [["Ποσότητα για τις εσωτερικές (σύνολο P"+t+")", a],["BC controller και μοντέλο εξωτερικής (α)", null, "Οι ποσότητες α για το BC (CMB-P…V) και την εξωτερική είναι στο manual – γράψ' τες στο πεδίο «Πρόσθετα kg»."]]; }},
 samsung_dvm:{f:{6.35:.02,9.52:.06,12.7:.125,15.88:.18,19.05:.27,22.22:.35,25.4:.53,28.58:.65}, src:"Samsung DVM S2 technical data book, «Additional refrigerant» (ⓐ)", round:1,
  extra:function(c){ return [["ⓑ ποσότητα ανά εσωτερική", null, "Από τον πίνακα ⓑ του manual (ανά τύπο/απόδοση εσωτερικής) – γράψε το σύνολο στο πεδίο «Πρόσθετα kg»."]]; },
  max:"Το συνολικό φορτίο δεν πρέπει να ξεπερνά τα 100 kg. Με EEV kit: 0,01 kg/m στη σωλήνα EEV kit → εσωτερική, όποια διατομή κι αν είναι."},
 lg_multiv:{f:{25.4:.48,22.2:.354,19.05:.266,15.88:.173,12.7:.118,9.52:.061,6.35:.022}, src:"LG Multi V installation manual, «The amount of Refrigerant»", round:2,
  extra:function(c){ return [["CF εσωτερικών", null, "Άθροισε το CF κάθε εσωτερικής από τον πίνακα του manual της (π.χ. κασέτα 14,5 kW = 0,64 kg) και γράψ' το στο πεδίο «Πρόσθετα kg»."]]; }},
 toshiba_smms:{f:{6.4:.025,9.5:.055,12.7:.105,15.9:.16,19.1:.25,22.2:.35,25.4:.47}, src:"Toshiba MMY-MUP…HT8P-E installation manual, «Adding refrigerant» (Table 1, 2, 3-1, 4)", round:1, noNeg:true,
  extra:function(c){ var r=[], d=c.tot/c.out*100;
    r.push(["[1] Αντιστάθμιση συστήματος "+c.out+" HP", {8:1.5,10:1.7,12:2.3,14:2.3,16:1.0,18:2.0,20:4.0}[c.out]]);
    var s=0; c.idx.forEach(function(h){ s += h<=1.5?0.2:h<=3.2?0.4:h<=6?0.6:1.0; }); r.push(["[3] Διόρθωση εσωτερικών ("+c.n+")", +s.toFixed(1)]);
    r.push(["[4] Διόρθωση αναλογίας "+Math.round(d)+"%", d>=95?0:d>=90?-0.5:d>=80?-1:d>=70?-1.5:d>=60?-2:-2.5]);
    return r; }, max:"Αν το αποτέλεσμα βγει αρνητικό, δεν προσθέτεις φρέον. Fresh air (MMD-UP…HFP): διόρθωση 0."},
 gree_gmv6:{f:{6.35:.022,9.52:.054,12.7:.11,15.9:.17,19.05:.25,22.2:.35,25.4:.52,28.6:.68}, src:"Gree GMV6 owner's manual (H) GMV-WM, §3.7 Refrigerant charging (R = A + ΣB)", round:1,
  extra:function(c){ var C=c.tot/(c.out/10)*100, i=[224,280,335,400,450,504,560,615].indexOf(c.out), m=c.n>=4;
    var T = C<=70 ? (m?[.5,1,1,1,1,.5,1,1.5]:[0,0,0,0,0,0,0,0]) : C<=90 ? (m?[1,1,1,2,2,2.5,3,3.5]:[.5,1,1,2,2,1.5,2,2]) : C<=105 ? (m?[2,2,2,4,4,4,5,5]:[1,1,1,2,2,2.5,3,3.5]) : (m?[3.5,4,4,5,5,5.5,6,6]:[2,2,2,3,3,3.5,4,4]);
    return [["B (αναλογία "+Math.round(C)+"%, "+(m?"≥ 4":"< 4")+" εσωτερικές)", T[i]]]; },
  max:"Αν όλες οι εσωτερικές είναι fresh air, B = 0. Συνολικό φορτίο (εργοστασίου + πρόσθετο) ≤ όγκος μικρότερου χώρου × 0,44 kg/m³."},
 pana_me2:{f:{25.4:.49,22.22:.366,19.05:.259,15.88:.185,12.7:.128,9.52:.056,6.35:.026}, src:"Panasonic ECOi EX ME2 installation manual (Table 9, 10) · κατάλογος Panasonic (Ø25,4)", round:1,
  extra:function(c){ var v={8:5.5,10:5.5,12:7,14:7,16:7}[c.out];
    return [["Ποσότητα εξωτερικής U-"+c.out+"ME2", v==null?null:v, v==null?"Για "+c.out+" HP (συνδυασμός) δες το manual του συνδυασμού.":""]]; },
  max:"Με υπάρχουσες σωληνώσεις: αν το πρόσθετο ξεπερνά 50 kg (1 εξωτερική), άλλαξε διατομές."},
 midea_v6:{f:{6.35:.022,9.53:.057,12.7:.11,15.9:.17,19.1:.26,22.2:.36,25.4:.52,28.6:.68}, src:"Midea V6 8–32HP installation manual, §5.9 (ισοδύναμο μήκος υγρού, 0,5 m ανά διακλάδωση)", round:1, jEq:0.5,
  extra:function(c){ return []; }, max:"Το manual δεν έχει άλλη ποσότητα ανά εξωτερική ή εσωτερική."},
 hitachi_sf:{f:{28.58:.67,25.4:.52,22.2:.36,19.05:.26,15.88:.17,12.7:.11,9.52:.056,6.35:.024}, src:"Hitachi SET FREE RAS-FSXNSE/FSXNPE installation manual, «Calculating method of additional refrigerant charge» (W1, W2)", round:1,
  minW1:function(h){ var se = h<=10?2:h<=18?3:4, pe = h<=10?2:h<=14?3:h<=20?4:h===22?5:6; return h<8 ? [pe,"FSXNPE"] : se===pe ? [se,""] : [Math.max(se,pe), "FSXNSE "+se+" / FSXNPE "+pe+" kg – κράτησα το μεγαλύτερο"]; },
  extra:function(c){ var s=0, big=0; c.idx.forEach(function(h){ if(h<=1) s+=0.3; else if(h<=6) s+=0.5; else big++; });
    return [["W2 εσωτερικές ("+c.n+")", +s.toFixed(1), big?big+" εσωτερική(ές) > 6 HP: δεν υπάρχουν στον πίνακα W2 – δες το manual.":""]]; }},
 fujitsu_jiv:{f:{12.7:.114,9.52:.058,6.35:.021}, src:"Fujitsu AIRSTAGE AJ*126/144LELAH installation manual, §8.3.2", round:2, factory:11.0, totMax:25.6}
};
function pKey(F, d){ var x=parseFloat(d), b=null; Object.keys(F).forEach(function(k){ if(Math.abs(parseFloat(k)-x)<0.25) b=k; }); return b; }
function pCharge(D, runs, c){
  var C = PCHG[PS.sys]; if(!C) return '';
  var F = typeof C.f==="function" ? C.f(c) : C.f, hpF = F.hp, liqF = F.liq || F;
  var agg = {}, miss = 0, unk = [];
  runs.forEach(function(r){ if(!r[1]) return; var tbl = r[2]==="hp" ? hpF : liqF, k = r[0] && pKey(tbl, r[0]);
    if(!k){ miss += r[1]; if(unk.indexOf(r[0])<0) unk.push(r[0]); return; }
    var id = (r[2]==="hp"?"hp":"l")+k; agg[id] = agg[id] || {d:k, L:0, f:tbl[k], hp:r[2]==="hp"}; agg[id].L += r[1]; });
  var rows = Object.keys(agg).map(function(k){ return agg[k]; }).sort(function(a,b){ return b.hp-a.hp || b.d-a.d; });
  var sumP = 0; rows.forEach(function(r){ sumP += r.L*r.f; });
  if(C.mul) sumP *= C.mul;
  var h = '<div class="lbl" style="margin-top:10px">🧪 Συμπληρωματικό φρέον (R410A)</div><div class="ppscroll"><table class="pptab"><tr><th>Σωλήνα '+(F.hp?'':'υγρού ')+'Ø</th><th>m</th><th>kg/m</th><th>kg</th></tr>';
  rows.forEach(function(r){ h += '<tr><td>'+(r.hp?'Υψ. πίεση ':'Υγρό ')+esc(String(r.d))+'</td><td>'+pFmt(r.L)+'</td><td>'+String(r.f).replace(".",",")+'</td><td>'+pFmt(r.L*r.f)+'</td></tr>'; });
  if(C.mul) h += '<tr><td colspan="3">× '+String(C.mul).replace(".",",")+' (συντελεστής manual)</td><td>'+pFmt(sumP)+'</td></tr>';
  if(C.minW1){ var mw = C.minW1(c.out); if(sumP < mw[0]){ h += '<tr><td colspan="3">Ελάχιστο W1 για '+c.out+' HP'+(mw[1]?' ('+esc(mw[1])+')':'')+'</td><td>'+pFmt(mw[0])+'</td></tr>'; sumP = mw[0]; } }
  var tot = sumP, notes = [];
  (C.extra ? C.extra(c) : []).forEach(function(e){ if(e[1]==null){ h += '<tr><td colspan="3">'+esc(e[0])+'</td><td>?</td></tr>'; if(e[2]) notes.push(e[2]); } else { tot += e[1]; h += '<tr><td colspan="3">'+esc(e[0])+'</td><td>'+pFmt(e[1])+'</td></tr>'; if(e[2]) notes.push(e[2]); } });
  var xk = pNum(PS.xkg); if(xk){ tot += xk; h += '<tr><td colspan="3">Πρόσθετα kg (από εσένα)</td><td>'+pFmt(xk)+'</td></tr>'; }
  if(C.noNeg && tot<0) { notes.push("Βγήκε αρνητικό: δεν προσθέτεις φρέον."); tot = 0; }
  var mult = Math.pow(10, C.round||1), shown = (C.up ? Math.ceil(tot*mult-1e-9) : Math.round(tot*mult))/mult;
  h += '<tr><td colspan="3"><b>Σύνολο συμπληρωματικού'+(miss?' (χωρίς '+pFmt(miss)+' m)':'')+'</b></td><td><b>'+pFmt(shown)+' kg</b></td></tr></table></div>';
  if(C.factory){ var all = shown + C.factory; notes.unshift('Εργοστασιακό '+pFmt(C.factory)+' kg + πρόσθετο = '+pFmt(all)+' kg '+(all<=C.totMax?'≤':'>')+' '+pFmt(C.totMax)+' kg'+(all<=C.totMax?' ✅':' ⛔')); }
  if(miss) notes.unshift('⚠️ '+pFmt(miss)+' m σωλήνα προς εσωτερικές δεν έχουν γνωστή διατομή ('+unk.map(String).join(", ")+'). Πρόσθεσε μήκος × kg/m της διατομής σύνδεσης κάθε εσωτερικής.');
  if(C.fNote) notes.unshift(C.fNote(c));
  if(C.max) notes.push(C.max);
  h += notes.map(function(n){ return '<div class="small">• '+esc(n)+'</div>'; }).join('');
  h += '<div class="small">Πηγή: '+esc(C.src)+'. Τα μήκη είναι όσα έγραψες (πραγματικά). Στρογγυλοποίηση όπως το manual.</div>';
  return h;
}
