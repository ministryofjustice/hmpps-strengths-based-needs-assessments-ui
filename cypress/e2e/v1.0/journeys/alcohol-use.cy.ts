import { testPractitionerAnalysis } from './common'

describe('Origin: /alcohol-use', () => {
  const destinations = {
    landingPage: '/alcohol-use',
    alcoholUsageLastThreeMonths: '/alcohol-usage-last-three-months',
    alcoholUsageNotLastThreeMonths: '/alcohol-usage-but-not-last-three-months',
    analysis: '/alcohol-analysis',
    analysisComplete: '/alcohol-analysis-complete',
  }

  const sectionName = 'Alcohol use'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.analysis}`, () => {
    it(`No alcohol use routes to "${destinations.analysis}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('No').clickLabel()
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.analysis)
      cy.assertResumeUrlIs(sectionName, destinations.analysis)
    })

    testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
  })

  describe(`Destination: ${destinations.alcoholUsageLastThreeMonths}`, () => {
    it(`"Drunk alcohol in the last three months routes to "${destinations.alcoholUsageLastThreeMonths}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('Yes, including the last 3 months').clickLabel()
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.alcoholUsageLastThreeMonths)
      cy.assertResumeUrlIs(sectionName, destinations.alcoholUsageLastThreeMonths)
    })
  })

  describe(`Destination: ${destinations.alcoholUsageNotLastThreeMonths}`, () => {
    it(`"not drunk alcohol in the last three months routes to "${destinations.alcoholUsageNotLastThreeMonths}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('Yes, but not in the last 3 months').clickLabel()
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.alcoholUsageNotLastThreeMonths)
      cy.assertResumeUrlIs(sectionName, destinations.alcoholUsageNotLastThreeMonths)
    })
  })
})
