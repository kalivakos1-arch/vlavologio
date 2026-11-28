// ===== Κανάλια καναλάτου: διάμετροι καναλιών & διαστάσεις στομίων =====
// Αέρας & στατική της μονάδας: ΜΟΝΟ από τα επίσημα στοιχεία (PUNIT / DUCTU) ή από το φυλλάδιο που γράφει ο τεχνικός.
// Κανόνες σχεδιασμού (πηγές στο DUCT_SRC):
//  • ταχύτητα σε κλάδο προς στόμιο: κατοικία 2,5–3,6 m/s (500–700 fpm) – κρατάμε ≤2,5 υπνοδωμάτιο, ≤3,0 υπόλοιπα
//  • κεντρικό κανάλι / plenum: κατοικία 3,6–4,6 m/s (700–900 fpm) – κρατάμε ≤4,5
//  • τριβή ≤ 1 Pa/m (Darcy–Weisbach, συντελεστής Altshul–Tsal, ASHRAE Fundamentals κεφ. 21)
//  • στόμιο προσαγωγής διπλής εκτροπής: ενεργός επιφάνεια Ak ≈ 0,50·Π·Υ, πτώση ≈ 0,40·Vk² Pa,
//    ρίψη (0,25 m/s) ≈ 6,0·Vk·√Ak, στάθμη ηχ. ισχύος ≈ 6,5 + 57,5·log(Vk) + 10·log(Ak) dB(A)
//    (προσαρμογή στα σημεία επιλογής που δημοσιεύει η KOOLAIR για 20-DH/21-DH, ΔT −10 K, ύψος 2,7 m, Coanda)
//  • γρίλια επιστροφής: ταχύτητα πρόσοψης ≤ 2,0 m/s (400 fpm, ACCA Manual D), πτώση ≈ 1,1·V² Pa (Hart & Cooley 650)
var DUCT_SRC = [
  "ASHRAE Handbook – Fundamentals, κεφ. 21 «Duct Design» (τριβή Darcy–Weisbach / Altshul–Tsal, τραχύτητα: γαλβανιζέ spiral 0,09 mm, εύκαμπτο τεντωμένο ≈ 3 mm)",
  "HVAC School – Air Velocity Quick Tips: κατοικία κεντρικό 700–900 fpm (3,6–4,6 m/s), κλάδοι 500–700 fpm (2,5–3,6 m/s)",
  "KOOLAIR – κατάλογος Series 20.1, στόμια διπλής εκτροπής 20-DH/21-DH (σημεία επιλογής Q, LwA, ΔPt, X, Vk)",
  "ACCA Manual D / Hart & Cooley 650 return grille: πρόσοψη επιστροφής ~400 fpm (2 m/s)"
];
var DUCT_RT = {
  bed:{n:"Υπνοδωμάτιο", v:2.5, lw:30},
  liv:{n:"Σαλόνι / καθιστικό", v:3.0, lw:35},
  kit:{n:"Κουζίνα", v:3.0, lw:38},
  off:{n:"Γραφείο", v:3.0, lw:35},
  oth:{n:"Άλλος χώρος", v:3.0, lw:38},
  ofo:{n:"Ανοιχτό γραφείο", v:3.0, lw:38},
  shop:{n:"Κατάστημα", v:3.5, lw:42},
  rest:{n:"Εστιατόριο / καφέ", v:3.5, lw:42}
};
var DUCT_D = {flex:[102,127,152,160,203,254,305,356,406], spiro:[100,125,150,160,180,200,250,280,315,355,400,450]};
var DUCT_G = [[200,100],[300,100],[400,100],[500,100],[600,100],[300,150],[400,150],[500,150],[600,150],[800,150],[1000,150],[400,200],[500,200],[600,200],[800,200],[1000,200],[600,250],[800,250],[1000,250],[600,300],[800,300],[1000,300]];
var DUCT_RG = [[300,150],[400,150],[400,200],[500,200],[600,200],[500,250],[600,250],[600,300],[800,300],[600,400],[800,400],[1000,400],[800,500],[1000,500]];
var DSt = (function(){ try{ return JSON.parse(localStorage.getItem("vl_duct")||"null") || null; }catch(e){ return null; } })() ||
  {b:"", m:"", q:"", e:"", emax:"", h:"2.7", gc:"10", vd:"30", gh:"", t:"flex", n:"3", ret:"0", rows:[]};
if(!DSt.md) DSt.md = "multi"; if(!DSt.sp) DSt.sp = {rt:"liv", m2:"", L:"", W:"", u:"1", n:"", len:"", bn:"2"};
if(!DSt.ck) DSt.ck = {q:"", p:"", L:"", H:"", n:"1", ty:"sup", rt:"bed", d:"", len:"", dep:""};
function dSave(){ try{ localStorage.setItem("vl_duct", JSON.stringify(DSt)); }catch(e){} }
var DUCT_TY = {duct_low:"Λεπτό / χαμηλή στατική", duct_mid:"Μέση στατική", duct_high:"Υψηλή στατική", duct:"Καναλάτο"};
function dUnits(b){
  var o = [], add = function(P, tag){ if(!P) return; Object.keys(P).forEach(function(k){ if(!/^duct/.test(k) || !Array.isArray(P[k])) return;
    P[k].forEach(function(r){ o.push({ty:(DUCT_TY[k]||k)+(tag||""), m:r[1], W:r[2], H:r[3], D:r[4], q:r[6], emax:r[7], note:r[8]||"", src:P.src}); }); }); };
  if(typeof DUCTU!=="undefined") add(DUCTU[b], "");
  if(typeof PUNIT!=="undefined") add(PUNIT[b], " (VRF)");
  return o;
}
function dBrands(){ var s = {}; [typeof DUCTU!=="undefined"?DUCTU:{}, typeof PUNIT!=="undefined"?PUNIT:{}].forEach(function(X){ Object.keys(X).forEach(function(b){ if(dUnits(b).length) s[b]=1; }); }); return Object.keys(s).sort(); }
function dEsp(u){ // ονομαστική / εύρος στατικής από τη σημείωση του επίσημου πίνακα
  var n = String(u.note||""), m = n.match(/(?:ονομαστική|εργοστασιακή|nominal|factory)[^0-9]{0,12}(\d+)\s*Pa/i), r = n.match(/(\d+)\s*[–\-]\s*(\d+)\s*Pa/);
  var op = n.match(/επιλογές\s*([0-9\/ ]+)\s*Pa/);
  return {nom: m ? +m[1] : null, min: r ? +r[1] : null, max: u.emax || (r ? +r[2] : null), opts: op ? op[1].split("/").map(function(x){ return +x; }).filter(function(x){ return x > 0; }) : null};
}
// τριβή Pa/m – Darcy–Weisbach με Altshul–Tsal (ASHRAE Fundamentals κεφ. 21)
function dFric(q, Dmm, eps){ var D = Dmm/1000, A = Math.PI*D*D/4, v = q/3600/A, Re = 66.4*D*1000*v, f1 = 0.11*Math.pow(eps/1000/D + 68/Re, 0.25), f = f1 >= 0.018 ? f1 : 0.85*f1 + 0.0028;
  return {v:v, R:f/D*1.204*v*v/2, pd:1.204*v*v/2}; }
function dGrille(q, gh, vmaxLw){
  var best = null; DUCT_G.forEach(function(g){ if(gh && g[1] > gh) return; var Ak = 0.5*g[0]*g[1]/1e6, vk = q/3600/Ak, lw = 6.5 + 57.5*Math.log10(vk) + 10*Math.log10(Ak);
    var c = {L:g[0], H:g[1], Ak:Ak, vk:vk, lw:lw, dp:0.40*vk*vk, x:6.0*vk*Math.sqrt(Ak)}; c.ok = lw <= vmaxLw && vk >= 1.5; if(!c.ok) return; if(!best || c.L*c.H < best.L*best.H) best = c; });
  return best;
}
function dGrilleFit(q, gh, lwMax, depth){
  // στόχος ρίψης: 0,7–1,0 × απόσταση μέχρι τον απέναντι τοίχο (να φτάνει ο αέρας χωρίς να «χτυπά» και να πέφτει πάνω στον άνθρωπο)
  var L = []; DUCT_G.forEach(function(g){ if(gh && g[1] > gh) return; var Ak = 0.5*g[0]*g[1]/1e6, vk = q/3600/Ak; if(vk < 1.5) return;
    var lw = 6.5 + 57.5*Math.log10(vk) + 10*Math.log10(Ak); L.push({L:g[0], H:g[1], Ak:Ak, vk:vk, lw:lw, dp:0.40*vk*vk, x:6.0*vk*Math.sqrt(Ak)}); });
  var ok = L.filter(function(c){ return c.lw <= lwMax; }); if(!ok.length) return null;
  if(depth > 0){ var t = ok.filter(function(c){ return c.x >= 0.7*depth && c.x <= 1.0*depth; }); if(t.length) return t.sort(function(a,b){ return a.L*a.H - b.L*b.H; })[0];
    return ok.sort(function(a,b){ return Math.abs(a.x-0.85*depth) - Math.abs(b.x-0.85*depth); })[0]; }
  return ok.sort(function(a,b){ return a.L*a.H - b.L*b.H; })[0];
}
function dRows(){ var n = Math.max(1, Math.min(12, parseInt(DSt.n)||1)); while(DSt.rows.length < n) DSt.rows.push({rt:DSt.rows.length?"bed":"liv", m2:"", dep:"", len:"", bn:"2"}); DSt.rows.length = n; return DSt.rows; }
function ductForm(){
  var B = dBrands(), U = DSt.b ? dUnits(DSt.b) : [], rows = dRows();
  var o = function(v, t, s){ return '<option value="'+esc(v)+'"'+(s?' selected':'')+'>'+esc(t)+'</option>'; };
  var C = DSt.ck, h = '<div class="pcalcw" id="dck"><div class="lbl">🔎 Έλεγχος στομίου: θα δουλέψει; πόσο θόρυβο κάνει;</div>'+
   '<div class="small" style="margin:2px 0 8px">Γράψε τον αέρα, τη στατική και τη διάσταση του στομίου. Αν έχεις κανάλι, βάλε και Φ / μήκος για πλήρη έλεγχο.</div>'+
   '<div class="row4"><label>Αέρας (m³/h)<input id="k_q" class="kv" inputmode="decimal" value="'+esc(C.q)+'" placeholder="π.χ. 400"></label>'+
   '<label>Στατική μονάδας (Pa)<input id="k_p" class="kv" inputmode="decimal" value="'+esc(C.p)+'" placeholder="π.χ. 30"></label></div>'+
   '<div class="row4"><label>Στόμιο πλάτος (mm)<input id="k_L" class="kv" inputmode="decimal" value="'+esc(C.L)+'" placeholder="π.χ. 400"></label>'+
   '<label>Στόμιο ύψος (mm)<input id="k_H" class="kv" inputmode="decimal" value="'+esc(C.H)+'" placeholder="π.χ. 150"></label></div>'+
   '<div class="row4"><label>Πόσα ίδια στόμια μοιράζονται τον αέρα<input id="k_n" class="kv" inputmode="numeric" value="'+esc(C.n)+'"></label>'+
   '<label>Τύπος<select id="k_ty" class="kv"><option value="sup"'+(C.ty!=="ret"?' selected':'')+'>Προσαγωγή (διπλής εκτροπής)</option><option value="ret"'+(C.ty==="ret"?' selected':'')+'>Επιστροφή (γρίλια)</option></select></label></div>'+
   '<div class="row4"><label>Χώρος<select id="k_rt" class="kv">'+Object.keys(DUCT_RT).map(function(k){ return '<option value="'+k+'"'+(k===C.rt?' selected':'')+'>'+esc(DUCT_RT[k].n)+'</option>'; }).join("")+'</select></label>'+
   '<label>Μέχρι απέναντι τοίχο (m)<input id="k_dep" class="kv" inputmode="decimal" value="'+esc(C.dep)+'" placeholder="προαιρετικό"></label></div>'+
   '<div class="row4"><label>Κανάλι Φ (mm)<input id="k_d" class="kv" inputmode="decimal" value="'+esc(C.d)+'" placeholder="προαιρετικό"></label>'+
   '<label>Μήκος καναλιού (m)<input id="k_len" class="kv" inputmode="decimal" value="'+esc(C.len)+'" placeholder="προαιρετικό"></label></div>'+
   '<div id="k_o"></div></div>';
  h += '<div class="pcalcw" id="dcw"><div class="lbl">🌀 Κανάλια καναλάτου – διάμετροι & στόμια</div>'+
   '<div class="row4"><label>Εφαρμογή<select id="d_md" class="dv">'+o("multi","Ένα μηχάνημα για πολλούς χώρους",DSt.md==="multi")+o("one","Ένα μηχάνημα για έναν χώρο",DSt.md==="one")+o("pro","Ενιαίος επαγγελματικός χώρος (1 ή περισσότερα μηχανήματα)",DSt.md==="pro")+'</select></label><label>&nbsp;</label></div>'+
   '<div class="small" style="margin:2px 0 8px">Τι χρειάζομαι από σένα: μηχάνημα, ύψος ταβανιού, κενό ψευδοροφής, και για κάθε στόμιο τον χώρο, τα m², πόσο μακριά πρέπει να φτάσει ο αέρας και το μήκος του καναλιού.</div>'+
   '<div class="row4"><label>Μάρκα<select id="d_b" class="dv"><option value="">– διάλεξε –</option>'+B.map(function(b){ return o(b,b,b===DSt.b); }).join("")+o("_","Άλλη / γράφω τα στοιχεία", DSt.b==="_")+'</select></label>'+
   (DSt.b && DSt.b!=="_" ? '<label>Μοντέλο<select id="d_m" class="dv"><option value="">– διάλεξε –</option>'+U.map(function(u,i){ return o(String(i), u.m+" · "+u.q+" m³/h · "+u.ty, String(i)===DSt.m); }).join("")+'</select></label>' : '<label>&nbsp;</label>')+'</div>';
  if(DSt.b==="_") h += '<div class="row4"><label>Αέρας μονάδας (υψηλή) m³/h<input id="d_q" class="dv" inputmode="decimal" value="'+esc(DSt.q)+'" placeholder="από το φυλλάδιο"></label>'+
    '<label>Ονομαστική στατική Pa<input id="d_e" class="dv" inputmode="decimal" value="'+esc(DSt.e)+'" placeholder="π.χ. 40"></label></div>'+
    '<div class="row4"><label>Μέγιστη στατική Pa<input id="d_emax" class="dv" inputmode="decimal" value="'+esc(DSt.emax)+'" placeholder="π.χ. 100"></label><label>&nbsp;</label></div>';
  h += '<div class="row4"><label>Ύψος ταβανιού χώρων (m)<input id="d_h" class="dv" inputmode="decimal" value="'+esc(DSt.h)+'"></label>'+
   '<label>Στόμιο κάτω από ταβάνι (cm)<input id="d_gc" class="dv" inputmode="decimal" value="'+esc(DSt.gc)+'"></label></div>'+
   '<div class="row4"><label>Ελεύθερο κενό για κανάλι (cm)<input id="d_vd" class="dv" inputmode="decimal" value="'+esc(DSt.vd)+'" placeholder="ψευδοροφή/κουτί"></label>'+
   '<label>Μέγ. ύψος στομίου (mm)<select id="d_gh" class="dv">'+o("","χωρίς όριο",!DSt.gh)+[100,150,200,250].map(function(x){ return o(String(x), x+" mm", String(x)===DSt.gh); }).join("")+'</select></label></div>'+
   '<div class="row4"><label>Κανάλι<select id="d_t" class="dv">'+o("flex","Εύκαμπτο (flexible)",DSt.t==="flex")+o("spiro","Γαλβανιζέ σπιράλ",DSt.t==="spiro")+'</select></label>'+
   (DSt.md==="multi" ? '<label>Στόμια προσαγωγής<input id="d_n" class="dv" inputmode="numeric" value="'+esc(DSt.n)+'"></label>' : '<label>&nbsp;</label>')+'</div>'+
   '<div class="row4"><label>Επιστροφή<select id="d_rt" class="dv">'+o("0","Γρίλια δίπλα στο μηχάνημα",DSt.ret==="0")+o("1","Με κανάλι επιστροφής",DSt.ret!=="0")+'</select></label>'+
   (DSt.ret!=="0" ? '<label>Μήκος καναλιού επιστροφής (m)<input id="d_rl" class="dv" inputmode="decimal" value="'+esc(DSt.ret)+'"></label>' : '<label>&nbsp;</label>')+'</div>';
  if(DSt.md !== "multi"){ var SP = DSt.sp, ks = DSt.md==="pro" ? ["shop","rest","ofo","off","oth"] : ["liv","bed","kit","off","oth"];
    h += '<div class="dcrow"><div class="small"><b>'+(DSt.md==="pro"?'Επαγγελματικός χώρος':'Ο χώρος')+'</b> – τα στόμια μπαίνουν στη μία μακριά πλευρά και φυσάνε προς την απέναντι.</div>'+
      '<div class="row4"><label>Χρήση<select data-sp="rt" class="dv">'+ks.map(function(k){ return o(k, DUCT_RT[k].n, k===SP.rt); }).join("")+'</select></label>'+
      '<label>m²<input data-sp="m2" class="dv" inputmode="decimal" value="'+esc(SP.m2)+'" placeholder="π.χ. '+(DSt.md==="pro"?'120':'25')+'"></label></div>'+
      '<div class="row4"><label>Μήκος τοίχου με τα στόμια (m)<input data-sp="L" class="dv" inputmode="decimal" value="'+esc(SP.L)+'" placeholder="π.χ. '+(DSt.md==="pro"?'12':'6')+'"></label>'+
      '<label>Πόσο μακριά να φτάσει ο αέρας (m)<input data-sp="W" class="dv" inputmode="decimal" value="'+esc(SP.W)+'" placeholder="π.χ. '+(DSt.md==="pro"?'8':'4')+'"></label></div>'+
      '<div class="row4">'+(DSt.md==="pro"?'<label>Πόσα ίδια μηχανήματα<input data-sp="u" class="dv" inputmode="numeric" value="'+esc(SP.u)+'"></label>':'')+
      '<label>Στόμια (κενό = τα βρίσκω εγώ)<input data-sp="n" class="dv" inputmode="numeric" value="'+esc(SP.n)+'" placeholder="αυτόματα"></label>'+(DSt.md==="pro"?'':'<label>&nbsp;</label>')+'</div>'+
      '<div class="row4"><label>Μέσο μήκος καναλιού ανά στόμιο (m)<input data-sp="len" class="dv" inputmode="decimal" value="'+esc(SP.len)+'" placeholder="π.χ. 4"></label>'+
      '<label>Καμπύλες 90°<input data-sp="bn" class="dv" inputmode="numeric" value="'+esc(SP.bn)+'"></label></div></div>';
  } else
  rows.forEach(function(r, i){
    h += '<div class="dcrow"><div class="small"><b>Στόμιο '+(i+1)+'</b></div><div class="row4"><label>Χώρος<select data-dr="'+i+'" data-dk="rt" class="dv">'+Object.keys(DUCT_RT).map(function(k){ return o(k, DUCT_RT[k].n, k===r.rt); }).join("")+'</select></label>'+
      '<label>m² χώρου<input data-dr="'+i+'" data-dk="m2" class="dv" inputmode="decimal" value="'+esc(r.m2)+'" placeholder="π.χ. 14"></label></div>'+
      '<div class="row4"><label>Μέχρι απέναντι τοίχο (m)<input data-dr="'+i+'" data-dk="dep" class="dv" inputmode="decimal" value="'+esc(r.dep)+'" placeholder="π.χ. 4"></label>'+
      '<label>Μήκος καναλιού (m)<input data-dr="'+i+'" data-dk="len" class="dv" inputmode="decimal" value="'+esc(r.len)+'" placeholder="π.χ. 5"></label></div>'+
      '<div class="row4"><label>Καμπύλες 90°<input data-dr="'+i+'" data-dk="bn" class="dv" inputmode="numeric" value="'+esc(r.bn)+'"></label><label>&nbsp;</label></div></div>';
  });
  h += '<div id="d_o"></div></div>';
  return h;
}
function ductCheck(){
  var O = document.getElementById("k_o"); if(!O) return; var C = DSt.ck, Q = dNum(C.q), P = dNum(C.p), L = dNum(C.L), H = dNum(C.H), n = Math.max(1, parseInt(C.n)||1);
  var f1 = function(x){ return (Math.round(x*10)/10).toLocaleString("el-GR"); }, f0 = function(x){ return String(Math.round(x)); };
  if(!(Q > 0) || !(L > 0) || !(H > 0)){ O.innerHTML = '<div class="small">Γράψε αέρα και διαστάσεις στομίου.</div>'; return; }
  var q = Q/n, rt = DUCT_RT[C.rt] || DUCT_RT.oth, out = [], bad = 0, warn = 0, dp = 0;
  if(C.ty === "ret"){
    var vf = q/3600/(L*H/1e6), dr = 1.1*vf*vf; dp += dr;
    out.push('Ταχύτητα πρόσοψης <b>'+f1(vf)+' m/s</b> · πτώση πίεσης ~'+f0(dr)+' Pa');
    if(vf > 2.5){ bad++; out.push('❌ Πολύ μικρή γρίλια: πάνω από 2,5 m/s σφυρίζει και «πνίγει» το μηχάνημα. Θέλει πρόσοψη ≥ '+(Math.ceil(q/3600/2.0*1e6/H/100)*100)+'×'+f0(H)+' mm ή δεύτερη γρίλια.'); }
    else if(vf > 2.0){ warn++; out.push('⚠ Λίγο μικρή: πάνω από 2,0 m/s ακούγεται. Ιδανικά ≤ 2,0 m/s.'); }
    else out.push('✅ Μέγεθος σωστό για ήσυχη επιστροφή (≤ 2,0 m/s).');
  } else {
    var Ak = 0.5*L*H/1e6, vk = q/3600/Ak, lw = 6.5 + 57.5*Math.log10(vk) + 10*Math.log10(Ak), x = 6.0*vk*Math.sqrt(Ak), dg = 0.40*vk*vk; dp += dg;
    out.push('Ταχύτητα στο στόμιο (ενεργή) <b>'+f1(vk)+' m/s</b> · ρίψη ~<b>'+f1(x)+' m</b> · πτώση πίεσης ~'+f0(dg)+' Pa');
    out.push('Θόρυβος στομίου <b>'+(lw < 20 ? 'κάτω από 20' : '~'+f0(lw))+' dB(A)</b> στάθμη ηχητικής ισχύος (όπως τη δίνουν οι κατάλογοι στομίων). Όριο για '+esc(rt.n.toLowerCase())+': ~'+rt.lw+' dB(A).');
    if(lw > rt.lw + 5){ bad++; out.push('❌ Θα κάνει φασαρία: '+f0(lw - rt.lw)+' dB πάνω από το όριο. Μεγαλύτερο στόμιο ή δεύτερο στόμιο.'); }
    else if(lw > rt.lw){ warn++; out.push('⚠ Στο όριο: θα ακούγεται λίγο σε ήσυχο χώρο ('+f0(lw - rt.lw)+' dB πάνω).'); }
    else out.push('✅ Ήσυχο για '+esc(rt.n.toLowerCase())+'.');
    var g = dGrilleFit(q, 0, rt.lw, dNum(C.dep)||0); if((lw > rt.lw) && g) out.push('Πρόταση: <b>'+g.L+'×'+g.H+' mm</b> → ~'+f0(g.lw)+' dB(A), ρίψη ~'+f1(g.x)+' m.');
    var dep = dNum(C.dep); if(dep > 0){ if(x < 0.7*dep){ warn++; out.push('⚠ Ο αέρας φτάνει ~'+f1(x)+' m αλλά ο χώρος είναι '+f1(dep)+' m: το βάθος του χώρου δεν θα δροσίζει καλά.'); }
      else if(x > 1.15*dep){ warn++; out.push('⚠ Ρίψη ~'+f1(x)+' m μεγαλύτερη από τον χώρο ('+f1(dep)+' m): ο αέρας χτυπά στον απέναντι τοίχο και πέφτει πάνω στους ανθρώπους – άνοιξε τις κατακόρυφες περσίδες.'); }
      else out.push('✅ Η ρίψη ταιριάζει στον χώρο.'); }
    if(vk < 1.5){ warn++; out.push('⚠ Πολύ χαμηλή ταχύτητα: ο κρύος αέρας «πέφτει» αμέσως μπροστά από το στόμιο.'); }
  }
  var D = dNum(C.d), len = dNum(C.len) || 0;
  if(D > 0){ var F = dFric(q, D, 3.0), dd = F.R*len*1.15 + 1.5*F.pd; dp += dd;
    out.push('Κανάλι Φ'+f0(D)+': ταχύτητα <b>'+f1(F.v)+' m/s</b>, τριβή '+f1(F.R)+' Pa/m'+(len?' · απώλεια ~'+f0(dd)+' Pa στα '+f1(len)+' m':'')+' (εύκαμπτο).');
    var sug = null; for(var i=0;i<DUCT_D.flex.length;i++){ var F2 = dFric(q, DUCT_D.flex[i], 3.0); if(F2.v <= rt.v && F2.R <= 1.0){ sug = DUCT_D.flex[i]; break; } }
    if(F.v > rt.v + 1){ bad++; out.push('❌ Το κανάλι είναι μικρό: θα σφυρίζει. Βάλε Φ'+(sug||"μεγαλύτερο")+'.'); } else if(F.v > rt.v){ warn++; out.push('⚠ Το κανάλι είναι λίγο μικρό για '+esc(rt.n.toLowerCase())+' (όριο '+f1(rt.v)+' m/s)'+(sug?' – ιδανικά Φ'+sug:'')+'.'); } }
  if(P > 0){ out.push('Χρειάζονται ~<b>'+f0(dp)+' Pa</b> '+(D>0?'(στόμιο + κανάλι)':'(μόνο το στόμιο)')+' · έχεις '+f0(P)+' Pa.');
    if(dp > P){ bad++; out.push('❌ Δεν φτάνει η στατική: ο αέρας θα βγαίνει λιγότερος από '+f0(Q)+' m³/h. Ανέβασε τη στατική της μονάδας ή μεγάλωσε στόμιο/κανάλι.'); }
    else if(P - dp > 40){ warn++; out.push('⚠ Περισσεύει πολλή στατική ('+f0(P-dp)+' Pa): θα βγαίνει περισσότερος αέρας και θόρυβος από όσο υπολογίζεις. Χαμήλωσε τη ρύθμιση στατικής αν γίνεται.'); }
    else out.push('✅ Η στατική φτάνει.'); }
  var head = bad ? '<div class="plnote" style="background:#ffd9d9;color:#5a0000">❌ Όχι όπως είναι – δες παρακάτω.</div>' : warn ? '<div class="plnote">⚠ Δουλεύει, με επιφυλάξεις.</div>' : '<div class="plnote" style="background:#d9f7e6;color:#053d22">✅ Θα δουλέψει σωστά και ήσυχα.</div>';
  O.innerHTML = head + '<div class="small" style="line-height:1.6">'+out.join("<br>")+(n>1?'<br>Υπολογισμός ανά στόμιο: '+f0(q)+' m³/h.':'')+'</div>'+
    '<div class="small" style="margin-top:6px">Εκτίμηση για στόμιο διπλής εκτροπής / γρίλια επιστροφής με βάση δημοσιευμένα στοιχεία κατασκευαστών (KOOLAIR, Hart & Cooley)· ο πραγματικός θόρυβος στον χώρο είναι συνήθως λίγο χαμηλότερος από τη στάθμη ισχύος.</div>';
}
document.addEventListener("input", function(e){ var t = e.target; if(!t || !t.classList || !t.classList.contains("kv")) return; var m = {k_q:"q", k_p:"p", k_L:"L", k_H:"H", k_n:"n", k_ty:"ty", k_rt:"rt", k_d:"d", k_len:"len", k_dep:"dep"}; if(m[t.id]){ DSt.ck[m[t.id]] = t.value; dSave(); ductCheck(); } });
document.addEventListener("change", function(e){ var t = e.target; if(!t || !t.classList || !t.classList.contains("kv")) return; var m = {k_ty:"ty", k_rt:"rt"}; if(m[t.id]){ DSt.ck[m[t.id]] = t.value; dSave(); ductCheck(); } });
function dNum(v){ var x = parseFloat(String(v==null?"":v).replace(",", ".")); return isNaN(x) ? NaN : x; }
function ductCalc(){
  ductCheck();
  var O = document.getElementById("d_o"); if(!O) return; var h = "", W = [], f1 = function(x){ return (Math.round(x*10)/10).toLocaleString("el-GR"); }, f0 = function(x){ return String(Math.round(x)); };
  var U = null, Q, E = {nom:null, min:null, max:null};
  if(DSt.b && DSt.b!=="_"){ var L = dUnits(DSt.b); U = L[+DSt.m]; if(!U || DSt.m===""){ O.innerHTML = '<div class="small">Διάλεξε μοντέλο.</div>'; return; } Q = U.q; E = dEsp(U); }
  else if(DSt.b==="_"){ Q = dNum(DSt.q); E = {nom:dNum(DSt.e)||null, min:null, max:dNum(DSt.emax)||null}; if(!(Q > 0)){ O.innerHTML = '<div class="small">Γράψε τον αέρα της μονάδας (m³/h, υψηλή ταχύτητα) από το φυλλάδιο.</div>'; return; } }
  else { O.innerHTML = '<div class="small">Διάλεξε μάρκα και μοντέλο.</div>'; return; }
  var MU = 1, SPinfo = null, rows;
  if(DSt.md !== "multi"){ var SP = DSt.sp, rtS = DUCT_RT[SP.rt] || DUCT_RT.oth, dep0 = dNum(SP.W) || 0, ghS = dNum(DSt.gh) || 0;
    MU = DSt.md==="pro" ? Math.max(1, parseInt(SP.u)||1) : 1;
    var nU = parseInt(SP.n) > 0 ? Math.max(1, Math.ceil(parseInt(SP.n)/MU)) : 0, auto = !nU;
    if(auto){ var DLa = DUCT_D[DSt.t] || DUCT_D.flex, epa = DSt.t==="spiro" ? 0.09 : 3.0, vda = dNum(DSt.vd)*10, La = dNum(SP.L) || 0;
      // τα λιγότερα στόμια που: βγαίνουν ήσυχα, η ρίψη δεν ξεπερνά τον χώρο, το κανάλι τους χωράει μονό στο κενό, και η απόσταση μεταξύ τους δεν ξεπερνά τη ρίψη
      for(var nn=1; nn<=12; nn++){ var qa = Q/nn, gq = dGrilleFit(qa, ghS, rtS.lw, dep0); if(!gq || (dep0 && gq.x > 1.15*dep0)) continue;
        var fit = false; for(var k3=0;k3<DLa.length;k3++){ var F3 = dFric(qa, DLa[k3], epa); if(F3.v <= rtS.v && F3.R <= 1.0){ fit = !(vda > 0) || DLa[k3] + 30 <= vda; break; } }
        if(!fit) continue; if(La > 0 && La/(nn*MU) > gq.x) continue; nU = nn; break; }
      if(!nU){ for(var nn2=1; nn2<=12; nn2++){ var gq2 = dGrilleFit(Q/nn2, ghS, rtS.lw, dep0); if(gq2){ nU = nn2; break; } } } if(!nU) nU = 12; }
    rows = []; for(var j=0;j<nU;j++) rows.push({rt:SP.rt, m2:"", dep:SP.W, len:SP.len, bn:SP.bn});
    SPinfo = {n:nU, auto:auto, A:dNum(SP.m2), L:dNum(SP.L), rt:rtS};
  } else rows = dRows();
  var eps = DSt.t==="spiro" ? 0.09 : 3.0, DL = DUCT_D[DSt.t] || DUCT_D.flex, vd = dNum(DSt.vd)*10, gh = dNum(DSt.gh) || 0, Hc = dNum(DSt.h), gc = dNum(DSt.gc);
  var A = rows.map(function(r){ return dNum(r.m2); }), haveA = A.every(function(a){ return a > 0; }), SA = haveA ? A.reduce(function(s,a){ return s+a; },0) : 0;
  var Kb = DSt.t==="spiro" ? 0.25 : 0.8; // καμπύλη 90°: σπιράλ R/D≈1,5 ~0,25 · εύκαμπτο ~0,8 (συντηρητικά)
  var res = rows.map(function(r, i){
    var qi = haveA ? Q*A[i]/SA : Q/rows.length, rt = DUCT_RT[r.rt] || DUCT_RT.oth, d = null;
    for(var k=0;k<DL.length;k++){ var F = dFric(qi, DL[k], eps); if(F.v <= rt.v && F.R <= 1.0){ d = {D:DL[k], F:F}; break; } }
    if(!d){ var Dx = DL[DL.length-1]; d = {D:Dx, F:dFric(qi, Dx, eps), big:true}; }
    d.n = 1;
    // δεν χωράει στο κενό (+30 mm μόνωση); μοιράζουμε σε 2–3 παράλληλα κανάλια που χωράνε
    if(vd > 0 && d.D + 30 > vd){ for(var nn=2; nn<=3 && d.n===1; nn++){ for(var k2=0;k2<DL.length;k2++){ if(DL[k2] + 30 > vd) break; var F2 = dFric(qi/nn, DL[k2], eps); if(F2.v <= rt.v && F2.R <= 1.0){ d = {D:DL[k2], F:F2, n:nn}; break; } } } if(d.n===1) d.nofit = true; }
    var len = dNum(r.len) || 0, bn = parseInt(r.bn)||0, dep = dNum(r.dep) || 0;
    var g = dGrilleFit(qi, gh, rt.lw, dep * ((gc > 30) ? 1/0.8 : 1)); // στόμιο >30 cm κάτω από ταβάνι: χωρίς Coanda η ρίψη πέφτει ~20%
    var two = null; if(!g){ var g2 = dGrilleFit(qi/2, gh, rt.lw, dep); if(g2) two = g2; }
    var gd = g ? g.dp : (two ? two.dp : 25);
    var dp = d.F.R*len*(DSt.t==="flex" ? 1.15 : 1) + bn*Kb*d.F.pd + 1.5*d.F.pd + gd; // +15% εύκαμπτο όχι τελείως τεντωμένο · 1,5·pd είσοδος από plenum + κουτί στομίου
    return {i:i, q:qi, rt:rt, d:d, g:g, two:two, dp:dp, len:len, dep:dep, ach:(haveA && Hc>0) ? qi/(A[i]*Hc) : null};
  });
  // επιστροφή
  var rq = Q, rg = null; DUCT_RG.forEach(function(g){ var vf = rq/3600/(g[0]*g[1]/1e6); if(vf <= 2.0 && (!rg || g[0]*g[1] < rg.L*rg.H)) rg = {L:g[0], H:g[1], v:vf, dp:1.1*vf*vf}; });
  var rdp = rg ? rg.dp : 10, rd = null, rl = DSt.ret!=="0" ? (dNum(DSt.ret)||0) : 0;
  if(rl > 0){ for(var k=0;k<DL.length;k++){ var F = dFric(rq, DL[k], eps); if(F.v <= 3.0 && F.R <= 1.0){ rd = {D:DL[k], F:F}; break; } }
    if(!rd){ var Dm = DL[DL.length-1], n2 = 2; while(n2 < 4 && !(dFric(rq/n2, Dm, eps).v <= 3.0)) n2++; rd = {D:Dm, n:n2, F:dFric(rq/n2, Dm, eps)}; }
    rdp += rd.F.R*rl*(DSt.t==="flex"?1.15:1) + 1.5*rd.F.pd; }
  var worst = Math.max.apply(0, res.map(function(x){ return x.dp; })), tot = worst + rdp;

  if(U) h += '<div class="small" style="margin-top:8px">Μονάδα: <b>'+esc(U.m)+'</b> ('+esc(U.ty)+') · αέρας υψηλής <b>'+f0(Q)+' m³/h</b>'+(E.nom!=null?' · ονομαστική στατική <b>'+E.nom+' Pa</b>':'')+(E.opts?' · ρυθμίσεις '+E.opts.join("/")+' Pa':'')+(E.max?' · μέγιστη <b>'+E.max+' Pa</b>':'')+(U.W?' · σώμα '+U.W+'×'+U.H+'×'+U.D+' mm':'')+'</div>';
  if(SPinfo){ var NT = SPinfo.n*MU;
    h += '<div class="plnote" style="background:#e6f0ff;color:#0b2a55">'+(MU>1?'<b>'+MU+' μηχανήματα</b> × ':'')+'<b>'+SPinfo.n+' στόμια</b>'+(MU>1?' το καθένα = <b>'+NT+' στόμια</b> συνολικά':'')+(SPinfo.auto?' (τα λιγότερα που βγαίνουν ήσυχα, με σωστή ρίψη, μονό κανάλι που χωράει στο κενό και απόσταση μεταξύ τους όχι μεγαλύτερη από τη ρίψη)':'')+'.'+
      (SPinfo.L>0 ? ' Βάλ\'τα ομοιόμορφα στον τοίχο των '+f1(SPinfo.L)+' m: ένα κάθε ~'+f1(SPinfo.L/NT)+' m, το πρώτο ~'+f1(SPinfo.L/NT/2)+' m από τη γωνία.' : '')+
      (SPinfo.A>0 && Hc>0 ? ' Αέρας συνολικά '+f0(Q*MU)+' m³/h → '+f1(Q*MU/(SPinfo.A*Hc))+' αλλαγές/ώρα, '+f1(Q*MU/SPinfo.A)+' m³/h ανά m².' : '')+
      (MU>1?' Κάθε μηχάνημα με δικό του plenum, κανάλια και επιστροφή· ο υπολογισμός παρακάτω είναι για ένα μηχάνημα.':'')+'</div>';
    haveA = true; }
  if(!haveA) W.push("Δεν έγραψες m² σε όλους τους χώρους: μοίρασα τον αέρα ίσα. Με τα m² ο αέρας μοιράζεται ανάλογα με τον χώρο.");
  h += '<table class="dtab"><tr><th>Στόμιο</th><th>Αέρας</th><th>Κανάλι</th><th>Στόμιο προσαγωγής</th></tr>';
  res.forEach(function(x){
    var gtxt = x.g ? '<b>'+x.g.L+'×'+x.g.H+'</b> mm<br><span class="small">Vk '+f1(x.g.vk)+' m/s · ρίψη ~'+f1(x.g.x)+' m · ~'+f0(x.g.lw)+' dB(A)</span>' :
      (x.two ? '<b>2 × '+x.two.L+'×'+x.two.H+'</b> mm<br><span class="small">ένα στόμιο δεν βγαίνει αθόρυβο</span>' : '<span class="plwarn">δεν βρέθηκε στόμιο – μεγάλωσε το μέγ. ύψος στομίου</span>');
    h += '<tr><td><b>'+(x.i+1)+'</b> '+esc(x.rt.n)+'</td><td>'+f0(x.q)+' m³/h</td><td><b>'+(x.d.n>1?x.d.n+' × ':'')+'Φ'+x.d.D+'</b>'+(x.d.n>1?'<br><span class="small">παράλληλα (χωράνε στο κενό)</span>':'')+'<br><span class="small">'+f1(x.d.F.v)+' m/s · '+f1(x.d.F.R)+' Pa/m</span></td><td>'+gtxt+'</td></tr>';
    if(x.d.big) W.push("Στόμιο "+(x.i+1)+": ο αέρας είναι πολύς για ένα κανάλι – βάλε δύο κανάλια προς τον χώρο ή κεντρικό κανάλι.");
    if(x.d.nofit) W.push("Στόμιο "+(x.i+1)+": το Φ"+x.d.D+" δεν χωράει στο κενό των "+f0(vd/10)+" cm (θέλει ~"+Math.ceil((x.d.D+30)/10)+" cm με τη μόνωση). Λύση: δύο μικρότερα κανάλια ή οβάλ/ορθογώνιο κανάλι.");
    if(x.g && x.dep > 0 && (x.g.x < 0.7*x.dep)) W.push("Στόμιο "+(x.i+1)+": ο αέρας φτάνει ~"+f1(x.g.x)+" m αλλά ο χώρος είναι "+f1(x.dep)+" m. Με τόσο αέρα δεν φτάνει αθόρυβα στο βάθος – σκέψου δεύτερο στόμιο στον χώρο ή θέση στομίου στη μεγάλη πλευρά.");
    if(x.g && x.dep > 0 && x.g.x > 1.15*x.dep) W.push("Στόμιο "+(x.i+1)+": η ρίψη (~"+f1(x.g.x)+" m) ξεπερνά τον χώρο ("+f1(x.dep)+" m): ο αέρας θα χτυπά στον απέναντι τοίχο και θα πέφτει – άνοιξε τις κατακόρυφες περσίδες (εκτροπή) ή πάρε μεγαλύτερο στόμιο.");
  });
  h += '</table>';
  // plenum
  var nsp = res.reduce(function(s,x){ return s + x.d.n; }, 0), sumD = res.reduce(function(s,x){ return s + x.d.D*x.d.n; }, 0) + (nsp+1)*40, maxD = Math.max.apply(0, res.map(function(x){ return x.d.D; }));
  var pv = U && U.W ? Q/3600/((U.W/1000)*Math.max(maxD+50, (U.H||200))/1000) : null;
  h += '<div class="psec"><div class="pst">📦 Plenum (κουτί) στην έξοδο</div><div class="psb">Στόμια (σπιράλ/κολάρα) πάνω στο κουτί: '+res.map(function(x){ return (x.d.n>1?x.d.n+"×":"")+"Φ"+x.d.D; }).join(" + ")+
    '. Θέλουν πλάτος ~'+f0(sumD)+' mm σε μία σειρά και ύψος κουτιού ≥ '+f0(maxD+50)+' mm.'+(U && U.W ? (sumD <= U.W ? ' Χωράνε στο πλάτος της μονάδας ('+U.W+' mm).' : ' Δεν χωράνε σε μία σειρά στο πλάτος της μονάδας ('+U.W+' mm): βάλε δύο σειρές ή πλευρικές εξόδους στο κουτί.') : '')+
    (pv && pv > 4.5 ? ' Η ταχύτητα μέσα στο κουτί βγαίνει '+f1(pv)+' m/s – κάν\'το πιο ψηλό.' : '')+' Κουτί μονωμένο εσωτερικά, με κλαπέτα ρύθμισης σε κάθε κολάρο για ζυγοστάθμιση.</div></div>';
  // επιστροφή
  h += '<div class="psec"><div class="pst">↩️ Επιστροφή</div><div class="psb">'+(rg ? 'Γρίλια επιστροφής <b>'+rg.L+'×'+rg.H+' mm</b> (πρόσοψη '+f1(rg.v)+' m/s, όριο 2,0 για να μη σφυρίζει).' : 'Ο αέρας είναι πολύς για μία γρίλια – βάλε δύο γρίλιες επιστροφής.')+
    (rd ? ' Κανάλι επιστροφής <b>'+(rd.n ? rd.n+' × ':'')+'Φ'+rd.D+'</b> ('+f1(rd.F.v)+' m/s).' : '')+' Αν βάλεις φίλτρο στη γρίλια, μέτρα την πτώση του φίλτρου και πρόσθεσέ την στη στατική.</div></div>';
  // στατική
  var vv = '';
  if(E.max && tot > E.max) vv = '<div class="plnote" style="background:#ffd9d9;color:#5a0000">❌ Χρειάζονται ~'+f0(tot)+' Pa αλλά η μονάδα δίνει έως '+E.max+' Pa. Μεγάλωσε τις διαμέτρους, κόψε μήκος/καμπύλες ή διάλεξε μονάδα υψηλότερης στατικής.</div>';
  else if(E.nom != null && tot > E.nom) vv = '<div class="plnote">⚙️ Χρειάζονται ~'+f0(tot)+' Pa: ρύθμισε τη στατική της μονάδας στα <b>'+Math.ceil(tot/10)*10+' Pa</b> (ονομαστική '+E.nom+' Pa'+(E.max?', μέγιστη '+E.max+' Pa':'')+') από το χειριστήριο / την πλακέτα, όπως λέει το εγχειρίδιο εγκατάστασης.'+(E.max?'':' Τη μέγιστη στατική αυτής της μονάδας δεν την έχω από επίσημη πηγή – έλεγξε στο εγχειρίδιο ότι φτάνει.')+'</div>';
  else if(E.nom != null) vv = '<div class="plnote" style="background:#d9f7e6;color:#053d22">✅ Χρειάζονται ~'+f0(tot)+' Pa – φτάνει η ονομαστική στατική ('+E.nom+' Pa).'+(E.nom - tot > 30 ? ' Περισσεύει αρκετή: αν η μονάδα ρυθμίζεται, χαμήλωσέ τη για λιγότερο θόρυβο.' : '')+'</div>';
  else if(E.opts && E.opts.length){ var pick = E.opts.filter(function(x){ return x >= tot; })[0];
    vv = pick != null ? '<div class="plnote">⚙️ Χρειάζονται ~'+f0(tot)+' Pa: διάλεξε τη ρύθμιση στατικής <b>'+pick+' Pa</b> (η μονάδα έχει '+E.opts.join(" / ")+' Pa). Μη βάλεις μεγαλύτερη από όση χρειάζεται: κάνει θόρυβο.</div>' :
      '<div class="plnote" style="background:#ffd9d9;color:#5a0000">❌ Χρειάζονται ~'+f0(tot)+' Pa – πάνω από τη μεγαλύτερη ρύθμιση της μονάδας ('+Math.max.apply(0,E.opts)+' Pa). Μεγάλωσε διαμέτρους / κόψε μήκος.</div>'; }
  else if(E.min != null && E.max) vv = '<div class="plnote">⚙️ Χρειάζονται ~'+f0(tot)+' Pa: η μονάδα ρυθμίζεται '+E.min+'–'+E.max+' Pa – ρύθμισέ τη στα <b>'+Math.max(E.min, Math.ceil(tot/5)*5)+' Pa</b> περίπου, όπως λέει το εγχειρίδιο εγκατάστασης.</div>';
  else vv = '<div class="plnote">Χρειάζονται ~'+f0(tot)+' Pa εξωτερική στατική'+(E.max?' (η μονάδα δίνει έως '+E.max+' Pa)':'')+'. Η ονομαστική ρύθμιση της μονάδας δεν είναι στα επίσημα στοιχεία που έχω – δες το εγχειρίδιο εγκατάστασης.</div>';
  h += '<div class="psec"><div class="pst">📊 Στατική πίεση (πιο δυσμενής διαδρομή + επιστροφή)</div><div class="psb">Προσαγωγή ~'+f0(worst)+' Pa · επιστροφή ~'+f0(rdp)+' Pa · σύνολο ~'+f0(tot)+' Pa'+vv+'</div></div>';
  if(Hc > 3.5) W.push("Ψηλό ταβάνι ("+f1(Hc)+" m): στη θέρμανση ο ζεστός αέρας μένει ψηλά – γύρνα τις οριζόντιες περσίδες προς τα κάτω τον χειμώνα.");
  if(gc > 30) W.push("Το στόμιο είναι "+f0(gc)+" cm κάτω από το ταβάνι: χάνεται το φαινόμενο Coanda και ο κρύος αέρας «πέφτει» νωρίτερα. Καλύτερα ως 20–30 cm από το ταβάνι.");
  res.forEach(function(x){ if(x.ach != null) x.achTxt = f1(x.ach); });
  if(haveA && Hc > 0 && !SPinfo) h += '<div class="small" style="margin-top:6px">Αλλαγές αέρα/ώρα: '+res.map(function(x){ return (x.i+1)+": "+x.achTxt; }).join(" · ")+' (πληροφοριακά· την ψυκτική ισχύ ανά χώρο τη δίνει μελέτη φορτίων).</div>';
  if(W.length) h += '<div class="plnote">'+W.map(function(w){ return "⚠ "+esc(w); }).join("<br>")+'</div>';
  h += '<div class="small" style="margin-top:8px">Οι διαστάσεις στομίων είναι εκτίμηση για στόμιο <b>διπλής εκτροπής</b> (τύπου 20-DH) με βάση δημοσιευμένα σημεία επιλογής κατασκευαστή· επιβεβαίωσε θόρυβο και ρίψη στον κατάλογο του στομίου που θα αγοράσεις. Ταχύτητες: κλάδος ≤ '+'2,5 m/s υπνοδωμάτιο / 3,0 m/s υπόλοιπα, τριβή ≤ 1 Pa/m.</div>'+
    '<div class="small" style="margin-top:4px">Πηγές: '+DUCT_SRC.map(esc).join(" · ")+(U && U.src ? ' · Μονάδα: '+esc(U.src) : '')+'</div>';
  // ---- λίστα υλικών ----
  var mu = MU || 1, bom = [], dm = {}, gm = {}, bx = {}, noLen = false, typ = DSt.t==="spiro" ? "γαλβανιζέ σπιράλ" : "εύκαμπτο μονωμένο";
  res.forEach(function(x){ var k = "Φ"+x.d.D; if(!(x.len > 0)) noLen = true; dm[k] = (dm[k]||0) + (x.len||0)*x.d.n*mu;
    bx[k] = (bx[k]||0) + x.d.n*mu;
    if(x.g){ var gk = x.g.L+"×"+x.g.H; gm[gk] = (gm[gk]||0) + mu; } else if(x.two){ var gk2 = x.two.L+"×"+x.two.H; gm[gk2] = (gm[gk2]||0) + 2*mu; } });
  Object.keys(dm).forEach(function(k){ bom.push("Κανάλι "+typ+" "+k+": "+(dm[k] > 0 ? Math.ceil(dm[k]*1.1)+" m (+10% φύρα)" : "– γράψε μήκη")); });
  if(rd) bom.push("Κανάλι επιστροφής "+typ+" "+(rd.n?rd.n+"×":"")+"Φ"+rd.D+": "+Math.ceil(rl*1.1*(rd.n||1)*mu)+" m");
  Object.keys(gm).forEach(function(k){ bom.push("Στόμιο προσαγωγής διπλής εκτροπής "+k+" mm: "+gm[k]+" τεμ."); });
  Object.keys(bx).forEach(function(k){ bom.push("Κουτί (plenum) στομίου με κολάρο "+k+" (ύψος κουτιού ≥ "+(parseInt(k.slice(1))+20)+" mm): "+bx[k]+" τεμ."); });
  bom.push("Plenum εξόδου μονάδας"+(U && U.W ? " πλάτος "+U.W+" mm":"")+", ύψος ≥ "+f0(maxD+50)+" mm, μονωμένο: "+mu+" τεμ.");
  Object.keys(bx).forEach(function(k){ bom.push("Κολάρο "+k+" με κλαπέτο ρύθμισης στο plenum: "+bx[k]+" τεμ."); });
  if(rg) bom.push("Γρίλια επιστροφής "+rg.L+"×"+rg.H+" mm (με φίλτρο αν δεν έχει η μονάδα): "+mu+" τεμ.");
  h += '<div class="psec"><div class="pst">🧾 Λίστα υλικών'+(mu>1?' (για '+mu+' μηχανήματα)':'')+'</div><div class="psb">'+bom.map(function(b){ return "• "+esc(b); }).join("<br>")+
    (noLen ? '<br><span class="plwarn">Γράψε μήκη καναλιών για να βγουν τα μέτρα.</span>' : '')+'</div></div>';
  h += '<div class="row4" style="margin-top:8px"><button class="btn" id="d_share" type="button">📤 Στείλε τη μελέτη (Viber / email)</button><button class="btn" id="d_copy" type="button">📋 Αντιγραφή</button></div>';
  O.innerHTML = h;
  var txt = function(){ var L = ["ΜΕΛΕΤΗ ΚΑΝΑΛΙΩΝ ΚΑΝΑΛΑΤΟΥ"]; if(U) L.push("Μονάδα: "+(DSt.b||"")+" "+U.m+" – "+f0(Q)+" m³/h");
    res.forEach(function(x){ L.push("Στόμιο "+(x.i+1)+" ("+x.rt.n+"): "+f0(x.q)+" m³/h · κανάλι "+(x.d.n>1?x.d.n+"×":"")+"Φ"+x.d.D+" · στόμιο "+(x.g ? x.g.L+"×"+x.g.H+" (~"+(x.g.lw<20?"<20":f0(x.g.lw))+" dB(A), ρίψη ~"+f1(x.g.x)+" m)" : x.two ? "2×"+x.two.L+"×"+x.two.H : "–")); });
    if(rg) L.push("Επιστροφή: γρίλια "+rg.L+"×"+rg.H+(rd?" · κανάλι "+(rd.n?rd.n+"×":"")+"Φ"+rd.D:""));
    var sv = (O.querySelector(".psec .plnote")||{}).innerText; if(sv) L.push("Στατική: "+sv.replace(/\s+/g," ").trim());
    L.push(""); L.push("Υλικά:"); bom.forEach(function(b){ L.push("• "+b); }); L.push(""); L.push("Βλαβολόγιο Κλιματισμού – εκτίμηση, επιβεβαίωσε με καταλόγους κατασκευαστών."); return L.join("\n"); };
  var bs = document.getElementById("d_share"), bc = document.getElementById("d_copy");
  if(bs) bs.onclick = function(){ var t = txt(); if(navigator.share){ navigator.share({title:"Μελέτη καναλιών", text:t}).catch(function(){}); } else { try{ navigator.clipboard.writeText(t); bs.textContent = "✅ Αντιγράφηκε"; }catch(e){} } };
  if(bc) bc.onclick = function(){ try{ navigator.clipboard.writeText(txt()).then(function(){ bc.textContent = "✅ Αντιγράφηκε"; }); }catch(e){} };
}
document.addEventListener("input", function(e){ var t = e.target; if(!t || !t.classList || !t.classList.contains("dv")) return; dTake(t, false); });
document.addEventListener("change", function(e){ var t = e.target; if(!t || !t.classList || !t.classList.contains("dv")) return; dTake(t, true); });
function dTake(t, ch){
  var map = {d_b:"b", d_m:"m", d_q:"q", d_e:"e", d_emax:"emax", d_h:"h", d_gc:"gc", d_vd:"vd", d_gh:"gh", d_t:"t", d_n:"n"}, re = false;
  if(t.id==="d_rt"){ DSt.ret = t.value==="0" ? "0" : (DSt.ret!=="0" ? DSt.ret : "3"); re = true; }
  else if(t.id==="d_rl"){ DSt.ret = t.value || "0.1"; }
  else if(t.id==="d_md"){ DSt.md = t.value; if(DSt.md==="pro" && ["shop","rest","ofo","off","oth"].indexOf(DSt.sp.rt)<0) DSt.sp.rt = "shop"; if(DSt.md==="one" && ["liv","bed","kit","off","oth"].indexOf(DSt.sp.rt)<0) DSt.sp.rt = "liv"; re = true; }
  else if(t.hasAttribute("data-sp")){ DSt.sp[t.getAttribute("data-sp")] = t.value; }
  else if(t.hasAttribute("data-dr")){ var r = dRows()[+t.getAttribute("data-dr")]; if(r) r[t.getAttribute("data-dk")] = t.value; }
  else if(map[t.id]){ DSt[map[t.id]] = t.value; if(t.id==="d_b"){ DSt.m = ""; re = true; } if(t.id==="d_m" || t.id==="d_t" || t.id==="d_gh") re = re || false; if(t.id==="d_n" && ch) re = true; }
  dSave();
  if(re){ var w = document.getElementById("dcw"); if(w){ var tmp = document.createElement("div"); tmp.innerHTML = ductForm(); w.parentNode.replaceChild(tmp.querySelector("#dcw"), w); } }
  ductCalc();
}
PARTS.push({id:"duct", icon:"🌀", name:"Κανάλια καναλάτου (διάμετροι & στόμια)", body:[
 ["Πώς το χρησιμοποιείς","Διάλεξε μάρκα και μοντέλο (ή «Άλλη» και γράψε αέρα/στατική από το φυλλάδιο). Γράψε ύψος ταβανιού, πόσο κάτω από το ταβάνι μπαίνουν τα στόμια, το ελεύθερο κενό για το κανάλι και πόσα στόμια θέλεις. Για κάθε στόμιο: χώρος, m², πόσο μακριά πρέπει να φτάσει ο αέρας (μέχρι τον απέναντι τοίχο), μήκος καναλιού και καμπύλες."],
 ["Έλεγχος στομίου","Στο πάνω κουτί γράφεις αέρα (m³/h), στατική (Pa) και διάσταση στομίου: σου λέει αν θα δουλέψει, πόσο θόρυβο κάνει σε dB(A), πόσο μακριά φτάνει ο αέρας και αν φτάνει η στατική. Με Φ και μήκος καναλιού ελέγχει και το κανάλι."],
 ["Εφαρμογές","• Ένα μηχάνημα για πολλούς χώρους (σπίτι με plenum και κανάλι ανά δωμάτιο). • Ένα μηχάνημα για έναν χώρο (π.χ. καναλάτο μόνο για το σαλόνι – για κάθε δωμάτιο με δικό του καναλάτο κάνεις ξεχωριστό υπολογισμό). • Ενιαίος επαγγελματικός χώρος (κατάστημα, καφέ, γραφείο) με ένα ή περισσότερα ίδια μηχανήματα: βρίσκει πόσα στόμια χρειάζονται και σε τι απόσταση μπαίνουν."],
 ["Τι βγάζει","Αέρα ανά στόμιο (ανάλογα με τα m²), διάμετρο καναλιού Φ για κάθε κλάδο, διαστάσεις στομίου προσαγωγής με ρίψη και θόρυβο, γρίλια επιστροφής, plenum και τη στατική που πρέπει να ρυθμίσεις στη μονάδα."],
 ["Τι να ρωτήσεις / μετρήσεις στο σημείο","• Μοντέλο εσωτερικής (ταμπέλα) • Ύψος ταβανιού • Πόσο χώρο έχεις πάνω από την ψευδοροφή ή μέσα στο κουτί (cm) • Μέγιστο ύψος για το στόμιο (σοφίτα/κουτί) • Για κάθε χώρο: m², απόσταση από το στόμιο μέχρι τον απέναντι τοίχο, μήκος διαδρομής καναλιού, πόσες στροφές • Πού θα μπει η επιστροφή και αν θέλει κανάλι."],
 ["Τι ΔΕΝ κάνει","Δεν κάνει μελέτη ψυκτικών φορτίων: τον αέρα τον μοιράζει με τα m². Δεν σχεδιάζει κεντρικό κανάλι με διακλαδώσεις (μόνο plenum με ξεχωριστό κανάλι ανά στόμιο). Γραμμικά στόμια (slot) και τετράγωνα διαχύτες ταβανιού δεν περιλαμβάνονται ακόμα."]
]});
