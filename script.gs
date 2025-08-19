
/**
 * Google Apps Script WebApp to receive cart data and append to Google Sheet,
 * then export the spreadsheet as Excel into Google Drive.
 * Deploy: New project -> paste code -> set YOUR_SHEET_ID -> deploy as Web app (exec).
 */

/** UPDATE WITH YOUR SHEET ID */
const SPREADSHEET_ID = 'YOUR_SHEET_ID';
const SHEET_NAME = 'Orders';

/**
 * Handle POST requests with cart JSON.
 * Expects array of items: [{code,name,price,qty}]
 */
function doPost(e){
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if(!sheet){
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp','Code','Name','Qty','Unit Price','Total']);
  }
  const data = JSON.parse(e.postData.contents);
  data.forEach(item=>{
    sheet.appendRow([new Date(), item.code, item.name, item.qty, item.price, item.qty*item.price]);
  });
  // Optional: export to Excel on each submission
  exportToExcel(ss);
  return ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Export given spreadsheet to Excel and save in Drive.
 */
function exportToExcel(ss){
  const url = 'https://docs.google.com/feeds/download/spreadsheets/Export?key='
      + ss.getId() + '&exportFormat=xlsx';
  const token = ScriptApp.getOAuthToken();
  const response = UrlFetchApp.fetch(url, {
    headers: { 'Authorization': 'Bearer ' +  token }
  });
  const blob = response.getBlob().setName(ss.getName() + '.xlsx');
  // Save file in same Drive folder
  DriveApp.createFile(blob);
}
