// ===== ΜΑΡΚΕΣ, ΕΡΓΟΣΤΑΣΙΑ & ΛΟΓΙΚΗ ΕΦΑΡΜΟΓΗΣ =====
(function(){
var T = window.T;

var CATS = [
  {id:"split", label:"Split (τοίχου, κασέτα, κανάλι)", icon:'<svg class="ic"><use href="#i-split"/></svg>'},
  {id:"multi", label:"Multi split", icon:'<svg class="ic"><use href="#i-multi"/></svg>'},
  {id:"hp",    label:"Αντλία θερμότητας (νερού)", icon:'<svg class="ic"><use href="#i-hp"/></svg>'},
  {id:"vrf",   label:"VRF", icon:'<svg class="ic"><use href="#i-vrf"/></svg>'},
  {id:"vrfhr", label:"VRF Heat Recovery", icon:'<svg class="ic"><use href="#i-vrfhr"/></svg>'}
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
  kerosun: {name:"Kerosun", split:["kerosun_split"]},
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
  {n:"Kerosun", oem:"η Kerosun είναι ελληνική μάρκα (Γ.Ε. Δημητρίου, διανομέας Toyotomi) – δεν έχει δικό της εργοστάσιο· έχει όμως δικό της επίσημο βλαβολόγιο (KCT22)", own:"kerosun", hint:"Βλαβολόγιο από το επίσημο εγχειρίδιο Kerosun Clima (KCT22). Οι κωδικοί μοιάζουν με της TCL, αλλά το EH/EF είναι ανάποδα."},
  {n:"Candy", oem:"μάρκα του ομίλου Haier (Candy Hoover) – τα κλιματιστικά Candy (Pura CY-…RAIN/RAOUT, Aria CY-…QBIN) κατασκευάζονται από τη Haier στο Qingdao (ταμπελάκι μονάδας: «Qingdao Haier Air Conditioner General Co., Ltd.»· δελτίο προϊόντος ΕΕ/EPREL: προμηθευτής Haier)", own:"haier", hint:"Η Candy είναι μάρκα της Haier – χρησιμοποιεί το βλαβολόγιο Haier. Διασταύρωση με το εγχειρίδιο χρήσης Candy (CY-09/12/18QBIN, CY-09/12/18/24RAIN, -M): E1 αισθητήριο χώρου, E2 αισθητήριο στοιχείου, E4 EEPROM εσωτερικής, E7 επικοινωνία εσωτ.–εξωτ., E14 μοτέρ ανεμιστήρα εσωτερικής (οι αιτίες του εγχειριδίου Candy – κομμένο καλώδιο μέσα στο μοτέρ, κομμένα καλώδια μοτέρ, πλακέτα εσωτερικής – είναι λέξη προς λέξη του E14 στα service manual Haier) – ίδια με Haier. ΠΡΟΣΟΧΗ: F25 κατά τον αυτοκαθαρισμό (CL) με εξωτερική θερμοκρασία κάτω από 0°C είναι κανονική προστασία κατά το εγχειρίδιο Candy – κλείσε το ρεύμα και ξανάνοιξε μετά από 10 δευτ. (δεν είναι βλάβη αισθητηρίου). Το εγχειρίδιο χρήσης δεν έχει κωδικούς εξωτερικής· για αυτούς ισχύει το service manual Haier."},
  {n:"Aufit", oem:"μάρκα του ομίλου AUX – φτιάχνεται στα εργοστάσια AUX", own:"aux", hint:"Η Aufit είναι μάρκα της AUX (ίδια μοντέλα ASW-H…, J-Smart, Freedom) – χρησιμοποιεί βλαβολόγιο AUX."},
  {n:"Argo", oem:"ιταλική μάρκα χωρίς εργοστάσιο κλιματιστικών – τα split της είναι Gree (π.χ. στο EPREL μοντέλο GWH12AUCXB-K6DNA1A με προμηθευτή Argo)", own:"gree", hint:"Οι σημερινές σειρές Argo (Ecolight, X3 multi/VRF) έχουν κωδικούς Gree (π.χ. E5, E6, U8, H3, H6, C5, F0, F1, F2 στο εγχειρίδιο Ecolight) – χρησιμοποιεί βλαβολόγιο Gree. Πολύ παλιές σειρές (π.χ. AWIAS με λυχνίες OPERATION/TIMER/STANDBY) έχουν δικό τους πίνακα."},
  {n:"Nobu", cands:{split:["aux","midea","inv_gree"], hp:["midea","inv_mc"], vrf:["midea"], vrfhr:["midea"]}, hint:"Η Nobu είναι μάρκα της Inventor (κατασκευαστής στα manuals: INVENTOR A.G. S.A.). Όπως η Inventor, έχει σειρές από διαφορετικά εργοστάσια: π.χ. η Kiku έχει τηλεχειριστήριο Midea (RG57). Δες το ταμπελάκι ή το τηλεχειριστήριο."},
  {n:"Wellio", oem:"ελληνική μάρκα – τα inverter τοίχου είναι μοντέλα TCL", own:"tcl", hint:"Τα Wellio inverter τοίχου είναι μοντέλα TCL (TAC-09/12/18/24CHSD) – χρησιμοποιεί βλαβολόγιο TCL."},
  {n:"CHiQ", fac:"Changhong (Κίνα) – έχει δικά της εργοστάσια κλιματιστικών, αλλά δεν υπάρχει δημόσιο βλαβολόγιο", cands:GENERIC, hint:"Η CHiQ είναι η διεθνής μάρκα της Changhong (Sichuan Changhong, Mianyang). Ελέγχθηκε και το ευρωπαϊκό εγχειρίδιο χρήσης CHiQ split (σειρά CSDH-07/09/12/18/24DK…): γράφει ότι η οθόνη δείχνει κωδικούς, αλλά δεν δίνει πίνακα κωδικών. Δεν βρέθηκε δημόσιο service manual – στείλε φωτογραφία ταμπέλας/κωδικού με την αναφορά."},
  {n:"Sang", cands:GENERIC},
  {n:"Qualitair", cands:GENERIC, hint:"Ελληνική μάρκα (Qualitair, Μαρούσι). Δεν υπάρχει δημόσιο επίσημο βλαβολόγιο και η εταιρεία δεν δηλώνει εργοστάσιο κατασκευής (σειρά CSD‑09/12/18/24DA). Σκάναρε την ετικέτα της εξωτερικής ή διάλεξε εργοστάσιο από την πλακέτα/το τηλεχειριστήριο. Για το επίσημο βλαβολόγιο: Qualitair 210 8066070."},
  {n:"Cooper&Hunter", oem:"αμερικανική μάρκα – κατασκευάζεται από τη Gree (Zhuhai)", own:"gree", hint:"Κατασκευάζεται από Gree – χρησιμοποιεί βλαβολόγιο Gree."},
  {n:"Bosch", fac:"Bosch – από τον Ιούλιο 2025 ιδιοκτήτης των εργοστασίων Hitachi (JCH)· τα Bosch Climate split είναι όμως Midea OEM", cands:{split:["midea"], vrf:["midea"], vrfhr:["midea"]}, hint:"Τα Bosch Climate (split) και τα Bosch VRF (AF5300) είναι Midea OEM. Οι αντλίες Bosch Compress έχουν δικό τους βλαβολόγιο (δεν περιλαμβάνεται)."},
  {n:"Carrier", fac:"Carrier – έχει δικά της εργοστάσια (και την Toshiba Carrier για VRF/επαγγελματικά)· τα οικιακά split στην Ευρώπη είναι συνήθως Midea OEM", cands:{split:["midea","toshiba"], vrf:["toshiba","midea"], vrfhr:["toshiba","midea"], hp:["midea"]}, hint:"Carrier: τα οικιακά είναι συνήθως Midea, τα επαγγελματικά/VRF Toshiba-Carrier. Δες ταμπελάκι."},
  {n:"Inventor", cands:{split:["aux","midea","inv_gree"], hp:["midea","inv_mc"], vrf:["midea"], vrfhr:["midea"]}, hint:"Η Inventor δεν έχει δικό της εργοστάσιο. Τα επίσημα manuals της δείχνουν σειρές AUX, Midea και σειρές με βλαβολόγιο τύπου Gree (π.χ. EVI/EVO, Cosmo B2VI από Gree Zhuhai, U-Match). Οι αντλίες Matrix έχουν το βλαβολόγιο της Midea M-Thermal. Δες «Manufacturer/Made by» στο ταμπελάκι εξωτερικής ή αποθήκευσε το πρόθεμα μοντέλου όταν το επιβεβαιώσεις."},
  {n:"Toyotomi", cands:{split:["gree","midea","aux","tcl","hisense","haier"], hp:["midea","gree"], vrf:["midea","gree"], vrfhr:["midea","gree"]}, hint:"Στα εγχειρίδια Toyotomi Erai, Umi, TRN/TRG οι κωδικοί είναι τύπου Gree (U8, H6, H3, C5, F0…). Η σειρά Ikigai (TAN/TAG‑..IG) είναι AUX. Γράψε ή σκάναρε το μοντέλο από το ταμπελάκι."},
  {n:"Sendo", fac:"Ελληνική μάρκα – Intercool Hellas Α.Ε., Πάτρα (εργοστάσιο κατασκευής δεν δηλώνεται δημόσια)", cands:GENERIC, hint:"Η Sendo είναι μάρκα της Intercool Hellas (Πάτρα, κατά τη σελίδα εκθέτη ISH 2025). Μοντέλα: SND-xx…-ID/-OD (τοίχου), SFM-…-AU1 / SFM-…OU…-AU2 (multi), SDU-… (κανάλι). Οι σειρές βγαίνουν από διαφορετικά εργοστάσια και δεν βρέθηκε δημόσιο service manual. Δες «Manufacturer» στο ταμπελάκι ή ρώτα την Intercool, και στείλε φωτογραφία ταμπέλας με την αναφορά."},
  {n:"Nexi (by Sendo)", cands:GENERIC},
  {n:"Juro-Pro", cands:{split:["midea","gree","aux","tcl","hisense","haier"], hp:["midea"], vrf:["midea"], vrfhr:["midea"]}, hint:"Τα Juro-Pro έχουν λειτουργία «Follow Me», χαρακτηριστική της Midea – πιθανότατα Midea OEM. Το εγχειρίδιο Eco II του εισαγωγέα (ΜΑΓΝΗΤΙΚΗ Α.Ε.) δεν γράφει εργοστάσιο ούτε πίνακα κωδικών (ελέγχθηκε 18/11/2026). Επιβεβαίωσε στο ταμπελάκι («Manufacturer») ή στείλε φωτογραφία ταμπέλας από την αναφορά."},
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
  {n:"Omnys", cands:{split:["tcl","midea","gree","aux","hisense","haier"]}, hint:"Στο επίσημο εγχειρίδιο Omnys (WNX-…M22) οι κωδικοί E1 = αισθητήριο χώρου, E2 = αισθητήριο σωλήνα, E6 = μοτέρ εσωτερικής – ίδιοι με TCL. Για τους υπόλοιπους σύγκρινε με το manual."},
  {n:"Xiaomi", fac:"Xiaomi – δικό της εργοστάσιο κλιματιστικών στη Wuhan από τον Οκτώβριο 2025· παλαιότερα μοντέλα από OEM", cands:GENERIC},
  {n:"Beko", fac:"Arçelik/Beko – κλιματιστικά από το εργοστάσιο Arçelik-LG Klima (Τουρκία, κοινοπραξία με LG)", cands:GENERIC},
  {n:"Sharp", fac:"Sharp – παράγει κλιματιστικά στο Sharp Appliances (Thailand)· δεν υπάρχει δημόσιο ευρωπαϊκό βλαβολόγιο", cands:GENERIC},
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
if(typeof OUTP!=="undefined") Object.keys(OUTP).forEach(function(p){ if(OUTP[p].split && !OUTP[p].multi) OUTP[p].multi = OUTP[p].split; });

// ===== Αναζήτηση μάρκας (ελληνικά/αγγλικά) =====
var ALIAS = {
 "LG":["λγ","ελτζι","ελ τζι","ελζι","λ τζι","λτζι","ελ τζη"], "Daikin":["νταικιν","ντάικιν","νταϊκιν","ντεικιν"], "Mitsubishi Electric":["μιτσουμπισι","μιτσουμπίσι ελεκτρικ","μιτσουμπισι ηλεκτρικ","mitsubishi"],
 "Mitsubishi Heavy":["μιτσουμπισι χεβι","μιτσουμπισι βαρεα","heavy","mhi"], "Fujitsu":["φουτζιτσου","φουτζίτσου","φουτζι"], "Toshiba":["τοσιμπα","τοσίμπα","τοσιμπα"],
 "Panasonic":["πανασονικ","πανασόνικ"], "Samsung":["σαμσουνγκ","σάμσουνγκ","σαμσουγκ"], "Hitachi":["χιτατσι","χιτάτσι"], "Gree":["γκρι","γκρη","γρι","γκριι"],
 "Midea":["μιντεα","μιντέα","μιδεα","μιντια"], "AUX":["αουξ","αυξ","ωξ","οξ","άουξ"], "Hisense":["χαισενς","χαϊσενς","χισενς","χαισενσ"], "Haier":["χαιερ","χάιερ","χαϊερ","χαιρ"], "Candy":["κάντι","καντι","καντυ","κάντυ","κεντι"],
 "TCL":["τσλ","τισιελ","τι σι ελ"], "Cooper&Hunter":["κουπερ","κούπερ","κουπερ χαντερ","κουπερ εντ χαντερ","κουπερ και χαντερ","cooper"], "Bosch":["μπος","μποσ"], "Carrier":["καριερ","κάριερ"],
 "Inventor":["ινβεντορ","ινβέντορ","inventor"], "Kerosun":["κεροσαν","κεροσάν","kero sun","kero-sun","κερο σαν"], "Aufit":["αουφιτ","άουφιτ","aufit"], "Argo":["αργκο","άργκο","αργο","άργο"], "Nobu":["νομπου","νόμπου","νομπού"], "Wellio":["γουελιο","γουέλιο"], "CHiQ":["τσικ","σικιου","changhong","τσανγκχονγκ"], "Sang":["σανγκ","σανκ"], "Toyotomi":["τογιοτομι","τογιοτόμι"], "Qualitair":["κουαλιτερ","κουάλιτερ","κουαλιταιρ","qualiter","κοβαλιτερ"], "Sendo":["σεντο","σέντο"], "Nexi (by Sendo)":["νεξι","νέξι"],
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

// ===== Αυτόματη αναγνώριση εργοστασίου από το μοντέλο =====
// b: μάρκα (null = ισχύει για όλες), re: regex στο μοντέλο (κεφαλαία, χωρίς κενά), o: εργοστάσιο, w: γιατί
var OEMRX = [
  {b:["Inventor","Nobu"], re:/^[VU]\dM[CDFR]/, o:"midea", w:"Επαγγελματικά Inventor σειράς V5M/V6M (κασέτα MCI, κανάλι MDI, ντουλάπα MFI/MFO, οροφής MRI – εξωτερικές U5MRS/U5MRT) είναι Midea."},
  {b:["Inventor","Nobu"], re:/^[A-Z]\dMV[IO]/, o:"midea", w:"Σειρές Inventor …MVI/…MVO (π.χ. P6MVI, O1MVI, O3MVI): τα service manuals τους έχουν αισθητήρια T1–T4 και λειτουργία ελέγχου τύπου Midea."},
  {b:["Inventor","Nobu"], re:/^L\dV[IO]/, o:"inv_gree", w:"Σειρά Inventor L4VI/L4VO: το service manual έχει τη δομή και τους κωδικούς Gree."},
  {b:["Toyotomi"], re:/^TA[NG][-\/]?\d{2}IG/, o:"aux", w:"Toyotomi Ikigai (TAN/TAG-09/12/18/24IG): το επίσημο εγχειρίδιο Wi‑Fi της Toyotomi για τη σειρά χρησιμοποιεί την εφαρμογή «AC Freedom», που είναι της AUX Air Conditioner Co. → ηλεκτρονικά/πλακέτα AUX. Το εγχειρίδιο χρήσης δεν έχει πίνακα κωδικών – επιβεβαίωσε με τον κωδικό που δείχνει η μονάδα."},
  {b:["Toyotomi"], re:/^(CT|TR)[NG][-\/]?\d/, o:"gree", w:"Toyotomi CTN/CTG (Erai) και TRN/TRG: τα εγχειρίδια δείχνουν κωδικούς Gree (U8, H6, H3, E1, E5, C5, F0–F2)."},
  {b:["Bosch"], re:/^RAC\d|^CL\d{4}|^CLIMATE/, o:"midea", w:"Bosch Climate (RAC…) είναι Midea."},
  // Μάρκες με δικό τους εργοστάσιο – ονοματολογία μοντέλων Ευρώπης (κατάλογοι κατασκευαστών, Eurovent, EPREL)
  {b:null, re:/^(FTX[A-Z]{0,2}|ATX[A-Z]?|FVX[A-Z]|FDX[A-Z]|FBA|FCAG|FCAHG|FFA|FHA|FNA|FCAH|CTXM|CTXA|RXM|RXP|RXF|RXJ|RXA|RXC|RXTM|RXZ|RXTA|ARX[A-Z]?|RZAG|RZASG|RZQG|RZQSG|[2-5]MX[A-Z]|[2-5]AMX|EHB[HX]|EHV[HXZ]|EHS[HX]|ERGA|ERLA|EBLA|EDLA|EBSX|ETBH|ETBX|ETVH|ETVX|ETSH|EPRA|EABH|EAVH|RYYQ|RXYQ|REYQ|RXYSQ|RXYSCQ|RWEYQ|FXSQ|FXZQ|FXFQ|FXAQ|FXMQ|FXDQ|FXHQ|FXUQ|FXLQ|FXNQ|FXKQ|FXCQ)\d/, o:"daikin", w:"Η ονομασία FTX…/ATX…/RXM…/ERGA/EHBH/RXYQ/FXSQ… είναι της Daikin (κατάλογοι Daikin Europe)."},
  {b:null, re:/^(MSZ|MUZ|MSY|MUY|MFZ|MLZ|SEZ|SUZ|SLZ|SUHZ|PEAD|PEA|PKA|PLA|PCA|PSA|PUHZ|PUZ|PUMY|MXZ|PUD|EHST|EHPT|ERST|EHSD|ERSD|EHSC|ERSC|EHPX|ERPX|EHSE|PURY|PUHY|PQHY|PQRY|PEFY|PLFY|PKFY|PCFY|PMFY|PFFY|CMB)-?[A-Z0-9]/, o:"me", w:"Η ονομασία MSZ/MUZ, SEZ/SUZ, PEAD/PUHZ, MXZ, EHST/PUD, PURY/PUHY/PEFY είναι της Mitsubishi Electric."},
  {b:null, re:/^(SRK|SRC|SRF|SRR|SCM|FDC|FDT|FDTC|FDU|FDUM|FDE|FDK|FDF|FDFL|FDFW|FDCA|FDCS|FDTW|FDTQ|FDQ|FDUH|FDUT|FDKN|FDFU)-?\d/, o:"mhi", w:"Η ονομασία SRK/SRC, SCM, FDC/FDT/FDU/FDE είναι της Mitsubishi Heavy Industries."},
  {b:null, re:/^(AS[YEHT][AGH]|AO[YEH][AGH]|AU[XY][AG]|AR[XY]G|AB[YX]G|AG[YX]G|AJ[YH]|WS[YH][AGK]|WO[YH][AGK]|WG[YH][AGK]|AS[YE]A|AO[YE]A)\d/, o:"fujitsu", w:"Η ονομασία ASYG/AOYG, ASEH/AOEH, ARXG, AUXG, AJY, WSYG/WOYG είναι της Fujitsu (General)."},
  {b:null, re:/^(CS|CU)-[A-Z]{0,4}\d|^KIT-[A-Z]{0,4}\d|^WH-(SDC|SXC|UD|MDC|ADC|SQC|UQ|MXC|WDG|WXG|UDZ|UX|SD|SX)|^S-\d{2,3}[A-Z]|^U-\d{1,3}[A-Z]/, o:"panasonic", w:"Η ονομασία CS-/CU-, KIT-, WH-SDC/WH-UD (Aquarea), S-…/U-… (PACi/ECOi) είναι της Panasonic."},
  {b:null, re:/^[A-Z]{1,3}\d{2}[A-Z]{1,3}\.?(NSJ|NSK|NS1|NSH|NSA|NB1|NBJ|NBK|SSJ|SSK|UA3|UA2|UL2|UL1|ULD|UE1|UE2|U18|U24|U30|U12|U4)$|^(ARNU|ARUN|ARUM|ARUB|ARWN|ARWB|ZRUN|ZUUN|HN\d{4}|HU\d{3}|HM\d{3}|MU[2-5]R|UU\d{2}W)/, o:"lg", w:"Η ονομασία LG έχει μορφή «S12ET.NSJ / PC12SQ.UA3 / DC09RK.UL2» (N…=εσωτερική, U…=εξωτερική) ή ARNU/ARUN (Multi V), HM/HN/HU (Therma V)."},
  {b:null, re:/^AR\d{2}[A-Z]{2,}|^AJ\d{3}[A-Z]|^AE\d{3}[A-Z]|^AM\d{3}[A-Z]{2}|^AC\d{3}[A-Z]{2}|^AN\d{3}|^NS\d{3}|^NJ\d{3}|^F-AR\d|^MIM-|^MWR-/, o:"samsung", w:"Η ονομασία AR09…/AJ…(FJM)/AE…(EHS)/AM…(DVM)/AC…(BAC) είναι της Samsung."},
  {b:null, re:/^(RAK|RAC|RAM|RAI|RAD|RAF)-[A-Z]{0,3}\d|^(RCI|RCIM|RCD|RPI|RPIM|RPIL|RPK|RPC|RPF|RPFI|RWM|RWD|RWH|RHUE|RASC)-\d|^RAS-\d{1,2}(\.\d)?[A-Z]{1,3}(V|N|F|G|E|S)/, o:"hitachi", w:"Η ονομασία RAK/RAC (οικιακά), RCI/RPI/RPK/RPC, RAS-…HVRC/HNCE/FSXN (Utopia/Set Free), RWM/RWD (Yutaki) είναι της Hitachi."},
  {b:null, re:/^(HWS|HWT|MMY|MCY|MMK|MMU|MMD|MML|MMC|MMF|MMV|RBC)-/, o:"toshiba", w:"Η ονομασία HWS-/HWT- (Estia), MMY-/MCY- (VRF), MMK/MMU/MMD (εσωτερικές VRF) είναι της Toshiba."},
  {b:null, re:/^KCT\d/, o:"kerosun", w:"Μοντέλο KCT = Kerosun Clima."},
  {b:null, re:/^RA[SV]-/, o:"toshiba", w:"Μοντέλα RAS-/RAV- είναι Toshiba (και Toshiba-Carrier)."},
  {b:null, re:/HRF?N\d|HFN\d|HRDN\d|^M[2-5]?O[A-Z]{1,2}-?\d{2}|^MS[A-Z]{1,4}-?\d{2}H|^MOX\d|^MOB\d|^MOU-|^MCD-|^MUE-|^MOE-|^42Q|^38Q|^M\d?O[DE]-/, o:"midea", w:"Η ονομασία (π.χ. …HRFN8, MOX/MOB/MOU, MSAG/MSMB, 42QHC/38QHC) είναι του εργοστασίου Midea."},
  {b:null, re:/^GW[HC]\d|^GU[HC]?D?\d|^GMV|^GWHD|-K\dDN[A-Z]|^CH-S\d/, o:"gree", w:"Η ονομασία GWH/GWC/GU…, GMV ή …-K6DNA είναι του εργοστασίου Gree."},
  {b:null, re:/^AS[WX]-?H\d{2}|^ASF-?H\d{2}|^AL[CM][A-Z]?-?H\d{2}|^AM[2-5]-?H\d{2}|^ACK?-?H\d{2}|^[FD]ASW-?H|\/JAR3DI|\/JD|\/FZR|\/FREE|\/AUFIT/, o:"aux", w:"Η ονομασία ASW-H…, ASF-H…, AM2-H…, …/JAR3DI είναι του εργοστασίου AUX."},
  {b:null, re:/^TAC-?\d|^TCA-|^FMA-|^TPG|^TACO|CHSD\//, o:"tcl", w:"Η ονομασία TAC-…CHSD / FMA- είναι του εργοστασίου TCL."},
  {b:null, re:/^AS-?\d{2}U[RW]|^AU[DCFV]-\d|^[2-5]?AMW-?\d|^AUW-|^AW-?\d{2}U/, o:"hisense", w:"Η ονομασία AS-…UR4S / AUD- / AUC- / AMW είναι του εργοστασίου Hisense."},
  {b:null, re:/^CY-?\d{2}[A-Z]{2}(IN|OUT)|^CY-?\d{1}T\d{2}[A-Z]?OUT/, o:"haier", w:"Μοντέλα Candy CY-…IN / CY-…OUT (Pura, Aria) κατασκευάζονται από τη Haier (ταμπελάκι: Qingdao Haier Air Conditioner)."},
  {b:null, re:/^[1-5]U\d{2}[A-Z]|^AS\d{2}[A-Z]{2}\d|^AS\d{2}[A-Z]{2}[A-Z0-9]{0,4}(HRA|ERA)|^AD\d{2}[A-Z]|^AB\d{2}[A-Z]|^HSU-/, o:"haier", w:"Η ονομασία 1U/2U…, AS25…, AD/AB… είναι του εργοστασίου Haier."}
];
function detectOem(b, model){
  var v = gr2lat(String(model||"")).toUpperCase().replace(/\s/g,""); if(v.length<3) return null;
  for(var i=0;i<OEMRX.length;i++){ var r=OEMRX[i];
    if(r.b && r.b.indexOf(b.n)<0) continue;
    if(r.re.test(v)) return r;
  }
  return null;
}

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
var BPAL = ["#2F6FD0","#4C5FB8","#1F8A7E","#C8582A","#B8304A","#7A55B5","#2E8A57","#B5850A","#3A7FC2","#B04680","#4E8A2E","#6C4FA8","#C8283A","#1C8AA6"];
function bInit(n){
  var w = String(n).replace(/\(.*?\)/g,"").replace(/[&+]/g," ").split(/[\s\-…]+/).filter(function(x){return /[A-Za-zΑ-Ωα-ω0-9]/.test(x);});
  if(!w.length) return "?";
  if(w.length===1) return w[0].length<=3 ? w[0].toUpperCase() : w[0].slice(0,2).toUpperCase();
  return (w[0][0]+w[1][0]).toUpperCase();
}
function bCol(n){ var h=0; for(var i=0;i<n.length;i++) h=(h*31+n.charCodeAt(i))>>>0; return BPAL[h%BPAL.length]; }
function badge(n, cls){ if(n==="Άλλη μάρκα…") return '<span class="bdg'+(cls?' '+cls:'')+'" style="background:#64748b">?</span>';
  var c=bCol(n); return '<span class="bdg'+(cls?' '+cls:'')+'" style="background:linear-gradient(140deg,'+c+','+c+'cc)">'+esc(bInit(n))+'</span>'; }
function bSub(b){ return b.oem ? "Χωρίς δικό της εργοστάσιο – βλαβολόγιο "+PLAT[b.own].name : b.own ? "Δικό της εργοστάσιο – βλαβολόγιο "+PLAT[b.own].name : b.fac ? "Δικό της εργοστάσιο – χωρίς δημόσιο βλαβολόγιο" : (b.n==="Άλλη μάρκα…" ? "Άγνωστη μάρκα – διάλεξε εργοστάσιο" : "Χωρίς δικό της εργοστάσιο – θα σε ρωτήσω μοντέλο"); }
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
  var lcat = S.cat==="multi" ? "split" : S.cat;
  var useLed = S.src==="led" && plats.some(function(p){ return INLED[p] && (INLED[p][S.cat]||INLED[p][lcat]); });
  activeTables.ledMissing = S.src==="led" && !useLed;
  activeTables.plats = plats;
  plats.forEach(function(p){
    var list = useLed ? ((INLED[p] && (INLED[p][S.cat]||INLED[p][lcat])) || []) : useOut ? ((OUTP[p] && OUTP[p][S.cat]) || []) : (PLAT[p][S.cat]||[]);
    list.forEach(function(t){ if(T[t]) out.push({plat:p, key:t, tbl:T[t]}); });
  });
  return out;
}

// ===== ελληνικά γράμματα σε κωδικούς → λατινικά (ε5 → E5, Η6 → H6, ρ1 → P1) =====
var GR2LAT = {"Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"U","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"J","Ο":"O","Π":"P","Ρ":"P","Σ":"S","Τ":"T","Υ":"U","Φ":"F","Χ":"X","Ψ":"C","Ω":"V"};
function gr2lat(s){
  s = String(s||"");
  if(!/[\u0370-\u03FF\u1F00-\u1FFF]/.test(s)) return s;
  s = s.normalize ? s.normalize("NFD").replace(/[\u0300-\u036f]/g,"") : s;
  return s.toUpperCase().replace(/[\u0391-\u03A9]/g, function(ch){ return GR2LAT[ch] || ch; });
}
function cq(){ var q = S.q.trim(); return isTextQuery(q) ? q : gr2lat(q); }
// ===== κανονικοποίηση κωδικών =====
function norm(s){
  s = gr2lat(String(s)).toUpperCase().replace(/[\s\-\.\/_:]/g,"");
  s = s.replace(/^CH(?=\d)/,"");             // LG CH05 -> 05
  if(/^E\d{3}$/.test(s)===false && /^C\d{3}$/.test(s)) s = "E"+s.slice(1); // Samsung C101 -> E101
  if(/^\d+$/.test(s) && !(s.length>=3 && s[0]==="0")) s = String(parseInt(s,10)); // 05 -> 5 (όχι συνδυασμοί LED όπως 011)
  s = s.replace(/^([A-Z]+)0+(\d)/, "$1$2");   // E01 -> E1, P03 -> P3
  return s;
}
function isTextQuery(q){ var t = String(q).trim(); if(/^[A-Za-z0-9][A-Za-z0-9\- ]{0,6}$/.test(t) && (/\d/.test(t) || t.replace(/\W/g,"").length<=4)) return false; return /[α-ωάέήίόύώΑ-Ωa-z]{3,}/i.test(t) && !/^[A-Za-z]{1,2}\d/.test(t); }

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

// ===== 7-segment: χαρακτήρες που μπερδεύονται στην οθόνη =====
var SEG7 = {"0":["O","D"],"O":["0","D"],"D":["0","O"],"5":["S"],"S":["5"],"8":["B"],"B":["8","6"],"6":["B"],"2":["Z"],"Z":["2"],"U":["V"],"V":["U"],"1":["I"],"I":["1"]};
function lookalikes(q){
  var raw = gr2lat(String(q)).toUpperCase().replace(/[\s\-\.\/_:]/g,"");
  if(!raw || raw.length>6) return [];
  var tabs = activeTables(), have = {}, out = [];
  tabs.forEach(function(t){ t.tbl.codes.forEach(function(c){ c[0].forEach(function(k){ have[norm(k)] = k; }); }); });
  var vars = {}; vars[raw]=1;
  [0,1].forEach(function(){ Object.keys(vars).forEach(function(v){ for(var i=0;i<v.length;i++){ (SEG7[v[i]]||[]).forEach(function(a){ vars[v.slice(0,i)+a+v.slice(i+1)]=1; }); } }); });
  Object.keys(vars).forEach(function(v){ if(v===raw) return; var n=norm(v); if(have[n] && out.indexOf(have[n])<0) out.push(have[n]); });
  return out.slice(0,6);
}
function otherPlats(q){
  if(isTextQuery(q)) return [];
  var n = norm(q), cur = activeTables.plats || [], out = [];
  var cat = S.cat==="multi" ? "split" : S.cat;
  Object.keys(PLAT).forEach(function(p){
    if(cur.indexOf(p)>=0) return;
    var keys = PLAT[p][cat] || [], hit = null;
    keys.forEach(function(k){ var tb=T[k]; if(hit||!tb||!tb.codes) return; tb.codes.forEach(function(c){ if(!hit && c[0].some(function(x){ return norm(x)===n; })) hit=c[1]; }); });
    if(hit) out.push(PLAT[p].name+': '+hit);
  });
  return out.slice(0,6);
}
// ===== render =====
function renderCats(){
  var b = brandObj(); var av = CATS.filter(function(c){ return !b || candidatesFor(b,c.id).length; });
  if(b && av.length && !av.some(function(c){return c.id===S.cat;})) S.cat = av[0].id;
  $("catwrap").style.display = b && !S.bedit ? "" : "none";
  var cur = null; av.forEach(function(c){ if(c.id===S.cat) cur=c; });
  if(av.length===1) S.catOpen = false;
  if(cur && !S.catOpen){
    $("cats").className = "";
    $("cats").innerHTML = '<div class="catsel"><span class="cico">'+cur.icon+'</span><b>'+esc(cur.label)+'</b>'+(av.length>1?'<button class="chg ico" id="chgCat" aria-label="Αλλαγή κατηγορίας" title="Αλλαγή κατηγορίας"><svg class="ic"><use href="#i-swap"/></svg></button>':'')+'</div>';
    return;
  }
  $("cats").className = "cats";
  $("cats").innerHTML = av.map(function(c){
    return '<button class="cat'+(c.id===S.cat?' on':'')+'" data-c="'+c.id+'"><span>'+c.icon+'</span>'+esc(c.label)+'</button>';
  }).join("");
}
function renderBrands(){
  var list = BRANDS.slice();
  var own = list.filter(function(b){return b.own && !b.oem;}), oem = list.filter(function(b){return b.oem;}), fac = list.filter(function(b){return b.fac;}), reb = list.filter(function(b){return !b.own && !b.fac;});
  function btn(b){ return '<button class="br'+(b.n===S.brand?' on':'')+(b.own&&!b.oem?'':b.oem||b.fac?' oem':' reb')+'" data-b="'+esc(b.n)+'">'+badge(b.n,"sm")+esc(b.n)+'</button>'; }
  var cb = brandObj(), editing = !cb || S.bedit;
  $("bchosen").innerHTML = (cb && !editing) ? '<div class="bchosen">'+badge(cb.n,"lg")+'<div class="bt"><b>'+esc(cb.n)+'</b><small>'+esc((!cb.own && S.oem && S.oem!=="__all" && PLAT[S.oem]) ? "Εργοστάσιο: "+PLAT[S.oem].name+(S.model?" (από το μοντέλο "+S.model+")":"") : bSub(cb))+'</small></div><button class="chg ico" id="chgBrand" aria-label="Αλλαγή μάρκας" title="Αλλαγή μάρκας"><svg class="ic"><use href="#i-swap"/></svg></button></div>' : "";
  $("bpick").style.display = editing ? "" : "none";
  $("bcancel").style.display = (cb && S.bedit) ? "" : "none";
  if(!editing) $("brandsWrap").classList.remove("open");
  else if(!cb && !renderBrands._init) $("brandsWrap").classList.add("open");
  renderBrands._init = true;
  $("brandSel").classList.toggle("on", $("brandsWrap").classList.contains("open"));
  var rb = []; recent.forEach(function(x){ if(rb.indexOf(x.brand)<0) rb.push(x.brand); }); rb = rb.slice(0,6).map(function(n){ return BRANDS.filter(function(b){ return b.n===n; })[0]; }).filter(Boolean);
  var rest = oem.length+fac.length+reb.length;
  $("brands").innerHTML = (rb.length?'<div class="grp">⭐ Πρόσφατες</div><div class="bgrid cmp">'+rb.map(btn).join("")+'</div>':'')+'<div class="grp">🏭 Οι βασικές μάρκες</div><div class="bgrid cmp">'+own.map(btn).join("")+'</div>'+
    (S.ball ? '<div class="grp">🔗 Χωρίς δικό τους εργοστάσιο – γνωστός κατασκευαστής</div><div class="bgrid cmp">'+oem.map(btn).join("")+'</div>'+
    '<div class="grp">🏭 Δικό τους εργοστάσιο – χωρίς δημόσιο βλαβολόγιο</div><div class="bgrid cmp">'+fac.map(btn).join("")+'</div>'+
    (reb.length?'<div class="grp">❓ Χωρίς δικό τους εργοστάσιο – αλλάζει ανά σειρά (θα χρειαστεί μοντέλο/ταμπελάκι)</div><div class="bgrid cmp">'+reb.map(btn).join("")+'</div>':'')+'<button class="mini bmore" id="ballbtn">▲ Λιγότερες μάρκες</button>'
    : '<button class="mini bmore" id="ballbtn">▼ Όλες οι μάρκες ('+rest+' ακόμα)</button>');
  if(document.activeElement!==$("bq")) $("bq").value = S.bedit ? "" : (S.brand || "");
  $("bsug").innerHTML = "";
}
// ===== Οδηγός «Βρες το εργοστάσιο» (χωρίς μοντέλο) =====
var FW = {
  comp: [[/^(QX[AF]|FTZ|QXAS)/,"gree",2,"Συμπιεστής Gree (QXA/QXF/FTz) – η Gree βάζει δικούς της συμπιεστές."],[/^(K[ST][KMN]|AS[KMN]|ATM|ATF)\d/,"midea",1,"Συμπιεστής GMCC – συνήθως σε μονάδες Midea (αλλά τον αγοράζουν κι άλλοι, γι' αυτό μετρά λιγότερο)."]],
  plate: [["Zhuhai – Gree Electric Appliances","gree"],["Foshan / Shunde – GD Midea","midea"],["Ningbo – AUX","aux"],["Zhongshan – TCL","tcl"],["Qingdao – Haier","haier"],["Hisense (Shandong / Qingdao)","hisense"],["Δεν γράφει / δεν ξέρω",""]],
  rc: [[/^R(G\d{2}|5[17]|05|06|11)/,"midea","Τα τηλεχειριστήρια RG57/RG66/R51/R05 είναι της Midea."],[/^Y[A-Z]{1,3}\d?F/,"gree","Τα τηλεχειριστήρια Y…1F (YAP1F, YAN1F, YB1F, YAC1F…) είναι της Gree."],[/^YKR-/,"aux","Τα τηλεχειριστήρια YKR-… είναι της AUX."],[/^GYKQ/,"tcl","Τα τηλεχειριστήρια GYKQ-… είναι της TCL."]]
};
FW.pcb = [[/^3013\d|^30002\d|^GR[JZ]W?\d/,"gree",2,"Πλακέτα Gree (κωδικός 30138…/30002… ή τυπωμένο GRJ…)."],[/^171[2-3]\d{3}/,"midea",2,"Πλακέτα Midea (κωδικός ανταλλακτικού 17122…/17123…)."],[/^00(10|11)\d{5}/,"haier",1,"Κωδικός πλακέτας τύπου Haier (0010…/0011…) – λιγότερο σίγουρο."],[/^SX-/,"aux",1,"Τυπωμένο SX-… – συναντάται σε πλακέτες AUX (λιγότερο σίγουρο)."],[/^DB9\d/,"samsung",2,"Πλακέτα Samsung (DB92/DB93…)."],[/^2109\d{5}/,"tcl",2,"Κωδικός ανταλλακτικού TCL (2109…)."],[/^K2\d{6}|^PCB-?HTSD|^PCB05-/,"hisense",2,"Πλακέτα Hisense (κωδικός K2…… ή τυπωμένο PCB-HTSD…/PCB05-…)."],[/^EBR\d{8}/,"lg",2,"Πλακέτα LG (EBR…)."],[/^MCC-?\d{3,4}/,"toshiba",2,"Πλακέτα Toshiba (MCC-…)."],[/^E[12]2[A-Z]\d{5}/,"me",2,"Πλακέτα Mitsubishi Electric (E22…/E12…)."],[/^EZ-?\d{6}/,"fujitsu",2,"Πλακέτα Fujitsu (ετικέτα EZ-……)."]];
S.fw = {plate:"", rc:"", comp:"", pcb:"", ser:""};
function fwMap(o, cs){ if(!o || o==="?") return null; if(cs.indexOf(o)>=0) return o; if(o==="gree" && cs.indexOf("inv_gree")>=0) return "inv_gree"; return o; }
function fwScore(cs){
  var sc = {}, why = {};
  function add(o, w, t){ o = fwMap(o, cs); if(!o) return; sc[o]=(sc[o]||0)+w; (why[o]=why[o]||[]).push(t); }
  var cp = String(S.fw.comp||"").toUpperCase().replace(/[\s\-]/g,"");
  if(cp.length>=3) FW.comp.forEach(function(x){ if(x[0].test(cp)) add(x[1],x[2],x[3]); });
  var pb = String(S.fw.pcb||"").toUpperCase().replace(/\s/g,"");
  if(pb.length>=4) FW.pcb.forEach(function(x){ if(x[0].test(pb)) add(x[1],x[2],x[3]); });
  if(S.fw.ser && typeof serInfo==="function") serInfo(S.fw.ser, null).forEach(function(e){ if(e.w && !e.model) add(e.o, e.w, e.k+(e.d?" · "+dateTxt(e.d).replace("📅 ",""):"")); });
  FW.plate.forEach(function(a){ if(S.fw.plate===a[0]) add(a[1],2,"ταμπελάκι: "+a[0]); });
  var r = String(S.fw.rc||"").toUpperCase().replace(/\s/g,"");
  if(r.length>=3) FW.rc.forEach(function(x){ if(x[0].test(r)) add(x[1],2,x[2]); });
  return {sc:sc, why:why};
}
function fwizHtml(b, cs){
  if(!S.fwOpen) return '<button class="mini fwbtn" id="fwopen">🔎 Δεν ξέρω το εργοστάσιο – βοήθησέ με</button>';
  var chips = function(key, list){ return '<div class="chips">'+list.map(function(a){ return '<button class="chip'+(S.fw[key]===a[0]?' on':'')+'" data-fwk="'+key+'" data-fwv="'+esc(a[0])+'">'+esc(a[0])+'</button>'; }).join("")+'</div>'; };
  var h = '<div class="fwiz"><div class="lbl" style="margin-top:0">🔎 Βρες το εργοστάσιο – απάντησε ό,τι ξέρεις</div>'+
    '<button class="mini scanbtn" data-scan="ser"><svg class="ic"><use href="#i-scan"/></svg> Σκάναρε το barcode της ετικέτας (σειριακός)</button>'+
    (S.fw.ser ? '<div class="serbox"><div class="small"><b>Σειριακός:</b> '+esc(S.fw.ser)+' <button class="x" data-fwclr="ser">✕</button></div>'+serHtml(S.fw.ser, cs)+'</div>' : '')+
    '<div class="small"><b>1. Ταμπελάκι εξωτερικής:</b> τι γράφει για κατασκευαστή ή πόλη (Manufacturer / Made in / διεύθυνση);</div>'+chips("plate",FW.plate)+
    '<div class="small" style="margin-top:8px"><b>2. Τηλεχειριστήριο:</b> γράψε τον κωδικό στην πλάτη ή μέσα στη θήκη μπαταριών</div><input id="fwrc" placeholder="π.χ. RG57A6/BGEF, YAP1F, YKR-…" autocapitalize="characters" spellcheck="false" value="'+esc(S.fw.rc)+'">'+
    '<div class="small" style="margin-top:8px"><b>3. Ετικέτα συμπιεστή</b> (βγάλε το πλαϊνό καπάκι της εξωτερικής – γράψε το μοντέλο του συμπιεστή):</div><div class="row2"><input id="fwcomp" placeholder="π.χ. QXA-A091zE190, KSK103D33UEZ3" autocapitalize="characters" spellcheck="false" value="'+esc(S.fw.comp)+'"><button class="mini" data-scan="comp" title="Σάρωση"><svg class="ic"><use href="#i-scan"/></svg></button></div>'+
    '<div class="small" style="margin-top:8px"><b>4. Πλακέτα εξωτερικής</b> (ρεύμα κλειστό): γράψε τον κωδικό από το λευκό αυτοκόλλητο της πλακέτας ή ό,τι είναι τυπωμένο στην άκρη της</div><div class="row2"><input id="fwpcb" placeholder="π.χ. 30138000…, 17122000…, EBR…, MCC-…, K20…" autocapitalize="characters" spellcheck="false" value="'+esc(S.fw.pcb)+'"><button class="mini" data-scan="pcb" title="Σάρωση"><svg class="ic"><use href="#i-scan"/></svg></button></div>'+
    '<div class="small" style="margin-top:8px"><b>🧪 Ή με γνωστή βλάβη:</b> βγάζεις μια φίσα αισθητηρίου, βλέπεις τι κωδικό βγάζει, και βρίσκω ποιο εργοστάσιο ταιριάζει και με τον αρχικό κωδικό.</div><button class="mini scanbtn" data-fzopen="">🧪 Ξεκίνα τη δοκιμή</button><div id="ftbox">'+(S.fz?ftHtml():'')+'</div>'+
    '<div class="small" style="margin-top:8px">💡 <b>5. Ο κωδικός βλάβης:</b> γράψε τον στο πεδίο του κωδικού παρακάτω – αν υπάρχει μόνο στο βλαβολόγιο ενός εργοστασίου, θα σου το πω.</div>'+
    '<div id="fwres">'+fwResult(b, cs)+'</div></div>';
  return h;
}
function fwResult(b, cs){
  var r = fwScore(cs), ks = Object.keys(r.sc).sort(function(x,y){ return r.sc[y]-r.sc[x]; });
  if(!ks.length) return '<div class="small" style="margin-top:8px">Απάντησε τουλάχιστον ένα για να σου πω το πιθανό εργοστάσιο.</div>';
  var top = ks[0], tie = ks.length>1 && r.sc[ks[1]]===r.sc[top];
  if(tie) return '<div class="pver mid" style="margin-top:8px">⚠️ Τα στοιχεία δείχνουν διαφορετικά εργοστάσια ('+ks.map(function(k){return esc(PLAT[k]?PLAT[k].name:k);}).join(" / ")+'). Έλεγξε ξανά – συχνά το τηλεχειριστήριο έχει αλλαχτεί με γενικό.</div>';
  var name = PLAT[top] ? PLAT[top].name : top, inC = cs.indexOf(top)>=0, conf = ks.length>1 && r.sc[ks[1]]>=2, sure = r.sc[top]>=4 && !conf;
  var cw = conf ? '<div class="pver mid" style="margin-top:8px">⚠️ Αντικρουόμενα στοιχεία: '+esc(PLAT[ks[1]]?PLAT[ks[1]].name:ks[1])+' ('+esc(r.why[ks[1]].join(" · "))+'). Ίσως έχει αλλαχτεί πλακέτα ή τηλεχειριστήριο – έλεγξε ξανά.</div>' : '';
  return '<div class="pver '+(sure?'good':'mid')+'" style="margin-top:8px">'+(sure?'✅ Σχεδόν σίγουρα':'🟡 Πιθανότατα')+' <b>'+esc(name)+'</b><div class="small" style="font-weight:500">Γιατί: '+esc(r.why[top].join(" · "))+(sure||conf?'':' – με ένα ακόμα στοιχείο που ταιριάζει θα είναι σίγουρο.')+'</div></div>'+cw+
    (inC ? '<button class="mini" style="margin-top:6px" data-o="'+top+'">Χρησιμοποίησε '+esc(name)+'</button>' : '<div class="small">Το '+esc(name)+' δεν είναι στα συνήθη εργοστάσια της '+esc(b.n)+' σε αυτή την κατηγορία – έλεγξε ξανά.</div>');
}
document.addEventListener("click", function(e){
  var el = e.target.closest("#fwopen,[data-fwk],[data-fwclr]"); if(!el) return;
  if(el.id==="fwopen"){ S.fwOpen = true; renderOem(); return; }
  if(el.hasAttribute("data-fwclr")){ S.fw[el.getAttribute("data-fwclr")] = ""; renderOem(); return; }
  var k = el.getAttribute("data-fwk"), v = el.getAttribute("data-fwv"); S.fw[k] = S.fw[k]===v ? "" : v;
  var b = brandObj(); if(b && $("fwiz")){ $("fwiz").innerHTML = fwizHtml(b, candidates(b)); }
});
document.addEventListener("input", function(e){ var m = {fwrc:"rc", fwcomp:"comp", fwpcb:"pcb"}[e.target.id]; if(!m) return; S.fw[m] = e.target.value; var b=brandObj(); if(b && $("fwres")) $("fwres").innerHTML = fwResult(b, candidates(b)); });
function renderOem(){
  var b = brandObj(); var box = $("oembox");
  if(!b || S.bedit){ box.style.display="none"; return; }
  if(b.own){
    box.style.display = "block";
    box.innerHTML = (b.oem||b.fac ? '<div class="hint" style="margin:0 0 8px">🏭 '+esc((b.oem||b.fac).replace(/^./,function(c){return c.toUpperCase();}))+'.</div>' : "")+(b.hint ? '<div class="hint" style="margin:0 0 8px">'+esc(b.hint)+'</div>' : "")+
      (S.fw.ser ? '<div class="serbox"><div class="small"><b>Σειριακός:</b> '+esc(S.fw.ser)+' <button class="x" data-fwclr="ser">✕</button></div>'+serHtml(S.fw.ser, null)+'</div>' : '')+
      '<details class="oemx"><summary>🏷️ Ετικέτα (ημερομηνία κατασκευής) & manuals '+esc(b.n)+'</summary><button class="mini scanbtn" data-scan="ser"><svg class="ic"><use href="#i-scan"/></svg> Σκάναρε το barcode της ετικέτας – ημερομηνία κατασκευής</button>'+manLinks(b)+'</details>';
    return;
    box.innerHTML = (b.oem||b.fac ? '<div class="hint">🏭 '+esc((b.oem||b.fac).replace(/^./,function(c){return c.toUpperCase();}))+'.</div>' : "")+(b.hint ? '<div class="hint">'+esc(b.hint)+'</div>' : "")+
      '<label class="lbl step"><b>3</b> Μοντέλο (από το ταμπελάκι – προαιρετικό)</label><input id="model" placeholder="π.χ. '+esc(b.n==="LG"?"S12EQ / HU071MR":b.n==="Daikin"?"FTXM35R":b.n==="Gree"?"GWH12ACC-K6DNA1D":"μοντέλο εσωτερικής ή εξωτερικής")+'" autocapitalize="characters" spellcheck="false">'+
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
    manLinks(b)+(b.fac?'<div class="hint">🏭 '+esc(b.fac)+'.</div>':'')+(b.hint?'<div class="hint">'+esc(b.hint)+'</div>':'<div class="hint">Η '+esc(b.n)+' δεν έχει δικό της εργοστάσιο. Διάλεξε εργοστάσιο ή άφησε «Σύγκριση» για να δεις τι σημαίνει ο κωδικός σε κάθε πιθανό εργοστάσιο.</div>')+
    '<label class="lbl step"><b>3</b> Μοντέλο (από το ταμπελάκι)</label>'+
    '<div class="row2"><input id="model" placeholder="μοντέλο εξωτερικής ή εσωτερικής – π.χ. V5MFO32-60" autocapitalize="characters" spellcheck="false"><button id="saveMap" class="mini">Αποθήκευση</button></div>'+
    '<label class="platecta sm"><span class="pcic">📷</span><span><b>Φωτογραφία ταμπέλας</b><small>Διαβάζω το μοντέλο και βρίσκω το εργοστάσιο</small></span><input type="file" accept="image/*" capture="environment" class="plin" hidden></label>'+
    '<div id="mapMsg" class="small"></div>'+
    '<label class="lbl">Εργοστάσιο παραγωγής</label>'+
    '<div class="chips">'+(cs.length>1?'<button class="chip'+(S.oem==="__all"?' on':'')+'" data-o="__all">Σύγκριση όλων</button>':'')+
      cs.map(function(p){return '<button class="chip'+(S.oem===p?' on':'')+'" data-o="'+p+'">'+esc(PLAT[p].name)+'</button>';}).join("")+'</div>'+
    '<div id="fwiz">'+fwizHtml(b, cs)+'</div>'+
    '<details class="tip"><summary>Πώς βρίσκω το εργοστάσιο;</summary><p>'+esc(OEM_TIP)+'</p></details>'+
    (mine.length?'<div class="mymap"><div class="small"><b>Οι αντιστοιχίες μου για '+esc(b.n)+':</b></div>'+mine.map(function(m,i){return '<div class="mm"><span>'+esc(m.prefix)+'… → <b>'+esc(PLAT[m.oem]?PLAT[m.oem].name:m.oem)+'</b></span><button class="x" data-del="'+esc(m.prefix)+'">✕</button></div>';}).join("")+'</div>':'');
  var mi = $("model");
  mi.value = S.model||"";
  mi.addEventListener("input", function(){
    S.model = mi.value; var v = gr2lat(mi.value).toUpperCase().replace(/\s/g,"");
    var hit = null;
    myMap.forEach(function(m){ if(m.brand===b.n && v && v.indexOf(m.prefix)===0 && (!hit || m.prefix.length>hit.prefix.length)) hit=m; });
    if(hit && cs.indexOf(hit.oem)>=0){ S.oem = hit.oem; $("mapMsg").textContent = "Βρέθηκε στις αντιστοιχίες σου: "+hit.prefix+"… = "+PLAT[hit.oem].name; markChips(); renderCtx(); renderResults(); persist(); return; }
    var d = detectOem(b, v);
    if(d && cs.indexOf(d.o)>=0){ S.oem = d.o; $("mapMsg").innerHTML = '<span class="det">🔎 Εργοστάσιο: <b>'+esc(PLAT[d.o].name)+'</b></span> – '+esc(d.w); markChips(); renderCtx(); renderResults(); persist(); }
    else if(d && PLAT[d.o] && PLAT[d.o][S.cat]){ $("mapMsg").innerHTML = '<span class="det">🔎 Μοιάζει με '+esc(PLAT[d.o].name)+'</span> – '+esc(d.w)+' (δεν είναι στα συνήθη εργοστάσια της '+esc(b.n)+' σε αυτή την κατηγορία – έλεγξε το ταμπελάκι).'; }
    else $("mapMsg").textContent = v.length>=4 ? "Δεν αναγνωρίστηκε το εργοστάσιο από το μοντέλο – διάλεξέ το παρακάτω ή δες «Πώς βρίσκω το εργοστάσιο»." : "";
  });
  $("saveMap").addEventListener("click", function(){
    var v = gr2lat(mi.value||"").toUpperCase().replace(/\s/g,"");
    if(!v){ $("mapMsg").textContent="Γράψε πρώτα το μοντέλο."; return; }
    if(!S.oem || S.oem==="__all"){ $("mapMsg").textContent="Διάλεξε πρώτα εργοστάσιο (όχι «Σύγκριση»)."; return; }
    var pre = v.replace(/[-_].*$/,""); if(pre.length>8) pre = pre.slice(0,8); if(pre.length<2) pre=v;
    myMap = myMap.filter(function(m){return !(m.brand===b.n && m.prefix===pre);});
    myMap.push({brand:b.n, prefix:pre, oem:S.oem});
    LS.set("vl_mymap", myMap);
    renderOem();
    $("mapMsg").textContent = "Αποθηκεύτηκε: "+b.n+" "+pre+"… = "+PLAT[S.oem].name+" (μόνο σε αυτή τη συσκευή).";
  });  if(mi.value && !S._detLock){ S._detLock=1; try{ mi.dispatchEvent(new Event("input")); }catch(e){} S._detLock=0; }
}
function markChips(){ var cs=$("oembox").querySelectorAll(".chip"); for(var i=0;i<cs.length;i++){ cs[i].classList.toggle("on", cs[i].getAttribute("data-o")===S.oem); } }

function procBox(c, plat){
  var txt = c[1]+" "+(c[2]||""), out = "";
  PROCS.forEach(function(p){
    if(!p.test(c[1])) return;
    var pv = p.plat[plat] || p.plat._ || "";
    out += '<details class="proc"><summary>'+esc(p.title)+'</summary>'+(pv?'<div class="pext">📘 '+esc(pv)+'</div>':'')+
      '<ol class="steps">'+p.steps.map(function(s){ return '<li><b>'+esc(s[0])+'</b><div>'+esc(s[1])+'</div></li>'; }).join("")+'</ol></details>';
  });
  return out;
}

var KINDS = [
  ["Επικοινωνία","#6E7FD6",/επικοινων|σήμα|μετάδοσ|καλωδίωσ|διεύθυνσ|M-NET|tracking/i],
  ["Αισθητήριο","#1F9E8F",/αισθητ|θερμίστορ|thermistor/i],
  ["Ψυκτικό / πίεση","#D9622B",/πίεσ|πρεσοστ|ψυκτικ|διαρρο|βάνα|υπερθέρμανση κατάθλιψης|κατάθλιψ/i],
  ["Ανεμιστήρας","#3B86D9",/ανεμιστ|μοτέρ ανεμ|fan/i],
  ["Ηλεκτρικό / inverter","#D6334A",/IPM|PFC|ρεύμα|υπερέντασ|τάση|τάσεως|inverter|συμπιεστ|transistor|φάσ|DC link|current/i],
  ["Πλακέτα","#8A63C9",/πλακέτα|EEPROM|μνήμη|PCB|μικροεπεξ/i],
  ["Νερό / αποχέτευση","#2F6FD0",/νερ|ροή|αποχέτευ|φλοτέρ|συμπυκνωμάτων|στάθμη/i],
  ["Προστασία","#C99400",/προστασ|αντιπαγ|υπερθέρμ|υπερφόρτ|πάγωμα/i]
];
function kindOf(txt){ for(var i=0;i<KINDS.length;i++) if(KINDS[i][2].test(txt)) return KINDS[i]; return null; }
var LSTATE = {"0":"σβηστή","on":"αναμμένη","c":"αναβοσβήνει συνεχώς","s":"αργό αναβόσβημα"};
function lampVal(v){ return LSTATE[v] || ("× "+v); }
function ledSym(key, lamps){
  var vs = key.split("-");
  return '<span class="lsym">'+lamps.map(function(l,i){ var v=vs[i]||"0"; var cls = v==="0"?" off":(v==="c"?" c":v==="s"?" s":"");
    return '<span style="--lc:'+l.col+'"><i class="dot'+cls+'"></i>'+esc(l.n)+' '+esc(lampVal(v))+'</span>'; }).join("")+'</span>';
}
function behBox(plat, codes){
  var b = typeof behFor==="function" ? behFor(plat, codes) : null; if(!b) return "";
  var bo = brandObj(), lab = bo && !bo.own && PLAT[plat] ? ' <span class="small">(εργοστάσιο '+esc(PLAT[plat].name)+')</span>' : '';
  return '<div class="beh"><div><b>🩺 Τι κάνει το μηχάνημα'+lab+':</b> '+esc(b.s)+'</div><div class="small">📘 Πότε βγαίνει (manual): '+esc(b.d)+'</div></div>';
}
// Σημειώσεις ανά μάρκα για συγκεκριμένο κωδικό (από το εγχειρίδιο της μάρκας)
var BNOTE = {
  "Candy": {haier:{"F25":"Κατά το εγχειρίδιο χρήσης Candy, αν το F25 εμφανιστεί στον αυτοκαθαρισμό (CL) με εξωτερική θερμοκρασία κάτω από 0°C είναι κανονική προστασία: κλείσε το ρεύμα και ξανάνοιξε μετά από 10 δευτερόλεπτα."}}
};
function card(r, showPlat){
  var c = r.c, t = r.t, kd = kindOf(c[1]);
  return '<div class="res"'+(kd?' style="--kc:'+kd[1]+'"':'')+'>'+
    '<div class="rh"><span class="codes">'+(t.tbl.lamps ? ledSym(c[0][0], t.tbl.lamps) : t.tbl.pat ? '<span class="code pat">'+esc(patSym(c[0][0], t.tbl.pat.labels))+'</span>' : c[0].map(function(k){return '<span class="code">'+esc(k)+'</span>';}).join(""))+'</span>'+
    (showPlat?'<span class="plat">'+esc(PLAT[t.plat].name)+'</span>':(kd?'<span class="kind">'+esc(kd[0])+'</span>':''))+'</div>'+
    '<div class="rt">'+esc(c[1])+'</div>'+(/όχι βλάβη|δεν είναι βλάβη|κανονική λειτουργία|^κανονικ|κανονικό στο κρύο/i.test(c[1]+' '+(c[2]||'').slice(0,40)) ? '<div class="pver good">✅ Συνήθως <b>δεν είναι βλάβη εξαρτήματος</b> (κανονική λειτουργία, ειδοποίηση ή προσωρινή προστασία) – διάβασε την περιγραφή πριν αλλάξεις κάτι.</div>' : '')+(function(){ var vn = typeof verifNote==="function" ? verifNote(t.key, c[0]) : ""; return vn ? '<div class="vn">⚠️ <b>Μη επιβεβαιωμένο για Ελλάδα/Ευρώπη.</b> '+esc(vn)+'</div>' : ''; })()+(/_outled$|_multi_out$|_multiled$/.test(t.key) ? '' : behBox(t.plat, c[0]))+
    (c[4]?'<div class="rl">↔ '+esc(c[4])+'</div>':'')+
    (function(){ var bo2=brandObj(), bn=bo2&&BNOTE[bo2.n]; var x=bn&&bn[t.plat]&&bn[t.plat][c[0][0]]; return x ? '<div class="vn">🏷️ <b>'+esc(bo2.n)+':</b> '+esc(x)+'</div>' : ''; })()+
    (c[2]?(function(){ var st=stepsOf(c[2]); return st ? '<div class="rd"><b>🔧 Τι ελέγχεις – με τη σειρά:</b><ol class="steps">'+st.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ol></div>' : '<div class="rd"><b>🔧 Τι ελέγχεις:</b> '+esc(c[2])+'</div>'; })():'')+
    (c[3]?(typeof outRender==="function"?outRender(c[3]):'<div class="ro">📟 <b>Πλακέτα εξωτερικής:</b> '+esc(c[3])+'</div>'):'')+
    (typeof outBox==="function" ? outBox(t, c) : '')+
    procBox(c, t.plat)+
    partLinks(c[1]+' '+(c[2]||''), c)+
    (typeof noteBox==="function" ? noteBox(t.key, c[0][0], c[1]) : '')+
    (typeof repButton==="function" ? repButton(t.key, c[0][0]) : '')+
    '<div class="rs">'+esc(t.tbl.name)+(typeof VERIF_T!=="undefined" && VERIF_T[t.key] ? '<br>⚠️ '+esc(VERIF_T[t.key]) : '')+'</div>'+
  '</div>';
}
// ===== ΛΥΧΝΙΕΣ ΕΣΩΤΕΡΙΚΗΣ =====
S.ledv = {};
function ledGuideFor(plats){
  var g = []; plats.forEach(function(p){ var x = INGUIDE[p] || INGUIDE._; if(g.indexOf(x)<0) g.push(x); }); return g;
}
function ledGuideOnly(b){
  var pl = activeTables.plats || candidates(b);
  var g = ledGuideFor(pl.length?pl:["_"]);
  return '<div class="empty"><span class="big">💡</span>Για '+esc(b.n)+' σε αυτή την κατηγορία δεν υπάρχει πίνακας λυχνιών – ο κωδικός φαίνεται σε οθόνη ή χειριστήριο.</div>'+
    '<div class="guide">👀 <b>Τι κάνεις όταν αναβοσβήνει λυχνία:</b>'+g.map(function(x){return '<div>'+esc(x)+'</div>';}).join("")+'</div>';
}
function lampSig(t){ return t.tbl.lamps.map(function(l){return l.n;}).join("|"); }
function renderLed(b, tabs, multi){
  var html = "";
  var g = ledGuideFor(activeTables.plats||[]);
  html += '<div class="guide">👀 '+g.map(function(x){return esc(x);}).join("<br>")+'</div>';
  var groups = {}, order = [];
  tabs.forEach(function(t){ var k=lampSig(t); if(!groups[k]){ groups[k]=[]; order.push(k);} groups[k].push(t); });
  order.forEach(function(sig){
    var ts = groups[sig], lamps = ts[0].tbl.lamps;
    var cur = S.ledv[sig] || (S.ledv[sig] = lamps.map(function(){return null;}));
    var maxN = lamps.map(function(l,i){ var m=0; ts.forEach(function(t){ t.tbl.codes.forEach(function(c){ var v=c[0][0].split("-")[i]; if(/^\d+$/.test(v)) m=Math.max(m,+v); }); }); return m; });
    html += '<div class="ledw"><h3>Για κάθε λυχνία: μένει αναμμένη, είναι σβηστή ή πόσες φορές αναβοσβήνει;</h3>'+lamps.map(function(l,i){
      var opts = [];
      ["0","on"].concat(l.v).forEach(function(v){ if(v==="n"){ for(var k=1;k<=Math.max(maxN[i],1);k++) opts.push(String(k)); } else if(opts.indexOf(v)<0) opts.push(v); });
      if(l.v.indexOf("n")<0){ for(var k2=1;k2<=Math.max(maxN[i],0);k2++) if(opts.indexOf(String(k2))<0) opts.push(String(k2)); }
      var cv = cur[i], dcls = cv==null||cv==="0" ? " off" : cv==="c"?" c":cv==="s"?" s":"";
      return '<div class="lamp" style="--lc:'+l.col+'"><div class="lname"><i class="dot'+dcls+'"></i>'+esc(l.n)+' <small>'+esc(l.sub||"")+'</small></div><div class="lopts">'+
        opts.map(function(v){ var lab = v==="0"?"○ Σβηστή":v==="on"?"● Αναμμένη":v==="c"?"✱ Αναβοσβήνει συνεχώς":v==="s"?"✱ Αργά (1Hz)":v+"×"; return '<button class="lo'+(cv===v?' on':'')+'" data-lsig="'+esc(sig)+'" data-li="'+i+'" data-lv="'+v+'">'+lab+'</button>'; }).join("")+'</div></div>';
    }).join("")+(cur.some(function(x){return x!=null;})?'<button class="ledreset" data-lreset="'+esc(sig)+'">↺ Καθαρισμός</button>':'')+'</div>';
    var setN = cur.filter(function(x){return x!=null;}).length;
    if(!setN){ html += '<div class="empty">Μέτρησε τις αναλαμπές σε έναν πλήρη κύκλο (ανάμεσα σε δύο παύσες) και πάτα τις τιμές παραπάνω.</div>'; return; }
    var res = [];
    ts.forEach(function(t){ t.tbl.codes.forEach(function(c){
      var vs = c[0][0].split("-"), ok = true;
      cur.forEach(function(v,i){ if(v!=null && (vs[i]||"0")!==v) ok=false; });
      if(ok) res.push({t:t,c:c});
    });});
    if(!res.length){ html += '<div class="empty">Δεν βρέθηκε αυτός ο συνδυασμός. Ξαναμέτρησε (η μέτρηση ξεκινά μετά την παύση) ή δες τον πλήρη πίνακα πιο κάτω.</div>'; return; }
    if(setN<lamps.length) html += '<div class="small info">Ταιριάζουν '+res.length+' – διάλεξε και τις υπόλοιπες λυχνίες για ακρίβεια:</div>';
    var byTbl = {}; res.forEach(function(x){ (byTbl[x.t.key]=byTbl[x.t.key]||[]).push(x); });
    var many = Object.keys(byTbl).length>1;
    Object.keys(byTbl).forEach(function(k){
      if(many) html += '<div class="pgrp">'+esc(T[k].name)+':</div>';
      html += byTbl[k].slice(0,40).map(function(x){return card(x,multi);}).join("");
    });
  });
  return html;
}
function ledNotes(tabs){
  var seen={}, nh="";
  tabs.forEach(function(t){ if(seen[t.key]) return; seen[t.key]=1;
    nh += '<details class="note"><summary>📘 '+esc(t.tbl.name)+' – όλοι οι συνδυασμοί ('+t.tbl.codes.length+')</summary><p>'+esc(t.tbl.note)+'</p><p class="small">Πηγή: '+esc(t.tbl.src)+'</p>'+(t.tbl.chk?'<p class="small chk">✔ Έλεγχος: '+esc(t.tbl.chk)+'</p>':'')+
      '<div class="all">'+t.tbl.codes.map(function(c){ return '<div class="ar" style="cursor:default">'+ledSym(c[0][0], t.tbl.lamps)+'<div>'+esc(c[1])+'</div></div>'; }).join("")+'</div></details>';
  });
  $("notes").innerHTML = nh;
}
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-lv],[data-lreset]"); if(!el) return;
  if(el.hasAttribute("data-lreset")){ S.ledv[el.getAttribute("data-lreset")] = null; renderResults(); return; }
  var sig = el.getAttribute("data-lsig"), i = +el.getAttribute("data-li"), v = el.getAttribute("data-lv");
  var cur = S.ledv[sig]; if(!cur) return;
  cur[i] = cur[i]===v ? null : v; renderResults();
});
function renderCtx(){
  var b = brandObj(), c = null; CATS.forEach(function(x){ if(x.id===S.cat) c=x; });
  $("ctx").innerHTML = b ? badge(b.n,"sm")+'<span><b>'+esc(b.n)+'</b>'+(c?' · '+esc(c.label):'')+(S.oem && S.oem!=="__all" && !b.own && PLAT[S.oem]?' · '+esc(PLAT[S.oem].name):'')+'</span>' : '<span>Διάλεξε πρώτα μάρκα ↑</span>';
}
function renderResults(){
  var out = $("results"); var b = brandObj();
  if(S.src==="parts"){ renderParts(); return; }
  if(S.src==="sym"){ renderSym(); return; }
  if(!b){ var q0 = cq(); out.innerHTML = (q0 && S.src==="in" && !isTextQuery(q0)) ? reverseHtml(q0) : '<div class="empty">Διάλεξε κατηγορία και μάρκα – ή γράψε κατευθείαν τον κωδικό για να δεις σε ποια εργοστάσια υπάρχει.</div>'; $("notes").innerHTML=""; return; }
  var tabs = activeTables();
  if(!tabs.length && S.src==="led"){ out.innerHTML = ledGuideOnly(b); $("notes").innerHTML=""; return; }
  if(!tabs.length){ out.innerHTML = '<div class="empty">Δεν υπάρχει ακόμα βλαβολόγιο για '+esc(b.n)+' σε αυτή την κατηγορία.</div>'; $("notes").innerHTML=""; return; }
  var plats = {}; tabs.forEach(function(t){plats[t.plat]=1;}); var multi = Object.keys(plats).length>1;
  var q = cq();
  var html = "";
  if(S.src==="led"){ var lt = tabs.filter(function(t){ return t.tbl && t.tbl.lamps; }); if(!lt.length){ out.innerHTML = ledGuideOnly(b); $("notes").innerHTML=""; return; } out.innerHTML = renderLed(b, lt, multi); ledNotes(lt); return; }
  if(S.src==="out"){
    var gp = {}; candidates(b).forEach(function(p){ if(!(b.own || !S.oem || S.oem==="__all" || S.oem===p)) return; if(OUTGUIDE[p]) gp[p]=OUTGUIDE[p]; });
    var gk = Object.keys(gp);
    if(typeof multiOutGuide==="function") html += multiOutGuide();
    if(gk.length && S.cat!=="multi") html += '<div class="guide">👀 <b>Τι κοιτάς στην πλακέτα:</b>'+gk.map(function(p){ return '<div>'+(gk.length>1?'<b>'+esc(PLAT[p].name)+':</b> ':'')+esc(gp[p])+'</div>'; }).join("")+'</div>';
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
    if(S.src==="in" && S.cat==="multi" && typeof multiOutNote==="function") html += multiOutNote(q);
    if(r.mode==="none"){
      html += '<div class="empty">Ο κωδικός «'+esc(q)+'» δεν βρέθηκε για '+esc(b.n)+(multi?' (σε κανένα πιθανό εργοστάσιο)':'')+'.<br><span class="small">Έλεγξε κατηγορία μονάδας, γράμματα/αριθμούς (0 ↔ O, 1 ↔ I), ή αν η οθόνη δείχνει θερμοκρασία και όχι κωδικό.</span></div>';
      var op = otherPlats(q); if(op.length) html += '<div class="pver">🌍 Ο κωδικός υπάρχει σε άλλα εργοστάσια (μήπως το μηχάνημα είναι φτιαγμένο από άλλο εργοστάσιο; δες το ταμπελάκι):<ul>'+op.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul></div>';
      var la = lookalikes(q); if(la.length) html += '<div class="pver">🔎 Στην οθόνη 7 τμημάτων κάποια γράμματα μοιάζουν με αριθμούς (5↔S, 0↔O↔D, 8↔B↔6, 2↔Z, U↔V, 1↔I). Μήπως είναι: '+la.map(function(k){ return '<button class="mini" data-q="'+esc(k)+'">'+esc(k)+'</button>'; }).join(' ')+'</div>';
    } else {
      if(r.mode==="detail") html += '<div class="small info">Εμφανίζεται ο βασικός κωδικός '+esc(r.base)+' (ο υπόλοιπος αριθμός είναι λεπτομέρεια/μονάδα).</div>';
      if(r.mode==="prefix") html += '<div class="small info">Κωδικοί που ξεκινούν με «'+esc(q.toUpperCase())+'»:</div>';
      if(multi && r.mode!=="text"){
        var by = {}; r.res.forEach(function(x){ (by[x.t.plat]=by[x.t.plat]||[]).push(x); });
        var missing = Object.keys(plats).filter(function(p){return !by[p];});
        var found = Object.keys(by);
        if(found.length===1 && Object.keys(plats).length>1) html += '<div class="pver good">✅ Ο κωδικός «'+esc(q.toUpperCase())+'» υπάρχει μόνο στο βλαβολόγιο <b>'+esc(PLAT[found[0]].name)+'</b> από τα πιθανά εργοστάσια της '+esc(b.n)+' – πιθανότατα το μηχάνημα είναι '+esc(PLAT[found[0]].name)+'. <button class="mini" data-o="'+found[0]+'">Χρησιμοποίησε '+esc(PLAT[found[0]].name)+'</button></div>';
        else html += '<div class="small info">⚠️ Το εργοστάσιο δεν έχει επιλεγεί – ο ίδιος κωδικός σημαίνει διαφορετικά πράγματα ανά εργοστάσιο:</div>';
        Object.keys(by).forEach(function(p){ html += '<div class="pgrp">Αν είναι <b>'+esc(PLAT[p].name)+'</b>:</div>' + by[p].map(function(x){return card(x,false);}).join(""); });
        if(missing.length) html += '<div class="small">Δεν υπάρχει στο βλαβολόγιο: '+missing.map(function(p){return PLAT[p].name;}).join(", ")+'.</div>';
      } else {
        html += r.res.slice(0,60).map(function(x){return card(x,multi);}).join("");
      }
    }
  }
  out.innerHTML = html;
  // σημειώσεις & πλήρης λίστα
  var seen={}, nh='<div class="allh">📋 Όλοι οι κωδικοί – '+esc(b.n)+'</div>', ntab = 0;
  tabs.forEach(function(t){ if(!seen[t.key]) ntab++; }); seen = {};
  tabs.forEach(function(t){ if(seen[t.key]) return; seen[t.key]=1;
    nh += '<details class="note allc"'+(!q && ntab===1?' open':'')+'><summary>'+esc(t.tbl.name)+' ('+t.tbl.codes.length+' κωδικοί)</summary>'+
      '<p>'+esc(t.tbl.note)+'</p>'+(OUTNOTE[t.key]?'<p>📟 '+esc(OUTNOTE[t.key])+'</p>':'')+'<p class="small">Πηγή: '+esc(t.tbl.src)+'</p>'+(t.tbl.chk?'<p class="small chk">✔ Έλεγχος: '+esc(t.tbl.chk)+'</p>':'')+
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
function partLinks(txt, c){
  var ids = [];
  PKEYS.forEach(function(k){ if(ids.length<3 && k[1].test(txt) && !(k[0]==="sensor" && ids.indexOf("pswitch")>=0 && !/θερμ/i.test(txt))) ids.push(k[0]); });
  var gx = c ? gdExtra(txt) : [];
  if(!ids.length && !gx.length) return "";
  var side = c && /εξωτερ/i.test(c[1]) ? "out" : c && /εσωτερ/i.test(c[1]) ? "in" : "";
  var ctx = c ? ' data-fcode="'+esc(c[0][0])+'" data-ftitle="'+esc(c[1])+'" data-fside="'+side+'"' : '';
  return '<div class="plinks">'+(c?'<button class="plk gdbtn" data-guide="'+esc(ids.concat(gx).join(","))+'"'+ctx+'>🧭 Έλεγχος βήμα‑βήμα</button>':'')+ids.map(function(id){ var p=partById(id); return '<button class="plk" data-gopart="'+id+'"'+ctx+'>'+p.icon+' Πώς μετράω: '+esc(p.name)+'</button>'; }).join("")+'</div>';
}
function partPlats(){
  var b = brandObj(); if(!b) return [];
  if(b.own) return [b.own];
  var cs = candidates(b);
  if(S.oem && S.oem!=="__all" && cs.indexOf(S.oem)>=0) return [S.oem];
  return cs;
}
var meas = LS.get("vl_meas", []);
function mkey(v){ return gr2lat(String(v||"")).toUpperCase().replace(/\s/g,""); }
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
  pl.forEach(function(p){ var d = PSENS[p] || PSENS[{inv_gree:"gree",inv_mc:"midea"}[p]]; if(!d) return; d.list.forEach(function(x){ L.push({lab:(pl.length>1?PLAT[p].name+' – ':'')+x[0], s:x[1]}); }); src.push(d); });
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
  var k = mkey(S.model), b = brandObj(), mine = meas.filter(function(m){ return k && m.m===k && (!S.focus || m.part===S.part); });
  if(S.focus){ el.innerHTML = mine.length ? '<div class="small" style="margin-top:8px"><b>📒 Οι μετρήσεις μου:</b></div>'+mine.map(function(m){ return '<div class="mm"><span>'+esc(m.v)+' <span class="small">· '+esc(m.d)+'</span></span><button class="x" data-mdel="'+m.id+'">✕</button></div>'; }).join("") : ""; return; }
  el.innerHTML = (k ? (mine.length ? '<div class="small"><b>📒 Οι μετρήσεις μου για '+esc(k)+':</b></div>'+mine.map(function(m){ var p=partById(m.part); return '<div class="mm"><span>'+(p?p.icon+' ':'')+esc(m.v)+' <span class="small">· '+esc(m.d)+'</span></span><button class="x" data-mdel="'+m.id+'">✕</button></div>'; }).join("") : '<div class="small">Δεν έχεις αποθηκεύσει ακόμα μετρήσεις για '+esc(k)+'. Όταν μετρήσεις ένα καλό εξάρτημα, γράψε την τιμή παρακάτω για να την έχεις την επόμενη φορά.</div>') : '<div class="small">Γράψε το μοντέλο από το ταμπελάκι για να δεις/κρατήσεις τις δικές σου μετρήσεις.</div>');
  var info = $("pplat"); if(!info) return;
  var pl = partPlats();
  info.innerHTML = !b ? 'Διάλεξε μάρκα πάνω για τιμές από τα manuals της (αλλιώς βλέπεις γενικές οδηγίες).' :
    (pl.length===1 ? 'Τιμές για: <b>'+esc(PLAT[pl[0]].name)+'</b>'+(b.own?'':' (εργοστάσιο της '+esc(b.n)+')') :
     '⚠️ Η '+esc(b.n)+' δεν έχει δικό της εργοστάσιο: διάλεξε «Εργοστάσιο παραγωγής» στην καρτέλα «Βλάβη» (ή γράψε μοντέλο που έχεις αποθηκεύσει) για να δεις τις σωστές τιμές.');
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
  if(S.focus){ hits = hits.map(function(e){ return {n:e.n, src:e.src, it:e.it.filter(function(x){ return x[0]===S.part && !(S.part==="fan" && fanKnown().some(function(f){return f.re;}) && !e.re); })}; }).filter(function(e){ return e.it.length; });
    if(!hits.length){ el.innerHTML=""; return; } }
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
  FANKNOWN.forEach(function(e){ if(e.re && k && e.re.test(k)) r.push(e); });
  var ws = {}; r.forEach(function(e){ ws[e.w]=1; });
  FANKNOWN.forEach(function(e){ if(!e.re && e.plat && pl.indexOf(e.plat)>=0 && !ws[e.w]) r.push(e); });
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
  function pairCheck(i0, lab){
    var a=num("fr"+(i0||1)), b=num("fr"+((i0||1)+1)), c=num("fr"+((i0||1)+2));
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
    if(fanTwo() && t==="uvw"){ var p1=pairCheck(1), p2=pairCheck(4);
      if(p1) out.push('<div class="small"><b>FAN_1:</b></div>'+p1); if(p2) out.push('<div class="small"><b>FAN_2:</b></div>'+p2);
      if(p1 && p2 && p1.indexOf("bad")<0 && p2.indexOf("bad")<0){ var m1=Math.max(num("fr1"),num("fr2"),num("fr3")), m2=Math.max(num("fr4"),num("fr5"),num("fr6"));
        if(Math.abs(m1-m2)/Math.max(m1,m2)>0.15) out.push('<div class="pver mid">⚠️ Τα δύο μοτέρ δίνουν διαφορετικές τιμές μεταξύ τους – αν είναι ίδιος τύπος μοτέρ, κάποιο είναι ύποπτο· αν είναι διαφορετικοί τύποι, είναι φυσιολογικό.</div>'); }
    } else out.push(pairCheck(1));
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
function fanTwo(){ return S.fcount===2 || fanKnown().some(function(e){ return e.n===2 && e.w===(S.fw||"out"); }); }
function fanWizard(){
  var kn = fanKnown(), w = S.fw||"out", fz = S.focus && S.focus.side;
  var h = '<div class="pcalcw">'+(fz ? '<div class="lbl">🧭 Μέτρηση ανεμιστήρα '+(w==="out"?"εξωτερικής":"εσωτερικής")+'</div>' : '<div class="lbl">🧭 Βήμα 1 – Ποιος ανεμιστήρας;</div><div class="pchips">'+
    [["out","Εξωτερικής"],["in","Εσωτερικής"]].map(function(x){return '<button class="pc'+(w===x[0]?' on':'')+'" data-fw="'+x[0]+'">'+x[1]+'</button>';}).join("")+'</div>');
  var sug = kn.filter(function(e){return e.w===w;});
  if(S.focus && !S.ft && sug.length && sug[0].re) S.ft = sug[0].t;
  if(S.ft==="ac" && invOnly()) S.ft = null;
  h += '<div class="lbl">'+(fz?'':'Βήμα 2 – ')+'Τι φίσα έχει το μοτέρ;</div>';
  if(sug.length) h += '<div class="pext">📘 Για αυτό το μοντέλο το manual λέει: <b>'+esc(FTYPES.filter(function(f){return f[0]===sug[0].t;})[0][1])+'</b>. Αν βλέπεις κάτι άλλο, διάλεξε αυτό που βλέπεις.</div>';
  h += '<div class="ftypes">'+FTYPES.filter(function(f){ return !(invOnly() && f[0]==="ac"); }).map(function(f){return '<button class="pc'+(S.ft===f[0]?' on':'')+'" data-ft="'+f[0]+'"><b>'+esc(f[1])+'</b><br><span class="small">'+esc(f[2])+'</span></button>';}).join("")+'</div>';
  if(S.ft){
    var e = sug.filter(function(x){return x.t===S.ft;})[0];
    if(S.ft==="uvw" && !(e && e.col)){ h += '<div class="small" style="margin:6px 0">Στο μοτέρ 3 καλωδίων U-V-W τα χρώματα δεν χρειάζονται: είναι 3 ίδιες περιελίξεις'+(e&&e.pins?' – μέτρα '+esc(e.pins):'')+'.</div>'; }
    else { h += '<div class="lbl">Βήμα 3 – Χρώματα καλωδίων</div>';
    if(e && (e.col || e.cap)){
      if(e.col) h += '<div class="pext">📘 Από το manual:<br>'+e.col.map(function(c){return '<b>'+esc(c[0])+'</b> = '+esc(c[1]);}).join('<br>')+(e.hall?'<br><b>Φίσα Hall:</b> '+e.hall.map(function(c){return '<b>'+esc(c[0])+'</b>='+esc(c[1]);}).join(', '):'')+(e.ohm?'<br>Τιμή περιέλιξης: <b>'+e.ohm[0]+'–'+e.ohm[1]+'Ω</b> σε κάθε ζεύγος':'')+'<br><span class="small">Πηγή: '+esc(e.src)+'</span></div>';
      if(e.cap) h += '<div class="pext">📘 Από το manual: AC μοτέρ με πυκνωτή <b>'+e.cap+'μF</b>. Πηγή: '+esc(e.src)+'</div>';
    } else {
      var saved = fanCol[fkey()] || [];
      h += '<div class="small">'+(e&&e.pins?'📘 Manual: μέτρα '+esc(e.pins)+(e.ohm?' = <b>'+e.ohm[0]+'–'+e.ohm[1]+'Ω</b>':'')+'. ':'')+'Δεν βρήκα χρώματα στο manual'+(S.model?' για '+esc(mkey(S.model)):'')+'. Γράψε τα χρώματα που βλέπεις, με τη σειρά στη φίσα:</div><div class="fcols">'+
        fanLabels(S.ft).map(function(l,i){ return '<label>'+esc(l)+'<select data-fc="'+i+'"><option value="">—</option>'+FCOLORS.map(function(c){return '<option'+(saved[i]===c?' selected':'')+'>'+c+'</option>';}).join("")+'</select></label>'; }).join("")+'</div><div id="fcj" class="pext"></div>';
    } }
    h += '<div class="lbl">'+(S.ft==="uvw"?'Μέτρηση':'Βήμα 4 – Μέτρηση')+'</div>';
    var ins = '';
    if(S.ft==="uvw"||S.ft==="uvwh"||S.ft==="ac"){
      ins += '<div class="small">'+(S.ft==="ac"?'Χωρίς ρεύμα, φίσα έξω, πολύμετρο σε Ω. Μέτρα 1–2, 2–3, 1–3 (αριθμός = σειρά καλωδίου όπως τα έγραψες).':'Χωρίς ρεύμα (DC < 5V στους πυκνωτές), φίσα U-V-W έξω, φτερωτή ακίνητη, πολύμετρο σε Ω. Μέτρα τα 3 ζεύγη:')+'</div>'+
        (fanTwo()?'<div class="small" style="margin-top:6px"><b>FAN_1</b></div>':'')+
        '<div class="row3"><label>'+(S.ft==="ac"?'1–2':'U-V')+' Ω<input id="fr1" inputmode="decimal"></label><label>'+(S.ft==="ac"?'2–3':'V-W')+' Ω<input id="fr2" inputmode="decimal"></label><label>'+(S.ft==="ac"?'1–3':'W-U')+' Ω<input id="fr3" inputmode="decimal"></label></div>'+
        (fanTwo() && S.ft!=="ac"?'<div class="small"><b>FAN_2</b></div><div class="row3"><label>U-V Ω<input id="fr4" inputmode="decimal"></label><label>V-W Ω<input id="fr5" inputmode="decimal"></label><label>W-U Ω<input id="fr6" inputmode="decimal"></label></div>':'');
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
document.addEventListener("input", function(e){ if(/^(fr[1-6]|fvh|fvm|fvc|fvs|fcap|fcapr)$/.test(e.target.id)) fanVerdict(); });

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
    return sel("mtype","Τι συμπιεστής είναι;",invOnly() ? [["inv","Inverter – 3 καλώδια U/V/W από την πλακέτα"]] : [["inv","Inverter – 3 καλώδια U/V/W από την πλακέτα"],["onoff","On/Off – ακροδέκτες C/S/R με πυκνωτή"]])+
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
  if(S.part==="comp" && invOnly() && $("mtype") && !$("mtype").value) $("mtype").value = "inv";
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
  var h = '', q = cq(), bb = brandObj();
  if(q && bb){ var rr = search(q), seenB = {};
    if(rr.mode!=="none") rr.res.slice(0,6).forEach(function(x){ var be = behFor(x.t.plat, x.c[0]); if(!be || seenB[be.d]) return; seenB[be.d]=1;
      h += '<div class="beh big"><div class="small">'+esc(bb.n)+' · κωδικός <b>'+esc(x.c[0][0])+'</b>'+(!bb.own?' – <b>μόνο αν είναι '+esc(PLAT[x.t.plat].name)+'</b>':'')+' – '+esc(x.c[1])+'</div><div style="margin-top:6px"><b>🩺 Τι κάνει το μηχάνημα:</b> '+esc(be.s)+'</div><div class="small" style="margin-top:4px">📘 Πότε βγαίνει (manual): '+esc(be.d)+'</div><div class="small">Πηγή: '+esc(BEHSRC[x.t.plat]||"")+'</div></div>'; });
    if(!h) h = '<div class="small info">Για τον κωδικό «'+esc(q)+'» δεν έχω ακόμα περιγραφή συμπεριφοράς από manual.</div>';
    if(h && !bb.own){ var pls = partPlats(), have = {}; BEH.forEach(function(x){ have[x.plat]=1; }); var miss = pls.filter(function(p){ return !have[p]; });
      if(pls.length>1 || miss.length) h += '<div class="hint">⚠️ Η '+esc(bb.n)+' έχει σειρές από διαφορετικά εργοστάσια'+(miss.length?' (π.χ. '+esc(miss.map(function(p){return PLAT[p].name;}).join(", "))+', για τα οποία δεν έχω ακόμα περιγραφή συμπεριφοράς)':'')+'. Η περιγραφή ισχύει μόνο αν το δικό σου μηχάνημα είναι από το εργοστάσιο που γράφει – δες το ταμπελάκι ή γράψε το μοντέλο στο βήμα 3.</div>'; }
  }
  h += dtreeHtml();
  h += '<div class="small info">🩺 Το μηχάνημα έχει πρόβλημα αλλά δεν βγάζει κωδικό; Διάλεξε τι βλέπεις. Οι αιτίες είναι με σειρά πιθανότητας – ξεκίνα από πάνω.</div>';
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
function satT(ref, pg, kind){ // pg: bar gauge → °C· kind "b" = σημείο φυσαλίδας (μείγματα)
  var t=(kind==="b" && typeof PTB!=="undefined" && PTB[ref])?PTB[ref]:PT[ref], pa=pg+1.013, i;
  if(pa<=t[0][1]) i=0; else if(pa>=t[t.length-1][1]) i=t.length-2; else for(i=0;i<t.length-1;i++) if(pa>=t[i][1]&&pa<=t[i+1][1]) break;
  var a=t[i], b=t[i+1], f=(Math.log(pa)-Math.log(a[1]))/(Math.log(b[1])-Math.log(a[1]));
  return a[0]+f*(b[0]-a[0]);
}
function satP(ref, T, kind){ var t=(kind==="b" && typeof PTB!=="undefined" && PTB[ref])?PTB[ref]:PT[ref], i; for(i=0;i<t.length-2;i++) if(T<=t[i+1][0]) break; var a=t[i], b=t[i+1], f=(T-a[0])/(b[0]-a[0]); return Math.exp(Math.log(a[1])+f*(Math.log(b[1])-Math.log(a[1])))-1.013; }
function presForm(){
  function s(id,lab,opts,def){ return '<label class="small">'+esc(lab)+'<select id="'+id+'" class="pv">'+opts.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===def?' selected':'')+'>'+esc(o[1])+'</option>';}).join("")+'</select></label>'; }
  function i(id,lab,ph){ return '<label>'+esc(lab)+'<input id="'+id+'" class="pv" inputmode="decimal" placeholder="'+esc(ph||"")+'"></label>'; }
  return '<div class="pcalcw"><div class="lbl">📏 Πιέσεις – γράψε ό,τι έχεις μετρήσει</div>'+
   '<div class="row4">'+s("pref","Τι φρέον έχει; (ταμπελάκι)",[["R32","R32"],["R410A","R410A"],["R454B","R454B"],["R407C","R407C"],["R134a","R134a"],["R22","R22"],["R290","R290 (προπάνιο)"]],S.pref||"R32")+
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
  var te=isNaN(lp)?NaN:satT(ref,lp), tc=isNaN(hp)?NaN:satT(ref,hp,"b");
  var eLo,eHi,cLo,cHi;
  if(md==="cool"){ eLo=tin-24; eHi=tin-12; cLo=tout+8; cHi=tout+20; if(eLo<-2) eLo=-2; if(eHi<4) eHi=4; }
  else { cLo=tin+12; cHi=tin+30; eLo=tout-14; eHi=tout-3; }
  var exp='';
  if(!isNaN(tin)&&!isNaN(tout)){
    exp = '<div class="pext">📘 Αναμενόμενα (μετά από 15′ λειτουργίας στο μέγιστο) – <i>τυπικές τιμές πρακτικής, όχι από manual· αν το manual του μοντέλου δίνει πίνακα πιέσεων, ισχύει εκείνος</i>:<br>'+
      (md==="cool"||ty==="vrf" ? '• Χαμηλή: <b>'+pu(satP(ref,eLo))+' – '+pu(satP(ref,eHi))+'</b> (εξάτμιση '+f1(eLo)+'…'+f1(eHi)+'°C)<br>':'')+
      '• Υψηλή: <b>'+pu(satP(ref,cLo,"b"))+' – '+pu(satP(ref,cHi,"b"))+'</b> (συμπύκνωση '+f1(cLo)+'…'+f1(cHi)+'°C)'+(md==="heat"&&ty!=="vrf"?'':'')+'</div>';
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

function modelDiag(part){
  var k = mkey(S.model), r = null;
  MODELDIAG.forEach(function(e){ if(!r && e.part===part && k && e.re.test(k)) r = e; });
  return r;
}
function focusHead(){
  var f = S.focus, b = brandObj(), P = partById(S.part);
  var pl = partPlats(), plat = pl.length===1 ? PLAT[pl[0]].name : "";
  return '<div class="focus"><div class="fz1">🎯 Κωδικός <span class="code">'+esc(f.code)+'</span> – '+esc(f.title)+'</div>'+
    '<div class="small">'+(b?esc(b.n):'')+(S.model?' · '+esc(mkey(S.model)):'')+(plat && b && !b.own?' · εργοστάσιο '+esc(plat):'')+'</div>'+
    '<div class="fzb"><button class="mini" id="fzback">← Πίσω στον κωδικό</button><button class="mini" id="fzall">Όλα τα εξαρτήματα</button></div></div>';
}
function renderDiag(d){
  return '<div class="pmod diag"><div class="pst">📋 '+esc(d.n)+'</div>'+d.info.map(function(x){return '<div class="pmi">'+x+'</div>';}).join("")+
    '<ol class="steps">'+d.steps.map(function(s){return '<li><b>'+esc(s[0])+'</b><div>'+esc(s[1])+'</div></li>';}).join("")+'</ol><div class="small">Πηγή: '+esc(d.src)+'</div></div>';
}
function fanCountBox(){
  var n = S.fcount||0;
  return '<div class="pcalcw"><div class="lbl">Πόσους ανεμιστήρες έχει η '+((S.fw||"out")==="out"?"εξωτερική":"εσωτερική")+';</div><div class="pchips">'+
    [[1,"1 ανεμιστήρα"],[2,"2 ανεμιστήρες"]].map(function(x){return '<button class="pc'+(n===x[0]?' on':'')+'" data-fcount="'+x[0]+'">'+x[1]+'</button>';}).join("")+'</div>'+
    (n===2?'<div class="pext">Με 2 ανεμιστήρες: ο κωδικός δεν λέει ποιος φταίει – έλεγξε <b>και τους δύο</b>. Αν τα μοτέρ είναι ίδια (ίδιος κωδικός στο ταμπελάκι τους), άλλαξε τις φίσες μεταξύ τους στην πλακέτα: αν η βλάβη ακολουθεί το μοτέρ → μοτέρ· αν μένει στην ίδια φίσα → πλακέτα.</div>':'')+'</div>';
}
function renderParts(){
  var out = $("results"); $("notes").innerHTML = "";
  var pl = partPlats();
  if(S.focus && S.focus.part!==S.part) S.focus = null;
  if(S.focus){
    var P0 = partById(S.part), d = modelDiag(S.part);
    if(S.focus.side && S.part==="fan") S.fw = S.focus.side;
    var hf = focusHead();
    if(!mkey(S.model) || mkey(S.model).length<4) hf += '<div class="pcalcw fmodel"><div class="lbl">🏷️ Γράψε το μοντέλο από το ταμπελάκι (εσωτερικής ή εξωτερικής)</div><input id="fmodel" placeholder="π.χ. FTXM35R, GWH12ACC, V5MFO32-60" autocapitalize="characters" spellcheck="false" value="'+esc(S.model||"")+'"><div class="small">Με το μοντέλο βρίσκω τις προδιαγραφές του ανταλλακτικού (Ω, φίσες, χρώματα). Χωρίς μοντέλο σου δείχνω τη γενική μέθοδο.</div></div>';
    hf += '<div class="pwarn">⚡ Πριν ακουμπήσεις: κλείσε ρεύμα, περίμενε 5–10′ να αδειάσουν οι πυκνωτές της πλακέτας (μέτρα DC < 5V). Μετρήσεις «με ρεύμα» μόνο με μονωμένους ακροδέκτες.</div>';
    if(S.part==="fan"||S.part==="comp") hf += invNote();
    hf += ruleBox(S.part);
    if(d) hf += renderDiag(d);
    else hf += '<div id="pmodelinfo"></div>' + (S.part==="fan" ? fanCountBox() : '');
    if(S.part==="fan") hf += '<div id="fanw">'+fanWizard()+'</div>';
    if(S.part==="comp") hf += '<div class="pcalcw"><div class="lbl">🔎 Κωδικός συμπιεστή (ετικέτα πάνω στον συμπιεστή)</div><input id="pcomp" placeholder="π.χ. ASN98D22UFZ" autocapitalize="characters" spellcheck="false"><div id="pcompres"></div></div>';
    if(MEAS[S.part]) hf += measBox(S.part);
    if(S.part==="sensor"){ S.focus = null; return renderParts(); }
    var ex0 = pl.map(function(p){ return PEXTRA[p] && PEXTRA[p][S.part] ? '<div class="pext">📘 <b>'+esc(PLAT[p].name)+':</b> '+esc(PEXTRA[p][S.part])+'</div>' : ''; }).join("");
    if(!d) hf += ex0;
    hf += '<details class="note"><summary>📖 Γενικές οδηγίες για '+esc(P0.name)+'</summary>'+invFilt(P0.body, function(x){ return x[0]; }).map(function(s){ return '<div class="psec"><div class="pst">'+esc(s[0])+'</div><div class="psb">'+esc(s[1])+'</div></div>'; }).join("")+'</details>';
    hf += '<div class="psave"><div class="lbl">📒 Κράτα τη μέτρησή σου για αυτό το μοντέλο</div><div class="row2"><input id="pval" placeholder="π.χ. FAN_1 U-V-W 12Ω · FAN_2 12Ω"><button id="psave" class="mini">Αποθήκευση</button></div><div id="psmsg" class="small"></div><div id="pmine"></div></div>';
    out.innerHTML = hf;
    renderMine(); renderModelBox();
    if(S.part==="fan"){ fanColsUpdate(); fanVerdict(); }
    if(MEAS[S.part]) measUpdate();
    return;
  }
  var pcb = function(p){ return '<button class="pc'+(S.part===p.id?' on':'')+'" data-pc="'+p.id+'">'+p.icon+' '+esc(p.name)+'</button>'; };
  var isTool = function(p){ return typeof TOOL_IDS!=="undefined" && TOOL_IDS.indexOf(p.id)>=0; };
  var cp0 = partById(S.part); if(cp0) S.pmode = isTool(cp0) ? "tools" : "kb";
  var h = "";
  if(S.pmode==="tools"){
    h += '<div class="kbh">🧰 Εργαλεία & υπολογισμοί</div><div class="pchips" id="toolsgrp">'+PARTS.filter(isTool).sort(function(a,b){ return TOOL_IDS.indexOf(a.id)-TOOL_IDS.indexOf(b.id); }).map(pcb).join("")+'</div>';
  } else {
  h += '<div class="kbh">📚 Τράπεζα γνώσεων</div><div class="small" style="margin:-4px 2px 10px">Οδηγοί πολυμέτρου, μετρήσεις εξαρτημάτων, πιέσεις. Για να ελέγξεις μια βλάβη, ξεκίνα από τον κωδικό – θα σε φέρει εδώ μόνο με ό,τι χρειάζεσαι.</div><div class="pbox"><label class="lbl">Μοντέλο κλιματιστικού (ταμπελάκι)</label>'+
    '<input id="pmodel" placeholder="π.χ. GWH12AGB-K6DNA1A" autocapitalize="characters" spellcheck="false" value="'+esc(S.model||"")+'">'+
    '<div class="small pinfo" id="pplat"></div><div id="pmodelinfo"></div><div id="pmine"></div></div>';
    h += mmGuide(false);
    h += '<div class="lbl">Ποιο εξάρτημα θες να ελέγξεις;</div><div class="pchips">'+PARTS.filter(function(p){ return !isTool(p); }).map(pcb).join("")+'</div>';
  }
  var P = partById(S.part);
  if(!P){ h += S.pmode==="tools" ? '<div class="empty">Διάλεξε εργαλείο.</div>' : '<div class="empty">Διάλεξε εξάρτημα. Θα δεις χρώματα καλωδίων, βήματα με το πολύμετρο και τιμές από τα manuals.</div>'; }
  else {
    h += '<div id="ptop"></div>';
    if(!isTool(P)) h += '<div class="pwarn">⚡ Πριν ακουμπήσεις: κλείσε ρεύμα, περίμενε 5–10′ να αδειάσουν οι πυκνωτές της πλακέτας (μέτρα DC < 5V). Μετρήσεις «με ρεύμα» μόνο με μονωμένους ακροδέκτες.</div>';
    if(P.id==="fan"||P.id==="comp"||P.id==="cap") h += invNote();
    h += ruleBox(P.id);
    if(P.id==="fan") h += '<div id="fanw">'+fanWizard()+'</div>';
    if(P.id==="comp") h += '<div class="pcalcw"><div class="lbl">🔎 Κωδικός συμπιεστή (ετικέτα πάνω στον συμπιεστή)</div><input id="pcomp" placeholder="π.χ. ASN98D22UFZ" autocapitalize="characters" spellcheck="false"><div id="pcompres"></div></div>';
    if(MEAS[P.id]) h += measBox(P.id);
    if(P.id==="pres") h += presForm() + presGuide();
    if(P.id==="charge") h += chargeForm();
    if(P.id==="conv") h += convForm();
    if(P.id==="cap") h += capForm();
    if(P.id==="inst") h += instForm();
    if(P.id==="pt") h += ptForm();
    if(P.id==="fgas") h += fgasForm();
    if(P.id==="air") h += airForm();
    if(P.id==="pipe") h += pipeForm();
    if(P.id==="duct") h += ductForm();
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
    h += invFilt(P.body, function(x){ return x[0]; }).map(function(s){ return '<div class="psec"><div class="pst">'+esc(s[0])+'</div><div class="psb">'+esc(s[1])+'</div></div>'; }).join("");
    if(typeof TOOL_IDS==='undefined' || TOOL_IDS.indexOf(P.id)<0) h += '<div class="pnote small">Οι τιμές (Ω, V) είναι από τα service manuals της μάρκας όπου υπάρχει πηγή, αλλιώς τυπικές. Η ακριβής τιμή περιέλιξης συμπιεστή/μοτέρ αλλάζει ανά μοντέλο και γράφεται στο wiring diagram ή στο service manual του – η πιο αξιόπιστη σύγκριση είναι οι 3 φάσεις μεταξύ τους.</div>';
    if(typeof TOOL_IDS==='undefined' || TOOL_IDS.indexOf(P.id)<0) h += '<div class="psave"><div class="lbl">📒 Κράτα τη μέτρησή σου για αυτό το μοντέλο</div><div class="row2"><input id="pval" placeholder="π.χ. U-V-W 1,4Ω · γείωση OL"><button id="psave" class="mini">Αποθήκευση</button></div><div id="psmsg" class="small"></div></div>';
  }
  out.innerHTML = h;
  renderMine(); renderModelBox();
  if(P && P.id==="sensor") calcSens();
  if(P && P.id==="fan"){ fanColsUpdate(); fanVerdict(); }
  if(P && MEAS[P.id]) measUpdate();
  if(P && P.id==="pres") presCalc();
  if(P && P.id==="charge") chargeFill();
  if(P && P.id==="pt") ptCalc();
  if(P && P.id==="fgas") fgasCalc();
  if(P && P.id==="air") airCalc();
  if(P && P.id==="pipe"){ pipeCalc(); pAct(); }
  if(P && P.id==="duct") ductCalc();
  if(P && P.id==="inst") instCalc();
}
var fmT=null;
document.addEventListener("input", function(e){
  var id = e.target.id;
  if(id==="fmodel"){ S.model = e.target.value; if($("model")) $("model").value=S.model; clearTimeout(fmT); fmT=setTimeout(function(){ if(mkey(S.model).length>=4 && (modelDiag(S.part) || fanKnown().some(function(f){return f.re;}) || modelInfo().some(function(m){return m.re;}))){ renderParts(); } },700); return; }
  if(id==="pmodel"){ if(applyModel(e.target.value)){ var pos=e.target.selectionStart; renderParts(); var mi=$("pmodel"); mi.focus(); try{mi.setSelectionRange(pos,pos);}catch(x){} } else { renderMine(); renderModelBox(); if($("fanw")){ $("fanw").innerHTML=fanWizard(); fanColsUpdate(); fanVerdict(); } } if($("model")) $("model").value = S.model; }
  if(id==="ptemp"){ S.ptemp = e.target.value; calcSens(); }
  if(id==="pmeas") calcSens();
  if(id==="pcomp") compLookup();
});
document.addEventListener("change", function(e){ if(e.target.id==="psel") calcSens(); });
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-pc],[data-gopart],[data-mdel],#psave,#fzback,#fzall,[data-fcount]"); if(!el) return;
  if(el.id==="fzback"){ S.focus=null; S.src="in"; renderSrc(); persist(); renderResults(); return; }
  if(el.id==="fzall"){ S.focus=null; renderParts(); return; }
  if(el.hasAttribute("data-fcount")){ S.fcount = +el.getAttribute("data-fcount"); renderParts(); return; }
  if(el.hasAttribute("data-pc")){ S.focus=null; S.part = el.getAttribute("data-pc"); persist(); try{ renderParts(); }catch(er){ if(window.vlErr) window.vlErr((er&&er.message)||er, "renderParts("+S.part+")\n"+(er&&er.stack||"")); } setTimeout(function(){ var w=document.getElementById("ptop")||document.querySelector(".pwarn"); if(w && w.scrollIntoView) w.scrollIntoView({behavior:"smooth", block:"start"}); }, 30); return; }
  if(el.hasAttribute("data-gopart")){ S.part = el.getAttribute("data-gopart"); S.focus = el.hasAttribute("data-fcode") ? {part:S.part, code:el.getAttribute("data-fcode"), title:el.getAttribute("data-ftitle"), side:el.getAttribute("data-fside")} : null; S.fcount=0; S.src="parts"; renderSrc(); persist(); renderParts(); window.scrollTo({top:$("srcbox").getBoundingClientRect().top+window.scrollY-10,behavior:"smooth"}); return; }
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

function renderAll(){ renderCats(); renderBrands(); renderOem(); renderCtx(); renderResults(); persist(); }

// ===== events =====
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-c],[data-b],[data-o],[data-del],[data-q],#brandSel,#chgBrand,#theme,#bcancel,#chgCat");
  if(!el) return;
  if(el.id==="brandSel"){ $("brandsWrap").classList.toggle("open"); $("brandSel").classList.toggle("on", $("brandsWrap").classList.contains("open")); return; }
  if(el.id==="chgCat"){ S.catOpen=true; renderCats(); return; }
  if(el.id==="bcancel"){ S.bedit=false; $("bsug").innerHTML=""; renderAll(); return; }
  if(el.id==="chgBrand"){ S.bedit=true; renderBrands(); renderCats(); $("oembox").style.display="none"; setTimeout(function(){ $("bq").value=""; $("bq").focus(); },30); return; }
  if(el.id==="theme"){ var th=["auto","light","dark"], i=th.indexOf(LS.get("vl_theme","auto")); setTheme(th[(i+1)%3]); return; }
  if(el.hasAttribute("data-c")){ S.cat = el.getAttribute("data-c"); S.oem=null; S.catOpen=false; renderAll(); setTimeout(function(){ var m=$("model"); if(m && !m.value) m.focus(); else $("q").focus(); },50); return; }
  if(el.hasAttribute("data-b")){ S.brand = el.getAttribute("data-b"); S.bedit=false; S.fw={plate:"",rc:"",comp:"",pcb:"",ser:S.qpend||""}; S.fwOpen=!!S.qpend; S.qpend=""; S.catOpen=true; S.oem=null; S.model=""; S.ledv={}; $("bsug").innerHTML=""; $("brandsWrap").classList.remove("open"); $("bq").blur(); renderAll(); setTimeout(function(){ var c=$("catwrap"); if(c) window.scrollTo({top:c.getBoundingClientRect().top+window.scrollY-10,behavior:"smooth"}); },50); return; }
  if(el.hasAttribute("data-o")){ S.oem = el.getAttribute("data-o"); markChips(); renderCtx(); renderResults(); persist(); return; }
  if(el.hasAttribute("data-del")){ var b=brandObj(), p=el.getAttribute("data-del"); myMap = myMap.filter(function(m){return !(m.brand===b.n && m.prefix===p);}); LS.set("vl_mymap",myMap); renderOem(); return; }
  if(el.hasAttribute("data-q")){ S.q = el.getAttribute("data-q"); $("q").value=S.q; renderResults(); window.scrollTo({top:$("q").getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"}); return; }
});
// ===== πρόσφατες αναζητήσεις =====
var recent = LS.get("vl_recent", []);
var recT = null;
function saveRecent(){
  var q = cq(); if(!q || !S.brand || isTextQuery(q)) return;
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
  $("bsug").innerHTML = this.value.trim() ? (r.length ? r.map(function(b){ return '<button class="bs" data-b="'+esc(b.n)+'">'+badge(b.n)+'<span class="bt"><b>'+esc(b.n)+'</b><small>'+esc(bSub(b))+'</small></span><span class="go">›</span></button>'; }).join("") : '<div class="small">Δεν βρέθηκε. Πάτα ☰ για όλη τη λίστα ή διάλεξε «Άλλη μάρκα…».</div>') : "";
});
$("bq").addEventListener("focus", function(){ this.select(); });
$("bq").addEventListener("keydown", function(e){ if(e.key==="Enter"){ var f=$("bsug").querySelector("[data-b]"); if(f) f.click(); } });

$("q").addEventListener("input", function(){ S.q = this.value; renderResults(); clearTimeout(recT); recT=setTimeout(saveRecent,1500); });
$("q").addEventListener("keydown", function(e){ if(e.key==="Enter"){ this.blur(); saveRecent(); } });
renderRecent();
function renderSrc(){ var bs=$("srcbox").querySelectorAll("[data-s]"); for(var i=0;i<bs.length;i++) bs[i].classList.toggle("on", bs[i].getAttribute("data-s")===S.src); var pp=S.src==="parts"||S.src==="sym"||S.src==="led"; document.querySelector(".sbox").style.display=pp?"none":""; $("recent").style.display=pp?"none":""; document.querySelector(".search").style.position=pp?"static":""; }
$("srcbox").addEventListener("click", function(e){ var el=e.target.closest("[data-s]"); if(!el) return; S.focus=null; S.src=el.getAttribute("data-s"); renderSrc(); renderResults(); persist(); });
renderSrc();
document.addEventListener("click", function(e){
  var el = e.target.closest("[data-pi]"); if(!el) return;
  var n = +el.getAttribute("data-pn"), i = +el.getAttribute("data-pi"), vals = el.getAttribute("data-pv");
  var cur = (S.q.trim().length===n && /^[0-2]+$/.test(S.q.trim())) ? S.q.trim() : new Array(n+1).join("0");
  var d = cur[i], nd = vals[(vals.indexOf(d)+1)%vals.length];
  S.q = cur.slice(0,i)+nd+cur.slice(i+1); $("q").value = S.q; renderResults();
});
$("clr").addEventListener("click", function(){ S.q=""; $("q").value=""; renderResults(); $("q").focus(); });


function setTheme(t){ LS.set("vl_theme",t); var r=document.documentElement; if(t==="auto") r.removeAttribute("data-theme"); else r.setAttribute("data-theme",t);
  $("theme").innerHTML = '<span class="hmic">'+(t==="light"?"☀️":t==="dark"?"🌙":"🌓")+'</span><span>Θέμα: '+(t==="light"?"φωτεινό":t==="dark"?"σκοτεινό":"αυτόματο (όπως το κινητό)")+'<small>Πάτα για αλλαγή</small></span>'; $("theme").title = t==="light"?"Φωτεινό θέμα":t==="dark"?"Σκούρο θέμα":"Αυτόματο θέμα (όπως το κινητό)";
  var dark = t==="dark" || (t==="auto" && !(window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches));
  var m=document.querySelector('meta[name=theme-color]'); if(m) m.setAttribute("content", dark?"#0F1B25":"#E4E9ED"); }
setTheme(LS.get("vl_theme","auto"));
renderAll();
})();
