PYTHON = .venv/bin/python3

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'

init: ## Initialize all applications
	make -C api init

check: ## Run code checks for all applications
	make -C api check

clean: ## Remove cache
	make -C api clean

fix:
	make -C api fix

run: ## Run dev mode
	docker-compose --env-file .env -f docker-compose.yml -f docker-compose.dev.yml up --build

prod: ## Run prod mode
	docker-compose up --build