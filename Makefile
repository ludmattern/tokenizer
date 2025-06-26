# MATTERN42 Token Project Makefile
# Variables
.PHONY: help install compile test deploy-token deploy-multisig deploy-all verify clean setup

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
help: ## Show this help message
	@echo "$(GREEN)MATTERN42 Token Project$(NC)"
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# Development setup
setup: ## Initialize project (install deps, compile, test)
	@echo "$(GREEN)Setting up MATTERN42 Token project...$(NC)"
	@./deployment/scripts/init.sh

install: ## Install dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@cd deployment && npm install

compile: ## Compile smart contracts
	@echo "$(GREEN)Compiling contracts...$(NC)"
	@cd deployment && npx hardhat compile

clean: ## Clean build artifacts
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	@cd deployment && rm -rf cache artifacts
	@echo "$(GREEN)Cleanup complete$(NC)"

# Testing
test: ## Run all tests
	@echo "$(GREEN)Running all tests...$(NC)"
	@cd deployment && npx hardhat test

test-token: ## Run token tests only
	@echo "$(GREEN)Testing MATTERN42Token...$(NC)"
	@cd deployment && npx hardhat test test/MATTERN42.test.js

test-multisig: ## Run multisig tests only
	@echo "$(GREEN)Testing MultiSigWallet...$(NC)"
	@cd deployment && npx hardhat test test/Multisig.test.js

# Local development
local-node: ## Start local Hardhat node
	@echo "$(GREEN)Starting local Hardhat node...$(NC)"
	@cd deployment && npx hardhat node

# Deployment (Sepolia)
deploy-token: ## Deploy MATTERN42Token to Sepolia
	@echo "$(GREEN)Deploying MATTERN42Token to Sepolia...$(NC)"
	@cd deployment && npx hardhat run scripts/deploy-token.js --network sepolia

deploy-multisig: ## Deploy MultiSigWallet to Sepolia
	@echo "$(GREEN)Deploying MultiSigWallet to Sepolia...$(NC)"
	@cd deployment && npx hardhat run scripts/deploy-multisig.js --network sepolia

deploy-all: deploy-token deploy-multisig ## Deploy both contracts to Sepolia
	@echo "$(GREEN)All contracts deployed to Sepolia$(NC)"

# Verification
verify-token: ## Verify MATTERN42Token on Etherscan (requires TOKEN_ADDRESS)
ifndef TOKEN_ADDRESS
	@echo "$(RED)ERROR: TOKEN_ADDRESS not set$(NC)"
	@echo "$(YELLOW)Usage: make verify-token TOKEN_ADDRESS=0x...$(NC)"
	@exit 1
endif
	@echo "$(GREEN)Verifying MATTERN42Token...$(NC)"
	@cd deployment && npx hardhat verify --network sepolia $(TOKEN_ADDRESS) "MATTERN42Token" "M42T" "100000000000000000000000"

verify-multisig: ## Verify MultiSigWallet on Etherscan (requires MULTISIG_ADDRESS and OWNERS)
ifndef MULTISIG_ADDRESS
	@echo "$(RED)ERROR: MULTISIG_ADDRESS not set$(NC)"
	@echo "$(YELLOW)Usage: make verify-multisig MULTISIG_ADDRESS=0x... OWNERS='[\"0x...\",\"0x...\"]'$(NC)"
	@exit 1
endif
ifndef OWNERS
	@echo "$(RED)ERROR: OWNERS not set$(NC)"
	@echo "$(YELLOW)Usage: make verify-multisig MULTISIG_ADDRESS=0x... OWNERS='[\"0x...\",\"0x...\"]'$(NC)"
	@exit 1
endif
	@echo "$(GREEN)Verifying MultiSigWallet...$(NC)"
	@cd deployment && npx hardhat verify --network sepolia $(MULTISIG_ADDRESS) '$(OWNERS)' 2

# Security operations
transfer-ownership: ## Transfer token ownership to MultiSig (requires TOKEN_ADDRESS and MULTISIG_ADDRESS)
ifndef TOKEN_ADDRESS
	@echo "$(RED)ERROR: TOKEN_ADDRESS not set$(NC)"
	@exit 1
endif
ifndef MULTISIG_ADDRESS
	@echo "$(RED)ERROR: MULTISIG_ADDRESS not set$(NC)"
	@exit 1
endif
	@echo "$(YELLOW)CRITICAL: Transferring ownership to MultiSig$(NC)"
	@echo "$(YELLOW)Token: $(TOKEN_ADDRESS)$(NC)"
	@echo "$(YELLOW)MultiSig: $(MULTISIG_ADDRESS)$(NC)"
	@cd deployment && node scripts/transfer-ownership.js

# View deployments
deployments: ## Show all deployed contracts
	@echo "$(GREEN)Getting deployment information...$(NC)"
	@cd deployment && node scripts/get-deployments.js

# Utilities
check-balance: ## Check account balance on Sepolia
	@echo "$(GREEN)Checking balance on Sepolia...$(NC)"
	@cd deployment && npx hardhat run scripts/check-balance.js --network sepolia

check-gas: ## Check current gas prices on Sepolia
	@echo "$(GREEN)Checking current gas prices...$(NC)"
	@curl -s "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}" | jq '.'
	@echo "$(YELLOW)Your configured gas price: ${GAS_PRICE} gwei$(NC)"

faucet: ## Show faucet information for Sepolia
	@echo "$(GREEN)Sepolia Testnet Faucets:$(NC)"
	@echo "  • https://sepoliafaucet.com/"
	@echo "  • https://faucets.chain.link/sepolia"
	@echo "  • https://www.alchemy.com/faucets/ethereum-sepolia"

network-info: ## Show network information
	@echo "$(GREEN)Network Information:$(NC)"
	@echo "$(YELLOW)Sepolia Testnet:$(NC)"
	@echo "  • Chain ID: 11155111"
	@echo "  • RPC: https://sepolia.infura.io/v3/YOUR_PROJECT_ID"
	@echo "  • Explorer: https://sepolia.etherscan.io/"
	@echo "  • Faucet: https://sepoliafaucet.com/"

# Documentation
docs: ## Open documentation
	@echo "$(GREEN)Opening documentation...$(NC)"
	@echo "Available documentation:"
	@echo "  • README.md - Project overview"
	@echo "  • documentation/TECHNICAL_OVERVIEW.md"
	@echo "  • documentation/DEPLOYMENT.md"
	@echo "  • documentation/USER_GUIDE.md"

# Environment check
check-env: ## Check environment configuration
	@echo "$(GREEN)Checking environment...$(NC)"
	@cd deployment && node -e "require('dotenv').config(); console.log('PRIVATE_KEY:', process.env.PRIVATE_KEY ? 'Set' : 'Missing'); console.log('INFURA_API_KEY:', process.env.INFURA_API_KEY ? 'Set' : 'Missing'); console.log('ETHERSCAN_API_KEY:', process.env.ETHERSCAN_API_KEY ? 'Set' : 'Missing');"

# Full workflow examples
dev-setup: install compile test ## Complete development setup
	@echo "$(GREEN)Development environment ready!$(NC)"

testnet-deploy: check-env compile test deploy-all ## Full testnet deployment workflow
	@echo "$(GREEN)Testnet deployment complete!$(NC)"
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  1. Verify contracts with: make verify-token TOKEN_ADDRESS=0x..."
	@echo "  2. Transfer ownership with: make transfer-ownership TOKEN_ADDRESS=0x... MULTISIG_ADDRESS=0x..."

# Status check
status: ## Show project status
	@echo "$(GREEN)MATTERN42 Project Status:$(NC)"
	@echo "$(YELLOW)Dependencies:$(NC)"
	@cd deployment && npm list --depth=0 2>/dev/null | grep -E "(hardhat|ethers|openzeppelin)" || echo "  Dependencies not installed"
	@echo "$(YELLOW)Contracts:$(NC)"
	@test -f deployment/contracts/MATTERN42.sol && echo "  MATTERN42.sol" || echo "  MATTERN42.sol missing"
	@test -f deployment/contracts/MultiSigWallet.sol && echo "  MultiSigWallet.sol" || echo "  MultiSigWallet.sol missing"
	@echo "$(YELLOW)Configuration:$(NC)"
	@test -f deployment/.env && echo "  .env configured" || echo "  .env missing"
	@echo "$(YELLOW)Build artifacts:$(NC)"
	@test -d deployment/artifacts && echo "  Contracts compiled" || echo "  Contracts not compiled"
