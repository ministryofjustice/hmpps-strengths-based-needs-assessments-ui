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

    const subSections = ['Questions', 'Summary & Analysis']

    before(() => {
      cy.createAssessment()
    })

    beforeEach(() => {
      cy.enterAssessment()
      cy.get('.side-navigation li.moj-side-navigation__item').should(
        'have.length',
        [...sections, ...subSections].length,
      )
    })

    sections.forEach((section, index) => {
      it(`"${section}" section is in position ${index + 1} and can be navigated to`, () => {
        cy.visitSection(section)
        cy.get('.side-navigation li.moj-side-navigation__item').eq(index).should('contain.text', section)

        cy.assertSectionIs(section)
      })
    })
  })
})
