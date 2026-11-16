// ===== Επιπλέον ψυκτικά για P/T (απόλυτη πίεση bar) =====
// PT[ref] = σημείο δρόσου (dew – για εξάτμιση/υπερθέρμανση). PTB[ref] = σημείο φυσαλίδας (bubble – για συμπύκνωση/υπόψυξη), μόνο σε μείγματα με ολίσθηση.
// R454B: Gas Servei – Technical data sheet R-454B (2023). R407C: Arkema – Forane 407C Thermodynamic properties SI (NIST REFPROP 9.0).
// R134a: Arkema – Forane 134a Thermodynamic properties SI (NIST REFPROP).
PT.R454B = [[-40,1.592],[-30,2.454],[-20,3.641],[-10,5.227],[0,7.294],[10,9.929],[20,13.23],[30,17.30],[40,22.25],[50,28.23],[60,35.41]];
PT.R407C = [[-40,0.857],[-30,1.387],[-20,2.147],[-10,3.198],[0,4.607],[10,6.449],[20,8.803],[30,11.759],[40,15.413],[50,19.878],[60,25.287]];
PT.R134a = [[-40,0.512],[-30,0.844],[-20,1.327],[-10,2.006],[0,2.928],[10,4.146],[20,5.717],[30,7.702],[40,10.166],[50,13.179],[60,16.818],[70,21.168]];
var PTB = {
 R454B: [[-40,1.670],[-30,2.570],[-20,3.807],[-10,5.456],[0,7.599],[10,10.32],[20,13.72],[30,17.90],[40,22.96],[50,29.02],[60,36.23]],
 R407C: [[-40,1.203],[-30,1.871],[-20,2.799],[-10,4.047],[0,5.679],[10,7.764],[20,10.376],[30,13.591],[40,17.49],[50,22.16],[60,27.692]]
};

// ===== Στοιχεία ψυκτικών (κατηγορία ασφαλείας, GWP κατά IPCC AR4 – όπως τα μετράει ο Κανονισμός F-gas) =====
var REFI = {
 R32:  {cls:"A2L", gwp:675, glide:"0 (καθαρό)", oil:"POE", fgas:true, use:"Νέα split/multi/αντλίες θερμότητας – αντικατέστησε το R410A.", note:"Ήπια εύφλεκτο: χωρίς φλόγα/σπινθήρες, αερισμός, εργαλεία για A2L.", src:"Arkema – Forane 32 (AR4 675, A2L)"},
 R410A:{cls:"A1",  gwp:2088, glide:"~0 (σχεδόν αζεοτροπικό)", oil:"POE", fgas:true, use:"Split/VRF παλαιότερης γενιάς (περίπου 2005–2018).", note:"Γέμισμα πάντα ως υγρό (μείγμα). Δουλεύει σε ~1,6 φορές την πίεση του R22.", src:"Arkema / ACHR News – Forane 32 vs R-410A (GWP 2088)"},
 R454B:{cls:"A2L", gwp:466, glide:"~1,5 K", oil:"POE", fgas:true, use:"Νέα μηχανήματα στη θέση του R410A (κυρίως κανάλια, chillers, αντλίες θερμότητας).", note:"Μείγμα R32/R1234yf (68,9/31,1): γέμισμα ως υγρό. Για υπερθέρμανση χρησιμοποιείς σημείο δρόσου, για υπόψυξη σημείο φυσαλίδας.", src:"Gas Servei – Technical data sheet R-454B· Opteon XL41 product information"},
 R407C:{cls:"A1",  gwp:1774, glide:"~7,4 K", oil:"POE", fgas:true, use:"Παλαιότερα VRF/chillers/αντλίες θερμότητας – αντικαταστάτης του R22.", note:"Μεγάλη ολίσθηση: γέμισμα ΜΟΝΟ ως υγρό. Αν έχει διαρροή, δεν «συμπληρώνεις» – η σύσταση αλλάζει.", src:"Arkema – Forane 407C (GWP AR4 1774, A1)· Gas Servei – R-407C (glide 7,4)"},
 R134a:{cls:"A1",  gwp:1430, glide:"0 (καθαρό)", oil:"POE", fgas:true, use:"Chillers, αντλίες θερμότητας νερού, ψύξη.", note:"Χαμηλές πιέσεις – σε χαμηλές θερμοκρασίες εξάτμισης η αναρρόφηση πέφτει κάτω από 0 bar (κενό).", src:"Arkema – Forane 134a (GWP 1430, A1)"},
 R22:  {cls:"A1",  gwp:1810, glide:"0 (καθαρό)", oil:"Ορυκτό (MO) / αλκυλοβενζόλιο (AB)", fgas:false, hcfc:true, use:"Παλιά μηχανήματα (πριν το ~2004).", note:"HCFC (καταστρέφει το όζον, ODP 0,055). Στην ΕΕ δεν επιτρέπεται συμπλήρωση R22 στο service – μόνο ανάκτηση.", src:"Arkema – Forane Technical Digest (R-22: AR4 1810, ODP 0,055, A1)"},
 R290: {cls:"A3",  gwp:null, glide:"0 (καθαρό)", oil:"Ορυκτό ή POE κατά τον κατασκευαστή", fgas:false, natural:true, use:"Μικρά split/φορητά, αντλίες θερμότητας monoblock.", note:"Προπάνιο – πολύ εύφλεκτο (A3). Μικρή επιτρεπόμενη ποσότητα, δουλειά μόνο με εργαλεία για εύφλεκτα, αερισμός, ανιχνευτής αερίου.", src:"Arkema – Forane R-32 Technical Guide (R-290: A3)"}
};
var REF_ORDER = ["R32","R410A","R454B","R407C","R134a","R22","R290"];

PARTS.push({id:"pt", icon:"🌡️", name:"Πίνακας P/T & στοιχεία ψυκτικών", body:[
 ["Πώς το χρησιμοποιείς","Γράψε την πίεση του μανομέτρου (σχετική, όπως τη δείχνει) και βλέπεις σε ποια θερμοκρασία βράζει/συμπυκνώνεται το ψυκτικό. Ή γράψε θερμοκρασία και βλέπεις την πίεση."],
 ["Μείγματα με ολίσθηση (R454B, R407C)","Στην ίδια πίεση έχουν δύο θερμοκρασίες: σημείο δρόσου (dew – όλο αέριο) και σημείο φυσαλίδας (bubble – όλο υγρό). Υπερθέρμανση = θερμοκρασία σωλήνα − dew. Υπόψυξη = bubble − θερμοκρασία σωλήνα."]
]});
PARTS.push({id:"fgas", icon:"🌍", name:"F-gas: πόσο συχνά έλεγχος διαρροής", body:[
 ["Τι λέει ο νόμος","Κανονισμός (ΕΕ) 2024/573 (άρθρο 5): ο έλεγχος διαρροής εξαρτάται από τους τόνους CO₂-ισοδύναμου (κιλά × GWP ÷ 1000), όχι μόνο από τα κιλά."],
 ["Ποιος τον κάνει","Μόνο πιστοποιημένος τεχνικός F-gas. Κάθε έλεγχος, συμπλήρωση και ανάκτηση καταγράφεται στο αρχείο του μηχανήματος."]
]});
PARTS.push({id:"air", icon:"💨", name:"Αέρας: ΔT & σημείο δρόσου", body:[
 ["Πώς μετράς","Θερμόμετρο στην είσοδο αέρα (φίλτρα) και στην έξοδο (περσίδα), μονάδα σε μέγιστο ανεμιστήρα και test run/ελάχιστη θερμοκρασία για 15 λεπτά. Μέτρα στο κέντρο της ροής, όχι στην άκρη."],
 ["Σημείο δρόσου","Αν μια επιφάνεια (σωλήνας, κανάλι, περσίδα) είναι πιο κρύα από το σημείο δρόσου του αέρα γύρω της, θα «ιδρώσει» – τότε θέλει μόνωση, όχι επισκευή."]
]});

// ===== Επίσημες σελίδες manuals (μόνο όσες επιβεβαιώθηκαν) =====
var MANUALS = {
 "Daikin":[["daikin.eu – αναζήτηση μοντέλου","https://www.daikin.eu","Τα manuals της Daikin γράφουν ότι τα ψηφιακά αρχεία είναι στο daikin.eu (αναζήτηση με το μοντέλο). Τα πλήρη τεχνικά (service) θέλουν λογαριασμό στο Daikin Business Portal."]],
 "Mitsubishi Electric":[["Document Library (Mitsubishi Electric UK)","https://library.mitsubishielectric.co.uk/",""]],
 "Panasonic":[["Panasonic PRO Club","https://www.panasonicproclub.com","Δωρεάν εγγραφή επαγγελματία – service, installation & user manuals."]],
 "Toshiba":[["Toshiba Carrier – manuals ανά μοντέλο (και ελληνικά)","https://www.toshiba-carrier.co.th/manuals/default.aspx","Η διεύθυνση του QR code που τυπώνεται στα manuals της Toshiba."],["Toshiba Air Conditioning UK – Manuals & downloads","https://www.toshiba-aircon.co.uk/en/manuals-and-downloads.html",""]],
 "Fujitsu":[["Fujitsu General Europe – Downloads","https://www.fujitsu-general.com/eu/support/downloads/index.html","Operation & installation manuals ανά μοντέλο."]],
 "Samsung":[["Samsung Ελλάδας – εγχειρίδια","https://www.samsung.com/gr/support/user-manuals-and-guide/","Γράψε το μοντέλο της εσωτερικής."]],
 "Juro-Pro":[["juropro.gr (ΜΑΓΝΗΤΙΚΗ Α.Ε.)","https://www.juropro.gr","Τα manuals της Juro-Pro παραπέμπουν εδώ για την ηλεκτρονική έκδοση."]],
 "Mitsubishi Heavy":[["MHI Thermal Systems – Users & installation manuals","https://www.mhi-mth.co.jp/en/products/detail/air-conditioner_users_manual.html","Η διεύθυνση που τυπώνει η MHI στα manuals της για την πλήρη έκδοση."]],
 "Haier":[["Haier Ελλάδας – Εγχειρίδια","https://www.haier-europe.com/el_GR/techniki-voitheia/encheiridio/","Επιλέγεις σειρά ή κωδικό προϊόντος."],["Haier HVAC Europe","https://haierhvac.eu","Εκεί φιλοξενούνται τα ευρωπαϊκά manuals χρήσης/εγκατάστασης."]],
 "Hitachi":[["ABB – επίσημος αντιπρόσωπος Hitachi στην Ελλάδα","https://new.abb.com/low-voltage/el/greek-pages/air-conditioning-systems/hitachi",""]],
 "Gree":[["gree.gr – επίσημη σελίδα Ελλάδας","https://www.gree.gr",""],["gree.com (ηλεκτρονική έκδοση manuals)","https://www.gree.com","Τα ελληνικά manuals της Gree παραπέμπουν εδώ ή στο global@cn.gree.com."]],
 "TCL":[["TCL Ελλάδας (Όμιλος Τουρνικιώτη)","https://www.tclgreece.gr",""]],
 "LG":[["lg.com (επίλεξε Ελλάδα → Υποστήριξη)","https://www.lg.com","Τα ευρωπαϊκά manuals της LG (με ελληνικά) γράφουν ότι το πρωτότυπο κατεβαίνει από το www.lg.com."]],
 "Midea":[["Midea Ελλάδας","https://www.midea.com/gr","Η επίσημη ελληνική σελίδα· εκεί φιλοξενούνται και τα ελληνικά manuals (π.χ. All Easy Pro, Gaia)."]],
 "Hisense":[["Hisense Ισπανίας – λήψη manuals","https://www.hisense.es/descargas-manuales/","Ευρωπαϊκά μοντέλα (Hi Comfort, Max Comfort, Air Master κ.ά.). Ελληνική σελίδα manuals δεν βρέθηκε."]]
};

// ===== Ένδειξη πλακέτας εξωτερικής – γενικός κανόνας ανά πίνακα (όταν δεν υπάρχει αντιστοίχιση ανά κωδικό) =====
var OUTN = {
 daikin_split: {t:"Μονόσπλιτ (RX/RXM/RXA/ARX…): η πλακέτα εξωτερικής έχει μόνο το πράσινο LED A – αναβοσβήνει = ο μικροεπεξεργαστής δουλεύει. ΔΕΝ δείχνει κωδικό· τον διαβάζεις από το τηλεχειριστήριο. Αν το LED μένει συνεχώς αναμμένο: κλείσε/άνοιξε το ρεύμα και ξανακοίτα σε ~3′ – αν ξανανάψει, φταίει η πλακέτα εξωτερικής. Στα multi (MXS/MXM) υπάρχουν και κόκκινα LED – δες «Εξωτερική».", s:"Daikin service manuals SiBE041102_A, Si04-402A, SiENBE04-808_A (Outdoor unit – LED A)· Daikin RXA20A2V1B manual (Fault diagnosis using LED on outdoor unit PCB)"},
 lg_all: {t:"Μονόσπλιτ inverter: η ένδειξη βλάβης βγαίνει και στο κόκκινο LED01M της πλακέτας εξωτερικής. Multi V (ARUN…): κόκκινο LED = δεκάδες, πράσινο = μονάδες, κόκκινο+πράσινο μαζί = εκατοντάδες του κωδικού.", s:"LG service manual ASNW096F1G0 (Troubleshooting Guide)· LG Multi V ARUN50GS2A service manual (Self-diagnosis function)", lgmv:true},
 samsung_all: {t:"Η πλακέτα εξωτερικής δείχνει τη βλάβη με 3 LED (αναμμένο / αναβοσβήνει / σβηστό) – ο συνδυασμός ανά κωδικό διαφέρει ανά σειρά και είναι στο κεφάλαιο «Outdoor LED Display Error» του service manual του μοντέλου. Σε DVM/εμπορικά: LED κόκκινο/πράσινο/κίτρινο στη MAIN και INVERTER πλακέτα.", s:"Samsung service manuals AR09KSWSJWK (3-2 Outdoor LED Display Error), AR09HSFSHWK (10-2 Indoor/Outdoor display)"},
 panasonic_split: {t:"Μονόσπλιτ: ο κωδικός φαίνεται μόνο με το TIMER LED της εσωτερικής και με το CHECK του τηλεχειριστηρίου – το service manual δεν δίνει ένδειξη εξωτερικής. Στα multi (CU-2S/3S/4S…) η εξωτερική έχει LED1–LED6 με συνδυασμό ανά κωδικό· LED1 αναμμένο = εξωτερική κανονικά· σβηστό ή αναβοσβήνει → έλεγξε τροφοδοσία και αυτοδιάγνωση.", s:"Panasonic service manual CS-TE9HKE (15.2 Breakdown self diagnosis)· Panasonic multi CU-2S18NBU service manual (Diagnosis display / LED1–LED6)"},
 toshiba_ras: {t:"Οικιακά RAS: η βλάβη φαίνεται στις λυχνίες OPERATION/TIMER της εσωτερικής και με το CHECK του τηλεχειριστηρίου. Σε παλαιότερα inverter (π.χ. RAS-M…EAVE) η εξωτερική έχει 5 κόκκινα LED (D11–D15) στην υποπλακέτα κάτω από τον inverter για αυτοδιάγνωση.", s:"Toshiba service manuals SVM-10017 (RAS-107SAV-E3), RAS-M14EAVE (11-7 Trouble diagnosis by outdoor LED)"},
 toshiba_rav: {t:"RAV (Digital/Super Digital Inverter): στην πλακέτα εξωτερικής LED800–LED804. Σημείωσε τι δείχνουν (display mode 1), πάτα SW800 ≥1″ (display mode 2) και βρες τον συνδυασμό στον πίνακα του installation manual εξωτερικής. Με SW803 bit1 ON βλέπεις την προηγούμενη βλάβη.", s:"Toshiba RAV-SP1104AT-E outdoor installation manual (Check of the abnormal status)· RAV-SP1604AT8-E service manual"},
 mhi_split: {t:"Η πλακέτα ελέγχου εξωτερικής έχει κόκκινο και πράσινο LED που αναβοσβήνουν μαζί με τις λυχνίες RUN/TIMER της εσωτερικής – ο πίνακας ανά βλάβη είναι στο MHI Service Support Handbook (RAC fault codes). Για αυτόν τον κωδικό δεν υπάρχει καθαρή γραμμή στον πίνακα (οι υπόλοιποι κωδικοί έχουν δική τους ένδειξη).", s:"MHI Service Support Handbook SRK-ZSP-S – RAC fault codes (Indoor display / Outdoor control PCB red & green LED)"}
};

// ===== MHI οικιακά (SRK/SRC): κόκκινο LED πλακέτας εξωτερικής ανά κωδικό =====
// Πηγή: MHI Air Conditioners Australia – Service Support Handbook, «RAC self-diagnosis information (R410A & R32 series)».
// Τα ευρωπαϊκά SRK/SRC έχουν την ίδια στήλη «Outdoor (LED)» (MHI technical manual SRK50HE-S)· διασταυρώθηκε η γραμμή E36 (RUN αναμμένο, TIMER ×5, εξωτερική ×5).
(function(){
  var M = {
    E16:"Καμία ένδειξη στην εξωτερική (βλάβη εσωτερικής). Εσωτερική: RUN ×6, TIMER αναμμένο.",
    E38:"Κόκκινο LED ×8. Εσωτερική: RUN αναβοσβήνει συνεχώς, TIMER ×1.",
    E37:"Κόκκινο LED ×8. Εσωτερική: RUN αναβοσβήνει συνεχώς, TIMER ×2.",
    E39:"Κόκκινο LED ×8. Εσωτερική: RUN αναβοσβήνει συνεχώς, TIMER ×4.",
    E42:"Κόκκινο LED ×1. Εσωτερική: RUN αναμμένο, TIMER ×1.",
    E59:"Κόκκινο LED ×2. Εσωτερική: RUN αναμμένο, TIMER ×2.",
    E58:"Κόκκινο LED ×3. Εσωτερική: RUN αναμμένο, TIMER ×3.",
    E51:"Κόκκινο LED ×1. Εσωτερική: RUN αναμμένο, TIMER ×4.",
    E36:"Κόκκινο LED ×5. Εσωτερική: RUN αναμμένο, TIMER ×5. ✓ Ίδιο και στο ευρωπαϊκό technical manual (SRK50HE-S).",
    E3:"Κόκκινο LED ×6. Εσωτερική: RUN αναμμένο, TIMER ×6.",
    E48:"Κόκκινο LED αναμμένο σταθερά. Εσωτερική: RUN αναμμένο, TIMER ×7.",
    E35:"Κόκκινο LED ×2. Εσωτερική: RUN αναμμένο, TIMER αναβοσβήνει συνεχώς."
  };
  var tag=" (Πίνακας MHI Αυστραλίας, σειρές SRK/SRC. Εκτός από το E36, δεν έχει διασταυρωθεί γραμμή-γραμμή σε ευρωπαϊκό manual.)";
  if(T.mhi_split) T.mhi_split.codes.forEach(function(c){ if(c[3]) return; for(var i=0;i<c[0].length;i++){ var k=String(c[0][i]).toUpperCase(); if(M[k]){ c[3]=M[k]+(k==="E36"?"":tag); return; } } });
})();
