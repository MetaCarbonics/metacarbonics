/* Authenticated Supabase session -> Google Sheets upsert bridge. */
window.CLIMALINK_SHEETS_ENDPOINT = window.CLIMALINK_SHEETS_ENDPOINT || 'https://script.google.com/macros/s/AKfycbzgO6qTKX_jaxF4xdsB9WrIBT8C--rtWxvCRTzbr0r1q6xedtb2lJwn2kPyXGXi08Szyg/exec';

(() => {
  const nativeSetItem=Storage.prototype.setItem;
  const status = message => { const node = document.getElementById('liStatus'); if (node) node.textContent = message; };
  async function syncRecord(recordType, record) {
    const endpoint = window.CLIMALINK_SHEETS_ENDPOINT;
    const id=record.Signal_ID||record.Lead_ID||record.Opportunity_ID||record.Project_ID;
    if (!endpoint || endpoint.startsWith('__')) throw new Error('Sheet bridge is not configured.');
    if (!window._supabase) throw new Error('Data service unavailable.');
    const {data,error}=await window._supabase.auth.getSession();
    if(error||!data.session?.access_token) throw new Error('Please sign in again.');
    status(`${id} · Syncing to Google Sheet…`);
    await fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'syncRecord',recordType,record,accessToken:data.session.access_token})});
    status(`${id} · Submitted to Google Sheet`);
    return {ok:true,recordId:id};
  }
  window.ClimaLinkSync={syncRecord};
  Storage.prototype.setItem=function(key,value){
    nativeSetItem.call(this,key,value);
    if(this!==localStorage)return;
    try{
      if(key==='climalinkCRM'){
        const leads=JSON.parse(value).professionalLeads||[];
        const lead=leads[leads.length-1];
        if(lead)syncRecord('lead',lead).catch(error=>status(`${lead.Lead_ID} · ${error.message}`));
      }
      if(key==='climalinkSignals'){
        const signals=JSON.parse(value)||[],signal=signals[signals.length-1];
        if(signal)syncRecord('signal',signal).catch(error=>status(`${signal.Signal_ID} · ${error.message}`));
      }
    }catch(error){status(`Sheet sync failed · ${error.message}`)}
  };
})();
