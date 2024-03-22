// eslint-disable-next-line import/prefer-default-export
export const testPractitionerAnalysis = (sectionName: string, origin: string, destination: string) => {
  describe(`Destination: ${destination}`, () => {
    it(`routes to ${destination}`, () => {
      cy.visitStep(origin)

      cy.get('#tab_practitioner-analysis').click()
      cy.get('#practitioner-analysis').should('be.visible')

      Array.of(
        'Are there any patterns of behaviours related to this area?',
        'Are there any strengths or protective factors related to this area?',
        'Is this an area linked to risk of serious harm?',
        'Is this an area linked to risk of reoffending?',
        'Is this an area of need which is not related to risk?',
      ).forEach(question => {
        cy.getQuestion(question).getRadio('No').clickLabel()
      })

      cy.markAsComplete()
      cy.assertStepUrlIs(destination)

      cy.get('#practitioner-analysis').should('be.visible')

      cy.sectionMarkedAsComplete(sectionName)
    })
  })
}
