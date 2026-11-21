/* ===== MOTEUR (portage TypeScript de src/engine.js) =====
   Aucune donnée d'enquête ici : tout vient de AFFAIRE (src/data.js, partagé avec le jeu web).
   Aucune dépendance à React Native : testable sous Node. L'interface écoute les événements (toast, son). */
import AFFAIRE from '../shared/affaire.js';

export const A: any = AFFAIRE;
export const KEY = 'ENG1:' + A.id;
export const OKEY = 'ENG1:options';
export const SCHEMA = 2;
export const SUSPECTS = ['solange', 'lucien', 'odile', 'yann', 'mathilde', 'salaun'];
export const ACTES: Record<number, string> = { 1: 'La scène', 2: 'Les versions', 3: 'Les vérifications', 4: 'La confrontation' };
const COUT: Record<number, number> = { 2: 1, 3: 2, 4: 3 };
export const MODES = ['stagiaire', 'inspecteur', 'commissaire'] as const;
export type Mode = typeof MODES[number];

export type Son = 'indice' | 'debloc' | 'rebond' | 'ok' | 'succes' | 'verif' | 'finA' | 'finKO';
export type Fin = { code: string; sus: string; preuves: string[]; rang: number; perspicace: boolean };
export type State = {
  schema: number; caseVersion: string; acte: number;
  indices: Record<string, { lu: boolean; ts: number }>; flags: Record<string, number>; asked: Record<string, number>; vus: Record<string, number>;
  attach: Record<string, string[]>; statut: Record<string, string>; aide: { cout: number; n: number[] };
  conf: string[]; aveu: string[]; cas: Record<string, number>; verifN: number; mode: Mode; journal: string[];
  chrono: { ordre: string[]; essais: number }; fin: Fin | null; lastNew: number; t0: number;
};
export type Options = { big: number; sound: number; anim: number; voix: number; desc: number; descAcc: number; amb: number };
export type Verif = Record<string, { s: 'ok' | 'ko' | 'vide'; msg?: string }>;

export const fresh = (): State => ({
  schema: SCHEMA, caseVersion: A.version, acte: 1, indices: {}, flags: {}, asked: {}, vus: {},
  attach: { C1: [], C2: [], C3: [], C4: [] }, statut: {}, aide: { cout: 0, n: [0, 0, 0, 0] },
  conf: [], aveu: [], cas: {}, verifN: 0, mode: 'inspecteur', journal: [],
  chrono: { ordre: ['k5', 'k2', 'k7', 'k1', 'k4', 'k8', 'k3', 'k6'], essais: 0 },
  fin: null, lastNew: Date.now(), t0: Date.now(),
});
export const defaultOptions = (): Options => ({ big: 0, sound: 1, anim: 1, voix: 1, desc: 1, descAcc: 0, amb: 0 });

/** Relit une sauvegarde. Renvoie null si absente ou d'un autre schéma (mêmes règles que le web). */
export function parseSave(json: string | null): State | null {
  try {
    const o = JSON.parse(json || 'null');
    if (!o || o.schema !== SCHEMA) return null;
    const base = fresh();
    const S = Object.assign(base, o) as State;
    S.attach = Object.assign(fresh().attach, o.attach || {});
    S.caseVersion = A.version;
    return S;
  } catch { return null; }
}

export type Listener = { toast?: (msg: string) => void; son?: (s: Son) => void; save?: (S: State) => void };

export class Engine {
  S: State = fresh();
  L: Listener;
  constructor(L: Listener = {}) { this.L = L; }

  /* --- outils --- */
  private toast(msg: string) {
    if (!/^(Résultat copié|Mode Commissaire)/.test(msg)) {
      const j = this.S.journal, last = j[j.length - 1];
      if (last !== msg) j.push(msg);
      if (j.length > 120) j.shift();
    }
    this.L.toast?.(msg);
  }
  private son(s: Son) { this.L.son?.(s); }
  save() { this.L.save?.(this.S); }

  concl = (id: string) => A.conclusions.find((c: any) => c.id === id);
  evalC(c: any) {
    const S = this.S;
    const a = (S.attach[c.id] || []).filter(x => S.indices[x]);
    const manque = c.requis.some((x: string) => !a.includes(x));
    const faux = a.filter(x => (A.fausses || []).includes(x));
    const extras = a.filter(x => !c.requis.includes(x) && !c.bonus.includes(x) && !faux.includes(x));
    return { vide: !a.length, manque, faux, extras, ok: !manque && !faux.length && extras.length <= 1 };
  }
  etablie = (c: any) => this.evalC(c).ok;
  has = (k: string): boolean => {
    const S = this.S;
    if (k.startsWith('i:')) return !!S.indices[k.slice(2)];
    if (k.startsWith('q:')) return !!S.asked[k.slice(2)];
    if (k.startsWith('c:')) return this.etablie(this.concl(k.slice(2)));
    return !!S.flags[k.replace(/^f:/, '')];
  };
  hasAll = (arr?: string[]) => (arr || []).every(this.has);
  ownedIds = (): string[] => A.rangIndices.filter((id: string) => this.S.indices[id]);
  nbEtablies = () => A.conclusions.filter(this.etablie).length;
  lieuOuvert = (l: any) => this.hasAll(l.requiert);
  elVisible = (e: any) => this.hasAll(e.requiert);
  persoVisible = (p: string) => this.hasAll(A.persos[p].requiert);
  perspicace = () => !!(this.S.flags.coffreOK && this.S.flags.chiffreOK && this.S.flags.photoOK);
  coutAide = (n: number) => (this.S.mode === 'stagiaire' ? 0 : COUT[n]);
  aideOk = (n: number) => this.S.mode !== 'commissaire' || n === 3;
  descVisible = (o: Options) => (this.S.mode !== 'commissaire' ? !!o.desc : !!o.descAcc);

  private checkUnlocks() {
    const S = this.S;
    A.deblocages.forEach((d: any) => {
      if (!S.flags['d:' + d.id] && this.hasAll(d.quand)) {
        S.flags['d:' + d.id] = 1; S.acte = Math.max(S.acte, d.acte); this.toast(d.msg); this.son(d.rebond ? 'rebond' : 'debloc');
        (d.flags || []).forEach((f: string) => this.setFlag(f));
      }
    });
  }
  private gain(id: string) {
    const S = this.S;
    if (S.indices[id]) return false;
    S.indices[id] = { lu: false, ts: Date.now() }; S.lastNew = Date.now();
    this.toast('Nouvel indice : ' + A.indices[id].titre); this.son('indice');
    return true;
  }
  private setFlag(f: string) {
    const S = this.S;
    if (S.flags[f]) return false;
    S.flags[f] = 1;
    A.lieux.forEach((l: any) => l.elements.forEach((e: any) => {
      if (e.requiert && e.requiert.includes(f) && this.hasAll(e.requiert)) this.toast(e.apparait || 'Nouvel élément : ' + e.nom);
    }));
    return true;
  }

  /* --- partie --- */
  nouvelle() { this.S = fresh(); this.save(); }
  charger(S: State) { this.S = S; }
  choisirMode(m: Mode) { this.S.mode = m; this.save(); }

  visiterLieu(lid: string) {
    const S = this.S;
    if (!S.flags['v:' + lid]) {
      S.flags['v:' + lid] = 1;
      const k = A.carnet.find((x: any) => x.lieu === lid);
      if (k) this.toast('Carnet de Douarnenez : ' + k.titre);
      this.save();
    }
  }
  examiner(lid: string, eid: string) {
    const S = this.S;
    const l = A.lieux.find((x: any) => x.id === lid), e = l.elements.find((x: any) => x.id === eid);
    S.vus[lid + '.' + eid] = 1;
    if (e.indice) this.gain(e.indice);
    (e.flags || []).forEach((f: string) => { if (!S.flags[f]) { S.flags[f] = 1; if (e.suite || e.apparait) this.toast(e.suite || e.apparait); } });
    this.checkUnlocks(); this.save();
    return e;
  }
  poser(pid: string, pal: number, qid: string) {
    const S = this.S, P = A.persos[pid], q = (pal === 1 ? P.p1 : P.p2).find((x: any) => x.id === qid);
    S.asked[pid + '.' + qid] = 1;
    if (pal === 1) S.flags['t:' + pid] = 1;
    (q.donne || []).forEach((i: string) => this.gain(i)); (q.flags || []).forEach((f: string) => this.setFlag(f));
    this.checkUnlocks(); this.save();
    return { pid, text: q.r as string, q: q.q as string };
  }
  presenter(pid: string, iid: string) {
    const S = this.S, P = A.persos[pid], r = (P.react || {})[iid];
    S.asked[pid + '.p.' + iid] = 1;
    if (r) { (r.donne || []).forEach((i: string) => this.gain(i)); (r.flags || []).forEach((f: string) => this.setFlag(f)); }
    this.checkUnlocks(); this.save();
    return { pid, text: (r ? r.r : P.defaut) as string, q: 'Vous présentez : ' + A.indices[iid].titre };
  }
  lire(iid: string) { if (this.S.indices[iid] && !this.S.indices[iid].lu) { this.S.indices[iid].lu = true; this.save(); } }
  tutoVu() { this.S.flags.tutoVu = 1; this.save(); }
  statut(sid: string) { const S = this.S; S.statut[sid] = (S.statut[sid] || 'possible') === 'possible' ? 'ecarte' : 'possible'; this.save(); }

  /* --- cassette --- */
  cRep(segId: number, rep: number): string | null {
    const S = this.S, x = A.cassette.segments.find((y: any) => y.id === segId);
    if (rep !== x.bon) { this.save(); return 'Ce n\'est pas cela. Réécoutez : rien n\'est perdu.'; }
    S.cas[x.id] = 1; this.son('ok');
    if (A.cassette.segments.every((y: any) => S.cas[y.id])) { this.gain('I16'); S.flags.cassetteOK = 1; this.checkUnlocks(); }
    this.save(); return null;
  }

  /* --- énigmes optionnelles --- */
  coffre(code: string): string | null {
    const S = this.S;
    if (code.trim() === A.coffre.code) { this.gain(A.coffre.indice); S.flags.coffreOK = 1; this.checkUnlocks(); this.save(); this.son('succes'); return null; }
    return 'La serrure ne cède pas.';
  }
  static norm = (t: string) => String(t).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  static decode = (t: string, k: number) => t.replace(/[A-Z]/g, ch => String.fromCharCode((ch.charCodeAt(0) - 65 - k + 26) % 26 + 65));
  chiffre(clair: string): string | null {
    if (Engine.norm(clair) === A.chiffre.clair) { this.S.flags.chiffreOK = 1; this.toast('Message déchiffré.'); this.save(); this.son('succes'); return null; }
    return 'Ce n\'est pas un message lisible.';
  }
  zone(id: string) {
    const S = this.S, z = A.photoDiff.zones.find((x: any) => x.id === id);
    if (!z || S.flags['pz.' + z.id]) return;
    S.flags['pz.' + z.id] = 1; this.toast('Différence trouvée : ' + z.nom); this.son('indice');
    if (z.indice) this.gain(z.indice);
    if (A.photoDiff.zones.every((x: any) => S.flags['pz.' + x.id])) S.flags.photoOK = 1;
    this.checkUnlocks(); this.save();
  }

  /* --- aveu, confrontation --- */
  avPres(eid: string, iid: string): string | null {
    const S = this.S, e = A.aveu.enonces.find((x: any) => x.id === eid);
    if (!e.contre.includes(iid)) return 'Elle ne bronche pas. Cette pièce ne répond pas à son récit.';
    if (!this.hasAll(e.et)) return 'La pièce compte, mais elle ne suffit pas seule. Il vous manque un témoignage pour la rendre décisive (le vestiaire note tout).';
    if (!S.aveu.includes(e.id)) S.aveu.push(e.id);
    this.son('ok');
    if (S.aveu.length >= A.aveu.seuil && !S.flags['d:aveuBrise']) { S.flags['d:aveuBrise'] = 1; this.toast('L\'aveu ne tient plus.'); this.checkUnlocks(); }
    this.save(); return null;
  }
  confPres(cid: string, iid: string): string | null {
    const S = this.S, c = A.confrontation.find((x: any) => x.id === cid);
    if (!c.contre.includes(iid)) return 'Elle ne bronche pas. Cette pièce ne répond pas à son affirmation.';
    if (!S.conf.includes(c.id)) S.conf.push(c.id);
    if (A.confrontation.every((x: any) => S.conf.includes(x.id))) S.flags['d:confOK'] = 1;
    this.save(); this.son('ok'); return null;
  }

  /* --- chronologie --- */
  card = (id: string) => A.chrono.cartes.find((c: any) => c.id === id);
  chVis = (): string[] => this.S.chrono.ordre.filter(id => this.has(this.card(id).req));
  chMove(id: string, dir: 'up' | 'down') {
    const vis = this.chVis(), i = vis.indexOf(id), j = i + (dir === 'up' ? -1 : 1);
    if (i < 0 || j < 0 || j >= vis.length) return;
    [vis[i], vis[j]] = [vis[j], vis[i]];
    let k = 0; this.S.chrono.ordre = this.S.chrono.ordre.map(x => (this.has(this.card(x).req) ? vis[k++] : x));
    this.save();
  }
  chValider(): string | null {
    const S = this.S, vis = this.chVis(), exp = A.chrono.ordre.filter((id: string) => vis.includes(id));
    const bons = vis.filter((id, i) => id === exp[i]).length, complet = vis.length === A.chrono.cartes.length;
    S.chrono.essais++;
    let msg: string | null = null;
    if (bons === vis.length && complet) { S.flags['d:chronoOK'] = 1; this.toast('Chronologie établie.'); this.son('succes'); this.checkUnlocks(); }
    else if (bons === vis.length) msg = 'L\'ordre est cohérent pour ce que vous savez, mais il manque des événements.';
    else msg = S.mode === 'commissaire' ? 'Ordre incorrect.' : bons + ' carte(s) sur ' + vis.length + ' à la bonne place.';
    this.save(); return msg;
  }

  /* --- déduction --- */
  attacher(cid: string, iid: string) { const S = this.S; if (!(S.attach[cid] || []).includes(iid)) S.attach[cid] = (S.attach[cid] || []).concat(iid); this.save(); }
  detacher(cid: string, iid: string) { this.S.attach[cid] = (this.S.attach[cid] || []).filter(x => x !== iid); this.save(); }
  verifier(): Verif | null {
    const S = this.S;
    if (S.mode === 'commissaire' && S.verifN >= 3) { this.toast('Mode Commissaire : plus de vérification disponible.'); return null; }
    S.verifN++; this.save();
    const V: Verif = {};
    A.conclusions.forEach((c: any) => {
      const e = this.evalC(c);
      V[c.id] = e.vide ? { s: 'vide' } : e.ok ? { s: 'ok' } : {
        s: 'ko', msg: e.faux.length ? '« ' + A.indices[e.faux[0]].titre + ' » ne prouve pas cette conclusion.' : e.manque ? 'il manque encore au moins un indice déterminant.' : 'trop d\'indices rattachés : gardez ceux qui prouvent vraiment.',
      };
    });
    this.son('verif'); return V;
  }

  /* --- aide --- */
  cap() {
    const S = this.S, nbI = this.ownedIds().length, nbC = this.nbEtablies();
    const reste: string[] = [];
    A.lieux.filter(this.lieuOuvert).forEach((l: any) => {
      const n = l.elements.filter((e: any) => this.elVisible(e) && !S.vus[l.id + '.' + e.id]).length;
      if (n) reste.push(l.nom + ' (' + n + ')');
    });
    const nonInt = SUSPECTS.filter(s => !S.flags['t:' + s]).map(s => A.persos[s].nom);
    let t = `Acte ${S.acte} — ${ACTES[S.acte]}. Indices : ${nbI}/${A.rangIndices.length}. Conclusions établies : ${nbC}/4.`;
    if (reste.length) t += ` Éléments encore à examiner : ${reste.join(', ')}.`;
    if (S.acte >= 2 && nonInt.length) t += ` Pas encore interrogés : ${nonInt.join(', ')}.`;
    if (!reste.length && !nonInt.length) t += ' Tout a été examiné : ouvrez le tableau de déduction.';
    return t;
  }
  aideN(n: number): string {
    const S = this.S;
    if (!this.aideOk(n)) return 'Indisponible en mode Commissaire.';
    let msg: string;
    if (n === 1) { msg = this.cap(); S.aide.n[0]++; }
    else {
      const step = A.aide.find((s: any) => !this.has(s.manque));
      const key = ({ 2: 'piste', 3: 'coup', 4: 'rev' } as Record<number, string>)[n];
      msg = step ? step[key] : 'Tout est en place. Ouvrez le tableau de déduction, puis accusez.';
      S.aide.cout += this.coutAide(n); S.aide.n[n - 1]++;
    }
    S.lastNew = Date.now(); this.save();
    return msg;
  }

  /* --- fins --- */
  static finDe(sus: string, preuves: string[]) {
    if (sus === 'yann') return 'D';
    if (sus === 'solange') return 'Bsol';
    if (sus !== 'odile') return 'B';
    return preuves.includes('C3') && (preuves.includes('C1') || preuves.includes('C2')) ? 'A' : 'C';
  }
  rang() {
    const S = this.S, nb = this.nbEtablies();
    const alibis = ['I13', 'I14', 'I15'].every(i => S.indices[i]);
    let st = nb === 4 && alibis && this.has('d:aveuBrise') && this.has('d:chronoOK') ? 3 : 2;
    if (S.aide.cout > 12) st -= 2; else if (S.aide.cout > 3) st -= 1;
    if (S.mode === 'stagiaire') st = Math.min(st, 2);
    return Math.max(1, st);
  }
  preuvesEtablies = (): string[] => A.conclusions.filter(this.etablie).map((c: any) => c.id);
  accuser(sus: string, preuves: string[]) {
    const code = Engine.finDe(sus, preuves);
    this.S.fin = { code, sus, preuves: preuves.slice(), rang: code === 'A' ? this.rang() : 0, perspicace: this.perspicace() };
    this.save(); this.son(code === 'A' ? 'finA' : 'finKO');
    return this.S.fin;
  }
  rouvrir() { this.S.fin = null; this.save(); }
  partage() {
    const f = this.S.fin!;
    return `J'ai terminé « ${A.titre} » : ${A.fins[f.code].titre}${f.code === 'A' ? ' — ' + '★'.repeat(f.rang) + '☆'.repeat(3 - f.rang) + (f.perspicace ? ' · Mention Perspicace' : '') : ''}.`;
  }
}
