export const meta = { id: 'base64', label: 'Base64' };

export function mount(container) {
  container.innerHTML = `
<div class="page-header">
    <h1>Base64 Encoder / Decoder</h1>
    <p class="page-desc">Encode ou décode du texte (ou un fichier) en <code>Base64</code>. Utile pour les tokens JWT, les certificats, les payloads API, etc.</p>
  </div>
<div class="tool-wrap">
    <!-- Panneau gauche : mode + entrée -->
    <div class="card" style="display:flex;flex-direction:column;gap:10px;">
      <p class="card-title">Entrée</p>
      <div class="mode-row" style="margin-bottom:0">
        <button class="mbtn active" id="b64-btn-encode">⬆ Encoder → Base64</button>
        <button class="mbtn" id="b64-btn-decode">⬇ Décoder ← Base64</button>
      </div>
      <div id="b64-file-section">
        <div class="file-zone" id="b64-file-zone">
          Glisse un fichier ici ou clique pour en sélectionner un
        </div>
        <input type="file" id="b64-file-input" style="display:none">
        <div class="sep" id="b64-sep"></div>
      </div>
      <label id="b64-input-label">Texte à encoder</label>
      <textarea id="b64-input" placeholder="Colle ou tape ton texte ici…" style="flex:1;min-height:160px;"></textarea>
    </div>

    <!-- Panneau droit : résultat + stats -->
    <div class="card" style="display:flex;flex-direction:column;gap:10px;">
      <p class="card-title">Résultat</p>
      <div class="output-header">
        <label style="margin:0" id="b64-output-label">Résultat Base64</label>
        <span class="badge" id="b64-size">— car.</span>
        <button class="action-btn" id="b64-copy-btn">Copier ↗</button>
        <button class="action-btn" id="b64-swap-btn" title="Utiliser le résultat comme entrée">⇅ Utiliser</button>
      </div>
      <div class="output-box empty" id="b64-output" style="flex:1;min-height:160px;">Le résultat apparaîtra ici</div>
      <div class="stats-row" id="b64-stats"></div>
    </div>
  </div>

  <p class="note">Aucune donnée n'est transmise. Tout est calculé localement dans votre navigateur.</p>
</div>`;

  let b64Mode = 'encode', b64Result = '', b64FileMode = false;

  function setMode(m) {
    b64Mode = m; b64FileMode = false;
    document.getElementById('b64-file-zone').textContent = 'Glisse un fichier ici ou clique pour en sélectionner un';
    document.getElementById('b64-file-zone').className = 'file-zone';
    document.getElementById('b64-file-input').value = '';
    document.getElementById('b64-btn-encode').classList.toggle('active', m==='encode');
    document.getElementById('b64-btn-decode').classList.toggle('active', m==='decode');
    document.getElementById('b64-file-section').style.display = m==='encode' ? '' : 'none';
    document.getElementById('b64-input-label').textContent = m==='encode' ? 'Texte à encoder' : 'Base64 à décoder';
    document.getElementById('b64-input').placeholder = m==='encode' ? 'Colle ou tape ton texte ici…' : 'Colle la chaîne Base64 ici…';
    document.getElementById('b64-output-label').textContent = m==='encode' ? 'Résultat Base64' : 'Texte décodé';
    run();
  }

  function run() { if (!b64FileMode) process(document.getElementById('b64-input').value); }

  function process(raw) {
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
      b64Result=''; out.textContent='⚠ '+(b64Mode==='decode'?'Base64 invalide':'Erreur d\'encodage'); out.className='output-box err';
      badge.textContent='— car.'; stats.innerHTML='';
    }
  }

  // Events
  document.getElementById('b64-btn-encode').addEventListener('click', () => setMode('encode'));
  document.getElementById('b64-btn-decode').addEventListener('click', () => setMode('decode'));
  document.getElementById('b64-input').addEventListener('input', run);
  document.getElementById('b64-file-zone').addEventListener('click', () => document.getElementById('b64-file-input').click());
  document.getElementById('b64-file-zone').addEventListener('dragover', e => { e.preventDefault(); document.getElementById('b64-file-zone').classList.add('dragover'); });
  document.getElementById('b64-file-zone').addEventListener('dragleave', () => document.getElementById('b64-file-zone').classList.remove('dragover'));
  document.getElementById('b64-file-zone').addEventListener('drop', e => { e.preventDefault(); document.getElementById('b64-file-zone').classList.remove('dragover'); const f=e.dataTransfer.files[0]; if(f) readFile(f); });
  document.getElementById('b64-file-input').addEventListener('change', e => { if(e.target.files[0]) readFile(e.target.files[0]); });

  function readFile(file) {
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

  document.getElementById('b64-copy-btn').addEventListener('click', () => {
    if (!b64Result) return;
    navigator.clipboard.writeText(b64Result).then(() => {
      const btn=document.getElementById('b64-copy-btn');
      btn.textContent='Copié !'; btn.classList.add('success');
      setTimeout(()=>{btn.textContent='Copier ↗';btn.classList.remove('success');},2200);
    });
  });

  document.getElementById('b64-swap-btn').addEventListener('click', () => {
    if (!b64Result) return;
    b64FileMode=false;
    document.getElementById('b64-file-zone').textContent='Glisse un fichier ici ou clique pour en sélectionner un';
    document.getElementById('b64-file-zone').className='file-zone';
    document.getElementById('b64-file-input').value='';
    setMode(b64Mode==='encode'?'decode':'encode');
    document.getElementById('b64-input').value = b64Result;
    run();
  });
}
