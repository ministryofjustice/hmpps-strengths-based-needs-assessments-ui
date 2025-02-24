// eslint-disable-next-line import/prefer-default-export
export const testPractitionerAnalysis = (sectionName: string, origin: string, destination: string) => {
  describe(`Destination: ${destination}`, () => {
    it(`routes to ${destination}`, () => {
      cy.visitStep(origin)

      cy.get('#tab_practitioner-analysis').click()
      cy.get('#practitioner-analysis').should('be.visible')

      Array.of(
        `Are there any strengths or protective factors related to Sam's ${sectionName.toLowerCase()}?`,
        `Is Sam's ${sectionName.toLowerCase()} linked to risk of serious harm?`,
        `Is Sam's ${sectionName.toLowerCase()} linked to risk of reoffending?`,
      ).forEach(question => {
        cy.getQuestion(question).getRadio('No').clickLabel()
      })

      cy.assertResumeUrlIs(sectionName, origin)
      cy.get('#tab_practitioner-analysis').click()
      cy.get('#practitioner-analysis').should('be.visible')

      cy.markAsComplete()

      cy.assertStepUrlIs(destination)
      cy.get('#practitioner-analysis').should('be.visible')
      cy.assertResumeUrlIs(sectionName, destination)
      cy.currentSectionMarkedAsComplete(sectionName)

      // Check editing the practitioner analysis removes the complete status
      cy.get('#tab_summary').click()
      cy.get('#summary').should('be.visible')

      cy.get('#summary .govuk-summary-list__actions .govuk-link').filter(':contains(Change)').last().click()

      cy.saveAndContinue()

      cy.assertStepUrlIs(origin)
      cy.currentSectionNotMarkedAsComplete(sectionName)
      cy.get('#tab_practitioner-analysis').click()
      cy.get('#practitioner-analysis').should('be.visible')
      cy.markAsComplete()

      cy.assertStepUrlIs(destination)
      cy.get('#tab_practitioner-analysis').click()
      cy.get('#practitioner-analysis').should('be.visible')
      cy.currentSectionMarkedAsComplete(sectionName)

      cy.get('#tab_summary').click()
      cy.get('#summary').should('be.visible')

      // Check editing questions in the section removes the complete status
      cy.get('#summary .govuk-summary-list__actions .govuk-link').filter(':contains(Change)').first().click()

      cy.saveAndContinue()
      cy.visitStep(destination)
      cy.currentSectionNotMarkedAsComplete(sectionName)
    })
  })
}
