const question = 'Who is the victim?'
const options = [
  'A stranger',
  'Criminal justice staff',
  "Sam's parent or step-parent",
  "Sam's partner",
  "Sam's ex-partner",
  "Sam's child or step-child",
  'Other family member',
  'Other',
]

const testCreate = (createUrl: string, editUrl: string, positionNumber: number) => {
  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.assertStepUrlIs(createUrl)

      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .get('.govuk-radios__input')
        .first()
        .should('have.attr', 'aria-required')

      cy.saveAndContinue()
      cy.getQuestion(question).hasValidationError('Select who the victim is')
      cy.checkAccessibility()

      cy.assertStepUrlIs(editUrl)
    })

    options.forEach(option => {
      it(`passes validation when "${option}" is selected`, () => {
        cy.assertStepUrlIs(createUrl)

        cy.getQuestion(question).getRadio(option).hasHint(null).clickLabel()
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

        cy.getQuestion(question).isQuestionNumber(positionNumber).getRadio(option).hasHint(null).clickLabel()
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
