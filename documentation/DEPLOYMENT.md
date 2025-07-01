# Deployment Guide

Step-by-step guide to deploy MATTERN42 Token and its MultiSig wallet on Sepolia.

## Prerequisites

### Software

- Node.js v18+
- Git
- Wallet with Sepolia ETH

### Required Accounts

- [Infura](https://infura.io/) or other RPC provider
- [Etherscan](https://etherscan.io/) for verification

## Configuration

### 1. Initialization

```bash
# Complete setup
make setup
```

### 2. Environment Variables

```bash
cd deployment
cp .env.example .env
```

Edit `.env`:

```env
# Deployment wallet
PRIVATE_KEY=your_private_key_here

# Network access
INFURA_API_KEY=your_infura_api_key

# Contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Token configuration (optional)
TOKEN_NAME=MATTERN42Token
TOKEN_SYMBOL=M42T
INITIAL_SUPPLY=100000

# MultiSig configuration
MULTISIG_OWNERS=0xOwner1,0xOwner2,0xOwner3
REQUIRED_CONFIRMATIONS=2
```

### 3. Pre-deployment Checks

```bash
# Run tests
make test

# Check available commands
make help
```

### Available Commands

To see all available commands:

```bash
make help
```

main commands :

- `make setup` - Installation and compilation
- `make deploy` - Complete deployment (token + multisig + transfer)
- `make status` - Display contract status
- `make mint RECIPIENT=0x... AMOUNT=1000` - Create a mint transaction
- `make confirm TX=0` - Confirm a MultiSig transaction
- `make test` - Run tests
- `make clean` - Clean artifacts

## Deployment

### Step 1: Deploy Contracts

```bash
# Complete deployment on Sepolia
make deploy
```

This command deploys:

1. MATTERN42Token with configured parameters
2. MultiSigWallet with specified owners
3. Automatically transfers ownership to MultiSig

### Step 2: Verification

```bash
# Verify contracts using Hardhat
cd deployment
npx hardhat verify --network sepolia TOKEN_ADDRESS
npx hardhat verify --network sepolia MULTISIG_ADDRESS "['0xAddr1','0xAddr2','0xAddr3']" 2
```

### Step 3: Check Deployment Status

```bash
# Check deployment status and contract info
make status
```

## Post-deployment

### 1. Mandatory Checks

- [ ] Contracts visible on [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [ ] Correct token details (name, symbol, supply)
- [ ] MultiSig owners confirmed
- [ ] Token ownership transferred

### 2. Functional Tests

```bash
# Check deployment status and contract info
make status

# Test minting via MultiSig (example)
make mint RECIPIENT=0xYourAddress AMOUNT=1000
make confirm TX=0
```

### 3. Documentation

- Record contract addresses
- Update documentation with Etherscan links
- Share addresses with MultiSig owners

## Sepolia Information

- **Chain ID**: 11155111
- **RPC**: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- **Explorer**: [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)
- **Faucets**:
  - [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
  - [https://faucets.chain.link/sepolia](https://faucets.chain.link/sepolia)
  - [https://sepolia-faucet.pk910.de/](https://sepolia-faucet.pk910.de/)

> **Note**: Sepolia est le réseau de test recommandé pour Ethereum depuis la fusion (Merge). Goerli et Ropsten sont dépréciés.

## Troubleshooting

### Common Errors

#### Insufficient Balance

```bash
# Check balance
make status

# Get testnet ETH from faucets (manual process)
# Visit: https://sepoliafaucet.com/ or https://faucets.chain.link/sepolia
```

#### RPC Connection Issues

- Verify INFURA_API_KEY in .env
- Check network connectivity
- Try alternative RPC endpoints

#### Verification Failures

- Wait a few minutes after deployment
- Verify contract addresses are correct
- Check constructor parameters format

## Security

### Security Checklist

- [ ] Private keys secured (never in code)
- [ ] Contract addresses documented
- [ ] Ownership transferred to MultiSig
- [ ] MultiSig owners confirmed
- [ ] Test transactions successful
- [ ] Emergency procedures documented

### Best Practices

1. **Test First**: Always test on Sepolia before mainnet
2. **Backup**: Private keys and recovery phrases
3. **Coordinate**: With other MultiSig owners
4. **Document**: All addresses and procedures

## MultiSig Workflow

### Post-transfer Operations

Once ownership is transferred, all critical operations require MultiSig:

1. **Minting**: Creating new tokens
2. **Pause**: Emergency stop of transfers
3. **Unpause**: Resume operations

### Example: Minting via MultiSig

```bash
# 1. Encode mint call
# 2. Submit via MultiSig
# 3. Confirm by 2/3 owners
# 4. Execute transaction
```

See [User Guide](./USER_GUIDE.md) for detailed MultiSig operations.

## Support

For any difficulties:

1. Check transaction logs on Etherscan
2. Consult technical documentation
3. Create an issue on the repository

## Next Steps

After successful Sepolia deployment:

1. **Test thoroughly**: Verify all functions work as expected
2. **Document addresses**: Update all references with deployed addresses
3. **Coordinate**: With MultiSig owners for operational procedures
4. **Monitor**: Initial transactions and gas usage

For mainnet deployment, consider professional audit and enhanced security measures.
