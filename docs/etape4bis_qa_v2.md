# Étape 4 bis — Contrôle qualité de la v2.0

Jeu : « La Dernière Pêche » v2.0 (20 indices, 3 niveaux, 3 épreuves obligatoires, 3 optionnelles).

## 1. Parcours simulés (script Playwright, Chrome, 390 px)

| Parcours | Résultat | Détail |
|---|---|---|
| 1. Optimal (Inspecteur, sans optionnels) | Fin A, 3★ | 15 indices, aveu brisé, chronologie, confrontation 4/4 |
| 1 bis. Complet (tous les indices, erreurs sur la cassette, 3 énigmes optionnelles) | Fin A, 3★ + Mention Perspicace | 20 indices sur 20, 4 énoncés de l'aveu brisés |
| 2. Avec erreurs | Fins D, C, B, Bsol puis A | Accuser Yann → D. Odile sans preuves → C. Lucien → B. Solange → Bsol. Puis A après correction |
| 3. Bloqué, suit seulement l'aide | Fin A, 1★ | 34 pas d'aide, aucun message d'aide vide, aucun blocage |

Les trois parcours restent résolubles. Un joueur peut toujours finir, mais l'aide intensive coûte des étoiles (1★ dans le parcours 3).

## 2. Contrôles de cohérence automatiques

- Les 20 indices sont obtenables.
- Toute clé de condition (indice, question, conclusion, flag) existe : 0 anomalie.
- Chiffre de César : le clair se retrouve avec la clé 12. L'escalier compte 12 marches (texte de la cour) et la cassette a 12 pas : la clé est trouvable de deux façons.
- Les 3 zones de la photo existent dans le dessin.
- Rattacher tous les indices partout valide 0 conclusion. Un seul indice par conclusion en valide 0.
- Présenter toutes les mauvaises pièces à Solange ne brise aucun énoncé.
- Aucun suspect autre qu'Odile ne donne la fin A.
- Pas de requête réseau, 0 erreur console.
- Mise en page : aucun débordement horizontal à 320 px et 390 px sur les 8 écrans nouveaux.
- Reprise après rechargement : mode et indices conservés. Les anciennes sauvegardes v1 sont ignorées (changement de schéma).

## 3. Défaut trouvé et garde-fous

Un seul défaut réel trouvé à la relecture : au déblocage de l'acte 2, le message de la veste annonçait le magnétophone avant la fouille. Corrigé : l'annonce de la veste vient à l'acte 2, celle du magnétophone après la fouille.

Garde-fous intégrés dès la construction et vérifiés par les parcours :
- Accuser Solange donne une fin dédiée (Bsol) : l'aveu ne prouve rien.
- Aveu, énoncé 4 : la cassette seule ne suffit pas, il faut aussi le témoignage de Jeanne. Message explicite si la pièce compte mais ne suffit pas.
- La question de Jeanne sur les chaussures n'apparaît qu'après l'aveu.

## 4. Durée : modèle, pas mesure

Modèle : mots lus ÷ vitesse de lecture + 4 s par action + temps de réflexion forfaitaire sur les épreuves.

| Parcours | Modèle | Avec facteur 1,5 à 2 (retours, erreurs, relectures) |
|---|---|---|
| Optimal, lecteur rapide | 21 min | environ 30 à 40 min |
| Complet, lecteur lent, énigmes optionnelles | 54 min | environ 80 à 105 min |

Lecture : un joueur qui va droit au but finit en moins d'une heure. Un joueur méthodique atteint la cible 60 à 90 min. **Ce sont des estimations.** Seuls 2 ou 3 testeurs réels donneront la vraie durée.

## 5. Non vérifié

- Les sons synthétisés (pas, cloches, pluie, verre) et la voix du navigateur n'ont pas été écoutés : l'environnement de test n'a pas de sortie audio. À tester sur un vrai téléphone. Les sous-titres et la description sonore couvrent le cas d'un son raté.
- La lisibilité de la photo des trois différences sur petit écran (cercles tactiles de 26 px) : à confirmer avec de vrais doigts.
- Le calibrage des énigmes optionnelles (coffre, chiffre) : à tester sur des joueurs.
- Antériorité du titre « La Dernière Pêche » et des noms (Armor-Pêche, Rivoal) : à vérifier avant commercialisation.

## 6. Correctif v2.1 — coupable trop visible (retour testeur)

Retour : « on sait qui est coupable en lisant les dossiers ». Causes et corrections :
- Tableau de déduction : C3 « Le gant est celui d'Odile Quéré » et C4 « Odile avait un mobile… » visibles dès le début → titres neutres (« Le lambeau de gant désigne son propriétaire », « Le coupable avait un mobile et un rendez-vous »).
- Fiche suspect d'Odile : « Tailleur beige » (= lambeau beige) → tailleur gris, portrait gris. Mobile affiché « gère la caisse de prévoyance » → « aucun connu » (le lien avec la prévoyance arrive par l'interrogatoire et I06).
- Aide : « sa version est la première à vérifier » et « manteau n°14 (Me Quéré) » → formulations sans nom.
QA relancée : résultats identiques (A 3★, complet 20/20, erreurs D/C/B/Bsol/A, aide seule A 1★, 0 anomalie).
Reste à tester : un joueur neuf soupçonne-t-il encore Odile trop tôt ? Si oui, renforcer une fausse piste (Mathilde : écritures de sa main sur I06).
