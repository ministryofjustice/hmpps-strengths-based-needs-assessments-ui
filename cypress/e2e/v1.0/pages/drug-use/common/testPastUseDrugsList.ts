export default (usedDrugs: string[], stepUrl: string) => {
  it('pulls the list of drugs used more than 6 months ago', () => {
    const previouslyUsed = usedDrugs.join(', ')

    cy.get('form > .govuk-inset-text')
      .contains(`Sam used ${previouslyUsed} more than 6 months ago.`)
      .should('have.length', 1)
      .and('be.visible')

    const usedRecently = usedDrugs.pop()

    cy.visitStep('/add-drugs')

    if (usedRecently === 'Cake') {
      cy.getQuestion('Which drugs has Sam misused?')
        .getCheckbox('Other')
        .getNthConditionalQuestion(1)
        .getRadio('Used in the last 6 months')
        .clickLabel()
    } else {
      cy.getQuestion('Which drugs has Sam misused?')
        .getCheckbox(usedRecently)
        .getConditionalQuestion()
        .getRadio('Used in the last 6 months')
        .clickLabel()
    }

    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)

    const nowUsed = usedDrugs.join(', ')

    cy.get('form > .govuk-inset-text')
      .contains(`Sam used ${nowUsed} more than 6 months ago.`)
      .should('have.length', 1)
      .and('be.visible')

    expect(previouslyUsed).not.to.eq(nowUsed)
  })
}
