export const getSummary = (question: string) => {
  return cy
    .get('.govuk-summary-list__row > .govuk-summary-list__key > .summary__label')
    .contains(question)
    .should('be.visible')
    .and('have.length', 1)
    .parent()
    .parent()
}

export const getDrugSummary = (drug: string) => {
  return cy
    .get(
      '#summary > form > .govuk-summary-list > .govuk-summary-list__row > .govuk-summary-list__key > .summary__label',
    )
    .contains('Which drugs has Sam used?')
    .should('be.visible')
    .and('have.length', 1)
    .parent()
    .siblings()
    .last()
    .find(`tbody th:contains(${drug})`)
    .parents('tbody')
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

export const hasFrequency = (subject: JQuery, answer: string) => {
  cy.wrap(subject)
    .find('> tr:nth-child(1) > td:nth-child(2)')
    .contains(answer)
    .should('be.visible')
    .and('have.length', 1)
  return cy.wrap(subject)
}

export const hasPreviousUse = (subject: JQuery, answer: string) => {
  cy.wrap(subject)
    .find('> tr:nth-child(1) > td:nth-child(3)')
    .contains(answer)
    .should('be.visible')
    .and('have.length', 1)
  return cy.wrap(subject)
}

export const hasReceivingTreatmentCurrently = (subject: JQuery, answer: string) => {
  cy.wrap(subject)
    .find('th:contains(Receiving treatment)')
    .next()
    .contains(answer)
    .should('be.visible')
    .and('have.length', 1)
  return cy.wrap(subject)
}

export const hasReceivingTreatmentPreviously = (subject: JQuery, answer: string) => {
  cy.wrap(subject)
    .find('th:contains(Receiving treatment)')
    .next()
    .next()
    .contains(answer)
    .should('be.visible')
    .and('have.length', 1)
  return cy.wrap(subject)
}

export const hasInjectedCurrently = (subject: JQuery, answer: string) => {
  cy.wrap(subject).find('th:contains(Injected)').next().contains(answer).should('be.visible').and('have.length', 1)
  return cy.wrap(subject)
}

export const hasInjectedPreviously = (subject: JQuery, answer: string) => {
  cy.wrap(subject)
    .find('th:contains(Injected)')
    .next()
    .next()
    .contains(answer)
    .should('be.visible')
    .and('have.length', 1)
  return cy.wrap(subject)
}

export const clickChange = (subject: JQuery) => {
  cy.wrap(subject)
    .find('> .govuk-summary-list__actions > a, a.change-entry')
    .should('be.visible')
    .and('have.length', 1)
    .and('contain.text', 'Change')
    .click()
}

export const changeDrugUsage = (subject: JQuery) => {
  cy.wrap(subject).find('a:contains(Change)').should('be.visible').and('have.length', 1).click()
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
