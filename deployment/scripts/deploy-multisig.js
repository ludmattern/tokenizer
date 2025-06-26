const { ethers } = require('hardhat');

async function main() {
	console.log('🔐 Deploying MultiSigWallet...');

	const [deployer] = await ethers.getSigners();
	console.log('Deploying contracts with account:', deployer.address);

	// MultiSig parameters
	const ownersString = process.env.MULTISIG_OWNERS || deployer.address;
	const owners = ownersString.split(',').map((addr) => addr.trim());
	const requiredConfirmations = parseInt(process.env.REQUIRED_CONFIRMATIONS || '2');

	console.log('MultiSig Owners:', owners);
	console.log('Required Confirmations:', requiredConfirmations);

	// Deploy MultiSig
	const MultiSigWallet = await ethers.getContractFactory('MultiSigWallet');
	const multisig = await MultiSigWallet.deploy(owners, requiredConfirmations);

	await multisig.deployed();

	console.log('✅ MultiSigWallet deployed to:', multisig.address);
	console.log('📊 MultiSig details:');
	console.log('   Owners:', await multisig.getOwners());
	console.log('   Required Confirmations:', await multisig.numConfirmationsRequired());

	// Save deployment info
	const deploymentInfo = {
		network: hardhat.network.name,
		multisigAddress: multisig.address,
		owners: owners,
		requiredConfirmations: requiredConfirmations,
		deployer: deployer.address,
		blockNumber: await ethers.provider.getBlockNumber(),
	};

	console.log('\n📋 Deployment Summary:');
	console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
