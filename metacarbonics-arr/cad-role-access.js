(function(){
  const map={admin:'admin',bd:'bd',projectlead:'projectlead',manager:'manager',developer:'developer',operations:'operations',finance:'accounts',ceo:'ceo',farmer:'farmer',buyer:'buyer',investor:'investor',user:'developer'};
  function apply(e){const current=e?.detail||window.MC_CURRENT_USER;if(!current)return;const role=map[current.profile?.role]||'developer',select=document.getElementById('roleSelect');if(!select)return;select.value=role;select.dispatchEvent(new Event('change'));const picker=select.closest('.role-picker');if(picker)picker.hidden=true;const avatar=document.querySelector('.avatar');if(avatar){const name=current.profile?.full_name||current.user?.email||'User';avatar.textContent=name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();avatar.title=name}}
  window.addEventListener('mc-auth-ready',apply);if(window.MC_CURRENT_USER)apply({detail:window.MC_CURRENT_USER});
})();
