// ===== Σωληνόγραμμα VRF / VRF HR – ελεύθερο σχέδιο (δέντρο) =====
var PS = (function(){ try{ return JSON.parse(localStorage.getItem("vl_pipe")||"null"); }catch(e){ return null; } })() || {sys:"daikin_hp", out:"10", A:"20", H:"5", Hpos:"up", h2:"3", bsm:"multi", hbc:"3", unit:"kw"};
function pSave(){ try{ var c = JSON.parse(JSON.stringify(PS)); delete c.sel; localStorage.setItem("vl_pipe", JSON.stringify(c)); }catch(e){} }
function pNum(v){ var n=parseFloat(String(v==null?"":v).replace(",",".")); return isNaN(n)?0:n; }
function pPick(tbl, x){ var lt=tbl.lt, rows=tbl.rows||tbl; for(var i=0;i<rows.length;i++){ if(lt ? x<rows[i][0] : x<=rows[i][0]) return rows[i]; } return rows[rows.length-1]; }
function pIdx(D, m){ m=+m; return D.idx ? (D.idx[m]!=null?D.idx[m]:m) : m; }
function pFmt(n){ return (Math.round(n*100)/100).toString().replace(".",","); }
function pCap(sz, mx){ return sz.map(function(v,i){ return (mx && mx[i] && parseFloat(v)>parseFloat(mx[i])) ? mx[i] : v; }); }
// --- kW / BTU ---
var BTU = 3412.14;
function pBtuTxt(kw){ var b = Math.round(kw*BTU/100)*100; return String(b).replace(/\B(?=(\d{3})+(?!\d))/g,".")+" BTU/h"; }
var KWOF_IX = {15:1.7,20:2.2,25:2.8,32:3.6,40:4.5,50:5.6,63:7.1,71:8,80:9,100:11.2,125:14,140:16,200:22.4,250:28};
var KWOF_TO = {9:2.8,12:3.6,15:4.5,18:5.6,24:7.1,27:8,30:9,36:11.2,48:14,56:16,72:22.4,96:28};
var KWOF_HI = {1:2.8,1.5:4,2:5.6,2.5:7.1,3:8,4:11.2,5:14,6:16,8:22.4,10:28};
var KWOF_HP = {5:14,6:16,8:22.4,10:28,12:33.5,14:40,16:45,18:50,20:56,22:61.5,24:67};
function pKwOf(D, m){ m=+m; if(D.kw) return m; if(D.kwOf) return D.kwOf(m); var t = D.brand==="Toshiba"?KWOF_TO : D.brand==="Hitachi"?KWOF_HI : KWOF_IX; return t[m]; }
function pOutKw(D, o){ o=+o; if(D.outInput) return o; if(D.outKW) return D.outKW(o); if(D.brand==="Mitsubishi Electric") return {200:22.4,250:28,300:33.5,350:40,400:45,450:50,500:56}[o]; return KWOF_HP[o]; }
var BTU_LIST = [5000,7000,9000,12000,15000,18000,21000,24000,28000,30000,36000,42000,48000,54000,60000,76000,96000];
function pModels(D){ if(D.kw && PS.unit==="btu"){ var mx = Math.max.apply(null, D.models)*1.05; return BTU_LIST.map(function(b){ return Math.round(b/BTU*100)/100; }).filter(function(k){ return k<=mx; }); } return D.models; }
function pML(D,m){ var k = pKwOf(D,m);
  if(D.kw) return PS.unit==="btu" ? pBtuTxt(+m)+" ("+pFmt(+m)+" kW)" : pFmt(+m)+" kW";
  var base = D.mLab ? D.mLab(m) : (D.brand==="Daikin"?"κλάση ":"P")+m;
  return base + (k ? (PS.unit==="btu" ? " ≈ "+pBtuTxt(k) : " ≈ "+pFmt(k)+" kW") : ""); }
function pCapLab(D,m){ var k = pKwOf(D,m), bt = function(x){ return String(Math.round(x*BTU/100)*100).replace(/\B(?=(\d{3})+(?!\d))/g,"."); };
  if(D.kw) return PS.unit==="btu" ? [bt(+m)+" BTU", pFmt(+m)+" kW"] : [pFmt(+m)+" kW", bt(+m)+" BTU"];
  var base = D.mLab ? D.mLab(m) : (D.brand==="Daikin"?"κλάση ":"P")+m; return [base, k ? (PS.unit==="btu" ? "≈ "+bt(k)+" BTU" : "≈ "+pFmt(k)+" kW") : ""]; }
function pSL(D,m){ if(D.kw) return PS.unit==="btu" ? String(Math.round(+m*BTU/1000))+"k" : pFmt(+m); return D.sLab ? D.sLab(m) : (D.brand==="Daikin"?"":"P")+m; }
function pOL(D,o){ var k = pOutKw(D,o), l = D.outLab(o); if(PS.unit==="btu" && k) l += (D.outInput||D.outKW?" · ":" ≈ ")+pBtuTxt(k); return l; }
function pInd(D,u,ix){ return D.ind ? pPick(D.ind, D.indByIdx ? ix : +u.m).slice(1) : (D.indTxt||['—','—']); }
function pStar(D){ return D.kind==="bc" || (D.kind==="hr" && PS.bsm==="multi" && !D.bsSingle); }
function pDm(D){ return D.dm ? D.dm : D.kw ? [5.6,3.6,2.8] : D.brand==="Toshiba" ? [18,12,9] : D.brand==="Hitachi" ? [2,1.5,1] : [63,40,40]; }

// --- ίντσες ---
var INCH = [[6.35,"1/4"],[9.52,"3/8"],[12.7,"1/2"],[15.88,"5/8"],[19.05,"3/4"],[22.22,"7/8"],[25.4,"1"],[28.58,"1-1/8"],[31.75,"1-1/4"],[34.92,"1-3/8"],[38.1,"1-1/2"],[41.28,"1-5/8"],[44.45,"1-3/4"],[50.8,"2"],[53.98,"2-1/8"]];
function pD(v){ if(PS.inch!=="in") return String(v); var x = parseFloat(v); if(isNaN(x)) return String(v); for(var i=0;i<INCH.length;i++) if(Math.abs(INCH[i][0]-x)<0.3) return INCH[i][1]+'"'; return String(v); }
function pSzJ(a){ return a.map(pD).join(" / "); }
function pSzS(a){ return a.map(function(v){ var x = pD(v); return /^[0-9.]+$/.test(x) ? "Ø"+x : x; }).join("/"); }
function pLet(i, up){ var a = "abcdefghijklmnopqrstuvwxyz", r = a[i%26] + (i>=26 ? Math.floor(i/26) : ""); return up ? r.toUpperCase() : r; }
// --- τύποι εσωτερικών ---
var PTY = [["wall","Τοίχου"],["cas4","Κασέτα 4 δρόμων"],["duct","Καναλάτο"],["ceil","Οροφής / δαπέδου"],["cons","Κονσόλα δαπέδου"]];
var PST = [["low","χαμηλής στατικής"],["mid","μέσης στατικής"],["high","υψηλής στατικής"]];
function pStName(k){ for(var i=0;i<PST.length;i++) if(PST[i][0]===k) return PST[i][1]; return "μέσης στατικής"; }
function pUnitName(u){ var t = u.ty==="cas1" ? "cas4" : (u.ty||"wall"); return pTyName(t) + (t==="duct" ? " "+pStName(u.st) : ""); }
// εύρος αποδόσεων ανά τύπο εσωτερικής – μόνο από επίσημους καταλόγους (σε μονάδες του μοντέλου: κλάση Daikin / P Mitsubishi)
var PCAPS = {
 "Daikin": {src:"Daikin VRV indoor unit overview (κατάλογος VRV 5 ECPEN25-213)", wall:[15,20,25,32,40,50,63], cas4:[15,20,25,32,40,50,63,80,100,125], duct_low:[15,20,25,32,40,50,63], duct_mid:[15,20,25,32,40,50,63,80,100,125,140], duct_high:[50,63,80,100,125,200,250], ceil:[32,50,63,71,100], cons:[20,25,32,40,50,63]},
 "Mitsubishi Electric": {src:"Mitsubishi Electric City Multi indoor units (PKFY, PLFY, PEFY VMS1/VMA/VMHS, PCFY, PFFY)", wall:[15,100], cas4:[15,140], duct_low:[15,63], duct_mid:[20,140], duct_high:[40,250], ceil:[40,125], cons:[20,63]}
};
function pTyKey(u){ var t = (u && u.ty==="cas1") ? "cas4" : ((u && u.ty) || "wall"); return t==="duct" ? "duct_"+((u && u.st) || "mid") : t; }
function pUrows(D, u){ var P = typeof PUNIT!=="undefined" && PUNIT[D.brand]; return (P && u && P[pTyKey(u)]) || null; }
function pUinfo(D, u){ var R = pUrows(D,u); if(!R) return null; for(var i=0;i<R.length;i++) if(Math.abs(R[i][0]-pNum(u.m))<0.01) return R[i]; return null; }
function pUtxt(r){ return r[1]+' · '+r[2]+'×'+r[3]+'×'+r[4]+' mm (Π×Υ×Β)'+(r[5]!=null?' · '+String(r[5]).replace(".",",")+' kg':'')+(r[6]?' · αέρας ως '+Math.round(r[6])+' m³/h':'')+(r[7]!=null?' · στατική ως '+r[7]+' Pa':'')+(r[8]?' · '+r[8]:''); }
function pModelsFor(D, u){ var R = pUrows(D,u); if(R) return R.map(function(r){ return r[0]; });
  var all = pModels(D), C = D.caps || PCAPS[D.brand]; if(!C || !u) return all; var r = C[pTyKey(u)]; if(!r) return all;
  var f = all.filter(function(m){ return r.length>2 ? r.some(function(x){ return Math.abs(+m-x)<0.01; }) : (+m >= r[0]-0.01 && +m <= r[1]+0.01); }); return f.length ? f : all; }
function pFitModel(D, u){ var ms = pModelsFor(D, u).map(String); if(ms.indexOf(String(u.m))>=0) return; var v = pNum(u.m), b = ms[0]; ms.forEach(function(x){ if(Math.abs(+x-v) < Math.abs(+b-v)) b = x; }); u.m = b; }
var PSIZES = [6.35,9.52,12.7,15.88,19.05,22.22,25.4,28.58,31.75,34.92,38.1,41.28,44.45,53.98];
function pTyName(k){ k = k || "wall"; for(var i=0;i<PTY.length;i++) if(PTY[i][0]===k) return PTY[i][1]; return "Εσωτερική"; }
function pIco(k, x, y, w){ // σχέδιο εικονιδίου σε κουτί w×(w*0.6)
  var h = w*0.6, s = '', st = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"';
  if(k==="wall"){ s += '<rect x="'+x+'" y="'+(y+h*0.15)+'" width="'+w+'" height="'+h*0.55+'" rx="'+h*0.15+'" '+st+'/><path d="M'+(x+w*0.12)+' '+(y+h*0.55)+' H'+(x+w*0.88)+'" '+st+'/><path d="M'+(x+w*0.25)+' '+(y+h*0.82)+' l-'+w*0.04+' '+h*0.14+' M'+(x+w*0.5)+' '+(y+h*0.82)+' v'+h*0.16+' M'+(x+w*0.75)+' '+(y+h*0.82)+' l'+w*0.04+' '+h*0.14+'" '+st+'/>'; }
  else if(k==="cas4"){ var q = Math.min(w,h); var cx = x+w/2-q/2; s += '<rect x="'+cx+'" y="'+y+'" width="'+q+'" height="'+q+'" rx="2" '+st+'/><rect x="'+(cx+q*0.3)+'" y="'+(y+q*0.3)+'" width="'+q*0.4+'" height="'+q*0.4+'" '+st+'/><path d="M'+(cx+q*0.15)+' '+(y+q*0.12)+' H'+(cx+q*0.85)+' M'+(cx+q*0.15)+' '+(y+q*0.88)+' H'+(cx+q*0.85)+' M'+(cx+q*0.12)+' '+(y+q*0.15)+' V'+(y+q*0.85)+' M'+(cx+q*0.88)+' '+(y+q*0.15)+' V'+(y+q*0.85)+'" '+st+'/>'; }
  else if(k==="cas1"){ s += '<rect x="'+x+'" y="'+(y+h*0.2)+'" width="'+w+'" height="'+h*0.6+'" rx="2" '+st+'/><path d="M'+(x+w*0.12)+' '+(y+h*0.62)+' H'+(x+w*0.88)+'" '+st+'/><rect x="'+(x+w*0.35)+'" y="'+(y+h*0.3)+'" width="'+w*0.3+'" height="'+h*0.2+'" '+st+'/>'; }
  else if(k==="duct"){ s += '<path d="M'+x+' '+(y+h*0.25)+' H'+(x+w*0.7)+' V'+(y+h*0.85)+' H'+x+' Z" '+st+'/><path d="M'+(x+w*0.7)+' '+(y+h*0.35)+' H'+(x+w)+' M'+(x+w*0.7)+' '+(y+h*0.75)+' H'+(x+w)+'" '+st+'/><path d="M'+(x+w*0.12)+' '+(y+h*0.45)+' H'+(x+w*0.58)+' M'+(x+w*0.12)+' '+(y+h*0.65)+' H'+(x+w*0.58)+'" '+st+'/>'; }
  else if(k==="ceil"){ s += '<rect x="'+x+'" y="'+(y+h*0.3)+'" width="'+w+'" height="'+h*0.4+'" rx="'+h*0.12+'" '+st+'/><path d="M'+(x+w*0.1)+' '+(y+h*0.6)+' H'+(x+w*0.9)+' M'+(x+w*0.3)+' '+(y+h*0.82)+' v'+h*0.15+' M'+(x+w*0.7)+' '+(y+h*0.82)+' v'+h*0.15+'" '+st+'/>'; }
  else if(k==="cons"){ s += '<rect x="'+(x+w*0.25)+'" y="'+y+'" width="'+w*0.5+'" height="'+h+'" rx="2" '+st+'/><path d="M'+(x+w*0.32)+' '+(y+h*0.2)+' H'+(x+w*0.68)+' M'+(x+w*0.32)+' '+(y+h*0.8)+' H'+(x+w*0.68)+'" '+st+'/>'; }
  else if(k==="j"){ s += '<path d="M'+x+' '+(y+h/2)+' H'+(x+w*0.45)+' L'+(x+w)+' '+(y+h*0.1)+' M'+(x+w*0.45)+' '+(y+h/2)+' L'+(x+w)+' '+(y+h*0.9)+'" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'; }
  else if(k==="h"){ s += '<path d="M'+x+' '+(y+h*0.3)+' H'+(x+w)+' M'+(x+w*0.15)+' '+(y+h*0.3)+' v'+h*0.55+' M'+(x+w*0.38)+' '+(y+h*0.3)+' v'+h*0.55+' M'+(x+w*0.62)+' '+(y+h*0.3)+' v'+h*0.55+' M'+(x+w*0.85)+' '+(y+h*0.3)+' v'+h*0.55+'" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'; }
  return s;
}
function pIcoBtn(k){ return '<svg viewBox="0 0 40 24" width="40" height="24" style="display:block;margin:0 auto 3px">'+pIco(k,2,0,36)+'</svg>'; }
// --- κολεκτέρ (header): μόνο όπου υπάρχει επίσημος πίνακας ---
var PHDR = {
 hitachi_sf: function(dn, k){ if(k<=4 && dn<=8) return "E-102SN4 (4 κλάδοι)"; if(k<=8 && dn<=10) return "E-162SN4 (8 κλάδοι)"; return null; },
 fujitsu_jiv: function(dn, k){ if(k>8) return null; return dn<=28 ? (k<=6?"UTR-H0906L":"UTR-H0908L") : (k<=6?"UTR-H1806L":"UTR-H1808L"); },
 gree_gmv6: function(dn){ return dn<=40 ? "FQ14/H1" : dn<=68 ? "FQ18/H1" : "FQ18/H2"; }
};
// --- χωρητικότητα εξωτερικής στις μονάδες του αθροίσματος ---
function pOutCap(D, o){ o=+o; if(D.capSame) return o; if(D.brand==="Daikin") return o*25; if(D.brand==="Mitsubishi Electric"||D.brand==="Toshiba"||D.brand==="Hitachi") return o; if(D.outKW) return D.outKW(o); if(D.outInput) return o; return KWOF_HP[o]; }
function pSuggest(D, tot){
  if(D.outInput){ return {txt:"Χρειάζεσαι εξωτερική τουλάχιστον "+(PS.unit==="btu"?pBtuTxt(tot)+" ("+pFmt(tot)+" kW)":pFmt(tot)+" kW ("+pBtuTxt(tot)+")")+" για αναλογία 100%.", val:String(Math.ceil(tot*10)/10)}; }
  var best = null; D.outs.forEach(function(o){ var c = pOutCap(D,o); if(c && !best && c >= tot) best = o; });
  if(!best && D.ratio){ var o2 = D.outs[D.outs.length-1], r2 = Math.round(tot/pOutCap(D,o2)*100); if(r2 <= D.ratio[1]) return {txt:"Καμία εξωτερική δεν καλύπτει το σύνολο στο 100%. Η "+pOL(D,o2)+" δίνει αναλογία "+r2+"% – επιτρέπεται ως "+D.ratio[1]+"% μόνο αν οι εσωτερικές δεν λειτουργούν όλες μαζί.", val:String(o2)}; return {txt:"Το σύνολο ("+r2+"% της μεγαλύτερης) ξεπερνά το "+D.ratio[1]+"% – χρειάζεται μεγαλύτερο σύστημα ή δεύτερη εξωτερική.", val:null}; }
  if(!best){ var o = D.outs[D.outs.length-1]; return {txt:"Το σύνολο ξεπερνά τη μεγαλύτερη μονή εξωτερική ("+D.outLab(o)+") – χρειάζεται συνδυασμός εξωτερικών (δες τον κατάλογο της σειράς).", val:null}; }
  var r = Math.round(tot/pOutCap(D,best)*100);
  return {txt:"Μικρότερη εξωτερική που καλύπτει το σύνολο: "+pOL(D,best)+" – αναλογία "+r+"%."+(String(best)===String(PS.out)?" ✅ Αυτή έχεις ήδη.":""), val:String(best)};
}
// --- δέντρο ---
function pT(){ return PS.tree; }
function pN(id){ var a=PS.tree.n; for(var i=0;i<a.length;i++) if(a[i].id===id) return a[i]; return null; }
function pKids(id){ return PS.tree.n.filter(function(x){ return x.p===id; }); }
function pNew(t,p,L,m,at){ var o={id:++PS.tree.k, t:t, p:p, L:String(L)}; if(m!=null) o.m=String(m); if(at!=null) PS.tree.n.splice(at,0,o); else PS.tree.n.push(o); return o; }
function pPos(id){ var a=PS.tree.n; for(var i=0;i<a.length;i++) if(a[i].id===id) return i; return -1; }
function pLeaves(){ var r=[]; (function w(id){ var ks=pKids(id); if(id!==0 && !ks.length && pN(id).t==="i"){ r.push(pN(id)); return; } ks.forEach(function(k){ w(k.id); }); })(0); return r; }
function pBuild(units, firstL, star){ // units: [{m, L, s}]
  var T = {k:0, n:[{id:0, t:"o"}], star:!!star}; PS.tree = T;
  if(star || units.length<2){ units.forEach(function(u){ var x = pNew("i",0,star?u.L:firstL,u.m); if(u.ty) x.ty = u.ty; if(u.st) x.st = u.st; }); return T; }
  var J = pNew("j",0,firstL);
  for(var k=0;k<units.length-1;k++){ pNew("i",J.id,units[k].L,units[k].m); if(k<units.length-2) J = pNew("j",J.id,units[k+1].s||"5"); else pNew("i",J.id,units[k+1].L,units[k+1].m); }
  var lv = T.n.filter(function(x){ return x.t==="i"; }); lv.forEach(function(x,i){ if(units[i] && units[i].ty) x.ty = units[i].ty; if(units[i] && units[i].st) x.st = units[i].st; });
  return T;
}
function pFix(D){
  var chg = PS.outSys && PS.outSys!==PS.sys;
  if(!PS.tree){ var U = PS.units || pDm(D).map(function(m,i){ return {m:String(m), L:String([8,6,7][i]), s:"6"}; });
    pBuild(U.map(function(u){ return {m:u.m, L:u.L||u.b||"5", s:u.s}; }), PS.A||"20", pStar(D)); delete PS.units; }
  if(D.outInput){ if(!(pNum(PS.out)>0) || chg) PS.out = D.outDef; }
  else if(D.outs.map(String).indexOf(String(PS.out))<0 || chg) PS.out = String(D.outs[Math.min(1,D.outs.length-1)]);
  var lv = pLeaves();
  if(chg){ var dm = pDm(D); lv.forEach(function(u,i){ u.m = String(dm[i%3]); }); }
  lv.forEach(function(u){ pFitModel(D, u); });
  var ms = pModels(D).map(String); lv.forEach(function(u){ if(ms.indexOf(String(u.m))<0){ var v=pNum(u.m), b=ms[0]; ms.forEach(function(x){ if(Math.abs(+x-v) < Math.abs(+b-v)) b=x; }); u.m = b; } });
  var st = pStar(D); if(!!PS.tree.star !== st){ var L = lv.map(function(u){ return {m:u.m, L:u.L, s:"5"}; }); var fl = PS.tree.star ? (PS.A||"20") : ((pKids(0)[0]||{}).L||"20"); if(st) PS.A = fl; pBuild(L, fl, st); PS.sel = null; }
  PS.outSys = PS.sys;
}
function pAddUnit(selId, ty){
  var D = PIPE[PS.sys], m = String(pDm(D)[1]), ms = pModels(D).map(String); if(ms.indexOf(m)<0) m = ms[Math.floor(ms.length/3)];
  var u = pAddUnit0(selId, m); u.ty = ty || "wall"; pFitModel(D, u); return u; }
function pAddUnit0(selId, m){
  if(PS.tree.star) return pNew("i",0,"5",m);
  var s = pN(selId==null?0:selId) || pN(0);
  if(s.t==="o"){ var ks = pKids(0); if(!ks.length) return pNew("i",0,"20",m); s = ks[0]; if(s.t==="h" || (s.t==="j" && pKids(s.id).length<2)) return pNew("i",s.id,"5",m); }
  if(s.t==="h") return pNew("i",s.id,"5",m);
  if(s.t==="j"){ var kj = pKids(s.id); if(kj.length<2) return pNew("i",s.id,"5",m);
    var c2 = kj[1], J2 = pNew("j", s.id, "3", null, pPos(c2.id)); c2.p = J2.id; return pNew("i",J2.id,"5",m); }
  if(s.t==="i" && pN(s.p) && pN(s.p).t==="h") return pNew("i", s.p, "5", m);
  // εσωτερική: βάλε διακλάδωση πριν από αυτήν
  var J = pNew("j", s.p, s.L, null, pPos(s.id)); s.p = J.id; s.L = "3"; return pNew("i", J.id, "5", m);
}
function pDelUnit(id){
  var u = pN(id); if(!u || u.t!=="i" || pLeaves().length<2) return;
  PS.tree.n.splice(pPos(id),1);
  var P = pN(u.p); if(P && (P.t==="j"||P.t==="h")){ var ks = pKids(P.id); if(ks.length===1){ var c = ks[0]; c.p = P.p; c.L = String(pNum(P.L)+pNum(c.L)); var at = pPos(P.id); PS.tree.n.splice(at,1); var ci = pPos(c.id); PS.tree.n.splice(ci,1); PS.tree.n.splice(at,0,c); } }
}
function pAddBranch(selId, t){
  var s = pN(selId==null?0:selId) || pN(0);
  if(s.t==="o"){ var ks = pKids(0); if(!ks.length) return pNew(t,0,"20"); s = ks[0]; }
  var B = pNew(t, s.p, s.L, null, pPos(s.id)); s.p = B.id; s.L = "3"; return B;
}
var PU = [];
function pSnap(){ try{ PU.push(JSON.stringify(PS.tree)); if(PU.length>40) PU.shift(); }catch(e){} }
function pUndo(){ if(!PU.length) return false; try{ PS.tree = JSON.parse(PU.pop()); }catch(e){ return false; } PS.sel = null; return true; }
function pSub(id){ var r=[]; (function w(x){ pKids(x).forEach(function(k){ r.push(k.id); w(k.id); }); })(id); return r; }
function pDelNode(id){ var nd = pN(id); if(!nd || id===0) return;
  var gone = [id].concat(pSub(id)); var par = nd.p;
  PS.tree.n = PS.tree.n.filter(function(x){ return gone.indexOf(x.id)<0; });
  // μάζεμα διακλαδώσεων που έμειναν με 0 ή 1 έξοδο
  while(par!==0 && pN(par) && (pN(par).t==="j"||pN(par).t==="h")){ var P = pN(par), ks = pKids(par);
    if(ks.length>=2) break;
    var up = P.p, at = pPos(par); PS.tree.n.splice(at,1);
    if(ks.length===1){ var c = ks[0]; c.p = up; c.L = String(pNum(P.L)+pNum(c.L)); var ci = pPos(c.id); PS.tree.n.splice(ci,1); PS.tree.n.splice(Math.min(at,PS.tree.n.length),0,c); break; }
    par = up; }
}
function pDelBranch(id){ var B = pN(id); if(!B || (B.t!=="j" && B.t!=="h")) return false; var ks = pKids(id); if(ks.length>1) return false;
  var at = pPos(id); PS.tree.n.splice(at,1); if(ks.length){ var c = ks[0]; c.p = B.p; c.L = String(pNum(B.L)+pNum(c.L)); } return true; }
// --- φόρμα ---
function pBrands(){ var r=[]; Object.keys(PIPE).forEach(function(k){ if(r.indexOf(PIPE[k].brand)<0) r.push(PIPE[k].brand); }); return r; }
// ===== ⚡ Γρήγορη λίστα: μονάδες στη σειρά πάνω σε μία γραμμή =====
function pChain(){
  var T = PS.tree; if(!T) return null; var k0 = pKids(0);
  if(T.star) return k0.every(function(x){ return x.t==="i" && !pKids(x.id).length; }) ? {star:true, u:k0.map(function(x){ return {n:x}; })} : null;
  if(!k0.length) return {u:[]};
  if(k0.length===1 && k0[0].t==="i" && !pKids(k0[0].id).length) return {single:true, u:[{n:k0[0]}]};
  if(k0.length!==1 || k0[0].t!=="j") return null;
  var J = k0[0], out = [], A = J;
  while(true){ var ks = pKids(J.id); if(ks.length!==2 || ks[0].t!=="i" || pKids(ks[0].id).length) return null;
    out.push({n:ks[0], j:J});
    if(ks[1].t==="j"){ J = ks[1]; continue; }
    if(ks[1].t==="i" && !pKids(ks[1].id).length){ out.push({n:ks[1], last:true}); break; }
    return null; }
  return {A:A, u:out};
}
function pQL(D,m){ if(D.kw) return pML(D,m); var c = pCapLab(D,m); return String(c[0]).replace(/^κλάση /,'')+(c[1]?' · '+String(c[1]).replace(/^≈ /,''):''); }
var PTYS = {wall:"Τοίχου", cas4:"Κασέτα", duct:"Καναλάτο", ceil:"Οροφής", cons:"Κονσόλα"};
function pStep(key, val, lab, cls){ return '<div class="ppqs'+(cls?' '+cls:'')+'"><span class="ppql">'+lab+'</span><span class="ppst"><button type="button" data-pqd="-1" data-pqk="'+key+'" aria-label="λιγότερα">−</button><input data-pqk="'+key+'" inputmode="decimal" value="'+esc(String(val==null?"":val))+'"><em>m</em><button type="button" data-pqd="1" data-pqk="'+key+'" aria-label="περισσότερα">+</button></span></div>'; }
function pQuickHtml(D, ch){
  var star = !!ch.star, n = ch.u.length, h = '<div class="ppq">';
  var box = D.kind==="bc" ? "BC" : "BS";
  if(star) h += pStep("A", PS.A, '🏠 Εξωτερική → '+box, 'ppqmain');
  else if(ch.A) h += pStep("j:"+ch.A.id, ch.A.L, '🏠 Εξωτερική → 1η διακλάδωση', 'ppqmain');
  ch.u.forEach(function(x, k){ var u = x.n, ty = u.ty||"wall";
    if(!star && k>0 && x.j) h += pStep("j:"+x.j.id, x.j.L, '↓ Κύρια γραμμή ως τη διακλάδωση της '+(k+1), 'ppqseg');
    var ms = pModelsFor(D, u).map(String); if(ms.indexOf(String(u.m))<0) ms.push(String(u.m));
    h += '<div class="ppqu"><div class="ppqr"><span class="ppqn">'+(k+1)+'</span>'+
      '<select data-pqty="'+u.id+'" aria-label="Τύπος">'+PTY.map(function(t){ return '<option value="'+t[0]+'"'+(t[0]===ty?' selected':'')+'>'+esc(PTYS[t[0]]||t[1])+'</option>'; }).join("")+'</select>'+
      '<select data-pqm="'+u.id+'" aria-label="Απόδοση">'+ms.map(function(m){ return '<option value="'+esc(m)+'"'+(String(u.m)===m?' selected':'')+'>'+esc(pQL(D,m))+'</option>'; }).join("")+'</select>'+
      (n>1?'<button type="button" class="ppqdel" data-pqdel="'+u.id+'" aria-label="Αφαίρεση μονάδας '+(k+1)+'">✕</button>':'')+'</div>'+
      (ty==="duct"?'<div class="pchips ppqstat">'+PST.map(function(z){ return '<button class="pc'+((u.st||"mid")===z[0]?' on':'')+'" data-pqst="'+u.id+':'+z[0]+'">'+esc(z[1])+'</button>'; }).join("")+'</div>':'')+
      pStep("L:"+u.id, u.L, ch.single ? 'Σωλήνα εξωτερική → μονάδα' : star ? 'Σωλήνα '+box+' → μονάδα' : 'Σωλήνα διακλάδωση → μονάδα')+'</div>';
  });
  h += '<div class="ppqadd"><span>➕ Πρόσθεσε στο τέλος της γραμμής</span><div>'+PTY.map(function(t){ return '<button type="button" data-pqadd="'+t[0]+'">'+pIcoBtn(t[0])+esc(t[1])+'</button>'; }).join("")+'</div></div>';
  return h + '</div>';
}
function pQSet(key, v){
  v = String(Math.max(0, Math.round(pNum(v)*10)/10)).replace(".",",");
  if(key==="A"){ PS.A = v; return; }
  var p = key.split(":"), nd = pN(+p[1]); if(nd) nd.L = v;
}
function pQGet(key){ if(key==="A") return PS.A; var p = key.split(":"), nd = pN(+p[1]); return nd ? nd.L : "0"; }
function pQRefresh(keepFocus){ pSave(); var q = document.getElementById("pp_q"), ch = pChain(); if(q && ch && !keepFocus) q.innerHTML = pQuickHtml(PIPE[PS.sys], ch); pipeCalc(); }
document.addEventListener("click", function(e){
  if(e.target.closest && e.target.closest("[data-ppprint]")) document.querySelectorAll("details.ppd").forEach(function(d){ d.open = true; });
  var t = e.target.closest && e.target.closest("[data-ppmode],[data-pqd],[data-pqdel],[data-pqadd],[data-pqst],[data-ppqreset]"); if(!t) return;
  if(t.hasAttribute("data-ppmode")){ PS.mode = t.getAttribute("data-ppmode"); PS.sel = null; pSave(); pRerender(); return; }
  if(t.hasAttribute("data-ppqreset")){ pSnap(); var lv = pLeaves().map(function(u){ return {m:u.m, L:u.L||"5", s:"5", ty:u.ty, st:u.st}; }); pBuild(lv, PS.A||"20", pStar(PIPE[PS.sys])); pSave(); pRerender(); return; }
  if(t.hasAttribute("data-pqd")){ var k = t.getAttribute("data-pqk"), d = +t.getAttribute("data-pqd"); pQSet(k, pNum(pQGet(k)) + d); var inp = document.querySelector('input[data-pqk="'+k+'"]'); if(inp) inp.value = pQGet(k); try{ if(navigator.vibrate) navigator.vibrate(6); }catch(x){} pQRefresh(true); return; }
  if(t.hasAttribute("data-pqdel")){ pSnap(); pDelUnit(+t.getAttribute("data-pqdel")); pQRefresh(); repToast("Αφαιρέθηκε – στο «✏️ Σχέδιο» έχει ↶ Αναίρεση"); return; }
  if(t.hasAttribute("data-pqst")){ var a = t.getAttribute("data-pqst").split(":"), u = pN(+a[0]); if(u){ u.st = a[1]; pFitModel(PIPE[PS.sys], u); } pQRefresh(); return; }
  if(t.hasAttribute("data-pqadd")){ pSnap(); var ty = t.getAttribute("data-pqadd"), lv2 = pLeaves(), last = lv2[lv2.length-1], oldL = last && last.L;
    var nu = pAddUnit(PS.tree.star ? null : (last ? last.id : 0), ty);
    if(!PS.tree.star && last && nu.p===last.p && pN(last.p) && pN(last.p).t==="j" && pN(last.p).p!==0){ pN(last.p).L = "5"; last.L = oldL; }
    nu.L = "5"; pQRefresh(); setTimeout(function(){ var el = document.querySelector('[data-pqm="'+nu.id+'"]'); if(el){ el.scrollIntoView({block:"center", behavior:"smooth"}); } }, 50); return; }
}, true);
document.addEventListener("change", function(e){
  var t = e.target; if(!t || !t.closest || !t.closest("#pp_q")) return;
  if(t.hasAttribute("data-pqm")){ var u = pN(+t.getAttribute("data-pqm")); if(u) u.m = t.value; pQRefresh(); return; }
  if(t.hasAttribute("data-pqty")){ var u2 = pN(+t.getAttribute("data-pqty")); if(u2){ u2.ty = t.value; pFitModel(PIPE[PS.sys], u2); } pQRefresh(); return; }
  if(t.hasAttribute("data-pqk")){ pQSet(t.getAttribute("data-pqk"), t.value); t.value = pQGet(t.getAttribute("data-pqk")); pQRefresh(true); return; }
});
document.addEventListener("input", function(e){
  var t = e.target; if(!t || !t.hasAttribute || !t.hasAttribute("data-pqk") || !t.closest("#pp_q")) return;
  if(t.value.trim()==="" || isNaN(pNum(t.value))) return; var k = t.getAttribute("data-pqk"); if(k==="A") PS.A = t.value; else { var nd = pN(+k.split(":")[1]); if(nd) nd.L = t.value; } pSave(); pipeCalc();
});
function pipeForm(){
  if(!PIPE[PS.sys]) PS.sys="daikin_hp"; var D = PIPE[PS.sys]; pFix(D);
  var o = function(v,l,s){ return '<option value="'+esc(v)+'"'+(String(s)===String(v)?' selected':'')+'>'+esc(l)+'</option>'; };
  var vv = ""; try{ vv = (document.querySelector('meta[name="vl-ver"]')||{}).content||""; }catch(e){}
  var h = '<div class="pcalcw"><div class="lbl">🧭 Σωληνόγραμμα <span class="small" style="float:right;font-weight:500">'+esc(vv)+'</span></div>';
  if(PS.bpick){ h += '<div class="small">Διάλεξε εταιρεία</div><div class="bgrid">'+pBrands().map(function(b){ return '<button class="br'+(b===D.brand?' on':'')+'" data-ppb="'+esc(b)+'">'+badge(b,"sm")+esc(b)+'</button>'; }).join("")+'</div>'; }
  else h += '<div class="bchosen">'+badge(D.brand,"lg")+'<div class="bt"><b>'+esc(D.brand)+'</b><small>'+esc(D.name)+'</small></div><button class="chg ico" data-ppchg="1" aria-label="Αλλαγή εταιρείας"><svg class="ic"><use href="#i-swap"/></svg></button></div>';
  var ser = Object.keys(PIPE).filter(function(k){ return PIPE[k].brand===D.brand; });
  if(ser.length>1 && !PS.bpick) h += '<div class="pchips" style="margin-top:6px">'+ser.map(function(k){ return '<button class="pc'+(k===PS.sys?' on':'')+'" data-pps="'+k+'">'+esc(PIPE[k].chip || pSysLab(D.brand, PIPE[k].kind))+'</button>'; }).join("")+'</div>';
  h += '<div class="pchips" style="margin-top:6px"><button class="pc'+(PS.unit!=="btu"?' on':'')+'" data-ppu="kw">kW</button><button class="pc'+(PS.unit==="btu"?' on':'')+'" data-ppu="btu">BTU/h</button><span style="width:10px"></span><button class="pc'+(PS.inch!=="in"?' on':'')+'" data-ppin="mm">mm</button><button class="pc'+(PS.inch==="in"?' on':'')+'" data-ppin="in">ίντσες</button></div>';
  var ov = D.outInput ? (PS.unit==="btu" ? String(Math.round(pNum(PS.out)*BTU)) : PS.out) : PS.out;
  h += '<div class="row2"><label class="small">Εξωτερική'+(D.outInput?' – ψυκτική απόδοση ('+(PS.unit==="btu"?'BTU/h':'kW')+')<input id="pp_out" class="ppv" inputmode="decimal" value="'+esc(ov)+'">':'<select id="pp_out" class="ppv">'+D.outs.map(function(x){ return o(x, pOL(D,x), PS.out); }).join("")+'</select>')+'</label>';
  if(D.kind==="hr" && D.bsSingle) h += '<div class="small" style="align-self:end">'+esc(D.bsSingle)+'</div>';
  else if(D.kind==="hr") h += '<label class="small">BS<select id="pp_bsm" class="ppv">'+o("multi","Ένα multi BS κοντά στην εξωτερική",PS.bsm)+o("single","BS1Q σε κάθε εσωτερική",PS.bsm)+'</select></label>';
  h += '</div>';
  if(pStar(D)) h += '<label class="small">'+(D.kind==="bc"?'Μήκος εξωτερική → BC (m)':'Μήκος εξωτερική → BS (m)')+'<input id="pp_A" class="ppv" inputmode="decimal" value="'+esc(PS.A)+'"></label>';
  h += '<div class="row2"><label class="small">Υψομετρική εξωτ.–εσωτ. (m)<input id="pp_H" class="ppv" inputmode="decimal" value="'+esc(PS.H)+'"></label>'+
       '<label class="small">Η εξωτερική είναι<select id="pp_Hpos" class="ppv">'+o("up","πιο ψηλά",PS.Hpos)+o("down","πιο χαμηλά",PS.Hpos)+'</select></label></div>';
  h += '<div class="row2"><label class="small">Μέγ. υψομετρική μεταξύ εσωτερικών (m)<input id="pp_h2" class="ppv" inputmode="decimal" value="'+esc(PS.h2)+'"></label>'+
       (D.kind==="bc"?'<label class="small">Μέγ. υψομετρική εσωτ. – BC (m)<input id="pp_hbc" class="ppv" inputmode="decimal" value="'+esc(PS.hbc)+'"></label>':'')+'</div>';
  var qm = PS.mode!=="adv", ch = qm ? pChain() : null;
  h += '<div class="ppmode"><button class="pc'+(qm?' on':'')+'" data-ppmode="q">⚡ Γρήγορα (λίστα)</button><button class="pc'+(!qm?' on':'')+'" data-ppmode="adv">✏️ Σχέδιο (ελεύθερο)</button></div>';
  if(qm){
    h += ch ? '<div id="pp_q">'+pQuickHtml(D, ch)+'</div>' : '<div class="pver">Το σχέδιο σου έχει διακλαδώσεις που δεν είναι σε μία γραμμή – συνέχισε στο «✏️ Σχέδιο» ή <button class="mini" data-ppqreset="1">κάν’ το λίστα</button> (κρατάω μονάδες και μήκη, ξαναστήνω τις διακλαδώσεις στη σειρά).</div>';
    h += '<div id="pp_act" hidden></div>';
  } else {
  h += '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="mini" data-ppundo="1">↶ Αναίρεση</button><button class="mini" data-ppnew="1">🆕 Νέο σχέδιο (μόνο εξωτερική)</button></div>';
  h += '<div class="small" style="margin-top:8px">🗑️ Για διαγραφή: κράτα πατημένο ένα στοιχείο και σύρ’ το στο ✕ που εμφανίζεται κάτω.<br>🔤 Γράμματα όπως στην LG: A κύρια σωλήνα, B/C/… μεταξύ διακλαδώσεων, a/b/c… προς τις εσωτερικές.<br>👆 Πάτα πάνω στο σχέδιο (εξωτερική, διακλάδωση, εσωτερική ή σωλήνα) για να προσθέσεις ή να αλλάξεις.</div>';
  h += '<div id="pp_svg"></div><div id="pp_act"></div>';
  }
  if(qm) h += '<div id="pp_out_box"></div><details class="ppd" open><summary>🗺️ Σχέδιο δικτύου</summary><div id="pp_svg" class="ppro"></div></details>';
  h += '<label class="small">Πρόσθετα kg φρέον (CF εσωτερικών, πίνακας ⓑ, BC κ.λπ. – αν τα ζητά το manual)<input id="pp_xkg" class="ppv" inputmode="decimal" value="'+esc(PS.xkg||"")+'" placeholder="0"></label>';
  h += '<div class="small" style="margin-top:6px">ℹ️ '+esc(D.idxNote)+(D.indNote?' '+esc(D.indNote):'')+'</div>';
  h += (qm?'':'<div id="pp_out_box"></div>')+'<div class="small" style="margin-top:6px">Πηγή: '+esc(D.src)+'</div></div>';
  return h;
}
// --- πίνακας ενεργειών για ό,τι πάτησες ---
function pAddGrid(star){
  var h = '<div class="small" style="margin-top:6px">➕ Πρόσθεσε</div><div class="pptyg">' + PTY.map(function(t){ return '<button class="ppty" data-ppadd="i:'+t[0]+'">'+pIcoBtn(t[0])+esc(t[1])+'</button>'; }).join("");
  if(!star) h += '<button class="ppty" data-ppadd="j">'+pIcoBtn("j")+'Διακλάδωση Y (joint)</button><button class="ppty" data-ppadd="h">'+pIcoBtn("h")+'Κολεκτέρ (header)</button>';
  return h + '</div>';
}
function pAct(){
  var el = document.getElementById("pp_act"); if(!el) return; var D = PIPE[PS.sys], s = PS.sel!=null ? pN(PS.sel) : null, star = PS.tree.star;
  if(PS.sel==="A") s = {t:"A"};
  if(!s){ el.innerHTML = '<div class="ppact"><div class="small">Πάτα ένα σημείο στο σχέδιο ή πρόσθεσε κατευθείαν (μπαίνει στο τέλος του δικτύου):</div>'+pAddGrid(star)+'</div>'; return; }
  var lv = pLeaves(), no = lv.indexOf(s)+1, title, h = '<div class="ppact">';
  if(s.t==="o") title = "Εξωτερική"; else if(s.t==="A") title = "Σωλήνα εξωτερική → "+(D.kind==="bc"?"BC":"BS"); else if(s.t==="j") title = "Διακλάδωση Y "+pJlab(s.id); else if(s.t==="h") title = "Κολεκτέρ "+pJlab(s.id); else title = "Εσωτερική "+no+" – "+pTyName(s.ty);
  h += '<div class="lbl">'+esc(title)+' <button class="mini" id="pp_unsel" style="float:right">✕</button></div>';
  if(s.t==="i"){ h += '<div class="small">Τύπος</div><div class="pptyg">'+PTY.map(function(t){ return '<button class="ppty'+((s.ty||"wall")===t[0]?' on':'')+'" data-ppty="'+t[0]+'">'+pIcoBtn(t[0])+esc(t[1])+'</button>'; }).join("")+'</div>';
    if((s.ty||"wall")==="duct") h += '<div class="small" style="margin-top:8px">Στατική πίεση καναλάτου</div><div class="pchips">'+PST.map(function(x){ return '<button class="pc'+((s.st||"mid")===x[0]?' on':'')+'" data-ppst="'+x[0]+'">'+esc(x[1])+'</button>'; }).join("")+'</div>';
    var UI = pUinfo(D, s); if(UI) h += '<div class="pver good" style="margin-top:8px">📐 '+esc(pUtxt(UI))+'</div>'; else if(pUrows(D,s)) {} 
    var CC = PCAPS[D.brand], PU0 = typeof PUNIT!=="undefined" && PUNIT[D.brand]; if(PU0 && pUrows(D,s)) CC = {src:PU0.src}; h += '<div class="small" style="margin-top:8px">Απόδοση – '+(CC?'μόνο όσες υπάρχουν για '+esc(pUnitName(s).toLowerCase())+' ('+esc(CC.src)+')':'όλες (δεν έχω ακόμα επιβεβαιωμένο εύρος ανά τύπο για '+esc(D.brand)+')')+'</div><div class="pptyg ppcapg">'+pModelsFor(D, s).map(function(m){ var c = pCapLab(D,m); return '<button class="ppty'+(String(m)===String(s.m)?' on':'')+'" data-ppm="'+m+'"><b>'+esc(c[0])+'</b><small>'+esc(c[1])+'</small></button>'; }).join("")+'</div>'; }
  var Lv = s.t==="A" ? PS.A : s.t!=="o" ? s.L : null;
  if(Lv!=null){ var lt = s.t==="A" ? "Μήκος (m)" : (s.t==="j"||s.t==="h") ? "Μήκος σωλήνα ως εδώ (m)" : star ? "Μήκος "+(D.kind==="bc"?"BC":"BS")+" → εσωτερική (m)" : "Μήκος σωλήνα ως την εσωτερική (m)";
    h += '<div class="small" style="margin-top:8px">'+lt+'</div><div class="pchips">'+[2,3,5,8,10,15,20,30,40].map(function(v){ return '<button class="pc'+(pNum(Lv)===v?' on':'')+'" data-ppl="'+v+'">'+v+'</button>'; }).join("")+'</div>'+
         '<input id="pp_len" inputmode="decimal" value="'+esc(Lv)+'" style="margin-top:4px">'; }
  if(s.t!=="o" && s.t!=="A" && !PS.tree.star){
    var szc = function(k, lab, from, to){ var cur = k==="L" ? s.oL : s.oG; return '<div class="small" style="margin-top:6px">'+lab+'</div><div class="pchips"><button class="pc'+(!cur?' on':'')+'" data-ppd'+k.toLowerCase()+'="">Αυτόματο</button>'+PSIZES.filter(function(v){ return v>=from && v<=to; }).map(function(v){ return '<button class="pc'+(cur && Math.abs(parseFloat(cur)-v)<0.2?' on':'')+'" data-ppd'+k.toLowerCase()+'="'+v+'">'+esc(pD(v))+'</button>'; }).join("")+'</div>'; };
    h += '<div class="small" style="margin-top:8px"><b>Διατομή σωλήνα ως εδώ</b> – «Αυτόματο» = από τον πίνακα του manual</div>' + szc("L","Υγρό",6.35,28.58) + szc("G", D.kind==="hr"?"Αναρρόφηση":"Αέριο", 9.52,53.98); }
  if(s.t==="j") h += '<button class="mini" data-ppconv="h" style="margin-top:8px">'+'Κάν’ το κολεκτέρ</button> ';
  if(s.t==="h") h += '<button class="mini" data-ppconv="j" style="margin-top:8px">Κάν’ το διακλάδωση Y</button> ';
  if(s.t==="i") h += '<button class="mini ppdel" data-ppdn="'+s.id+'" style="margin-top:8px">🗑️ Αφαίρεση εσωτερικής</button>';
  if(s.t==="j"||s.t==="h"){ var ku = pSub(s.id).filter(function(x){ return pN(x).t==="i"; }).length;
    if(PS.delc===s.id) h += '<button class="mini ppdel" data-ppdn="'+s.id+'" data-ppok="1" style="margin-top:8px">⚠️ Πάτα ξανά: σβήνει '+(s.t==="h"?'το κολεκτέρ':'τη διακλάδωση')+' και '+ku+' εσωτερική(ές)</button>';
    else h += '<button class="mini ppdel" data-ppdn="'+s.id+'" style="margin-top:8px">🗑️ Αφαίρεση '+(s.t==="h"?'κολεκτέρ':'διακλάδωσης')+(ku?' (μαζί με '+ku+' εσωτερική/ές από κάτω)':'')+'</button>'; }
  if(s.t!=="A") h += pAddGrid(star) + '<div class="small">'+(s.t==="i"?'Μια νέα εσωτερική μπαίνει δίπλα σε αυτή (με διακλάδωση). Joint/κολεκτέρ μπαίνει πριν από αυτή.':(s.t==="o"?'Joint/κολεκτέρ μπαίνει αμέσως μετά την εξωτερική.':'Η εσωτερική μπαίνει σε αυτό το σημείο. Joint/κολεκτέρ μπαίνει πριν από αυτό.'))+'</div>';
  el.innerHTML = h + '</div>';
}
var PJL = {};
function pJlab(id){ return PJL[id] || "Δ"; }
// --- σχέδιο δέντρου (από πάνω προς τα κάτω) ---
function pSvgTree(D, info){
  var slot = 0, maxD = 0, pos = {};
  (function lay(id, d){ var ks = pKids(id); maxD = Math.max(maxD, d); if(!ks.length){ pos[id] = {x:slot++, d:d}; return; } ks.forEach(function(k){ lay(k.id, d+1); }); pos[id] = {x:(pos[ks[0].id].x + pos[ks[ks.length-1].id].x)/2, d:d}; })(0, 0);
  var CW = 116, RH = 128, W = Math.max(340, slot*CW+30), H = (maxD+1)*RH+54, X = function(id){ return 15+pos[id].x*CW+CW/2; }, Y = function(id){ return 30+pos[id].d*RH; };
  var s = '<svg class="ppsvg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" xmlns="http://www.w3.org/2000/svg" font-size="11" font-family="system-ui,sans-serif">';
  PS.tree.n.forEach(function(n){ if(n.id===0) return; var px = X(n.p), py = Y(n.p)+(n.p===0?16:0), cx = X(n.id), cy = Y(n.id), my = cy-50, I = info[n.id]||{};
    var d = 'M'+px+' '+py+' V'+my+' H'+cx+' V'+cy, sel = PS.sel===n.id;
    s += '<path d="'+d+'" class="'+(n.t!=="i"||n.p===0?'ppln':'ppln2')+(sel?' ppsel':'')+'" fill="none"/>';
    var zz = (I.sz||[]).map(function(v){ var x = pD(v); return /^[0-9.]+$/.test(x) ? "Ø"+x : x; });
    s += '<text x="'+(cx+5)+'" y="'+(cy-38)+'" class="ppsz"><tspan class="pplet">'+esc(I.let||"")+'</tspan>'+(I.man?' ✎':'')+' '+esc(zz[0]||"")+'</text><text x="'+(cx+5)+'" y="'+(cy-26)+'" class="ppsz">'+esc(zz.slice(1).join("/"))+'</text><text x="'+(cx+5)+'" y="'+(cy-14)+'" class="pplen">'+pFmt(pNum(n.L))+' m</text>';
    s += '<path d="'+d+'" class="pphit" data-pn="'+n.id+'"/>';
  });
  PS.tree.n.forEach(function(n){ var x = X(n.id), y = Y(n.id), I = info[n.id]||{}, sel = PS.sel===n.id ? ' ppsel' : '';
    if(n.t==="o") s += '<g data-pn="0" class="pptap"><rect x="'+(x-44)+'" y="'+(y-14)+'" width="88" height="30" rx="6" class="ppbox'+sel+'"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" class="pptx">Εξωτ. '+esc(PS.unit==="btu"&&D.kw?String(Math.round(pNum(PS.out)*BTU/1000))+'k':D.kw?pFmt(pNum(PS.out)):String(PS.out))+'</text></g>';
    else if(n.t==="j") s += '<g data-pn="'+n.id+'" class="pptap"><circle cx="'+x+'" cy="'+y+'" r="22" fill="transparent" class="pphitc"/><circle cx="'+x+'" cy="'+y+'" r="7" class="ppj'+sel+'"/><text x="'+(x-10)+'" y="'+(y+4)+'" text-anchor="end" class="ppkit">'+esc(pJlab(n.id))+'</text><text x="'+(x+10)+'" y="'+(y+15)+'" class="ppkit">'+esc(String(I.kit||"").replace(/\s*\(.*\)/,"").replace(/^κολεκτέρ: .*/,"κολεκτέρ"))+'</text></g>';
    else if(n.t==="h") s += '<g data-pn="'+n.id+'" class="pptap"><rect x="'+(x-34)+'" y="'+(y-18)+'" width="68" height="36" fill="transparent" class="pphitc"/><rect x="'+(x-30)+'" y="'+(y-6)+'" width="60" height="12" rx="3" class="ppj'+sel+'"/><text x="'+(x-34)+'" y="'+(y+4)+'" text-anchor="end" class="ppkit">'+esc(pJlab(n.id))+'</text><text x="'+(x+34)+'" y="'+(y+15)+'" class="ppkit">'+esc(String(I.kit||"").replace(/\s*\(.*\)/,"").replace(/^κολεκτέρ: .*/,"κολεκτέρ"))+'</text></g>';
    else s += '<g data-pn="'+n.id+'" class="pptap"><rect x="'+(x-36)+'" y="'+y+'" width="72" height="44" rx="6" class="ppbox'+sel+'"/><g class="ppico">'+pIco(n.ty||"wall", x-14, y+4, 28)+'</g><text x="'+x+'" y="'+(y+37)+'" text-anchor="middle" class="pptx">'+esc(I.no+': '+pSL(D,n.m)+(PS.unit==="btu"&&!D.kw?"":(D.kw?(PS.unit==="btu"?" BTU":" kW"):"")))+'</text>'+(I.bs?'<text x="'+x+'" y="'+(y+57)+'" text-anchor="middle" class="ppkit">'+esc(I.bs)+'</text>':'')+'</g>';
  });
  return s+'</svg>';
}
function pSvgStar(D, A, units, box){
  var n=units.length, W=Math.max(340, 30+n*96), Hh=272, s='', bx=10, bw=W-20;
  s+='<svg class="ppsvg" viewBox="0 0 '+W+' '+Hh+'" width="'+W+'" height="'+Hh+'" xmlns="http://www.w3.org/2000/svg" font-size="11" font-family="system-ui,sans-serif">';
  s+='<g data-pn="0" class="pptap"><rect x="10" y="8" width="96" height="34" rx="6" class="ppbox'+(PS.sel===0?' ppsel':'')+'"/><text x="58" y="30" text-anchor="middle" class="pptx">Εξωτ. '+esc(D.kw?pSL(D,PS.out):String(PS.out))+'</text></g>';
  s+='<line x1="58" y1="42" x2="58" y2="86" class="ppln'+(PS.sel==="A"?' ppsel':'')+'"/><text x="66" y="58" class="ppsz">'+esc(pSzJ(A.sz))+'</text><text x="66" y="72" class="pplen">'+(A.L?pFmt(A.L)+' m':'')+'</text><line x1="58" y1="42" x2="58" y2="86" class="pphit" data-pn="A"/>';
  s+='<g data-pn="0" class="pptap"><rect x="'+bx+'" y="86" width="'+bw+'" height="30" rx="6" class="ppbox2"/><text x="'+(bx+bw/2)+'" y="105" text-anchor="middle" class="pptx">'+esc(box)+'</text></g>';
  units.forEach(function(u,k){ var x = 50+k*96, sel = PS.sel===u.id?' ppsel':'';
    s+='<line x1="'+x+'" y1="116" x2="'+x+'" y2="214" class="ppln2'+sel+'"/>';
    s+='<text x="'+(x+4)+'" y="132" class="ppkit">'+esc(u.port)+'</text>';
    s+='<text x="'+(x+4)+'" y="152" class="ppsz">'+esc(u.szl[0]+pD(u.szv[0]))+'</text><text x="'+(x+4)+'" y="166" class="ppsz">'+esc(u.szl[1]+pD(u.szv[1]))+'</text>';
    s+='<text x="'+(x+4)+'" y="182" class="pplen">'+(u.L?pFmt(u.L)+' m':'')+'</text><line x1="'+x+'" y1="116" x2="'+x+'" y2="226" class="pphit" data-pn="'+u.id+'"/>';
    s+='<g data-pn="'+u.id+'" class="pptap"><rect x="'+(x-38)+'" y="214" width="76" height="46" rx="6" class="ppbox'+sel+'"/><g class="ppico">'+pIco(u.ty||"wall", x-14, 218, 28)+'</g><text x="'+x+'" y="253" text-anchor="middle" class="pptx">'+(k+1)+': '+esc(u.lab)+'</text></g>';
  });
  return s+'</svg>';
}
// --- υπολογισμός ---
function pipeCalc(){
  var box = document.getElementById("pp_out_box"), svb = document.getElementById("pp_svg"); if(!box) return;
  var D = PIPE[PS.sys], out = pNum(PS.out), msg = [], ok = [], rows = [], L = D.lim; BOM = {}; KIT = {};
  var lv = pLeaves(), n = lv.length;
  if(D.limOver && D.nMax && D.nMax[out] && n > D.nMax[out][0]) L = Object.assign({}, L, D.limOver);
  var idxL = lv.map(function(u){ return pIdx(D,u.m); }), tot = idxL.reduce(function(a,b){return a+b;},0);
  var lab = function(m){ return pSL(D,m); };
  var main = pPick(D.main, out).slice(1), A = pNum(PS.A), H = pNum(PS.H), h2 = pNum(PS.h2);
  var okw = pOutKw(D,out), totKw = D.kw ? tot : null;
  var html = '<div class="small" style="margin:6px 0">Σύνολο εσωτερικών: <b>'+(D.kw ? (PS.unit==="btu"?pBtuTxt(tot)+' ('+pFmt(tot)+' kW)':pFmt(tot)+' kW') : pFmt(tot)+(D.totU?' '+D.totU:D.brand==="Toshiba"||D.brand==="Hitachi"?' HP':D.idx?' (δείκτης)':''))+'</b>'+
     ((D.kw&&(D.outInput||D.outKW))||D.brand==="Toshiba"||D.capSame ? ' · αναλογία '+Math.round(tot/(D.kw?okw:out)*100)+'%' : '')+' · '+n+' μονάδες</div>';
  var sg = tot>0 ? pSuggest(D, tot) : {txt:"Πρόσθεσε εσωτερικές – θα σου προτείνω εξωτερική από το άθροισμά τους.", val:null}; html += '<div class="ppsug">💡 '+esc(sg.txt)+(sg.val!=null && String(sg.val)!==String(PS.out) ? ' <button class="mini" data-ppsug="'+esc(sg.val)+'">Βάλε αυτή</button>' : '')+'</div>';
  var hr = D.kind==="hr", star = pStar(D), runs = [], bsL = [], farC = 0;
  if(!star){
    var dist = {0:0}, down = {}, info = {}, jn = 0, firstJ = null, total = 0; PJL = {};
    var hn = 0; (function w(id){ var nd = pN(id), ks = pKids(id); if(nd.t==="j") PJL[id] = "Δ"+(++jn); if(nd.t==="h") PJL[id] = "Κ"+(++hn); ks.forEach(function(k){ dist[k.id] = dist[id] + pNum(k.L); w(k.id); });
      down[id] = nd.t==="i" ? pIdx(D,nd.m) : ks.reduce(function(a,k){ return a+down[k.id]; },0); })(0);
    var k0 = pKids(0); if(k0.length!==1) msg.push('⛔ Από την εξωτερική πρέπει να βγαίνει μία κύρια σωλήνα'+(k0.length?' – βάλε τις εσωτερικές σε διακλάδωση.':'.')); else if(k0[0].t!=="i") firstJ = k0[0].id;
    var preorder = []; (function w(id){ pKids(id).forEach(function(k){ preorder.push(k); w(k.id); }); })(0);
    var from = function(p){ return p===0 ? 'Εξωτερική' : PJL[p]; }, bL = 0;
    preorder.forEach(function(c){ var p = c.p, Lc = pNum(c.L); total += Lc; var I = info[c.id] = {};
      I.let = p===0 ? "A" : c.t!=="i" ? pLet(++bL, true) : pLet(lv.indexOf(c), false);
      var ovr = function(){ if(!c.oL && !c.oG) return; I.auto = I.sz.slice(); I.sz = I.sz.slice(); if(c.oL) I.sz[0] = c.oL; if(c.oG) I.sz[1] = c.oG; I.man = true;
        [0,1].forEach(function(k){ if(parseFloat(I.sz[k]) < parseFloat(I.auto[k]) - 0.2) msg.push('⚠️ Τμήμα '+I.let+': '+(k?'αέριο':'υγρό')+' '+pD(I.sz[k])+' μικρότερο από του manual ('+pD(I.auto[k])+').'); }); };
      if(c.t==="j" || c.t==="h"){ var dn = down[c.id], nk = pKids(c.id).length;
        I.sz = p===0 ? main : pCap(pPick(D.branch, dn).slice(1), main); ovr();
        if(c.t==="j"){ I.kit = c.id===firstJ ? (D.firstSame ? pPick(D.joint, dn)[1] : pPick(D.first, out)[1]) : pPick(D.joint, dn)[1];
          if(nk!==2) msg.push('⚠️ Η διακλάδωση '+PJL[c.id]+' έχει '+nk+' '+(nk===1?'έξοδο':'εξόδους')+' – μια Y διακλάδωση έχει 2.'); }
        else { var hk = PHDR[PS.sys] ? PHDR[PS.sys](dn, nk) : null; I.kit = hk || "κολεκτέρ: μοντέλο από το manual";
          if(!PHDR[PS.sys]) msg.push('ℹ️ Κολεκτέρ '+PJL[c.id]+': δεν έχω επίσημο πίνακα κολεκτέρ για αυτή τη σειρά – διάλεξε μοντέλο από το manual (ανάλογα με το σύνολο '+pFmt(dn)+' και '+nk+' εξόδους).');
          else if(!hk) msg.push('⛔ Κολεκτέρ '+PJL[c.id]+': '+nk+' έξοδοι / σύνολο '+pFmt(dn)+' – δεν υπάρχει κατάλληλο μοντέλο στον πίνακα του manual.');
          if(nk<2) msg.push('⚠️ Το κολεκτέρ '+PJL[c.id]+' έχει '+nk+' έξοδο – πρόσθεσε εσωτερικές.');
          var sub = []; (function w(id){ pKids(id).forEach(function(k){ if(k.t!=="i") sub.push(k); w(k.id); }); })(c.id);
          if(sub.length) msg.push('⛔ Μετά από κολεκτέρ ('+PJL[c.id]+') δεν μπαίνει άλλη διακλάδωση ή κολεκτέρ – συνδέεις μόνο εσωτερικές.'); }
        rows.push([I.let+(I.man?' ✎':'')+' · '+from(p)+' → '+PJL[c.id], pFmt(dn), pSzJ(I.sz), I.kit, Lc]); pBom(I.sz, Lc, D, hr?3:2); pKit(I.kit); runs.push([I.sz[0], Lc]);
        if(c.t==="j" && PCHG[PS.sys] && PCHG[PS.sys].jEq) runs.push([I.sz[0], PCHG[PS.sys].jEq]);
      } else { var no = lv.indexOf(c)+1, ix = pIdx(D,c.m); I.no = no;
        I.sz = p===0 ? main : hr ? pPick(D.bsUp || D.branch, ix).slice(1) : pInd(D,c,ix);
        if(!isNaN(parseFloat(I.sz[0]))) ovr();
        if(hr){ I.bs = pPick(D.bs1, ix)[1]; I.sz2 = pInd(D,c,ix); bsL.push(I.bs); }
        pBom(I.sz, Lc, D, hr?3:2); if(hr) pKit(I.bs);
        rows.push([I.let+(I.man?' ✎':'')+' · '+from(p)+' → μονάδα '+no+' ('+pUnitName(c)+')'+(hr?' (3 σωλήνες ως το '+I.bs+', μετά 2)':''), pFmt(ix), pSzJ(I.sz)+(hr?' → '+pSzJ(I.sz2):''), hr?I.bs:'—', Lc]); runs.push([I.sz[0], Lc]);
      } });
    var far = 0, afterMax = 0, minAfter = 1e9, bmax = 0;
    lv.forEach(function(u){ far = Math.max(far, dist[u.id]); if(firstJ!=null){ var a = dist[u.id]-dist[firstJ]; afterMax = Math.max(afterMax, a); minAfter = Math.min(minAfter, a); } if(u.p!==0) bmax = Math.max(bmax, pNum(u.L)); });
    farC = far;
    if(svb) svb.innerHTML = '<div class="ppscroll">'+pSvgTree(D, info)+'</div>';
    html += '<details class="ppd" open><summary>📋 Διατομές ανά τμήμα</summary>'+pTable(D, rows, hr?(D.colLab||['Υγρό','Αναρρόφηση','Υψ./χαμ.']):null)+'</details>';
    if(L){ pChk(msg, ok, far, L.L1, 'Πιο μακρινή εσωτερική από την εξωτερική (πραγματικό)', L.L1eq?'Ισοδύναμο ≤ '+L.L1eq+' m – πρόσθεσε τις καμπύλες.':'');
      var afL = (L.afterH && H > L.afterH[0]) ? L.afterH[1] : L.after;
      if(L.dL && firstJ!=null) pChk(msg, ok, afterMax-minAfter, L.dL, 'Διαφορά πιο μακρινής – πλησιέστερης εσωτερικής από την 1η διακλάδωση');
      if(afL!=null && firstJ!=null){ if(afterMax > afL) msg.push('⚠️ Μετά την 1η διακλάδωση: '+pFmt(afterMax)+' m > '+afL+' m'+(afL!==L.after?' (υψομετρική > '+L.afterH[0]+' m)':'')+'. '+(D.after90||'')); else ok.push('Μετά την 1η διακλάδωση: '+pFmt(afterMax)+' m ≤ '+afL+' m'); }
      if(L.indMax) pChk(msg, ok, bmax, L.indMax, 'Διακλάδωση → εσωτερική (μέγιστο)');
      if(L.total) pChk(msg, ok, total, L.total, 'Συνολικό μήκος σωληνώσεων'); }
    if(D.ratio){ var rr = Math.round(tot/pOutCap(D,out)*100), nx = D.nMax && D.nMax[out];
      if(rr > D.ratio[1]) msg.push('⛔ Αναλογία σύνδεσης '+rr+'% > '+D.ratio[1]+'% – δεν επιτρέπεται (manual).'); else if(rr < D.ratio[0]) msg.push('⛔ Αναλογία σύνδεσης '+rr+'% < '+D.ratio[0]+'%.'); else ok.push('Αναλογία σύνδεσης '+rr+'% (επιτρέπεται '+D.ratio[0]+'–'+D.ratio[1]+'%'+(rr>100?', πάνω από 100% μόνο αν δεν λειτουργούν όλες μαζί':'')+')');
      if(nx){ if(n > nx[1]) msg.push('⛔ '+n+' εσωτερικές > μέγιστο '+nx[1]+' για αυτή την εξωτερική.'); else if(n > nx[0]) msg.push('⚠️ '+n+' εσωτερικές > προτεινόμενες '+nx[0]+' (μέγιστο '+nx[1]+').'); else ok.push('Εσωτερικές: '+n+' ≤ '+nx[0]+' προτεινόμενες'); }
      if(D.recL && (far > D.recL[0] || total > D.recL[1]) && (rr > 100 || (nx && n > nx[0]))) msg.push('⚠️ Πιο μακρινή > '+D.recL[0]+' m ή σύνολο > '+D.recL[1]+' m: το manual προτείνει αναλογία ≤ 100% και όχι πάνω από τις προτεινόμενες εσωτερικές.'); }
    var A1 = firstJ!=null ? pNum(pN(firstJ).L) : far;
    if(D.upAt && (D.upMain?A1:far) >= D.upAt){ var mu = D.mainUp ? pPick(D.mainUp,out) : null; msg.push('⚠️ '+D.upNote+(!mu?'':mu.length>2?' Κύρια: υγρό '+mu[1]+' / αέριο '+mu[2]+' mm.':' Υγρό κύριας: '+mu[1]+' mm.')); }
    if(D.mainUpME && D.mainUpME[out] && far >= D.mainUpME[out][0]) msg.push('⚠️ PUHY-P'+out+': με πιο μακρινή εσωτερική ≥ '+D.mainUpME[out][0]+' m, υγρό κύριας (A) '+D.mainUpME[out][1]+' mm.');
  } else {
    var U = lv.map(function(u){ return {id:u.id, m:u.m, b:u.L, ty:u.ty}; });
    if(D.kind==="hr"){
      var ports = 0, pu = U.map(function(u,i){ var p = idxL[i] > D.port.max ? 2 : 1, st = ports+1; ports += p; return {p:p, st:st}; });
      var bsm = null; D.bsm.forEach(function(b){ if(!bsm && b[1]>=ports && b[2]>=tot) bsm=b; });
      var far = 0, mx = 0, total = A;
      var us = U.map(function(u,i){ var b=pNum(u.b); total+=b; far=Math.max(far,A+b); mx=Math.max(mx,b);
        var sz = pPick(D.ind, +u.m).slice(1); runs.push([sz[0], b]);
        rows.push(['BS θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1):pu[i].st)+' → μονάδα '+(i+1), pFmt(idxL[i]), pSzJ(sz), pu[i].p===2?'2 θύρες μαζί':'1 θύρα', b]);
        if(idxL[i] > D.port.two) msg.push('⛔ Μονάδα '+(i+1)+': δείκτης '+pFmt(idxL[i])+' > '+D.port.two+' – δεν συνδέεται σε multi BS.');
        pBom(sz, b, D, 2); return {id:u.id, ty:u.ty, lab:lab(u.m), szl:['Υ ','Α '], szv:sz, L:b, port:pLet(i,false)+' · θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1):pu[i].st)}; });
      runs.push([main[0], A]); pBom(main, A, D, 3); if(bsm){ bsL.push(bsm[0]); pKit(bsm[0]); } farC = far;
      rows.unshift(['A · Εξωτερική → BS (3 σωλήνες)', pFmt(tot), pSzJ(main), bsm?bsm[0]:'—', A]);
      if(svb) svb.innerHTML = '<div class="ppscroll">'+pSvgStar(D, {sz:main, L:A}, us, bsm?bsm[0]+' ('+ports+' θύρες)':'Χρειάζονται >1 BS')+'</div>';
      html += '<details class="ppd" open><summary>📋 Διατομές ανά τμήμα</summary>'+pTable(D, rows, ['Υγρό','Αναρρόφηση','Υψ./χαμ.'])+'</details>';
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
        rows.push(['BC θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1)+' (CMY-R160-J1)':pu[i].st)+' → μονάδα '+(i+1), 'P'+u.m, pSzJ(sz), pu[i].p===2?'2 θύρες + CMY-R160-J1':'1 θύρα', b]);
        pBom(sz, b, D, 2); return {id:u.id, ty:u.ty, lab:lab(u.m), szl:['Υ ','Α '], szv:sz, L:b, port:pLet(i,false)+' · θύρα '+(pu[i].p===2?pu[i].st+'+'+(pu[i].st+1):pu[i].st)}; });
      runs.push([main[0], A, 'hp']); pBom(main, A, D, 2, ['Υψηλή πίεση','Χαμηλή πίεση']); if(bc) pKit(bc[0]); farC = far;
      rows.unshift(['A · Εξωτερική → BC (υψηλή / χαμηλή)', 'P'+pFmt(tot), pSzJ(main), bc?bc[0]:'—', A]);
      if(svb) svb.innerHTML = '<div class="ppscroll">'+pSvgStar(D, {sz:main, L:A}, us, bc?bc[0]+' ('+ports+' θύρες)':'>16 θύρες')+'</div>';
      html += '<details class="ppd" open><summary>📋 Διατομές ανά τμήμα</summary>'+pTable(D, rows, ['Υψηλή/Υγρό','Χαμηλή/Αέριο'])+'</details>';
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
  }
  if(L){ var hl = PS.Hpos==="up" ? L.Hup : L.Hdown; pChk(msg, ok, H, hl, 'Υψομετρική εξωτ.–εσωτ. (εξωτερική '+(PS.Hpos==="up"?'πάνω':'κάτω')+')', D.hNote||'');
    var h2l = (D.kind==="bc" && lv.some(function(u){return +u.m>=200;})) ? L.h2_200 : L.h2;
    if(h2l==null){} else if(h2 > h2l){ if(L.h2max && h2 <= L.h2max) msg.push('⚠️ Υψομετρική μεταξύ εσωτερικών '+pFmt(h2)+' m > '+h2l+' m. '+(D.h2Note||'Ως '+L.h2max+' m μόνο υπό τους όρους του manual.')); else msg.push('⛔ Υψομετρική μεταξύ εσωτερικών '+pFmt(h2)+' m > '+(L.h2max||h2l)+' m.'); }
    else ok.push('Υψομετρική μεταξύ εσωτερικών: '+pFmt(h2)+' m ≤ '+h2l+' m');
  }
  if(D.outInfo){ var oi = D.outInfo(out); if(oi){ html += '<div class="small">🔗 '+esc(oi[0])+'</div>'; if(oi[1]) pKit(oi[1]); } }
  var nBad = msg.filter(function(m){ return m[0]==='⛔'; }).length, nWarn = msg.filter(function(m){ return m.indexOf('⚠️')===0; }).length;
  html += '<details class="ppd"'+(nBad||nWarn?' open':'')+'><summary>📏 Όρια του manual'+(nBad?' · ⛔ '+nBad:nWarn?' · ⚠️ '+nWarn:' · ✅')+'</summary>';
  if(!L && D.limNote) msg.push('ℹ️ '+D.limNote); else if(D.limNote) html += '<div class="small">ℹ️ '+esc(D.limNote)+'</div>';
  html += msg.map(function(m){ return '<div class="pver'+(m[0]==='⛔'?' bad':'')+'">'+esc(m)+'</div>'; }).join("");
  html += ok.length ? '<div class="pver good">✅ '+ok.map(esc).join('<br>✅ ')+'</div>' : '';
  html += '</details>';
  html += '<details class="ppd"><summary>🔌 Μηχανήματα & ρεύμα</summary>'+pUnitsHtml(D, lv, out)+'</details>';
  html += '<details class="ppd" open><summary>📦 Λίστα υλικών</summary>'+pBomHtml()+'</details>';
  var chH = pCharge(D, runs, {out:out, tot:tot, n:n, far:farC, idx:idxL, bs:bsL, u:lv});
  html += chH ? '<details class="ppd" open><summary>🧪 Συμπληρωματικό φρέον'+(PCH_LAST?' · '+pFmt(PCH_LAST.kg)+' kg':'')+'</summary>'+chH+'</details>' : '';
  html = pSummary(D, rows, nBad, nWarn) + html;
  html += '<div style="margin-top:10px"><button class="mini" data-ppprint="1">🖨️ Εκτύπωση / PDF για τον πελάτη</button></div>';
  html += '<div class="small">Οι διατομές σε mm (εξωτερική διάμετρος). Τα μήκη είναι πραγματικά: για ισοδύναμο μήκος πρόσθεσε καμπύλες και κιτ διακλάδωσης όπως λέει το manual.</div>';
  box.innerHTML = html;
}
function pUnitsHtml(D, lv, out){ var P = typeof PUNIT!=="undefined" && PUNIT[D.brand], h = '<div class="lbl" style="margin-top:10px">📐 Μηχανήματα</div><div class="ppscroll"><table class="pptab"><tr><th>#</th><th>Τύπος / απόδοση</th><th>Μοντέλο · διαστάσεις Π×Υ×Β · βάρος · αέρας · στατική</th></tr>';
  lv.forEach(function(u,i){ var r = pUinfo(D,u); h += '<tr><td>'+(i+1)+'</td><td>'+esc(pUnitName(u))+'<br><b>'+esc(pML(D,u.m))+'</b></td><td>'+(r ? esc(pUtxt(r)) : '<span class="small">'+(P?(pUrows(D,u)?'δεν υπάρχει αυτή η απόδοση στον τύπο':'δεν έχω ακόμα επίσημα στοιχεία για αυτόν τον τύπο '+esc(D.brand)):'δεν έχω ακόμα επίσημα στοιχεία για '+esc(D.brand))+'</span>')+'</td></tr>'; });
  h += '</table></div>'; if(P) h += '<div class="small">Πηγή: '+esc(P.src)+(P.ind?' · '+esc(P.ind):'')+'</div>';
  var O = typeof POUT!=="undefined" && POUT[PS.sys], o = O && (O.rows[out] || O.rows[String(+out)]);
  h += '<div class="lbl" style="margin-top:10px">🔌 Παροχή ρεύματος εξωτερικής</div>';
  if(o) h += '<div class="pver good">'+esc(D.outLab(out))+': <b>'+esc(o[0])+'</b>'+(o[1]!=null?' · MCA '+String(o[1]).replace(".",",")+' A':'')+' · ασφάλεια '+o[2]+' A'+(o[3]?' · '+esc(o[3]):'')+'</div><div class="small">'+esc(O.note)+' Πηγή: '+esc(O.src)+'</div>';
  else h += '<div class="small">Δεν έχω ακόμα επίσημα ηλεκτρικά στοιχεία για αυτή την εξωτερική.</div>';
  return h; }
var BOM = {}, KIT = {};
function pBom(sz, L, D, n, names){ if(!L) return; var nm = names || (n===3 ? ['Υγρό','Αναρρόφηση','Υψ./χαμ. πίεση'] : ['Υγρό','Αέριο']);
  for(var i=0;i<Math.min(n, sz.length);i++){ var v = sz[i]; if(isNaN(parseFloat(v))) continue; var k = nm[i]+'|'+v; BOM[k] = (BOM[k]||0) + L; } }
function pKit(k){ if(!k || k==="—" || /μοντέλο από|κατά διατομή/.test(k)) return; KIT[k] = (KIT[k]||0) + 1; }
function pBomHtml(){ var ks = Object.keys(BOM).sort(function(a,b){ var A=a.split("|"), B=b.split("|"); return A[0]<B[0]?-1:A[0]>B[0]?1:parseFloat(B[1])-parseFloat(A[1]); });
  if(!ks.length) return ''; var h = '<div class="lbl" style="margin-top:10px">📦 Λίστα υλικών</div><div class="ppscroll"><table class="pptab"><tr><th>Σωλήνας</th><th>Διατομή</th><th>Μέτρα</th></tr>';
  ks.forEach(function(k){ var a = k.split("|"); h += '<tr><td>'+esc(a[0])+'</td><td><b>'+esc(pD(a[1]))+(PS.inch==="in"?'':' mm')+'</b></td><td>'+pFmt(BOM[k])+'</td></tr>'; });
  var kk = Object.keys(KIT); if(kk.length){ h += '<tr><th colspan="2">Κιτ</th><th>Τεμ.</th></tr>'; kk.forEach(function(k){ h += '<tr><td colspan="2">'+esc(k)+'</td><td>'+KIT[k]+'</td></tr>'; }); }
  return h + '</table></div><div class="small">Μέτρα όπως τα σχεδίασες, χωρίς φύρα. Πρόσθεσε 10–15% για κοψίματα και καμπύλες.</div>'; }
function pChk(msg, ok, v, lim, txt, extra){ if(lim==null) return; if(v > lim) msg.push('⛔ '+txt+': '+pFmt(v)+' m > '+lim+' m. '+(extra||'')); else ok.push(txt+': '+pFmt(v)+' m ≤ '+lim+' m'); }
function pTable(D, rows, cols){
  return '<div class="ppscroll"><table class="pptab"><tr><th>Τμήμα</th><th>Δυναμικότητα κάτω</th><th>Διατομές ('+esc((cols||D.pipes).join(" / "))+')</th><th>Κιτ / μονάδα</th><th>m</th></tr>'+
    rows.map(function(r){ return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td><b>'+esc(r[2])+'</b></td><td>'+esc(r[3])+'</td><td>'+(r[4]!=null&&r[4]!==''?pFmt(r[4]):'')+'</td></tr>'; }).join("")+'</table></div>';
}
// --- συμβάντα ---
document.addEventListener("change", function(e){ var t=e.target; if(!t.classList || !t.classList.contains("ppv")) return; pUpd(t); });
document.addEventListener("input", function(e){ var t=e.target;
  if(t.id==="pp_len"){ var s = PS.sel==="A" ? null : pN(PS.sel); if(PS.sel==="A") PS.A = t.value; else if(s) s.L = t.value; pSave(); pipeCalc(); return; }
  if(!t.classList || !t.classList.contains("ppv") || t.tagName==="SELECT") return; pUpd(t); });
function pUpd(t){ var k = t.id.replace("pp_",""), v = t.value;
  if(k==="out" && PIPE[PS.sys].outInput && PS.unit==="btu") v = String(Math.round(pNum(v)/BTU*100)/100);
  PS[k] = v; if(k==="out" || k==="bsm"){ pSave(); pRerender(); return; } pSave(); pipeCalc(); }
function pRerender(){ if(pRerender.busy) return; var w = document.getElementById("pp_out_box"); if(!w) return; var c = w.closest(".pcalcw"); if(!c || !c.parentNode) return; pRerender.busy = true; try{ var d=document.createElement("div"); d.innerHTML=pipeForm(); c.parentNode.replaceChild(d.firstChild, c); }catch(er){} pRerender.busy = false; pSave(); pipeCalc(); pAct(); }
document.addEventListener("click", function(e){
  var t = e.target.closest && e.target.closest("[data-ppb],[data-pps],[data-ppu],[data-ppin],[data-ppchg],[data-pn],[data-ppl],[data-ppm],[data-ppadd],[data-ppty],[data-ppconv],[data-ppsug],[data-ppnew],[data-ppprint],[data-ppst],[data-ppdl],[data-ppdg],[data-ppundo],[data-ppdn],#pp_delu,#pp_delb,#pp_unsel"); if(!t || !document.getElementById("pp_out_box")) return;
  if(t.hasAttribute("data-ppchg")){ PS.bpick = true; pRerender(); return; }
  if(t.hasAttribute("data-ppb")){ var b = t.getAttribute("data-ppb"); PS.bpick = false; if(PIPE[PS.sys].brand!==b){ var k = Object.keys(PIPE).filter(function(x){ return PIPE[x].brand===b; })[0]; PS.sys = k; PS.sel = null; } pRerender(); return; }
  if(t.hasAttribute("data-pps")){ PS.sys = t.getAttribute("data-pps"); PS.sel = null; pRerender(); return; }
  if(t.hasAttribute("data-ppu")){ PS.unit = t.getAttribute("data-ppu"); pRerender(); return; }
  if(t.hasAttribute("data-pn")){ if(Date.now()-pdSup < 600) return; var v = t.getAttribute("data-pn"); PS.delc = null; PS.sel = v==="A" ? "A" : +v; pipeCalc(); pAct(); return; }
  if(t.id==="pp_unsel"){ PS.sel = null; pipeCalc(); pAct(); return; }
  if(t.hasAttribute("data-ppst")){ var s5 = pN(PS.sel); if(s5){ s5.st = t.getAttribute("data-ppst"); pFitModel(PIPE[PS.sys], s5); } pSave(); pipeCalc(); pAct(); return; }
  if(t.hasAttribute("data-ppdl") || t.hasAttribute("data-ppdg")){ var s6 = pN(PS.sel); if(s6){ var kL = t.hasAttribute("data-ppdl"), v6 = t.getAttribute(kL?"data-ppdl":"data-ppdg"); if(kL) s6.oL = v6||null; else s6.oG = v6||null; if(!s6.oL) delete s6.oL; if(!s6.oG) delete s6.oG; } pSave(); pipeCalc(); pAct(); return; }
  if(t.hasAttribute("data-ppprint")){ PS.sel = null; pipeCalc(); pAct(); document.body.classList.add("ppprint"); setTimeout(function(){ try{ window.print(); }catch(er){} setTimeout(function(){ document.body.classList.remove("ppprint"); }, 800); }, 60); return; }
  if(t.hasAttribute("data-ppundo")){ if(pUndo()){ pSave(); pipeCalc(); pAct(); } else repToast("Δεν υπάρχει κάτι για αναίρεση"); return; }
  if(t.hasAttribute("data-ppdn")){ var di = +t.getAttribute("data-ppdn"), dn = pN(di); if(!dn) return;
    var needOk = dn.t!=="i" && pSub(di).some(function(x){ return pN(x).t==="i"; });
    if(needOk && !t.hasAttribute("data-ppok")){ PS.delc = di; pAct(); return; }
    pSnap(); pDelNode(di); PS.sel = null; PS.delc = null; pSave(); pipeCalc(); pAct(); repToast("Αφαιρέθηκε – ↶ Αναίρεση αν το θες πίσω"); return; }
  if(t.hasAttribute("data-ppnew")){ pSnap(); PS.tree = {k:0, n:[{id:0,t:"o"}], star:pStar(PIPE[PS.sys])}; PS.sel = 0; pSave(); pipeCalc(); pAct(); return; }
  if(t.hasAttribute("data-ppin")){ PS.inch = t.getAttribute("data-ppin"); pRerender(); return; }
  if(t.hasAttribute("data-ppadd")){ var a = t.getAttribute("data-ppadd"), sel = PS.sel==="A" ? null : PS.sel;
    if(sel==null && !PS.tree.star && a.indexOf("i:")===0){ var lv0 = pLeaves(); sel = lv0.length ? lv0[lv0.length-1].id : 0; }
    pSnap(); var keepH = sel!=null && pN(sel) && pN(sel).t==="h"; var nn = a.indexOf("i:")===0 ? pAddUnit(sel, a.slice(2)) : pAddBranch(sel, a); PS.sel = (keepH && nn.t==="i") ? sel : nn.id; pSave(); pipeCalc(); pAct(); if(keepH && nn.t==="i") repToast("Μπήκε στο κολεκτέρ – πάτα ξανά για επόμενη εσωτερική"); return; }
  if(t.hasAttribute("data-ppty")){ var s3 = pN(PS.sel); if(s3){ s3.ty = t.getAttribute("data-ppty"); pFitModel(PIPE[PS.sys], s3); } pSave(); pipeCalc(); pAct(); return; }
  if(t.hasAttribute("data-ppconv")){ pSnap(); var s4 = pN(PS.sel); if(s4) s4.t = t.getAttribute("data-ppconv"); pSave(); pipeCalc(); pAct(); return; }
  if(t.hasAttribute("data-ppsug")){ PS.out = t.getAttribute("data-ppsug"); pRerender(); return; }
  if(t.id==="pp_delb"){ pDelBranch(PS.sel); PS.sel = null; pSave(); pipeCalc(); pAct(); return; }
  if(t.id==="pp_delu"){ pDelUnit(PS.sel); PS.sel = null; pSave(); pipeCalc(); pAct(); return; }
  if(t.hasAttribute("data-ppl")){ var L = t.getAttribute("data-ppl"); if(PS.sel==="A") PS.A = L; else { var s = pN(PS.sel); if(s) s.L = L; } pSave(); pipeCalc(); pAct(); return; }
  if(t.hasAttribute("data-ppm")){ var s2 = pN(PS.sel); if(s2) s2.m = t.getAttribute("data-ppm"); pSave(); pipeCalc(); pAct(); return; }
});
// ===== Συμπληρωματικό φρέον (επίσημοι τύποι manuals) =====
function pSysLab(b, kind){ var hr = kind!=="line";
  if(b==="Daikin") return hr ? "VRV HR (ανάκτηση θερμότητας)" : "VRV (αντλία θερμότητας)";
  if(b==="Mitsubishi Electric") return hr ? "City Multi R2 (ανάκτηση)" : "City Multi Y (αντλία)";
  return hr ? "VRF HR (ανάκτηση θερμότητας)" : "VRF (αντλία θερμότητας)"; }
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
 hisense_h5:{f:{12.7:.093,9.53:.046,6.35:.019}, refr:"R32", src:"Hisense TC&SM Hi-Smart H5 TCY12023016A (2024.02), §3.3 Calculation of Additional Refrigerant (W = W1 + W2)", round:2, addMax:5.5, w0:2.0,
  extra:function(c){ var T={cas4:{9:.25,12:.25,15:.25,19:.25,22:.33,24:.33,27:.48,30:.48,38:.6,48:.6,54:.6}, mini:{5:.14,7:.14,9:.19,12:.19,15:.26,17:.26,19:.26}, duct:{5:.12,7:.12,9:.19,12:.19,15:.23,19:.31,24:.33}, wall:{5:.19,7:.19,9:.19,12:.19,15:.25,19:.32,24:.32,28:.32}};
    var s=0, bad=[], mini=[]; (c.u||[]).forEach(function(u){ var m=+u.m, t=u.ty==="cas1"?"cas4":(u.ty||"wall"), v=null;
      if(t==="cas4"){ v = T.cas4[m]!=null ? T.cas4[m] : T.mini[m]; if(T.cas4[m]!=null && T.mini[m]!=null) mini.push(m); }
      else if(t==="duct") v = T.duct[m]; else if(t==="wall") v = T.wall[m];
      if(v==null) bad.push(pTyName(t)+" "+m); else s+=v; });
    var r=[["W2 εσωτερικές ("+((c.u||[]).length-bad.length)+")", +s.toFixed(2)]];
    if(mini.length) r.push(["Mini κασέτα 4 δρόμων", 0, "Κασέτες "+mini.join(", ")+": υπολόγισα ως κασέτα 4 δρόμων. Αν είναι mini κασέτα, ο πίνακας δίνει 0,19 kg (09/12) ή 0,26 kg (15/19) ανά μονάδα – διόρθωσε στο «Πρόσθετα kg»."]);
    if(bad.length) r.push(["W2: "+bad.join(", "), null, "Δεν υπάρχουν στον πίνακα W2 του manual (μόνο κασέτα, mini κασέτα, καναλάτο, τοίχου)."]);
    return r; }, max:"Αν το πρόσθετο ξεπερνά τα 5,5 kg, το συνολικό μήκος πρέπει να μικρύνει (manual: το 180 m μπορεί να μη φτάνεται λόγω αυτού του ορίου)."},
 hisense_hr:{f:{22.2:.39,19.05:.28,15.88:.19,12.7:.12,9.53:.06,6.35:.03}, src:"Hisense AVWT-76FESR…170FESS installation & maintenance manual P00570Q, §8.3 Table 8.1 (W = W1 + W2 + W3)", round:1,
  addMax:function(o){ return o<=96?28:o<=114?33:o<=154?38.5:o<=170?42:o<=232?46:o<=460?52:null; }, w0:function(o){ var W={76:6.5,96:6.5,114:9.9,136:9,154:10.5,170:10.5}, c=PIPE.hisense_hr.combo[o]||[o], t=0; c.forEach(function(x){ t+=W[x]; }); return Math.round(t*10)/10; },
  extra:function(c){ var big = c.idx.filter(function(m){ return m>=76; }).length, r = Math.round(c.tot/c.out*100);
    return [["W2 εσωτερικές 76/96 kBtu/h ("+big+" × 1 kg)", big],["W3 αναλογία "+r+"%", r<100?0:r<=115?0.5:1.0]]; }},
 fujitsu_jiv:{f:{12.7:.114,9.52:.058,6.35:.021}, src:"Fujitsu AIRSTAGE AJ*126/144LELAH installation manual, §8.3.2", round:2, factory:11.0, totMax:25.6}
};
function pKey(F, d){ var x=parseFloat(d), b=null; Object.keys(F).forEach(function(k){ if(Math.abs(parseFloat(k)-x)<0.25) b=k; }); return b; }
var PCH_LAST = null;
function pSummary(D, rows, nBad, nWarn){
  var r0 = rows[0], main = r0 ? String(r0[2]).split(" → ")[0] : "—", Lsum = 0; rows.forEach(function(r){ var v = pNum(r[r.length-1]); if(v>0) Lsum += v; });
  var ks = Object.keys(KIT), kn = 0; ks.forEach(function(k){ kn += KIT[k]; });
  var st = nBad ? ['bad','⛔ '+nBad+(nBad>1?' προβλήματα':' πρόβλημα')+' με τα όρια – δες «Όρια»'] : nWarn ? ['warn','⚠️ Θέλει προσοχή – δες «Όρια»'] : ['ok','✅ Μέσα στα όρια του manual'];
  var mz = main.split("/").map(function(x){ x = x.trim(); return /^[0-9.,]+$/.test(x) ? 'Ø'+pD(x) : x; }).join(' / ');
  return '<div class="ppsum '+st[0]+'"><div class="ppsh">'+st[1]+'</div><div class="ppsg">'+
    '<div><small>Κύρια γραμμή</small><b>'+esc(mz)+'</b></div>'+
    '<div><small>'+(D.kind==="line"?'Κιτ διακλάδωσης':'Κιτ & '+(D.kind==="bc"?'BC':'BS / switch box'))+'</small><b>'+(kn||'—')+'</b>'+(ks.length?'<i>'+esc(ks.map(function(k){ return (KIT[k]>1?KIT[k]+'× ':'')+k; }).join(', '))+'</i>':'')+'</div>'+
    '<div><small>Πρόσθετο φρέον</small><b>'+(PCH_LAST?pFmt(PCH_LAST.kg)+' kg':'—')+'</b>'+(PCH_LAST?'<i>'+esc(PCH_LAST.refr)+'</i>':'')+'</div>'+
    '<div><small>Μήκος σωληνώσεων</small><b>'+pFmt(Lsum)+' m</b><i>όπως τα έγραψες</i></div></div></div>';
}
function pCharge(D, runs, c){
  var C = PCHG[PS.sys]; PCH_LAST = null; if(!C) return '';
  var F = typeof C.f==="function" ? C.f(c) : C.f, hpF = F.hp, liqF = F.liq || F;
  var agg = {}, miss = 0, unk = [];
  runs.forEach(function(r){ if(!r[1]) return; var tbl = r[2]==="hp" ? hpF : liqF, k = r[0] && pKey(tbl, r[0]);
    if(!k){ miss += r[1]; if(unk.indexOf(r[0])<0) unk.push(r[0]); return; }
    var id = (r[2]==="hp"?"hp":"l")+k; agg[id] = agg[id] || {d:k, L:0, f:tbl[k], hp:r[2]==="hp"}; agg[id].L += r[1]; });
  var rows = Object.keys(agg).map(function(k){ return agg[k]; }).sort(function(a,b){ return b.hp-a.hp || b.d-a.d; });
  var sumP = 0; rows.forEach(function(r){ sumP += r.L*r.f; });
  if(C.mul) sumP *= C.mul;
  var h = '<div class="lbl" style="margin-top:10px">🧪 Συμπληρωματικό φρέον ('+(C.refr||'R410A')+')</div><div class="ppscroll"><table class="pptab"><tr><th>Σωλήνα '+(F.hp?'':'υγρού ')+'Ø</th><th>m</th><th>kg/m</th><th>kg</th></tr>';
  rows.forEach(function(r){ h += '<tr><td>'+(r.hp?'Υψ. πίεση ':'Υγρό ')+esc(pD(r.d))+'</td><td>'+pFmt(r.L)+'</td><td>'+String(r.f).replace(".",",")+'</td><td>'+pFmt(r.L*r.f)+'</td></tr>'; });
  if(C.mul) h += '<tr><td colspan="3">× '+String(C.mul).replace(".",",")+' (συντελεστής manual)</td><td>'+pFmt(sumP)+'</td></tr>';
  if(C.minW1){ var mw = C.minW1(c.out); if(sumP < mw[0]){ h += '<tr><td colspan="3">Ελάχιστο W1 για '+c.out+' HP'+(mw[1]?' ('+esc(mw[1])+')':'')+'</td><td>'+pFmt(mw[0])+'</td></tr>'; sumP = mw[0]; } }
  var tot = sumP, notes = [];
  (C.extra ? C.extra(c) : []).forEach(function(e){ if(e[1]==null){ h += '<tr><td colspan="3">'+esc(e[0])+'</td><td>?</td></tr>'; if(e[2]) notes.push(e[2]); } else { tot += e[1]; h += '<tr><td colspan="3">'+esc(e[0])+'</td><td>'+pFmt(e[1])+'</td></tr>'; if(e[2]) notes.push(e[2]); } });
  var xk = pNum(PS.xkg); if(xk){ tot += xk; h += '<tr><td colspan="3">Πρόσθετα kg (από εσένα)</td><td>'+pFmt(xk)+'</td></tr>'; }
  if(C.noNeg && tot<0) { notes.push("Βγήκε αρνητικό: δεν προσθέτεις φρέον."); tot = 0; }
  var mult = Math.pow(10, C.round||1), shown = (C.up ? Math.ceil(tot*mult-1e-9) : Math.round(tot*mult))/mult; PCH_LAST = {kg:shown, refr:C.refr||'R410A', miss:miss, unk:notes.some(function(n){ return false; })};
  h += '<tr><td colspan="3"><b>Σύνολο συμπληρωματικού'+(miss?' (χωρίς '+pFmt(miss)+' m)':'')+'</b></td><td><b>'+pFmt(shown)+' kg</b></td></tr></table></div>';
  if(C.addMax){ var am = typeof C.addMax==="function" ? C.addMax(c.out) : C.addMax; var w0 = typeof C.w0==="function" ? C.w0(c.out) : C.w0; if(am==null) notes.unshift('Μέγιστο πρόσθετο φρέον για αυτή την εξωτερική: δεν το δίνει ο πίνακας του manual.'+(w0!=null?' Εργοστασιακό '+pFmt(w0)+' kg.':'')); else notes.unshift('Πρόσθετο '+pFmt(shown)+' kg '+(shown<=am?'≤':'>')+' μέγιστο πρόσθετο '+pFmt(am)+' kg'+(shown<=am?' ✅':' ⛔ – μίκρυνε τα μήκη')+'.'+(w0!=null?' Εργοστασιακό '+pFmt(w0)+' kg → σύνολο '+pFmt(shown+w0)+' kg.':'')); }
  if(C.factory){ var all = shown + C.factory; notes.unshift('Εργοστασιακό '+pFmt(C.factory)+' kg + πρόσθετο = '+pFmt(all)+' kg '+(all<=C.totMax?'≤':'>')+' '+pFmt(C.totMax)+' kg'+(all<=C.totMax?' ✅':' ⛔')); }
  if(miss) notes.unshift('⚠️ '+pFmt(miss)+' m σωλήνα προς εσωτερικές δεν έχουν γνωστή διατομή ('+unk.map(String).join(", ")+'). Πρόσθεσε μήκος × kg/m της διατομής σύνδεσης κάθε εσωτερικής.');
  if(C.fNote) notes.unshift(C.fNote(c));
  if(C.max) notes.push(C.max);
  h += notes.map(function(n){ return '<div class="small">• '+esc(n)+'</div>'; }).join('');
  h += '<div class="small">Πηγή: '+esc(C.src)+'. Τα μήκη είναι όσα έγραψες (πραγματικά). Στρογγυλοποίηση όπως το manual.</div>';
  return h;
}
// ===== Παρατεταμένο πάτημα + σύρσιμο στο ✕ για διαγραφή =====
var PDG = null, pdSup = 0, PDL = [], pdSent = 0, pdT0 = 0;
function pdLog(x){ PDL.push(Math.round(performance.now()-pdT0)+"ms "+x); if(PDL.length>40) PDL.shift(); }
function pdReport(why){} // παλιό debug – δεν στέλνει τίποτα
function pdNode(el){ var g = el && el.closest && el.closest(".ppsvg [data-pn]"); if(!g) return null; var v = g.getAttribute("data-pn"); if(v==="A" || v==="0") return null; return +v; }
function pdStart(x, y, id){ pdCancel(); PDL = []; pdT0 = performance.now(); pdLog("start id="+id); PDG = {id:id, x0:x, y0:y, on:false}; PDG.t = setTimeout(pdOn, 400); }
function pdOn(){ if(!PDG) return; var nd = pN(PDG.id); if(!nd){ pdLog("node missing"); PDG=null; return; } PDG.on = true; pdLog("ON (✕ shown)");
  var D = PIPE[PS.sys], lv = pLeaves(), lab = nd.t==="i" ? 'Εσωτερική '+(lv.indexOf(nd)+1)+' – '+pSL(D,nd.m) : (nd.t==="h"?'Κολεκτέρ ':'Διακλάδωση ')+pJlab(nd.id);
  var tr = document.createElement("div"); tr.id = "pptrash"; tr.innerHTML = '<div class="pptx2">✕</div><div class="pptl">Σύρε εδώ για διαγραφή</div>'; document.body.appendChild(tr);
  var gh = document.createElement("div"); gh.id = "ppghost"; gh.textContent = lab; document.body.appendChild(gh);
  pdPos(PDG.x0, PDG.y0); try{ if(navigator.vibrate) navigator.vibrate(25); }catch(e){} }
function pdOver(x, y){ var tr = document.getElementById("pptrash"); if(!tr) return false; var r = tr.getBoundingClientRect(); return x>=r.left-20 && x<=r.right+20 && y>=r.top-30 && y<=r.bottom+20; }
function pdPos(x, y){ var gh = document.getElementById("ppghost"), tr = document.getElementById("pptrash"); if(gh){ gh.style.left = x+"px"; gh.style.top = (y-46)+"px"; } if(tr) tr.classList.toggle("over", pdOver(x,y)); }
function pdMove(x, y, e){ if(!PDG) return; if(!PDG.on){ if(Math.abs(x-PDG.x0)+Math.abs(y-PDG.y0) > 10){ pdLog('moved before ON → cancel'); pdCancel(); } return; } if(!PDG.mv){ PDG.mv=1; pdLog('first move cancelable='+(e&&e.cancelable)); } if(e && e.cancelable) e.preventDefault(); pdPos(x, y); }
function pdEnd(x, y){ if(!PDG) return; clearTimeout(PDG.t); var was = PDG.on, id = PDG.id; PDG = null; pdClean(); pdLog("end on="+was+" over="+pdLastOver);
  if(!was) return; pdSup = Date.now();
  if(!pdLastOver) pdReport("αφέθηκε εκτός ✕");
  if(pdLastOver){ if(PDW) PDW.seen = 1; pSnap(); pDelNode(id); PS.sel = null; PS.delc = null; pSave(); pipeCalc(); pAct(); repToast("Αφαιρέθηκε – ↶ Αναίρεση αν το θες πίσω"); } }
var pdLastOver = false;
function pdClean(){ ["pptrash","ppghost"].forEach(function(i){ var e = document.getElementById(i); if(e) e.parentNode.removeChild(e); }); }
function pdCancel(){ if(PDG){ clearTimeout(PDG.t); PDG = null; } pdClean(); }
document.addEventListener("touchstart", function(e){ if(e.touches.length!==1){ pdCancel(); return; } var id = pdNode(e.target); if(id==null) return; var t = e.touches[0]; pdStart(t.clientX, t.clientY, id); }, {passive:true});
document.addEventListener("touchmove", function(e){ if(!PDG) return; var t = e.touches[0]; pdLastOver = PDG.on && pdOver(t.clientX, t.clientY); pdMove(t.clientX, t.clientY, e); }, {passive:false});
document.addEventListener("touchend", function(e){ if(!PDG) return; var t = e.changedTouches[0]; pdLastOver = PDG.on && pdOver(t.clientX, t.clientY); pdEnd(t.clientX, t.clientY); });
document.addEventListener("touchcancel", function(){ if(PDG){ pdLog("TOUCHCANCEL on="+PDG.on); var on = PDG.on; pdCancel(); pdReport("touchcancel από το iOS"+(on?" (μετά το ✕)":" (πριν το ✕)")); } });
document.addEventListener("mousedown", function(e){ if(e.button!==0) return; var id = pdNode(e.target); if(id==null) return; pdStart(e.clientX, e.clientY, id); });
document.addEventListener("mousemove", function(e){ if(!PDG) return; pdLastOver = PDG.on && pdOver(e.clientX, e.clientY); pdMove(e.clientX, e.clientY, e); });
document.addEventListener("mouseup", function(e){ if(!PDG) return; pdLastOver = PDG.on && pdOver(e.clientX, e.clientY); pdEnd(e.clientX, e.clientY); });
document.addEventListener("contextmenu", function(e){ if(pdNode(e.target)!=null) e.preventDefault(); });

document.addEventListener("selectstart", function(e){ var t = e.target; if(t && t.nodeType===3) t = t.parentNode; if(t && t.closest && t.closest(".ppscroll")) e.preventDefault(); });
document.addEventListener("touchstart", function(e){ var t = e.target; if(t && t.closest && t.closest(".ppsvg") && pdNode(t)==null && !(t.closest(".pphit"))){ PDL = ["touch χωρίς στοιχείο: "+(t.tagName||"?")+"."+(t.getAttribute&&t.getAttribute("class")||"")]; } }, {passive:true});

var PDW = null;
document.addEventListener("touchstart", function(e){ var t = e.target; if(!(t && t.closest && t.closest(".ppsvg"))){ PDW = null; return; } PDW = {t0:Date.now(), tag:(t.tagName||"?")+"."+((t.getAttribute&&t.getAttribute("class"))||""), node:pdNode(t), on:false}; }, {passive:true});
function pdWatch(kind){ if(!PDW) return; if(PDW.node==null){ PDW = null; return; } var d = Date.now()-PDW.t0; if(d>350 && !PDW.seen){ PDL.unshift("WATCH "+kind+" "+d+"ms target="+PDW.tag+" node="+PDW.node+" pdgOn="+(!!pdSup && Date.now()-pdSup<1500)); pdReport("κράτημα "+d+"ms χωρίς διαγραφή ("+kind+")"); } PDW = null; }
document.addEventListener("touchend", function(){ if(PDW && Date.now()-pdSup<1500) PDW.seen = 1; setTimeout(function(){ pdWatch("touchend"); }, 0); }, {passive:true});
document.addEventListener("touchcancel", function(){ pdWatch("touchcancel"); }, {passive:true});
