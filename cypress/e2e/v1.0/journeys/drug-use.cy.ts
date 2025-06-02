// TODO remove temp
describe('Origin: /drug-use', () => {
  const destinations = {
    landingPage: '/drug-use',
    addDrugs: '/add-drugs',
    drugDetails: '/drug-details',
    drugDetailsMoreThanSix: '/drug-detail-more-than-six-months',
    drugUseHistory: '/drug-use-history',
    summary: '/drug-use-summary',
    analysis: '/drug-use-analysis',
    practitionerAnalysisSummary: '/drug-use-summary#practitioner-analysis',
  }

  const sectionName = 'Drug use'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.summary}`, () => {
    it(`No drug use routes to "${destinations.summary}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever misused drugs?').getRadio('No').clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.summary)
      cy.assertResumeUrlIs(sectionName, destinations.summary)
    })

    // TODO when this part is done
    // testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)

    it(`No drug use routes to "${destinations.practitionerAnalysisSummary}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever misused drugs?').getRadio('No').clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.summary)
      cy.assertResumeUrlIs(sectionName, destinations.summary)
      cy.visitStep(destinations.practitionerAnalysisSummary)
      cy.get('.govuk-fieldset').should('not.contain', 'Does Sam seem motivated to stop or reduce their drug use?')
      cy.getQuestion("Are there any strengths or protective factors related to Sam's drug use?")
        .getRadio('No')
        .clickLabel()
      cy.getQuestion("Is Sam's drug use linked to risk of serious harm?").getRadio('No').clickLabel()
      cy.getQuestion("Is Sam's drug use linked to risk of reoffending?").getRadio('No').clickLabel()

      cy.markAsComplete()

      cy.get('.analysis-summary__heading').should(
        'not.contain',
        'Does Sam seem motivated to stop or reduce their drug use?',
      )
    })
  })

  describe(`Destination: ${destinations.landingPage}`, () => {
    it(`"Drug use no routes to "${destinations.summary}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever misused drugs?').getRadio('No').clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.summary)
      cy.get('.govuk-back-link').should('not.exist')
      cy.assertResumeUrlIs(sectionName, destinations.summary)
    })

    it(`"Drug use yes routes to "${destinations.addDrugs}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.addDrugs)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, destinations.addDrugs)
    })
  })

  describe(`Destination: ${destinations.addDrugs}`, () => {
    it(`routes to ${destinations.drugDetails}`, () => {
      cy.visitStep(destinations.addDrugs)

      cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cannabis').clickLabel()

      cy.getQuestion('Which drugs has Sam misused?')
        .getCheckbox('Cannabis')
        .getConditionalQuestion()
        .getRadio('Used in the last 6 months')
        .clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.addDrugs)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.drugDetails)
      cy.assertBackLinkIs(destinations.addDrugs)
      cy.assertResumeUrlIs(sectionName, destinations.drugDetails)
    })
  })

  // TODO needs another case to deal with more than 6 months

  describe(`Destination: ${destinations.drugDetails}`, () => {
    it(`routes to ${destinations.drugUseHistory}`, () => {
      cy.visitStep(destinations.drugDetails)

      cy.getQuestion('How often is Sam using this drug?').getRadio('Daily').clickLabel()

      cy.getQuestion('Is Sam receiving treatment for their drug use?').getRadio('Yes').clickLabel()
      cy.getQuestion('Is Sam receiving treatment for their drug use?')
        .getRadio('Yes')
        .getConditionalQuestion()
        .enterText('Treatment details')

      cy.assertResumeUrlIs(sectionName, destinations.drugDetails)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.drugUseHistory)
      cy.assertBackLinkIs(destinations.drugDetails)
      cy.assertResumeUrlIs(sectionName, destinations.drugUseHistory)
    })
  })

  describe(`Destination: ${destinations.drugUseHistory}`, () => {
    it(`routes to ${destinations.summary}`, () => {
      cy.visitStep(destinations.drugUseHistory)

      cy.getQuestion('Why does Sam use drugs?').getCheckbox('Cultural or religious practice').clickLabel()

      cy.getQuestion('Why does Sam use drugs?').getCheckbox('Peer pressure or social influence').clickLabel()

      cy.getQuestion('Why does Sam use drugs?').getFollowingDetails().enterText('why sam uses drugs')

      cy.getQuestion("How has Sam's drug use affected their life?").getCheckbox('Behaviour').clickLabel()

      cy.getQuestion("How has Sam's drug use affected their life?")
        .getFollowingDetails()
        .enterText('how life has been affected')

      cy.getQuestion('Has anything helped Sam stop or reduce their drug use?').enterText('stop or reduce drug use')

      cy.getQuestion('What could help Sam not use drugs in the future?').enterText('not use in the future')

      cy.getQuestion('Does Sam want to make changes to their drug use?')
        .getRadio('I want to make changes but need help')
        .clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.drugUseHistory)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.summary)
      cy.get('.govuk-back-link').should('not.exist')
      cy.assertResumeUrlIs(sectionName, destinations.summary)
    })
  })

  describe(`Destination: ${destinations.practitionerAnalysisSummary}`, () => {
    it(`routes to ${destinations.practitionerAnalysisSummary} if YES is selected`, () => {
      cy.visitStep(destinations.practitionerAnalysisSummary)
      cy.getQuestion('Does Sam seem motivated to stop or reduce their drug use?')
        .getRadio('Motivated to stop or reduce')
        .clickLabel()
      cy.getQuestion("Are there any strengths or protective factors related to Sam's drug use?")
        .getRadio('No')
        .clickLabel()
      cy.getQuestion("Is Sam's drug use linked to risk of serious harm?").getRadio('No').clickLabel()
      cy.getQuestion("Is Sam's drug use linked to risk of reoffending?").getRadio('No').clickLabel()

      cy.markAsComplete()

      cy.get('.analysis-summary__heading').contains('Does Sam seem motivated to stop or reduce their drug use?')
    })
  })
})
