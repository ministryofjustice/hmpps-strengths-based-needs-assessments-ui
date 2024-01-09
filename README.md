# hmpps-strengths-based-needs-assessments-ui
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-strengths-based-needs-assessments-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-strengths-based-needs-assessments-ui "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-strengths-based-needs-assessments-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-strengths-based-needs-assessments-ui)

UI for the Strengths and Needs assessment service

Libraries this service uses include:
- [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) for general UI elements and styling
- [MOJ Frontend](https://github.com/ministryofjustice/moj-frontend) for domain specific UI elements and styling
- [HMPO Form Wizard](https://github.com/HMPO/hmpo-form-wizard) for forms based on JSON configuration
- [Jest](https://github.com/jestjs/jest) for testing

## Running the service
The easiest way to run the service is to use docker compose to create the service and all dependencies. 

`docker-compose pull`

`docker-compose up`

### Backend services
The service requires: 
* [hmpps-strengths-based-needs-assessments-api](https://github.com/ministryofjustice/hmpps-strengths-based-needs-assessments-api) - backend API
* hmpps-auth - for authentication using OAuth/JWT
* redis - session store and token caching

### Running the service for development

To start the backend services: 

`docker-compose up --scale=app=0`

Install dependencies using `npm install`, ensuring you are using `node v20.x` and `npm v10.x`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

The `env` can be configured to

```
PORT=3000
HMPPS_AUTH_URL=http://localhost:9090/auth
TOKEN_VERIFICATION_API_URL=http://localhost:9090/verification
TOKEN_VERIFICATION_ENABLED=false
NODE_ENV=development
API_CLIENT_SECRET=clientsecret
SYSTEM_CLIENT_SECRET=clientsecret
API_CLIENT_ID=hmpps-strengths-and-needs-ui
SYSTEM_CLIENT_ID=hmpps-strengths-and-needs-ui-client
SBNA_API_URL=http://localhost:8080
```

To build the assets and start the service with nodemon:

`npm run start:dev`

The entry point for the service is [http://localhost:3000/form/oastub/start](http://localhost:3000/form/oastub/start)

### Run linter

`npm run lint` or `npm run lint:fix` to automatically fix linting issues

### Run tests

`npm run test`

### Run against HMPPS Auth with backend services running in Docker

To run with HMPPS Auth with backend services running on `localhost` you will need

To avoid issues around the signing server (ISS) on the JWT you will need to configure your `/etc/hosts`

```
127.0.0.1   localhost hmpps-auth
```

The `env` can be configured to point the local Auth, for example

```
PORT=3000
HMPPS_AUTH_URL=http://hmpps-auth:9090/auth
TOKEN_VERIFICATION_API_URL=http://hmpps-auth:9090/verification
TOKEN_VERIFICATION_ENABLED=false
NODE_ENV=development
API_CLIENT_SECRET=clientsecret
SYSTEM_CLIENT_SECRET=clientsecret
API_CLIENT_ID=hmpps-strengths-and-needs-ui
SYSTEM_CLIENT_ID=hmpps-strengths-and-needs-ui-client
SBNA_API_URL=http://localhost:8081
```

And start the backend services with

```
docker-compose up
```

To build the assets and start the service with nodemon:

`npm run start:dev`

### Running integration tests

For local running, start a test db, redis, and wiremock instance by:

`docker-compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`


### Dependency Checks

The project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`
