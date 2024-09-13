const question = "What is the victim's sex?"
const options = ['Male', 'Female', 'Intersex', 'Unknown']

const testCreate = (createUrl: string, editUrl: string, positionNumber: number) => {
  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.assertStepUrlIs(createUrl)

      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.getQuestion(question).hasValidationError('Select sex')
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
