/* Écrans du jeu : portage 1 pour 1 des vues de src/engine.js. */
import React, { useState } from 'react';
import { Alert, Linking, Platform, Pressable, Share, TextInput, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import ART from './shared/art.js';
import { A, ACTES, Engine, MODES, SUSPECTS } from './core/engine';
import { useGame } from './game';
import * as Sons from './audio/sons';
import { Btn, C, Card, Chip, Good, H2, H3, Mute, Panel, Row, Scene, Sep, Speech, T, Tabs, Warn, Who, useFs } from './ui/kit';

type Vue = { title: string; body: React.ReactNode };

/** Confirmation : Alert natif sur téléphone, confirm() sur le web. */
export function confirmer(msg: string, ok: () => void) {
  if (Platform.OS === 'web') { if ((globalThis as any).confirm?.(msg) ?? true) ok(); return; }
  Alert.alert('La Dernière Pêche', msg, [{ text: 'Annuler', style: 'cancel' }, { text: 'Oui', style: 'destructive', onPress: ok }]);
}

function Saisie({ id, numeric, placeholder, label, value, onChange }: { id: string; numeric?: boolean; placeholder: string; label: string; value: string; onChange: (t: string) => void }) {
  const fs = useFs();
  return <TextInput nativeID={id} testID={id} accessibilityLabel={label} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={C.mute}
    keyboardType={numeric ? 'number-pad' : 'default'} maxLength={numeric ? 4 : 60} autoCorrect={false} autoCapitalize="none"
    style={{ minHeight: 50, borderRadius: 12, borderWidth: 1, borderColor: C.trait, backgroundColor: C.nuit2, color: C.txt, fontSize: fs(19), paddingHorizontal: 14, marginVertical: 8, textAlign: numeric ? 'center' : 'left', letterSpacing: numeric ? 8 : 0 }} />;
}

/** Les deux tirages : zones tactiles posées sur le dessin (mêmes coordonnées que art.js). */
function Photos({ found, onZone }: { found: Record<string, boolean>; onZone: (id: string) => void }) {
  const [w, setW] = useState(0);
  const Z: Record<string, [number, number]> = { gants: [302, 99], ecorchure: [243, 138], verre: [302, 72] };
  const k = w / 360, r = 13;
  return (
    <View onLayout={e => setW(e.nativeEvent.layout.width)} style={{ width: '100%', aspectRatio: 360 / 190, borderRadius: 14, overflow: 'hidden', marginVertical: 8 }}>
      <SvgXml xml={ART.photos(found)} width="100%" height="100%" />
      {w > 0 && Object.entries(Z).map(([id, [cx, cy]]) => (
        <Pressable key={id} testID={'zone-' + id} accessibilityRole="button" accessibilityLabel={'Zone ' + id} onPress={() => onZone(id)}
          hitSlop={4} style={{ position: 'absolute', left: (cx - r) * k, top: (cy - r) * k, width: 2 * r * k, height: 2 * r * k, borderRadius: r * k }} />
      ))}
    </View>
  );
}

export function useVue(): Vue {
  const g = useGame();
  const { E, O, ui, vue, set, go, back, root, refresh } = g;
  const S = E.S, p = vue.params;
  const [code, setCode] = useState(''); const [clair, setClair] = useState('');
  const has = E.has, hasAll = E.hasAll;
  const pickList = (onPick: (id: string) => void) => {
    const ids = E.ownedIds();
    return ids.length ? ids.map(id => <Btn key={id} label={A.indices[id].titre} small={A.indices[id].lieu} onPress={() => onPick(id)} />) : <Mute>Votre dossier est vide.</Mute>;
  };
  const hint = (aide: string) => S.mode === 'stagiaire' ? <Panel><Mute>{aide}</Mute></Panel> : S.mode === 'inspecteur' ? (ui.panel === 'hint' ? <Panel><Mute>{aide}</Mute></Panel> : <Btn label="Un indice" onPress={() => set({ panel: 'hint' })} />) : null;

  switch (vue.view) {
    case 'accueil': {
      const sv = g.sauvegarde ? (() => { try { return JSON.parse(g.sauvegarde!); } catch { return null; } })() : null;
      const nouvelle = () => { const f = () => { E.nouvelle(); g.resetUI(); root('mode'); }; if (sv) confirmer('Effacer la sauvegarde et recommencer ?', f); else f(); };
      return { title: '', body: <>
        <View style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 6 }}>
          <T mute style={{ letterSpacing: 3 }}>DOUARNENEZ · 1987</T>
          <T style={{ fontSize: 33, lineHeight: 40, letterSpacing: 4, color: C.sodium, textAlign: 'center', marginVertical: 10 }}>LA DERNIÈRE{'\n'}PÊCHE</T>
          <T mute style={{ letterSpacing: 3 }}>UNE ENQUÊTE POLICIÈRE</T>
        </View>
        <Scene xml={ART.scene('cour')} />
        {sv ? <>
          <Btn kind="pri" label="Reprendre l'enquête" small={sv.fin ? 'Enquête terminée' : 'Acte ' + sv.acte + ' · ' + Object.keys(sv.indices || {}).length + ' indices · ' + A.modes[sv.mode || 'inspecteur'].nom} onPress={g.reprendre} />
          <Btn label="Nouvelle enquête" onPress={nouvelle} />
        </> : <Btn kind="pri" label="Nouvelle enquête" onPress={nouvelle} />}
        <Row><Btn label="Options" onPress={() => go('options')} /><Btn label="Crédits" onPress={() => go('credits')} /></Row>
        <Mute center>Trois niveaux de difficulté · Sauvegarde automatique · Hors ligne</Mute>
      </> };
    }
    case 'mode':
      return { title: 'Niveau', body: <>
        <Mute>Choisissez votre niveau. Il ne change ni l'enquête ni le coupable.</Mute>
        {MODES.map(m => <Btn key={m} kind={m === 'inspecteur' ? 'pri' : undefined} label={A.modes[m].nom + (m === 'inspecteur' ? ' (conseillé)' : '')} small={A.modes[m].desc} onPress={() => { E.choisirMode(m); root('briefing'); }} />)}
      </> };
    case 'briefing':
      return { title: 'Briefing', body: <>
        <Scene xml={ART.scene('cour')} />
        {A.briefing.map((t: string, i: number) => <Speech key={i}>{t}</Speech>)}
        <Btn kind="pri" label="Continuer" onPress={() => root('tuto')} />
      </> };
    case 'tuto': {
      const L = [['Lieux', 'Touchez un lieu, puis chaque objet ou personne. Les nouveaux éléments sont signalés par un badge.'], ['Dossier', 'Le bouton Dossier garde vos indices, les déclarations des suspects, les pistes et le journal de bord.'], ['Interroger', 'Posez les questions, puis présentez une pièce du dossier pour faire réagir.'], ['Déduire', 'Dans le tableau de déduction, rattachez les bons indices à chaque conclusion.'], ['Aide', 'Quatre niveaux, du plus discret au plus direct. Elle ne bloque jamais l\'enquête.']];
      return { title: 'En 30 secondes', body: <>
        {L.map(x => <Panel key={x[0]}><T style={{ color: C.sodium }}>{x[0]}</T><T>{x[1]}</T></Panel>)}
        <Mute>Votre progression est sauvegardée automatiquement.</Mute>
        {S.flags.tutoVu ? <Btn kind="pri" label="Retour" onPress={back} /> : <Btn kind="pri" label="Compris, commencer" onPress={() => { E.tutoVu(); root('hub'); }} />}
      </> };
    }
    case 'hub': {
      const nbI = E.ownedIds().length, nbC = E.nbEtablies();
      const pistes = A.pistes.filter((x: any) => hasAll(x.quand)), open = pistes.filter((x: any) => !hasAll(x.fin)), done = pistes.length - open.length;
      const reb = A.deblocages.filter((d: any) => d.rebond && S.flags['d:' + d.id]);
      return { title: 'Enquête', body: <>
        <Panel><Mute>{`Acte ${S.acte} — ${ACTES[S.acte]} · ${A.modes[S.mode].nom}`}</Mute><T>{`Indices ${nbI}/${A.rangIndices.length} · Conclusions ${nbC}/4`}</T></Panel>
        {reb.map((d: any) => <Warn key={d.id}>{d.msg}</Warn>)}
        <H3>Lieux</H3>
        {A.lieux.map((l: any) => {
          if (!E.lieuOuvert(l)) return <Btn key={l.id} disabled label={'🔒 ' + l.nom} small={l.verrou} />;
          const n = l.elements.filter((e: any) => E.elVisible(e) && !S.vus[l.id + '.' + e.id]).length;
          return <Btn key={l.id} label={l.nom} badge={n || undefined} small={l.desc.split('.')[0]} onPress={() => { E.visiterLieu(l.id); go('lieu', { id: l.id }); }} />;
        })}
        <Btn label="La carte de Douarnenez" small="Rosmeur, Port-Rhu, Tréboul, île Tristan" onPress={() => go('carte')} />
        <H3>{'Pistes ouvertes' + (done ? ` (${done} résolues)` : '')}</H3>
        {open.length ? open.slice(0, 4).map((x: any) => <Panel key={x.id}><T>{'▸ ' + x.texte}</T></Panel>) : <Mute>Aucune piste ouverte pour le moment. Examinez la scène.</Mute>}
        <H3>Déduire</H3>
        <Btn label="Tableau de déduction" small="Rattachez vos indices à 4 conclusions" onPress={() => { set({ verif: null }); go('deduction'); }} />
        {has('d:aveu') ? <Btn kind={has('d:aveuBrise') ? 'done' : 'pri'} label="L'aveu de Solange Morvan" small={has('d:aveuBrise') ? 'Aveu brisé' : 'À examiner'} onPress={() => { set({ confMsg: null }); go('aveu'); }} /> : null}
        {has('d:aveuBrise') ? <Btn kind={has('d:chronoOK') ? 'done' : 'pri'} label="La chronologie de la nuit" small={has('d:chronoOK') ? 'Reconstituée' : 'À reconstituer'} onPress={() => { set({ msg: null }); go('chrono'); }} /> : null}
        {has('d:acte4') ? <Btn kind="pri" label="Confrontation avec Odile Quéré" small="Acte 4" onPress={() => { set({ confMsg: null }); go('confront'); }} /> : null}
        <Btn kind="red" label="Accuser quelqu'un" onPress={() => { set({ acc: { sus: ui.acc.sus, preuves: E.preuvesEtablies() } }); go('accuser'); }} />
      </> };
    }
    case 'lieu': {
      const l = A.lieux.find((x: any) => x.id === p.id);
      const pers = (l.persos || []).filter(E.persoVisible);
      return { title: l.nom, body: <>
        <Scene xml={ART.scene(l.id)} />
        <T>{l.desc}</T>
        <H3>À examiner</H3>
        {l.elements.filter(E.elVisible).map((e: any) => <Btn key={e.id} label={e.nom} kind={S.vus[l.id + '.' + e.id] ? 'done' : undefined} onPress={() => {
          E.examiner(l.id, e.id); set({ msg: null, segMsg: null, shift: 0 }); setCode(''); setClair('');
          go(e.ecran || 'obj', { lieu: l.id, el: e.id });
        }} />)}
        {pers.length ? <><H3>Personnes présentes</H3>{pers.map((pid: string) => <Btn key={pid} label={A.persos[pid].nom} small={A.persos[pid].role} kind={S.flags['t:' + pid] ? 'done' : undefined} onPress={() => go('perso', { id: pid })} />)}</> : null}
      </> };
    }
    case 'obj': {
      const l = A.lieux.find((x: any) => x.id === p.lieu), e = l.elements.find((x: any) => x.id === p.el);
      if (e.indice) return { title: l.nom, body: <><Card I={A.indices[e.indice]} stamp /><Mute>Ajouté au dossier.</Mute><Btn kind="pri" label="Continuer" onPress={back} /></> };
      return { title: l.nom, body: <><H2>{e.nom}</H2><Speech>{e.texte}</Speech><Btn kind="pri" label="Continuer" onPress={back} /></> };
    }
    case 'perso': {
      const P = A.persos[p.id], pal = ui.palier[p.id] || 1, locked2 = !has(P.req2);
      const list = (pal === 1 ? P.p1 : P.p2).filter((q: any) => hasAll(q.requiert));
      return { title: P.nom, body: <>
        <Who P={P} />
        {ui.reply && ui.reply.pid === p.id ? <><Panel><Mute>{ui.reply.q}</Mute></Panel><Speech>{ui.reply.text}</Speech></> : <Speech><T mute style={{ fontStyle: 'italic' }}>{P.intro}</T></Speech>}
        {P.p2.length ? <Tabs on={String(pal)} onPick={k => set({ palier: { ...ui.palier, [p.id]: +k }, reply: null })} items={[['1', 'Version officielle'], ['2', 'Creuser' + (locked2 ? ' 🔒' : '')]]} /> : null}
        {pal === 2 && locked2 ? <Panel><T>{P.verrou2}</T></Panel> : list.length ? list.map((q: any) => <Btn key={q.id} label={q.q} kind={S.asked[p.id + '.' + q.id] ? 'done' : undefined} onPress={() => set({ reply: E.poser(p.id, pal, q.id) })} />) : <Mute>Plus de questions pour l'instant.</Mute>}
        <Sep />
        {ui.panel === 'pres' ? <><H3>Présenter une pièce</H3>{pickList(id => set({ reply: E.presenter(p.id, id), panel: null }))}</> : <Btn kind="red" label="Présenter une pièce du dossier" onPress={() => set({ panel: 'pres' })} />}
      </> };
    }
    case 'cassette': {
      const K = A.cassette, nb = K.segments.filter((x: any) => S.cas[x.id]).length;
      const open = ui.panel && ui.panel.startsWith('seg:') ? +ui.panel.slice(4) : null;
      return { title: 'Le magnétophone', body: <>
        <Scene xml={ART.scene('gendarmerie')} />
        <T>{K.intro}</T>
        <Mute>{`Séquences décodées : ${nb}/${K.segments.length}. Une mauvaise réponse ne coûte rien : réécoutez.`}</Mute>
        {K.segments.map((x: any) => <React.Fragment key={x.id}>
          <Btn label={'Séquence ' + x.id + (S.cas[x.id] ? ' ✓' : '')} kind={S.cas[x.id] ? 'done' : undefined} onPress={() => set({ panel: open === x.id ? null : 'seg:' + x.id, segMsg: null })} />
          {open === x.id ? <Panel>
            <Btn kind="pri" label="▶ Écouter" onPress={() => Sons.segment(x, !!O.voix)} />
            {x.voix ? <Speech>{`Sous-titre : « ${x.voix} »`}</Speech> : null}
            {E.descVisible(O) ? <Panel><Mute>{x.desc}</Mute></Panel> : null}
            {S.cas[x.id] ? <Good>{x.ok}</Good> : <><T style={{ fontWeight: 'bold', marginVertical: 6 }}>{x.q}</T>{x.opts.map((o: string, i: number) => <Btn key={i} label={o} onPress={() => { const m = E.cRep(x.id, i); set(m ? { segMsg: m } : { segMsg: null, panel: null }); }} />)}</>}
            {ui.segMsg ? <Warn>{ui.segMsg}</Warn> : null}
          </Panel> : null}
        </React.Fragment>)}
        {S.indices.I16 ? <Good>Cassette décodée. L'indice est ajouté au dossier.</Good> : null}
      </> };
    }
    case 'coffre': {
      const K = A.coffre;
      if (S.indices.I19) return { title: 'Le coffre', body: <Card I={A.indices.I19} /> };
      return { title: 'Le coffre', body: <>
        <Speech>{K.texte}</Speech>
        <Saisie id="code" numeric placeholder="····" label="Code à quatre chiffres" value={code} onChange={setCode} />
        <Btn kind="pri" label="Essayer ce code" onPress={() => set({ msg: E.coffre(code) })} />
        {ui.msg ? <Warn>{ui.msg}</Warn> : null}
        {hint(K.aide)}
      </> };
    }
    case 'chiffre': {
      const K = A.chiffre;
      if (S.flags.chiffreOK) return { title: 'Le dos de l\'agenda', body: <><Good>{`Message déchiffré : « ${K.clair} ».`}</Good><Mute>Gaspard savait que quelqu'un viendrait fouiller ses affaires.</Mute></> };
      return { title: 'Le dos de l\'agenda', body: <>
        <Speech>{K.texte}</Speech>
        <Panel><T style={{ fontFamily: 'monospace' }}>{K.chiffre}</T></Panel>
        {S.mode !== 'commissaire' ? <Panel>
          <T style={{ fontWeight: 'bold' }}>Roue de décalage</T>
          <Row><Btn label="−" onPress={() => set({ shift: (ui.shift + 25) % 26 })} /><Btn label="+" onPress={() => set({ shift: (ui.shift + 1) % 26 })} /></Row>
          <T>{'Décalage : ' + ui.shift}</T>
          <T style={{ fontFamily: 'monospace' }}>{Engine.decode(K.chiffre, ui.shift)}</T>
        </Panel> : null}
        <Saisie id="clair" placeholder="Message en clair" label="Message déchiffré" value={clair} onChange={setClair} />
        <Btn kind="pri" label="Valider le message" onPress={() => set({ msg: E.chiffre(clair) })} />
        {ui.msg ? <Warn>{ui.msg}</Warn> : null}
        {hint(K.aide)}
      </> };
    }
    case 'photo': {
      const P = A.photoDiff, found: Record<string, boolean> = {};
      P.zones.forEach((z: any) => { found[z.id] = !!S.flags['pz.' + z.id]; });
      const n = P.zones.filter((z: any) => found[z.id]).length;
      return { title: 'Les tirages', body: <>
        <T>{P.intro}</T>
        <Photos found={found} onZone={id => { E.zone(id); refresh(); }} />
        <Mute>{`Différences trouvées : ${n}/${P.zones.length}`}</Mute>
        {P.zones.filter((z: any) => found[z.id]).map((z: any) => <Good key={z.id}>{z.nom + '. ' + z.texte}</Good>)}
        {n === P.zones.length ? <Good>Les trois différences sont relevées.</Good> : null}
      </> };
    }
    case 'aveu': {
      const V = A.aveu;
      return { title: 'L\'aveu', body: <>
        <Who P={A.persos[V.perso]} />
        <T>{V.intro}</T>
        <Mute>{`Énoncés brisés : ${S.aveu.length}/${V.enonces.length}. Trois suffisent. Une mauvaise pièce ne coûte rien.`}</Mute>
        {ui.confMsg ? <Warn>{ui.confMsg}</Warn> : null}
        {V.enonces.map((e: any) => <Panel key={e.id}>
          <Speech>{`« ${e.dit} »`}</Speech>
          {S.aveu.includes(e.id) ? <Good>{e.cede}</Good> : <>
            <Btn kind="red" label="Présenter une pièce" onPress={() => set({ panel: ui.panel === 'av:' + e.id ? null : 'av:' + e.id })} />
            {ui.panel === 'av:' + e.id ? <Panel><T style={{ fontWeight: 'bold' }}>Quelle pièce ?</T>{pickList(id => set({ confMsg: E.avPres(e.id, id), panel: null }))}</Panel> : null}
          </>}
        </Panel>)}
        {has('d:aveuBrise') ? <Good>{V.rompu}</Good> : null}
      </> };
    }
    case 'chrono': {
      const K = A.chrono, vis = E.chVis(), ok = has('d:chronoOK'), manque = K.cartes.length - vis.length;
      return { title: 'La chronologie', body: <>
        <T>{K.intro}</T>
        {manque ? <Panel><Mute>{`Il vous manque ${manque} événement(s) pour reconstituer toute la nuit.`}</Mute></Panel> : null}
        {vis.map(id => { const c = E.card(id); return (
          <Panel key={id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flex: 1 }}><T>{(ok ? c.h + ' · ' : '') + c.texte}</T></View>
            {ok ? null : <View style={{ flexDirection: 'row', gap: 6 }}>
              <Btn label="▲" style={{ minWidth: 48 }} onPress={() => { E.chMove(id, 'up'); set({ msg: null }); }} />
              <Btn label="▼" style={{ minWidth: 48 }} onPress={() => { E.chMove(id, 'down'); set({ msg: null }); }} />
            </View>}
          </Panel>); })}
        {ok ? <Good>Chronologie établie : de 20h46 à 21h10, tout s'enchaîne.</Good> : <Btn kind="pri" label="Valider l'ordre" onPress={() => set({ msg: E.chValider() })} />}
        {ui.msg ? <Warn>{ui.msg}</Warn> : null}
      </> };
    }
    case 'dossier': {
      const t = ui.dossierTab;
      let body: React.ReactNode;
      if (t === 'indices') {
        const ids = E.ownedIds();
        body = <><Mute>{`${ids.length} sur ${A.rangIndices.length} indices.`}</Mute>
          {ids.length ? ids.map(id => <Btn key={id} label={A.indices[id].titre} badge={S.indices[id].lu ? undefined : 'nouveau'} small={A.indices[id].lieu} onPress={() => { E.lire(id); go('indice', { id }); }} />) : <Mute>Rien pour l'instant. Commencez par la cour.</Mute>}</>;
      } else if (t === 'suspects') {
        const sid = ui.suspect, P = A.persos[sid];
        const notes = P.p1.concat(P.p2).filter((q: any) => q.note && S.asked[sid + '.' + q.id]).map((q: any) => q.note);
        const contr = A.contradictions.filter((c: any) => c.perso === sid && hasAll(c.quand));
        const st = S.statut[sid] || 'possible';
        body = <>
          <Tabs on={sid} onPick={k => set({ suspect: k })} items={SUSPECTS.map(s => [s, A.persos[s].nom.replace(/^(Me|Dr) /, '').split(' ')[0]] as [string, string])} />
          <Who P={P} /><Panel><T>{P.pub}</T></Panel>
          <H3>Déclarations</H3>
          {notes.length ? notes.map((n: string, i: number) => <Panel key={i}><T>{`« ${n} »`}</T></Panel>) : <Mute>Pas encore interrogé.</Mute>}
          {contr.map((c: any, i: number) => <Warn key={i}>{'⚠ Contradiction : ' + c.texte}</Warn>)}
          <Btn label={st === 'possible' ? 'Statut : possible' : 'Statut : écarté'} kind={st === 'ecarte' ? 'dim' : undefined} small="Touchez pour changer. C'est votre réflexion, le jeu n'impose rien." onPress={() => { E.statut(sid); refresh(); }} />
        </>;
      } else if (t === 'journal') {
        body = S.journal.length ? S.journal.slice().reverse().map((m, i) => <Panel key={i}><T>{m}</T></Panel>) : <Mute>Le journal se remplit au fil de l'enquête.</Mute>;
      } else {
        const pistes = A.pistes.filter((x: any) => hasAll(x.quand));
        body = pistes.length ? pistes.map((x: any) => <Panel key={x.id}><T>{(hasAll(x.fin) ? '✓ ' : '▸ ') + x.texte}</T></Panel>) : <Mute>Aucune piste pour l'instant.</Mute>;
      }
      return { title: 'Dossier', body: <><Tabs on={t} onPick={k => set({ dossierTab: k })} items={[['indices', 'Indices'], ['suspects', 'Suspects'], ['pistes', 'Pistes'], ['journal', 'Journal']]} />{body}</> };
    }
    case 'indice':
      return { title: 'Indice', body: <Card I={A.indices[p.id]} lieu={A.indices[p.id].lieu} /> };
    case 'deduction':
      return { title: 'Déduction', body: <>
        <Mute>Rattachez à chaque conclusion les indices qui la prouvent. « Vérifier » dit si c'est cohérent, sans donner la solution.</Mute>
        {A.conclusions.map((c: any) => {
          const a = S.attach[c.id] || [], v = ui.verif ? ui.verif[c.id] : null;
          return <Panel key={c.id}>
            <T style={{ color: C.sodium, fontWeight: 'bold' }}>{c.id + '. ' + c.titre}</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 6 }}>
              {a.length ? a.map(id => <Chip key={id} label={A.indices[id].titre} onPress={() => { E.detacher(c.id, id); set({ verif: null }); }} />) : <Mute>Aucun indice rattaché</Mute>}
            </View>
            <Btn label="+ Rattacher un indice" onPress={() => set({ panel: ui.panel === 'att:' + c.id ? null : 'att:' + c.id })} />
            {ui.panel === 'att:' + c.id ? <Panel><T style={{ fontWeight: 'bold' }}>Choisir un indice</T>
              {E.ownedIds().filter(id => !a.includes(id)).map(id => <Btn key={id} label={A.indices[id].titre} small={A.indices[id].lieu} onPress={() => { E.attacher(c.id, id); set({ panel: null, verif: null }); }} />)}
              {E.ownedIds().filter(id => !a.includes(id)).length ? null : <Mute>Plus d'indice à rattacher.</Mute>}
            </Panel> : null}
            {!v ? null : v.s === 'ok' ? <Good>{'✓ Cohérent. ' + c.sens}</Good> : v.s === 'ko' ? <Warn>{'✗ À revoir : ' + v.msg}</Warn> : <Warn>Rien n'est rattaché.</Warn>}
          </Panel>;
        })}
        <Btn kind="pri" label="Vérifier" onPress={() => { const V = E.verifier(); set({ verif: V }); }} />
        <Btn kind="red" label="Passer à l'accusation" onPress={() => { set({ acc: { sus: ui.acc.sus, preuves: E.preuvesEtablies() } }); go('accuser'); }} />
      </> };
    case 'aide': {
      const idle = Date.now() - S.lastNew > 600000;
      const N: [number, string, string][] = [[1, '1 · Cap', 'Où j\'en suis. Gratuit.'], [2, '2 · Piste', 'Le lieu ou le suspect à revoir. ' + E.coutAide(2) + ' point(s).'], [3, '3 · Coup de pouce', 'Le prochain élément à examiner. ' + E.coutAide(3) + ' point(s).'], [4, '4 · Révélation', 'La conclusion et ses indices, sans le coupable. ' + E.coutAide(4) + ' point(s).']];
      return { title: 'Aide', body: <>
        <Mute>L'aide ne bloque jamais l'enquête et ne change jamais la fin. Elle ne compte que pour le rang final.</Mute>
        {N.map(([n, l, sm]) => E.aideOk(n) ? <Btn key={n} label={l} small={sm} onPress={() => set({ aideMsg: E.aideN(n) })} /> : <Btn key={n} disabled label={l} small="Indisponible en mode Commissaire" />)}
        {ui.aideMsg ? <Speech>{ui.aideMsg}</Speech> : idle ? <Mute>Vous tournez en rond ? Commencez par le niveau 1.</Mute> : null}
        <Mute>{'Points d\'aide utilisés : ' + S.aide.cout}</Mute>
      </> };
    }
    case 'accuser': {
      const sus = ui.acc.sus;
      return { title: 'Accusation', body: <>
        <H2>Qui accusez-vous ?</H2>
        {SUSPECTS.map(s => <Btn key={s} kind={sus === s ? 'pri' : undefined} label={A.persos[s].nom} small={A.persos[s].role} onPress={() => set({ acc: { ...ui.acc, sus: s } })} />)}
        <H3>Vos preuves</H3>
        {A.conclusions.map((c: any) => { const ok = E.etablie(c), on = ui.acc.preuves.includes(c.id); return (
          <Btn key={c.id} disabled={!ok} label={(on ? '☑ ' : '☐ ') + c.id + '. ' + c.titre} small={ok ? 'Établie dans votre tableau' : 'Non établie dans votre tableau'}
            onPress={() => set({ acc: { ...ui.acc, preuves: on ? ui.acc.preuves.filter(x => x !== c.id) : ui.acc.preuves.concat(c.id) } })} />); })}
        <Btn kind={sus ? 'red' : 'dim'} label={sus ? 'Accuser ' + A.persos[sus].nom : 'Choisissez un suspect'} onPress={() => { if (!sus) return; E.accuser(sus, ui.acc.preuves); root('fin'); }} />
      </> };
    }
    case 'confront': {
      if (!has('d:acte4')) return { title: 'Confrontation', body: <Panel><T>Pas encore. Brisez l'aveu de Solange, reconstituez la chronologie, puis réunissez le lambeau de gant, le manteau n°14 et le carnet du photographe.</T></Panel> };
      const all = A.confrontation.every((c: any) => S.conf.includes(c.id));
      return { title: 'Confrontation', body: <>
        <Who P={A.persos.odile} />
        <Mute>{`Salle des fêtes, à l'aube. Brisez ses affirmations avec la bonne pièce. Une mauvaise pièce ne coûte rien. Brisées : ${S.conf.length}/4.`}</Mute>
        {ui.confMsg ? <Warn>{ui.confMsg}</Warn> : null}
        {A.confrontation.map((c: any) => <Panel key={c.id}>
          <Speech>{`« ${c.dit} »`}</Speech>
          {S.conf.includes(c.id) ? <Good>{c.cede}</Good> : <>
            <Btn kind="red" label="Présenter une pièce" onPress={() => set({ panel: ui.panel === 'conf:' + c.id ? null : 'conf:' + c.id })} />
            {ui.panel === 'conf:' + c.id ? <Panel><T style={{ fontWeight: 'bold' }}>Quelle pièce ?</T>{pickList(id => set({ confMsg: E.confPres(c.id, id), panel: null }))}</Panel> : null}
          </>}
        </Panel>)}
        {all ? <><Good>Odile Quéré a cessé de répondre.</Good><Btn kind="pri" label="Passer à l'accusation" onPress={() => { set({ acc: { sus: 'odile', preuves: E.preuvesEtablies() } }); go('accuser'); }} /></> : null}
      </> };
    }
    case 'fin': {
      const f = S.fin!, F = A.fins[f.code], code = f.code === 'Bsol' ? 'B' : f.code;
      return { title: 'Fin', body: <>
        <View style={{ alignItems: 'center', paddingVertical: 16 }}>
          <T mute style={{ letterSpacing: 3 }}>{'FIN ' + code}</T>
          <T style={{ fontSize: 25, lineHeight: 32, color: C.sodium, textAlign: 'center', marginTop: 8 }}>{F.titre}</T>
        </View>
        {F.paras.map((t: string, i: number) => <Speech key={i}>{t.replace('{nom}', f.sus ? A.persos[f.sus].nom : '')}</Speech>)}
        {f.code === 'A' && S.flags['d:aveuBrise'] && F.aveu ? <Speech>{F.aveu}</Speech> : null}
        {f.code === 'A' ? <>
          <T style={{ fontSize: 34, color: C.sodium, textAlign: 'center', letterSpacing: 6, marginTop: 10 }}>{'★'.repeat(f.rang) + '☆'.repeat(3 - f.rang)}</T>
          <Mute center>{`Rang ${f.rang}/3 · Niveau ${A.modes[S.mode].nom} · Points d'aide : ${S.aide.cout}`}</Mute>
        </> : null}
        {f.code === 'A' && f.perspicace ? <Mute center>★ Mention Perspicace : coffre, message codé et tirages résolus.</Mute> : null}
        {f.code !== 'A' ? <Btn kind="pri" label="Rouvrir le dossier" onPress={() => { E.rouvrir(); root('hub'); }} /> : null}
        <Btn label="Partager mon résultat" onPress={() => { Share.share({ message: E.partage() }).catch(() => {}); }} />
        <Btn label="Recommencer" onPress={() => confirmer('Recommencer une nouvelle enquête ?', () => { E.nouvelle(); g.resetUI(); root('mode'); })} />
        <Btn label="Menu principal" onPress={() => root('accueil')} />
      </> };
    }
    case 'carte': {
      const vus = A.carnet.filter((k: any) => !k.lieu || S.flags['v:' + k.lieu]).length;
      const P = [['Le Rosmeur', 'Le vieux port de pêche, au pied des ruelles en pente.'], ['Le Port-Rhu', 'La ria. Au fond, l\'usine Morvan (fiction).'], ['Tréboul', 'L\'autre rive : villas et plage des Sables Blancs. L\'étude de Me Quéré s\'y trouve.'], ['L\'île Tristan', 'Face au Port-Rhu. On la devine depuis la cour de l\'usine.']];
      return { title: 'Douarnenez', body: <>
        <Scene xml={ART.carte()} ratio={360 / 210} />
        <Btn kind="pri" label="Balade sur place" small="Un parcours à pied, de port en port" onPress={() => go('balade')} />
        {P.map(x => <Panel key={x[0]}><T style={{ color: C.sodium }}>{x[0]}</T><T>{x[1]}</T></Panel>)}
        <H3>{`Carnet de Douarnenez (${vus}/${A.carnet.length})`}</H3>
        {A.carnet.map((k: any) => (!k.lieu || S.flags['v:' + k.lieu])
          ? <Panel key={k.id}><T style={{ color: C.sodium }}>{k.titre}</T><T>{k.texte}</T></Panel>
          : <Panel key={k.id}><Mute>{'🔒 À découvrir en visitant : ' + A.lieux.find((l: any) => l.id === k.lieu).nom}</Mute></Panel>)}
        <Mute>Ces notes reprennent des faits locaux publics ; l'usine Morvan et l'affaire sont fictives.</Mute>
      </> };
    }
    case 'balade': {
      const B = A.balade;
      return { title: 'Balade', body: <>
        <T>{B.intro}</T>
        {B.etapes.map((e: any, i: number) => <Panel key={i}>
          <T style={{ color: C.sodium }}>{`${i + 1}. ${e.nom}`}</T>
          <T><T mute>Dans le jeu : </T>{e.jeu}</T>
          <T><T mute>Sur place : </T>{e.sur}</T>
          <Btn label="Voir sur une carte" small="Connexion requise" onPress={() => Linking.openURL('https://www.openstreetmap.org/search?query=' + encodeURIComponent(e.q)).catch(() => {})} />
        </Panel>)}
        <Mute>{B.conseil}</Mute>
        <Mute>Respectez les lieux et les riverains. Le jeu n'est pas une activité de plein air : jouez à l'arrêt, en sécurité.</Mute>
      </> };
    }
    case 'options': {
      const o = (k: keyof typeof O, l: string, small?: string) => <Btn key={k} label={l + ' : ' + (O[k] ? 'oui' : 'non')} small={small} onPress={() => g.setOpt(k)} />;
      const dansPartie = g.pile.length > 0 && g.pile[g.pile.length - 1].view !== 'accueil';
      return { title: 'Options', body: <>
        {o('big', 'Texte agrandi')}{o('sound', 'Sons')}
        {o('voix', 'Voix de la cassette', 'Lecture vocale par le téléphone. Les sous-titres restent toujours affichés.')}
        {o('desc', 'Description sonore (texte)', 'Décrit chaque son de la cassette par écrit.')}
        {o('descAcc', 'Description sonore en mode Commissaire', 'Accessibilité : affiche la description même en mode Commissaire.')}
        {o('amb', 'Ambiance sonore (mer, mouettes)', 'Coupée pendant la cassette.')}
        <Btn label="Revoir le tutoriel" onPress={() => go('tuto')} />
        {g.sauvegarde ? <Btn kind="red" label="Effacer la sauvegarde" onPress={() => confirmer('Effacer définitivement la sauvegarde ?', g.effacer)} /> : null}
        <Btn label="Crédits" onPress={() => go('credits')} />
        {dansPartie ? <Btn kind="pri" label="Retour à l'enquête" onPress={() => root('hub')} /> : null}
        <Btn label="Menu principal" onPress={() => root('accueil')} />
        <Mute>{`Version du jeu ${A.version} · sauvegarde ENG1/${A.id}`}</Mute>
      </> };
    }
    case 'credits':
      return { title: 'Crédits', body: <>
        <Panel><T>{A.credits}</T></Panel>
        <Panel><T style={{ fontWeight: 'bold' }}>Licences</T><T>Textes, illustrations et sons : créés pour ce jeu (tous droits réservés à l'auteur). Voix : moteur de synthèse vocale du téléphone. Aucune connexion requise pour jouer.</T></Panel>
      </> };
    default:
      return { title: '', body: <Btn label="Menu principal" onPress={() => root('accueil')} /> };
  }
}
