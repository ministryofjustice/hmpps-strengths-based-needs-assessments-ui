export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "Who are the important people in Sam's life?"

  describe(question, () => {
    const options = [
      "Partner or someone they're in an intimate relationship with",
      'Their children or anyone they have parental responsibilities for',
      'Other children',
      'Family members',
      'Friends',
      'Other',
    ]

    it('displays and validates the question', () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select at least one option')

      cy.checkAccessibility()
    })

    const optionalDetailsOptions = [
      [
        "Partner or someone they're in an intimate relationship with",
        'Give details (optional)',
        "Include their name, age, gender and the nature of their relationship. For example, if they're in a casual or committed relationship.",
      ],
      [
        'Their children or anyone they have parental responsibilities for',
        'Give details (optional)',
        'Include their name, age, gender and the nature of their relationship.',
      ],
      ['Other children', 'Give details about their relationship (optional)', null],
      ['Family members', 'Give details about their relationship (optional)', null],
      ['Friends', 'Give details about their friendship (optional)', null],
    ]

    optionalDetailsOptions.forEach(([option, conditionalQuestion, hint]) => {
      it(`optional details field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle(conditionalQuestion)
          .hasHint(hint)
          .hasLimit(400)

        cy.saveAndContinue()

        cy.assertStepUrlIsNot(stepUrl)
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()

        cy.visitStep(stepUrl)
        cy.getQuestion(question).getCheckbox(option).getConditionalQuestion().enterText('some text')

        cy.checkAccessibility()

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('some text')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getCheckbox(option).isChecked().getConditionalQuestion().hasText('some text')
      })
    })

    it(`mandatory details field is displayed for "Other"`, () => {
      const option = 'Other'
      cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getCheckbox(option)
        .getConditionalQuestion()
        .hasTitle('Give details')
        .hasHint(null)
        .hasLimit(400)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question)
        .getCheckbox(option)
        .getConditionalQuestion()
        .hasValidationError('Enter details')
        .enterText('some text')

      cy.checkAccessibility()

      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('some text')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
      cy.getQuestion(question).getCheckbox(option).isChecked().getConditionalQuestion().hasText('some text')
    })
  })
}
