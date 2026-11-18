// Βλαβολόγιο Κλιματισμού – ιδιωτική αποθήκευση αναφορών τεχνικών
// Δέχεται αναφορές (POST, text/plain) και δίνει τη λίστα μόνο με το PIN του ιδιοκτήτη.
var SHEET_NAME = 'Αναφορές';
var OLD_SHEET_ID = '1g4K_Ma62cAzZPtMqHo_j9a1MbOHJdeduXwR1lwe3488'; // παλιές αναφορές (Google Form)
var MAX_LEN = 50000;          // μέγιστο μέγεθος μίας αποστολής
var MAX_PER_10MIN = 80;       // όριο αποστολών ανά 10 λεπτά (προστασία από spam)

function sh_() {
  var ss = SpreadsheetApp.getActive();
  var s = ss.getSheetByName(SHEET_NAME);
  if (!s) { s = ss.insertSheet(SHEET_NAME, 0); s.appendRow(['Χρονική σήμανση', 'Αναφορά']); }
  return s;
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function hash_(s) {
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'vl:' + s, Utilities.Charset.UTF_8));
}
function count_(key, ttl) {
  var c = CacheService.getScriptCache(), n = +(c.get(key) || 0) + 1;
  c.put(key, String(n), ttl);
  return n;
}

function doPost(e) {
  var t = String((e && e.postData && e.postData.contents) || '');
  if (t.indexOf('VLADMIN|') === 0) return list_(t.slice(8));
  if (!t || t.length > MAX_LEN || !(t.indexOf('Βλαβολόγιο') === 0 || t.indexOf('VLPHOTO|') === 0)) return out_({ ok: false });
  if (count_('n' + Math.floor(Date.now() / 600000), 900) > MAX_PER_10MIN) return out_({ ok: false, err: 'rate' });
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try { sh_().appendRow([new Date(), t]); } finally { lock.releaseLock(); }
  return out_({ ok: true });
}

function list_(pin) {
  pin = String(pin || '');
  if (count_('p' + Math.floor(Date.now() / 600000), 900) > 20) return out_({ ok: false, err: 'rate' });
  if (pin.length < 4) return out_({ ok: false, err: 'pin' });
  var props = PropertiesService.getScriptProperties(), h = props.getProperty('PINHASH');
  if (!h) { h = hash_(pin); props.setProperty('PINHASH', h); }   // η πρώτη χρήση ορίζει το PIN
  if (hash_(pin) !== h) { Utilities.sleep(1500); return out_({ ok: false, err: 'pin' }); }
  var tz = Session.getScriptTimeZone(), rows = [];
  function add(vals) {
    vals.slice(1).forEach(function (r) {
      if (r[1]) rows.push([r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'dd/MM/yyyy HH:mm:ss') : String(r[0]), String(r[1])]);
    });
  }
  try { add(SpreadsheetApp.openById(OLD_SHEET_ID).getSheets()[0].getDataRange().getValues()); } catch (x) {}
  add(sh_().getDataRange().getValues());
  return out_({ ok: true, rows: rows });
}

function doGet() { return out_({ ok: true, app: 'vlavologio' }); }

// Τρέξε μία φορά από τον editor για να δημιουργηθεί το φύλλο και να δοθεί η άδεια.
function setup() { sh_(); SpreadsheetApp.getActive().rename('Βλαβολόγιο – Αναφορές (ιδιωτικό)'); }
