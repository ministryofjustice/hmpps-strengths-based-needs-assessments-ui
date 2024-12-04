export const env = (key: string) => Cypress.env()[key]

const previous = []
export const uuid = () => {
  let v: string
  do {
    v = Math.random().toString().substring(2, 9)
  } while (previous.includes(v))

  previous.push(v)
  return v
}

const oasysUser = {
  id: uuid().substring(0, 30),
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
  sexuallyMotivatedOffenceHistory?: string
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

  cy.log(`Entering assessment with OASys PK: ${assessment.oasysAssessmentPk}`)

  cy.session(
    `${accessMode.valueOf()}:${JSON.stringify(assessment)}`,
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
              returnUrl: Cypress.env('OASYS_UI_URL'),
            },
            subjectDetails: {
              crn: 'X123456',
              pnc: '01/123456789A',
              givenName: 'Sam',
              familyName: 'Whitfield',
              dateOfBirth: '1970-01-01',
              gender: 0,
              location: 'COMMUNITY',
              ...(assessment.sexuallyMotivatedOffenceHistory && {
                sexuallyMotivatedOffenceHistory: assessment.sexuallyMotivatedOffenceHistory,
              }),
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
  cy.log(`Creating assessment with OASys PK: ${oasysAssessmentPk}`)
  getApiToken().then(apiToken => {
    cy.request({
      url: `${env('COORDINATOR_API_URL')}/oasys/create`,
      method: 'POST',
      auth: { bearer: apiToken },
      body: {
        oasysAssessmentPk,
        planType: 'INITIAL',
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
      url: `${env('SBNA_API_URL')}/assessment/${assessment.assessmentId}/lock`,
      method: 'POST',
      auth: { bearer: apiToken },
      body: {
        userDetails: {
          id: '111111',
          name: 'John Doe',
          type: 'SAN',
        },
      },
      retryOnNetworkFailure: false,
    }).then(lockResponse => {
      expect(lockResponse.isOkStatusCode).to.eq(true)
    })
  })

export const softDeleteAssessment = (versionFrom: number) =>
  getApiToken().then(apiToken => {
    const assessment: AssessmentContext = env('last_assessment')

    cy.request({
      url: `${env('SBNA_API_URL')}/assessment/${assessment.assessmentId}/soft-delete`,
      method: 'POST',
      auth: { bearer: apiToken },
      body: {
        versionFrom,
        userDetails: {
          id: '111111',
          name: 'John Doe',
          type: 'SAN',
        },
      },
      retryOnNetworkFailure: false,
    }).then(lockResponse => {
      expect(lockResponse.isOkStatusCode).to.eq(true)
    })
  })
