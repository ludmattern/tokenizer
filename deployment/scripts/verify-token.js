const { run } = require('hardhat');
const { ethers } = require('hardhat');

async function main() {
	console.log('Verifying MATTERN42Token on Etherscan...');

	// Load address from environment
	const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

	if (!TOKEN_ADDRESS) {
		throw new Error('TOKEN_ADDRESS must be set in .env');
	}

	// Constructor arguments for the token
	const tokenName = 'MATTERN42Token';
	const tokenSymbol = 'M42T';
	const initialSupply = ethers.parseEther('100000'); // 100,000 tokens

	console.log('Verifying with parameters:');
	console.log('  Address:', TOKEN_ADDRESS);
	console.log('  Name:', tokenName);
	console.log('  Symbol:', tokenSymbol);
	console.log('  Initial Supply:', ethers.formatEther(initialSupply));

	try {
		await run('verify:verify', {
			address: TOKEN_ADDRESS,
			constructorArguments: [tokenName, tokenSymbol, initialSupply],
		});

		console.log('✅ MATTERN42Token verification successful!');
		console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${TOKEN_ADDRESS}#code`);
	} catch (error) {
		if (error.message.includes('Already Verified')) {
			console.log('✅ Contract already verified on Etherscan');
			console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${TOKEN_ADDRESS}#code`);
		} else {
			throw error;
		}
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('❌ Verification failed:', error);
		process.exit(1);
	});
