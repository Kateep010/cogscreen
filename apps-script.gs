// 腦力快篩 → Google 試算表 後端。貼到 Apps Script 後部署為「網頁應用程式」。
const SHEET_NAME = 'records';
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(['json']); }
  return sh;
}
function doPost(e) {
  try {
    const rec = JSON.parse(e.postData.contents);
    sheet_().appendRow([JSON.stringify(rec), new Date(), rec.name || '', rec.vname || '', rec.score, rec.total, rec.band || '', rec.prob]);
    return out_({ ok: true });
  } catch (err) { return out_({ ok: false, error: String(err) }); }
}
function doGet(e) {
  const rows = sheet_().getDataRange().getValues().slice(1);
  const list = rows.map(r => { try { return JSON.parse(r[0]); } catch (_) { return null; } }).filter(Boolean);
  return out_(list);
}
function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
