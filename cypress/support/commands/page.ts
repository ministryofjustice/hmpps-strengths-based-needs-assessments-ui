// command related to the overall page/step

export const assertQuestionCount = (count: number) => {
  cy.get('form > .form-group:visible').should('have.length', count)
}

export const sectionMarkedAsComplete = (section: string) => {
  cy.get('.section-heading__status > .govuk-tag').should('be.visible').and('contain.text', 'Complete')

  cy.get('.moj-side-navigation__item > a > .section-label')
    .contains(section)
    .parent()
    .find('.section-complete')
    .should('be.visible')
}

export const sectionNotMarkedAsComplete = (section: string) => {
  cy.get('.section-heading__status > .govuk-tag').should('not.exist')

  cy.get('.moj-side-navigation__item > a > .section-label')
    .contains(section)
    .parent()
    .find('.section-complete')
    .should('not.exist')
}
