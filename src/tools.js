// ===== 🧰 Εργαλεία: P/T, F-gas, αέρας =====
var TOOL_IDS = ["pipe","pres","pt","charge","fgas","air","conv","inst"];
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

function hmSet(open){
  var hm=document.getElementById("hmenu"), bk=document.getElementById("hmback"), mb=document.getElementById("menubtn");
  if(hm) hm.hidden=!open; if(bk) bk.hidden=!open; if(mb) mb.setAttribute("aria-expanded", String(!!open));
  if(open){ var v=document.getElementById("hmver"); if(v && !v.textContent){ var m=document.querySelector('meta[name="vl-ver"]'); v.textContent=m?"Έκδοση "+m.content.replace("vl-v",""):""; } }
}
document.addEventListener("keydown", function(e){ if(e.key==="Escape"){ var hm=document.getElementById("hmenu"); if(hm && !hm.hidden) hmSet(false); } });
// --- κάτω μπάρα: Βλάβη / Εργαλεία / Πελάτες / Γνώσεις, μενού ⋯ ---
function navSync(){
  var m = S.src==="parts" && !S.focus ? (S.pmode==="tools" ? "tools" : "kb") : "code";
  document.documentElement.classList.toggle("mode-tools", m==="tools");
  document.documentElement.classList.toggle("mode-kb", m==="kb");
  [["nav_code","code"],["toolsbtn","tools"],["nav_kb","kb"]].forEach(function(x){ var b=document.getElementById(x[0]); if(b) b.classList.toggle("on", m===x[1]); });
}
function navGo(mode){
  hmSet(false);
  if(mode==="code"){ S.focus = null; if(S.src==="parts") S.src = "in"; }
  else { S.focus = null; S.src = "parts"; if(S.pmode!==mode){ S.pmode = mode; var P = partById(S.part); if(P && (TOOL_IDS.indexOf(P.id)>=0) !== (mode==="tools")) S.part = null; } }
  renderSrc(); renderResults(); persist(); navSync(); window.scrollTo(0,0);
}
document.addEventListener("click", function(e){
  var el = e.target.closest("#toolsbtn,#nav_code,#nav_kb,#menubtn,#ballbtn,[data-pc]");
  var hm = document.getElementById("hmenu");
  if(hm && !hm.hidden && !e.target.closest("#hmenu,#menubtn")) hmSet(false);
  if(!el){ return; }
  if(el.id==="toolsbtn"){ navGo("tools"); return; }
  if(el.id==="nav_code"){ navGo("code"); return; }
  if(el.id==="nav_kb"){ navGo("kb"); return; }
  if(el.id==="menubtn"){ hmSet(hm.hidden); return; }
  if(el.id==="ballbtn"){ S.ball = !S.ball; renderBrands(); return; }
  if(el.hasAttribute("data-pc")){ var id = el.getAttribute("data-pc"); S.pmode = TOOL_IDS.indexOf(id)>=0 ? "tools" : "kb"; setTimeout(navSync, 0); }
});
document.addEventListener("click", function(e){ if(e.target.closest("#hmenu .hmi")){ setTimeout(function(){ hmSet(false); }, 0); } });
document.addEventListener("click", function(e){ if(e.target.closest("[data-s],[data-gopart],#fzback,[data-q]")) setTimeout(navSync, 0); });
setTimeout(navSync, 0);

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
  if(c[3] || /_outled$|_out$|multiled$|_inled$|_inled_recall$/.test(t.key)) return "";
  var o = typeof OUTN!=="undefined" && OUTN[t.key];
  if(!o) return outRender("Δεν έχει επιβεβαιωθεί ένδειξη για αυτόν τον κωδικό στις πηγές μας.");
  var d = o.lgmv ? lgmvLed(c[0][0]) : "";
  return outRender((d?'LED εξωτερικής: '+d+' || ':'')+o.t, o.s);
}

// ===== Οπτική απόδοση ένδειξης πλακέτας εξωτερικής (λυχνίες σαν στο manual) =====
var LEDCOL={"κίτρινο":"y","κίτρινη":"y","yellow":"y","πράσινο":"g","πράσινη":"g","green":"g","κόκκινο":"r","κόκκινη":"r","red":"r"};
function ledDot(col, st, n, lab){
  var t = st==="on"?"αναμμένο":st==="off"?"σβηστό":"αναβοσβήνει"+(n?" ×"+n:"");
  return '<span class="ld" title="'+esc((lab?lab+": ":"")+t)+'"><i class="lq '+col+' '+st+'"></i>'+(n?'<b class="lx">×'+n+'</b>':'')+(lab?'<small>'+esc(lab)+'</small>':'')+'</span>';
}
function ledViz(s){
  var out=[], m, re;
  // Α. «Κίτρινο σβηστό · Πράσινο αναβοσβήνει · Κόκκινο αναμμένο» (πρώτη τριάδα)
  re=/(Κίτρινο|Πράσινο|Κόκκινο)\s+(αναμμένο|σβηστό|αναβοσβήνει)/g; var a=[];
  while((m=re.exec(s)) && a.length<3){ a.push(ledDot(LEDCOL[m[1].toLowerCase()], m[2]==="αναμμένο"?"on":m[2]==="σβηστό"?"off":"bl", 0, m[1])); }
  if(a.length===3) return a.join("");
  // Β. «LED1 πράσινο ×3 · LED2 κόκκινο ×2»
  re=/LED(\d)\s+(πράσινο|κόκκινο|κίτρινο)\s+×(\d+)/g; a=[];
  while((m=re.exec(s)) && a.length<2){ a.push(ledDot(LEDCOL[m[2]], "bl", m[3], "LED"+m[1])); }
  if(a.length) return a.join("");
  // Γ. Toshiba «D800–D804 = ◎○○○○» / «mode 1 = ●●○○●»
  re=/(D800–D804|mode 1|mode 2)\s*=\s*([●○◎]{5})/g; var rows=[];
  while((m=re.exec(s))){ var lab=m[1]==="D800–D804"?"RAV":m[1]; rows.push('<span class="lrow"><em>'+esc(lab)+'</em>'+m[2].split("").map(function(ch,i){ return ledDot(i<5?"y":"g", ch==="●"?"on":ch==="○"?"off":"bl", 0, "D80"+i); }).join("")+'</span>'); }
  if(rows.length) return rows.join("");
  // Δ. «Κόκκινο LED × 4», «Κίτρινο × 8», «Κόκκινο LED ×8»
  m=/(Κόκκινο|Κίτρινο|Πράσινο)(?:\s+LED)?\s*×\s*(\d+)/.exec(s);
  if(m) return ledDot(LEDCOL[m[1].toLowerCase()], "bl", m[2], m[1]);
  m=/(Κίτρινο|Κόκκινο|Πράσινο)(?:\s+LED)?\s+(?:συνεχώς\s+)?αναμμένο/.exec(s);
  if(m) return ledDot(LEDCOL[m[1].toLowerCase()], "on", 0, m[1]);
  // Ε. LG «κόκκινο ×2 → πράσινο ×1»
  re=/(κόκκινο\+πράσινο μαζί|κόκκινο|πράσινο)\s+×(\d+)/g; a=[];
  while((m=re.exec(s))){ if(m[1].indexOf("μαζί")>0) a.push('<span class="lpair">'+ledDot("r","bl",0,"")+ledDot("g","bl",m[2],"μαζί")+'</span>'); else a.push(ledDot(LEDCOL[m[1]],"bl",m[2],m[1])); }
  if(a.length) return a.join('<span class="larr">→</span>');
  // ΣΤ. 7-segment
  m=/7-seg(?:ment)?[^:]*:\s*([^(–—\[]+)/.exec(s);
  if(m){ var cs=m[1].split(/\s+ή\s+|\s*…\s*/).map(function(x){return x.trim();}).filter(function(x){return /^[A-Z]?[0-9A-Z]{1,3}(?:-\d)?$/.test(x);});
    if(cs.length) return cs.map(function(x){return '<span class="seg7">'+esc(x)+'</span>';}).join('<span class="larr">ή</span>'); }
  m=/ίδιο κωδικό «([^»]{1,8})»/.exec(s);
  if(m) return '<span class="seg7">'+esc(m[1])+'</span>';
  return "";
}
function outRender(txt, src){
  var raw=String(txt).split(" || "), parts=[], seen={};
  raw.forEach(function(p){ var i=p.indexOf(" — "), main=i>0?p.slice(0,i):p, tag=i>0?p.slice(i+3):"";
    if(seen[main]!==undefined){ var q=parts[seen[main]]; q.tag=(q.tag?q.tag+" ":"")+"Ίδια ένδειξη και σε: "+tag; } else { seen[main]=parts.length; parts.push({main:main,tag:tag}); } });
  var keyShown=false;
  var body=parts.map(function(o){
    var main=o.main, tag=o.tag;
    var segs=main.split(" | "), v="";
    if(segs.length>1 && segs.every(function(x){return /^[A-Z0-9]{1,5}:\s/.test(x);})){
      v=segs.map(function(x){ var k=x.slice(0,x.indexOf(":")), g=ledViz(x.slice(k.length+1)); return g?'<span class="lgrp"><span class="lcode">'+esc(k)+'</span>'+g+'</span>':''; }).join("");
    } else v=ledViz(main);
    var key=v && !keyShown && /lq [ygr] (?:on|off|bl)/.test(v) && (keyShown=true) ? '<div class="lkey"><span><i class="k1"></i>αναμμένο</span><span><i></i>σβηστό</span><span><i class="k3"></i>αναβοσβήνει</span></div>' : '';
    var ind=/αντιστοιχίστηκε μέσω περιγραφής/.test(main);
    if(ind) main=main.replace(/\s*\(κωδικός αντιστοιχίστηκε μέσω περιγραφής\)/,"");
    return '<div class="op">'+(ind?'<span class="indc" title="Ο κωδικός ταιριάχτηκε με τη λυχνία μέσω της περιγραφής βλάβης στο manual – επιβεβαίωσε στο μοντέλο">≈ έμμεση αντιστοίχιση</span>':'')+(v?'<div class="leds">'+v+'</div>'+key:'')+'<div class="otx">'+esc(/lrow/.test(v)?main.replace(/\s*=\s*[●○◎]{5}/g,"").replace("(● αναμμένο ○ σβηστό ◎ αναβοσβήνει γρήγορα· ","(αναβόσβημα γρήγορο· "):main)+'</div>'+(tag?'<div class="otag">'+esc(tag)+'</div>':'')+'</div>';
  }).join("");
  return '<div class="obx"><div class="oh"><svg class="ic"><use href="#i-board"/></svg> Πλακέτα εξωτερικής</div>'+body+(src?'<div class="otag">Πηγή: '+esc(src)+'</div>':'')+'</div>';
}


// ===== Αναφορά λάθους ανά κωδικό =====
var REPORT_EMAIL = "";
// Αναφορές: Φόρμα Google (λογαριασμός ιδιοκτήτη) – ο τεχνικός δεν βλέπει φόρμα, η εφαρμογή στέλνει από πίσω.
var REPORT_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSfjQYpQVa9ock0Bk5wre-6BCIWYmi7pM852Fye2xsqmZDb6_A/formResponse";
var REPORT_ENTRY = "entry.607089889";
var REPORT_APP = "https://script.google.com/macros/s/AKfycbzSPYg-QRzDj_ZOtHDnOB9EVfwf_pBsSCLhQARjga98rbWjolVTC3aZOsQrZ4_hMwX4Ag/exec"; // ιδιωτική αποθήκευση (Google Apps Script web app) – όταν οριστεί, αντικαθιστά φόρμα & CSV
var REPORT_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvto8ahCNg94hnc62aKYkYU6TaFi4neq481ZUnxLQQQUnUr5F13mFs-Z3IHGhjnXWHGfU4U5tySnna/pub?output=csv";
function repToast(msg){ var m=document.getElementById("copied"); if(!m){ m=document.createElement("div"); m.id="copied"; document.body.appendChild(m); } m.textContent=msg; m.className="toast"; clearTimeout(repToast._t); repToast._t=setTimeout(function(){ m.className=""; },2600); }
function repQueue(){ try{ return JSON.parse(localStorage.getItem("vl_repq")||"[]"); }catch(x){ return []; } }
function repPost(text){
  if(REPORT_APP) return fetch(REPORT_APP,{method:"POST",mode:"no-cors",body:text});
  var body=new URLSearchParams(); body.append(REPORT_ENTRY, text);
  return fetch(REPORT_FORM,{method:"POST",mode:"no-cors",body:body});
}
function repFlush(){
  var q=repQueue(); if(!q.length || !navigator.onLine) return;
  var t=q[0]; repPost(t).then(function(){ var r=repQueue(); r.shift(); try{ localStorage.setItem("vl_repq",JSON.stringify(r)); }catch(x){} if(r.length) setTimeout(repFlush,800); }).catch(function(){});
}
window.addEventListener("online", repFlush); setTimeout(repFlush, 3000);
var REPORT_KINDS = ["Λάθος σημασία κωδικού","Λάθος ένδειξη πλακέτας εξωτερικής","Λάθος βήματα ελέγχου","Λείπει κωδικός / σειρά","Άλλο"];
var REPORT_KINDS_GEN = ["Πρόβλημα στην εφαρμογή (κολλάει, δεν κλείνει κ.λπ.)","Λείπει μάρκα / μοντέλο / κωδικός","Λάθος σε πληροφορία","Πρόταση βελτίωσης","Άλλο"];
function repButton(tkey, code){ return '<button class="repb" data-rep="'+esc(tkey)+'|'+esc(code)+'">⚑ Αναφορά λάθους</button>'; }
function repCtx(){
  var c=null; try{ CATS.forEach(function(x){ if(x.id===S.cat) c=x.label; }); }catch(x){}
  var q=""; try{ q=(document.getElementById("q")||{}).value||""; }catch(x){}
  return {brand:(S&&S.brand)||"", cat:(S&&S.brand&&c)||"", model:(S&&S.model)||"", oem:(S&&S.oem&&S.oem!=="__all")?S.oem:"", q:q.trim()};
}
function repOpen(tkey, code, opt){
  opt=opt||{};
  var d=document.getElementById("repdlg");
  if(!d){ d=document.createElement("div"); d.id="repdlg"; d.className="repov"; document.body.appendChild(d); }
  var gen=!tkey, cx=repCtx(), tname=(!gen && typeof T!=="undefined" && T[tkey]) ? T[tkey].name : "", kinds=gen?REPORT_KINDS_GEN:REPORT_KINDS;
  var PHB='<label class="repph'+(opt.photo?' big':'')+'"><input type="file" id="repfile" accept="image/*" hidden><span id="repphl">📷 '+(opt.photo?'Φωτογραφία ταμπέλας':'Επισύναψη φωτογραφίας (προαιρετικά)')+'</span></label><div id="repprev"></div>';
  var ctxl=[cx.brand?"<b>"+esc(cx.brand)+"</b>":"", cx.cat?esc(cx.cat):"", tname?esc(tname):""].filter(Boolean).join(" · ");
  d.innerHTML='<div class="repbox" role="dialog" aria-modal="true" aria-labelledby="reph"><div class="reph" id="reph">⚑ '+(gen?'Αναφορά προβλήματος':'Αναφορά λάθους')+'<button class="repx" id="repcancel2" aria-label="Κλείσιμο">✕</button></div>'+
    (opt.photo&&!ctxl?'':ctxl?'<div class="small">'+(code?'Κωδικός <b>'+esc(code)+'</b> · ':'')+ctxl+'</div>':'<div class="small">Δεν έχει επιλεγεί μάρκα – γράψ’ την στο σχόλιο αν αφορά συγκεκριμένη μονάδα.</div>')+
    (opt.photo?'<div class="repask">🔎 Ο σειριακός <b class="code">'+esc(opt.ser||"")+'</b> δεν αναγνωρίστηκε.<br>📷 Βγάλε μια φωτογραφία <b>ολόκληρο το ταμπελάκι</b> της μονάδας (να φαίνονται μάρκα, μοντέλο, σειριακός και κατασκευαστής) και πάτα «Αποστολή» – θα ελεγχθεί και θα προστεθεί.</div>'+PHB:'')+
    '<div class="repk">'+kinds.map(function(k,i){ var on=opt.kind ? k===opt.kind : opt.ser ? /Λείπει μάρκα/.test(k) : i===0; return '<label class="chk"><input type="radio" name="repk" value="'+esc(k)+'"'+(on?' checked':'')+'> '+esc(k)+'</label>'; }).join("")+'</div>'+
    '<div class="row2"><input id="repmodel" placeholder="Μοντέλο" autocapitalize="characters" spellcheck="false" value="'+esc(cx.model)+'">'+
    (gen?'<input id="repcode" placeholder="Κωδικός (αν υπάρχει)" autocapitalize="characters" spellcheck="false" value="'+esc(opt.ser?"":cx.q)+'">':'')+'</div>'+
    '<input id="repser" placeholder="Σειριακός (αν υπάρχει)" autocapitalize="characters" spellcheck="false" value="'+esc(opt.ser||"")+'" style="margin-top:8px">'+
    (opt.photo?'':PHB)+
    '<textarea id="reptxt" rows="4" placeholder="'+(gen?'Τι έγινε; π.χ. «δεν μπορώ να κλείσω την κάμερα»':'Τι είδες στη μονάδα; π.χ. «η πλακέτα έδειχνε κόκκινο ×5, όχι ×3»')+'"></textarea>'+
    '<div class="scbtns"><button class="mini prim" id="repsend">📤 Αποστολή</button><button class="mini" id="repcancel">Άκυρο</button></div>'+
    '<div class="small" style="margin-top:6px">Η αναφορά στέλνεται ανώνυμα για έλεγχο και διόρθωση. <b>Μη γράφεις στοιχεία πελάτη</b> (όνομα, τηλέφωνο, διεύθυνση) και φωτογράφιζε μόνο την ταμπέλα της μονάδας. Δεν στέλνεται τίποτα χωρίς να πατήσεις «Αποστολή».</div></div>';
  d._page=opt.page||""; if(opt.page){ var tx=document.getElementById("reptxt"); if(tx){ var cxd=document.createElement("div"); cxd.className="repctx"; cxd.innerHTML='<b>📍 Στέλνεται μαζί αυτόματα:</b>\n'+esc(opt.page); tx.parentNode.insertBefore(cxd, tx); if(opt.ph) tx.placeholder=opt.ph;
      var bx=d.querySelector(".repbox"), hd=d.querySelector(".reph"); if(hd && hd.firstChild) hd.firstChild.nodeValue="⚑ Αναφορά για αυτή τη σελίδα";
      var nt=hd?hd.nextElementSibling:null; if(nt && nt.classList.contains("small")) nt.remove();
      if(opt.lite){ var rm=document.getElementById("repmodel"); if(rm && rm.parentNode) rm.parentNode.style.display="none"; var rs=document.getElementById("repser"); if(rs) rs.style.display="none"; }
      if(hd){ hd.parentNode.insertBefore(tx, hd.nextSibling); hd.parentNode.insertBefore(cxd, hd.nextSibling); }
    } }
  d._photo=""; d.style.display="flex"; d.setAttribute("data-k",(tkey||"")+"|"+(code||"")); if(!opt.photo) setTimeout(function(){ var t=document.getElementById("reptxt"); if(t) t.focus(); },50);
}
// Φωτογραφία: σμίκρυνση, γκρι JPEG, base64 – στέλνεται σε κομμάτια των 30.000 χαρακτήρων στην ίδια φόρμα
var REP_CHUNK = 30000; // η φόρμα απορρίπτει (413) πάνω από ~50KB ανά αποστολή
function repImg(file, cb){
  var url=URL.createObjectURL(file), img=new Image();
  img.onload=function(){
    var mx=1800, q=0.6, out="";
    for(var k=0;k<6;k++){
      var sc=Math.min(1, mx/Math.max(img.width,img.height)), W=Math.round(img.width*sc), H=Math.round(img.height*sc);
      var c=document.createElement("canvas"); c.width=W; c.height=H; var cx=c.getContext("2d"); cx.drawImage(img,0,0,W,H);
      try{ var id=cx.getImageData(0,0,W,H), p=id.data; for(var i=0;i<p.length;i+=4){ var g=(p[i]*0.3+p[i+1]*0.59+p[i+2]*0.11)|0; p[i]=p[i+1]=p[i+2]=g; } cx.putImageData(id,0,0); }catch(x){}
      out=c.toDataURL("image/jpeg", q).split(",")[1]||"";
      if(out.length<=REP_CHUNK*6) break; mx=Math.round(mx*0.82); q=Math.max(0.45,q-0.04);
    }
    URL.revokeObjectURL(url); cb(out);
  };
  img.onerror=function(){ URL.revokeObjectURL(url); cb(""); };
  img.src=url;
}
document.addEventListener("change", function(e){
  if(!e.target || e.target.id!=="repfile" || !e.target.files || !e.target.files[0]) return;
  var d=document.getElementById("repdlg"), l=document.getElementById("repphl"), pv=document.getElementById("repprev");
  if(l) l.textContent="⏳ Επεξεργασία φωτογραφίας…";
  repImg(e.target.files[0], function(b64){
    d._photo=b64;
    if(!b64){ if(l) l.textContent="⚠️ Δεν άνοιξε η φωτογραφία – δοκίμασε ξανά"; return; }
    if(l) l.textContent="✔ Φωτογραφία έτοιμη – πάτα για αλλαγή";
    if(pv) pv.innerHTML='<img src="data:image/jpeg;base64,'+b64+'" alt="Φωτογραφία ταμπέλας">';
  });
});
function repText(r){ return "Βλαβολόγιο – αναφορά "+(r.gen?"προβλήματος":"λάθους")+"\nΚωδικός: "+(r.code||"-")+"\nΜάρκα: "+(r.brand||"-")+"\nΚατηγορία: "+(r.cat||"-")+"\nΠίνακας: "+(r.table||"-")+"\nΜοντέλο: "+(r.model||"-")+(r.ser?"\nΣειριακός: "+r.ser:"")+(r.photo?"\nΦωτογραφία: "+r.photo:"")+"\nΕίδος: "+r.kind+"\nΣχόλιο: "+(r.txt||"-")+"\nΗμερομηνία: "+r.date; }
document.addEventListener("click", function(e){
  var b=e.target.closest("[data-rep],[data-repser],#repgen,#repsend,#repcancel,#repcancel2,#repdlg"); if(!b) return;
  if(b.hasAttribute("data-repser")){ repOpen("","",{ser:b.getAttribute("data-repser"), photo:1}); return; }
  if(b.id==="repgen"){ repOpen("",""); return; }
  if(b.hasAttribute("data-rep")){ var a=b.getAttribute("data-rep").split("|"); repOpen(a[0],a.slice(1).join("|")); return; }
  var d=document.getElementById("repdlg");
  if(b.id==="repcancel" || b.id==="repcancel2" || (b.id==="repdlg" && e.target===d)){ d.style.display="none"; return; }
  if(b.id==="repsend"){
    var last=0; try{ last=+localStorage.getItem("vl_replast")||0; }catch(x){}
    if(Date.now()-last<30000){ repToast("⏳ Περίμενε λίγα δευτερόλεπτα πριν στείλεις νέα αναφορά"); return; }
    var tx0=(document.getElementById("reptxt")||{}).value||"";
    if(tx0.trim().length<3 && !(document.getElementById("repmodel")||{}).value && !d._photo){ repToast("✍️ Γράψε λίγα λόγια για το πρόβλημα"); var tf=document.getElementById("reptxt"); if(tf) tf.focus(); return; }
    try{ localStorage.setItem("vl_replast", String(Date.now())); }catch(x){}
    var k=d.getAttribute("data-k").split("|"), kind=(d.querySelector('input[name=repk]:checked')||{}).value||"";
    var cx=repCtx(), rc=document.getElementById("repcode"); var r={gen:!k[0], cat:cx.cat, code:rc?rc.value.trim():k.slice(1).join("|"), table:(k[0]&&T[k[0]]?T[k[0]].name:(k[0]||"")), brand:cx.brand, model:document.getElementById("repmodel").value.trim(), ser:((document.getElementById("repser")||{}).value||"").trim().toUpperCase(), kind:kind, txt:document.getElementById("reptxt").value.trim().slice(0,1500), date:new Date().toLocaleString("el-GR")};
    try{ var all=JSON.parse(localStorage.getItem("vl_reports")||"[]"); all.push(r); localStorage.setItem("vl_reports",JSON.stringify(all.slice(-200))); }catch(x){}
    var ph=d._photo||"", parts=[];
    if(ph){ var pid=Date.now().toString(36)+Math.random().toString(36).slice(2,6), n=Math.ceil(ph.length/REP_CHUNK);
      for(var pi=0;pi<n;pi++) parts.push("VLPHOTO|"+pid+"|"+(pi+1)+"|"+n+"|"+ph.slice(pi*REP_CHUNK,(pi+1)*REP_CHUNK));
      r.photo=pid+" ("+n+" μέρη)"; }
    r.page=d._page||""; var t=repText(r)+(r.page?"\n\n— Σελίδα —\n"+r.page:"");
    d.style.display="none";
    if(REPORT_FORM){
      var q=repQueue(); q.push(t); parts.forEach(function(x){ q.push(x); }); try{ localStorage.setItem("vl_repq",JSON.stringify(q)); }catch(x){ try{ q=q.slice(0,q.length-parts.length); localStorage.setItem("vl_repq",JSON.stringify(q)); }catch(y){} }
      if(navigator.onLine){ repToast(parts.length?"✔ Η αναφορά και η φωτογραφία στέλνονται – ευχαριστούμε!":"✔ Η αναφορά στάλθηκε – ευχαριστούμε!"); repFlush(); }
      else repToast("📴 Χωρίς ίντερνετ – θα σταλεί αυτόματα μόλις συνδεθείς");
    } else if(typeof shareText==="function") shareText(t,"Βλαβολόγιο – αναφορά λάθους");
  }
});
document.addEventListener("keydown", function(e){ if(e.key==="Escape"){ var d=document.getElementById("repdlg"); if(d) d.style.display="none"; } });

// ===== Οδηγία εγκατάστασης στο iPhone (μία φορά) =====
(function(){
  try{
    var ios=/iphone|ipad|ipod/i.test(navigator.userAgent), sa=window.navigator.standalone===true || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
    if(!ios || sa || localStorage.getItem("vl_ioshint")) return;
    var h=document.createElement("div"); h.className="ioshint";
    h.innerHTML='<span>📲 Βάλ’ το στην αρχική οθόνη: πάτα <b>Κοινοποίηση</b> ⬆️ και μετά <b>«Προσθήκη στην οθόνη Αφετηρίας»</b>. Δουλεύει και χωρίς ίντερνετ.</span><button aria-label="Κλείσιμο">✕</button>';
    h.querySelector("button").onclick=function(){ h.remove(); try{localStorage.setItem("vl_ioshint","1");}catch(x){} };
    document.addEventListener("DOMContentLoaded",function(){ document.body.appendChild(h); }); if(document.readyState!=="loading") document.body.appendChild(h);
  }catch(x){}
})();


// ===== Οθόνη «Αναφορές» (ιδιοκτήτης): 5 πατήματα στο λογότυπο =====
function csvParse(t){ var rows=[],row=[],f="",q=false; for(var i=0;i<t.length;i++){ var c=t[i];
  if(q){ if(c==='"'){ if(t[i+1]==='"'){ f+='"'; i++; } else q=false; } else f+=c; }
  else if(c==='"') q=true; else if(c===','){ row.push(f); f=""; } else if(c==='\n'){ row.push(f); rows.push(row); row=[]; f=""; } else if(c!=='\r') f+=c; }
  if(f!==""||row.length){ row.push(f); rows.push(row); } return rows; }
function admPhoto(PH, v){
  if(!v) return ""; var pid=String(v).split(" ")[0], o=PH[pid];
  if(!o) return '<div class="small">📷 Η φωτογραφία δεν έχει φτάσει ακόμα</div>';
  var b=""; for(var i=1;i<=o.n;i++){ if(o.p[i]==null) return '<div class="small">📷 Φωτογραφία: '+Object.keys(o.p).length+'/'+o.n+' μέρη έφτασαν</div>'; b+=o.p[i]; }
  return '<img class="admimg" src="data:image/jpeg;base64,'+b.replace(/[^A-Za-z0-9+\/=]/g,"")+'" alt="Φωτογραφία ταμπέλας">';
}
function admOpen(){
  var saved=localStorage.getItem("vl_admpin")||"";
  var b=prompt("PIN αναφορών:", ""); if(b===null) return; b=String(b).trim();
  if(b.length<4){ alert("Το PIN θέλει τουλάχιστον 4 ψηφία."); return; }
  if(!REPORT_APP && saved && b!==saved){ alert("Λάθος PIN."); return; }
  var d=document.getElementById("admdlg"); if(!d){ d=document.createElement("div"); d.id="admdlg"; d.className="repov"; document.body.appendChild(d); }
  d.innerHTML='<div class="repbox admbox"><div class="reph">⚑ Αναφορές τεχνικών</div><div id="admlist" class="small">Φόρτωση…</div><div class="scbtns"><button class="mini" id="admclose">Κλείσιμο</button></div></div>';
  d.style.display="flex";
  var pinNow=b;
  (REPORT_APP ? fetch(REPORT_APP,{method:"POST",body:"VLADMIN|"+pinNow}).then(function(r){ return r.json(); }).then(function(j){ if(!j.ok) throw new Error(j.err||"x"); try{ localStorage.setItem("vl_admpin",b); }catch(e){} return j.rows; })
              : fetch(REPORT_CSV+"&t="+Date.now(),{cache:"no-store"}).then(function(r){ return r.text(); }).then(function(t){ return csvParse(t).slice(1); })
  ).then(function(all){
    var PH={};
    all.forEach(function(r){ if(r[1] && r[1].indexOf("VLPHOTO|")===0){ var a=r[1].split("|"); var o=PH[a[1]]||(PH[a[1]]={n:+a[3],p:{}}); o.p[a[2]]=a.slice(4).join("|"); } });
    var rows=all.filter(function(r){ return r[1] && r[1].indexOf("VLPHOTO|")!==0 && r[1].indexOf("Κωδικός: TEST\n")<0; }).reverse();
    var el=document.getElementById("admlist");
    if(!rows.length){ el.innerHTML="Δεν υπάρχουν αναφορές ακόμα."; return; }
    el.innerHTML='<div style="margin-bottom:8px"><b>'+rows.length+'</b> αναφορές (νεότερες πρώτα)</div>'+rows.map(function(r){
      var lines=r[1].split("\n"), f={}; lines.forEach(function(l){ var i=l.indexOf(": "); if(i>0) f[l.slice(0,i)]=l.slice(i+2); });
      return '<div class="admrow"><div class="admh"><span class="code">'+esc(f["Κωδικός"]||"?")+'</span> <b>'+esc(f["Μάρκα"]||"")+'</b> <span class="small">'+esc(r[0])+'</span></div>'+
        '<div class="small">'+esc(f["Είδος"]||"")+(f["Μοντέλο"]&&f["Μοντέλο"]!=="-"?' · μοντέλο '+esc(f["Μοντέλο"]):'')+'</div>'+
        (f["Σειριακός"]?'<div class="small">Σειριακός: <span class="code">'+esc(f["Σειριακός"])+'</span></div>':'')+
        '<div class="otx">'+esc(f["Σχόλιο"]||r[1])+'</div>'+admPhoto(PH, f["Φωτογραφία"])+'<div class="otag">'+esc(f["Πίνακας"]||"")+'</div></div>';
    }).join("");
  }).catch(function(er){ var el=document.getElementById("admlist"); if(el) el.innerHTML=(er&&er.message==="pin")?'Λάθος PIN. <button class="mini" id="admreset">Δοκίμασε ξανά</button>':(er&&er.message==="rate")?"Πολλές προσπάθειες – δοκίμασε σε 10 λεπτά.":"Δεν φορτώθηκαν οι αναφορές – χρειάζεται ίντερνετ."; });
}
document.addEventListener("click", function(e){ if(e.target && e.target.id==="admreset"){ localStorage.removeItem("vl_admpin"); var d=document.getElementById("admdlg"); if(d) d.style.display="none"; admOpen(); } });
(function(){ var n=0, tm=null; document.addEventListener("click", function(e){
  if(e.target.closest("#admclose")){ document.getElementById("admdlg").style.display="none"; return; }
  if(!e.target.closest(".logo")) return; tap(); });
  function tap(){ n++; clearTimeout(tm); tm=setTimeout(function(){ n=0; },1500); if(n>=5){ n=0; admOpen(); } }
  // iPhone: τα γρήγορα πατήματα στο λογότυπο κάνουν ζουμ – το touchend με preventDefault το σταματά (και δεν βγαίνει click)
  document.addEventListener("touchend", function(e){ if(e.target.closest && e.target.closest(".logo")){ e.preventDefault(); tap(); } }, {passive:false});
})();
function ruleBox(id){
  var r = PRULE[id]; if(!r) return "";
  return '<div class="prule"><div class="prt">📏 Κανόνας</div>'+r.map(function(x){ return '<div class="prl">'+esc(x)+'</div>'; }).join("")+'</div>';
}
