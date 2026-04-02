export const meta = { id: 'cert', label: 'Certificat Encoder' };

export function mount(container) {
  container.innerHTML = `
<div class="tool-wrap">
  <div class="page-header">
    <h1>Certificat Encoder</h1>
    <p class="page-desc">Encode un certificat PEM en remplaçant les sauts de ligne par <code>%0a</code> et les espaces par <code>%20</code>.</p>
  </div>
    <div class="card">
      <p class="card-title">Certificat (entrée brute)</p>
      <label>Colle ton certificat PEM ici</label>
      <textarea id="cert-input" style="min-height:200px" placeholder="-----BEGIN CERTIFICATE-----&#10;MIIBxTCCAW...&#10;-----END CERTIFICATE-----" oninput="certUpdate()"></textarea>
    </div>
    <div class="card">
      <p class="card-title">Résultat encodé</p>
      <div class="row" style="margin-bottom:8px;">
        <span class="badge" id="cert-count">— car.</span>
        <button id="cert-copy-btn" onclick="certCopy()">Copier ↗</button>
      </div>
      <div id="cert-output" class="output-box empty" style="min-height:200px;">Le résultat apparaîtra ici</div>
    </div>
  </div>
</div>`;

  let certEncoded = '';

  window.certUpdate = () => {
    const raw = document.getElementById('cert-input').value;
    const out = document.getElementById('cert-output');
    const cnt = document.getElementById('cert-count');
    if (!raw.trim()) {
      certEncoded = ''; out.textContent = 'Le résultat apparaîtra ici'; out.className = 'output-box empty'; cnt.textContent = '— car.'; return;
    }
    certEncoded = raw.replace(/\r\n/g,'%0a').replace(/\n/g,'%0a').replace(/\r/g,'%0a').replace(/ /g,'%20');
    out.textContent = certEncoded; out.className = 'output-box';
    cnt.textContent = certEncoded.length.toLocaleString('fr-FR') + ' car.';
    document.getElementById('cert-copy-btn').textContent = 'Copier ↗';
    document.getElementById('cert-copy-btn').classList.remove('success');
  };

  window.certCopy = () => {
    if (!certEncoded) return;
    navigator.clipboard.writeText(certEncoded).then(() => {
      const btn = document.getElementById('cert-copy-btn');
      btn.textContent = 'Copié !'; btn.classList.add('success');
      setTimeout(() => { btn.textContent = 'Copier ↗'; btn.classList.remove('success'); }, 2200);
    });
  };
}
