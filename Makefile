# MATTERN42 Token Project Makefile
.PHONY: help setup deploy status mint confirm test clean

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
	@cd deployment && rm -rf cache artifacts

# Deployment & Management
deploy: ## Deploy everything (token + multisig)
	@cd deployment && node manage.js deploy

status: ## Show deployment status
	@cd deployment && node manage.js status

mint: ## Create mint transaction (use: make mint RECIPIENT=0x... AMOUNT=1000)
	@cd deployment && node manage.js mint $(RECIPIENT) $(AMOUNT)

confirm: ## Confirm transaction (use: make confirm TX=0)
	@cd deployment && node manage.js confirm $(TX)

confirm-second: ## Confirm with second account (use: make confirm-second TX=0)  
	@cd deployment && node manage.js confirm $(TX) --second
