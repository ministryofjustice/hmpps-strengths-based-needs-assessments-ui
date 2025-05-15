// TODO remove temp
describe('Origin: /temp-drug-use', () => {
  const destinations = {
    landingPage: '/temp-drug-use',
    addDrugs: '/temp-add-drugs',
    drugsDetail: '/temp-drug-detail',
    drugsDetailMoreThanSix: '/temp-drug-detail-more-than-six-months',
    drugUseHistory: '/temp-drug-use-history',
    summary: '/temp-drug-use-summary',
    analysis: '/temp-drug-use-analysis',
  }

  // TODO remove 'new'
  const sectionName = 'Drug use (new)'

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
    it(`routes to ${destinations.drugsDetail}`, () => {
      cy.visitStep(destinations.addDrugs)

      cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cannabis').clickLabel()

      cy.getQuestion('Which drugs has Sam misused?')
        .getCheckbox('Cannabis')
        .getConditionalQuestion()
        .getRadio('Used in the last 6 months')
        .clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.addDrugs)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.drugsDetail)
      cy.assertBackLinkIs(destinations.addDrugs)
      cy.assertResumeUrlIs(sectionName, destinations.drugsDetail)
    })
  })

  // TODO needs another case to deal with more than 6 months

  describe(`Destination: ${destinations.drugsDetail}`, () => {
    it(`routes to ${destinations.drugUseHistory}`, () => {
      cy.visitStep(destinations.drugsDetail)

      cy.getQuestion('How often is Sam using this drug?').getRadio('Daily').clickLabel()

      // TODO uncomment when bug is fixed
      // cy.getQuestion('Which drugs has Sam injected').should('not.exist')
      cy.getQuestion('Which drugs has Sam injected').getCheckbox('None').clickLabel()

      cy.getQuestion('Is Sam receiving treatment for their drug use?').getRadio('Yes').clickLabel()
      cy.getQuestion('Is Sam receiving treatment for their drug use?')
        .getRadio('Yes')
        .getConditionalQuestion()
        .enterText('Treatment details')

      cy.assertResumeUrlIs(sectionName, destinations.drugsDetail)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.drugUseHistory)
      cy.assertBackLinkIs(destinations.drugsDetail)
      cy.assertResumeUrlIs(sectionName, destinations.drugUseHistory)
    })
  })

  describe(`Destination: ${destinations.drugUseHistory}`, () => {
    it(`routes to ${destinations.summary}`, () => {
      cy.visitStep(destinations.drugUseHistory)

      cy.getQuestion('Why does Sam use drugs?').getCheckbox('Cultural or religious practice').clickLabel()

      cy.getQuestion('Why does Sam use drugs?').getCheckbox('Peer pressure or social influence').clickLabel()

      cy.getQuestion('Give details about why Sam uses drugs').enterText('why sam uses drugs')

      cy.getQuestion("How has Sam's drug use affected their life?").getCheckbox('Behaviour').clickLabel()

      cy.getQuestion("Give details about how Sam's life has been affected").enterText('how life has been affected')

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
