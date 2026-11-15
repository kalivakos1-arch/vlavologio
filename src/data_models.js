// ===== ΣΤΟΙΧΕΙΑ ΑΝΑ ΜΟΝΤΕΛΟ (από service manuals) =====
// re: regex στο μοντέλο (κεφαλαία, χωρίς κενά). it: [εξάρτημα, κείμενο]
var PMODELS = [
 // ---------- Mitsubishi Electric ----------
 {re:/^M[SU]Z-?LN(25|35)VG/, n:"Mitsubishi Electric MSZ/MUZ-LN25/35VG (Kirigamine Style)", compOhm:[1.59,2.17], wayOhm:[1410,2000], src:"ME service manual MUZ-LN VG / VGHZ (OBH767, OBH810)", it:[
  ["comp","Συμπιεστής inverter: U-V, U-W, V-W = 1,59–2,17Ω (σε −10~40°C). Καλώδια: Κόκκινο, Άσπρο, Μαύρο. Μοντέλο συμπιεστή (VG): KVB073FYXMC. 0Ω = βραχυκύκλωμα."],
  ["fan","Ανεμιστήρας εξωτ.: DC 3 καλωδίων (Κόκκινο–Μαύρο–Άσπρο) οδηγείται από την πλακέτα. ΚΟΚ–ΜΑΥ, ΜΑΥ–ΑΣΠ, ΑΣΠ–ΚΟΚ = 15–20Ω (ίδια και στα 3)."],
  ["fourway","Πηνίο 4οδης (21S4): 1,41–2,00kΩ (−10~40°C)."],
  ["sensor","Θερμίστορ: χαμηλής θερμ. 15kΩ/0°C (≈5,2kΩ/25°C), κατάθλιψης 160–410kΩ σε 10–30°C – δες υπολογιστή αισθητηρίου (Mitsubishi Electric)."]]},
 {re:/^M[SU]Z-?LN(50|60)VG/, n:"Mitsubishi Electric MSZ/MUZ-LN50/60VG", compOhm:[0.82,1.18], wayOhm:[1170,1660], src:"ME service manual MUZ-LN VG / VGHZ", it:[
  ["comp","Συμπιεστής: U-V, U-W, V-W = LN50: 0,82–1,11Ω · LN60: 0,87–1,18Ω (−10~40°C). Μοντέλο (VG): SVB092FBAMT."],
  ["fan","Ανεμιστήρας εξωτ.: DC 3 καλωδίων (ΚΟΚ/ΜΑΥ/ΑΣΠ), ~25–43Ω μεταξύ τους ανάλογα με την έκδοση – τα 3 πρέπει να είναι ίδια."],
  ["fourway","Πηνίο 4οδης LN50: 1,17–1,66kΩ."]]},
 {re:/^M[SU]Z-?AP(25|35)VG/, n:"Mitsubishi Electric MSZ/MUZ-AP25/35VG(H)", compOhm:[1.59,2.16], src:"ME service manual MUZ-AP25-71VG", it:[
  ["comp","Συμπιεστής: U-V, U-W, V-W = 1,59–2,16Ω (−10~40°C), καλώδια ΚΟΚ/ΑΣΠ/ΜΑΥ."],
  ["fan","Ανεμιστήρας εξωτ.: DC 3 καλωδίων από την πλακέτα – μέτρα τα 3 ζεύγη, πρέπει να είναι ίδια, OL προς γείωση."]]},
 {re:/^M[SU]Z-?AP(42|50|60)VG/, n:"Mitsubishi Electric MSZ/MUZ-AP42/50/60VG(H)", compOhm:[0.82,1.11], src:"ME service manual MUZ-AP25-71VG", it:[
  ["comp","Συμπιεστής: U-V, U-W, V-W = 0,82–1,11Ω (−10~40°C)."]]},
 {re:/^M[SU]Z-?AP71VG/, n:"Mitsubishi Electric MSZ/MUZ-AP71VG", compOhm:[0.87,1.18], src:"ME service manual MUZ-AP25-71VG", it:[
  ["comp","Συμπιεστής: U-V, U-W, V-W = 0,87–1,18Ω (−10~40°C)."]]},
 // ---------- Daikin ----------
 {re:/^A?[RF]X?T?XM(20|25|35)R|^A?RXM(20|25|35)R|^A?FTXM(20|25|35)R/, n:"Daikin Perfera R32 (FTXM/RXM20–35R, ARXM/ATXM25–35R)", compOhm:[1.80,1.98], src:"Daikin service manual Split New Perfera R32 (RXM20~71R)", it:[
  ["comp","Συμπιεστής (M1C): U-V, V-W, U-W = 1,89Ω ±5% στους 20°C. Πρώτα ένωσε τους ακροδέκτες του πολυμέτρου και αφαίρεσε την τιμή τους."],
  ["sensor","Όλα τα θερμίστορ αυτής της σειράς: τύπος A (20kΩ/25°C, ανοχή 3%)."]]},
 {re:/^A?RXM(42|50|60)R|^A?FTXM(42|50|60)R|^ATXM50R/, n:"Daikin Perfera R32 (RXM42–60R)", compOhm:[1.06,1.17], src:"Daikin service manual Split New Perfera R32", it:[
  ["comp","Συμπιεστής (M1C): U-V, V-W, U-W = 1,114Ω ±5% στους 20°C."],
  ["sensor","Θερμίστορ: τύπος A (20kΩ/25°C)."]]},
 {re:/^A?RXM71R|^FTXM71R/, n:"Daikin Perfera R32 (RXM71R)", compOhm:[0.26,0.29], src:"Daikin service manual Split New Perfera R32", it:[
  ["comp","Συμπιεστής (M1C): U-V, V-W, U-W = 0,274Ω ±5% στους 20°C – πολύ μικρή τιμή, χρειάζεται καλό πολύμετρο / αφαίρεση αντίστασης ακροδεκτών."]]},
 // ---------- Gree ----------
 {re:/^GWH(07|09)(AGA|AGAXB|AGBXB|ATCXB|YC|YCXB)/, n:"Gree 9.000 BTU (Pular / Cosmo / Amber / Weka – σειρές AGA, AGB, ATC, YC)", src:"Gree service manuals (Specification sheet: Compressor Model)", it:[
  ["comp","Συμπιεστής: ZHUHAI LANDA QXF-A082zC170, rotary inverter, RLA 2,56A, LRA 15A. Η Gree δεν δίνει Ω περιελίξεων στο manual: μέτρα U-V-W – πρέπει ίδια (λίγα Ω) – και προς τον σωλήνα: η Gree θέλει μόνωση πάνω από 500MΩ (megger)."],
  ["fan","Εξωτ. ανεμιστήρας χωρίς πυκνωτή (DC). Αν η φίσα έχει 5 καλώδια → κόκκινο 310V / άσπρο 15V / κίτρινο Vsp / μπλε FG / μαύρο GND· αν 3 καλώδια → U-V-W από την πλακέτα. Δες «Ανεμιστήρας» για μετρήσεις."]]},
 {re:/^GWH(09|12)YD-?S6DBA2A/, n:"Gree Amber Royal GWH09/12YD-S6DBA2A", src:"Gree service manual Amber Royal (GWH12YD-S6DBA2A)", it:[
  ["comp","Συμπιεστής (12YD): ZHUHAI LANDA QXFT-B123zE170A, rotary inverter, LRA 35A."],
  ["fan","Εξωτ. ανεμιστήρας 30W, 850 rpm, χωρίς πυκνωτή (DC). Εσωτ. 60W DC."]]},
 {re:/^GWH(09|12|18|24)(ACC|ACD|ACE)/, n:"Gree Comfort X (GWH09ACC, 12ACC, 18ACD, 24ACE) R32", src:"Gree service manual Comfort X R32", it:[
  ["comp","Συμπιεστής: ZHUHAI LANDA (rotary inverter). Σύγκρινε U-V-W μεταξύ τους, μόνωση >500MΩ."],
  ["fan","ΕΣΩΤ. ανεμιστήρας: AC μοτέρ 20W ΜΕ ΠΥΚΝΩΤΗ 1,5μF (όχι DC!) → μέτρα περιελίξεις (κοινό/ταχύτητες) και τον πυκνωτή (1,5μF ±5–10%). Εξωτ.: χωρίς πυκνωτή (DC)."]]},
 {re:/^GWH18AAD/, n:"Gree GWH18AAD-K6DNA1A", src:"Gree service manual GWH18AAD", it:[
  ["fan","ΕΣΩΤ. ανεμιστήρας AC 35W ΜΕ ΠΥΚΝΩΤΗ 2,5μF. Εξωτ. ανεμιστήρας χωρίς πυκνωτή (DC), RLA 0,62A."]]},
 {re:/^GWH(09|12)AEC/, n:"Gree G-Tech GWH09AECXB / 12AECXD", src:"Gree service manual G-Tech", it:[
  ["fan","Εσωτ. ανεμιστήρας DC 15W (χωρίς πυκνωτή) – δες έλεγχο DC 5 καλωδίων."]]},
 {plat:"gree", n:"Gree (γενικά)", src:"Gree service manuals", it:[
  ["sensor","Αισθητήρια Gree: αέρα 15kΩ, σωλήνα 20kΩ, κατάθλιψης 50kΩ στους 25°C."],
  ["comp","Θερμικό συμπιεστή (όπου υπάρχει): <1Ω όταν είναι κρύο. Μόνωση συμπιεστή προς σωλήνα >500MΩ."]]},
 // ---------- Midea ----------
 {re:/^MO(A01|B01)?-?(09|12)HFN1|^MSMBAU|^MSMBBU|^MSEA[AB]U/, n:"Midea Mission / Kids Star 9–12k (MOA01/MOB01-HFN1)", src:"Midea service manuals Mission 3D / Kids Star (Compressor checking)", it:[
  ["comp","Βρες τον κωδικό στην ετικέτα του συμπιεστή και γράψε τον παρακάτω στο «Κωδικός συμπιεστή». Σε αυτές τις σειρές: ASN98D22UFZ = 1,57Ω, ASM135D23UFZ = 1,75Ω, DA200S2C-10MT = 0,51Ω (κάθε ζεύγος, 20°C)."]]},
 {re:/^M[234]O[EGHF]-?\d{2}HFN8/, n:"Midea Multi R32 (M2OE-18 / M2OH-14 / M3OG-21 HFN8-Q)", src:"Midea service manual Super DC Inverter Multi", it:[
  ["comp","Συμπιεστής: KSN140D58UFZ (GMCC). Σύγκρινε U-V-W μεταξύ τους."]]},
 {plat:"midea", n:"Midea (γενικά)", src:"Midea service manuals", it:[
  ["fan","Εξωτ. DC 3 καλωδίων (πλακέτα με Hall, π.χ. Oasis): Κόκκινο=W, Μπλε=V, Κίτρινο=U (ίδια Ω και στα 3 ζεύγη, OL προς γείωση). Φίσα Hall: Πορτοκαλί=Hu, Γκρι=Hv, Άσπρο=Hw, Ροζ=Vcc, Μαύρο=GND."],
  ["sensor","Midea: T1–T4 10kΩ/25°C, TP/T5 50kΩ/25°C."],
  ["ipm","Πηνίο PFC (reactor): ~0Ω (Midea)."]]},
 // ---------- LG ----------
 {plat:"lg", n:"LG inverter τοίχου (γενικά)", src:"LG SVC manual General Wall Mounted Inverter + Single A", it:[
  ["comp","Συμπιεστής inverter: ~0,65Ω σε κάθε ζεύγος (U-V, V-W, W-U) στους 20°C, χωρίς διαφορά μεταξύ τους. Μόνωση U/V/W προς γείωση >2MΩ."],
  ["sensor","LG: αέρα 10kΩ, σωλήνα 5kΩ, κατάθλιψης 200kΩ στους 25°C."]]},
 // ---------- AUX ----------
 {re:/^ASW-?H\d{2}B5C4\/?JAR3DI|^ASW-?H\d{2}C5C4\/?JAR3DI/, n:"AUX J-Smart R32 (ASW-H09B5C4/JAR3DI, H12C5C4)", src:"AUX J-Smart service manual", it:[
  ["comp","Συμπιεστής (09): C-6RZ146H3DEF."],
  ["fan","Εσωτ. και εξωτ. ανεμιστήρας DC. Η εξωτερική AUX (μετά το 2012) έχει DC μοτέρ 3 καλωδίων οδηγούμενο από την πλακέτα → U-V-W ίδια Ω, OL στη γείωση."]]},
 {plat:"aux", n:"AUX (γενικά)", src:"AUX service manuals (Freedom, J-Smart)", it:[
  ["fan","Εξωτ. ανεμιστήρας inverter AUX: DC 3 καλωδίων από την πλακέτα (από το 2012). Πρώτα γύρνα τη φτερωτή με το χέρι (κόλλημα), μετά φίσα, μετά U-V-W."],
  ["comp","Συμπιεστής: τα 3 ζεύγη U-V-W πρέπει να έχουν ίδια μικρή τιμή (λίγα Ω). Αν βγάζει «out of step» αμέσως μετά την εκκίνηση, η AUX προτείνει έλεγχο ότι οι 2 φάσεις μετράνε το ίδιο και έλεγχο φοράς/καλωδίωσης."],
  ["sensor","Θερμίστορ κορυφής συμπιεστή (AUX): ~50kΩ με σβηστό συμπιεστή, 3–30kΩ αφού δουλέψει (ζεστό)."]]},
 // ---------- Haier ----------
 {plat:"haier", n:"Haier (γενικά – 1U.. / AS..)", src:"Haier European HVAC Technical Book 2020 / 2024-25, Haier service manuals 1U25", it:[
  ["comp","Συμπιεστής inverter: U-V-W ακριβώς ίδιες τιμές (λίγα Ω), όλα τα καλώδια αποσυνδεδεμένα. Μόνωση κάθε φάσης προς γείωση ΟΧΙ λιγότερο από 20MΩ (Haier)."],
  ["fan","Εξωτ. DC ανεμιστήρας (σφάλμα: LED1 αναβοσβήνει 9 φορές). Η Haier ζητάει: έλεγχο 310V DC στον συμπιεστή και στο μοτέρ ανεμιστήρα και έλεγχο αντίστασης στα καλώδια του DC μοτέρ. Αν είναι χαλασμένα και ανεμιστήρας και πλακέτα, αλλάζονται μαζί."],
  ["ipm","Haier: έλεγχος IPM με δοκιμή διόδου P→U/V/W και N→U/V/W (ίδια τιμή στις 3 φάσεις)."]]}
];

// Συμπιεστές: κωδικός ετικέτας → Ω ανά ζεύγος U-V-W (20°C)
var COMPDB = {
  "ASN98D22UFZ":["1,57Ω","Midea/GMCC"], "ASN98D22UEZ":["1,57Ω","Midea/GMCC"],
  "ASM135D23UFZ":["1,75Ω","Midea/GMCC"], "ATF235D22UMT":["0,75Ω","Midea/GMCC"],
  "ASN140D21UFZ":["1,28Ω","Midea/GMCC"], "ASK89D29UEZD":["1,99Ω","Midea/GMCC"],
  "DA130M1C-31FZ":["1,77Ω","Midea"], "DA200S2C-10MT":["0,51Ω","Midea"],
  "DA150S1C-20FZ":["0,95Ω","Midea"], "DA89X1C-23FZ":["0,64Ω","Midea"],
  "KVB073FYXMC":["1,59–2,17Ω (−10~40°C)","Mitsubishi Electric MUZ-LN25/35VG"],
  "SVB092FBAMT":["0,82–1,18Ω (−10~40°C)","Mitsubishi Electric MUZ-LN50/60VG"]
};

// ===== Ανεμιστήρες: γνωστές φίσες/χρώματα από manuals =====
// type: dc5 (1 φίσα, driver μέσα στο μοτέρ) · uvw (3 καλώδια από πλακέτα) · uvwh (3 + φίσα Hall 5) · two (φίσα ισχύος + φίσα σήματος) · ac (με πυκνωτή)
// col: [[χρώμα, λειτουργία], ...]  · ohm: [min,max] ανά ζεύγος U-V-W
var FANKNOWN = [
 {re:/^[VU]\dM[CDFR]\D*\d*-?(48|50|55|60)/, w:"out", t:"uvw", col:null, pins:"U-V, V-W, W-U στη λευκή φίσα 3 pin κάθε μοτέρ (FAN_1 και FAN_2)", n:2, src:"Midea service manual εμπορικών 48/60k (εξωτερικές MOE30U-48/60: FAN_DC → FAN_1/FAN_2)"},
 {re:/^M[SU]Z-?LN(25|35)VG/, w:"out", t:"uvw", col:[["Κόκκινο","U/V/W"],["Μαύρο","U/V/W"],["Άσπρο","U/V/W"]], ohm:[15,20], src:"ME service manual MUZ-LN (Outdoor fan motor)"},
 {re:/^M[SU]Z-?LN(50|60)VG/, w:"out", t:"uvw", col:[["Κόκκινο","U/V/W"],["Μαύρο","U/V/W"],["Άσπρο","U/V/W"]], ohm:[25,43], src:"ME service manual MUZ-LN (Outdoor fan motor)"},
 {re:/^A?RXM\d{2}R|^A?FTXM\d{2}R/, w:"out", t:"uvw", col:null, pins:"pin 1-3, 1-5, 3-5 της φίσας", ohm:[51.9,57.3], src:"Daikin service manual Split New Perfera R32 (DC fan motor)"},
 {re:/^RXA\d{2}|^FTXA\d{2}/, w:"out", t:"uvw", col:null, pins:"pin 1-3, 1-5, 3-5 της φίσας", ohm:[52.7,58.3], src:"Daikin service manual Split Stylish R32 (DC fan motor)"},
 {plat:"midea", w:"out", t:"uvwh", col:[["Κόκκινο","W"],["Μπλε","V"],["Κίτρινο","U"]], hall:[["Πορτοκαλί","Hu"],["Γκρι","Hv"],["Άσπρο","Hw"],["Ροζ","Vcc +5V"],["Μαύρο","GND"]], src:"Midea service manual (Oasis) / Carrier 38MARB – Outdoor DC fan motor"},
 {plat:"toshiba", w:"out", t:"uvw", col:[["Κόκκινο","U/V/W"],["Άσπρο","U/V/W"],["Μαύρο","U/V/W"]], ohm:[13,33], src:"Toshiba R410A service manual – Outdoor fan motor (fan IPDU)"},
 {plat:"fujitsu", w:"out", t:"dc5", col:[["Κόκκινο","Vm ~310V (pin 1)"],["Μαύρο","GND (pin 4)"],["Άσπρο","Vcc 15V (pin 5)"],["Κίτρινο","Vsp (pin 6)"],["Μπλε","FG (pin 7)"]], src:"Fujitsu service manual AB-G24LVLA"},
 {plat:"fujitsu", w:"in", t:"dc5", col:[["Καφέ","FG (pin 1)"],["Κίτρινο","Vsp (pin 2)"],["Άσπρο","Vcc 15V (pin 3)"],["Μαύρο","GND (pin 4)"],["Κόκκινο","Vm ~310V (pin 6)"]], src:"Fujitsu service manual AB-G24LVLA"},
 {re:/^GWH(09|12|18|24)(ACC|ACD|ACE)/, w:"in", t:"ac", cap:1.5, src:"Gree service manual Comfort X R32"},
 {re:/^GWH18AAD/, w:"in", t:"ac", cap:2.5, src:"Gree service manual GWH18AAD"}
];
var FTYPES = [
 ["dc5","1 φίσα με 5 καλώδια (μπορεί η φίσα να έχει 6–7 θέσεις με κενά)","DC μοτέρ με ενσωματωμένη πλακέτα"],
 ["uvw","1 φίσα με 3 καλώδια, χωρίς πυκνωτή","DC μοτέρ U-V-W από την πλακέτα"],
 ["uvwh","φίσα 3 καλωδίων + φίσα 5 καλωδίων (λεπτά)","DC U-V-W + αισθητήρες Hall"],
 ["two","2 φίσες: μία ισχύος (2–3 χοντρά) + μία σήματος (4–5 λεπτά)","DC μοτέρ δύο φισών"],
 ["ac","3–5 καλώδια και πυκνωτής δίπλα","AC μοτέρ με πυκνωτή"]
];
var FCOLORS = ["Κόκκινο","Μαύρο","Άσπρο","Κίτρινο","Μπλε","Καφέ","Πορτοκαλί","Γκρι","Ροζ","Πράσινο","Μωβ","Κιτρινοπράσινο"];
// τυπική αντιστοίχιση DC 5 καλωδίων (Welling/Nidec/Broad-Ocean, Fujitsu manuals)
var DC5STD = {"Κόκκινο":"Vm ~310V","Μαύρο":"GND","Άσπρο":"Vcc 15V","Κίτρινο":"Vsp εντολή 0–6,5V","Μπλε":"FG παλμοί","Καφέ":"FG παλμοί"};

// τιμές ανά πλατφόρμα όταν δεν υπάρχει μοντέλο
var PLATVAL = {
  toshiba:{wayOhm:[1291,1579], eevOhm:[42,50], louverOhm:[340,420]},
  fujitsu:{eevOhm:[45,50]},
  me:{}
};

// ===== Οδηγοί διάγνωσης ανά μοντέλο & εξάρτημα (μόνο ό,τι αφορά το εξάρτημα) =====
// re: regex μοντέλου, part, side, n: τίτλος, info: [γραμμές], steps: [[τίτλος, κείμενο]], src
var MODELDIAG = [
 {re:/^[VU]\dM[CDFR]\D*\d*-?(48|50|55|60)/, part:"fan", side:"out",
  n:"Inventor V5M… 48–60k (εργοστάσιο Midea) – εξωτερική με 2 ανεμιστήρες",
  info:[
   "Η εξωτερική αυτής της κατηγορίας έχει <b>2 DC ανεμιστήρες</b>. Ο κωδικός δεν λέει ποιος από τους δύο φταίει – έλεγξε <b>και τους δύο</b>.",
   "Τα μοτέρ είναι <b>DC 3 καλωδίων (U-V-W)</b>: ο έλεγχος στροφών γίνεται στην πλακέτα, όχι μέσα στο μοτέρ.",
   "<b>Πού κουμπώνουν:</b> στις φίσες <b>FAN_1</b> και <b>FAN_2</b> (λευκές, 3 pin) της πλακέτας οδήγησης/IPM (έξοδος FAN_DC). Ακολούθησε το καλώδιο κάθε μοτέρ ως την πλακέτα· στο wiring diagram (αυτοκόλλητο στο καπάκι) φαίνεται ποια φίσα είναι ποιο μοτέρ.",
   "Το F5 (EC 07) βγαίνει όταν οι στροφές μένουν πολύ χαμηλά (~300 rpm) ή πολύ ψηλά (~2400 rpm) για κάποιο διάστημα."
  ],
  steps:[
   ["Φτερωτές με το χέρι","Ρεύμα κλειστό. Γύρνα με το χέρι και τις δύο φτερωτές: να γυρνούν ελεύθερα, χωρίς τρίξιμο ή σφίξιμο ρουλεμάν, και να είναι σφιχτές στον άξονα. Κοίτα για φύλλα/πάγο/σπασμένο πτερύγιο."],
   ["Δουλεύει η πλακέτα; (πρακτικός έλεγχος)","Δώσε ψύξη στη χαμηλότερη θερμοκρασία και κοίτα τι γίνεται: αν ξεκινά ο ένας ανεμιστήρας και ο άλλος όχι, το πρόβλημα είναι στον ακίνητο ή στη δική του φίσα. Με τη φίσα κουμπωμένη, μέτρα AC Volt από την πίσω πλευρά της ανάμεσα U-V, V-W, W-U τη στιγμή που πάει να ξεκινήσει: πρέπει να εμφανιστεί τάση και στα 3 ζεύγη, περίπου ίδια. 0V σε όλα → η πλακέτα δεν οδηγεί αυτή την έξοδο (ή δεν δίνει εντολή εκείνη τη στιγμή – ξαναδοκίμασε στην εκκίνηση)."],
   ["Μέτρηση κάθε μοτέρ","Ρεύμα κλειστό, περίμενε 5–10′ να αδειάσουν οι πυκνωτές (DC < 5V). Βγάλε τη φίσα FAN_1, πολύμετρο σε Ω: U-V, V-W, W-U → και οι 3 τιμές ΙΔΙΕΣ. Άνισες, ~0Ω ή OL → χαλασμένο μοτέρ. Κάθε καλώδιο προς σασί → OL. Κάνε το ίδιο στο FAN_2. Γράψε τις τιμές παρακάτω για να τις κρίνω."],
   ["Διασταύρωση (τα 2 μοτέρ είναι ίδια)","Αν τα δύο μοτέρ έχουν τον ίδιο κωδικό στο ταμπελάκι τους, άλλαξε τις φίσες: το μοτέρ του FAN_1 στη FAN_2 και αντίστροφα. Αν η βλάβη ακολουθεί το μοτέρ → φταίει το μοτέρ. Αν μένει στην ίδια φίσα της πλακέτας → φταίει η πλακέτα οδήγησης."],
   ["Συμπέρασμα","Και τα δύο μοτέρ σωστά στα Ω, γυρνούν ελεύθερα, αλλά κάποιο δεν παίρνει τάση/δεν ξεκινά → πλακέτα οδήγησης ανεμιστήρων (IPM/driver). Αν βγει EC 71 (υπερένταση ανεμιστήρα) ή EC 72 (έλλειψη φάσης), έλεγξε καλωδίωση και Ω των 3 φάσεων του μοτέρ."]
  ],
  src:"Midea service manuals εμπορικών 48/60k (MOE30U-48/60HFN1: FAN_DC → FAN_1/FAN_2) και διάγνωση E8/EC 07"}
];
