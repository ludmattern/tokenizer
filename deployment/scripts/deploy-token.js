const { ethers } = require('hardhat');

async function main() {
	console.log('🚀 Deploying MATTERN42Token...');

	const [deployer] = await ethers.getSigners();
	console.log('Deploying contracts with account:', deployer.address);

	const balance = await deployer.getBalance();
	console.log('Account balance:', ethers.utils.formatEther(balance), 'ETH');

	// Token parameters
	const tokenName = process.env.TOKEN_NAME || 'MATTERN42Token';
	const tokenSymbol = process.env.TOKEN_SYMBOL || 'M42T';
	const initialSupply = ethers.utils.parseEther(process.env.INITIAL_SUPPLY || '100000');

	// Deploy token
	const MATTERN42Token = await ethers.getContractFactory('MATTERN42Token');
	const token = await MATTERN42Token.deploy(tokenName, tokenSymbol, initialSupply);

	await token.deployed();

	console.log('✅ MATTERN42Token deployed to:', token.address);
	console.log('📊 Token details:');
	console.log('   Name:', await token.name());
	console.log('   Symbol:', await token.symbol());
	console.log('   Total Supply:', ethers.utils.formatEther(await token.totalSupply()));
	console.log('   Owner:', await token.owner());

	// Save deployment info
	const deploymentInfo = {
		network: hardhat.network.name,
		tokenAddress: token.address,
		tokenName: tokenName,
		tokenSymbol: tokenSymbol,
		initialSupply: ethers.utils.formatEther(initialSupply),
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
