/**
 * ACSES Fitness Studio — enquiry lead capture (Google Apps Script Web App).
 *
 * Script Properties (Project Settings → Script properties):
 *   SPREADSHEET_ID   required  ID of the private lead spreadsheet
 *   SHEET_NAME       optional  defaults to "Leads"
 *   RATE_LIMIT_MAX   optional  max submissions per phone number per hour (default 3)
 *
 * Deploy: Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 * The /exec URL goes into the frontend env var VITE_LEAD_ENDPOINT.
 */

var HEADERS = [
  'Timestamp', 'Lead ID', 'Full Name', 'Phone', 'Email', 'Interested In', 'Preferred Contact',
  'Preferred Time', 'Message', 'Consent', 'Source Page', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Status',
];

// Keep in sync with src/content/services.ts (published titles) + "Not sure yet".
var ALLOWED_INTERESTS = [
  'Strength & Conditioning',
  'Personal Training',
  'Functional Fitness',
  'Mobility & Movement',
  'Nutrition Guidance',
  'Physiotherapy & Pain Management',
  'Not sure yet',
];
var ALLOWED_CONTACT = ['Phone', 'WhatsApp', 'Email'];
var ALLOWED_TIMES = ['', 'Morning (6am – 10am)', 'Midday (10am – 2pm)', 'Afternoon (2pm – 6pm)', 'Evening (6pm – 9pm)', 'Any time'];

var LIMITS = { fullName: 80, phone: 20, email: 120, message: 1000, sourcePage: 120, utm: 100 };
var MAX_BODY = 6000;

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents || e.postData.contents.length > MAX_BODY) {
      return fail_('Unable to submit enquiry.');
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return fail_('Unable to submit enquiry.');
    }
    if (!data || typeof data !== 'object') return fail_('Unable to submit enquiry.');

    // Bot trap: silently "succeed" so bots get no signal, but write nothing.
    if (str_(data.honeypot) !== '') return ok_('ACSES-' + dateStamp_() + '-000000');

    var lead = {
      fullName: str_(data.fullName),
      phone: str_(data.phone),
      email: str_(data.email),
      interestedIn: str_(data.interestedIn),
      preferredContact: str_(data.preferredContact),
      preferredTime: str_(data.preferredTime),
      message: str_(data.message),
      consent: data.consent === true,
      sourcePage: str_(data.sourcePage),
      utmSource: str_(data.utmSource),
      utmMedium: str_(data.utmMedium),
      utmCampaign: str_(data.utmCampaign),
    };

    var error = validate_(lead);
    if (error) return fail_(error);

    var props = PropertiesService.getScriptProperties();
    var sheetId = props.getProperty('SPREADSHEET_ID');
    if (!sheetId) return fail_('Unable to submit enquiry.');

    if (isRateLimited_(lead.phone, Number(props.getProperty('RATE_LIMIT_MAX')) || 3)) {
      return fail_('Too many enquiries from this number. Please try again later.');
    }

    var lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return fail_('Unable to submit enquiry. Please try again.');
    var leadId;
    try {
      var sheet = getSheet_(sheetId, props.getProperty('SHEET_NAME') || 'Leads');
      leadId = 'ACSES-' + dateStamp_() + '-' + randomId_(6);
      sheet.appendRow([
        new Date(), // server-side timestamp
        leadId,
        safe_(lead.fullName),
        safe_(lead.phone),
        safe_(lead.email),
        safe_(lead.interestedIn),
        safe_(lead.preferredContact),
        safe_(lead.preferredTime),
        safe_(lead.message),
        'Yes',
        safe_(lead.sourcePage),
        safe_(lead.utmSource),
        safe_(lead.utmMedium),
        safe_(lead.utmCampaign),
        'New',
      ]);
    } finally {
      lock.releaseLock();
    }
    return ok_(leadId);
  } catch (err) {
    // Log only the error type — never personal data.
    console.error('Lead submission failed: ' + (err && err.name ? err.name : 'Error'));
    return fail_('Unable to submit enquiry.');
  }
}

function doGet() {
  return json_({ ok: true, service: 'ACSES lead capture' });
}

// ---------------------------------------------------------------------------

function validate_(l) {
  if (l.fullName.length < 2 || l.fullName.length > LIMITS.fullName) return 'Please enter your full name.';
  var phone = l.phone.replace(/[\s\-().]/g, '');
  var indian = /^(\+91|91|0)?[6-9]\d{9}$/.test(phone);
  var intl = /^\+[1-9]\d{7,14}$/.test(phone);
  if (!(indian || intl) || l.phone.length > LIMITS.phone) return 'Please enter a valid phone number.';
  if (l.email && (l.email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(l.email))) return 'Please enter a valid email address.';
  if (ALLOWED_INTERESTS.indexOf(l.interestedIn) === -1) return 'Please choose a valid option.';
  if (ALLOWED_CONTACT.indexOf(l.preferredContact) === -1) return 'Please choose a contact method.';
  if (l.preferredContact === 'Email' && !l.email) return 'Please add an email address.';
  if (ALLOWED_TIMES.indexOf(l.preferredTime) === -1) return 'Please choose a valid time.';
  if (l.message.length > LIMITS.message) return 'Message is too long.';
  if (!l.consent) return 'Consent is required.';
  if (l.sourcePage.length > LIMITS.sourcePage || l.sourcePage.charAt(0) !== '/') l.sourcePage = '';
  ['utmSource', 'utmMedium', 'utmCampaign'].forEach(function (k) {
    l[k] = l[k].slice(0, LIMITS.utm);
  });
  return null;
}

/** Simple per-phone rate limit using the script cache (1 hour window). */
function isRateLimited_(phone, max) {
  var cache = CacheService.getScriptCache();
  var key = 'rl_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, phone.replace(/\D/g, '')));
  var count = Number(cache.get(key) || 0);
  if (count >= max) return true;
  cache.put(key, String(count + 1), 3600);
  return false;
}

function getSheet_(id, name) {
  var ss = SpreadsheetApp.openById(id);
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Trim, strip control chars. */
function str_(v) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

/** Neutralise spreadsheet formula injection (=, +, -, @, tab, CR). */
function safe_(v) {
  var s = String(v);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function dateStamp_() {
  return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyyMMdd');
}

function randomId_(n) {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var out = '';
  for (var i = 0; i < n; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
}

function ok_(leadId) {
  return json_({ ok: true, leadId: leadId });
}

function fail_(message) {
  return json_({ ok: false, message: message });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to create the Leads tab + headers and test permissions. */
function setup() {
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Set the SPREADSHEET_ID script property first.');
  getSheet_(id, PropertiesService.getScriptProperties().getProperty('SHEET_NAME') || 'Leads');
}
