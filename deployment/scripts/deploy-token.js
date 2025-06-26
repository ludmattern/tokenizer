const { ethers, network } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
	console.log('Deploying MATTERN42Token...');

	const [deployer] = await ethers.getSigners();
	console.log('Deploying contracts with account:', deployer.address);

	const balance = await ethers.provider.getBalance(deployer.address);
	console.log('Account balance:', ethers.formatEther(balance), 'ETH');

	// Configuration gas économique
	const gasPrice = process.env.GAS_PRICE ? ethers.parseUnits(process.env.GAS_PRICE, 'gwei') : ethers.parseUnits('2', 'gwei');
	console.log('Using gas price:', ethers.formatUnits(gasPrice, 'gwei'), 'gwei');

	// Token parameters
	const tokenName = process.env.TOKEN_NAME || 'MATTERN42Token';
	const tokenSymbol = process.env.TOKEN_SYMBOL || 'M42T';
	const initialSupply = ethers.parseEther(process.env.INITIAL_SUPPLY || '100000');

	// Deploy token avec frais réduits
	const MATTERN42Token = await ethers.getContractFactory('MATTERN42Token');
	const token = await MATTERN42Token.deploy(tokenName, tokenSymbol, initialSupply, {
		gasPrice: gasPrice,
		gasLimit: process.env.GAS_LIMIT || 6000000,
	});

	console.log('⏳ Waiting for deployment (may take longer with low gas price)...');
	await token.waitForDeployment();

	console.log('MATTERN42Token deployed to:', await token.getAddress());
	console.log('Token details:');
	console.log('   Name:', await token.name());
	console.log('   Symbol:', await token.symbol());
	console.log('   Total Supply:', ethers.formatEther(await token.totalSupply()));
	console.log('   Owner:', await token.owner());

	// Save deployment info
	const deploymentInfo = {
		network: network.name,
		tokenAddress: await token.getAddress(),
		tokenName: tokenName,
		tokenSymbol: tokenSymbol,
		initialSupply: ethers.formatEther(initialSupply),
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

	const deploymentFile = path.join(deploymentsDir, `token-${network.name}.json`);
	fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
	console.log(`\n📄 Deployment info saved to: ${deploymentFile}`);

	// Update .env file with TOKEN_ADDRESS
	const envFile = path.join(__dirname, '..', '.env');
	if (fs.existsSync(envFile)) {
		let envContent = fs.readFileSync(envFile, 'utf8');
		const tokenAddressRegex = /^TOKEN_ADDRESS=.*$/m;
		const newTokenLine = `TOKEN_ADDRESS=${await token.getAddress()}`;

		if (tokenAddressRegex.test(envContent)) {
			envContent = envContent.replace(tokenAddressRegex, newTokenLine);
		} else {
			envContent += `\n${newTokenLine}\n`;
		}

		fs.writeFileSync(envFile, envContent);
		console.log(`✅ TOKEN_ADDRESS updated in .env: ${await token.getAddress()}`);
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
