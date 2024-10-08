import linkedToRiskOfSeriousHarm from './questions/linkedToRiskOfSeriousHarm'
import linkedToRiskOfReoffending from './questions/linkedToRiskOfReoffending'
import strengthsOrProtectiveFactors from './questions/strengthsOrProtectiveFactors'

export default (summaryPage: string, analysisCompletePage: string, sectionName: string) => {
  describe(`${summaryPage} - Practitioner Analysis`, () => {
    it('can navigate to the Practitioner Analysis tab', () => {
      cy.get('.govuk-tabs__list-item--selected #tab_summary').should('be.visible')
      cy.get('#summary').should('be.visible')

      cy.get('.govuk-tabs__list-item--selected #tab_practitioner-analysis').should('not.exist')
      cy.get('#practitioner-analysis').should('exist').and('not.be.visible')

      cy.get('#tab_practitioner-analysis').click()

      cy.get('.govuk-tabs__list-item--selected #tab_summary').should('not.exist')
      cy.get('#summary').should('exist').and('not.be.visible')

      cy.get('.govuk-tabs__list-item--selected #tab_practitioner-analysis').should('be.visible')
      cy.get('#practitioner-analysis').should('be.visible')

      cy.checkAccessibility()
    })

    describe('questions are displayed and validated', () => {
      const questions = [strengthsOrProtectiveFactors, linkedToRiskOfSeriousHarm, linkedToRiskOfReoffending]

      beforeEach(() => {
        cy.get('#tab_practitioner-analysis').click()
        cy.get('#practitioner-analysis').should('be.visible')
        cy.assertQuestionCount(questions.length)
      })

      questions.forEach((questionTest, index) => {
        // skip the "Give details" questions, as they are tested within the main question tests
        questionTest(summaryPage, analysisCompletePage, index + 1, sectionName)
      })
    })
  })
}
