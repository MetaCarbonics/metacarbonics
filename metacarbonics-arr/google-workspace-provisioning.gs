/**
 * ClimaLink Google Workspace provisioning bridge.
 * Install in the BD spreadsheet as a bound Apps Script. Update tab names only
 * after the administrator confirms the existing workbook schema.
 */
const CL_CONFIG = {
  supabaseUrl: 'https://trytdfqeokraxklxygnc.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXAiLCJyZWYiOiJ0cnl0ZGZxZW9rcmF4a2x4eWduYyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcxNTk1MjA3LCJleHAiOjIwODcxNzEyMDd9.wnDUZjmG1X84ayGgiyyON32nsQ8KAA_gnASkVLPw1ww',
  spreadsheetId: '1zDz0ZLTF4XSNE8rvFbbSgZzfZlrDgBnjEmRZGB0cjAw',
  rootFolderId: '1oUQIKoOAz7tcNxzNLICNxyYSHv77gT0e',
  tabs: {tickets:'Ticket Register', signals:'Sourcing Signals', leads:'Leads', opportunities:'Opportunities', projects:'Project Master', lineage:'Project Lineage', users:'Users & Roles', permissions:'Role Permissions', access:'Record Access', documents:'Document Index', notifications:'Notifications', team:'Team Access', folders:'Folder Manifest', logs:'Audit Log'}
};

const CL_HEADERS = {
  'Project Master':['Project_ID','Opportunity_ID','Project_Name','Activity','Registry','Methodology','Country','Project_Manager','Status','Crediting_Start','Crediting_End','Root_Folder_URL','Created_At'],
  'Users & Roles':['User_Email','Full_Name','Role','Organisation','Status','Auth_Provider','Last_Updated'],
  'Role Permissions':['Role','View','Can_Read','Can_Create','Can_Edit','Can_Approve','Data_Scope'],
  'Record Access':['User_Email','Record_Type','Record_ID','Access_Level','Granted_By','Granted_At','Expires_At','Status'],
  'Document Index':['Document_ID','Project_ID','Document_Type','File_Name','Drive_URL','Version','Visibility','Owner','Status','Updated_At'],
  'Notifications':['Notification_ID','Record_ID','Milestone','Recipient_Email','Recipient_Role','Subject','Status','Sent_At'],
  'Team Access':['Ticket_ID','Project_ID','Name','Email','Role','Access','Permission_Status'],
  'Folder Manifest':['Timestamp','Record_ID','Sequence','Folder_Name','Folder_URL','Status'],
  'Audit Log':['Timestamp','Record_ID','Action','Actor','Detail','Status']
};

function workbook_() { return SpreadsheetApp.openById(CL_CONFIG.spreadsheetId); }

function onOpen() {
  SpreadsheetApp.getUi().createMenu('ClimaLink Admin')
    .addItem('Create / repair control tabs', 'setupProductionWorkspace')
    .addItem('Provision selected ticket', 'provisionSelectedTicket')
    .addItem('Validate workspace', 'validateWorkspace')
    .addToUi();
}

function setupProductionWorkspace() {
  const ss=workbook_();
  Object.keys(CL_HEADERS).forEach(function(name){
    let sh=ss.getSheetByName(name); if(!sh) sh=ss.insertSheet(name);
    const headers=CL_HEADERS[name];
    if(sh.getLastRow()===0 || !String(sh.getRange(1,1).getValue()).trim()) sh.getRange(1,1,1,headers.length).setValues([headers]);
    else headers.forEach(function(h){const existing=sh.getRange(1,1,1,Math.max(sh.getLastColumn(),1)).getValues()[0].map(String);if(existing.indexOf(h)<0)sh.getRange(1,sh.getLastColumn()+1).setValue(h)});
    sh.setFrozenRows(1);sh.getRange(1,1,1,sh.getLastColumn()).setFontWeight('bold').setBackground('#e8eee9');sh.autoResizeColumns(1,Math.min(sh.getLastColumn(),12));
  });
  seedRoles_();
  return {ok:true,spreadsheetUrl:ss.getUrl()};
}

function seedRoles_(){
  const users=[['admin@metacarbonics.com','System Administrator','admin','MetaCarbonics'],['bd@metacarbonics.com','BD Manager','bd','MetaCarbonics'],['projectlead@metacarbonics.com','Project Lead','projectlead','MetaCarbonics'],['projectmanager@metacarbonics.com','Project Manager','manager','MetaCarbonics'],['projectdeveloper@metacarbonics.com','Project Developer','developer','MetaCarbonics'],['operations@metacarbonics.com','Operations Lead','operations','MetaCarbonics'],['finance@metacarbonics.com','Finance Controller','finance','MetaCarbonics'],['ceo@metacarbonics.com','Chief Executive Officer','ceo','MetaCarbonics'],['farmer.demo@metacarbonics.com','Demo Farmer','farmer','Tripura Farmer Group'],['buyer.demo@metacarbonics.com','Buyer Representative','buyer','GreenFuture Foods'],['investor.demo@metacarbonics.com','Investor Representative','investor','Terra Climate Fund']];
  const sh=workbook_().getSheetByName(CL_CONFIG.tabs.users);if(sh.getLastRow()<2)users.forEach(function(u){sh.appendRow(u.concat(['Active','Pilot browser auth → production IdP',new Date()]))});
  const views={admin:'All records and administration',bd:'Signals; Leads; Accounts; Opportunities',projectlead:'Assigned leads and opportunities',manager:'Assigned projects and POM',developer:'Assigned project technical workspace',operations:'Transferred projects and delivery',finance:'Budgets; receipts; revenue; payments',ceo:'Executive portfolio and approvals',farmer:'Own plots; actions; payments',buyer:'Released procurement projects',investor:'Released investment projects'};
  const ps=workbook_().getSheetByName(CL_CONFIG.tabs.permissions);if(ps.getLastRow()<2)Object.keys(views).forEach(function(r){ps.appendRow([r,views[r],'Yes',/admin|bd|projectlead|manager|developer|operations|finance/.test(r)?'Yes':'No',r==='admin'?'Yes':'Scoped',/admin|manager|finance|ceo/.test(r)?'Yes':'No',r==='admin'?'Global':r==='bd'?'Internal BD':'Assigned records only'])});
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
    if (body.action === 'syncRecord') {
      const actor = authenticateSupabaseUser_(body.accessToken);
      const record = body.record || {}, definition = syncDefinition_(body.recordType);
      if (!definition) throw new Error('Unsupported record type.');
      if (!String(record[definition.key] || '').trim()) throw new Error('Record ID is required.');
      lock.waitLock(30000);
      const result = upsertObject_(definition.tab, definition.key, record);
      appendObject_(CL_CONFIG.tabs.logs, {Timestamp:new Date(), Record_ID:record[definition.key], Action:'Realtime Sheet '+result.action, Actor:actor.email, Detail:definition.tab, Status:'Success'});
      return json_({ok:true, recordId:record[definition.key], sheet:definition.tab, action:result.action});
    }
    if (body.action === 'archiveFolder') {
      const folderId=String(body.folderId||'');if(!folderId)throw new Error('folderId is required.');
      lock.waitLock(30000);const folder=DriveApp.getFolderById(folderId),name=folder.getName();folder.setTrashed(true);
      appendObject_(CL_CONFIG.tabs.logs,{Timestamp:new Date(),Record_ID:body.recordId||folderId,Action:'Previous project folder moved to trash',Actor:Session.getActiveUser().getEmail(),Detail:name,Status:'Success'});
      return json_({ok:true,folderId:folderId,status:'trashed'});
    }
    if (body.action === 'setupWorkspace') { lock.waitLock(30000); return json_(setupProductionWorkspace()); }
    if (body.action === 'provisionProject') { lock.waitLock(30000); return json_(provisionProject_(body.project || {})); }
    if (body.action === 'createSignal') {
      const signal = body.signal || {};
      ['Signal_ID', 'Account', 'Lead_Source', 'Source_Document', 'Identified_By', 'Trigger'].forEach(function (key) {
        if (!String(signal[key] || '').trim()) throw new Error('Missing required field: ' + key);
      });
      lock.waitLock(30000);
      appendObject_(CL_CONFIG.tabs.signals, signal);
      appendObject_(CL_CONFIG.tabs.logs, {Timestamp:new Date(), Record_ID:signal.Signal_ID, Action:'Sourcing signal created', Actor:signal.Identified_By, Detail:signal.Account, Status:'Success'});
      return json_({ok:true, signalId:signal.Signal_ID});
    }
    if (body.action === 'convertLead') {
      const conversion = body.conversion || {};
      if (!conversion.Lead_ID || !conversion.Opportunity_ID || !(conversion.Checks || []).every(Boolean)) throw new Error('All conversion gates are required.');
      lock.waitLock(30000);
      appendObject_(CL_CONFIG.tabs.opportunities, conversion);
      appendObject_(CL_CONFIG.tabs.lineage, {Timestamp:new Date(), Signal_ID:conversion.Signal_ID || '', Lead_ID:conversion.Lead_ID, Opportunity_ID:conversion.Opportunity_ID, Project_ID:'Pending', Action:'Lead qualified and converted'});
      appendObject_(CL_CONFIG.tabs.logs, {Timestamp:new Date(), Record_ID:conversion.Opportunity_ID, Action:'Lead converted to opportunity', Actor:conversion.Converted_By || '', Detail:conversion.Lead_ID, Status:'Success'});
      return json_({ok:true, opportunityId:conversion.Opportunity_ID});
    }
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

function authenticateSupabaseUser_(accessToken) {
  const token=String(accessToken||'').trim();
  if(!token) throw new Error('Authentication required.');
  const response=UrlFetchApp.fetch(CL_CONFIG.supabaseUrl+'/auth/v1/user',{method:'get',muteHttpExceptions:true,headers:{apikey:CL_CONFIG.supabaseAnonKey,Authorization:'Bearer '+token}});
  if(response.getResponseCode()!==200) throw new Error('Invalid or expired session.');
  const user=JSON.parse(response.getContentText()||'{}');
  if(!user.id||!user.email) throw new Error('Authenticated user not found.');
  return user;
}

/** Run once from the Apps Script editor to authorize outbound Supabase validation. */
function authorizeClimaLinkSync() {
  const response=UrlFetchApp.fetch(CL_CONFIG.supabaseUrl+'/auth/v1/health',{muteHttpExceptions:true,headers:{apikey:CL_CONFIG.supabaseAnonKey}});
  if(response.getResponseCode()>=400) throw new Error('Supabase authorization check failed.');
  return 'ClimaLink sync authorization is healthy.';
}

function syncDefinition_(recordType) {
  return {signal:{tab:CL_CONFIG.tabs.signals,key:'Signal_ID'},lead:{tab:CL_CONFIG.tabs.leads,key:'Lead_ID'},opportunity:{tab:CL_CONFIG.tabs.opportunities,key:'Opportunity_ID'},project:{tab:CL_CONFIG.tabs.projects,key:'Project_ID'}}[String(recordType||'').toLowerCase()]||null;
}

function provisionProject_(p){
  ['Project_ID','Opportunity_ID','Project_Name','Activity'].forEach(function(k){if(!String(p[k]||'').trim())throw new Error('Missing required field: '+k)});
  setupProductionWorkspace();
  const root=DriveApp.getFolderById(CL_CONFIG.rootFolderId);
  const path=[p.Vertical||'Carbon Markets',p.Service||'Carbon Asset Development',p.Sector||'AFOLU',p.Scope||'ARR',p.Registry||'Verra',p.Standard||'VCS',p.Methodology||'VM0047'];
  let parent=root;path.forEach(function(name){parent=getOrCreateFolder_(parent,safe_(name))});
  const projectFolder=getOrCreateFolder_(parent,safe_(p.Project_ID+' - '+p.Project_Name));
  const children=['00 PROJECT CONTROL','01 PROJECT PROGRAMME DESIGN','02 GROUPED ELIGIBILITY','03 ACTIVITY INSTANCE REGISTER','04 ACTIVITY INSTANCE BATCHES','05 IMPLEMENTATION ASSETS','06 SHARED TECHNICAL','07 GIS REMOTE SENSING','08 QUANTIFICATION ERR','09 MRV','10 SAFEGUARDS RISK','11 VALIDATION REGISTRATION','12 MONITORING VERIFICATION','13 ISSUANCE REGISTRY','14 COMMERCIAL REFERENCE','15 REPORTING','98 SUPERSEDED','99 ARCHIVE'];
  children.forEach(function(name,i){const f=getOrCreateFolder_(projectFolder,name);appendObject_(CL_CONFIG.tabs.folders,{Folder_Record_ID:'FLD-'+p.Project_ID+'-'+('0'+(i+1)).slice(-2),Ticket_ID:p.Ticket_ID||p.Project_ID,Sequence:i+1,Relative_Path:name,Folder_URL:f.getUrl(),Status:'Active'})});
  const instanceRoot=getOrCreateFolder_(getOrCreateFolder_(projectFolder,'03 ACTIVITY INSTANCE REGISTER'),'PAI-001 - Initial Validation Batch');
  ['00 INSTANCE CONTROL','01 ELIGIBILITY','02 BOUNDARY GIS','03 IMPLEMENTATION','04 PARTICIPANTS','05 LAND ASSETS','06 AGREEMENTS CARBON RIGHTS','07 BASELINE','08 ADDITIONALITY','09 MONITORING','10 QUANTIFICATION','11 SAFEGUARDS','12 RISK','13 VVB REVIEW','14 REGISTRY INCLUSION','15 CREDIT ATTRIBUTION'].forEach(function(name){getOrCreateFolder_(instanceRoot,name)});
  appendObject_(CL_CONFIG.tabs.projects,{Project_ID:p.Project_ID,Opportunity_ID:p.Opportunity_ID,Project_Name:p.Project_Name,Activity:p.Activity,Registry:p.Registry||'Verra VCS',Methodology:p.Methodology||'',Country:p.Country||'India',Project_Manager:p.Project_Manager||'',Status:p.Status||'Initiation',Crediting_Start:p.Crediting_Start||'',Crediting_End:p.Crediting_End||'',Root_Folder_URL:projectFolder.getUrl(),Created_At:new Date()});
  (p.Team||[]).forEach(function(m){appendObject_(CL_CONFIG.tabs.team,{Ticket_ID:p.Ticket_ID||'',Project_ID:p.Project_ID,Name:m.name||'',Email:m.email||'',Role:m.role||'',Access:m.access||'Viewer',Permission_Status:'Approved'});appendObject_(CL_CONFIG.tabs.access,{User_Email:m.email||'',Record_Type:'Project',Record_ID:p.Project_ID,Access_Level:m.access||'Viewer',Granted_By:Session.getActiveUser().getEmail(),Granted_At:new Date(),Expires_At:'',Status:'Active'});if(m.email){if(m.access==='Editor')projectFolder.addEditor(m.email);else projectFolder.addViewer(m.email)}});
  appendObject_(CL_CONFIG.tabs.lineage,{Timestamp:new Date(),Signal_ID:p.Signal_ID||'',Lead_ID:p.Lead_ID||'',Opportunity_ID:p.Opportunity_ID,Project_ID:p.Project_ID,Action:'Opportunity converted to project and workspace provisioned'});
  appendObject_(CL_CONFIG.tabs.logs,{Timestamp:new Date(),Record_ID:p.Project_ID,Action:'Project workspace provisioned',Actor:Session.getActiveUser().getEmail(),Detail:projectFolder.getUrl(),Status:'Success'});
  return {ok:true,projectId:p.Project_ID,folderUrl:projectFolder.getUrl(),sheetUrl:workbook_().getUrl()};
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

function upsertObject_(tab, keyName, record) {
  const ss=workbook_(), sheet=ss.getSheetByName(tab)||ss.insertSheet(tab);
  let headers=sheet.getLastColumn()?sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0].map(String):[];
  if(!headers.length||headers.every(function(h){return !h.trim()})){headers=Object.keys(record);sheet.getRange(1,1,1,headers.length).setValues([headers]);}
  Object.keys(record).forEach(function(name){if(headers.indexOf(name)===-1){headers.push(name);sheet.getRange(1,headers.length).setValue(name)}});
  const keyColumn=headers.indexOf(keyName)+1;if(!keyColumn)throw new Error('Sync key column is unavailable.');
  let row=0;if(sheet.getLastRow()>1){const match=sheet.getRange(2,keyColumn,sheet.getLastRow()-1,1).createTextFinder(String(record[keyName])).matchEntireCell(true).findNext();if(match)row=match.getRow();}
  const values=headers.map(function(name){return Object.prototype.hasOwnProperty.call(record,name)?sheetSafe_(record[name]):''});
  if(row){sheet.getRange(row,1,1,headers.length).setValues([values]);return {action:'updated',row:row};}
  sheet.appendRow(values);return {action:'created',row:sheet.getLastRow()};
}

function sheetSafe_(value) {
  if (typeof value !== 'string') return value;
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
