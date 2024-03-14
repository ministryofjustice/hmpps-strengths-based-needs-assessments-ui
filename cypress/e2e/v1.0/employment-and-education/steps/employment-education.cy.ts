describe( '/employment-education', () => {
  const stepUrl = '/employment-education'
  const summaryPage = '/employment-education-analysis'

  beforeEach(() => {
    cy.createAssessment()
    cy.visitStep(stepUrl)
    cy.assertSectionIs('Employment and education')
    cy.assertQuestionCount(1)
  })

  const question = "What is Paul's current employment status?"

  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(1)
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
    })

    const typesOfEmployment = ['Full-time', 'Part-time', 'Temporary or casual', 'Apprenticeship']

    it('displays and validates conditional options for Employed', () => {
      cy.getQuestion(question).getRadio('Employed').hasConditionalQuestion(false).selectOption()
      cy.getQuestion(question).getRadio('Employed').getConditionalQuestion().hasRadios(typesOfEmployment)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).getRadio('Employed').getConditionalQuestion().hasValidationError('Select one option')
    })

    typesOfEmployment.forEach(typeOfEmployment => {
      it(`summary page displays "Employed - ${typeOfEmployment}"`, () => {
        cy.visitStep(stepUrl)
        cy.getQuestion(question).getRadio('Employed').selectOption()
        cy.getQuestion(question).getRadio('Employed').getConditionalQuestion().getRadio(typeOfEmployment).selectOption()
        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('Employed').hasSecondaryAnswer(typeOfEmployment)
      })
    })
    ;['Self-employed', 'Retired'].forEach(option => {
      it(`summary page displays "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).selectOption()
        cy.getQuestion(question).getRadio(option).isChecked().hasConditionalQuestion(false)
        cy.saveAndContinue()
        cy.assertStepUrlIsNot(stepUrl)
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
      })
    })
    ;[
      'Currently unavailable for work',
      'Unemployed - actively looking for work',
      'Unemployed - not actively looking for work',
    ].forEach(option => {
      it(`displays and validates conditional options for radio ${option}`, () => {
        cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).selectOption()
        cy.getQuestion(question)
          .getRadio(option)
          .getConditionalQuestion()
          .hasTitle('Have they been employed before?')
          .hasRadios(['Yes, has been employed before', 'No, has never been employed'])
        cy.saveAndContinue()
        cy.assertStepUrlIs(stepUrl)
        cy.getQuestion(question).getRadio(option).getConditionalQuestion().hasValidationError('Select one option')
      })
      ;[
        ['Yes, has been employed before', 'Has been employed before'],
        ['No, has never been employed', 'Has never been employed'],
      ].forEach(([hasBeenEmployedRadio, hasBeenEmployedSummary]) => {
        it(`summary page displays "${option} - ${hasBeenEmployedSummary}"`, () => {
          cy.getQuestion(question).getRadio(option).hasConditionalQuestion(false).selectOption()
          cy.getQuestion(question)
            .getRadio(option)
            .getConditionalQuestion()
            .getRadio(hasBeenEmployedRadio)
            .selectOption()
          cy.saveAndContinue()
          cy.visitStep(summaryPage)
          cy.getSummary(question).getAnswer(option).hasSecondaryAnswer(hasBeenEmployedSummary)
        })
      })
    })
  })
})
