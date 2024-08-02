export const env = (key: string) => Cypress.env()[key]

export const uuid = () => Math.random().toString().substring(2, 9)

const oasysUser = {
  id: uuid(),
  name: 'Cypress User',
}

// eslint-disable-next-line no-shadow
export const enum AccessMode {
  READ_WRITE = 'READ_WRITE',
  READ_ONLY = 'READ_ONLY',
}

export interface AssessmentContext {
  assessmentId?: string
  assessmentVersion?: number
  oasysAssessmentPk?: string
}

export const getApiToken = () => {
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

export const enterAssessment = (
  accessMode: AccessMode = AccessMode.READ_WRITE,
  assessmentContextOverride: AssessmentContext = {},
) => {
  const assessment: AssessmentContext = {
    ...env('last_assessment'),
    ...assessmentContextOverride,
  }

  cy.session(
    `${assessment.assessmentId}_${assessment.assessmentVersion}_${accessMode.valueOf()}`,
    () => {
      getApiToken().then(apiToken => {
        cy.request({
          url: `${env('ARNS_HANDOVER_URL')}/handover`,
          method: 'POST',
          auth: { bearer: apiToken },
          body: {
            oasysAssessmentPk: assessment.oasysAssessmentPk,
            assessmentVersion: Number.isInteger(assessment.assessmentVersion) ? assessment.assessmentVersion : null,
            user: {
              identifier: oasysUser.id,
              displayName: oasysUser.name,
              accessMode: accessMode.valueOf(),
            },
            subjectDetails: {
              crn: 'X123456',
              pnc: '01/123456789A',
              givenName: 'Sam',
              familyName: 'Whitfield',
              dateOfBirth: '1970-01-01',
              gender: 0,
              location: 'COMMUNITY',
              sexuallyMotivatedOffenceHistory: 'NO',
            },
          },
          retryOnNetworkFailure: false,
        }).then(otlResponse => {
          cy.visit(`${otlResponse.body.handoverLink}?clientId=${env('ARNS_HANDOVER_CLIENT_ID')}`, {
            retryOnNetworkFailure: false,
          })
        })
      })
    },
    {
      validate: () => {
        cy.request({ url: '/', retryOnNetworkFailure: false }).its('status').should('eq', 200)
      },
    },
  )
  cy.visit('start', { retryOnNetworkFailure: false })
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
        userDetails: oasysUser,
      },
      retryOnNetworkFailure: false,
    }).then(createResponse => {
      Cypress.env('last_assessment', {
        assessmentId: createResponse.body.sanAssessmentId,
        oasysAssessmentPk,
      } as AssessmentContext)
      if (data) {
        cy.request({
          url: `${env('SBNA_API_URL')}/assessment/${createResponse.body.sanAssessmentId}/answers`,
          method: 'POST',
          auth: { bearer: apiToken },
          body: {
            answersToAdd: data.assessment,
          },
          retryOnNetworkFailure: false,
        })
      }
    })
  })
}

export const fetchAssessment = () =>
  getApiToken().then(apiToken => {
    const assessment: AssessmentContext = env('last_assessment')

    return cy.request({
      url: `${env('SBNA_API_URL')}/assessment/${assessment.assessmentId}`,
      qs: Number.isInteger(assessment.assessmentVersion) ? { versionNumber: assessment.assessmentVersion } : null,
      auth: { bearer: apiToken },
      retryOnNetworkFailure: false,
    })
  })

export const captureAssessment = () =>
  fetchAssessment().then(response => Cypress.env('captured_assessment', { data: response.body }))

export const cloneCapturedAssessment = () => {
  const assessment = Cypress.env('captured_assessment')
  createAssessment(assessment.data)
}

export const lockAssessment = () =>
  getApiToken().then(apiToken => {
    const assessment: AssessmentContext = env('last_assessment')

    cy.request({
      url: `${env('SBNA_API_URL')}/oasys/assessment/${assessment.oasysAssessmentPk}/lock`,
      method: 'POST',
      auth: { bearer: apiToken },
      body: {
        userDetails: {
          id: '111111',
          name: 'John Doe',
        },
      },
      retryOnNetworkFailure: false,
    }).then(lockResponse => {
      expect(lockResponse.isOkStatusCode).to.eq(true)
    })
  })
