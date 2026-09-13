(function(){
  const roleNames={admin:'Administrator',bd:'BD Manager',projectlead:'Project Lead',manager:'Project Manager',developer:'Project Developer',operations:'Operations',finance:'Finance',ceo:'Management',farmer:'Farmer',buyer:'Buyer',investor:'Investor',user:'Project Developer'};
  const allowed={
    admin:['home','signals','leads','accounts','opportunities','project','advisory','partners','buyers','investors','tasks','timeline'],
    bd:['home','signals','leads','accounts','opportunities','project','advisory','partners','buyers','investors','tasks','timeline'],
    projectlead:['home','leads','accounts','opportunities','project','partners','tasks','timeline'],
    manager:['home','project','tasks','timeline'],developer:['home','project','tasks','timeline'],operations:['home','project','tasks','timeline'],
    finance:['home','accounts','opportunities','buyers','investors','tasks','timeline'],ceo:['home','accounts','opportunities','project','buyers','investors','tasks','timeline'],
    buyer:['home','portfolio','new-opportunities','documents','tasks','timeline'],investor:['home','portfolio','new-opportunities','documents','tasks','timeline'],farmer:['home','portfolio','documents','tasks']
  };
  function apply(e){
    const current=e?.detail||window.MC_CURRENT_USER;if(!current)return;
    const p=current.profile||{},r=p.role||'user',display=roleNames[r]||'Project Developer',set=new Set(allowed[r]||allowed.developer);
    const select=document.getElementById('role');if(select){select.value=display;select.dispatchEvent(new Event('change'));}
    document.querySelectorAll('#nav [data-view]').forEach(el=>{el.hidden=!set.has(el.dataset.view)});
    document.querySelectorAll('#nav p').forEach(el=>{if(![...el.parentElement.querySelectorAll('[data-view]')].some(x=>!x.hidden))el.hidden=true});
    const internal=['admin','bd','projectlead','manager','developer','operations','finance','ceo'].includes(r);
    document.querySelectorAll('[data-internal]').forEach(el=>{if(!internal)el.hidden=true});
    const canCreate=['admin','bd','projectlead'].includes(r);
    document.querySelectorAll('[data-create-signal],[data-create-lead]').forEach(el=>el.hidden=!canCreate);
    document.querySelectorAll('[data-admin-sheet]').forEach(el=>el.hidden=!['admin','bd'].includes(r));
    const badge=document.getElementById('sessionRole');if(badge)badge.textContent=display;
    const user=document.getElementById('workspaceUser');if(user)user.textContent=p.organisation&&['buyer','investor','farmer'].includes(r)?p.organisation:(p.full_name||p.email);
    const first=document.querySelector('#nav [data-view]:not([hidden])');const active=document.querySelector('#nav [data-view].active');if(active&&active.hidden&&first)first.click();
    if(r==='farmer'&&location.pathname.endsWith('/climalink.html')) location.replace('index.html#projects');
  }
  window.addEventListener('mc-auth-ready',apply);if(window.MC_CURRENT_USER)apply({detail:window.MC_CURRENT_USER});
})();
