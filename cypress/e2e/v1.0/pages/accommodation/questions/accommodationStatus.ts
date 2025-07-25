export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'What type of accommodation does Sam currently have?'

  describe(question, () => {
    const options = {
      settled: 'Settled',
      temporary: 'Temporary',
      noAccommodation: 'No accommodation',
    }

    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .getRadio(options.settled)
        .get('.govuk-radios__input')
        .first()
        .should('have.attr', 'aria-required')

      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasRadios([options.settled, options.temporary, options.noAccommodation])

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select the type of accommodation they currently have')

      cy.checkAccessibility()
    })

    const typesOfSettledAccommodation = [
      'Homeowner',
      'Living with friends or family',
      'Renting privately',
      'Renting from social, local authority or other',
      'Residential healthcare',
      'Supported accommodation',
      'Unknown',
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
        cy.getQuestion(question)
          .getRadio(options.settled)
          .isChecked()
          .getConditionalQuestion()
          .getRadio(typeOfSettledAccommodation)
          .isChecked()
      })
    })

    const typesOfTemporaryAccommodation = [
      'Approved premises',
      'Community Accommodation Service Tier 2 (CAS2)',
      'Community Accommodation Service Tier 3 (CAS3)',
      'Immigration accommodation',
      'Short term accommodation',
      'Unknown',
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

    typesOfTemporaryAccommodation
      .filter(typeOfTemporaryAccommodation => typeOfTemporaryAccommodation !== 'Unknown')
      .forEach(typeOfTemporaryAccommodation => {
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
          cy.getQuestion(question)
            .getRadio(options.temporary)
            .isChecked()
            .getConditionalQuestion()
            .getRadio(typeOfTemporaryAccommodation)
            .isChecked()
        })
      })

    typesOfTemporaryAccommodation
      .filter(typeOfTemporaryAccommodation => typeOfTemporaryAccommodation !== 'Unknown')
      .forEach(typeOfTemporaryAccommodation => {
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
            .enterDate('33-33-3333')

          cy.saveAndContinue()

          cy.assertStepUrlIs(stepUrl)

          cy.getQuestion(question)
            .getRadio(options.temporary)
            .getConditionalQuestion()
            .getRadio(typeOfTemporaryAccommodation)
            .getConditionalQuestion()
            .hasValidationError('Enter a valid date')

          cy.checkAccessibility()
        })
      })

    typesOfTemporaryAccommodation
      .filter(typeOfTemporaryAccommodation => typeOfTemporaryAccommodation !== 'Unknown')
      .forEach(typeOfTemporaryAccommodation => {
        it(`validates the date "${options.temporary} - ${typeOfTemporaryAccommodation} is in the future - Expected end date"`, () => {
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
            .enterDate('01-01-1970')

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

    typesOfTemporaryAccommodation
      .filter(typeOfTemporaryAccommodation => typeOfTemporaryAccommodation !== 'Unknown')
      .forEach(typeOfTemporaryAccommodation => {
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
          cy.getQuestion(question)
            .getRadio(options.temporary)
            .isChecked()
            .getConditionalQuestion()
            .getRadio(typeOfTemporaryAccommodation)
            .isChecked()
            .getConditionalQuestion()
            .hasDate('01-01-2050')
        })
      })

    typesOfTemporaryAccommodation
      .filter(typeOfTemporaryAccommodation => typeOfTemporaryAccommodation === 'Unknown')
      .forEach(typeOfTemporaryAccommodation => {
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
          cy.getSummary(question).getAnswer(options.temporary).hasNoSecondaryAnswer()
          cy.checkAccessibility()
          cy.getSummary(question).clickChange()
          cy.assertStepUrlIs(stepUrl)
          cy.assertQuestionUrl(question)
          cy.getQuestion(question)
            .getRadio(options.temporary)
            .isChecked()
            .getConditionalQuestion()
            .getRadio(typeOfTemporaryAccommodation)
            .isChecked()
        })
      })

    const typesOfNoAccommodation = [
      'Campsite',
      'Emergency hostel',
      'Homeless - includes squatting',
      'Rough sleeping',
      'Shelter',
      'Unknown',
    ]

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
        cy.getQuestion(question)
          .getRadio(options.noAccommodation)
          .isChecked()
          .getConditionalQuestion()
          .getRadio(typeOfNoAccommodation)
          .isChecked()
      })
    })
  })
}
