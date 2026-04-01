export const meta = { id: 'cron', label: 'CRON' };

export function mount(container) {
  container.innerHTML = `
<div class="tool-wrap">
  <div class="page-header">
    <h1>Générateur CRON</h1>
    <p class="page-desc">Construis, décode et valide des expressions CRON. Support Unix (5 champs) et Spring <code>@Scheduled</code> (6 champs avec secondes).</p>
  </div>

  <!-- Mode -->
  <div class="cron-mode-row">
    <button class="cron-mbtn active" id="cron-mbtn-unix"   onclick="cronSetMode('unix')">Unix / Quartz (5 champs)</button>
    <button class="cron-mbtn"        id="cron-mbtn-spring" onclick="cronSetMode('spring')">Spring @Scheduled (6 champs)</button>
  </div>

  <!-- Expression directe -->
  <div class="card">
    <p class="card-title">Expression CRON</p>
    <div class="cron-input-row">
      <input type="text" id="cron-expr" class="cron-expr-input" placeholder="0 9 * * 1-5"
             oninput="cronFromExpr()" spellcheck="false" autocomplete="off" />
      <button id="cron-copy-btn" onclick="cronCopy()">Copier ↗</button>
    </div>

    <!-- Champs labels -->
    <div class="cron-fields-wrap" id="cron-fields-wrap">
      <div class="cron-field-labels" id="cron-field-labels"></div>
      <div class="cron-field-values" id="cron-field-values"></div>
    </div>

    <!-- Description -->
    <div class="cron-status" id="cron-status">
      <div class="status-dot" id="cron-dot"></div>
      <span id="cron-desc">Saisissez ou construisez une expression CRON</span>
    </div>
  </div>

  <!-- Constructeur visuel -->
  <div class="card">
    <p class="card-title">Constructeur visuel</p>

    <div class="cron-builder" id="cron-builder">
      <!-- Secondes (Spring uniquement) -->
      <div class="cron-section" id="section-seconds" style="display:none;">
        <div class="cron-section-title">Secondes</div>
        <div class="cron-presets" id="presets-seconds"></div>
        <div class="cron-custom-row">
          <input type="text" class="cron-custom-input" id="custom-seconds" placeholder="0" oninput="cronFromBuilder()">
          <span class="cron-custom-hint">0–59, * , , - /</span>
        </div>
      </div>

      <!-- Minutes -->
      <div class="cron-section">
        <div class="cron-section-title">Minutes</div>
        <div class="cron-presets" id="presets-minutes"></div>
        <div class="cron-custom-row">
          <input type="text" class="cron-custom-input" id="custom-minutes" placeholder="*" oninput="cronFromBuilder()">
          <span class="cron-custom-hint">0–59, * , , - /</span>
        </div>
      </div>

      <!-- Heures -->
      <div class="cron-section">
        <div class="cron-section-title">Heures</div>
        <div class="cron-presets" id="presets-hours"></div>
        <div class="cron-custom-row">
          <input type="text" class="cron-custom-input" id="custom-hours" placeholder="*" oninput="cronFromBuilder()">
          <span class="cron-custom-hint">0–23, * , , - /</span>
        </div>
      </div>

      <!-- Jour du mois -->
      <div class="cron-section">
        <div class="cron-section-title">Jour du mois</div>
        <div class="cron-presets" id="presets-dom"></div>
        <div class="cron-custom-row">
          <input type="text" class="cron-custom-input" id="custom-dom" placeholder="*" oninput="cronFromBuilder()">
          <span class="cron-custom-hint">1–31, * , , - /</span>
        </div>
      </div>

      <!-- Mois -->
      <div class="cron-section">
        <div class="cron-section-title">Mois</div>
        <div class="cron-presets" id="presets-months"></div>
        <div class="cron-custom-row">
          <input type="text" class="cron-custom-input" id="custom-months" placeholder="*" oninput="cronFromBuilder()">
          <span class="cron-custom-hint">1–12 ou JAN–DEC, *</span>
        </div>
      </div>

      <!-- Jour de la semaine -->
      <div class="cron-section">
        <div class="cron-section-title">Jour de la semaine</div>
        <div class="cron-presets" id="presets-dow"></div>
        <div class="cron-custom-row">
          <input type="text" class="cron-custom-input" id="custom-dow" placeholder="*" oninput="cronFromBuilder()">
          <span class="cron-custom-hint">0–7 (0=dim), MON–SUN, *</span>
        </div>
      </div>
    </div>

    <!-- Expressions fréquentes -->
    <div class="sep"></div>
    <p class="card-title" style="margin-bottom:.6rem;">Expressions fréquentes</p>
    <div class="cron-shortcuts" id="cron-shortcuts"></div>
  </div>

  <!-- Prochaines exécutions -->
  <div class="card" id="cron-next-card" style="display:none;">
    <p class="card-title">Prochaines exécutions</p>
    <div class="cron-next-list" id="cron-next-list"></div>
  </div>

  <!-- Export Spring -->
  <div class="card" id="cron-spring-card" style="display:none;">
    <p class="card-title">Code Spring Boot</p>
    <div class="cron-code-block" id="cron-spring-code"></div>
  </div>

  <p class="note">Tout est calculé localement dans votre navigateur.</p>
</div>`;

  // ─── CSS spécifique injecté ───
  if (!document.getElementById('cron-style')) {
    const s = document.createElement('style');
    s.id = 'cron-style';
    s.textContent = `
      .cron-mode-row { display:flex; gap:8px; margin-bottom:1rem; }
      .cron-mbtn { flex:1; padding:9px; border-radius:8px; border:0.5px solid var(--border); background:var(--surface); color:var(--muted); cursor:pointer; font-size:13px; font-family:inherit; font-weight:500; transition:background .15s; }
      .cron-mbtn.active { background:#E6F1FB; color:#0C447C; border-color:#85B7EB; }

      .cron-input-row { display:flex; gap:8px; align-items:center; margin-bottom:12px; }
      .cron-expr-input { flex:1; font-family:'JetBrains Mono','Fira Mono',monospace; font-size:18px; letter-spacing:.08em; padding:10px 14px; border-radius:8px; border:0.5px solid var(--border); background:var(--input-bg); color:var(--text); outline:none; transition:border-color .15s; }
      .cron-expr-input:focus { border-color:var(--accent); }
      .cron-expr-input.err { border-color:#D85A30; background:#FAECE7; }

      .cron-field-labels, .cron-field-values { display:flex; gap:4px; }
      .cron-field-label { flex:1; text-align:center; font-size:10px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; padding:2px 0; }
      .cron-field-value { flex:1; text-align:center; font-size:13px; font-family:monospace; font-weight:600; padding:4px 0; border-radius:5px; background:var(--surface2); color:var(--accent); border:0.5px solid var(--border); }

      .cron-status { display:flex; align-items:center; gap:8px; margin-top:10px; padding:10px 14px; border-radius:8px; border:0.5px solid var(--border); font-size:13px; color:var(--text); }
      .cron-status .status-dot { flex-shrink:0; }

      .cron-builder { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
      @media(max-width:600px){ .cron-builder { grid-template-columns:1fr; } }
      .cron-section { background:var(--surface2); border-radius:10px; padding:12px; border:0.5px solid var(--border); }
      .cron-section-title { font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; margin-bottom:8px; }
      .cron-presets { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px; }
      .cron-preset { font-size:11px; padding:3px 10px; border-radius:6px; border:0.5px solid var(--border); background:var(--surface); color:var(--text); cursor:pointer; transition:background .12s, border-color .12s; font-family:inherit; }
      .cron-preset:hover { border-color:var(--accent); color:var(--accent); }
      .cron-preset.active { background:#E6F1FB; color:#0C447C; border-color:#85B7EB; font-weight:600; }
      .cron-custom-row { display:flex; align-items:center; gap:8px; }
      .cron-custom-input { flex:1; padding:6px 10px; border-radius:7px; border:0.5px solid var(--border); background:var(--input-bg); color:var(--text); font-size:13px; font-family:monospace; outline:none; }
      .cron-custom-input:focus { border-color:var(--accent); }
      .cron-custom-hint { font-size:10px; color:var(--muted2); white-space:nowrap; }

      .cron-shortcuts { display:flex; flex-wrap:wrap; gap:6px; }
      .cron-shortcut { font-size:12px; padding:5px 12px; border-radius:8px; border:0.5px solid var(--border); background:var(--surface); color:var(--text); cursor:pointer; transition:background .12s; font-family:inherit; display:flex; flex-direction:column; gap:2px; }
      .cron-shortcut:hover { background:var(--surface2); border-color:var(--accent); }
      .cron-shortcut .sc-label { font-weight:600; font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.04em; }
      .cron-shortcut .sc-expr  { font-family:monospace; font-size:12px; color:var(--accent); }

      .cron-next-list { display:flex; flex-direction:column; gap:4px; }
      .cron-next-item { display:flex; align-items:center; gap:10px; padding:7px 12px; border-radius:7px; background:var(--surface2); font-size:13px; }
      .cron-next-item .ni-idx { font-size:11px; color:var(--muted2); width:20px; text-align:right; flex-shrink:0; }
      .cron-next-item .ni-date { font-weight:500; color:var(--text); flex:1; }
      .cron-next-item .ni-rel  { font-size:11px; color:var(--muted); }

      .cron-code-block { background:var(--input-bg); border:0.5px solid var(--border); border-radius:8px; padding:14px; font-family:'JetBrains Mono','Fira Mono',monospace; font-size:12px; line-height:1.7; color:var(--text); white-space:pre; overflow-x:auto; }
      .cron-code-block .ck  { color:var(--c-bool); }
      .cron-code-block .cs  { color:var(--c-str); }
      .cron-code-block .cc  { color:var(--c-comment); }
    `;
    document.head.appendChild(s);
  }

  // ─── State ───
  let cronMode = 'unix'; // 'unix' | 'spring'

  // ─── Presets par champ ───
  const PRESETS = {
    seconds: [
      { label:'0', value:'0' }, { label:'*/5', value:'*/5' }, { label:'*/10', value:'*/10' }, { label:'*/30', value:'*/30' }, { label:'*', value:'*' }
    ],
    minutes: [
      { label:'0', value:'0' }, { label:'*/5', value:'*/5' }, { label:'*/10', value:'*/10' }, { label:'*/15', value:'*/15' }, { label:'*/30', value:'*/30' }, { label:'*', value:'*' }
    ],
    hours: [
      { label:'*', value:'*' }, { label:'0', value:'0' }, { label:'6', value:'6' }, { label:'8', value:'8' }, { label:'12', value:'12' }, { label:'18', value:'18' }, { label:'*/2', value:'*/2' }, { label:'*/6', value:'*/6' }
    ],
    dom: [
      { label:'*', value:'*' }, { label:'1', value:'1' }, { label:'15', value:'15' }, { label:'L', value:'L' }, { label:'1,15', value:'1,15' }
    ],
    months: [
      { label:'*', value:'*' }, { label:'Jan', value:'1' }, { label:'Fév', value:'2' }, { label:'Mar', value:'3' }, { label:'Avr', value:'4' },
      { label:'Mai', value:'5' }, { label:'Jun', value:'6' }, { label:'Jul', value:'7' }, { label:'Aoû', value:'8' },
      { label:'Sep', value:'9' }, { label:'Oct', value:'10' }, { label:'Nov', value:'11' }, { label:'Déc', value:'12' }
    ],
    dow: [
      { label:'*', value:'*' }, { label:'Lun', value:'1' }, { label:'Mar', value:'2' }, { label:'Mer', value:'3' },
      { label:'Jeu', value:'4' }, { label:'Ven', value:'5' }, { label:'Sam', value:'6' }, { label:'Dim', value:'0' },
      { label:'Lun–Ven', value:'1-5' }, { label:'Sam–Dim', value:'6,0' }
    ]
  };

  const SHORTCUTS = [
    { label:'Chaque minute',        expr5:'* * * * *',       expr6:'0 * * * * *',      desc:'Toutes les minutes' },
    { label:'Chaque heure',         expr5:'0 * * * *',       expr6:'0 0 * * * *',      desc:'Au début de chaque heure' },
    { label:'Chaque jour à minuit', expr5:'0 0 * * *',       expr6:'0 0 0 * * *',      desc:'Tous les jours à 00:00' },
    { label:'Chaque jour à 8h',     expr5:'0 8 * * *',       expr6:'0 0 8 * * *',      desc:'Tous les jours à 08:00' },
    { label:'Jours ouvrés à 9h',    expr5:'0 9 * * 1-5',     expr6:'0 0 9 * * 1-5',   desc:'Lun–Ven à 09:00' },
    { label:'Chaque lundi à 6h',    expr5:'0 6 * * 1',       expr6:'0 0 6 * * 1',      desc:'Tous les lundis à 06:00' },
    { label:'Toutes les 15 min',    expr5:'*/15 * * * *',    expr6:'0 */15 * * * *',   desc:'Toutes les 15 minutes' },
    { label:'Toutes les 30 min',    expr5:'*/30 * * * *',    expr6:'0 */30 * * * *',   desc:'Toutes les 30 minutes' },
    { label:'1er du mois à 0h',     expr5:'0 0 1 * *',       expr6:'0 0 0 1 * *',      desc:'Le 1er de chaque mois à minuit' },
    { label:'Chaque dimanche 2h',   expr5:'0 2 * * 0',       expr6:'0 0 2 * * 0',      desc:'Chaque dimanche à 02:00' },
    { label:'Toutes les 5 min',     expr5:'*/5 * * * *',     expr6:'0 */5 * * * *',    desc:'Toutes les 5 minutes' },
    { label:'Chaque année (1 jan)', expr5:'0 0 1 1 *',       expr6:'0 0 0 1 1 *',      desc:'Le 1er janvier à minuit' },
  ];

  const FIELD_LABELS_UNIX   = ['Minutes', 'Heures', 'Jour mois', 'Mois', 'Jour sem.'];
  const FIELD_LABELS_SPRING = ['Secondes', 'Minutes', 'Heures', 'Jour mois', 'Mois', 'Jour sem.'];

  // ─── Init ───
  renderPresets();
  renderShortcuts();
  cronSetFieldLabels();
  cronFromExpr();

  // ─── Mode ───
  window.cronSetMode = m => {
    cronMode = m;
    document.getElementById('cron-mbtn-unix').classList.toggle('active', m==='unix');
    document.getElementById('cron-mbtn-spring').classList.toggle('active', m==='spring');
    document.getElementById('section-seconds').style.display = m==='spring' ? '' : 'none';
    cronSetFieldLabels();
    // Adapter l'expression si besoin
    const expr = document.getElementById('cron-expr').value.trim();
    const parts = expr.split(/\s+/);
    if (m==='spring' && parts.length===5) {
      document.getElementById('cron-expr').value = '0 ' + expr;
      document.getElementById('custom-seconds').value = '0';
    } else if (m==='unix' && parts.length===6) {
      document.getElementById('cron-expr').value = parts.slice(1).join(' ');
    }
    cronFromExpr();
  };

  function cronSetFieldLabels() {
    const labels = cronMode==='spring' ? FIELD_LABELS_SPRING : FIELD_LABELS_UNIX;
    document.getElementById('cron-field-labels').innerHTML = labels.map(l=>`<div class="cron-field-label">${l}</div>`).join('');
    syncFieldValues(document.getElementById('cron-expr').value.trim());
  }

  // ─── Render presets ───
  function renderPresets() {
    renderFieldPresets('presets-seconds', PRESETS.seconds, 'seconds');
    renderFieldPresets('presets-minutes', PRESETS.minutes, 'minutes');
    renderFieldPresets('presets-hours',   PRESETS.hours,   'hours');
    renderFieldPresets('presets-dom',     PRESETS.dom,     'dom');
    renderFieldPresets('presets-months',  PRESETS.months,  'months');
    renderFieldPresets('presets-dow',     PRESETS.dow,     'dow');
  }

  function renderFieldPresets(containerId, presets, field) {
    document.getElementById(containerId).innerHTML = presets.map(p =>
      `<button class="cron-preset" data-field="${field}" data-value="${p.value}" onclick="cronPresetClick(this,'${field}','${p.value}')">${p.label}</button>`
    ).join('');
  }

  function renderShortcuts() {
    document.getElementById('cron-shortcuts').innerHTML = SHORTCUTS.map(s => {
      const expr = cronMode==='spring' ? s.expr6 : s.expr5;
      return `<button class="cron-shortcut" onclick="cronApplyShortcut('${s.expr5}','${s.expr6}')">
        <span class="sc-label">${s.label}</span>
        <span class="sc-expr">${expr}</span>
      </button>`;
    }).join('');
  }

  window.cronApplyShortcut = (expr5, expr6) => {
    const expr = cronMode==='spring' ? expr6 : expr5;
    document.getElementById('cron-expr').value = expr;
    cronFromExpr();
  };

  window.cronPresetClick = (btn, field, value) => {
    // Mettre à jour le custom input correspondant
    const inputId = { seconds:'custom-seconds', minutes:'custom-minutes', hours:'custom-hours', dom:'custom-dom', months:'custom-months', dow:'custom-dow' }[field];
    document.getElementById(inputId).value = value;
    // Highlight preset actif
    document.querySelectorAll(`.cron-preset[data-field="${field}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    cronFromBuilder();
  };

  // ─── Builder → Expression ───
  window.cronFromBuilder = () => {
    const get = id => document.getElementById(id).value.trim() || '*';
    let parts;
    if (cronMode==='spring') {
      parts = [get('custom-seconds'), get('custom-minutes'), get('custom-hours'), get('custom-dom'), get('custom-months'), get('custom-dow')];
    } else {
      parts = [get('custom-minutes'), get('custom-hours'), get('custom-dom'), get('custom-months'), get('custom-dow')];
    }
    document.getElementById('cron-expr').value = parts.join(' ');
    cronValidateAndDescribe(parts.join(' '));
  };

  // ─── Expression → Builder + Description ───
  window.cronFromExpr = () => {
    const expr = document.getElementById('cron-expr').value.trim();
    const parts = expr.split(/\s+/);
    const n = cronMode==='spring' ? 6 : 5;

    // Sync builder inputs
    if (parts.length === n) {
      if (cronMode==='spring') {
        setBuilderField('custom-seconds', 'presets-seconds', PRESETS.seconds, parts[0]);
        setBuilderField('custom-minutes', 'presets-minutes', PRESETS.minutes, parts[1]);
        setBuilderField('custom-hours',   'presets-hours',   PRESETS.hours,   parts[2]);
        setBuilderField('custom-dom',     'presets-dom',     PRESETS.dom,     parts[3]);
        setBuilderField('custom-months',  'presets-months',  PRESETS.months,  parts[4]);
        setBuilderField('custom-dow',     'presets-dow',     PRESETS.dow,     parts[5]);
      } else {
        setBuilderField('custom-minutes', 'presets-minutes', PRESETS.minutes, parts[0]);
        setBuilderField('custom-hours',   'presets-hours',   PRESETS.hours,   parts[1]);
        setBuilderField('custom-dom',     'presets-dom',     PRESETS.dom,     parts[2]);
        setBuilderField('custom-months',  'presets-months',  PRESETS.months,  parts[3]);
        setBuilderField('custom-dow',     'presets-dow',     PRESETS.dow,     parts[4]);
      }
    }

    cronValidateAndDescribe(expr);
    renderShortcuts(); // refresh les exprs selon le mode
  };

  function setBuilderField(inputId, presetsId, presets, value) {
    document.getElementById(inputId).value = value;
    document.querySelectorAll(`#${presetsId} .cron-preset`).forEach(b => {
      b.classList.toggle('active', b.dataset.value === value);
    });
  }

  // ─── Validation + Description ───
  function cronValidateAndDescribe(expr) {
    const parts = expr.trim().split(/\s+/);
    const n = cronMode==='spring' ? 6 : 5;
    const dot = document.getElementById('cron-dot');
    const desc = document.getElementById('cron-desc');
    const input = document.getElementById('cron-expr');
    const nextCard = document.getElementById('cron-next-card');
    const springCard = document.getElementById('cron-spring-card');

    syncFieldValues(expr);

    if (parts.length !== n) {
      dot.className = 'status-dot';
      dot.style.background = '#BA7517';
      desc.textContent = `Expression incomplète — ${parts.length} champ${parts.length>1?'s':''} sur ${n} attendus`;
      input.classList.add('err');
      nextCard.style.display = 'none';
      springCard.style.display = 'none';
      return;
    }

    const result = describeCron(parts, cronMode);
    if (result.error) {
      dot.className = 'status-dot'; dot.style.background = '#D85A30';
      desc.textContent = '⚠ ' + result.error;
      input.classList.add('err');
      nextCard.style.display = 'none';
      springCard.style.display = 'none';
    } else {
      dot.className = 'status-dot'; dot.style.background = '#1D9E75';
      desc.textContent = result.description;
      input.classList.remove('err');
      // Prochaines exécutions
      const nexts = computeNextRuns(parts, cronMode, 8);
      if (nexts.length) {
        nextCard.style.display = '';
        document.getElementById('cron-next-list').innerHTML = nexts.map((d,i) => {
          const rel = relativeTime(d);
          return `<div class="cron-next-item"><span class="ni-idx">${i+1}</span><span class="ni-date">${formatDate(d)}</span><span class="ni-rel">${rel}</span></div>`;
        }).join('');
      } else {
        nextCard.style.display = 'none';
      }
      // Code Spring
      const springExpr = cronMode==='spring' ? expr : '0 ' + expr;
      springCard.style.display = '';
      document.getElementById('cron-spring-code').innerHTML =
        `<span class="cc">// Spring Boot — @Scheduled</span>\n` +
        `<span class="ck">@Scheduled</span>(<span class="cs">cron = "${springExpr}"</span>)\n` +
        `<span class="ck">public void</span> maMethodePlanifiee() {\n` +
        `    <span class="cc">// ${result.description}</span>\n` +
        `    <span class="cc">// TODO: implémenter la logique</span>\n` +
        `}`;
    }
  }

  function syncFieldValues(expr) {
    const parts = expr.trim().split(/\s+/);
    const n = cronMode==='spring' ? 6 : 5;
    const vals = document.getElementById('cron-field-values');
    if (parts.length >= 1 && parts[0]) {
      vals.innerHTML = parts.slice(0, n).map(p => `<div class="cron-field-value">${p||'?'}</div>`).join('');
    } else {
      vals.innerHTML = Array(n).fill('<div class="cron-field-value">?</div>').join('');
    }
  }

  // ─── Description en français ───
  function describeCron(parts, mode) {
    try {
      let sec='', min, hour, dom, month, dow;
      if (mode==='spring') {
        [sec, min, hour, dom, month, dow] = parts;
      } else {
        [min, hour, dom, month, dow] = parts;
      }

      const chunks = [];

      // Secondes
      if (mode==='spring' && sec !== '0' && sec !== '*') chunks.push('à la seconde ' + descField(sec, 'seconde', 0, 59));
      else if (mode==='spring' && sec === '*') chunks.push('chaque seconde');

      // Minutes
      if (min === '*') chunks.push('chaque minute');
      else if (min.startsWith('*/')) chunks.push(`toutes les ${min.slice(2)} minutes`);
      else if (min === '0') {} // silencieux si 0
      else chunks.push('à la minute ' + descField(min, 'minute', 0, 59));

      // Heures
      if (hour === '*') {} // déjà couvert par "chaque minute"
      else if (hour.startsWith('*/')) chunks.push(`toutes les ${hour.slice(2)} heures`);
      else if (hour.includes('-')) {
        const [h1,h2] = hour.split('-');
        chunks.push(`entre ${h1}h et ${h2}h`);
      }
      else chunks.push(`à ${hour.padStart(2,'0')}h${min==='0'?'00':min==='*'?'':min.padStart(2,'0')}`);

      // Jour du mois
      if (dom !== '*' && dom !== '?') {
        if (dom === 'L') chunks.push('le dernier jour du mois');
        else if (dom.includes('/')) { const [,step]=dom.split('/'); chunks.push(`tous les ${step} jours`); }
        else chunks.push(`le ${dom} du mois`);
      }

      // Mois
      const MONTH_FR = ['','janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
      if (month !== '*' && month !== '?') {
        const ms = month.split(',').map(m => {
          const n = parseInt(m);
          return isNaN(n) ? m : (MONTH_FR[n] || m);
        });
        chunks.push('en ' + ms.join(', '));
      }

      // Jour de la semaine
      const DOW_FR = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
      if (dow !== '*' && dow !== '?') {
        if (dow === '1-5') chunks.push('du lundi au vendredi');
        else if (dow === '6,0' || dow === '0,6') chunks.push('le week-end');
        else {
          const days = dow.split(',').map(d => {
            if (d.includes('-')) { const [a,b]=d.split('-'); return `${DOW_FR[+a]||d} au ${DOW_FR[+b]||d}`; }
            return DOW_FR[parseInt(d)] || d;
          });
          chunks.push('le ' + days.join(', '));
        }
      }

      if (!chunks.length) return { description: 'Toutes les minutes' };

      // Construire la phrase
      let description = capitalizeFirst(chunks.join(', '));
      return { description };
    } catch(e) {
      return { error: 'Expression non reconnue : ' + e.message };
    }
  }

  function descField(val, unit, min, max) {
    if (val.includes(',')) return val.split(',').join(', ');
    if (val.includes('-')) { const [a,b]=val.split('-'); return `${a} à ${b}`; }
    if (val.includes('/')) { const [,s]=val.split('/'); return `toutes les ${s} ${unit}s`; }
    return val;
  }

  function capitalizeFirst(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ─── Calcul des prochaines exécutions ───
  function computeNextRuns(parts, mode, count) {
    const results = [];
    let sec, min, hour, dom, month, dow;
    if (mode==='spring') [sec,min,hour,dom,month,dow] = parts;
    else { sec='0'; [min,hour,dom,month,dow] = parts; }

    const now = new Date();
    let cursor = new Date(now);
    cursor.setMilliseconds(0);
    cursor.setSeconds(cursor.getSeconds() + 1);

    const MAX_ITER = 500000;
    let iter = 0;

    while (results.length < count && iter < MAX_ITER) {
      iter++;
      if (matchField(cursor.getMonth()+1, month, 1, 12) &&
          matchField(cursor.getDate(), dom, 1, 31) &&
          matchDow(cursor.getDay(), dow) &&
          matchField(cursor.getHours(), hour, 0, 23) &&
          matchField(cursor.getMinutes(), min, 0, 59) &&
          matchField(cursor.getSeconds(), sec, 0, 59)) {
        results.push(new Date(cursor));
        cursor.setSeconds(cursor.getSeconds() + 1);
      } else {
        cursor.setSeconds(cursor.getSeconds() + 1);
      }
      if (cursor - now > 366 * 24 * 3600 * 1000) break;
    }
    return results;
  }

  function matchField(val, expr, min, max) {
    if (expr==='*'||expr==='?') return true;
    if (expr==='L') return val === new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
    for (const part of expr.split(',')) {
      if (part.includes('/')) {
        const [base,step] = part.split('/');
        const start = base==='*' ? min : parseInt(base);
        if (val >= start && (val - start) % parseInt(step) === 0) return true;
      } else if (part.includes('-')) {
        const [a,b] = part.split('-');
        if (val >= parseInt(a) && val <= parseInt(b)) return true;
      } else {
        if (val === parseInt(part)) return true;
      }
    }
    return false;
  }

  function matchDow(dayJs, expr) {
    // dayJs: 0=dim, 1=lun... 6=sam
    if (expr==='*'||expr==='?') return true;
    // normalise 7→0
    for (const part of expr.split(',')) {
      if (part.includes('-')) {
        const [a,b] = part.split('-');
        let pa=parseInt(a)%7, pb=parseInt(b)%7;
        if (pa<=pb){ if(dayJs>=pa&&dayJs<=pb)return true; }
        else { if(dayJs>=pa||dayJs<=pb)return true; }
      } else {
        if (dayJs === parseInt(part)%7) return true;
      }
    }
    return false;
  }

  // ─── Formatage dates ───
  function formatDate(d) {
    const jours = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
    const mois  = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
    return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]} ${d.getFullYear()} — ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
  }

  function relativeTime(d) {
    const diff = d - Date.now();
    const s = Math.floor(diff/1000);
    if (s < 60) return `dans ${s}s`;
    const m = Math.floor(s/60);
    if (m < 60) return `dans ${m}min`;
    const h = Math.floor(m/60);
    if (h < 24) return `dans ${h}h`;
    const day = Math.floor(h/24);
    return `dans ${day}j`;
  }

  // ─── Copier ───
  window.cronCopy = () => {
    const expr = document.getElementById('cron-expr').value.trim();
    if (!expr) return;
    navigator.clipboard.writeText(expr).then(() => {
      const btn = document.getElementById('cron-copy-btn');
      btn.textContent = 'Copié !'; btn.classList.add('success');
      setTimeout(() => { btn.textContent = 'Copier ↗'; btn.classList.remove('success'); }, 2200);
    });
  };

  // ─── Init avec un exemple ───
  document.getElementById('cron-expr').value = '0 9 * * 1-5';
  document.getElementById('custom-minutes').value = '0';
  document.getElementById('custom-hours').value = '9';
  document.getElementById('custom-dom').value = '*';
  document.getElementById('custom-months').value = '*';
  document.getElementById('custom-dow').value = '1-5';
  cronFromExpr();
}
