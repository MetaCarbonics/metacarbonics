/* ClimaLink -> Google Sheets bridge. The endpoint is injected after Apps Script deployment. */
window.CLIMALINK_SHEETS_ENDPOINT = window.CLIMALINK_SHEETS_ENDPOINT || 'https://script.google.com/macros/s/AKfycbzgO6qTKX_jaxF4xdsB9WrIBT8C--rtWxvCRTzbr0r1q6xedtb2lJwn2kPyXGXi08Szyg/exec';

(() => {
  const nativeSetItem = Storage.prototype.setItem;
  const sentKey = 'climalinkSyncedLeadIds';
  const status = message => { const node = document.getElementById('liStatus'); if (node) node.textContent = message; };
  async function sendLead(lead) {
    const endpoint = window.CLIMALINK_SHEETS_ENDPOINT;
    if (!endpoint || endpoint.startsWith('__')) { status(`${lead.Lead_ID} · Saved locally; Sheet bridge pending`); return; }
    const sent = JSON.parse(localStorage.getItem(sentKey) || '[]');
    if (sent.includes(lead.Lead_ID)) return;
    status(`${lead.Lead_ID} · Syncing to Google Sheet…`);
    await fetch(endpoint, {method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'createLead', lead})});
    nativeSetItem.call(localStorage, sentKey, JSON.stringify([...sent, lead.Lead_ID]));
    status(`${lead.Lead_ID} · Submitted to Google Sheet`);
  }
  Storage.prototype.setItem = function (key, value) {
    let previous = [];
    if (this === localStorage && key === 'climalinkCRM') {
      try { previous = JSON.parse(this.getItem(key) || '{}').professionalLeads || []; } catch (_) {}
    }
    nativeSetItem.call(this, key, value);
    if (this === localStorage && key === 'climalinkCRM') {
      try {
        const next = JSON.parse(value).professionalLeads || [], oldIds = new Set(previous.map(x => x.Lead_ID));
        next.filter(x => !oldIds.has(x.Lead_ID)).forEach(x => sendLead(x).catch(() => status(`${x.Lead_ID} · Sheet sync failed; saved locally`)));
      } catch (_) {}
    }
  };
})();
