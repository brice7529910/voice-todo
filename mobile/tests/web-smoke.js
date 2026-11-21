// Test de fumée de l'appli RN exportée pour le web : parcours réel au doigt (clics), captures d'écran.
// Usage : npx expo export --platform web --output-dir <dir> ; node tests/web-smoke.js <dir> <dossier-captures>
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const dir = path.resolve(process.argv[2]), shots = path.resolve(process.argv[3] || 'shots');
fs.mkdirSync(shots, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.wav': 'audio/wav', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json' };
const srv = http.createServer((q, r) => { let f = path.join(dir, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(dir, 'index.html'); r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0);
(async () => {
  const url = 'http://localhost:' + srv.address().port + '/';
  const b = await chromium.launch(); const page = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errs = []; page.on('pageerror', e => errs.push('PAGEERR ' + e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('dialog', d => d.accept());
  const tap = async (label) => { await page.getByRole('button', { name: label }).first().click(); await page.waitForTimeout(150); };
  const shot = n => page.screenshot({ path: path.join(shots, n + '.png') });
  const check = (c, m) => { if (!c) errs.push('ÉCHEC ' + m); };
  await page.goto(url); await page.waitForSelector('text=Nouvelle enquête');
  await shot('01-accueil');
  await tap(/^Nouvelle enquête/); await tap(/^Inspecteur/); await shot('02-briefing');
  await tap(/^Continuer/); await tap(/^Compris, commencer/); await shot('03-hub');
  await tap(/^La cour/); await shot('04-lieu');
  await tap(/^Sol sous le corps|^Le sol/); await shot('05-indice');
  check(await page.getByText('INDICE').count() > 0, 'tampon INDICE');
  check(await page.getByText(/Nouvel indice/).count() > 0, 'toast nouvel indice');
  await tap(/^Continuer/); await tap('Retour'); await tap('Dossier'); await shot('06-dossier');
  await page.getByRole('tab', { name: 'Suspects' }).click(); await page.waitForTimeout(150); await shot('07-suspects');
  const fiche = await page.locator('body').innerText();
  check(!/Tailleur beige/.test(fiche) && !/Le gant est celui d'Odile/.test(fiche), 'pas de spoiler');
  // avance rapide via le moteur, puis écrans clés au doigt
  await page.evaluate(() => { const R = globalThis.__RN; ['montre', 'main', 'veste'].forEach(e => R.E.examiner('cour', e)); R.root('hub'); });
  await tap(/^La gendarmerie/); await tap(/^Le magnétophone|^Magnétophone/); await shot('08-cassette');
  await tap(/^Séquence 1/); await shot('09-segment');
  // déduction
  await page.evaluate(() => globalThis.__RN.root('hub')); await tap(/^Tableau de déduction/); await shot('10-deduction');
  const ded = await page.locator('body').innerText(); check(!/Odile/.test(ded), 'déduction sans nom');
  // photos : clic sur une zone
  await page.evaluate(() => { const R = globalThis.__RN; R.E.S.flags.photosVues = 1; R.go('photo', { lieu: 'salle', el: 'photos' }); });
  await page.getByTestId('zone-ecorchure').click(); await page.waitForTimeout(200); await shot('11-photo');
  check(await page.getByText(/Différences trouvées : 1\/3/).count() > 0, 'zone photo cliquable');
  // coffre : saisie
  await page.evaluate(() => globalThis.__RN.go('coffre', { lieu: 'bureau', el: 'coffre' }));
  await page.getByTestId('code').fill('1962'); await tap(/^Essayer ce code/); await shot('12-coffre');
  check(await page.getByText(/Brouillon de lettre/).count() > 0, 'coffre ouvert');
  // persistance : rechargement → Reprendre
  await page.reload(); await page.waitForSelector('text=Reprendre l\'enquête'); await tap(/^Reprendre/);
  const hubTxt = await page.locator('body').innerText(); console.log('HUB:', (hubTxt.match(/Indices \d+\/20/) || [])[0]); check(/Indices 5\/20/.test(hubTxt), 'sauvegarde relue (5 indices : sol, montre, main, coffre, photo)');
  // fin
  await page.evaluate(() => { const R = globalThis.__RN; R.E.accuser('yann', []); R.root('fin'); }); await shot('13-fin');
  check(await page.getByText('FIN D').count() > 0, 'écran de fin');
  // options + texte agrandi
  await tap(/^Menu principal/); await tap('Options'); await tap(/^Texte agrandi/); await shot('14-options');
  console.log(errs.length ? errs.join('\n') : 'OK : aucun échec, aucune erreur console');
  process.exitCode = errs.length ? 1 : 0;
  await b.close(); srv.close();
})();
