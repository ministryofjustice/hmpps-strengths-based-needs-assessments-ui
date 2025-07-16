import { defineConfig } from 'cypress'
import cypressSplit from 'cypress-split'
import { Client } from 'pg'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  taskTimeout: 60000,
  env: {
    CLIENT_ID: 'hmpps-assess-risks-and-needs-oastub-ui',
    CLIENT_SECRET: 'clientsecret',
    HMPPS_AUTH_URL: 'http://localhost:9091',
    SBNA_API_URL: 'http://localhost:8080',
    COORDINATOR_API_URL: 'http://localhost:8070',
    ARNS_HANDOVER_URL: 'http://localhost:7070',
    ARNS_HANDOVER_CLIENT_ID: 'strengths-and-needs-assessment',
    OASYS_UI_URL: 'http://localhost:7072',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    baseUrl: 'http://localhost:3000',
    specPattern: ['cypress/e2e/**/*.cy.ts', 'cypress/e2e/**/*.fixture.ts'],
    supportFile: 'cypress/support/index.ts',
    testIsolation: true,
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      cypressSplit(on, config)

      on('task', {
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message)
          return null
        },

        async runDBQuery(sql: string) {
          const client = new Client({ connectionString: 'postgres://root:dev@localhost:5432/postgres' })
          await client.connect()
          const res = await client.query(sql)
          await client.end()
          return res.rows
        },
      })

      return config
    },
  },
})
