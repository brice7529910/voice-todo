/* Sons : fichiers WAV rendus depuis la synthèse du jeu web (scripts/render-sons.js), voix native du téléphone. */
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import type { Son } from '../core/engine';

const SRC: Record<string, number> = {
  indice: require('../../assets/sons/indice.wav'), debloc: require('../../assets/sons/debloc.wav'), rebond: require('../../assets/sons/rebond.wav'),
  ok: require('../../assets/sons/ok.wav'), succes: require('../../assets/sons/succes.wav'), verif: require('../../assets/sons/verif.wav'),
  finA: require('../../assets/sons/finA.wav'), finKO: require('../../assets/sons/finKO.wav'),
  pas: require('../../assets/sons/pas.wav'), coup: require('../../assets/sons/coup.wav'), descente: require('../../assets/sons/descente.wav'),
  cloches: require('../../assets/sons/cloches.wav'), pluie: require('../../assets/sons/pluie.wav'),
  mer: require('../../assets/sons/mer.wav'), mouette: require('../../assets/sons/mouette.wav'),
};
const players: Record<string, AudioPlayer> = {};
let pret = false;
async function init() {
  if (pret) return; pret = true;
  try { await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false, interruptionMode: 'mixWithOthers' } as any); } catch {}
}
function jouerFichier(nom: string, volume = 1) {
  try {
    init();
    const p = players[nom] || (players[nom] = createAudioPlayer(SRC[nom]));
    p.volume = volume; p.seekTo(0); p.play();
  } catch {}
}

export function effet(s: Son, actif: boolean) { if (actif) jouerFichier(s, 0.8); }

export function parler(txt: string, pitch = 1, actif = true) {
  if (!actif || !txt) return;
  try { Speech.stop(); Speech.speak(txt, { language: 'fr-FR', rate: 0.95, pitch }); } catch {}
}
export function taire() { try { Speech.stop(); } catch {} }

/** Segment de la cassette (mêmes sons que le jeu web). */
export function segment(seg: any, voix: boolean) {
  if (seg.son === 'voix') parler(seg.voix, 0.8, voix);
  else if (seg.son === 'coup') { parler(seg.voix, 0.7, voix); jouerFichier('coup'); }
  else if (SRC[seg.son]) jouerFichier(seg.son);
}

/* Ambiance : mer en boucle + mouettes aléatoires. */
let mer: AudioPlayer | null = null, timer: ReturnType<typeof setTimeout> | null = null, niveau = 1;
function mouette() { if (!mer) return; if (niveau > 0) jouerFichier('mouette', 0.5 * niveau); timer = setTimeout(mouette, 8000 + Math.random() * 9000); }
export function ambiance(on: boolean) {
  if (on && !mer) {
    try { init(); mer = createAudioPlayer(SRC.mer); mer.loop = true; mer.volume = 0.6 * niveau; mer.play(); timer = setTimeout(mouette, 4000); } catch { mer = null; }
  } else if (!on && mer) {
    try { mer.pause(); mer.remove(); } catch {}
    mer = null; if (timer) clearTimeout(timer); timer = null;
  }
}
/** Baisse l'ambiance pendant la cassette (0) et la remet ensuite (1). */
export function ambianceNiveau(v: number) { niveau = v; if (mer) try { mer.volume = 0.6 * v; } catch {} }
