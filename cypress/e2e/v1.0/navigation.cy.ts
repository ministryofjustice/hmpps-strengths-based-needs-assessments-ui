describe('navigation', () => {
  describe('sidebar', () => {
    const sections = [
      {
        name: 'Accommodation',
        groups: ['Accommodation background', 'Summary', 'Analysis'],
      },
      {
        name: 'Employment and education',
        groups: ['Employment and education background', 'Summary', 'Analysis'],
      },
      {
        name: 'Finance',
        groups: ['Finance background', 'Summary', 'Analysis'],
      },
      {
        name: 'Drug use',
        groups: ['Drug use background', 'Summary', 'Analysis'],
      },
      {
        name: 'Alcohol use',
        groups: ['Alcohol use background', 'Summary', 'Analysis'],
      },
      {
        name: 'Health and wellbeing',
        groups: ['Health and wellbeing background', 'Summary', 'Analysis'],
      },
      {
        name: 'Personal relationships and community',
        groups: ['Personal relationships and community background', 'Summary', 'Analysis'],
      },
      {
        name: 'Thinking, behaviours and attitudes',
        groups: ['Thinking, behaviours and attitudes background', 'Summary', 'Analysis'],
      },
      {
        name: 'Offence analysis',
        groups: ['Offence analysis'],
      },
    ]

    before(() => {
      cy.createAssessment()
    })

    beforeEach(() => {
      cy.enterAssessment()
    })

    sections.forEach((section, index) => {
      it(`"${section.name}" section is in position ${index + 1} and can be navigated to`, () => {
        cy.visitSection(section.name)
        cy.get('.side-navigation li.moj-side-navigation__item').should(
          'have.length',
          section.groups.length + sections.length,
        )

        cy.get('.side-navigation li.moj-side-navigation__item').eq(index).should('contain.text', section.name)

        section.groups.forEach((group, groupIndex) => {
          cy.log(String(index + groupIndex))
          cy.get('.side-navigation li.moj-side-navigation__item')
            .eq(index + groupIndex + 1)
            .should('have.class', 'moj-side-navigation__item--sub-navigation')
            .should('contain.text', group)
        })

        cy.assertSectionIs(section.name)
      })
    })
  })
})
