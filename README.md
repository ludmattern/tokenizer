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
├── init.sh                      # Legacy initialization script
├── code/                        # Smart contracts
│   ├── MATTERN42.sol           # ERC20 Token
│   └── MultiSigWallet.sol      # Multi-signature wallet
├── deployment/                  # Deployment infrastructure
│   ├── hardhat.config.js       # Hardhat configuration
│   ├── scripts/                # Deployment scripts
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

# Check environment
make check-env

# Compilation
make compile
```

### 4. Deployment (Sepolia)

```bash
# Complete deployment
make deploy-all

# Contract verification
make verify-token TOKEN_ADDRESS=0x...
make verify-multisig MULTISIG_ADDRESS=0x... OWNERS='["0x...","0x..."]'

# Ownership transfer (CRITICAL)
make transfer-ownership TOKEN_ADDRESS=0x... MULTISIG_ADDRESS=0x...
```

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make help` | Display all commands |
| `make setup` | Complete setup |
| `make test` | Complete tests |
| `make deploy-all` | Deploy to Sepolia |
| `make check-balance` | Check ETH balance |
| `make faucet` | Testnet faucet links |

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

## Project Compliance

This project fully complies with the **"Tokenizer" subject requirements**:

### Mandatory Requirements Met

1. **Token with "42" in name**: MATTERN42 Token (M42T) ✓
2. **README explaining choices**: Complete technical documentation ✓
3. **Blockchain platform**: Ethereum (Sepolia testnet) ✓
4. **Programming language**: Solidity with OpenZeppelin ✓
5. **Development tools**: Hardhat, Ethers.js v6 ✓
6. **Test chains**: Sepolia testnet only ✓
7. **Code structure**: `code/` folder with contracts ✓
8. **Commented code**: Full NatSpec documentation ✓
9. **Functionality demo**: Comprehensive test suite ✓
10. **Security**: Ownership controls, pausable, MultiSig ✓
11. **Deployment folder**: `deployment/` with scripts ✓
12. **Public blockchain**: Deployed on Sepolia ✓
13. **Explorer publication**: Verified on Etherscan ✓
14. **Addresses documented**: In `.env` and documentation ✓
15. **Documentation folder**: `documentation/` with guides ✓
16. **Clear documentation**: Professional multi-document structure ✓

### Bonus Features Implemented

- **Multi-signature wallet**: `MultiSigWallet.sol` for secure governance
- **Integration**: Complete workflow from token to MultiSig ownership transfer
- **Automation**: Professional Makefile with all commands
- **Advanced security**: Emergency pause, access controls, comprehensive testing

### Deployed Contracts (Sepolia)

- **Token Contract**: `0x08c26547b5984CC5BaC4079b8992bc0550beE6ab`
- **MultiSig Wallet**: `0x87Ca5Fbf839891C37c1dFE95fD8FaE60A0108a2a`
- **Explorer**: [Sepolia Etherscan](https://sepolia.etherscan.io/)

## License

MIT License
