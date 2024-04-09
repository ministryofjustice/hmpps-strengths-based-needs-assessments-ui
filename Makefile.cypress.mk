BASE_URL ?= "http://localhost:3000"
BASE_URL_CI ?= "http://ui:3000"

build-cypress: ## Builds an image of Cypress/Chrome for testing in CI
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test build cypress

e2e: ## Run the end-to-end tests in the Cypress app. Override the default base URL with BASE_URL=...
	npm i
	npx cypress open -c baseUrl=$(BASE_URL),experimentalInteractiveRunEvents=true

e2e-ci:
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test run --rm -e CYPRESS_BASE_URL=${BASE_URL_CI} cypress --env split=true
