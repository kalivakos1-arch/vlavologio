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
  var BAD = /IMPORT|MANUFACTUR|ADDRESS|DISTRIBUT|TRADING|S\.P\.A|GMBH|\bLTD\b|CO\.?,?\s*LTD|\bPARK\b|\bROAD\b|\bVIA\b|CHINA|ITALY/, after = 0;
  var flat = " "+lines.filter(function(l){ var bad = BAD.test(l); if(/IMPORT|MANUFACTUR|ADDRESS/.test(l)) after = 3; else if(after > 0) after--; return (!bad && !(after > 0 && !/^[^A-Z]*[A-Z]+[^A-Z]*$/.test(l))) || (!bad && /^[^A-Z]*[A-Z]+[^A-Z]*$/.test(l)); }).join(" ").replace(/[^A-Z0-9]+/g," ")+" ";
  var flatAll = " "+T.replace(/[^A-Z0-9]+/g," ")+" ";
  BRANDS.forEach(function(b){ if(b.n==="Άλλη μάρκα…") return; var keys = [b.n].concat((typeof ALIAS!=="undefined" && ALIAS[b.n]) ? ALIAS[b.n].filter(function(a){ return /^[a-z0-9 ]+$/i.test(a); }) : []);
    keys.forEach(function(k){ var K = " "+String(k).toUpperCase().replace(/[^A-Z0-9]+/g," ").trim()+" "; var ix = K.length>4 ? flat.indexOf(K) : -1; if(ix<0 && K.length>6) ix = flat.indexOf(K.replace(/ $/,"")); if(ix>=0 && R.brands.indexOf(b.n)<0){ R.brands.push(b.n); R.bpos = R.bpos||{}; R.bpos[b.n] = ix; } }); });
  if(!R.brands.length) BRANDS.forEach(function(b){ var K = " "+String(b.n).toUpperCase().replace(/[^A-Z0-9]+/g," ").trim()+" "; if(K.length>4 && flatAll.indexOf(K)>=0 && b.n!=="Άλλη μάρκα…") R.brands.push(b.n); });
  if(R.bpos) R.brands.sort(function(a,b){ return R.bpos[a]-R.bpos[b]; });
  // υποψήφια μοντέλα: πρώτα ό,τι γράφει δίπλα/κάτω από «MODEL», μετά κάθε «κωδικός» με γράμματα+αριθμούς
  var cands = [];
  lines.forEach(function(l, i){
    var m = l.match(/MOD[EF]L\b[^A-Z0-9]*(?:NO\.?|NAME)?[^A-Z0-9]*([A-Z0-9][A-Z0-9\-\/\.]{3,})/);
    if(m) cands.push(m[1]); else if(/^MOD[EF]L\b/.test(l) && lines[i+1]){ var n = lines[i+1].match(/([A-Z0-9][A-Z0-9\-\/\.]{3,})/); if(n) cands.push(n[1]); }
  });
  (T.match(/\b[A-Z]{1,6}[-\/]?[A-Z0-9]{2,}[A-Z0-9\-\/]*\b/g)||[]).forEach(function(t){ if(/\d/.test(t) && !/^(R32|R410A|R22|R290|IPX\d|EN\d+|MPA|KWH|BTU|PRC|LOT\d+|CE)$/.test(t) && cands.indexOf(t)<0) cands.push(t); });
  cands = cands.map(function(c){ return c.replace(/[\.\-\/]+$/,""); });
  R.modelRaw = cands[0]||"";
  var bObjs = R.brands.length ? R.brands.map(function(n){ return BRANDS.filter(function(b){ return b.n===n; })[0]; }).filter(Boolean) : BRANDS;
  outer: for(var ci=0; ci<cands.length && ci<12; ci++){
    var vs = ocrVariants(cands[ci].replace(/\s/g,""));
    for(var vi=0; vi<vs.length; vi++){
      for(var bi=0; bi<bObjs.length; bi++){ var h = detectOem(bObjs[bi], vs[vi]); if(h && (h.b || bObjs[bi].own===h.o || !bObjs[bi].own)){ R.model = vs[vi]; R.modelRaw = cands[ci]; R.hit = {b:bObjs[bi].n, o:h.o, w:h.w, spec:!!(h.b && h.b.length <= 2)}; break outer; } }
    }
  }
  if(!R.model) R.model = R.modelRaw;
  var rf = T.match(/\bR[\s\-]?(32|410\s?A|22|290|454\s?B|407\s?C|134\s?A|1234YF|513A)\b/); if(rf) R.ref = "R"+rf[1].replace(/\s/g,"");
  // φορτίο ψυκτικού: ΜΟΝΟ από γραμμή που μιλά για ψυκτικό/φορτίο (ποτέ από «βάρος/weight»)
  lines.some(function(l, i){ if(/WEIGHT|WEIGTH|NET\s*W|GROSS/.test(l)) return false;
    if(!/CHARGE|REFRIGERANT|\bR[\s\-]?(?:32|410\s?A|22|290|454\s?B|407\s?C|134\s?A)\b/.test(l)) return false;
    var src = l + (/[0-9]\s*K?G/.test(l) ? "" : " " + (lines[i+1]||""));
    var m = src.match(/(?:^|[^0-9.,])([0-9]{1,2}[\.,][0-9]{1,3})\s*K\s?G/); if(m){ R.chg = m[1].replace(",", "."); return true; }
    var m0 = src.match(/(?:^|[^0-9])0([0-9]{2,3})\s*K\s?G/); if(m0){ R.chg = "0."+m0[1]; return true; }
    return false; });
  var dt = T.match(/MANUFACTUR\w*\s*DAT\w*[^0-9]{0,6}([0-9]{4}[\.\/\-][0-9]{1,2})/) || T.match(/(?:DATE|PROD)\w*[^0-9]{0,6}((?:19|20)[0-9]{2}[\.\/\-][0-9]{1,2})/); if(dt) R.date = dt[1];
  var sn = T.match(/\bS[EF]\w{0,3}[A1L]L?[ \t]*(?:NUMB\w{0,3}|N[O0]\.?)[ \t]*[:;.,]?[ \t]*([A-Z0-9]{8,})/); if(sn) R.ser = sn[1];
  // αλλιώς: η γραμμή κάτω από το barcode (μόνο γράμματα/αριθμοί σε ομάδες)
  if(!R.ser){ var cs = [];
    lines.forEach(function(l){ var m = l.match(/^[^A-Z0-9]*((?:[A-Z0-9]{3,}[ ]?){2,6})[^A-Z0-9]*$/); if(!m) return; var v = m[1].replace(/ /g,"");
      if(v.length<12 || v.length>30 || (v.match(/\d/g)||[]).length<5 || (v.match(/[A-Z]/g)||[]).length<2 || (R.modelRaw && v.indexOf(R.modelRaw.replace(/[^A-Z0-9]/g,""))>=0)) return; cs.push(v); });
    if(cs.length){ var L = cs[0].length, same = cs.filter(function(v){ return v.length===L; });
      // ψήφος ανά χαρακτήρα ανάμεσα στις αναγνώσεις· σε ισοπαλία προτιμάμε ψηφίο (B/8, O/0, I/1, S/5)
      R.ser = cs[0].split("").map(function(ch, i){ var c = {}; same.forEach(function(v){ c[v[i]] = (c[v[i]]||0) + 1; }); return Object.keys(c).sort(function(x,y){ return (c[y]-c[x]) || (/\d/.test(y)-/\d/.test(x)); })[0]; }).join(""); } }
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
// ---- πολλαπλά περάσματα: 1) εντοπισμός ταμπέλας 2) ανάγνωση μόνο της ταμπέλας σε μεγέθυνση 3) η γραμμή «Model» σε μεγάλη μεγέθυνση ----
function ocrWords(d){ if(!d) return []; if(d.words && d.words.length) return d.words; var w = []; (d.blocks||[]).forEach(function(b){ (b.paragraphs||[]).forEach(function(p){ (p.lines||[]).forEach(function(l){ (l.words||[]).forEach(function(x){ w.push(x); }); }); }); }); return w; }
function ocrCrop(img, sx, sy, sw, sh, tw, maxUp){
  sw = Math.max(8, sw); sh = Math.max(8, sh); var k = Math.min(maxUp||3, tw/sw), W = Math.round(sw*k), H = Math.round(sh*k);
  if(W*H > 9e6){ var f = Math.sqrt(9e6/(W*H)); W = Math.round(W*f); H = Math.round(H*f); }
  var c = document.createElement("canvas"); c.width = W; c.height = H; var x = c.getContext("2d", {willReadFrequently:true});
  x.filter = "grayscale(1)"; x.drawImage(img, sx, sy, sw, sh, 0, 0, W, H); x.filter = "none"; c._k = W/sw; return c;
}
function ocrLines(d){ if(d && d.lines && d.lines.length) return d.lines; var o = []; (d&&d.blocks||[]).forEach(function(b){ (b.paragraphs||[]).forEach(function(p){ (p.lines||[]).forEach(function(l){ o.push(l); }); }); }); return o; }
function ocrRot(img, deg){
  var W = img.naturalWidth || img.width, H = img.naturalHeight || img.height, f = Math.min(1, 3200/Math.max(W,H)), w = Math.round(W*f), h = Math.round(H*f);
  var c = document.createElement("canvas"), sw = deg % 180 !== 0; c.width = sw ? h : w; c.height = sw ? w : h; var x = c.getContext("2d");
  x.translate(c.width/2, c.height/2); x.rotate(deg*Math.PI/180); x.drawImage(img, -w/2, -h/2, w, h); return c;
}
// κλίση της φωτογραφίας από το προφίλ γραμμών κειμένου (−15°…15°)
function ocrSkew(img){
  var W0 = img.naturalWidth || img.width, H0 = img.naturalHeight || img.height, f = 700/Math.max(W0,H0), W = Math.round(W0*f), H = Math.round(H0*f);
  var c = document.createElement("canvas"); c.width = W; c.height = H; var x = c.getContext("2d", {willReadFrequently:true}); x.drawImage(img, 0, 0, W, H);
  var d = x.getImageData(0,0,W,H).data, g = new Float32Array(W*H), pts = [];
  for(var i=0;i<W*H;i++) g[i] = d[i*4]*.3+d[i*4+1]*.59+d[i*4+2]*.11;
  for(var yy=2; yy<H-2; yy++) for(var xx=2; xx<W-2; xx++){ var i2 = yy*W+xx, m = (g[i2-2]+g[i2+2]+g[i2-2*W]+g[i2+2*W])/4; if(m - g[i2] > 28) pts.push(xx, yy); }
  if(pts.length < 400) return 0; var best = 0, bv = -1, v0 = 0, n = pts.length/2;
  for(var a = -15; a <= 15; a += 0.5){ var r = a*Math.PI/180, sn = Math.sin(r), cs = Math.cos(r), hist = new Float32Array(H*2+W);
    for(var j=0;j<pts.length;j+=2){ var y2 = Math.round(-pts[j]*sn + pts[j+1]*cs) + W; hist[y2]++; }
    var s2 = 0; for(var k=0;k<hist.length;k++) s2 += hist[k]*hist[k]; if(a === 0) v0 = s2; if(s2 > bv){ bv = s2; best = a; } }
  // μόνο αν η κλίση είναι ξεκάθαρη (αλλιώς η φωτογραφία είναι ίσια ή πλάγια 90°)
  return (bv > v0*1.15 && Math.abs(best) < 15) ? best : 0;
}
function ocrRotA(img, deg){
  var W = img.naturalWidth || img.width, H = img.naturalHeight || img.height, f = Math.min(1, 3200/Math.max(W,H)), w = Math.round(W*f), h = Math.round(H*f), r = Math.abs(deg*Math.PI/180);
  var c = document.createElement("canvas"); c.width = Math.round(w*Math.cos(r)+h*Math.sin(r)); c.height = Math.round(w*Math.sin(r)+h*Math.cos(r)); var x = c.getContext("2d");
  var t = document.createElement("canvas"); t.width = t.height = 1; var tx = t.getContext("2d", {willReadFrequently:true}); tx.drawImage(img, 0, 0, 1, 1); var px = tx.getImageData(0,0,1,1).data;
  x.fillStyle = "rgb("+px[0]+","+px[1]+","+px[2]+")"; x.fillRect(0,0,c.width,c.height); /* γωνίες στο μέσο χρώμα: το λευκό μπερδεύει τον αναγνώστη */ x.translate(c.width/2, c.height/2); x.rotate(deg*Math.PI/180); x.drawImage(img, -w/2, -h/2, w, h);
  // κρατάμε μόνο το εσωτερικό ορθογώνιο (χωρίς τις γεμισμένες γωνίες, που χαλάνε την ανάγνωση)
  var ix = Math.ceil(h*Math.sin(r)*Math.cos(r)) + 2, iy = Math.ceil(w*Math.sin(r)*Math.cos(r)) + 2, o = document.createElement("canvas");
  ix = Math.min(ix, c.width/3); iy = Math.min(iy, c.height/3); o.width = Math.round(c.width-2*ix); o.height = Math.round(c.height-2*iy); o.getContext("2d").drawImage(c, ix, iy, o.width, o.height, 0, 0, o.width, o.height); return o;
}
function ocrPct(a, q){ a = a.slice().sort(function(x,y){ return x-y; }); return a[Math.max(0, Math.min(a.length-1, Math.round((a.length-1)*q)))]; }
function ocrLabelBox(words, W, H){
  // η ταμπέλα = το πυκνό σύννεφο λέξεων (διάμεσος ± 3×MAD), μετά άνοιγμα για στήλη τιμών δεξιά και μάρκα πάνω
  var g = words.filter(function(w){ return w.confidence > 60 && (String(w.text).match(/[A-Za-z0-9]/g)||[]).length >= 3 && w.bbox; });
  if(g.length < 5) return null;
  var cx = g.map(function(w){ return (w.bbox.x0+w.bbox.x1)/2; }), cy = g.map(function(w){ return (w.bbox.y0+w.bbox.y1)/2; });
  var mx = ocrPct(cx,.5), my = ocrPct(cy,.5), dx = ocrPct(cx.map(function(v){ return Math.abs(v-mx); }),.5)||50, dy = ocrPct(cy.map(function(v){ return Math.abs(v-my); }),.5)||50;
  var k = g.filter(function(w,i){ return Math.abs(cx[i]-mx) <= 3*dx && Math.abs(cy[i]-my) <= 3*dy; }); if(k.length < 4) return null;
  var x0 = Math.min.apply(0, k.map(function(w){ return w.bbox.x0; })), x1 = Math.max.apply(0, k.map(function(w){ return w.bbox.x1; })),
      y0 = Math.min.apply(0, k.map(function(w){ return w.bbox.y0; })), y1 = Math.max.apply(0, k.map(function(w){ return w.bbox.y1; }));
  var w = x1-x0, h = y1-y0; x0 = Math.max(0, x0-.15*w); x1 = Math.min(W, x1+.7*w); y0 = Math.max(0, y0-.25*h); y1 = Math.min(H, y1+.15*h);
  return [x0, y0, x1-x0, y1-y0];
}
function ocrBarcodes(img){
  var out = []; if(!window.ZXing) return out;
  var Z = window.ZXing, sc = Math.min(1, 2400/Math.max(img.width, img.height)), W = Math.round(img.width*sc), H = Math.round(img.height*sc);
  var c = document.createElement("canvas"); c.width = W; c.height = H; var x = c.getContext("2d", {willReadFrequently:true}); x.drawImage(img, 0, 0, W, H);
  var g = BC.grayOf(x.getImageData(0,0,W,H)), seen = {};
  var add = function(t, f){ if(t && !seen[t]){ seen[t] = 1; out.push({t:t, f:f}); } };
  try{ var mr = new Z.GenericMultipleBarcodeReader(zxReader()), src = new Z.RGBLuminanceSource(new Uint8ClampedArray(g.buffer), W, H);
    (mr.decodeMultiple(new Z.BinaryBitmap(new Z.HybridBinarizer(src))) || []).forEach(function(r){ add(r.getText(), String(Z.BarcodeFormat[r.getBarcodeFormat()]||"").toLowerCase()); });
  }catch(e){ try{ zxReader().reset(); }catch(x){} }
  if(!out.length){ var z = zxGray(g, W, H) || zxGrayRot(g, W, H); if(z) add(z.t, z.f); }
  if(!out.length){ try{ var r = BC.decodeGray(g, W, H, {rows:70, y0:0.02, y1:0.98, cols:true}); if(r) add(r.t, "code_128"); }catch(e){} }
  return out;
}
function ocrSerOf(codes){
  var oneD = codes.filter(function(c){ return !/qr|matrix|aztec|pdf/.test(c.f) && /^[A-Z0-9\-\/]{8,}$/i.test(c.t); });
  return oneD.length ? oneD.sort(function(a,b){ return b.t.length-a.t.length; })[0].t : "";
}
// Έλεγχος αξιοπιστίας: ένα πεδίο θεωρείται σίγουρο μόνο αν το επιβεβαιώνουν δύο ανεξάρτητες αναγνώσεις (ή barcode / βάση μοντέλων) και είναι λογικό
function plateVerify(P, texts, serFromCode){
  var Ps = texts.filter(function(t){ return String(t||"").trim().length > 3; }).map(plateParse), n = function(v){ return String(v||"").replace(/[^A-Z0-9.]/gi,"").toUpperCase(); };
  var agree = function(f, v){ return v ? Ps.filter(function(p){ return n(p[f]) === n(v); }).length : 0; };
  // κάθε πεδίο παίρνει την τιμή που βγάζουν οι περισσότερες αναγνώσεις (ο σειριακός από barcode έχει πάντα προτεραιότητα)
  ["ref","chg","date"].concat(serFromCode ? [] : ["ser"]).forEach(function(f){ var best = P[f], bc = agree(f, P[f]);
    Ps.forEach(function(p){ var c = agree(f, p[f]); if(p[f] && c > bc && c >= 2){ best = p[f]; bc = c; } }); P[f] = best; });
  var ok = {}, y = new Date().getFullYear();
  var topB = Ps.filter(function(p){ return P.hit && p.brands[0] === P.hit.b; }).length;
  ok.model = !!P.hit && agree("model", P.model) >= 2;
  ok.brand = !!(P.hit && P.brands[0] === P.hit.b && (topB >= 2 || (P.hit.spec && ok.model)));
  ok.ref = !!P.ref && agree("ref", P.ref) >= 2;
  var c = parseFloat(P.chg); ok.chg = !!P.chg && c >= 0.1 && c <= 40 && agree("chg", P.chg) >= 2;
  var dm = String(P.date||"").match(/^((?:19|20)\d\d)\D(\d{1,2})$/); ok.date = !!dm && +dm[1] >= 1990 && +dm[1] <= y && +dm[2] >= 1 && +dm[2] <= 12 && agree("date", P.date) >= 2;
  if(serFromCode) ok.ser = true; else if(P.ser){ var sv = serVote(P.ser, texts); P.ser = sv.ser; ok.ser = sv.ok; } else ok.ser = false;
  return ok;
}
// Σειριακός χωρίς barcode: ευθυγραμμίζουμε όλες τις αναγνώσεις (και τις μισές) πάνω στην υποψήφια τιμή και ψηφίζουμε χαρακτήρα‑χαρακτήρα.
// Το O μετράει ως 0 (οι σειριακοί δεν χρησιμοποιούν O). Σίγουρο μόνο αν ΚΑΘΕ χαρακτήρας έχει ≥2 ψήφους και καθαρή πλειοψηφία.
function serVote(base, texts){
  var N = function(x){ return String(x||"").toUpperCase().replace(/[^A-Z0-9]/g,"").replace(/O/g,"0"); }, b = N(base), L = b.length, votes = b.split("").map(function(){ return {}; }), ext = [];
  if(L < 8) return {ser:b, ok:false};
  texts.forEach(function(t){ String(t||"").split(/\n+/).forEach(function(line){
    var l = N(line); if(l.length < 8) return; var best = null;
    for(var o = -(l.length-8); o <= L-8; o++){ var ov = 0, mm = 0; for(var i = Math.max(0,o); i < L && i-o < l.length; i++){ ov++; if(l[i-o] !== b[i]) mm++; }
      if(ov >= 8 && mm <= Math.max(1, Math.floor(ov*.15)) && (!best || ov-3*mm > best.sc)) best = {o:o, sc:ov-3*mm}; }
    if(!best) return; for(var i = Math.max(0,best.o); i < L && i-best.o < l.length; i++){ var ch = l[i-best.o]; votes[i][ch] = (votes[i][ch]||0) + 1; }
    // χαρακτήρες που συνεχίζουν ΜΕΤΑ το τέλος της υποψήφιας τιμής (ίσως κόπηκε): μετράνε κι αυτοί
    var raw = String(line).toUpperCase(), tail = l.slice(L-best.o); if(tail && !/^(MANUF|MADE|DATE|PROD)/.test(tail)) tail.slice(0,8).split("").forEach(function(ch, j){ ext[j] = ext[j] || {}; ext[j][ch] = (ext[j][ch]||0) + 1; });
  }); });
  var ok = true, out = votes.map(function(v, i){ var ks = Object.keys(v).sort(function(x,y){ return (v[y]-v[x]) || (/\d/.test(y)-/\d/.test(x)); });
    if(!ks.length){ ok = false; return b[i]; } if(v[ks[0]] < 2 || (ks[1] && v[ks[1]] >= v[ks[0]])) ok = false; return ks[0]; }).join("");
  // επέκταση: αν δύο αναγνώσεις συμφωνούν ότι συνεχίζει, την προσθέτουμε· αν μόνο μία, δεν είμαστε σίγουροι
  for(var j=0; j<ext.length; j++){ var v = ext[j]||{}, ks = Object.keys(v).sort(function(x,y){ return v[y]-v[x]; }); if(!ks.length) break;
    if(v[ks[0]] >= 2 && !(ks[1] && v[ks[1]] >= v[ks[0]])) out += ks[0]; else { ok = false; break; } }
  return {ser:out, ok:ok};
}
function platePhoto(file){
  if(!file) return; scanStop();
  var vb = document.querySelector("#scanov .scbox"); if(vb) vb.style.display = "none";
  var url = URL.createObjectURL(file), img = new Image();
  plProgStart(url); scanMsg("🏷️ Βρίσκω την ταμπέλα στη φωτογραφία…");
  img.onload = function(){
    var IW = img.naturalWidth || img.width, IH = img.naturalHeight || img.height, codes = [], worker = null, txt = [];
    var done = function(){ try{ if(worker) worker.terminate(); }catch(x){} URL.revokeObjectURL(url); var text = txt.join("\n"), P = plateParse(text), bs = ocrSerOf(codes); P.ser = bs || P.ser || ""; P.codes = codes; P.ok = plateVerify(P, txt, !!bs); plateShow(P, text); };
    zxLoad().catch(function(){}).then(function(){ try{ codes = ocrBarcodes(img); }catch(x){} }).then(ocrLoad).then(function(){
      return Tesseract.createWorker("eng", 1, ocrOpt({}));
    }).then(function(w){
      worker = w;
      try{ var sk = ocrSkew(img); if(Math.abs(sk) >= 1.5){ img = ocrRotA(img, -sk); IW = img.width; IH = img.height; } }catch(x){}
      // 1) γρήγορο πέρασμα: πού είναι το κείμενο;
      var c1 = ocrCrop(img, 0, 0, IW, IH, Math.round(2000*IW/Math.max(IW,IH)), 2);
      var good = function(r){ return ocrWords(r.data).filter(function(x){ return x.confidence > 60 && (String(x.text).match(/[A-Za-z0-9]/g)||[]).length >= 3; }).length; };
      return w.setParameters({tessedit_pageseg_mode:"11"}).then(function(){ return w.recognize(c1, {}, {text:true, blocks:true}); }).then(function(r1){
        // φωτογραφία στραβά/πλάγια; δοκιμάζουμε περιστροφές και κρατάμε αυτή με το περισσότερο καθαρό κείμενο
        var g1 = good(r1); if(g1 >= 12) return r1;
        var best = {r:r1, g:g1, c:c1, im:img}, chain = Promise.resolve();
        scanMsg("🏷️ Ελέγχω αν η φωτογραφία είναι γυρισμένη…");
        [90, 270, 180].forEach(function(d){ chain = chain.then(function(){ if(best.g >= 12) return;
          var rc = ocrRot(img, d), cc = ocrCrop(rc, 0, 0, rc.width, rc.height, Math.round(2000*rc.width/Math.max(rc.width,rc.height)), 2);
          return w.recognize(cc, {}, {text:true, blocks:true}).then(function(r){ var g = good(r); if(g > best.g) best = {r:r, g:g, c:cc, im:rc}; }); }); });
        return chain.then(function(){ img = best.im; IW = img.width; IH = img.height; c1 = best.c; if(best.g >= 12) return best.r;
        // μικρή ταμπέλα μέσα σε μεγάλη φωτογραφία: διαβάζουμε 4 επικαλυπτόμενα κομμάτια από πιο κοντά
        scanMsg("🏷️ Ψάχνω την ταμπέλα από πιο κοντά…");
        var tch = Promise.resolve(); [[0,0],[.4,0],[0,.4],[.4,.4]].forEach(function(t){ tch = tch.then(function(){ if(best.g >= 40) return;
          var tx = t[0]*IW, ty = t[1]*IH, tw = .6*IW, th = .6*IH, ct = ocrCrop(img, tx, ty, tw, th, Math.round(2000*tw/Math.max(tw,th)), 3), kt = ct._k;
          return w.recognize(ct, {}, {text:true, blocks:true}).then(function(r){ var g = good(r); if(g > best.g && g >= 12){
            var ws = ocrWords(r.data).map(function(x){ var b = x.bbox; return {text:x.text, confidence:x.confidence, bbox:{x0:(tx+b.x0/kt)*c1._k, x1:(tx+b.x1/kt)*c1._k, y0:(ty+b.y0/kt)*c1._k, y1:(ty+b.y1/kt)*c1._k}}; });
            best = {r:{data:{text:r.data.text, words:ws}}, g:g, c:c1, im:img}; } }); }); });
          return tch.then(function(){ return best.r; });
        });
      }).then(function(r1){
        txt.push(r1.data.text||""); scanMsg("🏷️ Διαβάζω την ταμπέλα από κοντά…");
        var bx = ocrLabelBox(ocrWords(r1.data), c1.width, c1.height), k = c1._k;
        var sx = bx ? bx[0]/k : 0, sy = bx ? bx[1]/k : 0, sw = bx ? bx[2]/k : IW, sh = bx ? bx[3]/k : IH;
        // 2) μόνο η ταμπέλα, μεγεθυμένη
        var c2 = ocrCrop(img, sx, sy, sw, sh, 1600, 4);
        return w.setParameters({tessedit_pageseg_mode:"6"}).then(function(){ return w.recognize(c2, {}, {text:true, blocks:true}); }).then(function(r2){
          txt.unshift(r2.data.text||"");
          // 2β) δεύτερη ανεξάρτητη ανάγνωση της ταμπέλας (άλλη κλίμακα/τρόπος) για διασταύρωση
          scanMsg("🏷️ Διασταυρώνω τα στοιχεία…");
          return w.setParameters({tessedit_pageseg_mode:"4"}).then(function(){ return w.recognize(ocrCrop(img, sx, sy, sw, sh, 2400, 5)); }).then(function(rb){ txt.splice(1, 0, rb.data.text||""); return r2; });
        }).then(function(r2){
          // 3) η γραμμή του μοντέλου
          var ws = ocrWords(r2.data), mw = ws.filter(function(x){ return /^MOD[EFI]L/i.test(x.text||""); })[0];
          var serStep = function(){
            // 4) σειριακός: αν δεν βγήκε από barcode/«Serial Number», ξαναδιαβάζουμε από κοντά τη γραμμή κάτω από το barcode
            var P0 = plateParse(txt.join("\n")); if(ocrSerOf(codes) || !P0.ser || /SERIAL[ \t]*(NUMBER|NO)[ \t]*[:;.]?[ \t]*[A-Z0-9]{8}/i.test(txt.join("\n"))) return;
            var ln = ocrLines(r2.data).filter(function(l){ return String(l.text||"").toUpperCase().replace(/[^A-Z0-9]/g,"").indexOf(P0.ser.slice(0,6))>=0; })[0]; if(!ln) return;
            var k2 = c2._k, hh = ln.bbox.y1-ln.bbox.y0, x0 = sx + Math.max(0, ln.bbox.x0 - hh)/k2, y0 = sy + (ln.bbox.y0 - hh*.4)/k2, ww = (ln.bbox.x1-ln.bbox.x0 + 2*hh)/k2, h3 = hh*1.8/k2;
            var c4 = ocrCrop(img, x0, y0, ww, h3, Math.min(2400, ww*64/(h3||1)), 5);
            return w.setParameters({tessedit_pageseg_mode:"7"}).then(function(){ return w.recognize(c4); }).then(function(r4){ var l = String(r4.data.text||"").trim(); if(l) txt.push(l); });
          };
          if(!mw || plateParse(txt.join("\n")).hit) return serStep();
          scanMsg("🏷️ Διαβάζω το μοντέλο…");
          var k2 = c2._k, hh = (mw.bbox.y1-mw.bbox.y0), y0 = sy + (mw.bbox.y0 - hh*.45)/k2, y1 = sy + (mw.bbox.y1 + hh*.45)/k2;
          var c3 = ocrCrop(img, sx + mw.bbox.x0/k2, y0, sw - mw.bbox.x0/k2, y1-y0, Math.min(2400, (sw - mw.bbox.x0/k2) * 64/((y1-y0)||1)), 4);
          return w.setParameters({tessedit_pageseg_mode:"7"}).then(function(){ return w.recognize(c3); }).then(function(r3){
            var l = String(r3.data.text||"").trim(); if(l) txt.unshift(/^MOD/i.test(l) ? l : "MODEL "+l);
          }).then(serStep);
        });
      });
    }).then(done).catch(function(e){ try{ console.error("plate", e && (e.stack||e)); }catch(x){}
      if(txt.length || codes.length) return done();
      try{ if(worker) worker.terminate(); }catch(x){}
      scanMsg(navigator.onLine ? "⚠️ Δεν μπόρεσα να διαβάσω κείμενο. Δοκίμασε ξανά με τη φωτογραφία πιο κοντά και ίσια." : "⚠️ Χρειάζεται internet την πρώτη φορά για να κατέβει ο αναγνώστης.");
    });
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
  var ok = P.ok || {}, rows = [], mark = function(k){ return ok[k] ? ' <span class="plok" title="Επιβεβαιωμένο από δύο αναγνώσεις">✓</span>' : ' <span class="plwarn">⚠ έλεγξέ το</span>'; };
  var inp = function(k, v, ph){ return '<input class="plin2'+(ok[k]?'':' plchk')+'" data-plf="'+k+'" value="'+esc(v||"")+'" placeholder="'+esc(ph)+'" autocomplete="off" autocapitalize="characters" spellcheck="false">'; };
  rows.push(["Μάρκα", esc(P.hit ? P.hit.b : (P.brands.join(", ") || "– δεν βρέθηκε –"))+(P.hit||P.brands.length ? mark("brand") : "")]);
  rows.push(["Μοντέλο", esc(P.model||"– δεν βρέθηκε –")+(P.modelRaw && P.model && P.modelRaw.replace(/\s/g,"")!==P.model ? '  <span class="small">(διάβασα «'+esc(P.modelRaw)+'», το διόρθωσα)</span>' : "")+(P.model ? (ok.model ? ' <span class="plok" title="Διαβάστηκε ίδιο δύο φορές και υπάρχει στη βάση μοντέλων">✓</span>' : (P.hit ? ' <span class="plwarn">⚠ διαβάστηκε μία φορά – έλεγξέ το</span>' : ' <span class="plwarn">⚠ δεν είναι στη βάση – έλεγξέ το</span>')) : "")]);
  if(P.hit) rows.push(["Εργοστάσιο", esc(PLAT[P.hit.o]?PLAT[P.hit.o].name:P.hit.o)]);
  rows.push(["Ψυκτικό"+mark("ref"), inp("ref", P.ref, "π.χ. R32")]);
  rows.push(["Φορτίο (kg)"+mark("chg"), inp("chg", P.chg, "π.χ. 0.85")]);
  rows.push(["Κατασκευή"+mark("date"), inp("date", P.date, "π.χ. 2025.03")]);
  rows.push(["Σειριακός"+mark("ser"), inp("ser", P.ser, "όπως στην ταμπέλα")]);
  var h = '<div class="plres">'+rows.map(function(r){ return '<div><span class="small">'+r[0]+'</span><b>'+r[1]+'</b></div>'; }).join("")+'</div>';
  var nbad = ["ref","chg","date","ser"].filter(function(k){ return !ok[k]; }).length + (P.model && !ok.model ? 1 : 0);
  if(nbad >= 3) h += '<div class="plnote">📸 Η φωτογραφία δεν ήταν αρκετά καθαρή. Για αποτέλεσμα με ✓ παντού: πλησίασε ώστε η ταμπέλα να γεμίζει την οθόνη, κράτα το κινητό ίσια και πάτα «🔁 Νέα φωτογραφία».</div>';
  else if(nbad) h += '<div class="plnote">⚠ Τα κίτρινα πεδία δεν τα επιβεβαίωσα με δεύτερη ανάγνωση. Κοίταξέ τα με την ταμπέλα και διόρθωσέ τα εδώ πριν συνεχίσεις.</div>';
  if(P.hit) h += '<div class="small">'+esc(P.hit.w)+'</div>';
  if(!P.model || !P.ref) h += '<div class="small" style="margin:6px 0">💡 Λείπουν στοιχεία; Πλησίασε ώστε η ταμπέλα να γεμίζει τη φωτογραφία, ίσια και χωρίς αντανάκλαση, και πάτα «🔁 Νέα φωτογραφία».</div>';
  var bn = P.hit ? P.hit.b : (P.brands[0]||"");
  if(bn) h += '<button class="mini prim plgo" data-qb="'+esc(bn)+'" data-qm="'+esc(P.model||"")+'" data-qo="'+esc(P.hit?P.hit.o:"")+'" data-qr="'+esc(P.ref||"")+'" data-qc="'+esc(P.chg||"")+'">'+(nbad?'✅ Τα έλεγξα – συνέχεια με ':'✅ Σωστά – συνέχεια με ')+esc(bn)+'</button>';
  h += '<button class="mini plhist" data-plhist="1" data-pb="'+esc(bn)+'" data-pm="'+esc(P.model||"")+'" data-po="'+esc(P.hit?P.hit.o:"")+'" data-pr="'+esc(P.ref||"")+'" data-pc2="'+esc(P.chg||"")+'" data-ps="'+esc(P.ser||"")+'" data-pd="'+esc(P.date||"")+'">📒 Νέα επίσκεψη πελάτη με αυτά (και F‑gas)</button>';
  h += P.hit ? '<details class="small"><summary>Λάθος μοντέλο; Διόρθωσέ το</summary>'+plateManual(P.model)+'</details>' : plateManual(P.model);
  h += '<div class="scbtns" style="margin-top:10px"><button class="mini" id="scagain">🔁 Νέα φωτογραφία</button><button class="mini" data-repser="'+esc(P.ser||P.model||"")+'">📷 Δεν βγήκε σωστό – στείλε την ταμπέλα</button></div>';
  h += '<details class="small" style="margin-top:8px"><summary>Τι διάβασε ο αναγνώστης</summary><pre style="white-space:pre-wrap;font-size:12px">'+esc(String(raw).slice(0,5000))+'</pre></details>';
  bx.innerHTML = h;
  var mi = document.getElementById("scmodel"); if(mi && P.model && !P.hit) mi.dispatchEvent(new Event("input", {bubbles:true}));
}
document.addEventListener("change", function(e){ if(e.target && e.target.id==="scplate") platePhoto(e.target.files && e.target.files[0]); });

document.addEventListener("input", function(e){
  var t = e.target; if(!t || !t.matches || !t.matches("#scres [data-plf]")) return;
  var v = t.value.trim().toUpperCase().replace(",", "."), k = t.getAttribute("data-plf"); t.classList.remove("plchk"); t.classList.add("pledit");
  if(k==="ser") try{ SCAN.last = v; }catch(x){}
  var map = {ref:["data-qr","data-pr"], chg:["data-qc","data-pc2"], ser:[null,"data-ps"], date:[null,"data-pd"]}[k] || [];
  document.querySelectorAll("#scres .plgo, #scres [data-plhist]").forEach(function(b){ map.forEach(function(a){ if(a && (b.hasAttribute(a) || a==="data-pd")) b.setAttribute(a, v); }); });
});
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
  S.plate = {ref:g("data-pr"), chg:g("data-pc2"), date:g("data-pd")};
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
