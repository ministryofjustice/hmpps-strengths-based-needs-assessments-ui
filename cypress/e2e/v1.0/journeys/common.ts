// eslint-disable-next-line import/prefer-default-export
export const testPractitionerAnalysis = (
  sectionName: string,
  origin: string,
  destinationSubsection: string,
  destination: string,
  conditionalFlag?: boolean,
) => {
  describe(`Destination: ${destination}`, () => {
    it(`routes to ${destination}`, () => {
      cy.visitStep(origin)

      cy.get('a').contains('Continue to practitioner analysis').click()

      const sectionNameLowerCase = sectionName.toLowerCase()
      const subjectPrefix = sectionNameLowerCase.endsWith('s') ? 'Are' : 'Is'

      Array.of(
        `Are there any strengths or protective factors related to Sam's ${sectionName.toLowerCase()}?`,
        `${subjectPrefix} Sam's ${sectionNameLowerCase} linked to risk of serious harm?`,
        `${subjectPrefix} Sam's ${sectionNameLowerCase} linked to risk of reoffending?`,
      ).forEach(question => {
        cy.getQuestion(question).getRadio('No').clickLabel()
      })

      if (sectionName === 'Drug use' && conditionalFlag) {
        cy.getQuestion('Does Sam seem motivated to stop or reduce their drug use?').getRadio('Unknown').clickLabel()
      }

      cy.markAsComplete()

      cy.assertStepUrlIs(destination)
      cy.assertResumeUrlIs(sectionName, destinationSubsection, destination)
      cy.currentSectionMarkedAsComplete(sectionName)

      // Check editing a background question removes the complete status
      cy.visitStep(origin)
      cy.get('.govuk-summary-list__actions .govuk-link').filter(':contains(Change)').last().click()
      cy.saveAndContinue()
      cy.assertStepUrlIs(origin)

      cy.currentSectionNotMarkedAsComplete(sectionName)

      // return to PA and mark as complete
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
