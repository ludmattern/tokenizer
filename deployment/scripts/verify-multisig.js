const { run } = require('hardhat');

async function main() {
	console.log('Verifying MultiSigWallet on Etherscan...');

	// Load addresses from environment
	const MULTISIG_ADDRESS = process.env.MULTISIG_ADDRESS;
	const MULTISIG_OWNERS = process.env.MULTISIG_OWNERS;
	const REQUIRED_CONFIRMATIONS = process.env.REQUIRED_CONFIRMATIONS;

	if (!MULTISIG_ADDRESS || !MULTISIG_OWNERS || !REQUIRED_CONFIRMATIONS) {
		throw new Error('MULTISIG_ADDRESS, MULTISIG_OWNERS, and REQUIRED_CONFIRMATIONS must be set in .env');
	}

	// Convert owners string to array
	const ownersArray = MULTISIG_OWNERS.split(',').map((addr) => addr.trim());

	console.log('Verifying with parameters:');
	console.log('  Address:', MULTISIG_ADDRESS);
	console.log('  Owners:', ownersArray);
	console.log('  Required Confirmations:', REQUIRED_CONFIRMATIONS);

	try {
		await run('verify:verify', {
			address: MULTISIG_ADDRESS,
			constructorArguments: [ownersArray, parseInt(REQUIRED_CONFIRMATIONS)],
		});

		console.log('MultiSigWallet verification successful!');
		console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${MULTISIG_ADDRESS}#code`);
	} catch (error) {
		if (error.message.includes('Already Verified')) {
			console.log('Contract already verified on Etherscan');
			console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${MULTISIG_ADDRESS}#code`);
		} else {
			throw error;
		}
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('Verification failed:', error);
		process.exit(1);
	});
