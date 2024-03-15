import { defineConfig } from 'cypress'
import fs from 'fs'

const accessibilityReportPath = 'test_results/cypress/accessibilityReport.txt'

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
    accessibilityReportPath,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/index.ts',
    testIsolation: false,
    setupNodeEvents(on) {
      on('before:run', () => {
        fs.rmSync(accessibilityReportPath, { force: true })
      })
      on('task', {
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message)
          return null
        },
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message)
          return null
        },
      })
    },
  },
})
