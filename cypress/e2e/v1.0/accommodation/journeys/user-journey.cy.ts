describe('Origin: /accommodation', () => {
  const destinations = {
    settled: '/settled-accommodation',
    temporary: '/temporary-accommodation',
    temporary2: '/temporary-accommodation-2',
    noAccommodation: '/no-accommodation',
    noAccommodation2: '/no-accommodation-2',
    analysis: '/accommodation-summary-analysis',
  }

  beforeEach(() => {
    cy.createAssessment()
    cy.visitSection('Accommodation')
  })

  describe(`Destination: ${destinations.settled}`, () => {
    const typeOfAccommodation = 'Settled'

    ;[
      'Homeowner',
      'Living with friends or family',
      'Renting privately',
      'Renting from social, local authority or other',
      'Residential healthcare',
      'Supported accommodation',
    ].forEach(typeOfSettledAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfSettledAccommodation}" routes to "${destinations.settled}"`, () => {
        cy.getQuestion("What is Paul's current accommodation?").getRadio(typeOfAccommodation).selectOption()

        cy.getQuestion("What is Paul's current accommodation?")
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfSettledAccommodation)
          .selectOption()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.settled)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.settled)

        cy.getQuestion('Who is Paul living with?').getCheckbox('Alone').selectOption()

        cy.getQuestion("Is the location of Paul's accommodation suitable?").getRadio('Yes').selectOption()

        cy.getQuestion("Is Paul's overall accommodation suitable?").getRadio('Yes').selectOption()

        cy.getQuestion('Does Paul want to make changes to their accommodation?')
          .getRadio('Not applicable')
          .selectOption()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })
    })
  })

  describe(`Destination: ${destinations.temporary}`, () => {
    const typeOfAccommodation = 'Temporary'

    ;['Immigration accommodation', 'Short term accommodation'].forEach(typeOfTemporaryAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfTemporaryAccommodation}" routes to "${destinations.temporary}"`, () => {
        cy.getQuestion("What is Paul's current accommodation?").getRadio(typeOfAccommodation).selectOption()

        cy.getQuestion("What is Paul's current accommodation?")
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .selectOption()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.temporary)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.temporary)

        cy.getQuestion('Who is Paul living with?').getCheckbox('Alone').selectOption()

        cy.getQuestion("Is the location of Paul's accommodation suitable?").getRadio('Yes').selectOption()

        cy.getQuestion("Is Paul's overall accommodation suitable?").getRadio('Yes').selectOption()

        cy.getQuestion('Does Paul have future accommodation planned?').getRadio('No').selectOption()

        cy.getQuestion('Does Paul want to make changes to their accommodation?')
          .getRadio('Not applicable')
          .selectOption()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })
    })
  })

  describe(`Destination: ${destinations.temporary2}`, () => {
    const typeOfAccommodation = 'Temporary'

    ;[
      'Approved premises',
      'Community Accommodation Service Tier 2 (CAS2)',
      'Community Accommodation Service Tier 3 (CAS3)',
    ].forEach(typeOfTemporaryAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfTemporaryAccommodation}" routes to "${destinations.temporary2}"`, () => {
        cy.getQuestion("What is Paul's current accommodation?").getRadio(typeOfAccommodation).selectOption()

        cy.getQuestion("What is Paul's current accommodation?")
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .selectOption()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.temporary2)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.temporary2)

        cy.getQuestion("Is Paul's overall accommodation suitable?").getRadio('Yes').selectOption()

        cy.getQuestion('Does Paul have future accommodation planned?').getRadio('No').selectOption()

        cy.getQuestion('Does Paul want to make changes to their accommodation?')
          .getRadio('Not applicable')
          .selectOption()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })
    })
  })

  describe(`Destination: ${destinations.noAccommodation}`, () => {
    const typeOfAccommodation = 'No accommodation'

    ;['Campsite', 'Emergency hostel', 'Homeless', 'Rough sleeping', 'Shelter'].forEach(typeOfNoAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfNoAccommodation}" routes to "${destinations.noAccommodation}"`, () => {
        cy.getQuestion("What is Paul's current accommodation?").getRadio(typeOfAccommodation).selectOption()

        cy.getQuestion("What is Paul's current accommodation?")
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfNoAccommodation)
          .selectOption()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.noAccommodation)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.noAccommodation)

        cy.getQuestion('Why does Paul have no accommodation?').getCheckbox('Alcohol related problems').selectOption()

        cy.getQuestion('Does Paul have future accommodation planned?').getRadio('No').selectOption()

        cy.getQuestion('Does Paul want to make changes to their accommodation?')
          .getRadio('Not applicable')
          .selectOption()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })
    })
  })

  describe(`Destination: ${destinations.noAccommodation2}`, () => {
    const typeOfAccommodation = 'No accommodation'

    ;['Awaiting assessment'].forEach(typeOfNoAccommodation => {
      it(`"${typeOfAccommodation}" and "${typeOfNoAccommodation}" routes to "${destinations.noAccommodation2}"`, () => {
        cy.getQuestion("What is Paul's current accommodation?").getRadio(typeOfAccommodation).selectOption()

        cy.getQuestion("What is Paul's current accommodation?")
          .getRadio(typeOfAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfNoAccommodation)
          .selectOption()

        cy.getQuestion("What is Paul's current accommodation?")
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

        cy.getQuestion('Does Paul want to make changes to their accommodation?')
          .getRadio('Not applicable')
          .selectOption()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })
    })
  })
})
