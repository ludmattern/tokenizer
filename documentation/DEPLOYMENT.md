# Deployment Guide

This guide provides step-by-step instructions for deploying MATTERN42 Token and its MultiSig wallet.

## Prerequisites

### Software Requirements

- Node.js v16 or higher
- npm package manager
- Git (for version control)

### Network Requirements

- Testnet ETH for gas fees
- Infura account (or similar RPC provider)
- Etherscan account (for contract verification)

## Environment Setup

### 1. Initial Setup

```bash
# Clone and initialize
git clone <repository-url>
cd tokenizer
./init.sh
```

### 2. Configure Environment Variables

```bash
cd deployment
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Deployment wallet
PRIVATE_KEY=your_private_key_here

# Network access
INFURA_API_KEY=your_infura_api_key

# Contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Token configuration
TOKEN_NAME=MATTERN42Token
TOKEN_SYMBOL=M42T
INITIAL_SUPPLY=100000

# MultiSig configuration
MULTISIG_OWNERS=0xOwner1,0xOwner2,0xOwner3
REQUIRED_CONFIRMATIONS=2
```

## Deployment Process

### 1. Pre-deployment Testing

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Test specific functionality
npx hardhat test test/MATTERN42Token.test.js
npx hardhat test test/Multisig.test.js
```

### 2. Deploy Token Contract

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy-token.js --network sepolia

# Verify contract (optional)
npx hardhat verify --network sepolia <TOKEN_ADDRESS> "MATTERN42Token" "M42T" "100000000000000000000000"
```

### 3. Deploy MultiSig Contract

```bash
# Deploy MultiSig wallet
npx hardhat run scripts/deploy-multisig.js --network sepolia

# Verify contract (optional)
npx hardhat verify --network sepolia <MULTISIG_ADDRESS> '["0xOwner1","0xOwner2","0xOwner3"]' 2
```

## Post-Deployment Steps

### 1. Transfer Token Ownership to MultiSig

```javascript
// Create transfer script
const token = await ethers.getContractAt("MATTERN42Token", TOKEN_ADDRESS);
await token.transferOwnership(MULTISIG_ADDRESS);
```

### 2. Verify Deployment

- Check contracts on block explorer
- Verify token details (name, symbol, supply)
- Test basic functionality
- Confirm MultiSig ownership transfer

### 3. Update Documentation

- Record contract addresses
- Update README with deployment info
- Document network and explorer links

## Network Information

### Sepolia Testnet

- **Chain ID**: 11155111
- **RPC**: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- **Explorer**: <https://sepolia.etherscan.io/>
- **Faucet**: <https://sepoliafaucet.com/>

### BSC Testnet

- **Chain ID**: 97
- **RPC**: `https://data-seed-prebsc-1-s1.binance.org:8545`
- **Explorer**: <https://testnet.bscscan.com/>
- **Faucet**: <https://testnet.binance.org/faucet-smart>

## Troubleshooting

### Common Issues

- **Gas Errors**: Increase gas limit in hardhat config
- **Nonce Issues**: Reset account or wait for pending transactions
- **Network Issues**: Check RPC endpoint and API keys
- **Verification Failures**: Ensure constructor parameters match

### Gas Estimation

- Token Contract: ~1.2M gas
- MultiSig Contract: ~800K gas
- Total Cost: ~0.04 ETH (at 20 gwei)

## Security Checklist

- [ ] Private keys secure and never committed
- [ ] Contract addresses documented
- [ ] Ownership transferred to MultiSig
- [ ] Test transactions successful
- [ ] Emergency procedures ready
}

```

**Nonce Issues**
```bash
# Reset account nonce
npx hardhat run scripts/reset-nonce.js --network sepolia
```

**Verification Failures**

```bash
# Flatten contract for manual verification
npx hardhat flatten contracts/MATTERN42Token.sol > flattened.sol
```

**Connection Issues**

- Verify RPC URL is correct
- Check API key permissions
- Ensure sufficient balance for gas

**Contract Interaction Failures**

- Confirm contract addresses
- Verify ABI matches deployed contract
- Check function parameters format

## Gas Optimization

### Deployment Costs (Sepolia)

- **MATTERN42Token**: ~1,200,000 gas
- **MultiSigWallet**: ~800,000 gas
- **Total estimated cost**: ~0.04 ETH (at 20 gwei)

### Optimization Tips

- Deploy during low network activity
- Use appropriate gas price
- Batch related operations

## Security Checklist

- [ ] Private keys stored securely (never in code)
- [ ] Contract addresses recorded
- [ ] Ownership transferred to MultiSig
- [ ] MultiSig owners confirmed
- [ ] Test transactions completed
- [ ] Documentation updated with addresses
- [ ] Emergency procedures documented
- [ ] Backup access methods prepared

## Mainnet Deployment

⚠️ **Warning**: Mainnet deployment requires real ETH and careful consideration.

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
