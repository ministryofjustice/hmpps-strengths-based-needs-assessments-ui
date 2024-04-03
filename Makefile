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

SYSTEM_CLIENT_ID ?= hmpps-strengths-and-needs-ui-client
SYSTEM_CLIENT_SECRET ?= clientsecret
API_TOKEN = $(shell \
	COMPOSE_PROJECT_NAME=${PROJECT_NAME} \
	docker compose exec api curl \
	   --location 'http://hmpps-auth:9090/auth/oauth/token' \
	   --user $(SYSTEM_CLIENT_ID):$(SYSTEM_CLIENT_SECRET) \
	   --header 'Content-Type: application/x-www-form-urlencoded' \
	   --data-urlencode 'grant_type=client_credentials' \
	   | jq -r '.access_token' \
)

BASE_URL ?= "http://localhost:3000"
e2e: ## Run the end-to-end tests in the Cypress app. Override the default base URL with BASE_URL=...
	npm i
	CYPRESS_API_TOKEN=$(API_TOKEN) \
	npx cypress open -c baseUrl=$(BASE_URL),experimentalInteractiveRunEvents=true

BASE_URL_CI ?= "http://ui:3000"
e2e-ci: ## Run the end-to-end tests in a headless browser. Used in CI. Override the default base URL with BASE_URL_CI=...
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test run --rm -e CYPRESS_BASE_URL=${BASE_URL_CI} -e CYPRESS_API_TOKEN=${API_TOKEN} cypress

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
