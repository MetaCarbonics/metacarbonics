/**
 * ClimaLink Google Workspace provisioning bridge.
 * Install in the BD spreadsheet as a bound Apps Script. Update tab names only
 * after the administrator confirms the existing workbook schema.
 */
const CL_CONFIG = {
  spreadsheetId: '1zDz0ZLTF4XSNE8rvFbbSgZzfZlrDgBnjEmRZGB0cjAw',
  rootFolderId: '1oUQIKoOAz7tcNxzNLICNxyYSHv77gT0e',
  tabs: {tickets:'Ticket Register', leads:'Leads', team:'Team Access', folders:'Folder Manifest', logs:'Audit Log'}
};

function workbook_() { return SpreadsheetApp.openById(CL_CONFIG.spreadsheetId); }

function onOpen() {
  SpreadsheetApp.getUi().createMenu('ClimaLink Admin')
    .addItem('Provision selected ticket', 'provisionSelectedTicket')
    .addItem('Validate workspace', 'validateWorkspace')
    .addToUi();
}

function validateWorkspace() {
  const ss = workbook_();
  const missing = Object.values(CL_CONFIG.tabs).filter(n => !ss.getSheetByName(n));
  if (missing.length) throw new Error('Missing required tabs: ' + missing.join(', '));
  DriveApp.getFolderById(CL_CONFIG.rootFolderId).getName();
  SpreadsheetApp.getUi().alert('ClimaLink workspace is valid.');
}

function provisionSelectedTicket() {
  const ss = workbook_(), ticketSheet = ss.getSheetByName(CL_CONFIG.tabs.tickets);
  if (!ticketSheet) throw new Error('Ticket Register tab is missing.');
  const row = ticketSheet.getActiveRange().getRow();
  if (row < 2) throw new Error('Select a ticket data row.');
  const values = ticketSheet.getRange(row, 1, 1, ticketSheet.getLastColumn()).getValues()[0];
  const headers = ticketSheet.getRange(1, 1, 1, ticketSheet.getLastColumn()).getValues()[0];
  const record = Object.fromEntries(headers.map((h, i) => [String(h).trim(), values[i]]));
  const ticketId = record.Ticket_ID, project = record.Project_Name || record.Organisation || 'Project';
  const type = record.Relationship_Type || 'Unclassified', activity = record.Activity || 'Activity Pending';
  if (!ticketId) throw new Error('Ticket_ID is required.');
  const lock = LockService.getDocumentLock(); lock.waitLock(30000);
  try {
    const root = DriveApp.getFolderById(CL_CONFIG.rootFolderId);
    const typeFolder = getOrCreateFolder_(root, safe_(type));
    const projectFolder = getOrCreateFolder_(typeFolder, safe_(ticketId + ' - ' + project + ' - ' + activity));
    const children = ['01 Intake and KYC','02 Due Diligence','03 Contracts and Rights','04 Project Design','05 MRV and Evidence','06 Finance and Payments','07 Commercial and Registry','08 Team Working','09 External Sharing','99 Logs and Audit'];
    children.forEach((name, i) => {
      const folder = getOrCreateFolder_(projectFolder, name);
      append_(CL_CONFIG.tabs.folders, [new Date(), ticketId, i + 1, name, folder.getUrl(), 'Created']);
    });
    grantTeamAccess_(ticketId, projectFolder);
    append_(CL_CONFIG.tabs.logs, [new Date(), ticketId, 'Workspace provisioned', Session.getActiveUser().getEmail(), projectFolder.getUrl(), 'Success']);
    writeBack_(ticketSheet, row, headers, 'Drive_Folder_URL', projectFolder.getUrl());
    writeBack_(ticketSheet, row, headers, 'Provisioning_Status', 'Provisioned');
    SpreadsheetApp.getUi().alert('Workspace created and access applied.');
  } finally { lock.releaseLock(); }
}

function grantTeamAccess_(ticketId, folder) {
  const sheet = workbook_().getSheetByName(CL_CONFIG.tabs.team);
  if (!sheet || sheet.getLastRow() < 2) return;
  const data = sheet.getDataRange().getValues(), h = data.shift(), col = n => h.indexOf(n);
  data.filter(r => String(r[col('Ticket_ID')]) === String(ticketId)).forEach(r => {
    const email = String(r[col('email')] || r[col('Email')] || '').trim();
    const access = String(r[col('access')] || r[col('Access')] || 'Viewer');
    if (!email) return;
    if (access === 'Editor') folder.addEditor(email); else folder.addViewer(email);
    append_(CL_CONFIG.tabs.logs, [new Date(), ticketId, 'Access granted', Session.getActiveUser().getEmail(), email, access]);
  });
}

function getOrCreateFolder_(parent, name) {
  const found = parent.getFoldersByName(name);
  return found.hasNext() ? found.next() : parent.createFolder(name);
}
function safe_(value) { return String(value).replace(/[\\/:*?"<>|#%{}~&]/g, '-').substring(0, 120); }
function append_(tab, row) {
  const ss = workbook_(), sheet = ss.getSheetByName(tab) || ss.insertSheet(tab);
  sheet.appendRow(row);
}
function writeBack_(sheet, row, headers, name, value) {
  let col = headers.indexOf(name) + 1;
  if (!col) { col = headers.length + 1; sheet.getRange(1, col).setValue(name); headers.push(name); }
  sheet.getRange(row, col).setValue(value);
}

/** Receives ClimaLink lead submissions from the static website. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action !== 'createLead') throw new Error('Unsupported action.');
    const lead = body.lead || {};
    ['Lead_ID', 'organisation', 'contact', 'email', 'scope'].forEach(function (key) {
      if (!String(lead[key] || '').trim()) throw new Error('Missing required field: ' + key);
    });
    lock.waitLock(30000);
    appendObject_(CL_CONFIG.tabs.leads, {
      Lead_ID: lead.Lead_ID, Created_At: lead.Created_At || new Date(),
      Status: lead.Status || 'Project Lead review', Organisation: lead.organisation,
      Primary_Contact: lead.contact, Business_Email: lead.email, Phone: lead.phone || '',
      Relationship_Type: lead.relationship || '', Sectoral_Scope: lead.scope,
      Activity: lead.activity || 'Activity pending', Country: lead.country || '',
      Indicative_Scale: lead.scale || '', Source: lead.source || '', Registry: lead.registry || '',
      Risk_Rating: lead.risk || '', Commercial_Context: lead.context || '',
      Completed_Checks: Object.keys(lead.checks || {}).filter(function (k) { return lead.checks[k]; }).length,
      Data_Source: 'ClimaLink web intake'
    });
    appendObject_(CL_CONFIG.tabs.logs, {
      Timestamp: new Date(), Record_ID: lead.Lead_ID, Action: 'Lead created from website',
      Actor: lead.email, Detail: lead.organisation, Status: 'Success'
    });
    return json_({ok:true, leadId:lead.Lead_ID});
  } catch (err) {
    return json_({ok:false, error:String(err && err.message || err)});
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function appendObject_(tab, record) {
  const ss = workbook_(), sheet = ss.getSheetByName(tab) || ss.insertSheet(tab);
  let headers = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String) : [];
  if (!headers.length || headers.every(function (h) { return !h.trim(); })) {
    headers = Object.keys(record); sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  Object.keys(record).forEach(function (name) {
    if (headers.indexOf(name) === -1) { headers.push(name); sheet.getRange(1, headers.length).setValue(name); }
  });
  sheet.appendRow(headers.map(function (name) {
    return Object.prototype.hasOwnProperty.call(record, name) ? sheetSafe_(record[name]) : '';
  }));
}

function sheetSafe_(value) {
  if (typeof value !== 'string') return value;
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
