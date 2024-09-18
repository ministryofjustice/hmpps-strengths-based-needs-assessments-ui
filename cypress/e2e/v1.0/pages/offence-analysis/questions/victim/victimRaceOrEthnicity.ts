const question = "What is the victim's race or ethnicity?"
const options = [
  'White - English, Welsh, Scottish, Northern Irish or British',
  'White - Irish',
  'White - Gypsy or Irish Traveller',
  'White - Any other White background',
  'Mixed - White and Black Caribbean',
  'Mixed - White and Black African',
  'Mixed - White and Asian',
  'Mixed - Any other mixed or multiple ethnic background background',
  'Asian or Asian British - Indian',
  'Asian or Asian British - Pakistani',
  'Asian or Asian British - Bangladeshi',
  'Asian or Asian British - Chinese',
  'Asian or Asian British - Any other Asian background',
  'Black or Black British - Caribbean',
  'Black or Black British - African',
  'Black or Black British - Any other Black background',
  'Any other ethnic group',
  'Not stated',
]

const testCreate = (createUrl: string, editUrl: string, positionNumber: number) => {
  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.assertStepUrlIs(createUrl)

      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Type in a race or ethnicity and a list of options will appear.')
        .enterText('')
      cy.saveAndContinue()
      cy.getQuestion(question).hasValidationError('Select race or ethnicity')
      cy.checkAccessibility()

      cy.assertStepUrlIs(editUrl)
    })

    options.forEach(option => {
      it(`passes validation when "${option}" is selected`, () => {
        cy.assertStepUrlIs(createUrl)

        cy.getQuestion(question).enterText(`${option}{enter}`)
        cy.saveAndContinue()

        cy.assertStepUrlIs(editUrl)

        cy.getQuestion(question).hasNoValidationError()
      })
    })

    it(`supports autocomplete of partial term`, () => {
      cy.getQuestion(question).enterText('Welsh{enter}')
      cy.saveAndContinue()
      cy.getQuestion(question)
        .hasNoValidationError()
        .hasText('White - English, Welsh, Scottish, Northern Irish or British')
    })
  })
}

const testEdit = (editUrl: string, collectionSummaryUrl: string, positionNumber: number) => {
  describe(question, () => {
    options.forEach(option => {
      it(`passes validation when "${option}" is selected`, () => {
        cy.assertStepUrlIs(editUrl)

        cy.getQuestion(question)
          .isQuestionNumber(positionNumber)
          .hasHint('Type in a race or ethnicity and a list of options will appear.')
          .enterText(`${option}{enter}`)
        cy.saveAndContinue()

        cy.assertStepUrlIs(collectionSummaryUrl)
      })

      it(`supports autocomplete of partial term`, () => {
        cy.getQuestion(question).enterText('Welsh{enter}')
        cy.saveAndContinue()

        cy.assertStepUrlIs(collectionSummaryUrl)

        cy.getSummary("What is the victim's race or ethnicity?").getAnswer(
          'White - English, Welsh, Scottish, Northern Irish or British',
        )
      })
    })
  })
}

export default {
  testCreate,
  testEdit,
}
