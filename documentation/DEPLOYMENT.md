# Guide de déploiement

Guide étape par étape pour déployer MATTERN42 Token et son portefeuille MultiSig sur Sepolia.

## Prérequis

### Logiciels

- Node.js v16+
- Git
- Wallet avec ETH Sepolia

### Comptes requis

- [Infura](https://infura.io/) ou autre fournisseur RPC
- [Etherscan](https://etherscan.io/) pour la vérification

## Configuration

### 1. Initialisation

```bash
# Configuration complète
make setup
```

### 2. Variables d'environnement

```bash
cd deployment
cp .env.example .env
```

Éditez `.env` :

```env
# Wallet de déploiement
PRIVATE_KEY=your_private_key_here

# Accès réseau
INFURA_API_KEY=your_infura_api_key

# Vérification des contrats
ETHERSCAN_API_KEY=your_etherscan_api_key

# Configuration token (optionnel)
TOKEN_NAME=MATTERN42Token
TOKEN_SYMBOL=M42T
INITIAL_SUPPLY=100000

# Configuration MultiSig
MULTISIG_OWNERS=0xOwner1,0xOwner2,0xOwner3
REQUIRED_CONFIRMATIONS=2
```

### 3. Vérifications pré-déploiement

```bash
# Vérifier l'environnement
make check-env

# Vérifier le solde
make check-balance

# Tests complets
make test
```

## Déploiement

### Étape 1 : Déploiement des contrats

```bash
# Déploiement complet sur Sepolia
make deploy-all
```

Cette commande déploie :

1. MATTERN42Token avec les paramètres configurés
2. MultiSigWallet avec les propriétaires spécifiés

### Étape 2 : Vérification

```bash
# Vérifier le token
make verify-token TOKEN_ADDRESS=0x...

# Vérifier le MultiSig
make verify-multisig MULTISIG_ADDRESS=0x... OWNERS='["0xAddr1","0xAddr2","0xAddr3"]'
```

### Étape 3 : Transfert de propriété (CRITIQUE)

**Attention : Cette opération est irréversible !**

```bash
# Transférer la propriété au MultiSig
make transfer-ownership TOKEN_ADDRESS=0x... MULTISIG_ADDRESS=0x...
```

## Post-déploiement

### 1. Vérifications obligatoires

- [ ] Contrats visibles sur [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [ ] Détails du token corrects (nom, symbole, supply)
- [ ] Propriétaires MultiSig confirmés
- [ ] Propriété du token transférée

### 2. Tests fonctionnels

```bash
# Vérifier le solde après déploiement
make check-balance

# Tester une transaction MultiSig simple
```

### 3. Documentation

- Enregistrer les adresses des contrats
- Mettre à jour la documentation avec les liens Etherscan
- Partager les adresses avec les propriétaires MultiSig

## Informations Sepolia

- **Chain ID** : 11155111
- **RPC** : `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- **Explorer** : [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)
- **Faucets** :
  - [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
  - [https://faucets.chain.link/sepolia](https://faucets.chain.link/sepolia)

## Résolution de problèmes

### Erreurs courantes

**Solde insuffisant**

```bash
# Vérifier le solde
make check-balance

## Sécurité

### Checklist de sécurité

- [ ] Clés privées sécurisées (jamais dans le code)
- [ ] Adresses des contrats documentées
- [ ] Propriété transférée au MultiSig
- [ ] Propriétaires MultiSig confirmés
- [ ] Transactions de test réussies
- [ ] Procédures d'urgence documentées

### Bonnes pratiques

1. **Testez d'abord** : Toujours tester sur Sepolia avant mainnet
2. **Sauvegardez** : Clés privées et phrases de récupération
3. **Coordonnez** : Avec les autres propriétaires MultiSig
4. **Documentez** : Toutes les adresses et procédures

## Workflow MultiSig

### Opérations post-transfert

Une fois la propriété transférée, toutes les opérations critiques nécessitent le MultiSig :

1. **Minting** : Création de nouveaux tokens
2. **Pause** : Arrêt d'urgence des transferts
3. **Unpause** : Reprise des opérations

### Exemple : Minter via MultiSig

```bash
# 1. Encoder l'appel mint
# 2. Soumettre via MultiSig
# 3. Confirmer par 2/3 propriétaires
# 4. Exécuter la transaction
```

Voir le [Guide utilisateur](./USER_GUIDE.md) pour les détails des opérations MultiSig.

## Support

Pour toute difficulté :

1. Vérifier les logs de transaction sur Etherscan
2. Consulter la documentation technique
3. Créer une issue sur le repository

## Mainnet Deployment

**Warning**: Mainnet deployment requires real ETH and careful consideration.

### Pre-mainnet Checklist

1. Thoroughly test on testnets
2. Consider professional audit
3. Use hardware wallet for deployment
4. Have emergency procedures ready
5. Monitor initial transactions closely
6. Prepare community communications
7. Document all parameters and addresses

### Mainnet Networks

- **Ethereum**: Higher security, higher fees
- **BSC**: Lower fees, good ecosystem
- **Polygon**: Fast transactions, low fees

Choose based on your project's needs and target audience.
