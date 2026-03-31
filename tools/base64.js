export const meta = { id: 'base64', label: 'Base64' };

export function mount(container) {
  container.innerHTML = `
<div class="tool-wrap">
  <div class="page-header">
    <h1>Base64 Encoder / Decoder</h1>
    <p class="page-desc">Encode ou décode du texte (ou un fichier) en <code>Base64</code>.</p>
  </div>
  <div class="card">
    <div class="mode-row">
      <button class="mbtn active" id="b64-btn-encode" onclick="b64SetMode('encode')">⬆ Encoder → Base64</button>
      <button class="mbtn" id="b64-btn-decode" onclick="b64SetMode('decode')">⬇ Décoder ← Base64</button>
    </div>
    <div id="b64-file-section">
      <div class="file-zone" id="b64-file-zone"
           onclick="document.getElementById('b64-file-input').click()"
           ondragover="b64DragOver(event)" ondragleave="b64DragLeave(event)" ondrop="b64Drop(event)">
        Glisse un fichier ici ou clique pour en sélectionner un
      </div>
      <input type="file" id="b64-file-input" style="display:none" onchange="b64FileSelect(this)">
    </div>
    <div class="sep" id="b64-sep"></div>
    <label id="b64-input-label">Texte à encoder</label>
    <textarea id="b64-input" placeholder="Colle ou tape ton texte ici…" oninput="b64Run()"></textarea>
    <div class="sep"></div>
    <div class="output-header">
      <label style="margin:0" id="b64-output-label">Résultat Base64</label>
      <span class="badge" id="b64-size">— car.</span>
      <button class="action-btn" id="b64-copy-btn" onclick="b64Copy()">Copier ↗</button>
      <button class="action-btn" id="b64-swap-btn" onclick="b64Swap()">⇅ Utiliser</button>
    </div>
    <div class="output-box empty" id="b64-output">Le résultat apparaîtra ici</div>
    <div class="stats-row" id="b64-stats"></div>
  </div>
</div>`;

  let b64Mode = 'encode', b64Result = '', b64FileMode = false;

  window.b64SetMode = m => {
    b64Mode = m; b64FileMode = false;
    document.getElementById('b64-file-zone').textContent = 'Glisse un fichier ici ou clique pour en sélectionner un';
    document.getElementById('b64-file-zone').className = 'file-zone';
    document.getElementById('b64-file-input').value = '';
    document.getElementById('b64-btn-encode').classList.toggle('active', m==='encode');
    document.getElementById('b64-btn-decode').classList.toggle('active', m==='decode');
    document.getElementById('b64-file-section').style.display = m==='encode' ? '' : 'none';
    document.getElementById('b64-sep').style.display = m==='encode' ? '' : 'none';
    document.getElementById('b64-input-label').textContent = m==='encode' ? 'Texte à encoder' : 'Base64 à décoder';
    document.getElementById('b64-input').placeholder = m==='encode' ? 'Colle ou tape ton texte ici…' : 'Colle la chaîne Base64 ici…';
    document.getElementById('b64-output-label').textContent = m==='encode' ? 'Résultat Base64' : 'Texte décodé';
    b64Run();
  };

  window.b64Run = () => { if (!b64FileMode) b64Process(document.getElementById('b64-input').value); };

  function b64Process(raw) {
    const out=document.getElementById('b64-output'), badge=document.getElementById('b64-size'), stats=document.getElementById('b64-stats');
    if (!raw.trim()) { b64Result=''; out.textContent='Le résultat apparaîtra ici'; out.className='output-box empty'; badge.textContent='— car.'; stats.innerHTML=''; return; }
    try {
      if (b64Mode === 'encode') {
        const bytes = new TextEncoder().encode(raw);
        b64Result = btoa(String.fromCharCode(...bytes));
        stats.innerHTML = `<span class="stat-chip">Entrée : ${raw.length.toLocaleString('fr-FR')} car.</span><span class="stat-chip">Sortie : ${b64Result.length.toLocaleString('fr-FR')} car.</span><span class="stat-chip">Ratio : ${((b64Result.length/raw.length)*100).toFixed(0)} %</span>`;
      } else {
        const binary = atob(raw.replace(/\s/g,''));
        b64Result = new TextDecoder().decode(Uint8Array.from(binary, c=>c.charCodeAt(0)));
        stats.innerHTML = `<span class="stat-chip">Entrée : ${raw.replace(/\s/g,'').length.toLocaleString('fr-FR')} car.</span><span class="stat-chip">Sortie : ${b64Result.length.toLocaleString('fr-FR')} car.</span>`;
      }
      out.textContent = b64Result; out.className = 'output-box';
      badge.textContent = b64Result.length.toLocaleString('fr-FR') + ' car.';
    } catch(e) {
      b64Result=''; out.textContent='⚠ ' + (b64Mode==='decode' ? 'Base64 invalide' : 'Erreur d\'encodage'); out.className='output-box err';
      badge.textContent='— car.'; stats.innerHTML='';
    }
  }

  window.b64DragOver  = e => { e.preventDefault(); document.getElementById('b64-file-zone').classList.add('dragover'); };
  window.b64DragLeave = () => document.getElementById('b64-file-zone').classList.remove('dragover');
  window.b64Drop = e => { e.preventDefault(); document.getElementById('b64-file-zone').classList.remove('dragover'); const f=e.dataTransfer.files[0]; if(f) b64ReadFile(f); };
  window.b64FileSelect = input => { if(input.files[0]) b64ReadFile(input.files[0]); };

  function b64ReadFile(file) {
    b64FileMode = true;
    const zone = document.getElementById('b64-file-zone');
    zone.textContent = `📄 ${file.name} (${(file.size/1024).toFixed(1)} Ko)`;
    zone.className = 'file-zone has-file';
    document.getElementById('b64-input').value = '';
    const reader = new FileReader();
    reader.onload = e => {
      b64Result = e.target.result.split(',')[1];
      const out = document.getElementById('b64-output');
      out.textContent = b64Result; out.className = 'output-box';
      document.getElementById('b64-size').textContent = b64Result.length.toLocaleString('fr-FR') + ' car.';
      document.getElementById('b64-stats').innerHTML = `<span class="stat-chip">${file.name}</span><span class="stat-chip">${(file.size/1024).toFixed(1)} Ko</span><span class="stat-chip">${file.type||'inconnu'}</span>`;
    };
    reader.readAsDataURL(file);
  }

  window.b64Copy = () => {
    if (!b64Result) return;
    navigator.clipboard.writeText(b64Result).then(() => {
      const btn=document.getElementById('b64-copy-btn');
      btn.textContent='Copié !'; btn.classList.add('success');
      setTimeout(()=>{btn.textContent='Copier ↗';btn.classList.remove('success');},2200);
    });
  };

  window.b64Swap = () => {
    if (!b64Result) return;
    b64FileMode=false;
    document.getElementById('b64-file-zone').textContent='Glisse un fichier ici ou clique pour en sélectionner un';
    document.getElementById('b64-file-zone').className='file-zone';
    document.getElementById('b64-file-input').value='';
    b64SetMode(b64Mode==='encode'?'decode':'encode');
    document.getElementById('b64-input').value = b64Result;
    b64Run();
  };
}
