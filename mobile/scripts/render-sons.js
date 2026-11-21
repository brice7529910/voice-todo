// Sons de l'appli, 100 % synthétisés (aucun fichier tiers), rendus en WAV via OfflineAudioContext (Chromium/Playwright).
// v2 : sons « bruités » réalistes (couches, résonances, réverbération) au lieu de bips.
// Usage : node scripts/render-sons.js  → mobile/assets/sons/*.wav
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
    const RATE = 32000;
    let seed = 1987; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const R = (a, b) => a + (b - a) * rnd();

    async function render(dur, fn, opts = {}) {
      const c = new OfflineAudioContext(1, Math.ceil(RATE * dur), RATE);
      const master = c.createDynamicsCompressor(); master.threshold.value = -14; master.ratio.value = 3; master.attack.value = .003; master.release.value = .2;
      master.connect(c.destination);
      const dry = c.createGain(); dry.gain.value = 1 - (opts.wet || 0) * .5; dry.connect(master);
      let wetIn = null;
      if (opts.wet) { // réverbération : réponse impulsionnelle synthétique (bruit à décroissance exponentielle, filtrée)
        const len = Math.ceil(RATE * (opts.rt || 1.6)), ir = c.createBuffer(1, len, RATE), d = ir.getChannelData(0);
        let lp = 0; const k = opts.dark ? .25 : .55;
        for (let i = 0; i < len; i++) { lp += k * ((rnd() * 2 - 1) - lp); d[i] = lp * Math.pow(1 - i / len, opts.rtCurve || 3); }
        const cv = c.createConvolver(); cv.buffer = ir; const wg = c.createGain(); wg.gain.value = opts.wet;
        cv.connect(wg); wg.connect(master); wetIn = c.createGain(); wetIn.connect(cv);
      }
      const out = c.createGain(); out.connect(dry); if (wetIn) out.connect(wetIn);
      const noise = (d) => { const n = Math.max(1, Math.ceil(RATE * d)), b = c.createBuffer(1, n, RATE), x = b.getChannelData(0); for (let i = 0; i < n; i++) x[i] = rnd() * 2 - 1; const s = c.createBufferSource(); s.buffer = b; return s; };
      const env = (node, t, a, peak, dec, shape) => { const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); if (shape === 'lin') g.gain.linearRampToValueAtTime(0, t + a + dec); else g.gain.setTargetAtTime(0, t + a, dec / 4); node.connect(g); return g; };
      const filt = (node, type, f, q) => { const b = c.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; node.connect(b); return b; };
      // partiel sinusoïdal avec enveloppe percussive
      const partial = (dest, t, f, amp, dec, glide) => { const o = c.createOscillator(); o.frequency.setValueAtTime(f, t); if (glide) o.frequency.exponentialRampToValueAtTime(f * glide, t + dec); const g = env(o, t, .004, amp, dec); g.connect(dest); o.start(t); o.stop(t + dec * 1.6 + .05); };
      // bruit filtré percussif
      const burst = (dest, t, d, amp, type, f, q) => { const s = noise(d + .05); const fl = filt(s, type, f, q); const g = env(fl, t, .002, amp, d); g.connect(dest); s.start(t); s.stop(t + d + .05); };
      // marimba douce (fondamentale + harmonique 4 + 10, attaque mallet)
      const marimba = (dest, t, f, amp) => { partial(dest, t, f, amp, .9); partial(dest, t, f * 3.99, amp * .25, .25); partial(dest, t, f * 9.9, amp * .06, .08); burst(dest, t, .015, amp * .15, 'bandpass', f * 2, 1); };
      fn({ c, out, noise, env, filt, partial, burst, marimba });
      const b = await c.startRendering(); return Array.from(b.getChannelData(0));
    }
    const S = {};
    const N = { mi5: 659.3, si5: 987.8, la4: 440, do5: 523.3, mi4: 329.6, sol4: 392, re5: 587.3, la3: 220, re3: 146.8, fa3: 174.6, la2: 110 };

    /* --- interface : marimba feutrée + papier, plus de bips --- */
    S.indice = await render(1.4, h => { // feuille posée + deux notes montantes
      h.burst(h.out, 0, .09, .25, 'bandpass', 2500, .7); h.burst(h.out, .03, .12, .12, 'highpass', 5000);
      h.marimba(h.out, .06, N.mi5, .35); h.marimba(h.out, .18, N.si5, .3);
    }, { wet: .25, rt: 1.1 });
    S.ok = await render(1, h => h.marimba(h.out, .01, N.la4 * 1.5, .4), { wet: .2, rt: .9 });
    S.succes = await render(1.6, h => [N.do5, N.mi5, 784].forEach((f, i) => h.marimba(h.out, .01 + i * .11, f, .32)), { wet: .3, rt: 1.2 });
    S.verif = await render(.5, h => { // tampon encreur : choc sourd + claquement
      h.partial(h.out, .01, 160, .5, .12, .6); h.burst(h.out, .01, .05, .5, 'bandpass', 1800, 1.2); h.burst(h.out, .03, .03, .2, 'highpass', 4000);
    }, { wet: .15, rt: .5 });
    S.debloc = await render(3.2, h => { // accord grave de piano, mineur, qui s'ouvre
      [N.re3, N.fa3, N.la3, N.re5 / 2].forEach((f, i) => { const t = .02 + i * .06; [1, 2, 3, 4.02].forEach((m, k) => h.partial(h.out, t, f * m, .22 / (k + 1) / (k + 1), 2.4 - k * .4)); h.burst(h.out, t, .02, .05, 'bandpass', f * 6, 1); });
    }, { wet: .45, rt: 2.4, dark: true });
    S.rebond = await render(3.5, h => { // coup de théâtre : frappe sourde + nappe dissonante qui monte
      h.partial(h.out, .01, 70, .7, .8, .7); h.burst(h.out, .01, .2, .3, 'lowpass', 300);
      [110, 116.5, 164.8].forEach(f => { const o = h.c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; const lp = h.filt(o, 'lowpass', 500, 2); const g = h.c.createGain(); g.gain.setValueAtTime(0, .05); g.gain.linearRampToValueAtTime(.07, 1.6); g.gain.linearRampToValueAtTime(0, 3.2); lp.connect(g); g.connect(h.out); o.start(.05); o.stop(3.3); });
    }, { wet: .5, rt: 2.6, dark: true });
    S.finA = await render(5, h => { // résolution : accord majeur large + cloche claire
      [N.la2, 164.8, N.la3, 277.2, 329.6].forEach((f, i) => { const o = h.c.createOscillator(); o.type = 'triangle'; o.frequency.value = f; const g = h.c.createGain(); g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(.09, .6 + i * .05); g.gain.setTargetAtTime(0, 2.4, .7); o.connect(g); g.connect(h.out); o.start(0); o.stop(5); });
      [1, 2.76, 5.4].forEach((m, k) => h.partial(h.out, .3, 880 * m, .18 / (k + 1), 3 - k));
    }, { wet: .5, rt: 2.8 });
    S.finKO = await render(4.5, h => { // échec : frappe grave + accord mineur qui retombe
      h.partial(h.out, .02, 82, .7, 1.4, .8); h.burst(h.out, .02, .3, .25, 'lowpass', 250);
      [N.la2, 130.8, 164.8].forEach(f => { const o = h.c.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(f, .1); o.frequency.linearRampToValueAtTime(f * .94, 3.5); const g = h.c.createGain(); g.gain.setValueAtTime(0, .1); g.gain.linearRampToValueAtTime(.1, .7); g.gain.setTargetAtTime(0, 2, .6); o.connect(g); g.connect(h.out); o.start(.1); o.stop(4.5); });
    }, { wet: .45, rt: 2.4, dark: true });

    /* --- cassette : bruitage --- */
    // talon sur une marche d'escalier métallique : claquement + résonance inharmonique de la tôle
    const marche = (h, t, amp, desc) => {
      h.burst(h.out, t, .025, amp * .9, 'bandpass', R(2600, 3400), 1.5);
      h.burst(h.out, t + .004, .06, amp * .5, 'lowpass', 600);
      [R(380, 420), R(930, 1010), R(1690, 1780), R(2650, 2800)].forEach((f, k) => h.partial(h.out, t, f, amp * [.18, .12, .08, .05][k], desc ? .22 : .35));
    };
    const souffle = h => { const s = h.noise(30); const f = h.filt(s, 'bandpass', 1800, .4); const g = h.c.createGain(); g.gain.value = .004; f.connect(g); g.connect(h.out); s.start(0); }; // souffle de micro-cassette (discret)
    S.pas = await render(7, h => { souffle(h); let t = .15, dt = .55; for (let i = 0; i < 12; i++) { marche(h, t, .3 + i * .045); t += dt + R(-.03, .03); dt = Math.max(.34, dt - .018); } }, { wet: .35, rt: 1.4 });
    S.coup = await render(3, h => { souffle(h); // choc mat sur le crâne, puis le corps qui heurte la tôle
      const t = 1.75; h.partial(h.out, t, 95, .9, .35, .45); h.burst(h.out, t, .12, .6, 'lowpass', 420); h.burst(h.out, t, .02, .3, 'bandpass', 1200, 1);
      h.partial(h.out, t + .42, 60, .5, .5, .7); [210, 530, 890].forEach(f => h.partial(h.out, t + .42, f, .12, .6)); h.burst(h.out, t + .42, .2, .25, 'lowpass', 900);
    }, { wet: .35, rt: 1.4 });
    S.descente = await render(4.2, h => { souffle(h); let t = .1;
      for (let i = 0; i < 6; i++) { marche(h, t, .4, true); t += R(.2, .26); }
      t += .35; for (let i = 0; i < 10; i++) { h.burst(h.out, t + i * .055 + R(0, .01), .006, .25, 'highpass', 5500); h.partial(h.out, t + i * .055, R(3800, 4300), .04, .02); } // couronne de montre tirée, cran par cran
      t += .9; h.burst(h.out, t, .04, .5, 'highpass', 3000); // verre qui casse : impact + éclats tintants
      for (let i = 0; i < 26; i++) { const tt = t + R(0, .35) * R(0, 1); h.partial(h.out, tt, R(2500, 7500), R(.03, .09), R(.05, .25)); }
      h.burst(h.out, t, .3, .15, 'bandpass', 6000, .8);
    }, { wet: .3, rt: 1.3 });
    S.cloches = await render(14, h => { // cloche d'église lointaine : partiels réels d'une cloche (hum, prime, tierce, quinte, nominal…)
      const P = [[.5, .5, 7], [1, .45, 5], [1.19, .3, 4], [1.5, .18, 3], [2, .22, 3], [2.5, .1, 2], [3, .08, 1.6], [4.2, .05, 1]];
      const lp = h.c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200; lp.connect(h.out);
      for (let i = 0; i < 9; i++) { const t = .1 + i * 1.35; P.forEach(([m, a, d]) => { h.partial(lp, t, 392 * m * (1 + R(-.002, .002)), a * .35, d); h.partial(lp, t, 392 * m * 1.003, a * .12, d); }); h.burst(lp, t, .03, .15, 'bandpass', 1500, 1); }
    }, { wet: .55, rt: 3, dark: true });
    S.pluie = await render(4, h => { // pluie : nappe + milliers de gouttes
      const s = h.noise(4); const f0 = h.filt(s, 'bandpass', 2200, .7); const f = h.filt(f0, 'lowpass', 5000); const g = h.env(f, 0, 1, .09, 3, 'lin'); g.connect(h.out); s.start(0);
      const s2 = h.noise(4); const f2 = h.filt(s2, 'lowpass', 700); const g2 = h.env(f2, 0, 1.2, .12, 2.8, 'lin'); g2.connect(h.out); s2.start(0);
      for (let i = 0; i < 900; i++) { const t = R(0, 3.6) * Math.min(1, R(.3, 1.5)); h.burst(h.out, t, R(.003, .012), R(.02, .12), 'bandpass', R(1500, 6000), R(2, 6)); }
    }, { wet: .25, rt: .8 });

    /* --- ambiance --- */
    S.mer = await render(22, h => { // ressac : vagues espacées, grondement bas + écume. Bouclé sur 16 s (queue repliée en tête, côté Node)
      const rumble = h.noise(22); const lf = h.filt(rumble, 'lowpass', 160); const rg = h.c.createGain(); rg.gain.value = .25; lf.connect(rg); rg.connect(h.out); rumble.start(0);
      [0, 4.1, 8.3, 12.2].forEach(t => {
        const s = h.noise(6); const bp = h.c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = .6; bp.frequency.setValueAtTime(400, t); bp.frequency.linearRampToValueAtTime(1800, t + 1.6); bp.frequency.linearRampToValueAtTime(700, t + 4.5);
        s.connect(bp); const g = h.c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.35, t + 1.5); g.gain.linearRampToValueAtTime(.12, t + 2.4); g.gain.linearRampToValueAtTime(0, t + 5.5);
        bp.connect(g); g.connect(h.out); s.start(t);
        const e = h.noise(3); const hp = h.filt(e, 'highpass', 4000); const eg = h.env(hp, t + 1.5, .2, .08, 1.8, 'lin'); eg.connect(h.out); e.start(t + 1.5);
      });
    }, { wet: .3, rt: 2, dark: true });
    S.mouette = await render(2.2, h => { // goéland : cri modulé (FM) en deux temps, lointain
      const cri = (t, f0, d) => { const o = h.c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f0 * .8, t); o.frequency.linearRampToValueAtTime(f0, t + .06); o.frequency.exponentialRampToValueAtTime(f0 * .62, t + d);
        const vib = h.c.createOscillator(), vg = h.c.createGain(); vib.frequency.value = 28; vg.gain.value = f0 * .04; vib.connect(vg); vg.connect(o.frequency);
        const bp = h.filt(o, 'bandpass', 2400, 1.2); const g = h.env(bp, t, .03, .22, d, 'lin'); g.connect(h.out); o.start(t); o.stop(t + d + .1); vib.start(t); vib.stop(t + d + .1); };
      cri(.05, 1500, .42); cri(.55, 1650, .3); cri(.95, 1550, .5);
    }, { wet: .5, rt: 1.6 });
    return { RATE, S };
  });
  // boucle sans couture : la partie après 16 s est rajoutée au début (overlap-add), le grondement est fondu enchaîné
  { const v = res.S.mer, L = res.RATE * 16, x = v.slice(0, L); for (let i = L; i < v.length; i++) x[i - L] += v[i]; res.S.mer = x; }
  for (const [k, v] of Object.entries(res.S)) {
    const peak = v.reduce((m, x) => Math.max(m, Math.abs(x)), 0) || 1, g = .89 / peak; // normalisé à -1 dB
    const fade = k === 'mer' ? 1 : Math.floor(res.RATE * .01); const s = v.map((x, i) => x * g * Math.min(1, (v.length - i) / fade));
    fs.writeFileSync(path.join(out, k + '.wav'), wav(s, res.RATE));
  }
  console.log('sons rendus :', Object.keys(res.S).join(', '));
  await br.close();
})();
