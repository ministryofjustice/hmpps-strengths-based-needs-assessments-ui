import { testPractitionerAnalysis } from './common'

/**
 * "Drug use" has a number of unique routes defined in app/form/v1_0/steps/drug-use.ts
 *
 * 1. "No drug use" routes straight to the summary.
 * 2. Drug use in the last 6 months (not injected) routes to drugDetails, then drugUseHistory, then summary.
 * 3. Drug use in the last 6 months (injected) routes to drugDetailsInjected (which has an additional question), then drugUseHistory, then summary.
 * 4. Drug use more than 6 months ago (not injected) routes to drugDetailsMoreThanSix, then drugUseHistoryAllMoreThanSix, then summary.
 * 5. Drug use more than 6 months ago (injected) routes to drugDetailsMoreThanSixInjected, then drugUseHistoryAllMoreThanSix, then summary.
 *
 * When multiple drugs are selected and at least 1 was used more than 6 months ago, the user is routed to the relevant "MoreThanSix" step.
 *
 * In order to test the "resume journey" routing correctly we need to create several assessments during test execution so that the answers
 * from previous assessments do not interfere with the current one. This significantly increases the test execution time.
 */

describe('Origin: /drug-use', () => {
  const destinations = {
    landingPage: '/drug-use',
    addDrugs: '/add-drugs',
    drugDetails: '/drug-details',
    drugDetailsInjected: '/drug-details-injected',
    drugDetailsMoreThanSix: '/drug-details-more-than-six-months',
    drugDetailsMoreThanSixInjected: '/drug-details-more-than-six-months-injected',
    drugUseHistory: '/drug-use-history',
    drugUseHistoryAllMoreThanSix: '/drug-use-history-more-than-six-months',
    backgroundSummary: '/drug-use-summary',
    analysis: '/drug-use-analysis',
    analysisSummary: '/drug-use-analysis-summary',
  }

  const sectionName = 'Drug use'
  const backgroundSubsectionName = `${sectionName} background`
  const practitionerAnalysisSubsectionName = 'Practitioner analysis'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  function testDrugUseHistory() {
    cy.getQuestion('Why does Sam use drugs?').getCheckbox('Cultural or religious practice').clickLabel()

    cy.getQuestion('Why does Sam use drugs?').getCheckbox('Peer pressure or social influence').clickLabel()

    cy.getQuestion('Why does Sam use drugs?').getFollowingDetails().enterText('why sam uses drugs')

    cy.getQuestion("How has Sam's drug use affected their life?").getCheckbox('Behaviour').clickLabel()

    cy.getQuestion("How has Sam's drug use affected their life?")
      .getFollowingDetails()
      .enterText('how life has been affected')

    cy.getQuestion('Has anything helped Sam stop or reduce their drug use?').enterText('stop or reduce drug use')

    cy.getQuestion('Does Sam want to make changes to their drug use?')
      .getRadio('I want to make changes but need help')
      .clickLabel()

    cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugUseHistory)
    cy.saveAndContinue()
    cy.assertStepUrlIs(destinations.backgroundSummary)
    cy.get('.govuk-back-link').should('not.exist')
    cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.backgroundSummary)
  }

  describe('No to drug use', () => {
    describe(`Destination: ${destinations.backgroundSummary}`, () => {
      it(`No drug use routes to "${destinations.backgroundSummary}"`, () => {
        cy.visitStep(destinations.landingPage)
        cy.getQuestion('Has Sam ever misused drugs?').getRadio('No').clickLabel()
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.landingPage)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.backgroundSummary)
        cy.get('.govuk-back-link').should('not.exist')
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.backgroundSummary)
      })

      testPractitionerAnalysis(
        sectionName,
        destinations.backgroundSummary,
        practitionerAnalysisSubsectionName,
        destinations.analysisSummary,
        false,
      )
    })
  })

  describe('Yes to drug use', () => {
    describe(`Destination: ${destinations.addDrugs}`, () => {
      it(`"Drug use routes to "${destinations.addDrugs}"`, () => {
        cy.visitStep(destinations.landingPage)
        cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.landingPage)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.addDrugs)
        cy.assertBackLinkIs(destinations.landingPage)
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.addDrugs)
      })
    })
  })

  describe('Used drugs in the last 6 months - not injected', () => {
    it(`"Drug use routes to "${destinations.addDrugs}"`, () => {
      cy.createAssessment()
      cy.enterAssessment()

      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
      cy.saveAndContinue()
    })

    describe(`Destination: ${destinations.drugDetails}`, () => {
      it(`routes to ${destinations.drugDetails}`, () => {
        cy.visitStep(destinations.addDrugs)

        cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cannabis').clickLabel()

        cy.getQuestion('Which drugs has Sam misused?')
          .getCheckbox('Cannabis')
          .getConditionalQuestion()
          .getRadio('Used in the last 6 months')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.addDrugs)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.drugDetails)
        cy.assertBackLinkIs(destinations.addDrugs)
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugDetails)
      })

      describe(`Destination: ${destinations.drugUseHistory}`, () => {
        it(`routes to ${destinations.drugUseHistory}`, () => {
          cy.visitStep(destinations.drugDetails)

          cy.getQuestion('How often is Sam using this drug?').getRadio('Daily').clickLabel()

          cy.getQuestion('Is Sam receiving treatment for their drug use?').getRadio('Yes').clickLabel()
          cy.getQuestion('Is Sam receiving treatment for their drug use?')
            .getRadio('Yes')
            .getConditionalQuestion()
            .enterText('Treatment details')

          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugDetails)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.drugUseHistory)
          cy.assertBackLinkIs(destinations.drugDetails)
          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugUseHistory)
        })

        describe(`Destination: ${destinations.backgroundSummary}`, () => {
          it(`routes to ${destinations.backgroundSummary}`, () => {
            cy.visitStep(destinations.drugUseHistory)

            testDrugUseHistory()
          })

          describe(`Test Practitioner Analysis`, () => {
            testPractitionerAnalysis(
              sectionName,
              destinations.backgroundSummary,
              practitionerAnalysisSubsectionName,
              destinations.analysisSummary,
              true,
            )
          })
        })
      })
    })
  })

  describe('Used drugs in the last 6 months - injected', () => {
    it(`"Drug use routes to "${destinations.addDrugs}"`, () => {
      cy.createAssessment()
      cy.enterAssessment()

      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
      cy.saveAndContinue()
    })

    describe(`Destination: ${destinations.drugDetails}`, () => {
      it(`routes to ${destinations.drugDetailsInjected}`, () => {
        cy.visitStep(destinations.addDrugs)

        cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cocaine').clickLabel()

        cy.getQuestion('Which drugs has Sam misused?')
          .getCheckbox('Cocaine')
          .getConditionalQuestion()
          .getRadio('Used in the last 6 months')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.addDrugs)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.drugDetailsInjected)
        cy.assertBackLinkIs(destinations.addDrugs)
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugDetailsInjected)
      })

      describe(`Destination: ${destinations.drugUseHistory}`, () => {
        it(`routes to ${destinations.drugUseHistory}`, () => {
          cy.visitStep(destinations.drugDetailsInjected)

          cy.getQuestion('How often is Sam using this drug?').getRadio('Daily').clickLabel()

          cy.getQuestion('Which drugs has Sam injected?').getCheckbox('Cocaine').clickLabel()

          cy.getQuestion('Which drugs has Sam injected?')
            .getCheckbox('Cocaine')
            .getConditionalQuestion()
            .getCheckbox('In the last 6 months')
            .clickLabel()

          cy.getQuestion('Is Sam receiving treatment for their drug use?').getRadio('Yes').clickLabel()
          cy.getQuestion('Is Sam receiving treatment for their drug use?')
            .getRadio('Yes')
            .getConditionalQuestion()
            .enterText('Treatment details')

          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugDetailsInjected)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.drugUseHistory)
          cy.assertBackLinkIs(destinations.drugDetailsInjected)
          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugUseHistory)
        })

        describe(`Destination: ${destinations.backgroundSummary}`, () => {
          it(`routes to ${destinations.backgroundSummary}`, () => {
            cy.visitStep(destinations.drugUseHistory)

            testDrugUseHistory()
          })

          describe(`Test Practitioner Analysis`, () => {
            testPractitionerAnalysis(
              sectionName,
              destinations.backgroundSummary,
              practitionerAnalysisSubsectionName,
              destinations.analysisSummary,
              true,
            )
          })
        })
      })
    })
  })

  describe('Not used drugs in the last 6 months - not injected', () => {
    it(`"Drug use routes to "${destinations.addDrugs}"`, () => {
      cy.createAssessment()
      cy.enterAssessment()

      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
      cy.saveAndContinue()
    })

    describe(`Destination: ${destinations.drugDetailsMoreThanSix}`, () => {
      it(`routes to ${destinations.drugDetailsMoreThanSix}`, () => {
        cy.visitStep(destinations.addDrugs)

        cy.getQuestion('Which drugs has Sam misused?').get('input[type="checkbox"]').uncheck()

        cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cannabis').clickLabel()

        cy.getQuestion('Which drugs has Sam misused?')
          .getCheckbox('Cannabis')
          .getConditionalQuestion()
          .getRadio('Used more than 6 months ago')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.addDrugs)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.drugDetailsMoreThanSix)
        cy.assertBackLinkIs(destinations.addDrugs)
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugDetailsMoreThanSix)
      })

      describe(`Destination: ${destinations.drugUseHistoryAllMoreThanSix}`, () => {
        it(`routes to ${destinations.drugUseHistoryAllMoreThanSix}`, () => {
          cy.visitStep(destinations.drugDetailsMoreThanSix)

          cy.getQuestion("Give details about Sam's cannabis use").enterText('Details about drug use')

          cy.getQuestion('Has Sam ever received treatment for their drug use?').getRadio('No').clickLabel()

          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugDetailsMoreThanSix)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.drugUseHistoryAllMoreThanSix)
          cy.assertBackLinkIs(destinations.drugDetailsMoreThanSix)
          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugUseHistoryAllMoreThanSix)
        })

        describe(`Destination: ${destinations.backgroundSummary}`, () => {
          it(`routes to ${destinations.backgroundSummary}`, () => {
            cy.visitStep(destinations.drugUseHistoryAllMoreThanSix)

            cy.getQuestion('Why did Sam use drugs?').getCheckbox('Cultural or religious practice').clickLabel()

            cy.getQuestion('Why did Sam use drugs?').getCheckbox('Peer pressure or social influence').clickLabel()

            cy.getQuestion('Why did Sam use drugs?').getFollowingDetails().enterText('why sam used drugs')

            cy.getQuestion("How has Sam's drug use affected their life?").getCheckbox('Behaviour').clickLabel()

            cy.getQuestion("How has Sam's drug use affected their life?")
              .getFollowingDetails()
              .enterText('how life has been affected')

            cy.getQuestion('Has anything helped Sam stop or reduce their drug use?').enterText(
              'stop or reduce drug use',
            )

            cy.getQuestion('Does Sam want to make changes to their drug use?')
              .getRadio('I want to make changes but need help')
              .clickLabel()

            cy.getQuestion('What could help Sam not use drugs in the future?').enterText('not use in the future')

            cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugUseHistoryAllMoreThanSix)
            cy.saveAndContinue()
            cy.assertStepUrlIs(destinations.backgroundSummary)
            cy.get('.govuk-back-link').should('not.exist')
            cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.backgroundSummary)
          })

          describe(`Test Practitioner Analysis`, () => {
            testPractitionerAnalysis(
              sectionName,
              destinations.backgroundSummary,
              practitionerAnalysisSubsectionName,
              destinations.analysisSummary,
              true,
            )
          })
        })
      })
    })
  })

  describe('Not used drugs in the last 6 months - injected', () => {
    it(`"Drug use routes to "${destinations.addDrugs}"`, () => {
      cy.createAssessment()
      cy.enterAssessment()

      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
      cy.saveAndContinue()
    })

    describe(`Destination: ${destinations.drugDetailsMoreThanSixInjected}`, () => {
      it(`routes to ${destinations.drugDetailsMoreThanSixInjected}`, () => {
        cy.visitStep(destinations.addDrugs)

        cy.getQuestion('Which drugs has Sam misused?')
          .get('input[type="checkbox"]')
          .each($el => {
            if ($el.is(':checked')) cy.wrap($el).uncheck()
          })

        cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cocaine').clickLabel()

        cy.getQuestion('Which drugs has Sam misused?')
          .getCheckbox('Cocaine')
          .getConditionalQuestion()
          .getRadio('Used more than 6 months ago')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.addDrugs)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.drugDetailsMoreThanSixInjected)
        cy.assertBackLinkIs(destinations.addDrugs)
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugDetailsMoreThanSixInjected)
      })

      describe(`Destination: ${destinations.drugUseHistoryAllMoreThanSix}`, () => {
        it(`routes to ${destinations.drugUseHistoryAllMoreThanSix}`, () => {
          cy.visitStep(destinations.drugDetailsMoreThanSixInjected)

          cy.getQuestion("Give details about Sam's cocaine use").enterText('Details about drug use')

          cy.getQuestion('Which drugs has Sam injected?').getCheckbox('Cocaine').clickLabel()

          cy.getQuestion('Has Sam ever received treatment for their drug use?').getRadio('No').clickLabel()

          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugDetailsMoreThanSixInjected)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.drugUseHistoryAllMoreThanSix)
          cy.assertBackLinkIs(destinations.drugDetailsMoreThanSixInjected)
          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugUseHistoryAllMoreThanSix)
        })

        describe(`Destination: ${destinations.backgroundSummary}`, () => {
          it(`routes to ${destinations.backgroundSummary}`, () => {
            cy.visitStep(destinations.drugUseHistoryAllMoreThanSix)

            cy.getQuestion('Why did Sam use drugs?').getCheckbox('Cultural or religious practice').clickLabel()

            cy.getQuestion('Why did Sam use drugs?').getCheckbox('Peer pressure or social influence').clickLabel()

            cy.getQuestion('Why did Sam use drugs?').getFollowingDetails().enterText('why sam used drugs')

            cy.getQuestion("How has Sam's drug use affected their life?").getCheckbox('Behaviour').clickLabel()

            cy.getQuestion("How has Sam's drug use affected their life?")
              .getFollowingDetails()
              .enterText('how life has been affected')

            cy.getQuestion('Has anything helped Sam stop or reduce their drug use?').enterText(
              'stop or reduce drug use',
            )

            cy.getQuestion('What could help Sam not use drugs in the future?').enterText('help not use in the future')

            cy.getQuestion('Does Sam want to make changes to their drug use?')
              .getRadio('I want to make changes but need help')
              .clickLabel()

            cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.drugUseHistoryAllMoreThanSix)
            cy.saveAndContinue()
            cy.assertStepUrlIs(destinations.backgroundSummary)
            cy.get('.govuk-back-link').should('not.exist')
            cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.backgroundSummary)
          })

          describe(`Test Practitioner Analysis`, () => {
            testPractitionerAnalysis(
              sectionName,
              destinations.backgroundSummary,
              practitionerAnalysisSubsectionName,
              destinations.analysisSummary,
              true,
            )
          })
        })
      })
    })
  })
})
