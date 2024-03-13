describe('/employment-education', () => {
  before(() => {
    const [stepUrl] = Cypress.currentTest.titlePath
    this.stepUrl = stepUrl

    cy.createAssessment()
    cy.visitStep(this.stepUrl)
    cy.assertQuestionCount(1)
  })

  beforeEach(() => {
    cy.assertSectionIs('Employment and education')
    cy.assertStepUrlIs(this.stepUrl)
  })

  describe(`What is Paul's current employment status?`, () => {
    before(() => {
      const [, question] = Cypress.currentTest.titlePath
      this.question = question
    })

    it(`displays and validates the question`, () => {
      cy.getQuestion(this.question)
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
      cy.assertStepUrlIs(this.stepUrl)
      cy.getQuestion(this.question).hasValidationError('Select one option')
    })

    it('displays and validates conditional options for Employed', () => {
      cy.getQuestion(this.question).getRadio('Employed').hasConditionalQuestion(false).selectOption()
      cy.getQuestion(this.question)
        .getRadio('Employed')
        .isChecked()
        .hasConditionalQuestion()
        .getConditionalQuestion()
        .hasRadios(['Full-time', 'Part-time', 'Temporary or casual', 'Apprenticeship'])
      cy.saveAndContinue()
      cy.assertStepUrlIs(this.stepUrl)
      cy.getQuestion(this.question)
        .getRadio('Employed')
        .getConditionalQuestion()
        .hasValidationError('Select one option')
    })
    ;['Self-employed', 'Retired'].forEach(option => {
      it(`does not display conditional options for radio ${option}`, () => {
        cy.getQuestion(this.question).getRadio(option).hasConditionalQuestion(false).selectOption()
        cy.getQuestion(this.question).getRadio(option).isChecked().hasConditionalQuestion(false)
        cy.saveAndContinue()
        cy.assertStepUrlIsNot(this.stepUrl)
        cy.visitStep(this.stepUrl)
      })
    })
    ;[
      'Currently unavailable for work',
      'Unemployed - actively looking for work',
      'Unemployed - not actively looking for work',
    ].forEach(option => {
      it(`displays and validates conditional options for radio ${option}`, () => {
        cy.getQuestion(this.question).getRadio(option).hasConditionalQuestion(false).selectOption()
        cy.getQuestion(this.question)
          .getRadio(option)
          .isChecked()
          .hasConditionalQuestion()
          .getConditionalQuestion()
          .hasTitle('Have they been employed before?')
          .hasRadios(['Yes, has been employed before', 'No, has never been employed'])
        cy.saveAndContinue()
        cy.assertStepUrlIs(this.stepUrl)
        cy.getQuestion(this.question).getRadio(option).getConditionalQuestion().hasValidationError('Select one option')
      })
    })
  })
})
