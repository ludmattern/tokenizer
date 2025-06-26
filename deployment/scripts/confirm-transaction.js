const { ethers } = require('hardhat');

async function main() {
	console.log('Confirming and executing MultiSig transaction...\n');

	// Check which account to use (USE_SECOND_ACCOUNT env var or --second flag)
	const useSecondAccount = process.env.USE_SECOND_ACCOUNT === 'true' || process.argv.includes('--second');

	// Get transaction index from args or env
	const txIndex = process.env.TX_INDEX || process.argv.find((arg) => !isNaN(arg)) || '0';

	let signer;
	if (useSecondAccount) {
		// Use second account
		const privateKey2 = process.env.PRIVATE_KEY_2;
		if (!privateKey2) {
			console.error('Missing PRIVATE_KEY_2 in .env');
			console.log('Add the second account private key to .env as PRIVATE_KEY_2=0x...');
			process.exit(1);
		}
		signer = new ethers.Wallet(privateKey2, ethers.provider);
		console.log('Using SECOND account:', signer.address);
	} else {
		// Use default account from Hardhat
		[signer] = await ethers.getSigners();
		console.log('Using PRIMARY account:', signer.address);
	}

	// Load addresses
	const tokenAddress = process.env.TOKEN_ADDRESS;
	const multisigAddress = process.env.MULTISIG_ADDRESS;

	if (!tokenAddress || !multisigAddress) {
		console.error('Missing TOKEN_ADDRESS or MULTISIG_ADDRESS in .env');
		process.exit(1);
	}

	// Connect to contracts with chosen signer
	const token = await ethers.getContractAt('MATTERN42Token', tokenAddress, signer);
	const multisig = await ethers.getContractAt('MultiSigWallet', multisigAddress, signer);

	console.log('Transaction index:', txIndex);
	console.log('Token:', tokenAddress);
	console.log(' MultiSig:', multisigAddress);

	// Check if account is a MultiSig owner
	const owners = await multisig.getOwners();
	const isOwner = owners.some((owner) => owner.toLowerCase() === signer.address.toLowerCase());

	if (!isOwner) {
		console.log('This account is not a MultiSig owner!');
		console.log('Account:', signer.address);
		console.log('Owners:', owners);
		return;
	}

	console.log('Account is a valid MultiSig owner');

	// Check current state
	console.log('\n=== CURRENT STATE ===');
	const transaction = await multisig.getTransaction(txIndex);
	const totalSupply = await token.totalSupply();
	const required = await multisig.numConfirmationsRequired();

	console.log('Total Supply:', ethers.formatEther(totalSupply));
	console.log('Transaction Status:');
	console.log('  Executed:', transaction.executed);
	console.log('  Confirmations:', transaction.numConfirmations.toString(), '/', required.toString());

	if (transaction.executed) {
		console.log('Transaction already executed!');

		// Show transaction details
		try {
			const mintData = transaction.data;
			const decodedData = token.interface.decodeFunctionData('mint', mintData);
			const recipient = decodedData[0];
			const amount = decodedData[1];

			console.log('\nExecuted Transaction Details:');
			console.log('  Function: mint');
			console.log('  Recipient:', recipient);
			console.log('  Amount:', ethers.formatEther(amount));
		} catch (e) {
			console.log('  Raw data:', transaction.data);
		}
		return;
	}

	// Check if already confirmed by this account
	const isConfirmed = await multisig.isConfirmed(txIndex, signer.address);
	console.log('Already confirmed by this account:', isConfirmed);

	// Step 1: Confirm with current account
	if (!isConfirmed) {
		console.log('\n=== STEP 1: CONFIRM TRANSACTION ===');
		try {
			// Check balance for gas
			const balance = await ethers.provider.getBalance(signer.address);
			console.log('Account balance:', ethers.formatEther(balance), 'ETH');

			if (balance < ethers.parseEther('0.001')) {
				console.log('Low balance! May not have enough ETH for gas fees');
			}

			const confirmTx = await multisig.confirmTransaction(txIndex);
			await confirmTx.wait();
			console.log('Transaction confirmed by', signer.address);
		} catch (error) {
			console.error('Error confirming transaction:', error.message);

			if (error.message.includes('insufficient funds')) {
				console.log('\nSolution: Fund this account with ETH for gas fees:');
				console.log('Run: npx hardhat run scripts/fund-second-account.js --network sepolia');
			}
			return;
		}
	} else {
		console.log('Transaction already confirmed by this account');
	}

	// Check updated confirmations
	const updatedTransaction = await multisig.getTransaction(txIndex);
	console.log('Updated confirmations:', updatedTransaction.numConfirmations.toString(), '/', required.toString());

	// Step 2: Execute if enough confirmations
	console.log('\n=== STEP 2: EXECUTE TRANSACTION ===');

	if (updatedTransaction.numConfirmations >= required) {
		console.log('Enough confirmations! Executing transaction...');

		try {
			const executeTx = await multisig.executeTransaction(txIndex);
			await executeTx.wait();

			console.log('Transaction executed successfully!');

			// Check results
			console.log('\n=== RESULTS ===');
			const newTotalSupply = await token.totalSupply();

			// Decode transaction to get details
			try {
				const mintData = updatedTransaction.data;
				const decodedData = token.interface.decodeFunctionData('mint', mintData);
				const recipient = decodedData[0];
				const amount = decodedData[1];

				const recipientBalance = await token.balanceOf(recipient);

				console.log('New Total Supply:', ethers.formatEther(newTotalSupply));
				console.log('Recipient:', recipient);
				console.log('Recipient Balance:', ethers.formatEther(recipientBalance));
				console.log('Tokens Minted:', ethers.formatEther(amount));

				console.log('\nMULTISIG TRANSACTION COMPLETED! 🎉');
				console.log('Governance process successful');
				console.log('All required confirmations received');
				console.log('Transaction executed by', signer.address);
			} catch (e) {
				console.log('New Total Supply:', ethers.formatEther(newTotalSupply));
				console.log('Tokens Minted:', ethers.formatEther(newTotalSupply - totalSupply));
			}
		} catch (error) {
			console.error('Error executing transaction:', error.message);
		}
	} else {
		const missing = required - updatedTransaction.numConfirmations;
		console.log('Still need', missing.toString(), 'more confirmation(s)');

		console.log('\n=== NEXT STEPS ===');
		if (useSecondAccount) {
			console.log('Switch to the PRIMARY account and run:');
			console.log('npx hardhat run scripts/confirm-transaction.js --network sepolia', txIndex);
		} else {
			console.log('Switch to the SECOND account and run:');
			console.log('npx hardhat run scripts/confirm-transaction.js --network sepolia --second', txIndex);
		}

		console.log('\nOr use the specific commands:');
		console.log('Primary:  npx hardhat run scripts/confirm-transaction.js --network sepolia', txIndex);
		console.log('Second:   npx hardhat run scripts/confirm-transaction.js --network sepolia --second', txIndex);
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
