describe('navigation', () => {
  it('enter an assessment from OASys', () => {
    cy.visit('/form/oastub/start')
    cy.get('.splash-image').click()
    cy.url().should('contain', '/form/sbna-poc/accommodation')
  })

  describe('sidebar', () => {
    const sections = [
      'Accommodation',
      'Employment and education',
      'Finance',
      'Drug use',
      'Alcohol use',
      'Health and wellbeing',
      'Personal relationships and community',
      'Thinking, behaviours and attitudes',
    ]

    beforeEach(() => {
      cy.createAssessment()
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
