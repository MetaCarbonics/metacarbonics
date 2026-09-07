(function(){
  const baseOpenModule=window.openModule;
  window.openModule=function(index){
    const code='M'+String(index+1).padStart(2,'0');
    window.location.href='pom-module.html?module='+code;
  };

  let workbook=null,activeSheet='',showFormulas=false,selectedCell='';
  const workbookUrl='VCS4713_VM0047_ExAnte_ERR_sample.xlsx';
  const status=document.getElementById('workbookStatus');
  const tabs=document.getElementById('sheetTabs');
  const grid=document.getElementById('sheetGrid');
  const editor=document.getElementById('cellEditor');
  const apply=document.getElementById('applyCellEdit');

  function displayValue(cell){
    if(!cell)return '';
    if(showFormulas&&cell.f)return '='+cell.f;
    if(cell.w!==undefined&&!showFormulas)return cell.w;
    return cell.v===undefined?'':String(cell.v);
  }
  function renderSheet(name){
    activeSheet=name; selectedCell=''; editor.value=''; editor.disabled=true; apply.disabled=true;
    document.getElementById('activeSheetName').textContent=name;
    document.getElementById('activeCell').textContent='Select a cell to inspect or edit';
    tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.sheet===name));
    const ws=workbook.Sheets[name],range=XLSX.utils.decode_range(ws['!ref']||'A1:A1');
    const maxRows=Math.min(range.e.r,199),maxCols=Math.min(range.e.c,79);
    let html='<thead><tr><th class="corner"></th>';
    for(let c=0;c<=maxCols;c++)html+=`<th>${XLSX.utils.encode_col(c)}</th>`;
    html+='</tr></thead><tbody>';
    for(let r=0;r<=maxRows;r++){
      html+=`<tr><th>${r+1}</th>`;
      for(let c=0;c<=maxCols;c++){
        const addr=XLSX.utils.encode_cell({r,c}),cell=ws[addr],value=displayValue(cell);
        html+=`<td data-cell="${addr}" title="${addr}">${String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</td>`;
      }
      html+='</tr>';
    }
    html+='</tbody>'; grid.innerHTML=html;
    grid.querySelectorAll('[data-cell]').forEach(td=>td.onclick=()=>{
      grid.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));td.classList.add('selected');selectedCell=td.dataset.cell;
      const cell=ws[selectedCell];editor.value=cell?.f?'='+cell.f:(cell?.v??'');editor.disabled=false;apply.disabled=false;
      document.getElementById('activeCell').textContent=`${name} ${selectedCell}${cell?.f?' · formula':''}`;
    });
    const clipped=range.e.r>maxRows||range.e.c>maxCols;
    status.textContent=`${workbook.SheetNames.length} sheets loaded · ${name} · ${range.e.r+1} rows × ${range.e.c+1} columns${clipped?' · web view shows first 200 rows and 80 columns; download retains the complete sheet':''}`;
  }
  async function loadWorkbook(){
    if(typeof XLSX==='undefined'){status.textContent='Workbook viewer library could not load. The Excel download remains available.';return;}
    try{
      const response=await fetch(workbookUrl);if(!response.ok)throw new Error('Workbook unavailable');
      workbook=XLSX.read(await response.arrayBuffer(),{type:'array',cellFormula:true,cellStyles:true,cellDates:true});
      tabs.innerHTML=workbook.SheetNames.map(n=>`<button data-sheet="${n}">${n.replace(/^S\d+[A-Z]?_/,'').replaceAll('_',' ')}</button>`).join('');
      tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>renderSheet(b.dataset.sheet));renderSheet(workbook.SheetNames[0]);
    }catch(error){status.textContent='Workbook web view is unavailable. Download the Excel file to access every sheet.';}
  }
  document.getElementById('toggleFormula').onclick=()=>{showFormulas=!showFormulas;document.getElementById('toggleFormula').textContent=showFormulas?'Show calculated values':'Show formulas';if(workbook)renderSheet(activeSheet)};
  apply.onclick=()=>{
    if(!workbook||!selectedCell)return;const ws=workbook.Sheets[activeSheet],raw=editor.value;
    if(raw.startsWith('='))ws[selectedCell]={t:'n',f:raw.slice(1)};
    else if(raw!==''&&!Number.isNaN(Number(raw)))ws[selectedCell]={t:'n',v:Number(raw)};
    else ws[selectedCell]={t:'s',v:raw};
    if(!ws['!ref'])ws['!ref']=selectedCell;renderSheet(activeSheet);window.toast?.('Draft cell updated. Recalculation and approval are required.');
  };
  document.getElementById('downloadEditedErr').onclick=()=>{if(workbook)XLSX.writeFile(workbook,'VCS4713_VM0047_ERR_web_edit.xlsx');};

  const connect=document.getElementById('adminConnectDrive');
  connect.onclick=async()=>{
    const folderId=document.getElementById('driveFolderId').value.trim();
    if(!folderId){window.toast?.('Enter the project Google Drive folder ID.');return;}
    connect.disabled=true;connect.textContent='Checking backend…';
    try{
      const response=await fetch('/api/google-drive/connect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId:'VCS-4713',folderId,policy:document.getElementById('drivePolicy').value})});
      if(!response.ok)throw new Error('Backend connector not deployed');
      const data=await response.json();if(data.authorizationUrl)location.href=data.authorizationUrl;
    }catch(error){
      document.getElementById('driveAdminStatus').textContent='Backend setup required';
      window.toast?.('Deploy the secure Google Drive backend connector, then authorize it here.');
    }finally{connect.disabled=false;connect.textContent='Authorize Google Drive';}
  };
  loadWorkbook();
})();
