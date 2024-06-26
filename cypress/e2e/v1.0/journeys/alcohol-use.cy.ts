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

  describe(`Destination: ${destinations.analysis}`, () => {
    it(`"Drunk alcohol in the last three months routes to "${destinations.analysis}"`, () => {
      cy.visitStep(destinations.alcoholUsageLastThreeMonths)
      cy.getQuestion('How often has Sam drunk alcohol in the last 3 months?').getRadio('Once a month or less').clickLabel()
      cy.getQuestion('How many units of alcohol does Sam have on a typical day of drinking?').getRadio('1 to 2 units').clickLabel()
      cy.getQuestion('Has Sam had 6 or more units within a single day of drinking in the last 3 months?').getRadio('No').clickLabel()
      cy.getQuestion('Has Sam shown evidence of binge drinking or excessive alcohol use in the last 6 months?').getRadio('No evidence of binge drinking or excessive alcohol use').clickLabel()
      cy.getQuestion('Does Sam have any past issues with alcohol?').getRadio('No').clickLabel()
      cy.getQuestion('Why does Sam drink alcohol?').getCheckbox('Cultural or religious practice').clickLabel()
      cy.getQuestion("What's the impact of Sam drinking alcohol?").getCheckbox('Behavioural').clickLabel()
      cy.getQuestion('Has anything helped Sam to stop or reduce drinking alcohol in the past?').getRadio('No').clickLabel()
      cy.getQuestion('Does Sam want to make changes to their alcohol use?').getRadio('I do not want to answer').clickLabel()
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.analysis)
      cy.assertResumeUrlIs(sectionName, destinations.analysis)
    })

    testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
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

  describe(`Destination: ${destinations.analysis}`, () => {
    it(`"Drunk alcohol in the last three months routes to "${destinations.analysis}"`, () => {
      cy.visitStep(destinations.alcoholUsageNotLastThreeMonths)
      cy.getQuestion('Has Sam shown evidence of binge drinking or excessive alcohol use in the last 6 months?').getRadio('No evidence of binge drinking or excessive alcohol use').clickLabel()
      cy.getQuestion('Does Sam have any past issues with alcohol?').getRadio('No').clickLabel()
      cy.getQuestion('Why does Sam drink alcohol?').getCheckbox('Cultural or religious practice').clickLabel()
      cy.getQuestion("What's the impact of Sam drinking alcohol?").getCheckbox('Behavioural').clickLabel()
      cy.getQuestion('Has anything helped Sam to stop or reduce drinking alcohol in the past?').getRadio('No').clickLabel()
      cy.getQuestion('Does Sam want to make changes to their alcohol use?').getRadio('I do not want to answer').clickLabel()
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.analysis)
      cy.assertResumeUrlIs(sectionName, destinations.analysis)
    })

    testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
  })

})
