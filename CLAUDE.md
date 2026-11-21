# La Dernière Pêche — jeu d'enquête (polar, Douarnenez, 15 nov 1987)

Auteur : Fabrice. Objectif : vendre le jeu (itch.io / site / stores), puis éventuel partenariat office de tourisme de Douarnenez.
Réponses : courtes, directes, en français, sans intro ni conclusion. Ne pas valider par défaut, corriger si inefficace. Chiffres de marché / droit : écrire « à vérifier », ne rien inventer.

## Règles non négociables
- Un seul fichier HTML final, hors ligne, ZÉRO dépendance externe (pas de CDN, police, API).
- Assets 100 % originaux (SVG/CSS). Aucun élément protégé.
- L'affaire est un bloc de données (`const AFFAIRE` dans `src/data.js`), séparé du moteur (`src/engine.js`). Ne pas les mélanger : le moteur doit servir d'autres affaires plus tard.
- Faits réels = Douarnenez, Port-Rhu, Rosmeur, Tréboul, île Tristan, grève de 1924. Usine Morvan, personnages, sociétés = fiction. Sources : `docs/sources_douarnenez.md`.
- Un seul coupable démontrable. Toute modif d'indice → relancer `tests/qa2.js`.

## Structure
- `src/` : data.js, art.js (SVG), engine.js, style.css, assemble.sh.
- **Build unique : `npm run build`** (= `sh scripts/build.sh`) → `la_derniere_peche.html`, `pwa/index.html` (généré, ne plus éditer à la main), `www/` (webDir Capacitor, non versionné).
- `pwa/` : manifest, sw.js (cache `derniere-peche-v2.5`, à incrémenter à chaque release), icônes.
- `native/native.js` : colle appli (bouton retour Android → `ACT.back()`, coupe ambiance/voix en arrière-plan). Injecté seulement dans `www/`.
- `android/`, `ios/` : projets Capacitor 8 (appId `fr.dernierepeche.jeu`, portrait). iOS en Swift Package Manager (pas de CocoaPods).
- `assets/` : sources icône/splash → `npx capacitor-assets generate --android --ios`.
- `.github/workflows/android.yml` : compile l'APK debug à chaque push (artefact téléchargeable dans l'onglet Actions).
- `docs/` : bible, design, QA, extension v2, sources.
- `tests/qa2.js` : Playwright (3 parcours + modes + contrôles statiques). Utilise `window.__ENG`. `npm test`.

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
- Service worker : testé en HTTP, pas en artifact. Absent de l'appli native (volontaire).
- Appli native : jamais lancée sur appareil. Voix TTS probablement muette dans la WebView Android (pas de speechSynthesis) : sous-titres OK.
- appId `fr.dernierepeche.jeu` : définitif une fois publié sur un store → valider avant.

## Prochaines tâches
1. Étape 5 (pack commercial) : fiche de vente, prix, légal, lancement 7 jours, suites, dossier partenaire office de tourisme. À faire dans le Project Claude, pas ici.
2. Appli : Capacitor en place. Reste : tester l'APK sur téléphone, keystore + build release signé (AAB Play Store), build iOS sur Mac (Xcode), fiches stores.
3. Option : version anglaise, mode « Escale » 20 min, QR codes sur lieux réels.
