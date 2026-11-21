const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  page.on('request', r => { if (!/^(file|data):/.test(r.url())) errs.push('NET ' + r.url()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'la_derniere_peche.html'));
  const res = await page.evaluate(() => {
    window.confirm = () => true;
    const E = window.__ENG, A = E.A, S = () => E.S();
    const words = t => (t || '').split(/\s+/).filter(Boolean).length;
    const lieuOf = id => A.lieux.find(l => l.id === id);
    let T, log, WPM = 200;
    const read = txt => { T += words(txt) / WPM * 60; };
    const tap = (n = 1) => { T += 4 * n; };
    const think = s => { T += s; };
    const startRun = (mode) => { E.ACT.nouvelle(); E.ACT.mode({ a: mode || 'inspecteur' }); T = 0; log = []; };
    const avail = (lid, eid) => { const l = lieuOf(lid); const e = l.elements.find(x => x.id === eid); return l.requiert.every(E.has) && (e.requiert || []).every(E.has); };
    const availQ = (pid, qid, pal) => { const P = A.persos[pid]; const l = lieuOf(P.lieu); const q = (pal === 1 ? P.p1 : P.p2).find(x => x.id === qid); return l.requiert.every(E.has) && (P.requiert || []).every(E.has) && (pal === 1 || E.has(P.req2)) && (q.requiert || []).every(E.has); };
    const obj = (l, e) => { if (!avail(l, e)) { log.push('BLOQUÉ ' + l + '.' + e); return false; } const el = lieuOf(l).elements.find(x => x.id === e); E.ACT.obj({ a: l, b: e }); tap(3); read(el.indice ? A.indices[el.indice].texte : el.texte); return true; };
    const q = (p, pal, id) => { if (!availQ(p, id, pal)) { log.push('BLOQUÉ q ' + p + pal + id); return false; } const P = A.persos[p]; const qq = (pal === 1 ? P.p1 : P.p2).find(x => x.id === id); E.ACT.q({ a: p, b: pal + ':' + id }); tap(2); read(qq.q + ' ' + qq.r); return true; };
    const attach = (c, ids) => { ids.forEach(i => { E.ACT.att({ a: c, b: i }); tap(2); }); think(45); };
    // épreuves
    const cassette = (erreurs) => {
      if (!obj('gendarmerie', 'magneto')) return false;
      A.cassette.segments.forEach(x => {
        E.ACT.seg({ a: x.id }); tap(1); think(12); read((x.voix || '') + ' ' + x.desc);
        if (erreurs) { const mal = (x.bon + 1) % x.opts.length; E.ACT.cRep({ a: x.id, b: mal }); think(8); }
        E.ACT.cRep({ a: x.id, b: x.bon }); think(10); read(x.ok);
      });
      return !!S().indices.I16;
    };
    const aveu = (pieces) => { E.ACT.aveu(); read(A.aveu.intro); pieces.forEach(([id, i]) => { E.ACT.avOpen({ a: id }); E.ACT.avPres({ a: id, b: i }); think(10); tap(2); }); return E.has('d:aveuBrise'); };
    const chrono = (mal) => {
      E.ACT.chrono(); think(100);
      const target = A.chrono.ordre;
      if (mal) { E.ACT.chValider(); }
      // tri par échanges successifs via chMove (teste la fonction)
      for (let pass = 0; pass < 20; pass++) { const vis = E.chVis(); let done = true; for (let i = 0; i < vis.length - 1; i++) { if (target.indexOf(vis[i]) > target.indexOf(vis[i + 1])) { E.ACT.chMove({ a: vis[i], b: 'down' }); done = false; tap(1); break; } } if (done) break; }
      E.ACT.chValider();
      return E.has('d:chronoOK');
    };
    const confrontAll = () => { E.ACT.confront(); A.confrontation.forEach(c => { E.ACT.confOpen({ a: c.id }); E.ACT.confPres({ a: c.id, b: c.contre[0] }); tap(3); think(8); read(c.cede); }); return E.has('d:confOK'); };
    const puzzles = () => {
      obj('bureau', 'coffre'); document.getElementById('code').value = '1960'; E.ACT.coffreOk(); const m1 = E.UI.msg; document.getElementById('code').value = '1962'; E.ACT.coffreOk(); think(40);
      obj('bureau', 'dos'); document.getElementById('clair').value = 'mon dictaphone est dans ma veste'; E.ACT.chiffreOk(); think(120);
      obj('salle', 'photos'); ['gants', 'ecorchure', 'verre'].forEach(z => { E.ACT.zone({ a: z }); tap(2); }); think(60);
      return { m1, I19: !!S().indices.I19, I20: !!S().indices.I20, perspicace: E.perspicace() };
    };
    const out = {};

    /* ===== PARCOURS 1 : OPTIMAL (Inspecteur, ne fait que l'utile, sans optionnels) ===== */
    startRun(); WPM = 220; read(A.briefing.join(' '));
    ['sol', 'montre', 'main'].forEach(e => obj('cour', e));
    obj('cour', 'veste'); cassette(false); obj('gendarmerie', 'rapport');
    obj('bureau', 'porte'); obj('bureau', 'agenda'); obj('bureau', 'lettre'); obj('cour', 'bassin');
    q('gwenn', 1, '1'); q('jeanne', 1, '3'); obj('vestiaire', 'm14'); obj('vestiaire', 'm7');
    ['lucien', 'yann', 'mathilde', 'salaun'].forEach(p => q(p, 1, '1'));
    const apresActe3 = { yann: E.has('d:yann') };
    obj('chaufferie', 'journal'); obj('compta', 'telephone'); q('agnes', 1, '2'); obj('infirmerie', 'registre');
    const reb = { yannLibre: E.has('d:yannLibre'), aveu: E.has('d:aveu') };
    q('jeanne', 1, '5');
    const aveuOK = aveu([['s1', 'I17'], ['s2', 'I09'], ['s3', 'I18']]);
    const chronoOK = chrono(false);
    attach('C1', ['I01', 'I10']); attach('C2', ['I02', 'I12']); attach('C3', ['I03', 'I11']); attach('C4', ['I06', 'I08']);
    const acte4 = E.has('d:acte4');
    const confOK = confrontAll();
    E.ACT.accusOdile(); tap(4); E.ACT.accuserGo();
    out.p1 = { fin: S().fin.code, rang: S().fin.rang, indices: Object.keys(S().indices).length, minutes: Math.round(T / 60), apresActe3, reb, aveuOK, chronoOK, acte4, confOK, log: log.slice() };

    /* ===== PARCOURS 1b : COMPLET (Inspecteur, lit tout, fait tous les optionnels, erreurs cassette) ===== */
    startRun(); WPM = 160; read(A.briefing.join(' '));
    ['sol', 'montre', 'main', 'escalier', 'ampoule'].forEach(e => obj('cour', e));
    obj('cour', 'veste'); cassette(true); obj('gendarmerie', 'rapport');
    ['porte', 'fauteuil', 'agenda', 'lettre', 'tiroir'].forEach(e => obj('bureau', e)); obj('cour', 'bassin');
    ['programme', 'place'].forEach(e => obj('salle', e));
    ['solange', 'lucien', 'odile', 'yann', 'mathilde', 'salaun', 'gwenn', 'legoff'].forEach(p => A.persos[p].p1.forEach(x => q(p, 1, x.id)));
    ['m3', 'm7', 'm9', 'm12', 'm14', 'm17', 'm21'].forEach(e => obj('vestiaire', e));
    A.persos.jeanne.p1.forEach(x => q('jeanne', 1, x.id));
    ['journal', 'caisses', 'meteo', 'chaudiere'].forEach(e => obj('chaufferie', e));
    ['telephone', 'machine'].forEach(e => obj('compta', e)); A.persos.agnes.p1.forEach(x => q('agnes', 1, x.id));
    ['registre', 'table'].forEach(e => obj('infirmerie', e)); A.persos.cozic.p1.forEach(x => q('cozic', 1, x.id));
    obj('gendarmerie', 'pv'); A.persos.lorec.p1.forEach(x => q('lorec', 1, x.id));
    const pz = puzzles();
    for (let r = 0; r < 3; r++) Object.keys(A.persos).forEach(p => [1, 2].forEach(pal => (pal === 1 ? A.persos[p].p1 : A.persos[p].p2).forEach(x => { if (!E.has('q:' + p + '.' + x.id) && availQ(p, x.id, pal)) q(p, pal, x.id); })));
    // présentation de pièces aux suspects (réactions)
    ['odile', 'solange', 'mathilde'].forEach(p => ['I16', 'I17', 'I18', 'I19', 'I20'].forEach(i => { E.ACT.pres({ a: p, b: i }); read(E.UI.reply.text); }));
    const rest = []; Object.keys(A.persos).forEach(p => [1, 2].forEach(pal => (pal === 1 ? A.persos[p].p1 : A.persos[p].p2).forEach(x => { if (!E.has('q:' + p + '.' + x.id)) rest.push(p + pal + ':' + x.id); })));
    const mauvais = [];
    E.ACT.aveu(); E.ACT.avOpen({ a: 's1' }); E.ACT.avPres({ a: 's1', b: 'I01' }); mauvais.push(E.UI.confMsg);
    S().flags.solangePlats = 0; E.ACT.avOpen({ a: 's4' }); E.ACT.avPres({ a: 's4', b: 'I16' }); mauvais.push(E.UI.confMsg); S().flags.solangePlats = 1;
    aveu([['s1', 'I17'], ['s2', 'I09'], ['s3', 'I18'], ['s4', 'I16']]);
    const brisees = S().aveu.length;
    const chMal = (() => { E.ACT.chrono(); E.ACT.chMove({ a: 'k5', b: 'up' }); E.ACT.chValider(); return E.UI.msg; })();
    chrono(false); think(60);
    attach('C1', ['I01', 'I10', 'I14', 'I16']); attach('C2', ['I02', 'I12']); attach('C3', ['I03', 'I11', 'I12']); attach('C4', ['I06', 'I08', 'I19']);
    E.ACT.verifier();
    const confOKb = confrontAll();
    E.ACT.accusOdile(); tap(3); E.ACT.accuserGo();
    out.p1b = { fin: S().fin.code, rang: S().fin.rang, perspicace: S().fin.perspicace, indices: Object.keys(S().indices).length, minutes: Math.round(T / 60), nonPosees: rest, pz, mauvais, brisees, chMal, confOK: confOKb, log: log.slice() };

    /* ===== PARCOURS 2 : AVEC ERREURS ===== */
    startRun(); WPM = 180; read(A.briefing.join(' '));
    ['sol', 'montre', 'main'].forEach(e => obj('cour', e));
    q('yann', 1, '1'); q('yann', 1, '4');
    E.ACT.accuser(); E.ACT.choisir({ a: 'yann' }); E.ACT.accuserGo(); const f1 = S().fin.code; E.ACT.rouvrir();
    E.ACT.accuser(); E.ACT.choisir({ a: 'odile' }); E.ACT.accuserGo(); const f2 = S().fin.code; E.ACT.rouvrir();
    E.ACT.accuser(); E.ACT.choisir({ a: 'lucien' }); E.ACT.accuserGo(); const f3 = S().fin.code; E.ACT.rouvrir();
    E.ACT.accuser(); E.ACT.choisir({ a: 'solange' }); E.ACT.accuserGo(); const f3b = S().fin.code; E.ACT.rouvrir();
    q('odile', 1, '1'); obj('vestiaire', 'm14');
    E.ACT.pres({ a: 'odile', b: 'I01' }); const neutre = E.UI.reply.text;
    const gate = { chaufferie: avail('chaufferie', 'caisses'), magneto: avail('gendarmerie', 'magneto'), pvAvantYann: avail('gendarmerie', 'pv'), chronoAvant: (() => { E.ACT.chrono(); return E.has('d:chronoOK'); })() };
    E.ACT.hub();
    ['lucien', 'mathilde', 'salaun'].forEach(p => q(p, 1, '1'));
    obj('bureau', 'lettre'); obj('bureau', 'agenda'); obj('bureau', 'tiroir');
    q('gwenn', 1, '1'); q('jeanne', 1, '3'); obj('vestiaire', 'm14');
    E.ACT.deduction();
    E.S().attach.C1 = ['I07', 'I01']; E.ACT.verifier(); const v1 = JSON.stringify(E.UI.verif.C1);
    E.S().attach.C1 = ['I01']; E.ACT.verifier(); const v2 = JSON.stringify(E.UI.verif.C1);
    E.S().attach.C1 = ['I01', 'I10', 'I08']; E.ACT.verifier(); const v3 = JSON.stringify(E.UI.verif.C1);
    E.S().attach = { C1: ['I01', 'I10'], C2: ['I02', 'I12'], C3: ['I03', 'I11'], C4: ['I06'] };
    E.ACT.accuser(); E.ACT.choisir({ a: 'odile' }); E.ACT.accuserGo(); const f4 = S().fin.code; E.ACT.rouvrir();
    S().attach.C4 = ['I06', 'I08']; E.ACT.accuser(); E.ACT.choisir({ a: 'odile' }); E.ACT.accuserGo();
    out.p2 = { fins: [f1, f2, f3, f3b, f4, S().fin.code], neutre, gate, v1, v2, v3, rangRaccourci: S().fin.rang, log: log.slice() };

    /* ===== MODES ===== */
    startRun('commissaire');
    E.aideN(1); const c1 = E.UI.aideMsg; E.aideN(2); const c2 = E.UI.aideMsg; E.aideN(4); const c4 = E.UI.aideMsg; E.aideN(3); const c3 = E.UI.aideMsg;
    E.ACT.deduction(); for (let i = 0; i < 4; i++) { E.ACT.verifier(); } const vN = S().verifN;
    startRun('stagiaire'); E.aideN(3); E.aideN(4); const coutSt = S().aide.cout;
    out.modes = { commissaire: { c1, c2, c4, c3: !!c3, vN, cout: (E.A, 0) }, stagiaireCout: coutSt };

    /* ===== PARCOURS 3 : BLOQUÉ, SUIT SEULEMENT L'AIDE ===== */
    startRun();
    const M = {
      'i:I01': () => obj('cour', 'sol'), 'i:I02': () => obj('cour', 'montre'), 'i:I03': () => obj('cour', 'main'),
      'calePorte': () => obj('bureau', 'porte'), 'i:I09': () => obj('cour', 'bassin'), 'i:I08': () => obj('bureau', 'agenda'),
      'i:I06': () => obj('bureau', 'lettre'), 'i:I07': () => obj('bureau', 'tiroir'),
      't:odile': () => q('odile', 1, '1'), 't:solange': () => q('solange', 1, '1'), 't:lucien': () => q('lucien', 1, '1'),
      't:yann': () => q('yann', 1, '1'), 't:mathilde': () => q('mathilde', 1, '1'), 't:salaun': () => q('salaun', 1, '1'),
      'i:I12': () => q('gwenn', 1, '1'), 'i:I11': () => obj('vestiaire', 'm14'), 'i:I10': () => q('jeanne', 1, '3'),
      'i:I13': () => obj('chaufferie', 'journal'), 'i:I04': () => obj('chaufferie', 'caisses'), 'agnes': () => obj('compta', 'telephone'),
      'i:I14': () => q('agnes', 1, '2'), 'i:I15': () => obj('infirmerie', 'registre'),
      'cassette': () => obj('cour', 'veste'), 'i:I16': () => cassette(false), 'i:I17': () => obj('gendarmerie', 'rapport'), 'i:I18': () => obj('vestiaire', 'm7'),
      'd:aveuBrise': () => { q('jeanne', 1, '5'); return aveu([['s1', 'I17'], ['s2', 'I09'], ['s3', 'I18']]); },
      'd:chronoOK': () => chrono(false), 'd:confOK': () => confrontAll()
    };
    const att = { C1: ['I01', 'I10'], C2: ['I02', 'I12'], C3: ['I03', 'I11'], C4: ['I06', 'I08'] };
    const aideTextes = []; let g = 0, vide = 0;
    E.aideN(1); aideTextes.push(E.UI.aideMsg);
    while (g++ < 80) {
      const step = A.aide.find(s => !E.has(s.manque)); if (!step) break;
      E.aideN(g % 3 === 0 ? 4 : g % 2 ? 3 : 2); if (!E.UI.aideMsg) vide++; aideTextes.push(E.UI.aideMsg);
      const k = step.manque;
      if (k.startsWith('c:')) { S().attach[k.slice(2)] = att[k.slice(2)].slice(); continue; }
      if (!M[k] || !M[k]() || !E.has(k)) { log.push('ÉCHEC ' + k); break; }
    }
    E.aideN(2); const finalAide = E.UI.aideMsg;
    E.ACT.accuser(); E.ACT.choisir({ a: 'odile' }); E.ACT.accuserGo();
    out.p3 = { fin: S().fin.code, rang: S().fin.rang, cout: S().aide.cout, usages: S().aide.n, aidesVides: vide, finalAide, steps: g, log: log.slice() };

    /* ===== CONTRÔLES STATIQUES ===== */
    const bug = [];
    const flagsSet = new Set(['calePorte', 'agnes']);
    Object.values(A.persos).forEach(P => [...P.p1, ...P.p2].forEach(x => (x.flags || []).forEach(f => flagsSet.add(f))));
    Object.values(A.persos).forEach(P => Object.values(P.react || {}).forEach(r => (r.flags || []).forEach(f => flagsSet.add(f))));
    A.lieux.forEach(l => l.elements.forEach(e => (e.flags || []).forEach(f => flagsSet.add(f))));
    A.deblocages.forEach(d => { flagsSet.add('d:' + d.id); (d.flags || []).forEach(f => flagsSet.add(f)); }); Object.keys(A.persos).forEach(p => flagsSet.add('t:' + p));
    ['d:aveuBrise', 'd:chronoOK', 'd:confOK'].forEach(f => flagsSet.add(f));
    const cles = []; const ref = k => cles.push(k);
    A.lieux.forEach(l => { l.requiert.forEach(ref); l.elements.forEach(e => (e.requiert || []).forEach(ref)); });
    Object.values(A.persos).forEach(P => { (P.requiert || []).forEach(ref); if (P.req2 !== 'nul') ref(P.req2); [...P.p1, ...P.p2].forEach(x => (x.requiert || []).forEach(ref)); });
    A.pistes.forEach(p => [...p.quand, ...p.fin].forEach(ref)); A.deblocages.forEach(d => d.quand.forEach(ref)); A.contradictions.forEach(c => c.quand.forEach(ref));
    A.aide.forEach(s => ref(s.manque)); A.aveu.enonces.forEach(e => (e.et || []).forEach(ref)); A.chrono.cartes.forEach(c => ref(c.req));
    const qSet = new Set(); Object.entries(A.persos).forEach(([pid, P]) => [...P.p1, ...P.p2].forEach(x => qSet.add('q:' + pid + '.' + x.id)));
    cles.forEach(k => { if (k.startsWith('i:')) { if (!A.indices[k.slice(2)]) bug.push('indice inconnu ' + k); } else if (k.startsWith('q:')) { if (!qSet.has(k)) bug.push('question inconnue ' + k); } else if (k.startsWith('c:')) { if (!A.conclusions.find(c => c.id === k.slice(2))) bug.push('conclusion inconnue ' + k); } else if (!flagsSet.has(k.replace(/^f:/, ''))) bug.push('flag jamais posé ' + k); });
    const donnes = new Set(); A.lieux.forEach(l => l.elements.forEach(e => e.indice && donnes.add(e.indice)));
    Object.values(A.persos).forEach(P => [...P.p1, ...P.p2].forEach(x => (x.donne || []).forEach(i => donnes.add(i))));
    donnes.add(A.coffre.indice); donnes.add('I16'); A.photoDiff.zones.forEach(z => z.indice && donnes.add(z.indice));
    A.rangIndices.forEach(i => { if (!donnes.has(i)) bug.push('indice jamais donné ' + i); });
    A.conclusions.forEach(c => c.requis.concat(c.bonus).forEach(i => { if (!A.indices[i]) bug.push('requis inconnu ' + i); }));
    A.aveu.enonces.forEach(e => e.contre.forEach(i => { if (!A.indices[i]) bug.push('aveu contre inconnu ' + i); }));
    A.confrontation.forEach(c => c.contre.forEach(i => { if (!A.indices[i]) bug.push('conf contre inconnu ' + i); }));
    A.cassette.segments.forEach(x => { if (!(x.bon >= 0 && x.bon < x.opts.length)) bug.push('cassette bon ' + x.id); });
    A.photoDiff.zones.forEach(z => { if (!ART.photos({}).includes('data-a="' + z.id + '"')) bug.push('zone photo absente ' + z.id); });
    // chiffrement
    const dec = E.decode(A.chiffre.chiffre, A.chiffre.cle); if (dec !== A.chiffre.clair) bug.push('chiffre: ' + dec);
    // marches = clé
    const esc = A.lieux.find(l => l.id === 'cour').elements.find(e => e.id === 'escalier').texte; if (!/Douze marches/.test(esc)) bug.push('escalier ≠ 12');
    if (A.cassette.segments[1].n !== A.chiffre.cle) bug.push('pas ≠ clé');
    // scènes
    A.lieux.forEach(l => { if (!ART.scene(l.id)) bug.push('scène ' + l.id); });
    // chaque contradiction / pistes référencent des clés OK (déjà), indices ont icônes
    Object.values(A.indices).forEach(I => { if (!ART.icon(I.ico)) bug.push('ico'); });
    // anti-triche
    startRun(); Object.keys(A.indices).forEach(i => { S().indices[i] = { lu: true }; });
    A.conclusions.forEach(c => { S().attach[c.id] = Object.keys(A.indices); });
    const spam = A.conclusions.filter(E.etablie).length;
    A.conclusions.forEach(c => { S().attach[c.id] = [c.requis[0]]; });
    const un = A.conclusions.filter(E.etablie).length;
    const jamaisA = ['solange', 'lucien', 'yann', 'mathilde', 'salaun'].every(s => E.finDe(s, ['C1', 'C2', 'C3', 'C4']) !== 'A');
    // aveu : jamais brisé avec pièces non pertinentes
    startRun(); Object.keys(A.indices).forEach(i => { S().indices[i] = { lu: true }; }); S().flags.d_ = 1; S().flags['d:aveu'] = 1;
    E.ACT.aveu(); let spamAveu = 0; A.aveu.enonces.forEach(e => { A.rangIndices.filter(i => !e.contre.includes(i)).forEach(i => { E.ACT.avOpen({ a: e.id }); E.ACT.avPres({ a: e.id, b: i }); }); }); spamAveu = S().aveu.length;
    out.statique = { bug, spamValide: spam, unSeulValide: un, jamaisA, spamAveu };
    return out;
  });
  console.log(JSON.stringify(res, null, 1));
  console.log('ERREURS:', JSON.stringify(errs));
  await b.close();
})();
