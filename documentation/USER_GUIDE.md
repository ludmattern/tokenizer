# Guide utilisateur

Guide d'utilisation de MATTERN42 Token pour les différents types d'utilisateurs.

## Pour les détenteurs de tokens

### Ajouter le token à votre wallet

```
Adresse du contrat : 0x... (voir info de déploiement)
Symbole : M42T
Décimales : 18
```

### Opérations de base

#### Envoyer des tokens

1. Ouvrir votre wallet (MetaMask, Trust Wallet, etc.)
2. Sélectionner MATTERN42 Token
3. Saisir l'adresse destinataire
4. Saisir le montant
5. Confirmer la transaction

#### Recevoir des tokens

- Partager votre adresse de wallet
- Les tokens apparaissent automatiquement après confirmation

#### Brûler des tokens

```javascript
// Seuls vos propres tokens peuvent être brûlés
token.burn(montant)
```

## Pour les administrateurs

### Responsabilités

- Minter de nouveaux tokens (dans la limite du supply max)
- Mettre en pause/reprendre les transferts en urgence
- Transférer la propriété au MultiSig
- Surveiller l'écosystème du token

### Fonctions administratives

#### Créer de nouveaux tokens

```javascript
// Seul le propriétaire peut minter
await token.mint(adresseDestinataire, montant);
```

#### Pause d'urgence

```javascript
// Arrêter tous les transferts temporairement
await token.pause();

// Reprendre les opérations normales
await token.unpause();
```

#### Transfert de propriété

```javascript
// Transférer au MultiSig pour plus de sécurité
await token.transferOwnership(adresseMultisig);
```

## Pour les opérateurs MultiSig

### Comprendre le système

- Nécessite plusieurs signatures pour l'exécution
- Défaut : 2 propriétaires sur 3 doivent approuver
- Toutes les transactions sont visibles on-chain
- Les propriétaires peuvent révoquer leur approbation avant exécution

### Opérations MultiSig

#### 1. Soumettre une transaction

```javascript
// Proposer une nouvelle transaction
await multisig.submitTransaction(
    adresseCible,
    valeurETH,
    donneesEncodees
);
```

#### 2. Confirmer une transaction

```javascript
// Approuver une transaction en attente
await multisig.confirmTransaction(indexTransaction);
```

#### 3. Exécuter une transaction

```javascript
// Exécuter après confirmations suffisantes
await multisig.executeTransaction(indexTransaction);
```

#### 4. Révoquer une confirmation

```javascript
// Retirer l'approbation avant exécution
await multisig.revokeConfirmation(indexTransaction);
```

### Scénarios courants

#### Minter des tokens via MultiSig

1. Un propriétaire soumet la transaction mint
2. Les autres propriétaires examinent et confirment
3. Exécution après confirmations requises
4. Tokens créés vers l'adresse cible

#### Pause d'urgence via MultiSig

1. Un propriétaire soumet la transaction pause
2. Confirmation rapide des autres propriétaires
3. Exécution pour suspendre tous les transferts
4. Investigation et reprise quand sécurisé

## Intégration wallet

### Wallets supportés

- **MetaMask** : Extension navigateur
- **Hardware wallets** : Ledger, Trezor (recommandé pour MultiSig)
- **Wallets mobiles** : Trust Wallet, Rainbow, Coinbase Wallet
- Tous les wallets compatibles ERC20

## Exemples de transactions

### Transfert de base

```javascript
// Transférer 100 tokens M42T
const montant = ethers.utils.parseEther("100");
await token.transfer(adresseDestinataire, montant);
```

### Approve et TransferFrom

```javascript
// Approuver un dépensier
await token.approve(adresseDépensier, montant);

// Le dépensier transfère en votre nom
await token.transferFrom(votreAdresse, adresseDestinataire, montant);
```

### Vérifier l'allocation

```javascript
// Voir combien le dépensier peut transférer
const allocation = await token.allowance(adressePropriétaire, adresseDépensier);
```

## Résolution de problèmes

### Échecs de transaction

- **Gas insuffisant** : Augmenter la limite de gas
- **Solde insuffisant** : Vérifier le solde en tokens
- **Contrat en pause** : Attendre la reprise
- **Mauvais réseau** : Basculer vers Sepolia

### Problèmes courants

- **Tokens non visibles** : Ajouter manuellement l'adresse du contrat
- **Frais de gas élevés** : Attendre une congestion moindre
- **Transactions en attente** : Attendre ou augmenter le prix du gas
- **Délais MultiSig** : Se coordonner avec les autres propriétaires

## Sécurité

### Pour tous les utilisateurs

- Vérifier les adresses des contrats avant interaction
- Utiliser des hardware wallets pour de gros montants
- Sauvegarder les clés privées de manière sécurisée
- Vérifier les adresses destinataires

### Pour les propriétaires MultiSig

- Se coordonner avec les autres propriétaires
- Examiner tous les détails des transactions
- Utiliser des appareils séparés pour chaque propriétaire
- Maintenir des canaux de communication sécurisés

### Signaux d'alarme

- Demandes de clés privées
- Adresses de contrats non officielles
- Pression pour approuver rapidement
- Demandes de transactions inattendues

## Support

Pour toute aide :

1. Vérifier la transaction sur Etherscan
2. Confirmer les adresses des contrats
3. Vérifier la sélection du réseau
4. Consulter la documentation technique
