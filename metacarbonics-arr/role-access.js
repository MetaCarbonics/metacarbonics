(function(){
  const roleNames={admin:'Administrator',bd:'BD Manager',projectlead:'Project Lead',manager:'Project Manager',developer:'Project Developer',operations:'Operations',finance:'Finance',ceo:'Management',farmer:'Farmer',buyer:'Buyer',investor:'Investor',user:'Project Developer'};
  const allowed={
    admin:['home','signals','leads','accounts','opportunities','project','advisory','partners','buyers','investors','tasks'],
    bd:['home','signals','leads','accounts','opportunities','project','advisory','partners','buyers','investors','tasks'],
    projectlead:['home','leads','accounts','opportunities','project','partners','tasks'],
    manager:['home','project','tasks'],developer:['home','project','tasks'],operations:['home','project','tasks'],
    finance:['home','accounts','opportunities','buyers','investors','tasks'],ceo:['home','accounts','opportunities','project','buyers','investors','tasks'],
    buyer:['home','portfolio','new-opportunities','documents','tasks'],investor:['home','portfolio','new-opportunities','documents','tasks'],farmer:['home','portfolio','documents','tasks']
  };
  function apply(e){
    const current=e?.detail||window.MC_CURRENT_USER;if(!current)return;
    const p=current.profile||{},rawRole=p.role||'user',r=allowed[rawRole]?rawRole:'developer',display=roleNames[r],set=new Set(allowed[r]);
    const select=document.getElementById('role');if(select){select.value=display;select.dispatchEvent(new Event('change'));}
    const enforceNavigation=()=>document.querySelectorAll('#nav [data-view]').forEach(el=>{el.hidden=!set.has(el.dataset.view)});
    enforceNavigation();
    document.querySelectorAll('#nav p').forEach(el=>{
      let node=el.nextElementSibling,hasVisibleItem=false;
      while(node&&node.tagName!=='P'){
        if((node.matches('[data-view]')||node.tagName==='A')&&!node.hidden)hasVisibleItem=true;
        node=node.nextElementSibling;
      }
      el.hidden=!hasVisibleItem;
    });
    const internal=['admin','bd','projectlead','manager','developer','operations','finance','ceo'].includes(r);
    document.querySelectorAll('[data-internal]').forEach(el=>{if(!internal)el.hidden=true});
    const canCreate=['admin','bd','projectlead'].includes(r);
    document.querySelectorAll('[data-create-signal],[data-create-lead]').forEach(el=>el.hidden=!canCreate);
    document.querySelectorAll('[data-admin-sheet]').forEach(el=>el.hidden=!['admin','bd'].includes(r));
    const badge=document.getElementById('sessionRole');if(badge)badge.textContent=display;
    const user=document.getElementById('workspaceUser');if(user)user.textContent=p.organisation&&['buyer','investor','farmer'].includes(r)?p.organisation:(p.full_name||p.email);
    const first=document.querySelector('#nav [data-view]:not([hidden])');const active=document.querySelector('#nav [data-view].active');if(active&&active.hidden&&first)first.click();
    if(r==='farmer'&&location.pathname.endsWith('/climalink.html')) location.replace('index.html#projects');
    window.setTimeout(enforceNavigation,150);
  }
  window.addEventListener('mc-auth-ready',apply);if(window.MC_CURRENT_USER)apply({detail:window.MC_CURRENT_USER});
})();
