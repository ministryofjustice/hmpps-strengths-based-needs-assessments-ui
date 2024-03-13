describe('sidebar navigation', () => {
  before(() => {
    cy.createAssessment()
  })

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

  it('number of sections is as expected', () => {
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
