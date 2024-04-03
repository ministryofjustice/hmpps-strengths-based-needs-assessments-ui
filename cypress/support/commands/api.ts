const env = (key: string) => Cypress.env()[key]

const uuid = () => Date.now().toString() + '-' + Cypress._.random(0, 1e6) + '-' + Cypress._.uniqueId()

export const createAssessment = (data: {} = null) => {
  const oasysAssessmentPk = uuid()

  cy.request({
    url: `${env('SBNA_API_URL')}/oasys/session/create`,
    method: 'POST',
    auth: { bearer: env('API_TOKEN') },
    body: {
      userSessionId: uuid(),
      userAccess: 'READ_WRITE',
      oasysAssessmentPk: oasysAssessmentPk,
      userDisplayName: 'Cypress User',
    }
  }).then(otlResponse => {
    cy.visit(otlResponse.body.link)
    return cy.request({
      url: `${env('SBNA_API_URL')}/oasys/assessment/${oasysAssessmentPk}`,
      auth: { bearer: env('API_TOKEN') },
    }).then(assessment => {
      cy.wrap(assessment.body.metaData.uuid).as('assessmentId')
      if (data) {
        cy.assertSectionIs('Accommodation')
        return cy.request({
          url: `${env('SBNA_API_URL')}/assessment/${assessment.body.metaData.uuid}/answers`,
          method: 'POST',
          auth: { bearer: env('API_TOKEN') },
          body: {
            tags: ['VALIDATED','UNVALIDATED'],
            answersToAdd: data['assessment']
          }
        })
      }
    })
  })
}

export const captureAssessment = () =>
  cy.get('@assessmentId')
    .then(id =>
      cy.request({
        url: `${env('SBNA_API_URL')}/assessment/${id}`,
        auth: { bearer: env('API_TOKEN') },
      }).then(response => Cypress.env('captured_assessment', response.body))
    )

export const cloneCapturedAssessment = () => createAssessment(Cypress.env('captured_assessment'))
