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
   src:"Midea: ο σειριακός (λευκό αυτοκόλλητο με barcode) έχει 22 χαρακτήρες· έτος στις θέσεις 12–13, μήνας στη 14η (building-center.org). Μετρά λίγο για εργοστάσιο – επιβεβαίωσε."},
  {o:"samsung", re:/^[0-9A-Z]{7}([A-Z])([1-9ABC])[0-9A-Z]{5}[A-Z]$/, w:1, k:"Σειριακός 15 χαρακτήρων τύπου Samsung", d:function(m){ return {mo:moX(m[2]), yl:m[1]}; },
   src:"Samsung: ο σειριακός έχει 15 χαρακτήρες και τελειώνει σε γράμμα· 8ος χαρακτήρας = έτος (γράμμα), 9ος = μήνας. Δεν υπάρχει επίσημος πίνακας γραμμάτων – δες την ημερομηνία στο ταμπελάκι."},
  {o:"hisense", re:/^1KA[0-9A-Z]{20}$/, w:2, k:"Σειριακός εσωτερικής Hisense (1KA…, 23 χαρ.)", src:"Hisense – How to identify the model and the serial number: οι επίτοιχες εσωτερικές έχουν σειριακό 23 χαρακτήρων που ξεκινά με 1KA."},
  {o:"hisense", re:/^Q[0-9A-Z]{11}$/, w:1, k:"Σειριακός Hisense (Q…, 12 χαρ.)", src:"Hisense – How to identify the model and the serial number: ο σειριακός έχει 12 χαρακτήρες και ξεκινά με Q (κυρίως VRF/επαγγελματικά)."},
  {o:"gree", re:/^C[A-Z]\d{3}[A-Z]\d{5}$/, w:2, k:"Κωδικός προϊόντος Gree (Product Code)", src:"Εγχειρίδια σέρβις Gree: «Product Code» της μορφής CU050W01701 / CB…"},
  {o:"fujitsu", re:/^[A-Z]{1,3}\d{6}$/, w:0, k:"Μορφή σειριακού Fujitsu (γράμματα + 6 ψηφία)", src:"Fujitsu: αύξουσα αρίθμηση, η ημερομηνία δεν κωδικοποιείται στον σειριακό (building-center.org) – βρίσκεται από την Fujitsu με τον σειριακό."}
];
var QRDOM = [[/gree/i,"gree"],[/midea/i,"midea"],[/hisense/i,"hisense"],[/haier/i,"haier"],[/daikin/i,"daikin"],[/tcl\./i,"tcl"],[/aux(group|air)?\./i,"aux"],[/samsung/i,"samsung"],[/lg\.com/i,"lg"],[/mitsubishielectric|mitsubishi-electric/i,"me"],[/toshiba/i,"toshiba"],[/panasonic/i,"panasonic"],[/fujitsu/i,"fujitsu"]];
var serLearn = LS.get("vl_serlearn", []); // [{b, p, o}]
function serClean(t){ return String(t||"").toUpperCase().replace(/[\s\-\.\/]/g,""); }
function serInfo(t, cs){
  var raw = String(t||""), v = serClean(raw), out = [];
  function ok(o){ return !cs || cs.indexOf(o)>=0 || (o==="gree" && cs.indexOf("inv_gree")>=0); }
  if(/^https?:\/\//i.test(raw)){ QRDOM.forEach(function(q){ if(q[0].test(raw)) out.push({o:q[1], w:2, k:"QR με σελίδα της "+(PLAT[q[1]]?PLAT[q[1]].name:q[1]), src:"Ο QR οδηγεί στον ιστότοπο του κατασκευαστή."}); }); return out; }
  if(v.length < 5) return out;
  FW.pcb.forEach(function(x){ if(x[0].test(v)) out.push({o:x[1], w:x[2], k:"Κωδικός πλακέτας", src:x[3], pcb:1}); });
  SER.forEach(function(r){ var m = v.match(r.re); if(!m) return; var e = {o:r.o, w:r.w, k:r.k, src:r.src}; if(r.d) e.d = r.d(m); if(!ok(r.o)) e.w = Math.min(e.w,1), e.off = 1; out.push(e); });
  var b = brandObj();
  if(b && !b.own){ var dm = detectOem(b, v); if(dm) out.push({o:dm.o, w:2, k:"Μοντέλο "+b.n, src:dm.w, model:1}); }
  serLearn.forEach(function(l){ if(b && l.b===b.n && v.indexOf(l.p)===0) out.push({o:l.o, w:3, k:"Δική σου αντιστοίχιση ("+l.p+"…)", src:"Το αποθήκευσες εσύ από προηγούμενη μονάδα."}); });
  return out;
}
function dateTxt(d){
  if(!d) return "";
  var s = d.mo ? GRM[d.mo]+" " : "";
  if(d.y) s += d.y + (d.dec ? " (ή "+(d.y-10)+")" : "");
  else if(d.yl) s += "έτος: γράμμα «"+d.yl+"»";
  return "📅 Κατασκευή: "+s+(d.x?" · "+d.x:"");
}
function serHtml(t, cs){
  var r = serInfo(t, cs);
  if(!r.length) return '<div class="small">Δεν αναγνώρισα τη μορφή. Αν ξέρεις το εργοστάσιο, πάτα το παρακάτω για να το θυμάμαι την επόμενη φορά.</div>';
  return r.map(function(e){
    var nm = PLAT[e.o] ? PLAT[e.o].name : e.o;
    return '<div class="serl"><b>'+esc(e.k)+'</b>'+(e.w?' → <span class="det">'+esc(nm)+'</span>':'')+(e.off?' <span class="small">(δεν είναι στα συνήθη εργοστάσια αυτής της μάρκας)</span>':'')+
      (e.d?'<div>'+esc(dateTxt(e.d))+'</div>':'')+'<div class="small">'+esc(e.src)+'</div></div>';
  }).join("");
}

// ===== Scanner UI =====
var SCAN = {st:null, timer:0, det:null, target:"ser", busy:false, hits:{}};
function scanOpen(target){
  SCAN.target = target||"ser"; SCAN.hits = {};
  var ov = document.getElementById("scanov");
  if(!ov){ ov = document.createElement("div"); ov.id = "scanov"; document.body.appendChild(ov); }
  ov.innerHTML = '<div class="schead"><b>📷 Σάρωση barcode</b><button class="mini" id="scclose">✕</button></div>'+
    '<div class="scbox"><video id="scvid" playsinline muted autoplay></video><div class="scguide"></div></div>'+
    '<div class="scmsg" id="scmsg">Άνοιγμα κάμερας…</div>'+
    '<div class="scbtns"><label class="mini scphoto">📸 Φωτογραφία του barcode<input type="file" accept="image/*" capture="environment" id="scfile" hidden></label></div>'+
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
function scanClose(){ scanStop(); var ov = document.getElementById("scanov"); if(ov){ ov.style.display = "none"; ov.innerHTML = ""; } document.body.style.overflow = ""; }
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
  box.innerHTML = '<div class="sccode">'+esc(text)+'</div>'+serHtml(text, cs)+
    '<div class="lbl">Πάτα τι είναι, για να το περάσω στη σωστή θέση:</div><div class="chips">'+order.map(function(k,i){ return '<button class="chip'+(i===0?' on':'')+'" data-scuse="'+k+'">'+esc(SCT[k])+'</button>'; }).join("")+'</div>'+
    (cs && cs.length>1 ? '<div class="lbl">Ξέρεις το εργοστάσιο αυτής της μονάδας; Αποθήκευσέ το για την επόμενη φορά:</div><div class="chips">'+cs.map(function(p){ return '<button class="chip" data-sclearn="'+p+'">'+esc(PLAT[p].name)+'</button>'; }).join("")+'</div>' : '')+
    '<div class="scbtns" style="margin-top:12px"><button class="mini" id="scagain">🔁 Σάρωση ξανά</button></div>';
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
  var el = e.target.closest("[data-scan],#scclose,#scagain,[data-scuse],[data-sclearn]"); if(!el) return;
  if(el.hasAttribute("data-scan")){ e.preventDefault(); scanOpen(el.getAttribute("data-scan")); return; }
  if(el.id==="scclose"){ scanClose(); return; }
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
