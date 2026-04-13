SHELL = '/bin/bash'

## Useful to keep this the same for backend/frontend
PROJECT_NAME = hmpps-assess-risks-and-needs

## Must match name of container in Docker
SERVICE_NAME = san-ui

## Compose files to stack on each other
PROD_COMPOSE_FILES = -f docker/docker-compose.base.yml
DEV_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.local.yml

export COMPOSE_PROJECT_NAME=${PROJECT_NAME}

default: help

help: ## The help text you're reading.
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

prod-build: ## Builds a production image of the UI.
	docker compose ${PROD_COMPOSE_FILES} build ${SERVICE_NAME}

prod-up: ## Starts/restarts the UI in a production container.
	docker compose ${PROD_COMPOSE_FILES} down ${SERVICE_NAME}
	docker compose ${PROD_COMPOSE_FILES} up ${SERVICE_NAME} --wait --no-recreate

dev-build: ## Builds a development image of the UI and installs Node dependencies.
	docker compose ${DEV_COMPOSE_FILES} build ${SERVICE_NAME}

dev-up: ## Starts/restarts the UI in a development container. A remote debugger can be attached on port 9229.
	docker compose down ${SERVICE_NAME}
	docker compose ${DEV_COMPOSE_FILES} up ${SERVICE_NAME} --wait --no-recreate

down: ## Stops and removes all containers in the project.
	docker compose down

dev-update: update dev-build ## Pulls latest docker images, re-builds the Dev UI and copies node_modules to local filesystem.
	rm -rf node_modules
	docker compose ${DEV_COMPOSE_FILES} run --no-deps --name ui-node-modules ${SERVICE_NAME} node -v
	docker container cp ui-node-modules:/app/node_modules .
	docker container rm -f ui-node-modules

test: ## Runs the unit test suite.
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps ${SERVICE_NAME} npm run test

lint: ## Runs the linter.
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps ${SERVICE_NAME} npm run lint

lint-fix: ## Automatically fixes linting issues.
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps ${SERVICE_NAME} npm run lint:fix

get-cypress:
	npm i
	npx cypress install

BASE_URL ?= "http://localhost:3000"
e2e: get-cypress ## Run the end-to-end tests locally in the Cypress app. Override the default base URL with BASE_URL=...
	npx cypress open -c baseUrl=$(BASE_URL),experimentalInteractiveRunEvents=true

e2e-fixtures: get-cypress ## Runs all *.fixture.ts test files to generate JSON fixtures
	npx cypress run --headless -b chrome -c baseUrl=$(BASE_URL) -s "cypress/e2e/**/*.fixture.ts"

clean: ## Stops and removes all project containers. Deletes local build/cache directories.
	docker compose down
	docker images -q --filter=reference="ghcr.io/ministryofjustice/*:local" | xargs -r docker rmi
	docker volume ls -qf "dangling=true" | xargs -r docker volume rm
	rm -rf dist node_modules test_results

update: ## Downloads the latest versions of container images.
	docker compose ${DEV_COMPOSE_FILES} pull --ignore-buildable

save-logs: ## Saves docker container logs in a directory defined by OUTPUT_LOGS_DIR=
	docker system info
	mkdir -p ${OUTPUT_LOGS_DIR}
	docker logs ${PROJECT_NAME}-san-api-1 > ${OUTPUT_LOGS_DIR}/san-api.log
	docker logs ${PROJECT_NAME}-san-ui-1 > ${OUTPUT_LOGS_DIR}/san-ui.log
	docker logs ${PROJECT_NAME}-arns-handover-1 > ${OUTPUT_LOGS_DIR}/arns-handover.log
	docker logs ${PROJECT_NAME}-coordinator-api-1 > ${OUTPUT_LOGS_DIR}/coordinator-api.log
	docker logs ${PROJECT_NAME}-hmpps-auth-1 > ${OUTPUT_LOGS_DIR}/hmpps-auth.log
