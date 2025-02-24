import { testPractitionerAnalysis } from './common'

describe('Origin: /drugs', () => {
  const destinations = {
    landingPage: '/drugs',
    drugUse: '/drug-use',
    selectDrugs: '/select-drugs',
    drugTypesDetails: '/drug-usage-details',
    changes: '/drug-use-changes',
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
      cy.getQuestion('Has Sam ever used drugs?').getRadio('No').clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.summary)
      cy.assertResumeUrlIs(sectionName, destinations.summary)
    })

    testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
  })

  describe(`Destination: ${destinations.drugUse}`, () => {
    it(`"Drug use routes to "${destinations.drugUse}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever used drugs?').getRadio('Yes').clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.drugUse)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, destinations.drugUse)
    })

    describe(`Destination: ${destinations.selectDrugs}`, () => {
      it(`routes to ${destinations.selectDrugs}`, () => {
        cy.visitStep(destinations.drugUse)

        cy.getQuestion('Why did Sam start using drugs?').getCheckbox('Enhance performance').clickLabel()

        cy.getQuestion("What's the impact of Sam using drugs?").getCheckbox('Behavioural').clickLabel()

        cy.getQuestion('Has anything helped Sam to stop or reduce using drugs in the past?')
          .getRadio('Yes')
          .clickLabel()

        cy.getQuestion('Is Sam motivated to stop or reduce their drug use?')
          .getRadio('Motivated to stop or reduce')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.drugUse)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.selectDrugs)
        cy.assertBackLinkIs(destinations.drugUse)
        cy.assertResumeUrlIs(sectionName, destinations.selectDrugs)
      })

      describe(`Destination: ${destinations.drugTypesDetails}`, () => {
        it(`routes to ${destinations.drugTypesDetails}`, () => {
          cy.visitStep(destinations.selectDrugs)

          cy.getQuestion('Which drugs has Sam used?').getCheckbox('Cannabis').clickLabel()

          cy.assertResumeUrlIs(sectionName, destinations.selectDrugs)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.drugTypesDetails)
          cy.assertBackLinkIs(destinations.selectDrugs)
          cy.assertResumeUrlIs(sectionName, destinations.drugTypesDetails)
        })

        describe(`Destination: ${destinations.changes}`, () => {
          it(`routes to ${destinations.changes}`, () => {
            cy.visitStep(destinations.drugTypesDetails)

            cy.getQuestion('How often is Sam using this drug?').getRadio('Daily').clickLabel()

            cy.getQuestion('Has Sam used this drug in the past?').getRadio('Yes').clickLabel()

            cy.assertResumeUrlIs(sectionName, destinations.drugTypesDetails)
            cy.saveAndContinue()
            cy.assertStepUrlIs(destinations.changes)
            cy.assertBackLinkIs(destinations.drugTypesDetails)
            cy.assertResumeUrlIs(sectionName, destinations.changes)
          })

          describe(`Destination: ${destinations.summary}`, () => {
            it(`routes to ${destinations.summary}`, () => {
              cy.visitStep(destinations.changes)

              cy.getQuestion('Does Sam want to make changes to their drug use?')
                .getRadio('I do not want to make changes')
                .clickLabel()

              cy.assertResumeUrlIs(sectionName, destinations.changes)
              cy.saveAndContinue()
              cy.assertStepUrlIs(destinations.summary)
              cy.assertResumeUrlIs(sectionName, destinations.summary)
            })

            testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
          })
        })
      })
    })
  })
})
