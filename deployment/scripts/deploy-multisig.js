const { ethers } = require('hardhat');
const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
	console.log('Deploying MultiSigWallet...');

	const [deployer] = await ethers.getSigners();
	console.log('Deploying contracts with account:', deployer.address);

	// Configuration gas économique
	const gasPrice = process.env.GAS_PRICE ? ethers.parseUnits(process.env.GAS_PRICE, 'gwei') : ethers.parseUnits('2', 'gwei');
	console.log('Using gas price:', ethers.formatUnits(gasPrice, 'gwei'), 'gwei');

	// MultiSig parameters
	const ownersString = process.env.MULTISIG_OWNERS || deployer.address;
	const owners = ownersString.split(',').map((addr) => addr.trim());
	const requiredConfirmations = parseInt(process.env.REQUIRED_CONFIRMATIONS || '2');

	console.log('MultiSig Owners:', owners);
	console.log('Required Confirmations:', requiredConfirmations);

	// Deploy MultiSig avec frais réduits
	const MultiSigWallet = await ethers.getContractFactory('MultiSigWallet');
	const multisig = await MultiSigWallet.deploy(owners, requiredConfirmations, {
		gasPrice: gasPrice,
		gasLimit: process.env.GAS_LIMIT || 6000000,
	});

	console.log('⏳ Waiting for deployment (may take longer with low gas price)...');
	await multisig.waitForDeployment();

	console.log('MultiSigWallet deployed to:', await multisig.getAddress());
	console.log('MultiSig details:');
	console.log('   Owners:', await multisig.getOwners());
	console.log('   Required Confirmations:', await multisig.numConfirmationsRequired());

	// Save deployment info
	const deploymentInfo = {
		network: hre.network.name,
		multisigAddress: await multisig.getAddress(),
		owners: owners,
		requiredConfirmations: requiredConfirmations,
		deployer: deployer.address,
		blockNumber: await ethers.provider.getBlockNumber(),
		timestamp: new Date().toISOString(),
	};

	console.log('\nDeployment Summary:');
	console.log(JSON.stringify(deploymentInfo, null, 2));

	// Save to JSON file
	const deploymentsDir = path.join(__dirname, '..', 'deployments');
	if (!fs.existsSync(deploymentsDir)) {
		fs.mkdirSync(deploymentsDir, { recursive: true });
	}

	const deploymentFile = path.join(deploymentsDir, `multisig-${hre.network.name}.json`);
	fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
	console.log(`\n📄 Deployment info saved to: ${deploymentFile}`);

	// Update .env file with MULTISIG_ADDRESS
	const envFile = path.join(__dirname, '..', '.env');
	if (fs.existsSync(envFile)) {
		let envContent = fs.readFileSync(envFile, 'utf8');
		const multisigAddressRegex = /^MULTISIG_ADDRESS=.*$/m;
		const newMultisigLine = `MULTISIG_ADDRESS=${await multisig.getAddress()}`;

		if (multisigAddressRegex.test(envContent)) {
			envContent = envContent.replace(multisigAddressRegex, newMultisigLine);
		} else {
			envContent += `\n${newMultisigLine}\n`;
		}

		fs.writeFileSync(envFile, envContent);
		console.log(`✅ MULTISIG_ADDRESS updated in .env: ${await multisig.getAddress()}`);
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
