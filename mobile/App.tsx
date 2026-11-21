import React, { useEffect, useRef } from 'react';
import { AppState, BackHandler, Pressable, ScrollView, ScrollViewInstance, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameProvider, useGame } from './src/game';
import { useVue } from './src/screens';
import { C, Scale, SERIF } from './src/ui/kit';
import * as Sons from './src/audio/sons';

function Ib({ label, onPress, pulse, a11y }: { label: string; onPress: () => void; pulse?: boolean; a11y?: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={a11y || label}
      style={({ pressed }) => ({ minWidth: 44, minHeight: 44, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: pulse ? C.sodium : '#ffffff22', backgroundColor: pressed ? '#ffffff1a' : '#ffffff0a', alignItems: 'center', justifyContent: 'center' })}>
      <Text style={{ color: pulse ? C.sodium : C.txt, fontSize: 15, fontFamily: SERIF }}>{label}</Text>
    </Pressable>
  );
}

function Ecran() {
  const g = useGame();
  const { E, O, vue, pile, back, root, go, set } = g;
  const v = useVue();
  const scroll = useRef<ScrollViewInstance>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => { scroll.current?.scrollTo({ y: 0, animated: false }); }, [vue]);

  /* Bouton retour Android : remonte la pile d'écrans, sinon laisse Android mettre l'appli en arrière-plan. */
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (pile.length) { back(); return true; }
      if (vue.view !== 'accueil' && vue.view !== 'hub') { root('hub'); return true; }
      return false;
    });
    return () => sub.remove();
  }, [pile.length, vue.view, back, root]);

  /* Arrière-plan : coupe voix et ambiance, relance l'ambiance au retour. */
  useEffect(() => {
    const sub = AppState.addEventListener('change', st => {
      if (st !== 'active') { Sons.taire(); Sons.ambiance(false); } else Sons.ambiance(!!O.amb);
    });
    return () => sub.remove();
  }, [O.amb]);

  if (!g.pret) return <View style={{ flex: 1, backgroundColor: C.nuit }} />;
  const w = vue.view, inGame = !['accueil', 'briefing'].includes(w);
  const idle = Date.now() - E.S.lastNew > 600000;
  const left = w === 'accueil' ? <View style={{ minWidth: 44 }} />
    : w === 'briefing' ? <Ib label="☰" a11y="Menu" onPress={() => root('accueil')} />
    : w === 'hub' ? <Ib label="☰" a11y="Options" onPress={() => go('options')} />
    : <Ib label="←" a11y="Retour" onPress={back} />;

  return (
    <Scale.Provider value={O.big ? 20 / 17 : 1}>
      <View style={{ flex: 1, backgroundColor: C.nuit }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: C.nuit2, borderBottomWidth: 1, borderBottomColor: '#ffffff14' }}>
          {left}
          <Text numberOfLines={1} style={{ flex: 1, textAlign: 'center', color: C.sodium, fontSize: 17, letterSpacing: 0.7, fontFamily: SERIF }}>{v.title}</Text>
          {inGame && w !== 'fin' ? <View style={{ flexDirection: 'row', gap: 6 }}>
            <Ib label="Dossier" onPress={() => go('dossier')} />
            <Ib label="Aide" pulse={idle} onPress={() => go('aide')} />
          </View> : <View style={{ minWidth: 44 }} />}
        </View>
        <ScrollView ref={scroll} contentContainerStyle={{ padding: 14, paddingBottom: 40 + insets.bottom, width: '100%', maxWidth: 560, alignSelf: 'center' }} keyboardShouldPersistTaps="handled">
          {v.body}
        </ScrollView>
        {g.toast ? (
          <Pressable onPress={g.fermerToast} accessibilityRole="alert" accessibilityLiveRegion="polite"
            style={{ position: 'absolute', left: 12, right: 12, bottom: 16 + insets.bottom, backgroundColor: '#000000dd', borderWidth: 1, borderColor: C.sodium, borderRadius: 12, padding: 12 }}>
            <Text style={{ color: C.txt, fontSize: 16, fontFamily: SERIF }}>{g.toast}</Text>
          </Pressable>
        ) : null}
      </View>
    </Scale.Provider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.nuit2 }} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />
        <GameProvider><Ecran /></GameProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
