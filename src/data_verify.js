// Ετικέτες προέλευσης: κωδικοί που ΔΕΝ έχουν επιβεβαιωθεί ακόμα σε manual ευρωπαϊκού/ελληνικού μοντέλου.
// Μένουν στην εφαρμογή με ετικέτα μέχρι να βρεθεί ευρωπαϊκή/ελληνική πηγή.
var VN_ASIA_PAN = "Πηγή: επίσημη σελίδα Panasonic για Ασία. Δεν υπάρχει στον πίνακα του ευρωπαϊκού service manual (π.χ. CS-NZ25YKE) – μπορεί να μη βγαίνει σε μοντέλα Ελλάδας.";
var VN_US = "Πηγή: manual μοντέλου για ΗΠΑ. Δεν έχει επιβεβαιωθεί ακόμα σε ευρωπαϊκό/ελληνικό μοντέλο.";
var VERIF = {
  panasonic_split: { H17:VN_ASIA_PAN, H26:VN_ASIA_PAN, H31:VN_ASIA_PAN, H35:VN_ASIA_PAN, H50:VN_ASIA_PAN, H51:VN_ASIA_PAN, H52:VN_ASIA_PAN, H71:VN_ASIA_PAN, H72:VN_ASIA_PAN, H79:VN_ASIA_PAN },
  fujitsu_all: { A8:VN_US, "45":VN_US },
  midea_split: { EHC1:VN_US, EHC2:VN_US, EHC3:VN_US, ECC1:VN_US, FHCC:VN_US },
  gree_split: { EA:"Πηγή: service manuals Gree για ΗΠΑ (κονσόλα, slim duct, A-coil). Δεν έχει επιβεβαιωθεί ακόμα σε ευρωπαϊκό/ελληνικό μοντέλο.", FE:"Πηγή: service manuals Gree για ΗΠΑ (κονσόλα, slim duct, A-coil). Δεν έχει επιβεβαιωθεί ακόμα σε ευρωπαϊκό/ελληνικό μοντέλο." }
};
function verifNote(tkey, codes){ var m = VERIF[tkey]; if(!m) return ""; for(var i=0;i<codes.length;i++){ var k=String(codes[i]).toUpperCase(); if(m[k]) return m[k]; } return ""; }
