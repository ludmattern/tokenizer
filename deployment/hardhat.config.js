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
		sepolia: {
			url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: [process.env.PRIVATE_KEY],
		},
		bscTestnet: {
			url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
			accounts: [process.env.PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY,
	},
	paths: {
		sources: '../code',
		tests: './test',
		cache: './cache',
		artifacts: './artifacts',
	},
};
			sepolia: process.env.ETHERSCAN_API_KEY || '',
		},
	},
	gasReporter: {
		enabled: process.env.REPORT_GAS !== undefined,
		currency: 'USD',
	},
};
