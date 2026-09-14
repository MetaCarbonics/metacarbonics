(() => {
  const $ = id => document.getElementById(id);
  $('identifiedDate').value = new Date().toISOString().slice(0, 10);

  $('saveSignal').onclick = () => {
    const required = ['account', 'source', 'document', 'identifiedBy', 'identifiedDate', 'trigger'];
    if (required.some(id => !$(id).value.trim())) {
      alert('Complete all required fields.');
      return;
    }
    const existing = JSON.parse(localStorage.getItem('climalinkSignals') || '[]');
    const signal = {
      Signal_ID: `SIG-${new Date().getFullYear()}-${String(existing.length + 1).padStart(4, '0')}`,
      Account: $('account').value,
      Lead_Type: 'Self-generated',
      Lead_Source: $('source').value,
      Source_Subtype: $('subtype').value,
      Source_Document: $('document').value,
      Source_URL: $('url').value,
      Source_Reference: $('reference').value,
      Identified_By: $('identifiedBy').value,
      Identified_Date: $('identifiedDate').value,
      Trigger: $('trigger').value,
      Potential_Service: $('service').value,
      Potential_Activity: $('activity').value,
      Priority: $('priority').value,
      Status: $('signalStatus').value,
      Notes: $('notes').value,
      Updated_At: new Date().toISOString()
    };
    existing.push(signal);
    $('status').textContent = `${signal.Signal_ID} · Saving…`;
    localStorage.setItem('climalinkSignals', JSON.stringify(existing));
    setTimeout(() => { location.href = 'climalink.html#signals'; }, 1200);
  };
})();
