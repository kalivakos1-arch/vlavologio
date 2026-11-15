// ===== ΣΤΟΙΧΕΙΑ ΕΓΚΑΤΑΣΤΑΣΗΣ ΑΝΑ ΜΟΝΤΕΛΟ (μόνο από installation/service manuals) =====
// cap: συνάρτηση που βγάζει την κλάση ισχύος από το μοντέλο (κεφαλαία, χωρίς κενά/παύλες)
// rows: re (σειρά, προαιρετικό), c:[min,max] κλάση, liq/gas σε ίντσες, comm (διασύνδεση), pwr (τροφοδοσία), brk (ασφάλεια), len (μήκη), src
var INST = {
 "Daikin": {
  cap: function(k){ var m = k.match(/^A?[A-Z]{2,4}(\d{2})[A-Z]/); return m ? +m[1] : null; },
  capLbl: "κλάση (π.χ. 25 = 2,5kW)",
  multi: /^\d/,
  rows: [
   {re:/^ARXM71/, c:[71,71], liq:"3/8", gas:"5/8", src:"Daikin Installer reference guide ARXM50-71+RXM42~71 (4P513661-9J)"},
   {re:/^(RXF|RXP|ARXF)(50|60|71)/, c:[50,71], liq:"1/4", gas:"1/2", src:"Daikin Installer reference guide RXF50~71D5V1B (4P519439-15Q) · RXP50~71N5V1B (4P519439-18T)"},
   {c:[15,42], liq:"1/4", gas:"3/8", src:"Daikin Installer reference guide FTXM20~42+ATXM20~35R (4P518023-8G) · RXM20~35R5V1B (4P519439-8H) · RXM42R (4P513661-9J)"},
   {c:[50,60], liq:"1/4", gas:"1/2", src:"Daikin Installer reference guide FTXM50~71 (4P518023-8G)"},
   {c:[71,71], liq:"1/4", gas:"5/8", src:"Daikin Installer reference guide FTXM71 (4P518023-8G) · RXM71R (4P513661-9J)", note:"Οι εξωτερικές RXF71 / RXP71 έχουν σύνδεση 1/2\" – δες το μοντέλο της εξωτερικής."}
  ],
  comm: "4πολικό 1,5–2,5 mm², H05RN-F (60245 IEC 57), κατάλληλο για 220–240V",
  pwr: "3πολικό. Στα νεότερα manuals (RXM-A): διατομή ανάλογα με το ρεύμα, όχι κάτω από 2,5 mm². Στα RXF71A / RXP50~71M: 2,5–4,0 mm² H05RN-F. Σε κάποια μικρά μοντέλα το manual γράφει μόνο «σύμφωνα με την ισχύουσα νομοθεσία».",
  brk: [[/^A?RXM20A/,"10A"],[/^A?RXM(25|35|42)A/,"13A"],[/^RXM42R|^RXA(42|50)|^RXJ50N/,"13A"],[/^ARXM(50|60|71)R|^RXM(50|60)R/,"16A"],[/^RXP(20|25|35)M/,"16A"],[/^RXM71R|^RXP(50|60|71)M|^RXF(50|60)B|^RXF71A|^ARXF(50|60|71)A|^RXF(50|60|71)D/,"20A"]],
  brkNote: "Η ασφάλεια δίνεται ανά μοντέλο εξωτερικής – γράψε το μοντέλο της εξωτερικής (RXM…, RXF…, RXP…).",
  srcEl: "Daikin Installer reference guides 4P513661-9J, 4P519439-15Q, RXM-A (Specifications of standard wiring components)"
 },
 "Mitsubishi Electric": {
  cap: function(k){ var m = k.match(/^M[SU][ZY]?-?[A-Z]{2}(\d{2})/) || k.match(/^M[SU]-?[A-Z]{2}(\d{2})/); return m ? +m[1] : null; },
  capLbl: "κλάση (π.χ. 35 = 3,5kW)",
  rows: [
   {re:/^M[SU]Z?LN(25|35)VGHZ|^M[SU]Z?FH35VEHZ/, c:[25,35], liq:"1/4", gas:"3/8", brk:"12A", pwr:"3πολικό 1,5 mm²", comm:"4πολικό 1,0 mm²", src:"ME Installation manual MSZ-LN VG2 (JG79J514H25) · MSZ-FH VE"},
   {re:/^M[SU]Z?(LN|FH)(18|25|35)/, c:[18,35], liq:"1/4", gas:"3/8", brk:"10A", pwr:"3πολικό 1,0 mm²", comm:"4πολικό 1,0 mm²", len:"Μέγ. μήκος 20m (LN25/35)", src:"ME Installation manual MSZ-LN VG / VG2 (JG79J514H25) · MSZ-FH VE"},
   {re:/^M[SU]Z?LN50/, c:[50,50], liq:"1/4", gas:"1/2", brk:"16A", comm:"4πολικό 1,0 mm²", len:"Μέγ. μήκος 30m (LN50/60)", src:"ME Installation manual MSZ-LN VG2 (JG79J514H25)"},
   {re:/^M[SU]Z?(HR|RZ)(25|35)/, c:[25,35], liq:"1/4", gas:"3/8", comm:"4πολικό 1,0 mm²", src:"ME Installation manual MSZ-HR VF / MSZ-RZ VU (1-3. SPECIFICATIONS)"},
   {re:/^M[SU]Z?RZ50/, c:[50,50], liq:"1/4", gas:"1/2", src:"ME Installation manual MSZ-RZ VU (1-3. SPECIFICATIONS)"},
   {re:/^M[SU]Z?(AP|EF|GE|GC)/, c:[15,42], liq:"1/4", gas:"3/8", brk:"10A", pwr:"3πολικό 1,0 mm²", comm:"4πολικό 1,0 mm²", len:"Μέγ. μήκος 20m · μέγ. υψομετρική 12m · χωρίς επιπλέον φορτίο έως 10m, μετά 20 g/m (AP)", src:"ME Installation manual MSZ-AP (JG79Y335H01) · MSZ-EF · MSZ-GE · MSZ-GC (SG79Y762H04)"},
   {re:/^M[SU]GF/, c:[20,35], liq:"1/4", gas:"3/8", brk:"10A", pwr:"3πολικό 2,5 mm²", comm:"4πολικό 1,0 mm²", len:"Μέγ. μήκος 20m (GF20/25) / 25m (GF35) · υψομετρική 10m", src:"ME Installation manual MS-GF20/25/35VA"},
   {re:/^M[SU]Z?FD/, c:[25,35], liq:"1/4", gas:"3/8", brk:"10–12A ανά έκδοση εξωτερικής", pwr:"3πολικό 1,0–1,5 mm² ανά έκδοση", comm:"4πολικό 1,0 mm²", len:"Μέγ. μήκος 20m · υψομετρική 12m", src:"ME Installation manual MSZ-FD25/35VA"},
   {re:/^M[SU]Z?(AP|EF)/, c:[50,50], liq:"1/4", gas:"1/2", brk:"16A", pwr:"3πολικό 2,0 mm²", comm:"4πολικό 1,0 mm²", len:"Μέγ. μήκος 30m · υψομετρική 15m (AP50: χωρίς επιπλέον φορτίο έως 15m)", src:"ME Installation manual MSZ-AP (JG79Y335H01) · MSZ-EF50VE"},
   {re:/^M[SU]Z?AP/, c:[60,60], liq:"1/4", gas:"1/2", brk:"16A", pwr:"3πολικό 2,0 mm²", comm:"4πολικό 1,0 mm²", len:"Μέγ. μήκος 30m · υψομετρική 15m", src:"ME Installation manual MSZ-AP60-71VG(K) (JG79J380H01)"},
   {re:/^M[SU]Z?AP/, c:[71,71], liq:"1/4", gas:"1/2", brk:"20A", pwr:"3πολικό 2,5 mm²", comm:"4πολικό 1,0 mm²", len:"Μέγ. μήκος 30m · υψομετρική 15m", src:"ME Installation manual MSZ-AP60-71VG(K) (JG79J380H01)", note:"Στον πίνακα του manual οι σωλήνες και το καλώδιο διασύνδεσης είναι κοινό κελί για AP60 και AP71."}
  ],
  noRow: "Για αυτή τη σειρά της Mitsubishi Electric δεν έχω τον πίνακα του manual. Στις σειρές AP / EF / GE / GC / LN / FH / HR / RZ: κλάση 15–42 → 1/4\" + 3/8\", κλάση 50–60 → 1/4\" + 1/2\". Επιβεβαίωσε στο manual της σειράς σου (πίνακας «1-3. SPECIFICATIONS»).",
  srcEl: "Πίνακας «1-3. SPECIFICATIONS» του installation manual κάθε σειράς"
 },
 "Toshiba": {
  cap: function(k){ var m = k.match(/^RAS(?:B|M)?(\d{2})/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu (π.χ. 10 = ~10.000)",
  rows: [
   {re:/^RASB?(07|10|13)P2/, c:[0,99], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 20m · υψομετρική 12m · χωρίς επιπλέον έως 15m", brk:"10A", pwr:"H07RN-F ή 60245 IEC66, 1,0 mm² ή παραπάνω", comm:"H07RN-F ή 60245 IEC66, 1,0 mm² ή παραπάνω", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Shorai Curve · IM 1145650301"},
   {re:/^RASB?(16|18|22)P2/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 20m · υψομετρική 12m · χωρίς επιπλέον έως 15m", brk:"16A", pwr:"H07RN-F ή 60245 IEC66, 1,5 mm² ή παραπάνω", comm:"H07RN-F ή 60245 IEC66, 1,5 mm² ή παραπάνω", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Shorai Curve · IM 1145650301"},
   {re:/^RASB?24P2/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 25m · υψομετρική 15m · χωρίς επιπλέον έως 15m", brk:"16A", pwr:"H07RN-F ή 60245 IEC66, 1,5 mm² ή παραπάνω", comm:"H07RN-F ή 60245 IEC66, 1,5 mm² ή παραπάνω", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Shorai Curve · IM 1145650301"},
   {re:/^RASB?(07|10|13)(J2|G3|G2|N4K)/, c:[0,99], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 20m · υψομετρική 12m · χωρίς επιπλέον έως 15m", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Edge / Haori / Bi-Flow (εξωτερικές J2AVSG)"},
   {re:/^RASB?(16|18|22)(J2|G3|G2|N4K)/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 20m · υψομετρική 12m · χωρίς επιπλέον έως 15m", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Edge / Haori / Bi-Flow (εξωτερικές J2AVSG)"},
   {re:/^RASB?24(J2|G3|G2)/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 25m · υψομετρική 15m · χωρίς επιπλέον έως 15m", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Edge (RAS-24J2AVSG-E2)"},
   {re:/^RASB?(05|07|10|13)(E2|S4K)/, c:[0,99], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 15m · υψομετρική 12m · χωρίς επιπλέον έως 15m", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Yukai (εξωτερικές E2AVG)"},
   {re:/^RASB?(16|18|24)(E2|S4K)/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 20m · υψομετρική 12m · χωρίς επιπλέον έως 15m", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Yukai (εξωτερικές E2AVG)"},
   {re:/^RASB?(05|07|10|13)(B2|LA|LK)/, c:[0,99], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 10m · υψομετρική 8m · χωρίς επιπλέον έως 10m", brk:"10A", pwr:"H07RN-F ή 60245 IEC66, 1,0 mm² ή παραπάνω", comm:"H07RN-F ή 60245 IEC66, 1,0 mm² ή παραπάνω", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Sumato / Essento / Zento · IM 1136750301"},
   {re:/^RASB?(16|18|24)(B2|LA|LK)/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 15m · υψομετρική 8m · χωρίς επιπλέον έως 10m", brk:"16A", pwr:"H07RN-F ή 60245 IEC66, 1,5 mm² ή παραπάνω", comm:"H07RN-F ή 60245 IEC66, 1,5 mm² ή παραπάνω", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Sumato / Essento / Zento · IM 1136750301"},
   {re:/^RASB?(10|13)C[AK]/, c:[0,99], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 15m · υψομετρική 12m · χωρίς επιπλέον έως 15m", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Arata"},
   {re:/^RASB?(16|18|24)C[AK]/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 20m · υψομετρική 12m · χωρίς επιπλέον έως 15m", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – τεχνικά Arata"},
   {re:/^RASB?10S4/, c:[0,99], brk:"15A", pwr:"H07RN-F ή 60245 IEC66, 1,25 mm² ή παραπάνω", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – IM Daiseikai (S4KVDG / S4AVPG)"},
   {re:/^RASB?13S4/, c:[0,99], brk:"15A", pwr:"H07RN-F ή 60245 IEC66, 1,5 mm² ή παραπάνω", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – IM Daiseikai (S4KVDG / S4AVPG)"},
   {re:/^RASB?18S4/, c:[0,99], brk:"20A", pwr:"H07RN-F ή 60245 IEC66, 2,0 mm² ή παραπάνω", src:"Toshiba Ελλάδας (toshiba-aircon.gr) – IM Daiseikai (S4KVDG / S4AVPG)"},
   {re:/^RAS(B)?(05|07|10|13|16|18)E2/, c:[5,18], brkBy:{5:"10A",7:"15A",10:"15A",13:"15A",16:"15A",18:"15A"}, pwr:"H07RN-F ή 60245 IEC66 – 0,75 έως 1,5 mm² ή περισσότερο ανά μοντέλο (πίνακας «Electrical works»)", comm:"H07RN-F ή 60245 IEC66", src:"Toshiba Installation manual RAS-B05~18E2KVG-E"},
   {c:[5,13], liq:"1/4", gas:"3/8", src:"Toshiba R32 installation manual (σωλήνες 05k–13k: υγρού Ø6,35 / αερίου Ø9,52)", generic:true},
   {c:[16,24], liq:"1/4", gas:"1/2", src:"Toshiba R32 installation manual (σωλήνες 16k–24k: υγρού Ø6,35 / αερίου Ø12,70)", generic:true}
  ],
  comm: "H07RN-F ή 60245 IEC66 (διατομή ανά μοντέλο στο manual)",
  pwr: "H07RN-F ή 60245 IEC66 (διατομή ανά μοντέλο στο manual)",
  srcEl: "Πίνακας «Electrical works» του installation manual"
 },
 "Fujitsu": {
  cap: function(k){ var m = k.match(/^A[SOGRU][YEGB]?[GA]?(\d{2})/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu",
  rows: [
   {re:/^A[SO][YE]G(07|09|12|14)(KM|KP|LM|LU|LV|KG)/, c:[7,12], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 20m (σειρά KP)", src:"Fujitsu Installation manual KMC / KPCA (9333893006) / LMCA / LUCA"},
   {re:/^A[SO][YE]G14/, c:[14,14], liq:"1/4", gas:"1/2", src:"Fujitsu Installation manual ASYG07-14LMCA / LUCA / AGYG09-14LVCA"},
   {re:/^A[SO][YE]G(18|24)KL/, c:[18,24], liqBy:{18:"1/4",24:"1/4"}, gasBy:{18:"3/8",24:"1/2"}, src:"Fujitsu Installation manual ASEG18/24KLCA"}
  ],
  comm: "1,5 mm² Type 60245 IEC 57 – 3 αγωγοί + γείωση, 230V. Όριο: πτώση τάσης κάτω από 2%, αλλιώς μεγαλύτερη διατομή.",
  pwr: "1,5 mm² Type 60245 IEC 57 – 2 αγωγοί + γείωση (KMC / KP)",
  brkNote: "Το manual δίνει την ασφάλεια στον πίνακα «Electrical requirement» του μοντέλου – δεν τη βρήκα σε κείμενο που να μπορώ να διαβάσω.",
  srcEl: "Fujitsu Installation manual – «Electrical requirement»"
 },
 "Panasonic": {
  cap: function(k){ var m = k.match(/^C[SU][A-Z]{0,3}?(\d{1,2})[A-Z]/); return m ? +m[1] : null; },
  capLbl: "κλάση (25 = 2,5kW ή 9/12/18/24 χιλ. Btu)",
  rows: [
   {c:[9,12], liq:"1/4", gas:"3/8", src:"Panasonic service manual CS-PS9/12NKH (Btu μοντέλα)"},
   {c:[18,18], liq:"1/4", gas:"1/2", src:"Panasonic service manual CS-S18JKQ / CS-PS18NKQ"},
   {c:[24,24], liq:"1/4", gas:"5/8", src:"Panasonic service manual CS-S24JKQ / CS-PS24NKQ"},
   {c:[20,35], liq:"1/4", gas:"3/8", src:"Panasonic service manuals: μοντέλα 9.000–12.000 Btu (2,5–3,5kW) → 6,35 / 9,52", kw:true},
   {c:[50,50], liq:"1/4", gas:"1/2", src:"Panasonic service manuals: μοντέλα 18.000 Btu (5,0kW) → 6,35 / 12,7", kw:true},
   {c:[71,71], liq:"1/4", gas:"5/8", src:"Panasonic service manuals: μοντέλα 24.000 Btu (7,1kW) → 6,35 / 15,88", kw:true}
  ],
  comm: "4 × 1,5 mm² εύκαμπτο με επένδυση πολυχλωροπρενίου, τύπος 60245 IEC 57 ή βαρύτερο",
  pwr: "3 × 1,5 mm² (½–1,75HP) · 3 × 2,5 mm² (2,0–2,5HP), τύπος 60245 IEC 57 ή βαρύτερο",
  brk: [],
  brkNote: "16A για ¾–2,0HP · 20A για 2,5HP (διπολικός, άνοιγμα επαφών ≥3mm). Τα HP είναι στο ταμπελάκι.",
  srcEl: "Panasonic Installation instructions Etherea Z/XZ · service manuals CS-UE / CS-RE (κεφ. Installation)"
 },
 "Gree": {
  cap: function(k){ var m = k.match(/^G[WU]H(\d{2})/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu",
  rows: [
   {re:/^GWH18AA/, c:[18,18], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 20m · υψομετρική 10m · χωρίς επιπλέον έως 5m, μετά 16 g/m", src:"Gree service manual Bora inverter R32 18/24 (GWH18AAD-K6DNA1B)"},
   {re:/^GWH24AA/, c:[24,24], liq:"1/4", gas:"5/8", len:"Μέγ. μήκος 25m · υψομετρική 10m · χωρίς επιπλέον έως 5m, μετά 40 g/m", src:"Gree service manual Bora inverter R32 18/24 (GWH24AAD-K6DNA4A)"},
   {re:/^GWH(18|24)YE/, c:[18,24], liq:"1/4", gas:"5/8", len:"Μέγ. μήκος 40m (18) / 50m (24) · υψομετρική 20m / 30m", src:"Gree service manual GWH18YE / GWH24YE-S6DBA2A"},
   {c:[7,12], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 15–20m ανά μοντέλο · υψομετρική 10m · χωρίς επιπλέον έως 5m", src:"Gree service manuals 9K/12K (Change K3DNA6G, Lomo R32, Airy, Pular, Weka)"}
  ],
  noRow: "Στα 18K / 24K της Gree η σωλήνα αερίου αλλάζει ανά σειρά (π.χ. Bora 18K: 3/8\", Pular 18K: 1/2\", Bora 24K: 5/8\"). Επιβεβαίωσε στο service manual της σειράς σου («Connection Pipe»).",
  srcEl: "Τα manuals της Gree που βρήκα δεν δίνουν διατομές καλωδίων σε κείμενο που να μπορώ να διαβάσω."
 },
 "LG": {
  cap: function(k){ var m = k.match(/^[A-Z]{1,3}(09|12|18|24)/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu",
  rows: [
   {c:[9,12], liq:"1/4", gas:"3/8", len:"Τυπικό μήκος 7,5m · ελάχ. 2m · μέγ. 20m · επιπλέον 20 g/m", pwr:"H07RN-F 1,0 mm² (2,5–3,5kW)", comm:"H07RN-F 1,0 mm² (εσωτερική: H05VV-F 1,0 mm²)", src:"LG Installation manual 2,5k / 3,5k (Piping length and elevation · Cable type)"},
   {c:[18,18], liq:"1/4", gas:"1/2", len:"Τυπικό μήκος 7,5m · μέγ. 20m · επιπλέον 30 g/m", src:"LG Installation manual MFL67647124 (wall mounted 18k/24k – έκδοση Αμερικής)", note:"Ο πίνακας 18k/24k είναι από το manual της LG για Αμερική – τα καλώδια εκεί είναι σε AWG και δεν ισχύουν για Ελλάδα."},
   {c:[24,24], liq:"1/4", gas:"5/8", len:"Τυπικό μήκος 7,5m · μέγ. 20m · επιπλέον 30 g/m", src:"LG Installation manual MFL67647124 (wall mounted 18k/24k – έκδοση Αμερικής)", note:"Ο πίνακας 18k/24k είναι από το manual της LG για Αμερική – τα καλώδια εκεί είναι σε AWG και δεν ισχύουν για Ελλάδα."}
  ],
  srcEl: "LG Installation manual"
 },
 "Midea": {
  cap: function(k){ var m = k.match(/^(?:AEP2|AG1|AG16GRAPH|AG16BLACK|GAIA|ACEAI|ACE|CB1|EF|MX1|MX3|MX4|DURA|LINEPRO|LINE|PRO|EZB|EZ|AIRGRN|MSFAAU|MOB01)(\d{2})/) || k.match(/(09|12|18|21|24|36)/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu",
  rows: [
   {re:/^(?:AEP2|AG1|AG16GRAPH|AG16BLACK|GAIA|ACEAI|ACE|CB1|EF|MX1|MX3|MX4|DURA|LINEPRO|LINE|PRO|EZB|EZ|AIRGRN|MSFAAU|MOB01)(09|12)/, c:[0,99], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 25m · υψομετρική 10m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Midea (όλες οι σειρές 9/12)"},
   {re:/^(AEP2|AG1|AG16GRAPH|AG16BLACK|ACEAI|ACE|CB1|EF|MX3|DURA|LINEPRO|LINE|PRO|EZB|EZ|AIRGRN)18/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 30m · υψομετρική 20m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Midea (σειρές 18)"},
   {re:/^(AEP2|AG1|AG16GRAPH|AG16BLACK|CB1)24/, c:[0,99], liq:"3/8", gas:"5/8", len:"Μέγ. μήκος 50m · υψομετρική 25m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Midea All Easy Pro / Xtreme Save II / Xtreme Graphite / Black Crystal / Breezeless E"},
   {re:/^(ACEAI|EF|MX4|DURA|LINE|PRO)24|^(LINEPRO|EZB|EZ|AIRGRN)21/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 50m · υψομετρική 25m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Midea Ace AI / Solunar / Dura / Line / Pro / Line Pro / Solstice / Air Green"},
   {re:/^ACE24/, c:[0,99], len:"Μέγ. μήκος 50m · υψομετρική 25m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Midea Ace 24 (χωρίς διατομή σωλήνων στη σελίδα)"},
   {c:[7,14], len:"Μέγ. μήκος 25m · υψομετρική 10m (inverter R32)", src:"Midea Owner's & Installation manual (CS445UI)"},
   {c:[15,23], len:"Μέγ. μήκος 30m · υψομετρική 20m (inverter R32)", src:"Midea Owner's & Installation manual (CS445UI)"},
   {c:[24,35], len:"Μέγ. μήκος 50m · υψομετρική 25m (inverter R32)", src:"Midea Owner's & Installation manual (CS445UI)"}
  ],
  noRow: "Αυτή η σειρά Midea δεν είναι στα τεχνικά χαρακτηριστικά του ελληνικού αντιπροσώπου. Προσοχή: στα 24 της Midea ο σωλήνας διαφέρει ανά σειρά (3/8\"+5/8\" ή 1/4\"+1/2\"). Το installation manual δεν δίνει σωλήνες ανά μοντέλο – δες την ταμπέλα της εξωτερικής.",
  comm: "H07RN-F, διατομή από το μέγιστο ρεύμα της ταμπέλας: >3–6A: 0,75 · >6–10A: 1 · >10–16A: 1,5 · >16–25A: 2,5 · >25–32A: 4 · >32–40A: 6 mm²",
  pwr: "Εξωτερική: H07RN-F (εσωτερική, αν τροφοδοτείται χωριστά: H05VV-F ή H05V2V2-F). Διατομή με τον ίδιο πίνακα ρεύματος.",
  brkNote: "Γενικός διακόπτης και προστασία υπέρτασης 1,5 × το μέγιστο ρεύμα · ΔΔΡ ≤30mA · αποζεύκτης όλων των πόλων με άνοιγμα ≥3mm.",
  srcEl: "Midea Owner's & Installation manual (CS445UI)"
 },
 "Samsung": {
  cap: function(k){ var m = k.match(/^F?AR(\d{2})/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu",
  rows: [
   {re:/^F?AR(09|12|18|24)TXFC/, c:[9,24], liqBy:{9:"1/4",12:"1/4",18:"1/4",24:"1/4"}, gasBy:{9:"3/8",12:"3/8",18:"1/2",24:"5/8"}, lenBy:{9:"Μέγ. μήκος 15m · ελάχ. 3m · υψομετρική 8m · επιπλέον 15 g/m",12:"Μέγ. μήκος 15m · ελάχ. 3m · υψομετρική 8m · επιπλέον 15 g/m",18:"Μέγ. μήκος 30m · ελάχ. 3m · υψομετρική 15m · επιπλέον 15 g/m",24:"Μέγ. μήκος 30m · ελάχ. 3m · υψομετρική 15m · επιπλέον 15 g/m"}, src:"Samsung Specifications Wind-Free Comfort AR09/12/18/24TXFCAWKNEU"},
   {c:[7,12], brk:"16A (Type GL)", src:"Samsung Installation manual AR**TXFY / AR**TXHZ · AR**TY / TXEA"},
   {c:[18,24], brk:"20A (Type GL)", src:"Samsung Installation manual AR**TS / TV / 24 (πίνακας Type GL)"}
  ],
  comm: "Δύο καλώδια: τροφοδοσία εξωτερικής→εσωτερικής 3G × 1,0 mm² H07RN-F και καλώδιο επικοινωνίας F1/F2 2 × 0,75 mm² H05RN-F. Τροφοδοσία + επικοινωνία έως 30m.",
  pwr: "3G × 2,5 mm² H07RN-F στην εξωτερική",
  noRow: "Για αυτή τη σειρά Samsung δεν έχω πίνακα σωλήνων από manual. Στη σειρά Wind-Free Comfort (TXFC): 09/12 → 1/4\" + 3/8\", 18 → 1/4\" + 1/2\", 24 → 1/4\" + 5/8\".",
  srcEl: "Samsung Installation manual AR**TXFY / AR**TXHZ (Connecting the power and communication cables)"
 },
 "Hisense": {
  cap: function(k){ var kw = k.match(/^[A-Z]{2}(25|35|50|70)[A-Z]/); if(kw) return {25:9,35:12,50:18,70:24}[kw[1]]; var m = k.match(/(09|12|18|24)/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu (25/35/50/70 kW → 9/12/18/24)",
  rows: [
   {c:[9,12], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 20m · υψομετρική 10m", src:"Hisense European Air conditioners 2023 (τεχνικά στοιχεία, όλες οι σειρές τοίχου 09/12)"},
   {c:[18,18], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 20m", src:"Hisense European Air conditioners 2023 (τεχνικά στοιχεία 18)"}
  ],
  noRow: "Στα 24 της Hisense ο σωλήνας αλλάζει ανά σειρά (1/4\"+5/8\", 3/8\"+5/8\" ή 1/4\"+1/2\" στους καταλόγους της) – επιβεβαίωσε στο manual / ταμπέλα της σειράς σου.",
  srcEl: "Δεν βρήκα manual της Hisense με διατομές καλωδίων σε κείμενο που να μπορώ να διαβάσω."
 },
 "Mitsubishi Heavy": {
  cap: function(k){ var m = k.match(/^S[RC][KCM](\d{2})/); return m ? +m[1] : null; },
  capLbl: "κλάση (25 = 2,5kW)",
  multi: /^SCM/,
  rows: [
   {re:/^SR[KC](20|25|35)Z/, c:[20,35], liq:"1/4", gas:"3/8", brk:"16A", comm:"1,5 mm² (καλώδια διασύνδεσης – αριθμός αγωγών στον πίνακα του manual)", len:"Μέγ. μήκος 25m", src:"MHI Technical manual \'18•SRK-T-250 (SRK ZS-W) · \'17•SRK-T-203 (SRK ZSX-W)"},
   {re:/^SR[KC](45|50)Z/, c:[45,50], liq:"1/4", gas:"1/2", comm:"1,5 mm² (πίνακας Interconnecting wires)", len:"Μέγ. μήκος 30m", src:"MHI Technical manual SRK ZS-W / ZSP-W (Selecting connecting pipe: SRK45/50 → ø12,7 / ø6,35)"}
  ],
  brkNote: "Στον πίνακα του technical manual: 16A στα SRK20–35. Για SRK50 δες τον πίνακα «Recommended breaker size».",
  srcEl: "MHI Technical manual (Recommended breaker size · Interconnecting wires)"
 },
 "Hitachi": {
  cap: function(k){ var m = k.match(/^RA[KC](?:DJ)?(\d{2})/); return m ? +m[1] : null; },
  capLbl: "κλάση (25 = 2,5kW)",
  rows: [
   {re:/^RA[KC](25|35)(RX|WX)D/, c:[25,35], liq:"1/4", gas:"3/8", comm:"1,5 mm² × 3 + γείωση", len:"Μέγ. μήκος 20m · ελάχ. 3m · υψομετρική 10m", src:"Hitachi Technical catalogue Mono split RAK-25/35/50RXD · RAC-25/35/50WXD"},
   {re:/^RA[KC]50(RX|WX)D/, c:[50,50], liq:"1/4", gas:"1/2", comm:"2,5 mm² × 3 + γείωση", len:"Μέγ. μήκος 30m · ελάχ. 3m · υψομετρική 10m", src:"Hitachi Technical catalogue Mono split RAK-25/35/50RXD · RAC-25/35/50WXD"},
   {c:[15,42], liq:"1/4", gas:"3/8", comm:"1,5 mm² × 3 + γείωση", src:"Hitachi Technical catalogue RXD (25/35)", generic:true},
   {c:[50,50], liq:"1/4", gas:"1/2", comm:"2,5 mm² × 3 + γείωση", src:"Hitachi Technical catalogue RXD (50)", generic:true}
  ],
  brkNote: "Τα παλιότερα manuals της Hitachi γράφουν ασφάλεια αργής τήξης (time delay) ανά μοντέλο – π.χ. RAC-50WPB: 25A. Για τη δική σου σειρά δες τον πίνακα «Fuse capacity».",
  srcEl: "Hitachi Technical catalogue RXD · Installation manual RAK-35/50PPB (Fuse capacity)"
 },
 "Haier": {
  cap: function(k){ var m = k.match(/^1U(\d{2,3})/) || k.match(/^A[SBD](\d{2})/); return m ? +m[1] : null; },
  capLbl: "κλάση (π.χ. 71 = 7,1kW)",
  rows: [
   {re:/^(AS25THMHRA|1U25YEFFRA|AS35TAMHRA|1U35YEFFRA|AS25PBAHRA|1U25YEGFRA|AS35PBAHRA|1U35YEGFRA)/, c:[25,35], liq:"1/4", gas:"3/8", comm:"Καλώδιο εντολών 4 × 1,5 mm²", src:"Haier Ελλάδας (Inventor) – Τεχνικά χαρακτηριστικά Tide Green Plus / Pearl"},
   {re:/^(AS50TDMHRA|1U50MEMFRA|AS68TEMHRA|1U68RENFRA|AS50PDAHRA|1U50MEGFRA|AS68PDAHRA|1U68WEGFRA)/, c:[50,68], liq:"1/4", gas:"1/2", comm:"Καλώδιο εντολών 4 × 1,5 mm²", src:"Haier Ελλάδας (Inventor) – Τεχνικά χαρακτηριστικά Tide Green Plus / Pearl"},
   {re:/^1U(71|100|105|125)S2S[SN]/, c:[71,125], liq:"3/8", pwr:"H05RN-F 3G 4,0 mm²", comm:"H05RN-F 4G 2,5 mm²", src:"Haier Installation manual 1U71S2SS5FA / 1U100S2SN5FA (7.2 Piping size for single split)"},
   {re:/^1U(125|140|160|180)S2SP/, c:[125,180], pwr:"H05RN-F 3G 6,0 mm²", comm:"H05RN-F 4G 2,5 mm²", src:"Haier Installation manual 1U125-180S2SP5FA"}
  ],
  noRow: "Για αυτό το μοντέλο Haier δεν βρήκα πίνακα. Έχω τις σειρές Tide Green Plus και Pearl (Haier Ελλάδας) και τις επαγγελματικές εξωτερικές 1U71–1U180.",
  srcEl: "Haier Installation manual (εξωτερικές 1U…)"
 },
 "Inventor": {
  cap: function(k){ var m = k.match(/(09|12|18|24|27|36|42|50|60|66|100)/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu",
  rows: [
   {re:/^EMPV[IO]W?(09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 20m · υψομετρική 10m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^EMPV[IO]W?18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 3 × 2,5 mm²", len:"Μέγ. μήκος 25m · υψομετρική 15m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^EMPV[IO]W?24/, c:[0,999], liq:"3/8", gas:"5/8", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 3 × 2,5 mm²", len:"Μέγ. μήκος 25m · υψομετρική 15m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^DR2V[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 20m · υψομετρική 10m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^DR2V[IO]32(18|24)/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", src:"Inventor – Exports catalogue 2024 (DR2V32-18/24)"},
   {re:/^INV[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 25m · υψομετρική 10m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^INV[IO]18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 30m · υψομετρική 20m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^INVB[IO]24/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 2,5 mm²", pwr:"Παροχικό 3 × 2,5 mm²", len:"Μέγ. μήκος 50m · υψομετρική 25m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^EQ[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 25m · υψομετρική 10m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^EQ[IO]18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 30m · υψομετρική 20m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^EQ[IO]24/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 2,5 mm²", pwr:"Παροχικό 3 × 2,5 mm²", len:"Μέγ. μήκος 50m · υψομετρική 25m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^NR[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 25m · υψομετρική 10m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^NR[IO]18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 30m · υψομετρική 20m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^NR[IO]24/, c:[0,999], liq:"1/4", gas:"1/2", brk:"20A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 2,5 mm²", pwr:"Παροχικό 3 × 4 mm²", len:"Μέγ. μήκος 50m · υψομετρική 25m", src:"Inventor – κατάλογος B2B 11/2026 (στο site: 16A, 5×2,5)"},
   {re:/^FUT[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 15m · υψομετρική 10m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^FUT[IO]18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 15m · υψομετρική 10m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^FUT[IO]24/, c:[0,999], liq:"1/4", gas:"5/8", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 2,5 mm²", pwr:"Παροχικό 3 × 2,5 mm²", len:"Μέγ. μήκος 15m · υψομετρική 15m", src:"Inventor – κατάλογος B2B 11/2026"},
   {re:/^IKU[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 15m · υψομετρική 10m", src:"Inventor – επίσημο site, Ikura"},
   {re:/^LHUV[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – Exports catalogue 2026/2024"},
   {re:/^LHUV[IO]18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – Exports catalogue 2026/2024"},
   {re:/^LHUV[IO]24/, c:[0,999], liq:"3/8", gas:"5/8", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 2,5 mm²", src:"Inventor – Exports catalogue 2026/2024"},
   {re:/^N3V[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – Exports catalogue 2026/2024"},
   {re:/^N3V[IO]18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – Exports catalogue 2026/2024"},
   {re:/^N3V[IO]24/, c:[0,999], liq:"3/8", gas:"5/8", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 2,5 mm²", src:"Inventor – Exports catalogue 2026/2024"},
   {re:/^N2UV[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – Exports catalogue 2024 (N2UV)"},
   {re:/^N2UV[IO]18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – Exports catalogue 2024 (N2UV)"},
   {re:/^N2UV[IO]24/, c:[0,999], liq:"3/8", gas:"5/8", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 2,5 mm²", src:"Inventor – Exports catalogue 2024 · επίσημο site (N2UV)"},
   {re:/^AR5V[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – Exports catalogue 2026/2024"},
   {re:/^AR5V[IO]18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – Exports catalogue 2026/2024"},
   {re:/^AR5V[IO]24/, c:[0,999], liq:"3/8", gas:"5/8", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 2,5 mm²", src:"Inventor – Exports catalogue 2026/2024"},
   {re:/^VER[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – επίσημο site, Vero"},
   {re:/^VER[IO]18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – επίσημο site, Vero"},
   {re:/^VER[IO]24/, c:[0,999], liq:"3/8", gas:"5/8", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 2,5 mm²", src:"Inventor – επίσημο site, Vero"},
   {re:/^NECUV[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – φυλλάδιο Neo Eco 06/2024"},
   {re:/^NPV[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – φυλλάδιο Neo Plus 2025"},
   {re:/^NPV[IO]18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – φυλλάδιο Neo Plus 2025"},
   {re:/^NPV[IO]24/, c:[0,999], liq:"3/8", gas:"5/8", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 2,5 mm²", src:"Inventor – φυλλάδιο Neo Plus 2025"},
   {re:/^LDV[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – φυλλάδιο Legend"},
   {re:/^LDV[IO]18/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – φυλλάδιο Legend"},
   {re:/^LDV[IO]24/, c:[0,999], liq:"3/8", gas:"5/8", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 2,5 mm²", src:"Inventor – φυλλάδιο Legend"},
   {re:/^PFZUV[IO](09|12)/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1 mm²", src:"Inventor – φυλλάδιο Professional Z"},
   {re:/^PFZUV[IO](18|24)/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1 mm²", src:"Inventor – φυλλάδιο Professional Z"},
   {re:/^THRV[IO]09/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Inventor – Exports catalogue 2026 (Nordic THRV)"},
   {re:/^(V7I?CRI|V7I?DI|V7LI)(09|12)|^U7I?RS(09|12)$/, c:[0,999], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 25m · υψομετρική 10m", src:"Inventor – κατάλογος B2B 11/2026 (ημικεντρικά V7)"},
   {re:/^(V7I?CRI|V7I?DI|V7LI|V7KI)18|^U7I?RS18$/, c:[0,999], liq:"1/4", gas:"1/2", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 3 × 1,5 mm²", len:"Μέγ. μήκος 30m · υψομετρική 20m", src:"Inventor – κατάλογος B2B 11/2026 (ημικεντρικά V7)"},
   {re:/^(V7I?CI|V7I?DI|V7KI)24|^U7I?RS24$/, c:[0,999], liq:"3/8", gas:"5/8", brk:"16A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 3 × 2,5 mm²", len:"Μέγ. μήκος 50m · υψομετρική 25m", src:"Inventor – κατάλογος B2B 11/2026 (ημικεντρικά V7)"},
   {re:/^(V7I?CI|V7KI)(36|42)|^U7RS(36|42)$/, c:[0,999], liq:"3/8", gas:"5/8", brk:"20A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 3 × 4 mm²", len:"Μέγ. μήκος 75m · υψομετρική 30m", src:"Inventor – κατάλογος B2B 11/2026 (κασέτα / δαπέδου-οροφής V7)"},
   {re:/^V7I?DI(36|42)/, c:[0,999], liq:"3/8", gas:"5/8", brk:"25A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 3 × 4 mm²", len:"Μέγ. μήκος 65m · υψομετρική 30m", src:"Inventor – κατάλογος B2B 11/2026 (αεραγωγών V7)"},
   {re:/^(V7I?CI|V7KI)(50|60)|^U7I?RT(50|60)$/, c:[0,999], liq:"3/8", gas:"5/8", brk:"3x16 (τριφασική)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 5 × 2,5 mm²", len:"Μέγ. μήκος 75m · υψομετρική 30m", src:"Inventor – κατάλογος B2B 11/2026 (τριφασικά V7)"},
   {re:/^V7I?DI(50|60)/, c:[0,999], liq:"3/8", gas:"5/8", brk:"3x16 (τριφασική)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 5 × 2,5 mm²", len:"Μέγ. μήκος 65m · υψομετρική 30m", src:"Inventor – κατάλογος B2B 11/2026 (τριφασικά αεραγωγών V7)"},
   {re:/^V7FS[IO]24/, c:[0,999], liq:"1/4", gas:"1/2", brk:"25A (ασφάλεια τήξης)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 3 × 4 mm²", len:"Μέγ. μήκος 20m · υψομετρική 15m", src:"Inventor – κατάλογος B2B 11/2026 (ντουλάπα V7FSI)"},
   {re:/^V6F[IO]60/, c:[0,999], liq:"3/8", gas:"5/8", brk:"3x16 (τριφασική)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 5 × 2,5 mm²", len:"Μέγ. μήκος 20m · υψομετρική 10m", src:"Inventor – κατάλογος B2B 11/2026 (ντουλάπα V6FI)"},
   {re:/^V7IFI66|^U7IRT66/, c:[0,999], liq:"3/8", gas:"5/8", brk:"3x16 (τριφασική)", comm:"Καλώδιο εντολών 4 × 1,5 mm²", pwr:"Παροχικό 5 × 2,5 mm²", len:"Μέγ. μήκος 20m · υψομετρική 10m", src:"Inventor – κατάλογος B2B 11/2026 (ντουλάπα V7iFI, θωρακισμένο καλώδιο εντολών)"},
   {re:/^V5MF[IO]66/, c:[0,999], liq:"3/8", gas:"5/8", brk:"3x25 (τριφασική)", comm:"Καλώδιο εντολών 3 × 1 mm²", src:"Inventor – Exports catalogue 2024 (V5MFI-66, θωρακισμένο καλώδιο)"},
   {re:/^LV6I?[CDL]I(09|12)/, c:[0,999], liq:"1/4", gas:"3/8", src:"Inventor – Exports catalogue 2026/2024 (εσωτερικές multi LV6)"},
   {re:/^LV6I?[CDL]I18/, c:[0,999], liq:"1/4", gas:"1/2", src:"Inventor – Exports catalogue 2026/2024 (εσωτερικές multi LV6)"},
   {re:/^U6RSL2?18/, c:[0,999], liq:"1/4", gas:"3/8", brk:"16A", len:"Multi 2 εσωτερικών: σύνολο 40m · έως 25m ανά εσωτερική · υψομετρική 15m · μεταξύ εσωτερικών 10m", note:"Δύο ζεύγη σωλήνων 1/4\" + 3/8\".", src:"Inventor – κατάλογος B2B 11/2026 (multi)"},
   {re:/^U6RSL3?27/, c:[0,999], liq:"1/4", gas:"3/8", brk:"20A", len:"Multi 3 εσωτερικών: σύνολο 60m · έως 30m ανά εσωτερική · υψομετρική 15m · μεταξύ εσωτερικών 10m", note:"Τρία ζεύγη σωλήνων 1/4\" + 3/8\".", src:"Inventor – κατάλογος B2B 11/2026 (multi)"},
   {re:/^U5MRSL32(4)?36/, c:[0,999], liq:"1/4", gas:"3/8", brk:"25A", len:"Multi 4 εσωτερικών: σύνολο 80m · έως 35m ανά εσωτερική · υψομετρική 15m · μεταξύ εσωτερικών 10m", note:"3 ζεύγη 1/4\" + 3/8\" και 1 ζεύγος 1/4\" + 1/2\".", src:"Inventor – κατάλογος B2B 11/2026 (multi)"},
   {re:/^U6RSL5?42/, c:[0,999], liq:"1/4", gas:"3/8", brk:"25A", len:"Multi 5 εσωτερικών: σύνολο 80m · έως 35m ανά εσωτερική · υψομετρική 15m · μεταξύ εσωτερικών 10m", note:"4 ζεύγη 1/4\" + 3/8\" και 1 ζεύγος 1/4\" + 1/2\".", src:"Inventor – κατάλογος B2B 11/2026 (multi)"},
   {re:/^C?EV[IO]-?(09|12)/, c:[9,12], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 15m · υψομετρική 5m · χωρίς επιπλέον έως 5m, μετά 20 g/m", src:"Inventor Service manual EVI/EVO 09-12000btu"},
   {re:/^K1V[IO]32(09|12)/, c:[9,12], len:"Τυπικό μήκος 5m · μέγ. 25m · υψομετρική 10m · επιπλέον 12 g/m", src:"Inventor Service manual King K1VI32-09/12"},
   {re:/^O1MV/, c:[0,99], comm:"H07RN-F, διατομή από το μέγιστο ρεύμα της ταμπέλας: >3–6A: 0,75 · >6–10A: 1 · >10–16A: 1,5 · >16–25A: 2,5 · >25–32A: 4 · >32–40A: 6 mm²", pwr:"Εξωτερική: H07RN-F (εσωτερική, αν τροφοδοτείται χωριστά: H05VV-F ή H05V2V2-F)", src:"Inventor Installation manual OMNIA"},
   {re:/^O1MV/, c:[7,14], len:"Μέγ. μήκος 25m · υψομετρική 10m", src:"Inventor Installation manual OMNIA (O1MVI/O1MVO-09/12/18/24)"},
   {re:/^O1MV/, c:[15,23], len:"Μέγ. μήκος 30m · υψομετρική 20m", src:"Inventor Installation manual OMNIA"},
   {re:/^O1MV/, c:[24,35], len:"Μέγ. μήκος 50m · υψομετρική 25m", src:"Inventor Installation manual OMNIA"}
  ],
  noRow: "Αυτό το μοντέλο Inventor δεν είναι στα τεχνικά στοιχεία που βρήκα (25 σειρές από το επίσημο site, τον κατάλογο B2B 2026, τα φυλλάδια και τα manuals της Inventor). Δες την ταμπέλα της εξωτερικής."
 },
 "Nobu": {
  cap: function(k){ var m = k.match(/(09|12|18|24)/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu",
  rows: [
   {re:/^NBKU3V[IO](09|12)/, c:[9,12], liq:"1/4", gas:"3/8", brk:"10A (ασφάλεια τήξης)", pwr:"Παροχικό εξωτερικής 3 × 1,5 mm²", comm:"Καλώδιο εντολών 5 × 1,5 mm²", src:"Nobu – επίσημο site, Τεχνικά χαρακτηριστικά NBKU3V"},
   {re:/^NOB[IO]09/, brk:"10A (ασφάλεια τήξης)", c:[9,9], liq:"1/4", gas:"3/8", pwr:"Παροχικό 3 × 1,5 mm²", comm:"Καλώδιο εντολών 5 × 1 mm²", len:"Μέγ. μήκος 15m · υψομετρική 10m", src:"Nobu – επίσημο site NOB · Inventor κατάλογος B2B 11/2026"},
   {re:/^NOB[IO]12/, brk:"10A (ασφάλεια τήξης)", c:[12,12], liq:"1/4", gas:"3/8", pwr:"Παροχικό 3 × 1,5 mm²", comm:"Καλώδιο εντολών 5 × 1,5 mm²", len:"Μέγ. μήκος 15m · υψομετρική 10m", src:"Nobu – επίσημο site NOB · Inventor κατάλογος B2B 11/2026"},
   {re:/^NOB[IO]18/, brk:"10A (ασφάλεια τήξης)", c:[18,18], liq:"1/4", gas:"1/2", pwr:"Παροχικό 3 × 1,5 mm²", comm:"Καλώδιο εντολών 5 × 1,5 mm²", len:"Μέγ. μήκος 15m · υψομετρική 10m", src:"Nobu – επίσημο site NOB · Inventor κατάλογος B2B 11/2026"},
   {re:/^NOB[IO]24/, brk:"16A (ασφάλεια τήξης)", c:[24,24], liq:"1/4", gas:"5/8", pwr:"Παροχικό 3 × 2,5 mm²", comm:"Καλώδιο εντολών 5 × 2,5 mm²", len:"Μέγ. μήκος 15m · υψομετρική 15m", src:"Nobu – επίσημο site NOB · Inventor κατάλογος B2B 11/2026"}
  ],
  noRow: "Αυτό το μοντέλο Nobu δεν είναι στα τεχνικά στοιχεία του επίσημου site (σειρές NBKU3V και NOB).",
  srcEl: "Nobu – επίσημο site (nobuklima.gr)"
 },
 "Eskimo": {
  cap: function(k){ var m = k.match(/(09|12|18|24)/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu",
  rows: [
   {re:/^ESAF(09|12)/, c:[0,99], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 25m · υψομετρική 10m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Eskimo (ES-AF / Forest)"},
   {re:/^ESAF18/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 30m · υψομετρική 20m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Eskimo (ES-AF / Forest)"},
   {re:/^ESAF24/, c:[0,99], liq:"3/8", gas:"5/8", len:"Μέγ. μήκος 50m · υψομετρική 25m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Eskimo (ES-AF / Forest)"},
   {re:/^ESGP(09|12)/, c:[0,99], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 25m · υψομετρική 10m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Eskimo GP"},
   {re:/^ESGP(18|24)/, c:[0,99], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 30m · υψομετρική 20m", note:"Η σελίδα του αντιπροσώπου γράφει 1/4\" + 3/8\" και για τα GP 18 / 24 – επιβεβαίωσε στις συνδέσεις της εξωτερικής πριν αγοράσεις σωλήνα.", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Eskimo GP"},
  ],
  noRow: "Αυτό το μοντέλο Eskimo δεν είναι στα τεχνικά χαρακτηριστικά του αντιπροσώπου (FG Europe).",
  srcEl: "FG Europe – τεχνικά χαρακτηριστικά (δεν δίνει καλώδια / ασφάλεια)"
 },
 "Comfee": {
  cap: function(k){ var m = k.match(/(09|12|18|24)/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu",
  rows: [
   {re:/^AF(09|12)/, c:[0,99], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 25m · υψομετρική 10m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Comfee"},
   {re:/^AF18/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 30m · υψομετρική 20m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Comfee"},
   {re:/^AF24/, c:[0,99], len:"Μέγ. μήκος 50m · υψομετρική 25m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Comfee (χωρίς διατομή σωλήνων στη σελίδα)"},
  ],
  noRow: "Αυτό το μοντέλο Comfee δεν είναι στα τεχνικά χαρακτηριστικά του αντιπροσώπου.",
  srcEl: "FG Europe – τεχνικά χαρακτηριστικά"
 },
 "Inclima": {
  cap: function(k){ var m = k.match(/(09|12|18|24)/); return m ? +m[1] : null; },
  capLbl: "κλάση σε χιλ. Btu",
  rows: [
   {re:/^INCLIMA(09|12)/, c:[0,99], liq:"1/4", gas:"3/8", len:"Μέγ. μήκος 25m · υψομετρική 10m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Inclima"},
   {re:/^INCLIMA18/, c:[0,99], liq:"1/4", gas:"1/2", len:"Μέγ. μήκος 30m · υψομετρική 20m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Inclima"},
   {re:/^INCLIMA24/, c:[0,99], len:"Μέγ. μήκος 50m · υψομετρική 25m", src:"FG Europe (επίσημος αντιπρόσωπος Midea/Eskimo/Comfee/Inclima) – τεχνικά χαρακτηριστικά Inclima (χωρίς διατομή σωλήνων στη σελίδα)"},
  ],
  noRow: "Αυτό το μοντέλο Inclima δεν είναι στα τεχνικά χαρακτηριστικά του αντιπροσώπου.",
  srcEl: "FG Europe – τεχνικά χαρακτηριστικά"
 }
};
var INCH_MM = {"1/4":"6,35","3/8":"9,52","1/2":"12,70","5/8":"15,88","3/4":"19,05"};
PARTS.push({id:"inst", icon:"📐", name:"Σωλήνες & καλώδια ανά μοντέλο", body:[
 ["Τι δείχνει","Διάμετρο σωλήνα υγρού και αερίου (ίντσες και mm), καλώδιο διασύνδεσης εσωτερικής–εξωτερικής, καλώδιο τροφοδοσίας, ασφάλεια και μέγιστα μήκη – μόνο ό,τι γράφει το manual της εταιρίας, με την πηγή. Ό,τι δεν βρέθηκε γράφεται ότι λείπει."],
 ["Πώς το γράφω","Γράψε το μοντέλο όπως στο ταμπελάκι (εσωτερικής ή εξωτερικής). Για την ασφάλεια σε Daikin προτίμησε το μοντέλο της εξωτερικής."],
 ["Προσοχή","Η διατομή του καλωδίου τροφοδοσίας ελέγχεται πάντα και με το μήκος της γραμμής και τον κανονισμό εσωτερικών ηλεκτρικών εγκαταστάσεων. Τα manuals γράφουν ελάχιστες τιμές."]]});