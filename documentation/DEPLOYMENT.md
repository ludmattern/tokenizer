# Deployment Guide

Step-by-step guide to deploy MATTERN42 Token and its MultiSig wallet on Sepolia.

## Prerequisites

### Software

- Node.js v16+
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
# Check environment
make check-env

# Check balance
make check-balance

# Complete tests
make test
```

## Deployment

### Step 1: Deploy Contracts

```bash
# Complete deployment on Sepolia
make deploy-all
```

This command deploys:

1. MATTERN42Token with configured parameters
2. MultiSigWallet with specified owners

### Step 2: Verification

```bash
# Verify token
make verify-token TOKEN_ADDRESS=0x...

# Verify MultiSig
make verify-multisig MULTISIG_ADDRESS=0x... OWNERS='["0xAddr1","0xAddr2","0xAddr3"]'
```

### Step 3: Ownership Transfer (CRITICAL)

**Warning: This operation is irreversible!**

```bash
# Transfer ownership to MultiSig
make transfer-ownership TOKEN_ADDRESS=0x... MULTISIG_ADDRESS=0x...
```

## Post-deployment

### 1. Mandatory Checks

- [ ] Contracts visible on [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [ ] Correct token details (name, symbol, supply)
- [ ] MultiSig owners confirmed
- [ ] Token ownership transferred

### 2. Functional Tests

```bash
# Check balance after deployment
make check-balance

# Test simple MultiSig transaction
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

## Troubleshooting

### Common Errors

**Insufficient Balance**

```bash
# Check balance
make check-balance

# Get testnet ETH from faucets
make faucet
```

**RPC Connection Issues**

- Verify INFURA_API_KEY in .env
- Check network connectivity
- Try alternative RPC endpoints

**Verification Failures**

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
