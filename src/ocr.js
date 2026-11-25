// ===== Ανάγνωση ταμπέλας (OCR): μία φωτογραφία → μάρκα, μοντέλο, εργοστάσιο, ψυκτικό, σειριακός =====
var OCR_CONF = {"0":"O","O":"0","1":"I","I":"1","L":"1","6":"G","G":"6","5":"S","S":"5","8":"B","B":"8","2":"Z","Z":"2","4":"A","A":"4","Q":"0","D":"0"};
function ocrVariants(tok){
  var out = [tok], pos = [];
  for(var i=0;i<tok.length;i++) if(OCR_CONF[tok[i]]) pos.push(i);
  pos = pos.slice(-6);                                  // οι αλλαγές γίνονται συνήθως στο τέλος (π.χ. 18IG → 1816)
  var n = Math.min(1<<pos.length, 64);
  for(var m=1;m<n;m++){ var a = tok.split(""); for(var j=0;j<pos.length;j++) if(m & (1<<j)) a[pos[j]] = OCR_CONF[a[pos[j]]]; out.push(a.join("")); }
  return out;
}
function plateParse(raw){
  var T = String(raw||"").toUpperCase().replace(/[“”«»]/g,'"'), lines = T.split(/\n+/).map(function(l){ return l.trim(); }).filter(Boolean);
  var R = {brands:[], model:"", modelRaw:"", hit:null, ref:"", chg:"", date:"", w:[]};
  var flat = " "+T.replace(/[^A-Z0-9]+/g," ")+" ";
  BRANDS.forEach(function(b){ if(b.n==="Άλλη μάρκα…") return; var keys = [b.n].concat((typeof ALIAS!=="undefined" && ALIAS[b.n]) ? ALIAS[b.n].filter(function(a){ return /^[a-z0-9 ]+$/i.test(a); }) : []);
    keys.forEach(function(k){ var K = " "+String(k).toUpperCase().replace(/[^A-Z0-9]+/g," ").trim()+" "; if(K.length>4 && flat.indexOf(K)>=0 && R.brands.indexOf(b.n)<0) R.brands.push(b.n); }); });
  // υποψήφια μοντέλα: πρώτα ό,τι γράφει δίπλα/κάτω από «MODEL», μετά κάθε «κωδικός» με γράμματα+αριθμούς
  var cands = [];
  lines.forEach(function(l, i){
    var m = l.match(/MOD[EF]L\b[^A-Z0-9]*(?:NO\.?|NAME)?[^A-Z0-9]*([A-Z0-9][A-Z0-9\-\/\.]{3,})/);
    if(m) cands.push(m[1]); else if(/^MOD[EF]L\b/.test(l) && lines[i+1]){ var n = lines[i+1].match(/([A-Z0-9][A-Z0-9\-\/\.]{3,})/); if(n) cands.push(n[1]); }
  });
  (T.match(/\b[A-Z]{1,6}[-\/]?[A-Z0-9]{2,}[A-Z0-9\-\/]*\b/g)||[]).forEach(function(t){ if(/\d/.test(t) && !/^(R32|R410A|R22|R290|IPX\d|EN\d+|MPA|KWH|BTU|PRC|LOT\d+|CE)$/.test(t) && cands.indexOf(t)<0) cands.push(t); });
  cands = cands.map(function(c){ return c.replace(/[\.\-\/]+$/,""); });
  R.modelRaw = cands[0]||"";
  var bObjs = R.brands.length ? BRANDS.filter(function(b){ return R.brands.indexOf(b.n)>=0; }) : BRANDS;
  outer: for(var ci=0; ci<cands.length && ci<12; ci++){
    var vs = ocrVariants(cands[ci].replace(/\s/g,""));
    for(var vi=0; vi<vs.length; vi++){
      for(var bi=0; bi<bObjs.length; bi++){ var h = detectOem(bObjs[bi], vs[vi]); if(h && (h.b || bObjs[bi].own===h.o || !bObjs[bi].own)){ R.model = vs[vi]; R.modelRaw = cands[ci]; R.hit = {b:bObjs[bi].n, o:h.o, w:h.w}; break outer; } }
    }
  }
  if(!R.model) R.model = R.modelRaw;
  var rf = T.match(/\bR[\s\-]?(32|410\s?A|22|290|454\s?B|407\s?C|134\s?A|1234YF|513A)\b/); if(rf) R.ref = "R"+rf[1].replace(/\s/g,"");
  var ch = T.match(/CHARGE[^0-9\n]{0,25}([0-9]+[\.,][0-9]{1,3})\s*K/) || T.match(/([0-9]+[\.,][0-9]{1,3})\s*KG\b(?![^\n]*WEIGHT)/); if(ch) R.chg = ch[1].replace(",",".");
  var dt = T.match(/MANUFACTUR\w*\s*DAT\w*[^0-9]{0,6}([0-9]{4}[\.\/\-][0-9]{1,2})/) || T.match(/(?:DATE|PROD)\w*[^0-9]{0,6}((?:19|20)[0-9]{2}[\.\/\-][0-9]{1,2})/); if(dt) R.date = dt[1];
  return R;
}
function ocrOpt(o){ var b = location.href.replace(/[#?].*$/,"").replace(/[^\/]*$/,""); o = o || {}; o.workerPath = b+"ocr/worker.min.js"; o.corePath = b+"ocr/core"; o.langPath = b+"ocr/lang"; o.workerBlobURL = false; return o; }
function ocrLoad(){
  return new Promise(function(res, rej){
    if(window.Tesseract) return res();
    var s = document.createElement("script"); s.src = "ocr/tesseract.min.js"; s.async = true;
    s.onload = function(){ window.Tesseract ? res() : rej(new Error("load")); }; s.onerror = function(){ rej(new Error("net")); }; document.head.appendChild(s);
  });
}
function platePhoto(file){
  if(!file) return; scanStop();
  var vb = document.querySelector("#scanov .scbox"); if(vb) vb.style.display = "none";
  scanMsg("🏷️ Διαβάζω την ταμπέλα… (την πρώτη φορά κατεβαίνει ο αναγνώστης κειμένου, ~1 λεπτό – μετά δουλεύει και χωρίς internet)");
  var url = URL.createObjectURL(file), img = new Image();
  img.onload = function(){
    var sc = Math.min(2, 3000/Math.max(img.width, img.height)), W = Math.round(img.width*sc), H = Math.round(img.height*sc);
    var c = document.createElement("canvas"); c.width = W; c.height = H; var cx = c.getContext("2d", {willReadFrequently:true}); cx.filter = "grayscale(1) contrast(1.3)"; cx.drawImage(img, 0, 0, W, H); cx.filter = "none"; URL.revokeObjectURL(url);
    var ser = ""; try{ var r = BC.decodeGray(BC.grayOf(cx.getImageData(0,0,W,H)), W, H, {rows:70, y0:0.02, y1:0.98, cols:true}); if(r) ser = r.t; }catch(x){}
    var finish = function(text){ var P = plateParse(text||""); if(!ser && SCAN.last) ser = ""; P.ser = ser; plateShow(P, text||""); };
    var withDet = SCAN.det ? SCAN.det.detect(c).then(function(r){ if(r && r.length) ser = r[0].rawValue; }).catch(function(){}) : Promise.resolve();
    withDet.then(ocrLoad).then(function(){
      var pct = -1;
      var lg = {logger:function(m){ if(m && m.status==="recognizing text"){ var p = Math.round((m.progress||0)*100); if(p!==pct && p%10===0){ pct = p; scanMsg("🏷️ Διαβάζω την ταμπέλα… "+p+"%"); } } }};
      lg = ocrOpt(lg); if(!Tesseract.createWorker) return Tesseract.recognize(c, "eng", lg);
      return Tesseract.createWorker("eng", 1, lg).then(function(w){
        return w.setParameters({tessedit_pageseg_mode:"11"}).then(function(){ return w.recognize(c); }).then(function(r){ try{ w.terminate(); }catch(x){} return r; });
      });
    }).then(function(r){ finish(r && r.data ? r.data.text : ""); })
      .catch(function(){ scanMsg(navigator.onLine ? "⚠️ Δεν μπόρεσα να διαβάσω κείμενο. Δοκίμασε ξανά με τη φωτογραφία πιο κοντά και ίσια." : "⚠️ Χρειάζεται internet την πρώτη φορά για να κατέβει ο αναγνώστης κειμένου."); var bx = document.getElementById("scres"); if(bx) bx.innerHTML = (ser ? '<div class="sccode">'+esc(ser)+'</div>' : '')+plateManual(""); });
  };
  img.onerror = function(){ scanMsg("Δεν άνοιξε η φωτογραφία."); };
  img.src = url;
}
function plateManual(m){
  return '<div class="lbl">Μοντέλο (όπως γράφει η ταμπέλα – διόρθωσέ το αν χρειάζεται):</div><input id="scmodel" value="'+esc(m||"")+'" placeholder="π.χ. TAG-18IG" autocapitalize="characters" spellcheck="false" autocomplete="off"><div id="scmres"></div>';
}
function plateShow(P, raw){
  SCAN.last = P.ser || SCAN.last || "";
  var bx = document.getElementById("scres"); if(!bx) return;
  document.querySelectorAll("#scanov > .scbtns").forEach(function(x){ x.style.display = "none"; });
  scanMsg(P.hit || P.brands.length || P.model ? "✅ Διάβασα την ταμπέλα – έλεγξε ότι είναι σωστά:" : "⚠️ Δεν βρήκα μάρκα/μοντέλο στη φωτογραφία.");
  var rows = [];
  rows.push(["Μάρκα", P.hit ? P.hit.b : (P.brands.join(", ") || "– δεν βρέθηκε –")]);
  rows.push(["Μοντέλο", (P.model||"– δεν βρέθηκε –")+(P.modelRaw && P.model && P.modelRaw.replace(/\s/g,"")!==P.model ? '  <span class="small">(διάβασα «'+esc(P.modelRaw)+'», το διόρθωσα)</span>' : "")]);
  if(P.hit) rows.push(["Εργοστάσιο", (PLAT[P.hit.o]?PLAT[P.hit.o].name:P.hit.o)]);
  if(P.ref) rows.push(["Ψυκτικό", P.ref+(P.chg?" · "+P.chg+" kg (έλεγξέ το)":"")]);
  if(P.date) rows.push(["Κατασκευή", P.date]);
  if(P.ser) rows.push(["Σειριακός", P.ser]);
  var h = '<div class="plres">'+rows.map(function(r){ return '<div><span class="small">'+esc(r[0])+'</span><b>'+(r[0]==="Μοντέλο"?r[1]:esc(r[1]))+'</b></div>'; }).join("")+'</div>';
  if(P.hit) h += '<div class="small">'+esc(P.hit.w)+'</div>';
  var bn = P.hit ? P.hit.b : (P.brands[0]||"");
  if(bn) h += '<button class="mini prim plgo" data-qb="'+esc(bn)+'" data-qm="'+esc(P.model||"")+'" data-qo="'+esc(P.hit?P.hit.o:"")+'" data-qr="'+esc(P.ref||"")+'" data-qc="'+esc(P.chg||"")+'">✅ Σωστά – συνέχεια με '+esc(bn)+'</button>';
  h += '<button class="mini plhist" data-plhist="1" data-pb="'+esc(bn)+'" data-pm="'+esc(P.model||"")+'" data-po="'+esc(P.hit?P.hit.o:"")+'" data-pr="'+esc(P.ref||"")+'" data-pc2="'+esc(P.chg||"")+'" data-ps="'+esc(P.ser||"")+'">📒 Νέα επίσκεψη πελάτη με αυτά (και F‑gas)</button>';
  h += P.hit ? '<details class="small"><summary>Λάθος μοντέλο; Διόρθωσέ το</summary>'+plateManual(P.model)+'</details>' : plateManual(P.model);
  h += '<div class="scbtns" style="margin-top:10px"><button class="mini" id="scagain">🔁 Νέα φωτογραφία</button><button class="mini" data-repser="'+esc(P.ser||P.model||"")+'">📷 Δεν βγήκε σωστό – στείλε την ταμπέλα</button></div>';
  h += '<details class="small" style="margin-top:8px"><summary>Τι διάβασε ο αναγνώστης</summary><pre style="white-space:pre-wrap;font-size:12px">'+esc(String(raw).slice(0,1500))+'</pre></details>';
  bx.innerHTML = h;
  var mi = document.getElementById("scmodel"); if(mi && P.model && !P.hit) mi.dispatchEvent(new Event("input", {bubbles:true}));
}
document.addEventListener("change", function(e){ if(e.target && e.target.id==="scplate") platePhoto(e.target.files && e.target.files[0]); });

// Φωτογραφία ταμπέλας κατευθείαν από τη σελίδα (βήμα «Μάρκα» ή «Μοντέλο»)
document.addEventListener("change", function(e){
  if(!e.target || !e.target.classList || !e.target.classList.contains("plin")) return;
  var f = e.target.files && e.target.files[0]; e.target.value = ""; if(!f) return;
  scanOpen("quick", true); platePhoto(f);
});

document.addEventListener("click", function(e){
  var b = e.target.closest("[data-plhist]"); if(!b) return; e.stopPropagation();
  var g = function(k){ return b.getAttribute(k)||""; };
  scanStop(); var so = document.getElementById("scanov"); if(so){ so.style.display = "none"; so.innerHTML = ""; } document.body.style.overflow = "";
  if(g("data-pb")){ S.brand = g("data-pb"); S.bedit = false; }
  if(g("data-po") && PLAT[g("data-po")]) S.oem = g("data-po");
  if(g("data-pm")) S.model = g("data-pm");
  S.fw = S.fw || {}; if(g("data-ps")) S.fw.ser = g("data-ps");
  S.plate = {ref:g("data-pr"), chg:g("data-pc2")};
  renderAll(); persist();
  histOpen("form");
}, true);
// Προετοιμασία του αναγνώστη κειμένου από πριν (μία φορά, όσο υπάρχει internet), ώστε η φωτογραφία ταμπέλας να δουλεύει και σε σημεία χωρίς σήμα
function ocrWarm(){
  try{
    if(LS.get("vl_ocrready", false) || !navigator.onLine) return;
    var c = navigator.connection; if(c && (c.saveData || /2g/.test(c.effectiveType||""))) return;
    ocrLoad().then(function(){ if(!Tesseract.createWorker) return; return Tesseract.createWorker("eng", 1, ocrOpt()).then(function(w){ LS.set("vl_ocrready", Date.now()); try{ w.terminate(); }catch(x){} }); }).catch(function(){});
  }catch(x){}
}
window.addEventListener("load", function(){ setTimeout(function(){ if(window.requestIdleCallback) requestIdleCallback(ocrWarm, {timeout:20000}); else ocrWarm(); }, 15000); });
