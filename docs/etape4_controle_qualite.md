# LA DERNIÈRE PÊCHE — Étape 4 : Contrôle qualité (jeu v1.1)

## 1. Méthode

- Simulation automatique dans un vrai navigateur (Chrome, écran mobile 390 px) : le script joue le jeu en appelant les mêmes actions que les boutons.
- Contrôles statiques sur les données : références cassées, indices introuvables, drapeaux jamais posés.
- Test de rendu à 320 px (petit téléphone) et 1280 px (ordinateur) : aucun débordement horizontal.
- Aucune erreur console, aucune requête réseau (le jeu est bien 100 % hors ligne).

## 2. Les parcours simulés (les 3 demandés, plus un parcours complet)

| Parcours | Ce que fait le joueur | Résultat |
|---|---|---|
| **Optimal** | 8 indices utiles, 4 conclusions, accuse Odile. | Fin A, mais 2★ : il n'a pas vérifié les alibis. |
| **Complet méthodique** | Lit tout, pose toutes les questions, vérifie chaque alibi, brise les 4 affirmations d'Odile. | Fin A, 3★, 15/15 indices. |
| **Avec erreurs** | Accuse Yann trop tôt (D), Odile sans preuves (C), Lucien (B), tente de mauvaises pièces et de faux rattachements, puis reprend et accuse correctement. | Fins D, C, B, puis A. Le dossier se rouvre à chaque fois sans perte. |
| **Bloqué** | N'utilise que l'aide, en alternant les niveaux 2, 3 et 4, sans réfléchir. | Fin A, 1★ (52 points d'aide). Aucune aide vide. |

L'affaire reste résoluble dans les trois cas. Les 5 suspects innocents ne donnent jamais la fin A.

## 3. Bugs et incohérences

| # | Problème | État |
|---|---|---|
| 1 | Tableau de déduction trop strict : un indice légitime non prévu donnait « à revoir » sans explication. | Corrigé. Un indice en plus est toléré. Les fausses pistes (I04, I05, I07) sont refusées et nommées. Les autres messages disent si un indice manque ou s'il y en a trop. |
| 2 | Tout rattacher partout aurait pu valider les conclusions. | Vérifié : 0 conclusion validée avec 15 indices rattachés, 0 avec un seul indice. |
| 3 | Affirmation « gants » d'Odile brisée par le lambeau seul, qui ne prouve pas qu'elle portait des gants. | Corrigé : il faut la photo du perron (I12) ou le gant dans son manteau (I11). |
| 4 | Affirmation « 23h10 » brisée par la pluie (I10) seule. | Corrigé : I10 retiré de la liste. Restent le sol sec, la montre, le bruit de 20h53. |
| 5 | Messages de verrouillage du palier « Creuser » trop vagues. | Corrigé : chaque message nomme le type de pièce manquant et le lieu, sans donner l'indice. |
| 6 | Un joueur pouvait obtenir 3★ sans vérifier un seul alibi (acte 3 inutile pour gagner). | Corrigé : 3★ exige les 3 alibis (I13, I14, I15). |
| 7 | L'aide ne coûtait qu'un seul cran de rang quel que soit l'usage. | Corrigé : 0–3 points = rien, 4–12 = −1★, plus de 12 = −2★. |
| 8 | Après un rechargement sur l'écran de fin, la reprise renvoyait au menu. | Corrigé : la reprise revient à l'écran de fin. |
| 9 | « Durée : 75 à 85 minutes » affiché dans le jeu, non mesuré. | Corrigé : « environ 1 heure ». |

Point de correction sur mon message vocal : le contrôle des gants acceptait déjà une seule des deux pièces, pas « les deux ensemble ». Le vrai défaut était que le lambeau seul suffisait.

## 4. Durée de jeu

Ce que j'ai mesuré (modèle : mots lus ÷ vitesse de lecture + 4 s par action) :

| Parcours | Durée de lecture et d'actions |
|---|---|
| Optimal, lecteur rapide | environ 8 min |
| Complet, lecteur lent (160 mots/min) | environ 33 min |

Ce que ça ne compte pas : réflexion, retours en arrière, erreurs. En ajoutant un facteur de 1,5 à 2, ça donne environ **15 à 20 min** pour un joueur qui va droit au but et **50 à 65 min** pour un joueur méthodique. C'est une estimation, pas une mesure. Seul un testeur humain donnera la vraie durée.

**Écart avec le cahier des charges :** la cible était 60 à 90 min. Le jeu est probablement en dessous pour un joueur rapide, et dans la cible basse pour un joueur méthodique.

## 5. À décider

- **Option A : garder le format actuel**, environ 45 à 60 min, et fixer le prix en conséquence. Plus simple, c'est un bon format de premier épisode.
- **Option B : ajouter du contenu** pour viser 60 à 90 min : un rapport du médecin légiste, un témoin supplémentaire (le maire Le Goff), des questions en plus par suspect, et une mini-étape de reconstitution de la chronologie. Plusieurs échanges de travail, avec une validation de ta part avant le code.
