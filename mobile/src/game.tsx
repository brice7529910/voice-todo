/* État de l'appli : moteur, navigation (pile d'écrans comme le jeu web), options, toasts, sauvegarde. */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Engine, KEY, OKEY, Options, defaultOptions, parseSave, Verif } from './core/engine';
import * as Sons from './audio/sons';

export type Vue = { view: string; params: any };
export type UIState = {
  panel: string | null; reply: { pid: string; text: string; q: string } | null; verif: Verif | null; aideMsg: string | null;
  acc: { sus: string | null; preuves: string[] }; msg: string | null; segMsg: string | null; confMsg: string | null;
  palier: Record<string, number>; dossierTab: string; suspect: string; shift: number;
};
const freshUI = (): UIState => ({ panel: null, reply: null, verif: null, aideMsg: null, acc: { sus: null, preuves: [] }, msg: null, segMsg: null, confMsg: null, palier: {}, dossierTab: 'indices', suspect: 'solange', shift: 0 });

type Ctx = {
  E: Engine; O: Options; ui: UIState; vue: Vue; pile: Vue[]; toast: string | null; pret: boolean; sauvegarde: string | null;
  go: (view: string, params?: any) => void; back: () => void; root: (view: string) => void;
  set: (p: Partial<UIState>) => void; refresh: () => void; resetUI: () => void;
  setOpt: (k: keyof Options) => void; fermerToast: () => void; reprendre: () => void; effacer: () => void;
};
const G = createContext<Ctx>(null as any);
export const useGame = () => useContext(G);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [, tick] = useState(0);
  const refresh = useCallback(() => tick(n => n + 1), []);
  const [toast, setToast] = useState<string | null>(null);
  const [O, setO] = useState<Options>(defaultOptions());
  const Oref = useRef(O); Oref.current = O;
  const [pret, setPret] = useState(false);
  const [sauvegarde, setSauvegarde] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const E = useMemo(() => new Engine({
    toast: m => { setToast(m); if (toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 5200); },
    son: s => Sons.effet(s, !!Oref.current.sound),
    save: S => { const j = JSON.stringify(S); setSauvegarde(j); AsyncStorage.setItem(KEY, j).catch(() => {}); },
  }), []);

  const nav = useRef<{ vue: Vue; pile: Vue[] }>({ vue: { view: 'accueil', params: {} }, pile: [] });
  const uiRef = useRef<UIState>(freshUI());
  const set = useCallback((p: Partial<UIState>) => { Object.assign(uiRef.current, p); refresh(); }, [refresh]);
  const clear = () => { uiRef.current.panel = null; uiRef.current.reply = null; };
  const go = useCallback((view: string, params: any = {}) => { clear(); nav.current.pile.push(nav.current.vue); nav.current.vue = { view, params }; refresh(); }, [refresh]);
  const back = useCallback(() => { clear(); nav.current.vue = nav.current.pile.pop() || { view: 'hub', params: {} }; refresh(); }, [refresh]);
  const root = useCallback((view: string) => { clear(); nav.current.pile = []; nav.current.vue = { view, params: {} }; refresh(); }, [refresh]);
  const vue = nav.current.vue, pile = nav.current.pile;
  const resetUI = useCallback(() => { uiRef.current = freshUI(); }, []);

  useEffect(() => {
    (async () => {
      try {
        const [s, o] = await Promise.all([AsyncStorage.getItem(KEY), AsyncStorage.getItem(OKEY)]);
        if (o) setO(Object.assign(defaultOptions(), JSON.parse(o)));
        const S = parseSave(s); if (S) { E.charger(S); setSauvegarde(s); }
      } catch {}
      setPret(true);
    })();
  }, [E]);

  useEffect(() => { Sons.ambiance(!!O.amb && pret); }, [O.amb, pret]);
  useEffect(() => { Sons.ambianceNiveau(vue.view === 'cassette' ? 0 : 1); if (vue.view !== 'cassette') Sons.taire(); }, [vue.view]);

  const setOpt = useCallback((k: keyof Options) => {
    setO(o => { const n = { ...o, [k]: o[k] ? 0 : 1 }; AsyncStorage.setItem(OKEY, JSON.stringify(n)).catch(() => {}); return n; });
  }, []);
  const reprendre = useCallback(() => {
    const S = parseSave(sauvegarde); if (S) { E.charger(S); resetUI(); root(S.fin ? 'fin' : 'hub'); } else root('briefing');
  }, [E, sauvegarde, root, resetUI]);
  const effacer = useCallback(() => { AsyncStorage.removeItem(KEY).catch(() => {}); setSauvegarde(null); E.charger(parseSave(null) || (new Engine()).S); refresh(); }, [E, refresh]);

  /* Accès de test (navigateur uniquement) : utilisé par tests/web-smoke.js. */
  if (Platform.OS === 'web') (globalThis as any).__RN = { E, go, root, refresh, set };

  const value: Ctx = { E, O, ui: uiRef.current, vue, pile, toast, pret, sauvegarde, go, back, root, set, refresh, resetUI, setOpt, fermerToast: () => setToast(null), reprendre, effacer };
  return <G.Provider value={value}>{children}</G.Provider>;
}
