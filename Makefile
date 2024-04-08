SHELL = '/bin/bash'
PROJECT_NAME = hmpps-strengths-based-needs-assessments
DEV_COMPOSE_FILES = -f docker-compose.yml -f docker-compose.dev.yml
TEST_COMPOSE_FILES = -f docker-compose.yml -f docker-compose.test.yml
LOCAL_COMPOSE_FILES = -f docker-compose.yml -f docker-compose.local.yml
export COMPOSE_PROJECT_NAME=${PROJECT_NAME}

default: help

help: ## The help text you're reading.
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

up: ## Starts/restarts the UI in a production container.
	docker compose ${LOCAL_COMPOSE_FILES} down ui
	docker compose ${LOCAL_COMPOSE_FILES} up ui --wait --no-recreate

down: ## Stops and removes all containers in the project.
	docker compose down
	make test-down

build-ui: ## Builds a production image of the API.
	docker compose build ui

dev-up: ## Starts/restarts the UI in a development container. A remote debugger can be attached on port 9229.
	docker compose ${DEV_COMPOSE_FILES} down ui
	docker compose ${DEV_COMPOSE_FILES} up ui --wait --no-recreate

dev-build: ## Builds a development image of the UI and installs Node dependencies.
	docker compose ${DEV_COMPOSE_FILES} build ui
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps ui npm install --include=dev

dev-down: ## Stops and removes the UI container.
	docker compose down ui

test: ## Runs the unit test suite.
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps ui npm run test

lint: ## Runs the linter.
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps ui npm run lint

lint-fix: ## Automatically fixes linting issues.
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps ui npm run lint:fix

BASE_URL ?= "http://localhost:3000"
e2e: ## Run the end-to-end tests in the Cypress app. Override the default base URL with BASE_URL=...
	npm i
	npx cypress open -c baseUrl=$(BASE_URL),experimentalInteractiveRunEvents=true

E2E_ACCOMMODATION = "cypress/e2e/**/accommodation/**/*.cy.ts"
E2E_ALCOHOL_USE = "cypress/e2e/**/alcohol-use/**/*.cy.ts"
E2E_DRUG_USE = "cypress/e2e/**/drug-use/**/*.cy.ts"
E2E_EMPLOYMENT_EDUCATION = "cypress/e2e/**/employment-and-education/**/*.cy.ts"
E2E_FINANCE = "cypress/e2e/**/finance/**/*.cy.ts"
E2E_HEALTH_WELLBEING = "cypress/e2e/**/health-and-wellbeing/**/*.cy.ts"
E2E_PERSONAL_RELATIONSHIPS = "cypress/e2e/**/personal-relationships-and-community/**/*.cy.ts"
E2E_THINKING_BEHAVIOURS = "cypress/e2e/**/thinking-behaviours-and-attitudes/**/*.cy.ts"
E2E_JOURNEYS = "cypress/e2e/**/journeys/**/*.cy.ts"
E2E_ALL_NAMED = ${E2E_ACCOMMODATION},${E2E_ALCOHOL_USE},${E2E_DRUG_USE},${E2E_EMPLOYMENT_EDUCATION},${E2E_FINANCE},${E2E_HEALTH_WELLBEING},${E2E_PERSONAL_RELATIONSHIPS},${E2E_THINKING_BEHAVIOURS},${E2E_JOURNEYS}

BASE_URL_CI ?= "http://ui:3000"
e2e-ci: ## Run the end-to-end tests in parallel in a headless browser. Used in CI. Override the default base URL with BASE_URL_CI=...
	make e2e-ci-run CYPRESS_OPTIONS="--group accommodation --spec ${E2E_ACCOMMODATION}"
	make e2e-ci-run CYPRESS_OPTIONS="--group alcohol-use --spec ${E2E_ALCOHOL_USE}"
	make e2e-ci-run CYPRESS_OPTIONS="--group drug-use --spec ${E2E_DRUG_USE}"
	make e2e-ci-run CYPRESS_OPTIONS="--group employment-and-education --spec ${E2E_EMPLOYMENT_EDUCATION}"
	make e2e-ci-run CYPRESS_OPTIONS="--group finance --spec ${E2E_FINANCE}"
	make e2e-ci-run CYPRESS_OPTIONS="--group health-and-wellbeing --spec ${E2E_HEALTH_WELLBEING}"
	make e2e-ci-run CYPRESS_OPTIONS="--group personal-relationships-and-community --spec ${E2E_PERSONAL_RELATIONSHIPS}"
	make e2e-ci-run CYPRESS_OPTIONS="--group thinking-behaviours-and-attitudes --spec ${E2E_THINKING_BEHAVIOURS}"
	make e2e-ci-run CYPRESS_OPTIONS="--group journeys --spec ${E2E_JOURNEYS}"
	make e2e-ci-run CYPRESS_OPTIONS="--group misc --config '{"excludeSpecPattern":[${E2E_ALL_NAMED}]}'"

CYPRESS_OPTIONS ?= ""
e2e-ci-run:
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test run --rm -e CYPRESS_BASE_URL=${BASE_URL_CI} cypress ${CYPRESS_OPTIONS}

test-up: ## Stands up a test environment.
	docker compose --progress plain pull
	docker compose --progress plain ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test up ui --wait --force-recreate

test-down: ## Stops and removes all of the test containers.
	docker compose --progress plain ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test down

clean: ## Stops and removes all project containers. Deletes local build/cache directories.
	docker compose down
	rm -rf dist node_modules test_results

update: ## Downloads the lastest versions of containers.
	docker compose pull
