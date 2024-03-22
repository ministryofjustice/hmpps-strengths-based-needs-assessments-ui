export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "What is Sam's current accommodation?"

  describe(question, () => {
    const options = {
      settled: 'Settled',
      temporary: 'Temporary',
      noAccommodation: 'No accommodation',
    }

    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        // .hasHint('') TODO: Update to test for HTML hint?
        .hasRadios([options.settled, options.temporary, options.noAccommodation])

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select current accommodation')

      cy.checkAccessibility()
    })

    const typesOfSettledAccommodation = [
      'Homeowner',
      'Living with friends or family',
      'Renting privately',
      'Renting from social, local authority or other',
      'Residential healthcare',
      'Supported accommodation',
    ]

    it(`displays and validates the conditional options for ${options.settled}`, () => {
      cy.getQuestion(question).getRadio(options.settled).hasConditionalQuestion(false).clickLabel()
      cy.getQuestion(question).getRadio(options.settled).getConditionalQuestion().hasRadios(typesOfSettledAccommodation)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question)
        .getRadio(options.settled)
        .getConditionalQuestion()
        .hasValidationError('Select the type of settled accommodation')
      cy.checkAccessibility()
    })

    typesOfSettledAccommodation.forEach(typeOfSettledAccommodation => {
      it(`summary page displays "${options.settled} - ${typeOfSettledAccommodation}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(options.settled).clickLabel()
        cy.getQuestion(question)
          .getRadio(options.settled)
          .getConditionalQuestion()
          .getRadio(typeOfSettledAccommodation)
          .clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(options.settled).hasSecondaryAnswer(typeOfSettledAccommodation)
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    const typesOfTemporaryAccommodation = [
      'Approved premises',
      'Community Accommodation Service Tier 2 (CAS2)',
      'Community Accommodation Service Tier 3 (CAS3)',
      'Immigration accommodation',
      'Short term accommodation',
    ]

    it(`displays and validates the conditional options for ${options.temporary}`, () => {
      cy.getQuestion(question).getRadio(options.temporary).hasConditionalQuestion(false).clickLabel()
      cy.getQuestion(question)
        .getRadio(options.temporary)
        .getConditionalQuestion()
        .hasRadios(typesOfTemporaryAccommodation)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question)
        .getRadio(options.temporary)
        .getConditionalQuestion()
        .hasValidationError('Select the type of temporary accommodation')
      cy.checkAccessibility()
    })

    typesOfTemporaryAccommodation.forEach(typeOfTemporaryAccommodation => {
      it(`summary page displays "${options.temporary} - ${typeOfTemporaryAccommodation}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(options.temporary).clickLabel()
        cy.getQuestion(question)
          .getRadio(options.temporary)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question)
          .getAnswer(options.temporary)
          .hasSecondaryAnswer(typeOfTemporaryAccommodation, 'Expected end date: Not provided')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    typesOfTemporaryAccommodation.forEach(typeOfTemporaryAccommodation => {
      it(`validates the date "${options.temporary} - ${typeOfTemporaryAccommodation} - Expected end date"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(options.temporary).clickLabel()
        cy.getQuestion(question)
          .getRadio(options.temporary)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .clickLabel()
        cy.getQuestion(question)
          .getRadio(options.temporary)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .getConditionalQuestion()
          .enterDate('99-99-9999')

        cy.saveAndContinue()

        cy.assertStepUrlIs(stepUrl)

        cy.getQuestion(question)
          .getRadio(options.temporary)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .getConditionalQuestion()
          .hasValidationError('Enter a future date')

        cy.checkAccessibility()
      })
    })

    typesOfTemporaryAccommodation.forEach(typeOfTemporaryAccommodation => {
      it(`summary page displays "${options.temporary} - ${typeOfTemporaryAccommodation} - Expected end date"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(options.temporary).clickLabel()
        cy.getQuestion(question)
          .getRadio(options.temporary)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .clickLabel()
        cy.getQuestion(question)
          .getRadio(options.temporary)
          .getConditionalQuestion()
          .getRadio(typeOfTemporaryAccommodation)
          .getConditionalQuestion()
          .enterDate('01-01-2050')

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question)
          .getAnswer(options.temporary)
          .hasSecondaryAnswer(typeOfTemporaryAccommodation, 'Expected end date: 01 January 2050')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    const typesOfNoAccommodation = [
      'Awaiting assessment',
      'Campsite',
      'Emergency hostel',
      'Homeless',
      'Rough sleeping',
      'Shelter',
    ]

    const typesOfNoAccommodationWithDetails = ['Awaiting assessment']

    it(`displays and validates the conditional options for ${options.noAccommodation}`, () => {
      cy.getQuestion(question).getRadio(options.noAccommodation).hasConditionalQuestion(false).clickLabel()
      cy.getQuestion(question)
        .getRadio(options.noAccommodation)
        .getConditionalQuestion()
        .hasRadios(typesOfNoAccommodation)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question)
        .getRadio(options.noAccommodation)
        .getConditionalQuestion()
        .hasValidationError('Select the type of no accommodation')
      cy.checkAccessibility()
    })

    typesOfNoAccommodation.forEach(typeOfNoAccommodation => {
      it(`summary page displays "${options.noAccommodation} - ${typeOfNoAccommodation}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(options.noAccommodation).clickLabel()
        cy.getQuestion(question)
          .getRadio(options.noAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfNoAccommodation)
          .clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(options.noAccommodation).hasSecondaryAnswer(typeOfNoAccommodation)
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    typesOfNoAccommodationWithDetails.forEach(typeOfNoAccommodation => {
      it(`summary page displays "${options.noAccommodation} - ${typeOfNoAccommodation} - Give details"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio(options.noAccommodation).clickLabel()
        cy.getQuestion(question)
          .getRadio(options.noAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfNoAccommodation)
          .clickLabel()
        cy.getQuestion(question)
          .getRadio(options.noAccommodation)
          .getConditionalQuestion()
          .getRadio(typeOfNoAccommodation)
          .getConditionalQuestion()
          .enterText('Some details')

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question)
          .getAnswer(options.noAccommodation)
          .hasSecondaryAnswer(typeOfNoAccommodation, 'Some details')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
  })
}
