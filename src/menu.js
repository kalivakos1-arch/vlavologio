// ===== Σημειώσεις ανά κωδικό (μένουν μόνο σε αυτή τη συσκευή) =====
function notesAll(){ var n = LS.get("vl_notes", {}); return n && typeof n==="object" ? n : {}; }
function noteKey(tkey, code){ return (S.brand||"")+"|"+tkey+"|"+code; }
function noteBox(tkey, code, title){
  var k = noteKey(tkey, code), n = notesAll()[k];
  return '<div class="note" data-nk="'+esc(k)+'" data-ntk="'+esc(tkey)+'" data-nc="'+esc(code)+'" data-nt="'+esc(title||"")+'">'+noteInner(n)+'</div>';
}
function noteInner(n){
  return n && n.t ? '<div class="notev"><b>📝 Η σημείωσή μου</b> <span class="small">· '+esc(n.d||"")+'</span>\n'+esc(n.t)+'</div><button class="repb" data-noted>✏️ Αλλαγή σημείωσης</button>'
                  : '<button class="repb" data-noted>📝 Πρόσθεσε δική σου σημείωση</button>';
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-noted],[data-nsave],[data-ndel],[data-ncancel]"); if(!b) return;
  var box = b.closest(".note"); if(!box) return;
  var k = box.getAttribute("data-nk"), all = notesAll(), n = all[k];
  if(b.hasAttribute("data-noted")){
    box.innerHTML = '<textarea rows="3" placeholder="π.χ. «Σε αυτό το μοντέλο ήταν πάντα το φις του αισθητηρίου»">'+esc(n&&n.t||"")+'</textarea>'+
      '<div class="nbtns"><button class="mini prim" data-nsave>💾 Αποθήκευση</button>'+(n?'<button class="mini" data-ndel>🗑 Διαγραφή</button>':'')+'<button class="mini" data-ncancel>Άκυρο</button></div>'+
      '<div class="small" style="margin-top:4px">Μένει μόνο σε αυτή τη συσκευή. Μην γράφεις στοιχεία πελάτη.</div>';
    var ta = box.querySelector("textarea"); if(ta) ta.focus(); return;
  }
  if(b.hasAttribute("data-nsave")){
    var t = (box.querySelector("textarea")||{}).value||""; t = t.trim().slice(0,2000);
    if(!t){ delete all[k]; } else { all[k] = {t:t, d:new Date().toLocaleDateString("el-GR"), ts:Date.now(), brand:S.brand||"", cat:S.cat, oem:S.oem, tkey:box.getAttribute("data-ntk"), code:box.getAttribute("data-nc"), title:box.getAttribute("data-nt")}; }
    LS.set("vl_notes", all); box.innerHTML = noteInner(all[k]); if(typeof repToast==="function") repToast(t?"💾 Η σημείωση αποθηκεύτηκε":"Η σημείωση διαγράφηκε"); return;
  }
  if(b.hasAttribute("data-ndel")){ delete all[k]; LS.set("vl_notes", all); box.innerHTML = noteInner(null); if(typeof repToast==="function") repToast("Η σημείωση διαγράφηκε"); return; }
  if(b.hasAttribute("data-ncancel")){ box.innerHTML = noteInner(n); }
});

// ===== Παράθυρο πληροφοριών (σημειώσεις, οδηγός, σχετικά, εγκατάσταση) =====
function movOpen(title, html){
  var d = document.getElementById("mov");
  if(!d){ d = document.createElement("div"); d.id = "mov"; d.className = "mov"; document.body.appendChild(d); }
  d.innerHTML = '<div class="repbox" role="dialog" aria-modal="true" aria-labelledby="movh"><div class="reph" id="movh">'+title+'<button class="repx" id="movx" aria-label="Κλείσιμο">✕</button></div>'+html+'</div>';
  d.hidden = false; var x = document.getElementById("movx"); if(x) x.focus();
}
function movClose(){ var d = document.getElementById("mov"); if(d) d.hidden = true; }
document.addEventListener("click", function(e){
  var d = document.getElementById("mov");
  if(e.target.closest("#movx") || (d && e.target===d)){ movClose(); return; }
});
document.addEventListener("keydown", function(e){ if(e.key==="Escape") movClose(); });

function notesHtml(){
  var all = notesAll(), ks = Object.keys(all).sort(function(a,b){ return (all[b].ts||0)-(all[a].ts||0); });
  if(!ks.length) return '<div class="empty"><span class="big">📝</span>Δεν έχεις γράψει σημειώσεις ακόμα.<br>Άνοιξε έναν κωδικό και πάτα <b>«📝 Πρόσθεσε δική σου σημείωση»</b> κάτω από την περιγραφή.</div>';
  return '<div class="small">'+ks.length+' σημειώσεις · πάτα μία για να ανοίξει ο κωδικός</div>'+ks.map(function(k){ var n = all[k];
    return '<button class="nli" data-nopen="'+esc(k)+'"><b>'+esc(n.code||"")+'</b> · '+esc(n.brand||"")+'<span class="small">'+esc(n.title||"")+' · '+esc(n.d||"")+'</span><span class="nt">'+esc(n.t)+'</span></button>'; }).join("");
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-nopen]"); if(!b) return;
  var n = notesAll()[b.getAttribute("data-nopen")]; if(!n) return;
  movClose(); if(typeof navGo==="function") navGo("code");
  S.cat = n.cat || S.cat; S.brand = n.brand || null; S.oem = n.oem || null; S.src = "in"; S.q = n.code; $("q").value = n.code;
  var bw = $("brandsWrap"); if(bw) bw.classList.remove("open");
  renderAll(); persist();
  setTimeout(function(){ var r = $("results"); if(r) window.scrollTo({top:r.getBoundingClientRect().top+window.scrollY-90, behavior:"smooth"}); }, 60);
});

var HELP_HTML =
 '<h3>1 · Βρες τον κωδικό</h3><ol><li>Διάλεξε <b>μάρκα</b> (ή γράψε το όνομα).</li><li>Διάλεξε τύπο μονάδας (τοίχου, κασέτα, VRF…).</li><li>Γράψε τον <b>κωδικό</b> που δείχνει η οθόνη ή διάλεξε τις λυχνίες που αναβοσβήνουν.</li></ol>'+
 '<div class="small">Δεν ξέρεις το εργοστάσιο της μάρκας; Πάτα το <b>📷</b> πάνω δεξιά και σκάναρε την ετικέτα της μονάδας.</div>'+
 '<h3>2 · Έλεγξε βήμα‑βήμα</h3><ul><li>Κάθε κωδικός λέει <b>τι ελέγχεις και με ποια σειρά</b>.</li><li>Το κουμπί <b>«🧭 Έλεγχος βήμα‑βήμα»</b> σε πάει από έλεγχο σε έλεγχο. Γράφεις τη μέτρησή σου και σου λέει αν είναι καλή.</li><li>Δεν έχεις κωδικό; Πάτα <b>«Συμπτώματα»</b> (δεν ψύχει, στάζει, θόρυβος…).</li></ul>'+
 '<h3>3 · Εργαλεία & Γνώσεις</h3><ul><li><b>Εργαλεία:</b> πίεση ↔ θερμοκρασία, υπερθέρμανση/υπόψυξη, συμπληρωματική γόμωση, σωληνώσεις, ΔT, μετατροπές.</li><li><b>Γνώσεις:</b> πώς μετράς κάθε εξάρτημα και ποιος είναι ο κανόνας.</li></ul>'+
 '<h3>4 · Πελάτες</h3><ul><li>Αναφορά επίσκεψης με μετρήσεις και <b>υπογραφή πελάτη</b>, έτοιμη για εκτύπωση ή αποστολή.</li><li><b>Βιβλίο F‑gas</b> με υπενθύμιση ελέγχου διαρροής.</li></ul>'+
 '<h3>5 · Δικές σου σημειώσεις</h3><div>Κάτω από κάθε κωδικό γράφεις ό,τι έμαθες στη δουλειά. Τις βρίσκεις όλες στο μενού <b>⋯ → Οι σημειώσεις μου</b>.</div>'+
 '<div class="small" style="margin-top:12px">Λειτουργεί και χωρίς internet. Όλα όσα γράφεις μένουν μόνο στη συσκευή σου.</div>';

function installHtml(){
  var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent), std = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
  if(std) return '<div class="pver good">✅ Η εφαρμογή είναι ήδη εγκατεστημένη και ανοίγει από την αρχική οθόνη.</div>';
  var b = window._vlInstall ? '<button class="mini prim" id="mn_doinst" style="width:100%;height:46px;margin-top:8px">📲 Εγκατάσταση τώρα</button>' : '';
  return b+(ios ? '<h3>iPhone / iPad (Safari)</h3><ol><li>Πάτα το κουμπί <b>Κοινοποίηση</b> (τετράγωνο με βέλος) κάτω στη Safari.</li><li>Διάλεξε <b>«Προσθήκη στην οθόνη Αφετηρίας»</b>.</li><li>Πάτα <b>«Προσθήκη»</b>.</li></ol>'
    : '<h3>Android (Chrome)</h3><ol><li>Πάτα τις <b>⋮</b> πάνω δεξιά στον Chrome.</li><li>Διάλεξε <b>«Εγκατάσταση εφαρμογής»</b> ή <b>«Προσθήκη στην αρχική οθόνη»</b>.</li></ol>')+
    '<div class="small" style="margin-top:8px">Μετά ανοίγει με ένα πάτημα, σε πλήρη οθόνη, και δουλεύει και χωρίς internet.</div>';
}
window.addEventListener("beforeinstallprompt", function(e){ e.preventDefault(); window._vlInstall = e; });
document.addEventListener("click", function(e){ if(e.target.closest("#mn_doinst") && window._vlInstall){ window._vlInstall.prompt(); window._vlInstall = null; movClose(); } });

function aboutHtml(){
  var tabs = 0, codes = 0; try{ for(var k in T){ if(T[k] && T[k].codes){ tabs++; codes += T[k].codes.length; } } }catch(x){}
  var m = document.querySelector('meta[name="vl-ver"]');
  return '<div>Βλαβολόγιο για τεχνικούς κλιματισμού: κωδικοί βλαβών, λυχνίες, μετρήσεις και εργαλεία, στα ελληνικά.</div>'+
    '<ul><li><b>'+codes.toLocaleString("el-GR")+'</b> κωδικοί σε <b>'+tabs+'</b> πίνακες</li><li><b>'+BRANDS.length+'</b> μάρκες (με αντιστοίχιση στο εργοστάσιο που τις κατασκευάζει)</li><li>Κάθε πίνακας γράφει από ποιο <b>επίσημο manual</b> προέρχεται. Όπου κάτι δεν έχει επιβεβαιωθεί για ευρωπαϊκό μοντέλο, φαίνεται με ⚠️.</li></ul>'+
    '<div class="small">Οι κωδικοί διαφέρουν ανά γενιά και σειρά. Για αλλαγή πλακέτας ή συμπιεστή επιβεβαίωσε στο manual του μοντέλου. Τα ονόματα και σήματα των κατασκευαστών ανήκουν στους κατόχους τους. Η εφαρμογή είναι ανεξάρτητη και δεν συνδέεται με κανέναν κατασκευαστή.</div>'+
    '<div class="small" style="margin-top:8px">'+(m?'Έκδοση '+esc(m.content.replace("vl-v",""))+' · ':'')+'Τα δεδομένα σου (σημειώσεις, πελάτες, αναφορές) μένουν μόνο σε αυτή τη συσκευή.</div>';
}
var APP_URL = "https://kalivakos1-arch.github.io/vlavologio/";
function shareApp(){
  var d = {title:"Βλαβολόγιο Κλιματισμού", text:"Κωδικοί βλαβών, λυχνίες, μετρήσεις και εργαλεία για τεχνικούς κλιματισμού – δωρεάν, στα ελληνικά, και χωρίς internet.", url:APP_URL};
  if(navigator.share){ navigator.share(d).catch(function(){}); return; }
  var done = function(){ if(typeof repToast==="function") repToast("🔗 Ο σύνδεσμος αντιγράφηκε"); };
  if(navigator.clipboard) navigator.clipboard.writeText(APP_URL).then(done, function(){ prompt("Αντέγραψε τον σύνδεσμο:", APP_URL); });
  else prompt("Αντέγραψε τον σύνδεσμο:", APP_URL);
}
document.addEventListener("click", function(e){
  var b = e.target.closest("#hmclose,#mn_notes,#mn_tech,#mn_help,#mn_install,#mn_about,#mn_share,#mn_sugg"); if(!b) return;
  hmSet(false);
  if(b.id==="mn_notes"){ movOpen("📝 Οι σημειώσεις μου", notesHtml()); return; }
  if(b.id==="mn_tech"){ if(typeof histOpen==="function"){ histOpen("list"); techForm(); } return; }
  if(b.id==="mn_help"){ movOpen("❓ Πώς δουλεύει", HELP_HTML); return; }
  if(b.id==="mn_install"){ movOpen("📲 Στην αρχική οθόνη", installHtml()); return; }
  if(b.id==="mn_about"){ movOpen("ⓘ Σχετικά & πηγές", aboutHtml()); return; }
  if(b.id==="mn_share"){ shareApp(); return; }
  if(b.id==="mn_sugg"){ repOpen("", "", {kind:"Λείπει μάρκα / μοντέλο / κωδικός"}); return; }
});
// ===== Καλωσόρισμα (μόνο την πρώτη φορά) =====
(function(){ var w = document.getElementById("welcome"); if(w && !LS.get("vl_welcomed", false) && !LS.get("vl_state", null)) w.hidden = false; })();
document.addEventListener("click", function(e){
  var b = e.target.closest("#welok,#welhelp"); if(!b) return;
  LS.set("vl_welcomed", true); var w = document.getElementById("welcome"); if(w) w.hidden = true;
  if(b.id==="welhelp") movOpen("❓ Πώς δουλεύει", HELP_HTML);
});
