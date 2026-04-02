export const meta = { id: 'nir', label: 'Validateur NIR' };

export function mount(container) {
  container.innerHTML = `
<div class="tool-wrap">
  <div class="page-header">
    <h1>Validateur NIR</h1>
    <p class="page-desc">Construit, décode et valide un numéro de sécurité sociale français (NIR) à 15 chiffres.</p>
  </div>

  <div class="cards-row">
  <div class="card card-lg">
    <p class="card-title">Construire depuis les données personnelles</p>
    <div class="gender-row">
      <button class="gbtn active" id="gbtn-1" onclick="nirSetGender('1')">Homme</button>
      <button class="gbtn" id="gbtn-2" onclick="nirSetGender('2')">Femme</button>
      <button class="gbtn" id="gbtn-3" onclick="nirSetGender('3')">Né(e) à l'étranger</button>
    </div>
    <div class="form-grid">
      <div class="form-field">
        <label>Année de naissance</label>
        <input type="number" id="f-annee" min="1900" max="2024" placeholder="ex. 1985" oninput="nirBuildFromForm()">
      </div>
      <div class="form-field">
        <label>Mois de naissance</label>
        <select id="f-mois" onchange="nirBuildFromForm()">
          <option value="">— choisir —</option>
          <option value="01">01 — Janvier</option><option value="02">02 — Février</option>
          <option value="03">03 — Mars</option><option value="04">04 — Avril</option>
          <option value="05">05 — Mai</option><option value="06">06 — Juin</option>
          <option value="07">07 — Juillet</option><option value="08">08 — Août</option>
          <option value="09">09 — Septembre</option><option value="10">10 — Octobre</option>
          <option value="11">11 — Novembre</option><option value="12">12 — Décembre</option>
        </select>
      </div>
      <div class="form-field">
        <label>Département de naissance</label>
        <select id="f-dep" onchange="nirBuildFromForm()">
          <option value="">— choisir —</option>
          <option value="01">01 — Ain</option><option value="02">02 — Aisne</option><option value="03">03 — Allier</option>
          <option value="04">04 — Alpes-de-Haute-Provence</option><option value="05">05 — Hautes-Alpes</option>
          <option value="06">06 — Alpes-Maritimes</option><option value="07">07 — Ardèche</option>
          <option value="08">08 — Ardennes</option><option value="09">09 — Ariège</option>
          <option value="10">10 — Aube</option><option value="11">11 — Aude</option>
          <option value="12">12 — Aveyron</option><option value="13">13 — Bouches-du-Rhône</option>
          <option value="14">14 — Calvados</option><option value="15">15 — Cantal</option>
          <option value="16">16 — Charente</option><option value="17">17 — Charente-Maritime</option>
          <option value="18">18 — Cher</option><option value="19">19 — Corrèze</option>
          <option value="2A">2A — Corse-du-Sud</option><option value="2B">2B — Haute-Corse</option>
          <option value="21">21 — Côte-d'Or</option><option value="22">22 — Côtes-d'Armor</option>
          <option value="23">23 — Creuse</option><option value="24">24 — Dordogne</option>
          <option value="25">25 — Doubs</option><option value="26">26 — Drôme</option>
          <option value="27">27 — Eure</option><option value="28">28 — Eure-et-Loir</option>
          <option value="29">29 — Finistère</option><option value="30">30 — Gard</option>
          <option value="31">31 — Haute-Garonne</option><option value="32">32 — Gers</option>
          <option value="33">33 — Gironde</option><option value="34">34 — Hérault</option>
          <option value="35">35 — Ille-et-Vilaine</option><option value="36">36 — Indre</option>
          <option value="37">37 — Indre-et-Loire</option><option value="38">38 — Isère</option>
          <option value="39">39 — Jura</option><option value="40">40 — Landes</option>
          <option value="41">41 — Loir-et-Cher</option><option value="42">42 — Loire</option>
          <option value="43">43 — Haute-Loire</option><option value="44">44 — Loire-Atlantique</option>
          <option value="45">45 — Loiret</option><option value="46">46 — Lot</option>
          <option value="47">47 — Lot-et-Garonne</option><option value="48">48 — Lozère</option>
          <option value="49">49 — Maine-et-Loire</option><option value="50">50 — Manche</option>
          <option value="51">51 — Marne</option><option value="52">52 — Haute-Marne</option>
          <option value="53">53 — Mayenne</option><option value="54">54 — Meurthe-et-Moselle</option>
          <option value="55">55 — Meuse</option><option value="56">56 — Morbihan</option>
          <option value="57">57 — Moselle</option><option value="58">58 — Nièvre</option>
          <option value="59">59 — Nord</option><option value="60">60 — Oise</option>
          <option value="61">61 — Orne</option><option value="62">62 — Pas-de-Calais</option>
          <option value="63">63 — Puy-de-Dôme</option><option value="64">64 — Pyrénées-Atlantiques</option>
          <option value="65">65 — Hautes-Pyrénées</option><option value="66">66 — Pyrénées-Orientales</option>
          <option value="67">67 — Bas-Rhin</option><option value="68">68 — Haut-Rhin</option>
          <option value="69">69 — Rhône</option><option value="70">70 — Haute-Saône</option>
          <option value="71">71 — Saône-et-Loire</option><option value="72">72 — Sarthe</option>
          <option value="73">73 — Savoie</option><option value="74">74 — Haute-Savoie</option>
          <option value="75">75 — Paris</option><option value="76">76 — Seine-Maritime</option>
          <option value="77">77 — Seine-et-Marne</option><option value="78">78 — Yvelines</option>
          <option value="79">79 — Deux-Sèvres</option><option value="80">80 — Somme</option>
          <option value="81">81 — Tarn</option><option value="82">82 — Tarn-et-Garonne</option>
          <option value="83">83 — Var</option><option value="84">84 — Vaucluse</option>
          <option value="85">85 — Vendée</option><option value="86">86 — Vienne</option>
          <option value="87">87 — Haute-Vienne</option><option value="88">88 — Vosges</option>
          <option value="89">89 — Yonne</option><option value="90">90 — Territoire de Belfort</option>
          <option value="91">91 — Essonne</option><option value="92">92 — Hauts-de-Seine</option>
          <option value="93">93 — Seine-Saint-Denis</option><option value="94">94 — Val-de-Marne</option>
          <option value="95">95 — Val-d'Oise</option>
          <option value="97">97 — DOM</option><option value="99">99 — Étranger</option>
        </select>
      </div>
      <div class="form-field">
        <label>Commune de naissance</label>
        <div class="com-wrap">
          <input type="text" class="com-input" id="f-com-search" placeholder="Rechercher une commune…"
            autocomplete="off" oninput="nirOnComSearch(this)" onkeydown="nirOnComKey(event)"
            onfocus="nirOnComFocus()" onblur="nirOnComBlur()">
          <div class="com-dropdown" id="com-dropdown" style="display:none;"></div>
        </div>
        <div id="com-badge-wrap"></div>
        <input type="hidden" id="f-com" value="">
      </div>
      <div class="form-field">
        <label>N° d'ordre</label>
        <input type="text" id="f-ord" maxlength="3" placeholder="ex. 125" oninput="nirBuildFromForm()">
        <span class="hint">3 chiffres, attribué à la naissance</span>
      </div>
    </div>
    <button class="gen-btn" id="gen-btn" onclick="nirGenerate()">Calculer la clé et remplir le NIR ↓</button>
  </div>

  <div class="card card-md">
    <p class="card-title">NIR complet (15 chiffres)</p>
    <input class="nir-input" type="text" id="nir" maxlength="15"
      placeholder="1 85 05 44 056 125 46" oninput="nirOnInput(this)" autocomplete="off" spellcheck="false">
    <div class="highlight-box" id="highlight-box"></div>
    <div class="status-bar" id="status-bar">
      <div class="status-dot" style="background:#bbb;" id="status-dot"></div>
      <span style="font-size:13px;color:var(--muted);" id="status-text">Saisissez un NIR à 15 chiffres</span>
    </div>
    <div class="seg-grid" id="seg-grid"></div>
    <div class="info-box">
      <div style="font-size:11px;color:var(--muted);font-weight:500;margin-bottom:4px;">Structure du NIR</div>
      <div style="font-size:11px;color:var(--muted);line-height:1.7;">
        <b>S</b> (1) · <b>AA</b> (2) · <b>MM</b> (2) · <b>DEP</b> (2) · <b>COM</b> (3) · <b>ORD</b> (3) · <b>CLE</b> (2) = 15 chiffres
      </div>
    </div>
  </div>
  </div><!-- end cards-row -->
  <p class="note">Aucune donnée n'est transmise. Tout est calculé localement dans votre navigateur.</p>
</div>`;

  // ── NIR Logic ──
  let nirSelectedGender = '1';
  let nirComDebounce = null, nirComResults = [], nirComIndex = -1, nirComLocked = false;

  const DEPTS_VALIDES = new Set([
    '01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19',
    '20','21','22','23','24','25','26','27','28','29','2A','2B','30','31','32','33','34','35','36',
    '37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55',
    '56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74',
    '75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93',
    '94','95','97','99'
  ]);
  const SEG_COLORS = ['#185FA5','#0F6E56','#854F0B','#993C1D','#534AB7','#712B13','#444441'];
  const SEG_BG     = ['#E6F1FB','#E1F5EE','#FAEEDA','#FAECE7','#EEEDFE','#FAECE7','#F1EFE8'];

  window.nirSetGender = g => {
    nirSelectedGender = g;
    ['1','2','3'].forEach(v => document.getElementById('gbtn-'+v).classList.toggle('active', v===g));
    nirBuildFromForm();
  };

  window.nirOnComSearch = el => {
    const q = el.value.trim();
    document.getElementById('f-com').value = '';
    document.getElementById('com-badge-wrap').innerHTML = '';
    el.classList.remove('selected'); nirComLocked = false; nirBuildFromForm();
    if (q.length < 2) { nirHideDropdown(); return; }
    el.classList.add('loading');
    clearTimeout(nirComDebounce);
    nirComDebounce = setTimeout(() => nirFetchCommunes(q), 280);
  };

  async function nirFetchCommunes(q) {
    const dep = document.getElementById('f-dep').value;
    const depParam = dep && dep !== '99' ? '&codeDepartement=' + encodeURIComponent(dep.length > 2 ? dep.slice(0,2) : dep) : '';
    const url = 'https://geo.api.gouv.fr/communes?nom=' + encodeURIComponent(q) + depParam + '&fields=nom,code,codeDepartement&boost=population&limit=8';
    try {
      const data = await (await fetch(url)).json();
      nirComResults = data; nirComIndex = -1;
      document.getElementById('f-com-search').classList.remove('loading');
      nirRenderDropdown(data);
    } catch(e) { document.getElementById('f-com-search').classList.remove('loading'); nirHideDropdown(); }
  }

  function nirRenderDropdown(items) {
    const dd = document.getElementById('com-dropdown');
    if (!items.length) { dd.innerHTML = '<div style="padding:10px 12px;font-size:13px;color:var(--muted);">Aucune commune trouvée</div>'; dd.style.display='block'; return; }
    dd.innerHTML = items.map((c,i) => `<div class="com-item" data-i="${i}" onmousedown="nirSelectCommune(${i})">
      <span class="com-item-name">${c.nom} <span style="font-size:11px;color:var(--muted);font-weight:400;">(${c.codeDepartement})</span></span>
      <span class="com-item-code">${c.code.slice(-3)}</span></div>`).join('');
    dd.style.display = 'block';
  }

  window.nirSelectCommune = i => {
    const c = nirComResults[i]; if (!c) return;
    const code = c.code.slice(-3);
    document.getElementById('f-com-search').value = c.nom;
    document.getElementById('f-com-search').classList.add('selected');
    document.getElementById('f-com-search').classList.remove('loading');
    document.getElementById('f-com').value = code;
    document.getElementById('com-badge-wrap').innerHTML = `<span class="com-badge">${code}</span>`;
    nirComLocked = true; nirHideDropdown(); nirBuildFromForm();
  };

  window.nirOnComKey = e => {
    const dd = document.getElementById('com-dropdown');
    if (dd.style.display === 'none') return;
    const items = dd.querySelectorAll('.com-item');
    if (e.key === 'ArrowDown') { e.preventDefault(); nirComIndex = Math.min(nirComIndex+1, items.length-1); items.forEach((el,i)=>el.classList.toggle('active',i===nirComIndex)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); nirComIndex = Math.max(nirComIndex-1,0); items.forEach((el,i)=>el.classList.toggle('active',i===nirComIndex)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (nirComIndex >= 0) nirSelectCommune(nirComIndex); }
    else if (e.key === 'Escape') nirHideDropdown();
  };
  window.nirOnComFocus = () => { if (nirComResults.length && !nirComLocked) nirRenderDropdown(nirComResults); };
  window.nirOnComBlur  = () => { setTimeout(nirHideDropdown, 150); };
  function nirHideDropdown() { document.getElementById('com-dropdown').style.display = 'none'; }

  window.nirBuildFromForm = () => {
    const anneeRaw = document.getElementById('f-annee').value.trim();
    const mois = document.getElementById('f-mois').value;
    const dep  = document.getElementById('f-dep').value;
    const comRaw = document.getElementById('f-com').value.trim();
    const ordRaw = document.getElementById('f-ord').value.trim();
    if (!anneeRaw || !mois || !dep) { if (anneeRaw) { const a=String(anneeRaw).slice(-2).padStart(2,'0'); document.getElementById('nir').value=nirSelectedGender+a+(mois||''); nirOnInput(document.getElementById('nir')); } return; }
    const annee = String(anneeRaw).slice(-2).padStart(2,'0');
    const depCode = dep.length > 2 ? dep.slice(0,2) : dep;
    const com = comRaw.padStart(3,'0').slice(-3);
    const ord = ordRaw ? ordRaw.padStart(3,'0').slice(-3) : '';
    document.getElementById('nir').value = nirSelectedGender + annee + mois + depCode.padStart(2,'0').slice(-2) + com + ord;
    nirOnInput(document.getElementById('nir'));
  };

  window.nirGenerate = () => {
    nirBuildFromForm();
    const nirEl = document.getElementById('nir');
    const n = nirClean(nirEl.value);
    const btn = document.getElementById('gen-btn');
    if (n.length === 13) {
      const cle = nirCalcCle(n);
      if (cle !== null) {
        const full = n + String(cle).padStart(2,'0');
        nirEl.value = full; nirOnInput(nirEl);
        navigator.clipboard.writeText(full).then(() => {
          btn.textContent = 'NIR copié dans le presse-papier !';
          btn.style.background='#E1F5EE'; btn.style.borderColor='#1D9E75'; btn.style.color='#0F6E56';
          setTimeout(() => { btn.textContent='Calculer la clé et remplir le NIR ↓'; btn.style.background=btn.style.borderColor=btn.style.color=''; }, 2200);
        }).catch(()=>{});
      }
    }
  };

  function nirClean(v) { return v.replace(/[\s\-\.]/g,'').toUpperCase(); }
  function nirCalcCle(n13) {
    let s = n13.replace(/2A/i,'19').replace(/2B/i,'18');
    if (!/^\d{13}$/.test(s)) return null;
    return 97 - (parseInt(s) % 97);
  }

  function nirDecode(raw) {
    const n = nirClean(raw);
    if (n.length < 1) return null;
    const sexe=n.slice(0,1), annee=n.slice(1,3), mois=n.slice(3,5), dep=n.slice(5,7), com=n.slice(7,10), ord=n.slice(10,13), cle=n.slice(13,15);
    const segs = [];
    if (sexe) { const ok=sexe==='1'||sexe==='2'||sexe==='3'; segs.push({key:'Sexe',value:sexe,desc:ok?(sexe==='1'?'Homme':sexe==='2'?'Femme':'Né(e) à l\'étranger'):'Valeur invalide',state:ok?'ok':'err'}); }
    if (n.length>1) segs.push({key:'Année',value:annee,desc:annee.length===2?'19'+annee+' / 20'+annee:'…',state:annee.length===2?'ok':'warn'});
    if (n.length>3) { const m=parseInt(mois); const ok=m>=1&&m<=12; const noms=['','Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']; segs.push({key:'Mois',value:mois,desc:mois.length===2?(ok?noms[m]:'Mois invalide'):'…',state:mois.length<2?'warn':ok?'ok':'err'}); }
    if (n.length>5) { const du=dep.replace(/2a/i,'2A').replace(/2b/i,'2B'); const ok=DEPTS_VALIDES.has(du)||dep==='97'||dep==='99'; segs.push({key:'Département',value:dep,desc:dep.length===2?(ok?'Département '+dep:'Code inconnu'):'…',state:dep.length<2?'warn':ok?'ok':'err'}); }
    if (n.length>7)  segs.push({key:'Commune',value:com,desc:com.length===3?'Code commune INSEE':'…',state:com.length===3?'ok':'warn'});
    if (n.length>10) segs.push({key:'N° ordre',value:ord,desc:ord.length===3?'Ordre dans le registre':'…',state:ord.length===3?'ok':'warn'});
    if (n.length===15) { const att=nirCalcCle(n.slice(0,13)); const ci=parseInt(cle); const ok=att!==null&&ci===att; segs.push({key:'Clé',value:cle,desc:att!==null?(ok?'Clé valide (attendu: '+att+')':'Attendu: '+att+', reçu: '+ci):'Calcul impossible',state:att===null?'warn':ok?'ok':'err'}); }
    else if (n.length>13) segs.push({key:'Clé',value:cle,desc:'Saisie en cours…',state:'warn'});
    return segs;
  }

  function nirBuildHighlight(raw) {
    const n = nirClean(raw); if (!n) return '';
    const parts=[{len:1,label:'S'},{len:2,label:'AA'},{len:2,label:'MM'},{len:2,label:'DEP'},{len:3,label:'COM'},{len:3,label:'ORD'},{len:2,label:'CLÉ'}];
    let pos=0, html='';
    parts.forEach((p,i)=>{ const chunk=n.slice(pos,pos+p.len); if(!chunk)return; html+=`<div class="hl-seg" style="background:${SEG_BG[i]};color:${SEG_COLORS[i]};" title="${p.label}">${chunk}</div>`; pos+=p.len; });
    return html;
  }

  window.nirOnInput = el => {
    const raw = el.value; const n = nirClean(raw);
    document.getElementById('highlight-box').innerHTML = nirBuildHighlight(raw);
    const segs = nirDecode(raw);
    const dot=document.getElementById('status-dot'), txt=document.getElementById('status-text'), bar=document.getElementById('status-bar'), grid=document.getElementById('seg-grid');
    if (!segs||n.length===0) { grid.innerHTML=''; dot.style.background='#bbb'; txt.textContent='Saisissez un NIR à 15 chiffres'; bar.style.borderColor=''; return; }
    grid.innerHTML=segs.map(s=>`<div class="seg ${s.state}"><p class="seg-label">${s.key}</p><p class="seg-value">${s.value}</p><p class="seg-desc">${s.desc}</p></div>`).join('');
    const hasErr=segs.some(s=>s.state==='err'); const complete=n.length===15;
    if (!complete) { dot.style.background='#BA7517'; txt.textContent=n.length+' / 15 chiffres saisis'; bar.style.borderColor='#BA7517'; }
    else if (hasErr) { dot.style.background='#D85A30'; txt.textContent='NIR invalide — une ou plusieurs erreurs détectées'; bar.style.borderColor='#D85A30'; }
    else { dot.style.background='#1D9E75'; txt.textContent='NIR valide — clé de contrôle correcte'; bar.style.borderColor='#1D9E75'; }
  };
}
