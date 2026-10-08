# Configuration des options dans Smoobu — Chalet L’Ardoise

**Statut : à configurer et à tester avant publication.** Le sélecteur d'options du site est actuellement une interface de préparation : il ne transmet pas lui-même les achats ou les prix à Smoobu. Aucun extra n'a été créé dans Smoobu par cette modification GitHub.

## Procédure Smoobu

1. Ouvrir **Configuration → Moteur de réservations → Paramètres des propriétés**.
2. Sélectionner le Chalet L'Ardoise.
3. Dans **Articles supplémentaires**, cliquer sur **+**. Chaque article est **Optionnel** et visible dans **Moteur de réservations** (et éventuellement le Guide voyageur).
4. Vérifier devise CHF, TVA incluse dans chaque prix, règle de calcul, quantité maximale et aperçu. Tester une réservation factice sans en laisser une active.

| Article Smoobu recommandé | Prix | Calcul | Quantité max | Conditions |
|---|---:|---|---:|---|
| Jacuzzi extérieur | 70 CHF | Par nuit | 1 | Réservé pour tout le séjour ; minimum 2 nuits à vérifier à part |
| Sauna intérieur | 60 CHF | Par nuit | 1 | Réservé pour tout le séjour |
| Barbecue | 10 CHF | Par nuit | 1 | Seulement mai–octobre ; **ne pas laisser disponible en hiver** sans contrôle saisonnier |
| Animal domestique | 15 CHF | Par nuit | 2 | Quantité par animal : 0, 1 ou 2 |
| Fondue simple 4 personnes | **À confirmer** | Par réservation | 1 | Fondue + combustible ; réchaud/caquelon mis à disposition |
| Fondue simple 8 personnes | **À confirmer** | Par réservation | 1 | Idem pour 8 |
| Fondue premium valaisanne 4 personnes | **À confirmer** | Par réservation | 1 | Fondue fromages locaux, pain, vin blanc, viande séchée, ail, herbes/épices, combustible |
| Fondue premium valaisanne 8 personnes | **À confirmer** | Par réservation | 1 | Idem pour 8 |

### Cas particuliers à traiter avant mise en ligne

- **Plus de 2 animaux :** une demande écrite et une approbation explicite sont nécessaires ; **ne pas** offrir une sélection automatique de 3+ sans validation.
- **Barbecue :** il faut vérifier que la saisonnalité peut être appliquée dans Smoobu ; à défaut, masquer l'extra hors saison ou passer par une confirmation manuelle.
- **Jacuzzi :** vérifier la possibilité d'imposer le séjour minimum de deux nuits aux commandes de jacuzzi.
- **Packs fondue :** faire valider les prix et les quantités. Les 4 variantes Smoobu séparées ne garantissent pas une sélection mutuellement exclusive : vérifier manuellement qu'un client ne commande pas plusieurs packs non souhaités.
- **Vin :** vérifier les obligations légales valaisannes pour une offre incluant du vin (achat/vente/service et contrôle de l'âge).
- **Taxe de séjour :** vérifier les éventuelles exonérations (notamment enfants) et la politique de collecte avant de l'afficher comme montant automatiquement dû.
- **Paiement :** vérifier Smoobu + Stripe en mode réel, frais et modalités d'annulation. Sans test, le parcours ne peut pas être considéré comme opérationnel.

### Tests d'acceptation

- Réserver un séjour éligible de 2–4 nuits ; vérifier prix des extras (par nuit ou par séjour) et calendrier Smoobu.
- Refuser barbecue hors mai–octobre, et refuser jacuzzi sur une réservation d'une nuit selon la règle choisie.
- Contrôler qu'un animal compte 15 CHF/nuit et deux animaux 30 CHF/nuit.
- Vérifier l'affichage de chaque pack fondue et l'absence de commande simultanée incompatible.
- Vérifier les versions FR, EN, DE, NL, IT et la version mobile, ainsi que le paiement et les e-mails de confirmation.
- Tester les réservations directes sans bloquer durablement l'inventaire réel.

## Source

Documentation Smoobu : https://support.smoobu.com/hc/fr/articles/360009612120-Proposer-des-extras-et-des-options-suppl%C3%A9mentaires-%C3%A0-vos-invit%C3%A9s
