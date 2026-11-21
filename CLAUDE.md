# La Dernière Pêche — jeu d'enquête (polar, Douarnenez, 15 nov 1987)

Auteur : Fabrice. Objectif : vendre le jeu (itch.io / site / stores), puis éventuel partenariat office de tourisme de Douarnenez.
Réponses : courtes, directes, en français, sans intro ni conclusion. Ne pas valider par défaut, corriger si inefficace. Chiffres de marché / droit : écrire « à vérifier », ne rien inventer.

## Règles non négociables
- Un seul fichier HTML final, hors ligne, ZÉRO dépendance externe (pas de CDN, police, API).
- Assets 100 % originaux (SVG/CSS). Aucun élément protégé.
- L'affaire est un bloc de données (`const AFFAIRE` dans `src/data.js`), séparé du moteur (`src/engine.js`). Ne pas les mélanger : le moteur doit servir d'autres affaires plus tard.
- Faits réels = Douarnenez, Port-Rhu, Rosmeur, Tréboul, île Tristan, grève de 1924. Usine Morvan, personnages, sociétés = fiction. Sources : `docs/sources_douarnenez.md`.
- Un seul coupable démontrable. Toute modif d'indice → relancer `npm test` (web) ET `cd mobile && npm test`.

## Structure
- `src/` : data.js (l'affaire), art.js (SVG), engine.js (moteur web), style.css, assemble.sh. **Source unique de l'affaire et des dessins, pour le web ET l'appli.**
- Build web : `npm run build` → `la_derniere_peche.html` + `pwa/index.html` (généré, ne pas éditer). QA web : `npm test` (= `tests/qa2.js`, Playwright).
- `pwa/` : manifest, sw.js (cache `derniere-peche-v2.5`, à incrémenter à chaque release), icônes.
- `docs/` : bible, design, QA, extension v2, sources.

## Appli mobile : React Native (Expo SDK 58) dans `mobile/`
- `mobile/scripts/sync-shared.js` (lancé par `npm install`) copie `src/data.js` et `src/art.js` en modules dans `mobile/src/shared/` (générés, non versionnés). Ne jamais dupliquer l'affaire à la main.
- `mobile/src/core/engine.ts` : portage TypeScript pur du moteur (sans React). Toute règle changée dans `src/engine.js` → la reporter ici.
- `mobile/src/screens.tsx` : tous les écrans (1 pour 1 avec les vues web). `mobile/src/game.tsx` : navigation (pile), options, toasts, sauvegarde AsyncStorage (même clé `ENG1:derniere-peche`). `mobile/src/ui/kit.tsx` : charte. Dessins via `SvgXml`.
- Sons : `mobile/assets/sons/*.wav`, rendus depuis la synthèse web par `node scripts/render-sons.js`. Voix de la cassette : `expo-speech` (voix native du téléphone).
- Pas d'Expo Router (navigation = pile d'écrans du jeu, plus simple). Bouton retour Android géré dans `App.tsx`.
- Tests : `cd mobile && npm test` (8 tests moteur, mêmes parcours que qa2) ; `npm run typecheck` ; test réel au clic : `npx expo export --platform web --output-dir <dir>` puis `node tests/web-smoke.js <dir> <captures>`.
- APK : `.github/workflows/android.yml` (npm ci → tests → `expo prebuild` → `gradlew assembleRelease`, signé clé de debug) → artefact `la-derniere-peche-apk`. Dossiers `mobile/android`, `mobile/ios` générés, jamais édités à la main : tout passe par `mobile/app.json`.
- Identifiant `fr.dernierepeche.jeu` (Android et iOS). Version : `mobile/app.json` (version + versionCode/buildNumber à incrémenter à chaque publication).

## Moteur (repères)
- `has(key)` : `i:ID` indice, `q:perso.qid` question, `c:Cx` conclusion, sinon flag.
- Sauvegarde localStorage `ENG1:derniere-peche` (SCHEMA 2). Options `ENG1:options`.
- Fins : A (Odile, preuves suffisantes), B (autre suspect), Bsol (Solange), C (preuves insuffisantes), D (Yann).
- 3 modes : Stagiaire (aide gratuite, max 2★), Inspecteur (défaut), Commissaire (aides 1/2/4 off).

## Limites connues (non vérifié)
- Sons synthétisés, voix TTS, ambiance : jamais écoutés (pas d'audio en test).
- Durée réelle : estimée (optimal ~21 min, complet ~54 min). Mesurer avec 2–3 testeurs.
- Taille tactile des zones photo (~26 px).
- À vérifier : institutions 1987 (gendarmerie Quimper, PJ), noms de sociétés réelles, antériorité du titre.
- Service worker : testé en HTTP, pas en artifact.
- Appli React Native : testée en version web (clics réels) et par les tests moteur ; jamais lancée sur un vrai téléphone. Sons et voix native jamais écoutés.
- appId `fr.dernierepeche.jeu` : définitif une fois publié sur un store → valider avant.

## Prochaines tâches
1. Étape 5 (pack commercial) : fiche de vente, prix, légal, lancement 7 jours, suites, dossier partenaire office de tourisme. À faire dans le Project Claude, pas ici.
2. Appli React Native : tester l'APK sur téléphone, keystore de publication + AAB Play Store (EAS Build ou Gradle), build iOS (EAS Build ou Mac/Xcode), fiches stores.
3. Option : version anglaise, mode « Escale » 20 min, QR codes sur lieux réels.
