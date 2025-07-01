# MATTERN42 Token Project

## Overview

MATTERN42 Token (M42T) is an ERC20 token with advanced security features including a multi-signature wallet for decentralized governance.

## Features

- **ERC20 Token** standard with limited supply (1M tokens max)
- **Multi-Signature Wallet** for critical operations (2/3 signatures)
- **Pausable**: emergency stop for transfers
- **Mintable/Burnable**: controlled token creation/destruction

## Project Structure

```
tokenizer/
├── Makefile                     # Automation commands
├── README.md                    # Project overview
├── code/                        # Smart contracts
│   ├── MATTERN42.sol           # ERC20 Token
│   └── MultiSigWallet.sol      # Multi-signature wallet
├── deployment/                  # Deployment infrastructure
│   ├── hardhat.config.js       # Hardhat configuration
│   ├── manage.js               # Deployment and management script
│   ├── .env.example            # Environment variables template
│   ├── .env                    # Environment variables (to be created)
│   └── test/                   # Automated tests
└── documentation/              # Detailed documentation
    ├── DEPLOYMENT.md           # Deployment guide
    ├── TECHNICAL_OVERVIEW.md   # Technical architecture
    └── USER_GUIDE.md          # User guide
```

## Quick Start

### 1. Initial Setup

```bash
# Complete project setup
make setup

# Deploy
make deploy

# Check status
make status
```

### 2. Environment Configuration

```bash
cd deployment
cp .env.example .env
# Edit .env with your keys:
# PRIVATE_KEY=your_private_key
# INFURA_API_KEY=your_infura_key
# ETHERSCAN_API_KEY=your_etherscan_key
```

### 3. Development and Testing

```bash
# Complete tests
make test

# Check available commands
make help
```

### 4. Deployment (Sepolia)

```bash
# Complete deployment (token + multisig + ownership transfer)
make deploy

# Check deployment status
make status

# Contract verification (manual)
cd deployment
npx hardhat verify --network sepolia TOKEN_ADDRESS
npx hardhat verify --network sepolia MULTISIG_ADDRESS "['0x...','0x...','0x...']" 2
```

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make help` | Display all commands |
| `make setup` | Complete setup |
| `make test` | Complete tests |
| `make deploy` | Deploy to Sepolia |
| `make status` | Check deployment status |
| `make mint RECIPIENT=0x... AMOUNT=1000` | Create mint transaction |
| `make confirm TX=0` | Confirm MultiSig transaction |
| `make confirm-second TX=0` | Confirm with second account |
| `make clean` | Clean artifacts |

## Network

### Sepolia Testnet Only

- Chain ID: 11155111
- Explorer: <https://sepolia.etherscan.io/>
- Faucet: <https://sepoliafaucet.com/>

## Documentation

- **[Deployment Guide](./documentation/DEPLOYMENT.md)** - Step-by-step deployment
- **[Technical Overview](./documentation/TECHNICAL_OVERVIEW.md)** - Architecture and specifications
- **[User Guide](./documentation/USER_GUIDE.md)** - Contract usage

## Security

**Critical Points:**

- Ownership transfer to MultiSig is **irreversible**
- Always test on Sepolia before mainnet
- Backup MultiSig owner private keys
- Coordinate with other owners before operations

## Support

For any questions, consult the documentation or create an issue on the repository.

### Bonus Features Implemented

- **Multi-signature wallet**: `MultiSigWallet.sol` for secure governance
- **Integration**: Complete workflow from token to MultiSig ownership transfer
- **Automation**: Professional Makefile with all commands
- **Advanced security**: Emergency pause, access controls, comprehensive testing

### Deployed Contracts (Sepolia)

- **Token Contract**: Check `.env` file after deployment
- **MultiSig Wallet**: Check `.env` file after deployment
- **Explorer**: [Sepolia Etherscan](https://sepolia.etherscan.io/)
