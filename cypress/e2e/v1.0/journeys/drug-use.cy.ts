import { testPractitionerAnalysis } from './common'

describe('Origin: /drug-use', () => {
  const destinations = {
    landingPage: '/drug-use',
    drugUseDetails: '/drug-use-details',
    drugTypes: '/drug-use-type',
    drugTypesDetails: '/drug-usage-details',
    changes: '/drug-use-changes',
    analysis: '/drug-use-analysis',
    analysisComplete: '/drug-use-analysis-complete',
  }

  const sectionName = 'Drug use'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.analysis}`, () => {
    it(`No drug use routes to "${destinations.analysis}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever used drugs?').getRadio('No').clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.analysis)
      cy.assertResumeUrlIs(sectionName, destinations.analysis)
    })

    testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
  })

  describe(`Destination: ${destinations.drugUseDetails}`, () => {
    it(`"Drug use routes to "${destinations.drugUseDetails}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever used drugs?').getRadio('Yes').clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.drugUseDetails)
      cy.assertResumeUrlIs(sectionName, destinations.drugUseDetails)
    })

    describe(`Destination: ${destinations.drugTypes}`, () => {
      it(`routes to ${destinations.drugTypes}`, () => {
        cy.visitStep(destinations.drugUseDetails)

        cy.getQuestion('Why did Sam start using drugs?').getCheckbox('Enhance performance').clickLabel()

        cy.getQuestion("What's the impact of Sam using drugs?").getCheckbox('Behavioural').clickLabel()

        cy.getQuestion('Has anything helped Sam to stop or reduce using drugs in the past?')
          .getRadio('Yes')
          .clickLabel()

        cy.getQuestion('Is Sam motivated to stop or reduce their drug use?')
          .getRadio('Motivated to stop or reduce')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.drugUseDetails)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.drugTypes)
        cy.assertResumeUrlIs(sectionName, destinations.drugTypes)
      })

      describe(`Destination: ${destinations.drugTypesDetails}`, () => {
        it(`routes to ${destinations.drugTypesDetails}`, () => {
          cy.visitStep(destinations.drugTypes)

          cy.getQuestion('Which drugs has Sam used?').getCheckbox('Cannabis').clickLabel()

          cy.assertResumeUrlIs(sectionName, destinations.drugTypes)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.drugTypesDetails)
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
            cy.assertResumeUrlIs(sectionName, destinations.changes)
          })

          describe(`Destination: ${destinations.analysis}`, () => {
            it(`routes to ${destinations.analysis}`, () => {
              cy.visitStep(destinations.changes)

              cy.getQuestion('Does Sam want to make changes to their drug use?')
                .getRadio('I do not want to make changes')
                .clickLabel()

              cy.assertResumeUrlIs(sectionName, destinations.changes)
              cy.saveAndContinue()
              cy.assertStepUrlIs(destinations.analysis)
              cy.assertResumeUrlIs(sectionName, destinations.analysis)
            })

            testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
          })
        })
      })
    })
  })
})
