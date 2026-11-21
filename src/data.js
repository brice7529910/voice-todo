/* ===== AFFAIRE : « La Dernière Pêche » — toutes les données de l'enquête ===== */
const AFFAIRE = {
id: 'derniere-peche', titre: 'La Dernière Pêche', version: '2.0',
fausses: ['I04','I05','I07'],
briefing: [
`Dimanche 15 novembre 1987, 01h15. Douarnenez, Finistère. Au fond du Port-Rhu, la conserverie Morvan fait face à l'île Tristan.`,
`Vous êtes le lieutenant Maël Kerdraon, police judiciaire de Quimper. On vous a tiré du lit.`,
`Gaspard Morvan, patron de la conserverie Morvan, a été retrouvé mort à 23h40 au pied de l'escalier de son bureau, en plein dîner annuel de l'usine. Le médecin de la famille parle d'une chute. Sa montre est brisée sur 23h10.`,
`Dans cette ville, les conserveries ont une mémoire : en novembre 1924, les ouvrières ont fait grève pour un franc de l'heure. Les Morvan ne l'ont jamais oublié.`,
`Six personnes étaient proches de lui ce soir-là. Une chute… ou pas ? Vous avez la nuit.`
],
lieux: [
{id:'cour',nom:'La cour',acte:1,requiert:[],desc:`La cour de l'usine, minuit passé. Un ruban de gendarmerie, une lumière orange qui tombe sur les dalles.`,
 elements:[
 {id:'sol',nom:'Le sol sous le corps',indice:'I01'},
 {id:'montre',nom:'La montre au poignet',indice:'I02'},
 {id:'main',nom:'La main droite',indice:'I03'},
 {id:'escalier',nom:`L'escalier métallique et la passerelle`,texte:`Douze marches de fer, puis une passerelle devant la porte du bureau. Sur la passerelle, un mégot de cigare écrasé, encore humide. C'est là que Gaspard fumait chaque soir.`},
 {id:'ampoule',nom:`L'ampoule du pied d'escalier`,texte:`Elle n'est pas grillée : le culot est intact, le verre propre. Quelqu'un l'a dévissée à la main.`},
 {id:'bassin',nom:`Le bassin d'eau de mer`,indice:'I09',requiert:['calePorte'],apparait:`Nouvel élément dans la cour : le bassin d'eau de mer.`},
 {id:'veste',nom:`La veste du mort`,requiert:['veste'],texte:`Dans la poche intérieure : un dictaphone à micro-cassette, la touche d'enregistrement enfoncée. Il fonctionne au son : il n'enregistre que lorsqu'il entend du bruit. La cassette est intacte. Il vous faut un magnétophone pour l'écouter, et la gendarmerie en a un.`,flags:['cassette'],suite:`Le magnétophone de la gendarmerie peut lire la cassette. Nouvel élément dans la camionnette de la gendarmerie.`}
 ]},
{id:'bureau',nom:'Le bureau de Gaspard',acte:1,requiert:[],desc:`Premier étage. Un fauteuil de cuir, une odeur de cigare froid. La porte donne sur la passerelle.`,
 elements:[
 {id:'agenda',nom:`L'agenda`,indice:'I08'},
 {id:'lettre',nom:`La lettre de la banque`,indice:'I06'},
 {id:'tiroir',nom:`Le tiroir du bureau`,indice:'I07'},
 {id:'porte',nom:`La porte sur la passerelle`,texte:`La porte donne sur la passerelle. D'habitude elle reste ouverte, calée par une statuette de bronze en forme de sardine, un trophée de la Conserve d'Or, dit Lucien. Aujourd'hui elle est fermée. Le cale-porte a disparu.`,flags:['calePorte']},
 {id:'fauteuil',nom:`Le fauteuil et le cendrier`,texte:`Fauteuil de cuir. Cendrier propre : Gaspard fumait dehors. Au mur, une photo de l'usine en 1962, avec la sardine de bronze posée sur un coin de bureau.`},
 {id:'cadre',nom:`La photo encadrée au mur`,texte:`Novembre 1924. Des ouvrières en tablier devant l'usine Morvan, le poing levé, une pancarte : « Un franc de l'heure ». Au dos, de la main de Gaspard : « Maman, pendant la grève. » Il a gardé cette photo trente ans dans son bureau.`},
 {id:'coffre',nom:`Le coffre mural`,ecran:'coffre'},
 {id:'dos',nom:`Le dos de l'agenda`,requiert:['i:I08'],ecran:'chiffre'}
 ]},
{id:'salle',nom:'La salle des fêtes',acte:2,requiert:['d:acte2'],verrou:`Examinez d'abord le corps : le sol, la montre, la main droite.`,desc:`Les tables sont encore dressées. Les invités attendent, fatigués, sous une banderole « Dernière Pêche 1987 ».`,
 elements:[
 {id:'programme',nom:`Le programme imprimé`,texte:`Programme : 19h30 apéritif. 20h00 dîner. 23h00 toast de la Dernière Pêche et photo officielle devant la banderole.`},
 {id:'place',nom:`La place de Gaspard`,texte:`La place du patron, au milieu de la table. Le plat principal n'a jamais été touché. La serviette est pliée.`},
 {id:'photos',nom:`Les tirages de Gwenn`,requiert:['i:I12'],ecran:'photo'}
 ],
 persos:['solange','lucien','odile','yann','mathilde','salaun','gwenn','legoff']},
{id:'vestiaire',nom:'Le vestiaire',acte:2,requiert:['d:acte2'],verrou:`Examinez d'abord le corps : le sol, la montre, la main droite.`,desc:`À droite de l'entrée de la salle. Des manteaux humides sur des cintres numérotés. Jeanne tient le registre.`,
 elements:[
 {id:'m3',nom:`Manteau n°3 (M. Le Goff)`,texte:`Le manteau de l'adjoint au maire. Un parapluie, les clés de la mairie. Rien d'utile.`},
 {id:'m7',nom:`Manteau n°7 (Mme Morvan)`,indice:'I18'},
 {id:'m9',nom:`Manteau n°9 (Lucien Morvan)`,texte:`Une clé à molette, un pansement imbibé de sang.`},
 {id:'m12',nom:`Manteau n°12 (Mathilde Rouat)`,texte:`Des moufles en laine beige, un mouchoir, un carnet de sténo.`},
 {id:'m14',nom:`Manteau n°14 (Me Quéré)`,indice:'I11'},
 {id:'m17',nom:`Manteau n°17 (Dr Salaün)`,texte:`Une mallette de médecin, une flasque de cognac vide.`},
 {id:'m21',nom:`Manteau n°21 (Yann Kerbrat)`,texte:`Un chiffon gras, une clé de chaufferie, une cale à roulette.`}
 ],
 persos:['jeanne']},
{id:'gendarmerie',nom:'La gendarmerie (camionnette)',acte:2,requiert:['d:acte2'],verrou:`Examinez d'abord le corps : le sol, la montre, la main droite.`,desc:`Une camionnette de la brigade garée dans la cour, un projecteur, un magnétophone, un dossier ouvert sur la tablette.`,
 elements:[
 {id:'magneto',nom:`Le magnétophone`,requiert:['cassette'],ecran:'cassette'},
 {id:'rapport',nom:`Le rapport du médecin légiste`,indice:'I17'},
 {id:'pv',nom:`Le procès-verbal de garde à vue de Yann`,requiert:['d:yann'],texte:`Procès-verbal du commandant Lorec : « Yann Kerbrat, contremaître, placé en garde à vue à 02h00. Motifs : montre arrêtée sur 23h10, ronde de nuit sans témoin, a découvert le corps, détention de caisses de sardines hors stock. » Le juge d'instruction passe à midi.`}
 ],
 persos:['lorec']},
{id:'chaufferie',nom:'La chaufferie',acte:3,requiert:['d:acte3'],verrou:`Interrogez d'abord Lucien, Yann, Mathilde et le Dr Salaün (leur version officielle).`,desc:`Ferraille, chaleur, odeur de saumure. La salle des machines et la chaudière de l'usine.`,
 elements:[
 {id:'journal',nom:`Le journal du compresseur`,indice:'I13'},
 {id:'caisses',nom:`Les caisses et le cahier de rondes`,indice:'I04'},
 {id:'meteo',nom:`Le cahier météo`,indice:'I10'},
 {id:'chaudiere',nom:`La chaudière`,texte:`La chaudière tourne. Dans les cendres tièdes : un bouton-pression doré, tordu par la chaleur, et des fibres de cuir carbonisé. Quelqu'un a brûlé un gant ici.`}
 ]},
{id:'compta',nom:'La compta',acte:3,requiert:['d:acte3'],verrou:`Interrogez d'abord Lucien, Yann, Mathilde et le Dr Salaün (leur version officielle).`,desc:`Rez-de-chaussée du bâtiment des bureaux, juste sous l'escalier métallique.`,
 elements:[
 {id:'telephone',nom:`Le téléphone et le carnet des communications`,texte:`Le carnet est ouvert à samedi : « Brest, Agnès — 20h50 → 20h56 », de l'écriture de Mathilde. Vous pouvez appeler Agnès.`,flags:['agnes'],apparait:`Vous pouvez maintenant appeler Agnès, la sœur de Mathilde.`},
 {id:'machine',nom:`La machine à écrire`,texte:`Le compte rendu du dîner, tapé jusqu'au discours de 20h30. Rien après. Au-dessus de la machine, un plafond en tôle : tout ce qui tombe sur l'escalier métallique s'entend ici.`}
 ],
 persos:['agnes']},
{id:'infirmerie',nom:`L'infirmerie`,acte:3,requiert:['d:acte3'],verrou:`Interrogez d'abord Lucien, Yann, Mathilde et le Dr Salaün (leur version officielle).`,desc:`Un lit étroit, une armoire à pharmacie, une odeur d'alcool.`,
 elements:[
 {id:'registre',nom:`Le registre de l'infirmerie`,indice:'I15'},
 {id:'table',nom:`La table de soins`,texte:`Des compresses sanglantes et du fil de suture. Quelqu'un a été soigné ici ce soir.`}
 ],
 persos:['cozic']}
],

indices: {
I01:{titre:`Sol sec sous le corps`,type:'D',lieu:'Cour',ico:'sol',texte:`Gaspard Morvan est allongé face contre terre au pied de l'escalier métallique. Sous sa poitrine et ses jambes, les dalles sont sèches. Tout autour, elles sont mouillées. Le dos de sa veste est trempé. La cour est noire : l'ampoule du pied d'escalier est éteinte.`},
I02:{titre:`La montre brisée`,type:'D',lieu:'Cour',ico:'montre',texte:`Montre-bracelet mécanique, poignet gauche. Le verre est brisé, les aiguilles arrêtées sur 23h10. À la loupe : la couronne est tirée en position de réglage. Le mouvement ne porte aucune trace de choc, les aiguilles ne sont pas faussées. Quelqu'un a réglé cette montre à la main avant de la briser.`},
I03:{titre:`Lambeau de cuir beige`,type:'D',lieu:'Cour',ico:'gant',texte:`La main droite du mort est crispée. Entre les doigts : un lambeau de cuir de chevreau beige, arraché d'un gant. Sur la doublure, un fragment d'estampille : « …IVOAL — QUIM… ».`},
I04:{titre:`Caisses hors stock et cahier de rondes`,type:'F',lieu:'Chaufferie',ico:'caisse',texte:`Dix caisses de sardines sans étiquette, rangées derrière la cuve. Le cahier de rondes de Yann dit : « 23h00 — début de ronde ». Aucune mention de la cour avant 23h40.`},
I05:{titre:`Dispute Gaspard / Lucien`,type:'F',lieu:'Salle',ico:'papier',texte:`À 20h40, dans le couloir, Gaspard traite son fils d'incapable. Lucien répond : « Tu vas me tuer avec cette vente. » Témoins : Mathilde et une serveuse. Sur la manchette droite de Lucien : une tache brune.`},
I06:{titre:`Compte « Prévoyance Morvan » vidé`,type:'F',lieu:'Bureau',ico:'papier',texte:`Lettre de la banque Ouest-Armor, datée de jeudi : le compte de la caisse de prévoyance des ouvriers est à zéro. Relevés : six virements en un an, contresignés « G. Morvan » (la signature a l'air raide). Écritures passées de la main de Mathilde Rouat, sur courrier de l'Étude Quéré. Dans la marge, de la main de Gaspard : « Qui a signé ça ? Pas moi. »`},
I07:{titre:`Reconnaissance de dette du Dr Salaün`,type:'F',lieu:'Bureau',ico:'papier',texte:`Dans le tiroir : une reconnaissance de dette de 200 000 F signée par le Dr Salaün, datée d'il y a deux ans. Un post-it de Gaspard : « Lundi, cabinet. »`},
I08:{titre:`Agenda de Gaspard`,type:'C',lieu:'Bureau',ico:'papier',texte:`Agenda ouvert à samedi. À la ligne de 20h50, de l'écriture pressée de Gaspard : « Régler ça. Escalier. » Pas de nom.`},
I09:{titre:`La sardine de bronze`,type:'C',lieu:'Cour',ico:'bronze',texte:`Au fond du bassin d'eau de mer : la statuette de bronze qui cale d'habitude la porte du bureau, une sardine d'un kilo. Du sang et quelques cheveux gris sur le socle. C'est l'arme. Gravé sur le socle : « Conserve d'Or 1962 ».`},
I10:{titre:`La pluie de 21h05 à 22h30`,type:'C',lieu:'Chaufferie / Vestiaire',ico:'pluie',texte:`Cahier météo de Yann : « 14/11 — pluie de 21h05 à 22h30. » Jeanne, au vestiaire, le confirme : un invité est entré à 21h05 en secouant son parapluie.`},
I11:{titre:`Manteau n°14 (Me Quéré)`,type:'C',lieu:'Vestiaire',ico:'manteau',texte:`Sur le ticket n°14, Jeanne a noté : « sorti 20h48 — rentré 21h10 ». Les épaules du manteau sont trempées. Dans une poche : un gant gauche beige, en chevreau. À l'intérieur, l'estampille : « RIVOAL — QUIMPER ». Pas de gant droit.`},
I12:{titre:`Carnet du photographe`,type:'C',lieu:'Salle',ico:'photo',texte:`Photo 1 : le perron, 19h50. Me Quéré porte des gants beiges, Mme Morvan des gants noirs en dentelle. Photo 2 : le toast officiel, de 23h08 à 23h12. Sur le cliché : Mme Morvan, Lucien, Me Quéré (mains nues), Mathilde, le Dr Salaün. Absents : Gaspard et Yann.`},
I13:{titre:`Journal du compresseur`,type:'C',lieu:'Chaufferie',ico:'journal',texte:`Panne à 20h48. Intervention de Lucien Morvan et Yann Kerbrat. Remise en route manuelle à 20h57. Fin de l'intervention à 21h20. Signé Y.K. Dans la salle des machines : des compresses tachées de sang, celles de la main de Lucien.`},
I14:{titre:`Appel de Mathilde et bruit à 20h53`,type:'C',lieu:'Compta',ico:'telephone',texte:`Carnet des communications : « Brest, Agnès — 20h50 → 20h56 ». Agnès confirme l'appel et dit avoir entendu, vers 20h53, un bruit sourd puis un cri bref.`},
I15:{titre:`Registre de l'infirmerie`,type:'C',lieu:'Infirmerie',ico:'registre',texte:`Registre : « H. Cozic — coupure à la main — Dr Salaün — 20h50 → 21h10 ». Cozic le confirme.`},
I16:{titre:`La cassette du dictaphone`,type:'C',lieu:'Gendarmerie',ico:'cassette',texte:`Segments décodés : (1) Gaspard dicte à 20h46 : le compte est vide, quelqu'un a signé à sa place, il a demandé à cette personne de le rejoindre. (2) Des pas de talons montent l'escalier de fer. (3) « Ah. Vous voilà. », une voix étouffée, puis un coup sourd. (4) Des talons redescendent, une couronne de montre grince, un verre se brise. (5) L'église sonne neuf coups : 21h. (6) La pluie commence, le dictaphone est resté dehors, dans la poche du mort.`},
I17:{titre:`Rapport du médecin légiste`,type:'C',lieu:'Gendarmerie',ico:'registre',texte:`Plaie à la tempe gauche, objet lourd et arrondi, coup porté de face par une personne qui lui faisait face. Fibres de cuir beige sous les ongles de la main droite. Mort en quelques minutes, avant la chute dans l'escalier. Heure estimée : entre 20h30 et 22h30 (froid et pluie ont brouillé les repères).`},
I18:{titre:`Gants noirs de Mme Morvan, intacts`,type:'F',lieu:'Vestiaire',ico:'manteau',texte:`Manteau n°7. Dans les poches : un paquet de cigarettes entamé, un briquet, une paire de gants noirs en dentelle. Les gants sont propres, sans trace de brûlure ni de cendre.`},
I19:{titre:`Brouillon de lettre au juge`,type:'C',lieu:'Bureau',ico:'papier',texte:`Dans le coffre : un brouillon de lettre au juge d'instruction, de la main de Gaspard. « Des virements portent ma signature. Je ne les ai jamais signés. Seuls trois dossiers contiennent un spécimen de ma signature : la banque, l'usine et l'Étude de mon notaire. Je saurai lundi qui a menti. »`},
I20:{titre:`Écorchure sur la main d'Odile`,type:'C',lieu:'Salle',ico:'photo',texte:`Sur la photo du toast (23h10), Me Quéré tient son verre de la main gauche. Le dos de sa main droite porte une écorchure fraîche : trois traits parallèles, comme des ongles.`},
},
rangIndices: ['I01','I02','I03','I04','I05','I06','I07','I08','I09','I10','I11','I12','I13','I14','I15','I16','I17','I18','I19','I20'],

persos: {
solange:{nom:'Solange Morvan',role:'Épouse de la victime, 61 ans',lieu:'salle',look:{peau:'#e8c9a8',cheveux:'#9aa0a6',style:'chignon',tenue:'#2b2b3a',accent:'#6b5b95'},
 pub:`Mobile apparent : Gaspard vient de vendre l'usine sans lui en parler.`,
 intro:`Elle serre son sac à deux mains. Ses yeux sont rouges.`,
 p1:[
 {id:'1',q:`Où étiez-vous entre 20h45 et 21h10 ?`,r:`Aux toilettes dames. J'avais besoin d'être seule. Mon mari venait d'annoncer la vente devant tout le monde, sans m'en dire un mot.`,note:`Dit avoir été aux toilettes dames de 20h45 à 21h10.`},
 {id:'2',q:`Que pensez-vous de la vente ?`,r:`Trente ans à tenir cette maison avec lui. Et je l'apprends comme les autres, entre la terrine et le plat. Voilà.`},
 {id:'3',q:`Votre mari avait-il des ennemis ?`,r:`Des gens qui le détestaient, oui. Qui l'auraient tué… Demandez à Yann. Ou à mon fils. Ils se sont assez disputés avec lui.`},
 {id:'4',q:`Quand l'avez-vous vu pour la dernière fois ?`,r:`À 20h45, quand il a quitté la salle. Il allait fumer son cigare sur la passerelle, comme chaque soir.`,note:`A vu son mari quitter la salle à 20h45.`}
 ],
 verrou2:`Elle ment sur un point. Il vous manque un témoin qui l'a vue passer. Au vestiaire, on note qui va et vient.`,req2:'solangeQuai',
 p2:[
 {id:'5',q:`Jeanne vous a vue passer par la porte du quai de chargement. Pas aux toilettes.`,r:`…Bon. J'étais sur le quai. Je fumais. J'ai arrêté il y a dix ans, ce soir je n'en pouvais plus. De là-bas, on voit la cour, l'escalier et la fenêtre de la compta.`,flags:['solangeVoit']},
 {id:'6',q:`Qu'avez-vous vu depuis le quai ?`,requiert:['solangeVoit'],r:`Vers 20h50, quelqu'un a traversé la cour vers l'escalier. Un long manteau clair. Pas le visage : il faisait noir, l'ampoule du bas ne marchait pas. Il ne pleuvait pas encore.`,note:`Vers 20h50, a vu une silhouette en long manteau clair traverser la cour vers l'escalier.`,flags:['manteauClair']},
 {id:'7',q:`Pourquoi surveilliez-vous la fenêtre de la compta ?`,requiert:['solangeVoit'],r:`Parce que je savais pour mon mari et cette petite Rouat. Depuis des mois. Je ne l'ai jamais dit à personne.`,flags:['liaison']},
 {id:'8',q:`Pourquoi avouez-vous ?`,requiert:['d:aveu'],r:`Parce que mon fils avait la main ouverte et que quelqu'un a crié à 20h53. Je préfère que ce soit moi. Une mère, ça fait ça.`,flags:['solangeProtege']},
 {id:'9',q:`Votre aveu ne tient pas. Vous avez avoué pour Lucien.`,requiert:['d:aveuBrise'],r:`…Je l'ai vu sortir de la chaufferie la main en sang, vers 21h. J'ai cru le pire. Je n'ai jamais touché à Gaspard. Je n'ai même pas pu monter cet escalier : mes genoux.`}
 ],
 react:{
 I12:{r:`Mes gants noirs ? Oui, je les portais. Je les ai enlevés pour fumer.`},
 I03:{r:`Un gant beige. Les miens sont noirs. Je ne vois pas ce que ça a à voir avec moi.`},
 I06:{r:`Les comptes de l'usine ? Gaspard ne me disait rien, je vous l'ai dit.`},
 I18:{r:`Mes gants noirs, dans mon manteau. Je les ai gardés dans ma poche toute la soirée.`},
 I17:{r:`Un coup de face, dites-vous. Alors il a vu qui le frappait. Je ne veux pas y penser.`}
 },
 defaut:`Elle secoue la tête. Elle ne comprend pas le rapport.`},

lucien:{nom:'Lucien Morvan',role:'Fils de la victime, directeur de l\'usine, 34 ans',lieu:'salle',look:{peau:'#e2bf9b',cheveux:'#3a2b20',style:'court',tenue:'#3a4a5c',accent:'#c0453f'},
 pub:`Mobile apparent : la vente l'écarte de la direction. Humilié en public ce soir.`,
 intro:`Un pansement à la main droite. Il se tient droit, mâchoires serrées.`,
 p1:[
 {id:'1',q:`Où étiez-vous à 20h50 ?`,r:`Dans la salle des machines. Yann est venu me chercher à 20h47, le compresseur avait lâché. J'y suis resté jusqu'à 21h20.`,note:`Dit être à la salle des machines avec Yann de 20h47 à 21h20.`},
 {id:'2',q:`Vous vous êtes disputé avec votre père.`,r:`Oui. Dans le couloir, à 20h40. Il m'a traité d'incapable devant Mathilde et une serveuse. J'ai dit : « Tu vas me tuer avec cette vente. » Au figuré, évidemment.`,donne:['I05']},
 {id:'3',q:`Que devenez-vous après la vente ?`,r:`Rien. Le groupe garde ses propres cadres. Mon père le savait.`},
 {id:'7',q:`Que représente cette usine pour votre famille ?`,r:`Ma grand-mère y mettait les sardines en boîte. Elle a fait la grève de 1924, un franc de l'heure. Papa a passé sa vie à devenir le patron qu'on avait combattu. Il ne s'est jamais pardonné ça. Moi non plus.`},
 {id:'4',q:`Cette tache sur votre manchette ?`,r:`Ma main. Je me suis ouverte le dos de la main sur le carter du compresseur, à 20h57. Regardez.`}
 ],
 verrou2:`Il vous manque un document sur les comptes de l'usine. Cherchez dans le bureau de Gaspard.`,req2:'i:I06',
 p2:[
 {id:'5',q:`Votre père cherchait qui avait vidé la caisse de prévoyance ?`,r:`Il m'en a parlé jeudi. Il croyait d'abord que c'était moi. Puis il s'est mis à douter de tout le monde.`,flags:['gaspardCherchait']},
 {id:'6',q:`Vous parliez en secret avec un concurrent ?`,r:`Armor-Pêche m'a approché en septembre. Je n'ai rien signé. Je voulais savoir ce que mon père me cachait.`}
 ],
 react:{
 I05:{r:`Je n'en suis pas fier. Mais lui non plus.`},
 I13:{r:`Voilà. Je n'ai pas bougé de là-bas de toute la soirée.`},
 I06:{r:`La prévoyance… Papa m'en a parlé jeudi. Il cherchait le coupable.`}
 },
 defaut:`Il hausse les épaules. Il n'a rien à ajouter.`},

odile:{nom:'Me Odile Quéré',role:'Notaire, 45 ans',lieu:'salle',look:{peau:'#ecd3bb',cheveux:'#5b3a2a',style:'carre',tenue:'#7a6a55',accent:'#b9955a'},
 pub:`Mobile apparent : gère la vente et la caisse de prévoyance des ouvriers.`,
 intro:`Tailleur beige, tenue irréprochable. Elle ajuste ses manchettes.`,
 p1:[
 {id:'1',q:`Où étiez-vous entre 20h45 et 21h10 ?`,r:`Dans la salle, avec l'adjoint au maire. Sauf cinq minutes aux toilettes dames. Vous n'imaginez pas le monde qu'il y avait.`,note:`Dit ne pas avoir quitté la salle, sauf 5 minutes aux toilettes.`},
 {id:'2',q:`Quels étaient vos liens avec Gaspard ?`,r:`Je suis son notaire depuis quinze ans. Mon étude est à Tréboul. Je m'occupe de la vente et de la caisse de prévoyance des ouvriers. Un client. Presque un ami.`},
 {id:'3',q:`Vous a-t-il parlé ce soir ?`,r:`Au buffet, deux mots sur l'horaire de la signature de lundi. Rien d'autre.`,note:`Dit n'avoir échangé que deux mots sur l'horaire de lundi.`},
 {id:'4',q:`Avez-vous vu quelqu'un près de l'escalier ?`,r:`Je ne suis pas sortie de la salle. Je ne vois pas comment j'aurais pu.`}
 ],
 verrou2:`Elle tient sa version. Il vous manque un fait sur son manteau. Cherchez au vestiaire.`,req2:'i:I11',
 p2:[
 {id:'5',q:`Votre manteau a été sorti du vestiaire à 20h48.`,r:`Ah. Oui. J'ai pris l'air deux minutes devant la porte, il faisait chaud. Je n'ai pas pensé que c'était utile de le dire.`,flags:['odileSortie']},
 {id:'6',q:`Pourquoi les épaules de votre manteau étaient-elles trempées ?`,requiert:['odileSortie'],r:`La pluie, évidemment. Je suis rentrée à 21h10, il pleuvait déjà.`},
 {id:'7',q:`Et vos gants beiges, sur la photo du perron ?`,requiert:['i:I12'],r:`Je les ai perdus. Dans ma voiture, probablement. Je suis distraite avec ça.`}
 ],
 react:{
 I03:{r:`Un morceau de gant. Il y a des milliers de gants beiges en Bretagne, lieutenant.`},
 I11:{r:`Mon gant gauche. Je l'avais oublié dans ma poche, et alors ? Je ne comprends pas où vous voulez en venir.`},
 I06:{r:`Les comptes de la prévoyance ? Une erreur de la secrétaire, sûrement. Vérifiez auprès de Mme Rouat.`},
 I08:{r:`20h50, l'escalier… Je n'y étais pas. Gaspard avait de nombreux rendez-vous.`},
 I12:{r:`Une photo ? Oui, j'ai ôté mes gants au toast. Il faisait chaud.`},
 I02:{r:`Une montre arrêtée sur 23h10. Je n'étais pas près de lui à ce moment-là. Toute la salle m'a vue.`},
 I16:{r:`Des talons. Toutes les femmes en portent, lieutenant. Vous en avez vu beaucoup, ce soir, de chaussures plates ?`},
 I17:{r:`Un coup porté de face. Il se laissait donc approcher. Cherchez quelqu'un qu'il attendait.`},
 I19:{r:`Un brouillon de lettre. Gaspard bluffait, il bluffait toujours. Une lettre non envoyée n'accuse personne.`},
 I20:{r:`Une écorchure ? Un fermoir de sac, une branche de la haie. Je ne m'en souviens pas.`}
 },
 defaut:`Elle vous regarde sans ciller. Elle attend la suite.`},

yann:{nom:'Yann Kerbrat',role:'Contremaître, 52 ans',lieu:'salle',look:{peau:'#d9b08c',cheveux:'#7a7a7a',style:'court',tenue:'#4a5a3a',accent:'#9b7b2b'},
 pub:`Mobile apparent : licenciements annoncés. A trouvé le corps.`,
 intro:`Il tient un café froid. Les mains noircies de graisse.`,
 p1:[
 {id:'1',q:`Où étiez-vous à 20h50 ?`,r:`À la salle des machines avec monsieur Lucien. Le compresseur, c'est mon rayon. À 20h48, en traversant la cour, j'ai vu le patron sur la passerelle, son cigare à la bouche.`,note:`Dit avoir vu Gaspard vivant sur la passerelle à 20h48.`},
 {id:'2',q:`C'est vous qui avez trouvé le corps.`,r:`À 23h40. Ma ronde de nuit, je finis toujours par la cour. Il était là, face contre terre. Je n'y ai pas touché. Je le jure.`},
 {id:'3',q:`Que pensiez-vous du patron ?`,r:`Trente ans que je lui donne mes mains. Il m'a promis un poste d'adjoint, puis il m'a annoncé des licenciements. Je ne l'aimais pas. Je ne l'ai pas tué.`},
 {id:'4',q:`Pourquoi n'étiez-vous pas sur la photo de 23h ?`,r:`Ma ronde commence à 23h pile. Quelqu'un doit surveiller l'usine pendant que les autres trinquent.`}
 ],
 verrou2:`Il vous manque une pièce sur ce qu'il fait à la chaufferie (acte 3).`,req2:'i:I04',
 p2:[
 {id:'5',q:`Dix caisses de sardines hors stock dans la chaufferie.`,r:`…Oui. Dix caisses par mois que je revends aux Halles. Les patrons font des millions, moi j'ai trente ans de poussière. Ne le dites pas au groupe acheteur.`,flags:['yannCaisses']},
 {id:'6',q:`Avez-vous vu quelque chose dans la cour en rentrant, vers 21h20 ?`,r:`En retraversant sous la pluie, j'ai vu une forme sombre au pied de l'escalier. J'ai cru à des sacs. Je n'ai pas regardé.`,note:`Vers 21h20, a vu une forme sombre au pied de l'escalier (sous la pluie).`}
 ],
 react:{
 I13:{r:`C'est mon écriture. Le compresseur, c'est ma vie.`},
 I04:{r:`Bon, d'accord. Mais ça n'a rien à voir avec le patron.`},
 I02:{r:`23h10 ? À cette heure-là je faisais ma ronde. Seul. Ça m'arrange pas, hein.`},
 I12:{r:`Je n'étais pas sur la photo. Je faisais ma ronde. Ça m'arrange pas, hein.`},
 I16:{r:`J'entends ma voix aux cloches ? Non. Mais je reconnais celle du patron. Il avait peur, à la fin.`}
 },
 defaut:`Il écarte les mains. Il n'a rien d'autre à dire.`},

mathilde:{nom:'Mathilde Rouat',role:'Secrétaire-comptable, 29 ans',lieu:'salle',look:{peau:'#efd5bd',cheveux:'#2b1d17',style:'long',tenue:'#7a2f3b',accent:'#e8a33d'},
 pub:`Mobile apparent : sa place disparaît avec la vente.`,
 intro:`Elle trie des papiers qu'elle a déjà triés trois fois.`,
 p1:[
 {id:'1',q:`Où étiez-vous à 20h50 ?`,r:`À la compta, au rez-de-chaussée, sous l'escalier. Je tapais le compte rendu du dîner pour Monsieur. J'ai aussi appelé ma sœur à Brest. Je le note toujours dans le carnet.`,note:`Dit être à la compta, avoir appelé sa sœur à Brest.`},
 {id:'2',q:`Quand avez-vous vu Gaspard pour la dernière fois ?`,r:`À 20h45, quand il a quitté la salle. Il m'a dit qu'il allait chercher des papiers. Il ne m'a pas regardée.`},
 {id:'3',q:`Avez-vous remarqué quelque chose entre Gaspard et un invité ?`,r:`À 20h20, au buffet, il a parlé à l'oreille de Maître Quéré. Elle a hoché la tête. Il avait l'air pressé de lui parler.`,note:`À 20h20, a vu Gaspard parler à l'oreille de Me Quéré, l'air pressé.`,flags:['mathildeVoitOdile']},
 {id:'4',q:`Que représentait-il pour vous ?`,r:`Mon patron.`}
 ],
 verrou2:`Elle est fermée. Il vous manque un document qu'elle a manipulé. Cherchez dans le bureau de Gaspard.`,req2:'i:I06',
 p2:[
 {id:'5',q:`Les virements de la prévoyance : c'est vous qui les avez passés.`,r:`Sur ordre. Chaque fois un courrier de l'Étude Quéré, avec la signature de Monsieur Morvan. Je ne vérifiais pas. Pourquoi j'aurais vérifié ?`,flags:['mathildeOrdres']},
 {id:'6',q:`Votre relation avec Gaspard.`,r:`On était ensemble depuis deux ans. À 19h30, il m'a dit que c'était fini, que la vente changeait tout. J'ai pleuré, puis j'ai travaillé. Je ne sais faire que ça.`},
 {id:'7',q:`Le bruit, vers 20h53 ?`,requiert:['i:I14'],r:`Un bruit sourd, puis un cri. J'ai pensé à une caisse. Je me le reproche, maintenant.`},
 {id:'8',q:`Avez-vous entendu des pas dans l'escalier ?`,requiert:['i:I16'],r:`Des talons, au-dessus de ma tête, vers 20h52. Des pas pressés. J'ai cru que c'était Madame. J'ai préféré ne pas savoir.`,note:`Vers 20h52, a entendu des talons monter l'escalier de fer. A cru que c'était Mme Morvan.`}
 ],
 react:{
 I06:{r:`Ces virements… je les ai passés, oui. Sur ordre.`},
 I14:{r:`Agnès vous l'a dit. Oui. J'étais au téléphone.`},
 I08:{r:`Son agenda. Je ne savais pas qu'il avait ce rendez-vous.`},
 I16:{r:`Ces talons… Oui. J'ai cru que c'était Madame. Je me suis tue, et je m'en veux.`}
 },
 defaut:`Elle baisse les yeux. Elle ne sait pas.`},

salaun:{nom:'Dr Étienne Salaün',role:'Médecin et ami de la victime, 55 ans',lieu:'salle',look:{peau:'#e7c5a5',cheveux:'#c9c9c9',style:'chauve',tenue:'#4a3a2b',accent:'#9a2b2b'},
 pub:`Mobile apparent : ami proche. A constaté le décès.`,
 intro:`Il tourne un verre vide entre ses doigts. Son haleine sent le cognac.`,
 p1:[
 {id:'1',q:`Où étiez-vous entre 20h45 et 21h10 ?`,r:`Dans la salle, avec Le Goff, l'adjoint au maire. Je n'ai pas bougé de ma chaise, sauf pour ma pipe.`,note:`Dit être resté dans la salle avec le maire.`},
 {id:'2',q:`Vous avez examiné le corps.`,r:`À minuit moins le quart. Le corps était froid, mouillé, il avait plu. Difficile d'être précis. La montre indiquait 23h10, j'ai estimé la mort vers 23h. Une chute, un coup à la tête.`,note:`A estimé la mort vers 23h, d'après la montre.`},
 {id:'3',q:`Vous étiez proche de Gaspard.`,r:`Trente ans d'amitié. C'est lui qui m'a installé ici. Je lui dois beaucoup.`},
 {id:'4',q:`Avez-vous remarqué quelque chose d'anormal ?`,r:`La cour était noire. L'ampoule du bas… elle avait toujours été capricieuse.`}
 ],
 verrou2:`Il tient sa version. Il vous manque un document sur ses dettes. Cherchez dans le bureau de Gaspard.`,req2:'i:I07',
 p2:[
 {id:'5',q:`200 000 francs de dette envers Gaspard.`,r:`Il me les a prêtés il y a deux ans. J'ai joué, j'ai perdu. Il m'avait dit lundi, au cabinet. Mais je ne l'aurais pas tué pour 200 000 francs.`,flags:['salaunDette']},
 {id:'6',q:`Vous n'étiez pas dans la salle. Vous étiez à l'infirmerie.`,requiert:['i:I15'],r:`…Le petit Cozic s'était ouvert la main sur une cisaille. Il travaille ici sans contrat. Si j'en parle, il perd tout. J'ai dit que j'étais dans la salle pour le protéger.`,flags:['salaunInfirmerie']}
 ],
 react:{
 I15:{r:`Le registre. Oui. J'ai menti pour Cozic.`},
 I02:{r:`Une montre brisée sur 23h10. Je m'y suis fié. J'aurais dû regarder le sol.`},
 I07:{r:`Cette reconnaissance… oui.`}
 },
 defaut:`Il hoche la tête. Il ne dit rien.`},

gwenn:{nom:'Gwenn Le Roux',role:'Photographe du journal local, 38 ans',lieu:'salle',look:{peau:'#e8cdb0',cheveux:'#c58a3b',style:'long',tenue:'#2f4a6b',accent:'#e8a33d'},
 pub:`Témoin : a photographié le dîner.`,
 intro:`Un appareil autour du cou et un carnet à spirale dans la poche.`,
 p1:[
 {id:'1',q:`Vous avez pris des photos ce soir ?`,r:`Deux séries. La première sur le perron à 19h50. La seconde, le toast officiel à 23h. Je note tout dans mon carnet, pour le journal. Tenez.`,donne:['I12']},
 {id:'2',q:`Qui était sur la photo de 23h ?`,r:`Tout le monde sauf le patron et Yann, le contremaître. Madame Quéré, Madame Morvan, Lucien, Mathilde, le docteur. Je les ai alignés devant la banderole, de 23h08 à 23h12.`},
 {id:'3',q:`Les gants des dames, sur la photo du perron ?`,requiert:['i:I03'],r:`Madame Quéré avait de beaux gants beiges, en chevreau. Madame Morvan, de la dentelle noire. Je remarque ce genre de chose, c'est mon métier.`}
 ],
 verrou2:``,req2:'nul',p2:[],
 react:{},defaut:`Elle feuillette son carnet. Rien de plus.`},

jeanne:{nom:'Jeanne Pichon',role:'Vestiaire et plonge, 24 ans',lieu:'vestiaire',look:{peau:'#f0d6bf',cheveux:'#8a3a2a',style:'queue',tenue:'#3a5a4a',accent:'#e8a33d'},
 pub:`Témoin : tient le registre du vestiaire.`,
 intro:`Un stylo derrière l'oreille, un registre sous le bras.`,
 p1:[
 {id:'1',q:`Vous notez les heures des manteaux ?`,r:`Oui, chef. Sur chaque ticket, l'heure de sortie et l'heure de rentrée. Pour les oublis. Ça évite les histoires.`},
 {id:'2',q:`Avez-vous vu Madame Morvan ?`,r:`Madame ? Vers 20h45, elle est passée par la porte du couloir, celle du quai de chargement. Pas vers les toilettes, non.`,flags:['solangeQuai']},
 {id:'3',q:`La pluie, ça a commencé quand ?`,r:`Vers 21h05. Un invité est rentré en secouant son parapluie. Ça a duré jusqu'à 22h30 à peu près.`,donne:['I10']},
 {id:'4',q:`Qui est sorti avant 21h ?`,r:`Regardez les manteaux, chef. Moi je ne retiens pas les têtes, je note les heures.`},
 {id:'5',q:`Madame Morvan, elle était chaussée comment, ce soir ?`,requiert:['d:aveu'],r:`Ses chaussons plats, ceux de la cuisine. Elle les a gardés toute la soirée, elle a mal aux genoux. Je remarque les chaussures, chef : j'ai les pieds à hauteur du vestiaire.`,flags:['solangePlats']}
 ],
 verrou2:``,req2:'nul',p2:[],react:{},defaut:`Elle hausse les épaules. Pas son rayon.`},

lorec:{nom:'Commandant Lorec',role:'Gendarmerie, brigade de Quimper, 48 ans',lieu:'gendarmerie',look:{peau:'#dcb392',cheveux:'#4a4a4a',style:'court',tenue:'#2f3d55',accent:'#b9955a'},
 pub:`Dirige l'enquête de la gendarmerie. Veut un coupable avant le juge.`,
 intro:`Képi sous le bras, carnet noir. Il parle sans vous regarder.`,
 p1:[
 {id:'1',q:`Où en est votre enquête, commandant ?`,r:`Le juge passe à midi. Une montre arrêtée sur 23h10, un contremaître qui fait sa ronde seul, des caisses de sardines hors stock. Je tiens mon homme.`},
 {id:'2',q:`Pourquoi avoir placé Yann en garde à vue ?`,requiert:['d:yann'],r:`Il a trouvé le corps, il n'a aucun témoin pour sa ronde, il revend du stock. Prouvez-moi que je me trompe, lieutenant. Avant midi.`},
 {id:'3',q:`Yann Kerbrat est libre.`,requiert:['d:yannLibre'],r:`Le sol sec et le journal du compresseur. Bon. Il sort. Mais je veux un nom avant le juge.`},
 {id:'4',q:`Solange Morvan a avoué.`,requiert:['d:aveu'],r:`Je l'ai entendue. Détaillée, calme, sûre d'elle. Je prépare le procès-verbal.`},
 {id:'5',q:`Son aveu ne tient pas, commandant.`,requiert:['d:aveuBrise'],r:`Ce que vous me montrez est solide. Je vous laisse jusqu'à l'aube. Pas une minute de plus.`}
 ],
 verrou2:``,req2:'nul',p2:[],react:{},defaut:`Il note quelque chose dans son carnet. Rien de plus.`},

legoff:{nom:'Jean Le Goff',role:'Adjoint au maire, 63 ans',lieu:'salle',look:{peau:'#e3bf9d',cheveux:'#b5b5b5',style:'court',tenue:'#3c3c4e',accent:'#c0453f'},
 pub:`Témoin : a passé la soirée à la table d'honneur. Ne retient pas les heures.`,
 intro:`Cravate desserrée, un digestif à la main. Il sourit trop.`,
 p1:[
 {id:'1',q:`Où étiez-vous entre 20h45 et 21h10 ?`,r:`À table, quelque part entre le fromage et le digestif. Les heures, vous savez, moi, c'est les discours.`},
 {id:'2',q:`Qui est sorti de la salle à ce moment-là ?`,r:`Maître Quéré, il me semble. Elle est sortie prendre l'air, sans parapluie, avant la pluie, ça j'en suis sûr. Et le docteur a disparu un moment. Moi je n'ai bougé que pour un cigare.`,note:`Dit avoir vu Me Quéré sortir sans parapluie avant la pluie.`,flags:['legoffOdile']},
 {id:'3',q:`À quelle heure la pluie a-t-elle commencé ?`,r:`J'ai entendu les neuf coups à l'église, dans un coup de vent, et j'ai dit au docteur : il va pleuvoir. Cinq minutes après, ça tapait aux vitres.`}
 ],
 verrou2:``,req2:'nul',p2:[],react:{},defaut:`Il lève son verre. Il n'a rien à ajouter.`},

agnes:{nom:'Agnès (sœur de Mathilde)',role:'Au téléphone, à Brest',lieu:'compta',requiert:['agnes'],look:{peau:'#efd5bd',cheveux:'#2b1d17',style:'court',tenue:'#5a5a7a',accent:'#9fb0c4'},
 pub:`Témoin : a eu Mathilde au téléphone.`,
 intro:`Une voix lointaine, un peu nasale. On entend une télévision.`,
 p1:[
 {id:'1',q:`Votre sœur vous a appelée samedi soir ?`,r:`Oui, vers 20h50. On a parlé six minutes. Elle pleurait un peu.`},
 {id:'2',q:`Avez-vous entendu quelque chose pendant l'appel ?`,r:`Un bruit sourd, comme un gros sac qui tombe, puis un cri court. Mathilde a dit : « Ce n'est rien, une caisse. » C'était vers 20h53. J'ai regardé ma montre, j'allais manger.`,donne:['I14']}
 ],
 verrou2:``,req2:'nul',p2:[],react:{},defaut:`Un silence au bout du fil.`},

cozic:{nom:'Hervé Cozic',role:'Ouvrier, 26 ans',lieu:'infirmerie',look:{peau:'#e0b896',cheveux:'#3a2b20',style:'court',tenue:'#6b6b6b',accent:'#c0453f'},
 pub:`Témoin : soigné par le Dr Salaün.`,
 intro:`La main droite enveloppée, le regard fuyant.`,
 p1:[
 {id:'1',q:`Vous étiez à l'infirmerie à 20h50 ?`,r:`Oui. Je me suis ouvert la main sur la cisaille à poissons à 20h45. Le docteur m'a recousu. Trois points.`},
 {id:'2',q:`Le docteur est resté combien de temps ?`,r:`De 20h50 à 21h10. Je regardais la pendule. J'avais peur de perdre mon travail.`},
 {id:'3',q:`Vous travaillez sans contrat ?`,r:`Dites rien, hein ? Le patron fermait les yeux.`}
 ],
 verrou2:``,req2:'nul',p2:[],react:{},defaut:`Il détourne le regard.`}
},

contradictions: [
{perso:'solange',quand:['q:solange.1','f:solangeQuai'],texte:`Elle dit avoir été aux toilettes. Jeanne l'a vue passer par la porte du quai de chargement.`},
{perso:'odile',quand:['q:odile.1','i:I11'],texte:`Elle dit ne pas avoir quitté la salle. Son manteau est sorti de 20h48 à 21h10.`},
{perso:'odile',quand:['q:odile.3','f:mathildeVoitOdile'],texte:`Elle dit n'avoir échangé que deux mots d'horaire. Mathilde a vu Gaspard lui parler à l'oreille, l'air pressé.`},
{perso:'odile',quand:['q:odile.1','f:legoffOdile'],texte:`Elle dit ne pas avoir quitté la salle. L'adjoint au maire l'a vue sortir sans parapluie, avant la pluie.`},
{perso:'solange',quand:['d:aveu','i:I18'],texte:`Elle avoue avoir brûlé ses gants noirs. Ils sont intacts, au vestiaire.`},
{perso:'solange',quand:['d:aveu','i:I17'],texte:`Elle avoue avoir frappé par-derrière. Le légiste dit : de face.`},
{perso:'salaun',quand:['q:salaun.1','i:I15'],texte:`Il dit être resté dans la salle. Le registre le place à l'infirmerie de 20h50 à 21h10.`}
],

deblocages: [
{id:'acte2',quand:['i:I01','i:I02','i:I03'],acte:2,flags:['veste'],msg:`Acte 2 — Les versions. La salle des fêtes et le vestiaire sont ouverts. La gendarmerie vous attend dans la cour.`},
{id:'acte3',quand:['t:lucien','t:yann','t:mathilde','t:salaun'],acte:3,msg:`Acte 3 — Les vérifications. La chaufferie, la compta et l'infirmerie sont ouvertes. Chaque alibi peut se vérifier.`},
{id:'yann',quand:['d:acte3'],acte:3,rebond:true,msg:`Rebondissement — Le commandant Lorec place Yann Kerbrat en garde à vue. Il passe devant le juge à midi. Prouvez son innocence.`},
{id:'yannLibre',quand:['d:yann','i:I13','i:I01'],acte:3,msg:`Yann Kerbrat est libéré : le journal du compresseur et le sol sec le disculpent. Reste à savoir qui est monté sur la passerelle.`},
{id:'aveu',quand:['d:yannLibre','i:I14','i:I15'],acte:3,rebond:true,msg:`Rebondissement — Solange Morvan demande à parler au commandant. Elle avoue le meurtre.`},
{id:'acte4',quand:['d:aveuBrise','d:chronoOK','i:I03','i:I11','i:I12'],acte:4,msg:`Acte 4 — La confrontation. Vous pouvez affronter Odile Quéré. Le tableau de déduction vous attend.`}
],

pistes: [
{id:'p1',texte:`Le sol sous le corps est sec : à quelle heure a-t-il commencé à pleuvoir ?`,quand:['i:I01'],fin:['i:I10']},
{id:'p2',texte:`La montre est réglée sur 23h10 : que s'est-il passé à 23h10 ?`,quand:['i:I02'],fin:['i:I12']},
{id:'p3',texte:`Le lambeau porte une estampille : qui porte des gants en chevreau ?`,quand:['i:I03'],fin:['i:I11']},
{id:'p4',texte:`Le cale-porte du bureau (une sardine de bronze) manque. Où est-il ?`,quand:['calePorte'],fin:['i:I09']},
{id:'p5',texte:`Gaspard avait rendez-vous à 20h50 sur l'escalier. Avec qui ?`,quand:['i:I08'],fin:['mathildeVoitOdile']},
{id:'p6',texte:`Mme Morvan dit être aux toilettes. Jeanne, au vestiaire, voit passer tout le monde.`,quand:['t:solange'],fin:['solangeQuai']},
{id:'p7',texte:`Qui a signé les virements de la prévoyance ? Interrogez Mathilde.`,quand:['i:I06'],fin:['mathildeOrdres']},
{id:'p9',texte:`Un dictaphone à micro-cassette dans la veste du mort. Qui peut le lire ?`,quand:['cassette'],fin:['i:I16']},
{id:'p10',texte:`Yann est en garde à vue. Qu'est-ce qui le disculpe ?`,quand:['d:yann'],fin:['d:yannLibre']},
{id:'p11',texte:`Solange avoue. Son récit tient-il face aux faits ?`,quand:['d:aveu'],fin:['d:aveuBrise']},
{id:'p12',texte:`Remettez les événements dans l'ordre : la chronologie de 20h46 à 21h10.`,quand:['d:aveuBrise'],fin:['d:chronoOK']},
{id:'p8',texte:`Qui était où entre 20h48 et 20h56 ? Vérifiez les alibis de Lucien, Yann, Mathilde et du Dr Salaün.`,quand:['d:acte3'],fin:['i:I13','i:I14','i:I15']}
],

conclusions: [
{id:'C1',titre:`Il est mort avant 21h05`,requis:['I01','I10'],bonus:['I14','I13','I16','I17'],sens:`Le corps était déjà dans la cour quand la pluie a commencé.`},
{id:'C2',titre:`L'heure de la montre est fausse et voulue`,requis:['I02','I12'],bonus:['I10','I01','I14','I16'],sens:`Heure réglée à la main sur celle de la photo du toast.`},
{id:'C3',titre:`Le gant est celui d'Odile Quéré`,requis:['I03','I11'],bonus:['I12','I17','I20'],sens:`Lambeau, gant gauche, manteau sorti : un seul gant correspond.`},
{id:'C4',titre:`Odile avait un mobile et un rendez-vous`,requis:['I06','I08'],bonus:['I19'],sens:`Compte vidé, lettre de banque, rendez-vous à 20h50 sur l'escalier.`}
],

confrontation: [
{id:'a1',dit:`Je n'ai pas quitté la salle.`,contre:['I11'],cede:`Votre manteau est sorti à 20h48 et rentré à 21h10. Vingt-deux minutes, pas deux. Elle ne répond pas.`},
{id:'a2',dit:`Je n'ai jamais porté de gants ce soir.`,contre:['I12','I11'],cede:`Le photographe vous montre avec des gants beiges, à 19h50. Elle regarde ses mains nues.`},
{id:'a3',dit:`Je ne savais pas qu'il me soupçonnait.`,contre:['I06','I08','I19'],cede:`La lettre de la banque, et un rendez-vous à 20h50 sur l'escalier. Son visage se ferme.`},
{id:'a4',dit:`Il est mort à 23h10. J'étais devant le photographe.`,contre:['I01','I02','I14','I16'],cede:`Vous lui expliquez : une montre réglée à la main, un sol resté sec sous le corps, un cri à 20h53. Il est mort bien avant le toast.`}
],

aide: [
{manque:'i:I01',piste:`Retournez dans la cour, près du corps.`,coup:`Examinez le sol sous le corps.`,rev:`Conclusion C1 : il est mort avant 21h05. Premier indice : le sol sous le corps, dans la cour.`},
{manque:'i:I02',piste:`Le corps a encore quelque chose à dire.`,coup:`Examinez la montre au poignet, dans la cour.`,rev:`Conclusion C2 : l'heure de la montre est fausse. Indice : la montre brisée, dans la cour.`},
{manque:'i:I03',piste:`Regardez les mains du mort.`,coup:`Examinez la main droite, dans la cour.`,rev:`Conclusion C3 : un gant. Indice : le lambeau de cuir dans la main droite, dans la cour.`},
{manque:'calePorte',piste:`Montez au bureau.`,coup:`Examinez la porte sur la passerelle, dans le bureau.`,rev:`Le cale-porte du bureau manque : c'est la piste de l'arme.`},
{manque:'i:I09',piste:`Il manque quelque chose dans le bureau. Cela peut se retrouver dehors.`,coup:`Examinez le bassin d'eau de mer, dans la cour.`,rev:`L'arme est au fond du bassin d'eau de mer, dans la cour.`},
{manque:'i:I08',piste:`L'agenda du bureau.`,coup:`Examinez l'agenda de Gaspard, dans le bureau.`,rev:`Conclusion C4 : un rendez-vous. Indice : l'agenda, dans le bureau.`},
{manque:'i:I06',piste:`Le courrier du bureau.`,coup:`Examinez la lettre de la banque, dans le bureau.`,rev:`Conclusion C4 : un mobile. Indice : la lettre de la banque, dans le bureau.`},
{manque:'i:I07',piste:`Le tiroir du bureau.`,coup:`Examinez le tiroir du bureau.`,rev:`Indice de contexte : une reconnaissance de dette, dans le tiroir du bureau.`},
{manque:'t:odile',piste:`Interrogez Me Quéré, dans la salle des fêtes.`,coup:`Posez vos questions à Me Quéré, dans la salle des fêtes.`,rev:`Interrogez Me Quéré, la notaire : sa version est la première à vérifier.`},
{manque:'t:solange',piste:`Interrogez Mme Morvan.`,coup:`Posez vos questions à Mme Morvan.`,rev:`Interrogez Mme Morvan dans la salle des fêtes.`},
{manque:'t:lucien',piste:`Interrogez Lucien.`,coup:`Posez vos questions à Lucien.`,rev:`Interrogez Lucien Morvan dans la salle des fêtes.`},
{manque:'t:yann',piste:`Interrogez Yann.`,coup:`Posez vos questions à Yann.`,rev:`Interrogez Yann Kerbrat dans la salle des fêtes.`},
{manque:'t:mathilde',piste:`Interrogez Mathilde.`,coup:`Posez vos questions à Mathilde.`,rev:`Interrogez Mathilde Rouat dans la salle des fêtes.`},
{manque:'t:salaun',piste:`Interrogez le Dr Salaün.`,coup:`Posez vos questions au Dr Salaün.`,rev:`Interrogez le Dr Salaün dans la salle des fêtes.`},
{manque:'i:I12',piste:`Quelqu'un a pris des photos ce soir.`,coup:`Parlez à Gwenn, la photographe, dans la salle des fêtes.`,rev:`Conclusion C2 : indice dans le carnet de la photographe, dans la salle des fêtes.`},
{manque:'i:I11',piste:`Le vestiaire garde des traces.`,coup:`Examinez le manteau n°14, au vestiaire.`,rev:`Conclusion C3 : indice dans le manteau n°14 (Me Quéré), au vestiaire.`},
{manque:'i:I10',piste:`À quelle heure a-t-il plu ?`,coup:`Interrogez Jeanne, au vestiaire, sur la pluie.`,rev:`Conclusion C1 : indice sur la pluie (Jeanne ou le cahier météo de la chaufferie).`},
{manque:'i:I13',piste:`Vérifiez Lucien et Yann à la chaufferie.`,coup:`Examinez le journal du compresseur, à la chaufferie.`,rev:`Alibi de Lucien et de Yann : le journal du compresseur, à la chaufferie.`},
{manque:'i:I04',piste:`La chaufferie cache aussi des secrets de Yann.`,coup:`Examinez les caisses et le cahier de rondes, à la chaufferie.`,rev:`Fausse piste sur Yann : les caisses hors stock, à la chaufferie.`},
{manque:'agnes',piste:`Mathilde dit avoir appelé sa sœur.`,coup:`Examinez le téléphone, à la compta.`,rev:`Alibi de Mathilde : le téléphone de la compta, puis Agnès.`},
{manque:'i:I14',piste:`Interrogez la sœur de Mathilde.`,coup:`Appelez Agnès depuis la compta.`,rev:`Alibi de Mathilde et heure de la mort : Agnès, au téléphone, depuis la compta.`},
{manque:'i:I15',piste:`Où était le Dr Salaün vraiment ?`,coup:`Examinez le registre de l'infirmerie.`,rev:`Alibi du Dr Salaün : le registre de l'infirmerie.`},
{manque:'cassette',piste:`Les poches du mort n'ont pas toutes été fouillées.`,coup:`Examinez la veste du mort, dans la cour.`,rev:`Un dictaphone à micro-cassette dans la poche intérieure de la veste, dans la cour.`},
{manque:'i:I16',piste:`Un magnétophone peut lire la cassette. La gendarmerie en a un.`,coup:`Examinez le magnétophone, dans la camionnette de la gendarmerie.`,rev:`La cassette comporte 6 segments : répondez à la question de chacun. Le magnétophone est à la gendarmerie.`},
{manque:'i:I17',piste:`Le légiste a rendu son rapport.`,coup:`Examinez le rapport du médecin légiste, à la gendarmerie.`,rev:`Rapport du légiste : coup porté de face, fibres de cuir beige sous les ongles.`},
{manque:'i:I18',piste:`Les gants de Mme Morvan sont au vestiaire.`,coup:`Examinez le manteau n°7, au vestiaire.`,rev:`Manteau n°7 : ses gants noirs, intacts, sans trace de brûlure.`},
{manque:'d:aveuBrise',piste:`Un aveu n'est pas une preuve. Cherchez ce que le récit de Solange contredit.`,coup:`Dans l'aveu, présentez le rapport du légiste contre « par-derrière ».`,rev:`Aveu : le légiste (de face), le cale-porte (retrouvé dans le bassin), les gants (intacts, vestiaire), les talons (cassette + Jeanne). Trois suffisent.`},
{manque:'d:chronoOK',piste:`Remettez les événements dans l'ordre, du plus ancien au plus récent.`,coup:`Ouvrez la chronologie : la note de Gaspard est la première carte.`,rev:`Ordre : note 20h46, Gaspard vivant 20h48, appel 20h50, bruit 20h53, montre 20h55, cloches 21h, pluie 21h05, manteau 21h10.`},
{manque:'c:C1',piste:`Ouvrez le tableau de déduction.`,coup:`Dans le tableau, rattachez à C1 : le sol sec et la pluie.`,rev:`C1 = I01 (sol sec) + I10 (la pluie).`},
{manque:'c:C2',piste:`Le tableau de déduction : C2.`,coup:`Dans le tableau, rattachez à C2 : la montre et le carnet du photographe.`,rev:`C2 = I02 (la montre) + I12 (carnet du photographe).`},
{manque:'c:C3',piste:`Le tableau de déduction : C3.`,coup:`Dans le tableau, rattachez à C3 : le lambeau et le manteau n°14.`,rev:`C3 = I03 (lambeau) + I11 (manteau n°14).`},
{manque:'c:C4',piste:`Le tableau de déduction : C4.`,coup:`Dans le tableau, rattachez à C4 : la lettre de la banque et l'agenda.`,rev:`C4 = I06 (lettre de banque) + I08 (agenda).`},
{manque:'d:confOK',piste:`Confrontez Odile Quéré, dans la salle des fêtes.`,coup:`Présentez le manteau n°14 contre « je n'ai pas quitté la salle ».`,rev:`Confrontation : I11 contre a1 ; I12 contre a2 ; I06 ou I08 contre a3 ; I01, I02, I14 ou la cassette contre a4.`}
],

fins: {
A:{titre:`Affaire résolue`,paras:[
`Vous réunissez les invités à l'aube. Vous posez les faits dans l'ordre.`,
`Gaspard Morvan est mort avant 21h05 : les dalles étaient sèches sous lui. Sa montre a été réglée à la main sur 23h10, l'heure de la photo du toast. Quelqu'un voulait un alibi devant l'objectif, et un coupable absent du cliché : Yann.`,
`Un seul gant correspond au lambeau trouvé dans la main du mort. Celui de Maître Odile Quéré, sortie de la salle de 20h48 à 21h10.`,
`Odile Quéré ne nie plus. « Il avait trouvé la lettre de la banque. Il m'a dit : vous avez volé les ouvriers. J'ai pris la sardine sur la porte. J'avais tout préparé, sauf ce gant. »`,
`Le compte de la prévoyance sera restitué aux ouvriers. Yann Kerbrat rentre chez lui. Il pleut à nouveau sur le Port-Rhu.`],
aveu:`Solange Morvan a retiré son aveu : elle protégeait son fils. Lucien n'avait qu'une main ouverte sur un carter. Le commandant Lorec vous serre la main : « Kenavo, lieutenant. »`},
B:{titre:`Mauvaise accusation`,paras:[
`Vous faites arrêter {nom}. Deux semaines plus tard, le juge d'instruction le relâche : l'accusation ne tient sur aucun fait.`,
`Entre-temps, le vrai coupable a vendu son étude et quitté la région. L'enquête repart de zéro.`,
`Reprenez le dossier : ce que vous avez déjà en main ne vous a pas encore tout dit.`]},
C:{titre:`Preuves insuffisantes`,paras:[
`Vous arrêtez Odile Quéré. Le juge lit votre dossier : il manque un lien matériel solide, ou une chronologie établie.`,
`Elle sort libre le lendemain, son avocat à ses côtés. Vous aviez le bon nom. Il vous manquait de quoi le démontrer.`,
`Reprenez l'enquête.`]},
Bsol:{titre:`Une mère trop courageuse`,paras:[
`Vous faites inculper Solange Morvan. Elle ne se défend pas. Son avocat n'a rien à plaider : elle a tout avoué.`,
`Mais le légiste parle d'un coup porté de face, et le juge se demande pourquoi une femme qui ne peut pas monter une volée de marches aurait attendu un homme sur la passerelle.`,
`Un aveu n'est pas une preuve. Pendant que Solange attend son procès, le vrai coupable prépare son départ.`,
`Reprenez le dossier : l'aveu ne prouve que l'amour d'une mère.`]},
D:{titre:`Le piège de la montre`,paras:[
`Yann Kerbrat est inculpé le 16 novembre. La montre sur 23h10, la ronde, les caisses volées : pour un jury pressé, le dossier tient.`,
`Trois mois plus tard, une avocate demande pourquoi les dalles étaient sèches sous le corps. Personne n'a de réponse.`,
`Vous vous êtes fait piéger par une montre. Rouvrez le dossier.`]}
},

cassette: {
titre:`La cassette du dictaphone`,
intro:`Le dictaphone ne se déclenche qu'au bruit. Six séquences sont enregistrées. Écoutez chacune, puis répondez à la question.`,
segments:[
 {id:1,son:'voix',voix:`Vingt heures quarante-six. Le compte est vide. Quelqu'un a signé à ma place. J'ai demandé à cette personne de me rejoindre ici, à vingt heures cinquante.`,desc:`Une voix d'homme, fatiguée, dicte une note.`,q:`À quelle heure Gaspard dicte-t-il sa note ?`,opts:[`20h46`,`20h50`,`23h10`],bon:0,ok:`Il dicte à 20h46 : le compte est vide, et il attend quelqu'un à 20h50.`},
 {id:2,son:'pas',n:12,desc:`Des talons claquent sur du fer, de plus en plus proches.`,q:`Combien de pas montent l'escalier de fer ?`,opts:[`8`,`10`,`12`],bon:2,ok:`Douze claquements : ce sont des talons, pas des semelles plates.`},
 {id:3,son:'coup',voix:`Ah. Vous voilà.`,desc:`Une voix étouffée, puis un coup sourd, puis plus rien.`,q:`Gaspard connaissait-il la personne qui monte ?`,opts:[`Oui : il l'attendait`,`Non : un inconnu`,`On ne peut pas le savoir`],bon:0,ok:`« Ah. Vous voilà. » : il l'attendait. C'est le rendez-vous de 20h50.`},
 {id:4,son:'descente',desc:`Les talons redescendent plus vite. Une petite couronne de montre qu'on tourne. Un verre qui se brise.`,q:`Que fait la personne avant de repartir ?`,opts:[`Elle fouille les poches`,`Elle règle la montre du mort`,`Elle appelle à l'aide`],bon:1,ok:`Elle règle la montre à la main : le verre se brise dans la manœuvre.`},
 {id:5,son:'cloches',n:9,desc:`L'église sonne. Neuf coups, nets.`,q:`À quelle heure l'église sonne-t-elle neuf coups, cette nuit-là ?`,opts:[`20h`,`21h`,`22h`],bon:1,ok:`Neuf coups, c'est 21h : Gaspard est déjà mort.`},
 {id:6,son:'pluie',desc:`La pluie commence à tambouriner. Le dictaphone est resté dehors, dans la poche du mort.`,q:`Que dit la pluie, après les neuf coups ?`,opts:[`Elle commence après 21h : le corps était déjà là`,`Elle tombait déjà quand Gaspard dicte`,`Elle ne dit rien d'utile`],bon:0,ok:`La pluie commence après 21h, sur un corps déjà au sol.`}
]},

aveu: {
perso:'solange',
intro:`Solange Morvan demande à parler au commandant. Elle est calme, trop calme. « C'est moi. Je l'ai frappé. Je ne regrette rien. » Le commandant vous laisse la questionner. Brisez au moins trois énoncés avec la bonne pièce.`,
seuil:3,
enonces:[
 {id:'s1',dit:`Je l'ai frappé par-derrière, dans le noir.`,contre:['I17'],cede:`Le légiste : coup porté de face, fibres de cuir beige sous les ongles. Il regardait celui qui le frappait.`},
 {id:'s2',dit:`J'ai jeté la sardine de bronze dans la mer, depuis le quai.`,contre:['I09'],cede:`La statuette est au fond du bassin de la cour, pas dans la mer. Elle n'est jamais sortie de l'usine.`},
 {id:'s3',dit:`J'ai brûlé mes gants noirs dans le poêle du quai.`,contre:['I18'],cede:`Vos gants sont dans le manteau n°7, intacts, sans trace de cendre.`},
 {id:'s4',dit:`Je suis montée par l'escalier de fer et je l'ai attendu en haut.`,contre:['I16'],et:['solangePlats'],cede:`La cassette : des talons montent l'escalier. Jeanne : vous portiez des chaussons plats toute la soirée.`}
],
rompu:`Solange s'effondre. « Lucien avait la main en sang. J'ai cru… Une mère, ça croit le pire. » Le commandant referme son carnet : l'aveu ne tient pas.`
},

chrono: {
titre:`La chronologie`,
intro:`Remettez les événements dans l'ordre, du plus ancien au plus récent. Les heures n'apparaissent qu'une fois l'ordre exact trouvé.`,
cartes:[
 {id:'k1',h:'20h46',texte:`Gaspard dicte sa note : le compte est vide.`,req:'i:I16'},
 {id:'k2',h:'20h48',texte:`Yann et Lucien traversent la cour et voient Gaspard vivant sur la passerelle.`,req:'i:I13'},
 {id:'k3',h:'20h50',texte:`Mathilde téléphone à sa sœur, depuis la compta.`,req:'i:I14'},
 {id:'k4',h:'20h53',texte:`Un bruit sourd, un cri : Gaspard tombe.`,req:'i:I14'},
 {id:'k5',h:'20h55',texte:`Quelqu'un règle la montre du mort sur 23h10.`,req:'i:I02'},
 {id:'k6',h:'21h00',texte:`L'église sonne neuf coups.`,req:'i:I16'},
 {id:'k7',h:'21h05',texte:`La pluie commence.`,req:'i:I10'},
 {id:'k8',h:'21h10',texte:`Le manteau de Me Quéré rentre au vestiaire, trempé.`,req:'i:I11'}
],
ordre:['k1','k2','k3','k4','k5','k6','k7','k8']
},

coffre: {code:'1962',indice:'I19',texte:`Un coffre mural à quatre chiffres. Sous la serrure, une plaque gravée : « L'année de la première boîte de la maison. »`,aide:`La sardine de bronze du cale-porte porte une date gravée.`},

chiffre: {clair:'MON DICTAPHONE EST DANS MA VESTE',cle:12,chiffre:'YAZ PUOFMBTAZQ QEF PMZE YM HQEFQ',texte:`Au dos de l'agenda, une ligne de lettres sans sens, de la main de Gaspard.`,aide:`Chaque lettre est décalée dans l'alphabet. La clé est le nombre de marches de l'escalier de fer.`},

photoDiff: {
titre:`Les tirages de Gwenn`,
intro:`Deux tirages, 19h50 et 23h10. Trouvez trois différences. Touchez l'image de droite.`,
zones:[
 {id:'gants',nom:`Les gants`,texte:`Sur le tirage de 19h50, Me Quéré porte des gants beiges. Sur celui de 23h10, ses mains sont nues.`},
 {id:'ecorchure',nom:`La main droite`,texte:`Sur le tirage de 23h10, le dos de la main droite d'Odile porte une écorchure fraîche : trois traits parallèles.`,indice:'I20'},
 {id:'verre',nom:`Le verre`,texte:`À 19h50 elle tient un verre de la main droite. À 23h10, de la main gauche.`}
]
},

modes: {
stagiaire:{nom:'Stagiaire',desc:`Aide gratuite, rang plafonné à 2 étoiles. Pour découvrir.`},
inspecteur:{nom:'Inspecteur',desc:`L'expérience prévue. Aide payante en points.`},
commissaire:{nom:'Commissaire',desc:`Sans les aides 1, 2 et 4. Vérifier limité à 3 essais. Pour les joueurs aguerris.`}
},

carnet: [
{id:'k0',lieu:null,titre:`Les trois ports`,texte:`Douarnenez a trois ports : le Rosmeur, le Port-Rhu et Tréboul. En 1945, Tréboul, Ploaré et Pouldavid ont été rattachés à la commune.`},
{id:'k1',lieu:'cour',titre:`L'île Tristan`,texte:`On y accède à marée basse. Elle est protégée par le Conservatoire du littoral.`},
{id:'k2',lieu:'bureau',titre:`Novembre 1924`,texte:`Fin 1924, près de 2 000 ouvrières travaillent dans 23 conserveries. En novembre, la ville entre en grève : elles demandent un franc de l'heure.`},
{id:'k3',lieu:'salle',titre:`Maisons d'usiniers`,texte:`Les rues gardent d'anciennes conserveries et des maisons d'usiniers, souvent à trois étages, aux fenêtres peintes en bleu ou en vert.`},
{id:'k4',lieu:'vestiaire',titre:`Hommes et femmes`,texte:`Les hommes pêchent la sardine. Les femmes la mettent en boîte.`},
{id:'k5',lieu:'gendarmerie',titre:`La ville d'Ys`,texte:`La légende dit que Douarnenez est une « terre nouvelle », bâtie après l'engloutissement de la ville d'Ys.`},
{id:'k6',lieu:'chaufferie',titre:`Les fritures`,texte:`On appelait les conserveries des « fritures » : les sardines y étaient frites dans l'huile avant la mise en boîte.`},
{id:'k7',lieu:'compta',titre:`Plus de cinquante usines`,texte:`À la fin du XIXe siècle, Douarnenez compte plus de cinquante conserveries, et une main-d'œuvre surtout féminine.`},
{id:'k8',lieu:'infirmerie',titre:`La crise de 1902`,texte:`À partir de 1902, la sardine se raréfie dans la baie. Plusieurs usines ferment, et les familles en souffrent.`}
],

balade: {
titre:`Balade sur place`,
intro:`Le jeu se joue partout. Mais si vous êtes à Douarnenez, voici un parcours à pied à travers les lieux de l'enquête. Entre le Rosmeur et Tréboul, comptez environ un kilomètre de chemin piéton, soit une vingtaine de minutes sans s'arrêter.`,
etapes:[
 {id:'b1',nom:`Le port du Rosmeur`,q:`Port du Rosmeur Douarnenez`,jeu:`La cour de l'usine Morvan se trouve dans cette ville de ports.`,sur:`Le vieux port de pêche, serré au pied de ruelles en pente.`},
 {id:'b2',nom:`Les Halles`,q:`Halles Douarnenez`,jeu:`Yann y revend ses caisses de sardines hors stock.`,sur:`Au centre-ville, des portraits de femmes engagées aux murs rappellent l'histoire des conserveries.`},
 {id:'b3',nom:`Le Port-Rhu`,q:`Port-Rhu Douarnenez`,jeu:`Au fond de la ria, l'usine Morvan (fiction).`,sur:`La ria, avec en face les rives de Tréboul.`},
 {id:'b4',nom:`Tréboul`,q:`Tréboul Douarnenez`,jeu:`L'étude de Me Quéré s'y trouve (fiction).`,sur:`Un quartier de villas à tourelles, construit autour de 1900.`},
 {id:'b5',nom:`La plage des Sables Blancs`,q:`Plage des Sables Blancs Douarnenez`,jeu:`La baie que l'on devine depuis la cour, l'aube de l'enquête.`,sur:`Une plage de Tréboul, face à la baie.`},
 {id:'b6',nom:`L'île Tristan (vue)`,q:`Île Tristan Douarnenez`,jeu:`On la devine depuis la cour de l'usine.`,sur:`L'île est accessible à marée basse. Consultez les horaires de marée officiels et la réglementation avant toute traversée.`}
],
conseil:`L'office de tourisme distribue des plans de sentiers. Un parcours des grèves sardinières existe aussi, de l'ancienne gare de Tréboul au port du Rosmeur : renseignez-vous sur place.`
},

credits: `Tous les textes, les illustrations (dessinées en SVG et CSS) et les sons de ce jeu ont été créés pour lui. Aucune image, police, musique, bibliothèque ni service externe n'est utilisé : le jeu fonctionne entièrement hors ligne, avec les polices du système. Douarnenez, le Port-Rhu, le Rosmeur, Tréboul, l'île Tristan et la grève des sardinières de 1924 sont réels. L'usine Morvan, les personnages, les entreprises et l'affaire sont entièrement fictifs. La carte du jeu est un schéma, non à l'échelle. Toute ressemblance avec des personnes ou des faits réels serait fortuite.`
};
