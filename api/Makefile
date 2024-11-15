PYTHON = .venv/bin/python3

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'

init: .venv requirements ## Initialize virtualenv & install requirements

.venv:
	python3 -m venv .venv && \
	source .venv/bin/activate

requirements:
	$(PYTHON) -m pip install -r requirements.txt

check: lint test ## Run code checks

lint:
	$(PYTHON) -m isort .
	$(PYTHON) -m black .
	$(PYTHON) -m pylint	.

test:
	$(PYTHON) -m coverage run manage.py test
	$(PYTHON) -m coverage report
	$(PYTHON) -m coverage html
	$(PYTHON) -m coverage lcov

clean: ## Remove cache
	find . -name '*.py[co]' -exec rm -f {} \;

install-package:
	@if [ -z "$(pkg)" ]; then echo "Please provide a package name, e.g., make install-package pkg=<package_name>"; exit 1; fi
	.venv/bin/pip install $(pkg)
	@echo "$$(.venv/bin/pip show $(pkg) | grep Version | awk '{print "$(pkg)== "$$2}')" >> requirements.txt

