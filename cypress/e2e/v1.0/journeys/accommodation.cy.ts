import { testPractitionerAnalysis } from './common'

describe('Origin: /accommodation', () => {
  const destinations = {
    landingPage: '/accommodation',
    settled: '/settled-accommodation',
    temporary: '/temporary-accommodation',
    temporary2: '/temporary-accommodation-2',
    noAccommodation: '/no-accommodation',
    noAccommodation2: '/no-accommodation-2',
    analysis: '/accommodation-analysis',
    analysisComplete: '/accommodation-analysis-complete',
  }

  const sectionName = 'Accommodation'

  describe(`Destination: ${destinations.settled}`, () => {
    before(() => {
      cy.createAssessment()
    })

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

        cy.getQuestion("What is Sam's current accommodation?").getRadio(typeOfAccommodation).clickLabel()

        cy.getQuestion("What is Sam's current accommodation?")
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfSettledAccommodation)
          .clickLabel()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.settled)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.settled)

        cy.getQuestion('Who is Sam living with?').getCheckbox('Alone').clickLabel()

        cy.getQuestion("Is the location of Sam's accommodation suitable?").getRadio('Yes').clickLabel()

        cy.getQuestion("Is Sam's overall accommodation suitable?").getRadio('Yes').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.temporary}`, () => {
    before(() => {
      cy.createAssessment()
    })

    const typeOfAccommodation = 'Temporary'

    Array.of('Immigration accommodation', 'Short term accommodation').forEach(typeOfTemporaryAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfTemporaryAccommodation}" routes to "${destinations.temporary}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What is Sam's current accommodation?").getRadio(typeOfAccommodation).clickLabel()

        cy.getQuestion("What is Sam's current accommodation?")
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .clickLabel()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.temporary)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.temporary)

        cy.getQuestion('Who is Sam living with?').getCheckbox('Alone').clickLabel()

        cy.getQuestion("Is the location of Sam's accommodation suitable?").getRadio('Yes').clickLabel()

        cy.getQuestion("Is Sam's overall accommodation suitable?").getRadio('Yes').clickLabel()

        cy.getQuestion('Does Sam have future accommodation planned?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.temporary2}`, () => {
    before(() => {
      cy.createAssessment()
    })

    const typeOfAccommodation = 'Temporary'

    Array.of(
      'Approved premises',
      'Community Accommodation Service Tier 2 (CAS2)',
      'Community Accommodation Service Tier 3 (CAS3)',
    ).forEach(typeOfTemporaryAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfTemporaryAccommodation}" routes to "${destinations.temporary2}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What is Sam's current accommodation?").getRadio(typeOfAccommodation).clickLabel()

        cy.getQuestion("What is Sam's current accommodation?")
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .clickLabel()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.temporary2)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.temporary2)

        cy.getQuestion("Is Sam's overall accommodation suitable?").getRadio('Yes').clickLabel()

        cy.getQuestion('Does Sam have future accommodation planned?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.noAccommodation}`, () => {
    before(() => {
      cy.createAssessment()
    })

    const typeOfAccommodation = 'No accommodation'

    Array.of('Campsite', 'Emergency hostel', 'Homeless', 'Rough sleeping', 'Shelter').forEach(typeOfNoAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfNoAccommodation}" routes to "${destinations.noAccommodation}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What is Sam's current accommodation?").getRadio(typeOfAccommodation).clickLabel()

        cy.getQuestion("What is Sam's current accommodation?")
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfNoAccommodation)
          .clickLabel()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.noAccommodation)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.noAccommodation)

        cy.getQuestion('Why does Sam have no accommodation?').getCheckbox('Alcohol related problems').clickLabel()

        cy.getQuestion('Does Sam have future accommodation planned?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.noAccommodation2}`, () => {
    before(() => {
      cy.createAssessment()
    })

    const typeOfAccommodation = 'No accommodation'

    Array.of('Awaiting assessment').forEach(typeOfNoAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfNoAccommodation}" routes to "${destinations.noAccommodation2}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What is Sam's current accommodation?").getRadio(typeOfAccommodation).clickLabel()

        cy.getQuestion("What is Sam's current accommodation?")
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfNoAccommodation)
          .clickLabel()

        cy.getQuestion("What is Sam's current accommodation?")
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfNoAccommodation)
          .getConditionalQuestion()
          .enterText('Some details')

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.noAccommodation2)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.noAccommodation2)

        cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })
})
