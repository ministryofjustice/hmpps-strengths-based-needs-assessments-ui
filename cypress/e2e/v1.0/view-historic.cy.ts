describe('view-historic mode from previous versions page', () => {
  it('opens previous version in read-only view-historic mode', () => {
    cy.createAssessmentWithVersions(3)
    cy.enterAssessment()
    cy.get('.offender-details__top [data-previous-versions-link]')
      .should('contain.text', 'View previous versions')
      .click()
    cy.get('tbody tr').should('have.length', 2)
    cy.get('tbody tr').eq(0).find('td').eq(1).find('a').first().as('view-link')
    cy.get('@view-link').invoke('attr', 'target', '_self').click()

    const today = new Date()
    const expectedDate = new Date(today.setDate(today.getDate() - 1)).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    cy.get('.moj-alert--information').contains(`This version is from ${expectedDate}`)
    cy.contains('.govuk-button', 'Return to OASys').should('not.exist')
    cy.get('.offender-details__top [data-previous-versions-link]').should('not.exist')
  })
})
