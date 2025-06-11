describe('navigation', () => {
  describe('sidebar', () => {
    const sections = [
      'Accommodation',
      'Employment and education',
      'Finances',
      'Drug use',
      'Alcohol use',
      'Health and wellbeing',
      'Personal relationships and community',
      'Thinking, behaviours and attitudes',
      'Offence analysis',
    ]

    before(() => {
      cy.createAssessment()
      cy.enterAssessment().completePrivacyDeclaration()
      cy.hasFeedbackLink()
    })

    beforeEach(() => {
      cy.enterAssessment().completePrivacyDeclaration()
      cy.get('.side-navigation li.moj-side-navigation__item').should('have.length', sections.length)
    })

    sections.forEach((section, index) => {
      it(`"${section}" section is in position ${index + 1} and can be navigated to`, () => {
        cy.get('.side-navigation li.moj-side-navigation__item').eq(index).should('contain.text', section)

        cy.visitSection(section)
        cy.assertSectionIs(section)
      })
    })
  })
})
