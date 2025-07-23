const question = "What is the victim's ethnicity?"
const options = [
  'White - English, Welsh, Scottish, Northern Irish or British',
  'White - Irish',
  'White - Gypsy or Irish Traveller',
  'White - Roma',
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
  'Unknown',
]

const testCreate = (createUrl: string, editUrl: string, positionNumber: number) => {
  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.assertStepUrlIs(createUrl)

      cy.getQuestion(question).isQuestionNumber(positionNumber)
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .get('select')
        .first()
        .should('have.attr', 'aria-required')

      cy.saveAndContinue()
      cy.getQuestion(question).hasValidationError("Select the victim's ethnicity")
      cy.checkAccessibility()

      cy.assertStepUrlIs(editUrl)
    })

    options.forEach(option => {
      it(`passes validation when "${option}" is selected`, () => {
        cy.assertStepUrlIs(createUrl)
        cy.getQuestion(question).selectOption('White - English, Welsh, Scottish, Northern Irish or British')
        cy.saveAndContinue()

        cy.assertStepUrlIs(editUrl)

        cy.getQuestion(question).hasNoValidationError()
      })
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
          .selectOption('White - English, Welsh, Scottish, Northern Irish or British')
        cy.saveAndContinue()

        cy.assertStepUrlIs(collectionSummaryUrl)
      })
    })
  })
}

export default {
  testCreate,
  testEdit,
}
