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
  if(SCAN.target==="hist"){ var hf = document.getElementById("hf_ser"); scanStop(); var ov0 = document.getElementById("scanov"); if(ov0){ ov0.style.display="none"; ov0.innerHTML=""; } if(hf) hf.value = serClean(text); return; }
  var quick = SCAN.target==="quick", qh = "";
  if(quick){
    var all = serInfo(text, null), seenB = {};
    all.forEach(function(e){ if(!e.w) return; BRANDS.forEach(function(bb){ if(bb.own===e.o || (bb.own==="inv_gree" && e.o==="gree")) seenB[bb.n]=1; }); });
    var bl = Object.keys(seenB);
    qh = '<div class="lbl">Συνέχεια με μάρκα:</div><div class="chips">'+bl.map(function(n){ return '<button class="chip on" data-qb="'+esc(n)+'">'+esc(n)+'</button>'; }).join("")+
      '<button class="chip" id="qother">Άλλη μάρκα (Inventor, Nobu…)</button></div>';
    box.innerHTML = '<div class="sccode">'+esc(text)+'</div>'+histSeenHtml(text,"")+serHtml(text, null)+qh+'<div class="scbtns" style="margin-top:12px"><button class="mini" id="scagain">🔁 Σάρωση ξανά</button></div>';
    return;
  }
  box.innerHTML = '<div class="sccode">'+esc(text)+'</div>'+histSeenHtml(text,"")+serHtml(text, cs)+
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
  var ov = document.getElementById("histov");
  if(!ov){ ov = document.createElement("div"); ov.id = "histov"; document.body.appendChild(ov); }
  ov.style.display = "flex"; document.body.style.overflow = "hidden";
  var h = '<div class="schead"><b>📒 Ιστορικό & ανταλλακτικά</b><button class="mini" id="histclose">✕</button></div>'+
    '<div class="chips htabs"><button class="chip'+(mode!=="parts"?' on':'')+'" id="htab_h">📒 Επισκέψεις ('+HIST.length+')</button><button class="chip'+(mode==="parts"?' on':'')+'" id="htab_p">🧾 Ανταλλακτικά ('+PLIST.filter(function(p){return !p.done;}).length+')</button></div>';
  if(mode==="parts"){ ov.innerHTML = h + plistHtml(); return; }
  if(mode==="form"){
    var e = id ? HIST.filter(function(x){ return x.id===id; })[0] : null, b = brandObj();
    e = e || {cust:"", brand:b?b.n:"", oem:(S.oem && S.oem!=="__all" && PLAT[S.oem])?PLAT[S.oem].name:"", model:S.model||"", ser:S.fw.ser||"", code:S.q||"", fix:"", note:""};
    var f = function(k,l,ph){ return '<label>'+esc(l)+'<input id="hf_'+k+'" value="'+esc(e[k]||"")+'" placeholder="'+esc(ph||"")+'"></label>'; };
    h += '<div class="hform card">'+f("cust","Πελάτης / τοποθεσία","π.χ. Παπαδόπουλος – Καλαμαριά")+f("brand","Μάρκα","")+f("oem","Εργοστάσιο","")+f("model","Μοντέλο","")+
      '<label>Σειριακός<div class="row2"><input id="hf_ser" value="'+esc(e.ser||"")+'"><button class="mini" data-scan="hist">📷</button></div></label>'+
      f("code","Κωδικός βλάβης","π.χ. E1, F5")+
      '<label>Τι έκανες / τι άλλαξες<textarea id="hf_fix" placeholder="π.χ. άλλαξα αισθητήριο σωλήνα εσωτ. (20kΩ)">'+esc(e.fix||"")+'</textarea></label>'+
      '<label>Σημειώσεις<textarea id="hf_note" placeholder="μετρήσεις, πιέσεις, ανταλλακτικά που χρειάζονται…">'+esc(e.note||"")+'</textarea></label>'+
      '<div class="scbtns" style="margin-top:10px"><button class="mini" id="hrep" data-id="'+esc(id||"")+'">📤 Αναφορά για πελάτη</button><button class="mini" id="hprint" data-id="'+esc(id||"")+'">🖨️ Εκτύπωση / PDF</button></div>'+
      '<div class="scbtns" style="margin-top:10px"><button class="mini" id="histsave" data-id="'+esc(id||"")+'">💾 Αποθήκευση</button><button class="mini" id="histlist">Άκυρο</button>'+(id?'<button class="mini" id="histdel" data-id="'+esc(id)+'">🗑️ Διαγραφή</button>':'')+'</div></div>';
  } else {
    h += '<button class="mini scanbtn" id="histnew">➕ Νέα καταχώρηση (από την τρέχουσα βλάβη)</button>'+
      '<input id="histq" placeholder="Αναζήτηση: πελάτης, σειριακός, μοντέλο, κωδικός…" value="'+esc(S.hq||"")+'">'+
      '<div id="histl"></div>'+
      '<div class="small" style="margin-top:12px">Το ιστορικό μένει μόνο σε αυτό το κινητό. Κράτα αντίγραφο πριν αλλάξεις κινητό:</div>'+
      '<div class="scbtns"><button class="mini" id="histexp">⬇️ Εξαγωγή αντιγράφου</button><label class="mini scphoto">⬆️ Επαναφορά<input type="file" accept=".json,application/json" id="histimp" hidden></label></div>';
  }
  ov.innerHTML = h;
  if(mode!=="form") histList();
}
function histList(){
  var q = serClean(S.hq||""), el = document.getElementById("histl"); if(!el) return;
  var r = HIST.slice().sort(function(a,b){ return b.ts-a.ts; }).filter(function(h){ if(!q) return true; return serClean([h.cust,h.brand,h.oem,h.model,h.ser,h.code,h.fix,h.note].join(" ")).indexOf(q)>=0; });
  el.innerHTML = r.length ? r.map(function(h){ return '<div class="hcard" data-hid="'+esc(h.id)+'"><div><b>'+esc(h.cust||"—")+'</b>'+(h.code?' · κωδ. <b>'+esc(h.code)+'</b>':'')+'</div><div class="hm">'+esc(histDate(h.ts))+' · '+esc([h.brand,h.oem,h.model].filter(Boolean).join(" · "))+(h.ser?' · S/N '+esc(h.ser):'')+'</div>'+(h.fix?'<div class="small">🔧 '+esc(h.fix)+'</div>':'')+'</div>'; }).join("")
    : '<div class="small">'+(HIST.length?'Δεν βρέθηκε.':'Δεν υπάρχουν καταχωρήσεις ακόμα. Μετά από μια επισκευή πάτα «Νέα καταχώρηση».')+'</div>';
}
function histClose(){ var ov = document.getElementById("histov"); if(ov){ ov.style.display="none"; ov.innerHTML=""; } document.body.style.overflow = ""; }
document.addEventListener("click", function(e){
  var el = e.target.closest("#histbtn,#histclose,#histnew,#histsave,#histlist,#histdel,#histexp,[data-hid],#qscan,[data-qb]"); if(!el) return;
  if(el.id==="qscan"){ scanOpen("quick"); return; }
  if(el.hasAttribute("data-qb")){ var nm = el.getAttribute("data-qb"), t = SCAN.last; scanClose(); S.brand = nm; S.bedit=false; S.catOpen=true; S.oem=null; S.model=""; S.ledv={}; S.fw={plate:"",rc:"",comp:"",pcb:"",ser:serClean(t)}; S.fwOpen = true; renderAll(); return; }
  if(el.id==="histbtn"){ histOpen("list"); return; }
  if(el.id==="histclose"){ histClose(); return; }
  if(el.id==="histnew"){ histOpen("form"); return; }
  if(el.id==="histlist"){ histOpen("list"); return; }
  if(el.hasAttribute("data-hid")){ histOpen("form", el.getAttribute("data-hid")); return; }
  if(el.id==="histsave"){
    var id = el.getAttribute("data-id"), o = {}; ["cust","brand","oem","model","ser","code","fix","note"].forEach(function(k){ var x = document.getElementById("hf_"+k); o[k] = x ? x.value.trim() : ""; });
    if(id){ HIST.forEach(function(h){ if(h.id===id){ for(var k in o) h[k]=o[k]; } }); }
    else { o.id = "h"+Date.now().toString(36); o.ts = Date.now(); o.cat = S.cat; HIST.push(o); }
    histSave(); histOpen("list"); return;
  }
  if(el.id==="histdel"){ var d = el.getAttribute("data-id"); if(el.getAttribute("data-c")!=="1"){ el.setAttribute("data-c","1"); el.textContent="Πάτα ξανά για διαγραφή"; return; } HIST = HIST.filter(function(h){ return h.id!==d; }); histSave(); histOpen("list"); return; }
  if(el.id==="histexp"){
    var blob = new Blob([JSON.stringify({app:"vlavologio", v:1, hist:HIST, serLearn:serLearn, myMap:LS.get("vl_mymap",[])}, null, 1)], {type:"application/json"}), fn = "vlavologio-istoriko-"+new Date().toISOString().slice(0,10)+".json";
    try{ var file = new File([blob], fn, {type:"application/json"}); if(navigator.canShare && navigator.canShare({files:[file]})){ navigator.share({files:[file], title:"Βλαβολόγιο – αντίγραφο"}).catch(function(){}); return; } }catch(x){}
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500); return;
  }
});
document.addEventListener("input", function(e){ if(e.target && e.target.id==="histq"){ S.hq = e.target.value; histList(); } });
document.addEventListener("change", function(e){
  if(!e.target || e.target.id!=="histimp" || !e.target.files || !e.target.files[0]) return;
  var rd = new FileReader(); rd.onload = function(){ try{ var d = JSON.parse(rd.result); if(!d || d.app!=="vlavologio") throw 0;
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

// ===== Αναφορά για πελάτη =====
function reportText(h){
  var L = ["ΑΝΑΦΟΡΑ ΕΠΙΣΚΕΥΗΣ ΚΛΙΜΑΤΙΣΤΙΚΟΥ", "Ημερομηνία: "+new Date(h.ts||Date.now()).toLocaleDateString("el-GR")];
  if(h.cust) L.push("Πελάτης: "+h.cust);
  var u = [h.brand, h.model].filter(Boolean).join(" "); if(u) L.push("Μονάδα: "+u);
  if(h.ser) L.push("Σειριακός: "+h.ser);
  if(h.code) L.push("Κωδικός βλάβης: "+h.code);
  if(h.fix) L.push("Εργασία: "+h.fix);
  if(h.note) L.push("Σημειώσεις: "+h.note);
  return L.join("\n");
}
function reportPrint(h){
  var w = document.getElementById("printarea"); if(!w){ w = document.createElement("div"); w.id = "printarea"; document.body.appendChild(w); }
  w.innerHTML = '<h2>Αναφορά επισκευής κλιματιστικού</h2>'+reportText(h).split("\n").slice(1).map(function(l){ var i = l.indexOf(":"); return '<p><b>'+esc(l.slice(0,i+1))+'</b>'+esc(l.slice(i+1))+'</p>'; }).join("")+'<p style="margin-top:40px">Υπογραφή τεχνικού: ____________________</p>';
  document.documentElement.classList.add("printing"); setTimeout(function(){ try{ window.print(); }catch(x){} setTimeout(function(){ document.documentElement.classList.remove("printing"); }, 500); }, 50);
}
function curFormEntry(){ var o = {}; ["cust","brand","oem","model","ser","code","fix","note"].forEach(function(k){ var x = document.getElementById("hf_"+k); o[k] = x ? x.value.trim() : ""; }); o.ts = Date.now(); return o; }
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
function setField(on){ LS.set("vl_field", !!on); document.documentElement.classList.toggle("field", !!on); var b = document.getElementById("fieldbtn"); if(b){ b.classList.toggle("on", !!on); b.title = on ? "Λειτουργία πεδίου: ΝΑΙ" : "Λειτουργία πεδίου (μεγάλα γράμματα, έντονη αντίθεση)"; } }
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
