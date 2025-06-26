const fs = require('fs');
const path = require('path');

function getDeployments(network = 'sepolia') {
	const deploymentsDir = path.join(__dirname, '..', 'deployments');

	const tokenFile = path.join(deploymentsDir, `token-${network}.json`);
	const multisigFile = path.join(deploymentsDir, `multisig-${network}.json`);

	const deployments = {};

	if (fs.existsSync(tokenFile)) {
		deployments.token = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));
	}

	if (fs.existsSync(multisigFile)) {
		deployments.multisig = JSON.parse(fs.readFileSync(multisigFile, 'utf8'));
	}

	return deployments;
}

function printDeployments(network = 'sepolia') {
	console.log(`Deployments on ${network.toUpperCase()}:`);
	console.log('='.repeat(40));

	const deployments = getDeployments(network);

	if (deployments.token) {
		console.log('\nTOKEN:');
		console.log(`   Address: ${deployments.token.tokenAddress}`);
		console.log(`   Name: ${deployments.token.tokenName}`);
		console.log(`   Symbol: ${deployments.token.tokenSymbol}`);
		console.log(`   Supply: ${deployments.token.initialSupply}`);
		console.log(`   Block: ${deployments.token.blockNumber}`);
		console.log(`   Deployed: ${deployments.token.timestamp}`);
	}

	if (deployments.multisig) {
		console.log('\nMULTISIG:');
		console.log(`   Address: ${deployments.multisig.multisigAddress}`);
		console.log(`   Owners: ${deployments.multisig.owners.length}`);
		console.log(`   Required: ${deployments.multisig.requiredConfirmations}`);
		console.log(`   Block: ${deployments.multisig.blockNumber}`);
		console.log(`   Deployed: ${deployments.multisig.timestamp}`);
	}

	if (!deployments.token && !deployments.multisig) {
		console.log('No deployments found');
	}
}

if (require.main === module) {
	const network = process.argv[2] || 'sepolia';
	printDeployments(network);
}

module.exports = { getDeployments, printDeployments };
