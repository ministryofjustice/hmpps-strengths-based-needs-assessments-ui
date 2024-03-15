export const getSummary = (question: string) => {
  return cy
    .get('#summary > .govuk-summary-list > .govuk-summary-list__row > .govuk-summary-list__key > .summary__label')
    .contains(question)
    .should('be.visible')
    .and('have.length', 1)
    .parent()
    .parent()
}

export const clickChange = (subject: JQuery) => {
  cy.wrap(subject)
    .find('> .govuk-summary-list__actions > a')
    .should('be.visible')
    .and('have.length', 1)
    .and('contain.text', 'Change')
    .click()
}

export const getAnswer = (subject: JQuery, answer: string) => {
  return cy
    .wrap(subject)
    .find('> .govuk-summary-list__value > ul > li > .summary__answer')
    .contains(answer)
    .should('be.visible')
    .and('have.length', 1)
    .parent()
}

export const hasSecondaryAnswer = (subject: JQuery, ...answers: string[]) => {
  answers.forEach(answer =>
    cy
      .wrap(subject)
      .children('.summary__answer--secondary')
      .contains(answer)
      .should('be.visible')
      .and('have.length', 1),
  )
  cy.wrap(subject).children('.summary__answer--secondary').should('have.length', answers.length)
  return cy.wrap(subject)
}

export const hasNoSecondaryAnswer = (subject: JQuery) => {
  cy.wrap(subject).children('.summary__answer--secondary').should('not.exist')
  return cy.wrap(subject)
}
