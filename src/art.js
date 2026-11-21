/* ===== ILLUSTRATIONS SVG (créées pour le jeu) ===== */
const ART = (() => {
  const win = (x, y, w = 16, h = 18, o = .55) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e8a33d" opacity="${o}"/>`;
  const head = (a, b) => `<svg viewBox="0 0 360 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><radialGradient id="lum"><stop offset="0" stop-color="#e8a33d" stop-opacity=".7"/><stop offset="1" stop-color="#e8a33d" stop-opacity="0"/></radialGradient></defs><rect width="360" height="190" fill="url(#sky)"/>`;
  const tail = `</svg>`;
  const scenes = {
    cour: () => head('#0a1424', '#1b2f4a') +
      `<path d="M146 126 Q166 104 190 112 Q200 116 208 126Z" fill="#0d1a2a"/><g fill="#e8a33d" opacity=".6"><circle cx="156" cy="128" r="1.2"/><circle cx="170" cy="129" r="1.2"/><circle cx="184" cy="128" r="1.2"/></g>` +
      `<rect x="0" y="62" width="150" height="92" fill="#101c2e"/><rect x="22" y="36" width="14" height="40" fill="#101c2e"/>${win(14, 82)}${win(46, 82)}${win(78, 82)}${win(110, 82)}` +
      `<rect x="205" y="50" width="130" height="104" fill="#142238"/>${win(300, 70)}${win(226, 118, 14, 22, .25)}<rect x="205" y="96" width="62" height="5" fill="#3f5069"/><rect x="231" y="104" width="3" height="48" fill="#2e3d52"/>` +
      `<polyline points="267,101 214,152" stroke="#3f5069" stroke-width="4" fill="none"/>${[0, 1, 2, 3, 4, 5].map(i => `<line x1="${262 - i * 9}" y1="${106 + i * 8}" x2="${252 - i * 9}" y2="${106 + i * 8}" stroke="#3f5069" stroke-width="2"/>`).join('')}` +
      `<rect y="150" width="360" height="40" fill="#0d1726"/><ellipse cx="180" cy="168" rx="170" ry="9" fill="#1a2b44" opacity=".7"/>` +
      `<rect x="106" y="70" width="3" height="84" fill="#26364d"/><ellipse cx="108" cy="72" rx="34" ry="50" fill="url(#lum)"/><circle cx="108" cy="69" r="4" fill="#ffd89a"/>` +
      `<ellipse cx="225" cy="162" rx="26" ry="5" fill="#000" opacity=".45"/><rect x="204" y="156" width="38" height="8" rx="4" fill="#33465f"/><circle cx="201" cy="160" r="5" fill="#33465f"/>` +
      `<path d="M60 176 L300 176" stroke="#e8c23d" stroke-width="2" stroke-dasharray="8 6" opacity=".8"/>` + tail,
    bureau: () => head('#1a1710', '#2a2418') +
      `<rect x="20" y="22" width="90" height="70" fill="#101c2e" stroke="#3a2f1e" stroke-width="4"/><line x1="65" y1="22" x2="65" y2="92" stroke="#3a2f1e" stroke-width="3"/><circle cx="85" cy="40" r="2" fill="#fff" opacity=".6"/>` +
      `<rect x="0" y="140" width="360" height="50" fill="#1d160c"/><rect x="150" y="104" width="170" height="14" fill="#5a3f22"/><rect x="160" y="118" width="12" height="48" fill="#4a3219"/><rect x="298" y="118" width="12" height="48" fill="#4a3219"/>` +
      `<rect x="176" y="80" width="26" height="24" fill="#f2ead8"/><rect x="214" y="92" width="34" height="12" fill="#c8b890"/><path d="M270 104 q8 -30 22 -34" stroke="#c9a24d" stroke-width="4" fill="none"/><ellipse cx="296" cy="70" rx="14" ry="6" fill="#c9a24d"/><ellipse cx="296" cy="74" rx="30" ry="30" fill="url(#lum)"/>` +
      `<rect x="330" y="70" width="30" height="100" fill="#2f2415"/><circle cx="352" cy="124" r="2.5" fill="#c9a24d"/>` + tail,
    salle: () => head('#1d1626', '#2d2233') +
      `<rect x="0" y="12" width="360" height="26" fill="#6f2a2a"/><text x="180" y="31" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#f2ead8" letter-spacing="3">DERNIÈRE PÊCHE 1987</text>` +
      `${[60, 180, 300].map(x => `<line x1="${x}" y1="38" x2="${x}" y2="62" stroke="#c9a24d"/><circle cx="${x}" cy="68" r="12" fill="#e8a33d" opacity=".5"/><circle cx="${x}" cy="68" r="4" fill="#ffd89a"/>`).join('')}` +
      `<rect x="0" y="112" width="360" height="12" fill="#f2ead8"/><rect x="0" y="124" width="360" height="66" fill="#3a2a2f"/>` +
      `${[30, 90, 150, 210, 270, 330].map(x => `<ellipse cx="${x}" cy="108" rx="9" ry="4" fill="#f2ead8" stroke="#aaa"/><rect x="${x - 3}" y="92" width="6" height="14" rx="2" fill="#7a2f2f"/>`).join('')}` +
      `<rect x="168" y="124" width="24" height="40" fill="#1a1219" opacity=".7"/>` + tail,
    gendarmerie: () => head('#0b1220', '#1a2a40') +
      `<rect y="140" width="360" height="50" fill="#0c1018"/><rect x="60" y="78" width="190" height="64" rx="8" fill="#2f3d55"/><rect x="200" y="62" width="70" height="40" rx="6" fill="#2f3d55"/><rect x="210" y="68" width="50" height="26" fill="#9fb0c4" opacity=".55"/><rect x="70" y="92" width="120" height="22" fill="#e9e4d4" opacity=".85"/><text x="78" y="108" font-size="14" fill="#2f3d55" font-family="sans-serif" font-weight="bold">GENDARMERIE</text><circle cx="110" cy="146" r="14" fill="#111"/><circle cx="110" cy="146" r="6" fill="#777"/><circle cx="224" cy="146" r="14" fill="#111"/><circle cx="224" cy="146" r="6" fill="#777"/><rect x="132" y="68" width="30" height="8" rx="3" fill="#3d7fd6"/><rect x="164" y="68" width="30" height="8" rx="3" fill="#c0453f"/><rect x="290" y="40" width="6" height="100" fill="#555"/><ellipse cx="293" cy="38" rx="22" ry="6" fill="#e8a33d" opacity=".5"/><polygon points="270,44 316,44 330,142 256,142" fill="#e8a33d" opacity=".08"/>` + tail,
    vestiaire: () => head('#101a1a', '#1d2b2b') +
      `<rect x="0" y="34" width="360" height="6" fill="#4b3a26"/>${Array.from({length: 9}, (_, i) => { const x = 20 + i * 38, c = ['#3a4a5e', '#6a4a3a', '#2f3b2f', '#7a6a55', '#4a3a55', '#3a3a3a', '#5a2f2f', '#4a5a3a', '#2f4a6b'][i]; return `<line x1="${x}" y1="40" x2="${x}" y2="48" stroke="#9aa" /><path d="M${x - 14} 52 Q${x} 44 ${x + 14} 52 L${x + 18} 140 L${x - 18} 140Z" fill="${c}"/><circle cx="${x}" cy="62" r="2" fill="#e8a33d"/>`; }).join('')}` +
      `<rect y="150" width="360" height="40" fill="#0c1313"/><rect x="130" y="130" width="100" height="18" fill="#5a3f22"/><rect x="145" y="124" width="40" height="8" fill="#f2ead8"/>` + tail,
    chaufferie: () => head('#1a0f0a', '#2a1a10') +
      `<rect x="40" y="50" width="120" height="100" rx="10" fill="#3a3f46"/><rect x="62" y="96" width="76" height="40" rx="6" fill="#e8742a"/><ellipse cx="100" cy="116" rx="40" ry="24" fill="url(#lum)"/><rect x="90" y="20" width="20" height="34" fill="#3a3f46"/>` +
      `<rect x="200" y="60" width="130" height="90" rx="6" fill="#2d3a40"/><circle cx="240" cy="95" r="20" fill="#16222a" stroke="#6b7a82" stroke-width="3"/><line x1="240" y1="95" x2="252" y2="84" stroke="#e8a33d" stroke-width="2"/><rect x="276" y="76" width="40" height="50" fill="#16222a"/>` +
      `<rect y="150" width="360" height="40" fill="#120b07"/><rect x="330" y="132" width="26" height="18" fill="#8a6a3a"/><rect x="324" y="114" width="26" height="18" fill="#9a7a4a"/>` + tail,
    compta: () => head('#111a24', '#1d2a38') +
      `<rect x="0" y="0" width="360" height="18" fill="#3f5069"/>${[20, 70, 120, 170, 220, 270, 320].map(x => `<line x1="${x}" y1="18" x2="${x + 10}" y2="30" stroke="#3f5069" stroke-width="2"/>`).join('')}` +
      `<rect x="0" y="140" width="360" height="50" fill="#14202b"/><rect x="60" y="104" width="190" height="12" fill="#5a3f22"/><rect x="70" y="116" width="10" height="38" fill="#4a3219"/><rect x="230" y="116" width="10" height="38" fill="#4a3219"/>` +
      `<rect x="100" y="86" width="50" height="18" fill="#2b2b2b"/><rect x="108" y="72" width="34" height="14" fill="#f2ead8"/><path d="M190 96 q-20 -4 -22 8 h42 q-2 -12 -20 -8z" fill="#111"/><rect x="185" y="100" width="32" height="6" fill="#222"/><ellipse cx="260" cy="60" rx="46" ry="38" fill="url(#lum)" opacity=".6"/><rect x="250" y="44" width="20" height="28" fill="#e8a33d" opacity=".4"/>` + tail,
    infirmerie: () => head('#12202a', '#1d3340') +
      `<rect x="30" y="60" width="130" height="70" fill="#d6dee3"/><rect x="30" y="130" width="130" height="10" fill="#8a96a0"/><rect x="40" y="70" width="50" height="22" rx="6" fill="#f2f5f7"/>` +
      `<rect x="220" y="26" width="90" height="120" fill="#2a4a5a" stroke="#9fb0c4" stroke-width="3"/><rect x="262" y="40" width="8" height="24" fill="#c0453f"/><rect x="254" y="48" width="24" height="8" fill="#c0453f"/><line x1="265" y1="70" x2="265" y2="146" stroke="#9fb0c4"/>` +
      `<rect y="150" width="360" height="40" fill="#0e1a22"/>` + tail
  };
  const hair = (l) => {
    const c = l.cheveux;
    switch (l.style) {
      case 'chignon': return `<ellipse cx="40" cy="22" rx="16" ry="9" fill="${c}"/><circle cx="40" cy="11" r="6" fill="${c}"/>`;
      case 'long': return `<path d="M24 38 Q21 11 40 12 Q59 11 56 38 L59 62 L51 42 L29 42 L21 62Z" fill="${c}"/>`;
      case 'carre': return `<path d="M24 42 Q22 12 40 13 Q58 12 56 42 L52 42 L52 28 Q40 21 28 28 L28 42Z" fill="${c}"/>`;
      case 'queue': return `<path d="M25 32 Q25 13 40 13 Q56 13 55 32 Q50 21 40 21 Q30 21 25 32Z" fill="${c}"/><circle cx="59" cy="26" r="5" fill="${c}"/>`;
      case 'chauve': return `<path d="M25 30 Q27 21 33 21 Q28 24 25 30Z" fill="${c}"/><path d="M55 30 Q53 21 47 21 Q52 24 55 30Z" fill="${c}"/>`;
      default: return `<path d="M25 33 Q24 13 40 13 Q56 13 55 33 Q50 22 40 22 Q30 22 25 33Z" fill="${c}"/>`;
    }
  };
  const portrait = (l) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="80" height="80" fill="#13243b"/><path d="M6 80 Q8 56 40 54 Q72 56 74 80Z" fill="${l.tenue}"/><rect x="34" y="44" width="12" height="12" fill="${l.peau}"/><ellipse cx="40" cy="34" rx="15" ry="18" fill="${l.peau}"/>${hair(l)}<circle cx="34" cy="35" r="1.7" fill="#222"/><circle cx="46" cy="35" r="1.7" fill="#222"/><path d="M35 44 Q40 47 45 44" stroke="#7a3a2a" stroke-width="1.5" fill="none"/><circle cx="40" cy="62" r="2.2" fill="${l.accent}"/></svg>`;
  const icons = {
    sol: `<rect x="6" y="40" width="52" height="16" fill="#35506e"/><ellipse cx="32" cy="46" rx="15" ry="4.5" fill="#cdbd9d"/><path d="M14 16 q4 7 0 10 q-4-3 0-10z M30 8 q4 7 0 10 q-4-3 0-10z M47 18 q4 7 0 10 q-4-3 0-10z" fill="#6fa3d0"/>`,
    montre: `<rect x="26" y="4" width="12" height="10" fill="#7a6a55"/><rect x="26" y="50" width="12" height="10" fill="#7a6a55"/><circle cx="32" cy="32" r="19" fill="#f2ead8" stroke="#555" stroke-width="3"/><line x1="32" y1="32" x2="27" y2="23" stroke="#222" stroke-width="2.5"/><line x1="32" y1="32" x2="43" y2="26" stroke="#222" stroke-width="1.8"/><path d="M22 20 L30 30 L26 40 L36 44" stroke="#8a3030" stroke-width="1.3" fill="none"/><rect x="50" y="29" width="6" height="6" fill="#c9a24d"/>`,
    gant: `<path d="M17 56 V32 Q17 25 23 26 V14 Q23 8 28 9 Q33 9 33 15 V24 Q37 20 41 24 V28 Q46 25 48 30 V56Z" fill="#d9bf94" stroke="#8a6d3b" stroke-width="2"/><path d="M40 12 l5 5 -4 3z" fill="#f2ead8"/>`,
    caisse: `<rect x="8" y="22" width="48" height="30" fill="#b48a52" stroke="#6a4f2a" stroke-width="2"/><line x1="8" y1="32" x2="56" y2="32" stroke="#6a4f2a" stroke-width="2"/><line x1="8" y1="42" x2="56" y2="42" stroke="#6a4f2a" stroke-width="2"/><path d="M22 14 q10-6 22 0 l-4 6 q-8-3-14 0z" fill="#9fb0c4"/>`,
    papier: `<rect x="14" y="6" width="36" height="50" fill="#f2ead8" stroke="#a89b78" stroke-width="2"/><line x1="20" y1="18" x2="44" y2="18" stroke="#6a5f45" stroke-width="2"/><line x1="20" y1="26" x2="44" y2="26" stroke="#6a5f45" stroke-width="2"/><line x1="20" y1="34" x2="38" y2="34" stroke="#6a5f45" stroke-width="2"/><path d="M22 46 q6-8 10 0 t10 0" stroke="#7a1f1a" stroke-width="2" fill="none"/>`,
    bronze: `<ellipse cx="30" cy="32" rx="20" ry="9" fill="#a8733a" stroke="#6a4a1f" stroke-width="2"/><path d="M48 32 L60 21 L60 43Z" fill="#a8733a" stroke="#6a4a1f" stroke-width="2"/><circle cx="19" cy="30" r="2" fill="#222"/><path d="M26 44 q3 6 0 9 q-3-3 0-9z" fill="#8a3030"/>`,
    pluie: `<path d="M16 34 Q8 34 8 26 Q8 18 18 18 Q22 8 34 10 Q44 10 46 20 Q56 20 56 28 Q56 34 48 34Z" fill="#7d8fa6"/><g stroke="#6fa3d0" stroke-width="2.5"><line x1="16" y1="42" x2="12" y2="52"/><line x1="28" y1="42" x2="24" y2="52"/><line x1="40" y1="42" x2="36" y2="52"/><line x1="52" y1="42" x2="48" y2="52"/></g>`,
    manteau: `<path d="M20 10 L32 18 L44 10 L56 22 L52 58 L12 58 L8 22Z" fill="#c9b08a" stroke="#7a6a55" stroke-width="2"/><line x1="32" y1="18" x2="32" y2="58" stroke="#7a6a55" stroke-width="2"/><circle cx="28" cy="32" r="2" fill="#7a6a55"/><circle cx="28" cy="44" r="2" fill="#7a6a55"/><rect x="40" y="38" width="9" height="12" fill="#e8d9b8" stroke="#7a6a55"/>`,
    photo: `<rect x="8" y="14" width="48" height="36" rx="4" fill="#2b2b2b"/><circle cx="32" cy="32" r="12" fill="#0e1a22" stroke="#9fb0c4" stroke-width="3"/><circle cx="32" cy="32" r="5" fill="#35506e"/><rect x="20" y="9" width="14" height="6" fill="#2b2b2b"/><circle cx="48" cy="22" r="2" fill="#e8a33d"/>`,
    journal: `<rect x="8" y="10" width="48" height="44" fill="#d6c8a3" stroke="#6a5f45" stroke-width="2"/><line x1="32" y1="10" x2="32" y2="54" stroke="#6a5f45"/><g stroke="#6a5f45" stroke-width="1.5"><line x1="13" y1="20" x2="27" y2="20"/><line x1="13" y1="28" x2="27" y2="28"/><line x1="37" y1="20" x2="51" y2="20"/><line x1="37" y1="28" x2="51" y2="28"/></g><circle cx="44" cy="42" r="6" fill="none" stroke="#7a1f1a" stroke-width="2"/>`,
    telephone: `<path d="M10 26 Q10 14 32 14 Q54 14 54 26 L54 32 L44 32 L44 26 Q32 22 20 26 L20 32 L10 32Z" fill="#222"/><rect x="8" y="36" width="48" height="18" rx="4" fill="#3a3a3a"/><circle cx="32" cy="45" r="5" fill="#7a7a7a"/>`,
    registre: `<rect x="10" y="8" width="44" height="48" fill="#d9e3e8" stroke="#6a7a82" stroke-width="2"/><rect x="29" y="18" width="6" height="22" fill="#c0453f"/><rect x="21" y="26" width="22" height="6" fill="#c0453f"/><line x1="16" y1="48" x2="48" y2="48" stroke="#6a7a82" stroke-width="2"/>`
  };
  icons.cassette = `<rect x="6" y="16" width="52" height="34" rx="4" fill="#2b2b2b" stroke="#8a8a8a" stroke-width="2"/><rect x="12" y="22" width="40" height="14" rx="2" fill="#d6c8a3"/><circle cx="23" cy="29" r="5" fill="#222"/><circle cx="41" cy="29" r="5" fill="#222"/><rect x="20" y="40" width="24" height="6" fill="#555"/>`;
  const icon = (n) => `<svg class="ico" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${icons[n] || icons.papier}</svg>`;
  /* tirages de Gwenn : deux photos, 3 différences à toucher sur celle de droite */
  const woman = (ox, o) => {
    const glove = o.gloves ? '#d9bf94' : '#ecd3bb';
    const rh = o.glass === 'R' ? [ox + 56, 98] : [ox + 55, 138], lh = o.glass === 'L' ? [ox + 114, 92] : [ox + 118, 138];
    const arm = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#7a6a55" stroke-width="9" stroke-linecap="round"/>`;
    return `<rect x="${ox}" y="8" width="170" height="174" fill="#1b2a3f"/><rect x="${ox}" y="118" width="170" height="64" fill="#122033"/>` +
      `<path d="M${ox + 40} 182 Q${ox + 44} 80 ${ox + 85} 78 Q${ox + 126} 80 ${ox + 130} 182Z" fill="#7a6a55"/><circle cx="${ox + 85}" cy="52" r="20" fill="#ecd3bb"/><path d="M${ox + 64} 50 Q${ox + 66} 28 ${ox + 85} 28 Q${ox + 106} 28 ${ox + 106} 50 Q${ox + 96} 40 ${ox + 85} 40 Q${ox + 74} 40 ${ox + 64} 50Z" fill="#5b3a2a"/>` +
      arm(ox + 50, 92, rh[0], rh[1] - 8) + arm(ox + 120, 92, lh[0], lh[1] - 8) +
      `<circle cx="${rh[0]}" cy="${rh[1]}" r="8" fill="${glove}"/><circle cx="${lh[0]}" cy="${lh[1]}" r="8" fill="${glove}"/>` +
      (o.glass ? (() => { const g = o.glass === 'R' ? rh : lh; return `<path d="M${g[0] - 6} ${g[1] - 22} h12 l-2 18 h-8z" fill="#cfe3f0" opacity=".85" stroke="#9fb0c4"/>`; })() : '') +
      (o.scratch ? `<g stroke="#c0453f" stroke-width="1.6" stroke-linecap="round"><line x1="${rh[0] - 5}" y1="${rh[1] - 5}" x2="${rh[0] + 4}" y2="${rh[1] + 3}"/><line x1="${rh[0] - 5}" y1="${rh[1]}" x2="${rh[0] + 4}" y2="${rh[1] + 8}"/><line x1="${rh[0] - 2}" y1="${rh[1] - 8}" x2="${rh[0] + 7}" y2="${rh[1]}"/></g>` : '');
  };
  const photos = (found) => {
    const zones = {gants: [ox => ox + 114, 99, 'Les gants'], ecorchure: [ox => ox + 55, 138, 'La main droite'], verre: [ox => ox + 114, 72, 'Le verre']};
    const ox = 188;
    const hot = Object.keys(zones).map(id => { const z = zones[id], cx = z[0](ox), cy = z[1]; return `<circle data-act="zone" data-a="${id}" cx="${cx}" cy="${cy}" r="13" fill="${found[id] ? '#e8a33d22' : 'transparent'}" stroke="${found[id] ? '#e8a33d' : 'transparent'}" stroke-width="2" style="cursor:pointer"/>`; }).join('');
    return `<svg viewBox="0 0 360 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deux tirages : 19h50 et 23h10">` +
      woman(0, {gloves: true, glass: 'R'}) + woman(ox, {gloves: false, glass: 'L', scratch: true}) +
      `<text x="8" y="22" font-size="11" fill="#e9e4d4" font-family="sans-serif">19h50</text><text x="${ox + 8}" y="22" font-size="11" fill="#e9e4d4" font-family="sans-serif">23h10</text>` + hot + `</svg>`;
  };
  /* schéma de Douarnenez (non à l'échelle) */
  const carte = () => {
    const t = (x, y, s, c, anchor) => `<text x="${x}" y="${y}" font-size="${c || 9}" fill="${s || '#cdbd9d'}" font-family="sans-serif" text-anchor="${anchor || 'start'}">`;
    return `<svg viewBox="0 0 360 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schéma de Douarnenez : Rosmeur, Port-Rhu, Tréboul, île Tristan">` +
      `<rect width="360" height="210" fill="#0f2238"/><path d="M0 98 Q40 90 95 100 L150 104 L166 104 L168 176 L184 176 L186 104 L214 104 L222 114 L246 114 L252 104 L360 96 L360 210 L0 210Z" fill="#1d2a24"/>` +
      `<path d="M168 104 L168 176 L184 176 L186 104Z" fill="#17304a"/><path d="M214 104 L222 114 L246 114 L252 104Z" fill="#17304a"/>` +
      `<ellipse cx="146" cy="72" rx="15" ry="7" fill="#2b3a2b"/>` +
      t(8, 20, '#6f8fb0', 10) + `Baie de Douarnenez</text>` +
      t(146, 88, '#cdbd9d', 9, 'middle') + `Île Tristan</text>` +
      t(100, 128, '#cdbd9d', 10, 'middle') + `Tréboul</text>` +
      t(40, 112, '#9aa9b8', 8, 'middle') + `Sables Blancs</text>` +
      t(176, 196, '#9aa9b8', 8, 'middle') + `Pouldavid</text>` +
      t(176, 144, '#6f8fb0', 8, 'middle') + `Port-Rhu</text>` +
      t(234, 132, '#cdbd9d', 10, 'middle') + `Rosmeur</text>` +
      t(300, 150, '#cdbd9d', 10, 'middle') + `Centre</text>` +
      t(300, 180, '#9aa9b8', 9, 'middle') + `Ploaré</text>` +
      `<g fill="#e8a33d"><path d="M190 108 l3 7 7 .6 -5.4 4.6 1.8 7 -6.4 -3.8 -6.4 3.8 1.8 -7 -5.4 -4.6 7 -.6z" transform="translate(4 -6) scale(.9)"/></g>` +
      t(206, 100, '#e8a33d', 8) + `Usine Morvan (fiction)</text>` +
      t(354, 205, '#6f8fb0', 7, 'end') + `Schéma, non à l'échelle</text></svg>`;
  };
  return { carte, photos, scene: (id) => (scenes[id] || scenes.cour)(), portrait, icon };
})();
