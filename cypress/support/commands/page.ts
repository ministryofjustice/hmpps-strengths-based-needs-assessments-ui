// command related to the overall page/step

// eslint-disable-next-line import/prefer-default-export
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
