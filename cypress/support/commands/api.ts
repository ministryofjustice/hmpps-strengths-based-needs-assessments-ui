const env = (key: string) => Cypress.env()[key]

export const uuid = () => `${Date.now().toString()}-${Cypress._.random(0, 1e6)}-${Cypress._.uniqueId()}`

const getApiToken = () => {
  const apiToken = Cypress.env('API_TOKEN')

  if (apiToken && apiToken.expiresAt > Date.now() + 2000) {
    return cy.wrap(apiToken.accessToken).then(token => token)
  }

  return cy
    .request({
      url: `${env('HMPPS_AUTH_URL')}/auth/oauth/token?grant_type=client_credentials`,
      method: 'POST',
      form: true,
      auth: {
        user: env('CLIENT_ID'),
        pass: env('CLIENT_SECRET'),
      },
    })
    .then(response => {
      Cypress.env('API_TOKEN', {
        accessToken: response.body.access_token,
        expiresAt: Date.now() + response.body.expires_in * 1000,
      })
      return response.body.access_token
    })
}

export const enterAssessment = () => {
  cy.session(
    env('last_assessment').assessmentId,
    () => {
      getApiToken().then(apiToken => {
        cy.request({
          url: `${env('ARNS_HANDOVER_URL')}/handover`,
          method: 'POST',
          auth: { bearer: apiToken },
          body: {
            assessmentContext: {
              oasysAssessmentPk: env('last_assessment').oasysAssessmentPk,
              assessmentUUID: env('last_assessment').assessmentId,
            },
            principal: {
              identifier: uuid(),
              displayName: 'Cypress User',
              accessMode: 'READ_WRITE',
            },
            subject: {
              crn: 'X123456',
              pnc: '01/123456789A',
              givenName: 'Sam',
              familyName: 'Whitfield',
              dateOfBirth: '1970-01-01',
              gender: 0,
              location: 'COMMUNITY',
              sexuallyMotivatedOffenceHistory: 'No',
            },
          },
        }).then(otlResponse => {
          cy.visit(`${otlResponse.body.handoverLink}?clientId=${env('ARNS_HANDOVER_CLIENT_ID')}`)
          cy.url().then(url => {
            cy.wrap(url).as('landingUrl')
          })
        })
      })
    },
    {
      validate: () => {
        cy.request('/').its('status').should('eq', 200)
      },
    },
  )
  cy.get('@landingUrl').then(url => cy.visit(url.toString()))
}

export const createAssessment = (data = null) => {
  const oasysAssessmentPk = uuid()
  getApiToken().then(apiToken => {
    cy.request({
      url: `${env('SBNA_API_URL')}/oasys/assessment/create`,
      method: 'POST',
      auth: { bearer: apiToken },
      body: {
        oasysAssessmentPk,
      },
    }).then(createResponse => {
      Cypress.env('last_assessment', {
        assessmentId: createResponse.body.sanAssessmentId,
        oasysAssessmentPk,
      })
      if (data) {
        cy.request({
          url: `${env('SBNA_API_URL')}/assessment/${createResponse.body.sanAssessmentId}/answers`,
          method: 'POST',
          auth: { bearer: apiToken },
          body: {
            tags: ['UNSIGNED', 'UNVALIDATED'],
            answersToAdd: data.assessment,
          },
        })
      }
    })
  })
}

export const captureAssessment = () =>
  getApiToken().then(apiToken =>
    cy
      .request({
        url: `${env('SBNA_API_URL')}/assessment/${env('last_assessment_id')}`,
        auth: { bearer: apiToken },
      })
      .then(response => Cypress.env('captured_assessment', { data: response.body })),
  )

export const cloneCapturedAssessment = () => {
  const assessment = Cypress.env('captured_assessment')
  createAssessment(assessment.data)
}
