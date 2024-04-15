const env = (key: string) => Cypress.env()[key]

const uuid = () => `${Date.now().toString()}-${Cypress._.random(0, 1e6)}-${Cypress._.uniqueId()}`

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

export const createAssessment = (data = null) => {
  const oasysAssessmentPk = uuid()

  getApiToken().then(apiToken => {
    cy.request({
      url: `${env('SBNA_API_URL')}/oasys/session/create`,
      method: 'POST',
      auth: { bearer: apiToken },
      body: {
        userSessionId: uuid(),
        userAccess: 'READ_WRITE',
        oasysAssessmentPk,
        userDisplayName: 'Cypress User',
      },
    }).then(otlResponse => {
      cy.visit(otlResponse.body.link)
      return cy
        .request({
          url: `${env('SBNA_API_URL')}/oasys/assessment/${oasysAssessmentPk}`,
          auth: { bearer: apiToken },
        })
        .then(assessment => {
          cy.wrap(assessment.body.metaData.uuid).as('assessmentId')
          if (data) {
            cy.assertSectionIs('Accommodation')
            return cy.request({
              url: `${env('SBNA_API_URL')}/assessment/${assessment.body.metaData.uuid}/answers`,
              method: 'POST',
              auth: { bearer: apiToken },
              body: {
                tags: ['VALIDATED', 'UNVALIDATED'],
                answersToAdd: data.assessment,
              },
            })
          }
          return cy.get('@assessmentId')
        })
    })
  })
}

export const captureAssessment = () =>
  cy.get('@assessmentId').then(id =>
    getApiToken().then(apiToken =>
      cy
        .request({
          url: `${env('SBNA_API_URL')}/assessment/${id}`,
          auth: { bearer: apiToken },
        })
        .then(response => Cypress.env('captured_assessment', response.body)),
    ),
  )

export const cloneCapturedAssessment = () => createAssessment(Cypress.env('captured_assessment'))
