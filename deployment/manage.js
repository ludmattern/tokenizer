#!/usr/bin/env node
require('dotenv').config();

// Force network from command line arguments
const networkArg = process.argv.find((arg) => arg === '--network');
if (networkArg) {
	const networkIndex = process.argv.indexOf(networkArg);
	const network = process.argv[networkIndex + 1];
	if (network) {
		process.env.HARDHAT_NETWORK = network;
		console.log(`Using network: ${network}`);
	}
}

const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

const COMMANDS = {
	deploy: deployAll,
	status: showStatus,
	mint: mintTokens,
	transfer: transferTokens,
	confirm: confirmTransaction,
	verify: verifyContracts,
	help: showHelp,
};

async function main() {
	const command = process.argv[2] || 'help';
	const handler = COMMANDS[command];

	if (!handler) {
		console.log('Unknown command:', command);
		showHelp();
		process.exit(1);
	}

	await handler();
}

async function deployAll() {
	console.log('MATTERN42 Complete Deployment\n');

	// Verify network
	const network = await ethers.provider.getNetwork();
	console.log('Network:', network.name, 'ChainID:', network.chainId.toString());

	if (network.chainId === 31337n) {
		console.log('WARNING: Deploying on local Hardhat network');
	} else if (network.chainId === 11155111n) {
		console.log('Deploying on Sepolia testnet');
	}

	const [deployer] = await ethers.getSigners();
	console.log('Deployer:', deployer.address);
	console.log('Balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH\n');

	console.log('Deploying Token...');
	const Token = await ethers.getContractFactory('MATTERN42Token');
	const token = await Token.deploy('MATTERN42Token', 'M42T', ethers.parseEther('100000'));
	await token.waitForDeployment();
	const tokenAddress = await token.getAddress();
	console.log('Token deployed:', tokenAddress);

	console.log('Deploying MultiSig...');
	const owners = process.env.MULTISIG_OWNERS.split(',').map((addr) => addr.trim());
	const required = parseInt(process.env.REQUIRED_CONFIRMATIONS || '2');

	const MultiSig = await ethers.getContractFactory('MultiSigWallet');
	const multisig = await MultiSig.deploy(owners, required);
	await multisig.waitForDeployment();
	const multisigAddress = await multisig.getAddress();
	console.log('MultiSig deployed:', multisigAddress);

	console.log('Transferring ownership...');
	await token.transferOwnership(multisigAddress);
	console.log('Ownership transferred to MultiSig');

	updateEnvFile('TOKEN_ADDRESS', tokenAddress);
	updateEnvFile('MULTISIG_ADDRESS', multisigAddress);

	console.log('\nDEPLOYMENT COMPLETE!');
	console.log('Token:', tokenAddress);
	console.log('MultiSig:', multisigAddress);
	console.log('\nNext: node manage.js status');
}

async function showStatus() {
	console.log('MATTERN42 Status\n');

	const tokenAddress = process.env.TOKEN_ADDRESS;
	const multisigAddress = process.env.MULTISIG_ADDRESS;

	if (!tokenAddress || !multisigAddress) {
		console.log('No deployment found. Run: node manage.js deploy');
		return;
	}

	const [deployer] = await ethers.getSigners();
	const token = await ethers.getContractAt('MATTERN42Token', tokenAddress);
	const multisig = await ethers.getContractAt('MultiSigWallet', multisigAddress);

	console.log('TOKEN INFO:');
	console.log('  Address:', tokenAddress);
	console.log('  Name:', await token.name());
	console.log('  Symbol:', await token.symbol());
	console.log('  Supply:', ethers.formatEther(await token.totalSupply()));
	console.log('  Owner:', await token.owner());
	console.log('  Paused:', await token.paused());

	console.log('\nMULTISIG INFO:');
	console.log('  Address:', multisigAddress);
	console.log('  Owners:', await multisig.getOwners());
	console.log('  Required:', (await multisig.numConfirmationsRequired()).toString());
	console.log('  Transactions:', (await multisig.getTransactionCount()).toString());

	console.log('\nYOUR ACCOUNT:');
	console.log('  Address:', deployer.address);
	console.log('  ETH Balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)));
	console.log('  Token Balance:', ethers.formatEther(await token.balanceOf(deployer.address)));

	console.log('\nETHERSCAN LINKS:');
	console.log('  Token: https://sepolia.etherscan.io/address/' + tokenAddress);
	console.log('  MultiSig: https://sepolia.etherscan.io/address/' + multisigAddress);
}

async function verifyContracts() {
	console.log('Verifying Contracts on Etherscan\n');

	const tokenAddress = process.env.TOKEN_ADDRESS;
	const multisigAddress = process.env.MULTISIG_ADDRESS;

	if (!tokenAddress || !multisigAddress) {
		console.log('No deployment found. Run: node manage.js deploy first');
		return;
	}

	try {
		// Verify Token
		console.log('Verifying Token Contract...');
		console.log('Address:', tokenAddress);

		const { execSync } = require('child_process');

		try {
			const tokenResult = execSync(`npx hardhat verify --network sepolia ${tokenAddress} "MATTERN42Token" "M42T" "${ethers.parseEther('100000').toString()}"`, {
				encoding: 'utf8',
				cwd: __dirname,
			});
			console.log('Token verification:', tokenResult);
		} catch (error) {
			if (error.message.includes('already been verified')) {
				console.log('Token contract already verified');
			} else {
				console.log('Token verification error:', error.message);
			}
		}

		// Verify MultiSig
		console.log('\nVerifying MultiSig Contract...');
		console.log('Address:', multisigAddress);

		const owners = process.env.MULTISIG_OWNERS.split(',').map((addr) => addr.trim());
		const required = process.env.REQUIRED_CONFIRMATIONS || '2';

		try {
			const multisigResult = execSync(`npx hardhat verify --network sepolia ${multisigAddress} '${JSON.stringify(owners)}' ${required}`, { encoding: 'utf8', cwd: __dirname });
			console.log('MultiSig verification:', multisigResult);
		} catch (error) {
			if (error.message.includes('already been verified')) {
				console.log('MultiSig contract already verified');
			} else {
				console.log('MultiSig verification error:', error.message);
			}
		}

		console.log('\nVerification process completed!');
		console.log('Check contracts on Etherscan:');
		console.log('Token:', `https://sepolia.etherscan.io/address/${tokenAddress}#code`);
		console.log('MultiSig:', `https://sepolia.etherscan.io/address/${multisigAddress}#code`);
	} catch (error) {
		console.error('Verification failed:', error.message);
	}
}

async function mintTokens() {
	const recipient = process.argv[3] || process.env.PUBLIC_KEY;
	const amount = process.argv[4] || '1000';

	if (!recipient) {
		console.log('Usage: node manage.js mint <recipient> <amount>');
		return;
	}

	console.log('Creating Mint Transaction\n');
	console.log('Recipient:', recipient);
	console.log('Amount:', amount, 'tokens\n');

	const tokenAddress = process.env.TOKEN_ADDRESS;
	const multisigAddress = process.env.MULTISIG_ADDRESS;

	const token = await ethers.getContractAt('MATTERN42Token', tokenAddress);
	const multisig = await ethers.getContractAt('MultiSigWallet', multisigAddress);

	const mintData = token.interface.encodeFunctionData('mint', [recipient, ethers.parseEther(amount)]);

	const tx = await multisig.submitTransaction(tokenAddress, 0, mintData);
	await tx.wait();

	const txCount = await multisig.getTransactionCount();
	const txIndex = txCount - 1n;

	console.log('Transaction submitted!');
	console.log('Index:', txIndex.toString());
	console.log('\nNext: node manage.js confirm', txIndex.toString());
}

async function transferTokens() {
	const recipient = process.argv[3];
	const amount = process.argv[4] || '1000';

	if (!recipient) {
		console.log('Usage: node manage.js transfer <recipient> <amount>');
		return;
	}

	console.log('Transferring Tokens\n');
	console.log('Recipient:', recipient);
	console.log('Amount:', amount, 'tokens\n');

	const tokenAddress = process.env.TOKEN_ADDRESS;
	const [sender] = await ethers.getSigners();
	const token = await ethers.getContractAt('MATTERN42Token', tokenAddress);

	console.log('Sender:', sender.address);
	console.log('Sender balance before:', ethers.formatEther(await token.balanceOf(sender.address)), 'M42T');
	console.log('Recipient balance before:', ethers.formatEther(await token.balanceOf(recipient)), 'M42T');

	const tx = await token.transfer(recipient, ethers.parseEther(amount));
	await tx.wait();

	console.log('Transfer completed!');
	console.log('Sender balance after:', ethers.formatEther(await token.balanceOf(sender.address)), 'M42T');
	console.log('Recipient balance after:', ethers.formatEther(await token.balanceOf(recipient)), 'M42T');
	console.log('Transaction hash:', tx.hash);
}

async function confirmTransaction() {
	const txIndex = process.argv[3];
	const useSecondAccount = process.argv.includes('--second');

	if (txIndex === undefined) {
		console.log('Usage: node manage.js confirm <index> [--second]');
		return;
	}

	console.log('Confirming Transaction', txIndex, '\n');

	let signer;
	if (useSecondAccount) {
		const privateKey2 = process.env.PRIVATE_KEY_2;
		if (!privateKey2) {
			console.log('PRIVATE_KEY_2 not found in .env');
			return;
		}
		signer = new ethers.Wallet(privateKey2, ethers.provider);
		console.log('Using second account:', signer.address);
	} else {
		[signer] = await ethers.getSigners();
		console.log('Using primary account:', signer.address);
	}

	const multisigAddress = process.env.MULTISIG_ADDRESS;
	const multisig = await ethers.getContractAt('MultiSigWallet', multisigAddress, signer);

	const transaction = await multisig.getTransaction(txIndex);
	const required = await multisig.numConfirmationsRequired();

	console.log('Current confirmations:', transaction.numConfirmations.toString(), '/', required.toString());

	if (transaction.executed) {
		console.log('Already executed!');
		return;
	}

	const isConfirmed = await multisig.isConfirmed(txIndex, signer.address);
	if (!isConfirmed) {
		console.log('Confirming...');
		const confirmTx = await multisig.confirmTransaction(txIndex);
		await confirmTx.wait();
		console.log('Confirmed!');
	} else {
		console.log('Already confirmed by this account');
	}

	const updatedTransaction = await multisig.getTransaction(txIndex);
	if (updatedTransaction.numConfirmations >= required) {
		console.log('Executing transaction...');
		const executeTx = await multisig.executeTransaction(txIndex);
		await executeTx.wait();
		console.log('Transaction executed!');
	} else {
		const missing = required - updatedTransaction.numConfirmations;
		console.log('Need', missing.toString(), 'more confirmation(s)');
		if (useSecondAccount) {
			console.log('Next: node manage.js confirm', txIndex);
		} else {
			console.log('Next: node manage.js confirm', txIndex, '--second');
		}
	}
}

function showHelp() {
	console.log('MATTERN42 Management Tool\n');
	console.log('COMMANDS:');
	console.log('  deploy                   Deploy token + multisig + transfer ownership');
	console.log('  status                   Show current status and balances');
	console.log('  verify                   Verify contracts on Etherscan');
	console.log('  mint <recipient> <amount> Create mint transaction');
	console.log('  transfer <recipient> <amount> Transfer tokens directly');
	console.log('  confirm <index> [--second] Confirm multisig transaction');
	console.log('  help                     Show this help\n');
	console.log('EXAMPLES:');
	console.log('  node manage.js deploy');
	console.log('  node manage.js status');
	console.log('  node manage.js verify');
	console.log('  node manage.js mint 0x123... 1000');
	console.log('  node manage.js transfer 0x123... 500');
	console.log('  node manage.js confirm 0');
	console.log('  node manage.js confirm 0 --second');
}

function updateEnvFile(key, value) {
	const envPath = path.join(__dirname, '.env');
	let content = fs.readFileSync(envPath, 'utf8');

	const regex = new RegExp(`^${key}=.*$`, 'm');
	if (regex.test(content)) {
		content = content.replace(regex, `${key}=${value}`);
	} else {
		content += `\n${key}=${value}\n`;
	}

	fs.writeFileSync(envPath, content);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('Error:', error.message);
		process.exit(1);
	});
