export const meta = { id: 'cron', label: 'CRON' };

export function mount(container) {

  // ── CSS injecté une seule fois ──
  if (!document.getElementById('cron-style')) {
    const s = document.createElement('style');
    s.id = 'cron-style';
    s.textContent = `
      .cron-mode-row { display:flex; gap:8px; margin-bottom:1rem; }
      .cron-mbtn { flex:1; padding:9px; border-radius:8px; border:0.5px solid var(--border); background:var(--surface); color:var(--muted); cursor:pointer; font-size:13px; font-family:inherit; font-weight:500; transition:background .15s; }
      .cron-mbtn.active { background:#E6F1FB; color:#0C447C; border-color:#85B7EB; }

      .cron-mode-explain { font-size:12px; color:var(--muted); background:var(--surface2); border-radius:8px; padding:10px 14px; margin-bottom:1rem; border-left:3px solid var(--accent); line-height:1.6; }
      .cron-mode-explain code { font-family:monospace; font-size:11px; background:var(--input-bg); padding:1px 5px; border-radius:3px; }

      .cron-input-row { display:flex; gap:8px; align-items:center; margin-bottom:10px; flex-wrap:wrap; }
      .cron-expr-input { flex:1; min-width:200px; font-family:'JetBrains Mono','Fira Mono',monospace; font-size:18px; letter-spacing:.08em; padding:10px 14px; border-radius:8px; border:0.5px solid var(--border); background:var(--input-bg); color:var(--text); outline:none; transition:border-color .15s; }
      .cron-expr-input:focus { border-color:var(--accent); }
      .cron-expr-input.err { border-color:#D85A30 !important; }

      .cron-field-strip { display:flex; gap:4px; margin-bottom:8px; }
      .cron-field-box { flex:1; display:flex; flex-direction:column; align-items:center; gap:2px; }
      .cron-field-lbl { font-size:9px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.05em; }
      .cron-field-val { width:100%; text-align:center; font-size:13px; font-family:monospace; font-weight:600; padding:4px 2px; border-radius:5px; background:var(--surface2); color:var(--accent); border:0.5px solid var(--border); }

      .cron-status { display:flex; align-items:center; gap:8px; margin-top:10px; padding:10px 14px; border-radius:8px; border:0.5px solid var(--border); font-size:13px; color:var(--text); }
      .cron-status .status-dot { flex-shrink:0; width:10px; height:10px; border-radius:50%; background:var(--muted2); }

      /* Layout grid 2 colonnes pour le tool-wrap du CRON */
      .cron-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        align-items: start;
      }
      .cron-col { display: flex; flex-direction: column; gap: 1rem; }
      @media (max-width: 860px) {
        .cron-grid { grid-template-columns: 1fr; }
      }
      .cron-builder { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      @media(max-width:600px){ .cron-builder { grid-template-columns:1fr; } }
      @media(max-width:640px){
        .cron-mode-row { flex-direction:column; }
        .cron-shortcuts { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .cron-shortcuts::-webkit-scrollbar { display:none; }
        .cron-shortcut { flex-shrink: 0; }
        .cron-next-item { flex-wrap: wrap; gap: 4px; }
        .cron-next-item .ni-rel { margin-left: auto; }
      }

      .cron-section { background:var(--surface2); border-radius:10px; padding:12px; border:0.5px solid var(--border); }
      .cron-section-title { font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; margin-bottom:4px; }
      .cron-section-hint { font-size:11px; color:var(--muted2); margin-bottom:8px; line-height:1.4; }
      .cron-presets { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px; }
      .cron-preset { font-size:11px; padding:3px 10px; border-radius:6px; border:0.5px solid var(--border); background:var(--surface); color:var(--text); cursor:pointer; transition:background .12s; font-family:inherit; }
      .cron-preset:hover { border-color:var(--accent); color:var(--accent); }
      .cron-preset.active { background:#E6F1FB; color:#0C447C; border-color:#85B7EB; font-weight:600; }
      .cron-custom-row { display:flex; align-items:center; gap:8px; }
      .cron-custom-input { flex:1; padding:6px 10px; border-radius:7px; border:0.5px solid var(--border); background:var(--input-bg); color:var(--text); font-size:13px; font-family:monospace; outline:none; }
      .cron-custom-input:focus { border-color:var(--accent); }
      .cron-custom-hint { font-size:10px; color:var(--muted2); white-space:nowrap; }

      .cron-shortcuts { display:flex; flex-wrap:wrap; gap:6px; }
      .cron-shortcut { font-size:12px; padding:6px 12px; border-radius:8px; border:0.5px solid var(--border); background:var(--surface); color:var(--text); cursor:pointer; transition:background .12s; font-family:inherit; display:flex; flex-direction:column; gap:2px; text-align:left; }
      .cron-shortcut:hover { background:var(--surface2); border-color:var(--accent); }
      .cron-shortcut .sc-label { font-weight:600; font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.04em; }
      .cron-shortcut .sc-expr  { font-family:monospace; font-size:12px; color:var(--accent); }

      .cron-next-list { display:flex; flex-direction:column; gap:4px; }
      .cron-next-item { display:flex; align-items:center; gap:10px; padding:7px 12px; border-radius:7px; background:var(--surface2); font-size:13px; }
      .cron-next-item .ni-idx  { font-size:11px; color:var(--muted2); width:20px; text-align:right; flex-shrink:0; }
      .cron-next-item .ni-date { font-weight:500; color:var(--text); flex:1; }
      .cron-next-item .ni-rel  { font-size:11px; color:var(--muted); white-space:nowrap; }

      .cron-code-block { background:var(--input-bg); border:0.5px solid var(--border); border-radius:8px; padding:14px; font-family:'JetBrains Mono','Fira Mono',monospace; font-size:12px; line-height:1.7; color:var(--text); white-space:pre; overflow-x:auto; }
      .cron-code-block .ck { color:var(--c-bool); }
      .cron-code-block .cs { color:var(--c-str); }
      .cron-code-block .cc { color:var(--c-comment); }
    `;
    document.head.appendChild(s);
  }

  // ── HTML ──
  container.innerHTML = `
<div class="page-header">
    <h1>Générateur CRON</h1>
    <p class="page-desc">Construis, décode et valide des expressions CRON avec support Spring <code>@Scheduled</code> (6 champs) et Unix/Quartz (5 champs).</p>
  </div>
<div class="tool-wrap">

  <div class="cron-grid">
    <!-- Colonne 1 : Mode, Explication, Expression, Prochaines exécutions -->
    <div class="cron-col">
  <!-- Mode -->
  <div class="cron-mode-row">
    <button class="cron-mbtn" id="cron-mbtn-spring">Spring @Scheduled (6 champs)</button>
    <button class="cron-mbtn" id="cron-mbtn-unix">Unix / Quartz (5 champs)</button>
  </div>

  <!-- Explication du mode -->
  <div class="cron-mode-explain" id="cron-mode-explain"></div>

  <!-- Expression -->
  <div class="card">
    <p class="card-title">Expression CRON</p>
    <div class="cron-input-row">
      <input type="text" id="cron-expr" class="cron-expr-input" spellcheck="false" autocomplete="off" />
      <button id="cron-copy-btn">Copier ↗</button>
    </div>
    <div class="cron-field-strip" id="cron-field-strip"></div>
    <div class="cron-status">
      <div class="status-dot" id="cron-dot"></div>
      <span id="cron-desc">–</span>
    </div>
  </div>

  <!-- Prochaines exécutions -->
  <div class="card" id="cron-next-card" style="display:none;">
    <p class="card-title">Prochaines exécutions</p>
    <div class="cron-next-list" id="cron-next-list"></div>
  </div>
    </div>

    <!-- Colonne 2 : Constructeur, Expressions fréquentes, Code Spring -->
    <div class="cron-col">
  <!-- Constructeur visuel -->
  <div class="card">
    <p class="card-title">Constructeur visuel</p>
    <div class="cron-builder" id="cron-builder"></div>
  </div>

  <!-- Expressions fréquentes -->
  <div class="card">
    <p class="card-title">Expressions fréquentes</p>
    <div class="cron-shortcuts" id="cron-shortcuts"></div>
  </div>

  <!-- Code Spring -->
  <div class="card" id="cron-spring-card" style="display:none;">
    <p class="card-title">Code Spring Boot</p>
    <div class="cron-code-block" id="cron-spring-code"></div>
  </div>
    </div>
  </div>
  <p class="note">Tout est calculé localement dans votre navigateur.</p>
</div>`;

  // ══════════════════════════════════════════════
  // DONNÉES
  // ══════════════════════════════════════════════

  const MODE_EXPLAIN = {
    spring: `<b>Spring @Scheduled — 6 champs</b> : <code>secondes minutes heures jour-mois mois jour-semaine</code><br>
      Utilisé dans Spring Boot avec l'annotation <code>@Scheduled(cron = "...")</code>. Le premier champ contrôle les secondes (0–59). Exemple : <code>0 30 9 * * 1-5</code> → chaque jour ouvré à 09h30 précise.`,
    unix: `<b>Unix / Crontab — 5 champs</b> : <code>minutes heures jour-mois mois jour-semaine</code><br>
      Format standard utilisé par <code>crontab</code>, Quartz, GitLab CI, etc. Pas de champ secondes — la précision minimale est la minute. Exemple : <code>30 9 * * 1-5</code> → chaque jour ouvré à 09h30.`,
  };

  const FIELDS_SPRING = [
    { id:'seconds', label:'Secondes', hint:'0–59  •  * = chaque seconde  •  */5 = toutes les 5s', range:[0,59],
      presets:[{l:'0',v:'0'},{l:'*/5',v:'*/5'},{l:'*/10',v:'*/10'},{l:'*/30',v:'*/30'},{l:'*',v:'*'}] },
    { id:'minutes', label:'Minutes',  hint:'0–59  •  * = chaque minute  •  */15 = toutes les 15min', range:[0,59],
      presets:[{l:'0',v:'0'},{l:'*/5',v:'*/5'},{l:'*/10',v:'*/10'},{l:'*/15',v:'*/15'},{l:'*/30',v:'*/30'},{l:'*',v:'*'}] },
    { id:'hours',   label:'Heures',   hint:'0–23  •  * = toutes les heures  •  8-18 = entre 8h et 18h', range:[0,23],
      presets:[{l:'0',v:'0'},{l:'6',v:'6'},{l:'8',v:'8'},{l:'12',v:'12'},{l:'18',v:'18'},{l:'*/2',v:'*/2'},{l:'*',v:'*'}] },
    { id:'dom',     label:'Jour mois',hint:'1–31  •  * = tous les jours  •  L = dernier jour du mois', range:[1,31],
      presets:[{l:'*',v:'*'},{l:'1',v:'1'},{l:'15',v:'15'},{l:'L',v:'L'},{l:'1,15',v:'1,15'}] },
    { id:'months',  label:'Mois',     hint:'1–12  •  * = tous les mois  •  1,7 = janvier et juillet', range:[1,12],
      presets:[{l:'*',v:'*'},{l:'Jan',v:'1'},{l:'Fév',v:'2'},{l:'Mar',v:'3'},{l:'Avr',v:'4'},{l:'Mai',v:'5'},{l:'Jun',v:'6'},{l:'Jul',v:'7'},{l:'Aoû',v:'8'},{l:'Sep',v:'9'},{l:'Oct',v:'10'},{l:'Nov',v:'11'},{l:'Déc',v:'12'}] },
    { id:'dow',     label:'Jour sem.', hint:'0=dim, 1=lun … 6=sam  •  1-5 = lun au ven  •  * = tous', range:[0,7],
      presets:[{l:'*',v:'*'},{l:'Lun',v:'1'},{l:'Mar',v:'2'},{l:'Mer',v:'3'},{l:'Jeu',v:'4'},{l:'Ven',v:'5'},{l:'Sam',v:'6'},{l:'Dim',v:'0'},{l:'Lun–Ven',v:'1-5'},{l:'Week-end',v:'6,0'}] },
  ];

  const FIELDS_UNIX = FIELDS_SPRING.slice(1); // sans secondes

  const SHORTCUTS = [
    { label:'Chaque minute',        s:'0 * * * * *',  u:'* * * * *'   },
    { label:'Chaque heure',         s:'0 0 * * * *',  u:'0 * * * *'   },
    { label:'Chaque jour à minuit', s:'0 0 0 * * *',  u:'0 0 * * *'   },
    { label:'Chaque jour à 8h',     s:'0 0 8 * * *',  u:'0 8 * * *'   },
    { label:'Jours ouvrés à 9h',    s:'0 0 9 * * 1-5',u:'0 9 * * 1-5' },
    { label:'Toutes les 15 min',    s:'0 */15 * * * *',u:'*/15 * * * *'},
    { label:'Toutes les 30 min',    s:'0 */30 * * * *',u:'*/30 * * * *'},
    { label:'1er du mois à minuit', s:'0 0 0 1 * *',  u:'0 0 1 * *'   },
    { label:'Chaque dimanche 2h',   s:'0 0 2 * * 0',  u:'0 2 * * 0'   },
    { label:'Chaque lundi à 6h',    s:'0 0 6 * * 1',  u:'0 6 * * 1'   },
    { label:'Chaque année (1 jan)', s:'0 0 0 1 1 *',  u:'0 0 1 1 *'   },
  ];

  // ══════════════════════════════════════════════
  // STATE
  // ══════════════════════════════════════════════

  let mode = 'spring'; // défaut Spring

  // ══════════════════════════════════════════════
  // INIT
  // ══════════════════════════════════════════════

  // Boutons de mode
  document.getElementById('cron-mbtn-spring').addEventListener('click', () => setMode('spring'));
  document.getElementById('cron-mbtn-unix').addEventListener('click',   () => setMode('unix'));

  // Copier
  document.getElementById('cron-copy-btn').addEventListener('click', () => {
    const expr = document.getElementById('cron-expr').value.trim();
    if (!expr) return;
    navigator.clipboard.writeText(expr).then(() => {
      const btn = document.getElementById('cron-copy-btn');
      btn.textContent = 'Copié !'; btn.classList.add('success');
      setTimeout(() => { btn.textContent = 'Copier ↗'; btn.classList.remove('success'); }, 2200);
    });
  });

  // Écouter la saisie directe dans l'expression
  document.getElementById('cron-expr').addEventListener('input', () => fromExpr());

  // Lancer avec le mode par défaut
  setMode('spring');

  // ══════════════════════════════════════════════
  // LOGIQUE MODE
  // ══════════════════════════════════════════════

  function setMode(m) {
    mode = m;
    document.getElementById('cron-mbtn-spring').classList.toggle('active', m === 'spring');
    document.getElementById('cron-mbtn-unix').classList.toggle('active',   m === 'unix');
    document.getElementById('cron-mode-explain').innerHTML = MODE_EXPLAIN[m];

    // Adapter l'expression si besoin
    const current = document.getElementById('cron-expr').value.trim();
    const parts = current.split(/\s+/);
    if (m === 'spring' && parts.length === 5) {
      document.getElementById('cron-expr').value = '0 ' + current;
    } else if (m === 'unix' && parts.length === 6) {
      document.getElementById('cron-expr').value = parts.slice(1).join(' ');
    } else if (!current) {
      document.getElementById('cron-expr').value = m === 'spring' ? '0 0 9 * * 1-5' : '0 9 * * 1-5';
    }

    rebuildUI();
    fromExpr();
  }

  // ══════════════════════════════════════════════
  // CONSTRUCTION DE L'UI DES CHAMPS
  // ══════════════════════════════════════════════

  function rebuildUI() {
    const fields = mode === 'spring' ? FIELDS_SPRING : FIELDS_UNIX;

    // Strip de labels/valeurs
    document.getElementById('cron-field-strip').innerHTML = fields.map(f =>
      `<div class="cron-field-box">
        <span class="cron-field-lbl">${f.label}</span>
        <div class="cron-field-val" id="fval-${f.id}">*</div>
      </div>`
    ).join('');

    // Builder sections
    document.getElementById('cron-builder').innerHTML = fields.map(f => `
      <div class="cron-section">
        <div class="cron-section-title">${f.label}</div>
        <div class="cron-section-hint">${f.hint}</div>
        <div class="cron-presets" id="presets-${f.id}">
          ${f.presets.map(p => `<button class="cron-preset" data-field="${f.id}" data-value="${p.v}">${p.l}</button>`).join('')}
        </div>
        <div class="cron-custom-row">
          <input type="text" class="cron-custom-input" id="custom-${f.id}" placeholder="${f.presets[0].v}">
          <span class="cron-custom-hint">${f.hint.split('•')[0].trim()}</span>
        </div>
      </div>`
    ).join('');

    // Events sur les presets
    document.getElementById('cron-builder').querySelectorAll('.cron-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const field = btn.dataset.field;
        const value = btn.dataset.value;
        document.getElementById(`custom-${field}`).value = value;
        highlightPreset(field, value);
        fromBuilder();
      });
    });

    // Events sur les inputs custom
    fields.forEach(f => {
      document.getElementById(`custom-${f.id}`).addEventListener('input', () => {
        highlightPreset(f.id, document.getElementById(`custom-${f.id}`).value.trim());
        fromBuilder();
      });
    });

    // Shortcuts
    document.getElementById('cron-shortcuts').innerHTML = SHORTCUTS.map(s => {
      const expr = mode === 'spring' ? s.s : s.u;
      return `<button class="cron-shortcut" data-spring="${s.s}" data-unix="${s.u}">
        <span class="sc-label">${s.label}</span>
        <span class="sc-expr">${expr}</span>
      </button>`;
    }).join('');

    document.getElementById('cron-shortcuts').querySelectorAll('.cron-shortcut').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('cron-expr').value = mode === 'spring' ? btn.dataset.spring : btn.dataset.unix;
        fromExpr();
      });
    });
  }

  function highlightPreset(field, value) {
    document.querySelectorAll(`.cron-preset[data-field="${field}"]`).forEach(b => {
      b.classList.toggle('active', b.dataset.value === value);
    });
  }

  // ══════════════════════════════════════════════
  // BUILDER → EXPRESSION
  // ══════════════════════════════════════════════

  function fromBuilder() {
    const fields = mode === 'spring' ? FIELDS_SPRING : FIELDS_UNIX;
    const parts = fields.map(f => {
      const v = document.getElementById(`custom-${f.id}`)?.value.trim();
      return v || '*';
    });
    document.getElementById('cron-expr').value = parts.join(' ');
    validate(parts.join(' '));
  }

  // ══════════════════════════════════════════════
  // EXPRESSION → BUILDER
  // ══════════════════════════════════════════════

  function fromExpr() {
    const expr = document.getElementById('cron-expr').value.trim();
    const parts = expr.split(/\s+/);
    const fields = mode === 'spring' ? FIELDS_SPRING : FIELDS_UNIX;
    const n = fields.length;

    if (parts.length === n) {
      fields.forEach((f, i) => {
        const inp = document.getElementById(`custom-${f.id}`);
        if (inp) inp.value = parts[i];
        highlightPreset(f.id, parts[i]);
      });
    }

    validate(expr);
  }

  // ══════════════════════════════════════════════
  // VALIDATION + DESCRIPTION + RENDU
  // ══════════════════════════════════════════════

  function validate(expr) {
    const parts = expr.trim().split(/\s+/);
    const fields = mode === 'spring' ? FIELDS_SPRING : FIELDS_UNIX;
    const n = fields.length;
    const dot  = document.getElementById('cron-dot');
    const desc = document.getElementById('cron-desc');
    const inp  = document.getElementById('cron-expr');

    // Sync strip
    fields.forEach((f, i) => {
      const el = document.getElementById(`fval-${f.id}`);
      if (el) el.textContent = parts[i] || '?';
    });

    if (parts.length !== n) {
      dot.style.background = '#BA7517';
      desc.textContent = `Expression incomplète — ${parts.length} champ${parts.length > 1 ? 's' : ''} sur ${n} attendus`;
      inp.classList.add('err');
      document.getElementById('cron-next-card').style.display = 'none';
      document.getElementById('cron-spring-card').style.display = 'none';
      return;
    }

    inp.classList.remove('err');

    const description = describe(parts);
    dot.style.background = '#1D9E75';
    desc.textContent = description;

    // Prochaines exécutions
    const nexts = nextRuns(parts, 8);
    if (nexts.length) {
      document.getElementById('cron-next-card').style.display = '';
      document.getElementById('cron-next-list').innerHTML = nexts.map((d, i) =>
        `<div class="cron-next-item">
          <span class="ni-idx">${i + 1}</span>
          <span class="ni-date">${fmtDate(d)}</span>
          <span class="ni-rel">${relTime(d)}</span>
        </div>`
      ).join('');
    } else {
      document.getElementById('cron-next-card').style.display = 'none';
    }

    // Code Spring
    const springExpr = mode === 'spring' ? expr.trim() : '0 ' + expr.trim();
    document.getElementById('cron-spring-card').style.display = '';
    document.getElementById('cron-spring-code').innerHTML =
      `<span class="cc">// Spring Boot — ajouter @EnableScheduling sur la classe @Configuration</span>\n\n` +
      `<span class="ck">@Scheduled</span>(<span class="cs">cron = "${springExpr}"</span>)\n` +
      `<span class="ck">public void</span> maMethodePlanifiee() {\n` +
      `    <span class="cc">// ${description}</span>\n` +
      `    <span class="cc">// TODO: implémenter la logique métier</span>\n` +
      `}`;
  }

  // ══════════════════════════════════════════════
  // DESCRIPTION EN FRANÇAIS
  // ══════════════════════════════════════════════

  function describe(parts) {
    let sec = '0', min, hour, dom, month, dow;
    if (mode === 'spring') [sec, min, hour, dom, month, dow] = parts;
    else [min, hour, dom, month, dow] = parts;

    const chunks = [];
    const MONTH_FR = ['','janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    const DOW_FR   = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];

    // Secondes
    if (mode === 'spring') {
      if (sec === '*') return 'Chaque seconde';
      if (sec.startsWith('*/')) chunks.push(`toutes les ${sec.slice(2)} secondes`);
    }

    // Minutes
    if (min === '*') { if (!chunks.length) chunks.push('chaque minute'); }
    else if (min.startsWith('*/')) chunks.push(`toutes les ${min.slice(2)} minutes`);
    else if (min !== '0') chunks.push(`à la minute ${min}`);

    // Heures
    if (hour === '*') { /* silencieux */ }
    else if (hour.startsWith('*/')) chunks.push(`toutes les ${hour.slice(2)} heures`);
    else if (hour.includes('-')) { const [a,b]=hour.split('-'); chunks.push(`entre ${a}h et ${b}h`); }
    else {
      const m = (min === '0' || min === '00') ? '00' : (min === '*' ? '00' : min.padStart(2,'0'));
      const s = (mode === 'spring' && sec !== '0' && sec !== '*') ? `:${sec.padStart(2,'0')}` : '';
      chunks.push(`à ${hour.padStart(2,'0')}h${m}${s}`);
    }

    // Jour du mois
    if (dom !== '*' && dom !== '?') {
      if (dom === 'L') chunks.push('le dernier jour du mois');
      else if (dom.includes('/')) { const [,step]=dom.split('/'); chunks.push(`tous les ${step} jours`); }
      else chunks.push(`le ${dom} du mois`);
    }

    // Mois
    if (month !== '*' && month !== '?') {
      const ms = month.split(',').map(m => { const n=parseInt(m); return isNaN(n)?m:(MONTH_FR[n]||m); });
      chunks.push('en ' + ms.join(', '));
    }

    // Jour de la semaine
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

    return chunks.length ? cap(chunks.join(', ')) : 'Toutes les minutes';
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ══════════════════════════════════════════════
  // PROCHAINES EXÉCUTIONS
  // ══════════════════════════════════════════════

  function nextRuns(parts, count) {
    let sec='0', min, hour, dom, month, dow;
    if (mode === 'spring') [sec,min,hour,dom,month,dow] = parts;
    else [min,hour,dom,month,dow] = parts;

    const results = [];
    const cursor = new Date();
    cursor.setMilliseconds(0);
    cursor.setSeconds(cursor.getSeconds() + 1);
    const limit = new Date(cursor.getTime() + 366*24*3600*1000);
    let iter = 0;

    while (results.length < count && cursor < limit && iter < 600000) {
      iter++;
      if (mf(cursor.getMonth()+1, month, 1,12) &&
          mf(cursor.getDate(),    dom,   1,31) &&
          mdow(cursor.getDay(),   dow) &&
          mf(cursor.getHours(),   hour,  0,23) &&
          mf(cursor.getMinutes(), min,   0,59) &&
          mf(cursor.getSeconds(), sec,   0,59)) {
        results.push(new Date(cursor));
      }
      cursor.setSeconds(cursor.getSeconds() + 1);
    }
    return results;
  }

  function mf(val, expr, lo, hi) {
    if (!expr || expr==='*'||expr==='?') return true;
    if (expr==='L') return val===new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
    for (const p of expr.split(',')) {
      if (p.includes('/')) { const [base,step]=p.split('/'); const st=parseInt(base)==='*'?lo:parseInt(base); if(val>=st&&(val-st)%parseInt(step)===0)return true; }
      else if (p.includes('-')) { const [a,b]=p.split('-'); if(val>=parseInt(a)&&val<=parseInt(b))return true; }
      else if (val===parseInt(p)) return true;
    }
    return false;
  }

  function mdow(day, expr) {
    if (!expr||expr==='*'||expr==='?') return true;
    for (const p of expr.split(',')) {
      if (p.includes('-')) { const [a,b]=p.split('-'); let pa=parseInt(a)%7,pb=parseInt(b)%7; if(pa<=pb){if(day>=pa&&day<=pb)return true;}else{if(day>=pa||day<=pb)return true;} }
      else if (day===parseInt(p)%7) return true;
    }
    return false;
  }

  // ══════════════════════════════════════════════
  // FORMATAGE
  // ══════════════════════════════════════════════

  function fmtDate(d) {
    const j=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
    const m=['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
    return `${j[d.getDay()]} ${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()} — ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function relTime(d) {
    const s=Math.floor((d-Date.now())/1000);
    if(s<60)return`dans ${s}s`;
    const mn=Math.floor(s/60); if(mn<60)return`dans ${mn}min`;
    const h=Math.floor(mn/60); if(h<24)return`dans ${h}h`;
    return`dans ${Math.floor(h/24)}j`;
  }

  function pad(n) { return String(n).padStart(2,'0'); }
}
