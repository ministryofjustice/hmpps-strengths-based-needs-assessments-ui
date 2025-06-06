export const getSummary = (question: string) => {
  return cy
    .get('.govuk-summary-list__row > .govuk-summary-list__key > .summary__label')
    .contains(question)
    .should('be.visible')
    .and('have.length', 1)
    .parent()
    .parent()
}

export const getDrugSummaryCard = (drug: string, lastUsed: string) => {
  return cy
    .get('.drugs-summary__subheading')
    .contains(lastUsed)
    .should('be.visible')
    .and('have.length', 1)
    .parent()
    .find('.govuk-summary-card__title')
    .contains(drug)
    .should('be.visible')
    .and('have.length', 1)
    .parents('.govuk-summary-card')
}

export const hasCardItems = (subject: JQuery, count: number) => {
  cy.wrap(subject).find('.govuk-summary-list__key').should('be.visible').and('have.length', count)
  return cy.wrap(subject)
}

export const getCardItem = (subject: JQuery, key: string) => {
  return cy
    .wrap(subject)
    .find('.govuk-summary-list__key')
    .contains(key)
    .should('be.visible')
    .and('have.length', 1)
    .parent()
}

export const hasCardItemAnswers = (subject: JQuery, ...answers: string[]) => {
  answers.forEach(answer => {
    cy.wrap(subject).find('.govuk-summary-list__value').contains(answer).should('be.visible').and('have.length', 1)
  })
  cy.wrap(subject)
    .find('.govuk-summary-list__value > br')
    .should('have.length', answers.length - 1)
  return cy.wrap(subject)
}

export const getCollectionEntry = (subject: string, id: number) => {
  const ord = ['Zeroth', 'First', 'Second', 'Third']
  return cy.get(`form`).contains('.form-group', `${ord[id]} ${subject}`).should('be.visible').and('have.length', 1)
}

export const hasCollectionEntries = (subject: string, count: number) => {
  cy.get('form')
    .contains(subject)
    .closest('.form-group')
    .within(() => {
      cy.get('.form-group').should('have.length', count)
    })
}

export const clickChange = (subject: JQuery) => {
  cy.wrap(subject)
    .find('> .govuk-summary-list__actions > a, a.change-entry')
    .should('be.visible')
    .and('have.length', 1)
    .and('contain.text', 'Change')
    .click()
}

export const changeDrug = (subject: JQuery) => {
  cy.wrap(subject)
    .find('> .govuk-summary-card__title-wrapper a:contains(Change)')
    .should('be.visible')
    .and('have.length', 1)
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
      .find('> .summary__answer--secondary, > ul > li > .summary__answer--secondary')
      .contains(answer)
      .should('be.visible')
      .and('have.length', 1),
  )
  cy.wrap(subject)
    .find('> .summary__answer--secondary, > ul > li > .summary__answer--secondary')
    .should('have.length', answers.length)
  return cy.wrap(subject)
}

export const hasNoSecondaryAnswer = (subject: JQuery) => {
  cy.wrap(subject).children('.summary__answer--secondary').should('not.exist')
  return cy.wrap(subject)
}
