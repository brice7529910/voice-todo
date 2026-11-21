# LA DERNIÈRE PÊCHE — Étape 2 : Design de jeu (v2)

Version 2.1 : 4 actes, 4 niveaux d'aide, 4 conclusions, 4 fins. Les 6 suspects sont conservés.

## 1. Principes

- **Mobile d'abord** (portrait, 360 px), desktop en confort.
- **Aucun pixel hunting.** Chaque lieu affiche la liste de ce qu'on peut examiner. Rien n'est caché derrière une action qu'on ne peut pas deviner.
- **Aucun blocage.** Tout verrou est annoncé par une piste écrite dans le dossier (« Pistes ouvertes »).
- **Moteur séparé de l'affaire.** Le code ne contient aucun texte d'enquête. Tout vient d'un bloc de données `affaire`. Un nouvel épisode remplace ce bloc.
- **Modulaire**, pour qu'un jeu de rôle se branche plus tard : `etat`, `sauvegarde`, `dialogue`, `dossier`, `deduction`, `aide`, `rendu`.
- **Hors ligne, un seul fichier**, sans police ni lien externes.

## 2. Mécaniques

| Mécanique | Règle |
|---|---|
| **Inspection de scène** | Un lieu = une illustration SVG + liste d'objets. Toucher un objet ouvre sa fiche, l'ajoute au dossier si c'est un indice. |
| **Interrogatoire à choix** | 3 paliers par suspect : *Version officielle* (libre), *Creuser* (se débloque quand le joueur a l'indice lié), *Confrontation* (présenter une pièce). 3 à 5 questions par palier. Une question posée est grisée, jamais perdue. |
| **Présenter une pièce** | À tout moment, le joueur choisit un indice du dossier et le montre. Mauvais choix = réponse neutre, sans pénalité. |
| **Dossier d'indices** | 15 fiches (état : nouveau / lu), filtre par lieu ou suspect. Chaque fiche renvoie à son lieu et à ses liens. |
| **Dossier suspects** | 6 fiches. Les déclarations du joueur y sont notées, avec une marque « contradiction détectée » quand deux fiches se contredisent. |
| **Tableau de déduction** | Quatre conclusions à établir (voir §4). Chaque conclusion se valide en y rattachant les indices qui la prouvent. Le bouton « Vérifier » dit si c'est cohérent, sans donner la solution. |
| **Accusation finale** | Choix d'un suspect + jusqu'à 4 preuves du tableau. Quatre fins (§6). |
| **Sauvegarde auto** | À chaque action, dans `localStorage`, clé `ENG1:<affaire>`. Schéma versionné pour les futures mises à jour. |

## 3. Difficulté progressive : 4 actes

| Acte | Durée visée | Lieux | Objectif |
|---|---|---|---|
| **1. La scène** | 20 min | Cour, Bureau | Trouver les 3 indices physiques. Comprendre que quelque chose cloche. |
| **2. Les versions** | 25 min | Salle des fêtes (suspects), Vestiaire, Photographe | Recueillir les versions, repérer les mensonges. |
| **3. Les vérifications** | 20–25 min | Chaufferie, Compta, Infirmerie, Bassin | Vérifier chaque alibi, rassembler les preuves du gant. |
| **4. La confrontation** | 10–15 min | Salle des fêtes à l'aube | Tableau de déduction, face-à-face avec le suspect principal, accusation. |

Total visé : 75 à 85 min (à mesurer à l'étape 4).

Un acte s'ouvre quand le joueur a **lu** ses indices clés. Une notification écrite annonce le déblocage : « Nouveau lieu : la chaufferie. Yann y était à 20h50. »

**Acte 4, face-à-face.** Le suspect avance 4 affirmations. Chacune se brise en présentant la bonne pièce. Une mauvaise pièce donne une réponse neutre, sans pénalité ni limite d'essais. Les 4 affirmations d'Odile : « Je n'ai pas quitté la salle », « Je n'ai jamais porté de gants ce soir », « Je ne savais pas qu'il me soupçonnait », « Il est mort à 23h10 ».

## 4. Les conclusions du tableau de déduction

| Conclusion | Indices à rattacher | Sens |
|---|---|---|
| **C1. Il est mort avant 21h05** | I01 + I10 (+ I14) | Corps déjà là avant la pluie. |
| **C2. L'heure de la montre est fausse et voulue** | I02 + I12 | Heure réglée à la main sur l'heure de la photo. |
| **C3. Le gant est celui d'Odile Quéré** | I03 + I11 (+ I12) | Lambeau, gant gauche, manteau sorti. |
| **C4. Odile avait un mobile et un rendez-vous** | I06 + I08 (+ témoignage de Mathilde sur 20h20) | Compte vidé, lettre de banque, rendez-vous à 20h50 sur l'escalier. |

C4 s'appuie sur des indices de contexte, pas sur un indice décisif : les 3 indices décisifs de la bible restent I01, I02, I03.

Écartement des suspects : chaque suspect a un statut *Possible / Écarté* que le joueur règle en rattachant l'alibi (I13, I14, I15, I12). Le jeu n'impose rien : c'est une aide de réflexion.

## 5. Système d'aide à 4 niveaux (jamais bloquant)

| Niveau | Nom | Contenu | Coût |
|---|---|---|---|
| 1 | **Cap** | Où j'en suis : ce que j'ai établi, ce que je n'ai pas encore visité. | Gratuit |
| 2 | **Piste** | Le lieu ou le suspect à revoir, sans dire pourquoi. | 1 point |
| 3 | **Coup de pouce** | Le prochain indice à relier et la conclusion qui en sort. | 2 points |
| 4 | **Révélation** | La conclusion à établir et les indices exacts à y rattacher, sans nommer le coupable. | 3 points |

- Les aides n'affectent que le rang final, jamais la fin.
- Après 10 min sans nouvel indice, le bouton « Aide » pulse doucement.

## 6. Les quatre fins

| Fin | Condition | Écran |
|---|---|---|
| **A. Coupable trouvé** | Accuser Odile Quéré, avec C3 + C1 ou C2 | Reconstitution pas à pas, aveu, rang |
| **B. Mauvaise accusation** | Accuser Solange, Lucien, Mathilde ou Salaün | L'innocent est relâché après examen, le vrai coupable s'échappe. Option « Rouvrir le dossier » |
| **C. Preuves insuffisantes** | Accuser Odile sans C3, ou sans C1 ni C2 | Le juge refuse le dossier. Option « Reprendre l'enquête » |
| **D. Le piège de la montre** | Accuser Yann Kerbrat | Yann est inculpé sur l'heure de la montre, scène finale sur ce piège. Option « Rouvrir le dossier » |

Le rang (1 à 3 étoiles) ne concerne que la fin A :
- Base : 4 conclusions et les 3 alibis vérifiés (I13, I14, I15) = 3★ ; sinon 2★.
- Aide : jusqu'à 3 points, rien. De 4 à 12 points, −1★. Au-delà de 12 points, −2★ (plancher 1★).

## 7. Wireframes (écrans, portrait)

**E1. Accueil**
```
+---------------------------+
|     LA DERNIÈRE PÊCHE     |
|  Port-Karreg · 1987       |
|      [illustration SVG]   |
|  [ Nouvelle enquête ]     |
|  [ Reprendre ]            |
|  [ Options ]  [ Crédits ] |
+---------------------------+
```

**E2. Briefing**
```
+---------------------------+
| Dimanche 15/11, 01h15     |
| Texte court : situation   |
| (victime, lieu, mission)  |
|      [ Commencer ]        |
+---------------------------+
```

**E3. Carte des lieux (hub)**
```
+---------------------------+
| ☰ Dossier   ❓ Aide  ⚙   |
+---------------------------+
|  [ Cour ]      [ Bureau ] |
|  [ Salle ]   [ Vestiaire ]|
|  [ Chaufferie ] 🔒 [..]   |
+---------------------------+
| Pistes ouvertes (2)       |
|  · Bassin : eau trouble   |
|  · Parler à Mme Quéré     |
+---------------------------+
```

**E4. Scène (inspection)**
```
+---------------------------+
| ← Cour                    |
| [ illustration SVG ]      |
| Éléments à examiner :     |
|  ○ Le corps               |
|  ○ Escalier métallique    |
|  ○ Bassin d'eau de mer    |
|  ○ Lampadaire             |
+---------------------------+
```

**E5. Fiche d'objet / indice**
```
+---------------------------+
| ← Retour    Indice I02    |
| [ gros plan SVG ]         |
| Texte descriptif court    |
| [ Ajouter au dossier ]    |
+---------------------------+
```

**E6. Interrogatoire**
```
+---------------------------+
| ← Odile Quéré, notaire    |
| [ portrait ]  attitude: ◐ |
| « Texte de la réponse »   |
+---------------------------+
| ▸ Où étiez-vous à 20h50 ? |
| ▸ Parlez-moi de Gaspard   |
| ▸ Creuser 🔒 (piste)      |
| ▸ Présenter une pièce     |
+---------------------------+
```

**E7. Dossier d'indices**
```
+---------------------------+
| Indices (11/15)  [filtre] |
| ● I01 Sol sec     Cour    |
| ● I02 Montre      Corps   |
| ○ I03 (non lu)            |
+---------------------------+
```

**E8. Dossier suspects**
```
+---------------------------+
| [S][L][O][Y][M][D]        |
| Odile Quéré               |
| Mobile / Déclarations     |
| ⚠ Contradiction : salle   |
|   vs vestiaire            |
| Statut : ◉ Possible       |
+---------------------------+
```

**E9. Tableau de déduction**
```
+---------------------------+
| C1 Mort avant 21h05  ✓/✗  |
|  [ I01 ] [ I10 ] [ + ]    |
| C2 Montre falsifiée       |
|  [ I02 ] [ I12 ] [ + ]    |
| C3 Gant d'Odile           |
|  [ I03 ] [ I11 ] [ + ]    |
| C4 Mobile et rendez-vous  |
|  [ I06 ] [ I08 ] [ + ]    |
|        [ Vérifier ]       |
+---------------------------+
```

**E10. Aide**
```
+---------------------------+
| ❓ Aide                    |
| [ 1 Cap ]    gratuit      |
| [ 2 Piste ]  −1           |
| [ 3 Coup de pouce ] −2    |
| [ 4 Révélation ]    −3    |
+---------------------------+
```

**E11. Accusation**
```
+---------------------------+
| Qui accusez-vous ?        |
| (S)(L)(O)(Y)(M)(D)        |
| Preuves (4 max) :         |
| [C1] [C2] [C3] [C4]       |
|      [ Accuser ]          |
+---------------------------+
```

**E11b. Confrontation (acte 4)**
```
+---------------------------+
| Odile Quéré               |
| « Je n'ai pas quitté la   |
|   salle. »                |
| Brisées : 0/4             |
| [ Présenter une pièce ]   |
+---------------------------+
```

**E12. Fin**
```
+---------------------------+
| Fin A / B / C / D         |
| Texte de reconstitution   |
| ★★☆  Rang                 |
| [ Rejouer ] [ Partager ]  |
+---------------------------+
```

**E13. Options** : texte plus grand, sons on/off, effacer la sauvegarde, version du jeu.

## 8. Direction artistique

- **Ambiance** : polar de 1987, nuit bretonne, lumière sodium orange sur bleu nuit.
- **Palette** : `#0f1b2d` (nuit), `#e8a33d` (sodium), `#f2ead8` (papier dossier), `#9a2b2b` (preuve), `#2c4a52` (gris-vert mer).
- **Typographies** : polices système uniquement. Serif pour les dossiers, monospace type machine à écrire pour les rapports.
- **Illustrations** : SVG faits main, un par lieu (8), un portrait par suspect (6), un gros plan par indice clé. Style à aplats, sobre.
- **Animations** : fondus, tampon « INDICE » sur le dossier, léger grain. Rien d'obligatoire, tout désactivable.
- **Sons** : optionnels, générés par le navigateur (pas de fichier externe).
- **Droits** : tout est créé, aucune image ni police externe. Liste des licences livrée à l'étape 5.

## 9. Format « affaire en données »

```
affaire = {
  id, titre, epoque, version,
  lieux:[{id, nom, svg, elements:[{id, indice?}]}],
  personnages:[{id, nom, portrait, paliers:[{questions:[...]}]}],
  indices:[{id, type, lieu, texte, liens:[...]}],
  conclusions:[{id, requis:[...]}],
  fins:{A:{...}, B:{...}, C:{...}},
  deblocages:[{quand:{indice}, ouvre:lieu_ou_palier, message}]
}
```

Les parties moteur ne lisent que ce bloc.

## 10. Contrôle « joueur de mauvaise foi »

| Risque | Parade |
|---|---|
| Un verrou n'est pas annoncé. | Chaque déblocage a un `message` et une entrée dans « Pistes ouvertes ». |
| Le joueur accuse sans enquêter. | Fin C (preuves insuffisantes), sans blocage de partie. |
| Le joueur reste coincé. | Aide 1 gratuite, bouton qui pulse, aides 3 et 4 qui désignent l'indice. |
| Faire chanter le jeu en spammant « Vérifier ». | « Vérifier » ne dit que cohérent ou non, par conclusion, jamais la solution. |
| Sauvegarde cassée par une mise à jour. | Version de schéma + migration, abandon propre vers l'accueil si illisible. |

## 11. À valider avant l'étape 3 (code)

- Les 4 actes (dont la confrontation) et leur déblocage par pistes écrites : OK ?
- L'aide à 4 niveaux avec le rang à étoiles : OK ?
- Les 4 conclusions (C4 = mobile et rendez-vous) et les 4 fins (D = piège de la montre) : OK ?
- La direction artistique (nuit, sodium, papier) : OK ?
- Les 14 écrans : un écran à ajouter ou retirer ?
