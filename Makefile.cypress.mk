build-cypress: ## Builds an image of Cypress/Chrome for testing in CI
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test build cypress

e2e: ## Run the end-to-end tests in the Cypress app. Override the default base URL with BASE_URL=...
	npm i
	npx cypress open -c baseUrl=$(BASE_URL),experimentalInteractiveRunEvents=true

e2e-ci: e2e-accommodation e2e-alcohol-use e2e-drug-use e2e-employment-education e2e-finance e2e-health-wellbeing e2e-personal-relationships e2e-thinking-behaviours e2e-journeys e2e-misc

e2e-accommodation e2e-alcohol-use e2e-drug-use e2e-employment-education e2e-finance e2e-health-wellbeing e2e-personal-relationships e2e-thinking-behaviours e2e-journeys e2e-misc:
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test run --rm -e CYPRESS_BASE_URL=${BASE_URL_CI} cypress ${CYPRESS_OPTIONS}

BASE_URL ?= "http://localhost:3000"
BASE_URL_CI ?= "http://ui:3000"

# Spec patterns for parallel test execution
E2E_ACCOMMODATION = "cypress/e2e/**/accommodation/**/*.cy.ts"
E2E_ALCOHOL_USE = "cypress/e2e/**/alcohol-use/**/*.cy.ts"
E2E_DRUG_USE = "cypress/e2e/**/drug-use/**/*.cy.ts"
E2E_EMPLOYMENT_EDUCATION = "cypress/e2e/**/employment-and-education/**/*.cy.ts"
E2E_FINANCE = "cypress/e2e/**/finance/**/*.cy.ts"
E2E_HEALTH_WELLBEING = "cypress/e2e/**/health-and-wellbeing/**/*.cy.ts"
E2E_PERSONAL_RELATIONSHIPS = "cypress/e2e/**/personal-relationships-and-community/**/*.cy.ts"
E2E_THINKING_BEHAVIOURS = "cypress/e2e/**/thinking-behaviours-and-attitudes/**/*.cy.ts"
E2E_JOURNEYS = "cypress/e2e/**/journeys/**/*.cy.ts"

# List of all named spec patterns, so that a "catch-all" pattern can be created by excluding these patterns
E2E_ALL_NAMED = ${E2E_ACCOMMODATION},${E2E_ALCOHOL_USE},${E2E_DRUG_USE},${E2E_EMPLOYMENT_EDUCATION},${E2E_FINANCE},${E2E_HEALTH_WELLBEING},${E2E_PERSONAL_RELATIONSHIPS},${E2E_THINKING_BEHAVIOURS},${E2E_JOURNEYS}

e2e-accommodation: CYPRESS_OPTIONS = --spec ${E2E_ACCOMMODATION}
e2e-alcohol-use: CYPRESS_OPTIONS = --spec ${E2E_ALCOHOL_USE}
e2e-drug-use: CYPRESS_OPTIONS = --spec ${E2E_DRUG_USE}
e2e-employment-education: CYPRESS_OPTIONS = --spec ${E2E_EMPLOYMENT_EDUCATION}
e2e-finance: CYPRESS_OPTIONS = --spec ${E2E_FINANCE}
e2e-health-wellbeing: CYPRESS_OPTIONS = --spec ${E2E_HEALTH_WELLBEING}
e2e-personal-relationships: CYPRESS_OPTIONS = --spec ${E2E_PERSONAL_RELATIONSHIPS}
e2e-thinking-behaviours: CYPRESS_OPTIONS = --spec ${E2E_THINKING_BEHAVIOURS}
e2e-journeys: CYPRESS_OPTIONS = --spec ${E2E_JOURNEYS}
e2e-misc: CYPRESS_OPTIONS = --config '{"excludeSpecPattern":[${E2E_ALL_NAMED}]}'
