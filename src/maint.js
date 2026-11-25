// ===== Υπενθυμίσεις συντήρησης – μόνο για πελάτες που το θέλουν (επιλογή ανά επίσκεψη) =====
function mtSnooze(){ var o = LS.get("vl_mtsnooze", {}); return o && typeof o==="object" ? o : {}; }
function mtUnits(){
  var U = {}, sn = mtSnooze();
  HIST.slice().sort(function(a,b){ return a.ts-b.ts; }).forEach(function(h){ var k = fgKey(h); if(!k) return; U[k] = h; });
  return Object.keys(U).map(function(k){
    var h = U[k]; if(!h.mrem) return null;
    var m = parseInt(h.mint||"12",10)||12, d = new Date(h.ts); d.setMonth(d.getMonth()+m);
    var next = Math.max(d.getTime(), sn[k]||0);
    return {k:k, h:h, m:m, next:next};
  }).filter(Boolean);
}
function mtState(u){ var now = Date.now(); return u.next <= now ? "late" : (u.next - now < 30*864e5 ? "soon" : "ok"); }
function mtBadge(){ var n = mtUnits().filter(function(u){ return mtState(u)!=="ok"; }).length; return n ? ' <span class="fgb">'+n+'</span>' : ''; }
function mtDueBanner(){
  var n = mtUnits().filter(function(u){ return mtState(u)!=="ok"; }).length;
  return n ? '<div class="mtdue" id="htab_m2">🔔 <b>'+n+'</b> '+(n===1?'πελάτης θέλει':'πελάτες θέλουν')+' συντήρηση αυτόν τον μήνα – πάτα για κλήση ή μήνυμα</div>' : '';
}
function mtMsg(u){
  var t = TECH(), h = u.h, unit = [h.brand, h.model].filter(Boolean).join(" ");
  return "Καλησπέρα σας"+(h.cust?" ("+h.cust.split(/[–-]/)[0].trim()+")":"")+", "+(t.name?"εδώ "+t.name+(t.company?" – "+t.company:"")+". ":"")+
    "Πλησιάζει η περιοδική συντήρηση του κλιματιστικού σας"+(unit?" ("+unit+")":"")+". Θέλετε να κλείσουμε ένα ραντεβού;"+(t.phone?" Τηλ. "+t.phone:"");
}
function mtTel(v){ return String(v||"").replace(/[^\d+]/g,""); }
function mtHtml(){
  var U = mtUnits(), ord = {late:0, soon:1, ok:2};
  U.sort(function(a,b){ return (ord[mtState(a)]-ord[mtState(b)]) || (a.next-b.next); });
  var lab = {late:"🔔 Ώρα για συντήρηση", soon:"⏰ Μέσα στον μήνα", ok:"✅ Αργότερα"};
  var h = '<div class="small" style="margin:6px 0 10px">Εδώ εμφανίζονται <b>μόνο</b> οι πελάτες που δέχτηκαν υπενθύμιση. Το ενεργοποιείς στην επίσκεψη: «🔔 Υπενθύμιση συντήρησης». Τα στοιχεία μένουν μόνο σε αυτό το κινητό.</div>';
  if(!U.length) return h+'<div class="empty"><span class="big">🔔</span>Κανένας πελάτης με υπενθύμιση ακόμα.<br>Άνοιξε ή κάνε μια επίσκεψη και τσέκαρε «🔔 Υπενθύμιση συντήρησης».</div>';
  return h + U.map(function(u){
    var st = mtState(u), x = u.h, tel = mtTel(x.tel), msg = encodeURIComponent(mtMsg(u)), ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    return '<div class="mtc"><div><b>'+esc(x.cust||"—")+'</b> · <span class="small">'+lab[st]+'</span></div>'+
      '<div class="small">'+esc([x.brand,x.model].filter(Boolean).join(" · ")||"—")+' · τελευταία επίσκεψη '+esc(new Date(x.ts).toLocaleDateString("el-GR"))+' · κάθε '+u.m+' μήνες → <b>'+esc(new Date(u.next).toLocaleDateString("el-GR"))+'</b></div>'+
      '<div class="mtb">'+(tel?'<a class="mini" href="tel:'+esc(tel)+'">📞 Κλήση</a><a class="mini" href="sms:'+esc(tel)+(ios?'&':'?')+'body='+msg+'">💬 SMS</a><a class="mini" href="https://wa.me/'+esc(tel.replace(/^\+/,"").replace(/^(69\d{8})$/,"30$1"))+'?text='+msg+'" target="_blank" rel="noopener">WhatsApp</a>':'<span class="small">Δεν υπάρχει τηλέφωνο – πρόσθεσέ το στην επίσκεψη.</span>')+'</div>'+
      '<div class="mtb"><button class="mini" data-mtnew="'+esc(x.id)+'">➕ Νέα επίσκεψη</button><button class="mini" data-mtsn="'+esc(u.k)+'">⏭ Σε 1 μήνα</button><button class="mini" data-mtoff="'+esc(x.id)+'">🔕 Όχι άλλες</button></div></div>';
  }).join("");
}
document.addEventListener("click", function(e){
  var el = e.target.closest("#htab_m,#htab_m2,[data-mtnew],[data-mtsn],[data-mtoff]"); if(!el) return;
  if(el.id==="htab_m" || el.id==="htab_m2"){ histOpen("maint"); return; }
  if(el.hasAttribute("data-mtsn")){ var o = mtSnooze(), d = new Date(); d.setMonth(d.getMonth()+1); o[el.getAttribute("data-mtsn")] = d.getTime(); LS.set("vl_mtsnooze", o); histOpen("maint"); return; }
  if(el.hasAttribute("data-mtoff")){ if(el.getAttribute("data-c")!=="1"){ el.setAttribute("data-c","1"); el.textContent = "Σίγουρα; Πάτα ξανά"; return; } var id = el.getAttribute("data-mtoff"); HIST.forEach(function(h){ if(h.id===id) h.mrem = false; }); histSave(); histOpen("maint"); return; }
  if(el.hasAttribute("data-mtnew")){ var src = HIST.filter(function(h){ return h.id===el.getAttribute("data-mtnew"); })[0]; if(!src) return;
    histOpen("form"); ["cust","tel","brand","oem","model","ser","ref","chg","mint"].forEach(function(k){ var x = document.getElementById("hf_"+k); if(x && src[k]) x.value = src[k]; });
    var c = document.getElementById("hf_mrem"); if(c) c.checked = true; var hm = document.getElementById("hf_herm"); if(hm) hm.checked = !!src.herm;
    var fx = document.getElementById("hf_fix"); if(fx && !fx.value) fx.value = "Περιοδική συντήρηση"; return; }
});
// μικρό σήμα στο «Πελάτες» της κάτω μπάρας όταν κάποιος πελάτης θέλει συντήρηση ή έλεγχο F-gas
function mtNavDot(){ try{ var b = document.getElementById("histbtn"); if(!b) return; var n = mtUnits().filter(function(u){ return mtState(u)!=="ok"; }).length + fgUnits().filter(function(u){ var s = fgState(u); return s==="late"||s==="soon"; }).length;
  var d = b.querySelector(".navdot"); if(n && !d){ d = document.createElement("span"); d.className = "navdot"; b.appendChild(d); } if(d){ if(n) d.textContent = n; else d.remove(); } }catch(x){} }
setTimeout(mtNavDot, 400); document.addEventListener("click", function(){ setTimeout(mtNavDot, 300); });
