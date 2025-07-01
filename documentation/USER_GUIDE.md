# User Guide

Usage guide for MATTERN42 Token for different types of users.

## For Token Holders

### Add Token to Your Wallet

```
Contract Address: 0x... (see deployment info)
Symbol: M42T
Decimals: 18
```

### Basic Operations

#### Send Tokens

1. Open your wallet (MetaMask, Trust Wallet, etc.)
2. Select MATTERN42 Token
3. Enter recipient address
4. Enter amount
5. Confirm transaction

#### Receive Tokens

- Share your wallet address
- Tokens appear automatically after confirmation

#### Burn Tokens

```javascript
// Only your own tokens can be burned
token.burn(amount)
```

## For Administrators

### Responsibilities

- Mint new tokens (within max supply limit)
- Pause/unpause transfers in emergency
- Transfer ownership to MultiSig
- Monitor token ecosystem

### Administrative Functions

#### Create New Tokens

```javascript
await token.mint(recipientAddress, amount);
```

#### Emergency Pause

```javascript
await token.pause();

await token.unpause();
```

#### Ownership Transfer

```javascript
// Transfer to MultiSig for enhanced security
await token.transferOwnership(multisigAddress);
```

## For MultiSig Operators

### Understanding the System

- Requires multiple signatures for execution
- Default: 2 out of 3 owners must approve
- All transactions are visible on-chain
- Owners can revoke their approval before execution

### MultiSig Operations

#### 1. Submit Transaction

```javascript
await multisig.submitTransaction(
    targetAddress,
    ethValue,
    encodedData
);
```

#### 2. Confirm Transaction

```javascript
await multisig.confirmTransaction(transactionIndex);
```

#### 3. Execute Transaction

```javascript
await multisig.executeTransaction(transactionIndex);
```

#### 4. Revoke Confirmation

```javascript
await multisig.revokeConfirmation(transactionIndex);
```

### Common Scenarios

#### Mint Tokens via MultiSig

1. One owner submits mint transaction
2. Other owners review and confirm
3. Execute after required confirmations
4. Tokens created to target address

#### Emergency Pause via MultiSig

1. One owner submits pause transaction
2. Quick confirmation from other owners
3. Execute to suspend all transfers
4. Investigate and resume when secure

## Wallet Integration

### Supported Wallets

- **MetaMask**: Browser extension
- **Hardware wallets**: Ledger, Trezor (recommended for MultiSig)
- **Mobile wallets**: Trust Wallet, Rainbow, Coinbase Wallet
- All ERC20-compatible wallets

## Transaction Examples

### Basic Transfer

```javascript
const amount = ethers.parseEther("100");
await token.transfer(recipientAddress, amount);
```

### Approve and TransferFrom

```javascript
// Approve a spender
await token.approve(spenderAddress, amount);

// Spender transfers on your behalf
await token.transferFrom(yourAddress, recipientAddress, amount);
```

### Check Allowance

```javascript
// See how much the spender can transfer
const allowance = await token.allowance(ownerAddress, spenderAddress);
```

## Troubleshooting

### Transaction Failures

- **Insufficient gas**: Increase gas limit
- **Insufficient balance**: Check token balance
- **Contract paused**: Wait for resumption
- **Wrong network**: Switch to Sepolia

### Common Issues

- **Tokens not visible**: Manually add contract address
- **High gas fees**: Wait for lower congestion
- **Pending transactions**: Wait or increase gas price
- **MultiSig delays**: Coordinate with other owners

## Security

### For All Users

- Verify contract addresses before interaction
- Use hardware wallets for large amounts
- Backup private keys securely
- Verify recipient addresses

### For MultiSig Owners

- Coordinate with other owners
- Review all transaction details
- Use separate devices for each owner
- Maintain secure communication channels

### Warning Signs

- Requests for private keys
- Unofficial contract addresses
- Pressure to approve quickly
- Unexpected transaction requests

## Support

For any help:

1. Check transaction on Etherscan
2. Confirm contract addresses
3. Verify network selection
4. Consult technical documentation
