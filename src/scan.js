// ===== Serial / label interpretation (sources in .src) =====
var GRM = ["","Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος"];
function yFromDigit(d){ var now = new Date().getFullYear(), y = now - ((now - d) % 10 + 10) % 10; return y; }
function moX(c){ return c==="X"?10:c==="Y"?11:c==="Z"?12:c==="A"?10:c==="B"?11:c==="C"?12:+c; }
var SER = [
  {o:"lg", re:/^(\d)(0[1-9]|1[0-2])[A-Z0-9]{9}$/, w:2, k:"Σειριακός LG", d:function(m){ return {y:yFromDigit(+m[1]), mo:+m[2], dec:1}; },
   src:"LG support: ο σειριακός ξεκινά με 3 ψηφία – το 1ο είναι το έτος (τελευταίο ψηφίο), τα 2 επόμενα ο μήνας."},
  {o:"me", re:/^(\d)([1-9XYZ])([UM])\d{5}/, w:2, k:"Σειριακός Mitsubishi Electric", d:function(m){ return {y:yFromDigit(+m[1]), mo:moX(m[2]), dec:1, x:m[3]==="U"?"εξωτερική μονάδα":"εσωτερική μονάδα"}; },
   src:"Εγχειρίδιο Mitsubishi Electric: έτος (τελευταίο ψηφίο) · μήνας 1–9, X=10, Y=11, Z=12 · M=εσωτερική / U=εξωτερική · αύξων αριθμός 00001–99999."},
  {o:"me", re:/^(\d)([A-HJ-M])U\d{5}/, w:2, k:"Σειριακός Mitsubishi Electric", d:function(m){ return {y:yFromDigit(+m[1]), mo:"ABCDEFGHJKLM".indexOf(m[2])+1, dec:1, x:"εξωτερική μονάδα"}; },
   src:"Εγχειρίδιο Mitsubishi Electric (μεγάλες εξωτερικές): μήνας A=1 … M=12 (χωρίς I)."},
  {o:"midea", re:/^[0-9A-Z]{11}(\d{2})([1-9ABC])[0-9A-Z]{8}$/, w:1, k:"Σειριακός 22 χαρακτήρων τύπου Midea", d:function(m){ return {y:2000+(+m[1]), mo:moX(m[2])}; },
   src:"Midea (επίσημο FAQ midea.com): ο σειριακός είναι στο λευκό αυτοκόλλητο με barcode και έχει 22 χαρακτήρες. Οι θέσεις έτους (12–13) και μήνα (14η) ΔΕΝ τις δημοσιεύει η Midea – είναι από building-center.org· σύγκρινε με την ημερομηνία κατασκευής στο ταμπελάκι."},
  {o:"samsung", re:/^[0-9A-Z]{7}([A-Z])([1-9ABC])[0-9A-Z]{5}[A-Z]$/, w:1, k:"Σειριακός 15 χαρακτήρων τύπου Samsung", d:function(m){ return {mo:moX(m[2]), yl:m[1]}; },
   src:"Samsung: ο σειριακός έχει 15 χαρακτήρες και τελειώνει σε γράμμα· 8ος χαρακτήρας = έτος (γράμμα), 9ος = μήνας. Δεν υπάρχει επίσημος πίνακας γραμμάτων – δες την ημερομηνία στο ταμπελάκι."},
  {o:"hisense", re:/^1KA[0-9A-Z]{20}$/, w:2, k:"Σειριακός εσωτερικής Hisense (1KA…, 23 χαρ.)", src:"Hisense – How to identify the model and the serial number: οι επίτοιχες εσωτερικές έχουν σειριακό 23 χαρακτήρων που ξεκινά με 1KA."},
  {o:"hisense", re:/^Q[0-9A-Z]{11}$/, w:1, k:"Σειριακός Hisense (Q…, 12 χαρ.)", src:"Hisense – How to identify the model and the serial number: ο σειριακός έχει 12 χαρακτήρες και ξεκινά με Q (κυρίως VRF/επαγγελματικά)."},
  {o:"gree", re:/^C[A-Z]\d{3}[A-Z]\d{5}$/, w:2, k:"Κωδικός προϊόντος Gree (Product Code)", src:"Εγχειρίδια σέρβις Gree: «Product Code» της μορφής CU050W01701 / CB…"},
  {o:"haier", re:/^[0-9A-Z]{11}[0-9A-Z]{2}([A-HJ-NP-Z])([1-9ABC])([1-9A-HJ-NP-X])\d{4}$/, w:2, k:"Σειριακός Haier (20 χαρακτήρες) – και Candy", d:function(m){ var Y="ABCDEFGHJKLMNPQR".indexOf(m[1]), D="123456789ABCDEFGHJKLMNPQRSTUVWX".indexOf(m[3])+1; return Y<0 ? {mo:moX(m[2]), yl:m[1], day:D} : {y:2010+Y, mo:moX(m[2]), day:D}; },
   src:"Haier – How to check the serial number: 20 χαρακτήρες· οι 11 πρώτοι = κωδικός προϊόντος, 2 = γραμμή παραγωγής, 3 = ημερομηνία (έτος A=2010 … N=2022, P=2023, Q=2024, R=2025 – χωρίς I/O· μήνας 1–9, A/B/C = 10/11/12· ημέρα 1–9, A=10 … X=31), 4 = αύξων αριθμός."},
  {o:"fujitsu", re:/^[A-Z]{1,3}\d{6}$/, w:0, k:"Μορφή σειριακού Fujitsu (γράμματα + 6 ψηφία)", src:"Fujitsu: αύξουσα αρίθμηση, η ημερομηνία δεν κωδικοποιείται στον σειριακό (building-center.org) – βρίσκεται από την Fujitsu με τον σειριακό."}
];
var QRDOM = [[/gree/i,"gree"],[/midea/i,"midea"],[/hisense/i,"hisense"],[/haier/i,"haier"],[/daikin/i,"daikin"],[/tcl\./i,"tcl"],[/aux(group|air)?\./i,"aux"],[/samsung/i,"samsung"],[/lg\.com/i,"lg"],[/mitsubishielectric|mitsubishi-electric/i,"me"],[/toshiba/i,"toshiba"],[/panasonic/i,"panasonic"],[/fujitsu/i,"fujitsu"]];
var serLearn = LS.get("vl_serlearn", []); // [{b, p, o}]
function serClean(t){ return gr2lat(String(t||"")).toUpperCase().replace(/[\s\-\.\/]/g,""); }
function serInfo(t, cs){
  var raw = String(t||""), v = serClean(raw), out = [];
  function ok(o){ return !cs || cs.indexOf(o)>=0 || (o==="gree" && cs.indexOf("inv_gree")>=0); }
  var ep = raw.match(/eprel\.ec\.europa\.eu\/(?:qr|screen\/product\/[a-z0-9]+)\/(\d{4,})/i);
  if(ep) out.push({o:"", w:0, eprel:ep[1], url:"https://eprel.ec.europa.eu/qr/"+ep[1], k:"QR ενεργειακής σήμανσης ΕΕ (EPREL αρ. "+ep[1]+")", src:"Ο QR της ετικέτας ενέργειας οδηγεί στη βάση EPREL της ΕΕ, όπου φαίνονται μάρκα, προμηθευτής και ακριβές μοντέλο εσωτερικής/εξωτερικής. Πάτα «Άνοιγμα στο EPREL» (χρειάζεται ίντερνετ)."});
  if(/^https?:\/\//i.test(raw)){ QRDOM.forEach(function(q){ if(q[0].test(raw)) out.push({o:q[1], w:2, k:"QR με σελίδα της "+(PLAT[q[1]]?PLAT[q[1]].name:q[1]), src:"Ο QR οδηγεί στον ιστότοπο του κατασκευαστή."}); }); return out; }
  if(v.length < 5) return out;
  FW.pcb.forEach(function(x){ if(x[0].test(v)) out.push({o:x[1], w:x[2], k:"Κωδικός πλακέτας", src:x[3], pcb:1}); });
  SER.forEach(function(r){ var m = v.match(r.re); if(!m) return; var e = {o:r.o, w:r.w, k:r.k, src:r.src}; if(r.d) e.d = r.d(m); if(!ok(r.o)) e.w = Math.min(e.w,1), e.off = 1; out.push(e); });
  var b = brandObj();
  if(b && !b.own){ var dm = detectOem(b, v); if(dm) out.push({o:dm.o, w:2, k:"Μοντέλο "+b.n, src:dm.w, model:1}); }
  else if(!b || b.n==="Άλλη μάρκα…"){ var gm = detectOem({n:""}, raw); if(gm) out.push({o:gm.o, w:2, k:"Μοντέλο "+(PLAT[gm.o]?PLAT[gm.o].name:gm.o), src:gm.w, model:1}); }
  serLearn.forEach(function(l){ if(b && l.b===b.n && v.indexOf(l.p)===0) out.push({o:l.o, w:3, k:"Δική σου αντιστοίχιση ("+l.p+"…)", src:"Το αποθήκευσες εσύ από προηγούμενη μονάδα."}); });
  return out;
}
function dateTxt(d){
  if(!d) return "";
  if(d.day && d.mo && d.y) return "📅 Κατασκευή: "+d.day+"/"+("0"+d.mo).slice(-2)+"/"+d.y+(d.x?" · "+d.x:"");
  var s = (d.day ? d.day+"/" : "") + (d.mo ? GRM[d.mo]+" " : "");
  if(d.y) s += d.y + (d.dec ? " (ή "+(d.y-10)+")" : "");
  else if(d.yl) s += "έτος: γράμμα «"+d.yl+"»"+(d.day?" (μετά το 2025 – εκτός επίσημου πίνακα)":"");
  return "📅 Κατασκευή: "+s+(d.x?" · "+d.x:"");
}
function serHtml(t, cs){
  var r = serInfo(t, cs);
  if(!r.length) return '<div class="small">Από τον σειριακό δεν φαίνεται το εργοστάσιο (πολλές μάρκες δεν το κωδικοποιούν).</div><div class="lbl">Γράψε το <b>μοντέλο</b> από το ταμπελάκι:</div><input id="scmodel" placeholder="π.χ. TAG-18IG" autocapitalize="characters" spellcheck="false" autocomplete="off"><div id="scmres"></div><div class="small" style="margin-top:8px">Αν δεν βρεθεί ούτε από το μοντέλο:</div><button class="repb" data-repser="'+esc(serClean(t))+'">📷 Στείλε φωτογραφία της ταμπέλας για να προστεθεί</button>';
  return r.map(function(e){
    var nm = PLAT[e.o] ? PLAT[e.o].name : e.o;
    return '<div class="serl"><b>'+esc(e.k)+'</b>'+(e.w?' → <span class="det">'+esc(nm)+'</span>':'')+(e.off?' <span class="small">(δεν είναι στα συνήθη εργοστάσια αυτής της μάρκας)</span>':'')+
      (e.d?'<div>'+esc(dateTxt(e.d))+'</div>':'')+'<div class="small">'+esc(e.src)+'</div>'+(e.url?'<a class="mini" href="'+esc(e.url)+'" target="_blank" rel="noopener">🔗 Άνοιγμα στο EPREL</a>':'')+'</div>';
  }).join("");
}

// ===== Scanner UI =====
function modelLookup(m){
  var v = gr2lat(String(m||"")).toUpperCase().replace(/\s/g,""), out = [], seen = {};
  if(v.length<4) return out;
  OEMRX.forEach(function(r){ if(!r.re.test(v)) return;
    var bs = r.b ? r.b : BRANDS.filter(function(b){ return b.own===r.o; }).map(function(b){ return b.n; });
    bs.forEach(function(n){ var k = n+"|"+r.o; if(seen[k]) return; seen[k]=1; out.push({b:n, o:r.o, w:r.w}); }); });
  return out;
}
document.addEventListener("input", function(e){
  if(!e.target || e.target.id!=="scmodel") return;
  var box = document.getElementById("scmres"); if(!box) return;
  var v = e.target.value, r = modelLookup(v);
  box.innerHTML = !v || v.length<4 ? "" : !r.length ? '<div class="small">Δεν το βρίσκω ακόμα – στείλε φωτογραφία της ταμπέλας με το κουμπί παρακάτω.</div>' :
    r.map(function(x){ return '<div class="serl"><b>'+esc(x.b)+'</b> → <span class="det">'+esc(PLAT[x.o]?PLAT[x.o].name:x.o)+'</span><div class="small">'+esc(x.w)+'</div><button class="chip on" data-qb="'+esc(x.b)+'" data-qm="'+esc(v.trim().toUpperCase())+'" data-qo="'+esc(x.o)+'">Συνέχεια με '+esc(x.b)+'</button></div>'; }).join("");
});
var SCAN = {st:null, timer:0, det:null, target:"ser", busy:false, hits:{}};
function scanOpen(target){
  ovPush();
  SCAN.target = target||"ser"; SCAN.hits = {};
  var ov = document.getElementById("scanov");
  if(!ov){ ov = document.createElement("div"); ov.id = "scanov"; document.body.appendChild(ov); }
  ov.innerHTML = '<div class="schead"><b><svg class="ic"><use href="#i-scan"/></svg> Σάρωση ταμπέλας / barcode</b><button class="mini" id="scclose">✕</button></div>'+
    '<div class="scbox"><video id="scvid" playsinline muted autoplay></video><div class="scguide"></div></div>'+
    '<div class="scmsg" id="scmsg">Άνοιγμα κάμερας…</div>'+
    '<div class="scbtns"><label class="mini prim scphoto">🏷️ Φωτογραφία ταμπέλας (διαβάζει μάρκα & μοντέλο)<input type="file" accept="image/*" capture="environment" id="scplate" hidden></label></div>'+
    '<div class="scbtns"><label class="mini scphoto">📸 Φωτογραφία μόνο του barcode<input type="file" accept="image/*" capture="environment" id="scfile" hidden></label></div>'+
    '<div id="scres"></div>';
  ov.style.display = "flex"; document.body.style.overflow = "hidden";
  if("BarcodeDetector" in window){
    try{ BarcodeDetector.getSupportedFormats().then(function(f){ var want = ["code_128","code_39","ean_13","itf","qr_code","data_matrix","upc_a"].filter(function(x){ return f.indexOf(x)>=0; }); if(want.length) SCAN.det = new BarcodeDetector({formats:want}); }).catch(function(){}); }catch(e){ SCAN.det = null; }
  }
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ scanMsg("Η κάμερα δεν είναι διαθέσιμη εδώ – πάτα «📸 Φωτογραφία του barcode»."); return; }
  navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}, width:{ideal:1920}, height:{ideal:1080}}, audio:false}).then(function(st){
    SCAN.st = st; var v = document.getElementById("scvid"); if(!v){ scanStop(); return; }
    v.srcObject = st; v.play().catch(function(){});
    try{ var tr = st.getVideoTracks()[0], cap = tr.getCapabilities ? tr.getCapabilities() : {}; if(cap.focusMode && cap.focusMode.indexOf("continuous")>=0) tr.applyConstraints({advanced:[{focusMode:"continuous"}]}); }catch(e){}
    scanMsg("Βάλε το barcode οριζόντια μέσα στο πλαίσιο, να γεμίζει το πλάτος. Κράτα σταθερά 10–20 εκ. μακριά.");
    scanLoop();
  }).catch(function(){ scanMsg("Δεν δόθηκε άδεια για την κάμερα (ή δεν υποστηρίζεται εδώ). Πάτα «📸 Φωτογραφία του barcode» – δουλεύει πάντα."); });
}
function scanMsg(t){ var m = document.getElementById("scmsg"); if(m) m.textContent = t; }
function scanStop(){ clearTimeout(SCAN.timer); if(SCAN.st){ SCAN.st.getTracks().forEach(function(t){ t.stop(); }); SCAN.st = null; } }
function scanClose(){ scanStop(); var ov = document.getElementById("scanov"); if(ov){ ov.style.display = "none"; ov.innerHTML = ""; } document.body.style.overflow = ""; ovPop(); }
var scanCv = null, scanN = 0;
function scanLoop(){
  var v = document.getElementById("scvid"); if(!v || !SCAN.st) return;
  SCAN.timer = setTimeout(scanLoop, 140);
  if(SCAN.busy || v.readyState < 2 || !v.videoWidth) return;
  SCAN.busy = true; scanN++;
  if(SCAN.det){
    SCAN.det.detect(v).then(function(r){ SCAN.busy = false; if(r && r.length) scanFound(r[0].rawValue, r[0].format); else scanGray(v); }).catch(function(){ SCAN.busy = false; scanGray(v); });
    return;
  }
  scanGray(v); SCAN.busy = false;
}
function scanGray(v){
  var W = v.videoWidth, H = v.videoHeight; if(!W) return;
  scanCv = scanCv || document.createElement("canvas"); scanCv.width = W; scanCv.height = H;
  var cx = scanCv.getContext("2d", {willReadFrequently:true}); cx.drawImage(v, 0, 0, W, H);
  var g = BC.grayOf(cx.getImageData(0, 0, W, H));
  var r = BC.decodeGray(g, W, H, {rows:18, y0:0.3, y1:0.7, cols:scanN%3===0});
  if(r){ var k = r.f+":"+r.t; SCAN.hits[k] = (SCAN.hits[k]||0)+1; if(r.strong || SCAN.hits[k]>=2) scanFound(r.t, r.f); }
}
function scanPhoto(file){
  if(!file) return; scanMsg("Ανάλυση φωτογραφίας…");
  var url = URL.createObjectURL(file), img = new Image();
  img.onload = function(){
    var sc = Math.min(1, 2400/Math.max(img.width, img.height)), W = Math.round(img.width*sc), H = Math.round(img.height*sc);
    var c = document.createElement("canvas"); c.width = W; c.height = H; var cx = c.getContext("2d", {willReadFrequently:true}); cx.drawImage(img, 0, 0, W, H);
    URL.revokeObjectURL(url);
    var done = function(){ var r = BC.decodeGray(BC.grayOf(cx.getImageData(0,0,W,H)), W, H, {rows:70, y0:0.02, y1:0.98, cols:true});
      if(r) scanFound(r.t, r.f); else scanMsg("Δεν διάβασα barcode στη φωτογραφία. Βγάλε την πιο κοντά, ίσια, με καλό φως και χωρίς αντανάκλαση – να γεμίζει το barcode την οθόνη."); };
    if(SCAN.det) SCAN.det.detect(c).then(function(r){ if(r && r.length) scanFound(r[0].rawValue, r[0].format); else done(); }).catch(done); else setTimeout(done, 30);
  };
  img.onerror = function(){ scanMsg("Δεν άνοιξε η φωτογραφία."); };
  img.src = url;
}
var SCT = {ser:"σειριακός μονάδας", model:"μοντέλο", pcb:"κωδικός πλακέτας", comp:"συμπιεστής"};
function scanFound(text, fmt){
  scanStop(); SCAN.last = text;
  if(navigator.vibrate) try{ navigator.vibrate(60); }catch(e){}
  var b = brandObj(), cs = b && !b.own ? candidates(b) : null, info = serInfo(text, cs);
  var guess = SCAN.target;
  if(info.some(function(e){ return e.pcb; })) guess = "pcb"; else if(info.some(function(e){ return e.model; })) guess = "model";
  var order = [guess].concat(["ser","model","pcb","comp"].filter(function(x){ return x!==guess; }));
  var box = document.getElementById("scres"); if(!box) return;
  var vb = document.querySelector("#scanov .scbox"); if(vb) vb.style.display = "none";
  var pb = document.querySelector("#scanov .scbtns"); if(pb) pb.style.display = "none";
  scanMsg("✅ Διαβάστηκε ("+String(fmt||"").replace("_","-").toUpperCase()+")");
  if(SCAN.target==="hist"){ var hf = document.getElementById("hf_ser"); scanStop(); var ov0 = document.getElementById("scanov"); if(ov0){ ov0.style.display="none"; ov0.innerHTML=""; } ovPop(); if(hf) hf.value = serClean(text); return; }
  var quick = SCAN.target==="quick", qh = "";
  if(quick){
    var all = serInfo(text, null), seenB = {};
    all.forEach(function(e){ if(!e.w) return; BRANDS.forEach(function(bb){ if(bb.own===e.o || (bb.own==="inv_gree" && e.o==="gree")) seenB[bb.n]=1; }); });
    var bl = Object.keys(seenB);
    qh = '<div class="lbl">Συνέχεια με μάρκα:</div><div class="chips">'+bl.map(function(n){ return '<button class="chip on" data-qb="'+esc(n)+'">'+esc(n)+'</button>'; }).join("")+
      '<button class="chip" id="qother">Άλλη μάρκα (Inventor, Nobu…)</button></div>';
    box.innerHTML = '<div class="sccode">'+esc(text)+'</div>'+histSeenHtml(text,"")+serHtml(text, null)+qh+'<div class="scbtns" style="margin-top:12px"><button class="mini" id="scagain">🔁 Σάρωση ξανά</button></div>';
    scanNoMatch(text);
    return;
  }
  box.innerHTML = '<div class="sccode">'+esc(text)+'</div>'+histSeenHtml(text,"")+serHtml(text, cs)+
    '<div class="lbl">Πάτα τι είναι, για να το περάσω στη σωστή θέση:</div><div class="chips">'+order.map(function(k,i){ return '<button class="chip'+(i===0?' on':'')+'" data-scuse="'+k+'">'+esc(SCT[k])+'</button>'; }).join("")+'</div>'+
    (cs && cs.length>1 ? '<div class="lbl">Ξέρεις το εργοστάσιο αυτής της μονάδας; Αποθήκευσέ το για την επόμενη φορά:</div><div class="chips">'+cs.map(function(p){ return '<button class="chip" data-sclearn="'+p+'">'+esc(PLAT[p].name)+'</button>'; }).join("")+'</div>' : '')+
    '<div class="scbtns" style="margin-top:12px"><button class="mini" id="scagain">🔁 Σάρωση ξανά</button></div>';
  scanNoMatch(text);
}
// Δεν αναγνωρίστηκε τίποτα → ανοίγει αυτόματα αναφορά με αίτημα φωτογραφίας της ταμπέλας
function scanNoMatch(text){
  if(/^\d{8}$|^\d{12,14}$/.test(serClean(text))) return; // EAN/UPC κουτιού – όχι σειριακός
  var bb = brandObj(); if(bb && bb.own) return; // γνωστή μάρκα με δικό της εργοστάσιο: το βλαβολόγιο είναι ήδη σωστό
  var inf = serInfo(text, null);
  if(inf.some(function(e){ return e.eprel; })) return; // ο QR της ετικέτας ΕΕ δείχνει μάρκα/μοντέλο στο EPREL
  var hit = inf.some(function(e){ return e.w>0; });
  if(hit || typeof repOpen!=="function") return;
  setTimeout(function(){ repOpen("", "", {ser:serClean(text), photo:1}); }, 350);
}
function scanUse(k){
  var t = SCAN.last||"", v = serClean(t);
  if(k==="model"){ S.model = t.trim(); var mi = document.getElementById("model"); if(mi){ mi.value = S.model; mi.dispatchEvent(new Event("input")); } }
  else { S.fwOpen = true; S.fw[k] = k==="ser" ? v : t.trim(); }
  scanClose();
  if(k!=="model"){ renderOem(); }
  setTimeout(function(){ var el = document.getElementById(k==="model"?"model":"fwiz"); if(el) el.scrollIntoView({behavior:"smooth", block:"center"}); }, 60);
}
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-scan],#scclose,#scagain,[data-scuse],[data-sclearn],#qother"); if(!el) return;
  if(el.hasAttribute("data-scan")){ e.preventDefault(); scanOpen(el.getAttribute("data-scan")); return; }
  if(el.id==="scclose"){ scanClose(); return; }
  if(el.id==="qother"){ var t0 = SCAN.last; scanClose(); S.qpend = serClean(t0); var cb = document.getElementById("chgBrand"); if(cb) cb.click(); var bq = document.getElementById("bq"); if(bq){ bq.focus(); } return; }
  if(el.id==="scagain"){ var tg = SCAN.target; scanClose(); scanOpen(tg); return; }
  if(el.hasAttribute("data-scuse")){ scanUse(el.getAttribute("data-scuse")); return; }
  if(el.hasAttribute("data-sclearn")){
    var b = brandObj(), p = serClean(SCAN.last).slice(0,5), o = el.getAttribute("data-sclearn"); if(!b || p.length<5) return;
    serLearn = serLearn.filter(function(l){ return !(l.b===b.n && l.p===p); }); serLearn.push({b:b.n, p:p, o:o}); LS.set("vl_serlearn", serLearn);
    el.parentNode.innerHTML = '<div class="small det">✔ Αποθηκεύτηκε: '+esc(b.n)+' με σειριακό '+esc(p)+'… = '+esc(PLAT[o].name)+'</div>';
    if(cs0()) { S.fwOpen = true; S.fw.ser = serClean(SCAN.last); }
  }
});
function cs0(){ var b = brandObj(); return b && !b.own; }
document.addEventListener("change", function(e){ if(e.target && e.target.id==="scfile") scanPhoto(e.target.files && e.target.files[0]); });
window.scanFound = scanFound;

// ===== Ιστορικό επισκέψεων (μόνο στο κινητό) =====
var HIST = LS.get("vl_hist", []); // [{id,ts,cust,brand,cat,oem,model,ser,code,fix,note}]
function histSave(){ LS.set("vl_hist", HIST); }
function histFind(ser, model){
  var sv = serClean(ser), mv = serClean(model);
  return HIST.filter(function(h){ return (sv.length>=6 && serClean(h.ser)===sv) || (!sv && mv.length>=6 && serClean(h.model)===mv); });
}
function histSeenHtml(ser, model){
  var r = histFind(ser, model); if(!r.length) return "";
  return '<div class="hseen"><b>📒 Έχεις ξαναδουλέψει αυτή τη μονάδα ('+r.length+'):</b>'+r.slice(0,3).map(function(h){
    return '<div class="small">'+esc(new Date(h.ts).toLocaleDateString("el-GR"))+(h.cust?' · '+esc(h.cust):'')+(h.code?' · κωδ. <b>'+esc(h.code)+'</b>':'')+(h.fix?' · '+esc(h.fix):'')+'</div>';
  }).join("")+'</div>';
}
function histDate(ts){ var d = new Date(ts); return d.toLocaleDateString("el-GR")+" "+d.toLocaleTimeString("el-GR",{hour:"2-digit",minute:"2-digit"}); }
function histOpen(mode, id){
  if(!document.getElementById("histov") || document.getElementById("histov").style.display!=="flex") ovPush();
  var ov = document.getElementById("histov");
  if(!ov){ ov = document.createElement("div"); ov.id = "histov"; document.body.appendChild(ov); }
  ov.style.display = "flex"; document.body.style.overflow = "hidden";
  var h = '<div class="schead"><b>📒 Πελάτες – επισκέψεις & ανταλλακτικά</b><button class="mini" id="histclose">✕</button></div>'+
    '<div class="chips htabs"><button class="chip'+(mode!=="parts"&&mode!=="fgas"?' on':'')+'" id="htab_h">📒 Επισκέψεις ('+HIST.length+')</button><button class="chip'+(mode==="parts"?' on':'')+'" id="htab_p">🧾 Ανταλλακτικά ('+PLIST.filter(function(p){return !p.done;}).length+')</button><button class="chip'+(mode==="fgas"?' on':'')+'" id="htab_f">🧯 F‑gas'+fgBadge()+'</button></div>';
  if(mode==="parts"){ ov.innerHTML = h + plistHtml(); return; }
  if(mode==="fgas"){ ov.innerHTML = h + fgBookHtml(); return; }
  if(mode==="form"){
    var e = id ? HIST.filter(function(x){ return x.id===id; })[0] : null, b = brandObj();
    e = e || {cust:"", brand:b?b.n:"", oem:(S.oem && S.oem!=="__all" && PLAT[S.oem])?PLAT[S.oem].name:"", model:S.model||"", ser:S.fw.ser||"", code:S.gdCode||S.q||"", fix:S.gdFix||"", note:S.gdNote||""}; S.gdFix = S.gdNote = S.gdCode = "";
    var f = function(k,l,ph){ return '<label>'+esc(l)+'<input id="hf_'+k+'" value="'+esc(e[k]||"")+'" placeholder="'+esc(ph||"")+'"></label>'; };
    h += '<div class="hform card">'+f("cust","Πελάτης / τοποθεσία","π.χ. Παπαδόπουλος – Καλαμαριά")+f("brand","Μάρκα","")+f("oem","Εργοστάσιο","")+f("model","Μοντέλο","")+
      '<label>Σειριακός<div class="row2"><input id="hf_ser" value="'+esc(e.ser||"")+'"><button class="mini" data-scan="hist"><svg class="ic"><use href="#i-scan"/></svg></button></div></label>'+
      f("code","Κωδικός βλάβης","π.χ. E1, F5")+
      '<label>Τι έκανες / τι άλλαξες<textarea id="hf_fix" placeholder="π.χ. άλλαξα αισθητήριο σωλήνα εσωτ. (20kΩ)">'+esc(e.fix||"")+'</textarea></label>'+
      '<label>Σημειώσεις<textarea id="hf_note" placeholder="μετρήσεις, πιέσεις, ανταλλακτικά που χρειάζονται…">'+esc(e.note||"")+'</textarea></label>'+
      histExtraHtml(e)+
      '<div class="scbtns" style="margin-top:10px"><button class="mini" id="hrep" data-id="'+esc(id||"")+'">📤 Αναφορά για πελάτη</button><button class="mini" id="hprint" data-id="'+esc(id||"")+'">🖨️ Εκτύπωση / PDF</button></div>'+
      '<div class="scbtns" style="margin-top:10px"><button class="mini" id="histsave" data-id="'+esc(id||"")+'">💾 Αποθήκευση</button><button class="mini" id="histlist">Άκυρο</button>'+(id?'<button class="mini" id="histdel" data-id="'+esc(id)+'">🗑️ Διαγραφή</button>':'')+'</div></div>';
  } else {
    h += fgDueBanner()+'<button class="mini scanbtn" id="histnew">➕ Νέα καταχώρηση (από την τρέχουσα βλάβη)</button>'+
      '<input id="histq" placeholder="Αναζήτηση: πελάτης, σειριακός, μοντέλο, κωδικός…" value="'+esc(S.hq||"")+'">'+
      '<div id="histl"></div>'+
      '<div class="small" style="margin-top:12px">Το ιστορικό μένει μόνο σε αυτό το κινητό. Κράτα αντίγραφο πριν αλλάξεις κινητό:</div>'+
      '<div class="scbtns"><button class="mini" id="techedit">👤 Στοιχεία τεχνικού</button></div>'+'<div class="scbtns"><button class="mini" id="histexp">⬇️ Εξαγωγή αντιγράφου</button><label class="mini scphoto">⬆️ Επαναφορά<input type="file" accept=".json,application/json" id="histimp" hidden></label></div>';
  }
  ov.innerHTML = h;
  if(mode==="form") sigInit(e.sig); else histList();
}
function histList(){
  var q = serClean(S.hq||""), el = document.getElementById("histl"); if(!el) return;
  var r = HIST.slice().sort(function(a,b){ return b.ts-a.ts; }).filter(function(h){ if(!q) return true; return serClean([h.cust,h.brand,h.oem,h.model,h.ser,h.code,h.fix,h.note].join(" ")).indexOf(q)>=0; });
  el.innerHTML = r.length ? r.map(function(h){ return '<div class="hcard" data-hid="'+esc(h.id)+'"><div><b>'+esc(h.cust||"—")+'</b>'+(h.code?' · κωδ. <b>'+esc(h.code)+'</b>':'')+'</div><div class="hm">'+esc(histDate(h.ts))+' · '+esc([h.brand,h.oem,h.model].filter(Boolean).join(" · "))+(h.ser?' · S/N '+esc(h.ser):'')+'</div>'+(h.fix?'<div class="small">🔧 '+esc(h.fix)+'</div>':'')+'</div>'; }).join("")
    : '<div class="small">'+(HIST.length?'Δεν βρέθηκε.':'Δεν υπάρχουν καταχωρήσεις ακόμα. Μετά από μια επισκευή πάτα «Νέα καταχώρηση».')+'</div>';
}
function histClose(){ var ov = document.getElementById("histov"); if(ov){ ov.style.display="none"; ov.innerHTML=""; } document.body.style.overflow = ""; ovPop(); }
document.addEventListener("click", function(e){
  var el = e.target.closest("#histbtn,#histclose,#histnew,#histsave,#histlist,#histdel,#histexp,[data-hid],#qscan,[data-qb]"); if(!el) return;
  if(el.id==="qscan"){ scanOpen("quick"); return; }
  if(el.hasAttribute("data-qb")){ var nm = el.getAttribute("data-qb"), t = SCAN.last, qm = el.getAttribute("data-qm")||"", qo = el.getAttribute("data-qo")||""; scanClose(); S.brand = nm; S.bedit=false; S.catOpen=true; S.oem=(qo && PLAT[qo])?qo:null; S.model=qm; S.ledv={}; S.fw={plate:"",rc:"",comp:"",pcb:"",ser:serClean(t)}; S.fwOpen = true; renderAll(); return; }
  if(el.id==="histbtn"){ histOpen("list"); return; }
  if(el.id==="histclose"){ histClose(); return; }
  if(el.id==="histnew"){ histOpen("form"); return; }
  if(el.id==="histlist"){ histOpen("list"); return; }
  if(el.hasAttribute("data-hid")){ histOpen("form", el.getAttribute("data-hid")); return; }
  if(el.id==="histsave"){
    var id = el.getAttribute("data-id"), o = histReadForm();
    if(id){ HIST.forEach(function(h){ if(h.id===id){ for(var k in o) h[k]=o[k]; } }); }
    else { o.id = "h"+Date.now().toString(36); o.ts = Date.now(); o.cat = S.cat; HIST.push(o); }
    histSave(); histOpen("list"); return;
  }
  if(el.id==="histdel"){ var d = el.getAttribute("data-id"); if(el.getAttribute("data-c")!=="1"){ el.setAttribute("data-c","1"); el.textContent="Πάτα ξανά για διαγραφή"; return; } HIST = HIST.filter(function(h){ return h.id!==d; }); histSave(); histOpen("list"); return; }
  if(el.id==="histexp"){
    var blob = new Blob([JSON.stringify({app:"vlavologio", v:2, hist:HIST, serLearn:serLearn, myMap:LS.get("vl_mymap",[]), ls:vlAllLS()}, null, 1)], {type:"application/json"}), fn = "vlavologio-istoriko-"+new Date().toISOString().slice(0,10)+".json";
    try{ var file = new File([blob], fn, {type:"application/json"}); if(navigator.canShare && navigator.canShare({files:[file]})){ navigator.share({files:[file], title:"Βλαβολόγιο – αντίγραφο"}).catch(function(){}); return; } }catch(x){}
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500); return;
  }
});
document.addEventListener("input", function(e){ if(e.target && e.target.id==="histq"){ S.hq = e.target.value; histList(); } });
document.addEventListener("change", function(e){
  if(!e.target || e.target.id!=="histimp" || !e.target.files || !e.target.files[0]) return;
  var rd = new FileReader(); rd.onload = function(){ try{ var d = JSON.parse(rd.result); if(!d || d.app!=="vlavologio") throw 0;
    if(d.ls){ vlMergeLS(d.ls); alert("✅ Η επαναφορά έγινε."); location.reload(); return; }
    var ids = {}; HIST.forEach(function(h){ ids[h.id]=1; }); (d.hist||[]).forEach(function(h){ if(h && h.id && !ids[h.id]) HIST.push(h); }); histSave();
    if(d.serLearn){ d.serLearn.forEach(function(l){ if(!serLearn.some(function(x){ return x.b===l.b && x.p===l.p; })) serLearn.push(l); }); LS.set("vl_serlearn", serLearn); }
    histOpen("list"); } catch(x){ alert("Το αρχείο δεν είναι αντίγραφο του Βλαβολογίου."); } };
  rd.readAsText(e.target.files[0]);
});

// ===== Οδηγός βήμα-βήμα (DTREE) =====
S.dt = null; // {t:key, path:[nodeIds]}
function dtreeHtml(){
  if(typeof DTREE==="undefined") return "";
  if(!S.dt) return '<div class="dtw"><div class="lbl" style="margin-top:0">🧭 Οδηγός βήμα-βήμα (χωρίς κωδικό)</div><div class="chips">'+Object.keys(DTREE).map(function(k){ return '<button class="chip" data-dtstart="'+k+'">'+esc(DTREE[k].t)+'</button>'; }).join("")+'</div></div>';
  var tr = DTREE[S.dt.t], id = S.dt.path[S.dt.path.length-1], nd = tr.n[id];
  if(nd.go){ S.dt = {t:nd.go, path:[DTREE[nd.go].start]}; return dtreeHtml(); }
  var h = '<div class="dtw"><div class="dthead"><b>'+esc(tr.t)+'</b><span class="small">βήμα '+S.dt.path.length+'</span></div>';
  if(nd.q) h += '<div class="dtq">'+esc(nd.q)+'</div><div class="dtbtns"><button class="mini dty" data-dta="y">✔ Ναι</button><button class="mini dtn" data-dta="n">✘ Όχι</button></div>';
  else {
    var p = nd.p ? partById(nd.p) : null;
    h += '<div class="dtr">🎯 '+esc(nd.r)+'</div>'+(p?'<button class="plk" data-gopart="'+p.id+'">'+p.icon+' Πώς μετράω: '+esc(p.name)+'</button>':'')+
      '<div class="dtbtns">'+(nd.pl?'<button class="mini" data-plist="'+esc(nd.pl)+'">🧾 Βάλε στη λίστα: '+esc(nd.pl)+'</button>':'')+'<button class="mini" data-dtnote="'+esc(nd.r.slice(0,140))+'">📒 Καταχώρηση</button></div>';
  }
  h += '<div class="dtbtns small"><button class="mini" data-dta="back"'+(S.dt.path.length>1?'':' disabled')+'>← Πίσω</button><button class="mini" data-dta="stop">✕ Τέλος</button></div></div>';
  return h;
}
function dtRefresh(){ var w = document.querySelector(".dtw"); if(w){ var d = document.createElement("div"); d.innerHTML = dtreeHtml(); w.parentNode.replaceChild(d.firstChild, w); } }
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-dtstart],[data-dta],[data-dtnote]"); if(!el) return;
  if(el.hasAttribute("data-dtstart")){ var k = el.getAttribute("data-dtstart"); S.dt = {t:k, path:[DTREE[k].start]}; dtRefresh(); return; }
  if(el.hasAttribute("data-dtnote")){ S.dtnote = el.getAttribute("data-dtnote"); histOpen("form"); var f = document.getElementById("hf_note"); if(f && !f.value) f.value = "Οδηγός: "+S.dtnote; return; }
  var a = el.getAttribute("data-dta");
  if(a==="stop"){ S.dt = null; dtRefresh(); return; }
  if(a==="back"){ if(S.dt.path.length>1) S.dt.path.pop(); dtRefresh(); return; }
  var tr = DTREE[S.dt.t], nd = tr.n[S.dt.path[S.dt.path.length-1]], nx = nd[a];
  if(nx){ var n2 = tr.n[nx]; if(n2 && n2.go){ S.dt = {t:n2.go, path:[DTREE[n2.go].start]}; } else S.dt.path.push(nx); }
  dtRefresh(); var w = document.querySelector(".dtw"); if(w) w.scrollIntoView({behavior:"smooth", block:"nearest"});
});

// ===== Λίστα ανταλλακτικών =====
var PLIST = LS.get("vl_plist", []); // [{id,txt,ctx,ts,done}]
function plistSave(){ LS.set("vl_plist", PLIST); }
function plistAdd(txt){
  var b = brandObj(), ctx = [b?b.n:"", (S.oem && S.oem!=="__all" && PLAT[S.oem])?PLAT[S.oem].name:"", S.model||""].filter(Boolean).join(" · ");
  PLIST.push({id:"p"+Date.now().toString(36), txt:txt, ctx:ctx, ts:Date.now(), done:false}); plistSave();
}
function plistHtml(){
  var open = PLIST.filter(function(p){ return !p.done; }), done = PLIST.filter(function(p){ return p.done; });
  var row = function(p){ return '<div class="hcard prow'+(p.done?' pdone':'')+'"><label><input type="checkbox" data-pchk="'+p.id+'"'+(p.done?' checked':'')+'> <b>'+esc(p.txt)+'</b></label>'+(p.ctx?'<div class="hm">'+esc(p.ctx)+'</div>':'')+'<button class="x" data-pdel="'+p.id+'">✕</button></div>'; };
  return '<div class="row2" style="margin:6px 0"><input id="pnew" placeholder="π.χ. αισθητήριο σωλήνα 20kΩ, πυκνωτής 35µF…"><button class="mini" id="padd">➕</button></div>'+
    (open.length ? open.map(row).join("") : '<div class="small">Η λίστα είναι άδεια. Πρόσθεσε από εδώ ή από τον οδηγό βήμα-βήμα.</div>')+
    (open.length ? '<div class="scbtns" style="margin-top:8px"><button class="mini" id="pshare">📤 Στείλε τη λίστα (παραγγελία)</button></div>' : '')+
    (done.length ? '<details style="margin-top:10px"><summary class="small">Πάρθηκαν ('+done.length+')</summary>'+done.map(row).join("")+'<button class="mini" id="pclear">🗑️ Καθάρισε όσα πάρθηκαν</button></details>' : '');
}
function shareText(t, title){
  if(navigator.share){ navigator.share({title:title||"Βλαβολόγιο", text:t}).catch(function(){ copyText(t); }); return; }
  copyText(t);
}
function copyText(t){
  var done = function(){ var m = document.getElementById("copied"); if(!m){ m = document.createElement("div"); m.id = "copied"; document.body.appendChild(m); } m.textContent = "✔ Αντιγράφηκε – κάνε επικόλληση σε Viber / email"; m.className = "toast"; setTimeout(function(){ m.className = ""; }, 2500); };
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function(){ fallbackCopy(t); done(); });
  else { fallbackCopy(t); done(); }
}
function fallbackCopy(t){ var ta = document.createElement("textarea"); ta.value = t; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); try{ document.execCommand("copy"); }catch(x){} ta.remove(); }
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-plist],#padd,[data-pdel],#pshare,#pclear,#htab_h,#htab_p"); if(!el) return;
  if(el.hasAttribute("data-plist")){ plistAdd(el.getAttribute("data-plist")); el.textContent = "✔ Προστέθηκε στη λίστα"; el.disabled = true; return; }
  if(el.id==="htab_h"){ histOpen("list"); return; }
  if(el.id==="htab_p"){ histOpen("parts"); return; }
  if(el.id==="padd"){ var i = document.getElementById("pnew"); if(i && i.value.trim()){ plistAdd(i.value.trim()); histOpen("parts"); } return; }
  if(el.hasAttribute("data-pdel")){ var d = el.getAttribute("data-pdel"); PLIST = PLIST.filter(function(p){ return p.id!==d; }); plistSave(); histOpen("parts"); return; }
  if(el.id==="pclear"){ PLIST = PLIST.filter(function(p){ return !p.done; }); plistSave(); histOpen("parts"); return; }
  if(el.id==="pshare"){ var t = "Ανταλλακτικά:\n"+PLIST.filter(function(p){ return !p.done; }).map(function(p){ return "• "+p.txt+(p.ctx?" ("+p.ctx+")":""); }).join("\n"); shareText(t, "Λίστα ανταλλακτικών"); return; }
});
document.addEventListener("change", function(e){ var c = e.target; if(c && c.hasAttribute && c.hasAttribute("data-pchk")){ var id = c.getAttribute("data-pchk"); PLIST.forEach(function(p){ if(p.id===id) p.done = c.checked; }); plistSave(); histOpen("parts"); } });

// ===== Κλείσιμο παραθύρων με «πίσω» / Escape (και στην εγκατεστημένη εφαρμογή iPhone) =====
var OVN = 0;
function ovPush(){ try{ history.pushState({vlov:1}, ""); OVN++; }catch(x){} }
function ovPop(){ if(OVN>0){ OVN--; try{ if(history.state && history.state.vlov) history.back(); }catch(x){} } }
window.addEventListener("popstate", function(){
  var sc = document.getElementById("scanov"), hi = document.getElementById("histov");
  if(sc && sc.style.display && sc.style.display!=="none"){ OVN=Math.max(0,OVN-1); scanStop(); sc.style.display="none"; sc.innerHTML=""; document.body.style.overflow=""; return; }
  if(hi && hi.style.display==="flex"){ OVN=Math.max(0,OVN-1); hi.style.display="none"; hi.innerHTML=""; document.body.style.overflow=""; }
});
document.addEventListener("keydown", function(e){ if(e.key!=="Escape") return; var sc=document.getElementById("scanov"), hi=document.getElementById("histov");
  if(sc && sc.style.display && sc.style.display!=="none") scanClose(); else if(hi && hi.style.display==="flex") histClose(); });

// ===== Αναφορά για πελάτη =====
function reportText(h){
  var L = ["ΑΝΑΦΟΡΑ ΕΠΙΣΚΕΥΗΣ ΚΛΙΜΑΤΙΣΤΙΚΟΥ", "Ημερομηνία: "+new Date(h.ts||Date.now()).toLocaleDateString("el-GR")];
  if(h.cust) L.push("Πελάτης: "+h.cust);
  var u = [h.brand, h.model].filter(Boolean).join(" "); if(u) L.push("Μονάδα: "+u);
  if(h.ser) L.push("Σειριακός: "+h.ser);
  if(h.code) L.push("Κωδικός βλάβης: "+h.code);
  var m = measTxt(h); if(m) L.push("Μετρήσεις: "+m);
  var r = refTxt(h); if(r) L.push("Ψυκτικό: "+r);
  if(h.fix) L.push("Εργασία: "+h.fix);
  if(h.note) L.push("Σημειώσεις: "+h.note);
  var t = TECH(); if(t.name || t.company) L.push("Τεχνικός: "+[t.name, t.company, t.phone, t.cert?("πιστ. F‑gas "+t.cert):""].filter(Boolean).join(" · "));
  return L.join("\n");
}
function reportPrint(h){
  var w = document.getElementById("printarea"); if(!w){ w = document.createElement("div"); w.id = "printarea"; document.body.appendChild(w); }
  w.innerHTML = reportHtml(h);
  document.documentElement.classList.add("printing"); setTimeout(function(){ try{ window.print(); }catch(x){} setTimeout(function(){ document.documentElement.classList.remove("printing"); }, 500); }, 50);
}
function curFormEntry(){ var o = histReadForm(); o.ts = Date.now(); return o; }
document.addEventListener("click", function(e){
  var el = e.target.closest("#hrep,#hprint"); if(!el) return;
  var o = curFormEntry(), id = el.getAttribute("data-id"); if(id){ HIST.forEach(function(h){ if(h.id===id) o.ts = h.ts; }); }
  if(el.id==="hrep") shareText(reportText(o), "Αναφορά επισκευής"); else reportPrint(o);
});

// ===== Επιπλέον φρέον =====
function chargeForm(){
  var sel = S.chg || "midea";
  return '<div class="pcalcw"><div class="lbl">⚖️ Υπολογισμός επιπλέον φρέον</div>'+
    '<label class="small">Μονάδα / εργοστάσιο<select id="chg_k" class="pv">'+CHARGE.map(function(c){ return '<option value="'+c.k+'"'+(c.k===sel?' selected':'')+'>'+esc(c.n)+'</option>'; }).join("")+'</select></label>'+
    '<div class="row2"><label class="small">Μήκος σωλήνα υγρού (m, μία κατεύθυνση)<input id="chg_l" class="pv" inputmode="decimal" placeholder="π.χ. 12"></label>'+
    '<label class="small">Διάμετρος υγρού<select id="chg_d" class="pv"><option value="14">1/4" (6,35)</option><option value="38">3/8" (9,52)</option></select></label></div>'+
    '<div class="row2"><label class="small">Χωρίς επιπλέον μέχρι (m)<input id="chg_s" class="pv" inputmode="decimal"></label><label class="small">g ανά μέτρο<input id="chg_g" class="pv" inputmode="decimal"></label></div>'+
    '<div id="chg_out"></div></div>';
}
function chargeFill(){ var c = CHARGE.filter(function(x){ return x.k===(S.chg||"midea"); })[0]; if(!c) return; var d = document.getElementById("chg_d"); var s = document.getElementById("chg_s"), g = document.getElementById("chg_g"); if(s) s.value = c.std; if(g) g.value = (d && d.value==="38") ? (c.g38 || "") : c.g; chargeCalc(); }
function chargeCalc(){
  var o = document.getElementById("chg_out"); if(!o) return;
  var c = CHARGE.filter(function(x){ return x.k===(S.chg||"midea"); })[0] || {};
  var L = parseFloat(String((document.getElementById("chg_l")||{}).value||"").replace(",",".")), st = parseFloat(String(document.getElementById("chg_s").value).replace(",",".")), g = parseFloat(String(document.getElementById("chg_g").value).replace(",","."));
  var d = document.getElementById("chg_d").value;
  var h = '<div class="small" style="margin-top:6px">📘 '+esc(c.src||"")+'</div>';
  if(d==="38" && !c.g38 && c.k!=="own") h += '<div class="pver mid" style="margin-top:6px">Για υγρό 3/8" δεν έχω τιμή από manual γι\' αυτή τη μονάδα – γράψε το g/m από το ταμπελάκι.</div>';
  if(isNaN(L) || isNaN(st) || isNaN(g)){ o.innerHTML = h; return; }
  var base = c.base!=null ? c.base : st, add = L > st ? Math.round((L - base) * g) : 0;
  o.innerHTML = '<div class="pver '+(add?'mid':'good')+'" style="margin-top:8px">'+(add ? '➕ Πρόσθεσε <b>'+add+' g</b> ('+(L-base).toFixed(1).replace(".",",")+' m × '+g+' g/m)' : '✅ Δεν χρειάζεται επιπλέον φρέον (μέχρι '+st+' m)')+'</div>'+h+
    '<div class="small">Ζύγισε με ζυγαριά, γράψε την προσθήκη στο ταμπελάκι και έλεγξε ότι το συνολικό φορτίο δεν ξεπερνά το όριο για το εμβαδόν του χώρου (R32/R290).</div>';
}
document.addEventListener("change", function(e){ var t = e.target; if(!t) return; if(t.id==="chg_k"){ S.chg = t.value; chargeFill(); } else if(t.id==="chg_d"){ chargeFill(); } });
document.addEventListener("input", function(e){ var t = e.target; if(t && /^chg_[lsg]$/.test(t.id)) chargeCalc(); });

// ===== Λειτουργία πεδίου (μεγάλα γράμματα, υψηλή αντίθεση) =====
function setField(on){ LS.set("vl_field", !!on); document.documentElement.classList.toggle("field", !!on); var b = document.getElementById("fieldbtn"); if(b){ b.classList.toggle("on", !!on); b.innerHTML = '<span class="hmic">🔠</span><span>Μεγάλα γράμματα: '+(on?"ΝΑΙ":"ΟΧΙ")+'<small>Για χρήση στο πεδίο, με έντονη αντίθεση</small></span>'; b.title = on ? "Λειτουργία πεδίου: ΝΑΙ" : "Λειτουργία πεδίου (μεγάλα γράμματα, έντονη αντίθεση)"; } }
document.addEventListener("click", function(e){ if(e.target.closest("#fieldbtn")) setField(!document.documentElement.classList.contains("field")); });
setField(LS.get("vl_field", false));

// ===== Αναζήτηση κωδικού χωρίς μάρκα (σε ποια εργοστάσια υπάρχει) =====
function reverseHtml(q){
  var n = norm(q), seen = {}, rows = [];
  Object.keys(PLAT).forEach(function(p){
    (PLAT[p][S.cat]||[]).forEach(function(tn){ var t = T[tn]; if(!t || !t.codes) return;
      t.codes.forEach(function(c){ if(seen[p]) return; if(c[0].some(function(k){ return norm(k)===n; })){ seen[p]=1; rows.push({p:p, c:c}); } });
    });
  });
  if(!rows.length) return '<div class="empty">Ο κωδικός «'+esc(q)+'» δεν βρέθηκε σε κανένα βλαβολόγιο αυτής της κατηγορίας. Διάλεξε μάρκα ή άλλη κατηγορία.</div>';
  return '<div class="small info">🔎 Δεν διάλεξες μάρκα – ο κωδικός <b>'+esc(q.toUpperCase())+'</b> υπάρχει σε <b>'+rows.length+'</b> εργοστάσια. Το νόημα αλλάζει ανά εργοστάσιο:</div>'+
    (rows.length>1 ? '<button class="mini scanbtn" data-fzopen="'+esc(q.toUpperCase())+'">🧪 Δεν ξέρω το εργοστάσιο – βρες το με μια απλή δοκιμή</button><div id="ftbox">'+(S.fz?ftHtml():'')+'</div>' : '')+
    rows.map(function(r){
      var bb = null; BRANDS.forEach(function(b){ if(!bb && b.own===r.p) bb = b; });
      if(!bb && r.p==="inv_gree") BRANDS.forEach(function(b){ if(!bb && b.n==="Inventor") bb = b; });
      return '<div class="hcard"><b>'+esc(PLAT[r.p].name)+'</b> – '+esc(r.c[1])+(bb?'<div style="margin-top:6px"><button class="mini" data-b="'+esc(bb.n)+'">Άνοιξε '+esc(bb.n)+' →</button></div>':'')+'</div>';
    }).join("");
}

// ===== Μετατροπές μονάδων =====
var CONV = {
  p:{t:"Πίεση", u:[["bar","bar (μανόμετρο)",1],["psi","psi",1/14.5038],["mpa","MPa",10],["kpa","kPa",0.01]]},
  t:{t:"Θερμοκρασία", u:[["c","°C"],["f","°F"],["k","K"]]},
  w:{t:"Ισχύς", u:[["btu","BTU/h",1/3412.14],["kw","kW",1],["ton","τόνοι ψύξης (TR)",3.5169]]}
};
function convForm(){
  return '<div class="pcalcw"><div class="lbl">🔁 Μετατροπές μονάδων</div>'+Object.keys(CONV).map(function(k){ var c = CONV[k];
    return '<div class="convr"><div class="small"><b>'+c.t+'</b></div><div class="row2"><input id="cv_'+k+'" class="pv" inputmode="decimal" placeholder="τιμή"><select id="cvu_'+k+'" class="pv">'+c.u.map(function(u){ return '<option value="'+u[0]+'">'+esc(u[1])+'</option>'; }).join("")+'</select></div><div id="cvo_'+k+'" class="small"></div></div>'; }).join("")+
    '<div class="small" style="margin-top:6px">Τα «χιλιάρικα» (9.000/12.000/18.000/24.000) είναι BTU/h. 12.000 BTU/h ≈ 3,5 kW ≈ 1 τόνος ψύξης.</div></div>';
}
function convCalc(k){
  var o = document.getElementById("cvo_"+k); if(!o) return;
  var v = parseFloat(String(document.getElementById("cv_"+k).value).replace(",",".")), u = document.getElementById("cvu_"+k).value, c = CONV[k];
  if(isNaN(v)){ o.textContent = ""; return; }
  var f = function(x,d){ return (Math.round(x*Math.pow(10,d))/Math.pow(10,d)).toString().replace(".",","); };
  if(k==="t"){ var cc = u==="c"?v:u==="f"?(v-32)*5/9:v-273.15; o.innerHTML = '= <b>'+f(cc,1)+' °C</b> · '+f(cc*9/5+32,1)+' °F · '+f(cc+273.15,1)+' K'; return; }
  var base = v * c.u.filter(function(x){ return x[0]===u; })[0][2];
  o.innerHTML = '= '+c.u.filter(function(x){ return x[0]!==u; }).map(function(x){ return '<b>'+f(base/x[2], k==="p"&&x[0]==="psi"?0:2)+'</b> '+esc(x[1].replace(/ \(.*\)/,"")); }).join(" · ")+(k==="p"?' · απόλυτη: '+f(base+1.013,2)+' bar':'');
}
document.addEventListener("input", function(e){ var m = e.target && e.target.id && e.target.id.match(/^cv_(\w)$/); if(m) convCalc(m[1]); });
document.addEventListener("change", function(e){ var m = e.target && e.target.id && e.target.id.match(/^cvu_(\w)$/); if(m) convCalc(m[1]); });

// ===== Έλεγχος πυκνωτή =====
function capForm(){
  return '<div class="pcalcw"><div class="lbl">🔋 Έλεγχος πυκνωτή</div><div class="row2"><label class="small">Ετικέτα (μF)<input id="cap_n" class="pv" inputmode="decimal" placeholder="π.χ. 35"></label><label class="small">Μέτρησα (μF)<input id="cap_m" class="pv" inputmode="decimal" placeholder="π.χ. 31,2"></label><label class="small">Ανοχή ετικέτας<select id="cap_t" class="pv"><option value="5">±5%</option><option value="10">±10%</option><option value="6">±6%</option></select></label></div><div id="cap_o"></div></div>';
}
function capCalc(){
  var o = document.getElementById("cap_o"); if(!o) return;
  var n = parseFloat(String(document.getElementById("cap_n").value).replace(",",".")), m = parseFloat(String(document.getElementById("cap_m").value).replace(",",".")), t = +document.getElementById("cap_t").value;
  if(isNaN(n) || isNaN(m) || n<=0){ o.innerHTML = ""; return; }
  var d = (m-n)/n*100, ad = Math.abs(d), cls = ad<=t ? "good" : ad<=10 ? "mid" : "bad";
  var msg = ad<=t ? "✅ Εντάξει – μέσα στην ανοχή της ετικέτας" : ad<=10 ? "🟡 Οριακός – εκτός ανοχής ετικέτας αλλά <10%. Αν το μοτέρ/συμπιεστής δυσκολεύεται, άλλαξέ τον." : (m<n ? "❌ Χαλασμένος – έχει πέσει πάνω από 10%. Άλλαξέ τον με ίδια μF και ίδια ή μεγαλύτερη τάση (V)." : "❌ Μετράει πολύ πάνω από την ετικέτα – ξαναμέτρησε (ξεφόρτωσέ τον πρώτα) ή άλλαξέ τον.");
  o.innerHTML = '<div class="pver '+cls+'" style="margin-top:8px">'+msg+'<div class="small" style="font-weight:500">Απόκλιση: '+(d>0?"+":"")+d.toFixed(1).replace(".",",")+'% (επιτρεπτό ±'+t+'%: '+(n*(1-t/100)).toFixed(1).replace(".",",")+'–'+(n*(1+t/100)).toFixed(1).replace(".",",")+' μF)</div></div>';
}
document.addEventListener("input", function(e){ if(e.target && /^cap_[nm]$/.test(e.target.id)) capCalc(); });
document.addEventListener("change", function(e){ if(e.target && e.target.id==="cap_t") capCalc(); });

// ===== 🧪 Βρες το εργοστάσιο προκαλώντας γνωστή βλάβη =====
var FTEST = [
 {k:"amb", side:"out", t:"Αισθητήριο εξωτερικού αέρα (εξωτερική)", rx:/^(αισθητήρ|θερμίστορ)[^.;]{0,40}(εξωτερικού αέρα|εξωτ\. αέρα|περιβάλλοντος|εξωτερικής θερμοκρασίας)|^(αισθητήρ|θερμίστορ).{0,30}\b(T4|TO|TH7)\b|^θερμίστορ εξωτερικής/i,
  how:["Κλείσε το ρεύμα από την ασφάλεια και περίμενε 3–5 λεπτά (οι πυκνωτές της εξωτερικής κρατάνε τάση).","Άνοιξε το καπάκι της εξωτερικής και βγάλε τη φίσα του αισθητηρίου εξωτερικού αέρα (το αισθητήριο που κρέμεται στον αέρα πίσω από το στοιχείο, σε πλαστική βάση – ΟΧΙ σε σωλήνα).","Δώσε ρεύμα. Περίμενε 1–2 λεπτά ΧΩΡΙΣ να ανάψεις τη μονάδα – τα αισθητήρια ελέγχονται αμέσως, πριν ξεκινήσει ανεμιστήρας ή συμπιεστής.","Αν δεν βγει κωδικός, άναψε με το τηλεχειριστήριο και περίμενε έως 3 λεπτά.","Γράψε τον κωδικό (στην οθόνη της εσωτερικής ή τις αναλαμπές της πλακέτας εξωτερικής – όπως διάλεξες πάνω). Κλείσε ρεύμα, περίμενε και ξανάβαλε τη φίσα."]},
 {k:"oc", side:"out", t:"Αισθητήριο στοιχείου εξωτερικής", rx:/^(αισθητήρ|θερμίστορ)[^.;]{0,40}(στοιχείου εξωτ|σωλήνα εξωτ|συμπυκνωτή|απόψυξης|COND|εξωτερικού στοιχείου|μέσου στοιχείου ε)|^(αισθητήρ|θερμίστορ).{0,30}\b(T3|TE|TH3)\b|^θερμίστορ εξωτερικής/i,
  how:["Κλείσε το ρεύμα και περίμενε 3–5 λεπτά.","Βγάλε τη φίσα του αισθητηρίου στοιχείου εξωτερικής (μπαίνει σε θήκη πάνω σε σωληνάκι του στοιχείου).","Δώσε ρεύμα και περίμενε 1–2 λεπτά χωρίς να ανάψεις· αν δεν βγει κωδικός, άναψε και περίμενε έως 3 λεπτά.","Γράψε τον κωδικό (οθόνη εσωτερικής ή αναλαμπές εξωτερικής). Κλείσε ρεύμα, περίμενε και ξανάβαλε τη φίσα."]},
 {k:"dis", side:"out", t:"Αισθητήριο κατάθλιψης (εξωτερική)", rx:/^(αισθητήρ|θερμίστορ)[^.;]{0,30}κατάθλιψ|^(αισθητήρ|θερμίστορ).{0,30}\b(TP|TD|T5|TH4)\b/i, warn:"Σε αρκετές μονάδες το αισθητήριο κατάθλιψης ελέγχεται μόνο αφού ξεκινήσει ο συμπιεστής – αν η αρχική βλάβη σταματά τον συμπιεστή πριν, προτίμησε τα άλλα δύο αισθητήρια.",
  how:["Κλείσε το ρεύμα και περίμενε 3–5 λεπτά.","Βγάλε τη φίσα του αισθητηρίου κατάθλιψης (στον σωλήνα που βγαίνει από την κορυφή του συμπιεστή).","Δώσε ρεύμα, άναψε τη μονάδα και περίμενε έως 3–5 λεπτά.","Γράψε τον κωδικό. Κλείσε ρεύμα, περίμενε και ξανάβαλε τη φίσα."]},
 {k:"room", side:"in", t:"Αισθητήριο χώρου (εσωτερική)", rx:/^(αισθητήρ|θερμίστορ)[^.;]{0,40}(χώρου|αέρα εισόδου|εισόδου αέρα|αέρα επιστροφής)|^(αισθητήρ|θερμίστορ).{0,30}\b(T1|TA|TH1)\b/i,
  how:["Κλείσε το ρεύμα από την ασφάλεια.","Βγάλε τη φίσα του αισθητηρίου χώρου από την πλακέτα εσωτερικής (2 καλώδια – το αισθητήριο κρέμεται στη ροή αέρα μπροστά από το στοιχείο, όχι κολλημένο πάνω στον σωλήνα).","Δώσε ρεύμα και άναψε τη μονάδα με το τηλεχειριστήριο.","Περίμενε έως 2–3 λεπτά και γράψε τον κωδικό που βγάζει.","Κλείσε ρεύμα και ξανάβαλε τη φίσα."]},
 {k:"coil", side:"in", t:"Αισθητήριο στοιχείου εσωτερικής", rx:/^(αισθητήρ|θερμίστορ)[^.;]{0,40}(στοιχείου εσωτ|σωλήνα εσωτ|εσωτερικού στοιχείου|EVA|μέσης θερμ|μέσου σωλήνα εσωτ)|^(αισθητήρ|θερμίστορ).{0,30}\b(T2|TC|TH2)\b/i,
  how:["Κλείσε το ρεύμα.","Βγάλε τη φίσα του αισθητηρίου στοιχείου (σωλήνα) – είναι αυτό που μπαίνει σε θήκη πάνω στον χαλκοσωλήνα του στοιχείου.","Δώσε ρεύμα, άναψε τη μονάδα σε ψύξη.","Περίμενε έως 2–3 λεπτά και γράψε τον κωδικό.","Κλείσε ρεύμα και ξανάβαλε τη φίσα."]},
 {k:"fan", side:"in", t:"Μοτέρ ανεμιστήρα εσωτερικής", rx:/(ανεμιστήρ|μοτέρ)[^.;]{0,25}εσωτερικ/i, warn:"Η φίσα των DC μοτέρ έχει ~310V: βγάλ' τη ΜΟΝΟ με κλειστό ρεύμα και αφού περιμένεις 2–3 λεπτά. Κάνε αυτή τη δοκιμή μόνο αν δεν αρκούν οι άλλες.",
  how:["Κλείσε το ρεύμα και περίμενε 2–3 λεπτά.","Βγάλε τη φίσα του μοτέρ ανεμιστήρα εσωτερικής από την πλακέτα.","Δώσε ρεύμα και άναψε τη μονάδα.","Περίμενε έως 1–2 λεπτά και γράψε τον κωδικό.","Κλείσε ρεύμα, περίμενε και ξανάβαλε τη φίσα."]}
];
S.fz = null; // {orig, tests:[{k,code}], scope:[plats]|null, step:k}
function ftMain(p){ var r = []; (PLAT[p][S.cat]||[]).forEach(function(tn){ var t = T[tn]; if(t && t.codes) t.codes.forEach(function(c){ r.push(c); }); }); return r; }
function ftHasLed(p){ return !!(OUTP[p] && (OUTP[p][S.cat]||[]).some(function(tn){ return T[tn] && T[tn].codes; })); }
// λυχνίες εξωτερικής: [κλειδιά, νόημα] – αν η λυχνία παραπέμπει σε κωδικό εσωτερικής (→ E2), παίρνει το νόημα εκείνου
function ftLed(p){
  var r = [], main = ftMain(p);
  ((OUTP[p] && OUTP[p][S.cat])||[]).forEach(function(tn){ var t = T[tn]; if(!t || !t.codes) return;
    if((PLAT[p][S.cat]||[]).indexOf(tn)>=0){ t.codes.forEach(function(c){ r.push(c); }); return; }
    t.codes.forEach(function(c){ var keys = c[0].map(function(k){ return String(k).split("/")[0]; });
      String(c[1]).split("|").forEach(function(part){ var txt = part.trim(), d = txt, lab = "", m = txt.match(/^(.*?)→\s*(?:εσωτερική\s*)?([A-Z]{0,3}\d{1,3}[A-Z]?)\b\s*(.*)$/);
        if(m){ lab = m[1].trim(); var n = norm(m[2]), mc = main.filter(function(x){ return x[0].some(function(k){ return norm(k)===n; }); })[0]; d = mc ? String(mc[1]) : (m[3]||txt); }
        else { var m2 = txt.match(/[–-]\s*(.+)$/); if(m2) d = m2[1]; }
        d = d.replace(/^Εξωτερική:\s*/,''); var q = d.search(/αισθητήρ|θερμίστορ|ανεμιστήρ|μοτέρ/i); if(q>0 && /:\s*$/.test(d.slice(0,q))) d = d.slice(q);
        r.push([keys, d, lab ? lab.replace(/\s*×\s*/, " × ") : keys.join("/")]); });
    });
  });
  return r;
}
function ftCodes(p){ return S.fz && S.fz.src==="led" ? ftLed(p) : ftMain(p); }
function ftFind(p, code){ var n = norm(code); return ftCodes(p).filter(function(c){ return c[0].some(function(k){ return norm(k)===n; }); }); }
function ftScope(){ var b = brandObj(), sc = (b && !b.own) ? candidates(b) : Object.keys(PLAT).filter(function(p){ return p!=="inv_mc" && (PLAT[p][S.cat]||[]).length; }); return S.fz && S.fz.src==="led" ? sc.filter(ftHasLed) : sc; }
function ftEval(){
  var f = S.fz, sc = ftScope(), steps = [];
  var cur = sc.filter(function(p){ return f.orig ? ftFind(p, f.orig).length : true; });
  steps.push({lab:"Αρχικός κωδικός «"+f.orig+"»", list:cur.slice()});
  f.tests.forEach(function(ts){ if(!ts.code) return; var T0 = FTEST.filter(function(x){ return x.k===ts.k; })[0];
    cur = cur.filter(function(p){ return ftFind(p, ts.code).some(function(c){ return T0.rx.test(String(c[1])); }); });
    steps.push({lab:T0.t+" → «"+ts.code+"»", list:cur.slice()});
  });
  return {cur:cur, steps:steps};
}
function ftSide(cands){
  if(S.fz.side) return S.fz.side;
  var o = 0, n = 0;
  cands.forEach(function(p){ var d = ftFind(p, S.fz.orig)[0]; if(!d) return; var t = String(d[1]);
    if(/επικοιν|σήμα|μετάδοσ|transmission/i.test(t)) n++;
    else if(/εξωτερικ|συμπιεστ|IPM|inverter|κατάθλιψ|πίεσ|PFC|υπερέντ|τάση|ρεύμα|4οδη|εκτονωτ|ψύκτρ|module/i.test(t)) o++;
    else n++; });
  return o > n || (o===n && o>0 && S.cat==="multi") ? "out" : "in";
}
function ftHtml(){
  var f = S.fz; if(!f) return "";
  var h = '<div class="ftw"><div class="dthead"><b>🧪 Βρες το εργοστάσιο με γνωστή βλάβη</b><button class="x" data-fz="close">✕</button></div>';
  var led = f.src==="led";
  h += '<div class="small">Πού βλέπεις τη βλάβη;</div><div class="chips"><button class="chip'+(!led?' on':'')+'" data-fzsrc="in">📺 Οθόνη εσωτερικής</button><button class="chip'+(led?' on':'')+'" data-fzsrc="led">💡 Λυχνίες / οθόνη πλακέτας εξωτερικής</button></div>'+
    (led ? '<div class="small">Αν η πλακέτα έχει <b>οθόνη</b> (π.χ. Midea multi), γράψε τον κωδικό της οθόνης – στα multi είναι διαφορετικός από της εσωτερικής. Αν έχει λυχνία, γράψε πόσες φορές αναβοσβήνει (π.χ. <b>5</b>). Σε πλακέτες με 3–5 λυχνίες (AUX, Hisense, Daikin multi) γράψε την κατάσταση κάθε λυχνίας με τη σειρά: 0 = σβηστή, 1 = αναμμένη, 2 = αναβοσβήνει (π.χ. <b>221</b>).</div>' : '')+
    '<div class="small">Ο αρχικός κωδικός:</div><div class="row2"><input id="ft_orig" value="'+esc(f.orig||"")+'" placeholder="'+(led?'π.χ. 5 ή 221':'π.χ. E5')+'" autocapitalize="characters"></div>';
  if(led){ var nol = (function(){ var b = brandObj(), sc = (b && !b.own) ? candidates(b) : Object.keys(PLAT).filter(function(p){ return p!=="inv_mc" && (PLAT[p][S.cat]||[]).length; }); return sc.filter(function(p){ return !ftHasLed(p); }); })();
    if(nol.length) h += '<div class="small">ℹ️ Δεν έχω πίνακα λυχνιών εξωτερικής για: '+esc(nol.map(function(p){ return PLAT[p].name; }).join(", "))+' – αυτά δεν ελέγχονται με λυχνίες.</div>'; }
  if(!f.orig){ return h + '<div class="small">Γράψε τον κωδικό που βγάζει η μονάδα.</div></div>'; }
  var ev = ftEval(), nm = function(p){ return PLAT[p].name; };
  h += '<div class="small" style="margin-top:6px">Ο «'+esc(f.orig)+'» υπάρχει σε: <b>'+(ev.steps[0].list.map(nm).join(", ")||"κανένα")+'</b></div>';
  f.tests.forEach(function(ts,i){ var T0 = FTEST.filter(function(x){ return x.k===ts.k; })[0]; if(ts.code) h += '<div class="small">✔ '+esc(T0.t)+': βγήκε <b>'+esc(ts.code)+'</b> <button class="x" data-fzdel="'+i+'">✕</button> → μένουν: <b>'+esc(ev.steps[i+1] ? ev.steps[i+1].list.map(nm).join(", ") || "κανένα" : "")+'</b></div>'; });
  var mean = function(p){ return ftFind(p, f.orig).map(function(c){ return (f.src==="led" && c[2] && c[2]!==c[0].join("/") ? c[2]+": " : "")+c[1]; }).join(" · "); };
  var same = ev.cur.length>1 && f.tests.some(function(t){ return t.code; }) && (ev.cur.every(function(p){ return mean(p)===mean(ev.cur[0]); }) || ev.cur.every(function(p){ return p==='gree' || p==='inv_gree'; }));
  if(ev.cur.length===1 || same){
    var p = ev.cur[0];
    h += '<div class="pver good" style="margin-top:8px">✅ Το εργοστάσιο είναι <b>'+esc(ev.cur.map(nm).join(" / "))+'</b>'+(same?' <span class="small">(ίδιο βλαβολόγιο)</span>':'')+'<div style="font-weight:500;margin-top:4px">Ο αρχικός κωδικός <b>'+esc(f.orig)+'</b> σημαίνει: '+esc(mean(p))+'</div></div>'+ev.cur.map(ftUseBtn).join(" ");
    return h + '</div>';
  }
  if(!ev.cur.length){
    h += '<div class="pver bad" style="margin-top:8px">Κανένα εργοστάσιο δεν ταιριάζει σε όλα. Έλεγξε ότι έγραψες σωστά τους κωδικούς (π.χ. E5 / EH05 / 5) – ή η μονάδα είναι από εργοστάσιο που δεν έχω. Σβήσε την τελευταία δοκιμή με ✕ και ξαναδοκίμασε.</div>';
    return h + '</div>';
  }
  var done = {}; f.tests.forEach(function(t){ if(t.code) done[t.k]=1; });
  var side = ftSide(ev.cur);
  h += '<div class="small" style="margin-top:8px">Η βλάβη αφορά:</div><div class="chips"><button class="chip'+(side==="in"?' on':'')+'" data-fzside="in">🏠 Εσωτερική</button><button class="chip'+(side==="out"?' on':'')+'" data-fzside="out">🌳 Εξωτερική</button></div>'+
    '<div class="small">💡 Η μονάδα δείχνει τη βλάβη που ελέγχει πρώτη. Γι\' αυτό προκαλούμε βλάβη σε αισθητήριο <b>της ίδιας μονάδας</b> με τη βλάβη, που διαβάζεται αμέσως με το ρεύμα – αλλιώς θα συνεχίσει να δείχνει την παλιά βλάβη. Σε multi, κάνε τις δοκιμές στην εξωτερική.</div>';
  var useful = FTEST.filter(function(t){ return !done[t.k]; }).filter(function(t){
    // χρήσιμη μόνο αν ξεχωρίζει τα υποψήφια (διαφορετικός κωδικός ανά εργοστάσιο)
    var codes = {}; ev.cur.forEach(function(p){ var c = ftCodes(p).filter(function(c){ return t.rx.test(String(c[1])); })[0]; codes[c ? c[0].join("/") : "?"+p] = 1; });
    return Object.keys(codes).length > 1;
  });
  var next = useful.filter(function(t){ return t.side===side; }), otherSide = false;
  if(!next.length && useful.length){ next = useful; otherSide = true; }
  if(ev.cur.length>1) h += '<div class="small" style="margin-top:8px">Υποψήφια: <b>'+ev.cur.map(nm).join(", ")+'</b>'+(ev.cur.length<=3 ? '<br>'+ev.cur.map(function(p){ var d = ftFind(p, f.orig)[0]; return '· '+esc(nm(p))+': '+esc(f.orig)+' = '+esc(d?d[1]:"—"); }).join("<br>") : '')+'</div>';
  var st = FTEST.filter(function(t){ return t.k===(f.step||(next[0]&&next[0].k)); })[0];
  if(!next.length){ h += '<div class="hint" style="margin-top:8px">Τα υποψήφια έχουν τους ίδιους κωδικούς για αυτές τις δοκιμές (ίδια οικογένεια βλαβολογίου) – ο κωδικός «'+esc(f.orig)+'» σημαίνει το ίδιο ή δες το ταμπελάκι/πλακέτα στον οδηγό παραπάνω.</div>'; return h+'</div>'; }
  if(!st || done[st.k] || next.indexOf(st)<0) st = next[0];
  if(otherSide) h += '<div class="hint" style="margin-top:8px">Δεν βρίσκω δοκιμή στην '+(side==="out"?"εξωτερική":"εσωτερική")+' που να ξεχωρίζει τα υποψήφια – δοκίμασε στην άλλη μονάδα (αν η αρχική βλάβη το επιτρέπει).</div>';
  // τι κωδικό θα βγάλει κάθε υποψήφιο σε αυτή τη δοκιμή
  var exp = ev.cur.map(function(p){ var c = ftCodes(p).filter(function(c){ return st.rx.test(String(c[1])); })[0]; return nm(p)+': '+(c?(c[2]||c[0].join("/")):"—"); }).join(" · ");
  h += '<div class="ftstep"><div class="lbl" style="margin-top:0">Επόμενη δοκιμή: '+esc(st.t)+'</div>'+(next.length>1?'<div class="chips">'+next.map(function(t){ return '<button class="chip'+(t.k===st.k?' on':'')+'" data-fzstep="'+t.k+'">'+esc(t.t)+'</button>'; }).join("")+'</div>':'')+
    (st.warn?'<div class="pver mid">⚠️ '+esc(st.warn)+'</div>':'')+'<ol class="steps">'+st.how.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ol>'+
    '<div class="small">Αναμενόμενο: '+esc(exp)+'</div>'+
    '<div class="row2" style="margin-top:6px"><input id="ft_new" placeholder="'+(f.src==="led"?'Νέες αναλαμπές (π.χ. 3 ή 220)':'Ο νέος κωδικός που βγήκε')+'" autocapitalize="characters"><button class="mini" data-fz="add" data-fzk="'+st.k+'">OK</button></div></div>';
  return h + '</div>';
}
function ftUseBtn(p){
  var b = brandObj();
  if(b && !b.own && candidates(b).indexOf(p)>=0) return '<button class="mini" style="margin-top:6px" data-o="'+p+'" data-fzdone="1">Χρησιμοποίησε '+esc(PLAT[p].name)+'</button>';
  var bb = null; BRANDS.forEach(function(x){ if(!bb && x.own===p) bb = x; }); if(!bb && p==="inv_gree") BRANDS.forEach(function(x){ if(!bb && x.n==="Inventor") bb = x; });
  return bb ? '<button class="mini" style="margin-top:6px" data-b="'+esc(bb.n)+'" data-fzdone="1">Άνοιξε '+esc(bb.n)+' →</button>' : '';
}
function ftRefresh(){ var w = document.getElementById("ftbox"); if(w) w.innerHTML = ftHtml(); }
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-fzopen],[data-fz],[data-fzstep],[data-fzdel],[data-fzdone],[data-fzside],[data-fzsrc]"); if(!el) return;
  if(el.hasAttribute("data-fzdone")){ S.fz = null; return; }
  if(el.hasAttribute("data-fzopen")){ S.fz = {orig:gr2lat((el.getAttribute("data-fzopen")||S.q||"").trim()).toUpperCase(), tests:[]}; var w = document.getElementById("ftbox"); if(w){ w.innerHTML = ftHtml(); w.scrollIntoView({behavior:"smooth", block:"start"}); } return; }
  if(el.hasAttribute("data-fzsrc")){ S.fz.src = el.getAttribute("data-fzsrc"); S.fz.tests = []; if(S.fz.src==="led") S.fz.side = "out"; ftRefresh(); return; }
  if(el.hasAttribute("data-fzside")){ S.fz.side = el.getAttribute("data-fzside"); S.fz.step = null; ftRefresh(); return; }
  if(el.hasAttribute("data-fzstep")){ S.fz.step = el.getAttribute("data-fzstep"); ftRefresh(); return; }
  if(el.hasAttribute("data-fzdel")){ S.fz.tests.splice(+el.getAttribute("data-fzdel"),1); ftRefresh(); return; }
  var a = el.getAttribute("data-fz");
  if(a==="close"){ S.fz = null; ftRefresh(); return; }
  if(a==="add"){ var v = gr2lat((document.getElementById("ft_new").value||"").trim()).toUpperCase(); if(!v) return; S.fz.tests.push({k:el.getAttribute("data-fzk"), code:v}); S.fz.step = null; ftRefresh(); return; }
});
document.addEventListener("change", function(e){ if(e.target && e.target.id==="ft_orig" && S.fz){ var nv = gr2lat(e.target.value.trim()).toUpperCase(); if(nv!==S.fz.orig){ S.fz.orig = nv; S.fz.tests = []; S.fz.step = null; } ftRefresh(); } });
document.addEventListener("keydown", function(e){ if(e.key==="Enter" && e.target && e.target.id==="ft_new"){ var b = document.querySelector('[data-fz="add"]'); if(b) b.click(); } });

// ===== Multi: ο ίδιος κωδικός στην οθόνη της εξωτερικής σημαίνει άλλο πράγμα =====
function multiOutNote(q){
  var n = norm(q), plats = activeTables.plats || [], h = "";
  plats.forEach(function(p){
    var ot = (OUTP[p] && OUTP[p].multi) || [], main = PLAT[p].multi || [];
    ot.forEach(function(tn){ if(main.indexOf(tn)>=0 || !T[tn] || !T[tn].disp) return;
      T[tn].codes.forEach(function(c){ if(c[0].some(function(k){ return norm(k)===n; }))
        h += '<div class="hint">⚠️ <b>Από πού διάβασες τον «'+esc(q.toUpperCase())+'»;</b> Στα multi '+esc(PLAT[p].name)+' η οθόνη της <b>πλακέτας εξωτερικής</b> έχει δικούς της κωδικούς. Αν τον είδες στην εξωτερική, σημαίνει: <b>'+esc(String(c[1]).replace(/^Εξωτερική:\s*/,""))+'</b>. Παρακάτω είναι το νόημα αν τον είδες στην <b>εσωτερική</b>.<div style="margin-top:6px"><button class="mini" data-goout="1">Δες τον ως κωδικό εξωτερικής →</button></div></div>';
      });
    });
  });
  return h;
}

document.addEventListener("click", function(e){ if(!e.target.closest("[data-goout]")) return; var b = document.querySelector('#srcbox [data-s="out"]'); if(b) b.click(); });

// ===== Multi: τι δείχνει η πλακέτα εξωτερικής ανά εργοστάσιο =====
var MULTIOUT = {
  midea:"Οθόνη 2 ψηφίων με ΔΙΚΟΥΣ της κωδικούς (π.χ. E2 = επικοινωνία, ενώ η εσωτερική δείχνει E1). Πίνακας από το Midea Multi service manual.",
  gree:"Η κεντρική πλακέτα εξωτερικής δείχνει τους ίδιους κωδικούς με το χειριστήριο· η κίτρινη/κόκκινη λυχνία αναβοσβήνει με τον πίνακα λυχνιών.",
  inv_gree:"Όπως Gree: ίδιοι κωδικοί στην πλακέτα εξωτερικής + κίτρινη/κόκκινη λυχνία.",
  aux:"3 λυχνίες (D1–D3) – γράψε την κατάσταση κάθε λυχνίας (0/1/2).",
  tcl:"1 λυχνία στην πλακέτα τροφοδοσίας – μέτρα τις αναλαμπές (πίνακας από το TCL Multi service manual).",
  hisense:"Οι λυχνίες δείχνουν τον αριθμό του κωδικού (δεκάδες / μονάδες) – ίδιοι αριθμοί με την εσωτερική.",
  haier:"LED1 αναβοσβήνει n φορές – ο πίνακας δείχνει και τον αντίστοιχο κωδικό εσωτερικής.",
  daikin:"5 λυχνίες – συνδυασμός αναμμένων/σβηστών.",
  me:"Λυχνία με αναλαμπές (πίνακας λυχνιών εξωτερικής).",
  fujitsu:"LED1–LED4: LED1 γενικά + δωμάτιο A, LED2/3/4 δωμάτια B/C/D (πίνακας από το Fujitsu multi installation manual).",
  lg:"LED01G/LED02G αναβοσβήνουν δεκάδες/μονάδες του ίδιου αριθμού με τον κωδικό CH της εσωτερικής.",
  samsung:"Η πλακέτα εξωτερικής δείχνει τους ίδιους κωδικούς E (π.χ. E201, E202, E221).",
  panasonic:"Δεν έχει ξεχωριστό κωδικό εξωτερικής – διάβασε τον κωδικό από κάθε εσωτερική με το τηλεχειριστήριο (κάθε εσωτερική κρατά τον δικό της).",
  toshiba:"5 λυχνίες (1 κίτρινη + 4 κόκκινες) – δεν έχω ακόμα τον πίνακα· χρησιμοποίησε τον κωδικό ελέγχου από το τηλεχειριστήριο.",
  mhi:"Κόκκινη λυχνία ελέγχου με αναλαμπές – δεν έχω ακόμα τον πίνακα· χρησιμοποίησε τον κωδικό του χειριστηρίου.",
  hitachi:"LD301 αναβοσβήνει n φορές (ή LD301 αναμμένη + LD302 αναλαμπές για θερμίστορ) – πίνακας από τον Hitachi technical catalogue."
};
function multiOutGuide(){
  if(S.cat!=="multi") return "";
  var pl = activeTables.plats || [], h = pl.filter(function(p){ return MULTIOUT[p]; }).map(function(p){ return '<div>'+(pl.length>1?'<b>'+esc(PLAT[p].name)+':</b> ':'')+esc(MULTIOUT[p])+'</div>'; }).join("");
  return h ? '<div class="guide">🔀 <b>Multi – τι δείχνει η πλακέτα εξωτερικής:</b>'+h+'</div>' : '';
}

// ===== Σωλήνες & καλώδια ανά μοντέλο =====
function instKey(v){ return gr2lat(v||"").toUpperCase().replace(/[^A-Z0-9]/g,""); }
function instForm(){
  var bs = Object.keys(INST), cur = INST[S.brand] ? S.brand : (S.instB && INST[S.instB] ? S.instB : bs[0]);
  return '<div class="pcalcw"><div class="lbl">📐 Μάρκα και μοντέλο</div>'+
    '<select id="inst_b">'+bs.map(function(b){ return '<option'+(b===cur?' selected':'')+'>'+esc(b)+'</option>'; }).join("")+'</select>'+
    '<input id="inst_m" placeholder="π.χ. FTXM35R, MSZ-AP25VG, RAS-B10J2KVSG-E" autocapitalize="characters" spellcheck="false" value="'+esc(S.model||"")+'" style="margin-top:8px">'+
    '<div id="inst_o"></div>'+
    '<div class="small" style="margin-top:8px">Μάρκες με στοιχεία από manual: '+esc(bs.join(", "))+'. Για τις υπόλοιπες δεν βρήκα ακόμα επίσημο πίνακα που να μπορώ να διαβάσω.</div></div>';
}
function instPipe(x){ return x ? '<b>'+x+'"</b> <span class="small">('+(INCH_MM[x]||"")+' mm)</span>' : '<span style="color:var(--warn)">Δεν βρέθηκε στο manual</span>'; }
function instCalc(){
  var o = document.getElementById("inst_o"); if(!o) return;
  var bn = (document.getElementById("inst_b")||{}).value, B = INST[bn], k = instKey((document.getElementById("inst_m")||{}).value);
  S.instB = bn;
  if(!B){ o.innerHTML = ""; return; }
  if(k.length<4){ o.innerHTML = '<div class="small" style="margin-top:8px">Γράψε το μοντέλο από το ταμπελάκι.</div>'; return; }
  if(B.multi && B.multi.test(k)){ o.innerHTML = '<div class="pwarn" style="margin-top:8px">Αυτό μοιάζει με εξωτερική multi. Οι σωλήνες σε multi εξαρτώνται από κάθε εσωτερική (και συχνά θέλουν συστολές) – δες το manual της multi.</div>'; return; }
  var cap = B.cap(k);
  if(cap==null){ o.innerHTML = '<div class="small" style="margin-top:8px">Δεν αναγνώρισα την ισχύ από το μοντέλο ('+esc(B.capLbl)+'). Έλεγξε ότι γράφτηκε σωστά.</div>'; return; }
  var rows = B.rows.filter(function(r){ return (!r.re || r.re.test(k)) && cap>=r.c[0] && cap<=r.c[1]; });
  var pr = null; rows.forEach(function(r){ if(!pr && (r.liq || r.gas || (r.liqBy && r.liqBy[cap]))) pr = r; });
  var lr = null; rows.forEach(function(r){ if(!lr && (r.len || (r.lenBy && r.lenBy[cap]))) lr = r; });
  var er = {}; rows.forEach(function(r){ ["pwr","comm","brk"].forEach(function(f){ if(!er[f] && r[f]){ er[f]=r[f]; er[f+"S"]=r.src; } }); ["pwr","comm","brk"].forEach(function(f){ var b=r[f+"By"]; if(!er[f] && b && b[cap]){ er[f]=b[cap]; er[f+"S"]=r.src; } }); });
  var brk = er.brk || null;
  if(!brk && B.brk) B.brk.forEach(function(x){ if(!brk && x[0].test(k)) brk = x[1]; });
  var L = [];
  L.push('<div class="instr"><span>Κλάση από το μοντέλο</span><b>'+cap+'</b></div>');
  if(pr){
    var lq = pr.liq || (pr.liqBy && pr.liqBy[cap]), gs = pr.gas || (pr.gasBy && pr.gasBy[cap]);
    L.push('<div class="instr"><span>Σωλήνας υγρού (λεπτός)</span><div>'+instPipe(lq)+'</div></div>');
    L.push('<div class="instr"><span>Σωλήνας αερίου (χοντρός)</span><div>'+instPipe(gs)+'</div></div>');
  } else {
    L.push('<div class="instr miss"><span>Σωλήνες</span><div>'+esc(B.pipeNote || B.noRow || "Δεν βρέθηκε στα manuals για αυτό το μοντέλο.")+'</div></div>');
  }
  L.push('<div class="instr"><span>Καλώδιο διασύνδεσης</span><div>'+esc(er.comm || B.comm || "Δεν βρέθηκε στο manual.")+'</div></div>');
  L.push('<div class="instr"><span>Καλώδιο τροφοδοσίας</span><div>'+esc(er.pwr || B.pwr || "Δεν βρέθηκε στο manual.")+'</div></div>');
  L.push('<div class="instr'+(brk?'':' miss')+'"><span>Ασφάλεια</span><div>'+esc(brk || B.brkNote || "Δεν βρέθηκε στο manual.")+'</div></div>');
  if(lr) L.push('<div class="instr"><span>Μήκη</span><div>'+esc(lr.len || lr.lenBy[cap])+'</div></div>');
  var notes = rows.filter(function(r){ return r.note; }).map(function(r){ return r.note; });
  if(pr && pr.generic) notes.push("Οι σωλήνες είναι από τον γενικό πίνακα του manual της εταιρίας και όχι από πίνακα της συγκεκριμένης σειράς.");
  if(pr && pr.kw) notes.push("Η Panasonic δίνει τους σωλήνες ανά Btu· εδώ αντιστοιχίστηκαν από την ισχύ σε kW.");
  if(!pr && B.noRow && B.pipeNote) notes.push(B.noRow);
  var srcs = []; [pr&&pr.src, lr&&lr.src, er.pwrS, er.commS, er.brkS].forEach(function(x){ if(x && srcs.indexOf(x)<0) srcs.push(x); });
  if(B.srcEl && srcs.indexOf(B.srcEl)<0) srcs.push(B.srcEl);
  o.innerHTML = '<div class="instw">'+L.join("")+'</div>'+
    notes.map(function(n){ return '<div class="pext">ℹ️ '+esc(n)+'</div>'; }).join("")+
    '<div class="small" style="margin-top:6px">Πηγή: '+srcs.map(esc).join(" · ")+'</div>';
}
document.addEventListener("input", function(e){ var t=e.target; if(t && (t.id==="inst_m" || t.id==="inst_b")){ if(t.id==="inst_m") S.model = t.value; instCalc(); } });
document.addEventListener("change", function(e){ var t=e.target; if(t && t.id==="inst_b") instCalc(); });


// ===== Μετρήσεις, φρέον, υπογραφή & βιβλίο F-gas (μόνο στο κινητό) =====
var HX_TXT = ["cust","brand","oem","model","ser","code","fix","note","lp","hp","sh","sc","tin","tout","amp","ref","chg","add","rec","lchk"];
function TECH(){ return LS.get("vl_tech", {}) || {}; }
function histReadForm(){
  var o = {};
  HX_TXT.forEach(function(k){ var x = document.getElementById("hf_"+k); o[k] = x ? String(x.value).trim() : ""; });
  var hm = document.getElementById("hf_herm"); o.herm = !!(hm && hm.checked);
  o.sig = SIG.dirty ? sigData() : (SIG.orig || "");
  return o;
}
function hnum(v){ v = String(v==null?"":v).replace(",", "."); var n = parseFloat(v); return isNaN(n) ? null : n; }
function hfx(n, d){ return (Math.round(n*Math.pow(10,d))/Math.pow(10,d)).toString().replace(".", ","); }
function hd(v){ return String(v).replace(".", ","); }
function measTxt(h){
  var a = [];
  if(h.lp) a.push("χαμηλή "+hd(h.lp)+" bar"); if(h.hp) a.push("υψηλή "+hd(h.hp)+" bar");
  if(h.sh) a.push("υπερθέρμανση "+hd(h.sh)+" K"); if(h.sc) a.push("υπόψυξη "+hd(h.sc)+" K");
  if(h.tin || h.tout){ var ti = hnum(h.tin), to = hnum(h.tout); a.push("αέρας "+(h.tin||"–")+" → "+(h.tout||"–")+" °C"+(ti!=null && to!=null ? " (ΔT "+hfx(Math.abs(ti-to),1)+" K)" : "")); }
  if(h.amp) a.push("ρεύμα "+hd(h.amp)+" A");
  return a.join(" · ");
}
function fgT(h){ var i = REFI[h.ref], kg = hnum(h.chg); if(!i || !i.gwp || kg==null) return null; return kg*i.gwp/1000; }
function fgMonths(h){ var t = fgT(h); if(t==null) return null; var lim = h.herm ? 10 : 5; if(t < lim) return 0; return t < 50 ? 12 : t < 500 ? 6 : 3; }
function refTxt(h){
  if(!h.ref && !h.chg && !h.add && !h.rec) return "";
  var a = [h.ref || "—"];
  if(h.chg) a.push("φορτίο "+hd(h.chg)+" kg");
  if(h.add) a.push("προστέθηκαν "+hd(h.add)+" kg"); if(h.rec) a.push("ανακτήθηκαν "+hd(h.rec)+" kg");
  var t = fgT(h); if(t!=null) a.push(hfx(t,2)+" t CO₂");
  if(h.lchk==="ok") a.push("έλεγχος διαρροής: χωρίς διαρροή"); else if(h.lchk==="leak") a.push("έλεγχος διαρροής: βρέθηκε διαρροή");
  return a.join(" · ");
}
function histExtraHtml(e){
  var n = function(k,l,ph){ return '<label>'+esc(l)+'<input id="hf_'+k+'" inputmode="decimal" value="'+esc(e[k]||"")+'" placeholder="'+esc(ph||"")+'"></label>'; };
  var open = !!(e.lp||e.hp||e.sh||e.sc||e.tin||e.tout||e.amp||e.ref||e.chg||e.add||e.rec||e.lchk);
  return '<details class="hx"'+(open?' open':'')+'><summary>📏 Μετρήσεις</summary><div class="hgrid">'+
      n("lp","Χαμηλή πίεση (bar)","")+n("hp","Υψηλή πίεση (bar)","")+n("sh","Υπερθέρμανση (K)","")+n("sc","Υπόψυξη (K)","")+
      n("tin","Αέρας που μπαίνει (°C)","")+n("tout","Αέρας που βγαίνει (°C)","")+n("amp","Ρεύμα (A)","")+'</div></details>'+
    '<details class="hx"'+(e.ref||e.chg||e.add||e.rec||e.lchk?' open':'')+'><summary>🧯 Φρέον & F‑gas</summary><div class="hgrid">'+
      '<label>Ψυκτικό<select id="hf_ref"><option value="">—</option>'+refOpts(e.ref||"")+'</select></label>'+
      n("chg","Φορτίο συστήματος (kg)","όλο, με προσθήκες")+n("add","Προστέθηκαν τώρα (kg)","")+n("rec","Ανακτήθηκαν τώρα (kg)","")+
      '<label>Έλεγχος διαρροής<select id="hf_lchk"><option value="">Δεν έγινε</option><option value="ok"'+(e.lchk==="ok"?" selected":"")+'>Έγινε – χωρίς διαρροή</option><option value="leak"'+(e.lchk==="leak"?" selected":"")+'>Έγινε – βρέθηκε διαρροή</option></select></label>'+
      '<label class="hchk"><input type="checkbox" id="hf_herm"'+(e.herm?" checked":"")+'> Ερμητικά κλειστό με σήμανση</label></div>'+
      '<div class="small">Το βιβλίο F‑gas και η ημερομηνία του επόμενου ελέγχου βγαίνουν από εδώ, για κάθε μονάδα (με βάση τον σειριακό).</div></details>'+
    '<div class="sigw"><div class="small">✍️ Υπογραφή πελάτη</div><canvas id="sigpad" width="600" height="200"></canvas><button class="mini" id="sigclr" type="button">Καθάρισμα</button></div>';
}
// --- υπογραφή ---
var SIG = {dirty:false, orig:"", drawing:false};
function sigInit(orig){
  SIG.dirty = false; SIG.orig = orig || ""; var c = document.getElementById("sigpad"); if(!c) return;
  var x = c.getContext("2d"); x.lineWidth = 3; x.lineCap = "round"; x.lineJoin = "round"; x.strokeStyle = "#111";
  x.fillStyle = "#fff"; x.fillRect(0,0,c.width,c.height);
  if(SIG.orig){ var im = new Image(); im.onload = function(){ x.drawImage(im, 0, 0, c.width, c.height); }; im.src = SIG.orig; }
  var pos = function(ev){ var r = c.getBoundingClientRect(); return [(ev.clientX-r.left)*c.width/r.width, (ev.clientY-r.top)*c.height/r.height]; };
  c.addEventListener("pointerdown", function(ev){ ev.preventDefault(); try{ c.setPointerCapture(ev.pointerId); }catch(q){} SIG.drawing = true; var p = pos(ev); x.beginPath(); x.moveTo(p[0], p[1]); });
  c.addEventListener("pointermove", function(ev){ if(!SIG.drawing) return; ev.preventDefault(); var p = pos(ev); x.lineTo(p[0], p[1]); x.stroke(); SIG.dirty = true; });
  var end = function(){ SIG.drawing = false; };
  c.addEventListener("pointerup", end); c.addEventListener("pointercancel", end); c.addEventListener("pointerleave", end);
}
function sigData(){ var c = document.getElementById("sigpad"); if(!c) return ""; try{ return c.toDataURL("image/jpeg", 0.6); }catch(q){ return ""; } }
// --- αναφορά για εκτύπωση/PDF ---
function reportHtml(h){
  var t = TECH(), row = function(l,v){ return v ? '<tr><th>'+esc(l)+'</th><td>'+esc(v)+'</td></tr>' : ''; };
  var nx = fgNextTxt(h);
  return '<div class="rp-h"><div><b style="font-size:19px">'+esc(t.company||"Αναφορά εργασίας")+'</b>'+(t.name?'<br>'+esc(t.name):'')+(t.phone?'<br>'+esc(t.phone):'')+(t.cert?'<br>Πιστ. F‑gas: '+esc(t.cert):'')+'</div>'+
    '<div style="text-align:right"><b>Αναφορά επισκευής κλιματιστικού</b><br>'+esc(new Date(h.ts||Date.now()).toLocaleDateString("el-GR"))+'</div></div>'+
    '<table class="rp-t">'+row("Πελάτης", h.cust)+row("Μονάδα", [h.brand, h.model].filter(Boolean).join(" "))+row("Σειριακός", h.ser)+row("Κωδικός βλάβης", h.code)+
      row("Μετρήσεις", measTxt(h))+row("Ψυκτικό / F‑gas", refTxt(h))+row("Επόμενος έλεγχος διαρροής", nx)+row("Εργασία", h.fix)+row("Σημειώσεις", h.note)+'</table>'+
    '<div class="rp-s"><div>Υπογραφή πελάτη<br>'+(h.sig?'<img src="'+h.sig+'" alt="">':'<div class="rp-l"></div>')+'</div><div>Υπογραφή τεχνικού<br><div class="rp-l"></div></div></div>';
}
function fgNextTxt(h){ var m = fgMonths(h); if(m==null) return ""; if(m===0) return "Δεν απαιτείται περιοδικός έλεγχος"; if(h.lchk!=="ok" && h.lchk!=="leak") return "κάθε "+m+" μήνες"; var d = new Date(h.ts||Date.now()); d.setMonth(d.getMonth()+m); return d.toLocaleDateString("el-GR")+" (κάθε "+m+" μήνες)"; }
// --- βιβλίο F-gas ---
function fgKey(h){ var s = serClean(h.ser); if(s.length>=6) return "S:"+s; var k = serClean((h.cust||"")+"|"+(h.model||"")); return k.length>1 ? "C:"+k : null; }
function fgUnits(){
  var U = {};
  HIST.slice().sort(function(a,b){ return a.ts-b.ts; }).forEach(function(h){
    if(!h.ref && !h.chg && !h.add && !h.rec && !h.lchk) return;
    var k = fgKey(h); if(!k) return;
    var u = U[k] || (U[k] = {k:k, ev:[], cust:"", model:"", ser:"", brand:"", ref:"", chg:"", herm:false, last:null});
    u.ev.push(h); if(h.cust) u.cust = h.cust; if(h.model) u.model = h.model; if(h.ser) u.ser = h.ser; if(h.brand) u.brand = h.brand;
    if(h.ref) u.ref = h.ref; if(h.chg) u.chg = h.chg; u.herm = !!h.herm;
    if(h.lchk==="ok" || h.lchk==="leak") u.last = h.ts;
  });
  return Object.keys(U).map(function(k){
    var u = U[k]; u.m = fgMonths(u); u.t = fgT(u);
    if(u.m && u.last){ var d = new Date(u.last); d.setMonth(d.getMonth()+u.m); u.next = d.getTime(); }
    else if(u.m){ u.next = u.ev[0].ts; u.nolast = true; }
    return u;
  });
}
function fgState(u){ if(!u.m) return "none"; var now = Date.now(); if(u.next < now) return "late"; if(u.next - now < 30*864e5) return "soon"; return "ok"; }
function fgBadge(){ var n = fgUnits().filter(function(u){ var s = fgState(u); return s==="late" || s==="soon"; }).length; return n ? ' <span class="fgb">'+n+'</span>' : ''; }
function fgDueBanner(){
  var L = fgUnits().filter(function(u){ return fgState(u)==="late"; }), S2 = fgUnits().filter(function(u){ return fgState(u)==="soon"; });
  if(!L.length && !S2.length) return "";
  return '<div class="fgdue" id="htab_f2">⏰ Έλεγχοι F‑gas: '+(L.length?'<b>'+L.length+' εκπρόθεσμοι</b>':'')+(L.length&&S2.length?' · ':'')+(S2.length?S2.length+' μέσα στον μήνα':'')+' – πάτα για λίστα</div>';
}
function fgBookHtml(){
  var U = fgUnits(), ord = {late:0, soon:1, ok:2, none:3};
  U.sort(function(a,b){ var d = ord[fgState(a)]-ord[fgState(b)]; return d || (a.next||0)-(b.next||0); });
  var lab = {late:"⛔ Εκπρόθεσμος", soon:"⏰ Σύντομα", ok:"✅ Εντάξει", none:"— Χωρίς υποχρέωση"};
  var h = '<div class="small" style="margin:6px 0 10px">Μονάδες με καταγεγραμμένο φρέον. Η συχνότητα ελέγχου βγαίνει από το φορτίο × GWP (Κανονισμός (ΕΕ) 2024/573, άρθρο 5). Δεν υπολογίζεται σύστημα ανίχνευσης διαρροής – αν έχει, η συχνότητα διπλασιάζεται.</div>';
  if(!U.length) return h+'<div class="small">Δεν υπάρχουν ακόμα μονάδες. Σε μια επίσκεψη συμπλήρωσε «🧯 Φρέον & F‑gas» (ψυκτικό και φορτίο) και θα εμφανιστεί εδώ.</div>';
  h += U.map(function(u){
    var st = fgState(u), add = 0, rec = 0; u.ev.forEach(function(e){ add += hnum(e.add)||0; rec += hnum(e.rec)||0; });
    return '<div class="hcard fg-'+st+'"><div><b>'+esc(u.cust||"—")+'</b> · '+esc([u.brand,u.model].filter(Boolean).join(" "))+'</div>'+
      '<div class="hm">'+(u.ser?'S/N '+esc(u.ser)+' · ':'')+esc(u.ref||"ψυκτικό;")+(u.chg?' · '+esc(hd(u.chg))+' kg':'')+(u.t!=null?' · '+hfx(u.t,2)+' t CO₂':'')+'</div>'+
      '<div><b>'+lab[st]+'</b>'+(u.m?' · κάθε '+u.m+' μήνες · '+(u.nolast?'δεν έχει καταγραφεί έλεγχος':'επόμενος: <b>'+esc(new Date(u.next).toLocaleDateString("el-GR"))+'</b>'):'')+'</div>'+
      '<div class="small">Επισκέψεις: '+u.ev.length+(add?' · σύνολο προσθηκών '+hfx(add,2)+' kg':'')+(rec?' · ανακτήσεις '+hfx(rec,2)+' kg':'')+'</div></div>';
  }).join("");
  return h+'<div class="scbtns" style="margin-top:10px"><button class="mini" id="fgcsv">⬇️ Βιβλίο F‑gas (CSV για Excel)</button></div>';
}
function fgCsv(){
  var q = function(v){ v = String(v==null?"":v); return /[;"\n]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v; };
  var rows = [["Ημερομηνία","Πελάτης","Μάρκα","Μοντέλο","Σειριακός","Ψυκτικό","Φορτίο kg","t CO2","Προστέθηκαν kg","Ανακτήθηκαν kg","Έλεγχος διαρροής","Εργασία","Τεχνικός","Πιστοποιητικό"]], t = TECH();
  fgUnits().forEach(function(u){ u.ev.forEach(function(e){ var tt = fgT(e);
    rows.push([new Date(e.ts).toLocaleDateString("el-GR"), e.cust||u.cust, e.brand||u.brand, e.model||u.model, e.ser||u.ser, e.ref||u.ref, e.chg, tt!=null?hfx(tt,2):"", e.add, e.rec, e.lchk==="ok"?"χωρίς διαρροή":e.lchk==="leak"?"βρέθηκε διαρροή":"", e.fix, t.name||"", t.cert||""]); }); });
  var blob = new Blob(["﻿"+rows.map(function(r){ return r.map(q).join(";"); }).join("\r\n")], {type:"text/csv"}), fn = "vivlio-fgas-"+new Date().toISOString().slice(0,10)+".csv";
  try{ var file = new File([blob], fn, {type:"text/csv"}); if(navigator.canShare && navigator.canShare({files:[file]})){ navigator.share({files:[file], title:"Βιβλίο F-gas"}).catch(function(){}); return; } }catch(x){}
  var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function techForm(){
  var t = TECH(), ov = document.getElementById("histov"), f = function(k,l,ph){ return '<label>'+esc(l)+'<input id="tf_'+k+'" value="'+esc(t[k]||"")+'" placeholder="'+esc(ph||"")+'"></label>'; };
  ov.innerHTML = '<div class="schead"><b>👤 Στοιχεία τεχνικού</b><button class="mini" id="histclose">✕</button></div><div class="hform card">'+
    '<div class="small">Μπαίνουν στην κεφαλίδα της αναφοράς και στο βιβλίο F‑gas. Μένουν μόνο σε αυτό το κινητό.</div>'+
    f("company","Επωνυμία","π.χ. Καλύβας Κλιματισμός")+f("name","Ονοματεπώνυμο","")+f("phone","Τηλέφωνο","")+f("cert","Αριθμός πιστοποίησης F‑gas","")+
    '<div class="scbtns" style="margin-top:10px"><button class="mini" id="techsave">💾 Αποθήκευση</button><button class="mini" id="histlist">Άκυρο</button></div></div>';
}
document.addEventListener("click", function(e){
  var el = e.target.closest("#htab_f,#htab_f2,#fgcsv,#techedit,#techsave,#sigclr"); if(!el) return;
  if(el.id==="htab_f" || el.id==="htab_f2"){ histOpen("fgas"); return; }
  if(el.id==="fgcsv"){ fgCsv(); return; }
  if(el.id==="techedit"){ techForm(); return; }
  if(el.id==="techsave"){ var t = {}; ["company","name","phone","cert"].forEach(function(k){ var x = document.getElementById("tf_"+k); t[k] = x ? x.value.trim() : ""; }); LS.set("vl_tech", t); histOpen("list"); return; }
  if(el.id==="sigclr"){ var c = document.getElementById("sigpad"); if(c){ var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0,0,c.width,c.height); } SIG.dirty = false; SIG.orig = ""; return; }
});


// ===== Έλεγχος βήμα-βήμα από κωδικό βλάβης =====
// Σειρά: από τα εύκολα/φθηνά στα ακριβά. Το IPM μετά τον συμπιεστή: βραχυκυκλωμένος συμπιεστής καίει και καινούργιο IPM.
var GD_ORDER = ["x_power","x_comm","x_drain","sensor","pswitch","x_air","x_ref","fan","eev","fourway","comp","ipm","x_pcb"];
var GD_STEP = {
 sensor:{t:"Αισθητήριο (θερμίστορ)", how:"Βγάλε το φις από την πλακέτα και μέτρα Ω. Σύγκρινε με τον πίνακα για τη θερμοκρασία που έχει τώρα.", ok:"Μέσα σε ±10% από τον πίνακα", bad:"OL (κομμένο), ~0 Ω (βραχυκύκλωμα) ή μακριά από τον πίνακα", u:"kΩ"},
 pswitch:{t:"Πιεσοστάτης / αισθητήρας πίεσης", how:"Πιεσοστάτης: μέτρα συνέχεια με το μηχάνημα σβηστό. Αισθητήρας 3 καλωδίων: με ρεύμα μέτρα 5 V τροφοδοσία και σήμα.", ok:"Πιεσοστάτης ~0 Ω · αισθητήρας: σήμα 0,5–4,5 V που ακολουθεί την πίεση", bad:"Πιεσοστάτης OL με κανονική πίεση · σήμα σταθερό 0 V ή 5 V", u:"Ω / V"},
 fan:{t:"Μοτέρ ανεμιστήρα", how:"Γύρνα τη φτερωτή με το χέρι. DC 3 καλωδίων: U‑V, V‑W, W‑U. DC 5 καλωδίων: με ρεύμα μέτρα 280–380 V DC, 15 V και Vsp στο φις.", ok:"Ελεύθερη φτερωτή · 3 ίσες τιμές (διαφορά <10%) · φτάνουν όλες οι τάσεις", bad:"Σφιχτή φτερωτή · άνισες τιμές/OL · τάσεις φτάνουν αλλά δεν γυρνάει", u:"Ω / V"},
 eev:{t:"Εκτονωτική βαλβίδα (πηνίο)", how:"Βγάλε το φις του πηνίου. Μέτρα κοινό → κάθε φάση.", ok:"4 ίσες τιμές (συνήθως 42–50 Ω) · «τικ‑τικ» στην εκκίνηση", bad:"OL ή άνιση τιμή σε φάση · κανένας ήχος με καλό πηνίο", u:"Ω"},
 fourway:{t:"Τετράοδη βαλβίδα", how:"Μέτρα το πηνίο χωρίς ρεύμα. Με ρεύμα, στη θέρμανση, μέτρα αν φτάνουν 230 V AC.", ok:"Πηνίο ~1–2,5 kΩ · φτάνει τάση και αλλάζει λειτουργία", bad:"Πηνίο OL · τάση φτάνει αλλά δεν αλλάζει (κολλημένη)", u:"kΩ / V"},
 comp:{t:"Συμπιεστής (περιελίξεις)", how:"Πρώτα DC στους πυκνωτές < 5 V. Βγάλε τα καλώδια U/V/W και μέτρα ανά ζεύγος, μετά κάθε ακροδέκτη προς σωλήνα.", ok:"U‑V = V‑W = W‑U (διαφορά <5–10%) · προς σασί OL (>2 MΩ με megger)", bad:"Άνισες τιμές, OL ή διαρροή προς σασί", u:"Ω"},
 x_power:{t:"Τάση τροφοδοσίας", how:"Μέτρα στην κλέμα τροφοδοσίας της εξωτερικής με το μηχάνημα σε λειτουργία, και ξανά τη στιγμή που ξεκινά ο συμπιεστής. Στα τριφασικά μέτρα και τις 3 φάσεις.", ok:"Μονοφασικό 207–253 V (230 V ±10%) · τριφασικό 360–440 V με ίσες φάσεις · δεν «βουτάει» στο ξεκίνημα", bad:"Εκτός ορίων, άνισες φάσεις ή μεγάλη πτώση στο ξεκίνημα (χαλαρή επαφή, λεπτό ή μακρύ καλώδιο)", u:"V"},
 x_comm:{t:"Καλώδιο επικοινωνίας εσωτ. ↔ εξωτ.", how:"Με το ρεύμα κλειστό: έλεγξε ότι οι κλέμες αντιστοιχούν ένα‑ένα (π.χ. 1‑2‑3 ή S1‑S2‑S3), ότι είναι σφιχτές, χωρίς μάτισμα και ότι το καλώδιο δεν περνά δίπλα σε καλώδια ρεύματος. Με ρεύμα: μέτρα DC στη γραμμή σήματος – πρέπει να αυξομειώνεται.", ok:"Σωστή αντιστοιχία, σφιχτές κλέμες · η τάση σήματος «παίζει»", bad:"Λάθος/χαλαρή κλέμα, μάτισμα, ή σταθερή τάση (π.χ. 0 V) στη γραμμή σήματος", u:"V DC"},
 x_drain:{t:"Αποχέτευση / φλοτέρ", how:"Κοίτα αν το ταψί έχει νερό, αν δουλεύει η αντλία συμπυκνωμάτων και αν ο σωλήνας έχει κλίση και δεν είναι φραγμένος. Μέτρα το φλοτέρ με άδειο ταψί.", ok:"Άδειο ταψί · η αντλία δουλεύει · φλοτέρ κλειστό (~0 Ω) με άδειο ταψί", bad:"Νερό στο ταψί, φραγμένος σωλήνας, αντλία δεν δουλεύει ή φλοτέρ ανοιχτό (OL) με άδειο ταψί", u:"Ω"},
 x_ref:{t:"Ψυκτικό κύκλωμα (πιέσεις)", how:"Βάλε μανόμετρα με το μηχάνημα να δουλεύει 15′. Με το εργαλείο «Πιέσεις» βγάλε υπερθέρμανση και υπόψυξη. Έλεγξε και ότι οι βάνες είναι τελείως ανοιχτές και τα στοιχεία καθαρά.", ok:"Υπερθέρμανση 2–8 K (inverter με εκτονωτική) · υπόψυξη 3–10 K", bad:"Λείπει φρέον, φραγή ή παραπάνω φρέον (δες τον «Κανόνα» στις Πιέσεις)", u:"bar / K", part:"pres"},
 x_air:{t:"Ροή αέρα (φίλτρα, στοιχεία, ανεμιστήρες)", how:"Κοίτα φίλτρα εσωτερικής, στοιχείο εσωτερικής και εξωτερικής (σκόνη, λάδια, φύλλα), φτερωτές, και ότι τίποτα δεν κλείνει την έξοδο αέρα της εξωτερικής (επανακυκλοφορία ζεστού αέρα).", ok:"Καθαρά φίλτρα και στοιχεία · ελεύθερη ροή · ανεμιστήρες σε κανονικές στροφές", bad:"Βρόμικα φίλτρα/στοιχεία, εμπόδιο ή ζεστός αέρας που ξαναμπαίνει στην εξωτερική"},
 x_pcb:{t:"Πλακέτα – τροφοδοσίες & ασφάλεια", how:"Με ρεύμα και προσοχή: μέτρα την είσοδο AC στην πλακέτα, την ασφάλεια (συνέχεια, με ρεύμα κλειστό) και τις χαμηλές τάσεις (συνήθως 5 V, 12 V, 15 V DC). Κοίτα για καμένα σημεία, φουσκωμένους πυκνωτές, καμένο varistor.", ok:"Φτάνει AC · ασφάλεια καλή · σωστές χαμηλές τάσεις · κανένα σημάδι καψίματος", bad:"Καμένη ασφάλεια, λείπει χαμηλή τάση ή σημάδια καψίματος → πλακέτα (ή βραχυκύκλωμα σε εξάρτημα που τροφοδοτεί)", u:"V"},
 ipm:{t:"IPM / πλακέτα inverter", how:"ΧΩΡΙΣ ΡΕΥΜΑ: διακόπτης κάτω, DC στους πυκνωτές < 5 V. Δοκιμή διόδου στις 3 φάσεις, και τις δύο φορές.", ok:"3 ίσες τιμές ~0,3–0,7 V μία φορά, OL ανάποδα", bad:"0 V ή πολύ χαμηλή τιμή σε φάση = καμένο", u:"V (δίοδος)"}
};
function gdBuild(ids){
  var st = [{id:"reset", t:"Reset ρεύματος", how:"Κλείσε τον γενικό διακόπτη 3–5 λεπτά, άνοιξε και βάλε το μηχάνημα να δουλέψει.", ok:"Δεν ξαναβγαίνει ο κωδικός", bad:"Ξαναβγαίνει ο κωδικός", resetStep:true},
            {id:"conn", t:"Φις, καλώδια, κονέκτορες", how:"Με το ρεύμα κλειστό: έλεγξε τα φις του εξαρτήματος στην πλακέτα και στη διαδρομή. Τράβηξε ελαφρά κάθε καλώδιο.", ok:"Σφιχτά, χωρίς οξείδωση ή κάψιμο", bad:"Χαλαρό, οξειδωμένο, καμένο ή κομμένο"}];
  GD_ORDER.forEach(function(id){ if(ids.indexOf(id)>=0 && GD_STEP[id]){ var g = GD_STEP[id]; st.push({id:id, t:g.t, how:g.how, ok:g.ok, bad:g.bad, u:g.u, part:g.part!==undefined ? g.part : (id.indexOf("x_")===0 ? null : id)}); } });
  var hasPart = ids.some(function(i){ return i.indexOf("x_")!==0; });
  if(!hasPart && ids.indexOf("x_pcb")<0 && (ids.indexOf("x_comm")>=0 || ids.indexOf("x_power")>=0)){ var gp = GD_STEP.x_pcb; st.push({id:"x_pcb", t:gp.t, how:gp.how, ok:gp.ok, bad:gp.bad, u:gp.u, part:null}); }
  if(hasPart && ids.indexOf("x_pcb")<0) st.push({id:"pcb", t:"Πλακέτα – έξοδος προς το εξάρτημα", how:"Με ρεύμα: μέτρα την τάση/σήμα που βγάζει η πλακέτα προς το εξάρτημα (δες «Πώς μετράω» του εξαρτήματος).", ok:"Βγαίνει η σωστή τάση/σήμα", bad:"Δεν βγαίνει τάση/σήμα ενώ το εξάρτημα είναι καλό"});
  return st;
}
function gdOpen(ids, code, title, side){
  S.gd = {ids:ids, code:code||"", title:title||"", side:side||"", st:gdBuild(ids), i:0, res:{}, val:{}};
  var ov = document.getElementById("gdov");
  if(!ov){ ov = document.createElement("div"); ov.id = "gdov"; document.body.appendChild(ov); }
  if(ov.style.display!=="flex") ovPush();
  ov.style.display = "flex"; document.body.style.overflow = "hidden"; gdRender();
}
function gdClose(){ var ov = document.getElementById("gdov"); if(ov){ ov.style.display = "none"; ov.innerHTML = ""; } document.body.style.overflow = ""; ovPop(); }
function gdFound(){ var g = S.gd; for(var i=0;i<g.st.length;i++){ var s = g.st[i]; if(g.res[s.id]==="bad" && !s.resetStep) return s; } return null; }
function gdSummary(){
  var g = S.gd, L = [];
  g.st.forEach(function(s){ var r = g.res[s.id]; if(!r) return; if(s.resetStep){ L.push(r==="ok"?"✔ Reset ρεύματος: ο κωδικός έφυγε":r==="bad"?"• Reset ρεύματος: ο κωδικός ξαναβγαίνει":"– Reset ρεύματος: δεν έγινε"); return; } L.push((r==="ok"?"✔ ":r==="bad"?"✘ ":"– ")+s.t+(g.val[s.id]?" ("+g.val[s.id]+")":"")+(r==="skip"?": δεν ελέγχθηκε":"")); });
  return L.join("\n");
}
function gdRender(){
  var g = S.gd, ov = document.getElementById("gdov"); if(!g || !ov) return;
  var h = '<div class="schead"><b>🧭 Έλεγχος βήμα‑βήμα'+(g.code?' – '+esc(g.code):'')+'</b><button class="mini" id="gdclose">✕</button></div>'+
    (g.title?'<div class="small">'+esc(g.title)+'</div>':'')+
    '<div class="gdprog">'+g.st.map(function(s,i){ var r = g.res[s.id]; return '<span class="gdp'+(i===g.i?' cur':'')+(r?' '+r:'')+'" data-gdgo="'+i+'" title="'+esc(s.t)+'"></span>'; }).join("")+'</div>';
  var f = gdFound();
  if(g.i >= g.st.length || g.done){
    h += '<div class="card gdres">';
    if(g.res.reset==="ok") h += '<div class="dtr">✅ Ο κωδικός δεν ξαναβγήκε μετά το reset. Πιθανότατα ήταν παροδικό (τάση δικτύου, παράσιτο). Αν ξαναβγεί, κάνε τους ελέγχους.</div>';
    else if(f) h += '<div class="dtr">🎯 Πιθανός ένοχος: <b>'+esc(f.t)+'</b>'+(g.val[f.id]?' (μέτρησες '+esc(g.val[f.id])+')':'')+'</div><div class="small">Πρώτο σημείο που βγήκε εκτός. Αν το αλλάξεις και συνεχίζει, ξαναπέρασε τους ελέγχους από εκεί και κάτω.</div>';
    else if(g.st.every(function(s){ return g.res[s.id]==="ok" || s.resetStep; })) h += '<div class="dtr">🎯 Όλα βγήκαν εντάξει. Η αιτία είναι μάλλον στην πλακέτα (λογισμικό/επικοινωνία) ή σε κάτι που ο κωδικός δεν δείχνει άμεσα. Έλεγξε τάσεις τροφοδοσίας της πλακέτας και τον κωδικό στο service manual.</div>';
    else h += '<div class="dtr">Δεν βρέθηκε ένοχος, αλλά κάποια βήματα δεν ελέγχθηκαν. Πάτα πάνω στις κουκκίδες για να τα κάνεις.</div>';
    h += '<pre class="gdsum">'+esc(gdSummary())+'</pre><div class="dtbtns">'+(f&&f.part?'<button class="mini" data-plist="'+esc(f.t)+'">🧾 Βάλε στη λίστα ανταλλακτικών</button>':'')+
      '<button class="mini" id="gdhist">📒 Καταχώρηση επίσκεψης</button><button class="mini" id="gdshare">📤 Κοινοποίηση</button></div>'+
      '<div class="dtbtns small"><button class="mini" data-gdgo="0">↺ Από την αρχή</button><button class="mini" id="gdclose2">✕ Τέλος</button></div></div>';
    ov.innerHTML = h; return;
  }
  var s = g.st[g.i], r = g.res[s.id];
  h += '<div class="card gdstep"><div class="dthead"><b>'+(g.i+1)+'. '+esc(s.t)+'</b><span class="small">βήμα '+(g.i+1)+' από '+g.st.length+'</span></div>'+
    '<div class="gdhow">'+esc(s.how)+'</div>'+
    (s.resetStep?'':'<div class="gdok">✔ Εντάξει: '+esc(s.ok)+'</div><div class="gdbad">✘ Εκτός: '+esc(s.bad)+'</div>')+
    gdExpect(s.id)+(s.u?'<label class="small">Τι μέτρησες ('+esc(s.u)+')<input id="gdval" value="'+esc(g.val[s.id]||"")+'" inputmode="text" placeholder="'+esc(GD_PH[s.id]||"προαιρετικά")+'"></label><div id="gdhint">'+gdHint(s.id, g.val[s.id]||"")+'</div>':'')+
    (s.part?'<button class="plk" data-gopart="'+s.part+'" data-fcode="'+esc(g.code)+'" data-ftitle="'+esc(g.title)+'" data-fside="'+esc(g.side)+'" id="gdhowto">'+partById(s.part).icon+' Πώς μετράω αναλυτικά</button>':'')+
    '<div class="dtbtns">'+(s.resetStep?'<button class="mini dtn'+(r==="bad"?' on':'')+'" data-gdr="bad">🔁 Ξαναβγαίνει</button><button class="mini dty'+(r==="ok"?' on':'')+'" data-gdr="ok">✅ Έφυγε</button>':'<button class="mini dty'+(r==="ok"?' on':'')+'" data-gdr="ok">✔ Εντάξει</button><button class="mini dtn'+(r==="bad"?' on':'')+'" data-gdr="bad">✘ Εκτός</button>')+'<button class="mini'+(r==="skip"?' on':'')+'" data-gdr="skip">Παράλειψη</button></div>'+
    '<div class="dtbtns small"><button class="mini" data-gdgo="'+(g.i-1)+'"'+(g.i>0?'':' disabled')+'>← Πίσω</button><button class="mini" id="gdend">Αποτέλεσμα</button></div></div>';
  ov.innerHTML = h;
}
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-guide],#gdclose,#gdclose2,[data-gdr],[data-gdgo],#gdend,#gdhist,#gdshare,#gdhowto"); if(!el) return;
  if(el.hasAttribute("data-guide")){ e.stopPropagation(); gdOpen(el.getAttribute("data-guide").split(","), el.getAttribute("data-fcode"), el.getAttribute("data-ftitle"), el.getAttribute("data-fside")); return; }
  var g = S.gd; if(!g) return;
  var v = document.getElementById("gdval"); if(v && g.st[g.i]) g.val[g.st[g.i].id] = v.value.trim();
  if(el.id==="gdclose" || el.id==="gdclose2"){ gdClose(); return; }
  if(el.id==="gdhowto"){ gdClose(); return; } // ο γενικός χειριστής [data-gopart] ανοίγει το εξάρτημα (το ↩ σε γυρνά πίσω)
  if(el.hasAttribute("data-gdr")){
    var s = g.st[g.i]; g.res[s.id] = el.getAttribute("data-gdr"); g.done = false;
    if(s.resetStep && g.res[s.id]==="ok"){ g.done = true; g.i = g.st.length; }
    else if(g.res[s.id]==="bad" && !s.resetStep){ g.done = true; g.i = g.st.length; }
    else g.i++;
    gdRender(); var ov = document.getElementById("gdov"); if(ov) ov.scrollTop = 0; return;
  }
  if(el.hasAttribute("data-gdgo")){ var n = +el.getAttribute("data-gdgo"); if(n>=0){ g.i = Math.min(n, g.st.length-1); g.done = false; if(n===0 && el.textContent.indexOf("αρχή")>=0){ g.res = {}; g.val = {}; } } gdRender(); return; }
  if(el.id==="gdend"){ g.done = true; g.i = g.st.length; gdRender(); return; }
  if(el.id==="gdhist"){ var f = gdFound(); S.gdCode = g.code; S.gdFix = f ? "Βρέθηκε εκτός: "+f.t+(g.val[f.id]?" ("+g.val[f.id]+")":"") : ""; S.gdNote = "Έλεγχοι:\n"+gdSummary();
    var gov = document.getElementById("gdov"); if(gov){ gov.style.display = "none"; gov.innerHTML = ""; }
    var hov = document.getElementById("histov"); if(!hov){ hov = document.createElement("div"); hov.id = "histov"; document.body.appendChild(hov); } hov.style.display = "flex"; // κρατάει την ίδια θέση στο ιστορικό του browser
    histOpen("form"); return; }
  if(el.id==="gdshare"){ shareText("Έλεγχος κωδικού "+g.code+(g.title?" – "+g.title:"")+"\n"+gdSummary(), "Έλεγχος βλάβης"); return; }
});
window.addEventListener("popstate", function(){ var ov = document.getElementById("gdov"); if(ov && ov.style.display==="flex"){ OVN = Math.max(0,OVN-1); ov.style.display = "none"; ov.innerHTML = ""; document.body.style.overflow = ""; } });

// --- επιπλέον ροές χωρίς συγκεκριμένο εξάρτημα + έξυπνη ανάγνωση τιμών ---
function gdExtra(txt){
  var r = [];
  if(/επικοινων|communicat|transmission|μετάδοσ\S* σήματος|σήμα(τος)? μεταξύ|σειριακ[ήο] (γραμμ|επικ)/i.test(txt)) r.push("x_comm");
  if(/αντιπαγωτ|πάγωμα|παγώνει|peak cut|υπερφόρτωσ|υψηλή θερμοκρασία (στοιχείου|συμπύκνωσης|εσωτερικής)|ροή αέρα/i.test(txt)) r.push("x_air");
  if(/πλακέτα|PCB|EEPROM|μνήμη/i.test(txt)) r.push("x_pcb");
  if(/τάσ[ηεω][ςν]? (τροφοδ|δικτύου|εισόδου)|υπέρταση|υπόταση|χαμηλή τάση|υψηλή τάση|ασυμμετρ[ίι]α φάσ|έλλειψη φάσης|απώλεια φάσης|ανάστροφη φάση/i.test(txt)) r.push("x_power");
  if(/φλοτέρ|αντλία (συμπυκν|νερού|αποχ)|στάθμη νερού|αποχέτευσ|συμπυκνωμ/i.test(txt)) r.push("x_drain");
  if(/(υψηλ|χαμηλ)\S* πίεσ|έλλειψη (ψυκτικ|φρέον)|λίγο (ψυκτικ|φρέον)|διαρροή (ψυκτικ|φρέον)|θερμοκρασία (σωλήνα )?κατάθλιψης|υπερθέρμανση (κατάθλ|συμπιεστ)|peak cut/i.test(txt)) r.push("x_ref");
  return r;
}
var GD_PH = {comp:"π.χ. 1,2 1,2 1,3", fan:"π.χ. 12 12 13", eev:"π.χ. 46 46 47 46", ipm:"π.χ. 0,45 0,45 0,46", x_power:"π.χ. 228", sensor:"π.χ. 9,8", fourway:"π.χ. 1,6"};
function gdNums(v){ var m = String(v||"").match(/\d+(?:[.,]\d+)?/g); return m ? m.map(function(x){ return parseFloat(x.replace(",", ".")); }) : []; }
function gdExpect(id){
  var map = {comp:["compOhm","Ω ανά ζεύγος"], eev:["eevOhm","Ω κοινό→φάση"], fourway:["wayOhm","Ω πηνίο"]}, m = map[id]; if(!m) return "";
  var r = knownVal(m[0]); if(!r) return "";
  return '<div class="pext">📘 Για το μοντέλο '+esc(S.model||"")+' το manual δίνει <b>'+r[0]+'–'+r[1]+' '+m[1]+'</b>.</div>';
}
function gdHint(id, v){
  if(!v) return "";
  var ol = /OL|∞|άπειρ|κομμέν/i.test(v), n = gdNums(v), out = function(cls, t){ return '<div class="gdh '+cls+'">👉 '+t+'</div>'; };
  if(ol) return out("bad", "Υπάρχει OL – κομμένη περιέλιξη ή καλώδιο → μάλλον <b>Εκτός</b>.");
  if(!n.length) return "";
  var map = {comp:"compOhm", eev:"eevOhm", fourway:"wayOhm"}, kv = map[id] ? knownVal(map[id]) : null;
  if(kv){ var bad = n.filter(function(x){ return x < kv[0]*0.9 || x > kv[1]*1.1; }); if(bad.length) return out("bad", "Τιμή έξω από το εύρος του manual ("+kv[0]+"–"+kv[1]+") → μάλλον <b>Εκτός</b>."); }
  if(id==="x_power"){ var x = n[0]; if(n.length>=3){ var mx = Math.max.apply(null,n.slice(0,3)), mn = Math.min.apply(null,n.slice(0,3)), avg = (mx+mn)/2; if(avg>300 && (mx-mn)/avg*100 > 2) return out("bad", "Ασυμμετρία φάσεων "+hfx((mx-mn)/avg*100,1)+"% (πάνω από 2%) → <b>Εκτός</b>."); }
    if(x>300) return x>=360 && x<=440 ? out("ok", "Μέσα στα όρια τριφασικού (360–440 V).") : out("bad", "Έξω από τα όρια τριφασικού (360–440 V) → <b>Εκτός</b>.");
    return x>=207 && x<=253 ? out("ok", "Μέσα στα όρια μονοφασικού (207–253 V).") : out("bad", "Έξω από τα όρια μονοφασικού (207–253 V) → <b>Εκτός</b>."); }
  if((id==="comp" || id==="fan" || id==="ipm") && n.length>=3 || id==="eev" && n.length>=4){
    var k = id==="eev" ? n.slice(0,4) : n.slice(0,3), mx2 = Math.max.apply(null,k), mn2 = Math.min.apply(null,k);
    if(id==="ipm" && mn2 < 0.1) return out("bad", "Τιμή κοντά στο 0 V → βραχυκύκλωμα, <b>Εκτός</b>.");
    if(id==="comp" && mn2 < 0.1) return out("bad", "Σχεδόν 0 Ω → βραχυκυκλωμένη περιέλιξη, <b>Εκτός</b>.");
    var d = mn2 > 0 ? (mx2-mn2)/mn2*100 : 999, lim = id==="comp" ? 10 : id==="ipm" ? 15 : 10;
    return d <= lim ? out("ok", "Οι τιμές είναι ίσες (διαφορά "+hfx(d,0)+"%) → μάλλον <b>Εντάξει</b>.") : out("bad", "Άνισες τιμές (διαφορά "+hfx(d,0)+"%, όριο ~"+lim+"%) → μάλλον <b>Εκτός</b>.");
  }
  if(id==="x_drain" && n.length===1) return n[0] < 1 ? out("ok","Φλοτέρ κλειστό → εντάξει, αν το ταψί είναι άδειο.") : "";
  return "";
}
document.addEventListener("input", function(e){
  if(!e.target || e.target.id!=="gdval" || !S.gd) return; var s = S.gd.st[S.gd.i]; if(!s) return;
  S.gd.val[s.id] = e.target.value.trim(); var h = document.getElementById("gdhint"); if(h) h.innerHTML = gdHint(s.id, e.target.value);
});
