describe('previous versions page', () => {
  it('lists all previous versions', () => {
    cy.createAssessmentWithVersions(5)
    cy.enterAssessment()
    cy.get('.offender-details__top [data-previous-versions-link]')
      .should('contain.text', 'View previous versions')
      .click()
    cy.assertStepUrlIs('previous-versions')
    cy.get('p')
      .contains(`Check versions of Sam's current assessment and plan. The links will open in a new tab.`)
      .should('be.visible')
      .and('have.length', 1)
    cy.get('.govuk-table').should('be.visible').and('have.length', 1)
    cy.get('thead th').should('have.length', 4)
    cy.get('thead th').eq(0).should('contain.text', 'Date')
    cy.get('thead th').eq(1).should('contain.text', 'Assessment')
    cy.get('thead th').eq(2).should('contain.text', 'Sentence Plan')
    cy.get('thead th').eq(3).should('contain.text', 'Status')

    cy.get('tbody tr').should('have.length', 4)
    cy.get('tbody tr').each((_el, index) => {
      const columns = `tbody tr:nth-child(${index + 1}) td`
      cy.get(columns).should('have.length', 4)

      const today = new Date()
      const expectedDate = new Date(today.setDate(today.getDate() - index - 1)).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      cy.get(columns).eq(0).should('contain.text', expectedDate)
      cy.get(columns).eq(1).find('a').should('contain.text', 'View').as('assessment-link')

      cy.get('@assessment-link').should('have.attr', 'target').and('equal', '_blank')
      cy.get('@assessment-link')
        .should('have.attr', 'href')
        .and('match', /\/form\/view-historic/)
      cy.get('@assessment-link').invoke('attr', 'target', '_self').click()
      cy.assertStepUrlIsNot('previous-versions')
      cy.go('back')
      cy.assertStepUrlIs('previous-versions')

      cy.get(columns).eq(2).find('a').should('contain.text', 'View').as('plan-link')
      cy.get('@plan-link').should('have.attr', 'target').and('equal', '_blank')
      cy.get('@plan-link')
        .should('have.attr', 'href')
        .and('match', /\/view-previous-version\//)
    })
  })

  it('displays no previous versions message when there are no versions', () => {
    cy.createAssessmentWithVersions(1)
    cy.enterAssessment()

    cy.get('.offender-details__top [data-previous-versions-link]')
      .should('contain.text', 'View previous versions')
      .click()
    cy.assertStepUrlIs('previous-versions')
    cy.get('.govuk-table').should('not.exist')
    cy.contains('p', `There are no previous versions of Sam's assessment yet.`).should('be.visible')
  })

  it('opens assessment and plan links in new tabs', () => {
    cy.createAssessmentWithVersions(2)
    cy.enterAssessment()
    cy.get('.offender-details__top [data-previous-versions-link]').click()

    cy.get('tbody tr:first-child td:nth-child(2) a').should('have.attr', 'target', '_blank')
    cy.get('tbody tr:first-child td:nth-child(3) a').should('have.attr', 'target', '_blank')
  })
})
