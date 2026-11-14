// ===== ΜΑΡΚΕΣ, ΕΡΓΟΣΤΑΣΙΑ & ΛΟΓΙΚΗ ΕΦΑΡΜΟΓΗΣ =====
(function(){
var T = window.T;

var CATS = [
  {id:"split", label:"Split (τοίχου, κασέτα, κανάλι)", icon:"❄️"},
  {id:"multi", label:"Multi split", icon:"🔀"},
  {id:"hp",    label:"Αντλία θερμότητας (νερού)", icon:"🔥"},
  {id:"vrf",   label:"VRF", icon:"🏢"},
  {id:"vrfhr", label:"VRF Heat Recovery", icon:"🔁"}
];

// Πλατφόρμες εργοστασίων -> πίνακες ανά κατηγορία
var PLAT = {
  midea:   {name:"Midea",   split:["midea_split"], hp:["midea_mthermal"], vrf:["midea_vrf"], vrfhr:["hr_midea","midea_vrf"]},
  aux:     {name:"AUX",     split:["aux_split"]},
  gree:    {name:"Gree",    split:["gree_split"], hp:["gree_versati"], vrf:["gree_gmv"], vrfhr:["gree_gmv"]},
  inv_gree:{name:"Inventor (τύπου Gree)", split:["inventor_evi","gree_split"]},
  inv_mc:  {name:"Inventor Mini Chiller", hp:["inventor_minichiller"]},
  hisense: {name:"Hisense", split:["hisense_split"], hp:["hisense_hitherma"], vrf:["hisense_vrf","hitachi_all"], vrfhr:["hisense_vrf","hitachi_all"]},
  haier:   {name:"Haier",   split:["haier_split"], hp:["haier_hp"]},
  tcl:     {name:"TCL",     split:["tcl_split"]},
  daikin:  {name:"Daikin",  split:["daikin_split"], hp:["daikin_altherma"], vrf:["daikin_vrv"], vrfhr:["hr_daikin","daikin_vrv"]},
  me:      {name:"Mitsubishi Electric", split:["me_split"], hp:["me_ecodan","me_split"], vrf:["me_citymulti"], vrfhr:["hr_me","me_citymulti"]},
  mhi:     {name:"Mitsubishi Heavy", split:["mhi_split"], vrf:["mhi_kx"], vrfhr:["mhi_kx"]},
  fujitsu: {name:"Fujitsu", split:["fujitsu_all"], hp:["fujitsu_all"], vrf:["fujitsu_all"], vrfhr:["fujitsu_all"]},
  toshiba: {name:"Toshiba", split:["toshiba_ras","toshiba_rav"], hp:["toshiba_estia","toshiba_rav"], vrf:["toshiba_rav"], vrfhr:["toshiba_rav"]},
  panasonic:{name:"Panasonic", split:["panasonic_split"], hp:["panasonic_aquarea"], vrf:["panasonic_ecoi"], vrfhr:["panasonic_ecoi"]},
  lg:      {name:"LG",      split:["lg_all"], hp:["lg_therma","lg_all"], vrf:["lg_all"], vrfhr:["hr_lg","lg_all"]},
  samsung: {name:"Samsung", split:["samsung_all"], hp:["samsung_ehs","samsung_all"], vrf:["samsung_all"], vrfhr:["hr_samsung","samsung_all"]},
  hitachi: {name:"Hitachi", split:["hitachi_all"], hp:["hitachi_all"], vrf:["hitachi_all"], vrfhr:["hitachi_all"]}
};

// Μάρκες της ελληνικής αγοράς
// own: πλατφόρμα (δικό τους εργοστάσιο ή γνωστός σταθερός OEM)
// cands: πιθανά εργοστάσια (αλλάζει ανά σειρά/χρονιά) -> ζητάμε μοντέλο/ταμπελάκι
var GENERIC = {split:["midea","gree","aux","tcl","hisense","haier"], hp:["midea","gree"], vrf:["midea","gree"], vrfhr:["midea","gree"]};
var BRANDS = [
  {n:"Daikin", own:"daikin"},
  {n:"Mitsubishi Electric", own:"me"},
  {n:"Mitsubishi Heavy", own:"mhi"},
  {n:"Fujitsu", own:"fujitsu"},
  {n:"Toshiba", own:"toshiba"},
  {n:"Panasonic", own:"panasonic"},
  {n:"LG", own:"lg"},
  {n:"Samsung", own:"samsung"},
  {n:"Hitachi", own:"hitachi"},
  {n:"Gree", own:"gree"},
  {n:"Midea", own:"midea"},
  {n:"AUX", own:"aux"},
  {n:"Hisense", own:"hisense"},
  {n:"Haier", own:"haier"},
  {n:"TCL", own:"tcl"},
  {n:"Cooper&Hunter", own:"gree", hint:"Κατασκευάζεται από Gree – χρησιμοποιεί βλαβολόγιο Gree."},
  {n:"Bosch", cands:{split:["midea"], vrf:["midea"], vrfhr:["midea"]}, hint:"Τα Bosch Climate (split) και τα Bosch VRF (AF5300) είναι Midea OEM. Οι αντλίες Bosch Compress έχουν δικό τους βλαβολόγιο (δεν περιλαμβάνεται)."},
  {n:"Carrier", cands:{split:["midea","toshiba"], vrf:["toshiba","midea"], vrfhr:["toshiba","midea"], hp:["midea"]}, hint:"Carrier: τα οικιακά είναι συνήθως Midea, τα επαγγελματικά/VRF Toshiba-Carrier. Δες ταμπελάκι."},
  {n:"Inventor", cands:{split:["aux","midea","inv_gree"], hp:["midea","inv_mc"], vrf:["midea"], vrfhr:["midea"]}, hint:"Η Inventor δεν έχει δικό της εργοστάσιο. Τα επίσημα manuals της δείχνουν σειρές AUX, Midea και σειρές με βλαβολόγιο τύπου Gree (π.χ. EVI/EVO, Cosmo B2VI από Gree Zhuhai, U-Match). Οι αντλίες Matrix έχουν το βλαβολόγιο της Midea M-Thermal. Δες «Manufacturer/Made by» στο ταμπελάκι εξωτερικής ή αποθήκευσε το πρόθεμα μοντέλου όταν το επιβεβαιώσεις."},
  {n:"Toyotomi", cands:{split:["gree","midea","aux","tcl","hisense","haier"], hp:["midea","gree"], vrf:["midea","gree"], vrfhr:["midea","gree"]}, hint:"Στα εγχειρίδια Toyotomi (Erai, Umi, TRN/TRG) οι κωδικοί είναι τύπου Gree (U8, H6, H3, C5, F0…). Άλλες σειρές μπορεί να διαφέρουν – δες ταμπελάκι."},
  {n:"Sendo", cands:GENERIC, hint:"Η Sendo έχει σειρές από διαφορετικά εργοστάσια· δεν βρέθηκε επίσημο service manual. Δες «Manufacturer» στο ταμπελάκι."},
  {n:"Nexi (by Sendo)", cands:GENERIC},
  {n:"Juro-Pro", cands:{split:["midea","gree","aux","tcl","hisense","haier"], hp:["midea"], vrf:["midea"], vrfhr:["midea"]}, hint:"Τα Juro-Pro έχουν λειτουργία «Follow Me», χαρακτηριστική της Midea – πιθανότατα Midea OEM. Επιβεβαίωσε στο ταμπελάκι."},
  {n:"Morris", cands:GENERIC},
  {n:"Tesla", cands:GENERIC},
  {n:"Pitsos", cands:{split:["midea","gree","aux"]}},
  {n:"Equation", cands:GENERIC},
  {n:"F&U", cands:GENERIC},
  {n:"Eurolamp", cands:GENERIC},
  {n:"Primo", cands:GENERIC},
  {n:"Philco", cands:GENERIC},
  {n:"Arielli", cands:GENERIC},
  {n:"Finlux", cands:GENERIC},
  {n:"Nuvelle", cands:GENERIC},
  {n:"Miyato", cands:GENERIC},
  {n:"Coolstar", cands:GENERIC},
  {n:"United", cands:GENERIC},
  {n:"Intercool", cands:GENERIC},
  {n:"Omnys", cands:GENERIC},
  {n:"Xiaomi", cands:GENERIC},
  {n:"Beko", cands:GENERIC},
  {n:"Sharp", cands:GENERIC},
  {n:"Olimpia Splendid", cands:GENERIC},
  {n:"Crown", cands:GENERIC},
  {n:"Eskimo", cands:GENERIC},
  {n:"Izumi", cands:GENERIC},
  {n:"Kumo", cands:GENERIC},
  {n:"Telco", cands:GENERIC},
  {n:"Winson", cands:GENERIC},
  {n:"Άλλη μάρκα…", cands:{split:["midea","gree","aux","tcl","hisense","haier","daikin","lg","samsung"], hp:["midea","gree","daikin","panasonic","lg","samsung","me","toshiba","hisense","haier"], vrf:["midea","gree","daikin","me","lg","samsung","toshiba","hitachi","mhi","fujitsu","panasonic","hisense"], vrfhr:["midea","gree","daikin","me","lg","samsung","toshiba","panasonic","hisense"]}}
];


// Multi = ίδιοι κωδικοί με split (εσωτερικές + πολλαπλή εξωτερική)
Object.keys(PLAT).forEach(function(p){ if(PLAT[p].split) PLAT[p].multi = PLAT[p].split; });
GENERIC.multi = GENERIC.split;
BRANDS.forEach(function(b){ if(b.cands && b.cands.split && !b.cands.multi) b.cands.multi = b.cands.split; });
if(typeof OUTP!=="undefined") Object.keys(OUTP).forEach(function(p){ if(OUTP[p].split) OUTP[p].multi = OUTP[p].split; });

// ===== Αναζήτηση μάρκας (ελληνικά/αγγλικά) =====
var ALIAS = {
 "LG":["λγ","ελτζι","ελ τζι","ελζι","λ τζι","λτζι","ελ τζη"], "Daikin":["νταικιν","ντάικιν","νταϊκιν","ντεικιν"], "Mitsubishi Electric":["μιτσουμπισι","μιτσουμπίσι ελεκτρικ","μιτσουμπισι ηλεκτρικ","mitsubishi"],
 "Mitsubishi Heavy":["μιτσουμπισι χεβι","μιτσουμπισι βαρεα","heavy","mhi"], "Fujitsu":["φουτζιτσου","φουτζίτσου","φουτζι"], "Toshiba":["τοσιμπα","τοσίμπα","τοσιμπα"],
 "Panasonic":["πανασονικ","πανασόνικ"], "Samsung":["σαμσουνγκ","σάμσουνγκ","σαμσουγκ"], "Hitachi":["χιτατσι","χιτάτσι"], "Gree":["γκρι","γκρη","γρι","γκριι"],
 "Midea":["μιντεα","μιντέα","μιδεα","μιντια"], "AUX":["αουξ","αυξ","ωξ","οξ","άουξ"], "Hisense":["χαισενς","χαϊσενς","χισενς","χαισενσ"], "Haier":["χαιερ","χάιερ","χαϊερ","χαιρ"],
 "TCL":["τσλ","τισιελ","τι σι ελ"], "Cooper&Hunter":["κουπερ","κούπερ","κουπερ χαντερ","κουπερ εντ χαντερ","κουπερ και χαντερ","cooper"], "Bosch":["μπος","μποσ"], "Carrier":["καριερ","κάριερ"],
 "Inventor":["ινβεντορ","ινβέντορ","inventor"], "Toyotomi":["τογιοτομι","τογιοτόμι"], "Sendo":["σεντο","σέντο"], "Nexi (by Sendo)":["νεξι","νέξι"],
 "Juro-Pro":["τζουρο","τζούρο","τζουρο προ","juro"], "Morris":["μορις","μόρις"], "Tesla":["τεσλα","τέσλα"], "Pitsos":["πιτσος","πίτσος"], "Equation":["εκουεισιον","equation"],
 "F&U":["εφ εντ γιου","fu"], "Eurolamp":["ευρολαμπ","γιουρολαμπ"], "Primo":["πριμο","πρίμο"], "Philco":["φιλκο","φίλκο"], "Arielli":["αριελι","αριέλι"], "Finlux":["φινλουξ"],
 "Nuvelle":["νουβελ"], "Miyato":["μιγιατο","μιγιάτο"], "Coolstar":["κουλσταρ"], "United":["γιουνάιτεντ","γιουναιτεντ"], "Intercool":["ιντερκουλ"], "Omnys":["ομνις"],
 "Xiaomi":["σιαομι","σιαόμι","ξιαομι"], "Beko":["μπεκο","μπέκο"], "Sharp":["σαρπ","σάρπ"], "Olimpia Splendid":["ολυμπια","ολίμπια","ολυμπια σπλεντιντ","ολιμπια σπλεντιντ"], "Crown":["κραουν"], "Eskimo":["εσκιμο","εσκιμώ"],
 "Izumi":["ιζουμι"], "Kumo":["κουμο"], "Telco":["τελκο"], "Winson":["γουινσον"]
};
function stripAcc(s){ return String(s).toLowerCase().normalize ? String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"") : String(s).toLowerCase(); }
function gr2lat(s){
  s = stripAcc(s);
  var di=[["μπ","b"],["ντ","d"],["γκ","g"],["γγ","g"],["τζ","tz"],["τσ","ts"],["ου","u"],["αι","ai"],["ει","i"],["οι","i"],["ψ","ps"],["ξ","x"],["θ","th"],["χ","h"]];
  di.forEach(function(d){ s = s.split(d[0]).join(d[1]); });
  var m={"α":"a","β":"v","γ":"g","δ":"d","ε":"e","ζ":"z","η":"i","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ο":"o","π":"p","ρ":"r","σ":"s","ς":"s","τ":"t","υ":"i","φ":"f","ω":"o"};
  return s.replace(/[α-ω]/g,function(c){return m[c]||c;});
}
function skel(s){ return s.replace(/[^a-z0-9]/g,"").replace(/[aeiouyhw]/g,""); }

function canon(s){
  s = gr2lat(s).replace(/[^a-z0-9]/g,"");
  s = s.replace(/ph/g,"f").replace(/ck/g,"k").replace(/[cq]/g,"k").replace(/(tz|dz|j)/g,"z").replace(/z/g,"s").replace(/y/g,"i").replace(/ee/g,"i").replace(/w/g,"v");
  return s.replace(/(.)\1+/g,"$1");
}
function lev(a,b){ var m=a.length,n=b.length,d=[],i,j; for(i=0;i<=m;i++){d[i]=[i];} for(j=0;j<=n;j++) d[0][j]=j;
  for(i=1;i<=m;i++) for(j=1;j<=n;j++) d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1)); return d[m][n]; }
function fuzzyHit(ql, names){ // επιστρέφει απόσταση (μικρότερη = καλύτερη) ή -1
  var q = canon(ql); if(q.length<3) return -1;
  var best = -1;
  names.forEach(function(nm){ var t = canon(nm); if(t.length<3) return;
    var lim = Math.max(1, Math.floor(Math.min(q.length,t.length)/4)), d;
    for(var L=Math.max(3,q.length-1); L<=Math.min(t.length,q.length+1); L++){ d=lev(q, t.slice(0,L)); if(d<=lim && (best<0||d<best)) best=d; }
    if(q.length>t.length && t.length>=4){ d=lev(q.slice(0,t.length), t); if(d<=lim && (best<0||d<best)) best=d; }
  });
  return best;
}
function brandMatches(q){
  var qq = stripAcc(q).trim(); if(!qq) return [];
  var ql = gr2lat(qq).replace(/[^a-z0-9]/g,""), qs = skel(ql), out = [];
  BRANDS.forEach(function(b){
    var name = b.n.toLowerCase().replace(/[^a-z0-9]/g,""), words = b.n.toLowerCase().split(/[^a-z0-9]+/), sc = 0;
    if(name.indexOf(ql)===0 && ql) sc = 100;
    else if(words.some(function(w){return ql && w.indexOf(ql)===0;})) sc = 90;
    else if((ALIAS[b.n]||[]).some(function(a){ return stripAcc(a).indexOf(qq)===0 || (ql && gr2lat(a).replace(/[^a-z0-9]/g,"").indexOf(ql)===0); })) sc = 85;
    else if((ALIAS[b.n]||[]).some(function(al){ var x=stripAcc(al); return x.length>=4 && qq.indexOf(x)===0; })) sc = 80;
    else if(ql.length>=2 && qs.length>=2 && skel(name).indexOf(qs)===0) sc = 60;
    else if(ql.length>=3 && name.indexOf(ql)>0) sc = 40;
    else { var fd = fuzzyHit(ql, [b.n].concat(ALIAS[b.n]||[])); if(fd>=0) sc = 50 - fd*5; }
    if(sc && b.n!=="Άλλη μάρκα…") out.push({b:b, s:sc - (b.own?0:1)});
  });
  out.sort(function(x,y){ return y.s-x.s; });
  return out.slice(0,8).map(function(x){return x.b;});
}

var OEM_TIP = "Πώς βρίσκω το εργοστάσιο: στο ταμπελάκι της εξωτερικής κοίτα «Manufacturer / Made by / Κατασκευαστής»: «Ningbo AUX» = AUX, «GD Midea» ή «Midea» = Midea, «Gree Electric Appliances (Zhuhai)» = Gree, «TCL» = TCL, «Hisense» = Hisense, «Haier/Qingdao Haier» = Haier. Βοηθάει και η πλακέτα (λογότυπο/κωδικός), και ο τύπος κωδικού: τετραψήφιοι EH/EL/EC/PC = Midea.";

// ===== state =====
var S = {cat:"split", brand:null, oem:null, q:"", src:"in"};
var LS = {
  get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
};
var saved = LS.get("vl_state", null);
if(saved){ S.cat = saved.cat||"split"; S.brand = saved.brand||null; S.oem = saved.oem||null; S.src = saved.src||"in"; S.part = saved.part||null; }
var myMap = LS.get("vl_mymap", []); // [{brand, prefix, oem, cat}]

function $(id){return document.getElementById(id);}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function brandObj(){ for(var i=0;i<BRANDS.length;i++) if(BRANDS[i].n===S.brand) return BRANDS[i]; return null; }
function persist(){ LS.set("vl_state",{cat:S.cat,brand:S.brand,oem:S.oem,src:S.src,part:S.part}); }

// διαθέσιμες πλατφόρμες για τη μάρκα στην κατηγορία
function candidatesFor(b,cat){ var o=S.cat; S.cat=cat; var r=candidates(b); S.cat=o; return r; }
function candidates(b){
  if(!b) return [];
  if(b.own){ return PLAT[b.own][S.cat] ? [b.own] : []; }
  var c = (b.cands && b.cands[S.cat]) || [];
  return c.filter(function(p){ return PLAT[p] && PLAT[p][S.cat]; });
}
function activeTables(){
  var b = brandObj(); if(!b) return [];
  var cs = candidates(b);
  var plats = b.own ? cs : (S.oem && S.oem!=="__all" && cs.indexOf(S.oem)>=0 ? [S.oem] : cs);
  var out = [];
  var useOut = S.src==="out" && plats.some(function(p){ return OUTP[p] && OUTP[p][S.cat]; });
  activeTables.outMissing = S.src==="out" && !useOut;
  plats.forEach(function(p){
    var list = useOut ? ((OUTP[p] && OUTP[p][S.cat]) || []) : (PLAT[p][S.cat]||[]);
    list.forEach(function(t){ if(T[t]) out.push({plat:p, key:t, tbl:T[t]}); });
  });
  return out;
}

// ===== κανονικοποίηση κωδικών =====
function norm(s){
  s = String(s).toUpperCase().replace(/[\s\-\.\/_:]/g,"");
  s = s.replace(/^CH(?=\d)/,"");             // LG CH05 -> 05
  if(/^E\d{3}$/.test(s)===false && /^C\d{3}$/.test(s)) s = "E"+s.slice(1); // Samsung C101 -> E101
  if(/^\d+$/.test(s) && !(s.length>=3 && s[0]==="0")) s = String(parseInt(s,10)); // 05 -> 5 (όχι συνδυασμοί LED όπως 011)
  s = s.replace(/^([A-Z]+)0+(\d)/, "$1$2");   // E01 -> E1, P03 -> P3
  return s;
}
function isTextQuery(q){ return /[α-ωάέήίόύώΑ-Ωa-z]{3,}/i.test(q) && !/^[A-Za-z]{1,2}\d/.test(q.trim()); }

function search(q){
  var tabs = activeTables(); var res = [];
  if(!q) return {res:res, mode:"none"};
  if(isTextQuery(q)){
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    tabs.forEach(function(t){ t.tbl.codes.forEach(function(c){
      var hay = (c[0].join(" ")+" "+c[1]+" "+c[2]+" "+(c[3]||"")+" "+(c[4]||"")).toLowerCase();
      if(words.every(function(w){return hay.indexOf(w)>=0;})) res.push({t:t,c:c});
    });});
    return {res:res, mode:"text"};
  }
  var n = norm(q);
  function pass(fn){ var r=[]; tabs.forEach(function(t){ t.tbl.codes.forEach(function(c){ if(c[0].some(function(k){return fn(norm(k));})) r.push({t:t,c:c}); }); }); return r; }
  res = pass(function(k){return k===n;});
  // πίνακες «exclusive» (π.χ. LG Therma V): όταν έχουν τον κωδικό, κρύβουν τους υπόλοιπους πίνακες της ίδιας πλατφόρμας
  var ex = {}; res.forEach(function(x){ if(x.t.tbl.exclusive) ex[x.t.plat]=1; });
  res = res.filter(function(x){ return !ex[x.t.plat] || x.t.tbl.exclusive; });
  if(res.length) return {res:res, mode:"exact"};
  if(n.length>2){ var n2=n.slice(0,2); res = pass(function(k){return k===n2;}); if(res.length) return {res:res, mode:"detail", base:n2}; }
  res = pass(function(k){return k.indexOf(n)===0;});
  return {res:res, mode: res.length?"prefix":"none"};
}

// ===== render =====
function renderCats(){
  var b = brandObj(); var av = CATS.filter(function(c){ return !b || candidatesFor(b,c.id).length; });
  if(b && av.length && !av.some(function(c){return c.id===S.cat;})) S.cat = av[0].id;
  $("catwrap").style.display = b ? "" : "none";
  $("cats").innerHTML = av.map(function(c){
    return '<button class="cat'+(c.id===S.cat?' on':'')+'" data-c="'+c.id+'"><span>'+c.icon+'</span>'+esc(c.label)+'</button>';
  }).join("");
}
function renderBrands(){
  var list = BRANDS.slice();
  var own = list.filter(function(b){return b.own;}), reb = list.filter(function(b){return !b.own;});
  function btn(b){ return '<button class="br'+(b.n===S.brand?' on':'')+(b.own?'':' reb')+'" data-b="'+esc(b.n)+'">'+esc(b.n)+'</button>'; }
  $("brands").innerHTML = '<div class="grp">Δικό τους εργοστάσιο</div><div class="bgrid">'+own.map(btn).join("")+'</div>'+
    (reb.length?'<div class="grp">Χωρίς δικό τους εργοστάσιο (θα χρειαστεί μοντέλο/ταμπελάκι)</div><div class="bgrid">'+reb.map(btn).join("")+'</div>':'');
  if(document.activeElement!==$("bq")) $("bq").value = S.brand || "";
  $("bsug").innerHTML = "";
}
function renderOem(){
  var b = brandObj(); var box = $("oembox");
  if(!b){ box.style.display="none"; return; }
  if(b.own){
    box.style.display = "block";
    box.innerHTML = (b.hint ? '<div class="hint">'+esc(b.hint)+'</div>' : "")+
      '<label class="lbl step">③ Μοντέλο (από το ταμπελάκι – προαιρετικό)</label><input id="model" placeholder="π.χ. '+esc(b.n==="LG"?"S12EQ / HU071MR":b.n==="Daikin"?"FTXM35R":b.n==="Gree"?"GWH12ACC-K6DNA1D":"μοντέλο εσωτερικής ή εξωτερικής")+'" autocapitalize="characters" spellcheck="false">'+
      '<div class="small" id="mapMsg">Με το μοντέλο βλέπεις και στοιχεία εξαρτημάτων (Ω, χρώματα) στον «Έλεγχο εξαρτημάτων».</div>';
    var mi0=$("model"); mi0.value=S.model||""; mi0.addEventListener("input",function(){ S.model=mi0.value; });
    return;
  }
  var cs = candidates(b);
  if(S.oem && S.oem!=="__all" && cs.indexOf(S.oem)<0) S.oem=null;
  if(!S.oem) S.oem = cs.length===1 ? cs[0] : "__all";
  box.style.display="block";
  var mine = myMap.filter(function(m){return m.brand===b.n;});
  box.innerHTML =
    (b.hint?'<div class="hint">'+esc(b.hint)+'</div>':'<div class="hint">Η '+esc(b.n)+' δεν έχει δικό της εργοστάσιο. Διάλεξε εργοστάσιο ή άφησε «Σύγκριση» για να δεις τι σημαίνει ο κωδικός σε κάθε πιθανό εργοστάσιο.</div>')+
    '<label class="lbl step">③ Μοντέλο (από το ταμπελάκι)</label>'+
    '<div class="row2"><input id="model" placeholder="π.χ. V5MCI32-12" autocapitalize="characters" spellcheck="false"><button id="saveMap" class="mini">Αποθήκευση</button></div>'+
    '<div id="mapMsg" class="small"></div>'+
    '<label class="lbl">Εργοστάσιο παραγωγής</label>'+
    '<div class="chips">'+(cs.length>1?'<button class="chip'+(S.oem==="__all"?' on':'')+'" data-o="__all">Σύγκριση όλων</button>':'')+
      cs.map(function(p){return '<button class="chip'+(S.oem===p?' on':'')+'" data-o="'+p+'">'+esc(PLAT[p].name)+'</button>';}).join("")+'</div>'+
    '<details class="tip"><summary>Πώς βρίσκω το εργοστάσιο;</summary><p>'+esc(OEM_TIP)+'</p></details>'+
    (mine.length?'<div class="mymap"><div class="small"><b>Οι αντιστοιχίες μου για '+esc(b.n)+':</b></div>'+mine.map(function(m,i){return '<div class="mm"><span>'+esc(m.prefix)+'… → <b>'+esc(PLAT[m.oem]?PLAT[m.oem].name:m.oem)+'</b></span><button class="x" data-del="'+esc(m.prefix)+'">✕</button></div>';}).join("")+'</div>':'');
  var mi = $("model");
  mi.value = S.model||"";
  mi.addEventListener("input", function(){
    S.model = mi.value; var v = mi.value.toUpperCase().replace(/\s/g,"");
    var hit = null;
    myMap.forEach(function(m){ if(m.brand===b.n && v && v.indexOf(m.prefix)===0 && (!hit || m.prefix.length>hit.prefix.length)) hit=m; });
    if(hit && cs.indexOf(hit.oem)>=0){ S.oem = hit.oem; $("mapMsg").textContent = "Βρέθηκε στις αντιστοιχίες σου: "+hit.prefix+"… = "+PLAT[hit.oem].name; markChips(); renderResults(); persist(); }
    else $("mapMsg").textContent = "";
  });
  $("saveMap").addEventListener("click", function(){
    var v = (mi.value||"").toUpperCase().replace(/\s/g,"");
    if(!v){ $("mapMsg").textContent="Γράψε πρώτα το μοντέλο."; return; }
    if(!S.oem || S.oem==="__all"){ $("mapMsg").textContent="Διάλεξε πρώτα εργοστάσιο (όχι «Σύγκριση»)."; return; }
    var pre = v.replace(/[-_].*$/,""); if(pre.length>8) pre = pre.slice(0,8); if(pre.length<2) pre=v;
    myMap = myMap.filter(function(m){return !(m.brand===b.n && m.prefix===pre);});
    myMap.push({brand:b.n, prefix:pre, oem:S.oem});
    LS.set("vl_mymap", myMap);
    renderOem();
    $("mapMsg").textContent = "Αποθηκεύτηκε: "+b.n+" "+pre+"… = "+PLAT[S.oem].name+" (μόνο σε αυτή τη συσκευή).";
  });
}
function markChips(){ var cs=$("oembox").querySelectorAll(".chip"); for(var i=0;i<cs.length;i++){ cs[i].classList.toggle("on", cs[i].getAttribute("data-o")===S.oem); } }

function card(r, showPlat){
  var c = r.c, t = r.t;
  return '<div class="res">'+
    '<div class="rh"><span class="codes">'+(t.tbl.pat ? '<span class="code pat">'+esc(patSym(c[0][0], t.tbl.pat.labels))+'</span>' : c[0].map(function(k){return '<span class="code">'+esc(k)+'</span>';}).join(""))+'</span>'+
    (showPlat?'<span class="plat">'+esc(PLAT[t.plat].name)+'</span>':'')+'</div>'+
    '<div class="rt">'+esc(c[1])+'</div>'+
    (c[4]?'<div class="rl">↔ '+esc(c[4])+'</div>':'')+
    (c[2]?(function(){ var st=stepsOf(c[2]); return st ? '<div class="rd"><b>🔧 Τι ελέγχεις – με τη σειρά:</b><ol class="steps">'+st.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ol></div>' : '<div class="rd"><b>🔧 Τι ελέγχεις:</b> '+esc(c[2])+'</div>'; })():'')+
    (c[3]?'<div class="ro">📟 <b>Πλακέτα εξωτερικής:</b> '+esc(c[3])+'</div>':'')+
    partLinks(c[1]+' '+(c[2]||''))+
    '<div class="rs">'+esc(t.tbl.name)+'</div>'+
  '</div>';
}
function renderResults(){
  var out = $("results"); var b = brandObj();
  if(S.src==="parts"){ renderParts(); return; }
  if(S.src==="sym"){ renderSym(); return; }
  if(!b){ out.innerHTML = '<div class="empty">Διάλεξε κατηγορία και μάρκα.</div>'; $("notes").innerHTML=""; return; }
  var tabs = activeTables();
  if(!tabs.length){ out.innerHTML = '<div class="empty">Δεν υπάρχει ακόμα βλαβολόγιο για '+esc(b.n)+' σε αυτή την κατηγορία.</div>'; $("notes").innerHTML=""; return; }
  var plats = {}; tabs.forEach(function(t){plats[t.plat]=1;}); var multi = Object.keys(plats).length>1;
  var q = S.q.trim();
  var html = "";
  if(S.src==="out"){
    var gp = {}; candidates(b).forEach(function(p){ if(!(b.own || !S.oem || S.oem==="__all" || S.oem===p)) return; if(OUTGUIDE[p]) gp[p]=OUTGUIDE[p]; });
    var gk = Object.keys(gp);
    if(gk.length) html += '<div class="guide">👀 <b>Τι κοιτάς στην πλακέτα:</b>'+gk.map(function(p){ return '<div>'+(gk.length>1?'<b>'+esc(PLAT[p].name)+':</b> ':'')+esc(gp[p])+'</div>'; }).join("")+'</div>';
    var pt = null; tabs.forEach(function(x){ if(!pt && x.tbl.pat) pt = x.tbl.pat; });
    if(pt && !activeTables.outMissing){
      var cur = (S.q.trim().length===pt.n && /^[0-2]+$/.test(S.q.trim())) ? S.q.trim() : new Array(pt.n+1).join("0");
      html += '<div class="patb"><div class="small">Πάτα κάθε LED μέχρι να δείχνει ό,τι βλέπεις (○ σβηστό · ● αναμμένο'+(pt.vals.indexOf(2)>=0?' · ✱ αναβοσβήνει':'')+'):</div><div class="patrow">'+
        pt.labels.map(function(l,i){ var d=cur[i]; return '<button class="pled s'+d+'" data-pi="'+i+'" data-pn="'+pt.n+'" data-pv="'+pt.vals.join("")+'"><span>'+(d==="1"?"●":d==="2"?"✱":"○")+'</span><small>'+esc(l)+'</small></button>'; }).join("")+'</div></div>';
    }
  }
  if(activeTables.outMissing) html += '<div class="small info">📟 Για '+esc(b.n)+' σε αυτή την κατηγορία η πλακέτα της εξωτερικής δείχνει τον ίδιο κωδικό με το χειριστήριο/εσωτερική (ή δεν υπάρχει ξεχωριστός πίνακας) – ψάχνεις στο κανονικό βλαβολόγιο.</div>';
  else if(S.src==="out") html += '<div class="small info">📟 Αναζήτηση με κωδικό/αναλαμπές της πλακέτας εξωτερικής.</div>';
  if(!q){
    html += '<div class="empty">'+(S.src==="out"?'Γράψε αναλαμπές (π.χ. 5) ή συνδυασμό LED (π.χ. 221: 0 σβηστό, 1 αναμμένο, 2 αναβοσβήνει) – ή πάτα τα LED παραπάνω. ':'')+'Γράψε τον κωδικό βλάβης (π.χ. E1, CH05, U4, 1302) ή μια λέξη (π.χ. «επικοινωνία»).</div>';
  } else {
    var r = search(q);
    if(r.mode==="none"){
      html += '<div class="empty">Ο κωδικός «'+esc(q)+'» δεν βρέθηκε για '+esc(b.n)+(multi?' (σε κανένα πιθανό εργοστάσιο)':'')+'.<br><span class="small">Έλεγξε κατηγορία μονάδας, γράμματα/αριθμούς (0 ↔ O, 1 ↔ I), ή αν η οθόνη δείχνει θερμοκρασία και όχι κωδικό.</span></div>';
    } else {
      if(r.mode==="detail") html += '<div class="small info">Εμφανίζεται ο βασικός κωδικός '+esc(r.base)+' (ο υπόλοιπος αριθμός είναι λεπτομέρεια/μονάδα).</div>';
      if(r.mode==="prefix") html += '<div class="small info">Κωδικοί που ξεκινούν με «'+esc(q.toUpperCase())+'»:</div>';
      if(multi && r.mode!=="text"){
        var by = {}; r.res.forEach(function(x){ (by[x.t.plat]=by[x.t.plat]||[]).push(x); });
        var missing = Object.keys(plats).filter(function(p){return !by[p];});
        html += '<div class="small info">⚠️ Το εργοστάσιο δεν έχει επιλεγεί – ο ίδιος κωδικός σημαίνει διαφορετικά πράγματα ανά εργοστάσιο:</div>';
        Object.keys(by).forEach(function(p){ html += '<div class="pgrp">Αν είναι <b>'+esc(PLAT[p].name)+'</b>:</div>' + by[p].map(function(x){return card(x,false);}).join(""); });
        if(missing.length) html += '<div class="small">Δεν υπάρχει στο βλαβολόγιο: '+missing.map(function(p){return PLAT[p].name;}).join(", ")+'.</div>';
      } else {
        html += r.res.slice(0,60).map(function(x){return card(x,multi);}).join("");
      }
    }
  }
  out.innerHTML = html;
  // σημειώσεις & πλήρης λίστα
  var seen={}, nh="";
  tabs.forEach(function(t){ if(seen[t.key]) return; seen[t.key]=1;
    nh += '<details class="note"><summary>📘 '+esc(t.tbl.name)+' – τιμές & όλοι οι κωδικοί ('+t.tbl.codes.length+')</summary>'+
      '<p>'+esc(t.tbl.note)+'</p>'+(OUTNOTE[t.key]?'<p>📟 '+esc(OUTNOTE[t.key])+'</p>':'')+'<p class="small">Πηγή: '+esc(t.tbl.src)+'</p>'+
      '<div class="all">'+t.tbl.codes.map(function(c){return '<div class="ar" data-q="'+esc(c[0][0])+'"><span class="code">'+esc(c[0].join(" / "))+'</span> '+esc(c[1])+'</div>';}).join("")+'</div></details>';
  });
  $("notes").innerHTML = nh;
}
// ===== ΕΛΕΓΧΟΣ ΕΞΑΡΤΗΜΑΤΩΝ =====
var PKEYS = [
  ["pswitch", /πιεσοστ|πρεσοστ|πίεσ[ηςεω][^.]{0,25}αισθητ|αισθητ[^.]{0,25}πίεσ|63H/i],
  ["sensor", /αισθητ|θερμίστορ|thermistor/i],
  ["fan", /ανεμιστ|μοτέρ ανεμ/i],
  ["eev", /εκτονωτ|EEV|LEV/],
  ["fourway", /4-?οδη|τετράοδ|4οδ/i],
  ["ipm", /IPM|PFC|γέφυρ/],
  ["comp", /συμπιεστ/i]
];
function partById(id){ for(var i=0;i<PARTS.length;i++) if(PARTS[i].id===id) return PARTS[i]; return null; }
function partLinks(txt){
  var ids = [];
  PKEYS.forEach(function(k){ if(ids.length<3 && k[1].test(txt) && !(k[0]==="sensor" && ids.indexOf("pswitch")>=0 && !/θερμ/i.test(txt))) ids.push(k[0]); });
  if(!ids.length) return "";
  return '<div class="plinks">'+ids.map(function(id){ var p=partById(id); return '<button class="plk" data-gopart="'+id+'">'+p.icon+' Πώς μετράω: '+esc(p.name)+'</button>'; }).join("")+'</div>';
}
function partPlats(){
  var b = brandObj(); if(!b) return [];
  if(b.own) return [b.own];
  var cs = candidates(b);
  if(S.oem && S.oem!=="__all" && cs.indexOf(S.oem)>=0) return [S.oem];
  return cs;
}
var meas = LS.get("vl_meas", []);
function mkey(v){ return String(v||"").toUpperCase().replace(/\s/g,""); }
function rAt(s, T){
  if(s.p){
    var p = s.p, i;
    for(i=0;i<p.length-1;i++){ if(T>=p[i][0] && T<=p[i+1][0]){ var f=(T-p[i][0])/(p[i+1][0]-p[i][0]); return Math.exp(Math.log(p[i][1])+f*(Math.log(p[i+1][1])-Math.log(p[i][1]))); } }
    var a = T<p[0][0] ? p[0] : p[p.length-1], c = T<p[0][0] ? p[1] : p[p.length-2];
    var B = s.b || (p.length>1 ? Math.log(c[1]/a[1])/(1/(c[0]+273.15)-1/(a[0]+273.15)) : 3950);
    return a[1]*Math.exp(B*(1/(T+273.15)-1/(a[0]+273.15)));
  }
  return s.r*Math.exp(s.b*(1/(T+273.15)-1/(s.t+273.15)));
}
function fmtk(v){ return v>=100 ? v.toFixed(0) : v>=10 ? v.toFixed(1) : v.toFixed(2); }
function sensList(){
  var pl = partPlats(), L = [], src = [];
  pl.forEach(function(p){ var d = PSENS[p]; if(!d) return; d.list.forEach(function(x){ L.push({lab:(pl.length>1?PLAT[p].name+' – ':'')+x[0], s:x[1]}); }); src.push(d); });
  if(!L.length) PSENS_GENERIC.forEach(function(x){ L.push({lab:'Γενικό NTC '+x[0], s:x[1]}); });
  return {L:L, src:src};
}
function calcSens(){
  var box = $("pcalc"); if(!box) return;
  var sl = sensList(), i = +($("psel").value||0), it = sl.L[i] || sl.L[0];
  var T = parseFloat(String($("ptemp").value).replace(",",".")), M = parseFloat(String($("pmeas").value).replace(",","."));
  if(isNaN(T)){ box.innerHTML='<div class="small">Γράψε θερμοκρασία.</div>'; return; }
  var r = rAt(it.s, T), lo = r*(1-it.s.tol/100), hi = r*(1+it.s.tol/100);
  var h = '<div class="pexp">Αναμενόμενο στους '+T+'°C: <b>'+fmtk(r)+' kΩ</b><br><span class="small">Αποδεκτό: '+fmtk(lo)+' – '+fmtk(hi)+' kΩ ('+(it.s.ok?'από πίνακα manual':'≈ υπολογισμός, τυπική τιμή')+')</span></div>';
  if(!isNaN(M)){
    var ok = M>=lo && M<=hi, near = M>=r*0.8 && M<=r*1.25;
    h += '<div class="pver '+(ok?'good':near?'mid':'bad')+'">'+(ok?'✅ Εντάξει – μέσα στα όρια.':near?'⚠️ Λίγο έξω από τα όρια – ξαναμέτρα θερμοκρασία (θερμόμετρο επαφής στο σημείο) και κούνα το καλώδιο.':(M<0.05?'❌ Σχεδόν 0 → βραχυκύκλωμα.':'❌ Πολύ έξω από τα όρια → ελαττωματικό ή λάθος τύπος αισθητηρίου.'))+'</div>';
  }
  box.innerHTML = h;
}
function renderMine(){
  var el = $("pmine"); if(!el) return;
  var k = mkey(S.model), b = brandObj(), mine = meas.filter(function(m){ return k && m.m===k; });
  el.innerHTML = (k ? (mine.length ? '<div class="small"><b>📒 Οι μετρήσεις μου για '+esc(k)+':</b></div>'+mine.map(function(m){ var p=partById(m.part); return '<div class="mm"><span>'+(p?p.icon+' ':'')+esc(m.v)+' <span class="small">· '+esc(m.d)+'</span></span><button class="x" data-mdel="'+m.id+'">✕</button></div>'; }).join("") : '<div class="small">Δεν έχεις αποθηκεύσει ακόμα μετρήσεις για '+esc(k)+'. Όταν μετρήσεις ένα καλό εξάρτημα, γράψε την τιμή παρακάτω για να την έχεις την επόμενη φορά.</div>') : '<div class="small">Γράψε το μοντέλο από το ταμπελάκι για να δεις/κρατήσεις τις δικές σου μετρήσεις.</div>');
  var info = $("pplat"); if(!info) return;
  var pl = partPlats();
  info.innerHTML = !b ? 'Διάλεξε μάρκα πάνω για τιμές από τα manuals της (αλλιώς βλέπεις γενικές οδηγίες).' :
    (pl.length===1 ? 'Τιμές για: <b>'+esc(PLAT[pl[0]].name)+'</b>'+(b.own?'':' (εργοστάσιο της '+esc(b.n)+')') :
     '⚠️ Η '+esc(b.n)+' δεν έχει δικό της εργοστάσιο: διάλεξε «Εργοστάσιο παραγωγής» πάνω (ή γράψε μοντέλο που έχεις αποθηκεύσει) για να δεις τις σωστές τιμές.');
}
function applyModel(v){
  S.model = v; var b = brandObj(); if(!b || b.own) return false;
  var cs = candidates(b), u = mkey(v), hit = null;
  myMap.forEach(function(m){ if(m.brand===b.n && u && u.indexOf(m.prefix)===0 && (!hit || m.prefix.length>hit.prefix.length)) hit=m; });
  if(hit && cs.indexOf(hit.oem)>=0 && S.oem!==hit.oem){ S.oem = hit.oem; markChips(); persist(); return true; }
  return false;
}

function modelInfo(){
  var k = mkey(S.model), pl = partPlats(), hits = [];
  PMODELS.forEach(function(e){ if((e.re && k && e.re.test(k)) || (!e.re && e.plat && pl.indexOf(e.plat)>=0)) hits.push(e); });
  return hits;
}
function renderModelBox(){
  var el = $("pmodelinfo"); if(!el) return;
  var hits = modelInfo(), k = mkey(S.model);
  if(!hits.length){ el.innerHTML = k ? '<div class="small">Για «'+esc(k)+'» δεν έχω ακόμα καταχωρημένα στοιχεία από manual – δες τις γενικές οδηγίες του εξαρτήματος και κράτα τη μέτρησή σου παρακάτω.</div>' : ''; return; }
  el.innerHTML = hits.map(function(e){
    var its = e.it.slice().sort(function(a,b){ return (b[0]===S.part)-(a[0]===S.part); });
    return '<div class="pmod"><div class="pst">📋 '+esc(e.n)+'</div>'+its.map(function(x){ var p=partById(x[0]); return '<div class="pmi'+(x[0]===S.part?' hl':'')+'">'+(p?p.icon+' ':'')+esc(x[1])+'</div>'; }).join("")+'<div class="small">Πηγή: '+esc(e.src)+'</div></div>';
  }).join("");
}
function compLookup(){
  var el = $("pcompres"); if(!el) return;
  var v = mkey($("pcomp").value).replace(/[^A-Z0-9\-]/g,""); if(!v){ el.innerHTML=""; return; }
  var hit = null; Object.keys(COMPDB).forEach(function(c){ if(!hit && (c===v || c.replace(/-/g,"")===v.replace(/-/g,""))) hit=c; });
  if(!hit) Object.keys(COMPDB).forEach(function(c){ if(!hit && v.length>=6 && c.replace(/-/g,"").indexOf(v.replace(/-/g,""))===0) hit=c; });
  el.innerHTML = hit ? '<div class="pver good">'+esc(hit)+' ('+esc(COMPDB[hit][1])+'): U-V = V-W = W-U ≈ <b>'+esc(COMPDB[hit][0])+'</b></div>' : '<div class="small">Δεν τον έχω στη λίστα – μέτρα τα 3 ζεύγη: πρέπει να είναι ίδια μεταξύ τους.</div>';
}
// ===== Οδηγός ανεμιστήρα =====
var fanCol = LS.get("vl_fancol", {});
function fanKnown(){
  var k = mkey(S.model), pl = partPlats(), r = [];
  FANKNOWN.forEach(function(e){ if((e.re && k && e.re.test(k)) || (!e.re && e.plat && pl.indexOf(e.plat)>=0)) r.push(e); });
  return r;
}
function fanN(t){ return t==="dc5"?5 : t==="uvw"?3 : t==="uvwh"?8 : t==="two"?6 : 5; }
function fanLabels(t){
  if(t==="uvwh") return ["Φίσα 3 – καλ.1","Φίσα 3 – καλ.2","Φίσα 3 – καλ.3","Hall – καλ.1","Hall – καλ.2","Hall – καλ.3","Hall – καλ.4","Hall – καλ.5"];
  if(t==="two") return ["Ισχύος – καλ.1","Ισχύος – καλ.2","Σήματος – καλ.1","Σήματος – καλ.2","Σήματος – καλ.3","Σήματος – καλ.4"];
  var a=[]; for(var i=1;i<=fanN(t);i++) a.push("Καλώδιο "+i); return a;
}
function fkey(){ return mkey(S.model)+"|"+(S.fw||"out")+"|"+S.ft; }
function colJudge(t, cols){
  var c = cols.filter(function(x){return x;});
  if(t==="uvw") return '✅ Στα 3 καλώδια U-V-W το χρώμα δεν αλλάζει τη μέτρηση: είναι 3 ίδιες περιελίξεις. Μέτρα τα 3 ζεύγη.';
  if(t==="dc5"){
    if(c.length<5) return 'Διάλεξε και τα 5 χρώματα.';
    var used={}, unk=[], map=[];
    c.forEach(function(x){ if(DC5STD[x] && !used[DC5STD[x]]){ used[DC5STD[x]]=1; map.push('<b>'+esc(x)+'</b> = '+esc(DC5STD[x])); } else unk.push(x); });
    if(!unk.length && used["Vm ~310V"] && used["GND"] && used["Vcc 15V"]) return '✅ Τα χρώματα ταιριάζουν με τη συνηθισμένη κωδικοποίηση DC μοτέρ:<br>'+map.join('<br>')+'<br><span class="small">Επιβεβαίωσέ το με την 1η μέτρηση: Κόκκινο–Μαύρο πρέπει να δείξει ~310V και Άσπρο–Μαύρο ~15V.</span>';
    return '⚠️ Τα χρώματα '+(unk.length?'('+esc(unk.join(", "))+') ':'')+'δεν ταιριάζουν με τη συνηθισμένη κωδικοποίηση – βρίσκουμε τι είναι το καθένα με μέτρηση:<br>1) Δώσε ρεύμα (φίσα κουμπωμένη, μετράς από πίσω), πολύμετρο σε V DC.<br>2) Βάλε τον μαύρο ακροδέκτη σε ένα καλώδιο και τον κόκκινο διαδοχικά στα άλλα. Όταν σε ένα δεις ~310V και σε άλλο ~15V, ο μαύρος σου είναι στο <b>GND</b>.<br>3) Το καλώδιο με ~310V = <b>Vm</b>, με ~15V = <b>Vcc</b>.<br>4) Δώσε εντολή λειτουργίας: όποιο από τα 2 υπόλοιπα δείχνει σταθερή τάση 1–6V = <b>Vsp</b>, όποιο τρεμοπαίζει/αλλάζει όταν γυρνάει = <b>FG</b>.<br>Γράψε τις τάσεις παρακάτω για να κρίνω.';
  }
  if(t==="uvwh"){
    var h = cols.slice(3).filter(function(x){return x;}), std = {"Πορτοκαλί":"Hu","Γκρι":"Hv","Άσπρο":"Hw","Ροζ":"Vcc +5V","Μαύρο":"GND"};
    var ok = h.length===5 && h.every(function(x){return std[x];});
    return '✅ Φίσα 3 καλωδίων: το χρώμα δεν παίζει ρόλο (3 ίδιες περιελίξεις).<br>'+(ok ? '✅ Φίσα Hall: '+h.map(function(x){return '<b>'+esc(x)+'</b>='+std[x];}).join(', ')+' (κωδικοποίηση Midea).' : '⚠️ Φίσα Hall: δεν αναγνωρίζω τα χρώματα. Με ρεύμα, βρες το ζεύγος που δείχνει ~5V DC: αυτά είναι <b>Vcc</b> (+) και <b>GND</b>. Τα άλλα 3 είναι Hu/Hv/Hw – η σειρά τους δεν παίζει ρόλο στη μέτρηση.');
  }
  if(t==="two") return 'Φίσα ισχύος: με ρεύμα πρέπει να δει ~280–380V DC ανάμεσα στα 2 καλώδια (συνήθως Κόκκινο + και Μαύρο −). Φίσα σήματος: βρες το ζεύγος με ~5V DC (τροφοδοσία + γείωση σήματος)· από τα υπόλοιπα, όποιο έχει σταθερή/PWM τάση όταν ζητάει να γυρίσει = εντολή, όποιο τρεμοπαίζει όταν γυρνάει = FG.';
  if(t==="ac") return 'Στο AC μοτέρ βρίσκουμε τα καλώδια με μέτρηση Ω (χωρίς ρεύμα): γράψε παρακάτω τις τιμές και θα σου πω ποιο είναι το κοινό.';
  return '';
}
function num(id){ var e=$(id); if(!e) return NaN; return parseFloat(String(e.value).replace(",",".")); }
function fanVerdict(){
  var el = $("fverd"); if(!el) return;
  var t = S.ft, kn = fanKnown().filter(function(e){return e.t===t && e.w===(S.fw||"out");})[0], out = [];
  function pairCheck(){
    var a=num("fr1"), b=num("fr2"), c=num("fr3");
    if(isNaN(a)||isNaN(b)||isNaN(c)) return '';
    var mx=Math.max(a,b,c), mn=Math.min(a,b,c), g=$("fgnd")?$("fgnd").value:"";
    var r = '';
    if(mn<0.5) r += '<div class="pver bad">❌ Μία μέτρηση ~0Ω → βραχυκυκλωμένη περιέλιξη → αλλαγή μοτέρ.</div>';
    else if(mx>2000) r += '<div class="pver bad">❌ Τιμή σε kΩ/OL → κομμένη περιέλιξη → αλλαγή μοτέρ.</div>';
    else if(mx/mn>1.1) r += '<div class="pver bad">❌ Οι 3 τιμές διαφέρουν πάνω από 10% ('+mn+'–'+mx+'Ω) → χαλασμένη περιέλιξη → αλλαγή μοτέρ.</div>';
    else if(kn && kn.ohm && (mn<kn.ohm[0]*0.9 || mx>kn.ohm[1]*1.1)) r += '<div class="pver mid">⚠️ Ίσες μεταξύ τους αλλά έξω από το '+kn.ohm[0]+'–'+kn.ohm[1]+'Ω του manual. Ξαναμέτρα (αφαίρεσε την αντίσταση των ακροδεκτών, φτερωτή ακίνητη).</div>';
    else r += '<div class="pver good">✅ Περιελίξεις εντάξει: ίσες μεταξύ τους'+(kn&&kn.ohm?' και μέσα στο '+kn.ohm[0]+'–'+kn.ohm[1]+'Ω':'')+'.</div>';
    if(g==="val") r += '<div class="pver bad">❌ Διαρροή προς γείωση → αλλαγή μοτέρ.</div>';
    return r;
  }
  if(t==="uvw" || t==="uvwh"){
    out.push(pairCheck());
    if(t==="uvwh"){ var vh=num("fvh"), tg=$("fhall")?$("fhall").value:"";
      if(!isNaN(vh)) out.push(vh<4||vh>5.5 ? '<div class="pver bad">❌ Τροφοδοσία Hall '+vh+'V (πρέπει ~5V) → πρόβλημα πλακέτας ή βραχυκύκλωμα Hall.</div>' : '<div class="pver good">✅ Τροφοδοσία Hall εντάξει (~5V).</div>');
      if(tg==="no") out.push('<div class="pver bad">❌ Κάποιο Hall δεν αλλάζει 0↔5V όταν γυρνάς τη φτερωτή → χαλασμένος αισθητήρας Hall → αλλαγή μοτέρ.</div>');
      if(tg==="yes") out.push('<div class="pver good">✅ Hall εντάξει.</div>');
    }
    if(out.join("").indexOf("bad")<0 && out.join("").indexOf("good")>=0) out.push('<div class="small">Αν όλα είναι εντάξει και η φτερωτή γυρνάει ελεύθερα αλλά ο ανεμιστήρας δεν ξεκινάει → φταίει το κύκλωμα οδήγησης στην πλακέτα.</div>');
  }
  if(t==="dc5" || t==="two"){
    var vm=num("fvm"), vc=num("fvc"), vs=num("fvs"), rot=$("frot")?$("frot").value:"";
    if(!isNaN(vm)) out.push(vm<200 ? '<div class="pver bad">❌ Δεν έρχονται ~310V στο μοτέρ ('+vm+'V) → πρόβλημα πλακέτας/ασφάλειας, όχι μοτέρ.</div>' : '<div class="pver good">✅ Vm '+vm+'V εντάξει.</div>');
    if(!isNaN(vc)){ var lo=t==="two"?4:12, hi=t==="two"?5.6:18; out.push(vc<lo||vc>hi ? '<div class="pver bad">❌ Τροφοδοσία ελέγχου '+vc+'V (πρέπει ~'+(t==="two"?'5':'15')+'V) → πλακέτα (ή βραχυκυκλωμένο μοτέρ που τη ρίχνει – δοκίμασε με τη φίσα έξω).</div>' : '<div class="pver good">✅ Τροφοδοσία ελέγχου εντάξει.</div>'); }
    if(!isNaN(vs)) out.push(vs<0.5 ? '<div class="pver mid">⚠️ Η εντολή στροφών είναι ~0V → η πλακέτα δεν ζητάει να γυρίσει (δες αν πράγματι έχει εντολή λειτουργίας / σφάλμα).</div>' : '<div class="pver good">✅ Η πλακέτα δίνει εντολή ('+vs+'V).</div>');
    if(rot==="no" && vm>=200 && ((t==="dc5"&&vc>=12&&vc<=18)||(t==="two"&&vc>=4&&vc<=5.6)) && vs>=0.5) out.push('<div class="pver bad">❌ Έχει τροφοδοσία ΚΑΙ εντολή αλλά δεν γυρνάει → χαλασμένο μοτέρ (έλεγξε πρώτα ότι η φτερωτή γυρνάει ελεύθερα με το χέρι).</div>');
    if(rot==="yes") out.push('<div class="pver good">✅ Γυρνάει. Αν βγάζει σφάλμα στροφών, μέτρα το FG: πρέπει να τρεμοπαίζει όσο γυρνάει. Αν μένει σταθερό → μοτέρ (έξοδος FG).</div>');
  }
  if(t==="ac"){
    var a=num("fr1"), b=num("fr2"), c=num("fr3"), cm=num("fcap"), cr=num("fcapr");
    if(!isNaN(a)&&!isNaN(b)&&!isNaN(c)){
      var L=[[a,"1–2","3"],[b,"2–3","1"],[c,"1–3","2"]].sort(function(x,y){return y[0]-x[0];});
      var sum=L[1][0]+L[2][0], ok=Math.abs(sum-L[0][0])/L[0][0]<0.1;
      if(Math.min(a,b,c)<0.5) out.push('<div class="pver bad">❌ ~0Ω → βραχυκύκλωμα περιέλιξης.</div>');
      else if(L[0][0]>5000) out.push('<div class="pver bad">❌ OL/kΩ πολύ μεγάλο → κομμένη περιέλιξη (ή κομμένο θερμικό μέσα στο μοτέρ – άφησέ το να κρυώσει και ξαναμέτρα).</div>');
      else out.push((ok?'<div class="pver good">✅ ':'<div class="pver mid">⚠️ ')+'Μεγαλύτερη τιμή στο ζεύγος '+L[0][1]+' ('+L[0][0]+'Ω) → <b>κοινό = καλώδιο '+L[0][2]+'</b>. Οι άλλες δύο κάνουν '+sum.toFixed(1)+'Ω '+(ok?'= περίπου ίσο με τη μεγαλύτερη → περιελίξεις εντάξει.':'– δεν βγαίνει το άθροισμα· αν έχει ταχύτητες (4–5 καλώδια) μέτρα κάθε καλώδιο προς το κοινό.')+'</div>');
    }
    if(!isNaN(cm)&&!isNaN(cr)) out.push(Math.abs(cm-cr)/cr<=0.1 ? '<div class="pver good">✅ Πυκνωτής εντάξει ('+cm+' από '+cr+'μF).</div>' : '<div class="pver bad">❌ Πυκνωτής '+cm+'μF αντί '+cr+'μF (>10% διαφορά) → αλλαγή πυκνωτή.</div>');
  }
  el.innerHTML = out.join("");
}
function fanWizard(){
  var kn = fanKnown(), w = S.fw||"out";
  var h = '<div class="pcalcw"><div class="lbl">🧭 Βήμα 1 – Ποιος ανεμιστήρας;</div><div class="pchips">'+
    [["out","Εξωτερικής"],["in","Εσωτερικής"]].map(function(x){return '<button class="pc'+(w===x[0]?' on':'')+'" data-fw="'+x[0]+'">'+x[1]+'</button>';}).join("")+'</div>';
  var sug = kn.filter(function(e){return e.w===w;});
  h += '<div class="lbl">Βήμα 2 – Τι φίσα έχει το μοτέρ;</div>';
  if(sug.length) h += '<div class="pext">📘 Για αυτό το μοντέλο το manual λέει: <b>'+esc(FTYPES.filter(function(f){return f[0]===sug[0].t;})[0][1])+'</b>. Αν βλέπεις κάτι άλλο, διάλεξε αυτό που βλέπεις.</div>';
  h += '<div class="ftypes">'+FTYPES.map(function(f){return '<button class="pc'+(S.ft===f[0]?' on':'')+'" data-ft="'+f[0]+'"><b>'+esc(f[1])+'</b><br><span class="small">'+esc(f[2])+'</span></button>';}).join("")+'</div>';
  if(S.ft){
    var e = sug.filter(function(x){return x.t===S.ft;})[0];
    h += '<div class="lbl">Βήμα 3 – Χρώματα καλωδίων</div>';
    if(e && (e.col || e.cap)){
      if(e.col) h += '<div class="pext">📘 Από το manual:<br>'+e.col.map(function(c){return '<b>'+esc(c[0])+'</b> = '+esc(c[1]);}).join('<br>')+(e.hall?'<br><b>Φίσα Hall:</b> '+e.hall.map(function(c){return '<b>'+esc(c[0])+'</b>='+esc(c[1]);}).join(', '):'')+(e.ohm?'<br>Τιμή περιέλιξης: <b>'+e.ohm[0]+'–'+e.ohm[1]+'Ω</b> σε κάθε ζεύγος':'')+'<br><span class="small">Πηγή: '+esc(e.src)+'</span></div>';
      if(e.cap) h += '<div class="pext">📘 Από το manual: AC μοτέρ με πυκνωτή <b>'+e.cap+'μF</b>. Πηγή: '+esc(e.src)+'</div>';
    } else {
      var saved = fanCol[fkey()] || [];
      h += '<div class="small">'+(e&&e.pins?'📘 Manual: μέτρα '+esc(e.pins)+(e.ohm?' = <b>'+e.ohm[0]+'–'+e.ohm[1]+'Ω</b>':'')+'. ':'')+'Δεν βρήκα χρώματα στο manual'+(S.model?' για '+esc(mkey(S.model)):'')+'. Γράψε τα χρώματα που βλέπεις, με τη σειρά στη φίσα:</div><div class="fcols">'+
        fanLabels(S.ft).map(function(l,i){ return '<label>'+esc(l)+'<select data-fc="'+i+'"><option value="">—</option>'+FCOLORS.map(function(c){return '<option'+(saved[i]===c?' selected':'')+'>'+c+'</option>';}).join("")+'</select></label>'; }).join("")+'</div><div id="fcj" class="pext"></div>';
    }
    h += '<div class="lbl">Βήμα 4 – Μέτρηση</div>';
    var ins = '';
    if(S.ft==="uvw"||S.ft==="uvwh"||S.ft==="ac"){
      ins += '<div class="small">'+(S.ft==="ac"?'Χωρίς ρεύμα, φίσα έξω, πολύμετρο σε Ω. Μέτρα 1–2, 2–3, 1–3 (αριθμός = σειρά καλωδίου όπως τα έγραψες).':'Χωρίς ρεύμα (DC < 5V στους πυκνωτές), φίσα U-V-W έξω, φτερωτή ακίνητη, πολύμετρο σε Ω. Μέτρα τα 3 ζεύγη:')+'</div>'+
        '<div class="row3"><label>'+(S.ft==="ac"?'1–2':'Ζεύγος 1')+' Ω<input id="fr1" inputmode="decimal"></label><label>'+(S.ft==="ac"?'2–3':'Ζεύγος 2')+' Ω<input id="fr2" inputmode="decimal"></label><label>'+(S.ft==="ac"?'1–3':'Ζεύγος 3')+' Ω<input id="fr3" inputmode="decimal"></label></div>';
      if(S.ft!=="ac") ins += '<label class="small">Κάθε καλώδιο προς σασί/άξονα:<select id="fgnd"><option value="">—</option><option value="ol">OL (άπειρο)</option><option value="val">Δείχνει τιμή</option></select></label>';
      if(S.ft==="uvwh") ins += '<div class="small" style="margin-top:6px">Φίσα Hall κουμπωμένη, ρεύμα ON, μηχάνημα σβηστό: μαύρος ακροδέκτης στο GND.</div><div class="row3"><label>Vcc Hall (V)<input id="fvh" inputmode="decimal" placeholder="~5"></label><label>Hu/Hv/Hw αλλάζουν 0↔5V όταν γυρνάς αργά τη φτερωτή;<select id="fhall"><option value="">—</option><option value="yes">Ναι, και τα 3</option><option value="no">Όχι, κάποιο μένει σταθερό</option></select></label></div>';
      if(S.ft==="ac") ins += '<div class="row3"><label>Πυκνωτής ετικέτα μF<input id="fcapr" inputmode="decimal" value="'+((e&&e.cap)||"")+'"></label><label>Μέτρησα μF<input id="fcap" inputmode="decimal"></label></div>';
    } else {
      ins += '<div class="small">Φίσα κουμπωμένη, μετράς από την πίσω μεριά της φίσας, ρεύμα ON και εντολή λειτουργίας. Πολύμετρο σε V DC, μαύρος ακροδέκτης στο GND.</div>'+
        '<div class="row3"><label>Vm (V)<input id="fvm" inputmode="decimal" placeholder="~310"></label><label>'+(S.ft==="two"?'Τροφ. σήματος (V)':'Vcc (V)')+'<input id="fvc" inputmode="decimal" placeholder="'+(S.ft==="two"?'~5':'~15')+'"></label><label>Εντολή Vsp (V)<input id="fvs" inputmode="decimal" placeholder="1–6"></label></div>'+
        '<label class="small">Γυρνάει ο ανεμιστήρας;<select id="frot"><option value="">—</option><option value="yes">Ναι</option><option value="no">Όχι</option></select></label>';
    }
    h += ins + '<div id="fverd"></div>';
  }
  return h+'</div>';
}
function fanColsUpdate(){
  var sels = document.querySelectorAll("[data-fc]"); if(!sels.length) return;
  var cols = []; for(var i=0;i<sels.length;i++) cols[+sels[i].getAttribute("data-fc")] = sels[i].value;
  if(mkey(S.model)){ fanCol[fkey()] = cols; LS.set("vl_fancol", fanCol); }
  var el = $("fcj"); if(el) el.innerHTML = colJudge(S.ft, cols);
}
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-fw],[data-ft]"); if(!el) return;
  if(el.hasAttribute("data-fw")) S.fw = el.getAttribute("data-fw");
  if(el.hasAttribute("data-ft")) S.ft = el.getAttribute("data-ft");
  renderParts(); fanColsUpdate();
});
document.addEventListener("change", function(e){ if(e.target.hasAttribute && e.target.hasAttribute("data-fc")) fanColsUpdate(); if(/^(fgnd|fhall|frot)$/.test(e.target.id)) fanVerdict(); });
document.addEventListener("input", function(e){ if(/^(fr1|fr2|fr3|fvh|fvm|fvc|fvs|fcap|fcapr)$/.test(e.target.id)) fanVerdict(); });

// ===== Οδηγοί μέτρησης με κρίση (όλα τα εξαρτήματα) =====
function knownVal(key){
  var k = mkey(S.model), pl = partPlats(), v = null;
  PMODELS.forEach(function(e){ if(!v && e.re && k && e.re.test(k) && e[key]) v = e[key]; });
  if(!v) pl.forEach(function(p){ if(!v && PLATVAL[p] && PLATVAL[p][key]) v = PLATVAL[p][key]; });
  return v;
}
function nv(id){ return num(id); }
function inp(id,lab,ph){ return '<label>'+esc(lab)+'<input id="'+id+'" class="mv" inputmode="decimal"'+(ph?' placeholder="'+esc(ph)+'"':'')+'></label>'; }
function sel(id,lab,opts){ return '<label class="small">'+esc(lab)+'<select id="'+id+'" class="mv"><option value="">—</option>'+opts.map(function(o){return '<option value="'+o[0]+'">'+esc(o[1])+'</option>';}).join("")+'</select></label>'; }
function V(cls,txt){ return '<div class="pver '+cls+'">'+txt+'</div>'; }
function balance(vals, range, unit){
  var v = vals.filter(function(x){return !isNaN(x);}); if(v.length<vals.length) return '';
  var mx=Math.max.apply(null,v), mn=Math.min.apply(null,v), u=unit||'Ω';
  if(mn<=0.05 && !(range && range[1]<1)) return V('bad','❌ Μία τιμή ~0'+u+' → βραχυκύκλωμα.');
  if(mx>=1e6) return V('bad','❌ Μία τιμή είναι OL/άπειρο → κομμένη περιέλιξη.');
  if(mx/mn>1.1) return V('bad','❌ Οι τιμές διαφέρουν πάνω από 10% ('+mn+'–'+mx+u+') → χαλασμένη περιέλιξη.');
  if(range && (mn<range[0]*0.9 || mx>range[1]*1.1)) return V('mid','⚠️ Ίσες μεταξύ τους, αλλά έξω από το '+range[0]+'–'+range[1]+u+'. Ξαναμέτρα (αφαίρεσε την αντίσταση των ακροδεκτών, σωστή θέση πολύμετρου).');
  return V('good','✅ Εντάξει: ίσες μεταξύ τους'+(range?' και μέσα στο '+range[0]+'–'+range[1]+u:'')+'.');
}
var MEAS = {
 comp:{
  form:function(){
    var r = knownVal("compOhm");
    return sel("mtype","Τι συμπιεστής είναι;",[["inv","Inverter – 3 καλώδια U/V/W από την πλακέτα"],["onoff","On/Off – ακροδέκτες C/S/R με πυκνωτή"]])+
      '<div id="msub"></div>'+(r?'<div class="pext">📘 Αναμενόμενη τιμή για αυτό το μοντέλο: <b>'+r[0]+'–'+r[1]+'Ω</b> σε κάθε ζεύγος.</div>':'');
  },
  sub:function(t){
    if(t==="inv") return '<div class="small">Χωρίς ρεύμα, καλώδια συμπιεστή βγαλμένα από την πλακέτα. Ω (αφαίρεσε την αντίσταση των ακροδεκτών):</div><div class="row3">'+inp("m1","U–V Ω")+inp("m2","V–W Ω")+inp("m3","W–U Ω")+'</div>'+sel("mg","Κάθε ακροδέκτης προς σωλήνα:",[["ol","OL (άπειρο)"],["val","Δείχνει τιμή"]]);
    if(t==="onoff") return '<div class="small">Χωρίς ρεύμα. Αριθμός = ακροδέκτης όπως τους βλέπεις (1, 2, 3):</div><div class="row3">'+inp("m1","1–2 Ω")+inp("m2","2–3 Ω")+inp("m3","1–3 Ω")+'</div>'+sel("mg","Κάθε ακροδέκτης προς σωλήνα:",[["ol","OL (άπειρο)"],["val","Δείχνει τιμή"]]);
    return '';
  },
  judge:function(){
    var t=$("mtype").value, o=[];
    if(t==="inv") o.push(balance([nv("m1"),nv("m2"),nv("m3")], knownVal("compOhm")));
    if(t==="onoff"){ var a=nv("m1"),b=nv("m2"),c=nv("m3");
      if(!isNaN(a)&&!isNaN(b)&&!isNaN(c)){
        var L=[[a,"1–2","3"],[b,"2–3","1"],[c,"1–3","2"]].sort(function(x,y){return y[0]-x[0];});
        var sum=L[1][0]+L[2][0], ok=Math.abs(sum-L[0][0])/L[0][0]<0.1;
        var sm=L[2], md=L[1];
        if(Math.min(a,b,c)<0.05) o.push(V('bad','❌ ~0Ω → βραχυκύκλωμα περιέλιξης.'));
        else if(L[0][0]>=1e6) o.push(V('bad','❌ OL → κομμένη περιέλιξη ή ανοιχτό εσωτερικό θερμικό (άφησέ τον 1 ώρα να κρυώσει και ξαναμέτρα).'));
        else o.push(V(ok?'good':'bad',(ok?'✅ ':'❌ ')+'<b>C (κοινό) = ακροδέκτης '+L[0][2]+'</b>. Μικρότερη τιμή '+sm[0]+'Ω = κύρια (C–R), μεσαία '+md[0]+'Ω = βοηθητική (C–S). '+(ok?'Άθροισμα = μεγαλύτερη τιμή → περιελίξεις εντάξει.':'Το άθροισμα ('+sum.toFixed(2)+'Ω) δεν ταιριάζει με τη μεγαλύτερη ('+L[0][0]+'Ω) → πρόβλημα περιέλιξης.')));
      }
    }
    if($("mg") && $("mg").value==="val") o.push(V('bad','❌ Διαρροή προς γείωση → αλλαγή συμπιεστή (αυτό ρίχνει και το ρελέ διαρροής).'));
    if($("mg") && $("mg").value==="ol" && o.join("").indexOf("good")>=0) o.push('<div class="small">Οι περιελίξεις είναι εντάξει. Αν ο συμπιεστής δεν ξεκινάει, έλεγξε IPM (inverter) ή πυκνωτή/ρελέ (on/off). Μπορεί και να είναι μηχανικά «κολλημένος».</div>');
    return o.join("");
  }},
 eev:{
  form:function(){ var r=knownVal("eevOhm");
    return '<div class="small">Χωρίς ρεύμα, φίσα έξω. Βρες το κοινό: είναι το καλώδιο που δίνει την ίδια τιμή προς όλα τα άλλα. Μετά μέτρα κοινό → κάθε φάση:</div><div class="row4">'+inp("m1","Φάση 1 Ω")+inp("m2","Φάση 2 Ω")+inp("m3","Φάση 3 Ω")+inp("m4","Φάση 4 Ω")+'</div>'+sel("mg","Κάθε καλώδιο προς σωλήνα:",[["ol","OL"],["val","Δείχνει τιμή"]])+sel("mclick","Με ρεύμα: ακούγεται «τικ-τικ» στην αρχικοποίηση (10–20″);",[["yes","Ναι"],["no","Όχι"]])+(r?'<div class="pext">📘 Αναμενόμενη τιμή: <b>'+r[0]+'–'+r[1]+'Ω</b> κοινό→φάση.</div>':'<div class="small">Τυπικά ~40–55Ω κοινό→φάση (κάποια πηνία ~150Ω).</div>');
  },
  judge:function(){ var o=[], r=knownVal("eevOhm");
    var b = balance([nv("m1"),nv("m2"),nv("m3"),nv("m4")], r);
    if(b && !r){ var v=[nv("m1"),nv("m2"),nv("m3"),nv("m4")], mx=Math.max.apply(null,v), mn=Math.min.apply(null,v); if(b.indexOf("good")>=0 && (mn<20||mx>250)) b=V('mid','⚠️ Ίσες μεταξύ τους αλλά ασυνήθιστη τιμή ('+mn+'–'+mx+'Ω). Σιγουρέψου ότι μετράς από το κοινό.'); }
    o.push(b);
    if($("mg").value==="val") o.push(V('bad','❌ Διαρροή πηνίου προς σώμα βαλβίδας → αλλαγή πηνίου.'));
    var c=$("mclick").value, good=o.join("").indexOf("good")>=0;
    if(c==="no" && good) o.push(V('mid','⚠️ Το πηνίο είναι καλό αλλά δεν ακούγεται → μέτρα 12V DC στο κοινό με ρεύμα. Αν δεν έρχεται → πλακέτα.'));
    if(c==="yes" && good) o.push('<div class="small">Πηνίο και οδήγηση εντάξει. Αν οι θερμοκρασίες/πιέσεις δεν αλλάζουν → η βαλβίδα (σώμα) είναι μηχανικά κολλημένη: δοκίμασε να βγάλεις/ξαναβάλεις το πηνίο ή χτύπησε ελαφρά το σώμα.</div>');
    return o.join("");
  }},
 fourway:{
  form:function(){ var r=knownVal("wayOhm");
    return '<div class="small">Χωρίς ρεύμα, φίσα έξω, Ω στα 2 καλώδια του πηνίου:</div><div class="row3">'+inp("m1","Πηνίο Ω","π.χ. 1450")+'</div>'+sel("mg","Κάθε καλώδιο προς σασί:",[["ol","OL"],["val","Δείχνει τιμή"]])+sel("mv230","Σε θέρμανση, έρχονται ~230V AC στη φίσα;",[["yes","Ναι"],["no","Όχι"]])+sel("mmove","Σε θέρμανση, «τραβάει» μαγνητικά κατσαβίδι το πηνίο και ζεσταίνεται ο σωλήνας της εσωτερικής;",[["yes","Ναι"],["no","Όχι"]])+(r?'<div class="pext">📘 Αναμενόμενη τιμή: <b>'+r[0]+'–'+r[1]+'Ω</b>.</div>':'<div class="small">Τυπικά ~1.000–2.500Ω.</div>');
  },
  judge:function(){ var o=[], a=nv("m1"), r=knownVal("wayOhm")||[1000,2500];
    if(!isNaN(a)){ if(a<50) o.push(V('bad','❌ Πολύ μικρή τιμή → βραχυκυκλωμένο πηνίο.')); else if(a>=1e6) o.push(V('bad','❌ OL → κομμένο πηνίο.')); else if(a<r[0]*0.85||a>r[1]*1.15) o.push(V('mid','⚠️ '+a+'Ω: έξω από το '+r[0]+'–'+r[1]+'Ω. Ξαναμέτρα· αν επιμένει, αλλαγή πηνίου.')); else o.push(V('good','✅ Πηνίο εντάξει ('+a+'Ω).')); }
    if($("mg").value==="val") o.push(V('bad','❌ Διαρροή προς γείωση → αλλαγή πηνίου.'));
    var v=$("mv230").value, m=$("mmove").value;
    if(v==="no") o.push(V('bad','❌ Δεν έρχεται τάση σε θέρμανση → ρελέ/πλακέτα εξωτερικής (ή η μονάδα δεν είναι ακόμα σε θέρμανση).'));
    if(v==="yes" && m==="no") o.push(V('bad','❌ Έρχεται τάση αλλά δεν αλλάζει → αν το πηνίο μετράει σωστά, η βαλβίδα είναι μηχανικά κολλημένη (θέλει αλλαγή βαλβίδας με συγκόλληση).'));
    if(v==="yes" && m==="yes") o.push(V('good','✅ Η 4οδη δουλεύει.'));
    return o.join("");
  }},
 pswitch:{
  form:function(){ return sel("mtype","Τι έχεις;",[["sw","Πιεσοστάτη – 2 καλώδια"],["tr","Αισθητήρα πίεσης – 3 καλώδια"]])+'<div id="msub"></div>'; },
  sub:function(t){
    if(t==="sw") return sel("mhl","Υψηλής (HP) ή χαμηλής (LP);",[["hp","Υψηλής – HP"],["lp","Χαμηλής – LP"]])+sel("mcont","Χωρίς ρεύμα, φίσα έξω, συνέχεια στα 2 καλώδια:",[["0","~0Ω / μπιπ"],["ol","OL / τίποτα"]])+sel("mpres","Η πίεση στο μανόμετρο είναι κανονική;",[["yes","Ναι"],["no","Όχι (πολύ ψηλή ή πολύ χαμηλή)"]]);
    if(t==="tr") return '<div class="small">Με ρεύμα, φίσα κουμπωμένη, μαύρος ακροδέκτης στο GND (συνήθως μαύρο):</div><div class="row3">'+inp("m1","Τροφοδοσία V","~5")+inp("m2","Σήμα V","0,5–4,5")+'</div>'+sel("mfollow","Το σήμα ανεβαίνει όταν ανεβαίνει η πίεση στο μανόμετρο;",[["yes","Ναι"],["no","Όχι / σταθερό"]]);
    return '';
  },
  judge:function(){ var t=$("mtype").value, o=[];
    if(t==="sw"){ var c=$("mcont").value, p=$("mpres").value, hl=$("mhl").value;
      if(c==="0") o.push(V('good','✅ Ο πιεσοστάτης είναι κλειστός (κανονικό).'));
      if(c==="ol" && p==="yes") o.push(V('bad','❌ Ανοιχτός ενώ η πίεση είναι κανονική → χαλασμένος πιεσοστάτης'+(hl==="hp"?' (δοκίμασε πρώτα το κουμπί reset αν έχει)':'')+'.'));
      if(c==="ol" && p==="no") o.push(V('mid','⚠️ Ανοιχτός γιατί η πίεση είναι εκτός ορίων – δούλεψε σωστά. Ψάξε την αιτία: '+(hl==="hp"?'βρώμικο στοιχείο εξωτερικής, ανεμιστήρας εξωτερικής, πολύ φρέον, μη συμπυκνώσιμα.':'έλλειψη φρέον (διαρροή), κλειστή βάνα, φραγμένο φίλτρο/εκτονωτική, πάγος.')));
    }
    if(t==="tr"){ var s=nv("m1"), g=nv("m2"), f=$("mfollow").value;
      if(!isNaN(s)) o.push(s<4.5||s>5.5 ? V('bad','❌ Τροφοδοσία '+s+'V (πρέπει ~5V) → πλακέτα ή βραχυκυκλωμένος αισθητήρας (βγάλε τη φίσα και ξαναμέτρα στην πλακέτα).') : V('good','✅ Τροφοδοσία ~5V.'));
      if(!isNaN(g)) o.push(g<0.3||g>4.8 ? V('bad','❌ Σήμα '+g+'V (στο 0V ή στα 5V) → χαλασμένος αισθητήρας ή κομμένο καλώδιο.') : V('good','✅ Σήμα μέσα στα όρια ('+g+'V).'));
      if(f==="no") o.push(V('bad','❌ Το σήμα δεν ακολουθεί την πίεση → αλλαγή αισθητήρα.'));
    }
    return o.join("");
  }},
 ipm:{
  form:function(){ return '<div class="small">Χωρίς ρεύμα, DC P–N κάτω από 5V, καλώδια συμπιεστή βγαλμένα. Πολύμετρο σε ▶| (δίοδος).</div>'+
    '<div class="lbl">(−) μαύρος στο P, (+) κόκκινος σε:</div><div class="row3">'+inp("m1","U (V)")+inp("m2","V (V)")+inp("m3","W (V)")+'</div>'+
    '<div class="lbl">(+) κόκκινος στο N, (−) μαύρος σε:</div><div class="row3">'+inp("m4","U (V)")+inp("m5","V (V)")+inp("m6","W (V)")+'</div>'+
    sel("mrev","Ανάποδα (+ στο P ή − στο N) δείχνει OL;",[["ol","Ναι, OL"],["val","Όχι, δείχνει τιμή"]]);},
  judge:function(){ var o=[], a=[nv("m1"),nv("m2"),nv("m3")], b=[nv("m4"),nv("m5"),nv("m6")];
    function grp(v,name){ if(v.some(isNaN)) return; var mx=Math.max.apply(null,v), mn=Math.min.apply(null,v);
      if(mn<0.1) o.push(V('bad','❌ '+name+': ~0V → βραχυκυκλωμένο IPM → αλλαγή IPM/πλακέτας (και έλεγξε τον συμπιεστή πριν βάλεις νέα).'));
      else if(mx>1.0) o.push(V('bad','❌ '+name+': OL/πολύ μεγάλη τιμή → ανοιχτό κύκλωμα IPM.'));
      else if(mx-mn>0.1) o.push(V('mid','⚠️ '+name+': οι 3 φάσεις διαφέρουν ('+mn+'–'+mx+'V) → ύποπτο IPM.'));
      else o.push(V('good','✅ '+name+': εντάξει ('+mn+'–'+mx+'V, ίδιες).')); }
    grp(a,"Πάνω πλευρά (P)"); grp(b,"Κάτω πλευρά (N)");
    if($("mrev").value==="val") o.push(V('bad','❌ Δείχνει τιμή και ανάποδα → διαρροή/βραχυκύκλωμα στο IPM.'));
    return o.join("");
  }},
 cap:{
  form:function(){ return '<div class="small">Κλείσε ρεύμα, ΞΕΦΟΡΤΩΣΕ τον πυκνωτή, βγάλε τα καλώδια, πολύμετρο στα μF.</div><div class="row3">'+inp("m1","Ετικέτα μF","π.χ. 2,5")+inp("m2","Μέτρησα μF")+'</div>'+sel("mlook","Εμφάνιση:",[["ok","Κανονικός"],["bad","Φουσκωμένος / τρέχει / καμένος"]]); },
  judge:function(){ var r=nv("m1"), m=nv("m2"), o=[];
    if(!isNaN(r)&&!isNaN(m)){ var d=(m-r)/r*100; o.push(Math.abs(d)<=10 ? V('good','✅ Εντάξει ('+m+'μF, '+(d>=0?'+':'')+d.toFixed(0)+'%).') : V('bad','❌ '+m+'μF αντί '+r+'μF ('+d.toFixed(0)+'%) → αλλαγή πυκνωτή (ίδια μF και ίδια ή μεγαλύτερη τάση V).')); }
    if($("mlook").value==="bad") o.push(V('bad','❌ Φουσκωμένος/καμένος → αλλαγή, όποια τιμή κι αν δείχνει.'));
    return o.join("");
  }},
 louver:{
  form:function(){ var r=knownVal("louverOhm"); return '<div class="small">Χωρίς ρεύμα, φίσα έξω. Κοινό → κάθε φάση:</div><div class="row4">'+inp("m1","Φ1 Ω")+inp("m2","Φ2 Ω")+inp("m3","Φ3 Ω")+inp("m4","Φ4 Ω")+'</div>'+(r?'<div class="pext">📘 Αναμενόμενη: <b>'+r[0]+'–'+r[1]+'Ω</b>.</div>':'<div class="small">Τυπικά ~200–400Ω.</div>'); },
  judge:function(){ return balance([nv("m1"),nv("m2"),nv("m3"),nv("m4")], knownVal("louverOhm")); }}
};
function measBox(id){
  var M = MEAS[id]; if(!M) return '';
  return '<div class="pcalcw"><div class="lbl">🧪 Μέτρησε και γράψε τις τιμές – σου λέω αν είναι εντάξει</div>'+M.form()+'<div id="mverd"></div></div>';
}
function measUpdate(){
  var M = MEAS[S.part]; if(!M || !$("mverd")) return;
  if(M.sub && $("mtype") && $("msub") && $("msub").getAttribute("data-t")!==$("mtype").value){ $("msub").setAttribute("data-t",$("mtype").value); $("msub").innerHTML = M.sub($("mtype").value); }
  $("mverd").innerHTML = M.judge();
}
document.addEventListener("input", function(e){ if(e.target.classList && e.target.classList.contains("mv")) measUpdate(); });
document.addEventListener("change", function(e){ if(e.target.classList && e.target.classList.contains("mv")) measUpdate(); });

// ===== Συμπτώματα & οδηγός πολύμετρου =====
function mmGuide(open){
  return '<details class="mmg"'+(open?' open':'')+'><summary>📘 Πρώτη φορά με πολύμετρο; Διάβασε εδώ (1 λεπτό)</summary>'+MMGUIDE.map(function(g){ return '<div class="psec"><div class="pst">'+esc(g[0])+'</div><div class="psb">'+esc(g[1])+'</div></div>'; }).join("")+'</details>';
}
function renderSym(){
  $("notes").innerHTML = "";
  var h = '<div class="small info">🩺 Το μηχάνημα έχει πρόβλημα αλλά δεν βγάζει κωδικό; Διάλεξε τι βλέπεις. Οι αιτίες είναι με σειρά πιθανότητας – ξεκίνα από πάνω.</div>';
  h += SYMPTOMS.map(function(s,i){
    return '<details class="sym"'+(S.sym===i?' open':'')+' data-sym="'+i+'"><summary>'+esc(s[0])+'</summary><ol class="steps">'+
      s[1].map(function(c){ var p=c[2]?partById(c[2]):null; return '<li><b>'+esc(c[0])+'</b><div>'+esc(c[1])+'</div>'+(p?'<button class="plk" data-gopart="'+p.id+'">'+p.icon+' Πώς μετράω: '+esc(p.name)+'</button>':'')+'</li>'; }).join("")+
      '</ol></details>';
  }).join("");
  h += mmGuide(false);
  $("results").innerHTML = h;
}
document.addEventListener("toggle", function(e){ var d=e.target; if(d.getAttribute && d.hasAttribute("data-sym") && d.open){ S.sym=+d.getAttribute("data-sym"); } }, true);
// χωρίζει το κείμενο «Έλεγχοι / λύση» σε βήματα για εύκολη ανάγνωση
function stepsOf(t){
  t = String(t||""); var parts=[], cur="", i, ch, nx;
  for(i=0;i<t.length;i++){
    ch=t[i]; cur+=ch; nx=t[i+1]||"";
    if((ch==="·"||ch===";") && nx===" "){ parts.push(cur.slice(0,-1)); cur=""; i++; continue; }
    if(ch==="." && nx===" "){ var w=cur.replace(/\.$/,"").split(/\s/).pop(); var n2=t[i+2]||"";
      if((w.length>3 || /\)$/.test(w)) && !/^(π\.χ|κλπ|κ\.λπ|εξωτ|εσωτ)$/i.test(w) && /[Α-ΩΆΈΉΊΌΎΏA-Z0-9(«"]/.test(n2)){ parts.push(cur); cur=""; i++; } }
  }
  if(cur.trim()) parts.push(cur);
  parts = parts.map(function(p){return p.trim().replace(/^[–-]\s*/,"");}).filter(function(p){return p.length>1;});
  var m=[]; parts.forEach(function(p){ if(m.length && p.length<12) m[m.length-1]+=" "+p; else m.push(p); }); parts=m;
  if(parts.length<2){
    // μία πρόταση με λίστα «Α, Β, Γ» → βήματα (μόνο κόμματα έξω από παρενθέσεις)
    var s0=t.trim().replace(/\.$/,""), dep=0, it=[], c0="";
    for(i=0;i<s0.length;i++){ ch=s0[i]; if(ch==="(") dep++; if(ch===")") dep--; if(ch==="," && dep===0 && s0[i+1]===" "){ it.push(c0.trim()); c0=""; i++; continue; } c0+=ch; }
    if(c0.trim()) it.push(c0.trim());
    if(it.length>=3 && s0.indexOf(". ")<0 && s0.indexOf(": ")<0 && it.every(function(x){return x.length>2 && x.length<70;}))
      return it.map(function(x){return x.charAt(0).toUpperCase()+x.slice(1);});
    return null;
  }
  return parts.map(function(x){return x.charAt(0).toUpperCase()+x.slice(1);});
}

// ===== Πιέσεις, υπερθέρμανση, υπόψυξη =====
function satT(ref, pg){ // pg: bar gauge → °C
  var t=PT[ref], pa=pg+1.013, i;
  if(pa<=t[0][1]) i=0; else if(pa>=t[t.length-1][1]) i=t.length-2; else for(i=0;i<t.length-1;i++) if(pa>=t[i][1]&&pa<=t[i+1][1]) break;
  var a=t[i], b=t[i+1], f=(Math.log(pa)-Math.log(a[1]))/(Math.log(b[1])-Math.log(a[1]));
  return a[0]+f*(b[0]-a[0]);
}
function satP(ref, T){ var t=PT[ref], i; for(i=0;i<t.length-2;i++) if(T<=t[i+1][0]) break; var a=t[i], b=t[i+1], f=(T-a[0])/(b[0]-a[0]); return Math.exp(Math.log(a[1])+f*(Math.log(b[1])-Math.log(a[1])))-1.013; }
function presForm(){
  function s(id,lab,opts,def){ return '<label class="small">'+esc(lab)+'<select id="'+id+'" class="pv">'+opts.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===def?' selected':'')+'>'+esc(o[1])+'</option>';}).join("")+'</select></label>'; }
  function i(id,lab,ph){ return '<label>'+esc(lab)+'<input id="'+id+'" class="pv" inputmode="decimal" placeholder="'+esc(ph||"")+'"></label>'; }
  return '<div class="pcalcw"><div class="lbl">📏 Πιέσεις – γράψε ό,τι έχεις μετρήσει</div>'+
   '<div class="row4">'+s("pref","Τι φρέον έχει; (ταμπελάκι)",[["R32","R32"],["R410A","R410A"],["R22","R22"],["R290","R290 (προπάνιο)"]],S.pref||"R32")+
   s("punit","Το μανόμετρο σε",[["bar","bar"],["psi","psi"]],S.punit||"bar")+
   s("ptype","Μηχάνημα",[["inv","Split/Multi inverter (εκτονωτική)"],["cap","On/Off (τριχοειδές)"],["vrf","VRF"]],"inv")+
   s("pmode","Λειτουργία",[["cool","Ψύξη"],["heat","Θέρμανση"]],"cool")+'</div>'+
   '<div class="row4">'+i("ptin","Θερμ. χώρου °C","25")+i("ptout","Θερμ. έξω °C","33")+'</div>'+
   '<div class="row4">'+i("plp","Χαμηλή πίεση (αναρρόφηση)","")+i("php","Υψηλή πίεση (αν έχεις)","")+'</div>'+
   '<div class="row4">'+i("ptsuc","Θερμόμετρο σωλήνα αερίου/αναρρόφησης °C","")+i("ptliq","Θερμόμετρο σωλήνα υγρού °C","")+'</div>'+
   '<div id="pres_out"></div></div>';
}
function presCalc(){
  var el=$("pres_out"); if(!el) return;
  var ref=$("pref").value, u=$("punit").value, ty=$("ptype").value, md=$("pmode").value;
  S.pref=ref; S.punit=u;
  function g(id){ var v=num(id); return isNaN(v)?NaN:(u==="psi"?v/14.5038:v); }
  var tin=num("ptin"), tout=num("ptout"), lp=g("plp"), hp=g("php"), tsuc=num("ptsuc"), tliq=num("ptliq");
  var o=[], f1=function(x){return (Math.round(x*10)/10).toFixed(1);}, pu=function(bar){ return u==="psi"? (bar*14.5038).toFixed(0)+' psi' : bar.toFixed(1)+' bar'; };
  if(md==="heat" && ty!=="vrf") o.push('<div class="small info">ℹ️ Σε θέρμανση, στα split η βαλβίδα service (σωλήνας αερίου) δείχνει την ΥΨΗΛΗ πίεση. Γράψ\' την στο «Υψηλή πίεση».</div>');
  var te=isNaN(lp)?NaN:satT(ref,lp), tc=isNaN(hp)?NaN:satT(ref,hp);
  var eLo,eHi,cLo,cHi;
  if(md==="cool"){ eLo=tin-24; eHi=tin-12; cLo=tout+8; cHi=tout+20; if(eLo<-2) eLo=-2; if(eHi<4) eHi=4; }
  else { cLo=tin+12; cHi=tin+30; eLo=tout-14; eHi=tout-3; }
  var exp='';
  if(!isNaN(tin)&&!isNaN(tout)){
    exp = '<div class="pext">📘 Αναμενόμενα (μετά από 15′ λειτουργίας στο μέγιστο):<br>'+
      (md==="cool"||ty==="vrf" ? '• Χαμηλή: <b>'+pu(satP(ref,eLo))+' – '+pu(satP(ref,eHi))+'</b> (εξάτμιση '+f1(eLo)+'…'+f1(eHi)+'°C)<br>':'')+
      '• Υψηλή: <b>'+pu(satP(ref,cLo))+' – '+pu(satP(ref,cHi))+'</b> (συμπύκνωση '+f1(cLo)+'…'+f1(cHi)+'°C)'+(md==="heat"&&ty!=="vrf"?'':'')+'</div>';
  }
  o.push(exp);
  var sh=NaN, sc=NaN, shLo=ty==="cap"?4:2, shHi=ty==="cap"?12:8, scLo=3, scHi=ty==="vrf"?15:10;
  if(!isNaN(te)) o.push('<div class="pver '+((te<eLo)?'bad':(te>eHi)?'mid':'good')+'">Χαμηλή '+pu(lp)+' → εξάτμιση <b>'+f1(te)+'°C</b> '+((te<eLo)?'(χαμηλή)':(te>eHi)?'(υψηλή)':'(κανονική)')+'</div>');
  if(!isNaN(tc)) o.push('<div class="pver '+((tc>cHi)?'bad':(tc<cLo)?'mid':'good')+'">Υψηλή '+pu(hp)+' → συμπύκνωση <b>'+f1(tc)+'°C</b> '+((tc>cHi)?'(υψηλή)':(tc<cLo)?'(χαμηλή)':'(κανονική)')+'</div>');
  if(!isNaN(te)&&!isNaN(tsuc)){ sh=tsuc-te; o.push('<div class="pver '+(sh<shLo?'mid':sh>shHi?'bad':'good')+'">Υπερθέρμανση = '+f1(tsuc)+' − ('+f1(te)+') = <b>'+f1(sh)+' K</b> (σωστό '+shLo+'–'+shHi+' K)</div>'); }
  if(!isNaN(tc)&&!isNaN(tliq)){ sc=tc-tliq; o.push('<div class="pver '+(sc<scLo?'bad':sc>scHi?'mid':'good')+'">Υπόψυξη = '+f1(tc)+' − '+f1(tliq)+' = <b>'+f1(sc)+' K</b> (σωστό '+scLo+'–'+scHi+' K)</div>'); }
  // διάγνωση (ψύξη)
  var d=[];
  if(md==="cool"||ty==="vrf"){
    var lowE=!isNaN(te)&&te<eLo, hiE=!isNaN(te)&&te>eHi, hiC=!isNaN(tc)&&tc>cHi, lowC=!isNaN(tc)&&tc<cLo;
    var hiSH=!isNaN(sh)&&sh>shHi, lowSH=!isNaN(sh)&&sh<shLo, hiSC=!isNaN(sc)&&sc>scHi, lowSC=!isNaN(sc)&&sc<scLo;
    if(lowE && hiSH && (lowSC||isNaN(sc)||lowC)) d.push(['bad','<b>Έλλειψη φρέον (διαρροή)</b> – χαμηλή πίεση, μεγάλη υπερθέρμανση'+(lowSC?', μικρή υπόψυξη':'')+'. Ψάξε διαρροή (ρακόρ, βάνες, στοιχεία), επισκεύασε, κάνε κενό και ζύγισε τη σωστή ποσότητα από το ταμπελάκι.']);
    else if(lowE && hiSH && hiSC) d.push(['bad','<b>Φραγή στη γραμμή υγρού</b> (εκτονωτική, φίλτρο, τριχοειδές, στραβωμένος σωλήνας) – το φρέον «μαζεύεται» στο στοιχείο εξωτερικής (μεγάλη υπόψυξη). Έλεγξε εκτονωτική και πιάσε με το χέρι για κρύο σημείο πριν από φίλτρο.']);
    else if(lowE && !isNaN(sh) && !hiSH) d.push(['bad','<b>Λίγος αέρας στην εσωτερική</b> – βρώμικα φίλτρα/στοιχείο, ανεμιστήρας εσωτερικής αργός/σταματημένος. Γι\' αυτό παγώνει το στοιχείο χωρίς να λείπει φρέον.']);
    else if(lowE && isNaN(sh)) d.push(['mid','Χαμηλή πίεση: μπορεί να είναι <b>έλλειψη φρέον</b> ή <b>λίγος αέρας</b> στην εσωτερική. Βάλε θερμόμετρο στον σωλήνα αερίου για υπερθέρμανση: μεγάλη → έλλειψη, μικρή → αέρας/φίλτρα.']);
    if(hiC && hiSC && (lowSH||isNaN(sh))) d.push(['bad','<b>Υπερπλήρωση</b> – υψηλή πίεση, μεγάλη υπόψυξη, μικρή υπερθέρμανση. Μάζεψε φρέον και ζύγισε σωστή ποσότητα.']);
    else if(hiC && !hiSC) d.push(['bad','<b>Η εξωτερική δεν «διώχνει» θερμότητα</b> – βρώμικο στοιχείο εξωτερικής, ανεμιστήρας εξωτερικής, ζεστός αέρας που ξαναμπαίνει, ή αέρας/άζωτο μέσα στο σύστημα (κακό κενό).']);
    if(hiE && lowC) d.push(['mid','<b>Μικρή διαφορά πιέσεων</b> – ο συμπιεστής δουλεύει σε χαμηλές στροφές (inverter) ή είναι αδύναμος (βαλβίδες). Βάλε τη μονάδα σε δοκιμαστική λειτουργία μέγιστου (test run) και ξαναμέτρα.']);
    if(!d.length && (lowE||hiE||hiC||lowC||hiSH||lowSH||hiSC||lowSC)) d.push(['mid','Κάποια τιμή είναι εκτός ορίων (δες τα κόκκινα/πορτοκαλί παραπάνω). Βεβαιώσου ότι η μονάδα δουλεύει σε test run 15 λεπτά και συμπλήρωσε υπερθέρμανση και υπόψυξη για πιο σίγουρη διάγνωση.']);
    if(!d.length && !isNaN(te) && (!isNaN(sh)||!isNaN(tc))) d.push(['good','✅ Οι πιέσεις είναι μέσα στα φυσιολογικά για αυτές τις θερμοκρασίες.']);
  } else if(!isNaN(tc)) {
    if(tc<cLo) d.push(['bad','Χαμηλή υψηλή πίεση σε θέρμανση: έλλειψη φρέον, 4οδη που δεν αλλάζει πλήρως, ή ο συμπιεστής σε χαμηλές στροφές.']);
    else if(tc>cHi) d.push(['bad','Πολύ υψηλή πίεση σε θέρμανση: βρώμικα φίλτρα/στοιχείο εσωτερικής ή ανεμιστήρας εσωτερικής, υπερπλήρωση.']);
    else d.push(['good','✅ Η πίεση θέρμανσης είναι φυσιολογική.']);
  }
  if(d.length) o.push('<div class="lbl">🩺 Τι δείχνουν οι μετρήσεις</div>'+d.map(function(x){return V(x[0],x[1]);}).join(""));
  if(ty!=="cap") o.push('<div class="small">⚠️ Σε inverter/VRF οι πιέσεις αλλάζουν με τις στροφές του συμπιεστή. Για σωστή κρίση βάλε τη μονάδα σε <b>δοκιμαστική λειτουργία (test run / forced cooling)</b>, θερμοκρασία στο ελάχιστο, ανεμιστήρα στο μέγιστο, και περίμενε 15 λεπτά. Η υπερθέρμανση και η υπόψυξη είναι πιο αξιόπιστες από τις σκέτες πιέσεις.</div>');
  el.innerHTML = o.join("");
}
function presGuide(){
  return '<details class="mmg"><summary>🌡️ Πού βάζω τα θερμόμετρα (υπερθέρμανση – υπόψυξη)</summary>'+
  [["Τι χρειάζεσαι","Μανόμετρα (ή ψηφιακό manifold) + 2 θερμόμετρα σωλήνα με τσιμπίδα (clamp). Καθάρισε τον σωλήνα στο σημείο, σφίξε την τσιμπίδα και τύλιξε από πάνω μόνωση/αφρώδες για να μη μετράει τον αέρα. Περίμενε να σταθεροποιηθεί η ένδειξη."],
   ["Υπερθέρμανση (σωλήνας αερίου – χοντρός)","Σε ΨΥΞΗ: τσιμπίδα στον χοντρό σωλήνα στην εξωτερική, ~15 cm πριν από τη βάνα service, ΜΑΖΙ με το μανόμετρο στη βάνα αερίου.\nΥπερθέρμανση = θερμοκρασία σωλήνα − θερμοκρασία εξάτμισης (από την πίεση).\nΣωστό: 2–8 K inverter με εκτονωτική, 4–12 K on/off με τριχοειδές."],
   ["Υπόψυξη (σωλήνας υγρού – λεπτός)","Σε ΨΥΞΗ: τσιμπίδα στον λεπτό σωλήνα στην έξοδο του στοιχείου εξωτερικής, πριν από την εκτονωτική/φίλτρο (ή κοντά στη βάνα υγρού).\nΧρειάζεσαι την ΥΨΗΛΗ πίεση: στα περισσότερα split δεν υπάρχει βαλβίδα υψηλής – τότε υπολόγισε τη συμπύκνωση ≈ θερμοκρασία εξωτερικής +10…15°C ή διάβασέ την από το service menu/checker.\nΥπόψυξη = θερμοκρασία συμπύκνωσης − θερμοκρασία σωλήνα υγρού. Σωστό: 3–10 K."],
   ["VRF – πώς μετράς σωστά","1) Βάλε το σύστημα σε δοκιμαστική λειτουργία (test run) από την εξωτερική ή το service εργαλείο: όλες οι εσωτερικές σε ψύξη, θερμοκρασία στο ελάχιστο, ανεμιστήρας στο μέγιστο, 20–30 λεπτά.\n2) Στην εξωτερική υπάρχουν βαλβίδες service και στη γραμμή υγρού και στη γραμμή αερίου (και αισθητήρες πίεσης που διαβάζεις στην οθόνη 7-segment/checker). Μανόμετρο υψηλής στη βάνα υγρού ή στην check-valve υψηλής, χαμηλής στη βάνα αερίου.\n3) Υπόψυξη στην εξωτερική: τσιμπίδα στη γραμμή υγρού μετά το στοιχείο/subcooler, πριν τη βάνα υγρού. Σωστό συνήθως 5–15 K.\n4) Υπερθέρμανση σε ΚΑΘΕ εσωτερική: τσιμπίδα στον σωλήνα αερίου στην έξοδο της εσωτερικής (μετά το στοιχείο). Εξάτμιση = από τη χαμηλή πίεση της εξωτερικής (ή από το αισθητήριο υγρού της εσωτερικής). Σωστό 2–8 K. Μία εσωτερική με πολύ μεγάλη υπερθέρμανση ενώ οι άλλες είναι κανονικές → εκτονωτική ΑΥΤΗΣ της εσωτερικής.\n5) Πολύ μεγάλη υπερθέρμανση σε ΟΛΕΣ + μικρή υπόψυξη στην εξωτερική → έλλειψη φρέον."],
   ["Πριν βγάλεις συμπέρασμα","• Καθαρά φίλτρα και στοιχεία.\n• Ο συμπιεστής σε σταθερές, υψηλές στροφές (test run), όχι αμέσως μετά την εκκίνηση.\n• Σε θέρμανση/ξεπάγωμα οι μετρήσεις δεν συγκρίνονται με αυτές της ψύξης."]].map(function(g){ return '<div class="psec"><div class="pst">'+esc(g[0])+'</div><div class="psb">'+esc(g[1])+'</div></div>'; }).join("")+'</details>';
}
document.addEventListener("input", function(e){ if(e.target.classList && e.target.classList.contains("pv")) presCalc(); });
document.addEventListener("change", function(e){ if(e.target.classList && e.target.classList.contains("pv")) presCalc(); });

function renderParts(){
  var out = $("results"); $("notes").innerHTML = "";
  var pl = partPlats();
  var h = '<div class="pbox"><label class="lbl">Μοντέλο κλιματιστικού (ταμπελάκι)</label>'+
    '<input id="pmodel" placeholder="π.χ. GWH12AGB-K6DNA1A" autocapitalize="characters" spellcheck="false" value="'+esc(S.model||"")+'">'+
    '<div class="small pinfo" id="pplat"></div><div id="pmodelinfo"></div><div id="pmine"></div></div>';
  h += mmGuide(!S.part);
  h += '<div class="lbl">Ποιο εξάρτημα θες να ελέγξεις;</div><div class="pchips">'+PARTS.map(function(p){ return '<button class="pc'+(S.part===p.id?' on':'')+'" data-pc="'+p.id+'">'+p.icon+' '+esc(p.name)+'</button>'; }).join("")+'</div>';
  var P = partById(S.part);
  if(!P){ h += '<div class="empty">Διάλεξε εξάρτημα. Θα δεις χρώματα καλωδίων, βήματα με το πολύμετρο και τιμές από τα manuals.</div>'; }
  else {
    h += '<div class="pwarn">⚡ Πριν ακουμπήσεις: κλείσε ρεύμα, περίμενε 5–10′ να αδειάσουν οι πυκνωτές της πλακέτας (μέτρα DC < 5V). Μετρήσεις «με ρεύμα» μόνο με μονωμένους ακροδέκτες.</div>';
    if(P.id==="fan") h += '<div id="fanw">'+fanWizard()+'</div>';
    if(P.id==="comp") h += '<div class="pcalcw"><div class="lbl">🔎 Κωδικός συμπιεστή (ετικέτα πάνω στον συμπιεστή)</div><input id="pcomp" placeholder="π.χ. ASN98D22UFZ" autocapitalize="characters" spellcheck="false"><div id="pcompres"></div></div>';
    if(MEAS[P.id]) h += measBox(P.id);
    if(P.id==="pres") h += presForm() + presGuide();
    if(P.id==="sensor"){
      var sl = sensList();
      h += '<div class="pcalcw"><div class="lbl">🧮 Υπολογιστής αισθητηρίου</div>'+
        '<select id="psel">'+sl.L.map(function(x,i){ return '<option value="'+i+'">'+esc(x.lab)+'</option>'; }).join("")+'</select>'+
        '<div class="row2"><label>Θερμοκρασία °C<input id="ptemp" inputmode="decimal" value="'+esc(S.ptemp||"25")+'"></label><label>Μέτρησα kΩ<input id="pmeas" inputmode="decimal" placeholder="π.χ. 9,8"></label></div>'+
        '<div id="pcalc"></div>'+
        sl.src.map(function(d){ return '<div class="small" style="margin-top:6px">ℹ️ '+esc(d.note)+'<br>Πηγή: '+esc(d.src)+'</div>'; }).join("")+
        (!sl.src.length?'<div class="small" style="margin-top:6px">ℹ️ Για αυτή τη μάρκα/εργοστάσιο δεν έχω επιβεβαιωμένο πίνακα. Η τιμή στους 25°C συχνά είναι τυπωμένη στο αισθητήριο ή στο manual (5k, 10k, 15k, 20k, 50k…). Διάλεξε την τιμή και ο υπολογιστής βγάζει τα kΩ για τη θερμοκρασία που μετράς (κατά προσέγγιση).</div>':'')+
        '</div>';
    }
    var ex = pl.map(function(p){ return PEXTRA[p] && PEXTRA[p][P.id] ? '<div class="pext">📘 <b>'+esc(PLAT[p].name)+':</b> '+esc(PEXTRA[p][P.id])+'</div>' : ''; }).join("");
    h += ex;
    h += P.body.map(function(s){ return '<div class="psec"><div class="pst">'+esc(s[0])+'</div><div class="psb">'+esc(s[1])+'</div></div>'; }).join("");
    h += '<div class="pnote small">Οι τιμές (Ω, V) είναι από τα service manuals της μάρκας όπου υπάρχει πηγή, αλλιώς τυπικές. Η ακριβής τιμή περιέλιξης συμπιεστή/μοτέρ αλλάζει ανά μοντέλο και γράφεται στο wiring diagram ή στο service manual του – η πιο αξιόπιστη σύγκριση είναι οι 3 φάσεις μεταξύ τους.</div>';
    h += '<div class="psave"><div class="lbl">📒 Κράτα τη μέτρησή σου για αυτό το μοντέλο</div><div class="row2"><input id="pval" placeholder="π.χ. U-V-W 1,4Ω · γείωση OL"><button id="psave" class="mini">Αποθήκευση</button></div><div id="psmsg" class="small"></div></div>';
  }
  out.innerHTML = h;
  renderMine(); renderModelBox();
  if(P && P.id==="sensor") calcSens();
  if(P && P.id==="fan"){ fanColsUpdate(); fanVerdict(); }
  if(P && MEAS[P.id]) measUpdate();
  if(P && P.id==="pres") presCalc();
}
document.addEventListener("input", function(e){
  var id = e.target.id;
  if(id==="pmodel"){ if(applyModel(e.target.value)){ var pos=e.target.selectionStart; renderParts(); var mi=$("pmodel"); mi.focus(); try{mi.setSelectionRange(pos,pos);}catch(x){} } else { renderMine(); renderModelBox(); if($("fanw")){ $("fanw").innerHTML=fanWizard(); fanColsUpdate(); fanVerdict(); } } if($("model")) $("model").value = S.model; }
  if(id==="ptemp"){ S.ptemp = e.target.value; calcSens(); }
  if(id==="pmeas") calcSens();
  if(id==="pcomp") compLookup();
});
document.addEventListener("change", function(e){ if(e.target.id==="psel") calcSens(); });
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-pc],[data-gopart],[data-mdel],#psave"); if(!el) return;
  if(el.hasAttribute("data-pc")){ S.part = el.getAttribute("data-pc"); persist(); renderParts(); return; }
  if(el.hasAttribute("data-gopart")){ S.part = el.getAttribute("data-gopart"); S.src="parts"; renderSrc(); persist(); renderParts(); window.scrollTo({top:$("srcbox").getBoundingClientRect().top+window.scrollY-10,behavior:"smooth"}); return; }
  if(el.hasAttribute("data-mdel")){ var id=+el.getAttribute("data-mdel"); meas = meas.filter(function(m){return m.id!==id;}); LS.set("vl_meas",meas); renderMine(); return; }
  if(el.id==="psave"){
    var k = mkey(S.model), v = ($("pval").value||"").trim();
    if(!k){ $("psmsg").textContent = "Γράψε πρώτα το μοντέλο πάνω."; $("pmodel").focus(); return; }
    if(!v){ $("psmsg").textContent = "Γράψε την τιμή που μέτρησες."; return; }
    var d = new Date(), P = partById(S.part);
    meas.push({id:d.getTime(), m:k, part:S.part, v:(P?P.name+': ':'')+v, d:d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()});
    LS.set("vl_meas", meas); $("pval").value=""; $("psmsg").textContent = "Αποθηκεύτηκε (μόνο σε αυτή τη συσκευή)."; renderMine();
  }
});

function renderAll(){ renderCats(); renderBrands(); renderOem(); renderResults(); persist(); }

// ===== events =====
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-c],[data-b],[data-o],[data-del],[data-q],#brandSel");
  if(!el) return;
  if(el.id==="brandSel"){ $("brandsWrap").classList.toggle("open"); return; }
  if(el.hasAttribute("data-c")){ S.cat = el.getAttribute("data-c"); S.oem=null; renderAll(); setTimeout(function(){ var m=$("model"); if(m && !m.value) m.focus(); else $("q").focus(); },50); return; }
  if(el.hasAttribute("data-b")){ S.brand = el.getAttribute("data-b"); S.oem=null; S.model=""; $("brandsWrap").classList.remove("open"); $("bq").blur(); renderAll(); setTimeout(function(){ var c=$("catwrap"); if(c) window.scrollTo({top:c.getBoundingClientRect().top+window.scrollY-10,behavior:"smooth"}); },50); return; }
  if(el.hasAttribute("data-o")){ S.oem = el.getAttribute("data-o"); markChips(); renderResults(); persist(); return; }
  if(el.hasAttribute("data-del")){ var b=brandObj(), p=el.getAttribute("data-del"); myMap = myMap.filter(function(m){return !(m.brand===b.n && m.prefix===p);}); LS.set("vl_mymap",myMap); renderOem(); return; }
  if(el.hasAttribute("data-q")){ S.q = el.getAttribute("data-q"); $("q").value=S.q; renderResults(); window.scrollTo({top:$("q").getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"}); return; }
});
// ===== πρόσφατες αναζητήσεις =====
var recent = LS.get("vl_recent", []);
var recT = null;
function saveRecent(){
  var q = S.q.trim(); if(!q || !S.brand || isTextQuery(q)) return;
  var r = search(q); if(r.mode!=="exact" && r.mode!=="detail") return;
  var item = {cat:S.cat, brand:S.brand, oem:S.oem, q:q.toUpperCase()};
  recent = recent.filter(function(x){return !(x.cat===item.cat && x.brand===item.brand && x.q===item.q);});
  recent.unshift(item); recent = recent.slice(0,10); LS.set("vl_recent", recent); renderRecent();
}
function renderRecent(){
  $("recent").innerHTML = recent.map(function(x,i){ return '<button class="rc" data-r="'+i+'"><b>'+esc(x.q)+'</b> · '+esc(x.brand)+'</button>'; }).join("");
}
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-r]"); if(!el) return;
  var x = recent[+el.getAttribute("data-r")]; if(!x) return;
  S.cat=x.cat; S.brand=x.brand; S.oem=x.oem; S.q=x.q; $("q").value=x.q; $("brandsWrap").classList.remove("open"); renderAll();
});

$("bq").addEventListener("input", function(){
  var r = brandMatches(this.value);
  $("bsug").innerHTML = this.value.trim() ? (r.length ? r.map(function(b){ return '<button class="bs" data-b="'+esc(b.n)+'"><b>'+esc(b.n)+'</b>'+(b.own?'':' <span class="small">· χωρίς δικό της εργοστάσιο</span>')+'</button>'; }).join("") : '<div class="small">Δεν βρέθηκε. Πάτα ☰ για όλη τη λίστα ή διάλεξε «Άλλη μάρκα…».</div>') : "";
});
$("bq").addEventListener("focus", function(){ this.select(); });
$("bq").addEventListener("keydown", function(e){ if(e.key==="Enter"){ var f=$("bsug").querySelector("[data-b]"); if(f) f.click(); } });

$("q").addEventListener("input", function(){ S.q = this.value; renderResults(); clearTimeout(recT); recT=setTimeout(saveRecent,1500); });
$("q").addEventListener("keydown", function(e){ if(e.key==="Enter"){ this.blur(); saveRecent(); } });
renderRecent();
function renderSrc(){ var bs=$("srcbox").querySelectorAll("[data-s]"); for(var i=0;i<bs.length;i++) bs[i].classList.toggle("on", bs[i].getAttribute("data-s")===S.src); var pp=S.src==="parts"||S.src==="sym"; document.querySelector(".sbox").style.display=pp?"none":""; $("recent").style.display=pp?"none":""; document.querySelector(".search").style.position=pp?"static":""; }
$("srcbox").addEventListener("click", function(e){ var el=e.target.closest("[data-s]"); if(!el) return; S.src=el.getAttribute("data-s"); renderSrc(); renderResults(); persist(); });
renderSrc();
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-pi]"); if(!el) return;
  var n = +el.getAttribute("data-pn"), i = +el.getAttribute("data-pi"), vals = el.getAttribute("data-pv");
  var cur = (S.q.trim().length===n && /^[0-2]+$/.test(S.q.trim())) ? S.q.trim() : new Array(n+1).join("0");
  var d = cur[i], nd = vals[(vals.indexOf(d)+1)%vals.length];
  S.q = cur.slice(0,i)+nd+cur.slice(i+1); $("q").value = S.q; renderResults();
});
$("clr").addEventListener("click", function(){ S.q=""; $("q").value=""; renderResults(); $("q").focus(); });


renderAll();
})();
