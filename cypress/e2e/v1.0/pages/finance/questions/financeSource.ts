export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Where does Sam currently get their money from?'
  describe(question, () => {
    const options = [
      'Carer\'s allowance',
      'Disability benefits',
      'Employment',
      'Family or friends',
      'Offending',
      'Pension',
      'Student loan',
      'Undeclared (includes cash in hand)',
      'Work related benefits',
      'Other',
      null,
      'No money'
    ]

    const radioOptions = ['Yes', 'No']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError("Select where they currently get their money from, or select 'No money'")
      cy.checkAccessibility()
    })
  
    it(`conditional field is displayed for "Other"`, () => {
        cy.getQuestion(question).getCheckbox('Other').hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox('Other')
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint(null)
          .hasLimit(400)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox('Other')
          .getConditionalQuestion()
          .hasNoValidationError()
          .enterText('some text')

        cy.checkAccessibility()

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('Other').hasSecondaryAnswer('some text')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
    })

    it(`conditional field is displayed for "Family or friends"`, () => {
      cy.getQuestion(question).getCheckbox('Family or friends').hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Family or friends')
        .getConditionalQuestion()
        .hasTitle('Is Sam over reliant on family or friends for money?')
        .hasHint(null)
        .hasRadios(radioOptions)

      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getCheckbox('Family or friends')
        .getConditionalQuestion()
        .hasValidationError('Select if they are over reliant on family or friends for money')

      cy.checkAccessibility()
 
      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      // cy.getSummary(question).getAnswer('Family and Friends').hasSecondaryAnswer(radioOptions)
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
  })

    ;['Carer\'s allowance', 'Disability benefits', 'Employment','Offending', 'Pension', 'Student loan', 'Undeclared (includes cash in hand)', 'Work related benefits', 'No money'].forEach(option => {
      it(`no conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false)

        cy.saveAndContinue()
        cy.getQuestion(question).hasNoValidationError()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })
  })
}
