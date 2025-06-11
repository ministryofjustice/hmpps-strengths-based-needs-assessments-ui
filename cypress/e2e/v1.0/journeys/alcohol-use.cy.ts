import { testPractitionerAnalysis } from './common'

describe('Origin: /alcohol', () => {
  const destinations = {
    landingPage: '/alcohol',
    alcoholUseLastThreeMonths: '/alcohol-use-last-three-months',
    alcoholUseLessThreeMonths: '/alcohol-use-less-three-months',
    summary: '/alcohol-use-summary',
    analysis: '/alcohol-use-analysis',
  }

  const sectionName = 'Alcohol use'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment().completePrivacyDeclaration()
  })

  describe(`Destination: ${destinations.summary}`, () => {
    it(`No alcohol use routes to "${destinations.summary}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('No').clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.summary)
      cy.assertResumeUrlIs(sectionName, destinations.summary)
    })

    testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
  })

  describe(`Destination: ${destinations.alcoholUseLastThreeMonths}`, () => {
    it(`"Drunk alcohol in the last three months routes to "${destinations.alcoholUseLastThreeMonths}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('Yes, including the last 3 months').clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.alcoholUseLastThreeMonths)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, destinations.alcoholUseLastThreeMonths)
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`"Drunk alcohol in the last three months routes to "${destinations.summary}"`, () => {
        cy.visitStep(destinations.alcoholUseLastThreeMonths)
        cy.getQuestion('How often has Sam drunk alcohol in the last 3 months?')
          .getRadio('Once a month or less')
          .clickLabel()
        cy.getQuestion('How many units of alcohol does Sam have on a typical day of drinking?')
          .getRadio('1 to 2 units')
          .clickLabel()
        cy.getQuestion('Has Sam had 6 or more units within a single day of drinking in the last 3 months?')
          .getRadio('No')
          .clickLabel()
        cy.getQuestion('Has Sam shown evidence of binge drinking or excessive alcohol use in the last 6 months?')
          .getRadio('No evidence of binge drinking or excessive alcohol use')
          .clickLabel()
        cy.getQuestion('Does Sam have any past issues with alcohol?').getRadio('No').clickLabel()
        cy.getQuestion('Why does Sam drink alcohol?').getCheckbox('Cultural or religious practice').clickLabel()
        cy.getQuestion("What's the impact of Sam drinking alcohol?").getCheckbox('Behavioural').clickLabel()
        cy.getQuestion('Has anything helped Sam to stop or reduce drinking alcohol in the past?')
          .getRadio('No')
          .clickLabel()
        cy.getQuestion('Does Sam want to make changes to their alcohol use?')
          .getRadio('I do not want to answer')
          .clickLabel()
        cy.assertResumeUrlIs(sectionName, destinations.alcoholUseLastThreeMonths)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })
      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })

  describe(`Destination: ${destinations.alcoholUseLessThreeMonths}`, () => {
    it(`"Not drunk alcohol in the last three months routes to "${destinations.alcoholUseLessThreeMonths}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('Yes, but not in the last 3 months').clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.alcoholUseLessThreeMonths)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, destinations.alcoholUseLessThreeMonths)
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`"Not drunk alcohol in the last three months routes to "${destinations.summary}"`, () => {
        cy.visitStep(destinations.alcoholUseLessThreeMonths)
        cy.getQuestion('Has Sam shown evidence of binge drinking or excessive alcohol use in the last 6 months?')
          .getRadio('No evidence of binge drinking or excessive alcohol use')
          .clickLabel()
        cy.getQuestion('Does Sam have any past issues with alcohol?').getRadio('No').clickLabel()
        cy.getQuestion('Why does Sam drink alcohol?').getCheckbox('Curiosity or experimentation').clickLabel()
        cy.getQuestion("What's the impact of Sam drinking alcohol?").getCheckbox('Community').clickLabel()
        cy.getQuestion('Has anything helped Sam to stop or reduce drinking alcohol in the past?')
          .getRadio('No')
          .clickLabel()
        cy.getQuestion('Does Sam want to make changes to their alcohol use?')
          .getRadio('I do not want to answer')
          .clickLabel()
        cy.assertResumeUrlIs(sectionName, destinations.alcoholUseLessThreeMonths)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })
})
