// command related to the overall page/step

export const assertQuestionCount = (count: number) => {
  cy.get('form > .form-group:visible').should('have.length', count)
}

export const sectionMarkedAsComplete = (section: string) => {
  cy.get('.moj-side-navigation__item > a > .section-label')
    .contains(section)
    .parent()
    .find('.section-complete')
    .should('be.visible')
}

export const sectionNotMarkedAsComplete = (section: string) => {
  cy.get('.moj-side-navigation__item > a > .section-label')
    .contains(section)
    .parent()
    .find('.section-complete')
    .should('not.exist')
}

export const currentSectionMarkedAsComplete = (section: string) => {
  cy.get('.section-heading__status > .govuk-tag').should('be.visible').and('contain.text', 'Complete')
  cy.sectionMarkedAsComplete(section)
}

export const currentSectionNotMarkedAsComplete = (section: string) => {
  cy.get('.section-heading__status > .govuk-tag')
    .should('be.visible')
    .and('have.class', 'govuk-tag--grey')
    .and('contain.text', 'Incomplete')
  cy.sectionNotMarkedAsComplete(section)
}

export const assessmentMarkedAsComplete = () => {
  cy.get('.form-header__actions > button').should('not.have.class', 'govuk-button--secondary')
}

export const assessmentNotMarkedAsComplete = () => {
  cy.get('.form-header__actions > button').should('have.class', 'govuk-button--secondary')
}

export const hasAutosaveEnabled = () => {
  cy.get('form[data-autosave-enabled]').should('have.length', 1)
}
