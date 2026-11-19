// ===== Σωληνόγραμμα VRF / VRF HR =====
var PS = (function(){ try{ return JSON.parse(localStorage.getItem("vl_pipe")||"null"); }catch(e){ return null; } })() || {sys:"daikin_hp", out:"10", A:"20", H:"5", Hpos:"up", h2:"3", bsm:"multi", hbc:"3", units:[{m:"63",s:"",b:"8"},{m:"40",s:"6",b:"6"},{m:"40",s:"",b:"7"}]};
function pSave(){ try{ localStorage.setItem("vl_pipe", JSON.stringify(PS)); }catch(e){} }
function pNum(v){ var n=parseFloat(String(v||"").replace(",",".")); return isNaN(n)?0:n; }
function pPick(tbl, x){ var lt=tbl.lt, rows=tbl.rows||tbl; for(var i=0;i<rows.length;i++){ if(lt ? x<rows[i][0] : x<=rows[i][0]) return rows[i]; } return rows[rows.length-1]; }
function pIdx(D, m){ m=+m; return D.idx ? (D.idx[m]!=null?D.idx[m]:m) : m; }
function pFmt(n){ return (Math.round(n*100)/100).toString().replace(".",","); }
function pCap(sz, mx){ // μην ξεπερνάς την κύρια διατομή
  return sz.map(function(v,i){ return (mx && mx[i] && parseFloat(v)>parseFloat(mx[i])) ? mx[i] : v; });
}
function pipeForm(){
  var D = PIPE[PS.sys] || PIPE.daikin_hp;
  if(D.outs.map(String).indexOf(String(PS.out))<0) PS.out = String(D.outs[0]);
  var o = function(v,l,s){ return '<option value="'+esc(v)+'"'+(String(s)===String(v)?' selected':'')+'>'+esc(l)+'</option>'; };
  var h = '<div class="pcalcw"><div class="lbl">🧭 Σωληνόγραμμα</div>';
  h += '<label class="small">Σειρά<select id="pp_sys" class="ppv">'+Object.keys(PIPE).map(function(k){ return o(k, PIPE[k].name, PS.sys); }).join("")+'</select></label>';
  h += '<div class="row2"><label class="small">Εξωτερική<select id="pp_out" class="ppv">'+D.outs.map(function(x){ return o(x, D.outLab(x), PS.out); }).join("")+'</select></label>';
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
      '<label class="small">Μέγεθος<select class="ppv" data-pu="'+i+'" data-pk="m">'+D.models.map(function(m){ return o(m, (D.brand==="Daikin"?"κλάση ":"P")+m, u.m); }).join("")+'</select></label>'+
      (star?'':'<label class="small">Γραμμή από προηγ. διακλάδωση (m)<input class="ppv" data-pu="'+i+'" data-pk="s" inputmode="decimal" value="'+esc(segOn?u.s:"")+'"'+(segOn?'':' disabled placeholder="—"')+'></label>')+
      '<label class="small">'+(star?(D.kind==="bc"?'BC → μονάδα (m)':'BS → μονάδα (m)'):'Διακλάδωση → μονάδα (m)')+'<input class="ppv" data-pu="'+i+'" data-pk="b" inputmode="decimal" value="'+esc(u.b)+'"></label>'+
      (n>2?'<button class="mini" data-pdel="'+i+'" aria-label="Αφαίρεση">✕</button>':'')+'</div>';
  });
  h += '</div><button class="mini" id="pp_add">+ εσωτερική</button>';
  h += '<div class="small" style="margin-top:6px">ℹ️ '+esc(D.idxNote)+'</div>';
  h += '<div id="pp_out_box"></div><div class="small" style="margin-top:6px">Πηγή: '+esc(D.src)+'</div></div>';
  return h;
}
function pSvgLine(D, segs, units, hr){
  var n=units.length, W=Math.max(360, 170+n*130), Hh=hr?230:200, s='';
  s+='<svg class="ppsvg" viewBox="0 0 '+W+' '+Hh+'" width="'+W+'" height="'+Hh+'" xmlns="http://www.w3.org/2000/svg" font-size="11" font-family="system-ui,sans-serif">';
  s+='<rect x="6" y="40" width="70" height="44" rx="6" class="ppbox"/><text x="41" y="60" text-anchor="middle" class="pptx">Εξωτ.</text><text x="41" y="75" text-anchor="middle" class="pptx">'+esc(D.outLab(PS.out).split(" ")[0])+'</text>';
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
  s+='<rect x="10" y="8" width="96" height="34" rx="6" class="ppbox"/><text x="58" y="30" text-anchor="middle" class="pptx">'+esc(D.outLab(PS.out).split(" ")[0])+'</text>';
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
  var D = PIPE[PS.sys], out = +PS.out, U = PS.units, n = U.length, msg = [], ok = [], rows = [];
  var lab = function(m){ return (D.brand==="Daikin"?"":"P")+m; };
  var idx = U.map(function(u){ return pIdx(D,u.m); }), tot = idx.reduce(function(a,b){return a+b;},0);
  var main = pPick(D.main, out).slice(1);
  var A = pNum(PS.A), H = pNum(PS.H), h2 = pNum(PS.h2), L = D.lim;
  var html = '<div class="small" style="margin:6px 0">Σύνολο εσωτερικών: <b>'+pFmt(tot)+'</b>'+(D.idx?' (δείκτης)':'')+' · '+n+' μονάδες</div>';
  var hr = D.kind==="hr", star = D.kind==="bc" || (hr && PS.bsm==="multi");
  if(!star){
    // γραμμή: διακλάδωση k (0..n-2) εξυπηρετεί μονάδες k..n-1
    var segs = [], far = 0, afterMax = 0, total = A, run = 0;
    for(var k=0;k<n-1;k++){
      var down = idx.slice(k).reduce(function(a,b){return a+b;},0);
      var sz = k===0 ? main : pCap(pPick(D.branch, down).slice(1), main);
      var kit = k===0 ? (D.firstSame ? pPick(D.joint, down)[1] : pPick(D.first, out)[1]) : pPick(D.joint, down)[1];
      var Ls = k===0 ? A : pNum(U[k].s); if(k>0){ run += Ls; total += Ls; }
      segs.push({sz:sz, kit:kit, L:Ls, down:down});
      rows.push([k===0?'Εξωτερική → 1η διακλάδωση':'Διακλάδωση '+k+' → '+(k+1), (k===0?'—':pFmt(down)), sz.join(" / "), kit, Ls]);
    }
    var us = U.map(function(u,i){ var j = Math.min(i, n-2), b = pNum(u.b), base = 0;
      for(var q=1;q<=j;q++) base += pNum(U[q].s);
      total += b; far = Math.max(far, A+base+b); afterMax = Math.max(afterMax, base+b);
      var sz = hr ? pPick(D.branch, idx[i]).slice(1) : pPick(D.ind, +u.m).slice(1);
      var o = {lab:lab(u.m), sz:sz, L:b};
      if(hr){ o.bs = pPick(D.bs1, idx[i])[1]; o.sz2 = pPick(D.ind, +u.m).slice(1); }
      rows.push(['Διακλάδωση '+(j+1)+' → μονάδα '+(i+1)+(hr?' (3 σωλήνες ως το '+o.bs+', μετά 2)':''), pFmt(idx[i]), sz.join(" / ")+(hr?' → '+o.sz2.join(" / "):''), hr?o.bs:'—', b]);
      return o;
    });
    html += '<div class="ppscroll">'+pSvgLine(D, segs, us, hr)+'</div>';
    html += pTable(D, rows, hr?['Υγρό','Αναρρόφηση','Υψ./χαμ.']:null);
    if(L){ pChk(msg, ok, far, L.L1, 'Πιο μακρινή εσωτερική από την εξωτερική (πραγματικό)', 'Ισοδύναμο ≤ '+L.L1eq+' m – πρόσθεσε τις καμπύλες.');
      if(afterMax > L.after) msg.push('⚠️ Μετά την 1η διακλάδωση: '+pFmt(afterMax)+' m > '+L.after+' m. '+(D.after90||'')); else ok.push('Μετά την 1η διακλάδωση: '+pFmt(afterMax)+' m ≤ '+L.after+' m');
      if(L.total) pChk(msg, ok, total, L.total, 'Συνολικό μήκος σωληνώσεων'); }
    if(D.upAt && far >= D.upAt) msg.push('⚠️ '+D.upNote+' Υγρό κύριας: '+pPick(D.mainUp,out)[1]+' mm.');
    if(D.mainUpME && D.mainUpME[out] && far >= D.mainUpME[out][0]) msg.push('⚠️ PUHY-P'+out+': με πιο μακρινή εσωτερική ≥ '+D.mainUpME[out][0]+' m, υγρό κύριας (A) '+D.mainUpME[out][1]+' mm.');
  } else if(D.kind==="hr"){
    var ports = 0, pu = U.map(function(u,i){ var p = idx[i] > D.port.max ? 2 : 1, st = ports+1; ports += p; return {p:p, st:st}; });
    var bsm = null; D.bsm.forEach(function(b){ if(!bsm && b[1]>=ports && b[2]>=tot) bsm=b; });
    var Aobj = {sz:main, L:A}, far = 0, mx = 0, total = A;
    var us = U.map(function(u,i){ var b=pNum(u.b); total+=b; far=Math.max(far,A+b); mx=Math.max(mx,b);
      var sz = pPick(D.ind, +u.m).slice(1);
      rows.push(['BS θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1):pu[i].st)+' → μονάδα '+(i+1), pFmt(idx[i]), sz.join(" / "), pu[i].p===2?'2 θύρες μαζί':'1 θύρα', b]);
      if(idx[i] > D.port.two) msg.push('⛔ Μονάδα '+(i+1)+': δείκτης '+pFmt(idx[i])+' > '+D.port.two+' – δεν συνδέεται σε multi BS.');
      return {lab:lab(u.m), sz:['Υ '+sz[0],'Α '+sz[1]], L:b, port:'θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1):pu[i].st)}; });
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
      var sz = pPick(D.ind, +u.m).slice(1);
      rows.push(['BC θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1)+' (CMY-R160-J1)':pu[i].st)+' → μονάδα '+(i+1), 'P'+u.m, sz.join(" / "), pu[i].p===2?'2 θύρες + CMY-R160-J1':'1 θύρα', b]);
      return {lab:lab(u.m), sz:['Υ '+sz[0],'Α '+sz[1]], L:b, port:'θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1):pu[i].st)}; });
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
    if(h2 > h2l){ if(L.h2max && h2 <= L.h2max) msg.push('⚠️ Υψομετρική μεταξύ εσωτερικών '+pFmt(h2)+' m > '+h2l+' m. '+(D.h2Note||'Ως '+L.h2max+' m μόνο υπό τους όρους του manual (π.χ. μόνο εσωτερικές VRV DX, >20HP).')); else msg.push('⛔ Υψομετρική μεταξύ εσωτερικών '+pFmt(h2)+' m > '+(L.h2max||h2l)+' m.'); }
    else ok.push('Υψομετρική μεταξύ εσωτερικών: '+pFmt(h2)+' m ≤ '+h2l+' m');
  }
  if(!L && D.limNote) msg.push('ℹ️ '+D.limNote);
  else if(D.limNote) html += '<div class="small">ℹ️ '+esc(D.limNote)+'</div>';
  html += msg.map(function(m){ return '<div class="pver'+(m[0]==='⛔'?' bad':'')+'">'+esc(m)+'</div>'; }).join("");
  html += ok.length ? '<div class="pver good">✅ '+ok.map(esc).join('<br>✅ ')+'</div>' : '';
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
  else { var k = t.id.replace("pp_",""); PS[k] = t.value; if(k==="sys"||k==="bsm"){ pSave(); pRerender(); return; } }
  pSave(); pipeCalc();
}
function pRerender(){ var w = document.getElementById("pp_out_box"); if(!w) return; var c = w.closest(".pcalcw"); if(!c) return; var d=document.createElement("div"); d.innerHTML=pipeForm(); c.replaceWith(d.firstChild); pipeCalc(); }
document.addEventListener("click", function(e){
  var a = e.target.closest("#pp_add"), d = e.target.closest("[data-pdel]");
  if(a){ var last = PS.units[PS.units.length-1]; PS.units.push({m:last?last.m:"40", s:"5", b:"6"}); pSave(); pRerender(); }
  else if(d){ PS.units.splice(+d.dataset.pdel,1); pSave(); pRerender(); }
});
