const { ethers } = require('hardhat');

async function main() {
	console.log('Transferring token ownership to MultiSig...');

	// Get addresses from environment variables
	const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
	const MULTISIG_ADDRESS = process.env.MULTISIG_ADDRESS;

	if (!TOKEN_ADDRESS) {
		throw new Error('TOKEN_ADDRESS environment variable not set');
	}

	if (!MULTISIG_ADDRESS) {
		throw new Error('MULTISIG_ADDRESS environment variable not set');
	}

	const [deployer] = await ethers.getSigners();
	console.log('Deployer:', deployer.address);
	console.log('Token:', TOKEN_ADDRESS);
	console.log('MultiSig:', MULTISIG_ADDRESS);

	// Get contract instances
	const token = await ethers.getContractAt('MATTERN42Token', TOKEN_ADDRESS);
	const multiSig = await ethers.getContractAt('MultiSigWallet', MULTISIG_ADDRESS);

	// Verify current owner
	const currentOwner = await token.owner();
	console.log('Current token owner:', currentOwner);

	if (currentOwner !== deployer.address) {
		throw new Error('Deployer is not the current owner of the token');
	}

	// Verify MultiSig configuration
	const owners = await multiSig.getOwners();
	const requiredConfirmations = await multiSig.numConfirmationsRequired();
	console.log('MultiSig owners:', owners);
	console.log('Required confirmations:', requiredConfirmations.toString());

	// Security checks
	if (owners.length < 2) {
		throw new Error('MultiSig needs at least 2 owners');
	}

	if (requiredConfirmations.lt(2)) {
		throw new Error('MultiSig needs at least 2 required confirmations');
	}

	console.log('\nCRITICAL OPERATION: This action is irreversible!');
	console.log('Waiting 5 seconds for confirmation...');
	await new Promise((resolve) => setTimeout(resolve, 5000));

	// Transfer ownership
	console.log('Executing transfer...');
	const tx = await token.transferOwnership(MULTISIG_ADDRESS);
	console.log('Transaction hash:', tx.hash);

	// Wait for confirmation
	await tx.wait();

	// Verify transfer
	const newOwner = await token.owner();
	console.log('New token owner:', newOwner);

	if (newOwner === MULTISIG_ADDRESS) {
		console.log('Ownership successfully transferred to MultiSig');
		console.log('Token is now controlled by MultiSig wallet');
		console.log('All future operations require MultiSig approval');
	} else {
		throw new Error('Transfer failed - ownership not changed');
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('Error:', error.message);
		process.exit(1);
	});
