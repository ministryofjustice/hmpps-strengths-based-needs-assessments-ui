import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Where does Sam currently get their money from?'
  describe(question, () => {
    const options = [
      "Carer's allowance",
      'Disability benefits',
      'Employment',
      'Family or friends',
      'Offending',
      'Pension',
      'Student loan',
      'Undeclared (includes cash in hand)',
      'Work related benefits',
      'Other',
      'Unknown',
      null,
      'No money',
    ]

    const knownSources = [
      "Carer's allowance",
      'Disability benefits',
      'Employment',
      'Offending',
      'Pension',
      'Student loan',
      'Undeclared (includes cash in hand)',
      'Work related benefits',
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)
      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError(
        "Select where they currently get their money from, or select 'No money'",
      )
      cy.checkAccessibility()
    })

    Array.of('Other', 'No money').forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint(null)
          .hasLimit(config.characterLimit.default)

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasNoValidationError()
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

    const familyOrFriendsOptions = [
      ['Yes', 'Yes, over reliant on friends and family for money'],
      ['No', 'No, not over reliant on friends and family for money'],
    ]

    it(`displays and validates conditional question for "Family or friends"`, () => {
      cy.getQuestion(question).getCheckbox('Family or friends').hasConditionalQuestion(false).clickLabel()

      cy.getQuestion(question)
        .getCheckbox('Family or friends')
        .getConditionalQuestion()
        .hasTitle('Is Sam over reliant on family or friends for money?')
        .hasHint(null)
        .hasRadios(familyOrFriendsOptions.map(([option, _]) => option))

      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getCheckbox('Family or friends')
        .getConditionalQuestion()
        .hasValidationError('Select if they are over reliant on family or friends for money')

      cy.checkAccessibility()
    })

    familyOrFriendsOptions.forEach(([option, displaySummaryValue]) => {
      it(`summary page displays "Family or friends - ${option}"`, () => {
        cy.getQuestion(question).getCheckbox('Family or friends').clickLabel()

        cy.saveAndContinue()
        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox('Family or friends')
          .getConditionalQuestion()
          .hasValidationError('Select if they are over reliant on family or friends for money')
          .getRadio(option)
          .clickLabel()

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer('Family or friends').hasSecondaryAnswer(displaySummaryValue)
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question)
          .getCheckbox('Family or friends')
          .isChecked()
          .getConditionalQuestion()
          .getRadio(option)
          .isChecked()
      })
    })

    knownSources.forEach(option => {
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
        cy.getQuestion(question).getCheckbox(option).isChecked()
      })
    })

    Array.of('Unknown', 'No money').forEach(option => {
      it(`selecting "${option}" deselects other options`, () => {
        knownSources.forEach(knownSource => {
          cy.getQuestion(question).getCheckbox(knownSource).clickLabel()

          cy.getQuestion(question).getCheckbox(knownSource).isChecked()
        })

        cy.getQuestion(question).getCheckbox(option).clickLabel()

        knownSources.forEach(knownSource => {
          cy.getQuestion(question).getCheckbox(knownSource).isNotChecked()
        })

        cy.checkAccessibility()
      })

      it(`selecting "${option}" then selecting other options deselects "${option}"`, () => {
        knownSources.forEach(knownSource => {
          cy.getQuestion(question).getCheckbox(option).clickLabel()

          cy.getQuestion(question).getCheckbox(option).isChecked()

          cy.getQuestion(question).getCheckbox(knownSource).clickLabel()

          cy.getQuestion(question).getCheckbox(knownSource).isChecked()

          cy.getQuestion(question).getCheckbox(option).isNotChecked()
        })
        cy.checkAccessibility()
      })
    })
  })
}
