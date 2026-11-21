/* QA du moteur React Native : mêmes parcours que tests/qa2.js (jeu web), sans navigateur.
   Lancer : npm test (dans mobile/). Toute modif d'indice dans src/data.js → relancer. */
import assert from 'node:assert/strict';
import { Engine, A, fresh, parseSave } from '../src/core/engine.ts';

let E = new Engine();
const log: string[] = [];
const has = (k: string) => E.has(k);
const lieuOf = (id: string) => A.lieux.find((l: any) => l.id === id);
const avail = (lid: string, eid: string) => { const l = lieuOf(lid), e = l.elements.find((x: any) => x.id === eid); return E.hasAll(l.requiert) && E.hasAll(e.requiert); };
const availQ = (pid: string, qid: string, pal: number) => {
  const P = A.persos[pid], l = lieuOf(P.lieu), q = (pal === 1 ? P.p1 : P.p2).find((x: any) => x.id === qid);
  return E.hasAll(l.requiert) && E.hasAll(P.requiert) && (pal === 1 || has(P.req2)) && E.hasAll(q.requiert);
};
const obj = (l: string, e: string) => { if (!avail(l, e)) { log.push('BLOQUÉ ' + l + '.' + e); return false; } E.examiner(l, e); return true; };
const q = (p: string, pal: number, id: string) => { if (!availQ(p, id, pal)) { log.push('BLOQUÉ q ' + p + pal + id); return false; } E.poser(p, pal, id); return true; };
const attach = (c: string, ids: string[]) => ids.forEach(i => E.attacher(c, i));
const start = (mode: any = 'inspecteur') => { E = new Engine(); E.nouvelle(); E.choisirMode(mode); log.length = 0; };
const cassette = (erreurs: boolean) => {
  if (!obj('gendarmerie', 'magneto')) return false;
  A.cassette.segments.forEach((x: any) => { if (erreurs) assert.ok(E.cRep(x.id, (x.bon + 1) % x.opts.length)); assert.equal(E.cRep(x.id, x.bon), null); });
  return !!E.S.indices.I16;
};
const aveu = (p: [string, string][]) => { p.forEach(([id, i]) => E.avPres(id, i)); return has('d:aveuBrise'); };
const chrono = () => {
  const target = A.chrono.ordre;
  for (let pass = 0; pass < 30; pass++) { const v = E.chVis(); let done = true; for (let i = 0; i < v.length - 1; i++) if (target.indexOf(v[i]) > target.indexOf(v[i + 1])) { E.chMove(v[i], 'down'); done = false; break; } if (done) break; }
  E.chValider(); return has('d:chronoOK');
};
const confront = () => { A.confrontation.forEach((c: any) => E.confPres(c.id, c.contre[0])); return has('d:confOK'); };
const ok = (name: string, fn: () => void) => { try { fn(); console.log('✓', name); } catch (e: any) { console.log('✗', name, '\n ', e.message); process.exitCode = 1; } };

ok('Parcours 1 optimal : fin A, 3★, 15 indices', () => {
  start();
  ['sol', 'montre', 'main'].forEach(e => obj('cour', e));
  obj('cour', 'veste'); assert.ok(cassette(false)); obj('gendarmerie', 'rapport');
  obj('bureau', 'porte'); obj('bureau', 'agenda'); obj('bureau', 'lettre'); obj('cour', 'bassin');
  q('gwenn', 1, '1'); q('jeanne', 1, '3'); obj('vestiaire', 'm14'); obj('vestiaire', 'm7');
  ['lucien', 'yann', 'mathilde', 'salaun'].forEach(p => q(p, 1, '1'));
  assert.ok(has('d:yann'), 'Yann en garde à vue');
  obj('chaufferie', 'journal'); obj('compta', 'telephone'); q('agnes', 1, '2'); obj('infirmerie', 'registre');
  assert.ok(has('d:yannLibre') && has('d:aveu'), 'rebonds');
  q('jeanne', 1, '5');
  assert.ok(aveu([['s1', 'I17'], ['s2', 'I09'], ['s3', 'I18']]), 'aveu brisé');
  assert.ok(chrono(), 'chronologie');
  attach('C1', ['I01', 'I10']); attach('C2', ['I02', 'I12']); attach('C3', ['I03', 'I11']); attach('C4', ['I06', 'I08']);
  assert.ok(has('d:acte4'), 'acte 4');
  assert.ok(confront(), 'confrontation');
  const f = E.accuser('odile', E.preuvesEtablies());
  assert.equal(f.code, 'A'); assert.equal(f.rang, 3); assert.equal(Object.keys(E.S.indices).length, 15);
  assert.deepEqual(log, []);
});

ok('Parcours 1b complet : 20 indices, Mention Perspicace', () => {
  start();
  ['sol', 'montre', 'main', 'escalier', 'ampoule'].forEach(e => obj('cour', e));
  obj('cour', 'veste'); cassette(true); obj('gendarmerie', 'rapport');
  ['porte', 'fauteuil', 'agenda', 'lettre', 'tiroir'].forEach(e => obj('bureau', e)); obj('cour', 'bassin');
  ['programme', 'place'].forEach(e => obj('salle', e));
  ['solange', 'lucien', 'odile', 'yann', 'mathilde', 'salaun', 'gwenn', 'legoff'].forEach(p => A.persos[p].p1.forEach((x: any) => q(p, 1, x.id)));
  ['m3', 'm7', 'm9', 'm12', 'm14', 'm17', 'm21'].forEach(e => obj('vestiaire', e));
  A.persos.jeanne.p1.forEach((x: any) => q('jeanne', 1, x.id));
  ['journal', 'caisses', 'meteo', 'chaudiere'].forEach(e => obj('chaufferie', e));
  ['telephone', 'machine'].forEach(e => obj('compta', e)); A.persos.agnes.p1.forEach((x: any) => q('agnes', 1, x.id));
  ['registre', 'table'].forEach(e => obj('infirmerie', e)); A.persos.cozic.p1.forEach((x: any) => q('cozic', 1, x.id));
  obj('gendarmerie', 'pv'); A.persos.lorec.p1.forEach((x: any) => q('lorec', 1, x.id));
  obj('bureau', 'coffre'); assert.ok(E.coffre('1960')); assert.equal(E.coffre('1962'), null);
  obj('bureau', 'dos'); assert.equal(E.chiffre('mon dictaphone est dans ma veste'), null);
  obj('salle', 'photos'); ['gants', 'ecorchure', 'verre'].forEach(z => E.zone(z));
  for (let r = 0; r < 3; r++) Object.keys(A.persos).forEach(p => [1, 2].forEach(pal => (pal === 1 ? A.persos[p].p1 : A.persos[p].p2).forEach((x: any) => { if (!has('q:' + p + '.' + x.id) && availQ(p, x.id, pal)) q(p, pal, x.id); })));
  ['odile', 'solange', 'mathilde'].forEach(p => ['I16', 'I17', 'I18', 'I19', 'I20'].forEach(i => assert.ok(E.presenter(p, i).text)));
  assert.match(E.avPres('s1', 'I01')!, /ne bronche pas/);
  E.S.flags.solangePlats = 0; assert.match(E.avPres('s4', 'I16')!, /ne suffit pas seule/); E.S.flags.solangePlats = 1;
  aveu([['s1', 'I17'], ['s2', 'I09'], ['s3', 'I18'], ['s4', 'I16']]);
  assert.equal(E.S.aveu.length, 4);
  E.chMove('k5', 'up'); assert.match(E.chValider()!, /à la bonne place/);
  assert.ok(chrono());
  attach('C1', ['I01', 'I10', 'I14', 'I16']); attach('C2', ['I02', 'I12']); attach('C3', ['I03', 'I11', 'I12']); attach('C4', ['I06', 'I08', 'I19']);
  assert.ok(confront());
  const f = E.accuser('odile', E.preuvesEtablies());
  assert.equal(f.code, 'A'); assert.equal(f.rang, 3); assert.ok(f.perspicace); assert.equal(Object.keys(E.S.indices).length, 20);
});

ok('Parcours 2 avec erreurs : D, C, B, Bsol, puis A (2 conclusions suffisent), puis A', () => {
  start();
  ['sol', 'montre', 'main'].forEach(e => obj('cour', e));
  q('yann', 1, '1'); q('yann', 1, '4');
  const fins = ['yann', 'odile', 'lucien', 'solange'].map(s => { const c = E.accuser(s, E.preuvesEtablies()).code; E.rouvrir(); return c; });
  q('odile', 1, '1'); obj('vestiaire', 'm14');
  assert.equal(E.presenter('odile', 'I01').text, A.persos.odile.defaut);
  assert.ok(!avail('chaufferie', 'caisses') && !avail('gendarmerie', 'magneto') && !avail('gendarmerie', 'pv'), 'verrous');
  ['lucien', 'mathilde', 'salaun'].forEach(p => q(p, 1, '1'));
  obj('bureau', 'lettre'); obj('bureau', 'agenda'); obj('bureau', 'tiroir');
  q('gwenn', 1, '1'); q('jeanne', 1, '3'); obj('vestiaire', 'm14');
  E.S.attach.C1 = ['I07', 'I01']; assert.equal(E.verifier()!.C1.s, 'ko');
  E.S.attach.C1 = ['I01']; assert.match(E.verifier()!.C1.msg!, /il manque/);
  E.S.attach.C1 = ['I01', 'I10', 'I08']; assert.equal(E.verifier()!.C1.s, 'ok');
  E.S.attach = { C1: ['I01', 'I10'], C2: ['I02', 'I12'], C3: ['I03', 'I11'], C4: ['I06'] };
  fins.push(E.accuser('odile', E.preuvesEtablies()).code); E.rouvrir();
  E.S.attach.C4 = ['I06', 'I08']; fins.push(E.accuser('odile', E.preuvesEtablies()).code);
  assert.deepEqual(fins, ['D', 'C', 'B', 'Bsol', 'A', 'A']);
});

ok('Modes : Commissaire (aides 1/2/4 off, 3 vérifs), Stagiaire (aide gratuite)', () => {
  start('commissaire');
  assert.match(E.aideN(1), /Indisponible/); assert.match(E.aideN(2), /Indisponible/); assert.match(E.aideN(4), /Indisponible/);
  assert.ok(!/Indisponible/.test(E.aideN(3)));
  for (let i = 0; i < 4; i++) E.verifier();
  assert.equal(E.S.verifN, 3);
  start('stagiaire'); E.aideN(3); E.aideN(4); assert.equal(E.S.aide.cout, 0);
});

ok('Parcours 3 : ne suit que l\'aide → fin A, aucune aide vide', () => {
  start();
  const M: Record<string, () => any> = {
    'i:I01': () => obj('cour', 'sol'), 'i:I02': () => obj('cour', 'montre'), 'i:I03': () => obj('cour', 'main'),
    calePorte: () => obj('bureau', 'porte'), 'i:I09': () => obj('cour', 'bassin'), 'i:I08': () => obj('bureau', 'agenda'),
    'i:I06': () => obj('bureau', 'lettre'), 'i:I07': () => obj('bureau', 'tiroir'),
    't:odile': () => q('odile', 1, '1'), 't:solange': () => q('solange', 1, '1'), 't:lucien': () => q('lucien', 1, '1'),
    't:yann': () => q('yann', 1, '1'), 't:mathilde': () => q('mathilde', 1, '1'), 't:salaun': () => q('salaun', 1, '1'),
    'i:I12': () => q('gwenn', 1, '1'), 'i:I11': () => obj('vestiaire', 'm14'), 'i:I10': () => q('jeanne', 1, '3'),
    'i:I13': () => obj('chaufferie', 'journal'), 'i:I04': () => obj('chaufferie', 'caisses'), agnes: () => obj('compta', 'telephone'),
    'i:I14': () => q('agnes', 1, '2'), 'i:I15': () => obj('infirmerie', 'registre'),
    cassette: () => obj('cour', 'veste'), 'i:I16': () => cassette(false), 'i:I17': () => obj('gendarmerie', 'rapport'), 'i:I18': () => obj('vestiaire', 'm7'),
    'd:aveuBrise': () => { q('jeanne', 1, '5'); return aveu([['s1', 'I17'], ['s2', 'I09'], ['s3', 'I18']]); },
    'd:chronoOK': () => chrono(), 'd:confOK': () => confront(),
  };
  const att: Record<string, string[]> = { C1: ['I01', 'I10'], C2: ['I02', 'I12'], C3: ['I03', 'I11'], C4: ['I06', 'I08'] };
  let g = 0, vide = 0;
  while (g++ < 80) {
    const step = A.aide.find((s: any) => !has(s.manque)); if (!step) break;
    if (!E.aideN(g % 3 === 0 ? 4 : g % 2 ? 3 : 2)) vide++;
    const k = step.manque;
    if (k.startsWith('c:')) { E.S.attach[k.slice(2)] = att[k.slice(2)].slice(); continue; }
    assert.ok(M[k] && M[k]() && has(k), 'échec sur ' + k);
  }
  assert.equal(vide, 0);
  const f = E.accuser('odile', E.preuvesEtablies());
  assert.equal(f.code, 'A'); assert.equal(f.rang, 1);
});

ok('Anti-triche : spam d\'indices = 0 conclusion, un seul indice = 0, seule Odile donne A', () => {
  start(); Object.keys(A.indices).forEach(i => { E.S.indices[i] = { lu: true, ts: 0 }; });
  A.conclusions.forEach((c: any) => { E.S.attach[c.id] = Object.keys(A.indices); });
  assert.equal(E.nbEtablies(), 0);
  A.conclusions.forEach((c: any) => { E.S.attach[c.id] = [c.requis[0]]; });
  assert.equal(E.nbEtablies(), 0);
  ['solange', 'lucien', 'yann', 'mathilde', 'salaun'].forEach(s => assert.notEqual(Engine.finDe(s, ['C1', 'C2', 'C3', 'C4']), 'A'));
  E.S.flags['d:aveu'] = 1;
  A.aveu.enonces.forEach((e: any) => A.rangIndices.filter((i: string) => !e.contre.includes(i)).forEach((i: string) => E.avPres(e.id, i)));
  assert.equal(E.S.aveu.length, 0);
});

ok('Chiffre : la clé décode le message', () => { assert.equal(Engine.decode(A.chiffre.chiffre, A.chiffre.cle), A.chiffre.clair); });

ok('Sauvegarde : relecture, schéma inconnu ignoré', () => {
  start(); obj('cour', 'sol');
  const S2 = parseSave(JSON.stringify(E.S))!; assert.ok(S2.indices.I01);
  assert.equal(parseSave(JSON.stringify({ ...fresh(), schema: 1 })), null);
  assert.equal(parseSave('pas du json'), null);
});
