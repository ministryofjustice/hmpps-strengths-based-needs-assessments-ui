describe('test', () => {
  before(() => {
    cy.createAssessment()
    cy.visitSection('Employment and education')
  })

  it('test1', () => {
    cy.getQuestion(`What is Paul's current employment status?`).getRadio('Employed').selectOption()

    cy.saveAndContinue()
  })
})
