# MATTERN42 Token Project Makefile
.PHONY: help setup deploy status verify mint transfer confirm test clean local-node

# Colors
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

help: ## Show help
	@echo "$(GREEN)MATTERN42 Token Project$(NC)"
	@echo "$(YELLOW)Commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# Development
setup: ## Install dependencies and compile
	@echo "$(GREEN)Setting up project...$(NC)"
	@cd deployment && npm install && npx hardhat compile

test: ## Run tests
	@cd deployment && npx hardhat test

clean: ## Clean artifacts
	@cd deployment && rm -rf cache artifacts node_modules

# Deployment & Management (Sepolia)
deploy: ## Deploy everything (token + multisig) on Sepolia
	@cd deployment && node manage.js deploy --network sepolia

status: ## Show deployment status on Sepolia
	@cd deployment && node manage.js status --network sepolia

verify: ## Verify contracts on Etherscan
	@cd deployment && node manage.js verify --network sepolia

mint: ## Create mint transaction on Sepolia (use: make mint RECIPIENT=0x... AMOUNT=1000)
	@cd deployment && node manage.js mint $(RECIPIENT) $(AMOUNT) --network sepolia

transfer: ## Transfer tokens on Sepolia (use: make transfer RECIPIENT=0x... AMOUNT=500)
	@cd deployment && node manage.js transfer $(RECIPIENT) $(AMOUNT) --network sepolia

confirm: ## Confirm transaction on Sepolia (use: make confirm TX=0)
	@cd deployment && node manage.js confirm $(TX) --network sepolia

confirm-second: ## Confirm with second account on Sepolia (use: make confirm-second TX=0)  
	@cd deployment && node manage.js confirm $(TX) --second --network sepolia