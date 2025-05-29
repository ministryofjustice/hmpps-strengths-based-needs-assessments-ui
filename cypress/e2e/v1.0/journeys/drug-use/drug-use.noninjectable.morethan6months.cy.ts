describe('Origin: /drug-use', () => {
  const destinations = {
    landingPage: '/drug-use',
    addDrugs: '/add-drugs',
    drugDetails: '/drug-details',
    drugDetailsMoreThanSix: '/drug-details-more-than-six-months',
    drugUseHistory: '/drug-use-history',
    drugUseHistoryAllMoreThanSix: 'drug-use-history-more-than-six-months',
    summary: '/drug-use-summary',
    analysis: '/drug-use-analysis',
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
        .getRadio('Used more than 6 months ago')
        .clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.addDrugs)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.drugDetailsMoreThanSix)
      cy.assertBackLinkIs(destinations.addDrugs)
      cy.assertResumeUrlIs(sectionName, destinations.drugDetailsMoreThanSix)
    })
  })

  describe(`Destination: ${destinations.drugDetailsMoreThanSix}`, () => {
    it(`routes to ${destinations.drugUseHistory}`, () => {
      cy.visitStep(destinations.drugDetailsMoreThanSix)

      cy.getQuestion("Give details about Sam's use of these drugs").enterText('Details about drug use')

      cy.getQuestion('Has Sam ever received treatment for their drug use?').getRadio('No').clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.drugDetailsMoreThanSix)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.drugUseHistory)
      cy.assertBackLinkIs(destinations.drugDetailsMoreThanSix)
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
})
