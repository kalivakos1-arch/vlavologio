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
 daikin_vrv: {t:"VRV: ο κωδικός φαίνεται και στην πλακέτα της εξωτερικής (7-segment/LED) σε «Mode 1 – Monitor mode» (κουμπιά BS1/BS2/BS3). Εναλλάσσει κύριο κωδικό και υποκωδικό κάθε 1″ (π.χ. E3 ↔ 01 · -01 master, -02 slave1, -03 slave2). Reset με BS3.", s:"Daikin service manual VRV IV+ ESIE18-15B (Mode 1: Monitor mode)· Daikin RXYLQ – malfunction code on outdoor unit· Daikin REYQ SiUS39-602 (Malfunction code indication by outdoor unit PCB)"},
 hr_daikin: {t:"VRV Heat Recovery: ίδια ανάγνωση με VRV – Monitor mode με BS1/BS2/BS3, κύριος κωδικός ↔ υποκωδικός κάθε 1″.", s:"Daikin ESIE18-15B· Daikin REYQ SiUS39-602"},
 me_citymulti: {t:"City Multi (PUHY/PURY): με ΟΛΟΥΣ τους διακόπτες SW1 της πλακέτας ελέγχου εξωτερικής στο OFF, το LED display της εξωτερικής δείχνει τον κωδικό βλάβης. Με άλλους συνδυασμούς SW1 διαβάζεις θερμοκρασίες, πιέσεις και ιστορικό.", s:"Mitsubishi Electric City Multi service handbook PUHY-P72/96 («Troubleshooting Using the Outdoor Unit LED Error Display», «LED Monitor Display on the Outdoor Unit Board»)· PUHY-P500YMF-C (EU) – [4] LED Monitor Display· library.mitsubishielectric.co.uk"},
 hr_me: {t:"City Multi R2 (PURY): SW1 όλοι OFF → ο κωδικός βλάβης στο LED display της εξωτερικής. Το BC controller έχει δικό του LED.", s:"Mitsubishi Electric City Multi service handbook – Outdoor Unit LED Error Display / BC controller LED display"},
 me_split: {t:"Mr Slim (PUZ/PUHZ): η πλακέτα ελέγχου εξωτερικής έχει LED1 (πράσινο) και LED2 (κόκκινο) που αναβοσβήνουν με μοτίβο ανάλογα με τον κωδικό. Με το A-Control Service Tool (PAC-SK52ST) στο CNM, η οθόνη δείχνει τον ίδιο κωδικό (F3…EE, U1…UL, P1…P8) και ιστορικό με το DIP SW2. Η αντιστοίχιση ανά κωδικό εμφανίζεται πάνω στην κάρτα. Οικιακά MSZ/MUZ/MXZ έχουν άλλο μοτίβο – δεν επιβεβαιώθηκε.", s:"Mitsubishi Electric service manual PUZ-ZM100–140 (10-1 Troubleshooting· E4 «displayed at LED1, LED2 on outdoor controller board»)· OCH727A (Outdoor unit LED1/LED2, A-Control Service Tool)"},
 me_ecodan: {t:"Ecodan (PUZ-WM/PUZ-WZ/PUHZ-SW): στην πλακέτα ελέγχου εξωτερικής LED1 (πράσινο) + LED2 (κόκκινο) – το μοτίβο αναλαμπών δείχνει τον τύπο βλάβης. Με A-Control Service Tool PAC-SK52ST στο CNM η ένδειξη δείχνει τον κωδικό (στο άναμμα: F3, F5, F9, E0–EE· σε λειτουργία: U1–U9, UL, UP, UH, UF, Ud, P1–P8) και ιστορικό 3 τελευταίων (0 = εξωτερική, 1/2 = εσωτερική). Η αντιστοίχιση LED ανά κωδικό εμφανίζεται πάνω στην κάρτα κάθε κωδικού (F/E/U/P). Οι κωδικοί L/J είναι του FTC (εσωτερική), όχι της εξωτερικής.", s:"Mitsubishi Electric UK service manual OCH727A (Ecodan PUZ-WM50–112, R32) – Outdoor controller board LED / A-Control Service Tool"},
 gree_gmv: {t:"GMV (GMV5/GMV6): ο κωδικός βλάβης εμφανίζεται στο 2ψήφιο LED της κύριας πλακέτας της εξωτερικής (π.χ. H8). Κατά το commissioning τα LED1/LED2/LED3 δείχνουν βήμα (db), πρόοδο και κωδικό κατάστασης (π.χ. «db 09 OC» = βάνες κλειστές· SW6/SW4 για επιβεβαίωση).", s:"Gree GMV6 DC Inverter VRF service manual (2.85 «H8» – fault display on main board of outdoor unit· debugging LED1/LED2/LED3)· Gree Mini GMV5 service manual (2.2 Status display table for indicators on main board of outdoor unit, Gree Hungary)"},
 midea_vrf: {t:"Midea VRF: ο κωδικός βλάβης εμφανίζεται στην κύρια πλακέτα (main PCB) της εξωτερικής ΚΑΙ στο χειριστήριο.", s:"Midea España – VRF E8 Full DC R32 service/error code documentation (midea.es)"},
 midea_mthermal: {t:"M-Thermal Mono: ο κωδικός βγαίνει στην πλακέτα της εξωτερικής και στο χειριστήριο. M-Thermal Split: στο χειριστήριο και στην κύρια πλακέτα του ψυκτικού κυκλώματος.", s:"Midea España – M-Thermal Mono / Split error code documentation (midea.es)"},
 panasonic_ecoi: {t:"ECOi / Mini ECOi: η πλακέτα ελέγχου εξωτερικής έχει LED1/LED2 που δείχνουν βλάβες που ανίχνευσε η εξωτερική (πίνακας «Outdoor Unit Control Panel LED Display»). Τον πλήρη κωδικό και το ιστορικό τα βλέπεις με το Outdoor Unit Maintenance Remote Controller (σύνδεση με ειδικό καλώδιο στην πλακέτα) – εναλλάσσει αριθμό μονάδας και κωδικό.", s:"Panasonic service manuals ECOi U-8ME1E8E (Section 6: Outdoor Unit Control Panel LED Display)· Mini ECOi U-4/5/6LE1E5/E8 (Outdoor Unit Control PCB – PCB and Functions· Outdoor Unit Maintenance Remote Controller)"},
 hitachi_all: {t:"Set Free / Utopia (RAS-…FSN/HRN): η πλακέτα PCB1 της εξωτερικής έχει 7-segment και διακόπτες PSW για έλεγχο (κατάσταση, συχνότητα, ρεύμα συμπιεστή, κωδικοί προστασίας). Ο κωδικός alarm διαβάζεται στο χειριστήριο (RUN αναβοσβήνει, μονάδα + κωδικός + model code). Οικιακά RAK: δεν έχει επιβεβαιωθεί.", s:"Hitachi service manual SMGB0059 RAS-(8~12)FSNM(E) (7.2.4 Troubleshooting by 7-segment display)· Hitachi TCGB0039 (18.4 Troubleshooting by 7-segment display, 18.5 Protection control code)"},
 daikin_altherma: {t:"Altherma 3: η πλακέτα εξωτερικής έχει μόνο το LED HAP – αναβοσβήνει κανονικά = η πλακέτα δουλεύει. ΔΕΝ δείχνει κωδικό· ο κωδικός + λεπτομερής κωδικός (π.χ. E1-00) βγαίνει στο χειριστήριο/οθόνη της εσωτερικής. Αν το HAP δεν αναβοσβήνει με σωστή τροφοδοσία → πλακέτα εξωτερικής.", s:"Daikin Europe service manual Altherma 3 M ESIE20-06A (Troubleshooting – HAP led)· Daikin Altherma ERGA installer reference guide (Error codes: Overview)"},
 mhi_kx: {t:"KX (KXZ/KXZE1…): η πλακέτα ελέγχου εξωτερικής έχει 7-segment 3 ψηφίων που δείχνει τον ΙΔΙΟ κωδικό με το χειριστήριο (μορφή EXX, π.χ. E45-1 = επικοινωνία πλακέτας inverter ↔ ελέγχου), καθώς και πράσινο (κανονικά αναβοσβήνει) και κόκκινο LED. Με SW8/SW9 επιλέγεις άλλες ενδείξεις (δεδομένα, ιστορικό).", s:"MHI service manuals KX-SM-202 (FDC280–1680KXZE1, EU – coolmark.nl), KX-SM-318 & KX-SM-292 (KXZ, «2.3 Contents of troubleshooting – 7-segment display»), MHI UK KX-T-379 (7.4 Operation control function by the outdoor control)"},
 lg_therma: {t:"Therma V: η βλάβη φαίνεται με κόκκινο/πράσινο LED στην πλακέτα της εξωτερικής (και στο χειριστήριο). Κόκκινο = δεκάδες, πράσινο = μονάδες, κόκκινο+πράσινο μαζί = εκατοντάδες (π.χ. 21 = κόκκινο ×2, πράσινο ×1).", s:"LG Therma V service manual AHNW16606B0 (12. Troubleshooting guide – Outdoor unit, Main PCB/Inverter)· LG Therma V installation manual (Troubleshooting for error code – red/green LED of outdoor unit control board)· ίδιο σχήμα με Multi V", lgmv:true},
 samsung_ehs: {t:"EHS Mono (AE…RXYDEG/GG): ο κωδικός εμφανίζεται στην κύρια πλακέτα (main PBA) της εξωτερικής ή στο ενσύρματο χειριστήριο – ίδιοι αριθμοί (π.χ. 101, 201, 458).", s:"Samsung AE RXYDEG (EU) installation manual – Error codes· Samsung EHS service manual AE040RXEDEG/AE080RXYDEG"},
 toshiba_estia: {t:"Estia: στην πλακέτα εξωτερικής LED800–LED804 (κίτρινα) + D805 (πράσινο). SW803 όλα OFF → σημείωσε τα LED (display mode 1), πάτα SW800 ≥1″ (display mode 2) και βρες τον συνδυασμό στον πίνακα του manual. SW803 bit 1 ON = τελευταία βλάβη.", s:"Toshiba Estia HWS-803H-E installation manual (Troubleshooting – outdoor LED)· Toshiba Estia 3rd gen service manual (HWS-803/1103/1403H-E)· Toshiba UK HWT-401…1101HW-E (R32)"},
 hisense_vrf: {t:"Hi-FLEXi: η πλακέτα της εξωτερικής έχει 7-segment με κουμπιά ελέγχου – δείχνει κατάσταση, κωδικό alarm και ιστορικό (Alarm history display). Οι κωδικοί είναι ίδιοι με του χειριστηρίου.", s:"Hisense Hi-FLEXi S technical/service handbook (Checking by 7-segment display, Checking of alarm code history)· Hisense Hi-Flexi AVWT-212FESZ service manual (EU)"},
 gree_versati: {t:"Versati: το χειριστήριο γράφει το όνομα της βλάβης (π.χ. «Drive-main com.», «Start failure»), ενώ η 2ψήφια ένδειξη «88» της κύριας πλακέτας δείχνει τον κωδικό (π.χ. P6, LC).", s:"Gree Versati Monobloc service manual (4.1.4 Drive-to-main-control communication error P6, 4.1.5 Compressor startup failure LC – «displayed in the mainboard 88 indicating lamp»)"},
 haier_hp: {t:"Haier ATW (AU082/112FYCRA): οι βλάβες της εξωτερικής διαβάζονται στο ενσύρματο χειριστήριο, κατηγορία B: τρέχουσα βλάβη εξωτερικής και ιστορικό 1–3 (B61–B63). Η ενότητα «LED displays 08E/10E» του manual είναι διάγραμμα ελέγχου για τον κωδικό 08/10 (ροή νερού) – δεν υπάρχει πίνακας LED πλακέτας εξωτερικής ανά κωδικό στο manual.", s:"Haier AU082FYCRA(HW) service manual (Timer/function codes B61–B63, Error code, LED displays 08E/10E)"},
 panasonic_aquarea: {t:"Aquarea: ο κωδικός (H../F..) εμφανίζεται στο χειριστήριο/πάνελ – η λυχνία λειτουργίας αναβοσβήνει. Στα ευρωπαϊκά service manuals (WH-UD/SDC/ADC) ΔΕΝ υπάρχει πίνακας ένδειξης κωδικού στην πλακέτα της εξωτερικής – δεν βρέθηκε επίσημη πηγή.", s:"Panasonic Aquarea operating instructions WH-ADC0309H3E5/WH-UD (Troubleshooting – error code on remote controller)· Panasonic Aquarea user guide F/G series· έλεγχος service manuals WH-SDC09H3E8, WH-UD05JE5"},
 inventor_evi: {t:"Σειρές τύπου Gree U-Match: η κύρια πλακέτα της εξωτερικής δείχνει τον ΙΔΙΟ κωδικό με το ενσύρματο χειριστήριο (π.χ. E4). Οικιακά split τύπου Gree: δεν βρέθηκε επίσημος πίνακας ένδειξης στην εξωτερική.", s:"Gree U-Match 5 service manual (3.4.4 «E4» – «ODU mainboard, IDU wired controller and IDU receiver light board will display E4»), Gree Hungary"},
 inventor_minichiller: {t:"Δεν βρέθηκε δημόσιο επίσημο service manual της Inventor για τα Mini Chiller με ένδειξη πλακέτας εξωτερικής. Ο κωδικός διαβάζεται στο χειριστήριο της μονάδας.", s:"Αναζήτηση Νοέμβριος 2026 – καμία επίσημη πηγή"},
 kerosun_split: {t:"Δεν βρέθηκε δημόσιο επίσημο service manual Kerosun με ένδειξη πλακέτας εξωτερικής. Ο κωδικός διαβάζεται στην οθόνη της εσωτερικής.", s:"Αναζήτηση Νοέμβριος 2026 – καμία επίσημη πηγή"},
 tcl_split: {t:"TCL: για τα multi (FMA) υπάρχει πίνακας αναλαμπών της λυχνίας εξωτερικής (δες «Εξωτερική» → TCL multi). Για τους υπόλοιπους κωδικούς split δεν βρέθηκε επίσημη αντιστοίχιση.", s:"TCL multi FMA service manual· αναζήτηση Νοέμβριος 2026"},
 aux_split: {t:"AUX: η πλακέτα εξωτερικής έχει 3 LED (D1–D3). Για τους κωδικούς που ΔΕΝ έχουν δική τους γραμμή στον πίνακα, τα LED δείχνουν D1 σβηστό · D2 αναβοσβήνει · D3 σβηστό = «άλλη βλάβη – δες με εργαλείο σέρβις». Κανονικά: όλα σβηστά (αναμονή) ή όλα αναβοσβήνουν (συμπιεστής δουλεύει).", s:"AUX service manual ASW-H09B5B4/FAR3DI-C3 (EU), 8-2 Display error code of outdoor unit's indicator lights (γραμμές 1, 2, 17)· AUX Troubleshooting Guide (auxusa)"},
 hisense_split: {t:"Hisense split: όταν ο συμπιεστής σταματήσει από βλάβη, τα LED της πλακέτας εξωτερικής δείχνουν αυτόματα την ακολουθία της βλάβης· οι αριθμητικοί κωδικοί διαβάζονται και με SLEEP ×4 σε 10″ στο τηλεχειριστήριο (7-segment εσωτερικής). Ο πίνακας LED ανά αριθμό διαφέρει ανά σειρά.", s:"Hisense Trouble Shooting – Error Code Table (1. Indication on the outdoor unit / 2. Indication by the indoor unit) – parteypieza.cl (διανομέας Hisense)· Hisense service manual AS-…UR4S"},
 haier_split: {t:"Haier: η πλακέτα εξωτερικής έχει LED1 που αναβοσβήνει N φορές – δες τον πίνακα «Haier multi/split – LED1 πλακέτας εξωτερικής». Οι κωδικοί που δεν είναι σε αυτόν τον πίνακα (κυρίως εσωτερικής) δεν έχουν επιβεβαιωμένη ένδειξη στην εξωτερική.", s:"Haier service manual multi 2U18MS2VHB (outdoor LED1 flash table)"},
 fujitsu_all: {t:"Fujitsu: μονόσπλιτ – ο κωδικός φαίνεται με τις λυχνίες OPERATION/TIMER της εσωτερικής (π.χ. 11 = OPERATION ×1, TIMER ×1). Multi (AOYG…LAT): LED1–LED4 πλακέτας εξωτερικής – δες πίνακα «Fujitsu multi». Νεότερες εξωτερικές με LED «ERROR»: όταν αναβοσβήνει, πάτα ENTER μία φορά και διάβασε τα LED από τον πίνακα του manual. VRF (AJ…): 7-segment εξωτερικής δείχνει E.xx.x.", s:"Fujitsu service manual (1-2 Outdoor unit display – ERROR LED + ENTER)· Fujitsu installation manual multi AOYG30LAT4 (Outdoor unit LEDs)· Fujitsu VRF service manual (Outdoor unit: E. 86. 1)"},
 hisense_hitherma: {t:"Hi-Therma: ο κωδικός διαβάζεται στο χειριστήριο της μονάδας. Δεν βρέθηκε επίσημο manual με πίνακα ένδειξης στην πλακέτα της εξωτερικής.", s:"Αναζήτηση Νοέμβριος 2026 – καμία επίσημη πηγή"},
 hr_lg: {t:"Multi V Heat Recovery: ο κωδικός φαίνεται στο 7-segment της master εξωτερικής (π.χ. 200 = σφάλμα αυτόματης αναγνώρισης σωληνώσεων).", s:"LG Multi V 5 Operation & maintenance manual (media.us.lg.com) – «If there is an auto pipe detection error, 200 will be displayed»"},
 hr_samsung: {t:"DVM Heat Recovery: ο κωδικός φαίνεται στο 7-segment της πλακέτας εξωτερικής (Outdoor unit 7-segment error display).", s:"Samsung troubleshooting manual – Outdoor Unit 7-segment Error Display"},
 hr_midea: {t:"Midea VRF Heat Recovery: ο κωδικός εμφανίζεται στην κύρια πλακέτα της εξωτερικής και στο χειριστήριο.", s:"Midea España – VRF E8 Full DC R32 (midea.es)"},
 midea_split: {t:"Ο κωδικός αυτός δεν περιλαμβάνεται στον πίνακα «Error Display (For Some Outdoor Units)» του ευρωπαϊκού manual. Σε εξωτερικές με οθόνη, πάτα SW1 (point check) – η θέση 00 δείχνει συχνότητα/κατάσταση ή κωδικό βλάβης. Κόκκινο LED πλακέτας: αργό αναβόσβημα = αναμονή, σταθερό = ρεύμα, γρήγορο (2,5 Hz) = βλάβη.", s:"Midea service manual SM_LC(GA)_R32_3D INV_EU_NB_2207 – 2.2 Error Display (For Some Outdoor Units), 4. Outdoor unit point check function"},
 gree_split: {t:"Ο κωδικός αυτός δεν περιλαμβάνεται στον πίνακα λυχνιών εξωτερικής (Κίτρινο/Κόκκινο/Πράσινο) του ευρωπαϊκού manual. Κανονικά: Πράσινο αναμμένο = επικοινωνία OK.", s:"Gree service manual GWH09QB-K6DNA1C/I (EU), 9.1 Error Code List"},
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
  var tag=" (Κόκκινο LED: από τον πίνακα της MHI Αυστραλίας. Ο κωδικός και οι λυχνίες RUN/TIMER είναι ίδια στα ευρωπαϊκά SRK – technical manual SRK20ZS-W «SRK-T-299» & service manual SRK25ZSP-W – αλλά αυτά δεν έχουν στήλη για το LED εξωτερικής.)";
  if(T.mhi_split) T.mhi_split.codes.forEach(function(c){ if(c[3]) return; for(var i=0;i<c[0].length;i++){ var k=String(c[0][i]).toUpperCase(); if(M[k]){ c[3]=M[k]+(k==="E36"?"":tag); return; } } });
})();

// ===== Mitsubishi Electric Mr Slim (PUHZ/PUZ) & Ecodan (PUHZ-SW/SHW, PUZ-WM/WZ): LED1 πράσινο / LED2 κόκκινο ανά κωδικό =====
// Πηγές (ευρωπαϊκά, διαβάστηκαν από εικόνα σελίδας): PUHZ-RP35VHA4 service manual σελ. 83–84 («Display function of inspection for outdoor unit»),
// Ecodan PUHZ-SHW230YKA2 OCH594B σελ. 41–42. Ίδια διάταξη και σε PUHZ-ZRP35VKA2 (OCH635A, EU), PUHZ-P200YHA (EU) και PUZ-A36NHA2 (ΗΠΑ).
(function(){
  var B = function(a,b){ return "LED1 πράσινο ×"+a+" · LED2 κόκκινο ×"+b; };
  var M = {F3:B(1,2),F5:B(1,2),F9:B(1,2),EA:B(2,1),EB:B(2,1),EC:B(2,1),E6:B(2,2),E7:B(2,2),E8:B(2,2),E9:B(2,2),
    E0:B(2,3),E3:B(2,3),E4:B(2,3),E5:B(2,3),EF:B(2,4),ED:B(2,5),U2:B(3,1),U7:B(3,1),U1:B(3,2),UL:B(3,2),U8:B(3,3),UD:B(3,3),
    UF:B(3,4),UP:B(3,4),UH:B(3,4),U6:B(3,4),U3:B(3,5),U4:B(3,5),U5:B(3,6),U9:B(3,7),P1:B(4,1),P2:B(4,1),P9:B(4,1),P4:B(4,2),P5:B(4,2),P6:B(4,3),P8:B(4,4)};
  for(var a=0;a<=8;a++) M["A"+a]=B(2,5);
  var tag=" — πλακέτα ελέγχου εξωτερικής Mr Slim/Ecodan (ευρωπαϊκά manuals PUHZ-RP VHA4 & Ecodan OCH594B· ίδιο και σε manual ΗΠΑ). Κανονικά: LED1 αναμμένο, LED2 αναμμένο όταν δουλεύει ο συμπιεστής. Δεν ισχύει για οικιακά MUZ/MXZ (άλλο μοτίβο).";
  ["me_split","me_ecodan"].forEach(function(key){ if(!T[key]) return;
    T[key].codes.forEach(function(c){ if(c[3]) return; var parts=[], seen={};
      for(var i=0;i<c[0].length;i++){ var k=String(c[0][i]).toUpperCase(); if(M[k]&&!seen[k]){ seen[k]=1; parts.push((c[0].length>1?c[0][i]+": ":"")+M[k]); } }
      if(parts.length) c[3]=parts.join(" | ")+tag; });
  });
})();

// ===== Toshiba RAV (Digital Inverter Series 4, EU) & Estia: LED D800–D804 πλακέτας εξωτερικής ανά κωδικό =====
// RAV: Toshiba service manual SVM-13072 «Digital Inverter Series 4» RAV-SM564–1404ATP-E (EU), 8-2-4 Check code list (Outdoor), σελ. 58. D805 πάντα αναμμένο.
// Estia: Toshiba Estia quick reference guide (Outdoor fault diagnosis): SW803 όλα OFF → display mode 1, SW800 ≥1″ → display mode 2.
//   Επαλήθευση 18/11/2026 με τον άμεσο πίνακα κωδικός ↔ LED του Toshiba Estia service manual HWS-802H-E, 9-4-2 «Outdoor Unit Failure Detection»
//   (στο manual: ● = σβηστό, ○ = αναμμένο, ◎ = αναβοσβήνει). Όλοι οι F, P, L10, H04 ταιριάζουν· προστέθηκαν H01/H02 και L29 (MCU-MCU)· το H03 δεν υπάρχει στο manual Estia → αφαιρέθηκε.
(function(){
  var sym={o:"●",x:"○",f:"◎"}; // o=αναμμένο, x=σβηστό, f=αναβοσβήνει
  var P=function(str){ return str.split("").map(function(ch){return sym[ch];}).join(""); };
  var R={F04:"fxxxx",F06:"xfxxx",F07:"ffxxx",F08:"xxfxx",F12:"fxfxx",F13:"xffxx",F15:"fffxx",F31:"xfxfx",H01:"ffxfx",H02:"xxffx",H03:"fxffx",H04:"xfffx",
    L10:"xxxxf",P03:"xfxxf",P04:"ffxxf",P05:"xxfxf",P07:"xffxf",P15:"fffxf",P19:"xxxff",P20:"fxxff",P22:"xfxff",P26:"ffxff",P29:"xxfff"};
  var E1a="ooxxo", E1b="xxoxo", E1c="oooxo", E1d="xooxo";
  var E={F04:[E1a,"xxfxx"],F06:[E1a,"xffxx"],F07:[E1a,"fffxx"],F08:[E1a,"xxxfx"],F12:[E1a,"xxffx"],F13:[E1a,"fxffx"],F15:[E1a,"ffffx"],F31:[E1a,"fffff"],
    H01:[E1b,"fxxxx"],H02:[E1b,"xfxxx"],H04:[E1b,"xxfxx"],L29:[E1d,"fxfff","επικοινωνία MCU–MCU· το L29 της Estia καλύπτει κι άλλες βλάβες – δες F13/F31/L10/P07/P15/P19"],L10:[E1d,"xfxfx"],P03:[E1c,"ffxxx"],P05:[E1c,"fxfxx"],P07:[E1c,"fffxx"],P15:[E1c,"ffffx"],P19:[E1c,"ffxxf"],
    P20:[E1c,"xxfxf"],P22:[E1c,"xffxf"],P26:[E1c,"xfxff"],P29:[E1c,"fxfff"]};
  if(!T.toshiba_rav) return;
  T.toshiba_rav.codes.forEach(function(c){ var k=String(c[0][0]).toUpperCase(), add=[];
    if(R[k]) add.push("RAV Digital Inverter (SM…4ATP-E): D800–D804 = "+P(R[k])+" (● αναμμένο ○ σβηστό ◎ αναβοσβήνει γρήγορα· D805 αναμμένο)");
    if(E[k]) add.push("Estia εξωτερική"+(E[k][2]?" ("+E[k][2]+")":"")+": mode 1 = "+P(E[k][0])+" → SW800 → mode 2 = "+P(E[k][1])+" (Toshiba Estia service manual HWS-802H-E, άμεσος πίνακας)");
    if(add.length) c[3]=(c[3]?c[3].replace(/^7-seg:/,"VRF SMMS – 7-seg:")+" || ":"")+add.join(" || ")+" — Πηγές: Toshiba SVM-13072 (EU) & Estia HWS-802H-E service manual / quick reference guide. Άλλες γενιές RAV έχουν άλλο πίνακα.";
  });
})();

// ===== MHI KX (KXZE1): τι δείχνει το 7-segment της πλακέτας εξωτερικής ανά κωδικό =====
// Πηγή: MHI service manual KX-SM-202 (FDC280–1680KXZE1, ευρωπαϊκά), 2.3 Contents of troubleshooting – (a) List of inspection displays, σελ. 68 (διαβάστηκε από εικόνα).
(function(){
  var D={E31:"E31",E32:"E32",E36:"E36-1 ή E36-2",E37:"E37-1 … E37-6 (ανάλογα με το αισθητήριο)",E38:"E38",E39:"E39-1 ή E39-2",E40:"E40",E41:"E41-1 ή E41-2",E51:"E51-1 ή E51-2",
    E42:"E42-1 ή E42-2",E43:"E43-1 ή E43-2",E44:"E44-1 ή E44-2",E45:"E45-1 ή E45-2",E46:"E46",E48:"E48-1 ή E48-2",E49:"E49",E53:"E53-1 ή E53-2",E55:"E55-1 ή E55-2",
    E54:"E54-1 (PSH) ή E54-2 (PSL)",E56:"E56-1 ή E56-2",E58:"E58-1 ή E58-2",E59:"E59-1 ή E59-2",E61:"E61-1 ή E61-2",E63:"E63"};
  var NONE={E1:1,E2:1,E3:1,E5:1,E6:1,E7:1,E9:1,E10:1,E11:1,E12:1,E16:1,E18:1,E19:1,E20:1,E21:1,E28:1};
  if(!T.mhi_kx) return;
  T.mhi_kx.codes.forEach(function(c){ if(c[3]) return; var k=String(c[0][0]).toUpperCase();
    if(D[k]) c[3]="7-segment εξωτερικής: "+D[k]+" — MHI KX-SM-202 (KXZE1, EU), List of inspection displays.";
    else if(NONE[k]) c[3]="7-segment εξωτερικής: καμία ένδειξη (–) – βλάβη/ρύθμιση εσωτερικής ή χειριστηρίου. — MHI KX-SM-202 (KXZE1, EU).";
  });
})();

// ===== Gree οικιακά split: 3 λυχνίες πλακέτας εξωτερικής (Κίτρινο/Κόκκινο/Πράσινο) – συμπλήρωση =====
// Πηγή: Gree service manual GWH09QB-K6DNA1C/I (ευρωπαϊκό), 9.1 Error Code List «Display Method of Outdoor Unit (Only for the mode with this function)», σελ. 66–71 (διαβάστηκε από εικόνα).
// Αναλαμπή: OFF 3s και αναβοσβήνει N φορές (ON 0,5s / OFF 0,5s). Κανονικά: Πράσινο αναμμένο συνεχώς (επικοινωνία OK)· απόψυξη: Κίτρινο ×2.
(function(){
  var M={LP:"Κίτρινο LED × 16",F6:"Κόκκινο LED × 3",F8:"Κόκκινο LED × 1",F9:"Κόκκινο LED × 2",FH:"Κόκκινο LED × 4",L9:"Κίτρινο LED × 9"};
  var NONE={E1:1,EU:1,C5:1,F1:1,F2:1,P5:1,PU:1,P7:1,U1:1,U3:1,U5:1,U7:1,U8:1,H6:1,H7:1,LC:1};
  var tag=" — Gree GWH09QB-K6DNA1C/I (EU), μόνο σε εξωτερικές με λυχνίες (όχι 18K). Μορφή: σβηστό 3″ και N αναλαμπές.";
  if(!T.gree_split) return;
  T.gree_split.codes.forEach(function(c){ if(c[3]) return; var k=String(c[0][0]).toUpperCase();
    if(M[k]) c[3]=M[k]+tag; else if(NONE[k]) c[3]="Καμία ειδική ένδειξη στις λυχνίες εξωτερικής για αυτόν τον κωδικό (κενό στον πίνακα)"+tag; });
})();

// ===== Midea οικιακά/ελαφριά εμπορικά: οθόνη πλακέτας εξωτερικής (σε μοντέλα με οθόνη) =====
// Πηγή: Midea service manual SM_LC(GA)_R32_3D INV_EU_NB_2207 (ευρωπαϊκό), 2.2 Error Display (For Some Outdoor Units).
// Στους νέους κωδικούς Midea: H = κωδικός εσωτερικής, C = κωδικός εξωτερικής (Midea «Introduction of New Error Codes»).
(function(){
  var OUT={EC51:1,EL01:1,PC40:1,PC08:1,PC10:1,PC11:1,PC12:1,PC00:1,PC0F:1,EC71:1,EC72:1,EC07:1,PC43:1,PC44:1,PC45:1,PC46:1,PC49:1,PC30:1,PC31:1,PC0A:1,PC06:1,PH90:1,PH91:1,PC02:1,EC52:1,EC53:1,EC54:1,EC55:1,EC50:1,PC0L:1};
  if(!T.midea_split) return;
  T.midea_split.codes.forEach(function(c){ if(c[3]) return; var hit=null, indoor=false;
    c[0].forEach(function(x){ var k=String(x).toUpperCase().replace(/\s/g,""); if(OUT[k]) hit=hit||x; if(/^EH|^FH/.test(k)) indoor=true; });
    if(hit) c[3]="Οθόνη πλακέτας εξωτερικής (μόνο μοντέλα με οθόνη): δείχνει τον ίδιο κωδικό «"+String(hit).replace(/^(..)(..)$/,"$1 $2")+"». — Midea SM_LC R32 (EU), 2.2 Error Display (For Some Outdoor Units).";
    else if(indoor) c[3]="Κωδικός εσωτερικής (H): δεν περιλαμβάνεται στον πίνακα της οθόνης εξωτερικής – διάβασέ τον στην εσωτερική. — Midea SM_LC R32 (EU) 2.2 & «Introduction of New Error Codes» (H = εσωτερική, C = εξωτερική).";
  });
})();

// ===== Samsung οικιακά (σειρά AR**HSFNBWK NET/XET, 12/18/24K): 3 LED πλακέτας εξωτερικής (Κίτρινο / Πράσινο / Κόκκινο) =====
// Πηγή: Samsung service manual AR09HSFNBWKNET (ευρωπαϊκό), 3-2-1 Indoor Display Error (λίστα κωδικών) & «Outdoor LED Display Error and Check Method (12K/18K/24K)».
// Η αντιστοίχιση έγινε με την ίδια περιγραφή βλάβης στους δύο πίνακες του ίδιου manual. ● αναμμένο · ○ σβηστό · ◐ αναβοσβήνει.
(function(){
  var L = function(y,g,r){ var n={1:"αναμμένο",0:"σβηστό",2:"αναβοσβήνει"}; return "Κίτρινο "+n[y]+" · Πράσινο "+n[g]+" · Κόκκινο "+n[r]; };
  var M = {
    E101:L(0,1,1)+" (ή μόνο Κόκκινο αναμμένο)", E102:L(0,1,1)+" (ή μόνο Κόκκινο αναμμένο)",
    E203:L(2,1,1), E221:L(2,0,2), E231:L(2,1,2), E251:L(2,2,0), E416:L(2,0,1), E422:L(1,1,0),
    E440:L(1,2,0), E441:L(1,2,0), E458:L(1,0,0), E461:L(0,2,0), E462:L(1,2,1), E464:L(0,0,2),
    E465:L(2,1,0), E466:L(0,1,2), E467:L(1,0,1), E468:L(2,2,1), E469:L(1,2,2), E470:L(0,1,0),
    E471:L(1,0,2), E474:L(2,2,1), E483:L(0,1,2), E484:L(0,1,2), E485:L(2,2,1), E488:L(1,2,2),
    E500:L(2,1,0), E554:L(1,1,0)
  };
  var tag=" — Samsung σειρά AR**HSFNBWK (ευρωπαϊκά NET/XET, 12/18/24K). Κανονική λειτουργία: Κίτρινο σβηστό · Πράσινο αναβοσβήνει · Κόκκινο αναμμένο. Άλλες σειρές μπορεί να έχουν άλλο συνδυασμό.";
  if(T.samsung_all) T.samsung_all.codes.forEach(function(c){ if(c[3]) return; for(var i=0;i<c[0].length;i++){ var k=String(c[0][i]).toUpperCase(); if(M[k]){ c[3]=M[k]+tag; return; } } });
})();

// ===== Samsung σειρά AR**HSSDBWK (ευρωπαϊκά NEU/XEU): 3 LED πλακέτας εξωτερικής – δεύτερη σειρά =====
// Πηγή: Samsung service manual AR12HSSDBWKNEU, 3-2-1 Indoor Display Error (κωδικός ↔ περιγραφή) & «Outdoor LED Display Error and Check Method» (περιγραφή ↔ LED), σελ. 11–12.
// Αντιστοίχιση μόνο όπου η περιγραφή είναι ίδια στους δύο πίνακες. ● αναμμένο ○ σβηστό ◎ αναβοσβήνει.
(function(){
  var L=function(y,g,r){ var n={1:"αναμμένο",0:"σβηστό",2:"αναβοσβήνει"}; return "Κίτρινο "+n[y]+" · Πράσινο "+n[g]+" · Κόκκινο "+n[r]; };
  var M={E101:L(0,0,1)+" ή "+L(0,1,1)+" (ή μετά από 1′: "+L(2,1,1)+")",E102:L(0,0,1)+" ή "+L(0,1,1)+" (ή μετά από 1′: "+L(2,1,1)+")",
    E464:L(0,0,2),E461:L(0,2,0),E474:L(0,2,2),E500:L(0,2,2),E466:L(0,1,2),E483:L(0,1,2),E468:L(2,2,1),E485:L(2,2,1),E465:L(2,1,0),E467:L(1,0,1),E469:L(1,2,2)};
  var tag=" (κωδικός αντιστοιχίστηκε μέσω περιγραφής: το service manual δίνει τα LED ανά περιγραφή βλάβης, όχι ανά κωδικό – ταιριάξαμε μόνο ίδιες περιγραφές του ίδιου manual) — Samsung σειρά AR**HSSDBWK (EU). Κανονικά: Κίτρινο σβηστό · Πράσινο αναβοσβήνει · Κόκκινο αναμμένο.";
  if(!T.samsung_all) return;
  T.samsung_all.codes.forEach(function(c){ for(var i=0;i<c[0].length;i++){ var k=String(c[0][i]).toUpperCase(); if(M[k]){ c[3]=(c[3]?c[3]+" || ":"")+M[k]+tag; return; } } });
})();
