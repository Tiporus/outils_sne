export const meta = { id: 'date', label: 'Date' };

export function mount(container) {

  // ── CSS injecté une seule fois ──
  if (!document.getElementById('dt-style')) {
    const s = document.createElement('style');
    s.id = 'dt-style';
    s.textContent = `
      #tool-container:has(.dt-layout) {
        overflow: hidden;
        padding: 0;
      }

      .dt-layout {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        gap: 10px;
        box-sizing: border-box;
      }

      /* ─── Header ─── */
      .dt-header {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .dt-input-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .dt-input {
        flex: 1;
        font-family: 'JetBrains Mono','Fira Mono',monospace;
        font-size: 15px;
        padding: 9px 14px;
        border-radius: 8px;
        border: 0.5px solid var(--border);
        background: var(--input-bg);
        color: var(--text);
        outline: none;
        transition: border-color .15s;
      }
      .dt-input:focus { border-color: var(--accent); }
      .dt-input.err { border-color: #D85A30; }

      .dt-status {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 7px 12px;
        border-radius: 8px;
        border: 0.5px solid var(--border);
        font-size: 12px;
        color: var(--text);
      }
      .dt-detected { margin-left: auto; font-size: 11px; color: var(--muted); font-style: italic; }

      /* ─── Corps ─── */
      .dt-body {
        flex: 1;
        display: flex;
        gap: 10px;
        overflow: hidden;
        min-height: 0;
      }

      .dt-formats-col {
        flex: 3;
        display: flex;
        flex-direction: column;
        min-width: 0;
        overflow: hidden;
      }

      .dt-tools-col {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 0;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
      }

      /* ─── Panels ─── */
      .dt-panel {
        background: var(--surface);
        border: 0.5px solid var(--border-light);
        border-radius: 12px;
        padding: 10px 14px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-height: 0;
        flex-shrink: 0;
      }

      .dt-formats-col .dt-panel { flex: 1; }

      .dt-panel-title {
        font-size: 10px;
        font-weight: 600;
        color: var(--muted2);
        text-transform: uppercase;
        letter-spacing: .08em;
        margin-bottom: 8px;
        flex-shrink: 0;
      }

      /* ─── Liste des formats ─── */
      .dt-formats-list {
        display: flex;
        flex-direction: column;
        gap: 3px;
        overflow-y: auto;
        flex: 1;
        scrollbar-width: thin;
      }

      .dt-fmt-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 10px;
        border-radius: 7px;
        background: var(--surface2);
        flex-shrink: 0;
      }
      .dt-fmt-row:hover { background: var(--input-bg); }
      .dt-fmt-label {
        font-size: 11px;
        color: var(--muted);
        width: 190px;
        flex-shrink: 0;
      }
      .dt-fmt-value {
        font-family: 'JetBrains Mono','Fira Mono',monospace;
        font-size: 12px;
        color: var(--text);
        font-weight: 500;
        flex: 1;
      }
      .dt-fmt-copy {
        font-size: 10px;
        padding: 2px 8px;
        border-radius: 5px;
        border: 0.5px solid var(--border);
        background: var(--surface);
        color: var(--muted);
        cursor: pointer;
        font-family: inherit;
        flex-shrink: 0;
        transition: color .12s, border-color .12s;
      }
      .dt-fmt-copy:hover { color: var(--accent); border-color: var(--accent); }
      .dt-fmt-copy.copied { color: #1D9E75; border-color: #1D9E75; }

      .dt-empty {
        color: var(--muted2);
        font-size: 13px;
        text-align: center;
        padding: 40px 0;
      }

      /* ─── Outils ─── */
      .dt-mini-input {
        width: 100%;
        padding: 7px 10px;
        border-radius: 8px;
        border: 0.5px solid var(--border);
        background: var(--input-bg);
        color: var(--text);
        font-size: 13px;
        font-family: inherit;
        outline: none;
        transition: border-color .15s;
        box-sizing: border-box;
      }
      .dt-mini-input:focus { border-color: var(--accent); }
      .dt-mini-input.err { border-color: #D85A30; }

      .dt-tool-form { display: flex; flex-direction: column; gap: 6px; }

      .dt-calc-row {
        display: flex;
        gap: 6px;
        align-items: center;
      }

      .dt-select {
        padding: 7px 8px;
        border-radius: 8px;
        border: 0.5px solid var(--border);
        background: var(--input-bg);
        color: var(--text);
        font-size: 13px;
        font-family: inherit;
        outline: none;
        cursor: pointer;
        flex-shrink: 0;
      }
      .dt-select-op { width: 52px; }
      .dt-input-n { width: 70px; text-align: center; }
      .dt-select-unit { flex: 1; }

      .dt-result {
        margin-top: 4px;
        padding: 8px 12px;
        border-radius: 8px;
        background: var(--surface2);
        font-size: 12px;
        display: none;
        flex-direction: column;
        gap: 3px;
      }
      .dt-result.visible { display: flex; }
      .dt-result-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
      .dt-result-label { color: var(--muted); font-size: 11px; }
      .dt-result-val { font-family: monospace; font-size: 13px; font-weight: 600; color: var(--accent); }
      .dt-result-main { font-size: 14px; font-weight: 700; color: var(--text); font-family: monospace; }

      /* ─── Code de conversion ─── */
      .dt-lang-toggle { display: flex; gap: 5px; margin-bottom: 8px; flex-shrink: 0; }
      .dt-lang-btn { padding: 4px 14px; border-radius: 7px; border: 0.5px solid var(--border); background: var(--surface2); color: var(--muted); font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background .12s; }
      .dt-lang-btn.active { background: #E6F1FB; color: #0C447C; border-color: #85B7EB; }
      .dt-code-block { background: var(--input-bg); border: 0.5px solid var(--border); border-radius: 8px; padding: 10px 12px; font-family: 'JetBrains Mono','Fira Mono',monospace; font-size: 11px; line-height: 1.65; color: var(--text); white-space: pre; overflow-x: auto; overflow-y: auto; max-height: 220px; scrollbar-width: thin; }
      .dt-code-block .ck { color: var(--c-bool); }
      .dt-code-block .cs { color: var(--c-str); }
      .dt-code-block .cc { color: var(--c-comment); }
      .dt-code-block .cn { color: var(--c-num); }

      /* ─── Responsive ─── */
      @media (max-width: 860px) {
        #tool-container:has(.dt-layout) { overflow-y: auto; }
        .dt-layout { height: auto; }
        .dt-body { flex-direction: column; overflow: visible; }
        .dt-formats-col, .dt-tools-col { flex: none; overflow: visible; }
        .dt-formats-col .dt-panel { flex: none; max-height: 400px; }
        .dt-tools-col { overflow: visible; }
      }
      @media (max-width: 640px) {
        .dt-layout { padding: 8px 10px; }
        .dt-fmt-label { width: 130px; }
      }
    `;
    document.head.appendChild(s);
  }

  // ── HTML ──
  container.innerHTML = `
<div class="dt-layout">

  <div class="dt-header">
    <div class="dt-input-row">
      <input type="text" id="dt-input" class="dt-input"
             placeholder="Colle ou tape une date : 2024-11-05  •  1730764200  •  05/11/2024  •  aujourd'hui  •  5 novembre 2024…"
             spellcheck="false" autocomplete="off" />
      <button id="dt-now-btn">Maintenant</button>
    </div>
    <div class="dt-status">
      <div class="status-dot" id="dt-dot" style="width:8px;height:8px;border-radius:50%;background:var(--muted2);flex-shrink:0;"></div>
      <span id="dt-status-msg">Saisissez ou collez une date dans n'importe quel format</span>
      <span class="dt-detected" id="dt-detected"></span>
    </div>
  </div>

  <div class="dt-body">

    <!-- Gauche : formats de sortie -->
    <div class="dt-formats-col">
      <div class="dt-panel">
        <div class="dt-panel-title">Formats de sortie</div>
        <div class="dt-formats-list" id="dt-formats-list">
          <div class="dt-empty">Les formats s'afficheront ici</div>
        </div>
      </div>
    </div>

    <!-- Droite : outils -->
    <div class="dt-tools-col">

      <!-- Écart entre deux dates -->
      <div class="dt-panel">
        <div class="dt-panel-title">Écart entre deux dates</div>
        <div class="dt-tool-form">
          <input type="text" id="dt-diff-a" class="dt-mini-input" placeholder="Date de début" spellcheck="false" />
          <input type="text" id="dt-diff-b" class="dt-mini-input" placeholder="Date de fin" spellcheck="false" />
          <div class="dt-result" id="dt-diff-result"></div>
        </div>
      </div>

      <!-- Ajouter / soustraire -->
      <div class="dt-panel">
        <div class="dt-panel-title">Ajouter / soustraire</div>
        <div class="dt-tool-form">
          <input type="text" id="dt-calc-date" class="dt-mini-input" placeholder="Date de base" spellcheck="false" />
          <div class="dt-calc-row">
            <select id="dt-calc-op" class="dt-select dt-select-op">
              <option value="+">+</option>
              <option value="−">−</option>
            </select>
            <input type="number" id="dt-calc-n" class="dt-mini-input dt-input-n" value="7" min="1" />
            <select id="dt-calc-unit" class="dt-select dt-select-unit">
              <option value="d">jours</option>
              <option value="w">semaines</option>
              <option value="m">mois</option>
              <option value="y">années</option>
            </select>
          </div>
          <div class="dt-result" id="dt-calc-result"></div>
        </div>
      </div>

      <!-- Code de conversion -->
      <div class="dt-panel" id="dt-code-panel" style="display:none;">
        <div class="dt-panel-title">Code de conversion</div>
        <div class="dt-lang-toggle">
          <button class="dt-lang-btn active" id="dt-lang-js">JavaScript</button>
          <button class="dt-lang-btn" id="dt-lang-java">Java</button>
        </div>
        <div class="dt-code-block" id="dt-code"></div>
      </div>

    </div>
  </div>
</div>`;

  // ══════════════════════════════════════════════
  // PARSING
  // ══════════════════════════════════════════════

  const MONTHS_FR_MAP = {
    'janvier':1,'février':2,'fevrier':2,'mars':3,'avril':4,'mai':5,'juin':6,
    'juillet':7,'août':8,'aout':8,'septembre':9,'octobre':10,'novembre':11,'décembre':12,'decembre':12
  };

  function parseDate(str) {
    str = str.trim();
    if (!str) return null;

    // Langage naturel
    if (/^(aujourd'?hui|today|now|maintenant)$/i.test(str)) return new Date();
    if (/^(hier|yesterday)$/i.test(str)) { const d = new Date(); d.setDate(d.getDate() - 1); return d; }
    if (/^(demain|tomorrow)$/i.test(str)) { const d = new Date(); d.setDate(d.getDate() + 1); return d; }

    // Timestamp Unix secondes (10 chiffres)
    if (/^\d{10}$/.test(str)) return new Date(parseInt(str) * 1000);
    // Timestamp Unix ms (13 chiffres)
    if (/^\d{13}$/.test(str)) return new Date(parseInt(str));

    // ISO 8601 (laisser JS gérer)
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      const d = new Date(str);
      if (!isNaN(d)) return d;
    }

    // JJ/MM/AAAA ou JJ-MM-AAAA ou JJ.MM.AAAA (avec heure optionnelle)
    const mFR = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})(?:[\s,]+(?:à\s*)?(\d{1,2})[h:](\d{2})(?:[:\.](\d{2}))?)?$/i);
    if (mFR) {
      let [, d, m, y, h = '0', min = '0', sec = '0'] = mFR;
      if (y.length === 2) y = parseInt(y) > 50 ? '19' + y : '20' + y;
      const date = new Date(+y, +m - 1, +d, +h, +min, +sec);
      if (!isNaN(date) && date.getMonth() === +m - 1) return date;
    }

    // Français long : "5 novembre 2024" ou "mardi 5 novembre 2024 à 14h30"
    const strLow = str.toLowerCase().replace(/^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+/, '');
    const mFRLong = strLow.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})(?:[\s,]+(?:à\s*)?(\d{1,2})[h:](\d{2}))?$/);
    if (mFRLong) {
      const [, d, monthStr, y, h = '0', min = '0'] = mFRLong;
      const m = MONTHS_FR_MAP[monthStr];
      if (m) {
        const date = new Date(+y, m - 1, +d, +h, +min, 0);
        if (!isNaN(date)) return date;
      }
    }

    // Fallback : laisser JS tenter
    const fallback = new Date(str);
    if (!isNaN(fallback)) return fallback;

    return null;
  }

  function detectFormat(str) {
    str = str.trim();
    if (/^(aujourd'?hui|today|now|maintenant|hier|yesterday|demain|tomorrow)$/i.test(str)) return 'Langage naturel';
    if (/^\d{10}$/.test(str)) return 'Timestamp Unix (secondes)';
    if (/^\d{13}$/.test(str)) return 'Timestamp Unix (ms)';
    if (/^\d{4}-\d{2}-\d{2}T/.test(str)) return 'ISO 8601 avec heure';
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return 'ISO 8601';
    if (/^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(str)) return 'JJ/MM/AAAA';
    if (/^\d{1,2}\s+\w+\s+\d{4}/i.test(str)) return 'Français long';
    return 'Auto-détecté';
  }

  // ══════════════════════════════════════════════
  // FORMATAGE
  // ══════════════════════════════════════════════

  const DAYS_FR   = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  const MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const DAYS_EN_S = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MONTHS_EN_S = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const pad = n => String(n).padStart(2, '0');

  function isoWeek(d) {
    const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    dt.setUTCDate(dt.getUTCDate() + 4 - (dt.getUTCDay() || 7));
    const y1 = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
    return { week: Math.ceil((((dt - y1) / 86400000) + 1) / 7), year: dt.getUTCFullYear() };
  }

  function relTime(d) {
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    const abs = Math.abs(diff);
    const future = diff < 0;
    if (abs < 60)    return future ? 'dans quelques secondes' : 'il y a quelques secondes';
    if (abs < 3600)  { const n = Math.floor(abs/60);    return future ? `dans ${n} min`        : `il y a ${n} min`; }
    if (abs < 86400) { const n = Math.floor(abs/3600);  return future ? `dans ${n}h`           : `il y a ${n}h`; }
    if (abs < 2592000) { const n = Math.floor(abs/86400); return future ? `dans ${n} jour${n>1?'s':''}` : `il y a ${n} jour${n>1?'s':''}`; }
    if (abs < 31536000) { const n = Math.floor(abs/2592000); return future ? `dans ${n} mois` : `il y a ${n} mois`; }
    const n = Math.floor(abs/31536000); return future ? `dans ${n} an${n>1?'s':''}` : `il y a ${n} an${n>1?'s':''}`;
  }

  function formatAll(d) {
    const Y = d.getFullYear(), Mo = d.getMonth(), D = d.getDate();
    const h = d.getHours(), mi = d.getMinutes(), sc = d.getSeconds();
    const tz = d.getTimezoneOffset();
    const tzSign = tz <= 0 ? '+' : '-';
    const tzH = pad(Math.floor(Math.abs(tz) / 60));
    const tzM = pad(Math.abs(tz) % 60);

    const ts  = Math.floor(d.getTime() / 1000);
    const tsMs = d.getTime();

    const { week, year: wYear } = isoWeek(d);
    const dayOfYear = Math.round((new Date(Y, Mo, D) - new Date(Y, 0, 0)) / 86400000);
    const quarter = Math.ceil((Mo + 1) / 3);
    const isLeap = (Y % 4 === 0 && Y % 100 !== 0) || Y % 400 === 0;

    return [
      { label: 'ISO 8601 (date)',         value: `${Y}-${pad(Mo+1)}-${pad(D)}` },
      { label: 'ISO 8601 (datetime)',      value: `${Y}-${pad(Mo+1)}-${pad(D)}T${pad(h)}:${pad(mi)}:${pad(sc)}` },
      { label: 'ISO 8601 (timezone)',      value: `${Y}-${pad(Mo+1)}-${pad(D)}T${pad(h)}:${pad(mi)}:${pad(sc)}${tzSign}${tzH}:${tzM}` },
      { label: 'Timestamp Unix (s)',       value: String(ts) },
      { label: 'Timestamp Unix (ms)',      value: String(tsMs) },
      { label: 'Français long',            value: `${DAYS_FR[d.getDay()]} ${D} ${MONTHS_FR[Mo]} ${Y}` },
      { label: 'Français court',           value: `${pad(D)}/${pad(Mo+1)}/${Y}` },
      { label: 'Français avec heure',      value: `${pad(D)}/${pad(Mo+1)}/${Y} à ${pad(h)}h${pad(mi)}` },
      { label: 'Heure (HH:mm:ss)',          value: `${pad(h)}:${pad(mi)}:${pad(sc)}` },
      { label: 'Heure (HH:mm)',             value: `${pad(h)}:${pad(mi)}` },
      { label: 'Anglais long',             value: `${DAYS_EN_S[d.getDay()]}, ${D} ${MONTHS_EN[Mo]} ${Y}` },
      { label: 'Anglais court (MM/DD)',    value: `${pad(Mo+1)}/${pad(D)}/${Y}` },
      { label: 'RFC 2822',                 value: `${DAYS_EN_S[d.getDay()]}, ${pad(D)} ${MONTHS_EN_S[Mo]} ${Y} ${pad(h)}:${pad(mi)}:${pad(sc)} ${tzSign}${tzH}${tzM}` },
      { label: 'Semaine ISO',              value: `S${pad(week)} ${wYear}` },
      { label: 'Trimestre',                value: `T${quarter} ${Y}` },
      { label: `Jour de l'année`,          value: `Jour ${dayOfYear} / ${isLeap ? 366 : 365}` },
      { label: 'Relatif',                  value: relTime(d) },
    ];
  }

  // ══════════════════════════════════════════════
  // RENDU
  // ══════════════════════════════════════════════

  function renderFormats(d) {
    const list = document.getElementById('dt-formats-list');
    if (!d) {
      list.innerHTML = '<div class="dt-empty">Les formats s\'afficheront ici</div>';
      return;
    }
    const formats = formatAll(d);
    list.innerHTML = formats.map(f => `
      <div class="dt-fmt-row">
        <span class="dt-fmt-label">${f.label}</span>
        <span class="dt-fmt-value">${f.value}</span>
        <button class="dt-fmt-copy" data-value="${f.value.replace(/"/g,'&quot;')}">Copier</button>
      </div>`
    ).join('');
    list.querySelectorAll('.dt-fmt-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.value).then(() => {
          btn.textContent = '✓'; btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copier'; btn.classList.remove('copied'); }, 1800);
        });
      });
    });
  }

  // ══════════════════════════════════════════════
  // CONVERTISSEUR PRINCIPAL
  // ══════════════════════════════════════════════

  function run() {
    const raw = document.getElementById('dt-input').value.trim();
    const dot = document.getElementById('dt-dot');
    const msg = document.getElementById('dt-status-msg');
    const det = document.getElementById('dt-detected');
    const inp = document.getElementById('dt-input');

    if (!raw) {
      dot.style.background = 'var(--muted2)';
      msg.textContent = 'Saisissez ou collez une date dans n\'importe quel format';
      det.textContent = '';
      inp.classList.remove('err');
      renderFormats(null);
      renderCode(null);
      return;
    }

    const d = parseDate(raw);
    if (!d) {
      dot.style.background = '#D85A30';
      msg.textContent = 'Format non reconnu';
      det.textContent = '';
      inp.classList.add('err');
      renderFormats(null);
      renderCode(null);
      return;
    }

    inp.classList.remove('err');
    dot.style.background = '#1D9E75';
    msg.textContent = d.toLocaleString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
    det.textContent = 'Détecté : ' + detectFormat(raw);
    renderFormats(d);
    renderCode(d);
  }

  document.getElementById('dt-input').addEventListener('input', run);
  document.getElementById('dt-now-btn').addEventListener('click', () => {
    document.getElementById('dt-input').value = new Date().toISOString();
    run();
  });

  // ══════════════════════════════════════════════
  // ÉCART ENTRE DEUX DATES
  // ══════════════════════════════════════════════

  function runDiff() {
    const a = parseDate(document.getElementById('dt-diff-a').value);
    const b = parseDate(document.getElementById('dt-diff-b').value);
    const res = document.getElementById('dt-diff-result');

    document.getElementById('dt-diff-a').classList.toggle('err', !!document.getElementById('dt-diff-a').value && !a);
    document.getElementById('dt-diff-b').classList.toggle('err', !!document.getElementById('dt-diff-b').value && !b);

    if (!a || !b) { res.classList.remove('visible'); return; }

    const ms = Math.abs(b - a);
    const totalDays  = Math.floor(ms / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const remDays    = totalDays % 7;
    const totalH     = Math.floor(ms / 3600000);

    const [start, end] = a < b ? [a, b] : [b, a];
    let years  = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    if (months < 0) { years--; months += 12; }
    const remDaysM = Math.floor((end - new Date(start.getFullYear() + years, start.getMonth() + months, start.getDate())) / 86400000);

    res.classList.add('visible');
    res.innerHTML = [
      ['Durée exacte', `${totalDays} jour${totalDays > 1 ? 's' : ''}`],
      ['En semaines',  `${totalWeeks} sem.${remDays ? ` + ${remDays}j` : ''}`],
      ['En mois/ans',  `${years > 0 ? years + ' an' + (years>1?'s':'') + ' ' : ''}${months > 0 ? months + ' mois ' : ''}${remDaysM > 0 ? remDaysM + 'j' : ''}`],
      ['Total heures', `${totalH.toLocaleString('fr-FR')} h`],
    ].map(([l, v]) => `<div class="dt-result-row"><span class="dt-result-label">${l}</span><span class="dt-result-val">${v || '0j'}</span></div>`).join('');
  }

  document.getElementById('dt-diff-a').addEventListener('input', runDiff);
  document.getElementById('dt-diff-b').addEventListener('input', runDiff);

  // ══════════════════════════════════════════════
  // AJOUTER / SOUSTRAIRE
  // ══════════════════════════════════════════════

  function runCalc() {
    const d    = parseDate(document.getElementById('dt-calc-date').value);
    const op   = document.getElementById('dt-calc-op').value;
    const n    = parseInt(document.getElementById('dt-calc-n').value) || 0;
    const unit = document.getElementById('dt-calc-unit').value;
    const res  = document.getElementById('dt-calc-result');

    document.getElementById('dt-calc-date').classList.toggle('err', !!document.getElementById('dt-calc-date').value && !d);

    if (!d || !n) { res.classList.remove('visible'); return; }

    const sign = op === '+' ? 1 : -1;
    const result = new Date(d);

    if      (unit === 'd') result.setDate(result.getDate()             + sign * n);
    else if (unit === 'w') result.setDate(result.getDate()             + sign * n * 7);
    else if (unit === 'm') result.setMonth(result.getMonth()           + sign * n);
    else if (unit === 'y') result.setFullYear(result.getFullYear()     + sign * n);

    res.classList.add('visible');
    const Y = result.getFullYear(), Mo = result.getMonth(), D = result.getDate();
    res.innerHTML = `
      <div class="dt-result-row"><span class="dt-result-main">${DAYS_FR[result.getDay()]} ${D} ${MONTHS_FR[Mo]} ${Y}</span></div>
      <div class="dt-result-row">
        <span class="dt-result-label">ISO</span>
        <span class="dt-result-val">${Y}-${pad(Mo+1)}-${pad(D)}</span>
      </div>
      <div class="dt-result-row">
        <span class="dt-result-label">Français</span>
        <span class="dt-result-val">${pad(D)}/${pad(Mo+1)}/${Y}</span>
      </div>
      <div class="dt-result-row">
        <span class="dt-result-label">Unix (s)</span>
        <span class="dt-result-val">${Math.floor(result.getTime()/1000)}</span>
      </div>`;
  }

  document.getElementById('dt-calc-date').addEventListener('input', runCalc);
  document.getElementById('dt-calc-n').addEventListener('input', runCalc);
  document.getElementById('dt-calc-op').addEventListener('change', runCalc);
  document.getElementById('dt-calc-unit').addEventListener('change', runCalc);

  // ══════════════════════════════════════════════
  // CODE DE CONVERSION
  // ══════════════════════════════════════════════

  let dtLang = 'js';
  let lastDate = null;

  function renderCode(d) {
    const panel = document.getElementById('dt-code-panel');
    if (!d) { panel.style.display = 'none'; return; }
    panel.style.display = '';
    lastDate = d;

    const isoDate = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    const isoDateTime = `${isoDate}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const ts = Math.floor(d.getTime() / 1000);
    const frDate = `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;

    const block = document.getElementById('dt-code');

    if (dtLang === 'js') {
      block.innerHTML =
        `<span class="cc">// ── Parser une date ──────────────────────</span>\n` +
        `<span class="ck">const</span> fromISO = <span class="ck">new</span> Date(<span class="cs">"${isoDateTime}"</span>);\n` +
        `<span class="ck">const</span> fromTS  = <span class="ck">new</span> Date(<span class="cn">${ts}</span> * <span class="cn">1000</span>); <span class="cc">// Unix (s)</span>\n` +
        `<span class="ck">const</span> fromFR  = <span class="cs">"${frDate}"</span>.split(<span class="cs">"/"</span>);\n` +
        `<span class="ck">const</span> fromFRd = <span class="ck">new</span> Date(+fromFR[<span class="cn">2</span>], +fromFR[<span class="cn">1</span>]-<span class="cn">1</span>, +fromFR[<span class="cn">0</span>]);\n\n` +
        `<span class="cc">// ── Formatter une date ───────────────────</span>\n` +
        `<span class="ck">const</span> date   = fromISO;\n` +
        `<span class="ck">const</span> iso    = date.toISOString().slice(<span class="cn">0</span>, <span class="cn">10</span>);\n` +
        `<span class="ck">const</span> fr     = date.toLocaleDateString(<span class="cs">'fr-FR'</span>);\n` +
        `<span class="ck">const</span> frLong = date.toLocaleDateString(<span class="cs">'fr-FR'</span>, {\n` +
        `  weekday: <span class="cs">'long'</span>, year: <span class="cs">'numeric'</span>,\n` +
        `  month: <span class="cs">'long'</span>, day: <span class="cs">'numeric'</span>\n` +
        `});\n` +
        `<span class="ck">const</span> heure  = date.toLocaleTimeString(<span class="cs">'fr-FR'</span>, {\n` +
        `  hour: <span class="cs">'2-digit'</span>, minute: <span class="cs">'2-digit'</span>, second: <span class="cs">'2-digit'</span>\n` +
        `});\n` +
        `<span class="ck">const</span> ts     = Math.floor(date.getTime() / <span class="cn">1000</span>);\n`;
    } else {
      block.innerHTML =
        `<span class="cc">// ── Parser une date ──────────────────────</span>\n` +
        `LocalDate     fromISO = LocalDate.parse(<span class="cs">"${isoDate}"</span>);\n` +
        `LocalDateTime fromDT  = LocalDateTime.parse(<span class="cs">"${isoDateTime}"</span>);\n` +
        `LocalDateTime fromTS  = LocalDateTime.ofEpochSecond(\n` +
        `    <span class="cn">${ts}L</span>, <span class="cn">0</span>, ZoneOffset.UTC);\n` +
        `LocalDate     fromFR  = LocalDate.parse(<span class="cs">"${frDate}"</span>,\n` +
        `    DateTimeFormatter.ofPattern(<span class="cs">"dd/MM/yyyy"</span>));\n\n` +
        `<span class="cc">// ── Formatter une date ───────────────────</span>\n` +
        `DateTimeFormatter fmtFR   = DateTimeFormatter.ofPattern(<span class="cs">"dd/MM/yyyy"</span>);\n` +
        `DateTimeFormatter fmtLong = DateTimeFormatter.ofPattern(\n` +
        `    <span class="cs">"EEEE d MMMM yyyy"</span>, Locale.FRENCH);\n` +
        `DateTimeFormatter fmtTime = DateTimeFormatter.ofPattern(<span class="cs">"HH:mm:ss"</span>);\n\n` +
        `String frStr   = date.format(fmtFR);                          <span class="cc">// "${frDate}"</span>\n` +
        `String isoStr  = date.format(DateTimeFormatter.ISO_LOCAL_DATE); <span class="cc">// "${isoDate}"</span>\n` +
        `String longStr = date.format(fmtLong);\n` +
        `long   ts      = date.atStartOfDay(ZoneOffset.UTC).toEpochSecond();\n`;
    }
  }

  document.getElementById('dt-lang-js').addEventListener('click', () => {
    dtLang = 'js';
    document.getElementById('dt-lang-js').classList.add('active');
    document.getElementById('dt-lang-java').classList.remove('active');
    renderCode(lastDate);
  });
  document.getElementById('dt-lang-java').addEventListener('click', () => {
    dtLang = 'java';
    document.getElementById('dt-lang-java').classList.add('active');
    document.getElementById('dt-lang-js').classList.remove('active');
    renderCode(lastDate);
  });

  // ── Init ──
  document.getElementById('dt-input').value = new Date().toISOString().slice(0, 10);
  run();
}
