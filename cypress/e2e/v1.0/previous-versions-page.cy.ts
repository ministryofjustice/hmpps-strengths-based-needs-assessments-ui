describe('previous versions page', () => {
  before(() => {
    cy.createAssessmentWithVersions(5)
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  it('lists all previous versions', () => {
    cy.get('.offender-details__bottom [data-previous-versions-link]')
      .should('contain.text', 'View Previous Versions')
      .click()
    cy.assertStepUrlIs('previous-versions')
    cy.get('p')
      .contains(`Check versions of Sam's current assessment. The links will open in a new tab.`)
      .should('be.visible')
      .and('have.length', 1)
    cy.get('.govuk-table').should('be.visible').and('have.length', 1)
    cy.get('thead th').should('have.length', 2)
    cy.get('thead th').eq(0).should('contain.text', 'Date')
    cy.get('thead th').eq(1).should('contain.text', 'Assessment')

    cy.get('tbody tr').should('have.length', 5)
    cy.get('tbody tr').each((_el, index) => {
      const columns = `tbody tr:nth-child(${index + 1}) td`
      cy.get(columns).should('have.length', 2)

      const today = new Date()
      const expectedDate = new Date(today.setDate(today.getDate() - index)).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      cy.get(columns).eq(0).should('contain.text', expectedDate)
      cy.get(columns).eq(1).find('a').should('contain.text', 'View').as('view-link')

      cy.get('@view-link').should('have.attr', 'target').and('equal', '_blank')
      cy.get('@view-link').invoke('attr', 'target', '_self').click()
      cy.assertStepUrlIsNot('previous-versions')

      cy.get('.moj-alert--information').contains(`This version is from ${expectedDate}`)

      cy.go('back')
      cy.assertStepUrlIs('previous-versions')
    })
  })
})
