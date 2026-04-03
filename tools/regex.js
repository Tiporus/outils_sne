export const meta = { id: 'regex', label: 'Regex' };

export function mount(container) {

  // ── CSS injecté une seule fois ──
  if (!document.getElementById('rx-style')) {
    const s = document.createElement('style');
    s.id = 'rx-style';
    s.textContent = `
      /* Override tool-container pour Regex plein écran */
      #tool-container:has(.rx-layout) {
        overflow: hidden;
        padding: 0;
      }

      .rx-layout {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        gap: 10px;
        box-sizing: border-box;
      }

      /* ─── En-tête ─── */
      .rx-header {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .rx-expr-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .rx-slash {
        font-size: 20px;
        color: var(--muted);
        font-family: monospace;
        line-height: 1;
        flex-shrink: 0;
      }

      .rx-pattern-input {
        flex: 1;
        font-family: 'JetBrains Mono','Fira Mono',monospace;
        font-size: 15px;
        padding: 7px 12px;
        border-radius: 8px;
        border: 0.5px solid var(--border);
        background: var(--input-bg);
        color: var(--text);
        outline: none;
        transition: border-color .15s;
      }
      .rx-pattern-input:focus { border-color: var(--accent); }
      .rx-pattern-input.err { border-color: #D85A30; background: #FAECE7; color: #993C1D; }

      /* Flags compacts (1 ligne horizontale) */
      .rx-flags-grid {
        display: flex;
        gap: 5px;
      }
      .rx-flag-card {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 7px;
        padding: 6px 10px;
        border-radius: 8px;
        border: 0.5px solid var(--border);
        background: var(--surface2);
        cursor: pointer;
        text-align: left;
        font-family: inherit;
        transition: border-color .15s, background .15s;
      }
      .rx-flag-card:hover { border-color: var(--accent); background: var(--input-bg); }
      .rx-flag-card.active { border-color: #85B7EB; background: #E6F1FB; }
      .dark .rx-flag-card.active { border-color: #388bfd; background: #1c2d3f; }
      .rx-flag-header { display: contents; }
      .rx-flag-hint { display: none; }
      .rx-flag-letter { font-family: monospace; font-size: 15px; font-weight: 700; color: var(--muted); width: 18px; flex-shrink: 0; }
      .rx-flag-card.active .rx-flag-letter { color: #0C447C; }
      .dark .rx-flag-card.active .rx-flag-letter { color: #58a6ff; }
      .rx-flag-name { font-size: 11px; font-weight: 600; color: var(--text); flex: 1; }
      .rx-flag-badge { font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 4px; background: #0C447C; color: #fff; text-transform: uppercase; letter-spacing: .04em; margin-left: auto; flex-shrink: 0; }
      .dark .rx-flag-badge { background: #388bfd; }

      .rx-status {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 7px 12px;
        border-radius: 8px;
        border: 0.5px solid var(--border);
        font-size: 12px;
        color: var(--text);
      }
      .rx-match-count { margin-left: auto; font-size: 11px; font-weight: 600; color: var(--accent); }

      /* ─── Corps : 3 colonnes ─── */
      .rx-body {
        flex: 1;
        display: flex;
        gap: 10px;
        overflow: hidden;
        min-height: 0;
      }

      .rx-col-left {
        flex: 2;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-width: 0;
      }

      .rx-col-center {
        flex: 3;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: hidden;
        min-width: 0;
      }

      .rx-col-right {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: hidden;
        min-width: 0;
      }

      /* Panel générique */
      .rx-panel {
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

      .rx-panel-title {
        font-size: 10px;
        font-weight: 600;
        color: var(--muted2);
        text-transform: uppercase;
        letter-spacing: .08em;
        margin-bottom: 8px;
        flex-shrink: 0;
      }

      /* Bibliothèque : remplit la colonne gauche */
      #rx-lib-panel { flex: 1; }
      .rx-lib-grid {
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow-y: auto;
        flex: 1;
        scrollbar-width: thin;
      }
      .rx-lib-item {
        padding: 6px 10px;
        border-radius: 7px;
        background: var(--surface2);
        border: 0.5px solid var(--border);
        cursor: pointer;
        transition: background .12s, border-color .12s;
        flex-shrink: 0;
      }
      .rx-lib-item:hover { background: var(--input-bg); border-color: var(--accent); }
      .rx-lib-label { font-size: 11px; font-weight: 600; color: var(--text); margin-bottom: 1px; }
      .rx-lib-pattern { font-family: monospace; font-size: 10px; color: var(--accent); word-break: break-all; }
      .rx-lib-desc { font-size: 10px; color: var(--muted); margin-top: 1px; }

      /* Texte de test : remplit le centre */
      .rx-panel-test { flex: 1; }
      .rx-test-area-wrap {
        position: relative;
        flex: 1;
        min-height: 0;
      }
      .rx-highlight-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        font-family: 'JetBrains Mono','Fira Mono',monospace;
        font-size: 12.5px;
        line-height: 1.7;
        padding: 10px;
        border-radius: 8px;
        white-space: pre-wrap;
        word-break: break-word;
        overflow: hidden;
        color: transparent;
      }
      .rx-test-textarea {
        position: absolute;
        inset: 0;
        resize: none;
        font-family: 'JetBrains Mono','Fira Mono',monospace;
        font-size: 12.5px;
        line-height: 1.7;
        padding: 10px;
        border-radius: 8px;
        border: 0.5px solid var(--border);
        background: transparent;
        color: var(--text);
        outline: none;
        caret-color: var(--text);
        z-index: 1;
        transition: border-color .15s;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      .rx-test-textarea:focus { border-color: var(--accent); }

      /* Match highlights */
      .rx-hl { background:rgba(88,166,255,0.25); border-radius:2px; outline:1px solid rgba(88,166,255,0.5); }
      .dark .rx-hl { background:rgba(88,166,255,0.2); }
      .rx-hl-0  { background:rgba(255,183,77,0.3);  outline:1px solid rgba(255,183,77,0.6); }
      .rx-hl-1  { background:rgba(102,187,106,0.3); outline:1px solid rgba(102,187,106,0.6); }
      .rx-hl-2  { background:rgba(239,83,80,0.25);  outline:1px solid rgba(239,83,80,0.5); }
      .rx-hl-3  { background:rgba(171,71,188,0.25); outline:1px solid rgba(171,71,188,0.5); }
      .rx-hl-4  { background:rgba(38,198,218,0.25); outline:1px solid rgba(38,198,218,0.5); }
      .rx-hl-5  { background:rgba(255,112,67,0.25); outline:1px solid rgba(255,112,67,0.5); }

      /* Correspondances + Groupes (sous le textarea) */
      #rx-matches-card { max-height: 200px; }
      .rx-matches-scroll { overflow-y: auto; flex: 1; scrollbar-width: thin; }
      #rx-groups-card { max-height: 150px; }
      .rx-groups-scroll { overflow-y: auto; flex: 1; scrollbar-width: thin; }

      .rx-match-item { display:flex; flex-direction:column; gap:2px; padding:5px 10px; border-radius:7px; background:var(--surface2); margin-bottom:4px; border-left:3px solid var(--accent); flex-shrink:0; }
      .rx-match-item:nth-child(1) { border-color:#FF8A00; }
      .rx-match-item:nth-child(2) { border-color:#43A047; }
      .rx-match-item:nth-child(3) { border-color:#E53935; }
      .rx-match-item:nth-child(4) { border-color:#8E24AA; }
      .rx-match-item:nth-child(5) { border-color:#00ACC1; }
      .rx-match-item:nth-child(n+6) { border-color:var(--accent); }
      .rx-match-header { display:flex; gap:8px; align-items:center; }
      .rx-match-idx { font-size:10px; color:var(--muted2); }
      .rx-match-val { font-family:monospace; font-size:12px; font-weight:600; color:var(--text); }
      .rx-match-pos { font-size:10px; color:var(--muted); margin-left:auto; }
      .rx-match-groups { display:flex; flex-wrap:wrap; gap:3px; margin-top:2px; }
      .rx-match-group { font-size:10px; font-family:monospace; padding:1px 6px; border-radius:4px; background:var(--surface); border:0.5px solid var(--border); color:var(--muted); }
      .rx-match-group span { color:var(--text); font-weight:500; }

      .rx-group-table { width:100%; border-collapse:collapse; font-size:11px; }
      .rx-group-table th { text-align:left; font-size:9px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; padding:3px 8px; border-bottom:0.5px solid var(--border); }
      .rx-group-table td { padding:4px 8px; border-bottom:0.5px solid var(--border-light); font-family:monospace; vertical-align:top; }
      .rx-group-table tr:last-child td { border-bottom:none; }
      .rx-group-name { font-weight:600; color:var(--accent); }

      /* Explication : remplit la colonne droite */
      #rx-explain-wrap { flex: 1; }
      .rx-explain { display:flex; flex-direction:column; gap:3px; overflow-y:auto; flex:1; scrollbar-width:thin; }
      .rx-explain-row { display:flex; align-items:baseline; gap:10px; padding:4px 8px; border-radius:6px; background:var(--surface2); font-size:12px; flex-shrink:0; }
      .rx-explain-row:hover { background:var(--input-bg); }
      .rx-explain-token { font-family:monospace; font-size:12px; font-weight:700; min-width:80px; flex-shrink:0; }
      .rx-explain-desc { color:var(--muted); flex:1; line-height:1.4; }
      .rx-explain-row.group-0 .rx-explain-token { color:#FF8A00; }
      .rx-explain-row.group-1 .rx-explain-token { color:#43A047; }
      .rx-explain-row.group-2 .rx-explain-token { color:#E53935; }
      .rx-explain-row.group-3 .rx-explain-token { color:#8E24AA; }
      .rx-explain-row.group-4 .rx-explain-token { color:#00ACC1; }
      .rx-explain-row.group-5 .rx-explain-token { color:#F4511E; }
      .rx-explain-row.neutral .rx-explain-token { color:var(--accent); }

      /* Code généré */
      #rx-export-card { flex-shrink: 0; }
      .rx-lang-toggle { display:flex; gap:5px; margin-bottom:8px; flex-shrink:0; }
      .rx-lang-btn { padding:4px 14px; border-radius:7px; border:0.5px solid var(--border); background:var(--surface2); color:var(--muted); font-size:11px; font-weight:600; cursor:pointer; font-family:inherit; transition:background .12s; }
      .rx-lang-btn.active { background:#E6F1FB; color:#0C447C; border-color:#85B7EB; }
      .rx-code-block { background:var(--input-bg); border:0.5px solid var(--border); border-radius:8px; padding:10px 12px; font-family:'JetBrains Mono','Fira Mono',monospace; font-size:11px; line-height:1.65; color:var(--text); white-space:pre; overflow-x:auto; max-height:180px; overflow-y:auto; }
      .rx-code-block .ck { color:var(--c-bool); }
      .rx-code-block .cs { color:var(--c-str); }
      .rx-code-block .cc { color:var(--c-comment); }
      .rx-code-block .cn { color:var(--c-num); }

      /* ─── Responsive mobile ─── */
      @media (max-width: 900px) {
        #tool-container:has(.rx-layout) { overflow-y: auto; }
        .rx-layout { height: auto; }
        .rx-body { flex-direction: column; overflow: visible; }
        .rx-col-left, .rx-col-center, .rx-col-right { flex: none; overflow: visible; }
        #rx-lib-panel { flex: none; max-height: 240px; }
        .rx-panel-test { flex: none; }
        .rx-test-area-wrap { min-height: 200px; }
        #rx-matches-card, #rx-groups-card { max-height: none; }
        #rx-explain-wrap { flex: none; max-height: 260px; }
        #rx-export-card { flex-shrink: 0; }
      }
      @media (max-width: 640px) {
        .rx-layout { padding: 8px 10px; }
        .rx-flags-grid { flex-wrap: wrap; }
        .rx-flag-card { flex: 1 0 40%; }
      }
    `;
    document.head.appendChild(s);
  }

  // ── HTML ──
  container.innerHTML = `
<div class="rx-layout">

  <!-- En-tête : pattern + flags + status -->
  <div class="rx-header">
    <div class="rx-expr-row">
      <span class="rx-slash">/</span>
      <input type="text" id="rx-pattern" class="rx-pattern-input"
             placeholder="([A-Z][a-z]+)\\s+(\\d{4})"
             spellcheck="false" autocomplete="off" />
      <span class="rx-slash">/</span>
      <button id="rx-copy-btn">Copier ↗</button>
    </div>
    <div class="rx-flags-grid">
      <button class="rx-flag-card active" id="rx-flag-g" data-flag="g">
        <div class="rx-flag-header">
          <span class="rx-flag-letter">g</span>
          <span class="rx-flag-name">global</span>
          <span class="rx-flag-hint">Toutes les correspondances</span>
          <span class="rx-flag-badge" id="rx-badge-g">actif</span>
        </div>
      </button>
      <button class="rx-flag-card" id="rx-flag-i" data-flag="i">
        <div class="rx-flag-header">
          <span class="rx-flag-letter">i</span>
          <span class="rx-flag-name">insensible à la casse</span>
          <span class="rx-flag-hint">Ignore majuscules / minuscules</span>
          <span class="rx-flag-badge" id="rx-badge-i" style="display:none;">actif</span>
        </div>
      </button>
      <button class="rx-flag-card" id="rx-flag-m" data-flag="m">
        <div class="rx-flag-header">
          <span class="rx-flag-letter">m</span>
          <span class="rx-flag-name">multiline</span>
          <span class="rx-flag-hint">^ et $ sur chaque ligne</span>
          <span class="rx-flag-badge" id="rx-badge-m" style="display:none;">actif</span>
        </div>
      </button>
      <button class="rx-flag-card" id="rx-flag-s" data-flag="s">
        <div class="rx-flag-header">
          <span class="rx-flag-letter">s</span>
          <span class="rx-flag-name">dotAll</span>
          <span class="rx-flag-hint">. inclut les sauts de ligne</span>
          <span class="rx-flag-badge" id="rx-badge-s" style="display:none;">actif</span>
        </div>
      </button>
    </div>
    <div class="rx-status" id="rx-status">
      <div class="status-dot" id="rx-dot"></div>
      <span id="rx-status-msg">Saisissez une expression régulière</span>
      <span class="rx-match-count" id="rx-match-count"></span>
    </div>
  </div>

  <!-- Corps : 3 colonnes -->
  <div class="rx-body">

    <!-- Gauche : Bibliothèque de patterns -->
    <div class="rx-col-left">
      <div class="rx-panel" id="rx-lib-panel">
        <div class="rx-panel-title">Bibliothèque</div>
        <div class="rx-lib-grid" id="rx-lib-grid"></div>
      </div>
    </div>

    <!-- Centre : Texte de test + Correspondances + Groupes -->
    <div class="rx-col-center">
      <div class="rx-panel rx-panel-test">
        <div class="rx-panel-title">Texte de test</div>
        <div class="rx-test-area-wrap">
          <div id="rx-highlight-layer" class="rx-highlight-layer" aria-hidden="true"></div>
          <textarea id="rx-test-input" class="rx-test-textarea"
                    placeholder="Colle ou tape le texte à tester ici…"
                    spellcheck="false"></textarea>
        </div>
      </div>
      <div class="rx-panel" id="rx-matches-card" style="display:none;">
        <div class="rx-panel-title">Correspondances</div>
        <div class="rx-matches-scroll"><div id="rx-matches-list"></div></div>
      </div>
      <div class="rx-panel" id="rx-groups-card" style="display:none;">
        <div class="rx-panel-title">Groupes capturants</div>
        <div class="rx-groups-scroll"><div id="rx-groups-list"></div></div>
      </div>
    </div>

    <!-- Droite : Explication + Code généré -->
    <div class="rx-col-right">
      <div class="rx-panel" id="rx-explain-wrap" style="display:none;">
        <div class="rx-panel-title">Explication token par token</div>
        <div class="rx-explain" id="rx-explain"></div>
      </div>
      <div class="rx-panel" id="rx-export-card" style="display:none;">
        <div class="rx-panel-title">Code généré</div>
        <div class="rx-lang-toggle">
          <button class="rx-lang-btn active" id="rx-lang-java">Java</button>
          <button class="rx-lang-btn" id="rx-lang-js">JavaScript</button>
        </div>
        <div class="rx-code-block" id="rx-code"></div>
      </div>
    </div>

  </div>
</div>`;

  // ── Bibliothèque de patterns ──
  const LIBRARY = [
    { label:'Email',          pattern:'^[\\w.+-]+@[\\w-]+\\.[a-z]{2,}$',       flags:'i',  desc:'Adresse email simple' },
    { label:'URL HTTP(S)',    pattern:'https?:\\/\\/[\\w.-]+(?:\\/[\\S]*)?',    flags:'gi', desc:'URL avec protocole' },
    { label:'IPv4',           pattern:'\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',      flags:'g',  desc:'Adresse IPv4' },
    { label:'NIR (sécu.)',    pattern:'[12]\\d{2}(?:0[1-9]|1[0-2])\\d{10}',    flags:'g',  desc:'N° sécurité sociale FR' },
    { label:'Code postal FR', pattern:'\\b(?:0[1-9]|[1-8]\\d|9[0-5])\\d{3}\\b',flags:'g', desc:'Code postal français' },
    { label:'Téléphone FR',   pattern:'(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}',flags:'g',desc:'N° de téléphone français' },
    { label:'Date JJ/MM/AAAA',pattern:'\\b(\\d{2})\\/(\\d{2})\\/(\\d{4})\\b', flags:'g',  desc:'Date française avec groupes' },
    { label:'ISO 8601',       pattern:'\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])(?:T\\d{2}:\\d{2}:\\d{2})?',flags:'g',desc:'Date ISO' },
    { label:'UUID',           pattern:'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',flags:'gi',desc:'UUID v4' },
    { label:'Hexadécimal',    pattern:'#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\\b',  flags:'g',  desc:'Couleur hex CSS' },
    { label:'Entier / décimal',pattern:'-?\\d+(?:[.,]\\d+)?',                  flags:'g',  desc:'Nombre entier ou décimal' },
    { label:'Balise HTML',    pattern:'<\\/?([a-zA-Z][a-zA-Z0-9]*)(?:\\s[^>]*)?>',flags:'g',desc:'Balise HTML ouvrante/fermante' },
    { label:'Commentaire Java',pattern:'\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/', flags:'g',  desc:'// ou /* */ en Java' },
    { label:'Variable camelCase',pattern:'\\b[a-z][a-zA-Z0-9]*\\b',            flags:'g',  desc:'Identifiant camelCase' },
    { label:'Mot entier',     pattern:'\\b\\w+\\b',                             flags:'g',  desc:'Tout mot délimité' },
    { label:'Ligne non vide', pattern:'^(?!\\s*$).+',                           flags:'gm', desc:'Filtre les lignes vides' },
  ];

  // ── Explications des tokens regex ──
  const TOKEN_RULES = [
    { re:/^\^/,            token:'^',         desc:'Début de chaîne (ou de ligne en mode m)' },
    { re:/^\$/,            token:'$',         desc:'Fin de chaîne (ou de ligne en mode m)' },
    { re:/^\./,            token:'.',         desc:'N\'importe quel caractère (sauf saut de ligne, sauf en mode s)' },
    { re:/^\*/,            token:'*',         desc:'0 ou plusieurs fois (quantificateur glouton)' },
    { re:/^\+/,            token:'+',         desc:'1 ou plusieurs fois (quantificateur glouton)' },
    { re:/^\?/,            token:'?',         desc:'0 ou 1 fois — ou rend le quantificateur précédent paresseux' },
    { re:/^\{(\d+)\}/,     desc:(m)=>`Exactement ${m[1]} fois` },
    { re:/^\{(\d+),(\d+)\}/,desc:(m)=>`Entre ${m[1]} et ${m[2]} fois` },
    { re:/^\{(\d+),\}/,   desc:(m)=>`Au moins ${m[1]} fois` },
    { re:/^\\d/,           token:'\\d',       desc:'Chiffre [0-9]' },
    { re:/^\\D/,           token:'\\D',       desc:'Non-chiffre [^0-9]' },
    { re:/^\\w/,           token:'\\w',       desc:'Caractère mot [A-Za-z0-9_]' },
    { re:/^\\W/,           token:'\\W',       desc:'Non-caractère mot' },
    { re:/^\\s/,           token:'\\s',       desc:'Espace blanc (espace, tab, \\n, \\r…)' },
    { re:/^\\S/,           token:'\\S',       desc:'Non-espace blanc' },
    { re:/^\\b/,           token:'\\b',       desc:'Frontière de mot' },
    { re:/^\\B/,           token:'\\B',       desc:'Non-frontière de mot' },
    { re:/^\\n/,           token:'\\n',       desc:'Saut de ligne' },
    { re:/^\\t/,           token:'\\t',       desc:'Tabulation' },
    { re:/^\\r/,           token:'\\r',       desc:'Retour chariot' },
    { re:/^\\(.)/,         desc:(m)=>`Caractère échappé : "${m[1]}"` },
    { re:/^\(\?:/,         token:'(?:',       desc:'Groupe non-capturant — regroupe sans créer un groupe numéroté' },
    { re:/^\(\?=/,         token:'(?=',       desc:'Lookahead positif — suivi de…' },
    { re:/^\(\?!/,         token:'(?!',       desc:'Lookahead négatif — non suivi de…' },
    { re:/^\(\?<=/,        token:'(?<=',      desc:'Lookbehind positif — précédé de…' },
    { re:/^\(\?<!/,        token:'(?<!',      desc:'Lookbehind négatif — non précédé de…' },
    { re:/^\(\?<([^>]+)>/, desc:(m)=>`Groupe capturant nommé "${m[1]}"` },
    { re:/^\(/,            token:'(',         desc:'Début de groupe capturant' },
    { re:/^\)/,            token:')',         desc:'Fin de groupe' },
    { re:/^\|/,            token:'|',         desc:'Alternative — ou bien' },
    { re:/^\[(\^?)([^\]]*)\]/, desc:(m)=>m[1] ? `Classe de caractères niée : tout sauf [${m[2]}]` : `Classe de caractères : l'un de [${m[2]}]` },
  ];

  let rxLang = 'java';

  // ── Render bibliothèque ──
  document.getElementById('rx-lib-grid').innerHTML = LIBRARY.map((item, i) =>
    `<div class="rx-lib-item" data-idx="${i}">
      <div class="rx-lib-label">${item.label}</div>
      <div class="rx-lib-pattern">${escHtml(item.pattern)}</div>
      <div class="rx-lib-desc">${item.desc}</div>
    </div>`
  ).join('');

  document.getElementById('rx-lib-grid').querySelectorAll('.rx-lib-item').forEach(el => {
    el.addEventListener('click', () => {
      const item = LIBRARY[+el.dataset.idx];
      document.getElementById('rx-pattern').value = item.pattern;
      const flags = item.flags || 'g';
      setFlag('g', flags.includes('g'));
      setFlag('i', flags.includes('i'));
      setFlag('m', flags.includes('m'));
      setFlag('s', flags.includes('s'));
      rxRun();
    });
  });

  // ── State flags ──
  const flagState = { g: true, i: false, m: false, s: false };

  function setFlag(f, val) {
    flagState[f] = val;
    const btn = document.getElementById(`rx-flag-${f}`);
    const badge = document.getElementById(`rx-badge-${f}`);
    btn.classList.toggle('active', val);
    badge.style.display = val ? '' : 'none';
  }

  // ── Event listeners flags ──
  ['g','i','m','s'].forEach(f => {
    document.getElementById(`rx-flag-${f}`).addEventListener('click', () => {
      setFlag(f, !flagState[f]);
      rxRun();
    });
  });

  // ── Event listeners pattern + textarea ──
  document.getElementById('rx-pattern').addEventListener('input', rxRun);
  document.getElementById('rx-test-input').addEventListener('input', () => { rxSyncScroll(); rxRun(); });
  document.getElementById('rx-test-input').addEventListener('scroll', rxSyncScroll);

  // ── Copier ──
  document.getElementById('rx-copy-btn').addEventListener('click', () => {
    const pattern = document.getElementById('rx-pattern').value;
    if (!pattern) return;
    navigator.clipboard.writeText(pattern).then(() => {
      const btn = document.getElementById('rx-copy-btn');
      btn.textContent = 'Copié !'; btn.classList.add('success');
      setTimeout(() => { btn.textContent = 'Copier ↗'; btn.classList.remove('success'); }, 2200);
    });
  });

  // ── Lang toggle ──
  document.getElementById('rx-lang-java').addEventListener('click', () => rxSetLang('java'));
  document.getElementById('rx-lang-js').addEventListener('click',   () => rxSetLang('js'));

  // ── Run principal ──
  function rxRun() {
    const pattern = document.getElementById('rx-pattern').value;
    const flagG = flagState.g;
    const flagI = flagState.i;
    const flagM = flagState.m;
    const flagS = flagState.s;
    const testText = document.getElementById('rx-test-input').value;
    const patInput = document.getElementById('rx-pattern');
    const dot = document.getElementById('rx-dot');
    const msg = document.getElementById('rx-status-msg');
    const cntEl = document.getElementById('rx-match-count');

    if (!pattern) {
      patInput.classList.remove('err');
      dot.style.background = 'var(--muted2)';
      msg.textContent = 'Saisissez une expression régulière';
      cntEl.textContent = '';
      renderHighlight('', [], testText);
      document.getElementById('rx-explain-wrap').style.display = 'none';
      document.getElementById('rx-groups-card').style.display = 'none';
      document.getElementById('rx-matches-card').style.display = 'none';
      document.getElementById('rx-export-card').style.display = 'none';
      return;
    }

    let regex;
    try {
      const flags = (flagG?'g':'') + (flagI?'i':'') + (flagM?'m':'') + (flagS?'s':'');
      regex = new RegExp(pattern, flags);
      patInput.classList.remove('err');
    } catch(e) {
      patInput.classList.add('err');
      dot.style.background = '#D85A30';
      msg.textContent = '⚠ ' + e.message;
      cntEl.textContent = '';
      renderHighlight('', [], testText);
      document.getElementById('rx-explain-wrap').style.display = 'none';
      document.getElementById('rx-groups-card').style.display = 'none';
      document.getElementById('rx-matches-card').style.display = 'none';
      document.getElementById('rx-export-card').style.display = 'none';
      return;
    }

    // Explication
    document.getElementById('rx-explain-wrap').style.display = '';
    document.getElementById('rx-explain').innerHTML = explainRegex(pattern);

    // Matches
    const matches = [];
    if (testText) {
      const r2 = new RegExp(regex.source, regex.flags);
      let m;
      if (flagG) {
        while ((m = r2.exec(testText)) !== null) {
          matches.push({ value:m[0], index:m.index, groups: Array.from(m).slice(1), namedGroups: m.groups });
          if (m[0].length === 0) r2.lastIndex++;
        }
      } else {
        m = r2.exec(testText);
        if (m) matches.push({ value:m[0], index:m.index, groups: Array.from(m).slice(1), namedGroups: m.groups });
      }
    }

    const count = matches.length;
    if (!testText) {
      dot.style.background = 'var(--accent)';
      msg.textContent = 'Expression valide — saisissez un texte de test';
      cntEl.textContent = '';
    } else if (count === 0) {
      dot.style.background = '#BA7517';
      msg.textContent = 'Aucune correspondance trouvée';
      cntEl.textContent = '';
    } else {
      dot.style.background = '#1D9E75';
      msg.textContent = `${count} correspondance${count>1?'s':''} trouvée${count>1?'s':''}`;
      cntEl.textContent = `${count}`;
    }

    renderHighlight(pattern, matches, testText);
    renderMatches(matches);
    renderGroups(matches, pattern);
    renderCode(pattern, regex.flags);

    document.getElementById('rx-export-card').style.display = pattern ? '' : 'none';
  };

  // ── Highlight dans le textarea ──
  function renderHighlight(pattern, matches, text) {
    const layer = document.getElementById('rx-highlight-layer');
    if (!pattern || !matches.length) {
      layer.innerHTML = escHtml(text);
      return;
    }

    let result = '';
    let last = 0;
    matches.forEach((m, i) => {
      result += escHtml(text.slice(last, m.index));
      const cls = `rx-hl rx-hl-${i % 6}`;
      result += `<mark class="${cls}">${escHtml(m.value)}</mark>`;
      last = m.index + m.value.length;
    });
    result += escHtml(text.slice(last));
    layer.innerHTML = result;
  }

  function rxSyncScroll() {
    const ta = document.getElementById('rx-test-input');
    const layer = document.getElementById('rx-highlight-layer');
    layer.scrollTop = ta.scrollTop;
    layer.scrollLeft = ta.scrollLeft;
  }

  // ── Correspondances ──
  function renderMatches(matches) {
    const card = document.getElementById('rx-matches-card');
    if (!matches.length) { card.style.display = 'none'; return; }
    card.style.display = '';
    const maxShown = 20;
    let html = matches.slice(0, maxShown).map((m, i) => {
      const groupsHtml = m.groups.filter(g=>g!==undefined).map((g,gi) =>
        `<span class="rx-match-group">$${gi+1} <span>${escHtml(g??'')}</span></span>`
      ).join('');
      return `<div class="rx-match-item">
        <div class="rx-match-header">
          <span class="rx-match-idx">#${i+1}</span>
          <span class="rx-match-val">${escHtml(m.value)}</span>
          <span class="rx-match-pos">pos ${m.index}–${m.index+m.value.length}</span>
        </div>
        ${groupsHtml ? `<div class="rx-match-groups">${groupsHtml}</div>` : ''}
      </div>`;
    }).join('');
    if (matches.length > maxShown) html += `<p class="note" style="margin-top:8px;">… et ${matches.length-maxShown} autres correspondances</p>`;
    document.getElementById('rx-matches-list').innerHTML = html;
  }

  // ── Groupes capturants ──
  function renderGroups(matches, pattern) {
    const card = document.getElementById('rx-groups-card');
    const firstWithGroups = matches.find(m => m.groups.some(g=>g!==undefined));
    if (!firstWithGroups) { card.style.display = 'none'; return; }

    card.style.display = '';
    const groups = firstWithGroups.groups;
    const named = firstWithGroups.namedGroups || {};

    let rows = groups.map((g, i) => {
      const name = Object.entries(named).find(([,v])=>v===g)?.[0] ?? null;
      return `<tr>
        <td class="rx-group-name">$${i+1}${name?` / ?<${name}>`:''}</td>
        <td style="font-family:monospace;">${g !== undefined ? escHtml(g) : '<em style="color:var(--muted2)">non participatif</em>'}</td>
        <td style="color:var(--muted);">Groupe n°${i+1}${name?` (nommé "${name}")`:''}</td>
      </tr>`;
    }).join('');

    document.getElementById('rx-groups-list').innerHTML = `
      <table class="rx-group-table">
        <thead><tr><th>Groupe</th><th>Valeur (1ère corresp.)</th><th>Description</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  // ── Explication du pattern ──
  function explainRegex(pattern) {
    const tokens = tokenize(pattern);
    let groupIdx = 0;
    return tokens.map(t => {
      const isGroup = t.token.includes('(') && !t.token.includes('(?:') && !t.token.includes('(?=') && !t.token.includes('(?!') && !t.token.includes('(?<=') && !t.token.includes('(?<!');
      const cls = isGroup ? `group-${groupIdx++ % 6}` : 'neutral';
      return `<div class="rx-explain-row ${cls}">
        <span class="rx-explain-token">${escHtml(t.token)}</span>
        <span class="rx-explain-desc">${t.desc}</span>
      </div>`;
    }).join('');
  }

  function tokenize(pattern) {
    const result = [];
    let i = 0;
    while (i < pattern.length) {
      let matched = false;
      for (const rule of TOKEN_RULES) {
        const sub = pattern.slice(i);
        const m = sub.match(rule.re);
        if (m) {
          const token = rule.token ?? m[0];
          const desc = typeof rule.desc === 'function' ? rule.desc(m) : rule.desc;
          result.push({ token, desc });
          i += m[0].length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const ch = pattern[i];
        result.push({ token: ch, desc: `Caractère littéral "${ch}"` });
        i++;
      }
    }
    return result;
  }

  // ── Code généré ──
  function rxSetLang(lang) {
    rxLang = lang;
    document.getElementById('rx-lang-java').classList.toggle('active', lang==='java');
    document.getElementById('rx-lang-js').classList.toggle('active',   lang==='js');
    const pattern = document.getElementById('rx-pattern').value;
    if (pattern) renderCode(pattern, getFlags());
  }

  function getFlags() {
    return (flagState.g?'g':'') + (flagState.i?'i':'') + (flagState.m?'m':'') + (flagState.s?'s':'');
  }

  function renderCode(pattern, flags) {
    const escaped = pattern.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    let code;
    if (rxLang === 'java') {
      const jFlags = (flags.includes('i') ? ' | Pattern.CASE_INSENSITIVE' : '') +
                     (flags.includes('m') ? ' | Pattern.MULTILINE' : '') +
                     (flags.includes('s') ? ' | Pattern.DOTALL' : '');
      const flagArg = jFlags ? jFlags.slice(3) : '';
      code = flagArg
        ? `<span class="ck">Pattern</span> pattern = <span class="ck">Pattern</span>.compile(<span class="cs">"${escHtml(escaped)}"</span>, ${escHtml(flagArg)});\n` +
          `<span class="ck">Matcher</span> matcher = pattern.matcher(input);\n\n` +
          `<span class="cc">// Première correspondance</span>\n` +
          `<span class="ck">if</span> (matcher.find()) {\n` +
          `    String match = matcher.group(<span class="cn">0</span>);\n` +
          `}\n\n` +
          `<span class="cc">// Toutes les correspondances</span>\n` +
          `<span class="ck">while</span> (matcher.find()) {\n` +
          `    System.out.println(matcher.group(<span class="cn">0</span>));\n` +
          `}`
        : `<span class="ck">Pattern</span> pattern = <span class="ck">Pattern</span>.compile(<span class="cs">"${escHtml(escaped)}"</span>);\n` +
          `<span class="ck">Matcher</span> matcher = pattern.matcher(input);\n\n` +
          `<span class="cc">// Première correspondance</span>\n` +
          `<span class="ck">if</span> (matcher.find()) {\n` +
          `    String match = matcher.group(<span class="cn">0</span>);\n` +
          `}\n\n` +
          `<span class="cc">// Toutes les correspondances</span>\n` +
          `<span class="ck">while</span> (matcher.find()) {\n` +
          `    System.out.println(matcher.group(<span class="cn">0</span>));\n` +
          `}`;
    } else {
      code = `<span class="ck">const</span> regex = <span class="cs">/${escHtml(pattern)}/${flags}</span>;\n\n` +
             `<span class="cc">// Test simple</span>\n` +
             `<span class="ck">const</span> ok = regex.test(input);\n\n` +
             `<span class="cc">// Première correspondance</span>\n` +
             `<span class="ck">const</span> match = input.match(<span class="cs">/${escHtml(pattern)}/${flags.replace('g','')}</span>);\n\n` +
             `<span class="cc">// Toutes les correspondances</span>\n` +
             `<span class="ck">const</span> all = [...input.matchAll(<span class="cs">/${escHtml(pattern)}/g${flags.replace('g','')}</span>)];`;
    }
    document.getElementById('rx-code').innerHTML = code;
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Init avec exemple ──
  document.getElementById('rx-pattern').value = '([A-Z][a-z]+)\\s+(\\d{4})';
  document.getElementById('rx-test-input').value = 'Java 2024 et Spring 2023 sont des technos populaires.\nPython 2025 monte aussi en puissance.';
  rxRun();
}
