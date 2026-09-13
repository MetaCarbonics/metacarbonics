(function(){
  const qs=new URLSearchParams(location.search),id=qs.get('id')||'Project',record=document.getElementById('record');
  if(!record)return;
  const title=record.querySelector('h1')?.textContent||id,stagebar=record.querySelector('.stagebar');
  if(stagebar){stagebar.classList.add('stage-email-bar');[...stagebar.querySelectorAll('span')].forEach(stage=>{const name=stage.textContent.trim(),wrap=document.createElement('div');wrap.className='stage-email-step';stage.replaceWith(wrap);wrap.append(stage);const link=document.createElement('a');link.className='stage-email';link.href=`mailto:?subject=${encodeURIComponent(title+' — '+name+' stage update')}&body=${encodeURIComponent('Project: '+title+'\nRecord: '+id+'\nStage: '+name+'\n\nMilestone summary:\nAction required:\nDue date:\nApproved documents:')}`;link.textContent='Email';link.setAttribute('aria-label','Email '+name+' stage update');wrap.append(link)})}
  const activity=[...record.querySelectorAll('.record-section h2')].find(x=>x.textContent.includes('Activity'))?.parentElement;if(activity){activity.querySelector('h2').textContent='Project activity timeline';const p=document.createElement('p');p.className='section-help';p.textContent='Chronological calls, emails, documents, decisions, approvals and milestone changes for this project.';activity.querySelector('h2').after(p)}
})();
