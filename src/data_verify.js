// Ετικέτες προέλευσης: κωδικοί που ΔΕΝ έχουν επιβεβαιωθεί ακόμα σε manual ευρωπαϊκού/ελληνικού μοντέλου.
// Μένουν στην εφαρμογή με ετικέτα μέχρι να βρεθεί ευρωπαϊκή/ελληνική πηγή.
var VN_ASIA_PAN = "Πηγή: επίσημη σελίδα Panasonic για Ασία. Δεν υπάρχει στους πίνακες κωδικών 3 ευρωπαϊκών service manual (CS-NZ25YKE, CS-BZ/UZ…ZKE 2022, CS-Z…UD3EAW αεραγωγού) – αφορά λειτουργίες που δεν έχουν τα μοντέλα Ευρώπης (πισίνα, αερισμός, ακροφύσια κ.λπ.).";
var VN_H26 = "Στα ευρωπαϊκά service manual εμφανίζεται μόνο στον πίνακα «προσωρινής λειτουργίας» (CS-BZ…ZKE 2022), όχι στον πίνακα κωδικών – η περιγραφή είναι από την επίσημη σελίδα Panasonic για Ασία.";
var VN_US = "Πηγή: manual μοντέλου για ΗΠΑ. Δεν έχει επιβεβαιωθεί ακόμα σε ευρωπαϊκό/ελληνικό μοντέλο.";
var VN_LEAK = "Πηγή: manual μοντέλου για ΗΠΑ. Ελέγχθηκε και το ευρωπαϊκό Midea service manual επιδαπέδιου R32 (MFM-48/55, 2024): δεν έχει αυτούς τους κωδικούς – βγαίνουν μόνο σε μονάδες με αισθητήρα διαρροής R32 (μεγάλη γόμωση), που στην Ευρώπη μπαίνουν σταδιακά.";
var VERIF = {
  panasonic_split: { H17:VN_ASIA_PAN, H26:VN_H26, H31:VN_ASIA_PAN, H50:VN_ASIA_PAN, H51:VN_ASIA_PAN, H52:VN_ASIA_PAN, H71:VN_ASIA_PAN, H72:VN_ASIA_PAN, H79:VN_ASIA_PAN },
  fujitsu_all: { A8:VN_US, "45":VN_US },
  midea_split: { EHC1:VN_LEAK, EHC2:VN_LEAK, EHC3:VN_LEAK, ECC1:VN_LEAK, FHCC:VN_LEAK },
  gree_split: { EA:"Πηγή: service manuals Gree για ΗΠΑ (κονσόλα, slim duct, A-coil). Δεν έχει επιβεβαιωθεί ακόμα σε ευρωπαϊκό/ελληνικό μοντέλο.", FE:"Πηγή: service manuals Gree για ΗΠΑ (κονσόλα, slim duct, A-coil). Δεν έχει επιβεβαιωθεί ακόμα σε ευρωπαϊκό/ελληνικό μοντέλο." }
};
function verifNote(tkey, codes){ var m = VERIF[tkey]; if(!m) return ""; for(var i=0;i<codes.length;i++){ var k=String(codes[i]).toUpperCase(); if(m[k]) return m[k]; } return ""; }
// Σημείωση σε επίπεδο πίνακα (όταν η πηγή είναι γενική, όχι ειδικά για Ευρώπη)
var VERIF_T = {
  // aux_split: διασταυρώθηκε 18/11/2026 με το ευρωπαϊκό AUX Free Match R32 service manual (ίδιοι κωδικοί WM) – η σημείωση αφαιρέθηκε
};
