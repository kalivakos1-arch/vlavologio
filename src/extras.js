// ===================== Δελτίο εργασίας με τιμές =====================
function billHtml(e){
  var items = (e.items && e.items.length) ? e.items : [], vat = e.vat!=null && e.vat!=="" ? String(e.vat) : String(TECH().vat||"24");
  var row = function(it){ return '<div class="brow"><input class="bd" placeholder="Περιγραφή (π.χ. Αισθητήριο σωλήνα / Εργασία)" value="'+esc(it.d||"")+'"><input class="bq" inputmode="decimal" placeholder="Ποσ." value="'+esc(it.q||"")+'"><input class="bp" inputmode="decimal" placeholder="€/τεμ." value="'+esc(it.p||"")+'"><button class="mini bx" title="Αφαίρεση">✕</button></div>'; };
  return '<details class="hx"'+(items.length?' open':'')+' id="billbox"><summary>💶 Χρεώσεις (δελτίο εργασίας)</summary>'+
    '<div id="brows">'+(items.length?items:[{},{}]).map(row).join("")+'</div>'+
    '<div class="scbtns"><button class="mini" id="badd">➕ Γραμμή</button><button class="mini" id="badl">🛠 + Εργασία</button></div>'+
    '<label class="mrint">ΦΠΑ <select id="bvat">'+["24","13","6","0"].map(function(v){ return '<option'+(v===vat?' selected':'')+'>'+v+'</option>'; }).join("")+'</select> %</label>'+
    '<div id="btot" class="btot"></div><div class="small">Οι τιμές γράφονται χωρίς ΦΠΑ. Μπαίνουν στην αναφορά και στο PDF για τον πελάτη.</div></details>';
}
function billRead(){
  var items = []; document.querySelectorAll("#brows .brow").forEach(function(r){ var d = r.querySelector(".bd").value.trim(), q = r.querySelector(".bq").value.trim(), p = r.querySelector(".bp").value.trim(); if(d||p) items.push({d:d, q:q||"1", p:p}); });
  var v = document.getElementById("bvat"); return {items:items, vat: v ? v.value : "24"};
}
function billSum(h){ var net = 0; (h.items||[]).forEach(function(it){ net += (hnum(it.q)||1) * (hnum(it.p)||0); }); var v = hnum(h.vat); if(v==null) v = 24; return {net:net, vat:net*v/100, tot:net*(1+v/100), rate:v}; }
function eur(n){ return n.toLocaleString("el-GR",{minimumFractionDigits:2, maximumFractionDigits:2})+" €"; }
function billTot(){ var b = billRead(), s = billSum(b), el = document.getElementById("btot"); if(el) el.innerHTML = b.items.length ? 'Καθαρό <b>'+eur(s.net)+'</b> · ΦΠΑ '+s.rate+'% '+eur(s.vat)+' · <b>Σύνολο '+eur(s.tot)+'</b>' : ''; }
function billReport(h){
  if(!h.items || !h.items.length) return ""; var s = billSum(h);
  return '<table class="rp-t rp-b"><tr><th>Περιγραφή</th><th>Ποσ.</th><th>Τιμή</th><th>Σύνολο</th></tr>'+h.items.map(function(it){ var q = hnum(it.q)||1, p = hnum(it.p)||0; return '<tr><td>'+esc(it.d||"")+'</td><td>'+esc(String(it.q||1))+'</td><td>'+eur(p)+'</td><td>'+eur(q*p)+'</td></tr>'; }).join("")+
    '<tr><td colspan="3">Καθαρή αξία</td><td>'+eur(s.net)+'</td></tr><tr><td colspan="3">ΦΠΑ '+s.rate+'%</td><td>'+eur(s.vat)+'</td></tr><tr><th colspan="3">Σύνολο</th><th>'+eur(s.tot)+'</th></tr></table>';
}
function billText(h){ if(!h.items || !h.items.length) return ""; var s = billSum(h); return "Χρεώσεις:\n"+h.items.map(function(it){ var q = hnum(it.q)||1, p = hnum(it.p)||0; return "• "+(it.d||"-")+" × "+q+" = "+eur(q*p); }).join("\n")+"\nΣύνολο με ΦΠΑ "+s.rate+"%: "+eur(s.tot); }
document.addEventListener("click", function(e){
  var b = e.target.closest("#badd,#badl,.brow .bx"); if(!b) return; var box = document.getElementById("brows"); if(!box) return;
  if(b.classList.contains("bx")){ b.closest(".brow").remove(); billTot(); return; }
  var d = document.createElement("div"); d.innerHTML = billHtml({items:[{d:b.id==="badl"?"Εργασία τεχνικού":"", q:"1", p:b.id==="badl"?String(TECH().labour||""):""}]}); var r = d.querySelector(".brow"); box.appendChild(r); if(b.id==="badd") r.querySelector(".bd").focus(); billTot();
});
document.addEventListener("input", function(e){ if(e.target.closest && e.target.closest("#billbox")) billTot(); });
document.addEventListener("change", function(e){ if(e.target && e.target.id==="bvat") billTot(); });
document.addEventListener("toggle", function(e){ if(e.target && e.target.id==="billbox") billTot(); }, true);

// ===================== Φωτογραφίες επίσκεψης (IndexedDB) =====================
var PDB = null, PHC = {};
function pdb(){ return PDB || (PDB = new Promise(function(res, rej){ try{ var r = indexedDB.open("vlphotos", 1); r.onupgradeneeded = function(){ var st = r.result.createObjectStore("p", {keyPath:"id"}); st.createIndex("hid","hid"); }; r.onsuccess = function(){ res(r.result); }; r.onerror = function(){ rej(r.error); }; }catch(x){ rej(x); } })); }
function pAll(hid){ return pdb().then(function(db){ return new Promise(function(res){ var out = [], q = db.transaction("p").objectStore("p").index("hid").openCursor(IDBKeyRange.only(hid)); q.onsuccess = function(){ var c = q.result; if(c){ out.push(c.value); c.continue(); } else res(out); }; q.onerror = function(){ res([]); }; }); }).catch(function(){ return []; }); }
function pEvery(){ return pdb().then(function(db){ return new Promise(function(res){ var out = [], q = db.transaction("p").objectStore("p").openCursor(); q.onsuccess = function(){ var c = q.result; if(c){ out.push(c.value); c.continue(); } else res(out); }; q.onerror = function(){ res([]); }; }); }).catch(function(){ return []; }); }
function pPut(o){ return pdb().then(function(db){ return new Promise(function(res){ var t = db.transaction("p","readwrite"); t.objectStore("p").put(o); t.oncomplete = res; t.onerror = res; }); }); }
function pDel(id){ return pdb().then(function(db){ return new Promise(function(res){ var t = db.transaction("p","readwrite"); t.objectStore("p").delete(id); t.oncomplete = res; t.onerror = res; }); }); }
function photoHtml(){ setTimeout(photoRender, 30); return '<details class="hx" id="phbox"><summary>📷 Φωτογραφίες (πριν / μετά / ταμπέλα)</summary><div id="phl" class="phl"></div><label class="mini scphoto">📷 Πρόσθεσε φωτογραφία<input type="file" accept="image/*" capture="environment" id="phin" hidden multiple></label><div class="small">Μένουν μόνο σε αυτό το κινητό και μπαίνουν στο PDF της αναφοράς.</div></details>'; }
function photoRender(){ var hid = S.formPid, el = document.getElementById("phl"); if(!el || !hid) return;
  pAll(hid).then(function(L){ PHC[hid] = L; el.innerHTML = L.map(function(p){ return '<div class="ph"><img src="'+p.data+'" alt=""><button class="mini" data-phdel="'+esc(p.id)+'">✕</button></div>'; }).join(""); var bx = document.getElementById("phbox"); if(bx && L.length) bx.open = true; var sm = bx && bx.querySelector("summary"); if(sm) sm.textContent = "📷 Φωτογραφίες (πριν / μετά / ταμπέλα)"+(L.length?" · "+L.length:""); }); }
function imgShrink(file, max){ return new Promise(function(res){ var u = URL.createObjectURL(file), im = new Image(); im.onload = function(){ var s = Math.min(1, (max||1280)/Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width*s); c.height = Math.round(im.height*s); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); res(c.toDataURL("image/jpeg", 0.72)); }; im.onerror = function(){ res(null); }; im.src = u; }); }
document.addEventListener("change", function(e){
  if(!e.target || e.target.id!=="phin") return; var fs = Array.prototype.slice.call(e.target.files||[]), hid = S.formPid; e.target.value = ""; if(!hid) return;
  fs.reduce(function(pr, f){ return pr.then(function(){ return imgShrink(f, 1280).then(function(d){ if(d) return pPut({id:"p"+Date.now().toString(36)+Math.random().toString(36).slice(2,6), hid:hid, ts:Date.now(), data:d}); }); }); }, Promise.resolve()).then(photoRender);
});
document.addEventListener("click", function(e){ var b = e.target.closest("[data-phdel]"); if(!b) return; if(b.getAttribute("data-c")!=="1"){ b.setAttribute("data-c","1"); b.textContent = "Σβήσιμο;"; return; } pDel(b.getAttribute("data-phdel")).then(photoRender); });
function photoReport(){ var L = PHC[S.formPid]||[]; if(!L.length) return ""; return '<div class="rp-ph">'+L.map(function(p){ return '<img src="'+p.data+'" alt="">'; }).join("")+'</div>'; }

// ===================== QR αυτοκόλλητο μονάδας =====================
var APP_BASE = "https://vlavologio.github.io/";
function qrUrl(h){
  var k = (serClean(h.ser).length>=6 ? fgKey(h) : "H:"+(h.id||"")), t = TECH(), q = ["u="+encodeURIComponent(k)];
  [["b",h.brand],["m",h.model],["s",h.ser],["r",h.ref],["c",h.chg],["p",t.phone]].forEach(function(x){ if(x[1]) q.push(x[0]+"="+encodeURIComponent(String(x[1]).slice(0,40))); });
  return APP_BASE+"#"+q.join("&");
}
function qrSticker(h){
  var t = TECH(), url = qrUrl(h), sv = ""; try{ sv = QR.svg(url, 220); }catch(x){ sv = '<div class="small">Πολύ μεγάλο κείμενο για QR.</div>'; }
  return '<div class="qrst"><div class="qrsv">'+sv+'</div><div class="qrtx"><b>'+esc([h.brand,h.model].filter(Boolean).join(" ")||"Κλιματιστικό")+'</b>'+(h.ser?'<div>S/N '+esc(h.ser)+'</div>':'')+(h.ref?'<div>'+esc(h.ref)+(h.chg?' · '+esc(String(h.chg).replace(".",","))+' kg':'')+'</div>':'')+
    '<div class="qrsm">Σκανάρετε για ιστορικό & σέρβις</div>'+(t.company||t.name?'<div><b>'+esc(t.company||t.name)+'</b></div>':'')+(t.phone?'<div>📞 '+esc(t.phone)+'</div>':'')+'</div></div>';
}
document.addEventListener("click", function(e){
  var b = e.target.closest("#hqr,#qrprint"); if(!b) return;
  if(b.id==="hqr"){ var o = histReadForm(); o.id = S.formPid; if(!fgKey(o)){ alert("Γράψε πρώτα πελάτη + μοντέλο ή τον σειριακό της μονάδας."); return; }
    movOpen("🏷️ QR αυτοκόλλητο μονάδας", '<div class="small">Τύπωσέ το σε αυτοκόλλητο και κόλλησέ το στη μονάδα. Όταν το σκανάρεις με την κάμερα του κινητού, ανοίγει το ιστορικό της στην εφαρμογή. Ο πελάτης βλέπει μόνο μάρκα, μοντέλο και το τηλέφωνό σου.</div>'+qrSticker(o)+'<button class="mini prim" id="qrprint" style="width:100%;height:46px;margin-top:10px">🖨️ Εκτύπωση αυτοκόλλητου</button>');
    window._qrH = o; return; }
  if(b.id==="qrprint" && window._qrH){ var w = document.getElementById("printarea"); if(!w){ w = document.createElement("div"); w.id = "printarea"; document.body.appendChild(w); }
    w.innerHTML = '<div class="qrpage">'+qrSticker(window._qrH)+qrSticker(window._qrH)+'</div>'; document.documentElement.classList.add("printing"); setTimeout(function(){ try{ window.print(); }catch(x){} setTimeout(function(){ document.documentElement.classList.remove("printing"); }, 500); }, 50); }
});
// Άνοιγμα από QR: #u=...
function unitFromHash(){
  var hsh = location.hash.replace(/^#/,""); if(!/(^|&)u=/.test(hsh)) return;
  var P = {}; hsh.split("&").forEach(function(kv){ var i = kv.indexOf("="); if(i>0) try{ P[kv.slice(0,i)] = decodeURIComponent(kv.slice(i+1)); }catch(x){} });
  history.replaceState(null, "", location.pathname);
  var h0 = /^H:/.test(P.u) ? HIST.filter(function(h){ return "H:"+h.id===P.u; })[0] : null, key = h0 ? fgKey(h0) : P.u;
  var L = HIST.filter(function(h){ return (key && fgKey(h)===key) || ("H:"+h.id)===P.u; }).sort(function(a,b){ return b.ts-a.ts; });
  var head = '<div class="plres"><div><span class="small">Μονάδα</span><b>'+esc([P.b,P.m].filter(Boolean).join(" ")||"—")+'</b></div>'+(P.s?'<div><span class="small">Σειριακός</span><b>'+esc(P.s)+'</b></div>':'')+(P.r?'<div><span class="small">Ψυκτικό</span><b>'+esc(P.r)+(P.c?' · '+esc(P.c)+' kg':'')+'</b></div>':'')+(P.p?'<div><span class="small">Τεχνικός συντήρησης</span><b><a href="tel:'+esc(P.p.replace(/[^\d+]/g,""))+'">📞 '+esc(P.p)+'</a></b></div>':'')+'</div>';
  var body = L.length ? '<div class="lbl">Ιστορικό σε αυτό το κινητό ('+L.length+')</div>'+L.map(function(h){ return '<div class="mtc"><b>'+esc(new Date(h.ts).toLocaleDateString("el-GR"))+'</b>'+(h.code?' · κωδ. <b>'+esc(h.code)+'</b>':'')+'<div class="small">'+esc(h.fix||h.note||"—")+'</div><button class="mini" data-hid="'+esc(h.id)+'" onclick="document.getElementById(\'movx\').click()">Άνοιγμα</button></div>'; }).join("")
    : '<div class="small">Αυτή η μονάδα δεν υπάρχει στο ιστορικό αυτού του κινητού.</div>';
  movOpen("🏷️ Μονάδα από QR", head+body+(P.b?'<button class="mini prim plgo" data-qb="'+esc(P.b)+'" data-qm="'+esc(P.m||"")+'" data-qo="">🔎 Κωδικοί βλάβης για αυτή τη μονάδα</button>':''));
}
window.addEventListener("hashchange", unitFromHash); setTimeout(unitFromHash, 300);
document.addEventListener("click", function(e){ var b = e.target.closest("#mov .plgo[data-qb]"); if(!b) return; movClose(); S.brand = b.getAttribute("data-qb"); S.bedit=false; S.catOpen=true; S.model = b.getAttribute("data-qm")||""; S.oem=null; renderAll(); persist(); });

// ===================== Αντίγραφο ασφαλείας & συνεργάτες =====================
function bakDays(){ var t = LS.get("vl_lastbak", 0); return t ? Math.floor((Date.now()-t)/864e5) : null; }
function bakBuild(){ return pEvery().then(function(ph){ return {app:"vlavologio", v:3, ts:Date.now(), hist:HIST, serLearn:serLearn, myMap:LS.get("vl_mymap",[]), ls:vlAllLS(), photos:ph}; }); }
function bakShare(partner){
  return bakBuild().then(function(o){
    var j = JSON.stringify(o), fn = (partner?"vlavologio-gia-synergati-":"vlavologio-antigrafo-")+new Date().toISOString().slice(0,10)+".json", blob = new Blob([j], {type:"application/json"});
    var done = function(){ if(!partner) LS.set("vl_lastbak", Date.now()); if(typeof repToast==="function") repToast(partner?"📤 Έτοιμο για αποστολή":"☁️ Το αντίγραφο έγινε"); };
    try{ var f = new File([blob], fn, {type:"application/json"}); if(navigator.canShare && navigator.canShare({files:[f]})){ return navigator.share({files:[f], title: partner?"Βλαβολόγιο – για συνεργάτη":"Βλαβολόγιο – αντίγραφο ασφαλείας"}).then(done).catch(function(){}); } }catch(x){}
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); setTimeout(function(){ a.remove(); }, 500); done();
  });
}
function bakRestore(file){
  var rd = new FileReader(); rd.onload = function(){ try{ var d = JSON.parse(rd.result); if(!d || d.app!=="vlavologio") throw 0;
    var n = 0; if(d.ls) n += vlMergeLS(d.ls);
    if(d.hist && d.hist.length){ var cur = JSON.parse(localStorage.getItem("vl_hist")||"[]"), ids = {}; cur.forEach(function(h){ ids[h.id]=1; }); d.hist.forEach(function(h){ if(h && h.id && !ids[h.id]){ cur.push(h); n++; } }); localStorage.setItem("vl_hist", JSON.stringify(cur)); }
    var ph = d.photos||[]; ph.reduce(function(p, x){ return p.then(function(){ return pPut(x); }); }, Promise.resolve()).then(function(){ var tot = JSON.parse(localStorage.getItem("vl_hist")||"[]").length; alert("✅ Η επαναφορά έγινε: "+tot+" επισκέψεις συνολικά"+(ph.length?", "+ph.length+" φωτογραφίες":"")+". Όσα υπήρχαν ήδη δεν διπλασιάστηκαν."); location.reload(); });
  }catch(x){ alert("Το αρχείο δεν είναι αντίγραφο του Βλαβολογίου."); } }; rd.readAsText(file);
}
function bakHtml(){
  var d = bakDays();
  return '<div class="pver '+(d==null||d>7?'warn':'good')+'">'+(d==null?'Δεν έχεις κρατήσει ακόμα αντίγραφο.':'Τελευταίο αντίγραφο: '+(d===0?'σήμερα':'πριν από '+d+' μέρες')+'.')+'</div>'+
    '<div class="small">Οι πελάτες, οι επισκέψεις, οι φωτογραφίες και οι σημειώσεις σου υπάρχουν μόνο σε αυτό το κινητό. Αν χαθεί ή χαλάσει, χάνονται. Κράτα αντίγραφο στο <b>Google Drive</b>, στο <b>iCloud</b> ή στο email σου: πατάς το κουμπί και διαλέγεις πού να αποθηκευτεί.</div>'+
    '<button class="mini prim" id="bakgo" style="width:100%;height:48px;margin-top:10px">☁️ Κράτα αντίγραφο τώρα</button>'+
    '<label class="mini scphoto" style="display:block;text-align:center;margin-top:8px">⬆️ Επαναφορά από αντίγραφο<input type="file" accept=".json,application/json" id="bakin" hidden></label>'+
    '<h3>🤝 Συνεργάτες</h3><div class="small">Για να έχετε τους ίδιους πελάτες με έναν συνεργάτη: στείλε του το αρχείο σου και αυτός πατά «Επαναφορά». Οι επισκέψεις <b>ενώνονται</b> – τίποτα δεν σβήνεται και τίποτα δεν διπλασιάζεται. Κάντε το και ανάποδα.</div>'+
    '<button class="mini" id="bakpart" style="width:100%;height:44px;margin-top:8px">📤 Στείλε τα δεδομένα μου σε συνεργάτη</button>';
}
document.addEventListener("click", function(e){ var b = e.target.closest("#mn_bak,#bakgo,#bakpart,#bakdue"); if(!b) return;
  if(b.id==="mn_bak" || b.id==="bakdue"){ if(typeof hmSet==="function") hmSet(false); movOpen("☁️ Αντίγραφο ασφαλείας", bakHtml()); return; }
  if(b.id==="bakgo"){ bakShare(false).then(function(){ var m = document.getElementById("mov"); if(m && !m.hidden) movOpen("☁️ Αντίγραφο ασφαλείας", bakHtml()); }); return; }
  if(b.id==="bakpart"){ bakShare(true); return; } });
document.addEventListener("change", function(e){ if(e.target && e.target.id==="bakin" && e.target.files && e.target.files[0]) bakRestore(e.target.files[0]); });
function bakDue(){ var d = bakDays(); return HIST.length && (d==null || d>7) ? '<div class="mtdue" id="bakdue">☁️ '+(d==null?'Δεν έχεις κρατήσει αντίγραφο των πελατών σου':'Τελευταίο αντίγραφο πριν από '+d+' μέρες')+' – πάτα για αντίγραφο στο Drive / iCloud</div>' : ''; }

// ===================== Ραντεβού στο ημερολόγιο (.ics) =====================
function icsDate(d){ var p = function(n){ return (n<10?"0":"")+n; }; return d.getUTCFullYear()+p(d.getUTCMonth()+1)+p(d.getUTCDate())+"T"+p(d.getUTCHours())+p(d.getUTCMinutes())+"00Z"; }
function icsMake(title, start, mins, loc, desc){
  var end = new Date(start.getTime()+mins*60000), esc2 = function(s){ return String(s||"").replace(/[\\,;]/g, function(c){ return "\\"+c; }).replace(/\n/g,"\\n"); };
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Vlavologio//EL","BEGIN:VEVENT","UID:"+Date.now()+"@vlavologio","DTSTAMP:"+icsDate(new Date()),"DTSTART:"+icsDate(start),"DTEND:"+icsDate(end),"SUMMARY:"+esc2(title),"LOCATION:"+esc2(loc),"DESCRIPTION:"+esc2(desc),"BEGIN:VALARM","TRIGGER:-PT60M","ACTION:DISPLAY","DESCRIPTION:"+esc2(title),"END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-mtcal],[data-icsgo]"); if(!b) return;
  if(b.hasAttribute("data-mtcal")){ var box = b.closest(".mtc"); if(box.querySelector(".icsf")) return; var d = new Date(Date.now()+864e5); d.setHours(10,0,0,0); var p = function(n){ return (n<10?"0":"")+n; };
    var f = document.createElement("div"); f.className = "icsf"; f.innerHTML = '<input type="datetime-local" value="'+d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+'T10:00"><button class="mini prim" data-icsgo="'+esc(b.getAttribute("data-mtcal"))+'">📅 Πρόσθεσε στο ημερολόγιο</button>'; box.appendChild(f); return; }
  var id = b.getAttribute("data-icsgo"), h = HIST.filter(function(x){ return x.id===id; })[0], inp = b.parentNode.querySelector("input"); if(!h || !inp || !inp.value) return;
  var st = new Date(inp.value), txt = icsMake("Συντήρηση κλιματιστικού – "+(h.cust||""), st, 60, h.cust||"", [h.brand,h.model].filter(Boolean).join(" ")+(h.tel?"\nΤηλ. "+h.tel:""));
  var blob = new Blob([txt], {type:"text/calendar"}), fn = "rantevou.ics";
  try{ var file = new File([blob], fn, {type:"text/calendar"}); if(navigator.canShare && navigator.canShare({files:[file]})){ navigator.share({files:[file]}).catch(function(){}); return; } }catch(x){}
  var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); setTimeout(function(){ a.remove(); }, 500);
});

// ===================== Υπαγόρευση με φωνή =====================
var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function micBtn(target){ return SR ? '<button class="mini mic" data-mic="'+target+'" aria-label="Υπαγόρευση">🎤</button>' : ''; }
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-mic]"); if(!b || !SR) return; e.preventDefault();
  var t = document.getElementById(b.getAttribute("data-mic")); if(!t) return;
  if(b._r){ try{ b._r.stop(); }catch(x){} return; }
  var r = new SR(); r.lang = "el-GR"; r.interimResults = false; r.maxAlternatives = 1; b._r = r; b.classList.add("rec");
  r.onresult = function(ev){ var s = ev.results[0][0].transcript; if(t.id==="q") s = s.replace(/\s+/g,"").toUpperCase().replace(/^(ΚΩΔΙΚΟΣ|ΒΛΑΒΗ)/,""); t.value = (t.tagName==="TEXTAREA" && t.value ? t.value+" " : "") + s; t.dispatchEvent(new Event("input", {bubbles:true})); };
  r.onend = r.onerror = function(){ b._r = null; b.classList.remove("rec"); };
  try{ r.start(); }catch(x){ b._r = null; b.classList.remove("rec"); }
});
function micInject(){ if(!SR) return; ["hf_fix","hf_note","reptxt"].forEach(function(id){ var t = document.getElementById(id); if(t && !t.parentNode.querySelector('[data-mic="'+id+'"]')){ var d = document.createElement("div"); d.innerHTML = micBtn(id); t.parentNode.insertBefore(d.firstChild, t.nextSibling); } }); }
document.addEventListener("click", function(){ setTimeout(micInject, 120); });

// ===================== Στατιστικά από το ιστορικό =====================
function statsHtml(){
  if(!HIST.length) return '<div class="empty"><span class="big">📊</span>Δεν υπάρχουν ακόμα επισκέψεις. Τα στατιστικά βγαίνουν από τους «Πελάτες».</div>';
  var cnt = function(f){ var m = {}; HIST.forEach(function(h){ var k = f(h); if(k) m[k] = (m[k]||0)+1; }); return Object.keys(m).map(function(k){ return [k, m[k]]; }).sort(function(a,b){ return b[1]-a[1]; }); };
  var bar = function(L, n){ var mx = L.length ? L[0][1] : 1; return L.slice(0, n||6).map(function(x){ return '<div class="stb"><span>'+esc(x[0])+'</span><i style="width:'+Math.max(6, Math.round(x[1]/mx*100))+'%"></i><b>'+x[1]+'</b></div>'; }).join("") || '<div class="small">—</div>'; };
  var y = new Date().getFullYear(), thisY = HIST.filter(function(h){ return new Date(h.ts).getFullYear()===y; }).length;
  var tot = 0; HIST.forEach(function(h){ if(h.items && h.items.length) tot += billSum(h).tot; });
  var custs = {}; HIST.forEach(function(h){ if(h.cust) custs[h.cust.toLowerCase()] = 1; });
  return '<div class="plres"><div><span class="small">Επισκέψεις</span><b>'+HIST.length+' (φέτος '+thisY+')</b></div><div><span class="small">Πελάτες</span><b>'+Object.keys(custs).length+'</b></div>'+(tot?'<div><span class="small">Τζίρος από δελτία</span><b>'+eur(tot)+'</b></div>':'')+'</div>'+
    '<h3>Μάρκες που επισκευάζεις</h3>'+bar(cnt(function(h){ return h.brand; }))+
    '<h3>Συχνότεροι κωδικοί βλάβης</h3>'+bar(cnt(function(h){ return h.code ? (h.brand?h.brand+" ":"")+h.code.toUpperCase() : null; }), 8)+
    '<h3>Ψυκτικά</h3>'+bar(cnt(function(h){ return h.ref; }))+
    '<h3>Επισκέψεις ανά μήνα (τελευταίοι 6)</h3>'+bar(cnt(function(h){ var d = new Date(h.ts); return (Date.now()-h.ts < 183*864e5) ? (d.getMonth()+1)+"/"+d.getFullYear() : null; }), 6)+
    '<div class="small" style="margin-top:10px">Βγαίνουν μόνο από τα δικά σου δεδομένα σε αυτό το κινητό.</div>';
}
document.addEventListener("click", function(e){ if(e.target.closest("#mn_stats")){ hmSet(false); movOpen("📊 Στατιστικά", statsHtml()); } });
// Καμία καταμέτρηση χρήσης: η εφαρμογή δεν στέλνει τίποτα χωρίς να το ζητήσει ο χρήστης (αναφορές). Καθάρισμα παλιών κλειδιών v102.
try{ ["vl_use","vl_iid","vl_since","vl_pingday","vl_lasth","vl_noping"].forEach(function(k){ localStorage.removeItem(k); }); }catch(x){}
function vlUse(){}
// ===== Αρχική: «πάνελ ημέρας» =====
var HERO_TIPS = [
  ["📷","Φωτογράφισε την <b>ταμπέλα</b> της μονάδας – βρίσκω μάρκα, μοντέλο και εργοστάσιο."],
  ["🎙","Στη φόρμα επίσκεψης πάτα το <b>μικρόφωνο</b> και υπαγόρευσε τι έκανες."],
  ["📅","Βάλε <b>υπενθύμιση συντήρησης</b> στον πελάτη – με ένα πάτημα του στέλνεις SMS ή WhatsApp."],
  ["🏷️","Τύπωσε <b>QR αυτοκόλλητο</b> για τη μονάδα: την επόμενη φορά το σκανάρεις και βλέπεις όλο το ιστορικό."],
  ["🧭","Το <b>σωληνόγραμμα VRF</b> δίνει διατομές, κιτ διακλάδωσης, όρια και πρόσθετο φρέον από το manual."],
  ["🧾","Από την επίσκεψη βγάζεις <b>δελτίο εργασίας με ΦΠΑ</b> και φωτογραφίες, έτοιμο για τον πελάτη."],
  ["💾","Κάνε <b>αντίγραφο ασφαλείας</b> από το μενού ⋯ – οι πελάτες σου μένουν μόνο στο κινητό σου."],
  ["🚦","Στα <b>λαμπάκια</b> της εσωτερικής γράψε πώς αναβοσβήνουν – βρίσκω τον κωδικό."]
];
function heroHtml(){
  var d = new Date(), h = d.getHours(), g = h < 5 ? "Καλό βράδυ" : h < 13 ? "Καλημέρα" : h < 21 ? "Καλησπέρα" : "Καλό βράδυ";
  var ds = d.toLocaleDateString("el-GR",{weekday:"long", day:"numeric", month:"long"});
  var hist = (typeof HIST!=="undefined" && HIST) ? HIST : [], fixed = hist.filter(function(x){ return x && x.fix && String(x.fix).trim(); }).length;
  var cust = {}; hist.forEach(function(x){ var c = x && String(x.cust||"").trim().toLowerCase(); if(c) cust[c] = 1; });
  var due = 0; try{ due = mtUnits().filter(function(u){ return mtState(u)!=="ok"; }).length; }catch(x){}
  var tip = HERO_TIPS[Math.floor(d.getTime()/864e5) % HERO_TIPS.length];
  var st = hist.length ? '<div class="hstats"><span><b>'+fixed+'</b> βλάβες λύθηκαν</span><span><b>'+Object.keys(cust).length+'</b> πελάτες</span>'+(due?'<span style="border-color:var(--hot)"><b>'+due+'</b> συντηρήσεις</span>':'')+'</div>' : '';
  return '<p class="hg">'+g+' 👋</p><div class="hd">'+esc(ds.charAt(0).toUpperCase()+ds.slice(1))+' · τι έχουμε σήμερα;</div><div class="tbar"></div>'+st+
    '<div class="hacts"><button data-hx="plate"><span class="hi">📷</span>Ταμπέλα</button><button data-hx="pipe"><span class="hi">🧭</span>Σωλήνες VRF</button><button data-hx="visit"><span class="hi">➕</span>Νέα επίσκεψη</button><button data-hx="maint"><span class="hi">🔔</span>Συντηρήσεις'+(due?'<span class="bd">'+due+'</span>':'')+'</button></div>'+
    '<div class="htip"><span>'+tip[0]+'</span><span><b>Ήξερες ότι…</b> '+tip[1]+'</span></div>';
}
function heroRender(){
  var el = document.getElementById("hero"); if(!el) return;
  var cl = document.documentElement.classList, show = !cl.contains("mode-tools") && !cl.contains("mode-kb") && !(typeof brandObj==="function" && brandObj()) && !(S.q && S.q.trim());
  if(!show){ if(!el.hidden) el.hidden = true; return; }
  var k = new Date().toDateString()+"|"+((typeof HIST!=="undefined"&&HIST)?HIST.length:0);
  if(el.hidden || el.dataset.k!==k){ el.innerHTML = heroHtml(); el.dataset.k = k; }
  el.hidden = false;
}
function vlBuzz(){ try{ if(navigator.vibrate) navigator.vibrate(8); }catch(x){} }
(function(){
  var _ra = renderAll; renderAll = function(){ var r = _ra.apply(this, arguments); try{ heroRender(); }catch(x){} return r; };
  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest("[data-hx]");
    if(b){ vlBuzz(); var x = b.getAttribute("data-hx");
      if(x==="plate"){ var i = document.querySelector("#platecta .plin"); if(i) i.click(); else scanOpen("quick"); vlUse("hero_plate"); }
      else if(x==="pipe"){ document.getElementById("toolsbtn").click(); setTimeout(function(){ var p = document.querySelector('[data-pc="pipe"]'); if(p) p.click(); }, 60); }
      else if(x==="visit") histOpen("form");
      else if(x==="maint") histOpen("maint");
      return; }
    if(e.target.closest && e.target.closest("#bnav button,.br,.cat,.srcbox button")) vlBuzz();
    setTimeout(function(){ try{ heroRender(); }catch(x){} }, 0);
  }, true);
  document.addEventListener("input", function(e){ if(e.target && e.target.id==="q") setTimeout(heroRender, 0); });
  setTimeout(heroRender, 0);
})();
document.addEventListener("click", function(e){
  if(!(e.target.closest && e.target.closest("#histsave"))) return;
  var fx = document.getElementById("hf_fix"), had = fx && fx.value.trim();
  setTimeout(function(){ try{ if(!had || document.getElementById("hf_fix")) return;
    var n = HIST.filter(function(x){ return x && x.fix && String(x.fix).trim(); }).length;
    vlBuzz(); repToast(n===1 ? "✅ Η πρώτη σου λυμένη βλάβη στο Βλαβολόγιο!" : n%10===0 ? "🏆 "+n+" λυμένες βλάβες – μπράβο!" : "✅ Καταγράφηκε · "+n+" λυμένες βλάβες"); }catch(x){} }, 120);
}, true);
