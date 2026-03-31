export const meta = { id: 'formatter', label: 'JSON / XML' };

export function mount(container) {
  container.innerHTML = `
<div class="tool-wrap fmt-tool">
  <div class="fmt-topbar">
    <div class="mode-toggle">
      <button class="mode-btn active" id="fmt-btn-json" onclick="fmtSetMode('json')">JSON</button>
      <button class="mode-btn"        id="fmt-btn-xml"  onclick="fmtSetMode('xml')">XML</button>
    </div>
    <div class="sep-v"></div>
    <button class="tb-btn" onclick="fmtExpandAll()">⊞ Tout ouvrir</button>
    <button class="tb-btn" onclick="fmtCollapseAll()">⊟ Tout réduire</button>
    <button class="tb-btn" id="fmt-minify-btn" onclick="fmtMinify()">⬡ Minifier</button>
    <button class="tb-btn" id="fmt-copy-btn"   onclick="fmtCopy()">⎘ Copier</button>
    <div class="search-wrap">
      <input class="search-input" id="fmt-search" placeholder="Rechercher…"
             oninput="fmtOnSearch(this.value)" onkeydown="fmtOnSearchKey(event)" />
      <span class="search-count" id="fmt-search-count"></span>
    </div>
  </div>
  <div class="fmt-statusbar">
    <div class="status-dot" id="fmt-dot"></div>
    <span id="fmt-msg">Collez du JSON ou du XML dans le panneau gauche</span>
    <span class="fmt-stats" id="fmt-stats"></span>
  </div>
  <div class="fmt-main">
    <div class="fmt-pane-input" id="fmt-pane-input">
      <div class="pane-label">Entrée brute <button class="clear-btn" onclick="fmtClear()">✕</button></div>
      <textarea id="fmt-raw" spellcheck="false"
        placeholder='{"exemple": {"clé": "valeur", "nombre": 42}}'
        oninput="fmtOnInput()"></textarea>
    </div>
    <div class="fmt-resizer" id="fmt-resizer"></div>
    <div class="fmt-pane-output">
      <div class="pane-label">Arbre formaté</div>
      <div class="fmt-tree" id="fmt-tree">
        <div class="fmt-empty">{ } Collez du JSON ou du XML à gauche</div>
      </div>
    </div>
  </div>
</div>`;

  // ── Resizer ──
  const resizer = document.getElementById('fmt-resizer');
  const leftPane = document.getElementById('fmt-pane-input');
  let dragging=false, startX, startW;
  resizer.addEventListener('mousedown', e => { dragging=true; startX=e.clientX; startW=leftPane.offsetWidth; resizer.classList.add('dragging'); document.body.style.cssText='cursor:col-resize;user-select:none'; });
  document.addEventListener('mousemove', e => { if(!dragging)return; leftPane.style.width=Math.max(160,Math.min(startW+e.clientX-startX,window.innerWidth-280))+'px'; });
  document.addEventListener('mouseup', ()=>{ dragging=false; resizer.classList.remove('dragging'); document.body.style.cssText=''; });

  // ── Drag & Drop ──
  const ta=document.getElementById('fmt-raw');
  ta.addEventListener('dragover',e=>e.preventDefault());
  ta.addEventListener('drop',e=>{ e.preventDefault(); const f=e.dataTransfer.files[0]; if(f){const r=new FileReader();r.onload=ev=>{ta.value=ev.target.result;fmtOnInput();};r.readAsText(f);}});

  // ── State ──
  let fmtMode='json', fmtParsed=null, fmtFormatted='', fmtMatches=[], fmtIdx=-1, fmtNodeId=0;

  window.fmtSetMode = m => {
    fmtMode=m;
    document.getElementById('fmt-btn-json').classList.toggle('active',m==='json');
    document.getElementById('fmt-btn-xml').classList.toggle('active',m==='xml');
    ta.placeholder = m==='json' ? '{"exemple": {"clé": "valeur"}}' : '<racine><enfant attr="val">texte</enfant></racine>';
    fmtProcess();
  };

  let fmtDebounce=null;
  window.fmtOnInput = () => { clearTimeout(fmtDebounce); fmtDebounce=setTimeout(fmtProcess,180); };

  function fmtProcess() {
    const raw=ta.value.trim();
    if(!raw){fmtShowEmpty();return;}
    if(fmtMode==='json'){
      try { fmtParsed=JSON.parse(raw); fmtFormatted=JSON.stringify(fmtParsed,null,2); fmtRender(fmtBuildJsonNode(fmtParsed,null)); fmtSetStatus('ok','JSON valide',fmtStats(raw,fmtFormatted)); }
      catch(e){fmtParsed=null;fmtFormatted='';fmtRender(null);fmtSetStatus('err','Erreur JSON : '+e.message,'');}
    } else {
      try {
        const doc=new DOMParser().parseFromString(raw,'application/xml');
        const err=doc.querySelector('parsererror');
        if(err)throw new Error(err.textContent.split('\n')[0]);
        fmtParsed=doc; fmtFormatted=fmtFormatXml(raw);
        fmtRender(fmtBuildXmlNode(doc.documentElement)); fmtSetStatus('ok','XML valide',fmtStats(raw,fmtFormatted));
      } catch(e){fmtParsed=null;fmtFormatted='';fmtRender(null);fmtSetStatus('err','Erreur XML : '+e.message.substring(0,120),'');}
    }
  }

  function fmtFormatXml(xml) {
    let out='',indent=0;
    xml.replace(/>\s*</g,'><').split(/(<[^>]+>)/).forEach(p=>{
      if(!p.trim())return;
      if(p.match(/^<\/\w/))indent--;
      out+='  '.repeat(Math.max(0,indent))+p.trim()+'\n';
      if(p.match(/^<\w[^/]*[^/]>$/)&&!p.match(/<.*\/>/))indent++;
    });
    return out.trim();
  }

  // ── JSON Tree ──
  function fmtNid(){return'fn'+(++fmtNodeId);}
  function fmtBuildJsonNode(val,key){
    const id=fmtNid(); const type=val===null?'null':Array.isArray(val)?'array':typeof val;
    const isComplex=type==='object'||type==='array'; const count=isComplex?Object.keys(val).length:0;
    const keyHtml=key!==null?`<span class="j-key">"${fmtEsc(key)}"</span><span class="j-punct">: </span>`:'';
    if(!isComplex){
      let v;
      if(type==='string')v=`<span class="j-str">"${fmtEsc(val)}"</span>`;
      else if(type==='number')v=`<span class="j-num">${val}</span>`;
      else if(type==='boolean')v=`<span class="j-bool">${val}</span>`;
      else v=`<span class="j-null">null</span>`;
      return `<div class="fn-node"><div class="fn-line"><span class="fn-toggle leaf"></span>${keyHtml}${v}</div></div>`;
    }
    const br=type==='array'?['[',']']:['{','}'];
    const children=(type==='array'?val.map((v,i)=>fmtBuildJsonNode(v,i)):Object.entries(val).map(([k,v])=>fmtBuildJsonNode(v,k))).join('');
    return `<div class="fn-node">
      <div class="fn-line"><span class="fn-toggle" onclick="fmtToggle('${id}')">▼</span>${keyHtml}<span class="j-punct">${br[0]}</span><span class="fn-hint" id="fh-${id}" style="display:none"> … ${count} élément${count>1?'s':''} </span><span class="j-punct fn-cb" id="fc-${id}" style="display:none">${br[1]}</span></div>
      <div class="fn-children" id="${id}">${children}</div>
      <div class="fn-line"><span class="fn-toggle leaf"></span><span class="j-punct">${br[1]}</span></div>
    </div>`;
  }

  // ── XML Tree ──
  function fmtBuildXmlNode(node){
    const id=fmtNid();
    if(node.nodeType===8)return`<div class="fn-node"><div class="fn-line"><span class="fn-toggle leaf"></span><span class="x-comm">&lt;!-- ${fmtEsc(node.nodeValue.trim())} --&gt;</span></div></div>`;
    if(node.nodeType===4)return`<div class="fn-node"><div class="fn-line"><span class="fn-toggle leaf"></span><span class="x-cdata">&lt;![CDATA[ ${fmtEsc(node.nodeValue.trim())} ]]&gt;</span></div></div>`;
    if(node.nodeType===3){const t=node.nodeValue.trim();if(!t)return'';return`<div class="fn-node"><div class="fn-line"><span class="fn-toggle leaf"></span><span class="x-text">${fmtEsc(t)}</span></div></div>`;}
    const tag=node.tagName;
    const attrs=Array.from(node.attributes||[]).map(a=>` <span class="x-attr">${fmtEsc(a.name)}</span><span class="x-punct">=</span><span class="x-aval">"${fmtEsc(a.value)}"</span>`).join('');
    const children=Array.from(node.childNodes).map(c=>fmtBuildXmlNode(c)).filter(Boolean).join('');
    if(!children)return`<div class="fn-node"><div class="fn-line"><span class="fn-toggle leaf"></span><span class="x-punct">&lt;</span><span class="x-tag">${fmtEsc(tag)}</span>${attrs}<span class="x-punct">/&gt;</span></div></div>`;
    const cnt=Array.from(node.childNodes).filter(c=>c.nodeType!==3||c.nodeValue.trim()).length;
    return`<div class="fn-node">
      <div class="fn-line"><span class="fn-toggle" onclick="fmtToggle('${id}')">▼</span><span class="x-punct">&lt;</span><span class="x-tag">${fmtEsc(tag)}</span>${attrs}<span class="x-punct">&gt;</span><span class="fn-hint" id="fh-${id}" style="display:none"> … ${cnt} enfant${cnt>1?'s':''} </span><span class="x-punct fn-cb" id="fc-${id}" style="display:none">&lt;/${fmtEsc(tag)}&gt;</span></div>
      <div class="fn-children" id="${id}">${children}</div>
      <div class="fn-line"><span class="fn-toggle leaf"></span><span class="x-punct">&lt;/${fmtEsc(tag)}&gt;</span></div>
    </div>`;
  }

  window.fmtToggle = id => {
    const ch=document.getElementById(id), hint=document.getElementById('fh-'+id), cb=document.getElementById('fc-'+id);
    const tgl=ch.previousElementSibling?.querySelector('.fn-toggle');
    const c=ch.classList.toggle('collapsed');
    if(tgl)tgl.textContent=c?'▶':'▼';
    if(hint)hint.style.display=c?'inline':'none';
    if(cb)cb.style.display=c?'inline':'none';
  };

  window.fmtExpandAll = () => {
    document.querySelectorAll('#fmt-tree .fn-children.collapsed').forEach(el=>{
      el.classList.remove('collapsed');
      const h=document.getElementById('fh-'+el.id),cb=document.getElementById('fc-'+el.id),tgl=el.previousElementSibling?.querySelector('.fn-toggle');
      if(tgl)tgl.textContent='▼'; if(h)h.style.display='none'; if(cb)cb.style.display='none';
    });
  };

  window.fmtCollapseAll = () => {
    document.querySelectorAll('#fmt-tree .fn-children:not(.collapsed)').forEach(el=>{
      el.classList.add('collapsed');
      const h=document.getElementById('fh-'+el.id),cb=document.getElementById('fc-'+el.id),tgl=el.previousElementSibling?.querySelector('.fn-toggle');
      if(tgl)tgl.textContent='▶'; if(h)h.style.display='inline'; if(cb)cb.style.display='inline';
    });
  };

  // ── Search ──
  window.fmtOnSearch = q => {
    fmtClearHighlights();
    fmtMatches=[]; fmtIdx=-1; document.getElementById('fmt-search-count').textContent='';
    if(!q.trim())return;
    const tree=document.getElementById('fmt-tree');
    const walker=document.createTreeWalker(tree,NodeFilter.SHOW_TEXT);
    const regex=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');
    const nodes=[];
    let node; while((node=walker.nextNode()))if(regex.test(node.nodeValue)){regex.lastIndex=0;nodes.push(node);}
    nodes.forEach(n=>{
      const frag=document.createDocumentFragment(); let text=n.nodeValue,last=0,m; regex.lastIndex=0;
      while((m=regex.exec(text))!==null){
        if(m.index>last)frag.appendChild(document.createTextNode(text.slice(last,m.index)));
        const mk=document.createElement('mark'); mk.className='hl'; mk.textContent=m[0]; frag.appendChild(mk); fmtMatches.push(mk); last=regex.lastIndex;
      }
      if(last<text.length)frag.appendChild(document.createTextNode(text.slice(last)));
      n.parentNode.replaceChild(frag,n);
    });
    if(fmtMatches.length){fmtIdx=0;fmtHighlightCurrent();document.getElementById('fmt-search-count').textContent=`1/${fmtMatches.length}`;}
    else document.getElementById('fmt-search-count').textContent='0';
  };

  window.fmtOnSearchKey = e => {
    if(!fmtMatches.length)return;
    if(e.key==='Enter'||e.key==='F3'){
      e.preventDefault();
      fmtIdx=e.shiftKey?(fmtIdx-1+fmtMatches.length)%fmtMatches.length:(fmtIdx+1)%fmtMatches.length;
      fmtHighlightCurrent(); document.getElementById('fmt-search-count').textContent=`${fmtIdx+1}/${fmtMatches.length}`;
    }
  };

  function fmtHighlightCurrent(){
    fmtMatches.forEach((m,i)=>m.classList.toggle('current',i===fmtIdx));
    fmtMatches[fmtIdx]?.scrollIntoView({block:'center',behavior:'smooth'});
    let el=fmtMatches[fmtIdx]?.parentElement;
    while(el){if(el.classList.contains('fn-children')&&el.classList.contains('collapsed'))fmtToggle(el.id);el=el.parentElement;}
  }

  function fmtClearHighlights(){
    document.querySelectorAll('#fmt-tree mark.hl').forEach(m=>m.parentNode.replaceChild(document.createTextNode(m.textContent),m));
    document.getElementById('fmt-tree').normalize?.();
    fmtMatches=[];
  }

  window.fmtMinify = () => {
    if(!fmtParsed)return;
    const btn=document.getElementById('fmt-minify-btn');
    ta.value = fmtMode==='json' ? JSON.stringify(fmtParsed) : new XMLSerializer().serializeToString(fmtParsed.documentElement).replace(/>\s+</g,'><');
    btn.classList.add('active'); setTimeout(()=>btn.classList.remove('active'),1500);
    fmtProcess();
  };

  window.fmtCopy = () => {
    if(!fmtFormatted)return;
    const btn=document.getElementById('fmt-copy-btn');
    navigator.clipboard.writeText(fmtFormatted).then(()=>{
      btn.classList.add('success'); btn.textContent='✓ Copié';
      setTimeout(()=>{btn.classList.remove('success');btn.textContent='⎘ Copier';},2000);
    });
  };

  window.fmtClear = () => { ta.value=''; fmtShowEmpty(); };

  function fmtRender(html){
    fmtNodeId=0;
    const tree=document.getElementById('fmt-tree');
    tree.innerHTML=html||'<div class="fmt-empty">⚠ Impossible de parser le contenu</div>';
    const q=document.getElementById('fmt-search').value; if(q)fmtOnSearch(q);
  }

  function fmtShowEmpty(){
    fmtParsed=null; fmtFormatted='';
    document.getElementById('fmt-tree').innerHTML='<div class="fmt-empty">{ } Collez du JSON ou du XML à gauche</div>';
    fmtSetStatus('','Collez du JSON ou du XML dans le panneau gauche','');
    fmtClearHighlights(); document.getElementById('fmt-search-count').textContent='';
  }

  function fmtSetStatus(type,msg,stats){
    const dot=document.getElementById('fmt-dot');
    dot.className='status-dot'+(type==='ok'?' ok':type==='err'?' err':'');
    document.getElementById('fmt-msg').textContent=msg;
    document.getElementById('fmt-stats').textContent=stats;
  }

  function fmtStats(raw,fmt){return`${raw.length.toLocaleString('fr-FR')} → ${fmt.length.toLocaleString('fr-FR')} car. · ${fmt.split('\n').length} lignes`;}
  function fmtEsc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
}
