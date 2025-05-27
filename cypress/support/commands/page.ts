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
  cy.get('.form-header__actions > .govuk-button').should('not.have.class', 'govuk-button--secondary')
}

export const assessmentNotMarkedAsComplete = () => {
  cy.get('.form-header__actions > .govuk-button').should('have.class', 'govuk-button--secondary')
}

export const hasAutosaveEnabled = () => {
  cy.get('form[data-autosave-enabled]').should('have.length', 1)
}

export const hasFeedbackLink = () => {
  const stubFeedbackUrl = 'http://localhost:9092/'

  cy.get('.govuk-phase-banner__text > .govuk-link').as('feedbackLink')

  cy.get('@feedbackLink')
    .should('have.attr', 'target').and('equal', '_blank')

  cy.get('@feedbackLink')
    .invoke('attr', 'target', '_self')
    .click()

  cy.url().should('equal', stubFeedbackUrl)

  cy.go('back')
}
