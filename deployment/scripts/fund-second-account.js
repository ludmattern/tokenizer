const { ethers } = require('hardhat');

async function main() {
	console.log('Sending ETH to second account for gas fees...\n');

	const [deployer] = await ethers.getSigners();
	const secondAccountAddress = '0x968f28b69101601bB873735a17929Ad4Fa449F24';

	console.log('From:', deployer.address);
	console.log('To:', secondAccountAddress);

	// Check balances before
	const deployerBalance = await ethers.provider.getBalance(deployer.address);
	const secondBalance = await ethers.provider.getBalance(secondAccountAddress);

	console.log('Deployer balance:', ethers.formatEther(deployerBalance), 'ETH');
	console.log('Second account balance:', ethers.formatEther(secondBalance), 'ETH');

	// Send 0.01 ETH for gas fees
	const amount = ethers.parseEther('0.01');
	console.log('\nSending', ethers.formatEther(amount), 'ETH for gas fees...');

	const tx = await deployer.sendTransaction({
		to: secondAccountAddress,
		value: amount,
	});

	await tx.wait();
	console.log('ETH sent successfully!');
	console.log('Transaction hash:', tx.hash);

	// Check balances after
	const newSecondBalance = await ethers.provider.getBalance(secondAccountAddress);
	console.log('Second account new balance:', ethers.formatEther(newSecondBalance), 'ETH');
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
