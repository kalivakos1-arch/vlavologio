// ===== 🧰 Εργαλεία: P/T, F-gas, αέρας =====
var TOOL_IDS = ["pres","pt","charge","fgas","air","conv","inst"];
function fx(x,d){ return (Math.round(x*Math.pow(10,d))/Math.pow(10,d)).toFixed(d).replace(".",","); }
function nval(id){ var e=document.getElementById(id); if(!e) return NaN; var v=parseFloat(String(e.value).replace(",",".")); return isNaN(v)?NaN:v; }
function refOpts(sel, list){ return (list||REF_ORDER).map(function(r){ return '<option value="'+r+'"'+(r===sel?' selected':'')+'>'+r+(REFI[r]?' ('+REFI[r].cls+')':'')+'</option>'; }).join(""); }
function refCard(r){
  var i = REFI[r]; if(!i) return "";
  return '<div class="pext"><b>'+r+'</b> · κατηγορία ασφαλείας <b>'+i.cls+'</b>'+(i.cls==="A1"?' (μη εύφλεκτο)':i.cls==="A2L"?' (ήπια εύφλεκτο)':i.cls==="A3"?' (πολύ εύφλεκτο)':'')+
    ' · GWP '+(i.gwp?'<b>'+i.gwp+'</b>':'— (φυσικό ψυκτικό, εκτός F-gas)')+' · ολίσθηση '+esc(i.glide)+' · λάδι '+esc(i.oil)+
    '<br>🔧 '+esc(i.use)+'<br>⚠️ '+esc(i.note)+'<div class="small" style="margin-top:4px">Πηγή: '+esc(i.src)+'</div></div>';
}

// --- P/T ---
function ptForm(){
  var r = S.ptref || S.pref || "R32", u = S.punit || "bar";
  return '<div class="pcalcw"><div class="lbl">🌡️ Πίεση ↔ θερμοκρασία κορεσμού</div>'+
   '<div class="row4"><label class="small">Ψυκτικό<select id="pt_ref" class="ptv">'+refOpts(r)+'</select></label>'+
   '<label class="small">Μονάδα μανομέτρου<select id="pt_u" class="ptv"><option value="bar"'+(u==="bar"?" selected":"")+'>bar</option><option value="psi"'+(u==="psi"?" selected":"")+'>psi</option></select></label></div>'+
   '<div class="row4"><label>Πίεση μανομέτρου<input id="pt_p" class="ptv" inputmode="decimal" placeholder="π.χ. 9,5"></label>'+
   '<label>ή θερμοκρασία °C<input id="pt_t" class="ptv" inputmode="decimal" placeholder="π.χ. 5"></label></div>'+
   '<div id="pt_out"></div><div id="pt_card"></div><details class="mmg"><summary>📋 Πίνακας ανά 5°C</summary><div id="pt_tab"></div></details></div>';
}
function ptCalc(){
  var o=document.getElementById("pt_out"); if(!o) return;
  var r=document.getElementById("pt_ref").value, u=document.getElementById("pt_u").value; S.ptref=r; S.punit=u;
  var gl = !!PTB[r], p=nval("pt_p"), t=nval("pt_t"), h=[];
  var pu=function(bar){ return u==="psi" ? fx(bar*14.5038,0)+' psi' : fx(bar,2)+' bar'; };
  var tmin=PT[r][0][0], tmax=PT[r][PT[r].length-1][0];
  if(!isNaN(p)){
    var pb = u==="psi"? p/14.5038 : p;
    var td = satT(r,pb), tb = gl? satT(r,pb,"b") : td;
    var warn = (td<tmin-1||td>tmax+1) ? '<div class="small">⚠️ Εκτός πίνακα ('+tmin+'…'+tmax+'°C) – η τιμή είναι προέκταση.</div>' : '';
    h.push('<div class="pver good">'+pu(pb)+' → '+(gl? 'δρόσου (dew) <b>'+fx(td,1)+'°C</b> · φυσαλίδας (bubble) <b>'+fx(tb,1)+'°C</b>' : '<b>'+fx(td,1)+'°C</b>')+warn+'</div>');
  }
  if(!isNaN(t)){
    var pd = satP(r,t), pbb = gl? satP(r,t,"b") : pd;
    h.push('<div class="pver good">'+fx(t,1)+'°C → '+(gl? 'δρόσου <b>'+pu(pd)+'</b> · φυσαλίδας <b>'+pu(pbb)+'</b>' : '<b>'+pu(pd)+'</b>')+' (σχετική)'+((pd<0)?'<div class="small">Αρνητική = κενό (κάτω από την ατμόσφαιρα).</div>':'')+'</div>');
  }
  if(!h.length) h.push('<div class="small">Γράψε πίεση ή θερμοκρασία.</div>');
  o.innerHTML = h.join("");
  document.getElementById("pt_card").innerHTML = refCard(r);
  var rows=[]; for(var x=Math.ceil(tmin/5)*5; x<=tmax; x+=5){ rows.push('<tr><td>'+x+'°C</td><td>'+pu(satP(r,x))+'</td>'+(gl?'<td>'+pu(satP(r,x,"b"))+'</td>':'')+'</tr>'); }
  document.getElementById("pt_tab").innerHTML = '<table class="pttab"><tr><th>Θερμ.</th><th>'+(gl?'Δρόσου (αναρρόφηση)':'Πίεση')+'</th>'+(gl?'<th>Φυσαλίδας (υγρό)</th>':'')+'</tr>'+rows.join("")+'</table><div class="small">Σχετική πίεση (όπως το μανόμετρο), στη στάθμη της θάλασσας.</div>';
}
document.addEventListener("input", function(e){ if(e.target.classList && e.target.classList.contains("ptv")) ptCalc(); });
document.addEventListener("change", function(e){ if(e.target.classList && e.target.classList.contains("ptv")) ptCalc(); });

// --- F-gas ---
function fgasForm(){
  var r = S.fgref || S.pref || "R32";
  return '<div class="pcalcw"><div class="lbl">🌍 Τόνοι CO₂-ισοδύναμου & συχνότητα ελέγχου διαρροής</div>'+
   '<div class="row4"><label class="small">Ψυκτικό<select id="fg_ref" class="fgv">'+refOpts(r)+'<option value="other"'+(r==="other"?" selected":"")+'>Άλλο (γράφω GWP)</option></select></label>'+
   '<label>Κιλά συνολικά (εργοστασίου + επιπλέον)<input id="fg_kg" class="fgv" inputmode="decimal" placeholder="π.χ. 3,2"></label></div>'+
   '<div class="row4" id="fg_gwpw" style="display:none"><label>GWP (από την ετικέτα)<input id="fg_gwp" class="fgv" inputmode="decimal" placeholder="π.χ. 2088"></label></div>'+
   '<label class="small chk"><input type="checkbox" id="fg_herm" class="fgv"> Ερμητικά κλειστό & έτσι επισημασμένο (π.χ. φορητό/παράθυρου/monoblock)</label>'+
   '<label class="small chk"><input type="checkbox" id="fg_lds" class="fgv"> Έχει εγκατεστημένο σύστημα ανίχνευσης διαρροής</label>'+
   '<div id="fg_out"></div></div>';
}
function fgasCalc(){
  var o=document.getElementById("fg_out"); if(!o) return;
  var r=document.getElementById("fg_ref").value; S.fgref=r;
  document.getElementById("fg_gwpw").style.display = r==="other" ? "" : "none";
  var i=REFI[r], kg=nval("fg_kg"), herm=document.getElementById("fg_herm").checked, lds=document.getElementById("fg_lds").checked;
  if(i && i.natural){ o.innerHTML = V("good","<b>"+r+"</b> είναι φυσικό ψυκτικό – δεν μετράει σε τόνους CO₂ του Κανονισμού F-gas. Ισχύουν όμως οι κανόνες ασφαλείας για εύφλεκτα."); return; }
  if(i && i.hcfc){ o.innerHTML = V("mid","<b>R22</b> είναι HCFC – ανήκει στον κανονισμό για τις ουσίες που καταστρέφουν το όζον, όχι στον F-gas. Στην ΕΕ δεν επιτρέπεται συμπλήρωση· μόνο ανάκτηση από πιστοποιημένο τεχνικό."); return; }
  var gwp = i ? i.gwp : nval("fg_gwp");
  if(isNaN(kg) || !gwp){ o.innerHTML = '<div class="small">Γράψε τα κιλά'+(r==="other"?' και το GWP':'')+'. Τα κιλά εργοστασίου γράφονται στο ταμπελάκι της εξωτερικής.</div>'; return; }
  var t = kg*gwp/1000, f, cls="good";
  var lim = herm ? 10 : 5;
  if(t < lim) f = 'Δεν χρειάζεται περιοδικός έλεγχος διαρροής (κάτω από '+lim+' t CO₂'+(herm?' για ερμητικά κλειστό':'')+').';
  else if(t < 50){ f = 'Έλεγχος διαρροής κάθε <b>'+(lds?'24':'12')+' μήνες</b>.'; cls="mid"; }
  else if(t < 500){ f = 'Έλεγχος διαρροής κάθε <b>'+(lds?'12':'6')+' μήνες</b>.'; cls="mid"; }
  else { f = 'Έλεγχος διαρροής κάθε <b>'+(lds?'6':'3')+' μήνες</b>. <b>Υποχρεωτικό</b> σύστημα ανίχνευσης διαρροής (από 500 t CO₂).'; cls="bad"; }
  var kg5 = 5000/gwp;
  o.innerHTML = V(cls, fx(kg,2)+' kg × GWP '+gwp+' = <b>'+fx(t,2)+' t CO₂-ισοδύναμου</b><br>'+f)+
   '<div class="small" style="margin-top:6px">Με '+r+' το όριο των 5 t το «πιάνεις» με <b>'+fx(kg5,2)+' kg</b>. Οι συχνότητες ισχύουν για HFC κατά τον Κανονισμό (ΕΕ) 2024/573, άρθρο 5. Πηγή: Westfalen – F-Gas Regulation (πίνακας άρθρου 5)· UK gov – Checking F gas equipment for leaks.</div>';
}
document.addEventListener("input", function(e){ if(e.target.classList && e.target.classList.contains("fgv")) fgasCalc(); });
document.addEventListener("change", function(e){ if(e.target.classList && e.target.classList.contains("fgv")) fgasCalc(); });

// --- Αέρας: ΔT & σημείο δρόσου ---
function dewPoint(T, RH){ var a=17.625, b=243.04, g=Math.log(RH/100)+a*T/(b+T); return b*g/(a-g); }
function airForm(){
  return '<div class="pcalcw"><div class="lbl">💨 Αέρας εσωτερικής μονάδας</div>'+
   '<div class="row4"><label class="small">Λειτουργία<select id="ai_m" class="aiv"><option value="cool">Ψύξη</option><option value="heat">Θέρμανση</option></select></label></div>'+
   '<div class="row4"><label>Αέρας που μπαίνει (φίλτρα) °C<input id="ai_in" class="aiv" inputmode="decimal" placeholder="π.χ. 27"></label>'+
   '<label>Αέρας που βγαίνει (περσίδα) °C<input id="ai_out" class="aiv" inputmode="decimal" placeholder="π.χ. 14"></label></div>'+
   '<div class="row4"><label>Υγρασία χώρου % (αν έχεις)<input id="ai_rh" class="aiv" inputmode="decimal" placeholder="π.χ. 55"></label>'+
   '<label>Θερμοκρασία επιφάνειας °C (σωλήνας/κανάλι που «ιδρώνει»)<input id="ai_s" class="aiv" inputmode="decimal" placeholder="π.χ. 16"></label></div>'+
   '<div id="ai_o"></div></div>';
}
function airCalc(){
  var o=document.getElementById("ai_o"); if(!o) return;
  var m=document.getElementById("ai_m").value, ti=nval("ai_in"), to=nval("ai_out"), rh=nval("ai_rh"), ts=nval("ai_s"), h=[];
  if(!isNaN(ti)&&!isNaN(to)){
    var dt = m==="cool" ? ti-to : to-ti, lo = m==="cool"?8:15, hi = m==="cool"?14:25;
    var v = dt<lo ? (m==="cool" ? "Μικρή διαφορά: έλλειψη φρέον, χαμηλές στροφές συμπιεστή (δεν είναι σε test run), εξωτερική που δεν αποβάλλει θερμότητα, ή πολύς αέρας/ανεμιστήρας σε μέγιστο με πολύ ζεστό χώρο." : "Μικρή διαφορά: έλλειψη φρέον, 4οδη που δεν αλλάζει πλήρως, ξεπάγωμα σε εξέλιξη ή χαμηλές στροφές συμπιεστή.")
      : dt>hi ? (m==="cool" ? "Μεγάλη διαφορά: λίγος αέρας – βρώμικα φίλτρα/στοιχείο, φτερωτή, ανεμιστήρας σε χαμηλή ταχύτητα. Κίνδυνος να παγώσει το στοιχείο." : "Μεγάλη διαφορά: λίγος αέρας – φίλτρα/στοιχείο/ανεμιστήρας. Μπορεί να κόβει από υψηλή πίεση.")
      : "Μέσα στα συνηθισμένα.";
    h.push(V(dt<lo||dt>hi ? (dt<lo-3||dt>hi+4?"bad":"mid") : "good", 'ΔT = <b>'+fx(dt,1)+' K</b> (συνήθως '+lo+'–'+hi+' K σε '+(m==="cool"?"ψύξη":"θέρμανση")+', μέγιστο ανεμιστήρα) – '+v));
  }
  if(!isNaN(ti)&&!isNaN(rh)&&rh>0&&rh<=100){
    var dp=dewPoint(ti,rh);
    h.push('<div class="pver good">Σημείο δρόσου του χώρου: <b>'+fx(dp,1)+'°C</b></div>');
    if(!isNaN(ts)) h.push(ts<=dp ? V("bad","Η επιφάνεια ("+fx(ts,1)+"°C) είναι κάτω από το σημείο δρόσου → <b>θα ιδρώνει</b>. Χρειάζεται μόνωση/καλύτερη μόνωση στο σημείο (ή φταίει υψηλή υγρασία χώρου).") : V("good","Η επιφάνεια ("+fx(ts,1)+"°C) είναι πάνω από το σημείο δρόσου – δεν θα έπρεπε να ιδρώνει. Αν τρέχει νερό, ψάξε αποχέτευση/λεκάνη."));
  }
  if(!h.length) h.push('<div class="small">Γράψε τις δύο θερμοκρασίες αέρα. Για σημείο δρόσου πρόσθεσε και την υγρασία.</div>');
  h.push('<div class="small" style="margin-top:6px">ΔT: τυπικές τιμές πρακτικής, όχι από manual – εξαρτώνται από την ταχύτητα ανεμιστήρα και την υγρασία. Σημείο δρόσου: τύπος Magnus (σταθερές Alduchov & Eskridge 1996).</div>');
  o.innerHTML = h.join("");
}
document.addEventListener("input", function(e){ if(e.target.classList && e.target.classList.contains("aiv")) airCalc(); });
document.addEventListener("change", function(e){ if(e.target.classList && e.target.classList.contains("aiv")) airCalc(); });

// --- κουμπί Εργαλεία στην κεφαλίδα ---
document.addEventListener("click", function(e){
  if(!e.target.closest("#toolsbtn")) return;
  var c = document.querySelector('[data-s="parts"]'); if(c) c.click();
  setTimeout(function(){ var g=document.getElementById("toolsgrp"); if(g) g.scrollIntoView({behavior:"smooth", block:"start"}); }, 80);
});

// --- σύνδεσμοι manuals μάρκας ---
function manLinks(b){
  var L = b && MANUALS[b.n]; if(!L) return "";
  return '<details class="mmg manl"><summary>📄 Επίσημα manuals '+esc(b.n)+'</summary>'+L.map(function(x){ return '<div class="psec"><a href="'+x[1]+'" target="_blank" rel="noopener">'+esc(x[0])+' ↗</a>'+(x[2]?'<div class="small">'+esc(x[2])+'</div>':'')+'</div>'; }).join("")+'<div class="small">Ανοίγει στον browser – χρειάζεται internet.</div></details>';
}

// --- ένδειξη εξωτερικής όταν δεν υπάρχει αντιστοίχιση ανά κωδικό ---
function lgmvLed(code){
  var n = parseInt(code,10); if(isNaN(n) || String(n)!==String(code).trim()) return "";
  var h=Math.floor(n/100), te=Math.floor((n%100)/10), u=n%10, p=[];
  if(h) p.push("κόκκινο+πράσινο μαζί ×"+h); if(te) p.push("κόκκινο ×"+te); if(u) p.push("πράσινο ×"+u);
  return p.join(" → ");
}
function outBox(t, c){
  if(c[3] || /_outled$|_out$|multiled$/.test(t.key)) return "";
  var o = typeof OUTN!=="undefined" && OUTN[t.key];
  if(!o) return '<div class="ro small" style="opacity:.75">📟 Πλακέτα εξωτερικής: δεν έχει επιβεβαιωθεί ένδειξη για αυτόν τον κωδικό στις πηγές μας.</div>';
  var d = o.lgmv ? lgmvLed(c[0][0]) : "";
  return '<div class="ro">📟 <b>Πλακέτα εξωτερικής:</b> '+(d?'<b>Multi V: '+esc(d)+'</b><br>':'')+esc(o.t)+'<div class="small" style="margin-top:3px">Πηγή: '+esc(o.s)+'</div></div>';
}
