const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MultiSigWallet', function () {
	let multisig;
	let owners;
	let nonOwner;

	beforeEach(async function () {
		const signers = await ethers.getSigners();
		owners = signers.slice(0, 3);
		nonOwner = signers[3];

		const MultiSigWallet = await ethers.getContractFactory('MultiSigWallet');
		multisig = await MultiSigWallet.deploy(
			owners.map((owner) => owner.address),
			2
		);
	});

	describe('Deployment', function () {
		it('Should set the right owners', async function () {
			const contractOwners = await multisig.getOwners();
			expect(contractOwners).to.deep.equal(owners.map((owner) => owner.address));
		});

		it('Should set the right number of required confirmations', async function () {
			expect(await multisig.numConfirmationsRequired()).to.equal(2);
		});
	});

	describe('Transaction submission', function () {
		it('Should allow owners to submit transactions', async function () {
			await multisig.connect(owners[0]).submitTransaction(nonOwner.address, ethers.parseEther('1'), '0x');

			const txCount = await multisig.getTransactionCount();
			expect(txCount).to.equal(1);
		});

		it('Should not allow non-owners to submit transactions', async function () {
			await expect(multisig.connect(nonOwner).submitTransaction(nonOwner.address, ethers.parseEther('1'), '0x')).to.be.revertedWith('Not owner');
		});
	});

	describe('Transaction confirmation', function () {
		beforeEach(async function () {
			// Submit a transaction first
			await multisig.connect(owners[0]).submitTransaction(nonOwner.address, ethers.parseEther('1'), '0x');
		});

		it('Should allow owners to confirm transactions', async function () {
			await multisig.connect(owners[0]).confirmTransaction(0);

			const tx = await multisig.getTransaction(0);
			expect(tx.numConfirmations).to.equal(1);
		});

		it('Should not allow double confirmation', async function () {
			await multisig.connect(owners[0]).confirmTransaction(0);

			await expect(multisig.connect(owners[0]).confirmTransaction(0)).to.be.revertedWith('Transaction already confirmed');
		});
	});

	describe('Transaction execution', function () {
		beforeEach(async function () {
			// Add some ETH to the contract
			await owners[0].sendTransaction({
				to: await multisig.getAddress(),
				value: ethers.parseEther('2'),
			});

			// Submit a transaction
			await multisig.connect(owners[0]).submitTransaction(nonOwner.address, ethers.parseEther('1'), '0x');
		});

		it('Should execute transaction with enough confirmations', async function () {
			// Confirm with first two owners
			await multisig.connect(owners[0]).confirmTransaction(0);
			await multisig.connect(owners[1]).confirmTransaction(0);

			const balanceBefore = await ethers.provider.getBalance(nonOwner.address);

			await multisig.connect(owners[0]).executeTransaction(0);

			const balanceAfter = await ethers.provider.getBalance(nonOwner.address);
			expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther('1'));
		});

		it('Should not execute without enough confirmations', async function () {
			await multisig.connect(owners[0]).confirmTransaction(0);

			await expect(multisig.connect(owners[0]).executeTransaction(0)).to.be.revertedWith('Cannot execute transaction');
		});
	});
});
