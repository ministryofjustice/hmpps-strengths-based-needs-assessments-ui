import { testPractitionerAnalysis } from './common'

describe('Origin: /accommodation', () => {
  const destinations = {
    landingPage: '/accommodation',
    settled: '/settled-accommodation',
    temporary: '/temporary-accommodation',
    temporary2: '/temporary-accommodation-2',
    noAccommodation: '/no-accommodation',
    analysis: '/accommodation-analysis',
    analysisComplete: '/accommodation-analysis-complete',
  }

  const sectionName = 'Accommodation'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.settled}`, () => {
    const typeOfAccommodation = 'Settled'

    Array.of(
      'Homeowner',
      'Living with friends or family',
      'Renting privately',
      'Renting from social, local authority or other',
      'Residential healthcare',
      'Supported accommodation',
    ).forEach(typeOfSettledAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfSettledAccommodation}" routes to "${destinations.settled}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion('What type of accommodation does Sam currently have?').getRadio(typeOfAccommodation).clickLabel()

        cy.getQuestion('What type of accommodation does Sam currently have?')
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfSettledAccommodation)
          .clickLabel()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.settled)
        cy.assertResumeUrlIs(sectionName, destinations.settled)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.settled)

        cy.getQuestion('Who is Sam living with?').getCheckbox('Alone').clickLabel()

        cy.getQuestion("Is the location of Sam's accommodation suitable?").getRadio('Yes').clickLabel()

        cy.getQuestion("Is Sam's accommodation suitable?").getRadio('Yes').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
        cy.assertResumeUrlIs(sectionName, destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.temporary}`, () => {
    const typeOfAccommodation = 'Temporary'

    Array.of('Immigration accommodation', 'Short term accommodation').forEach(typeOfTemporaryAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfTemporaryAccommodation}" routes to "${destinations.temporary}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion('What type of accommodation does Sam currently have?').getRadio(typeOfAccommodation).clickLabel()

        cy.getQuestion('What type of accommodation does Sam currently have?')
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .clickLabel()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.temporary)
        cy.assertResumeUrlIs(sectionName, destinations.temporary)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.temporary)

        cy.getQuestion('Who is Sam living with?').getCheckbox('Other').clickLabel()

        cy.getQuestion("Is the location of Sam's accommodation suitable?").getRadio('Yes').clickLabel()

        cy.getQuestion("Is Sam's accommodation suitable?").getRadio('Yes').clickLabel()

        cy.getQuestion('Does Sam have future accommodation planned?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
        cy.assertResumeUrlIs(sectionName, destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.temporary2}`, () => {
    const typeOfAccommodation = 'Temporary'

    Array.of(
      'Approved premises',
      'Community Accommodation Service Tier 2 (CAS2)',
      'Community Accommodation Service Tier 3 (CAS3)',
    ).forEach(typeOfTemporaryAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfTemporaryAccommodation}" routes to "${destinations.temporary2}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion('What type of accommodation does Sam currently have?').getRadio(typeOfAccommodation).clickLabel()

        cy.getQuestion('What type of accommodation does Sam currently have?')
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .clickLabel()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.temporary2)
        cy.assertResumeUrlIs(sectionName, destinations.temporary2)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.temporary2)

        cy.getQuestion("Is Sam's accommodation suitable?").getRadio('Yes').clickLabel()

        cy.getQuestion('Does Sam have future accommodation planned?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
        cy.assertResumeUrlIs(sectionName, destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.noAccommodation}`, () => {
    const typeOfAccommodation = 'No accommodation'

    Array.of('Campsite', 'Emergency hostel', 'Homeless - includes squatting', 'Rough sleeping', 'Shelter').forEach(
      typeOfNoAccommodation => {
        it(`"${typeOfAccommodation}" and "${typeOfNoAccommodation}" routes to "${destinations.noAccommodation}"`, () => {
          cy.visitStep(destinations.landingPage)

          cy.getQuestion('What type of accommodation does Sam currently have?')
            .getRadio(typeOfAccommodation)
            .clickLabel()

          cy.getQuestion('What type of accommodation does Sam currently have?')
            .getRadio(typeOfAccommodation)
            .getConditionalQuestion()
            .getRadio(typeOfNoAccommodation)
            .clickLabel()

          cy.saveAndContinue()

          cy.assertStepUrlIs(destinations.noAccommodation)
          cy.assertResumeUrlIs(sectionName, destinations.noAccommodation)
        })
      },
    )

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.noAccommodation)

        cy.getQuestion('Why does Sam have no accommodation?').getCheckbox('Alcohol related problems').clickLabel()

        cy.getQuestion('Does Sam have future accommodation planned?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
        cy.assertResumeUrlIs(sectionName, destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })
})
