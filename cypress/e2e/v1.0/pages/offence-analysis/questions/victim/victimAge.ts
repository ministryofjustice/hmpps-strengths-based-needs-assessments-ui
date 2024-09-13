const question = "What is the victim's approximate age?"
const options = [
  '0 to 4 years',
  '5 to 11 years',
  '12 to 15 years',
  '16 to 17 years',
  '18 to 20 years',
  '21 to 25 years',
  '26 to 49 years',
  '50 to 64 years',
  '65 years and over',
]

const testCreate = (createUrl: string, editUrl: string, positionNumber: number) => {
  describe(question, () => {
    it(`displays and validates the question`, () => {
      cy.assertStepUrlIs(createUrl)

      cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint(null).hasRadios(options)
      cy.saveAndContinue()
      cy.getQuestion(question).hasValidationError('Select approximate age')
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
