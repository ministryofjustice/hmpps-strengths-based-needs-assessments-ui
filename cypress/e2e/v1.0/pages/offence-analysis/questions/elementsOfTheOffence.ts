import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Did the current index offence(s) have any of the following elements?'
  describe(question, () => {
    const options = [
      'Arson',
      'Domestic abuse',
      'Excessive violence or sadistic violence',
      'Hatred of identifiable groups',
      'Physical damage to property',
      'Sexual element',
      'Victim targeted',
      'Violence, or threat of violence or coercion',
      'Weapon',
      null,
      'None',
    ]

    it(`displays and validates the question`, () => {
      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Select all that apply.').hasCheckboxes(options)

      cy.saveAndContinue()
      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select if the offence(s) had any of the elements')
      cy.checkAccessibility()
    })

    Array.of('Victim targeted').forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle('Give details')
          .hasHint(null)
          .hasLimit(config.characterLimit.default)

        cy.saveAndContinue()

        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasValidationError('Enter details')

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

    // Array.of('Weapon').forEach(option => {
    //   it(`conditional field is displayed for "${option}"`, () => {
    //     cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()
    //
    //     cy.getQuestion(question)
    //       .getCheckbox(option)
    //       .getNthConditionalQuestion(0)
    //       .hasHint('')
    //       .hasNoValidationError()
    //       .hasText('')
    //     cy.getQuestion(question)
    //       .getCheckbox(option)
    //       .getNthConditionalQuestion(1)
    //       .hasHint(null)
    //       .hasNoValidationError()
    //     cy.saveAndContinue()
    //
    //     cy.assertStepUrlIs(stepUrl)
    //     cy.getQuestion(question)
    //       .getCheckbox(option)
    //       .getNthConditionalQuestion(0)
    //       .hasValidationError(`Enter which other option they've misused`)
    //     cy.getQuestion(question)
    //       .getCheckbox(option)
    //       .getNthConditionalQuestion(1)
    //       .hasValidationError(`Select when they last used this drug`)
    //
    //     cy.checkAccessibility()
    //   })
    // })

    Array.of('Weapon').forEach(option => {
      it(`conditional field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getCheckbox(option).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasTitle('What was the weapon?')
          .enterText('This text will be over 200 characters long.This text will be over 200 characters long.This text will be over 200 characters long.This text will be over 200 characters long.This text will be over 200 characters long.')
          .hasHint(null)

        cy.saveAndContinue()

        cy.getQuestion(question)
          .hasNoValidationError()
          .getCheckbox(option)
          .getConditionalQuestion()
          .hasValidationError('Weapon must be 200 characters or les')

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

    Array.of(
      'Arson',
      'Domestic abuse',
      'Excessive violence or sadistic violence',
      'Hatred of identifiable groups',
      'Physical damage to property',
      'Sexual element',
      'Violence, or threat of violence or coercion',
      'None',
    ).forEach(option => {
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

    it('selecting "None" deselects other options', () => {
      options
        .filter(it => it && it !== 'None')
        .forEach(option => {
          cy.getQuestion(question).getCheckbox(option).clickLabel()

          cy.getQuestion(question).getCheckbox(option).isChecked()
        })

      cy.getQuestion(question).getCheckbox('None').clickLabel()

      options
        .filter(it => it && it !== 'None')
        .forEach(option => {
          cy.getQuestion(question).getCheckbox(option).isNotChecked()
        })

      cy.checkAccessibility()
    })

    it('selecting "None" then selecting other options deselects "None"', () => {
      options
        .filter(it => it && it !== 'None')
        .forEach(option => {
          cy.getQuestion(question).getCheckbox('None').clickLabel()

          cy.getQuestion(question).getCheckbox('None').isChecked()

          cy.getQuestion(question).getCheckbox(option).clickLabel()

          cy.getQuestion(question).getCheckbox(option).isChecked()

          cy.getQuestion(question).getCheckbox('None').isNotChecked()
        })
      cy.checkAccessibility()
    })
  })
}
