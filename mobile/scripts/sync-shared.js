// Copie l'affaire (src/data.js) et les dessins (src/art.js) du jeu web en modules ES pour l'appli.
// Source unique : on n'édite JAMAIS mobile/src/shared/*.js à la main.
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..'), out = path.resolve(__dirname, '..', 'src', 'shared');
fs.mkdirSync(out, { recursive: true });
const head = '/* FICHIER GÉNÉRÉ par mobile/scripts/sync-shared.js — ne pas modifier. Source : ';
fs.writeFileSync(path.join(out, 'affaire.js'), head + 'src/data.js */\n' + fs.readFileSync(path.join(root, 'src/data.js'), 'utf8') + '\nexport default AFFAIRE;\n');
fs.writeFileSync(path.join(out, 'art.js'), head + 'src/art.js */\n' + fs.readFileSync(path.join(root, 'src/art.js'), 'utf8') + '\nexport default ART;\n');
console.log('shared : affaire.js, art.js à jour');
