// Rend en WAV les sons synthétisés du jeu web (même code de synthèse que src/engine.js),
// via OfflineAudioContext dans Chromium (Playwright). Sortie : mobile/assets/sons/*.wav
// Usage : node scripts/render-sons.js   (à relancer seulement si la synthèse change)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const out = path.resolve(__dirname, '..', 'assets', 'sons');
fs.mkdirSync(out, { recursive: true });

function wav(samples, rate) {
  const b = Buffer.alloc(44 + samples.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + samples.length * 2, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((v, i) => b.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(v * 32767))), 44 + i * 2));
  return b;
}

(async () => {
  const br = await chromium.launch(); const page = await br.newPage();
  const res = await page.evaluate(async () => {
    const RATE = 22050;
    const render = async (dur, fn) => {
      const c = new OfflineAudioContext(1, Math.ceil(RATE * dur), RATE);
      const envOsc = (type, f0, f1, t, d, g) => { const o = c.createOscillator(), gn = c.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + d); gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn); gn.connect(c.destination); o.start(t); o.stop(t + d + .02); };
      const noiseBurst = (t, d, g, freq, type) => { const n = Math.max(1, Math.floor(c.sampleRate * d)), buf = c.createBuffer(1, n, c.sampleRate), x = buf.getChannelData(0); for (let i = 0; i < n; i++) x[i] = Math.random() * 2 - 1; const s = c.createBufferSource(); s.buffer = buf; const f = c.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq; const gn = c.createGain(); gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); s.connect(f); f.connect(gn); gn.connect(c.destination); s.start(t); s.stop(t + d); };
      const blip = (f, d) => { const o = c.createOscillator(), g = c.createGain(); o.frequency.value = f; o.type = 'triangle'; g.gain.setValueAtTime(.05 * 4, 0); g.gain.exponentialRampToValueAtTime(.0001, d); o.connect(g); g.connect(c.destination); o.start(0); o.stop(d); };
      fn({ c, envOsc, noiseBurst, blip });
      const b = await c.startRendering(); return Array.from(b.getChannelData(0));
    };
    const heel = (h, t, g) => { h.noiseBurst(t, .05, g, 2200); h.envOsc('square', 1400, 500, t, .04, g * .25); };
    const bell = (h, t) => { h.envOsc('sine', 523, null, t, 1.4, .25); h.envOsc('sine', 1046, null, t, .9, .12); h.envOsc('sine', 1568, null, t, .5, .06); };
    const S = {};
    // effets (mêmes fréquences/durées que blip() du jeu web)
    const B = { indice: [660, .25], debloc: [520, .3], rebond: [330, .3], ok: [600, .25], succes: [700, .3], verif: [440, .2], finA: [784, .5], finKO: [220, .5] };
    for (const k in B) S[k] = await render(B[k][1] + .05, h => h.blip(B[k][0], B[k][1]));
    // cassette
    S.pas = await render(6.5, h => { let t = .05, dt = .5; for (let i = 0; i < 12; i++) { heel(h, t, .35 + i * .04); t += dt; dt = Math.max(.3, dt - .015); } });
    S.coup = await render(2.4, h => { h.envOsc('sine', 110, 35, 1.75, .35, .9); h.noiseBurst(1.75, .15, .4, 200, 'lowpass'); });
    S.descente = await render(3.4, h => { let t = .05; for (let i = 0; i < 5; i++) { heel(h, t, .4); t += .28; } for (let i = 0; i < 9; i++) h.envOsc('square', 2600, 2400, t + i * .06, .02, .08); t += .7; h.noiseBurst(t, .25, .5, 5000, 'highpass'); h.envOsc('triangle', 3200, 1500, t, .12, .15); });
    S.cloches = await render(11.2, h => { for (let i = 0; i < 9; i++) bell(h, .05 + i * 1.15); });
    S.pluie = await render(3.4, h => { h.noiseBurst(.05, 3.2, .35, 3500, 'highpass'); h.noiseBurst(.05, 3.2, .2, 900, 'bandpass'); });
    // ambiance : mer (bruit brun filtré, houle lente) en boucle de 8 s, et une mouette
    S.mer = await render(8, h => {
      const c = h.c, n = c.sampleRate * 8, buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0); let l = 0;
      for (let i = 0; i < n; i++) { l = (l + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; }
      const fade = c.sampleRate * .5; for (let i = 0; i < fade; i++) { const k = i / fade; d[i] = d[i] * k + d[n - fade + i] * (1 - k); }
      const src = c.createBufferSource(); src.buffer = buf; const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420;
      const g = c.createGain(); g.gain.value = .5; const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = .125; lg.gain.value = .22;
      lfo.connect(lg); lg.connect(g.gain); src.connect(f); f.connect(g); g.connect(c.destination); src.start(0); lfo.start(0);
    });
    S.mouette = await render(.7, h => { h.envOsc('sine', 1900, 1250, .05, .28, .2); h.envOsc('sine', 2100, 1400, .4, .22, .17); });
    return { RATE, S };
  });
  for (const [k, v] of Object.entries(res.S)) {
    const peak = v.reduce((m, x) => Math.max(m, Math.abs(x)), 0) || 1, norm = peak > .98 ? .95 / peak : 1;
    fs.writeFileSync(path.join(out, k + '.wav'), wav(v.map(x => x * norm), res.RATE));
  }
  console.log('sons rendus :', Object.keys(res.S).join(', '));
  await br.close();
})();
