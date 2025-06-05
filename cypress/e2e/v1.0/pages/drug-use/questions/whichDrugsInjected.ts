import { drugName, drugs } from '../common/drugs'

export default (usedInTheLastSixMonths: boolean) => (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Which drugs has Sam injected?'
  const drugOptions = drugs.filter(drug => drug.injectable).map(drug => drugName(drug.name))
  const options = ["None", null, ...drugOptions]
  const drugCardSection = usedInTheLastSixMonths ? 'Used in the last 6 months' : 'Not used in the last 6 months'
  const expectedCardItems = usedInTheLastSixMonths ? 4 : 2

  describe(question, () => {
    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Select all that apply.')
        .hasCheckboxes(options)

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(`Select which drugs they've injected, or select 'None'`)

      cy.checkAccessibility()
    })

    drugOptions.forEach(option => {
      if (usedInTheLastSixMonths) {
        const conditionalQuestion = 'When has Sam injected this drug?'

        it(`conditional field "${conditionalQuestion}" is displayed for "${option}"`, () => {
          cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

          cy.getQuestion(question)
            .getCheckbox(option)
            .getConditionalQuestion()
            .hasTitle(conditionalQuestion)
            .hasHint('Select one or both.')
            .hasCheckboxes(['In the last 6 months', 'More than 6 months ago'])

          cy.saveAndContinue()

          cy.getQuestion(question)
            .hasNoValidationError()
            .getCheckbox(option)
            .getConditionalQuestion()
            .hasValidationError('Select when they injected this drug')

          cy.getQuestion(question).getCheckbox(option).getConditionalQuestion().getCheckbox('In the last 6 months').clickLabel()
          cy.saveAndContinue()
          cy.visitStep(summaryPage)
          cy.getDrugSummaryCard(option, drugCardSection).hasCardItems(expectedCardItems).getCardItem('Injected').hasCardItemAnswers('Yes', 'In the last 6 months').clickChange()
          cy.assertStepUrlIs(stepUrl)
          cy.assertQuestionUrl(question)
          cy.getQuestion(question).getCheckbox(option).getConditionalQuestion().getCheckbox('In the last 6 months').isChecked().clickLabel()
          cy.getQuestion(question).getCheckbox(option).getConditionalQuestion().getCheckbox('More than 6 months ago').isNotChecked().clickLabel()
          cy.saveAndContinue()
          cy.visitStep(summaryPage)
          cy.getDrugSummaryCard(option, drugCardSection).hasCardItems(expectedCardItems).getCardItem('Injected').hasCardItemAnswers('Yes', 'More than 6 months ago').clickChange()
          cy.assertStepUrlIs(stepUrl)
          cy.assertQuestionUrl(question)
          cy.getQuestion(question).getCheckbox(option).getConditionalQuestion().getCheckbox('In the last 6 months').isNotChecked().clickLabel()
          cy.getQuestion(question).getCheckbox(option).getConditionalQuestion().getCheckbox('More than 6 months ago').isChecked()
          cy.saveAndContinue()
          cy.visitStep(summaryPage)
          cy.getDrugSummaryCard(option, drugCardSection).hasCardItems(expectedCardItems).getCardItem('Injected').hasCardItemAnswers('Yes', 'In the last 6 months', 'More than 6 months ago')
        })
      } else {
        it(`no conditional field is displayed for "${option}"`, () => {
          cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

          cy.getQuestion(question)
            .getCheckbox(option)
            .hasConditionalQuestion(true)
            .hasDisabledConditionalQuestion()

          cy.saveAndContinue()

          cy.visitStep(summaryPage)
          cy.getDrugSummaryCard(option, drugCardSection).hasCardItems(expectedCardItems).getCardItem('Injected').hasCardItemAnswers('Yes', 'More than 6 months ago').clickChange()
          cy.assertStepUrlIs(stepUrl)
          cy.assertQuestionUrl(question)
          cy.getQuestion(question).getCheckbox(option).isChecked()
        })
      }
    })

    it('selecting "None" deselects other options', () => {
      drugOptions.forEach(option => {
        cy.getQuestion(question).getCheckbox(option).clickLabel()
      })
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      drugOptions.forEach(option => {
        cy.getQuestion(question).getCheckbox(option).isChecked()
      })
      cy.getQuestion(question).getCheckbox('None').clickLabel()
      cy.checkAccessibility()
      cy.saveAndContinue()
      drugOptions.forEach(drug => {
        cy.visitStep(summaryPage)
        cy.getDrugSummaryCard(drug, drugCardSection).hasCardItems(expectedCardItems).getCardItem('Injected').hasCardItemAnswers('No').clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getCheckbox('None').isChecked()
      })
    })

    it('selecting "None" then selecting other options deselects "None"', () => {
      drugOptions.forEach(option => {
        cy.getQuestion(question).getCheckbox('None').clickLabel()
        cy.getQuestion(question).getCheckbox('None').isChecked()
        cy.getQuestion(question).getCheckbox(option).clickLabel()
        cy.getQuestion(question).getCheckbox(option).isChecked()
        cy.getQuestion(question).getCheckbox('None').isNotChecked()
      })
      cy.checkAccessibility()
    })

    it('removing a drug removes it from the list of options', () => {
      cy.visitStep('/add-drugs')
      cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cocaine').isChecked().clickLabel()
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasHiddenCheckbox('Cocaine')
      cy.checkAccessibility()
    })
  })
}
