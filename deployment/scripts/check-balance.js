const { ethers } = require('hardhat');

async function main() {
	console.log('Checking account balance...');

	const [deployer] = await ethers.getSigners();
	console.log('Account:', deployer.address);

	const balance = await ethers.provider.getBalance(deployer.address);
	console.log('Balance:', ethers.formatEther(balance), 'ETH');

	const network = await ethers.provider.getNetwork();
	console.log('Network:', network.name, '(Chain ID:', network.chainId + ')');

	// Check if balance is sufficient for deployment
	const minBalance = ethers.parseEther('0.01'); // 0.01 ETH minimum
	if (balance < minBalance) {
		console.log('Warning: Low balance! You may need more ETH for deployment.');
		console.log('Visit a faucet: https://sepoliafaucet.com/');
	} else {
		console.log('Balance sufficient for deployment');
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
