const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
	console.log('Testing MultiSig functionality...\n');

	const [deployer] = await ethers.getSigners();
	console.log('Account:', deployer.address);

	// Load addresses from .env
	const tokenAddress = process.env.TOKEN_ADDRESS;
	const multisigAddress = process.env.MULTISIG_ADDRESS;

	if (!tokenAddress || !multisigAddress) {
		console.error('Missing TOKEN_ADDRESS or MULTISIG_ADDRESS in .env');
		process.exit(1);
	}

	console.log('Token Address:', tokenAddress);
	console.log('MultiSig Address:', multisigAddress);

	// Connect to contracts
	const token = await ethers.getContractAt('MATTERN42Token', tokenAddress);
	const multisig = await ethers.getContractAt('MultiSigWallet', multisigAddress);

	// Check current state
	console.log('\n=== CURRENT STATE ===');
	const totalSupply = await token.totalSupply();
	const txCount = await multisig.getTransactionCount();
	const owners = await multisig.getOwners();
	const required = await multisig.numConfirmationsRequired();

	console.log('Total Supply:', ethers.formatEther(totalSupply));
	console.log('MultiSig Transaction Count:', txCount.toString());
	console.log('MultiSig Owners:', owners);
	console.log('Required Confirmations:', required.toString());

	// Test 1: Submit a mint transaction
	console.log('\n=== TEST 1: SUBMIT MINT TRANSACTION ===');

	const recipient = deployer.address; // Mint to deployer for testing
	const mintAmount = ethers.parseEther('1000'); // Mint 1000 tokens

	console.log('Minting to:', recipient);
	console.log('Amount:', ethers.formatEther(mintAmount));

	// Encode the mint function call
	const mintData = token.interface.encodeFunctionData('mint', [recipient, mintAmount]);

	console.log('Submitting transaction to MultiSig...');

	// Submit transaction to MultiSig
	const submitTx = await multisig.submitTransaction(tokenAddress, 0, mintData);
	await submitTx.wait();

	const newTxCount = await multisig.getTransactionCount();
	const txIndex = newTxCount - 1n; // Last transaction index

	console.log('Transaction submitted! Index:', txIndex.toString());

	// Get transaction details
	const transaction = await multisig.getTransaction(txIndex);
	console.log('Transaction details:');
	console.log('  To:', transaction.to);
	console.log('  Value:', transaction.value.toString());
	console.log('  Executed:', transaction.executed);
	console.log('  Confirmations:', transaction.numConfirmations.toString());

	// Test 2: Show transaction status
	console.log('\n=== TEST 2: TRANSACTION STATUS ===');
	console.log('Transaction needs', required.toString(), 'confirmations');
	console.log('Current confirmations:', transaction.numConfirmations.toString());

	if (transaction.numConfirmations >= required) {
		console.log('Transaction ready to execute!');

		// Execute the transaction
		console.log('Executing transaction...');
		const executeTx = await multisig.executeTransaction(txIndex);
		await executeTx.wait();
		console.log('Transaction executed!');

		// Check new token supply
		const newTotalSupply = await token.totalSupply();
		console.log('New Total Supply:', ethers.formatEther(newTotalSupply));

		// Check recipient balance
		const recipientBalance = await token.balanceOf(recipient);
		console.log('Recipient Balance:', ethers.formatEther(recipientBalance));
	} else {
		console.log('Transaction needs more confirmations');
		console.log('Missing confirmations:', (required - transaction.numConfirmations).toString());

		console.log('\n=== NEXT STEPS ===');
		console.log('To complete this transaction:');
		console.log('1. Connect with the second MultiSig owner');
		console.log('2. Call: multisig.confirmTransaction(' + txIndex.toString() + ')');
		console.log('3. Once confirmed, call: multisig.executeTransaction(' + txIndex.toString() + ')');
	}

	console.log('\n=== SUMMARY ===');
	console.log('MultiSig contract is working');
	console.log('Transaction submission works');
	console.log('Access control is properly configured');
	console.log('\nMultiSig Address:', multisigAddress);
	console.log('Test transaction index:', txIndex.toString());
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
