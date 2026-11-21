/* Composants d'interface : reprennent la charte du jeu web (src/style.css). */
import React, { createContext, useContext } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import ART from '../shared/art.js';

export const C = {
  fond: '#0a121f', nuit: '#0f1b2d', nuit2: '#16263d', nuit3: '#1f3452', sodium: '#e8a33d', papier: '#f2ead8',
  preuve: '#c0453f', ok: '#5fa37a', txt: '#e9e4d6', mute: '#9fb0c4', trait: '#ffffff22', trait2: '#ffffff14',
};
export const SERIF = 'serif';

/** Échelle de texte (option « Texte agrandi ») : 17 px → 20 px comme sur le web. */
export const Scale = createContext(1);
export const useFs = () => { const k = useContext(Scale); return (n: number) => Math.round(n * k); };

export function T({ style, children, mute, center }: { style?: TextStyle | TextStyle[]; children: React.ReactNode; mute?: boolean; center?: boolean }) {
  const fs = useFs();
  return <Text style={[{ color: mute ? C.mute : C.txt, fontSize: fs(mute ? 15 : 17), lineHeight: fs(mute ? 21 : 25), fontFamily: SERIF }, center && { textAlign: 'center' }, style as any]}>{children}</Text>;
}
export const H2 = ({ children, color }: { children: React.ReactNode; color?: string }) => { const fs = useFs(); return <Text style={{ color: color || C.sodium, fontSize: fs(19), marginTop: 4, marginBottom: 10, fontFamily: SERIF }}>{children}</Text>; };
export const H3 = ({ children }: { children: React.ReactNode }) => { const fs = useFs(); return <Text style={{ color: C.mute, fontSize: fs(15), marginTop: 18, marginBottom: 6, letterSpacing: 1.3, textTransform: 'uppercase', fontFamily: SERIF }}>{children}</Text>; };

type BtnProps = { label: string; small?: string; onPress?: () => void; kind?: 'pri' | 'red' | 'dim' | 'done'; disabled?: boolean; badge?: string | number; testID?: string; style?: ViewStyle };
export function Btn({ label, small, onPress, kind, disabled, badge, style }: BtnProps) {
  const fs = useFs();
  const pri = kind === 'pri';
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label + (small ? '. ' + small : '')} accessibilityState={{ disabled: !!disabled }}
      disabled={disabled} onPress={onPress}
      style={({ pressed }) => [s.btn, pri && s.pri, kind === 'red' && s.red, kind === 'done' && { borderColor: '#5fa37a55' }, (disabled || kind === 'dim') && { opacity: 0.45 }, pressed && !disabled && { opacity: 0.75 }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: pri ? 'center' : 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <Text style={{ flexShrink: 1, color: pri ? '#201505' : C.txt, fontSize: fs(17), fontWeight: pri ? 'bold' : 'normal', textAlign: pri ? 'center' : 'left', fontFamily: SERIF }}>
          {label}{kind === 'done' ? <Text style={{ color: C.ok }}> ✓</Text> : null}
        </Text>
        {badge ? <View style={{ backgroundColor: C.sodium, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 1 }}><Text style={{ color: '#201505', fontSize: fs(12), letterSpacing: 0.5 }}>{badge}</Text></View> : null}
      </View>
      {small ? <Text style={{ color: pri ? '#4a3510' : C.mute, fontSize: fs(14), marginTop: 2, textAlign: pri ? 'center' : 'left', fontFamily: SERIF }}>{small}</Text> : null}
    </Pressable>
  );
}
export const Row = ({ children }: { children: React.ReactNode }) => <View style={{ flexDirection: 'row', gap: 8 }}>{React.Children.map(children, c => <View style={{ flex: 1 }}>{c}</View>)}</View>;
export const Panel = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => <View style={[s.panel, style]}>{children}</View>;
export const Speech = ({ children }: { children: React.ReactNode }) => <View style={s.speech}>{typeof children === 'string' ? <T>{children}</T> : children}</View>;
export const Good = ({ children }: { children: React.ReactNode }) => <View style={[s.note, { borderLeftColor: C.ok, backgroundColor: '#14301f' }]}><T style={{ fontSize: 15 }}>{children}</T></View>;
export const Warn = ({ children }: { children: React.ReactNode }) => <View style={[s.note, { borderLeftColor: C.preuve, backgroundColor: '#3a1a1a' }]}><T style={{ fontSize: 15 }}>{children}</T></View>;
export const Mute = ({ children, center }: { children: React.ReactNode; center?: boolean }) => <T mute center={center} style={{ marginVertical: 6 }}>{children}</T>;
export const Sep = () => <View style={{ height: 1, backgroundColor: C.trait2, marginVertical: 14 }} />;

export function Tabs({ items, on, onPick }: { items: [string, string][]; on: string; onPick: (k: string) => void }) {
  const fs = useFs();
  return (
    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
      {items.map(([k, label]) => (
        <Pressable key={k} accessibilityRole="tab" accessibilityState={{ selected: on === k }} onPress={() => onPick(k)}
          style={[s.tab, on === k && { backgroundColor: C.sodium, borderColor: C.sodium }]}>
          <Text style={{ color: on === k ? '#201505' : C.mute, fontSize: fs(15), fontFamily: SERIF }}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
export const Chip = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={'Retirer ' + label} style={s.chip}>
    <Text style={{ color: C.txt, fontSize: 14, fontFamily: SERIF }}>{label}<Text style={{ color: C.preuve }}> ×</Text></Text>
  </Pressable>
);

/** Illustration SVG du jeu web, à pleine largeur. */
export const Scene = ({ xml, ratio = 360 / 190 }: { xml: string; ratio?: number }) => (
  <View style={s.scene}><View style={{ width: '100%', aspectRatio: ratio }}><SvgXml xml={xml} width="100%" height="100%" /></View></View>
);
export function Who({ P }: { P: any }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 6 }}>
      <View style={s.portrait}><SvgXml xml={ART.portrait(P.look)} width="100%" height="100%" /></View>
      <View style={{ flex: 1 }}><T style={{ fontWeight: 'bold' }}>{P.nom}</T><T mute>{P.role}</T></View>
    </View>
  );
}
export function Card({ I, lieu, stamp }: { I: any; lieu?: string; stamp?: boolean }) {
  const fs = useFs();
  return (
    <View style={s.card}>
      <View style={{ width: 64, height: 64, marginBottom: 6 }}><SvgXml xml={ART.icon(I.ico)} width="100%" height="100%" /></View>
      <Text style={{ color: '#7a1f1a', fontSize: fs(19), marginBottom: 6, fontFamily: SERIF }}>{I.titre}</Text>
      {lieu ? <Text style={{ color: '#6a5f45', fontSize: fs(14), marginBottom: 4, fontFamily: SERIF }}>{lieu}</Text> : null}
      <Text style={{ color: '#2a2418', fontSize: fs(16), lineHeight: fs(23), fontFamily: SERIF }}>{I.texte}</Text>
      {stamp ? <Text style={s.stamp}>INDICE</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  btn: { minHeight: 48, paddingVertical: 12, paddingHorizontal: 15, marginVertical: 5, borderRadius: 14, borderWidth: 1, borderColor: C.trait, backgroundColor: C.nuit3, justifyContent: 'center' },
  pri: { backgroundColor: C.sodium, borderColor: C.sodium },
  red: { backgroundColor: '#5a1f1f', borderColor: '#8a3030' },
  panel: { backgroundColor: C.nuit2, borderWidth: 1, borderColor: C.trait2, borderRadius: 14, padding: 14, marginVertical: 8 },
  speech: { backgroundColor: '#1c2f4a', borderLeftWidth: 4, borderLeftColor: C.sodium, borderRadius: 10, padding: 14, marginVertical: 8 },
  note: { borderLeftWidth: 4, padding: 10, borderRadius: 8, marginVertical: 6 },
  tab: { flexGrow: 1, minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: C.trait, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  chip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 99, backgroundColor: '#ffffff12', borderWidth: 1, borderColor: C.trait, marginRight: 4, marginVertical: 3 },
  scene: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: C.trait2, marginBottom: 10 },
  portrait: { width: 76, height: 76, borderRadius: 38, overflow: 'hidden', borderWidth: 2, borderColor: C.sodium, backgroundColor: '#0b1626' },
  card: { backgroundColor: C.papier, borderRadius: 14, padding: 16, marginVertical: 10 },
  stamp: { alignSelf: 'flex-start', marginTop: 10, borderWidth: 3, borderColor: C.preuve, color: C.preuve, fontWeight: 'bold', letterSpacing: 4, paddingHorizontal: 10, paddingVertical: 2, transform: [{ rotate: '-6deg' }], fontFamily: 'monospace' },
});
