# Réservation directe — réglages et limites

L'adresse publique du site est conservée. Le formulaire utilise le compte Smoobu
1441081 et **la propriété 2948066**, identifiée dans le code d'intégration officiel.

## Prix du chalet

Ils restent calculés par Smoobu à partir des disponibilités et des prix du compte.
Il n'y a aucun prix journalier d'hébergement recopié dans le site. Les frais de
nettoyage, l'acompte, les modalités et les tarifs des canaux ne sont pas modifiés
par ces fichiers.

## Options : réglages enregistrés dans Smoobu

Appliqués avec l'accord de Yannick et vérifiés le 9 octobre 2026, après
rechargement des réglages puis dans un nouveau parcours client. Identifiants :
sauna 281030, barbecue 281035, jacuzzi 248721, animaux 327471.

Configuration → Moteur de réservations → Paramètres des propriétés → Articles
supplémentaires. Limiter les articles à la propriété du chalet et au **Moteur de
réservation** (pas au Guide Voyageur pour des jours isolés).

| Article | Valeur CHF | Calcul | Quantité max. | Condition |
| --- | ---: | --- | ---: | --- |
| Jacuzzi — séjour entier, minimum 2 nuits | 70 | par nuit | 1 | Vérifier le minimum de séjour dans Smoobu |
| Sauna — séjour entier | 60 | par nuit | 1 | Toutes les nuits |
| Barbecue — mai à octobre, séjour entier | 10 | par nuit | 1 | Smoobu ne montre pas de restriction saisonnière par article dans l'interface inspectée |
| Animal domestique — séjour entier (maximum 2) | 15 | par nuit | 2 | La quantité représente les animaux, pas les nuits ni les voyageurs |

Tous sont **optionnels**, avec montant fixe (pas un pourcentage). Ne pas choisir
« par personne et par nuit » pour les animaux : cela multiplierait aussi par le
nombre de voyageurs. Ne pas toucher aux réglages de TVA existants sans décision
comptable. Les réglages de TVA existants sont conservés.

La simulation sur le site bloque le barbecue hors saison et le jacuzzi sur une
seule nuit. Ces validations **ne constituent pas un verrou du checkout externe** :
les voyageurs peuvent modifier leurs dates dans Smoobu. Ne pas annoncer que ces
restrictions sont automatiquement imposées par Smoobu avant vérification.

Les packs simple/premium pour 4/8 restent sur demande, avec prix à confirmer.
Ne pas créer d'article gratuit à zéro pour remplacer un tarif manquant. Une fois
les prix de vente et la composition confirmés, ajouter quatre articles optionnels,
**par réservation**, quantité max. 1. Le coût fournisseur n'est pas le prix public.

## Prix affichés par la simulation du site

`booking-config.js` regroupe les tarifs d'options et les prix des packs (`null`
tant qu'ils ne sont pas fixés). Modifier les valeurs ici **et** dans Smoobu pour
maintenir une simulation cohérente. Smoobu demeure la source du montant payable.
Les packs tarifés sont comptés une fois par séjour par le calculateur.

## Dates et données personnelles

Le bouton sous le récapitulatif transmet à Smoobu uniquement les dates et le
nombre de voyageurs. Il n'envoie pas les coordonnées, la sélection d'options ni
un prix calculé par le navigateur. Pour être inclus dans le total de réservation,
le jacuzzi, le sauna, le barbecue et les animaux doivent être sélectionnés dans
« Nos extras » du formulaire Smoobu. La simulation est facultative ; les packs
fondue restent une demande séparée. Le courriel n'est pas envoyé automatiquement
et ne doit jamais contenir de données bancaires.

## Paiement et essais

Constaté le 9 octobre 2026 : Smoobu propose le virement ; Stripe n'y est pas encore
connecté. La connexion Stripe disponible dans ChatGPT est en mode réel uniquement.
Le plugin ChatGPT ne connecte pas automatiquement Stripe au moteur Smoobu.

Smoobu ne prend en charge que Stripe LIVE. Un essai carte dans son moteur est un
vrai débit. Ne pas activer Stripe, modifier les prix du calendrier à 1 CHF ou
encaisser pour un test sans autorisation explicite. Pour inspecter le parcours,
aller jusqu'au récapitulatif sans soumettre. Une réservation de test par virement
bloquerait réellement les dates et pourrait déclencher des messages automatiques :
elle exige aussi une autorisation avant création, puis avant annulation.

Un véritable paiement Stripe en environnement de test demande un sandbox Stripe
séparé et autorisé. Il ne faut pas le présenter comme une réservation Smoobu.

Sources officielles :
- https://support.smoobu.com/hc/en-us/articles/360009612120-Offer-extras-and-upsells-to-your-guests
- https://support.smoobu.com/hc/en-us/articles/360006576200-How-do-I-set-up-Stripe-payments
- https://support.smoobu.com/hc/en-us/articles/360021211020-How-do-I-make-a-test-booking

## Vérification

`node --test reservation-preview/booking-core.test.cjs`

Devis client vérifié pour le 23–25 novembre 2026, 4 voyageurs : prix de base
717 CHF + nettoyage 290 CHF + jacuzzi 140 CHF + sauna 120 CHF + deux animaux
60 CHF = **1 327 CHF**. Les extras totalisent **320 CHF** pour deux nuits.
Quantités maximales visibles : sauna, barbecue et jacuzzi 1 ; animaux 2.
Aucune réservation n'a été soumise, aucune date bloquée, aucun paiement effectué.
Un ancien lien de devis conservait les libellés précédents ; le nouveau parcours
affiche les quatre articles et leurs tarifs par nuit. Toujours vérifier un devis
actualisé après une modification.

Ne confirmer un paiement, une réservation ou un réglage actif qu'après avoir
constaté son résultat. Aucun secret Stripe/Smoobu n'est stocké dans ce dépôt public.
