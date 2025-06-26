const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MATTERN42Token', function () {
	let token;
	let owner;
	let addr1;
	let addr2;

	beforeEach(async function () {
		[owner, addr1, addr2] = await ethers.getSigners();

		const MATTERN42Token = await ethers.getContractFactory('MATTERN42Token');
		token = await MATTERN42Token.deploy('MATTERN42Token', 'M42T', ethers.utils.parseEther('100000'));
	});

	describe('Deployment', function () {
		it('Should set the right owner', async function () {
			expect(await token.owner()).to.equal(owner.address);
		});

		it('Should assign the total supply to the owner', async function () {
			const ownerBalance = await token.balanceOf(owner.address);
			expect(await token.totalSupply()).to.equal(ownerBalance);
		});

		it('Should have correct name and symbol', async function () {
			expect(await token.name()).to.equal('MATTERN42Token');
			expect(await token.symbol()).to.equal('M42T');
		});
	});

	describe('Minting', function () {
		it('Should allow owner to mint tokens', async function () {
			const mintAmount = ethers.utils.parseEther('1000');
			await token.mint(addr1.address, mintAmount);

			expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);
		});

		it('Should not allow non-owner to mint', async function () {
			const mintAmount = ethers.utils.parseEther('1000');

			await expect(token.connect(addr1).mint(addr1.address, mintAmount)).to.be.revertedWith('Ownable: caller is not the owner');
		});
	});

	describe('Burning', function () {
		it('Should allow token holders to burn their tokens', async function () {
			const burnAmount = ethers.utils.parseEther('1000');

			await token.burn(burnAmount);

			expect(await token.totalSupply()).to.equal(ethers.utils.parseEther('99000'));
		});
	});

	describe('Pausing', function () {
		it('Should allow owner to pause and unpause', async function () {
			await token.pause();
			expect(await token.paused()).to.be.true;

			await token.unpause();
			expect(await token.paused()).to.be.false;
		});

		it('Should prevent transfers when paused', async function () {
			await token.pause();

			await expect(token.transfer(addr1.address, ethers.utils.parseEther('100'))).to.be.revertedWith('Pausable: paused');
		});
	});
});
