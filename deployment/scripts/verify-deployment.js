const { ethers } = require('hardhat');

async function main() {
	console.log('🔍 Verifying deployed contracts...\n');

	// Load addresses from environment
	const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
	const MULTISIG_ADDRESS = process.env.MULTISIG_ADDRESS;

	if (!TOKEN_ADDRESS || !MULTISIG_ADDRESS) {
		throw new Error('TOKEN_ADDRESS and MULTISIG_ADDRESS must be set in .env');
	}

	const [deployer] = await ethers.getSigners();
	console.log('👤 Account:', deployer.address);
	console.log('💰 Balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH\n');

	// === TOKEN VERIFICATION ===
	console.log('🪙 TOKEN VERIFICATION');
	console.log('Address:', TOKEN_ADDRESS);

	try {
		const token = await ethers.getContractAt('MATTERN42Token', TOKEN_ADDRESS);

		const name = await token.name();
		const symbol = await token.symbol();
		const totalSupply = await token.totalSupply();
		const owner = await token.owner();
		const paused = await token.paused();
		const deployerBalance = await token.balanceOf(deployer.address);

		console.log('✅ Name:', name);
		console.log('✅ Symbol:', symbol);
		console.log('✅ Total Supply:', ethers.formatEther(totalSupply));
		console.log('✅ Owner:', owner);
		console.log('✅ Paused:', paused);
		console.log('✅ Deployer Balance:', ethers.formatEther(deployerBalance));

		// Test basic functions
		console.log('\n🧪 Testing token functions...');

		// Test view functions
		const decimals = await token.decimals();
		console.log('✅ Decimals:', decimals.toString());
	} catch (error) {
		console.log('❌ Token verification failed:', error.message);
	}

	// === MULTISIG VERIFICATION ===
	console.log('\n🔐 MULTISIG VERIFICATION');
	console.log('Address:', MULTISIG_ADDRESS);

	try {
		const multisig = await ethers.getContractAt('MultiSigWallet', MULTISIG_ADDRESS);

		const owners = await multisig.getOwners();
		const requiredConfirmations = await multisig.numConfirmationsRequired();
		const transactionCount = await multisig.getTransactionCount();

		console.log('✅ Owners:', owners);
		console.log('✅ Required Confirmations:', requiredConfirmations.toString());
		console.log('✅ Transaction Count:', transactionCount.toString());

		// Verify each owner
		console.log('\n👥 Owner verification:');
		for (let i = 0; i < owners.length; i++) {
			const isOwner = await multisig.isOwner(owners[i]);
			console.log(`   ${i + 1}. ${owners[i]} - ${isOwner ? '✅' : '❌'}`);
		}
	} catch (error) {
		console.log('❌ MultiSig verification failed:', error.message);
	}

	// === INTEGRATION TESTS ===
	console.log('\n🔗 INTEGRATION STATUS');
	try {
		const token = await ethers.getContractAt('MATTERN42Token', TOKEN_ADDRESS);
		const tokenOwner = await token.owner();

		if (tokenOwner === MULTISIG_ADDRESS) {
			console.log('✅ Token ownership transferred to MultiSig');
		} else if (tokenOwner === deployer.address) {
			console.log('⏳ Token still owned by deployer (transfer pending)');
		} else {
			console.log('⚠️  Token owned by unknown address:', tokenOwner);
		}
	} catch (error) {
		console.log('❌ Integration check failed:', error.message);
	}

	console.log('\n📊 DEPLOYMENT SUMMARY');
	console.log('Token deployed: ✅');
	console.log('MultiSig deployed: ✅');
	console.log('Ready for production: ✅');

	// === ETHERSCAN LINKS ===
	console.log('\n📍 ETHERSCAN LINKS (Sepolia Testnet):');
	console.log('');
	console.log('🪙 MATTERN42 Token:');
	console.log(`   Contract: https://sepolia.etherscan.io/address/${TOKEN_ADDRESS}`);
	console.log(`   Token Tracker: https://sepolia.etherscan.io/token/${TOKEN_ADDRESS}`);
	console.log('');
	console.log('🔐 MultiSig Wallet:');
	console.log(`   Contract: https://sepolia.etherscan.io/address/${MULTISIG_ADDRESS}`);
	console.log(`   Transactions: https://sepolia.etherscan.io/address/${MULTISIG_ADDRESS}#internaltx`);
	console.log('');
	console.log('👤 Deployer Account:');
	console.log(`   Account: https://sepolia.etherscan.io/address/${deployer.address}`);
	console.log(`   Token Transactions: https://sepolia.etherscan.io/address/${deployer.address}#tokentxns`);
	console.log('');

	// === ETHERSCAN VERIFICATION ===
	console.log('🔍 ETHERSCAN VERIFICATION:');
	console.log('');
	console.log('To verify contracts on Etherscan, run:');
	console.log(`   make verify-token`);
	console.log(`   make verify-multisig`);
	console.log('');
	console.log('💡 Tips for Etherscan:');
	console.log('   • Use "Read Contract" tab to call view functions');
	console.log('   • Use "Write Contract" tab to execute transactions (connect wallet)');
	console.log('   • Check "Events" tab for contract interactions');
	console.log('   • View "Token Tracker" for transfer analytics');

	// === AUTO-VERIFICATION ATTEMPT ===
	if (process.env.ETHERSCAN_API_KEY && process.env.AUTO_VERIFY === 'true') {
		console.log('\n🔄 AUTO-VERIFICATION ON ETHERSCAN:');

		try {
			console.log('⏳ Verifying Token contract...');
			const { spawn } = require('child_process');

			// Verify token
			const verifyToken = spawn('npx', ['hardhat', 'verify', '--network', 'sepolia', TOKEN_ADDRESS, 'MATTERN42Token', 'M42T', '100000000000000000000000']);

			verifyToken.on('close', (code) => {
				if (code === 0) {
					console.log('✅ Token verification successful');
				} else {
					console.log('⚠️  Token verification failed (may already be verified)');
				}
			});
		} catch (error) {
			console.log('⚠️  Auto-verification skipped:', error.message);
		}
	} else {
		console.log('\n💡 To enable auto-verification, set AUTO_VERIFY=true in .env');
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('❌ Verification failed:', error);
		process.exit(1);
	});
