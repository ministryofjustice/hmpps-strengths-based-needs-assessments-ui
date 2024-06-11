import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  env: {
    CLIENT_ID: 'hmpps-strengths-and-needs-ui-client',
    CLIENT_SECRET: 'clientsecret',
    HMPPS_AUTH_URL: 'http://localhost:9091',
    SBNA_API_URL: 'http://localhost:8080',
    ARNS_HANDOVER_URL: 'http://localhost:7070',
    ARNS_HANDOVER_CLIENT_ID: 'strengths-and-needs-assessment',
    OASYS_UI_URL: 'http://localhost:7072',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/index.ts',
    testIsolation: true,
    setupNodeEvents(on, config) {
      on('task', {
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message)
          return null
        },
      })
      return config
    },
  },
})
