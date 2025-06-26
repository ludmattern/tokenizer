# MATTERN42 Token Project

## Vue d'ensemble

MATTERN42 Token (M42T) est un token ERC20 avec fonctionnalités de sécurité avancées incluant un portefeuille multi-signature pour la gouvernance décentralisée.

## Caractéristiques

- **Token ERC20** standard avec supply limitée (1M tokens max)
- **Multi-Signature Wallet** pour les opérations critiques (2/3 signatures)
- **Pausable** : arrêt d'urgence des transferts
- **Mintable/Burnable** : création/destruction contrôlée de tokens

## Structure du projet

```
tokenizer/
├── Makefile                     # Commandes d'automatisation
├── init.sh                      # Script d'initialisation legacy
├── code/                        # Contrats intelligents
│   ├── MATTERN42.sol           # Token ERC20
│   └── MultiSigWallet.sol      # Portefeuille multi-signature
├── deployment/                  # Infrastructure de déploiement
│   ├── hardhat.config.js       # Configuration Hardhat
│   ├── scripts/                # Scripts de déploiement
│   └── test/                   # Tests automatisés
└── documentation/              # Documentation détaillée
    ├── DEPLOYMENT.md           # Guide de déploiement
    ├── TECHNICAL_OVERVIEW.md   # Architecture technique
    └── USER_GUIDE.md          # Guide utilisateur
```

## Démarrage rapide

### 1. Configuration initiale

```bash
# Configuration complète du projet
make setup

# Vérifier le statut
make status
```

### 2. Configuration de l'environnement

```bash
cd deployment
cp .env.example .env
# Éditer .env avec vos clés :
# PRIVATE_KEY=your_private_key
# INFURA_API_KEY=your_infura_key
# ETHERSCAN_API_KEY=your_etherscan_key
```

### 3. Développement et tests

```bash
# Tests complets
make test

# Vérifier l'environnement
make check-env

# Compilation
make compile
```

### 4. Déploiement (Sepolia)

```bash
# Déploiement complet
make deploy-all

# Vérification des contrats
make verify-token TOKEN_ADDRESS=0x...
make verify-multisig MULTISIG_ADDRESS=0x... OWNERS='["0x...","0x..."]'

# Transfert de propriété (CRITIQUE)
make transfer-ownership TOKEN_ADDRESS=0x... MULTISIG_ADDRESS=0x...
```

## Commandes Makefile

| Commande | Description |
|----------|-------------|
| `make help` | Afficher toutes les commandes |
| `make setup` | Configuration complète |
| `make test` | Tests complets |
| `make deploy-all` | Déploiement sur Sepolia |
| `make check-balance` | Vérifier le solde ETH |
| `make faucet` | Liens vers les faucets testnet |

## Réseau

**Sepolia Testnet uniquement**

- Chain ID : 11155111
- Explorer : <https://sepolia.etherscan.io/>
- Faucet : <https://sepoliafaucet.com/>

## Documentation

- **[Guide de déploiement](./documentation/DEPLOYMENT.md)** - Déploiement étape par étape
- **[Vue technique](./documentation/TECHNICAL_OVERVIEW.md)** - Architecture et spécifications
- **[Guide utilisateur](./documentation/USER_GUIDE.md)** - Utilisation des contrats

## Sécurité

**Points critiques :**

- Le transfert de propriété vers le MultiSig est **irréversible**
- Testez toujours sur Sepolia avant mainnet
- Sauvegardez les clés privées des propriétaires MultiSig
- Coordonnez avec les autres propriétaires avant les opérations

## Support

Pour toute question, consultez la documentation ou créez une issue sur le repository.

## Licence

MIT License
