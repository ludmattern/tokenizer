const { ethers } = require('hardhat');

async function main() {
	console.log('ETHERSCAN CONTRACT VIEWER\n');

	// Addresses from environment
	const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
	const MULTISIG_ADDRESS = process.env.MULTISIG_ADDRESS;
	const DEPLOYER_ADDRESS = process.env.PUBLIC_KEY;

	console.log('SEPOLIA TESTNET LINKS:\n');

	console.log('MATTERN42 TOKEN');
	console.log(`   Contract: https://sepolia.etherscan.io/address/${TOKEN_ADDRESS}`);
	console.log(`   Transactions: https://sepolia.etherscan.io/address/${TOKEN_ADDRESS}#internaltx`);
	console.log(`   Token Tracker: https://sepolia.etherscan.io/token/${TOKEN_ADDRESS}`);
	console.log('');

	console.log('MULTISIG WALLET');
	console.log(`   Contract: https://sepolia.etherscan.io/address/${MULTISIG_ADDRESS}`);
	console.log(`   Transactions: https://sepolia.etherscan.io/address/${MULTISIG_ADDRESS}#internaltx`);
	console.log('');

	console.log('DEPLOYER ACCOUNT');
	console.log(`   Account: https://sepolia.etherscan.io/address/${DEPLOYER_ADDRESS}`);
	console.log(`   Transactions: https://sepolia.etherscan.io/address/${DEPLOYER_ADDRESS}#tokentxns`);
	console.log('');

	console.log('USEFUL ETHERSCAN FEATURES:');
	console.log('   • Contract Tab: View source code and ABI');
	console.log('   • Read Contract: Call view functions');
	console.log('   • Write Contract: Execute transactions (connect wallet)');
	console.log('   • Events: See all contract events');
	console.log('   • Analytics: Token transfers and holders');
	console.log('');

	// Get some basic on-chain info
	try {
		const [deployer] = await ethers.getSigners();
		const balance = await ethers.provider.getBalance(deployer.address);

		console.log('CURRENT STATUS:');
		console.log(`   Network: Sepolia Testnet (Chain ID: 11155111)`);
		console.log(`   Your Balance: ${ethers.formatEther(balance)} ETH`);

		// Get latest block
		const blockNumber = await ethers.provider.getBlockNumber();
		console.log(`   Latest Block: ${blockNumber}`);

		// Get gas price
		const feeData = await ethers.provider.getFeeData();
		console.log(`   Gas Price: ${ethers.formatUnits(feeData.gasPrice, 'gwei')} gwei`);
	} catch (error) {
		console.log('   Status: Offline (no network connection)');
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('Error:', error);
		process.exit(1);
	});
