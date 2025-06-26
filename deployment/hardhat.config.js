require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		version: '0.8.19',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		hardhat: {
			chainId: 31337,
		},
		sepolia: {
			url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
			chainId: 11155111,
			// Configuration pour frais minimum
			gasPrice: 2000000000, // 2 gwei (très bas)
			gas: 6000000, // Limite de gas raisonnable
			// Timeout plus long pour transactions lentes
			timeout: 120000,
		},
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY,
	},
	paths: {
		sources: './contracts',
		tests: './test',
		cache: './cache',
		artifacts: './artifacts',
	},
};
