export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Is Sam affected by debt?'
  describe(question, () => {
    const options = [
      'Yes, their own debt',
      'Yes, someone else\'s debt',
      'No',
      'Unknown'
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasCheckboxes(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError("Select if they are affected by debt")
      cy.checkAccessibility()
    })

    const debtOptions = [
      'Debt to others',
      'Formal debt',
    ]

    it('displays and validates the conditional options for "Yes, their own debt"', () => {
      cy.getQuestion(question).getCheckbox('Yes, their own debt').clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Yes, their own debt')
        .getConditionalQuestion()
        .hasHint('Select all that apply')
        .hasCheckboxes(debtOptions)
        .hasValidationError('Select type of debt')

      cy.checkAccessibility()
    })

    debtOptions.forEach(debtOption => {
      it(`summary page displays "Yes, their own debt - ${debtOption}"`, () => {
        cy.getQuestion(question).getCheckbox('Yes, their own debt').clickLabel()

        cy.getQuestion(question).getCheckbox('Yes, their own debt').getConditionalQuestion().getCheckbox(debtOption).clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('Yes, their own debt').hasSecondaryAnswer(debtOption)
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    it('displays and validates the conditional options for "Yes, someone else\'s debt"', () => {
      cy.getQuestion(question).getCheckbox('Yes, someone else\'s debt').clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Yes, someone else\'s debt')
        .getConditionalQuestion()
        .hasHint('Select all that apply')
        .hasCheckboxes(debtOptions)
        .hasValidationError('Select type of debt')

      cy.checkAccessibility()
    })

    debtOptions.forEach(debtOption => {
      it(`summary page displays "Yes, someone else\'s debt- ${debtOption}"`, () => {
        cy.getQuestion(question).getCheckbox('Yes, someone else\'s debt').clickLabel()

        cy.getQuestion(question).getCheckbox('Yes, someone else\'s debt').getConditionalQuestion().getCheckbox(debtOption).clickLabel()

        cy.saveAndContinue()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('Yes, someone else\'s debt').hasSecondaryAnswer(debtOption)
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
      })
    })

    it('details field is displayed for "Yes, their own debt - Debt to others"', () => {
      cy.getQuestion(question).getCheckbox('Yes, their own debt').clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Yes, their own debt')
        .getConditionalQuestion()
        .getCheckbox('Debt to others')
        .hasConditionalQuestion(false)

      cy.getQuestion(question).getCheckbox('Yes, their own debt').getConditionalQuestion().getCheckbox('Debt to others').clickLabel()

      cy.saveAndContinue()

      cy.getQuestion(question)
        .getCheckbox('Yes, their own debt')
        .getConditionalQuestion()
        .getCheckbox('Debt to others')
        .getConditionalQuestion()
        .hasNoValidationError()

      cy.getQuestion(question)
        .getCheckbox('Yes, their own debt')
        .getConditionalQuestion()
        .getCheckbox('Debt to others')
        .getConditionalQuestion()
        .hasTitle('Give details (optional')
        .hasHint('Includes things like owing money to family, friends, other prisoners or loan sharks.')
        .enterText('Some details')

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes, their own debt').hasSecondaryAnswer('Debt to others', 'Some details')
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })

    it('details field is displayed for "Yes, their own debt - Formal debt"', () => {
      cy.getQuestion(question).getCheckbox('Yes, their own debt').clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Yes, their own debt')
        .getConditionalQuestion()
        .getCheckbox('Formal debt')
        .hasConditionalQuestion(false)

      cy.getQuestion(question).getCheckbox('Yes, their own debt').getConditionalQuestion().getCheckbox('Formal debt').clickLabel()

      cy.saveAndContinue()

      cy.getQuestion(question)
        .getCheckbox('Yes, their own debt')
        .getConditionalQuestion()
        .getCheckbox('Formal debt')
        .getConditionalQuestion()
        .hasNoValidationError()

      cy.getQuestion(question)
        .getCheckbox('Yes, their own debt')
        .getConditionalQuestion()
        .getCheckbox('Formal debt')
        .getConditionalQuestion()
        .hasTitle('Give details (optional')
        .hasHint('Includes things like credit cards, phone bills or rent arrears.')
        .enterText('Some details')

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes, their own debt').hasSecondaryAnswer('Formal debt', 'Some details')
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })

    it('details field is displayed for "Yes, someone else\'s debt - Debt to others"', () => {
      cy.getQuestion(question).getCheckbox('Yes, someone else\'s debt').clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Yes, someone else\'s debt')
        .getConditionalQuestion()
        .getCheckbox('Debt to others')
        .hasConditionalQuestion(false)

      cy.getQuestion(question).getCheckbox('Yes, someone else\'s debt').getConditionalQuestion().getCheckbox('Debt to others').clickLabel()

      cy.saveAndContinue()

      cy.getQuestion(question)
        .getCheckbox('Yes, someone else\'s debt')
        .getConditionalQuestion()
        .getCheckbox('Debt to others')
        .getConditionalQuestion()
        .hasNoValidationError()

      cy.getQuestion(question)
        .getCheckbox('Yes, someone else\'s debt')
        .getConditionalQuestion()
        .getCheckbox('Debt to others')
        .getConditionalQuestion()
        .hasTitle('Give details (optional')
        .hasHint('Includes things like owing money to family, friends, other prisoners or loan sharks.')
        .enterText('Some details')

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes, someone else\'s debt').hasSecondaryAnswer('Debt to others', 'Some details')
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })

    it('details field is displayed for "Yes, someone else\'s debt - Formal debt"', () => {
      cy.getQuestion(question).getCheckbox('Yes, someone else\'s debt').clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Yes, someone else\'s debt')
        .getConditionalQuestion()
        .getCheckbox('Formal debt')
        .hasConditionalQuestion(false)

      cy.getQuestion(question).getCheckbox('Yes, someone else\'s debt').getConditionalQuestion().getCheckbox('Formal debt').clickLabel()

      cy.saveAndContinue()

      cy.getQuestion(question)
        .getCheckbox('Yes, someone else\'s debt')
        .getConditionalQuestion()
        .getCheckbox('Formal debt')
        .getConditionalQuestion()
        .hasNoValidationError()

      cy.getQuestion(question)
        .getCheckbox('Yes, someone else\'s debt')
        .getConditionalQuestion()
        .getCheckbox('Formal debt')
        .getConditionalQuestion()
        .hasTitle('Give details (optional')
        .hasHint('Includes things like credit cards, phone bills or rent arrears.')
        .enterText('Some details')

      cy.saveAndContinue()

      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Yes, someone else\'s debt').hasSecondaryAnswer('Formal debt', 'Some details')
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })

   
    it(`no conditional field is displayed for "No"`, () => {
        cy.getQuestion(question).getCheckbox('No').hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question).getCheckbox('No').hasConditionalQuestion(false)

        cy.saveAndContinue()
        cy.getQuestion(question).hasNoValidationError()

        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('No').hasNoSecondaryAnswer()
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
    })
   
    it(`conditional field is displayed for "Unknown"`, () => {
      cy.getQuestion(question).getCheckbox('Unknown').hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Unknown')
        .getConditionalQuestion()
        .hasTitle('Give details (optional)')
        .hasHint(null)
        .hasLimit(400)

      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getCheckbox('Unknown')
        .getConditionalQuestion()
        .hasNoValidationError()
        .enterText('some text')

      cy.checkAccessibility()

      cy.saveAndContinue()
      cy.visitStep(summaryPage)
      cy.getSummary(question).getAnswer('Unknown').hasSecondaryAnswer('some text')
      cy.checkAccessibility()
      cy.getSummary(question).clickChange()
      cy.assertStepUrlIs(stepUrl)
      cy.assertQuestionUrl(question)
    })
  })
}
