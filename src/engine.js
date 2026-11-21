/* ===== MOTEUR : aucune donnée d'enquête ici, tout vient de AFFAIRE ===== */
(function () {
  'use strict';
  const A = AFFAIRE;
  const KEY = 'ENG1:' + A.id, OKEY = 'ENG1:options';
  const SCHEMA = 2;
  const SUSPECTS = ['solange', 'lucien', 'odile', 'yann', 'mathilde', 'salaun'];
  const ACTES = {1: 'La scène', 2: 'Les versions', 3: 'Les vérifications', 4: 'La confrontation'};
  const COUT = {2: 1, 3: 2, 4: 3};
  const MODES = ['stagiaire', 'inspecteur', 'commissaire'];
  const app = document.getElementById('app');

  /* --- stockage tolérant (try/catch, repli mémoire) --- */
  const mem = {};
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return mem[k] || null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  };

  /* --- état --- */
  const fresh = () => ({
    schema: SCHEMA, caseVersion: A.version, acte: 1, indices: {}, flags: {}, asked: {}, vus: {},
    attach: {C1: [], C2: [], C3: [], C4: []}, statut: {}, aide: {cout: 0, n: [0, 0, 0, 0]},
    conf: [], aveu: [], cas: {}, verifN: 0, mode: 'inspecteur', journal: [],
    chrono: {ordre: ['k5', 'k2', 'k7', 'k1', 'k4', 'k8', 'k3', 'k6'], essais: 0},
    fin: null, lastNew: Date.now(), t0: Date.now()
  });
  let S = fresh();
  let OPT = {big: 0, sound: 0, anim: 1, voix: 1, desc: 1, descAcc: 0, amb: 0};
  const UI = {view: 'accueil', params: {}, stack: [], dossierTab: 'indices', suspect: SUSPECTS[0], panel: null,
    reply: null, verif: null, aideMsg: null, acc: {sus: null, preuves: []}, confMsg: null, palier: {}, segMsg: null, msg: null, shift: 0};

  function save() { store.set(KEY, JSON.stringify(S)); }
  function saveOpt() { store.set(OKEY, JSON.stringify(OPT)); }
  function loadOpt() { try { const o = JSON.parse(store.get(OKEY) || 'null'); if (o) OPT = Object.assign(OPT, o); } catch (e) {} }
  function loadState() {
    try {
      const o = JSON.parse(store.get(KEY) || 'null');
      if (!o || o.schema !== SCHEMA) return false;
      /* migration : une version de contenu différente garde la progression si les identifiants existent encore */
      const base = fresh();
      S = Object.assign(base, o);
      S.attach = Object.assign(base.attach, o.attach || {});
      S.caseVersion = A.version;
      return true;
    } catch (e) { return false; }
  }
  const hasSave = () => { try { const o = JSON.parse(store.get(KEY) || 'null'); return !!(o && o.schema === SCHEMA); } catch (e) { return false; } };

  /* --- logique --- */
  const concl = id => A.conclusions.find(c => c.id === id);
  function evalC(c) {
    const a = (S.attach[c.id] || []).filter(x => S.indices[x]);
    const manque = c.requis.some(x => !a.includes(x));
    const faux = a.filter(x => (A.fausses || []).includes(x));
    const extras = a.filter(x => !c.requis.includes(x) && !c.bonus.includes(x) && !faux.includes(x));
    return {vide: !a.length, manque, faux, extras, ok: !manque && !faux.length && extras.length <= 1};
  }
  function etablie(c) { return evalC(c).ok; }
  function has(k) {
    if (k.startsWith('i:')) return !!S.indices[k.slice(2)];
    if (k.startsWith('q:')) return !!S.asked[k.slice(2)];
    if (k.startsWith('c:')) return etablie(concl(k.slice(2)));
    return !!S.flags[k.replace(/^f:/, '')];
  }
  const hasAll = arr => (arr || []).every(has);
  const ownedIds = () => A.rangIndices.filter(id => S.indices[id]);
  const toast = (msg) => {
    if (S && S.journal && !/^(Résultat copié|Mode Commissaire)/.test(msg)) { const last = S.journal[S.journal.length - 1]; if (!last || last !== msg) S.journal.push(msg); if (S.journal.length > 120) S.journal.shift(); }
    const old = document.querySelector('.toast'); if (old) old.remove();
    const d = document.createElement('div'); d.className = 'toast'; d.textContent = msg; d.setAttribute('role', 'status');
    d.onclick = () => d.remove(); document.body.appendChild(d); setTimeout(() => d.remove(), 5200);
  };
  let ac = null;
  function blip(f, dur) {
    if (!OPT.sound) return;
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; o.type = 'triangle'; g.gain.value = .05; o.connect(g); g.connect(ac.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + dur); o.stop(ac.currentTime + dur); } catch (e) {}
  }
  function checkUnlocks() {
    A.deblocages.forEach(d => {
      if (!S.flags['d:' + d.id] && hasAll(d.quand)) {
        S.flags['d:' + d.id] = 1; S.acte = Math.max(S.acte, d.acte); toast(d.msg); blip(d.rebond ? 330 : 520, .3);
        (d.flags || []).forEach(setFlag);
      }
    });
  }
  function gain(id) {
    if (S.indices[id]) return false;
    S.indices[id] = {lu: false, ts: Date.now()}; S.lastNew = Date.now();
    toast('Nouvel indice : ' + A.indices[id].titre); blip(660, .25);
    return true;
  }
  function setFlag(f) {
    if (S.flags[f]) return false;
    S.flags[f] = 1;
    A.lieux.forEach(l => l.elements.forEach(e => { if (e.requiert && e.requiert.includes(f) && hasAll(e.requiert)) toast(e.apparait || 'Nouvel élément : ' + e.nom); }));
    return true;
  }
  const lieuOuvert = l => hasAll(l.requiert);
  const elVisible = e => hasAll(e.requiert);
  const persoVisible = p => hasAll(A.persos[p].requiert);
  function examiner(lid, eid) {
    const l = A.lieux.find(x => x.id === lid), e = l.elements.find(x => x.id === eid);
    S.vus[lid + '.' + eid] = 1;
    if (e.indice) gain(e.indice);
    (e.flags || []).forEach(f => { if (!S.flags[f]) { S.flags[f] = 1; if (e.suite || e.apparait) toast(e.suite || e.apparait); } });
    checkUnlocks(); save();
  }
  function poser(pid, pal, qid) {
    const P = A.persos[pid], q = (pal === 1 ? P.p1 : P.p2).find(x => x.id === qid);
    S.asked[pid + '.' + qid] = 1;
    if (pal === 1) S.flags['t:' + pid] = 1;
    (q.donne || []).forEach(gain); (q.flags || []).forEach(setFlag);
    checkUnlocks(); save();
    UI.reply = {pid, text: q.r, q: q.q};
  }
  function presenter(pid, iid) {
    const P = A.persos[pid], r = (P.react || {})[iid];
    S.asked[pid + '.p.' + iid] = 1;
    if (r) { (r.donne || []).forEach(gain); (r.flags || []).forEach(setFlag); }
    checkUnlocks(); save();
    UI.reply = {pid, text: r ? r.r : P.defaut, q: 'Vous présentez : ' + A.indices[iid].titre};
  }

  /* --- fins --- */
  function finDe(sus, preuves) {
    if (sus === 'yann') return 'D';
    if (sus === 'solange') return 'Bsol';
    if (sus !== 'odile') return 'B';
    return preuves.includes('C3') && (preuves.includes('C1') || preuves.includes('C2')) ? 'A' : 'C';
  }
  function rang() {
    const nb = A.conclusions.filter(etablie).length;
    const alibis = ['I13', 'I14', 'I15'].every(i => S.indices[i]);
    let st = nb === 4 && alibis && has('d:aveuBrise') && has('d:chronoOK') ? 3 : 2;
    if (S.aide.cout > 12) st -= 2; else if (S.aide.cout > 3) st -= 1;
    if (S.mode === 'stagiaire') st = Math.min(st, 2);
    return Math.max(1, st);
  }

  const perspicace = () => !!(S.flags.coffreOK && S.flags.chiffreOK && S.flags.photoOK);
  const coutAide = n => S.mode === 'stagiaire' ? 0 : COUT[n];
  const aideOk = n => S.mode !== 'commissaire' || n === 3;

  /* --- audio de synthèse (aucun fichier) --- */
  let AC = null;
  function actx() { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; }
  function envOsc(type, f0, f1, t, dur, g) {
    const c = actx(), o = c.createOscillator(), gn = c.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(gn); gn.connect(c.destination); o.start(t); o.stop(t + dur + .02);
  }
  function noiseBurst(t, dur, g, freq, type) {
    const c = actx(), n = Math.max(1, Math.floor(c.sampleRate * dur)), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq;
    const gn = c.createGain(); gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(.0001, t + dur);
    src.connect(f); f.connect(gn); gn.connect(c.destination); src.start(t); src.stop(t + dur);
  }
  const heel = (t, g) => { noiseBurst(t, .05, g, 2200); envOsc('square', 1400, 500, t, .04, g * .25); };
  const bell = t => { envOsc('sine', 523, null, t, 1.4, .25); envOsc('sine', 1046, null, t, .9, .12); envOsc('sine', 1568, null, t, .5, .06); };
  function parler(txt, pitch, vol) {
    if (!OPT.voix || !window.speechSynthesis) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = 'fr-FR'; u.rate = .95; u.pitch = pitch || 1; u.volume = vol == null ? 1 : vol; speechSynthesis.speak(u); } catch (e) {}
  }
  function jouer(seg) {
    try {
      const c = actx(), t0 = c.currentTime + .05;
      if (seg.son === 'voix') parler(seg.voix, .8, 1);
      else if (seg.son === 'pas') { let t = t0, dt = .5; for (let i = 0; i < seg.n; i++) { heel(t, .35 + i * .04); t += dt; dt = Math.max(.3, dt - .015); } }
      else if (seg.son === 'coup') { parler(seg.voix, .7, .5); envOsc('sine', 110, 35, t0 + 1.7, .35, .9); noiseBurst(t0 + 1.7, .15, .4, 200, 'lowpass'); }
      else if (seg.son === 'descente') { let t = t0; for (let i = 0; i < 5; i++) { heel(t, .4); t += .28; } for (let i = 0; i < 9; i++) envOsc('square', 2600, 2400, t + i * .06, .02, .08); t += .7; noiseBurst(t, .25, .5, 5000, 'highpass'); envOsc('triangle', 3200, 1500, t, .12, .15); }
      else if (seg.son === 'cloches') { for (let i = 0; i < seg.n; i++) bell(t0 + i * 1.15); }
      else if (seg.son === 'pluie') { noiseBurst(t0, 3.2, .35, 3500, 'highpass'); noiseBurst(t0, 3.2, .2, 900, 'bandpass'); }
    } catch (e) {}
  }
  /* ambiance : mer, mouettes (synthèse, aucun fichier) */
  let AMB = null;
  function mouette() {
    if (!AMB) return;
    try { if (AMB.lvl > 0) { const c = actx(), t = c.currentTime + .05; envOsc('sine', 1900, 1250, t, .28, .04 * AMB.lvl); envOsc('sine', 2100, 1400, t + .35, .22, .035 * AMB.lvl); } } catch (e) {}
    AMB.timer = setTimeout(mouette, 8000 + Math.random() * 9000);
  }
  function ambStart() {
    if (AMB || !OPT.amb) return;
    try {
      const c = actx(), n = c.sampleRate * 4, buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0); let l = 0;
      for (let i = 0; i < n; i++) { l = (l + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; }
      const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
      const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420;
      const g = c.createGain(); g.gain.value = .09;
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = .12; lg.gain.value = .04; lfo.connect(lg); lg.connect(g.gain);
      src.connect(f); f.connect(g); g.connect(c.destination); src.start(); lfo.start();
      AMB = {src, lfo, g, c, lvl: 1, timer: setTimeout(mouette, 4000)};
    } catch (e) { AMB = null; }
  }
  function ambStop() { if (!AMB) return; try { AMB.src.stop(); AMB.lfo.stop(); clearTimeout(AMB.timer); } catch (e) {} AMB = null; }
  function ambLevel(v) { if (AMB) { AMB.lvl = v; try { AMB.g.gain.setTargetAtTime(.09 * v, AMB.c.currentTime, .3); } catch (e) {} } }
  const descVisible = () => S.mode !== 'commissaire' ? !!OPT.desc : !!OPT.descAcc;

  /* --- chronologie --- */
  const card = id => A.chrono.cartes.find(c => c.id === id);
  const chVis = () => S.chrono.ordre.filter(id => has(card(id).req));
  function chMove(id, dir) {
    const vis = chVis(), i = vis.indexOf(id), j = i + (dir === 'up' ? -1 : 1);
    if (i < 0 || j < 0 || j >= vis.length) return;
    const t = vis[i]; vis[i] = vis[j]; vis[j] = t;
    let k = 0; S.chrono.ordre = S.chrono.ordre.map(x => has(card(x).req) ? vis[k++] : x);
  }
  const norm = t => String(t).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const decode = (t, k) => t.replace(/[A-Z]/g, ch => String.fromCharCode((ch.charCodeAt(0) - 65 - k + 26) % 26 + 65));

  /* --- aide --- */
  function cap() {
    const nbI = ownedIds().length, nbC = A.conclusions.filter(etablie).length;
    const reste = [];
    A.lieux.filter(lieuOuvert).forEach(l => {
      const n = l.elements.filter(e => elVisible(e) && !S.vus[l.id + '.' + e.id]).length;
      if (n) reste.push(l.nom + ' (' + n + ')');
    });
    const nonInt = SUSPECTS.filter(s => !S.flags['t:' + s]).map(s => A.persos[s].nom);
    let t = `Acte ${S.acte} — ${ACTES[S.acte]}. Indices : ${nbI}/${A.rangIndices.length}. Conclusions établies : ${nbC}/4.`;
    if (reste.length) t += ` Éléments encore à examiner : ${reste.join(', ')}.`;
    if (S.acte >= 2 && nonInt.length) t += ` Pas encore interrogés : ${nonInt.join(', ')}.`;
    if (!reste.length && !nonInt.length) t += ` Tout a été examiné : ouvrez le tableau de déduction.`;
    return t;
  }
  function aideN(n) {
    if (!aideOk(n)) { UI.aideMsg = 'Indisponible en mode Commissaire.'; return; }
    if (n === 1) { UI.aideMsg = cap(); S.aide.n[0]++; }
    else {
      const step = A.aide.find(s => !has(s.manque));
      const key = {2: 'piste', 3: 'coup', 4: 'rev'}[n];
      UI.aideMsg = step ? step[key] : `Tout est en place. Ouvrez le tableau de déduction, puis accusez.`;
      S.aide.cout += coutAide(n); S.aide.n[n - 1]++;
    }
    S.lastNew = Date.now(); save();
  }

  /* --- navigation --- */
  function go(view, params) { UI.stack.push({view: UI.view, params: UI.params}); UI.view = view; UI.params = params || {}; UI.panel = null; UI.reply = null; render(); window.scrollTo(0, 0); }
  function back() {
    const p = UI.stack.pop();
    if (p) { UI.view = p.view; UI.params = p.params; } else { UI.view = 'hub'; UI.params = {}; }
    UI.panel = null; UI.reply = null; render(); window.scrollTo(0, 0);
  }
  function root(view) { UI.stack = []; UI.view = view; UI.params = {}; UI.panel = null; UI.reply = null; render(); window.scrollTo(0, 0); }

  /* --- vues --- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const btn = (act, label, o = {}) => `<button class="btn ${o.cls || ''}" data-act="${act}" ${o.a !== undefined ? `data-a="${esc(o.a)}"` : ''} ${o.b !== undefined ? `data-b="${esc(o.b)}"` : ''}>${label}${o.small ? `<small>${o.small}</small>` : ''}</button>`;
  const chip = (t, x, act, a, b) => `<button class="chip ${x ? 'x' : ''}" data-act="${act}" data-a="${a}" data-b="${b || ''}">${esc(t)}</button>`;
  const who = (pid) => { const P = A.persos[pid]; return `<div class="who"><div class="portrait">${ART.portrait(P.look)}</div><div><b>${esc(P.nom)}</b><div class="mute">${esc(P.role)}</div></div></div>`; };
  const pickList = (act, a) => ownedIds().map(id => btn(act, esc(A.indices[id].titre), {a, b: id, small: esc(A.indices[id].lieu)})).join('') || `<p class="mute">Votre dossier est vide.</p>`;

  const VIEWS = {
    accueil() {
      return {title: '', html: `<div class="title"><div class="sub">DOUARNENEZ · 1987</div><div class="big">LA DERNIÈRE<br>PÊCHE</div><div class="sub">UNE ENQUÊTE POLICIÈRE</div></div>
      <div class="scene grain">${ART.scene('cour')}</div>
      ${(() => { let sv = null; try { sv = JSON.parse(store.get(KEY) || 'null'); } catch (e) {} if (!(sv && sv.schema === SCHEMA)) return btn('nouvelle', 'Nouvelle enquête', {cls: 'pri'}); const info = sv.fin ? 'Enquête terminée' : 'Acte ' + sv.acte + ' · ' + Object.keys(sv.indices || {}).length + ' indices · ' + A.modes[sv.mode || 'inspecteur'].nom; return btn('reprendre', 'Reprendre l\'enquête', {cls: 'pri', small: info}) + btn('nouvelle', 'Nouvelle enquête'); })()}
      <div class="row">${btn('options', 'Options')}${btn('credits', 'Crédits')}</div>
      <p class="mute" style="text-align:center">Trois niveaux de difficulté · Sauvegarde automatique · Hors ligne</p>`};
    },
    tuto() {
      const L = [['Lieux', 'Touchez un lieu, puis chaque objet ou personne. Les nouveaux éléments sont signalés par un badge.'], ['Dossier', 'Le bouton Dossier garde vos indices, les déclarations des suspects, les pistes et le journal de bord.'], ['Interroger', 'Posez les questions, puis présentez une pièce du dossier pour faire réagir.'], ['Déduire', 'Dans le tableau de déduction, rattachez les bons indices à chaque conclusion.'], ['Aide', 'Quatre niveaux, du plus discret au plus direct. Elle ne bloque jamais l\'enquête.']];
      return {title: 'En 30 secondes', html: L.map(x => `<div class="panel"><b style="color:var(--sodium)">${x[0]}</b><br>${esc(x[1])}</div>`).join('') + `<p class="mute">Votre progression est sauvegardée automatiquement.</p>` + (S.flags.tutoVu ? btn('back', 'Retour', {cls: 'pri'}) : btn('tutoVu', 'Compris, commencer', {cls: 'pri'}))};
    },
    carte() {
      return {title: 'Douarnenez', html: `<div class="scene grain">${ART.carte()}</div>${btn('balade', 'Balade sur place', {cls: 'pri', small: 'Un parcours à pied, de port en port'})}
      <div class="panel"><b style="color:var(--sodium)">Le Rosmeur</b><br>Le vieux port de pêche, au pied des ruelles en pente.</div>
      <div class="panel"><b style="color:var(--sodium)">Le Port-Rhu</b><br>La ria. Au fond, l'usine Morvan (fiction).</div>
      <div class="panel"><b style="color:var(--sodium)">Tréboul</b><br>L'autre rive : villas et plage des Sables Blancs. L'étude de Me Quéré s'y trouve.</div>
      <div class="panel"><b style="color:var(--sodium)">L'île Tristan</b><br>Face au Port-Rhu. On la devine depuis la cour de l'usine.</div>
      <h3>Carnet de Douarnenez (${A.carnet.filter(k => !k.lieu || S.flags['v:' + k.lieu]).length}/${A.carnet.length})</h3>
      ${A.carnet.map(k => (!k.lieu || S.flags['v:' + k.lieu]) ? `<div class="panel"><b style="color:var(--sodium)">${esc(k.titre)}</b><br>${esc(k.texte)}</div>` : `<div class="panel mute">🔒 À découvrir en visitant : ${esc(A.lieux.find(l => l.id === k.lieu).nom)}</div>`).join('')}
      <p class="mute">Ces notes reprennent des faits locaux publics ; l'usine Morvan et l'affaire sont fictives.</p>`};
    },
    balade() {
      const B = A.balade;
      return {title: 'Balade', html: `<p>${esc(B.intro)}</p>` + B.etapes.map((e, i) => `<div class="panel"><b style="color:var(--sodium)">${i + 1}. ${esc(e.nom)}</b><br><span class="mute">Dans le jeu :</span> ${esc(e.jeu)}<br><span class="mute">Sur place :</span> ${esc(e.sur)}<br><a href="https://www.openstreetmap.org/search?query=${encodeURIComponent(e.q)}" target="_blank" rel="noopener" style="color:var(--sodium)">Voir sur une carte (connexion requise)</a></div>`).join('') + `<p class="mute">${esc(B.conseil)}</p><p class="mute">Respectez les lieux et les riverains. Le jeu n'est pas une activité de plein air : jouez à l'arrêt, en sécurité.</p>`};
    },
    mode() {
      return {title: 'Niveau', html: `<p class="mute">Choisissez votre niveau. Il ne change ni l'enquête ni le coupable.</p>${MODES.map(m => btn('mode', esc(A.modes[m].nom) + (m === 'inspecteur' ? ' (conseillé)' : ''), {a: m, small: esc(A.modes[m].desc), cls: m === 'inspecteur' ? 'pri' : ''})).join('')}`};
    },
    briefing() {
      return {title: 'Briefing', html: `<div class="scene grain">${ART.scene('cour')}</div>${A.briefing.map(p => `<div class="speech">${esc(p)}</div>`).join('')}${btn('tuto', 'Continuer', {cls: 'pri'})}`};
    },
    hub() {
      const nbI = ownedIds().length, nbC = A.conclusions.filter(etablie).length;
      const pistes = A.pistes.filter(p => hasAll(p.quand));
      const open = pistes.filter(p => !hasAll(p.fin)), done = pistes.length - open.length;
      const lieux = A.lieux.map(l => {
        if (!lieuOuvert(l)) return `<button class="btn dim lock" disabled>🔒 ${esc(l.nom)}<small>${esc(l.verrou)}</small></button>`;
        const n = l.elements.filter(e => elVisible(e) && !S.vus[l.id + '.' + e.id]).length;
        return btn('lieu', esc(l.nom) + (n ? `<span class="badge new">${n}</span>` : ''), {a: l.id, small: esc(l.desc.split('.')[0])});
      }).join('');
      const reb = A.deblocages.filter(d => d.rebond && S.flags['d:' + d.id]);
      return {title: 'Enquête', html: `<div class="panel"><span class="mute">Acte ${S.acte} — ${ACTES[S.acte]} · ${esc(A.modes[S.mode].nom)}</span><br>Indices ${nbI}/${A.rangIndices.length} · Conclusions ${nbC}/4</div>
      ${reb.map(d => `<div class="warn">${esc(d.msg)}</div>`).join('')}
      <h3>Lieux</h3>${lieux}
      ${btn('carte', 'La carte de Douarnenez', {small: 'Rosmeur, Port-Rhu, Tréboul, île Tristan'})}
      <h3>Pistes ouvertes${done ? ` (${done} résolues)` : ''}</h3>
      ${open.length ? open.slice(0, 4).map(p => `<div class="panel">▸ ${esc(p.texte)}</div>`).join('') : `<p class="mute">Aucune piste ouverte pour le moment. Examinez la scène.</p>`}
      <h3>Déduire</h3>
      ${btn('deduction', 'Tableau de déduction', {small: 'Rattachez vos indices à 4 conclusions'})}
      ${has('d:aveu') ? btn('aveu', 'L\'aveu de Solange Morvan', {cls: has('d:aveuBrise') ? 'done' : 'pri', small: has('d:aveuBrise') ? 'Aveu brisé' : 'À examiner'}) : ''}
      ${has('d:aveuBrise') ? btn('chrono', 'La chronologie de la nuit', {cls: has('d:chronoOK') ? 'done' : 'pri', small: has('d:chronoOK') ? 'Reconstituée' : 'À reconstituer'}) : ''}
      ${hasAll(['d:acte4']) ? btn('confront', 'Confrontation avec Odile Quéré', {cls: 'pri', small: 'Acte 4'}) : ''}
      ${btn('accuser', 'Accuser quelqu\'un', {cls: 'red'})}`};
    },
    lieu(p) {
      const l = A.lieux.find(x => x.id === p.id);
      const els = l.elements.filter(elVisible).map(e => btn('obj', esc(e.nom), {a: l.id, b: e.id, cls: S.vus[l.id + '.' + e.id] ? 'done' : ''})).join('');
      const pers = (l.persos || []).filter(persoVisible).map(pid => btn('perso', esc(A.persos[pid].nom), {a: pid, small: esc(A.persos[pid].role), cls: S.flags['t:' + pid] ? 'done' : ''})).join('');
      return {title: l.nom, html: `<div class="scene grain">${ART.scene(l.id)}</div><p>${esc(l.desc)}</p><h3>À examiner</h3>${els}${pers ? `<h3>Personnes présentes</h3>${pers}` : ''}`};
    },
    obj(p) {
      const l = A.lieux.find(x => x.id === p.lieu), e = l.elements.find(x => x.id === p.el);
      if (e.indice) {
        const I = A.indices[e.indice];
        return {title: l.nom, html: `<div class="card grain">${ART.icon(I.ico)}<h2>${esc(I.titre)}</h2><p>${esc(I.texte)}</p><span class="stamp">INDICE</span></div><p class="mute">Ajouté au dossier.</p>${btn('back', 'Continuer', {cls: 'pri'})}`};
      }
      return {title: l.nom, html: `<h2>${esc(e.nom)}</h2><div class="speech">${esc(e.texte)}</div>${btn('back', 'Continuer', {cls: 'pri'})}`};
    },
    perso(p) {
      const P = A.persos[p.id];
      const pal = UI.palier[p.id] || 1;
      const locked2 = !has(P.req2);
      const hasP2 = P.p2.length > 0;
      const list = (pal === 1 ? P.p1 : P.p2).filter(q => hasAll(q.requiert));
      const qs = list.map(q => btn('q', esc(q.q), {a: p.id, b: pal + ':' + q.id, cls: S.asked[p.id + '.' + q.id] ? 'done' : ''})).join('');
      const reply = UI.reply && UI.reply.pid === p.id ? `<div class="panel mute">${esc(UI.reply.q)}</div><div class="speech">${esc(UI.reply.text)}</div>` : `<div class="speech"><em>${esc(P.intro)}</em></div>`;
      const tabs = hasP2 ? `<div class="tabs"><button class="tab ${pal === 1 ? 'on' : ''}" data-act="palier" data-a="${p.id}" data-b="1">Version officielle</button><button class="tab ${pal === 2 ? 'on' : ''}" data-act="palier" data-a="${p.id}" data-b="2">Creuser${locked2 ? ' 🔒' : ''}</button></div>` : '';
      let corps;
      if (pal === 2 && locked2) corps = `<div class="panel">${esc(P.verrou2)}</div>`;
      else corps = qs || `<p class="mute">Plus de questions pour l'instant.</p>`;
      const pres = UI.panel === 'pres' ? `<h3>Présenter une pièce</h3>${pickList('pres', p.id)}` : btn('presenter', 'Présenter une pièce du dossier', {a: p.id, cls: 'red'});
      return {title: P.nom, html: `${who(p.id)}${reply}${tabs}${corps}<div class="sep"></div>${pres}`};
    },
    cassette() {
      const C = A.cassette, done = C.segments.filter(x => S.cas[x.id]).length;
      const open = UI.panel && UI.panel.startsWith('seg:') ? +UI.panel.slice(4) : null;
      const rows = C.segments.map(x => {
        const head = btn('seg', 'Séquence ' + x.id + (S.cas[x.id] ? ' ✓' : ''), {a: x.id, cls: S.cas[x.id] ? 'done' : ''});
        if (open !== x.id) return head;
        const sub = x.voix ? `<div class="speech">Sous-titre : « ${esc(x.voix)} »</div>` : '';
        const desc = descVisible() ? `<div class="panel mute">${esc(x.desc)}</div>` : '';
        const qs = S.cas[x.id] ? `<div class="good">${esc(x.ok)}</div>` : `<p><b>${esc(x.q)}</b></p>${x.opts.map((o, i) => btn('cRep', esc(o), {a: x.id, b: i})).join('')}`;
        return head + `<div class="panel">${btn('cPlay', '▶ Écouter', {a: x.id, cls: 'pri'})}${sub}${desc}${qs}${UI.segMsg ? `<div class="warn">${esc(UI.segMsg)}</div>` : ''}</div>`;
      }).join('');
      const fin = S.indices.I16 ? `<div class="good">Cassette décodée. L'indice est ajouté au dossier.</div>` : '';
      return {title: 'Le magnétophone', html: `<div class="scene grain">${ART.scene('gendarmerie')}</div><p>${esc(C.intro)}</p><p class="mute">Séquences décodées : ${done}/${C.segments.length}. Une mauvaise réponse ne coûte rien : réécoutez.</p>${rows}${fin}`};
    },
    coffre() {
      const C = A.coffre, ok = !!S.indices.I19;
      const I = A.indices.I19;
      if (ok) return {title: 'Le coffre', html: `<div class="card grain">${ART.icon(I.ico)}<h2>${esc(I.titre)}</h2><p>${esc(I.texte)}</p></div>`};
      const hint = S.mode === 'stagiaire' ? `<div class="panel mute">${esc(C.aide)}</div>` : S.mode === 'inspecteur' ? (UI.panel === 'hint' ? `<div class="panel mute">${esc(C.aide)}</div>` : btn('hint', 'Un indice')) : '';
      return {title: 'Le coffre', html: `<div class="speech">${esc(C.texte)}</div><input id="code" class="inp" inputmode="numeric" maxlength="4" autocomplete="off" aria-label="Code à quatre chiffres" placeholder="····">${btn('coffreOk', 'Essayer ce code', {cls: 'pri'})}${UI.msg ? `<div class="warn">${esc(UI.msg)}</div>` : ''}${hint}`};
    },
    chiffre() {
      const C = A.chiffre, ok = !!S.flags.chiffreOK;
      if (ok) return {title: 'Le dos de l\'agenda', html: `<div class="good">Message déchiffré : « ${esc(C.clair)} ».</div><p class="mute">Gaspard savait que quelqu'un viendrait fouiller ses affaires.</p>`};
      const roue = S.mode !== 'commissaire' ? `<div class="panel"><b>Roue de décalage</b><div class="row">${btn('shift', '−', {a: -1})}${btn('shift', '+', {a: 1})}</div><p>Décalage : ${UI.shift}</p><p class="mono">${esc(decode(C.chiffre, UI.shift))}</p></div>` : '';
      const hint = S.mode === 'stagiaire' ? `<div class="panel mute">${esc(C.aide)}</div>` : S.mode === 'inspecteur' ? (UI.panel === 'hint' ? `<div class="panel mute">${esc(C.aide)}</div>` : btn('hint', 'Un indice')) : '';
      return {title: 'Le dos de l\'agenda', html: `<div class="speech">${esc(C.texte)}</div><div class="panel mono">${esc(C.chiffre)}</div>${roue}<input id="clair" class="inp" autocomplete="off" aria-label="Message déchiffré" placeholder="Message en clair">${btn('chiffreOk', 'Valider le message', {cls: 'pri'})}${UI.msg ? `<div class="warn">${esc(UI.msg)}</div>` : ''}${hint}`};
    },
    photo() {
      const P = A.photoDiff, found = {}; P.zones.forEach(z => { found[z.id] = !!S.flags['pz.' + z.id]; });
      const n = P.zones.filter(z => found[z.id]).length;
      return {title: 'Les tirages', html: `<p>${esc(P.intro)}</p><div class="photos grain">${ART.photos(found)}</div><p class="mute">Différences trouvées : ${n}/${P.zones.length}</p>${P.zones.filter(z => found[z.id]).map(z => `<div class="good"><b>${esc(z.nom)}.</b> ${esc(z.texte)}</div>`).join('')}${n === P.zones.length ? `<div class="good">Les trois différences sont relevées.</div>` : ''}`};
    },
    aveu() {
      const V = A.aveu, brisee = has('d:aveuBrise');
      const rows = V.enonces.map(e => {
        const done = S.aveu.includes(e.id);
        const picker = UI.panel === 'av:' + e.id ? `<div class="panel"><b>Quelle pièce ?</b>${pickList('avPres', e.id)}</div>` : '';
        return `<div class="panel"><div class="speech">« ${esc(e.dit)} »</div>${done ? `<div class="good">${esc(e.cede)}</div>` : btn('avOpen', 'Présenter une pièce', {a: e.id, cls: 'red'}) + picker}</div>`;
      }).join('');
      return {title: 'L\'aveu', html: `${who(V.perso)}<p>${esc(V.intro)}</p><p class="mute">Énoncés brisés : ${S.aveu.length}/${V.enonces.length}. Trois suffisent. Une mauvaise pièce ne coûte rien.</p>${UI.confMsg ? `<div class="warn">${esc(UI.confMsg)}</div>` : ''}${rows}${brisee ? `<div class="good">${esc(V.rompu)}</div>` : ''}`};
    },
    chrono() {
      const C = A.chrono, vis = chVis(), ok = has('d:chronoOK');
      const rows = vis.map((id, i) => { const c = card(id); return `<div class="panel row" style="align-items:center"><div style="flex:3">${ok ? `<b>${c.h}</b> · ` : ''}${esc(c.texte)}</div>${ok ? '' : `<div style="flex:none;display:flex;gap:.3rem">${btn('chMove', '▲', {a: id, b: 'up'})}${btn('chMove', '▼', {a: id, b: 'down'})}</div>`}</div>`; }).join('');
      const manque = C.cartes.length - vis.length;
      return {title: 'La chronologie', html: `<p>${esc(C.intro)}</p>${manque ? `<div class="panel mute">Il vous manque ${manque} événement(s) pour reconstituer toute la nuit.</div>` : ''}${rows}${ok ? `<div class="good">Chronologie établie : de 20h46 à 21h10, tout s'enchaîne.</div>` : btn('chValider', 'Valider l\'ordre', {cls: 'pri'})}${UI.msg ? `<div class="warn">${esc(UI.msg)}</div>` : ''}`};
    },
    dossier() {
      const t = UI.dossierTab;
      const tabs = `<div class="tabs">${['indices', 'suspects', 'pistes', 'journal'].map(x => `<button class="tab ${t === x ? 'on' : ''}" data-act="tab" data-a="${x}">${{indices: 'Indices', suspects: 'Suspects', pistes: 'Pistes', journal: 'Journal'}[x]}</button>`).join('')}</div>`;
      let body = '';
      if (t === 'indices') {
        const ids = ownedIds();
        body = `<p class="mute">${ids.length} sur ${A.rangIndices.length} indices.</p>` + (ids.map(id => btn('indice', esc(A.indices[id].titre) + (S.indices[id].lu ? '' : '<span class="badge new">nouveau</span>'), {a: id, small: esc(A.indices[id].lieu)})).join('') || `<p class="mute">Rien pour l'instant. Commencez par la cour.</p>`);
      } else if (t === 'suspects') {
        const sid = UI.suspect, P = A.persos[sid];
        const notes = [];
        P.p1.concat(P.p2).forEach(q => { if (q.note && S.asked[sid + '.' + q.id]) notes.push(q.note); });
        const contr = A.contradictions.filter(c => c.perso === sid && hasAll(c.quand));
        const st = S.statut[sid] || 'possible';
        body = `<div class="tabs">${SUSPECTS.map(s => `<button class="tab ${s === sid ? 'on' : ''}" data-act="suspect" data-a="${s}">${esc(A.persos[s].nom.replace(/^(Me|Dr) /, '').split(' ')[0])}</button>`).join('')}</div>
        ${who(sid)}<div class="panel">${esc(P.pub)}</div>
        <h3>Déclarations</h3>${notes.length ? notes.map(n => `<div class="panel">« ${esc(n)} »</div>`).join('') : `<p class="mute">Pas encore interrogé.</p>`}
        ${contr.map(c => `<div class="warn">⚠ Contradiction : ${esc(c.texte)}</div>`).join('')}
        ${btn('statut', st === 'possible' ? 'Statut : possible' : 'Statut : écarté', {a: sid, cls: st === 'ecarte' ? 'dim' : '', small: 'Touchez pour changer. C\'est votre réflexion, le jeu n\'impose rien.'})}`;
      } else if (t === 'journal') {
        body = S.journal.length ? S.journal.slice().reverse().map(m => `<div class="panel">${esc(m)}</div>`).join('') : `<p class="mute">Le journal se remplit au fil de l'enquête.</p>`;
      } else {
        const pistes = A.pistes.filter(p => hasAll(p.quand));
        body = pistes.length ? pistes.map(p => `<div class="panel">${hasAll(p.fin) ? '✓ ' : '▸ '}${esc(p.texte)}</div>`).join('') : `<p class="mute">Aucune piste pour l'instant.</p>`;
      }
      return {title: 'Dossier', html: tabs + body};
    },
    indice(p) {
      const I = A.indices[p.id]; if (S.indices[p.id]) S.indices[p.id].lu = true; save();
      return {title: 'Indice', html: `<div class="card grain">${ART.icon(I.ico)}<h2>${esc(I.titre)}</h2><p class="mute" style="color:#6a5f45">${esc(I.lieu)}</p><p>${esc(I.texte)}</p></div>`};
    },
    deduction() {
      const cards = A.conclusions.map(c => {
        const a = S.attach[c.id] || [];
        const v = UI.verif ? UI.verif[c.id] : null;
        const status = !v ? '' : v.s === 'ok' ? `<div class="good">✓ Cohérent. ${esc(c.sens)}</div>` : v.s === 'ko' ? `<div class="warn">✗ À revoir : ${esc(v.msg)}</div>` : `<div class="warn">Rien n'est rattaché.</div>`;
        const picker = UI.panel === 'att:' + c.id ? `<div class="panel"><b>Choisir un indice</b>${ownedIds().filter(id => !a.includes(id)).map(id => btn('att', esc(A.indices[id].titre), {a: c.id, b: id, small: esc(A.indices[id].lieu)})).join('') || '<p class="mute">Plus d\'indice à rattacher.</p>'}</div>` : '';
        return `<div class="panel"><b style="color:var(--sodium)">${c.id}. ${esc(c.titre)}</b><div style="margin:.4rem 0">${a.map(id => chip(A.indices[id].titre, true, 'det', c.id, id)).join('') || '<span class="mute">Aucun indice rattaché</span>'}</div>${btn('attOpen', '+ Rattacher un indice', {a: c.id})}${picker}${status}</div>`;
      }).join('');
      return {title: 'Déduction', html: `<p class="mute">Rattachez à chaque conclusion les indices qui la prouvent. « Vérifier » dit si c'est cohérent, sans donner la solution.</p>${cards}${btn('verifier', 'Vérifier', {cls: 'pri'})}${btn('accuser', 'Passer à l\'accusation', {cls: 'red'})}`};
    },
    aide() {
      const idle = Date.now() - S.lastNew > 600000;
      return {title: 'Aide', html: `<p class="mute">L'aide ne bloque jamais l'enquête et ne change jamais la fin. Elle ne compte que pour le rang final.</p>
      ${[[1, '1 · Cap', 'Où j\'en suis. Gratuit.'], [2, '2 · Piste', 'Le lieu ou le suspect à revoir. ' + coutAide(2) + ' point(s).'], [3, '3 · Coup de pouce', 'Le prochain élément à examiner. ' + coutAide(3) + ' point(s).'], [4, '4 · Révélation', 'La conclusion et ses indices, sans le coupable. ' + coutAide(4) + ' point(s).']].map(x => aideOk(x[0]) ? btn('aideN', x[1], {a: x[0], small: x[2]}) : `<button class="btn dim" disabled>${x[1]}<small>Indisponible en mode Commissaire</small></button>`).join('')}
      ${UI.aideMsg ? `<div class="speech">${esc(UI.aideMsg)}</div>` : idle ? `<p class="mute">Vous tournez en rond ? Commencez par le niveau 1.</p>` : ''}
      <p class="mute">Points d'aide utilisés : ${S.aide.cout}</p>`};
    },
    accuser() {
      const sus = UI.acc.sus;
      const pre = A.conclusions.map(c => {
        const ok = etablie(c), on = UI.acc.preuves.includes(c.id);
        return `<button class="btn ${ok ? '' : 'dim'}" ${ok ? '' : 'disabled'} data-act="preuve" data-a="${c.id}">${on ? '☑' : '☐'} ${c.id}. ${esc(c.titre)}<small>${ok ? 'Établie dans votre tableau' : 'Non établie dans votre tableau'}</small></button>`;
      }).join('');
      return {title: 'Accusation', html: `<h2>Qui accusez-vous ?</h2>${SUSPECTS.map(s => `<button class="btn ${sus === s ? 'pri' : ''}" data-act="choisir" data-a="${s}">${esc(A.persos[s].nom)}<small>${esc(A.persos[s].role)}</small></button>`).join('')}
      <h3>Vos preuves</h3>${pre}${btn('accuserGo', sus ? 'Accuser ' + esc(A.persos[sus].nom) : 'Choisissez un suspect', {cls: sus ? 'red' : 'dim'})}`};
    },
    confront() {
      if (!has('d:acte4')) return {title: 'Confrontation', html: `<div class="panel">Pas encore. Brisez l'aveu de Solange, reconstituez la chronologie, puis réunissez le lambeau de gant, le manteau n°14 et le carnet du photographe.</div>`};
      const rows = A.confrontation.map(c => {
        const done = S.conf.includes(c.id);
        const picker = UI.panel === 'conf:' + c.id ? `<div class="panel"><b>Quelle pièce ?</b>${pickList('confPres', c.id)}</div>` : '';
        return `<div class="panel"><div class="speech">« ${esc(c.dit)} »</div>${done ? `<div class="good">${esc(c.cede)}</div>` : btn('confOpen', 'Présenter une pièce', {a: c.id, cls: 'red'}) + picker}</div>`;
      }).join('');
      const all = A.confrontation.every(c => S.conf.includes(c.id));
      return {title: 'Confrontation', html: `${who('odile')}<p class="mute">Salle des fêtes, à l'aube. Brisez ses affirmations avec la bonne pièce. Une mauvaise pièce ne coûte rien. Brisées : ${S.conf.length}/4.</p>${UI.confMsg ? `<div class="warn">${esc(UI.confMsg)}</div>` : ''}${rows}${all ? `<div class="good">Odile Quéré a cessé de répondre.</div>` + btn('accusOdile', 'Passer à l\'accusation', {cls: 'pri'}) : ''}`};
    },
    fin() {
      const f = S.fin, F = A.fins[f.code];
      const paras = F.paras.map(t => `<div class="speech">${esc(t.replace('{nom}', f.sus ? A.persos[f.sus].nom : ''))}</div>`).join('');
      const code = f.code === 'Bsol' ? 'B' : f.code;
      const paras2 = f.code === 'A' && S.flags['d:aveuBrise'] && F.aveu ? `<div class="speech">${esc(F.aveu)}</div>` : '';
      const perso = f.code === 'A' && f.perspicace ? `<p class="mute" style="text-align:center">★ Mention Perspicace : coffre, message codé et tirages résolus.</p>` : '';
      const stars = f.code === 'A' ? `<div class="stars">${'★'.repeat(f.rang)}${'☆'.repeat(3 - f.rang)}</div><p class="mute" style="text-align:center">Rang ${f.rang}/3 · Niveau ${esc(A.modes[S.mode].nom)} · Points d'aide : ${S.aide.cout}</p>` : '';
      return {title: 'Fin', html: `<div class="title"><div class="sub">FIN ${code}</div><div class="big" style="font-size:1.5rem">${esc(F.titre)}</div></div>${paras}${paras2}${stars}${perso}
      ${f.code !== 'A' ? btn('rouvrir', 'Rouvrir le dossier', {cls: 'pri'}) : ''}${btn('partager', 'Partager mon résultat')}${btn('rejouer', 'Recommencer')}${btn('accueil', 'Menu principal')}`};
    },
    options() {
      return {title: 'Options', html: `${btn('toggle', 'Texte agrandi : ' + (OPT.big ? 'oui' : 'non'), {a: 'big'})}${btn('toggle', 'Sons : ' + (OPT.sound ? 'oui' : 'non'), {a: 'sound'})}${btn('toggle', 'Animations : ' + (OPT.anim ? 'oui' : 'non'), {a: 'anim'})}
      ${btn('toggle', 'Voix de la cassette : ' + (OPT.voix ? 'oui' : 'non'), {a: 'voix', small: 'Lecture vocale par l\'appareil. Les sous-titres restent toujours affichés.'})}
      ${btn('toggle', 'Description sonore (texte) : ' + (OPT.desc ? 'oui' : 'non'), {a: 'desc', small: 'Décrit chaque son de la cassette par écrit.'})}
      ${btn('toggle', 'Description sonore en mode Commissaire : ' + (OPT.descAcc ? 'oui' : 'non'), {a: 'descAcc', small: 'Accessibilité : affiche la description même en mode Commissaire.'})}
      ${btn('toggle', 'Ambiance sonore (mer, mouettes) : ' + (OPT.amb ? 'oui' : 'non'), {a: 'amb', small: 'Sons synthétisés. Coupée pendant la cassette.'})}
      ${btn('revoirTuto', 'Revoir le tutoriel')}
      ${hasSave() ? btn('effacer', 'Effacer la sauvegarde', {cls: 'red'}) : ''}${btn('credits', 'Crédits')}${UI.stack.length && UI.stack[UI.stack.length - 1].view !== 'accueil' ? btn('hub', 'Retour à l\'enquête', {cls: 'pri'}) : ''}${btn('accueil', 'Menu principal')}<p class="mute">Version du jeu ${esc(A.version)} · sauvegarde ENG1/${esc(A.id)}</p>`};
    },
    credits() {
      return {title: 'Crédits', html: `<div class="panel">${esc(A.credits)}</div><div class="panel"><b>Licences</b><br>Textes, illustrations SVG/CSS et sons : créés pour ce jeu (tous droits réservés à l'auteur). Polices : celles du système de l'appareil, non embarquées. Aucune dépendance externe.</div>`};
    }
  };

  function top() {
    const v = UI.view;
    const inGame = !['accueil', 'briefing'].includes(v);
    const left = v === 'accueil' ? '<span style="min-width:44px"></span>' : v === 'briefing' ? `<button class="ib" data-act="accueil" aria-label="Menu">☰</button>` : v === 'hub' ? `<button class="ib" data-act="options" aria-label="Options">☰</button>` : `<button class="ib" data-act="back" aria-label="Retour">←</button>`;
    const idle = Date.now() - S.lastNew > 600000;
    const right = inGame && v !== 'fin' ? `<button class="ib" data-act="dossier">Dossier</button><button class="ib ${idle ? 'pulse' : ''}" data-act="aide">Aide</button>` : '<span style="min-width:44px"></span>';
    return `<header class="top">${left}<h1>${esc(VIEWS_TITLE)}</h1>${right}</header>`;
  }
  let VIEWS_TITLE = '';
  function render() {
    document.documentElement.dataset.big = OPT.big ? '1' : '0';
    document.documentElement.dataset.anim = OPT.anim ? '1' : '0';
    if (AMB) ambLevel(UI.view === 'cassette' ? 0 : 1);
    const v = VIEWS[UI.view](UI.params);
    VIEWS_TITLE = v.title;
    app.innerHTML = top() + `<main>${v.html}</main>`;
  }

  /* --- actions --- */
  const ACT = {
    nouvelle() { if (hasSave() && !confirm('Effacer la sauvegarde et recommencer ?')) return; S = fresh(); save(); UI.stack = []; UI.dossierTab = 'indices'; UI.palier = {}; UI.aideMsg = null; UI.verif = null; UI.acc = {sus: null, preuves: []}; root('mode'); },
    mode(d) { S.mode = d.a; save(); root('briefing'); },
    reprendre() { if (loadState()) root(S.fin ? 'fin' : 'hub'); else root('briefing'); },
    hub() { root('hub'); },
    back() { back(); },
    accueil() { root('accueil'); },
    options() { go('options'); },
    credits() { go('credits'); },
    lieu(d) {
      if (!S.flags['v:' + d.a]) { S.flags['v:' + d.a] = 1; const k = A.carnet.find(x => x.lieu === d.a); if (k) toast('Carnet de Douarnenez : ' + k.titre); save(); }
      go('lieu', {id: d.a});
    },
    obj(d) {
      examiner(d.a, d.b);
      const e = A.lieux.find(x => x.id === d.a).elements.find(x => x.id === d.b);
      UI.msg = null; UI.segMsg = null; UI.shift = 0;
      if (e.ecran) go(e.ecran, {lieu: d.a, el: d.b}); else go('obj', {lieu: d.a, el: d.b});
    },
    seg(d) { UI.panel = UI.panel === 'seg:' + d.a ? null : 'seg:' + d.a; UI.segMsg = null; render(); },
    cPlay(d) { jouer(A.cassette.segments.find(x => x.id === +d.a)); },
    cRep(d) {
      const x = A.cassette.segments.find(y => y.id === +d.a);
      if (+d.b === x.bon) {
        S.cas[x.id] = 1; UI.segMsg = null; UI.panel = null; blip(600, .2);
        if (A.cassette.segments.every(y => S.cas[y.id])) { gain('I16'); S.flags.cassetteOK = 1; checkUnlocks(); }
      } else UI.segMsg = 'Ce n\'est pas cela. Réécoutez : rien n\'est perdu.';
      save(); render();
    },
    hint() { UI.panel = 'hint'; render(); },
    coffreOk() {
      const v = (document.getElementById('code') || {}).value || '';
      if (v.trim() === A.coffre.code) { gain(A.coffre.indice); S.flags.coffreOK = 1; UI.msg = null; checkUnlocks(); save(); blip(700, .3); }
      else UI.msg = 'La serrure ne cède pas.';
      render();
    },
    shift(d) { UI.shift = (UI.shift + (+d.a) + 26) % 26; render(); },
    chiffreOk() {
      const v = norm((document.getElementById('clair') || {}).value || '');
      if (v === A.chiffre.clair) { S.flags.chiffreOK = 1; UI.msg = null; toast('Message déchiffré.'); save(); blip(700, .3); }
      else UI.msg = 'Ce n\'est pas un message lisible.';
      render();
    },
    zone(d) {
      const z = A.photoDiff.zones.find(x => x.id === d.a); if (!z || S.flags['pz.' + z.id]) return;
      S.flags['pz.' + z.id] = 1; toast('Différence trouvée : ' + z.nom); blip(660, .2);
      if (z.indice) gain(z.indice);
      if (A.photoDiff.zones.every(x => S.flags['pz.' + x.id])) S.flags.photoOK = 1;
      checkUnlocks(); save(); render();
    },
    aveu() { UI.confMsg = null; go('aveu'); },
    avOpen(d) { UI.panel = UI.panel === 'av:' + d.a ? null : 'av:' + d.a; render(); },
    avPres(d) {
      const e = A.aveu.enonces.find(x => x.id === d.a);
      if (e.contre.includes(d.b)) {
        if (hasAll(e.et)) {
          if (!S.aveu.includes(e.id)) S.aveu.push(e.id);
          UI.confMsg = null; blip(600, .3);
          if (S.aveu.length >= A.aveu.seuil && !S.flags['d:aveuBrise']) { S.flags['d:aveuBrise'] = 1; toast('L\'aveu ne tient plus.'); checkUnlocks(); }
          save();
        } else UI.confMsg = 'La pièce compte, mais elle ne suffit pas seule. Il vous manque un témoignage pour la rendre décisive (le vestiaire note tout).';
      } else UI.confMsg = 'Elle ne bronche pas. Cette pièce ne répond pas à son récit.';
      UI.panel = null; render();
    },
    chrono() { UI.msg = null; go('chrono'); },
    chMove(d) { chMove(d.a, d.b); UI.msg = null; save(); render(); },
    chValider() {
      const vis = chVis(), exp = A.chrono.ordre.filter(id => vis.includes(id));
      const bons = vis.filter((id, i) => id === exp[i]).length, complet = vis.length === A.chrono.cartes.length;
      S.chrono.essais++;
      if (bons === vis.length && complet) { S.flags['d:chronoOK'] = 1; UI.msg = null; toast('Chronologie établie.'); blip(700, .3); checkUnlocks(); }
      else if (bons === vis.length) UI.msg = 'L\'ordre est cohérent pour ce que vous savez, mais il manque des événements.';
      else UI.msg = S.mode === 'commissaire' ? 'Ordre incorrect.' : bons + ' carte(s) sur ' + vis.length + ' à la bonne place.';
      save(); render();
    },
    perso(d) { go('perso', {id: d.a}); },
    palier(d) { UI.palier[d.a] = +d.b; UI.reply = null; render(); },
    q(d) { const [pal, qid] = d.b.split(':'); poser(d.a, +pal, qid); render(); },
    presenter(d) { UI.panel = 'pres'; render(); },
    pres(d) { presenter(d.a, d.b); UI.panel = null; render(); },
    dossier() { go('dossier'); },
    tab(d) { UI.dossierTab = d.a; render(); },
    indice(d) { go('indice', {id: d.a}); },
    suspect(d) { UI.suspect = d.a; render(); },
    statut(d) { S.statut[d.a] = (S.statut[d.a] || 'possible') === 'possible' ? 'ecarte' : 'possible'; save(); render(); },
    deduction() { UI.verif = null; go('deduction'); },
    attOpen(d) { UI.panel = UI.panel === 'att:' + d.a ? null : 'att:' + d.a; render(); },
    att(d) { S.attach[d.a] = (S.attach[d.a] || []).concat(d.b); UI.panel = null; UI.verif = null; save(); render(); },
    det(d) { S.attach[d.a] = (S.attach[d.a] || []).filter(x => x !== d.b); UI.verif = null; save(); render(); },
    verifier() {
      if (S.mode === 'commissaire' && S.verifN >= 3) { UI.verif = null; toast('Mode Commissaire : plus de vérification disponible.'); return; }
      S.verifN++; save();
      UI.verif = {};
      A.conclusions.forEach(c => {
        const e = evalC(c);
        UI.verif[c.id] = e.vide ? {s: 'vide'} : e.ok ? {s: 'ok'} : {s: 'ko', msg: e.faux.length ? '« ' + A.indices[e.faux[0]].titre + ' » ne prouve pas cette conclusion.' : e.manque ? 'il manque encore au moins un indice déterminant.' : 'trop d\'indices rattachés : gardez ceux qui prouvent vraiment.'};
      });
      blip(440, .2); render();
    },
    aide() { go('aide'); },
    aideN(d) { aideN(+d.a); render(); },
    accuser() {
      UI.acc.preuves = A.conclusions.filter(etablie).map(c => c.id);
      go('accuser');
    },
    accusOdile() { UI.acc.sus = 'odile'; UI.acc.preuves = A.conclusions.filter(etablie).map(c => c.id); go('accuser'); },
    choisir(d) { UI.acc.sus = d.a; render(); },
    preuve(d) { const p = UI.acc.preuves; UI.acc.preuves = p.includes(d.a) ? p.filter(x => x !== d.a) : p.concat(d.a); render(); },
    accuserGo() {
      if (!UI.acc.sus) return;
      const code = finDe(UI.acc.sus, UI.acc.preuves);
      S.fin = {code, sus: UI.acc.sus, preuves: UI.acc.preuves.slice(), rang: code === 'A' ? rang() : 0, perspicace: perspicace()};
      save(); blip(code === 'A' ? 784 : 220, .5); root('fin');
    },
    confront() { UI.confMsg = null; go('confront'); },
    confOpen(d) { UI.panel = UI.panel === 'conf:' + d.a ? null : 'conf:' + d.a; render(); },
    confPres(d) {
      const c = A.confrontation.find(x => x.id === d.a);
      if (c.contre.includes(d.b)) { if (!S.conf.includes(c.id)) S.conf.push(c.id); UI.confMsg = null; if (A.confrontation.every(x => S.conf.includes(x.id))) S.flags['d:confOK'] = 1; save(); blip(600, .3); }
      else UI.confMsg = 'Elle ne bronche pas. Cette pièce ne répond pas à son affirmation.';
      UI.panel = null; render();
    },
    rouvrir() { S.fin = null; save(); root('hub'); },
    rejouer() { if (!confirm('Recommencer une nouvelle enquête ?')) return; S = fresh(); save(); UI.stack = []; UI.palier = {}; UI.aideMsg = null; UI.verif = null; UI.acc = {sus: null, preuves: []}; root('mode'); },
    partager() {
      const f = S.fin; const t = `J'ai terminé « ${A.titre} » : ${A.fins[f.code].titre}${f.code === 'A' ? ' — ' + '★'.repeat(f.rang) + '☆'.repeat(3 - f.rang) + (f.perspicace ? ' · Mention Perspicace' : '') : ''}.`;
      if (navigator.share) navigator.share({text: t}).catch(() => {});
      else try { navigator.clipboard.writeText(t); toast('Résultat copié.'); } catch (e) { toast(t); }
    },
    toggle(d) { OPT[d.a] = OPT[d.a] ? 0 : 1; saveOpt(); if (d.a === 'amb') { if (OPT.amb) ambStart(); else ambStop(); } render(); },
    tuto() { root('tuto'); },
    tutoVu() { S.flags.tutoVu = 1; save(); root('hub'); },
    revoirTuto() { go('tuto'); },
    carte() { go('carte'); },
    balade() { go('balade'); },
    effacer() { if (!confirm('Effacer définitivement la sauvegarde ?')) return; store.del(KEY); S = fresh(); render(); }
  };
  document.addEventListener('click', ev => {
    const t = ev.target.closest('[data-act]'); if (!t || t.disabled) return;
    if (OPT.amb && !AMB) ambStart();
    const f = ACT[t.dataset.act]; if (f) f({a: t.dataset.a, b: t.dataset.b});
  });

  /* --- démarrage --- */
  loadOpt();
  if (hasSave()) loadState();
  render();
  window.__ENG = {ambStart, ambStop, jouer, chVis, chMove, decode, norm, perspicace, evalC, S: () => S, ACT, A, has, etablie, finDe, rang, aideN, fresh, setState: (s) => { S = s; }, render, UI, OPT};
})();
