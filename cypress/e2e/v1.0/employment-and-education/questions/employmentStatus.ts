export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "What is Sam's current employment status?"

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint(null)
        .hasRadios([
          'Employed',
          'Self-employed',
          'Retired',
          'Currently unavailable for work',
          'Unemployed - actively looking for work',
          'Unemployed - not actively looking for work',
        ])
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select one option')
      cy.checkAccessibility()
    })

    const typesOfEmployment = ['Full-time', 'Part-time', 'Temporary or casual', 'Apprenticeship']

    it('displays and validates conditional options for Employed', () => {
      cy.getQuestion(question).getRadio('Employed').hasConditionalQuestion(false).clickLabel()
      cy.getQuestion(question).getRadio('Employed').getConditionalQuestion().hasRadios(typesOfEmployment)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).getRadio('Employed').getConditionalQuestion().hasValidationError('Select one option')
      cy.checkAccessibility()
    })

    typesOfEmployment.forEach(typeOfEmployment => {
      it(`summary page displays "Employed - ${typeOfEmployment}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio('Employed').clickLabel()
        cy.getQuestion(question).getRadio('Employed').getConditionalQuestion().getRadio(typeOfEmployment).clickLabel()
        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('Employed').hasSecondaryAnswer(typeOfEmployment)
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
    ;['Self-employed', 'Retired'].forEach(option => {
      it(`summary page displays "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()
        cy.getQuestion(question).getRadio(option).isChecked().hasConditionalQuestion(false)
        cy.saveAndContinue()
        cy.assertStepUrlIsNot(stepUrl)
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
    ;[
      'Currently unavailable for work',
      'Unemployed - actively looking for work',
      'Unemployed - not actively looking for work',
    ].forEach(option => {
      it(`displays and validates conditional options for radio ${option}`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()
        cy.getQuestion(question)
          .getRadio(option)
          .getConditionalQuestion()
          .hasTitle('Have they been employed before?')
          .hasRadios(['Yes, has been employed before', 'No, has never been employed'])
        cy.saveAndContinue()
        cy.assertStepUrlIs(stepUrl)
        cy.getQuestion(question).getRadio(option).getConditionalQuestion().hasValidationError('Select one option')
        cy.checkAccessibility()
      })
      ;[
        ['Yes, has been employed before', 'Has been employed before'],
        ['No, has never been employed', 'Has never been employed'],
      ].forEach(([hasBeenEmployedRadio, hasBeenEmployedSummary]) => {
        it(`summary page displays "${option} - ${hasBeenEmployedSummary}"`, () => {
          cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).clickLabel()
          cy.getQuestion(question).getRadio(option).getConditionalQuestion().getRadio(hasBeenEmployedRadio).clickLabel()
          cy.saveAndContinue()
          cy.visitStep(summaryPage)
          cy.getSummary(question).getAnswer(option).hasSecondaryAnswer(hasBeenEmployedSummary)
          cy.checkAccessibility()
          cy.getSummary(question).clickChange()
          cy.assertStepUrlIs(stepUrl)
          cy.assertQuestionUrl(question)
        })
      })
    })
  })
}
